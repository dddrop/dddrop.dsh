export const DEFAULT_WORKFLOW = Object.freeze([
  Object.freeze({
    id: 'backlog',
    title: 'Backlog',
    allowedTransitions: Object.freeze(['ready']),
  }),
  Object.freeze({
    id: 'ready',
    title: 'Ready',
    allowedTransitions: Object.freeze(['backlog', 'in-progress']),
  }),
  Object.freeze({
    id: 'in-progress',
    title: 'In Progress',
    allowedTransitions: Object.freeze(['ready', 'review']),
  }),
  Object.freeze({
    id: 'review',
    title: 'Review',
    allowedTransitions: Object.freeze(['in-progress', 'done']),
  }),
  Object.freeze({
    id: 'done',
    title: 'Done',
    allowedTransitions: Object.freeze(['review']),
  }),
])

export const WORK_TYPES = Object.freeze(['goal', 'ongoing'])
export const TEMPLATE_KINDS = Object.freeze(['work', 'workflow'])
export const ASSIGNEE_KINDS = Object.freeze([
  'unassigned',
  'human',
  'agent-preset',
])
export const ROOT_WORKFLOW_ID = 'root'
export const ROOT_WORKFLOW_TITLE = 'Root Workflow'

const MAX_COLUMNS = 32
const MAX_WORKS = 10_000
const MAX_WORKFLOWS = 10_000
const MAX_TEMPLATES = 2_000
const MAX_ID_LENGTH = 128
const MAX_LEGACY_WORKSPACE_TITLE_LENGTH = 128
const MAX_KEY_LENGTH = 128
const MAX_TITLE_LENGTH = 500
const MAX_DESCRIPTION_LENGTH = 50_000
const MAX_ASSIGNEE_LENGTH = 256

function requireObject(value, message) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(message)
  }
  return value
}

function requireString(value, field, maximumLength, { allowEmpty = false } = {}) {
  if (typeof value !== 'string') {
    throw new TypeError(`${field} must be a string.`)
  }

  const normalized = value.trim()
  if (!allowEmpty && normalized.length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`)
  }
  if (normalized.length > maximumLength) {
    throw new TypeError(`${field} must not exceed ${maximumLength} characters.`)
  }
  return normalized
}

export function normalizeAssignee(value) {
  if (value === undefined || value === null) return { kind: 'unassigned' }
  if (typeof value === 'string') {
    const legacyLabel = requireString(
      value,
      'Work assignee',
      MAX_ASSIGNEE_LENGTH,
      { allowEmpty: true },
    )
    if (!legacyLabel) return { kind: 'unassigned' }
    if (legacyLabel.toLocaleLowerCase('en-US') === 'me') {
      return { kind: 'human' }
    }
    return { kind: 'unassigned', legacyLabel }
  }

  const assignee = requireObject(
    value,
    'Work assignee must be an object.',
  )
  if (!ASSIGNEE_KINDS.includes(assignee.kind)) {
    throw new TypeError(
      'Work assignee kind must be unassigned, human, or agent-preset.',
    )
  }
  if (assignee.kind === 'agent-preset') {
    return {
      kind: 'agent-preset',
      presetId: requireString(
        assignee.presetId,
        'Work assignee presetId',
        MAX_ID_LENGTH,
      ),
    }
  }
  if (assignee.kind === 'unassigned' && assignee.legacyLabel !== undefined) {
    return {
      kind: 'unassigned',
      legacyLabel: requireString(
        assignee.legacyLabel,
        'Work legacy assignee label',
        MAX_ASSIGNEE_LENGTH,
      ),
    }
  }
  return { kind: assignee.kind }
}

export function normalizeWaterLevel(value, fallback) {
  const candidate = value === undefined ? fallback : value
  const source =
    typeof candidate === 'number' && Number.isFinite(candidate)
      ? String(candidate)
      : typeof candidate === 'string'
        ? candidate.trim()
        : ''
  const match = /^(\d+)(?:\.(\d+))?$/u.exec(source)
  if (!match) {
    throw new TypeError(
      'Work waterLevel must be a non-negative decimal number without an exponent.',
    )
  }

  const integer = match[1].replace(/^0+(?=\d)/u, '')
  const fraction = match[2]?.replace(/0+$/u, '')
  return fraction ? `${integer}.${fraction}` : integer
}

export function compareWaterLevels(leftInput, rightInput) {
  const left = normalizeWaterLevel(leftInput, 0)
  const right = normalizeWaterLevel(rightInput, 0)
  const [leftInteger, leftFraction = ''] = left.split('.')
  const [rightInteger, rightFraction = ''] = right.split('.')
  if (leftInteger.length !== rightInteger.length) {
    return leftInteger.length < rightInteger.length ? -1 : 1
  }
  if (leftInteger !== rightInteger) return leftInteger < rightInteger ? -1 : 1
  const width = Math.max(leftFraction.length, rightFraction.length)
  const paddedLeft = leftFraction.padEnd(width, '0')
  const paddedRight = rightFraction.padEnd(width, '0')
  if (paddedLeft === paddedRight) return 0
  return paddedLeft < paddedRight ? -1 : 1
}

function normalizeTimestamp(value, fallback = new Date(0).toISOString()) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
    ? value
    : fallback
}

function cloneColumn(column, order) {
  return {
    id: column.id,
    title: column.title,
    allowedTransitions: [...column.allowedTransitions],
    order,
  }
}

export function normalizeWorkflow(input = DEFAULT_WORKFLOW) {
  if (!Array.isArray(input) || input.length === 0) {
    throw new TypeError('The workflow must define at least one column.')
  }
  if (input.length > MAX_COLUMNS) {
    throw new TypeError(`The workflow must not exceed ${MAX_COLUMNS} columns.`)
  }

  const ids = new Set()
  const workflow = input.map((value, index) => {
    const column = requireObject(value, `Workflow column ${index} must be an object.`)
    const id = requireString(column.id, `Workflow column ${index} id`, MAX_ID_LENGTH)
    const title = requireString(
      column.title,
      `Workflow column ${index} title`,
      MAX_TITLE_LENGTH,
    )

    if (ids.has(id)) throw new TypeError(`Duplicate workflow column id: ${id}`)
    ids.add(id)

    if (!Array.isArray(column.allowedTransitions)) {
      throw new TypeError(
        `Workflow column ${id} allowedTransitions must be an array.`,
      )
    }

    return {
      id,
      title,
      allowedTransitions: column.allowedTransitions.map((target, targetIndex) =>
        requireString(
          target,
          `Workflow column ${id} transition ${targetIndex}`,
          MAX_ID_LENGTH,
        ),
      ),
    }
  })

  for (const column of workflow) {
    const targets = new Set()
    for (const target of column.allowedTransitions) {
      if (!ids.has(target)) {
        throw new TypeError(
          `Workflow column ${column.id} references an unknown transition: ${target}`,
        )
      }
      if (target === column.id) {
        throw new TypeError(
          `Workflow column ${column.id} must not transition to itself.`,
        )
      }
      if (targets.has(target)) {
        throw new TypeError(
          `Workflow column ${column.id} repeats transition: ${target}`,
        )
      }
      targets.add(target)
    }
  }

  return workflow
}

export function normalizeWorkspaceReference(input) {
  const workspaceId = requireString(
    input?.workspaceId ?? '',
    'Work workspaceId',
    MAX_ID_LENGTH,
    { allowEmpty: true },
  )
  if (workspaceId) return { workspaceId }

  const legacyWorkspaceTitle = requireString(
    input?.legacyWorkspaceTitle ?? input?.project ?? '',
    'Work legacy Workspace title',
    MAX_LEGACY_WORKSPACE_TITLE_LENGTH,
    { allowEmpty: true },
  )
  return legacyWorkspaceTitle
    ? { workspaceId: '', legacyWorkspaceTitle }
    : { workspaceId: '' }
}

function normalizeWorkType(value, fallback = 'goal') {
  const type = value === undefined ? fallback : value
  if (!WORK_TYPES.includes(type)) {
    throw new TypeError('Work type must be goal or ongoing.')
  }
  return type
}

function normalizeUpstreamWaterLevels(input, knownIds, workId) {
  const source = input === undefined ? {} : requireObject(
    input,
    'Work upstreamWaterLevels must be an object.',
  )
  const entries = Object.entries(source)
  if (entries.length > MAX_WORKS) {
    throw new TypeError(`Work must not exceed ${MAX_WORKS} upstream dependencies.`)
  }
  const upstreamIds = new Set()
  const normalized = []
  for (const [upstreamIdInput, waterLevel] of entries) {
    const upstreamId = requireString(
      upstreamIdInput,
      'Upstream Work id',
      MAX_ID_LENGTH,
    )
    if (upstreamIds.has(upstreamId)) {
      throw new TypeError(`Work ${workId} repeats upstream Work: ${upstreamId}`)
    }
    upstreamIds.add(upstreamId)
    if (upstreamId === workId) {
      throw new TypeError(`Work ${workId} must not depend on itself.`)
    }
    if (!knownIds.has(upstreamId)) {
      throw new TypeError(`Work ${workId} references unknown upstream Work: ${upstreamId}`)
    }
    normalized.push([upstreamId, normalizeWaterLevel(waterLevel, 0)])
  }
  return Object.fromEntries(normalized)
}

function normalizeEditableFields(
  input,
  {
    knownIds = new Set(),
    workflowIds = new Set([ROOT_WORKFLOW_ID]),
    workId = '',
  } = {},
) {
  return {
    type: normalizeWorkType(input?.type),
    ...normalizeWorkspaceReference(input),
    sessionId: requireString(
      input?.sessionId ?? '',
      'Work sessionId',
      MAX_ID_LENGTH,
      { allowEmpty: true },
    ),
    key: requireString(input?.key ?? '', 'Work key', MAX_KEY_LENGTH, {
      allowEmpty: true,
    }),
    title: requireString(input?.title, 'Work title', MAX_TITLE_LENGTH),
    description: requireString(
      input?.description ?? input?.body ?? '',
      'Work description',
      MAX_DESCRIPTION_LENGTH,
      { allowEmpty: true },
    ),
    assignee: normalizeAssignee(input?.assignee),
    waterLevel: normalizeWaterLevel(input?.waterLevel, 0),
    upstreamWaterLevels: normalizeUpstreamWaterLevels(
      input?.upstreamWaterLevels,
      knownIds,
      workId,
    ),
    workflowId: (() => {
      const workflowId = requireString(
        input?.workflowId ?? ROOT_WORKFLOW_ID,
        'Work workflowId',
        MAX_ID_LENGTH,
      )
      if (!workflowIds.has(workflowId)) {
        throw new TypeError(`Work ${workId} references an unknown Workflow: ${workflowId}`)
      }
      return workflowId
    })(),
  }
}

function rootWorkflow(now) {
  const timestamp = normalizeTimestamp(now, new Date().toISOString())
  return {
    id: ROOT_WORKFLOW_ID,
    title: ROOT_WORKFLOW_TITLE,
    parentWorkflowId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

function normalizeWorkflows(input, fallbackTimestamp) {
  const source =
    input === undefined
      ? [rootWorkflow(fallbackTimestamp ?? new Date(0).toISOString())]
      : input
  if (!Array.isArray(source) || source.length === 0) {
    throw new TypeError('The board must define the Root Workflow.')
  }
  if (source.length > MAX_WORKFLOWS) {
    throw new TypeError(`The board must not exceed ${MAX_WORKFLOWS} Workflows.`)
  }

  const ids = new Set()
  const workflows = source.map((value, index) => {
    const workflow = requireObject(value, `Workflow ${index} must be an object.`)
    const id = requireString(workflow.id, `Workflow ${index} id`, MAX_ID_LENGTH)
    if (ids.has(id)) throw new TypeError(`Duplicate Workflow id: ${id}`)
    ids.add(id)
    const createdAt = normalizeTimestamp(workflow.createdAt, fallbackTimestamp)
    return {
      id,
      title: requireString(workflow.title, `Workflow ${index} title`, MAX_TITLE_LENGTH),
      parentWorkflowId:
        workflow.parentWorkflowId === null ||
        (id === ROOT_WORKFLOW_ID && workflow.parentWorkflowId === undefined)
          ? null
          : requireString(
              workflow.parentWorkflowId,
              `Workflow ${index} parentWorkflowId`,
              MAX_ID_LENGTH,
            ),
      createdAt,
      updatedAt: normalizeTimestamp(workflow.updatedAt, createdAt),
    }
  })

  const root = workflows.find((workflow) => workflow.id === ROOT_WORKFLOW_ID)
  if (!root) throw new TypeError('The board must define the Root Workflow.')
  if (root.title !== ROOT_WORKFLOW_TITLE || root.parentWorkflowId !== null) {
    throw new TypeError('The Root Workflow title and parent are fixed.')
  }
  for (const workflow of workflows) {
    if (workflow.id === ROOT_WORKFLOW_ID) continue
    if (!ids.has(workflow.parentWorkflowId)) {
      throw new TypeError(
        `Workflow ${workflow.id} references an unknown parent Workflow: ${workflow.parentWorkflowId}`,
      )
    }
    const visited = new Set([workflow.id])
    let current = workflow
    while (current.id !== ROOT_WORKFLOW_ID) {
      if (visited.has(current.parentWorkflowId)) {
        throw new TypeError(`Workflow ${workflow.id} creates a parent cycle.`)
      }
      visited.add(current.parentWorkflowId)
      current = workflows.find((candidate) => candidate.id === current.parentWorkflowId)
    }
  }
  return workflows
}

function normalizeTemplateWorkContent(
  input,
  columnIds,
  {
    knownIds = new Set(['template-work']),
    workflowIds = new Set([ROOT_WORKFLOW_ID]),
    workId = 'template-work',
    includeRelations = false,
  } = {},
) {
  const source = requireObject(input, 'Work template content must be an object.')
  const fields = normalizeEditableFields(
    {
      ...source,
      sessionId: '',
      upstreamWaterLevels: source.upstreamWaterLevels ?? {},
      workflowId: source.workflowId ?? ROOT_WORKFLOW_ID,
    },
    { knownIds, workflowIds, workId },
  )
  const columnId = requireString(
    source.columnId,
    'Work template columnId',
    MAX_ID_LENGTH,
  )
  if (!columnIds.has(columnId)) {
    throw new TypeError(`Work template references an unknown column: ${columnId}`)
  }
  const { sessionId: _sessionId, ...templateFields } = fields
  if (includeRelations) return { ...templateFields, columnId }
  const {
    upstreamWaterLevels: _upstreamWaterLevels,
    workflowId: _workflowId,
    ...contentFields
  } = templateFields
  return { ...contentFields, columnId }
}

function normalizeWorkflowTemplateContent(input, columnIds) {
  const content = requireObject(
    input,
    'Workflow template content must be an object.',
  )
  const rootWorkflowId = requireString(
    content.rootWorkflowId,
    'Workflow template rootWorkflowId',
    MAX_ID_LENGTH,
  )
  if (!Array.isArray(content.workflows) || content.workflows.length === 0) {
    throw new TypeError('Workflow template content must define a root Workflow.')
  }
  if (content.workflows.length > MAX_WORKFLOWS) {
    throw new TypeError(
      `Workflow template must not exceed ${MAX_WORKFLOWS} Workflows.`,
    )
  }
  if (!Array.isArray(content.works)) {
    throw new TypeError('Workflow template content Works must be an array.')
  }
  if (content.works.length > MAX_WORKS) {
    throw new TypeError(`Workflow template must not exceed ${MAX_WORKS} Works.`)
  }

  const workflowIds = new Set()
  const workflows = content.workflows.map((value, index) => {
    const item = requireObject(
      value,
      `Workflow template Workflow ${index} must be an object.`,
    )
    const id = requireString(
      item.id,
      `Workflow template Workflow ${index} id`,
      MAX_ID_LENGTH,
    )
    if (workflowIds.has(id)) {
      throw new TypeError(`Duplicate Workflow template Workflow id: ${id}`)
    }
    workflowIds.add(id)
    return {
      id,
      title: requireString(
        item.title,
        `Workflow template Workflow ${index} title`,
        MAX_TITLE_LENGTH,
      ),
      parentWorkflowId:
        item.parentWorkflowId === null
          ? null
          : requireString(
              item.parentWorkflowId,
              `Workflow template Workflow ${index} parentWorkflowId`,
              MAX_ID_LENGTH,
            ),
    }
  })
  const root = workflows.find((item) => item.id === rootWorkflowId)
  if (!root || root.parentWorkflowId !== null) {
    throw new TypeError(
      'Workflow template rootWorkflowId must identify the only parentless Workflow.',
    )
  }
  if (workflows.some((item) => item.id !== rootWorkflowId && item.parentWorkflowId === null)) {
    throw new TypeError('Workflow template must define exactly one root Workflow.')
  }
  for (const item of workflows) {
    if (item.id === rootWorkflowId) continue
    if (!workflowIds.has(item.parentWorkflowId)) {
      throw new TypeError(
        `Workflow template Workflow ${item.id} references an unknown parent Workflow: ${item.parentWorkflowId}`,
      )
    }
    const visited = new Set([item.id])
    let current = item
    while (current.id !== rootWorkflowId) {
      if (visited.has(current.parentWorkflowId)) {
        throw new TypeError(
          `Workflow template Workflow ${item.id} creates a parent cycle.`,
        )
      }
      visited.add(current.parentWorkflowId)
      current = workflows.find(
        (candidate) => candidate.id === current.parentWorkflowId,
      )
    }
  }

  const workIds = new Set()
  const indexedWorks = content.works.map((value, index) => {
    const work = requireObject(
      value,
      `Workflow template Work ${index} must be an object.`,
    )
    const id = requireString(
      work.id,
      `Workflow template Work ${index} id`,
      MAX_ID_LENGTH,
    )
    if (workIds.has(id)) {
      throw new TypeError(`Duplicate Workflow template Work id: ${id}`)
    }
    workIds.add(id)
    return { work, id }
  })
  const works = indexedWorks.map(({ work, id }) => ({
    id,
    ...normalizeTemplateWorkContent(work, columnIds, {
      knownIds: workIds,
      workflowIds,
      workId: id,
      includeRelations: true,
    }),
  }))
  return {
    rootWorkflowId,
    mapRootToTarget: content.mapRootToTarget === true,
    workflows,
    works,
  }
}

function normalizeTemplates(input, columns) {
  const source = input === undefined ? [] : input
  if (!Array.isArray(source)) {
    throw new TypeError('The board templates must be an array.')
  }
  if (source.length > MAX_TEMPLATES) {
    throw new TypeError(`The board must not exceed ${MAX_TEMPLATES} templates.`)
  }
  const columnIds = new Set(columns.map((column) => column.id))
  const ids = new Set()
  return source.map((value, index) => {
    const template = requireObject(value, `Template ${index} must be an object.`)
    const id = requireString(template.id, `Template ${index} id`, MAX_ID_LENGTH)
    if (ids.has(id)) throw new TypeError(`Duplicate template id: ${id}`)
    ids.add(id)
    if (!TEMPLATE_KINDS.includes(template.kind)) {
      throw new TypeError(`Template ${id} kind must be work or workflow.`)
    }
    const createdAt = normalizeTimestamp(template.createdAt)
    return {
      id,
      kind: template.kind,
      name: requireString(
        template.name,
        `Template ${id} name`,
        MAX_TITLE_LENGTH,
      ),
      excludedExternalDependencies:
        Number.isSafeInteger(template.excludedExternalDependencies) &&
        template.excludedExternalDependencies >= 0
          ? template.excludedExternalDependencies
          : 0,
      content:
        template.kind === 'work'
          ? normalizeTemplateWorkContent(template.content, columnIds)
          : normalizeWorkflowTemplateContent(template.content, columnIds),
      createdAt,
      updatedAt: normalizeTimestamp(template.updatedAt, createdAt),
    }
  })
}

function sameStringMap(left, right) {
  const leftEntries = Object.entries(left)
  const rightEntries = Object.entries(right)
  return (
    leftEntries.length === rightEntries.length &&
    leftEntries.every(([key, value]) => right[key] === value)
  )
}

export function createDefaultBoard({
  id,
  now,
  workflow = DEFAULT_WORKFLOW,
} = {}) {
  const columns = normalizeWorkflow(workflow)
  const createdAt = normalizeTimestamp(now, new Date().toISOString())
  const workId = typeof id === 'string' ? id : 'welcome'

  return {
    version: 1,
    columns: columns.map((column, order) => cloneColumn(column, order)),
    workflows: [rootWorkflow(createdAt)],
    templates: [],
    works: [
      {
        id: workId,
        type: 'goal',
        workspaceId: '',
        sessionId: '',
        key: 'WELCOME',
        title: `Move this Work to ${columns[1]?.title ?? columns[0].title} to try the board.`,
        description: '',
        assignee: { kind: 'unassigned' },
        waterLevel: '0',
        upstreamWaterLevels: {},
        workflowId: ROOT_WORKFLOW_ID,
        columnId: columns[0].id,
        createdAt,
        updatedAt: createdAt,
      },
    ],
  }
}

export function normalizeBoard(input, { workflow } = {}) {
  const board = requireObject(input, 'The board must be an object.')
  const boardDefinesTransitions =
    Array.isArray(board.columns) &&
    board.columns.every((column) => Array.isArray(column?.allowedTransitions))
  const configuredWorkflow =
    workflow && !boardDefinesTransitions ? normalizeWorkflow(workflow) : undefined
  const columnInput = boardDefinesTransitions
    ? board.columns
    : configuredWorkflow ?? board.columns
  const fallbackTimestamp = board.works?.[0]?.createdAt ?? board.cards?.[0]?.createdAt
  const workflows = normalizeWorkflows(board.workflows, fallbackTimestamp)
  const workflowIds = new Set(workflows.map((container) => container.id))
  if (board.cards !== undefined && board.works !== undefined) {
    throw new TypeError('The board must not define both cards and works.')
  }
  const workInput = board.works ?? board.cards

  if (!Array.isArray(columnInput)) {
    throw new TypeError('The board columns must be an array.')
  }
  if (!Array.isArray(workInput)) {
    throw new TypeError('The board Works must be an array.')
  }
  if (columnInput.length === 0) {
    throw new TypeError('The board must define at least one column.')
  }
  if (columnInput.length > MAX_COLUMNS) {
    throw new TypeError(`The board must not exceed ${MAX_COLUMNS} columns.`)
  }
  if (workInput.length > MAX_WORKS) {
    throw new TypeError(`The board must not exceed ${MAX_WORKS} Works.`)
  }

  const columns = normalizeWorkflow(columnInput).map((column, index) =>
    cloneColumn(
      column,
      configuredWorkflow
        ? index
        : Number.isFinite(columnInput[index].order)
          ? columnInput[index].order
          : index,
    ),
  )
  const columnIds = new Set(columns.map((column) => column.id))

  const workIds = new Set()
  const indexedWorks = workInput.map((value, index) => {
    const work = requireObject(value, `Work ${index} must be an object.`)
    const id = requireString(work.id, `Work ${index} id`, MAX_ID_LENGTH)
    if (workIds.has(id)) throw new TypeError(`Duplicate Work id: ${id}`)
    workIds.add(id)
    return { work, id, index }
  })

  const works = indexedWorks.map(({ work, id, index }) => {
    const fields = normalizeEditableFields(work, {
      knownIds: workIds,
      workflowIds,
      workId: id,
    })
    const columnId = requireString(
      work.columnId,
      `Work ${index} columnId`,
      MAX_ID_LENGTH,
    )

    if (!columnIds.has(columnId)) {
      throw new TypeError(`Work ${id} references an unknown column: ${columnId}`)
    }
    const createdAt = normalizeTimestamp(work.createdAt)
    return {
      id,
      ...fields,
      columnId,
      createdAt,
      updatedAt: normalizeTimestamp(work.updatedAt, createdAt),
    }
  })

  const sortedColumns = columns.sort((left, right) => left.order - right.order)
  const templates = normalizeTemplates(board.templates, sortedColumns)
  return {
    version: 1,
    columns: sortedColumns,
    workflows,
    templates,
    works,
  }
}

export function workTemplateContentFromWork(workInput) {
  const work = requireObject(workInput, 'The source Work must be an object.')
  return {
    type: work.type,
    workspaceId: work.workspaceId,
    ...(work.legacyWorkspaceTitle
      ? { legacyWorkspaceTitle: work.legacyWorkspaceTitle }
      : {}),
    key: work.key,
    title: work.title,
    description: work.description,
    assignee: work.assignee,
    waterLevel: work.waterLevel,
    columnId: work.columnId,
  }
}

export function workflowTemplateContentFromWorkflow(boardInput, workflowIdInput, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const workflowId = requireString(
    workflowIdInput,
    'Source Workflow id',
    MAX_ID_LENGTH,
  )
  if (!board.workflows.some((item) => item.id === workflowId)) {
    throw new TypeError(`Unknown Workflow: ${workflowId}`)
  }
  const includedWorkflowIds = new Set([workflowId])
  let changed = true
  while (changed) {
    changed = false
    for (const item of board.workflows) {
      if (
        item.parentWorkflowId &&
        includedWorkflowIds.has(item.parentWorkflowId) &&
        !includedWorkflowIds.has(item.id)
      ) {
        includedWorkflowIds.add(item.id)
        changed = true
      }
    }
  }
  const includedWorks = board.works.filter((work) =>
    includedWorkflowIds.has(work.workflowId),
  )
  const includedWorkIds = new Set(includedWorks.map((work) => work.id))
  let excludedExternalDependencies = 0
  const works = includedWorks.map((work) => {
    const upstreamWaterLevels = Object.fromEntries(
      Object.entries(work.upstreamWaterLevels).filter(([upstreamId]) => {
        if (includedWorkIds.has(upstreamId)) return true
        excludedExternalDependencies += 1
        return false
      }),
    )
    return {
      id: work.id,
      ...workTemplateContentFromWork(work),
      workflowId: work.workflowId,
      upstreamWaterLevels,
    }
  })
  return {
    content: {
      rootWorkflowId: workflowId,
      mapRootToTarget: workflowId === ROOT_WORKFLOW_ID,
      workflows: board.workflows
        .filter((item) => includedWorkflowIds.has(item.id))
        .map((item) => ({
          id: item.id,
          title: item.title,
          parentWorkflowId:
            item.id === workflowId ? null : item.parentWorkflowId,
        })),
      works,
    },
    excludedExternalDependencies,
  }
}

export function addTemplate(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  if (board.templates.length >= MAX_TEMPLATES) {
    throw new TypeError(`The board must not exceed ${MAX_TEMPLATES} templates.`)
  }
  const id = requireString(input?.id, 'Template id', MAX_ID_LENGTH)
  if (board.templates.some((template) => template.id === id)) {
    throw new TypeError(`Duplicate template id: ${id}`)
  }
  const createdAt = normalizeTimestamp(input?.createdAt, new Date().toISOString())
  return normalizeBoard(
    {
      ...board,
      templates: [
        ...board.templates,
        {
          id,
          kind: input?.kind,
          name: input?.name,
          content: input?.content,
          excludedExternalDependencies:
            input?.excludedExternalDependencies ?? 0,
          createdAt,
          updatedAt: createdAt,
        },
      ],
    },
    { workflow },
  )
}

export function updateTemplate(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const templateId = requireString(
    input?.templateId,
    'Template id',
    MAX_ID_LENGTH,
  )
  const current = board.templates.find((template) => template.id === templateId)
  if (!current) throw new TypeError(`Unknown template: ${templateId}`)
  const candidate = {
    ...current,
    name: input?.name ?? current.name,
    content: input?.content ?? current.content,
    excludedExternalDependencies:
      input?.excludedExternalDependencies ??
      current.excludedExternalDependencies,
    updatedAt: normalizeTimestamp(input?.updatedAt, new Date().toISOString()),
  }
  const unchanged = canonicalTemplate(current) === canonicalTemplate(candidate)
  if (unchanged) {
    throw new TypeError(`Template ${templateId} already has those values.`)
  }
  return normalizeBoard(
    {
      ...board,
      templates: board.templates.map((template) =>
        template.id === templateId ? candidate : template,
      ),
    },
    { workflow },
  )
}

function canonicalTemplate(template) {
  return JSON.stringify({
    name: template.name,
    content: template.content,
    excludedExternalDependencies: template.excludedExternalDependencies,
  })
}

export function removeTemplate(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const templateId = requireString(
    input?.templateId,
    'Template id',
    MAX_ID_LENGTH,
  )
  if (!board.templates.some((template) => template.id === templateId)) {
    throw new TypeError(`Unknown template: ${templateId}`)
  }
  board.templates = board.templates.filter(
    (template) => template.id !== templateId,
  )
  return board
}

export function instantiateTemplate(
  boardInput,
  input,
  { workflow, idFactory, now = new Date().toISOString() } = {},
) {
  const board = normalizeBoard(boardInput, { workflow })
  const templateId = requireString(
    input?.templateId,
    'Template id',
    MAX_ID_LENGTH,
  )
  const targetWorkflowId = requireString(
    input?.targetWorkflowId,
    'Target Workflow id',
    MAX_ID_LENGTH,
  )
  if (!board.workflows.some((item) => item.id === targetWorkflowId)) {
    throw new TypeError(`Unknown target Workflow: ${targetWorkflowId}`)
  }
  const template = board.templates.find((item) => item.id === templateId)
  if (!template) throw new TypeError(`Unknown template: ${templateId}`)
  if (typeof idFactory !== 'function') {
    throw new TypeError('Template instantiation requires an idFactory.')
  }
  const timestamp = normalizeTimestamp(now, new Date().toISOString())
  const allocate = (label, existingIds) => {
    const id = requireString(idFactory(), label, MAX_ID_LENGTH)
    if (existingIds.has(id)) throw new TypeError(`${label} already exists: ${id}`)
    existingIds.add(id)
    return id
  }
  const workflowIds = new Set(board.workflows.map((item) => item.id))
  const workIds = new Set(board.works.map((item) => item.id))

  if (template.kind === 'work') {
    if (board.works.length >= MAX_WORKS) {
      throw new TypeError(`The board must not exceed ${MAX_WORKS} Works.`)
    }
    const id = allocate('Instantiated Work id', workIds)
    return normalizeBoard(
      {
        ...board,
        works: [
          ...board.works,
          {
            id,
            ...template.content,
            workflowId: targetWorkflowId,
            upstreamWaterLevels: {},
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        ],
      },
      { workflow },
    )
  }

  const mapsRootToTarget = template.content.mapRootToTarget === true
  const createdWorkflowCount =
    template.content.workflows.length - (mapsRootToTarget ? 1 : 0)
  if (board.workflows.length + createdWorkflowCount > MAX_WORKFLOWS) {
    throw new TypeError(`The board must not exceed ${MAX_WORKFLOWS} Workflows.`)
  }
  if (board.works.length + template.content.works.length > MAX_WORKS) {
    throw new TypeError(`The board must not exceed ${MAX_WORKS} Works.`)
  }
  const workflowIdMap = new Map()
  for (const item of template.content.workflows) {
    workflowIdMap.set(
      item.id,
      mapsRootToTarget && item.id === template.content.rootWorkflowId
        ? targetWorkflowId
        : allocate('Instantiated Workflow id', workflowIds),
    )
  }
  const workIdMap = new Map(
    template.content.works.map((item) => [
      item.id,
      allocate('Instantiated Work id', workIds),
    ]),
  )
  const createdWorkflows = template.content.workflows
    .filter(
      (item) =>
        !mapsRootToTarget || item.id !== template.content.rootWorkflowId,
    )
    .map((item) => ({
      id: workflowIdMap.get(item.id),
      title: item.title,
      parentWorkflowId:
        item.id === template.content.rootWorkflowId
          ? targetWorkflowId
          : workflowIdMap.get(item.parentWorkflowId),
      createdAt: timestamp,
      updatedAt: timestamp,
    }))
  const createdWorks = template.content.works.map((work) => ({
    id: workIdMap.get(work.id),
    type: work.type,
    workspaceId: work.workspaceId,
    ...(work.legacyWorkspaceTitle
      ? { legacyWorkspaceTitle: work.legacyWorkspaceTitle }
      : {}),
    key: work.key,
    title: work.title,
    description: work.description,
    assignee: work.assignee,
    waterLevel: work.waterLevel,
    upstreamWaterLevels: Object.fromEntries(
      Object.entries(work.upstreamWaterLevels).map(
        ([upstreamId, waterLevel]) => [workIdMap.get(upstreamId), waterLevel],
      ),
    ),
    workflowId: workflowIdMap.get(work.workflowId),
    columnId: work.columnId,
    createdAt: timestamp,
    updatedAt: timestamp,
  }))
  return normalizeBoard(
    {
      ...board,
      workflows: [...board.workflows, ...createdWorkflows],
      works: [...board.works, ...createdWorks],
    },
    { workflow },
  )
}

export function addWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const id = requireString(input?.id, 'Work id', MAX_ID_LENGTH)
  if (board.works.some((work) => work.id === id)) {
    throw new TypeError(`Duplicate Work id: ${id}`)
  }
  const knownIds = new Set(board.works.map((work) => work.id))
  knownIds.add(id)
  const fields = normalizeEditableFields(input, {
    knownIds,
    workflowIds: new Set(board.workflows.map((container) => container.id)),
    workId: id,
  })
  const requestedColumnId = input?.columnId
  const requestedColumn = board.columns.find(
    (candidate) => candidate.id === requestedColumnId,
  )
  if (requestedColumnId !== undefined && !requestedColumn) {
    throw new TypeError(`Unknown column: ${requestedColumnId}`)
  }
  const column = requestedColumn ?? board.columns[0]
  const createdAt = normalizeTimestamp(
    input?.createdAt,
    new Date().toISOString(),
  )
  board.works.push({
    id,
    ...fields,
    columnId: column.id,
    createdAt,
    updatedAt: createdAt,
  })
  return board
}

export function updateWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const workId = requireString(
    input?.workId ?? input?.cardId,
    'Work id',
    MAX_ID_LENGTH,
  )
  const work = board.works.find((candidate) => candidate.id === workId)

  if (!work) throw new TypeError(`Unknown Work: ${workId}`)
  const fields = normalizeEditableFields(input, {
    legacy: true,
    knownIds: new Set(board.works.map((candidate) => candidate.id)),
    workflowIds: new Set(board.workflows.map((container) => container.id)),
    workId,
  })
  const unchanged = Object.entries(fields).every(([field, value]) =>
    field === 'upstreamWaterLevels'
      ? sameStringMap(work[field], value)
      : work[field] === value,
  )
  if (unchanged) {
    throw new TypeError(`Work ${workId} already has those values.`)
  }
  Object.assign(work, fields)
  work.updatedAt = normalizeTimestamp(input?.updatedAt, new Date().toISOString())
  return board
}

export function addWorkflow(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  if (board.workflows.length >= MAX_WORKFLOWS) {
    throw new TypeError(`The board must not exceed ${MAX_WORKFLOWS} Workflows.`)
  }
  const id = requireString(input?.id, 'Workflow id', MAX_ID_LENGTH)
  if (id === ROOT_WORKFLOW_ID || board.workflows.some((item) => item.id === id)) {
    throw new TypeError(`Duplicate Workflow id: ${id}`)
  }
  const parentWorkflowId = requireString(
    input?.parentWorkflowId,
    'Workflow parentWorkflowId',
    MAX_ID_LENGTH,
  )
  if (!board.workflows.some((item) => item.id === parentWorkflowId)) {
    throw new TypeError(`Unknown parent Workflow: ${parentWorkflowId}`)
  }
  const createdAt = normalizeTimestamp(input?.createdAt, new Date().toISOString())
  board.workflows.push({
    id,
    title: requireString(input?.title, 'Workflow title', MAX_TITLE_LENGTH),
    parentWorkflowId,
    createdAt,
    updatedAt: createdAt,
  })
  return board
}

export function updateWorkflow(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const workflowId = requireString(input?.workflowId, 'Workflow id', MAX_ID_LENGTH)
  if (workflowId === ROOT_WORKFLOW_ID) {
    throw new TypeError('The Root Workflow cannot be changed.')
  }
  const current = board.workflows.find((item) => item.id === workflowId)
  if (!current) throw new TypeError(`Unknown Workflow: ${workflowId}`)
  const title = requireString(input?.title ?? current.title, 'Workflow title', MAX_TITLE_LENGTH)
  const parentWorkflowId = requireString(
    input?.parentWorkflowId ?? current.parentWorkflowId,
    'Workflow parentWorkflowId',
    MAX_ID_LENGTH,
  )
  if (title === current.title && parentWorkflowId === current.parentWorkflowId) {
    throw new TypeError(`Workflow ${workflowId} already has those values.`)
  }
  const candidate = {
    ...board,
    workflows: board.workflows.map((item) =>
      item.id === workflowId
        ? {
            ...item,
            title,
            parentWorkflowId,
            updatedAt: normalizeTimestamp(input?.updatedAt, new Date().toISOString()),
          }
        : item,
    ),
  }
  return normalizeBoard(candidate, { workflow })
}

export function removeWorkflow(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const workflowId = requireString(input?.workflowId, 'Workflow id', MAX_ID_LENGTH)
  if (workflowId === ROOT_WORKFLOW_ID) {
    throw new TypeError('The Root Workflow cannot be deleted.')
  }
  if (!board.workflows.some((item) => item.id === workflowId)) {
    throw new TypeError(`Unknown Workflow: ${workflowId}`)
  }
  if (board.workflows.some((item) => item.parentWorkflowId === workflowId)) {
    throw new TypeError(`Workflow ${workflowId} still contains child Workflows.`)
  }
  if (board.works.some((work) => work.workflowId === workflowId)) {
    throw new TypeError(`Workflow ${workflowId} still contains Works.`)
  }
  board.workflows = board.workflows.filter((item) => item.id !== workflowId)
  return board
}

export function moveWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const rules = normalizeWorkflow(board.columns)
  const workId = requireString(
    input?.workId ?? input?.cardId,
    'Work id',
    MAX_ID_LENGTH,
  )
  const columnId = requireString(
    input?.columnId,
    'Column id',
    MAX_ID_LENGTH,
  )
  const work = board.works.find((candidate) => candidate.id === workId)

  if (!work) throw new TypeError(`Unknown Work: ${workId}`)
  if (!board.columns.some((column) => column.id === columnId)) {
    throw new TypeError(`Unknown column: ${columnId}`)
  }
  if (work.columnId === columnId) {
    throw new TypeError(`Work ${workId} is already in ${columnId}.`)
  }

  const source = rules.find((column) => column.id === work.columnId)
  if (!source?.allowedTransitions.includes(columnId)) {
    throw new TypeError(
      `Works cannot move from ${work.columnId} to ${columnId}.`,
    )
  }

  work.columnId = columnId
  return board
}

export function startWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const workId = requireString(input?.workId, 'Work id', MAX_ID_LENGTH)
  const sessionId = requireString(
    input?.sessionId,
    'Work sessionId',
    MAX_ID_LENGTH,
  )
  const work = board.works.find((candidate) => candidate.id === workId)
  if (!work) throw new TypeError(`Unknown Work: ${workId}`)
  if (work.columnId !== 'ready') {
    throw new TypeError(`Work ${workId} must be Ready before it can run.`)
  }
  const started = moveWork(
    board,
    { workId, columnId: 'in-progress' },
    { workflow },
  )
  const running = started.works.find((candidate) => candidate.id === workId)
  running.sessionId = sessionId
  running.updatedAt = normalizeTimestamp(
    input?.updatedAt,
    new Date().toISOString(),
  )
  return started
}

export function removeWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const workId = requireString(
    input?.workId ?? input?.cardId,
    'Work id',
    MAX_ID_LENGTH,
  )
  if (!board.works.some((work) => work.id === workId)) {
    throw new TypeError(`Unknown Work: ${workId}`)
  }
  const dependent = board.works.find((work) =>
    Object.prototype.hasOwnProperty.call(work.upstreamWaterLevels, workId),
  )
  if (dependent) {
    throw new TypeError(
      `Work ${workId} is still referenced by Work ${dependent.id}.`,
    )
  }
  board.works = board.works.filter((work) => work.id !== workId)
  return board
}

export const addCard = addWork
export const updateCard = updateWork
export const moveCard = moveWork
export const removeCard = removeWork
