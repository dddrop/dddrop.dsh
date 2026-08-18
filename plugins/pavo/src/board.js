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
export const ROOT_WORKFLOW_ID = 'root'
export const ROOT_WORKFLOW_TITLE = 'Root Workflow'

const MAX_COLUMNS = 32
const MAX_WORKS = 10_000
const MAX_WORKFLOWS = 10_000
const MAX_PROJECTS = 1_000
const MAX_ID_LENGTH = 128
const MAX_PROJECT_LENGTH = 128
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

export function normalizeProjects(input = []) {
  if (!Array.isArray(input)) {
    throw new TypeError('The board projects must be an array.')
  }
  if (input.length > MAX_PROJECTS) {
    throw new TypeError(`The board must not exceed ${MAX_PROJECTS} projects.`)
  }

  const names = new Set()
  return input.map((value, index) => {
    const project = requireString(value, `Project ${index}`, MAX_PROJECT_LENGTH)
    const identity = project.toLocaleLowerCase('en-US')
    if (names.has(identity)) throw new TypeError(`Duplicate project: ${project}`)
    names.add(identity)
    return project
  })
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
  projects,
  {
    knownIds = new Set(),
    workflowIds = new Set([ROOT_WORKFLOW_ID]),
    workId = '',
  } = {},
) {
  const project = requireString(
    input?.project ?? '',
    'Work project',
    MAX_PROJECT_LENGTH,
    { allowEmpty: true },
  )
  if (project && !projects.includes(project)) {
    throw new TypeError(`Work project is not configured: ${project}`)
  }

  return {
    type: normalizeWorkType(input?.type),
    project,
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
    assignee: requireString(
      input?.assignee ?? '',
      'Work assignee',
      MAX_ASSIGNEE_LENGTH,
      { allowEmpty: true },
    ),
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
    projects: [],
    columns: columns.map((column, order) => cloneColumn(column, order)),
    workflows: [rootWorkflow(createdAt)],
    works: [
      {
        id: workId,
        type: 'goal',
        project: '',
        key: 'WELCOME',
        title: `Move this Work to ${columns[1]?.title ?? columns[0].title} to try the board.`,
        description: '',
        assignee: '',
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
  const configuredWorkflow = workflow ? normalizeWorkflow(workflow) : undefined
  const columnInput = configuredWorkflow ?? board.columns
  const projects = normalizeProjects(board.projects ?? [])
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

  const columnIds = new Set()
  const columns = columnInput.map((value, index) => {
    const column = requireObject(value, `Column ${index} must be an object.`)
    const id = requireString(column.id, `Column ${index} id`, MAX_ID_LENGTH)
    const title = requireString(
      column.title,
      `Column ${index} title`,
      MAX_TITLE_LENGTH,
    )

    if (columnIds.has(id)) throw new TypeError(`Duplicate column id: ${id}`)
    columnIds.add(id)

    return {
      id,
      title,
      order: configuredWorkflow
        ? index
        : Number.isFinite(column.order)
          ? column.order
          : index,
    }
  })

  const workIds = new Set()
  const indexedWorks = workInput.map((value, index) => {
    const work = requireObject(value, `Work ${index} must be an object.`)
    const id = requireString(work.id, `Work ${index} id`, MAX_ID_LENGTH)
    if (workIds.has(id)) throw new TypeError(`Duplicate Work id: ${id}`)
    workIds.add(id)
    return { work, id, index }
  })

  const works = indexedWorks.map(({ work, id, index }) => {
    const fields = normalizeEditableFields(work, projects, {
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

  return {
    version: 1,
    projects,
    columns: columns.sort((left, right) => left.order - right.order),
    workflows,
    works,
  }
}

export function addWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const id = requireString(input?.id, 'Work id', MAX_ID_LENGTH)
  if (board.works.some((work) => work.id === id)) {
    throw new TypeError(`Duplicate Work id: ${id}`)
  }
  const knownIds = new Set(board.works.map((work) => work.id))
  knownIds.add(id)
  const fields = normalizeEditableFields(input, board.projects, {
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
  const fields = normalizeEditableFields(input, board.projects, {
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

export function addProject(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  if (board.projects.length >= MAX_PROJECTS) {
    throw new TypeError(`The board must not exceed ${MAX_PROJECTS} projects.`)
  }
  const project = requireString(input?.project, 'Project', MAX_PROJECT_LENGTH)
  if (
    board.projects.some(
      (candidate) =>
        candidate.toLocaleLowerCase('en-US') ===
        project.toLocaleLowerCase('en-US'),
    )
  ) {
    throw new TypeError(`Project is already configured: ${project}`)
  }
  board.projects.push(project)
  return board
}

export function removeProject(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const project = requireString(input?.project, 'Project', MAX_PROJECT_LENGTH)
  if (!board.projects.includes(project)) {
    throw new TypeError(`Unknown project: ${project}`)
  }
  if (board.works.some((work) => work.project === project)) {
    throw new TypeError(`Project ${project} is still used by one or more Works.`)
  }
  board.projects = board.projects.filter((candidate) => candidate !== project)
  return board
}

export function moveWork(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const rules = normalizeWorkflow(workflow ?? DEFAULT_WORKFLOW)
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
