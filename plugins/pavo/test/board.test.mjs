import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_WORKFLOW,
  ROOT_WORKFLOW_ID,
  addTemplate,
  addWork,
  addWorkflow,
  compareWaterLevels,
  createDefaultBoard,
  instantiateTemplate,
  moveWork,
  normalizeAssignee,
  normalizeBoard,
  normalizeWorkflow,
  normalizeWorkspaceReference,
  removeTemplate,
  removeWork,
  removeWorkflow,
  startWork,
  updateTemplate,
  updateWork,
  updateWorkflow,
  workTemplateContentFromWork,
  workflowTemplateContentFromWorkflow,
} from '../src/board.js'
import { Config, inject, name } from '../src/index.js'
import { createUuidV7Generator } from '../src/uuid-v7.js'

const fixedTime = '2026-01-01T00:00:00.000Z'

function createBoard() {
  return createDefaultBoard({ id: 'welcome-work', now: fixedTime })
}

function workInput(overrides = {}) {
  return {
    id: 'new-work',
    type: 'goal',
    workspaceId: 'workspace-harness',
    key: 'DSH-42',
    title: 'Ship the Pavo plugin',
    description: 'Persist every field in Git.',
    assignee: 'Ada',
    waterLevel: '123456789012345678901234567890.1250',
    upstreamWaterLevels: {},
    columnId: 'ready',
    createdAt: fixedTime,
    ...overrides,
  }
}

test('creates the configured five-column board with a Goal Work', () => {
  const board = createBoard()
  assert.deepEqual(
    board.columns.map((column) => column.title),
    ['Backlog', 'Ready', 'In Progress', 'Review', 'Done'],
  )
  assert.equal(board.works[0].workspaceId, '')
  assert.deepEqual(
    board.workflows.map(({ id, title, parentWorkflowId }) => ({
      id,
      title,
      parentWorkflowId,
    })),
    [{ id: ROOT_WORKFLOW_ID, title: 'Root Workflow', parentWorkflowId: null }],
  )
  assert.equal(board.works[0].id, 'welcome-work')
  assert.equal(board.works[0].workflowId, ROOT_WORKFLOW_ID)
  assert.equal(board.works[0].type, 'goal')
  assert.equal(board.works[0].description, '')
  assert.equal(board.works[0].waterLevel, '0')
  assert.deepEqual(board.works[0].upstreamWaterLevels, {})
})

test('adds, edits, moves, and removes a Work without mutating inputs', () => {
  const original = createBoard()
  const added = addWork(original, workInput(), { workflow: DEFAULT_WORKFLOW })
  assert.equal(original.works.length, 1)
  assert.equal(added.works.length, 2)
  assert.equal(
    added.works.find((work) => work.id === 'new-work').waterLevel,
    '123456789012345678901234567890.125',
  )

  const edited = updateWork(
    added,
    {
      workId: 'new-work',
      ...workInput({
        type: 'ongoing',
        title: 'Maintain the Git-backed Pavo plugin',
        description: 'Keep every field synchronized.',
        waterLevel: '999999999999999999999999999999999999999999',
        upstreamWaterLevels: { 'welcome-work': '0001.2500' },
      }),
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  const work = edited.works.find((candidate) => candidate.id === 'new-work')
  assert.equal(work.type, 'ongoing')
  assert.equal(work.description, 'Keep every field synchronized.')
  assert.deepEqual(work.upstreamWaterLevels, { 'welcome-work': '1.25' })

  const moved = moveWork(
    edited,
    { workId: 'new-work', columnId: 'in-progress' },
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.equal(
    moved.works.find((candidate) => candidate.id === 'new-work').columnId,
    'in-progress',
  )
  assert.throws(
    () => removeWork(moved, { workId: 'welcome-work' }),
    /still referenced by Work new-work/,
  )
  const detached = updateWork(
    moved,
    { workId: 'new-work', ...work, upstreamWaterLevels: {} },
    { workflow: DEFAULT_WORKFLOW },
  )
  const removed = removeWork(detached, { workId: 'welcome-work' })
  assert.deepEqual(removed.works.map((candidate) => candidate.id), ['new-work'])
})

test('accepts forward references and cyclic Work dependencies', () => {
  const board = normalizeBoard({
    version: 1,
    columns: DEFAULT_WORKFLOW,
    works: [
      {
        id: 'code',
        type: 'goal',
        workspaceId: 'workspace-pavo',
        key: 'PAVO-1',
        title: 'Implement',
        description: 'Address review feedback.',
        waterLevel: '12',
        upstreamWaterLevels: { review: '5' },
        columnId: 'in-progress',
      },
      {
        id: 'review',
        type: 'ongoing',
        workspaceId: 'workspace-pavo',
        key: 'PAVO-2',
        title: 'Review',
        description: 'Review the implementation.',
        waterLevel: '6',
        upstreamWaterLevels: { code: '12' },
        columnId: 'review',
      },
    ],
  })
  assert.deepEqual(board.works[0].upstreamWaterLevels, { review: '5' })
  assert.deepEqual(board.works[1].upstreamWaterLevels, { code: '12' })
})

test('rejects unknown and self dependencies without applying DAG rules', () => {
  assert.throws(
    () => addWork(createBoard(), workInput({ upstreamWaterLevels: { missing: '1' } })),
    /unknown upstream Work/,
  )
  assert.throws(
    () => addWork(createBoard(), workInput({ upstreamWaterLevels: { 'new-work': '1' } })),
    /must not depend on itself/,
  )
  assert.throws(
    () =>
      addWork(
        createBoard(),
        workInput({
          upstreamWaterLevels: Object.fromEntries([
            [' welcome-work ', '1'],
            ['welcome-work', '1'],
          ]),
        }),
      ),
    /repeats upstream Work/,
  )
})

test('normalizes legacy cards and body fields into Works', () => {
  const board = normalizeBoard({
    version: 1,
    columns: DEFAULT_WORKFLOW,
    cards: [
      {
        id: 'legacy-card',
        title: 'Legacy title',
        body: 'Legacy body',
        columnId: 'backlog',
      },
    ],
  })
  assert.equal(board.cards, undefined)
  assert.deepEqual(
    {
      type: board.works[0].type,
      description: board.works[0].description,
      upstreamWaterLevels: board.works[0].upstreamWaterLevels,
      workspaceId: board.works[0].workspaceId,
      key: board.works[0].key,
    },
    {
      type: 'goal',
      description: 'Legacy body',
      upstreamWaterLevels: {},
      workspaceId: '',
      key: '',
    },
  )
  assert.throws(
    () => normalizeBoard({ ...board, cards: [] }),
    /must not define both cards and works/,
  )
})

test('stores stable optional DSH Workspace IDs and preserves legacy Projects', () => {
  assert.deepEqual(normalizeWorkspaceReference({ workspaceId: '' }), {
    workspaceId: '',
  })
  assert.deepEqual(
    normalizeWorkspaceReference({ workspaceId: 'workspace-harness' }),
    { workspaceId: 'workspace-harness' },
  )
  assert.deepEqual(normalizeWorkspaceReference({ project: 'Legacy Project' }), {
    workspaceId: '',
    legacyWorkspaceTitle: 'Legacy Project',
  })

  const created = addWork(
    createBoard(),
    workInput({ workspaceId: '', key: '' }),
    { workflow: DEFAULT_WORKFLOW },
  )
  const work = created.works.find((candidate) => candidate.id === 'new-work')
  assert.equal(work.workspaceId, '')
  assert.equal(work.key, '')

  const populated = updateWork(
    created,
    {
      ...work,
      workId: work.id,
      workspaceId: 'workspace-harness',
      key: 'DSH-42',
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  const current = populated.works.find((candidate) => candidate.id === work.id)
  const cleared = updateWork(
    populated,
    { ...current, workId: current.id, workspaceId: '', key: '' },
    { workflow: DEFAULT_WORKFLOW },
  )
  const clearedWork = cleared.works.find((candidate) => candidate.id === work.id)
  assert.equal(clearedWork.workspaceId, '')
  assert.equal(clearedWork.key, '')
})

test('normalizes human, Agent Preset, unassigned, and legacy Assignees', () => {
  assert.deepEqual(normalizeAssignee(undefined), { kind: 'unassigned' })
  assert.deepEqual(normalizeAssignee({ kind: 'unassigned' }), {
    kind: 'unassigned',
  })
  assert.deepEqual(normalizeAssignee({ kind: 'human' }), { kind: 'human' })
  assert.deepEqual(
    normalizeAssignee({ kind: 'agent-preset', presetId: 'cordis' }),
    { kind: 'agent-preset', presetId: 'cordis' },
  )
  assert.deepEqual(normalizeAssignee('Me'), { kind: 'human' })
  assert.deepEqual(normalizeAssignee('Ada Lovelace'), {
    kind: 'unassigned',
    legacyLabel: 'Ada Lovelace',
  })
  assert.throws(
    () => normalizeAssignee({ kind: 'agent-preset' }),
    /presetId/,
  )
  assert.throws(() => normalizeAssignee({ kind: 'robot' }), /kind must be/)

  const human = addWork(
    createBoard(),
    workInput({ id: 'human-work', assignee: { kind: 'human' } }),
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.deepEqual(human.works[1].assignee, { kind: 'human' })
  const preset = updateWork(
    human,
    {
      ...human.works[1],
      workId: 'human-work',
      assignee: { kind: 'agent-preset', presetId: 'standard' },
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.deepEqual(preset.works[1].assignee, {
    kind: 'agent-preset',
    presetId: 'standard',
  })
})

test('creates nested Workflows and assigns Works without changing dependency semantics', () => {
  const withRelease = addWorkflow(createBoard(), {
    id: 'release',
    title: 'Release 1.0',
    parentWorkflowId: ROOT_WORKFLOW_ID,
    createdAt: fixedTime,
  })
  const nested = addWorkflow(withRelease, {
    id: 'client',
    title: 'Client',
    parentWorkflowId: 'release',
    createdAt: fixedTime,
  })
  const withWork = addWork(
    nested,
    workInput({ workflowId: 'client' }),
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.equal(
    withWork.works.find((work) => work.id === 'new-work').workflowId,
    'client',
  )

  const reassigned = updateWork(
    withWork,
    {
      workId: 'new-work',
      ...workInput({
        workflowId: 'release',
        upstreamWaterLevels: { 'welcome-work': '0' },
      }),
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.equal(reassigned.works[1].workflowId, 'release')
  assert.deepEqual(reassigned.works[1].upstreamWaterLevels, {
    'welcome-work': '0',
  })
  assert.throws(
    () => removeWorkflow(reassigned, { workflowId: 'release' }),
    /contains child Workflows|contains Works/,
  )
  const withoutWork = removeWork(reassigned, { workId: 'new-work' })
  const withoutChild = removeWorkflow(withoutWork, { workflowId: 'client' })
  assert.equal(
    removeWorkflow(withoutChild, { workflowId: 'release' }).workflows.length,
    1,
  )
})

test('rejects invalid Workflow trees and protects the fixed Root Workflow', () => {
  assert.throws(
    () => addWorkflow(createBoard(), {
      id: 'orphan',
      title: 'Orphan',
      parentWorkflowId: 'missing',
    }),
    /Unknown parent Workflow/,
  )
  assert.throws(
    () => addWork(createBoard(), workInput({ workflowId: 'missing' })),
    /unknown Workflow/,
  )
  assert.throws(
    () => updateWorkflow(createBoard(), {
      workflowId: ROOT_WORKFLOW_ID,
      title: 'Renamed Root',
    }),
    /cannot be changed/,
  )
  assert.throws(
    () => removeWorkflow(createBoard(), { workflowId: ROOT_WORKFLOW_ID }),
    /cannot be deleted/,
  )

  const nested = addWorkflow(
    addWorkflow(createBoard(), {
      id: 'left',
      title: 'Left',
      parentWorkflowId: ROOT_WORKFLOW_ID,
    }),
    { id: 'right', title: 'Right', parentWorkflowId: 'left' },
  )
  assert.throws(
    () => updateWorkflow(nested, {
      workflowId: 'left',
      parentWorkflowId: 'right',
      title: 'Left',
    }),
    /parent cycle/,
  )
  assert.throws(
    () => normalizeBoard({
      ...nested,
      workflows: nested.workflows.map((workflow) =>
        workflow.id === ROOT_WORKFLOW_ID
          ? { ...workflow, title: 'Another Root' }
          : workflow,
      ),
    }),
    /Root Workflow title and parent are fixed/,
  )
})

test('creates, edits, applies, and removes a Work template', () => {
  const board = createBoard()
  const source = {
    ...board.works[0],
    assignee: { kind: 'agent-preset', presetId: 'standard' },
  }
  const withTemplate = addTemplate(board, {
    id: 'template-work',
    kind: 'work',
    name: 'Welcome template',
    content: workTemplateContentFromWork(source),
    excludedExternalDependencies: 0,
    createdAt: fixedTime,
  })
  assert.equal(board.templates.length, 0)
  assert.equal(withTemplate.templates[0].content.title, source.title)
  assert.equal(withTemplate.templates[0].content.workflowId, undefined)
  assert.equal(withTemplate.templates[0].content.upstreamWaterLevels, undefined)
  assert.deepEqual(withTemplate.templates[0].content.assignee, {
    kind: 'agent-preset',
    presetId: 'standard',
  })

  const renamed = updateTemplate(withTemplate, {
    templateId: 'template-work',
    name: 'Reusable welcome Work',
    updatedAt: '2026-01-02T00:00:00.000Z',
  })
  const instantiated = instantiateTemplate(
    renamed,
    { templateId: 'template-work', targetWorkflowId: ROOT_WORKFLOW_ID },
    {
      workflow: DEFAULT_WORKFLOW,
      idFactory: () => 'instantiated-work',
      now: '2026-01-03T00:00:00.000Z',
    },
  )
  const created = instantiated.works.find(
    (work) => work.id === 'instantiated-work',
  )
  assert.equal(created.title, source.title)
  assert.equal(created.workflowId, ROOT_WORKFLOW_ID)
  assert.deepEqual(created.assignee, {
    kind: 'agent-preset',
    presetId: 'standard',
  })
  assert.deepEqual(created.upstreamWaterLevels, {})
  assert.equal(removeTemplate(instantiated, { templateId: 'template-work' }).templates.length, 0)
})

test('captures and instantiates nested Workflow templates with remapped cycles', () => {
  const base = normalizeBoard({
    ...createBoard(),
    workflows: [
      ...createBoard().workflows,
      {
        id: 'release',
        title: 'Release',
        parentWorkflowId: ROOT_WORKFLOW_ID,
        createdAt: fixedTime,
        updatedAt: fixedTime,
      },
      {
        id: 'client',
        title: 'Client',
        parentWorkflowId: 'release',
        createdAt: fixedTime,
        updatedAt: fixedTime,
      },
    ],
    works: [
      {
        ...workInput({
          id: 'code',
          key: 'CODE',
          title: 'Code',
          workflowId: 'release',
          upstreamWaterLevels: { review: '2', 'welcome-work': '0' },
        }),
      },
      {
        ...workInput({
          id: 'review',
          key: 'REVIEW',
          title: 'Review',
          workflowId: 'client',
          upstreamWaterLevels: { code: '1' },
        }),
      },
      createBoard().works[0],
    ],
  })
  const captured = workflowTemplateContentFromWorkflow(base, 'release')
  assert.equal(captured.content.mapRootToTarget, false)
  assert.equal(captured.content.workflows.length, 2)
  assert.equal(captured.content.works.length, 2)
  assert.equal(captured.excludedExternalDependencies, 1)
  assert.deepEqual(
    captured.content.works.find((work) => work.id === 'code').upstreamWaterLevels,
    { review: '2' },
  )

  const templated = addTemplate(base, {
    id: 'template-release',
    kind: 'workflow',
    name: 'Release flow',
    ...captured,
    createdAt: fixedTime,
  })
  const ids = ['new-release', 'new-client', 'new-code', 'new-review']
  const instantiated = instantiateTemplate(
    templated,
    {
      templateId: 'template-release',
      targetWorkflowId: ROOT_WORKFLOW_ID,
    },
    {
      workflow: DEFAULT_WORKFLOW,
      idFactory: () => ids.shift(),
      now: '2026-01-04T00:00:00.000Z',
    },
  )
  assert.equal(
    instantiated.workflows.find((item) => item.id === 'new-release').parentWorkflowId,
    ROOT_WORKFLOW_ID,
  )
  assert.equal(
    instantiated.workflows.find((item) => item.id === 'new-client').parentWorkflowId,
    'new-release',
  )
  assert.deepEqual(
    instantiated.works.find((work) => work.id === 'new-code').upstreamWaterLevels,
    { 'new-review': '2' },
  )
  assert.deepEqual(
    instantiated.works.find((work) => work.id === 'new-review').upstreamWaterLevels,
    { 'new-code': '1' },
  )
})

test('maps a captured fixed Root Workflow directly to the destination', () => {
  const source = addWorkflow(createBoard(), {
    id: 'child',
    title: 'Child',
    parentWorkflowId: ROOT_WORKFLOW_ID,
    createdAt: fixedTime,
  })
  const captured = workflowTemplateContentFromWorkflow(
    source,
    ROOT_WORKFLOW_ID,
  )
  assert.equal(captured.content.mapRootToTarget, true)
  const templated = addTemplate(source, {
    id: 'root-template',
    kind: 'workflow',
    name: 'Whole board',
    ...captured,
    createdAt: fixedTime,
  })
  const ids = ['new-child', 'new-root-work']
  const instantiated = instantiateTemplate(
    templated,
    { templateId: 'root-template', targetWorkflowId: ROOT_WORKFLOW_ID },
    {
      workflow: DEFAULT_WORKFLOW,
      idFactory: () => ids.shift(),
      now: '2026-01-05T00:00:00.000Z',
    },
  )
  assert.equal(
    instantiated.workflows.filter((workflow) => workflow.title === 'Root Workflow').length,
    1,
  )
  assert.equal(
    instantiated.workflows.find((workflow) => workflow.id === 'new-child').parentWorkflowId,
    ROOT_WORKFLOW_ID,
  )
  assert.equal(
    instantiated.works.find((work) => work.id === 'new-root-work').workflowId,
    ROOT_WORKFLOW_ID,
  )
})

test('rejects malformed templates and preserves unavailable Workspace IDs', () => {
  assert.throws(
    () => addTemplate(createBoard(), {
      id: 'bad',
      kind: 'workflow',
      name: 'Bad tree',
      content: {
        rootWorkflowId: 'a',
        workflows: [
          { id: 'a', title: 'A', parentWorkflowId: 'b' },
          { id: 'b', title: 'B', parentWorkflowId: 'a' },
        ],
        works: [],
      },
    }),
    /rootWorkflowId must identify the only parentless Workflow|parent cycle/,
  )
  const withTemplate = addTemplate(createBoard(), {
    id: 'workspace-template',
    kind: 'work',
    name: 'Harness Work',
    content: {
      ...workTemplateContentFromWork(createBoard().works[0]),
      workspaceId: 'deleted-workspace',
    },
  })
  const instantiated = instantiateTemplate(
    withTemplate,
    { templateId: 'workspace-template', targetWorkflowId: ROOT_WORKFLOW_ID },
    { idFactory: () => 'workspace-work' },
  )
  assert.equal(
    instantiated.works.find((work) => work.id === 'workspace-work').workspaceId,
    'deleted-workspace',
  )
  assert.throws(
    () => instantiateTemplate(
      withTemplate,
      { templateId: 'workspace-template', targetWorkflowId: 'missing' },
      { idFactory: () => 'unused' },
    ),
    /Unknown target Workflow/,
  )
})

test('compares arbitrary-precision WaterLevels without floating point', () => {
  assert.equal(compareWaterLevels('999999999999999999999999', '10'), 1)
  assert.equal(compareWaterLevels('1.2300', '1.23'), 0)
  assert.equal(compareWaterLevels('0.0000000000000000001', '0.0000000000000000002'), -1)
  assert.throws(() => compareWaterLevels('1e3', '1000'), /without an exponent/)
})

test('starts only Ready Works and records their Agent Session', () => {
  const board = createBoard()
  const ready = moveWork(board, {
    workId: 'welcome-work',
    columnId: 'ready',
  })
  const started = startWork(ready, {
    workId: 'welcome-work',
    sessionId: 'session-pavo-run',
    updatedAt: '2026-01-02T00:00:00.000Z',
  })
  assert.equal(started.works[0].columnId, 'in-progress')
  assert.equal(started.works[0].sessionId, 'session-pavo-run')
  assert.equal(started.works[0].updatedAt, '2026-01-02T00:00:00.000Z')
  assert.equal(ready.works[0].columnId, 'ready')
  assert.equal(ready.works[0].sessionId, '')
  const readyAgain = moveWork(started, {
    workId: 'welcome-work',
    columnId: 'ready',
  })
  const restarted = startWork(readyAgain, {
    workId: 'welcome-work',
    sessionId: 'session-pavo-rerun',
  })
  assert.equal(restarted.works[0].columnId, 'in-progress')
  assert.equal(restarted.works[0].sessionId, 'session-pavo-rerun')
  assert.throws(
    () =>
      startWork(board, {
        workId: 'welcome-work',
        sessionId: 'session-too-early',
      }),
    /must be Ready/,
  )
  assert.equal(
    workTemplateContentFromWork(started.works[0]).sessionId,
    undefined,
  )
})

test('enforces workflow transitions and Work field validation', () => {
  const board = addWork(
    createBoard(),
    workInput({ columnId: 'backlog' }),
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.throws(
    () => moveWork(board, { workId: 'new-work', columnId: 'in-progress' }),
    /cannot move/,
  )
  const unrestricted = {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      allowedTransitions: board.columns
        .filter((candidate) => candidate.id !== column.id)
        .map((candidate) => candidate.id),
    })),
  }
  const moved = moveWork(
    unrestricted,
    { workId: 'new-work', columnId: 'done' },
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.equal(
    moved.works.find((work) => work.id === 'new-work').columnId,
    'done',
  )
  assert.throws(
    () => addWork(createBoard(), workInput({ type: 'task' })),
    /goal or ongoing/,
  )
  assert.throws(
    () => addWork(createBoard(), workInput({ columnId: 'missing' })),
    /Unknown column/,
  )
  assert.throws(
    () => addWork(createBoard(), workInput({ waterLevel: '-1' })),
    /non-negative decimal/,
  )
  assert.throws(
    () => normalizeWorkflow([{ id: 'a', title: 'A', allowedTransitions: ['missing'] }]),
    /unknown transition/,
  )
})

test('generates monotonic UUIDv7 identifiers across clock regressions', () => {
  let now = 1_700_000_000_000
  const randomValues = [new Uint8Array(10), new Uint8Array(10), new Uint8Array(10)]
  const uuid = createUuidV7Generator({
    now: () => now,
    randomBytes: () => randomValues.shift(),
  })
  const first = uuid()
  const second = uuid()
  now -= 1_000
  const afterClockRegression = uuid()
  assert.match(
    first,
    /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
  )
  assert.equal(first < second, true)
  assert.equal(second < afterClockRegression, true)
})

test('declares a statically configured Host plugin', () => {
  assert.equal(name, 'dddrop-pavo')
  assert.deepEqual(inject, [
    'webServer',
    'webRuntime',
    'workspaceRegistry',
    'agents',
    'agentPresets',
    'agentDefaultModel',
    'sessionTitle',
  ])
  const valid = Config['~standard'].validate({
    repositoryPath: '/tmp/pavo-data',
    autoPull: false,
    autoPush: false,
  })
  assert.equal(valid.issues, undefined)
  assert.equal(valid.value.columns.length, 5)
})
