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

const MAX_COLUMNS = 32
const MAX_CARDS = 10_000
const MAX_ID_LENGTH = 128
const MAX_TITLE_LENGTH = 500

function requireObject(value, message) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(message)
  }
  return value
}

function requireString(value, field, maximumLength) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`)
  }

  const normalized = value.trim()
  if (normalized.length > maximumLength) {
    throw new TypeError(`${field} must not exceed ${maximumLength} characters.`)
  }
  return normalized
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

export function createDefaultBoard({
  id,
  now,
  workflow = DEFAULT_WORKFLOW,
} = {}) {
  const columns = normalizeWorkflow(workflow)
  const createdAt = normalizeTimestamp(now, new Date().toISOString())
  const cardId = typeof id === 'string' ? id : 'welcome'

  return {
    version: 1,
    columns: columns.map((column, order) => cloneColumn(column, order)),
    cards: [
      {
        id: cardId,
        title: `Move this card to ${columns[1]?.title ?? columns[0].title} to try the board.`,
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

  if (!Array.isArray(columnInput)) {
    throw new TypeError('The board columns must be an array.')
  }
  if (!Array.isArray(board.cards)) {
    throw new TypeError('The board cards must be an array.')
  }
  if (columnInput.length === 0) {
    throw new TypeError('The board must define at least one column.')
  }
  if (columnInput.length > MAX_COLUMNS) {
    throw new TypeError(`The board must not exceed ${MAX_COLUMNS} columns.`)
  }
  if (board.cards.length > MAX_CARDS) {
    throw new TypeError(`The board must not exceed ${MAX_CARDS} cards.`)
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

  const cardIds = new Set()
  const cards = board.cards.map((value, index) => {
    const card = requireObject(value, `Card ${index} must be an object.`)
    const id = requireString(card.id, `Card ${index} id`, MAX_ID_LENGTH)
    const title = requireString(
      card.title,
      `Card ${index} title`,
      MAX_TITLE_LENGTH,
    )
    const columnId = requireString(
      card.columnId,
      `Card ${index} columnId`,
      MAX_ID_LENGTH,
    )

    if (cardIds.has(id)) throw new TypeError(`Duplicate card id: ${id}`)
    if (!columnIds.has(columnId)) {
      throw new TypeError(`Card ${id} references an unknown column: ${columnId}`)
    }
    cardIds.add(id)

    const createdAt = normalizeTimestamp(card.createdAt)
    return {
      id,
      title,
      columnId,
      createdAt,
      updatedAt: normalizeTimestamp(card.updatedAt, createdAt),
    }
  })

  return {
    version: 1,
    columns: columns.sort((left, right) => left.order - right.order),
    cards,
  }
}

export function addCard(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const title = requireString(input?.title, 'Card title', MAX_TITLE_LENGTH)
  const requestedColumnId = input?.columnId
  const column =
    board.columns.find((candidate) => candidate.id === requestedColumnId) ??
    board.columns[0]

  const id = requireString(input?.id, 'Card id', MAX_ID_LENGTH)
  if (board.cards.some((card) => card.id === id)) {
    throw new TypeError(`Duplicate card id: ${id}`)
  }

  const createdAt = normalizeTimestamp(
    input?.createdAt,
    new Date().toISOString(),
  )
  board.cards.push({
    id,
    title,
    columnId: column.id,
    createdAt,
    updatedAt: createdAt,
  })

  return board
}

export function updateCard(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const cardId = requireString(input?.cardId, 'Card id', MAX_ID_LENGTH)
  const title = requireString(input?.title, 'Card title', MAX_TITLE_LENGTH)
  const card = board.cards.find((candidate) => candidate.id === cardId)

  if (!card) throw new TypeError(`Unknown card: ${cardId}`)
  if (card.title === title) {
    throw new TypeError(`Card ${cardId} already has that title.`)
  }
  card.title = title
  card.updatedAt = normalizeTimestamp(input?.updatedAt, new Date().toISOString())
  return board
}

export function moveCard(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const rules = normalizeWorkflow(workflow ?? DEFAULT_WORKFLOW)
  const cardId = requireString(input?.cardId, 'Card id', MAX_ID_LENGTH)
  const columnId = requireString(
    input?.columnId,
    'Column id',
    MAX_ID_LENGTH,
  )
  const card = board.cards.find((candidate) => candidate.id === cardId)

  if (!card) throw new TypeError(`Unknown card: ${cardId}`)
  if (!board.columns.some((column) => column.id === columnId)) {
    throw new TypeError(`Unknown column: ${columnId}`)
  }
  if (card.columnId === columnId) {
    throw new TypeError(`Card ${cardId} is already in ${columnId}.`)
  }

  const source = rules.find((column) => column.id === card.columnId)
  if (!source?.allowedTransitions.includes(columnId)) {
    throw new TypeError(
      `Cards cannot move from ${card.columnId} to ${columnId}.`,
    )
  }

  card.columnId = columnId
  card.updatedAt = normalizeTimestamp(input?.updatedAt, new Date().toISOString())
  return board
}

export function removeCard(boardInput, input, { workflow } = {}) {
  const board = normalizeBoard(boardInput, { workflow })
  const cardId = requireString(input?.cardId, 'Card id', MAX_ID_LENGTH)
  if (!board.cards.some((card) => card.id === cardId)) {
    throw new TypeError(`Unknown card: ${cardId}`)
  }
  board.cards = board.cards.filter((card) => card.id !== cardId)
  return board
}
