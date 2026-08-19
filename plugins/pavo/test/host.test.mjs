import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { readFileSync } from 'node:fs'
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

import { GitBoardRepository } from '../src/git-store.js'
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

function createContext(
  registerRoute,
  registerTool,
  agentPresets,
  workspaceRegistry = { list: () => [], get: () => undefined },
  runServices = {},
) {
  const resolvedAgentPresets = agentPresets ?? {
    async list() {
      return []
    },
    async resolve(id) {
      throw new Error(`Unknown Agent Preset: ${id}`)
    },
    async mount() {},
  }
  const tools = registerTool
    ? {
        register(tool) {
          registerTool(tool)
          return () => {}
        },
      }
    : undefined
  return {
    workspaceRegistry,
    agents: runServices.agents ?? {
      async create() {
        throw new Error('Agent creation was not expected in this test.')
      },
    },
    agentPresets: resolvedAgentPresets,
    agentDefaultModel: runServices.agentDefaultModel ?? {
      currentSelection: () => ({ provider: 'test', model: 'test-model' }),
    },
    sessionTitle: runServices.sessionTitle ?? { rename() {} },
    get(service) {
      if (service === 'webRuntime') return { trustedHosts: [] }
      if (service === 'tools') return tools
      if (service === 'agentPresets') return resolvedAgentPresets
      return undefined
    },
    webServer: {
      register(route) {
        registerRoute(route)
        return () => {}
      },
    },
    effect(setup) {
      const dispose = setup()
      if (typeof dispose === 'function') runServices.disposers?.push(dispose)
      return dispose
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
    const legacyProjectRequest = await call(route, 'addProject', {
      project: 'Harness',
      expectedRevision: initialRevision,
    })
    assert.equal(legacyProjectRequest.response.status, 400)
    assert.match(legacyProjectRequest.payload.error, /replaced by DSH Workspace/)

    const added = await call(route, 'add', {
      workspaceId: 'workspace-harness',
      key: 'DSH-101',
      title: 'Validate Git persistence',
      body: 'Ensure every card field is persisted.',
      assignee: { kind: 'human' },
      waterLevel: '123456789012345678901234567890',
      columnId: 'ready',
      expectedRevision: initialRevision,
    })
    assert.equal(added.response.status, 200, added.response.body)
    assert.equal(added.payload.value.board.works.length, 2)
    const addedCard = added.payload.value.board.works.find(
      (card) => card.title === 'Validate Git persistence',
    )
    assert.equal(addedCard.columnId, 'ready')
    assert.equal(addedCard.workspaceId, 'workspace-harness')
    assert.equal(addedCard.key, 'DSH-101')
    assert.equal(addedCard.type, 'goal')
    assert.equal(addedCard.description, 'Ensure every card field is persisted.')
    assert.equal(
      added.payload.value.board.cards.find((card) => card.id === addedCard.id).body,
      'Ensure every card field is persisted.',
    )
    assert.deepEqual(addedCard.upstreamWaterLevels, {})
    assert.deepEqual(addedCard.assignee, { kind: 'human' })
    assert.equal(addedCard.waterLevel, '123456789012345678901234567890')
    assert.match(
      addedCard.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
    )

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
      workspaceId: 'workspace-harness',
      key: 'DSH-101A',
      title: 'Validate commits and pushes',
      description: 'Ensure every Work field update is persisted.',
      assignee: { kind: 'agent-preset', presetId: 'cordis' },
      waterLevel: '999999999999999999999999999999.5',
      upstreamWaterLevels: { [welcomeWorkId]: '0' },
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(edited.response.status, 200, edited.response.body)
    const editedWork = edited.payload.value.board.works.find(
      (work) => work.id === addedCard.id,
    )
    assert.equal(editedWork.type, 'ongoing')
    assert.deepEqual(editedWork.assignee, {
      kind: 'agent-preset',
      presetId: 'cordis',
    })
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
    assert.equal(board.version, 11)
    assert.deepEqual(board.autoMode, { enabled: false })
    assert.deepEqual(board.columns[0].allowedTransitions, ['ready'])
    assert.equal(board.projects, undefined)
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
    assert.equal(welcomeTicket.version, 7)
    assert.equal(welcomeTicket.id, board.works[0].id)
    assert.equal(welcomeTicket.type, 'goal')
    assert.equal(welcomeTicket.sessionId, '')
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
    assert.equal(await git(root, 'rev-list', '--count', 'HEAD'), '5')
    assert.deepEqual(
      (await git(root, 'log', '--format=%s')).split('\n'),
      [
        'feat(pavo): remove work',
        'feat(pavo): move work',
        'feat(pavo): update work',
        'feat(pavo): add work',
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

test('serves shared template CRUD and passive instantiation', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-template-api-'))
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
    const sourceWorkId = overview.payload.value.board.works[0].id
    const created = await call(route, 'addTemplate', {
      kind: 'work',
      name: 'Welcome template',
      sourceWorkId,
      expectedRevision: overview.payload.value.revision,
    })
    assert.equal(created.response.status, 200, created.response.body)
    const template = created.payload.value.board.templates[0]
    assert.equal(template.kind, 'work')
    assert.equal(template.content.title, overview.payload.value.board.works[0].title)

    const renamed = await call(route, 'updateTemplate', {
      templateId: template.id,
      name: 'Reusable welcome',
      expectedRevision: created.payload.value.revision,
    })
    assert.equal(renamed.response.status, 200, renamed.response.body)
    assert.equal(renamed.payload.value.board.templates[0].name, 'Reusable welcome')

    const applied = await call(route, 'instantiateTemplate', {
      templateId: template.id,
      targetWorkflowId: 'root',
      expectedRevision: renamed.payload.value.revision,
    })
    assert.equal(applied.response.status, 200, applied.response.body)
    assert.equal(applied.payload.value.board.works.length, 2)
    assert.notEqual(applied.payload.value.board.works[1].id, sourceWorkId)
    assert.deepEqual(applied.payload.value.board.works[1].upstreamWaterLevels, {})

    const removed = await call(route, 'removeTemplate', {
      templateId: template.id,
      expectedRevision: applied.payload.value.revision,
    })
    assert.equal(removed.response.status, 200, removed.response.body)
    assert.deepEqual(removed.payload.value.board.templates, [])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('serves a sanitized Agent Preset roster for Assignee selection', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-agent-presets-'))
  const routes = []
  const agentPresets = {
    async list() {
      return [
        {
          id: 'standard',
          name: 'Standard',
          description: 'General-purpose Agent.',
          trust: 'system',
          path: '/private/deployment/standard/cordis.yml',
        },
        {
          id: 'broken-preset',
          trust: 'user',
          path: '/private/user/broken/cordis.yml',
          broken: 'Composition is invalid.',
        },
      ]
    },
  }
  try {
    await apply(
      createContext(
        (registered) => routes.push(registered),
        undefined,
        agentPresets,
      ),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath: path.join(root, '.pavo-settings.json'),
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const response = await call(route, 'agentPresets')
    assert.equal(response.response.status, 200, response.response.body)
    assert.deepEqual(response.payload.value.presets, [
      {
        id: 'standard',
        name: 'Standard',
        description: 'General-purpose Agent.',
        trust: 'system',
      },
      {
        id: 'broken-preset',
        trust: 'user',
        broken: true,
      },
    ])
    assert.equal(JSON.stringify(response.payload.value).includes('/private/'), false)
    assert.equal(
      JSON.stringify(response.payload.value).includes('Composition is invalid.'),
      false,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('serves sanitized DSH Workspaces without paths or session IDs', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-workspaces-'))
  const routes = []
  const workspaceRegistry = {
    list() {
      return [
        {
          id: 'workspace-one',
          title: 'Harness',
          path: '/private/harness',
          sessionIds: ['private-session'],
          async status() {
            return 'ok'
          },
        },
        {
          id: 'workspace-missing',
          title: 'Moved Workspace',
          path: '/private/missing',
          sessionIds: [],
          async status() {
            return 'missing-dir'
          },
        },
      ]
    },
  }
  try {
    await apply(
      createContext(
        (registered) => routes.push(registered),
        undefined,
        undefined,
        workspaceRegistry,
      ),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath: path.join(root, '.pavo-settings.json'),
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const response = await call(route, 'workspaces')
    assert.equal(response.response.status, 200, response.response.body)
    assert.deepEqual(response.payload.value.workspaces, [
      { id: 'workspace-one', title: 'Harness' },
      {
        id: 'workspace-missing',
        title: 'Moved Workspace',
        unavailable: true,
      },
    ])
    const payload = JSON.stringify(response.payload.value)
    assert.equal(payload.includes('/private/'), false)
    assert.equal(payload.includes('private-session'), false)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('runs a Ready Agent-assigned Work in its DSH Workspace', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-run-work-'))
  const routes = []
  const lifecycle = []
  let createCount = 0
  let resumeCount = 0
  let createdOptions
  let resumedOptions
  let promptedMessage
  const liveAgents = new Map()
  let linkedSessionId = ''
  let rejectTitle = true
  const workspace = {
    id: 'workspace-run',
    title: 'Run Workspace',
    path: root,
    sessionIds: [],
    async status() {
      return 'ok'
    },
    async attachSession(sessionId) {
      lifecycle.push(`attach:${sessionId}`)
      linkedSessionId = sessionId
    },
    async detachSession(sessionId) {
      lifecycle.push(`detach:${sessionId}`)
    },
  }
  const workspaceRegistry = {
    list: () => [workspace],
    get: (id) => (id === workspace.id ? workspace : undefined),
    async archiveSession(sessionId) {
      lifecycle.push(`archive:${sessionId}`)
    },
  }
  const agentPresets = {
    async list() {
      return [
        {
          id: 'standard',
          name: 'Standard',
          description: 'Test preset',
          trust: 'user',
        },
      ]
    },
    async resolve(id) {
      assert.equal(id, 'standard')
      return { id: 'standard', name: 'Standard' }
    },
    async mount(agentCtx, id) {
      lifecycle.push(`mount:${id}`)
      assert.equal(agentCtx.agent.session.header.agentPreset, id)
    },
  }
  const agents = {
    async create(options) {
      createCount += 1
      createdOptions = options
      const session = {
        id: options.sessionId,
        events: [],
        header: {
          cwd: options.meta.cwd,
          agentPreset: options.meta.agentPreset,
        },
      }
      const agent = {
        id: options.sessionId,
        session,
        async whenIdle() {
          lifecycle.push('idle')
        },
        followup(message) {
          const ticket = JSON.parse(
            readFileSync(
              path.join(
                root,
                'kanban',
                'tickets',
                `${configuredWorkId}.json`,
              ),
              'utf8',
            ),
          )
          assert.equal(ticket.sessionId, options.sessionId)
          lifecycle.push('followup')
          promptedMessage = message
        },
      }
      const eventNames = []
      await options.setup({
        agent,
        on(name) {
          eventNames.push(name)
          return () => {}
        },
      })
      lifecycle.push(`events:${eventNames.sort().join(',')}`)
      liveAgents.set(agent.id, agent)
      return {
        agent,
        async dispose() {
          lifecycle.push(`dispose:${options.sessionId}`)
          liveAgents.delete(agent.id)
        },
      }
    },
    get(sessionId) {
      return liveAgents.get(sessionId)
    },
    async resume(options) {
      resumeCount += 1
      resumedOptions = options
      const session = {
        id: options.resumeSessionId,
        events: [],
        header: { cwd: root, agentPreset: 'standard' },
      }
      const agent = {
        id: options.resumeSessionId,
        session,
        async whenIdle() {
          lifecycle.push('idle')
        },
        followup(message) {
          const ticket = JSON.parse(
            readFileSync(
              path.join(
                root,
                'kanban',
                'tickets',
                `${configuredWorkId}.json`,
              ),
              'utf8',
            ),
          )
          assert.equal(ticket.sessionId, options.resumeSessionId)
          lifecycle.push('followup')
          promptedMessage = message
        },
      }
      const eventNames = []
      await options.setup({
        agent,
        on(name) {
          eventNames.push(name)
          return () => {}
        },
      })
      lifecycle.push(`resume-events:${eventNames.sort().join(',')}`)
      liveAgents.set(agent.id, agent)
      return {
        agent,
        async dispose() {
          lifecycle.push(`resume-dispose:${options.resumeSessionId}`)
          liveAgents.delete(agent.id)
        },
      }
    },
  }
  let configuredWorkId = ''
  try {
    await apply(
      createContext(
        (registered) => routes.push(registered),
        undefined,
        agentPresets,
        workspaceRegistry,
        {
          agents,
          agentDefaultModel: {
            currentSelection: () => ({
              provider: 'test-provider',
              model: 'test-model',
              reasoningEffort: 'high',
            }),
          },
          sessionTitle: {
            rename(session, title) {
              lifecycle.push(`title:${title}`)
              assert.equal(session.id, linkedSessionId)
              if (rejectTitle) throw new Error('test title failure')
            },
          },
        },
      ),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath: path.join(root, '.pavo-settings.json'),
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const initial = await call(route, 'overview')
    configuredWorkId = initial.payload.value.board.works[0].id
    const configured = await call(route, 'updateWork', {
      workId: configuredWorkId,
      workspaceId: workspace.id,
      assignee: { kind: 'agent-preset', presetId: 'standard' },
      description: 'Execute this exact Pavo Work prompt.',
      expectedRevision: initial.payload.value.revision,
    })
    const ready = await call(route, 'moveWork', {
      workId: configuredWorkId,
      columnId: 'ready',
      expectedRevision: configured.payload.value.revision,
    })
    const failed = await call(route, 'runWork', {
      workId: configuredWorkId,
      expectedRevision: ready.payload.value.revision,
    })
    assert.equal(failed.response.status, 500)
    assert.equal(createCount, 1)
    assert.equal(lifecycle.some((entry) => entry.startsWith('detach:')), true)
    assert.equal(lifecycle.some((entry) => entry.startsWith('dispose:')), true)
    assert.equal(lifecycle.some((entry) => entry.startsWith('archive:')), true)
    const afterFailure = await call(route, 'overview')
    const unclaimed = afterFailure.payload.value.board.works.find(
      (work) => work.id === configuredWorkId,
    )
    assert.equal(unclaimed.columnId, 'ready')
    assert.equal(unclaimed.sessionId, '')
    assert.equal(promptedMessage, undefined)
    rejectTitle = false

    const [started, concurrent, staleConcurrent] = await Promise.all([
      call(route, 'runWork', {
        workId: configuredWorkId,
        expectedRevision: ready.payload.value.revision,
      }),
      call(route, 'runWork', {
        workId: configuredWorkId,
        expectedRevision: ready.payload.value.revision,
      }),
      call(route, 'runWork', {
        workId: configuredWorkId,
        expectedRevision: 'stale-concurrent-revision',
      }),
    ])
    assert.equal(started.response.status, 200, started.response.body)
    assert.equal(concurrent.response.status, 200, concurrent.response.body)
    assert.equal(staleConcurrent.response.status, 409)
    assert.match(staleConcurrent.payload.error, /changed since it was loaded/)
    assert.equal(
      concurrent.payload.value.run.sessionId,
      started.payload.value.run.sessionId,
    )
    assert.equal(createCount, 2)
    const runningWork = started.payload.value.board.works.find(
      (work) => work.id === configuredWorkId,
    )
    assert.equal(runningWork.columnId, 'in-progress')
    assert.equal(runningWork.sessionId, started.payload.value.run.sessionId)
    assert.equal(started.payload.value.run.workspaceId, workspace.id)
    assert.equal(started.payload.value.run.agentPresetId, 'standard')
    assert.equal(started.payload.value.run.mode, 'created')
    assert.equal(createdOptions.sessionId, runningWork.sessionId)
    assert.deepEqual(createdOptions.meta, {
      cwd: root,
      agentPreset: 'standard',
    })
    assert.deepEqual(createdOptions.agentOptions, {
      provider: 'test-provider',
      model: 'test-model',
      reasoningEffort: 'high',
    })
    assert.equal(lifecycle.includes(`attach:${runningWork.sessionId}`), true)
    assert.equal(lifecycle.includes('mount:standard'), true)
    assert.equal(lifecycle.includes('events:agent/request,system-prompt/assemble'), true)
    assert.equal(lifecycle.includes('title:Move this Work to Ready to try the board.'), true)
    assert.deepEqual(promptedMessage.role, 'user')
    assert.deepEqual(promptedMessage.source, { kind: 'user' })
    assert.deepEqual(promptedMessage.content, [
      { type: 'text', text: 'Execute this exact Pavo Work prompt.' },
    ])
    assert.match(
      promptedMessage.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
    )
    const repeated = await call(route, 'runWork', {
      workId: configuredWorkId,
      expectedRevision: started.payload.value.revision,
    })
    assert.equal(repeated.response.status, 400)
    assert.match(repeated.payload.error, /must be Ready/)

    const goalReadyAgain = await call(route, 'moveWork', {
      workId: configuredWorkId,
      columnId: 'ready',
      expectedRevision: started.payload.value.revision,
    })
    const goalRerun = await call(route, 'runWork', {
      workId: configuredWorkId,
      expectedRevision: goalReadyAgain.payload.value.revision,
    })
    assert.equal(goalRerun.response.status, 200, goalRerun.response.body)
    assert.equal(goalRerun.payload.value.run.mode, 'created')
    assert.notEqual(
      goalRerun.payload.value.run.sessionId,
      started.payload.value.run.sessionId,
    )
    assert.equal(createCount, 3)

    const ongoing = await call(route, 'updateWork', {
      workId: configuredWorkId,
      type: 'ongoing',
      expectedRevision: goalRerun.payload.value.revision,
    })
    const ongoingReady = await call(route, 'moveWork', {
      workId: configuredWorkId,
      columnId: 'ready',
      expectedRevision: ongoing.payload.value.revision,
    })
    const ongoingRerun = await call(route, 'runWork', {
      workId: configuredWorkId,
      expectedRevision: ongoingReady.payload.value.revision,
    })
    assert.equal(ongoingRerun.response.status, 200, ongoingRerun.response.body)
    assert.equal(ongoingRerun.payload.value.run.mode, 'reused')
    assert.equal(
      ongoingRerun.payload.value.run.sessionId,
      goalRerun.payload.value.run.sessionId,
    )
    assert.equal(createCount, 3)
    assert.equal(resumeCount, 0)

    liveAgents.delete(ongoingRerun.payload.value.run.sessionId)
    const resumedReady = await call(route, 'moveWork', {
      workId: configuredWorkId,
      columnId: 'ready',
      expectedRevision: ongoingRerun.payload.value.revision,
    })
    const resumed = await call(route, 'runWork', {
      workId: configuredWorkId,
      expectedRevision: resumedReady.payload.value.revision,
    })
    assert.equal(resumed.response.status, 200, resumed.response.body)
    assert.equal(resumed.payload.value.run.mode, 'reused')
    assert.equal(
      resumed.payload.value.run.sessionId,
      ongoingRerun.payload.value.run.sessionId,
    )
    assert.equal(createCount, 3)
    assert.equal(resumeCount, 1)
    assert.equal(
      resumedOptions.resumeSessionId,
      ongoingRerun.payload.value.run.sessionId,
    )
    assert.deepEqual(resumedOptions.agentOptions, {
      provider: 'test-provider',
      model: 'test-model',
      reasoningEffort: 'high',
    })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('automatically runs an eligible Agent-assigned Backlog Work', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-auto-run-'))
  const routes = []
  const disposers = []
  let createCount = 0
  const promptedMessages = []
  let releaseFirstIdle
  const firstIdle = new Promise((resolve) => {
    releaseFirstIdle = resolve
  })
  let resolveSecondCreated
  const secondCreated = new Promise((resolve) => {
    resolveSecondCreated = resolve
  })
  let resolvePrompted
  const prompted = new Promise((resolve) => {
    resolvePrompted = resolve
  })
  const workspace = {
    id: 'workspace-auto',
    title: 'Automatic Workspace',
    path: root,
    sessionIds: [],
    async status() {
      return 'ok'
    },
    async attachSession() {},
    async detachSession() {},
  }
  const workspaceRegistry = {
    list: () => [workspace],
    get: (id) => (id === workspace.id ? workspace : undefined),
    async archiveSession() {},
  }
  const agentPresets = {
    async list() {
      return []
    },
    async resolve(id) {
      return { id, name: id }
    },
    async mount() {},
  }
  const agents = {
    async create(options) {
      createCount += 1
      const ordinal = createCount
      if (ordinal === 2) resolveSecondCreated()
      const agent = {
        id: options.sessionId,
        session: {
          id: options.sessionId,
          events: [],
          header: {
            cwd: options.meta.cwd,
            agentPreset: options.meta.agentPreset,
          },
        },
        async whenIdle() {
          if (ordinal === 1) await firstIdle
        },
        followup(message) {
          promptedMessages.push(message)
          if (promptedMessages.length === 2) resolvePrompted()
        },
      }
      await options.setup({
        agent,
        on() {
          return () => {}
        },
      })
      return { agent, async dispose() {} }
    },
    get() {
      return undefined
    },
    async resume() {
      throw new Error('resume is not expected')
    },
  }

  try {
    await apply(
      createContext(
        (registered) => routes.push(registered),
        undefined,
        agentPresets,
        workspaceRegistry,
        {
          agents,
          agentDefaultModel: {
            currentSelection: () => ({
              provider: 'test-provider',
              model: 'test-model',
            }),
          },
          sessionTitle: { rename() {} },
          disposers,
        },
      ),
      {
        repositoryPath: root,
        autoPull: false,
        autoPush: false,
        initializeRepository: true,
        settingsPath: path.join(root, '.pavo-settings.json'),
        pollIntervalMs: 60_000,
      },
    )
    const route = routes.find((candidate) => candidate.path === '/_dddrop/pavo')
    const initial = await call(route, 'overview')
    const workId = initial.payload.value.board.works[0].id
    const configured = await call(route, 'updateWork', {
      workId,
      workspaceId: workspace.id,
      assignee: { kind: 'agent-preset', presetId: 'standard' },
      description: 'Run automatically from Pavo.',
      expectedRevision: initial.payload.value.revision,
    })
    const added = await call(route, 'addWork', {
      type: 'goal',
      workspaceId: workspace.id,
      title: 'Run a second Work automatically',
      description: 'Run second automatically from Pavo.',
      assignee: { kind: 'agent-preset', presetId: 'standard' },
      waterLevel: '0',
      upstreamWaterLevels: {},
      workflowId: 'root',
      columnId: 'backlog',
      expectedRevision: configured.payload.value.revision,
    })
    const secondWorkId = added.payload.value.board.works.find(
      (work) => work.title === 'Run a second Work automatically',
    ).id
    const enabled = await call(route, 'setAutoMode', {
      enabled: true,
      expectedRevision: added.payload.value.revision,
    })
    assert.equal(enabled.response.status, 200, enabled.response.body)
    assert.deepEqual(enabled.payload.value.board.autoMode, { enabled: true })

    let timeout
    try {
      await Promise.race([
        secondCreated,
        new Promise((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Second automatic Agent claim timed out.')),
            5_000,
          )
        }),
      ])
    } finally {
      clearTimeout(timeout)
    }
    assert.equal(createCount, 2)
    releaseFirstIdle()
    try {
      await Promise.race([
        prompted,
        new Promise((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Automatic Agent prompts timed out.')),
            5_000,
          )
        }),
      ])
    } finally {
      clearTimeout(timeout)
    }
    const current = await call(route, 'overview')
    const running = current.payload.value.board.works.filter(
      (work) => work.id === workId || work.id === secondWorkId,
    )
    assert.equal(running.length, 2)
    assert.equal(running.every((work) => work.columnId === 'in-progress'), true)
    assert.equal(running.every((work) => work.sessionId !== ''), true)
    assert.deepEqual(
      promptedMessages.map((message) => message.content[0].text).sort(),
      ['Run automatically from Pavo.', 'Run second automatically from Pavo.'].sort(),
    )
  } finally {
    for (const dispose of disposers.reverse()) await dispose()
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
        undefined,
        {
          list: () => [
            {
              id: 'workspace-harness',
              title: 'Harness',
              status: async () => 'ok',
            },
          ],
        },
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
        'pavo_list_templates',
        'pavo_update_template',
        'pavo_apply_template',
      ],
    )
    const listTool = tools.find((tool) => tool.name === 'pavo_list_works')
    const readTool = tools.find((tool) => tool.name === 'pavo_read_work')
    const updateTool = tools.find((tool) => tool.name === 'pavo_update_work')
    const updateWorkflowTool = tools.find(
      (tool) => tool.name === 'pavo_update_workflow',
    )
    const listTemplatesTool = tools.find(
      (tool) => tool.name === 'pavo_list_templates',
    )
    const updateTemplateTool = tools.find(
      (tool) => tool.name === 'pavo_update_template',
    )
    const applyTemplateTool = tools.find(
      (tool) => tool.name === 'pavo_apply_template',
    )
    const listed = await listTool.execute({})
    assert.equal(listed.total, 1)
    assert.equal(listed.works[0].type, 'goal')
    assert.equal(listed.workflow[0].id, 'backlog')
    assert.deepEqual(listed.workspaces, [
      { id: 'workspace-harness', title: 'Harness' },
    ])
    assert.equal(listed.workflows[0].title, 'Root Workflow')
    assert.equal(listed.works[0].workflowId, 'root')
    assert.deepEqual(listed.agentPresets, [])
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
      workspaceId: 'workspace-harness',
      description: 'Maintain this Work continuously.',
      assignee: { kind: 'human' },
      waterLevel: '1000000000000000000000000000000.25',
    })
    assert.equal(updated.work.type, 'ongoing')
    assert.equal(updated.work.workspaceId, 'workspace-harness')
    assert.equal(updated.work.description, 'Maintain this Work continuously.')
    assert.deepEqual(updated.work.assignee, { kind: 'human' })
    assert.equal(updated.work.waterLevel, '1000000000000000000000000000000.25')
    const humanAssigned = await listTool.execute({
      assignee: { kind: 'human' },
    })
    assert.equal(humanAssigned.total, 1)
    assert.equal(humanAssigned.works[0].id, updated.work.id)
    const inWorkspace = await listTool.execute({
      workspaceId: 'workspace-harness',
    })
    assert.equal(inWorkspace.total, 1)
    assert.equal(inWorkspace.works[0].id, updated.work.id)

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
      title: 'Work without Workspace or KEY',
    })
    assert.equal(emptyFieldsCreated.work.workspaceId, '')
    assert.equal(emptyFieldsCreated.work.key, '')

    const templateCreated = await updateTemplateTool.execute({
      action: 'create',
      expectedRevision: emptyFieldsCreated.revision,
      kind: 'work',
      name: 'Ongoing Work template',
      sourceWorkId: read.work.id,
    })
    assert.equal(templateCreated.template.kind, 'work')
    assert.equal(templateCreated.template.content.type, 'ongoing')
    assert.equal(templateCreated.template.excludedExternalDependencies, 0)
    const templateList = await listTemplatesTool.execute({ kind: 'work' })
    assert.equal(templateList.total, 1)
    assert.equal(templateList.templates[0].id, templateCreated.template.id)
    assert.match(
      listTemplatesTool.output.render({}, templateList)[0].text,
      new RegExp(templateCreated.template.id),
    )
    const applied = await applyTemplateTool.execute({
      expectedRevision: templateCreated.revision,
      templateId: templateCreated.template.id,
      targetWorkflowId: 'root',
    })
    assert.equal(applied.createdWorkflowIds.length, 0)
    assert.equal(applied.createdWorkIds.length, 1)
    await assert.rejects(
      updateWorkflowTool.execute({
        action: 'delete',
        expectedRevision: applied.revision,
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

test('does not block Host startup on an active repository lock', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-startup-lock-'))
  const disposers = []
  const config = {
    repositoryPath: root,
    autoPull: false,
    autoPush: false,
    initializeRepository: true,
    settingsPath: path.join(root, '.pavo-settings.json'),
  }
  try {
    await new GitBoardRepository(config).overview()
    const lockPath = path.join(root, '.git', 'dddrop-kanban.lock')
    await writeFile(lockPath, `${process.pid}:active-test-lock\n`)
    const startedAt = Date.now()
    await apply(
      createContext(
        () => {},
        undefined,
        undefined,
        undefined,
        { disposers },
      ),
      config,
    )
    const startupDuration = Date.now() - startedAt
    await rm(lockPath, { force: true })
    assert.equal(startupDuration < 1_000, true)
  } finally {
    for (const dispose of disposers.reverse()) await dispose()
    await rm(root, { recursive: true, force: true })
  }
})

test('falls back to profile defaults when stored settings are invalid', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dddrop-pavo-invalid-settings-'))
  const repositoryPath = path.join(root, 'repository')
  const settingsPath = path.join(root, 'repository.json')
  const routes = []
  const disposers = []

  try {
    await writeFile(settingsPath, '{invalid json\n')
    await apply(
      createContext(
        (registered) => routes.push(registered),
        undefined,
        undefined,
        undefined,
        { disposers },
      ),
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
    for (const dispose of disposers.reverse()) await dispose()
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
