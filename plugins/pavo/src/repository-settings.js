import { createHash, randomUUID } from 'node:crypto'
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { COLUMN_IDS, normalizeBoard, normalizeColumnSettings } from './board.js'
import { GitBoardRepository, RepositoryError, normalizeConfig } from './git-store.js'

const SETTINGS_VERSION = 2
const LEGACY_SETTINGS_VERSIONS = Object.freeze([1])
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

function publicColumnSettings(config) {
  const settings = normalizeColumnSettings(config.columnSettings)
  return {
    titles: { ...settings.titles },
    reviewEnabled: settings.reviewEnabled,
    archiveVisible: settings.archiveVisible,
  }
}

function revisionOf(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function repositoryRevisionOf(config) {
  return revisionOf(publicRepositoryConfig(config))
}

function columnRevisionOf(config) {
  return revisionOf(publicColumnSettings(config))
}

async function pathStatus(filePath) {
  try {
    return await lstat(filePath)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

async function readLegacyColumnSettings(config) {
  const boardPath = path.join(
    config.repositoryPath,
    config.dataDirectory,
    'board.json',
  )
  await assertNoSymlinkAncestors(boardPath)
  const status = await pathStatus(boardPath)
  if (!status) return undefined
  if (status.isSymbolicLink() || !status.isFile()) {
    throw new RepositoryError('The Pavo board path must be a regular file.')
  }

  let document
  try {
    document = JSON.parse(await readFile(boardPath, 'utf8'))
  } catch {
    return undefined
  }
  if (
    !Number.isSafeInteger(document?.version) ||
    document.version >= 12 ||
    !Array.isArray(document.columns)
  ) {
    return undefined
  }

  const defaults = normalizeColumnSettings(config.columnSettings)
  const titles = { ...defaults.titles }
  const ids = new Set()
  for (const column of document.columns) {
    if (
      column === null ||
      typeof column !== 'object' ||
      Array.isArray(column) ||
      typeof column.id !== 'string' ||
      !COLUMN_IDS.includes(column.id)
    ) {
      throw new RepositoryError(
        'Legacy Pavo Columns contain an unsupported id. Move every Work into a built-in Column before upgrading.',
      )
    }
    ids.add(column.id)
    if (typeof column.title === 'string' && column.title.trim()) {
      titles[column.id] = column.title
    }
  }
  return normalizeColumnSettings({
    titles,
    reviewEnabled: ids.has('review'),
    archiveVisible: false,
  })
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
  if (!status) return { config: defaults, columnsStored: false }
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
    (document.version === SETTINGS_VERSION &&
      (document.columns === null ||
        typeof document.columns !== 'object' ||
        Array.isArray(document.columns)))
  ) {
    throw new RepositoryError('The Pavo repository settings file is invalid.')
  }

  let columnSettings = defaults.columnSettings
  let warning
  if (document.version === SETTINGS_VERSION) {
    try {
      columnSettings = normalizeColumnSettings(document.columns)
    } catch {
      warning =
        'Stored Pavo Column settings are invalid. Repository settings were preserved and default Columns are active.'
    }
  }
  return {
    config: normalizeConfig({
      ...defaults,
      ...repositoryValues(document.repository),
      settingsPath: defaults.settingsPath,
      columnSettings,
      gitAuthorName: defaults.gitAuthorName,
      gitAuthorEmail: defaults.gitAuthorEmail,
    }),
    columnsStored: document.version === SETTINGS_VERSION && !warning,
    warning,
  }
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
          columns: publicColumnSettings(config),
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
    let columnsStored = false
    let warning
    try {
      const stored = await readStoredConfig(defaults)
      active = stored.config
      columnsStored = stored.columnsStored
      warning = stored.warning
      if (!columnsStored) {
        active = normalizeConfig({ ...active, allowColumnMigration: false })
      }
    } catch (error) {
      if (error instanceof RepositoryError && /unsupported id/u.test(error.message)) {
        throw error
      }
      warning =
        'Stored Pavo settings could not be loaded. Pavo is using its profile defaults.'
    }
    if (!columnsStored && active.allowColumnMigration !== false) {
      active = normalizeConfig({ ...active, allowColumnMigration: false })
    }
    return new RepositoryController(defaults, active, warning, !columnsStored)
  }

  constructor(defaults, active, warning, columnSettingsPending = false) {
    this.defaults = defaults
    this.repository = new GitBoardRepository(active)
    this.settingsWarning = warning
    this.columnSettingsPending = columnSettingsPending
    this.columnSettingsPromise = undefined
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
      columns: publicColumnSettings(this.config),
      columnRevision: columnRevisionOf(this.config),
      settingsWarning: this.settingsWarning,
    }
  }

  async settings() {
    await this.ensureColumnSettings()
    return this.describe()
  }

  async ensureColumnSettings() {
    if (!this.columnSettingsPending) return
    if (this.columnSettingsPromise) return this.columnSettingsPromise
    const execute = async () => {
      await this.repository.prepareColumnSettings()
      const imported = await readLegacyColumnSettings(this.config)
      const nextConfig = normalizeConfig({
        ...this.config,
        columnSettings: imported ?? this.config.columnSettings,
        allowColumnMigration: true,
      })
      await writeStoredConfig(nextConfig)
      this.repository = new GitBoardRepository(nextConfig)
      this.columnSettingsPending = false
    }
    this.columnSettingsPromise = execute().finally(() => {
      this.columnSettingsPromise = undefined
    })
    return this.columnSettingsPromise
  }

  async overview() {
    await this.ensureColumnSettings()
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
    const execute = async () => {
      await this.ensureColumnSettings()
      return this.repository.mutate(options)
    }
    const pending = this.operationQueue.then(execute, execute)
    this.operationQueue = pending.catch(() => {})
    void pending.then((snapshot) => this.notifyMutation(snapshot), () => {})
    return pending
  }

  updateColumns(input, expectedColumnRevision) {
    const execute = async () => {
      await this.ensureColumnSettings()
      if (
        typeof expectedColumnRevision !== 'string' ||
        expectedColumnRevision !== columnRevisionOf(this.config)
      ) {
        throw new RepositoryError(
          'The Pavo Column settings changed since they were loaded. Refresh and try again.',
          409,
        )
      }

      const columnSettings = normalizeColumnSettings(input)
      const nextConfig = normalizeConfig({
        ...this.config,
        columnSettings,
        settingsPath: this.defaults.settingsPath,
        gitAuthorName: this.defaults.gitAuthorName,
        gitAuthorEmail: this.defaults.gitAuthorEmail,
      })
      const current = await this.repository.overview()
      try {
        normalizeBoard(current.board, { workflow: nextConfig.columns })
      } catch (error) {
        if (!columnSettings.reviewEnabled) {
          throw new RepositoryError(
            'Review cannot be removed while a Work or Template still uses it.',
            409,
          )
        }
        throw error
      }
      await writeStoredConfig(nextConfig)
      this.repository = new GitBoardRepository(nextConfig)
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
      await this.ensureColumnSettings()
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
        columnSettings: this.config.columnSettings,
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
    void pending.then((snapshot) => this.notifyMutation(snapshot), () => {})
    return pending
  }
}

export {
  columnRevisionOf,
  publicColumnSettings,
  publicRepositoryConfig,
  repositoryRevisionOf,
}
