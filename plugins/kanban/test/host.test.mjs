import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import test from 'node:test'
import { promisify } from 'node:util'

import { apply } from '../src/index.js'

const execFileAsync = promisify(execFile)

function requestFor(method, args = {}) {
  const request = Readable.from([
    Buffer.from(JSON.stringify({ method, args })),
  ])
  request.method = 'POST'
  request.headers = {
    'content-type': 'application/json',
    host: '127.0.0.1:3080',
    origin: 'http://127.0.0.1:3080',
    'sec-fetch-site': 'same-origin',
  }
  return request
}

function createResponse() {
  return {
    body: '',
    headers: undefined,
    status: undefined,
    writeHead(status, headers) {
      this.status = status
      this.headers = headers
    },
    setHeader() {},
    end(body) {
      this.body = body || ''
    },
  }
}

async function call(route, method, args = {}) {
  const response = createResponse()
  await route.handler(requestFor(method, args), response)
  return {
    response,
    payload: JSON.parse(response.body),
  }
}

async function git(repositoryPath, ...args) {
  const result = await execFileAsync('git', ['-C', repositoryPath, ...args], {
    encoding: 'utf8',
  })
  return result.stdout.trim()
}

function createContext(registerRoute) {
  return {
    get(service) {
      if (service === 'webRuntime') return { trustedHosts: [] }
      return undefined
    },
    webServer: {
      register(route) {
        registerRoute(route)
        return () => {}
      },
    },
    effect(setup) {
      return setup()
    },
  }
}

test('serves one global Git-backed board and commits every mutation', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-'))
  const siblingDirectory = path.join(root, 'other-plugin')
  await mkdir(siblingDirectory)
  await writeFile(path.join(siblingDirectory, 'state.json'), '{"untouched":true}\n')

  let route
  const ctx = createContext((registered) => {
    route = registered
  })

  try {
    await apply(ctx, {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
      pollIntervalMs: 1_000,
      pullIntervalMs: 1_000,
    })
    assert.equal(route.kind, 'exact')
    assert.equal(route.path, '/_dddrop/kanban')

    const blockedRequest = requestFor('overview')
    blockedRequest.headers.host = 'attacker.example'
    const blockedResponse = createResponse()
    await route.handler(blockedRequest, blockedResponse)
    assert.equal(blockedResponse.status, 403)

    const overview = await call(route, 'overview')
    assert.equal(overview.response.status, 200, overview.response.body)
    assert.equal(overview.payload.ok, true)
    assert.equal(overview.payload.value.board.cards.length, 1)
    assert.equal(overview.payload.value.board.columns[0].title, 'Backlog')
    assert.equal(overview.payload.value.pollIntervalMs, 1_000)

    const initialRevision = overview.payload.value.revision
    const added = await call(route, 'add', {
      title: 'Validate Git persistence',
      columnId: 'ready',
      expectedRevision: initialRevision,
    })
    assert.equal(added.response.status, 200, added.response.body)
    assert.equal(added.payload.value.board.cards.length, 2)
    const addedCard = added.payload.value.board.cards.find(
      (card) => card.title === 'Validate Git persistence',
    )
    assert.equal(addedCard.columnId, 'ready')

    const skippedMove = await call(route, 'move', {
      cardId: addedCard.id,
      columnId: 'review',
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(skippedMove.response.status, 400)
    assert.match(skippedMove.payload.error, /cannot move/)

    const edited = await call(route, 'update', {
      cardId: addedCard.id,
      title: 'Validate commits and pushes',
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(edited.response.status, 200, edited.response.body)

    const moved = await call(route, 'move', {
      cardId: addedCard.id,
      columnId: 'in-progress',
      expectedRevision: edited.payload.value.revision,
    })
    assert.equal(moved.response.status, 200, moved.response.body)

    const stale = await call(route, 'remove', {
      cardId: addedCard.id,
      expectedRevision: initialRevision,
    })
    assert.equal(stale.response.status, 409)
    assert.match(stale.payload.error, /changed since it was loaded/)

    const removed = await call(route, 'remove', {
      cardId: addedCard.id,
      expectedRevision: moved.payload.value.revision,
    })
    assert.equal(removed.response.status, 200, removed.response.body)
    assert.equal(removed.payload.value.board.cards.length, 1)

    const board = JSON.parse(
      await readFile(path.join(root, 'kanban', 'board.json'), 'utf8'),
    )
    assert.equal(board.version, 2)
    assert.equal(board.cards, undefined)
    assert.equal(board.tickets.length, 1)
    const welcomeTicket = JSON.parse(
      await readFile(
        path.join(
          root,
          'kanban',
          'tickets',
          `${board.tickets[0].id}.json`,
        ),
        'utf8',
      ),
    )
    assert.equal(welcomeTicket.id, board.tickets[0].id)
    assert.equal(welcomeTicket.title, 'Move this card to Ready to try the board.')
    await assert.rejects(
      readFile(
        path.join(root, 'kanban', 'tickets', `${addedCard.id}.json`),
        'utf8',
      ),
      { code: 'ENOENT' },
    )
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '5')
    assert.deepEqual(
      (await git(root, 'log', '--format=%s')).split('\n'),
      [
        'feat(kanban): remove card',
        'feat(kanban): move card',
        'feat(kanban): update card',
        'feat(kanban): add card',
        'feat(kanban): initialize board',
      ],
    )
    const changedPaths = async (revision) =>
      (await git(root, 'show', '--format=', '--name-only', revision))
        .split('\n')
        .filter(Boolean)
        .sort()
    assert.deepEqual(await changedPaths('HEAD~1'), ['kanban/board.json'])
    assert.deepEqual(await changedPaths('HEAD~2'), [
      `kanban/tickets/${addedCard.id}.json`,
    ])
    assert.deepEqual(await changedPaths('HEAD'), [
      'kanban/board.json',
      `kanban/tickets/${addedCard.id}.json`,
    ])
    assert.equal(
      await readFile(path.join(siblingDirectory, 'state.json'), 'utf8'),
      '{"untouched":true}\n',
    )
    assert.match(await git(root, 'status', '--short'), /\?\? other-plugin\//)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('rejects staged sibling data without committing it', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-staged-'))
  let route

  try {
    await apply(
      createContext((registered) => {
        route = registered
      }),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
      },
    )
    const overview = await call(route, 'overview')
    assert.equal(overview.response.status, 200, overview.response.body)

    await writeFile(path.join(root, 'sibling.txt'), 'staged\n')
    await git(root, 'add', 'sibling.txt')

    const added = await call(route, 'add', {
      title: 'Must not commit sibling data',
      columnId: 'backlog',
      expectedRevision: overview.payload.value.revision,
    })
    assert.equal(added.response.status, 409)
    assert.match(added.payload.error, /index contains staged changes/)
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '1')
    assert.equal(await git(root, 'diff', '--cached', '--name-only'), 'sibling.txt')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
