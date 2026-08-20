import { createHash, randomUUID } from 'node:crypto'
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { GitBoardRepository, RepositoryError, normalizeConfig } from './git-store.js'

const SETTINGS_VERSION = 4
const LEGACY_SETTINGS_VERSIONS = Object.freeze([1, 2, 3])
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

function revisionOf(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function repositoryRevisionOf(config) {
  return revisionOf(publicRepositoryConfig(config))
}

function archiveVisibilityRevisionOf(value) {
  return revisionOf({ archiveVisible: value })
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
  if (!status) {
    return { config: defaults, archiveVisible: false, needsRewrite: false }
  }
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
    ![...LEGACY_SETTINGS_VERSIONS, SETTINGS_VERSION].includes(document.version) ||
    document.repository === null ||
    typeof document.repository !== 'object' ||
    Array.isArray(document.repository) ||
    (document.version === 2 && !Object.hasOwn(document, 'columns')) ||
    (Object.hasOwn(document, 'columns') &&
      (document.columns === null ||
        typeof document.columns !== 'object' ||
        Array.isArray(document.columns))) ||
    (Object.hasOwn(document, 'archiveVisible') &&
      typeof document.archiveVisible !== 'boolean') ||
    (document.columns?.archiveVisible !== undefined &&
      typeof document.columns.archiveVisible !== 'boolean')
  ) {
    throw new RepositoryError('The Pavo repository settings file is invalid.')
  }

  return {
    config: normalizeConfig({
      ...defaults,
      ...repositoryValues(document.repository),
      settingsPath: defaults.settingsPath,
      gitAuthorName: defaults.gitAuthorName,
      gitAuthorEmail: defaults.gitAuthorEmail,
    }),
    archiveVisible:
      document.archiveVisible ?? document.columns?.archiveVisible ?? false,
    needsRewrite:
      document.version !== SETTINGS_VERSION || Object.hasOwn(document, 'columns'),
  }
}

async function writeStoredConfig(config, archiveVisible) {
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
          archiveVisible,
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
    let archiveVisible = false
    let needsRewrite = false
    try {
      const stored = await readStoredConfig(defaults)
      active = stored.config
      archiveVisible = stored.archiveVisible
      needsRewrite = stored.needsRewrite
    } catch {
      warning =
        'Stored Pavo settings could not be loaded. Pavo is using its profile defaults.'
    }
    if (needsRewrite) {
      try {
        await writeStoredConfig(active, archiveVisible)
      } catch {
        warning =
          'Obsolete Pavo Column settings could not be removed. Fixed Columns remain active.'
      }
    }
    return new RepositoryController(defaults, active, warning, archiveVisible)
  }

  constructor(defaults, active, warning, archiveVisible) {
    this.defaults = defaults
    this.repository = new GitBoardRepository(active)
    this.settingsWarning = warning
    this.archiveVisible = archiveVisible
    this.operationQueue = Promise.resolve()
    this.mutationListeners = new Set()
  }

  get config() {
    return this.repository.config
  }

  describe() {
    return {
      repository: publicRepositoryConfig(this.config),
      repositoryRevision: repositoryRevisionOf(this.config),
      archiveVisible: this.archiveVisible,
      archiveVisibilityRevision: archiveVisibilityRevisionOf(this.archiveVisible),
      settingsWarning: this.settingsWarning,
    }
  }

  async settings() {
    return this.describe()
  }

  async overview() {
    return this.repository.overview()
  }

  onMutation(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('The repository mutation listener must be a function.')
    }
    this.mutationListeners.add(listener)
    return () => this.mutationListeners.delete(listener)
  }

  notifyMutation(snapshot) {
    for (const listener of this.mutationListeners) {
      try {
        listener(snapshot)
      } catch {
        // Mutation listeners are notifications and must not fail persisted work.
      }
    }
  }

  mutate(options) {
    const execute = () => this.repository.mutate(options)
    const pending = this.operationQueue.then(execute, execute)
    this.operationQueue = pending.catch(() => {})
    void pending.then((snapshot) => this.notifyMutation(snapshot), () => {})
    return pending
  }

  updateArchiveVisibility(archiveVisible, expectedArchiveVisibilityRevision) {
    const execute = async () => {
      if (typeof archiveVisible !== 'boolean') {
        throw new RepositoryError('archiveVisible must be a boolean.', 400)
      }
      if (
        typeof expectedArchiveVisibilityRevision !== 'string' ||
        expectedArchiveVisibilityRevision !==
          archiveVisibilityRevisionOf(this.archiveVisible)
      ) {
        throw new RepositoryError(
          'Archive visibility changed since it was loaded. Refresh and try again.',
          409,
        )
      }
      await writeStoredConfig(this.config, archiveVisible)
      this.archiveVisible = archiveVisible
      this.settingsWarning = undefined
      return this.describe()
    }
    const pending = this.operationQueue.then(execute, execute)
    this.operationQueue = pending.catch(() => {})
    void pending.then((snapshot) => this.notifyMutation(snapshot), () => {})
    return pending
  }

  updateRepository(input, expectedRepositoryRevision) {
    const execute = async () => {
      if (
        typeof expectedRepositoryRevision !== 'string' ||
        expectedRepositoryRevision !== repositoryRevisionOf(this.config)
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
        gitAuthorName: this.defaults.gitAuthorName,
        gitAuthorEmail: this.defaults.gitAuthorEmail,
      })
      const candidate = new GitBoardRepository(nextConfig)
      await candidate.validate()
      await writeStoredConfig(nextConfig, this.archiveVisible)
      this.repository = candidate
      this.settingsWarning = undefined
      return this.describe()
    }
    const pending = this.operationQueue.then(execute, execute)
    this.operationQueue = pending.catch(() => {})
    void pending.then((snapshot) => this.notifyMutation(snapshot), () => {})
    return pending
  }
}

export {
  archiveVisibilityRevisionOf,
  publicRepositoryConfig,
  repositoryRevisionOf,
}
