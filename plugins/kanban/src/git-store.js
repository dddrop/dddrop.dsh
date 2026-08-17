import { createHash, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import { constants as fsConstants } from 'node:fs'
import {
  lstat,
  mkdir,
  open,
  readFile,
  readdir,
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
  const segments = normalized.split(/[\\/]+/u)
  if (
    path.isAbsolute(normalized) ||
    segments.length === 0 ||
    segments.some(
      (segment) => segment.length === 0 || segment === '.' || segment === '..',
    )
  ) {
    throw new TypeError('dataDirectory must stay inside the Git repository.')
  }
  return segments.join(path.sep)
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

function isInsidePath(rootPath, candidatePath) {
  return (
    candidatePath === rootPath ||
    candidatePath.startsWith(`${rootPath}${path.sep}`)
  )
}

async function ensureSafeDirectory(rootPath, relativePath = '') {
  const rootRealPath = await realpath(rootPath)
  let currentPath = rootPath
  const segments = relativePath ? relativePath.split(path.sep) : []

  for (const segment of segments) {
    currentPath = path.join(currentPath, segment)
    const existing = await pathStatus(currentPath)
    if (!existing) await mkdir(currentPath)
    const currentStatus = await lstat(currentPath)
    if (currentStatus.isSymbolicLink() || !currentStatus.isDirectory()) {
      throw new RepositoryError(
        'Kanban data directories must be regular directories, not symlinks.',
      )
    }
    const currentRealPath = await realpath(currentPath)
    if (!isInsidePath(rootRealPath, currentRealPath)) {
      throw new RepositoryError(
        'The Kanban data directory resolves outside the Git repository.',
      )
    }
  }
  return currentPath
}

async function readRegularFile(filePath, label) {
  const noFollow = fsConstants.O_NOFOLLOW ?? 0
  let handle
  try {
    handle = await open(filePath, fsConstants.O_RDONLY | noFollow)
    const fileStatus = await handle.stat()
    if (!fileStatus.isFile()) {
      throw new RepositoryError(`${label} must be a regular file.`)
    }
    return {
      source: await handle.readFile('utf8'),
      identity: {
        dev: fileStatus.dev,
        ino: fileStatus.ino,
        size: fileStatus.size,
        mtimeMs: fileStatus.mtimeMs,
      },
    }
  } catch (error) {
    if (error instanceof RepositoryError) throw error
    throw new RepositoryError(`${label} could not be read.`)
  } finally {
    await handle?.close()
  }
}

async function hasFileIdentity(filePath, identity) {
  const fileStatus = await pathStatus(filePath)
  return (
    fileStatus?.isFile() === true &&
    !fileStatus.isSymbolicLink() &&
    fileStatus.dev === identity.dev &&
    fileStatus.ino === identity.ino &&
    fileStatus.size === identity.size &&
    fileStatus.mtimeMs === identity.mtimeMs
  )
}

const BOARD_FORMAT_VERSION = 2
const TICKET_FORMAT_VERSION = 1
const MAX_TICKET_ID_LENGTH = 128
const SAFE_TICKET_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/u

function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function canonicalBoard(board) {
  return canonicalJson(board)
}

function ticketFileName(id) {
  if (
    typeof id !== 'string' ||
    id.length === 0 ||
    id.length > MAX_TICKET_ID_LENGTH
  ) {
    throw new TypeError(
      `Ticket ids must contain 1 to ${MAX_TICKET_ID_LENGTH} characters.`,
    )
  }
  if (SAFE_TICKET_ID.test(id) && !id.startsWith('b64--')) {
    return `${id}.json`
  }
  return `b64--${Buffer.from(id, 'utf8').toString('base64url')}.json`
}

function splitBoardDocuments(boardInput, workflow) {
  const board = normalizeBoard(boardInput, { workflow })
  return {
    board,
    boardDocument: {
      version: BOARD_FORMAT_VERSION,
      columns: board.columns,
      tickets: board.cards.map((card, order) => ({
        id: card.id,
        columnId: card.columnId,
        order,
      })),
    },
    ticketDocuments: board.cards.map((card) => ({
      version: TICKET_FORMAT_VERSION,
      id: card.id,
      title: card.title,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    })),
  }
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
    this.relativeTicketsPath = path.join(this.config.dataDirectory, 'tickets')
    this.boardPath = path.join(this.root, this.relativeBoardPath)
    this.ticketsPath = path.join(this.root, this.relativeTicketsPath)
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

    await ensureSafeDirectory(this.root, this.config.dataDirectory)
    await ensureSafeDirectory(this.root, this.relativeTicketsPath)

    const boardStatus = await pathStatus(this.boardPath)
    if (
      boardStatus &&
      (boardStatus.isSymbolicLink() || !boardStatus.isFile())
    ) {
      throw new RepositoryError('The Kanban board must be a regular file.')
    }
  }

  async ensureReady() {
    this.ready ??= this.initialize()
    return this.ready
  }

  async assertCleanBoardPath() {
    const status = await this.runGit(
      [
        'status',
        '--porcelain=v1',
        '--untracked-files=all',
        '--',
        this.relativeBoardPath,
        this.relativeTicketsPath,
      ],
      { operation: 'status check' },
    )
    if (status.stdout) {
      throw new RepositoryError(
        'The Kanban board or ticket files have uncommitted changes. Commit or discard them before continuing.',
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

  ticketPath(directory, id) {
    return path.join(directory, this.relativeTicketsPath, ticketFileName(id))
  }

  async readBoard() {
    const status = await pathStatus(this.boardPath)
    if (!status) return undefined

    const boardFile = await readRegularFile(
      this.boardPath,
      'The Kanban board file',
    )
    let document
    try {
      document = JSON.parse(boardFile.source)
    } catch {
      throw new RepositoryError('The Kanban board file contains invalid JSON.')
    }

    try {
      if (Array.isArray(document.cards)) {
        if (!(await hasFileIdentity(this.boardPath, boardFile.identity))) {
          throw new StaleRevisionError()
        }
        const board = normalizeBoard(document, { workflow: this.config.columns })
        const source = canonicalBoard(board)
        return {
          board,
          source,
          revision: revisionOf(source),
          format: 'legacy',
        }
      }
      if (
        document.version !== BOARD_FORMAT_VERSION ||
        !Array.isArray(document.tickets)
      ) {
        throw new TypeError(
          `The board must use split-storage version ${BOARD_FORMAT_VERSION}.`,
        )
      }

      const placements = document.tickets
        .map((value, index) => {
          const placement = requireObject(
            value,
            `Ticket placement ${index} must be an object.`,
          )
          const id = requireString(
            placement.id,
            `Ticket placement ${index} id`,
          )
          ticketFileName(id)
          if (
            !Number.isSafeInteger(placement.order) ||
            placement.order < 0
          ) {
            throw new TypeError(
              `Ticket placement ${id} order must be a non-negative safe integer.`,
            )
          }
          return {
            id,
            columnId: requireString(
              placement.columnId,
              `Ticket placement ${index} columnId`,
            ),
            order: placement.order,
          }
        })
        .sort((left, right) => left.order - right.order)
      placements.forEach((placement, index) => {
        if (placement.order !== index) {
          throw new TypeError(
            'Ticket placement order must be unique and contiguous from zero.',
          )
        }
      })

      await ensureSafeDirectory(this.root, this.relativeTicketsPath)
      const ticketsDirectoryStatus = await lstat(this.ticketsPath)
      const expectedFiles = new Set(
        placements.map((placement) => ticketFileName(placement.id)),
      )
      const initialEntries = await readdir(this.ticketsPath, {
        withFileTypes: true,
      })
      for (const entry of initialEntries) {
        if (!entry.name.endsWith('.json')) continue
        if (!entry.isFile() || !expectedFiles.has(entry.name)) {
          throw new TypeError(
            `Unexpected ticket file in managed storage: ${entry.name}`,
          )
        }
      }
      if (
        initialEntries.filter((entry) => entry.name.endsWith('.json')).length !==
        expectedFiles.size
      ) {
        throw new TypeError('The ticket file set does not match board.json.')
      }

      const cards = []
      const ticketIdentities = []
      for (const placement of placements) {
        const ticketPath = this.ticketPath(this.root, placement.id)
        const ticketFile = await readRegularFile(
          ticketPath,
          `Ticket file ${placement.id}`,
        )
        const ticket = requireObject(
          JSON.parse(ticketFile.source),
          `Ticket ${placement.id} must be an object.`,
        )
        if (ticket.version !== TICKET_FORMAT_VERSION) {
          throw new TypeError(
            `Ticket ${placement.id} must use version ${TICKET_FORMAT_VERSION}.`,
          )
        }
        if (ticket.id !== placement.id) {
          throw new TypeError(
            `Ticket file ${placement.id} contains a different ticket id.`,
          )
        }
        ticketIdentities.push({
          filePath: ticketPath,
          identity: ticketFile.identity,
        })
        cards.push({
          id: ticket.id,
          title: ticket.title,
          columnId: placement.columnId,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        })
      }

      const finalTicketsDirectoryStatus = await lstat(this.ticketsPath)
      const finalManagedEntries = (await readdir(this.ticketsPath))
        .filter((entry) => entry.endsWith('.json'))
        .sort()
      if (
        ticketsDirectoryStatus.dev !== finalTicketsDirectoryStatus.dev ||
        ticketsDirectoryStatus.ino !== finalTicketsDirectoryStatus.ino ||
        !(await hasFileIdentity(this.boardPath, boardFile.identity)) ||
        finalManagedEntries.join('\n') !== [...expectedFiles].sort().join('\n')
      ) {
        throw new StaleRevisionError()
      }
      for (const ticketIdentity of ticketIdentities) {
        if (
          !(await hasFileIdentity(
            ticketIdentity.filePath,
            ticketIdentity.identity,
          ))
        ) {
          throw new StaleRevisionError()
        }
      }

      const board = normalizeBoard(
        { version: 1, columns: document.columns, cards },
        { workflow: this.config.columns },
      )
      const source = canonicalBoard(board)
      return {
        board,
        source,
        revision: revisionOf(source),
        format: 'split',
      }
    } catch (error) {
      if (error instanceof StaleRevisionError) throw error
      throw new RepositoryError(
        `The Kanban data is invalid: ${error.message}`,
      )
    }
  }

  async writeJsonAt(rootDirectory, filePath, value) {
    const relativeParent = path.relative(
      rootDirectory,
      path.dirname(filePath),
    )
    if (
      path.isAbsolute(relativeParent) ||
      relativeParent.split(path.sep).some((segment) => segment === '..')
    ) {
      throw new RepositoryError(
        'Kanban refused to write outside the temporary Git worktree.',
      )
    }
    await ensureSafeDirectory(rootDirectory, relativeParent)

    const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`
    try {
      await writeFile(temporaryPath, canonicalJson(value), {
        encoding: 'utf8',
        flag: 'wx',
      })
      const existing = await pathStatus(filePath)
      if (existing?.isSymbolicLink()) {
        throw new RepositoryError('Kanban data files must not be symlinks.')
      }
      await rename(temporaryPath, filePath)
    } finally {
      await rm(temporaryPath, { force: true })
    }
  }

  async writeBoardAt(directory, boardInput, previousBoard) {
    const documents = splitBoardDocuments(boardInput, this.config.columns)
    await this.writeJsonAt(
      directory,
      path.join(directory, this.relativeBoardPath),
      documents.boardDocument,
    )
    for (const ticket of documents.ticketDocuments) {
      await this.writeJsonAt(
        directory,
        this.ticketPath(directory, ticket.id),
        ticket,
      )
    }

    if (previousBoard) {
      const nextIds = new Set(documents.ticketDocuments.map((ticket) => ticket.id))
      for (const previous of normalizeBoard(previousBoard, {
        workflow: this.config.columns,
      }).cards) {
        if (!nextIds.has(previous.id)) {
          await rm(this.ticketPath(directory, previous.id), { force: true })
        }
      }
    }

    const source = canonicalBoard(documents.board)
    return {
      board: documents.board,
      source,
      revision: revisionOf(source),
      format: 'split',
    }
  }

  async writeBoard(board, previousBoard) {
    return this.writeBoardAt(this.root, board, previousBoard)
  }

  async commitBoardAt(directory, message) {
    const managedPaths = [this.relativeBoardPath, this.relativeTicketsPath]
    await this.runGitAt(directory, ['add', '-A', '--', ...managedPaths], {
      operation: 'staging',
    })
    const staged = await this.runGitAt(
      directory,
      ['diff', '--cached', '--name-only'],
      { operation: 'index verification' },
    )
    const normalizedBoardPath = this.relativeBoardPath
      .split(path.sep)
      .join('/')
    const normalizedTicketsPath = this.relativeTicketsPath
      .split(path.sep)
      .join('/')
    const stagedPaths = staged.stdout ? staged.stdout.split('\n') : []
    const ticketPrefix = `${normalizedTicketsPath}/`
    const isManagedTicketPath = (stagedPath) => {
      if (!stagedPath.startsWith(ticketPrefix)) return false
      const fileName = stagedPath.slice(ticketPrefix.length)
      return fileName.endsWith('.json') && !fileName.includes('/')
    }
    if (
      stagedPaths.length === 0 ||
      stagedPaths.some(
        (stagedPath) =>
          stagedPath !== normalizedBoardPath &&
          !isManagedTicketPath(stagedPath),
      )
    ) {
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
        ...managedPaths,
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

  async commitMutation(board, message, previousBoard) {
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
      await this.writeBoardAt(worktreePath, board, previousBoard)
      await this.commitBoardAt(worktreePath, message)
      const committed = await this.runGitAt(
        worktreePath,
        ['rev-parse', '--verify', 'HEAD'],
        { operation: 'commit verification' },
      )

      await this.assertCleanBoardPath()
      const prePushHead = await this.runGit(['rev-parse', '--verify', 'HEAD'], {
        operation: 'pre-push HEAD verification',
      })
      if (prePushHead.stdout !== base.stdout) {
        throw new RepositoryError(
          'The local Kanban branch changed during the mutation.',
          409,
        )
      }
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

  async migrateLegacyBoard(snapshot) {
    await this.assertCleanBoardPath()
    const migrated = await this.commitMutation(
      snapshot.board,
      'refactor(kanban): split ticket storage',
      snapshot.board,
    )
    this.cachedSnapshot = migrated
    this.lastSyncError = undefined
    this.lastRemoteSyncAt = Date.now()
    return migrated
  }

  async ensureSplitSnapshot(snapshot) {
    if (!snapshot || snapshot.format === 'split') return snapshot
    if (this.config.autoPull && !this.config.autoPush) return snapshot
    return this.migrateLegacyBoard(snapshot)
  }

  async initializeBoard() {
    const existing = await this.readBoard()
    if (existing) return this.ensureSplitSnapshot(existing)

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
      const snapshot = await this.ensureSplitSnapshot(await this.readBoard())
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
      if (local) return this.ensureSplitSnapshot(local)

      await this.syncRemote({ force: true })
      const synchronized = await this.readBoard()
      return synchronized
        ? this.ensureSplitSnapshot(synchronized)
        : this.initializeBoard()
    })
    this.cachedSnapshot = snapshot
    this.scheduleRemoteSync()
    return this.decorateOverview(snapshot)
  }

  async mutate({ expectedRevision, mutation, commitMessage }) {
    return this.enqueue(async () => {
      await this.ensureReady()
      await this.syncRemote({ force: true })
      const loaded = (await this.readBoard()) ?? (await this.initializeBoard())
      const snapshot = await this.ensureSplitSnapshot(loaded)
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
      const committed = await this.commitMutation(
        nextBoard,
        commitMessage,
        snapshot.board,
      )
      this.cachedSnapshot = committed
      this.lastSyncError = undefined
      this.lastRemoteSyncAt = Date.now()
      return committed
    })
  }
}
