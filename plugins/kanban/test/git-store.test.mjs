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

import { addCard, createDefaultBoard } from '../src/board.js'
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
      `${peerBoard.tickets[0].id}.json`,
    )
    const peerTicket = JSON.parse(await readFile(peerTicketPath, 'utf8'))
    peerTicket.title = 'Changed in another clone'
    peerTicket.updatedAt = '2026-02-01T00:00:00.000Z'
    await writeFile(peerTicketPath, `${JSON.stringify(peerTicket, null, 2)}\n`)
    await git(
      peer,
      'add',
      '--',
      `kanban/tickets/${peerBoard.tickets[0].id}.json`,
    )
    await git(peer, 'commit', '-m', 'feat(kanban): update card remotely')
    await git(peer, 'push', 'origin', 'HEAD:main')

    const refreshedRepository = new GitBoardRepository(config)
    await assert.rejects(
      refreshedRepository.mutate({
        expectedRevision: initial.revision,
        commitMessage: 'feat(kanban): add card',
        mutation: (board) =>
          addCard(
            board,
            {
              id: 'stale-card',
              title: 'Stale mutation',
              columnId: 'backlog',
              createdAt: '2026-02-02T00:00:00.000Z',
            },
            { workflow: refreshedRepository.config.columns },
          ),
      }),
      StaleRevisionError,
    )

    const refreshed = await refreshedRepository.overview()
    assert.equal(refreshed.board.cards[0].title, 'Changed in another clone')
    const pushed = await refreshedRepository.mutate({
      expectedRevision: refreshed.revision,
      commitMessage: 'feat(kanban): add card',
      mutation: (board) =>
        addCard(
          board,
          {
            id: 'fresh-card',
            title: 'Fresh mutation',
            columnId: 'backlog',
            createdAt: '2026-02-03T00:00:00.000Z',
          },
          { workflow: refreshedRepository.config.columns },
        ),
    })

    assert.equal(
      pushed.board.cards.some((card) => card.id === 'fresh-card'),
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
          addCard(
            board,
            {
              id,
              title: `Concurrent ${id}`,
              columnId: 'backlog',
              createdAt: '2026-02-04T00:00:00.000Z',
            },
            { workflow: repository.config.columns },
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
    assert.equal(final.board.cards.length, 2)
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
    boardDocument.tickets[0].order = 2
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
    assert.equal(migrated.format, 'split')
    assert.equal(migrated.board.cards[0].id, legacyTicketId)

    const boardDocument = JSON.parse(
      await readFile(path.join(root, 'kanban', 'board.json'), 'utf8'),
    )
    const ticketDocument = JSON.parse(
      await readFile(
        path.join(root, 'kanban', 'tickets', legacyTicketFile),
        'utf8',
      ),
    )
    assert.equal(boardDocument.version, 2)
    assert.equal(boardDocument.cards, undefined)
    assert.deepEqual(boardDocument.tickets, [
      { id: legacyTicketId, columnId: 'backlog', order: 0 },
    ])
    assert.equal(ticketDocument.title, legacyBoard.cards[0].title)
    assert.equal(
      await git(root, 'log', '-1', '--format=%s'),
      'refactor(kanban): split ticket storage',
    )
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '2')

    await repository.overview()
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '2')
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
          addCard(
            board,
            {
              id: 'retryable-card',
              title: 'Retryable mutation',
              columnId: 'backlog',
              createdAt: '2026-02-05T00:00:00.000Z',
            },
            { workflow: repository.config.columns },
          ),
      }),
      (error) =>
        error instanceof RepositoryError &&
        error.status === 503 &&
        /before the local Kanban branch was changed/.test(error.message),
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
        addCard(
          board,
          {
            id: 'retryable-card',
            title: 'Retryable mutation',
            columnId: 'backlog',
            createdAt: '2026-02-05T00:00:00.000Z',
          },
          { workflow: repository.config.columns },
        ),
    })

    assert.equal(
      retried.board.cards.some((card) => card.id === 'retryable-card'),
      true,
    )
    assert.equal(await git(remote, 'rev-list', '--count', 'main'), '2')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
