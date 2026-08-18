import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
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
    'sec-fetch-mode': 'cors',
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

function createContext(registerRoute, registerTool) {
  const tools = registerTool
    ? {
        register(tool) {
          registerTool(tool)
          return () => {}
        },
      }
    : undefined
  return {
    get(service) {
      if (service === 'webRuntime') return { trustedHosts: [] }
      if (service === 'tools') return tools
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

  const routes = []
  const ctx = createContext((registered) => {
    routes.push(registered)
  })

  try {
    await apply(ctx, {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
      pollIntervalMs: 1_000,
      pullIntervalMs: 1_000,
      settingsPath: path.join(root, '.pavo-settings.json'),
    })
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    assert.equal(route.kind, 'exact')
    assert.equal(route.path, '/_dddrop/pavo')
    assert.equal(
      routes.some((candidate) => candidate.path === '/_dddrop/kanban'),
      true,
    )

    const blockedRequest = requestFor('overview')
    blockedRequest.headers.host = 'attacker.example'
    const blockedResponse = createResponse()
    await route.handler(blockedRequest, blockedResponse)
    assert.equal(blockedResponse.status, 403)

    const overview = await call(route, 'overview')
    assert.equal(overview.response.status, 200, overview.response.body)
    assert.equal(overview.payload.ok, true)
    assert.equal(overview.payload.value.board.works.length, 1)
    assert.equal(overview.payload.value.board.workflows[0].title, 'Root Workflow')
    assert.equal(overview.payload.value.board.works[0].workflowId, 'root')
    assert.equal(overview.payload.value.board.columns[0].title, 'Backlog')
    assert.equal(overview.payload.value.pollIntervalMs, 1_000)

    const initialRevision = overview.payload.value.revision
    const welcomeWorkId = overview.payload.value.board.works[0].id
    const configured = await call(route, 'addProject', {
      project: 'Harness',
      expectedRevision: initialRevision,
    })
    assert.equal(configured.response.status, 200, configured.response.body)
    assert.deepEqual(configured.payload.value.board.projects, ['Harness'])

    const added = await call(route, 'add', {
      project: 'Harness',
      key: 'DSH-101',
      title: 'Validate Git persistence',
      body: 'Ensure every card field is persisted.',
      assignee: 'Ada',
      waterLevel: '123456789012345678901234567890',
      columnId: 'ready',
      expectedRevision: configured.payload.value.revision,
    })
    assert.equal(added.response.status, 200, added.response.body)
    assert.equal(added.payload.value.board.works.length, 2)
    const addedCard = added.payload.value.board.works.find(
      (card) => card.title === 'Validate Git persistence',
    )
    assert.equal(addedCard.columnId, 'ready')
    assert.equal(addedCard.project, 'Harness')
    assert.equal(addedCard.key, 'DSH-101')
    assert.equal(addedCard.type, 'goal')
    assert.equal(addedCard.description, 'Ensure every card field is persisted.')
    assert.equal(
      added.payload.value.board.cards.find((card) => card.id === addedCard.id).body,
      'Ensure every card field is persisted.',
    )
    assert.deepEqual(addedCard.upstreamWaterLevels, {})
    assert.equal(addedCard.assignee, 'Ada')
    assert.equal(addedCard.waterLevel, '123456789012345678901234567890')
    assert.match(
      addedCard.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
    )

    const referencedProject = await call(route, 'removeProject', {
      project: 'Harness',
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(referencedProject.response.status, 400)
    assert.match(referencedProject.payload.error, /still used/)

    const skippedMove = await call(route, 'move', {
      cardId: addedCard.id,
      columnId: 'review',
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(skippedMove.response.status, 400)
    assert.match(skippedMove.payload.error, /cannot move/)

    const edited = await call(route, 'updateWork', {
      workId: addedCard.id,
      type: 'ongoing',
      project: 'Harness',
      key: 'DSH-101A',
      title: 'Validate commits and pushes',
      description: 'Ensure every Work field update is persisted.',
      assignee: 'Grace',
      waterLevel: '999999999999999999999999999999.5',
      upstreamWaterLevels: { [welcomeWorkId]: '0' },
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(edited.response.status, 200, edited.response.body)
    const editedWork = edited.payload.value.board.works.find(
      (work) => work.id === addedCard.id,
    )
    assert.equal(editedWork.type, 'ongoing')
    assert.deepEqual(editedWork.upstreamWaterLevels, { [welcomeWorkId]: '0' })

    const selfDependency = await call(route, 'updateWork', {
      workId: addedCard.id,
      upstreamWaterLevels: { [addedCard.id]: '1' },
      expectedRevision: edited.payload.value.revision,
    })
    assert.equal(selfDependency.response.status, 400)
    assert.match(selfDependency.payload.error, /must not depend on itself/)

    const moved = await call(route, 'moveWork', {
      workId: addedCard.id,
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

    const removed = await call(route, 'removeWork', {
      workId: addedCard.id,
      expectedRevision: moved.payload.value.revision,
    })
    assert.equal(removed.response.status, 200, removed.response.body)
    assert.equal(removed.payload.value.board.works.length, 1)

    const board = JSON.parse(
      await readFile(path.join(root, 'kanban', 'board.json'), 'utf8'),
    )
    assert.equal(board.version, 5)
    assert.deepEqual(board.projects, ['Harness'])
    assert.equal(board.cards, undefined)
    assert.equal(board.tickets, undefined)
    assert.equal(board.works.length, 1)
    const welcomeTicket = JSON.parse(
      await readFile(
        path.join(
          root,
          'kanban',
          'tickets',
          `${board.works[0].id}.json`,
        ),
        'utf8',
      ),
    )
    assert.equal(welcomeTicket.version, 4)
    assert.equal(welcomeTicket.id, board.works[0].id)
    assert.equal(welcomeTicket.type, 'goal')
    assert.equal(welcomeTicket.description, '')
    assert.deepEqual(welcomeTicket.upstreamWaterLevels, {})
    assert.equal(welcomeTicket.key, 'WELCOME')
    assert.equal(welcomeTicket.waterLevel, '0')
    assert.equal(welcomeTicket.title, 'Move this Work to Ready to try the board.')
    await assert.rejects(
      readFile(
        path.join(root, 'kanban', 'tickets', `${addedCard.id}.json`),
        'utf8',
      ),
      { code: 'ENOENT' },
    )
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '6')
    assert.deepEqual(
      (await git(root, 'log', '--format=%s')).split('\n'),
      [
        'feat(pavo): remove work',
        'feat(pavo): move work',
        'feat(pavo): update work',
        'feat(pavo): add work',
        'feat(pavo): add project',
        'feat(pavo): initialize board',
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

test('serves nested Workflow mutations with optimistic revisions', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-workflow-api-'))
  const routes = []
  try {
    await apply(createContext((registered) => routes.push(registered)), {
      repositoryPath: root,
      autoPull: false,
      autoPush: false,
      initializeRepository: true,
      settingsPath: path.join(root, '.pavo-settings.json'),
    })
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const overview = await call(route, 'overview')
    const created = await call(route, 'addWorkflow', {
      title: 'Release',
      parentWorkflowId: 'root',
      expectedRevision: overview.payload.value.revision,
    })
    assert.equal(created.response.status, 200, created.response.body)
    const workflow = created.payload.value.board.workflows.find(
      (candidate) => candidate.title === 'Release',
    )
    assert.equal(workflow.parentWorkflowId, 'root')

    const renamed = await call(route, 'updateWorkflow', {
      workflowId: workflow.id,
      title: 'Release 1.0',
      expectedRevision: created.payload.value.revision,
    })
    assert.equal(renamed.response.status, 200, renamed.response.body)
    assert.equal(
      renamed.payload.value.board.workflows.find(
        (candidate) => candidate.id === workflow.id,
      ).title,
      'Release 1.0',
    )

    const stale = await call(route, 'removeWorkflow', {
      workflowId: workflow.id,
      expectedRevision: overview.payload.value.revision,
    })
    assert.equal(stale.response.status, 409)
    const removed = await call(route, 'removeWorkflow', {
      workflowId: workflow.id,
      expectedRevision: renamed.payload.value.revision,
    })
    assert.equal(removed.response.status, 200, removed.response.body)
    assert.equal(removed.payload.value.board.workflows.length, 1)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('registers passive Agent tools for reading and updating Works', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-tools-'))
  const routes = []
  const tools = []
  try {
    await apply(
      createContext(
        (registered) => routes.push(registered),
        (tool) => tools.push(tool),
      ),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath: path.join(root, '.pavo-settings.json'),
      },
    )
    assert.deepEqual(
      tools.map((tool) => tool.name),
      [
        'pavo_list_works',
        'pavo_read_work',
        'pavo_update_work',
        'pavo_update_workflow',
      ],
    )
    const listTool = tools.find((tool) => tool.name === 'pavo_list_works')
    const readTool = tools.find((tool) => tool.name === 'pavo_read_work')
    const updateTool = tools.find((tool) => tool.name === 'pavo_update_work')
    const updateWorkflowTool = tools.find(
      (tool) => tool.name === 'pavo_update_workflow',
    )
    const listed = await listTool.execute({})
    assert.equal(listed.total, 1)
    assert.equal(listed.works[0].type, 'goal')
    assert.equal(listed.workflow[0].id, 'backlog')
    assert.deepEqual(listed.projects, [])
    assert.equal(listed.workflows[0].title, 'Root Workflow')
    assert.equal(listed.works[0].workflowId, 'root')
    assert.match(listTool.output.render({}, listed)[0].text, new RegExp(listed.works[0].id))

    assert.throws(
      () => readTool.execute({}),
      /arguments.workId is required/,
    )
    assert.throws(
      () => listTool.execute({ unsupported: true }),
      /arguments.unsupported is not allowed/,
    )

    const read = await readTool.execute({ workId: listed.works[0].id })
    assert.equal(read.work.description, '')
    assert.deepEqual(read.upstreams, [])
    assert.deepEqual(read.workflowPath.map((workflow) => workflow.id), ['root'])
    const renderedRead = readTool.output.render({}, read)[0].text
    assert.match(renderedRead, /"description": ""/)
    assert.match(renderedRead, new RegExp(read.revision))

    const updated = await updateTool.execute({
      action: 'edit',
      expectedRevision: read.revision,
      workId: read.work.id,
      type: 'ongoing',
      description: 'Maintain this Work continuously.',
      waterLevel: '1000000000000000000000000000000.25',
    })
    assert.equal(updated.work.type, 'ongoing')
    assert.equal(updated.work.description, 'Maintain this Work continuously.')
    assert.equal(updated.work.waterLevel, '1000000000000000000000000000000.25')

    await assert.rejects(
      updateTool.execute({
        action: 'edit',
        expectedRevision: read.revision,
        workId: read.work.id,
        description: 'Blind stale retry',
      }),
      /changed since it was loaded/,
    )

    const workflowCreated = await updateWorkflowTool.execute({
      action: 'create',
      expectedRevision: updated.revision,
      title: 'Release',
      parentWorkflowId: 'root',
    })
    assert.equal(workflowCreated.workflow.title, 'Release')
    const assigned = await updateTool.execute({
      action: 'edit',
      expectedRevision: workflowCreated.revision,
      workId: read.work.id,
      workflowId: workflowCreated.workflow.id,
    })
    assert.equal(assigned.work.workflowId, workflowCreated.workflow.id)
    const emptyFieldsCreated = await updateTool.execute({
      action: 'create',
      expectedRevision: assigned.revision,
      title: 'Work without Project or KEY',
    })
    assert.equal(emptyFieldsCreated.work.project, '')
    assert.equal(emptyFieldsCreated.work.key, '')
    await assert.rejects(
      updateWorkflowTool.execute({
        action: 'delete',
        expectedRevision: emptyFieldsCreated.revision,
        workflowId: workflowCreated.workflow.id,
      }),
      /still contains Works/,
    )
    assert.match(
      updateWorkflowTool.output.render({}, workflowCreated)[0].text,
      new RegExp(workflowCreated.workflow.id),
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('persists repository settings and restores the active checkout', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-settings-'))
  const firstRepository = path.join(root, 'first')
  const secondRepository = path.join(root, 'second')
  const settingsPath = path.join(root, 'repository.json')
  const routes = []

  try {
    await apply(
      createContext((registered) => routes.push(registered)),
      {
        repositoryPath: firstRepository,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath,
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const initial = await call(route, 'overview')
    assert.equal(initial.response.status, 200, initial.response.body)
    assert.equal(
      initial.payload.value.repository.repositoryPath,
      firstRepository,
    )

    const blockedSettingsRequest = requestFor('saveRepository', {
      expectedRepositoryRevision: initial.payload.value.repositoryRevision,
      repository: { repositoryPath: secondRepository },
    })
    delete blockedSettingsRequest.headers['sec-fetch-mode']
    const blockedSettingsResponse = createResponse()
    await route.handler(blockedSettingsRequest, blockedSettingsResponse)
    assert.equal(blockedSettingsResponse.status, 403)
    await assert.rejects(access(secondRepository), { code: 'ENOENT' })

    const saved = await call(route, 'saveRepository', {
      expectedRepositoryRevision: initial.payload.value.repositoryRevision,
      repository: {
        repositoryPath: secondRepository,
        dataDirectory: 'kanban',
        branch: 'main',
        remote: 'origin',
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        pollIntervalMs: 1_500,
        pullIntervalMs: 2_500,
      },
    })
    assert.equal(saved.response.status, 200, saved.response.body)
    assert.equal(saved.payload.value.repository.repositoryPath, secondRepository)
    assert.equal(saved.payload.value.repository.pollIntervalMs, 1_500)
    await assert.rejects(access(secondRepository), { code: 'ENOENT' })

    const activated = await call(route, 'overview')
    assert.equal(activated.response.status, 200, activated.response.body)
    assert.equal(activated.payload.value.pollIntervalMs, 1_500)
    await access(secondRepository)

    const persisted = JSON.parse(await readFile(settingsPath, 'utf8'))
    assert.equal(persisted.version, 1)
    assert.equal(persisted.repository.repositoryPath, secondRepository)

    const restartedRoutes = []
    await apply(
      createContext((registered) => restartedRoutes.push(registered)),
      {
        repositoryPath: firstRepository,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath,
      },
    )
    const restartedRoute = restartedRoutes.find(
      (candidate) => candidate.path === '/_dddrop/pavo',
    )
    const restarted = await call(restartedRoute, 'overview')
    assert.equal(restarted.response.status, 200, restarted.response.body)
    assert.equal(
      restarted.payload.value.repository.repositoryPath,
      secondRepository,
    )
    assert.equal(restarted.payload.value.pollIntervalMs, 1_500)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('falls back to profile defaults when stored settings are invalid', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-invalid-settings-'))
  const repositoryPath = path.join(root, 'repository')
  const settingsPath = path.join(root, 'repository.json')
  const routes = []

  try {
    await writeFile(settingsPath, '{invalid json\n')
    await apply(
      createContext((registered) => routes.push(registered)),
      {
        repositoryPath,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath,
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const settings = await call(route, 'repositorySettings')
    assert.equal(settings.response.status, 200, settings.response.body)
    assert.equal(settings.payload.value.repository.repositoryPath, repositoryPath)
    assert.match(settings.payload.value.settingsWarning, /profile defaults/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('rejects staged sibling data without committing it', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-kanban-staged-'))
  const routes = []

  try {
    await apply(
      createContext((registered) => {
        routes.push(registered)
      }),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath: path.join(root, '.pavo-settings.json'),
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
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
