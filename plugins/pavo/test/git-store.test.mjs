import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'

import {
  ROOT_WORKFLOW_ID,
  addProject,
  addTemplate,
  addWork,
  addWorkflow,
  createDefaultBoard,
  removeWork,
  updateWork,
  workTemplateContentFromWork,
} from '../src/board.js'
import {
  GitBoardRepository,
  RepositoryError,
  StaleRevisionError,
} from '../src/git-store.js'

const execFileAsync = promisify(execFile)

async function git(cwd, ...args) {
  const result = await execFileAsync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    timeout: 30_000,
  })
  return result.stdout.trim()
}

function addConfiguredWork(board, input, workflow) {
  const configured = board.projects.includes('Harness')
    ? board
    : addProject(board, { project: 'Harness' }, { workflow })
  return addWork(
    configured,
    {
      project: 'Harness',
      key: input.id.toUpperCase(),
      type: 'goal',
      description: '',
      upstreamWaterLevels: {},
      assignee: '',
      waterLevel: '0',
      ...input,
    },
    { workflow },
  )
}

test('pulls remote changes, rejects stale revisions, and pushes mutations', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-remote-'))
  const remote = path.join(root, 'remote.git')
  const local = path.join(root, 'local')
  const peer = path.join(root, 'peer')

  try {
    await execFileAsync('git', [
      'init',
      '--bare',
      '--initial-branch=main',
      remote,
    ])
    await execFileAsync('git', ['init', '--initial-branch=main', local])
    await git(local, 'remote', 'add', 'origin', remote)

    const config = {
      repositoryPath: local,
      branch: 'main',
      remote: 'origin',
      autoPull: true,
      autoPush: true,
      initializeRepository: false,
      pollIntervalMs: 1_000,
      pullIntervalMs: 1_000,
    }
    const repository = new GitBoardRepository(config)
    const initial = await repository.overview()
    assert.equal(await git(remote, 'rev-list', '--count', 'main'), '1')

    await execFileAsync('git', ['clone', '--branch', 'main', remote, peer])
    await git(peer, 'config', 'user.name', 'Peer Writer')
    await git(peer, 'config', 'user.email', 'peer@example.test')
    const peerBoardPath = path.join(peer, 'kanban', 'board.json')
    const peerBoard = JSON.parse(await readFile(peerBoardPath, 'utf8'))
    const peerTicketPath = path.join(
      peer,
      'kanban',
      'tickets',
      `${peerBoard.works[0].id}.json`,
    )
    const peerTicket = JSON.parse(await readFile(peerTicketPath, 'utf8'))
    peerTicket.title = 'Changed in another clone'
    peerTicket.updatedAt = '2026-02-01T00:00:00.000Z'
    await writeFile(peerTicketPath, `${JSON.stringify(peerTicket, null, 2)}\n`)
    await git(
      peer,
      'add',
      '--',
      `kanban/tickets/${peerBoard.works[0].id}.json`,
    )
    await git(peer, 'commit', '-m', 'feat(kanban): update card remotely')
    await git(peer, 'push', 'origin', 'HEAD:main')

    const refreshedRepository = new GitBoardRepository(config)
    await assert.rejects(
      refreshedRepository.mutate({
        expectedRevision: initial.revision,
        commitMessage: 'feat(kanban): add card',
        mutation: (board) =>
          addConfiguredWork(
            board,
            {
              id: 'stale-card',
              title: 'Stale mutation',
              columnId: 'backlog',
              createdAt: '2026-02-02T00:00:00.000Z',
            },
            refreshedRepository.config.columns,
          ),
      }),
      StaleRevisionError,
    )

    const refreshed = await refreshedRepository.overview()
    assert.equal(refreshed.board.works[0].title, 'Changed in another clone')
    const pushed = await refreshedRepository.mutate({
      expectedRevision: refreshed.revision,
      commitMessage: 'feat(kanban): add card',
      mutation: (board) =>
        addConfiguredWork(
          board,
          {
            id: 'fresh-card',
            title: 'Fresh mutation',
            columnId: 'backlog',
            createdAt: '2026-02-03T00:00:00.000Z',
          },
          refreshedRepository.config.columns,
        ),
    })

    assert.equal(
      pushed.board.works.some((card) => card.id === 'fresh-card'),
      true,
    )
    assert.equal(await git(remote, 'rev-list', '--count', 'main'), '3')
    assert.equal(
      await git(remote, 'log', '-1', '--format=%s', 'main'),
      'feat(kanban): add card',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('serializes repository instances and rejects the stale concurrent writer', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-lock-'))
  const config = {
    repositoryPath: root,
    autoPull: false,
    autoPush: false,
    initializeRepository: true,
  }

  try {
    const initializer = new GitBoardRepository(config)
    const initial = await initializer.overview()
    const left = new GitBoardRepository(config)
    const right = new GitBoardRepository(config)
    const mutate = (repository, id) =>
      repository.mutate({
        expectedRevision: initial.revision,
        commitMessage: 'feat(kanban): add card',
        mutation: (board) =>
          addConfiguredWork(
            board,
            {
              id,
              title: `Concurrent ${id}`,
              columnId: 'backlog',
              createdAt: '2026-02-04T00:00:00.000Z',
            },
            repository.config.columns,
          ),
      })

    const outcomes = await Promise.allSettled([
      mutate(left, 'left-card'),
      mutate(right, 'right-card'),
    ])
    assert.equal(
      outcomes.filter((outcome) => outcome.status === 'fulfilled').length,
      1,
    )
    const rejected = outcomes.find((outcome) => outcome.status === 'rejected')
    assert.equal(rejected.reason instanceof StaleRevisionError, true)

    const final = await initializer.overview()
    assert.equal(final.board.works.length, 2)
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '2')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('returns the local board before background Git synchronization completes', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-local-first-'))

  try {
    const repository = new GitBoardRepository({
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })
    const initial = await repository.overview()

    let releaseSync
    let markStarted
    const syncStarted = new Promise((resolve) => {
      markStarted = resolve
    })
    const syncGate = new Promise((resolve) => {
      releaseSync = resolve
    })
    repository.config.autoPull = true
    repository.lastRemoteSyncAt = 0
    repository.syncRemote = async () => {
      markStarted()
      await syncGate
    }

    const loaded = await repository.overview()
    await syncStarted
    assert.equal(loaded.revision, initial.revision)
    assert.notEqual(repository.backgroundSync, undefined)

    releaseSync()
    await repository.backgroundSync
    assert.equal(repository.backgroundSync, undefined)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('rejects symlinked ancestors before initializing a repository', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-root-symlink-'))
  const outsidePath = path.join(root, 'outside')
  const linkedPath = path.join(root, 'linked')

  try {
    await mkdir(outsidePath)
    await symlink(outsidePath, linkedPath)
    const repository = new GitBoardRepository({
      repositoryPath: path.join(linkedPath, 'repository'),
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })

    await assert.rejects(repository.overview(), /symlinked ancestors/)
    await assert.rejects(
      readFile(path.join(outsidePath, 'repository', 'kanban', 'board.json')),
      { code: 'ENOENT' },
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('rejects symlinked ancestors in a nested data directory', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-symlink-'))
  const repositoryPath = path.join(root, 'repository')
  const outsidePath = path.join(root, 'outside')

  try {
    await mkdir(repositoryPath)
    await mkdir(outsidePath)
    await symlink(outsidePath, path.join(repositoryPath, 'state'))
    const repository = new GitBoardRepository({
      repositoryPath,
      dataDirectory: 'state/kanban',
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })

    await assert.rejects(
      repository.overview(),
      /data directories must be regular directories/,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('rejects invalid placement order and orphan ticket files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-invalid-split-'))

  try {
    const repository = new GitBoardRepository({
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })
    await repository.overview()
    const boardPath = path.join(root, 'kanban', 'board.json')
    const boardSource = await readFile(boardPath, 'utf8')
    const boardDocument = JSON.parse(boardSource)
    boardDocument.works[0].order = 2
    await writeFile(boardPath, `${JSON.stringify(boardDocument, null, 2)}\n`)
    await assert.rejects(repository.overview(), /order must be unique and contiguous/)

    await writeFile(boardPath, boardSource)
    await writeFile(
      path.join(root, 'kanban', 'tickets', 'orphan.json'),
      `${JSON.stringify({
        version: 1,
        id: 'orphan',
        title: 'Orphan ticket',
        createdAt: '2026-02-05T00:00:00.000Z',
        updatedAt: '2026-02-05T00:00:00.000Z',
      }, null, 2)}\n`,
    )
    await assert.rejects(repository.overview(), /Unexpected ticket file/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('reads legacy split storage with deterministic card defaults', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-legacy-split-'))

  try {
    const config = {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    }
    const writer = new GitBoardRepository(config)
    await writer.overview()
    const boardPath = path.join(root, 'kanban', 'board.json')
    const boardDocument = JSON.parse(await readFile(boardPath, 'utf8'))
    boardDocument.version = 2
    boardDocument.tickets = boardDocument.works
    delete boardDocument.works
    delete boardDocument.projects
    await writeFile(boardPath, `${JSON.stringify(boardDocument, null, 2)}\n`)

    const ticketPath = path.join(
      root,
      'kanban',
      'tickets',
      `${boardDocument.tickets[0].id}.json`,
    )
    const ticketDocument = JSON.parse(await readFile(ticketPath, 'utf8'))
    ticketDocument.version = 1
    ticketDocument.body = ticketDocument.description
    delete ticketDocument.type
    delete ticketDocument.project
    delete ticketDocument.key
    delete ticketDocument.description
    delete ticketDocument.assignee
    delete ticketDocument.waterLevel
    delete ticketDocument.upstreamWaterLevels
    await writeFile(ticketPath, `${JSON.stringify(ticketDocument, null, 2)}\n`)
    await git(root, 'add', '--', 'kanban/board.json', 'kanban/tickets')
    await git(root, 'commit', '-m', 'test: prepare legacy split storage')

    const reader = new GitBoardRepository(config)
    const snapshot = await reader.overview()
    assert.deepEqual(snapshot.board.projects, [])
    assert.deepEqual(
      {
        type: snapshot.board.works[0].type,
        project: snapshot.board.works[0].project,
        key: snapshot.board.works[0].key,
        description: snapshot.board.works[0].description,
        upstreamWaterLevels: snapshot.board.works[0].upstreamWaterLevels,
        assignee: snapshot.board.works[0].assignee,
        waterLevel: snapshot.board.works[0].waterLevel,
      },
      {
        type: 'goal',
        project: '',
        key: '',
        description: '',
        upstreamWaterLevels: {},
        assignee: { kind: 'unassigned' },
        waterLevel: '0',
      },
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('migrates a legacy combined board into split ticket files once', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-migration-'))

  try {
    await execFileAsync('git', ['init', '--initial-branch=main', root])
    await git(root, 'config', 'user.name', 'Legacy Writer')
    await git(root, 'config', 'user.email', 'legacy@example.test')
    await mkdir(path.join(root, 'kanban'))
    const legacyTicketId = 'legacy ticket/测试'
    const legacyTicketFile = `b64--${Buffer.from(legacyTicketId, 'utf8').toString('base64url')}.json`
    const legacyBoard = createDefaultBoard({
      id: legacyTicketId,
      now: '2026-02-05T00:00:00.000Z',
    })
    legacyBoard.cards = legacyBoard.works
    delete legacyBoard.works
    delete legacyBoard.projects
    legacyBoard.cards[0].body = legacyBoard.cards[0].description
    delete legacyBoard.cards[0].type
    delete legacyBoard.cards[0].project
    delete legacyBoard.cards[0].key
    delete legacyBoard.cards[0].description
    delete legacyBoard.cards[0].upstreamWaterLevels
    delete legacyBoard.cards[0].assignee
    delete legacyBoard.cards[0].waterLevel
    await writeFile(
      path.join(root, 'kanban', 'board.json'),
      `${JSON.stringify(legacyBoard, null, 2)}\n`,
    )
    await git(root, 'add', '--', 'kanban/board.json')
    await git(root, 'commit', '-m', 'feat(kanban): add legacy board')

    const repository = new GitBoardRepository({
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: false,
    })
    const migrated = await repository.overview()
    assert.equal(migrated.format, 'split-current')
    assert.equal(migrated.board.works[0].id, legacyTicketId)

    const boardDocument = JSON.parse(
      await readFile(path.join(root, 'kanban', 'board.json'), 'utf8'),
    )
    const ticketDocument = JSON.parse(
      await readFile(
        path.join(root, 'kanban', 'tickets', legacyTicketFile),
        'utf8',
      ),
    )
    assert.equal(boardDocument.version, 7)
    assert.deepEqual(boardDocument.projects, [])
    assert.equal(boardDocument.cards, undefined)
    assert.equal(boardDocument.tickets, undefined)
    assert.deepEqual(boardDocument.works, [
      { id: legacyTicketId, columnId: 'backlog', order: 0 },
    ])
    assert.equal(ticketDocument.version, 5)
    assert.equal(ticketDocument.title, legacyBoard.cards[0].title)
    assert.equal(ticketDocument.key, '')
    assert.equal(ticketDocument.waterLevel, '0')
    assert.equal(
      await git(root, 'log', '-1', '--format=%s'),
      'refactor(pavo): add structured assignees',
    )
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '2')

    await repository.overview()
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '2')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('migrates an empty version 4 board without a tracked tickets path', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-empty-migration-'))
  try {
    const config = {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    }
    const writer = new GitBoardRepository(config)
    const initial = await writer.overview()
    const emptied = await writer.mutate({
      expectedRevision: initial.revision,
      commitMessage: 'test: empty board',
      mutation: (board) => removeWork(board, { workId: board.works[0].id }),
    })
    assert.equal(emptied.board.works.length, 0)

    const boardPath = path.join(root, 'kanban', 'board.json')
    const legacy = JSON.parse(await readFile(boardPath, 'utf8'))
    legacy.version = 4
    delete legacy.workflows
    await writeFile(boardPath, `${JSON.stringify(legacy, null, 2)}\n`)
    await git(root, 'add', '--', 'kanban/board.json')
    await git(root, 'commit', '-m', 'test: prepare empty version 4 board')

    const migrated = await new GitBoardRepository(config).overview()
    assert.equal(migrated.format, 'split-current')
    assert.equal(migrated.board.works.length, 0)
    assert.equal(migrated.board.workflows[0].id, ROOT_WORKFLOW_ID)
    const currentDocument = JSON.parse(await readFile(boardPath, 'utf8'))
    assert.equal(currentDocument.version, 7)
    assert.equal(
      await git(root, 'log', '-1', '--format=%s'),
      'refactor(pavo): add structured assignees',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('migrates version 5 Work placements into template storage', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-v5-migration-'))
  try {
    const config = {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    }
    const writer = new GitBoardRepository(config)
    const initial = await writer.overview()
    const boardPath = path.join(root, 'kanban', 'board.json')
    const legacy = JSON.parse(await readFile(boardPath, 'utf8'))
    legacy.version = 5
    delete legacy.templates
    await writeFile(boardPath, `${JSON.stringify(legacy, null, 2)}\n`)
    await git(root, 'add', '--', 'kanban/board.json')
    await git(root, 'commit', '-m', 'test: prepare version 5 board')

    const migrated = await new GitBoardRepository(config).overview()
    assert.equal(migrated.board.works.length, initial.board.works.length)
    assert.deepEqual(migrated.board.templates, [])
    const current = JSON.parse(await readFile(boardPath, 'utf8'))
    assert.equal(current.version, 7)
    assert.deepEqual(current.templates, [])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('migrates legacy freeform Assignees without inventing Agent Presets', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-assignee-migration-'))
  try {
    const config = {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    }
    const writer = new GitBoardRepository(config)
    const initial = await writer.overview()
    const workId = initial.board.works[0].id
    const boardPath = path.join(root, 'kanban', 'board.json')
    const ticketPath = path.join(root, 'kanban', 'tickets', `${workId}.json`)
    const boardDocument = JSON.parse(await readFile(boardPath, 'utf8'))
    const ticketDocument = JSON.parse(await readFile(ticketPath, 'utf8'))
    boardDocument.version = 6
    ticketDocument.version = 4
    ticketDocument.assignee = 'Ada Lovelace'
    await writeFile(boardPath, `${JSON.stringify(boardDocument, null, 2)}\n`)
    await writeFile(ticketPath, `${JSON.stringify(ticketDocument, null, 2)}\n`)
    await git(root, 'add', '--', 'kanban/board.json', 'kanban/tickets')
    await git(root, 'commit', '-m', 'test: prepare legacy Assignee storage')

    const migrated = await new GitBoardRepository(config).overview()
    assert.deepEqual(migrated.board.works[0].assignee, {
      kind: 'unassigned',
      legacyLabel: 'Ada Lovelace',
    })
    const currentBoard = JSON.parse(await readFile(boardPath, 'utf8'))
    const currentTicket = JSON.parse(await readFile(ticketPath, 'utf8'))
    assert.equal(currentBoard.version, 7)
    assert.equal(currentTicket.version, 5)
    assert.deepEqual(currentTicket.assignee, {
      kind: 'unassigned',
      legacyLabel: 'Ada Lovelace',
    })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('persists the shared template library in board storage', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-templates-'))
  try {
    const repository = new GitBoardRepository({
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })
    const initial = await repository.overview()
    const saved = await repository.mutate({
      expectedRevision: initial.revision,
      commitMessage: 'feat(pavo): add template',
      mutation: (board) =>
        addTemplate(board, {
          id: 'welcome-template',
          kind: 'work',
          name: 'Welcome Work',
          content: workTemplateContentFromWork(board.works[0]),
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
    })
    assert.equal(saved.board.templates.length, 1)
    const reloaded = await new GitBoardRepository(repository.config).overview()
    assert.equal(reloaded.revision, saved.revision)
    assert.equal(reloaded.board.templates[0].name, 'Welcome Work')
    const document = JSON.parse(
      await readFile(path.join(root, 'kanban', 'board.json'), 'utf8'),
    )
    assert.equal(document.version, 7)
    assert.equal(document.templates[0].id, 'welcome-template')
    assert.equal(document.templates[0].content.workflowId, undefined)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('persists nested Workflows and Work membership in current storage', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-workflows-'))
  try {
    const repository = new GitBoardRepository({
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })
    const initial = await repository.overview()
    const nested = await repository.mutate({
      expectedRevision: initial.revision,
      commitMessage: 'feat(pavo): add nested workflow',
      mutation: (board) => {
        const withWorkflow = addWorkflow(board, {
          id: 'release',
          title: 'Release',
          parentWorkflowId: ROOT_WORKFLOW_ID,
        })
        return addConfiguredWork(
          withWorkflow,
          {
            id: 'release-work',
            title: 'Release Work',
            workflowId: 'release',
            columnId: 'backlog',
          },
          repository.config.columns,
        )
      },
    })
    const reloaded = await new GitBoardRepository(repository.config).overview()
    assert.equal(reloaded.revision, nested.revision)
    assert.equal(reloaded.board.workflows[1].parentWorkflowId, ROOT_WORKFLOW_ID)
    assert.equal(
      reloaded.board.works.find((work) => work.id === 'release-work').workflowId,
      'release',
    )
    const boardDocument = JSON.parse(
      await readFile(path.join(root, 'kanban', 'board.json'), 'utf8'),
    )
    const ticketDocument = JSON.parse(
      await readFile(path.join(root, 'kanban', 'tickets', 'release-work.json'), 'utf8'),
    )
    assert.equal(boardDocument.version, 7)
    assert.equal(boardDocument.workflows[0].id, ROOT_WORKFLOW_ID)
    assert.equal(ticketDocument.version, 5)
    assert.equal(ticketDocument.workflowId, 'release')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('persists cyclic Work dependencies and acknowledged WaterLevels', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-cycle-'))
  try {
    const repository = new GitBoardRepository({
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
    })
    const initial = await repository.overview()
    const created = await repository.mutate({
      expectedRevision: initial.revision,
      commitMessage: 'feat(pavo): add cyclic works',
      mutation: (board) => {
        let next = addConfiguredWork(
          board,
          {
            id: 'code',
            type: 'goal',
            title: 'Implement code',
            waterLevel: '12',
            columnId: 'in-progress',
          },
          repository.config.columns,
        )
        next = addConfiguredWork(
          next,
          {
            id: 'review',
            type: 'ongoing',
            title: 'Review code',
            waterLevel: '6',
            columnId: 'review',
          },
          repository.config.columns,
        )
        return next
      },
    })
    const cycled = await repository.mutate({
      expectedRevision: created.revision,
      commitMessage: 'feat(pavo): connect cyclic works',
      mutation: (board) => {
        const code = board.works.find((work) => work.id === 'code')
        const review = board.works.find((work) => work.id === 'review')
        let next = updateWork(board, {
          workId: code.id,
          ...code,
          upstreamWaterLevels: { review: '5' },
        })
        const currentReview = next.works.find((work) => work.id === review.id)
        next = updateWork(next, {
          workId: currentReview.id,
          ...currentReview,
          upstreamWaterLevels: { code: '12' },
        })
        return next
      },
    })
    const reloaded = await new GitBoardRepository(repository.config).overview()
    assert.equal(reloaded.revision, cycled.revision)
    assert.deepEqual(
      reloaded.board.works.find((work) => work.id === 'code').upstreamWaterLevels,
      { review: '5' },
    )
    assert.deepEqual(
      reloaded.board.works.find((work) => work.id === 'review').upstreamWaterLevels,
      { code: '12' },
    )
    const codeDocument = JSON.parse(
      await readFile(path.join(root, 'kanban', 'tickets', 'code.json'), 'utf8'),
    )
    assert.equal(codeDocument.version, 5)
    assert.equal(codeDocument.description, '')
    assert.deepEqual(codeDocument.upstreamWaterLevels, { review: '5' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('leaves the local branch unchanged when a detached push fails', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-push-failure-'))
  const remote = path.join(root, 'remote.git')
  const local = path.join(root, 'local')
  const hookPath = path.join(remote, 'hooks', 'pre-receive')

  try {
    await execFileAsync('git', [
      'init',
      '--bare',
      '--initial-branch=main',
      remote,
    ])
    await execFileAsync('git', ['init', '--initial-branch=main', local])
    await git(local, 'remote', 'add', 'origin', remote)

    const repository = new GitBoardRepository({
      repositoryPath: local,
      branch: 'main',
      remote: 'origin',
      autoPull: true,
      autoPush: true,
      initializeRepository: false,
      pollIntervalMs: 1_000,
      pullIntervalMs: 1_000,
    })
    const initial = await repository.overview()
    const initialHead = await git(local, 'rev-parse', 'HEAD')
    const initialSource = await readFile(
      path.join(local, 'kanban', 'board.json'),
      'utf8',
    )

    await writeFile(
      hookPath,
      '#!/bin/sh\necho "push denied for test" >&2\nexit 1\n',
    )
    await chmod(hookPath, 0o755)

    await assert.rejects(
      repository.mutate({
        expectedRevision: initial.revision,
        commitMessage: 'feat(kanban): add card',
        mutation: (board) =>
          addConfiguredWork(
            board,
            {
              id: 'retryable-card',
              title: 'Retryable mutation',
              columnId: 'backlog',
              createdAt: '2026-02-05T00:00:00.000Z',
            },
            repository.config.columns,
          ),
      }),
      (error) =>
        error instanceof RepositoryError &&
        error.status === 503 &&
        /before the local Pavo branch was changed/.test(error.message),
    )

    assert.equal(await git(local, 'rev-parse', 'HEAD'), initialHead)
    assert.equal(
      await readFile(path.join(local, 'kanban', 'board.json'), 'utf8'),
      initialSource,
    )
    assert.equal(await git(local, 'status', '--short'), '')
    assert.equal(await git(remote, 'rev-list', '--count', 'main'), '1')
    assert.equal(
      (await git(local, 'worktree', 'list', '--porcelain'))
        .split('\n')
        .filter((line) => line.startsWith('worktree ')).length,
      1,
    )

    await rm(hookPath)
    const retried = await repository.mutate({
      expectedRevision: initial.revision,
      commitMessage: 'feat(kanban): add card',
      mutation: (board) =>
        addConfiguredWork(
          board,
          {
            id: 'retryable-card',
            title: 'Retryable mutation',
            columnId: 'backlog',
            createdAt: '2026-02-05T00:00:00.000Z',
          },
          repository.config.columns,
        ),
    })

    assert.equal(
      retried.board.works.some((card) => card.id === 'retryable-card'),
      true,
    )
    assert.equal(await git(remote, 'rev-list', '--count', 'main'), '2')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
