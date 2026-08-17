import { createHash, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import {
  lstat,
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { promisify } from 'node:util'

import {
  DEFAULT_WORKFLOW,
  createDefaultBoard,
  normalizeBoard,
  normalizeWorkflow,
} from './board.js'

const execFileAsync = promisify(execFile)
const GIT_TIMEOUT_MS = 30_000
const GIT_MAX_BUFFER = 1024 * 1024
const LOCK_WAIT_MS = 30_000
const LOCK_RETRY_MS = 50
const LOCK_STALE_MS = 5 * 60_000

export class RepositoryError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.status = status
  }
}

export class StaleRevisionError extends RepositoryError {
  constructor() {
    super('The board changed since it was loaded. Refresh and try again.', 409)
  }
}

function requireObject(value, message) {
  if (value === undefined) return {}
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(message)
  }
  return value
}

function requireString(value, field, fallback) {
  const candidate = value === undefined ? fallback : value
  if (typeof candidate !== 'string' || candidate.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`)
  }
  return candidate.trim()
}

function requireBoolean(value, field, fallback) {
  if (value === undefined) return fallback
  if (typeof value !== 'boolean') throw new TypeError(`${field} must be a boolean.`)
  return value
}

function requireInteger(value, field, fallback, minimum) {
  const candidate = value === undefined ? fallback : value
  if (!Number.isSafeInteger(candidate) || candidate < minimum) {
    throw new TypeError(`${field} must be an integer of at least ${minimum}.`)
  }
  return candidate
}

function expandHome(value) {
  if (value === '~') return os.homedir()
  if (value.startsWith(`~${path.sep}`)) {
    return path.join(os.homedir(), value.slice(2))
  }
  return value
}

function validateGitToken(value, field) {
  if (value.startsWith('-') || /[\0\r\n]/u.test(value)) {
    throw new TypeError(`${field} contains unsupported characters.`)
  }
  return value
}

function normalizeDataDirectory(value) {
  const normalized = requireString(value, 'dataDirectory', 'kanban')
  if (
    path.isAbsolute(normalized) ||
    normalized === '.' ||
    normalized === '..' ||
    normalized.split(/[\\/]/u).some((segment) => segment === '..')
  ) {
    throw new TypeError('dataDirectory must stay inside the Git repository.')
  }
  return normalized
}

export function normalizeConfig(input) {
  const config = requireObject(input, 'The Kanban configuration must be an object.')
  const repositoryPath = requireString(
    config.repositoryPath,
    'repositoryPath',
  )
  const workflow = normalizeWorkflow(config.columns ?? DEFAULT_WORKFLOW)

  return {
    repositoryPath: path.resolve(expandHome(repositoryPath)),
    dataDirectory: normalizeDataDirectory(config.dataDirectory),
    branch: validateGitToken(
      requireString(config.branch, 'branch', 'main'),
      'branch',
    ),
    remote: validateGitToken(
      requireString(config.remote, 'remote', 'origin'),
      'remote',
    ),
    autoPull: requireBoolean(config.autoPull, 'autoPull', true),
    autoPush: requireBoolean(config.autoPush, 'autoPush', true),
    initializeRepository: requireBoolean(
      config.initializeRepository,
      'initializeRepository',
      true,
    ),
    pollIntervalMs: requireInteger(
      config.pollIntervalMs,
      'pollIntervalMs',
      3_000,
      1_000,
    ),
    pullIntervalMs: requireInteger(
      config.pullIntervalMs,
      'pullIntervalMs',
      5_000,
      1_000,
    ),
    gitAuthorName: requireString(
      config.gitAuthorName,
      'gitAuthorName',
      'DSH Kanban',
    ),
    gitAuthorEmail: requireString(
      config.gitAuthorEmail,
      'gitAuthorEmail',
      'kanban@localhost',
    ),
    columns: workflow,
  }
}

export const Config = {
  '~standard': {
    version: 1,
    vendor: '@dddrop/dsh-plugin-kanban',
    validate(value) {
      try {
        return { value: normalizeConfig(value) }
      } catch (error) {
        return {
          issues: [
            {
              message: error instanceof Error ? error.message : String(error),
            },
          ],
        }
      }
    },
  },
}

async function pathStatus(filePath) {
  try {
    return await lstat(filePath)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

function canonicalBoard(board) {
  return `${JSON.stringify(board, null, 2)}\n`
}

function revisionOf(source) {
  return createHash('sha256').update(source).digest('hex')
}

function sanitizeGitFailure(operation) {
  return new RepositoryError(`Git ${operation} failed for the Kanban data repository.`)
}

export class GitBoardRepository {
  constructor(config) {
    this.config = normalizeConfig(config)
    this.root = this.config.repositoryPath
    this.relativeBoardPath = path.join(this.config.dataDirectory, 'board.json')
    this.boardPath = path.join(this.root, this.relativeBoardPath)
    this.gitDirectory = undefined
    this.lockPath = undefined
    this.ready = undefined
    this.queue = Promise.resolve()
    this.backgroundSync = undefined
    this.cachedSnapshot = undefined
    this.lastSyncError = undefined
    this.lastRemoteSyncAt = 0
  }

  enqueue(operation) {
    const execute = async () => {
      await this.ensureReady()
      return this.withRepositoryLock(operation)
    }
    const pending = this.queue.then(execute, execute)
    this.queue = pending.catch(() => {})
    return pending
  }

  async acquireRepositoryLock() {
    const startedAt = Date.now()
    const token = `${process.pid}:${randomUUID()}`

    while (Date.now() - startedAt < LOCK_WAIT_MS) {
      try {
        const handle = await open(this.lockPath, 'wx')
        await handle.writeFile(`${token}\n`, 'utf8')
        return async () => {
          await handle.close()
          const currentToken = await readFile(this.lockPath, 'utf8').catch(
            () => '',
          )
          if (currentToken.trim() === token) {
            await rm(this.lockPath, { force: true })
          }
        }
      } catch (error) {
        if (error?.code !== 'EEXIST') throw error

        try {
          const lockStatus = await stat(this.lockPath)
          if (Date.now() - lockStatus.mtimeMs > LOCK_STALE_MS) {
            await rm(this.lockPath, { force: true })
            continue
          }
        } catch (statusError) {
          if (statusError?.code === 'ENOENT') continue
          throw statusError
        }
        await delay(LOCK_RETRY_MS)
      }
    }

    throw new RepositoryError(
      'The Kanban data repository is busy. Try again shortly.',
      503,
    )
  }

  async withRepositoryLock(operation) {
    const release = await this.acquireRepositoryLock()
    try {
      return await operation()
    } finally {
      await release()
    }
  }

  async runGitAt(
    directory,
    argumentsList,
    { allowFailure = false, operation = 'operation' } = {},
  ) {
    try {
      const result = await execFileAsync(
        'git',
        ['-c', 'core.hooksPath=/dev/null', '-C', directory, ...argumentsList],
        {
          encoding: 'utf8',
          timeout: GIT_TIMEOUT_MS,
          maxBuffer: GIT_MAX_BUFFER,
          windowsHide: true,
        },
      )
      return { code: 0, stdout: result.stdout.trim(), stderr: result.stderr.trim() }
    } catch (error) {
      if (allowFailure) {
        return {
          code: Number.isInteger(error?.code) ? error.code : 1,
          stdout: typeof error?.stdout === 'string' ? error.stdout.trim() : '',
          stderr: typeof error?.stderr === 'string' ? error.stderr.trim() : '',
        }
      }
      throw sanitizeGitFailure(operation)
    }
  }

  async runGit(argumentsList, options) {
    return this.runGitAt(this.root, argumentsList, options)
  }

  async initialize() {
    await mkdir(this.root, { recursive: true })
    const rootStatus = await lstat(this.root)
    if (rootStatus.isSymbolicLink()) {
      throw new RepositoryError('The Kanban repository path must not be a symlink.')
    }

    const probe = await this.runGit(
      ['rev-parse', '--show-toplevel'],
      { allowFailure: true, operation: 'repository check' },
    )
    if (probe.code !== 0) {
      if (!this.config.initializeRepository) {
        throw new RepositoryError('The configured Kanban path is not a Git repository.')
      }
      await this.runGit(['init', '-b', this.config.branch], {
        operation: 'repository initialization',
      })
    }

    const topLevel = await this.runGit(['rev-parse', '--show-toplevel'], {
      operation: 'repository check',
    })
    if ((await realpath(topLevel.stdout)) !== (await realpath(this.root))) {
      throw new RepositoryError(
        'The Kanban repository path must be the root of an independent Git repository.',
      )
    }
    const gitDirectory = await this.runGit(
      ['rev-parse', '--absolute-git-dir'],
      { operation: 'Git directory check' },
    )
    this.gitDirectory = gitDirectory.stdout
    this.lockPath = path.join(this.gitDirectory, 'dddrop-kanban.lock')

    const branch = await this.runGit(['symbolic-ref', '--short', 'HEAD'], {
      operation: 'branch check',
    })
    if (branch.stdout !== this.config.branch) {
      throw new RepositoryError(
        `The Kanban repository must be checked out on ${this.config.branch}.`,
      )
    }

    if (this.config.autoPull || this.config.autoPush) {
      const remote = await this.runGit(
        ['remote', 'get-url', this.config.remote],
        { allowFailure: true, operation: 'remote check' },
      )
      if (remote.code !== 0) {
        throw new RepositoryError(
          `The Kanban repository does not define the ${this.config.remote} remote.`,
        )
      }
    }

    const directoryPath = path.dirname(this.boardPath)
    const directoryStatus = await pathStatus(directoryPath)
    if (directoryStatus?.isSymbolicLink()) {
      throw new RepositoryError('The Kanban data directory must not be a symlink.')
    }
    await mkdir(directoryPath, { recursive: true })

    const boardStatus = await pathStatus(this.boardPath)
    if (boardStatus?.isSymbolicLink()) {
      throw new RepositoryError('The Kanban board file must not be a symlink.')
    }
  }

  async ensureReady() {
    this.ready ??= this.initialize()
    return this.ready
  }

  async assertCleanBoardPath() {
    const status = await this.runGit(
      ['status', '--porcelain=v1', '--untracked-files=all', '--', this.relativeBoardPath],
      { operation: 'status check' },
    )
    if (status.stdout) {
      throw new RepositoryError(
        'The Kanban board file has uncommitted changes. Commit or discard them before continuing.',
        409,
      )
    }

    const staged = await this.runGit(['diff', '--cached', '--name-only'], {
      operation: 'index check',
    })
    if (staged.stdout) {
      throw new RepositoryError(
        'The Git index contains staged changes. Commit or unstage them before using Kanban.',
        409,
      )
    }
  }

  async pull() {
    if (!this.config.autoPull) return

    const result = await this.runGit(
      ['pull', '--ff-only', this.config.remote, this.config.branch],
      { allowFailure: true, operation: 'pull' },
    )
    if (result.code === 0) return
    if (/couldn't find remote ref|no such ref was fetched/iu.test(result.stderr)) {
      return
    }
    throw sanitizeGitFailure('pull')
  }

  async push({ afterCommit = false } = {}) {
    if (!this.config.autoPush) return
    const head = await this.runGit(['rev-parse', '--verify', 'HEAD'], {
      allowFailure: true,
      operation: 'HEAD check',
    })
    if (head.code !== 0) return

    const pushed = await this.runGit(
      ['push', this.config.remote, `HEAD:${this.config.branch}`],
      { allowFailure: true, operation: 'push' },
    )
    if (pushed.code === 0) return

    if (afterCommit) {
      throw new RepositoryError(
        'The board was committed locally, but Git push failed. Kanban will retry synchronization; manual branch reconciliation may be required.',
        503,
      )
    }
    throw sanitizeGitFailure('push')
  }

  async pushPendingCommits() {
    if (!this.config.autoPush) return
    const remoteRef = `refs/remotes/${this.config.remote}/${this.config.branch}`
    const remoteTip = await this.runGit(['rev-parse', '--verify', remoteRef], {
      allowFailure: true,
      operation: 'remote revision check',
    })
    if (remoteTip.code !== 0) {
      await this.push()
      return
    }

    const ahead = await this.runGit(
      ['rev-list', '--count', `${remoteRef}..HEAD`],
      { operation: 'outbound revision check' },
    )
    if (ahead.stdout !== '0') await this.push()
  }

  async syncRemote({ force = false } = {}) {
    const now = Date.now()
    if (!force && now - this.lastRemoteSyncAt < this.config.pullIntervalMs) return
    await this.assertCleanBoardPath()
    await this.pull()
    await this.pushPendingCommits()
    this.lastRemoteSyncAt = now
  }

  async readBoard() {
    const status = await pathStatus(this.boardPath)
    if (!status) return undefined
    if (status.isSymbolicLink()) {
      throw new RepositoryError('The Kanban board file must not be a symlink.')
    }

    let source
    try {
      source = await readFile(this.boardPath, 'utf8')
    } catch {
      throw new RepositoryError('The Kanban board file could not be read.')
    }

    try {
      const board = normalizeBoard(JSON.parse(source), {
        workflow: this.config.columns,
      })
      const canonical = canonicalBoard(board)
      return { board, source: canonical, revision: revisionOf(canonical) }
    } catch (error) {
      throw new RepositoryError(
        `The Kanban board file is invalid: ${error.message}`,
      )
    }
  }

  async writeBoardAt(boardPath, board) {
    const normalized = normalizeBoard(board, { workflow: this.config.columns })
    const source = canonicalBoard(normalized)
    const temporaryPath = `${boardPath}.${process.pid}.${randomUUID()}.tmp`
    await mkdir(path.dirname(boardPath), { recursive: true })
    try {
      await writeFile(temporaryPath, source, { encoding: 'utf8', flag: 'wx' })
      await rename(temporaryPath, boardPath)
    } finally {
      await rm(temporaryPath, { force: true })
    }
    return { board: normalized, source, revision: revisionOf(source) }
  }

  async writeBoard(board) {
    return this.writeBoardAt(this.boardPath, board)
  }

  async commitBoardAt(directory, message) {
    await this.runGitAt(directory, ['add', '--', this.relativeBoardPath], {
      operation: 'staging',
    })
    const staged = await this.runGitAt(
      directory,
      ['diff', '--cached', '--name-only'],
      { operation: 'index verification' },
    )
    if (staged.stdout !== this.relativeBoardPath) {
      throw new RepositoryError(
        'Kanban refused to commit because the Git index contains unrelated paths.',
        409,
      )
    }

    await this.runGitAt(
      directory,
      [
        '-c',
        `user.name=${this.config.gitAuthorName}`,
        '-c',
        `user.email=${this.config.gitAuthorEmail}`,
        'commit',
        '--only',
        '--message',
        message,
        '--',
        this.relativeBoardPath,
      ],
      { operation: 'commit' },
    )
  }

  async commitBoard(message) {
    return this.commitBoardAt(this.root, message)
  }

  async pushDetachedCommit(commit, base) {
    if (!this.config.autoPush) return

    const pushed = await this.runGit(
      [
        'push',
        this.config.remote,
        `${commit}:refs/heads/${this.config.branch}`,
      ],
      { allowFailure: true, operation: 'push' },
    )
    if (pushed.code === 0) return

    const fetched = await this.runGit(
      ['fetch', this.config.remote, this.config.branch],
      { allowFailure: true, operation: 'push reconciliation fetch' },
    )
    if (fetched.code === 0) {
      const remoteTip = await this.runGit(
        ['rev-parse', `refs/remotes/${this.config.remote}/${this.config.branch}`],
        { allowFailure: true, operation: 'remote revision check' },
      )
      if (remoteTip.code === 0 && remoteTip.stdout === commit) return
      if (remoteTip.code === 0 && remoteTip.stdout !== base) {
        throw new StaleRevisionError()
      }
    }

    throw new RepositoryError(
      'Git push failed before the local Kanban branch was changed. Retry when the remote is available.',
      503,
    )
  }

  async commitMutation(board, message) {
    const base = await this.runGit(['rev-parse', '--verify', 'HEAD'], {
      operation: 'HEAD check',
    })
    const worktreePath = path.join(
      os.tmpdir(),
      `dddrop-kanban-worktree-${process.pid}-${randomUUID()}`,
    )

    try {
      await this.runGit(
        ['worktree', 'add', '--detach', worktreePath, base.stdout],
        { operation: 'temporary worktree creation' },
      )
      const worktreeBoardPath = path.join(
        worktreePath,
        this.relativeBoardPath,
      )
      await this.writeBoardAt(worktreeBoardPath, board)
      await this.commitBoardAt(worktreePath, message)
      const committed = await this.runGitAt(
        worktreePath,
        ['rev-parse', '--verify', 'HEAD'],
        { operation: 'commit verification' },
      )

      await this.pushDetachedCommit(committed.stdout, base.stdout)
      await this.assertCleanBoardPath()
      const currentHead = await this.runGit(['rev-parse', '--verify', 'HEAD'], {
        operation: 'HEAD verification',
      })
      if (currentHead.stdout !== base.stdout) {
        throw new RepositoryError(
          'The local Kanban branch changed during the mutation.',
          409,
        )
      }
      await this.runGit(['merge', '--ff-only', committed.stdout], {
        operation: 'local branch fast-forward',
      })

      const applied = await this.readBoard()
      if (!applied) {
        throw new RepositoryError(
          'The committed Kanban board could not be read after synchronization.',
        )
      }
      return applied
    } finally {
      await this.runGit(
        ['worktree', 'remove', '--force', worktreePath],
        { allowFailure: true, operation: 'temporary worktree cleanup' },
      )
      await rm(worktreePath, { recursive: true, force: true })
      await this.runGit(['worktree', 'prune'], {
        allowFailure: true,
        operation: 'temporary worktree pruning',
      })
    }
  }

  async initializeBoard() {
    const existing = await this.readBoard()
    if (existing) return existing

    await this.assertCleanBoardPath()
    const written = await this.writeBoard(
      createDefaultBoard({ id: randomUUID(), workflow: this.config.columns }),
    )
    await this.commitBoard('feat(kanban): initialize board')
    await this.push({ afterCommit: true })
    return written
  }

  decorateOverview(snapshot) {
    return {
      ...snapshot,
      pollIntervalMs: this.config.pollIntervalMs,
      workflow: this.config.columns,
      syncError: this.lastSyncError,
    }
  }

  scheduleRemoteSync() {
    if (this.backgroundSync) return
    if (!this.config.autoPull && !this.config.autoPush) return
    if (Date.now() - this.lastRemoteSyncAt < this.config.pullIntervalMs) return

    const pending = this.enqueue(async () => {
      await this.syncRemote()
      const snapshot = await this.readBoard()
      if (snapshot) this.cachedSnapshot = snapshot
      this.lastSyncError = undefined
    })
      .catch((error) => {
        this.lastSyncError =
          error instanceof Error
            ? error.message
            : 'Kanban background synchronization failed.'
      })
      .finally(() => {
        if (this.backgroundSync === pending) this.backgroundSync = undefined
      })
    this.backgroundSync = pending
  }

  async overview() {
    await this.ensureReady()
    if (this.backgroundSync && this.cachedSnapshot) {
      return this.decorateOverview(this.cachedSnapshot)
    }

    const snapshot = await this.enqueue(async () => {
      const local = await this.readBoard()
      if (local) return local

      await this.syncRemote({ force: true })
      return (await this.readBoard()) ?? (await this.initializeBoard())
    })
    this.cachedSnapshot = snapshot
    this.scheduleRemoteSync()
    return this.decorateOverview(snapshot)
  }

  async mutate({ expectedRevision, mutation, commitMessage }) {
    return this.enqueue(async () => {
      await this.ensureReady()
      await this.syncRemote({ force: true })
      const snapshot = (await this.readBoard()) ?? (await this.initializeBoard())
      if (
        typeof expectedRevision !== 'string' ||
        expectedRevision !== snapshot.revision
      ) {
        throw new StaleRevisionError()
      }

      const nextBoard = mutation(snapshot.board)
      const nextSource = canonicalBoard(
        normalizeBoard(nextBoard, { workflow: this.config.columns }),
      )
      if (nextSource === snapshot.source) {
        throw new RepositoryError('The Kanban mutation did not change the board.', 400)
      }

      await this.assertCleanBoardPath()
      const current = await this.readBoard()
      if (!current || current.revision !== snapshot.revision) {
        throw new StaleRevisionError()
      }
      const committed = await this.commitMutation(nextBoard, commitMessage)
      this.cachedSnapshot = committed
      this.lastSyncError = undefined
      this.lastRemoteSyncAt = Date.now()
      return committed
    })
  }
}
