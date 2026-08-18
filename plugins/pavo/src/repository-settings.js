import { createHash, randomUUID } from 'node:crypto'
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { GitBoardRepository, RepositoryError, normalizeConfig } from './git-store.js'

const SETTINGS_VERSION = 1
const REPOSITORY_FIELDS = Object.freeze([
  'repositoryPath',
  'dataDirectory',
  'branch',
  'remote',
  'autoPull',
  'autoPush',
  'initializeRepository',
  'pollIntervalMs',
  'pullIntervalMs',
])

function repositoryValues(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Repository settings must be an object.')
  }
  const values = {}
  for (const field of REPOSITORY_FIELDS) {
    if (input[field] !== undefined) values[field] = input[field]
  }
  return values
}

function publicRepositoryConfig(config) {
  return repositoryValues(config)
}

function revisionOf(config) {
  return createHash('sha256')
    .update(JSON.stringify(publicRepositoryConfig(config)))
    .digest('hex')
}

async function pathStatus(filePath) {
  try {
    return await lstat(filePath)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

async function assertNoSymlinkAncestors(targetPath) {
  const root = path.parse(targetPath).root
  let currentPath = root
  const segments = path.relative(root, targetPath).split(path.sep).filter(Boolean)
  for (let index = 0; index < segments.length; index += 1) {
    currentPath = path.join(currentPath, segments[index])
    const status = await pathStatus(currentPath)
    if (!status) return
    if (status.isSymbolicLink()) {
      // Permit root-owned system aliases such as macOS /var, but never a
      // configurable leaf or a link controlled through a writable parent.
      const parentStatus = await lstat(path.dirname(currentPath))
      const ownedByProcess =
        typeof process.getuid === 'function' &&
        parentStatus.uid === process.getuid()
      const writableByOthers = (parentStatus.mode & 0o022) !== 0
      if (index === segments.length - 1 || ownedByProcess || writableByOthers) {
        throw new RepositoryError(
          'The Pavo repository settings path must not contain symlinked ancestors.',
        )
      }
      continue
    }
    if (index < segments.length - 1 && !status.isDirectory()) {
      throw new RepositoryError(
        'The Pavo repository settings path has a non-directory ancestor.',
      )
    }
  }
}

async function readStoredConfig(defaults) {
  await assertNoSymlinkAncestors(defaults.settingsPath)
  const status = await pathStatus(defaults.settingsPath)
  if (!status) return defaults
  if (status.isSymbolicLink() || !status.isFile()) {
    throw new RepositoryError(
      'The Pavo repository settings path must be a regular file.',
    )
  }

  let document
  try {
    document = JSON.parse(await readFile(defaults.settingsPath, 'utf8'))
  } catch {
    throw new RepositoryError('The Pavo repository settings file is invalid.')
  }
  if (
    document === null ||
    typeof document !== 'object' ||
    Array.isArray(document) ||
    document.version !== SETTINGS_VERSION ||
    document.repository === null ||
    typeof document.repository !== 'object' ||
    Array.isArray(document.repository)
  ) {
    throw new RepositoryError('The Pavo repository settings file is invalid.')
  }

  return normalizeConfig({
    ...defaults,
    ...repositoryValues(document.repository),
    settingsPath: defaults.settingsPath,
    columns: defaults.columns,
    gitAuthorName: defaults.gitAuthorName,
    gitAuthorEmail: defaults.gitAuthorEmail,
  })
}

async function writeStoredConfig(config) {
  const settingsPath = config.settingsPath
  await assertNoSymlinkAncestors(settingsPath)
  await mkdir(path.dirname(settingsPath), { recursive: true })
  await assertNoSymlinkAncestors(settingsPath)
  const existing = await pathStatus(settingsPath)
  if (existing?.isSymbolicLink() || (existing && !existing.isFile())) {
    throw new RepositoryError(
      'The Pavo repository settings path must be a regular file.',
    )
  }

  const temporaryPath = `${settingsPath}.${process.pid}.${randomUUID()}.tmp`
  try {
    await writeFile(
      temporaryPath,
      `${JSON.stringify(
        {
          version: SETTINGS_VERSION,
          repository: publicRepositoryConfig(config),
        },
        null,
        2,
      )}\n`,
      { encoding: 'utf8', flag: 'wx', mode: 0o600 },
    )
    await rename(temporaryPath, settingsPath)
  } finally {
    await rm(temporaryPath, { force: true })
  }
}

export class RepositoryController {
  static async create(config) {
    const defaults = normalizeConfig(config)
    let active = defaults
    let warning
    try {
      active = await readStoredConfig(defaults)
    } catch {
      warning =
        'Stored repository settings could not be loaded. Pavo is using its profile defaults.'
    }
    return new RepositoryController(defaults, active, warning)
  }

  constructor(defaults, active, warning) {
    this.defaults = defaults
    this.repository = new GitBoardRepository(active)
    this.settingsWarning = warning
    this.operationQueue = Promise.resolve()
  }

  get config() {
    return this.repository.config
  }

  describe() {
    return {
      repository: publicRepositoryConfig(this.config),
      repositoryRevision: revisionOf(this.config),
      settingsWarning: this.settingsWarning,
    }
  }

  overview() {
    return this.repository.overview()
  }

  mutate(options) {
    const execute = () => this.repository.mutate(options)
    const pending = this.operationQueue.then(execute, execute)
    this.operationQueue = pending.catch(() => {})
    return pending
  }

  updateRepository(input, expectedRepositoryRevision) {
    const execute = async () => {
      if (
        typeof expectedRepositoryRevision !== 'string' ||
        expectedRepositoryRevision !== revisionOf(this.config)
      ) {
        throw new RepositoryError(
          'The repository settings changed since they were loaded. Refresh and try again.',
          409,
        )
      }

      const nextConfig = normalizeConfig({
        ...this.defaults,
        ...repositoryValues(input),
        settingsPath: this.defaults.settingsPath,
        columns: this.defaults.columns,
        gitAuthorName: this.defaults.gitAuthorName,
        gitAuthorEmail: this.defaults.gitAuthorEmail,
      })
      const candidate = new GitBoardRepository(nextConfig)
      await candidate.validate()
      await writeStoredConfig(nextConfig)
      this.repository = candidate
      this.settingsWarning = undefined
      return this.describe()
    }
    const pending = this.operationQueue.then(execute, execute)
    this.operationQueue = pending.catch(() => {})
    return pending
  }
}

export { publicRepositoryConfig, revisionOf as repositoryRevisionOf }
