import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_WORKFLOW,
  addCard,
  createDefaultBoard,
  moveCard,
  normalizeBoard,
  normalizeWorkflow,
  removeCard,
  updateCard,
} from '../src/board.js'
import { Config, inject, name } from '../src/index.js'

const fixedTime = '2026-01-01T00:00:00.000Z'

function createBoard() {
  return createDefaultBoard({
    id: 'welcome-card',
    now: fixedTime,
  })
}

test('creates the configured five-column default workflow', () => {
  const board = createBoard()

  assert.deepEqual(
    board.columns.map((column) => column.title),
    ['Backlog', 'Ready', 'In Progress', 'Review', 'Done'],
  )
  assert.equal(board.cards[0].id, 'welcome-card')
  assert.equal(board.cards[0].columnId, 'backlog')
  assert.equal(board.cards[0].updatedAt, fixedTime)
})

test('adds, edits, moves, and removes a card without mutating inputs', () => {
  const original = createBoard()
  const added = addCard(
    original,
    {
      id: 'new-card',
      title: 'Ship the Kanban plugin',
      columnId: 'ready',
      createdAt: fixedTime,
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  assert.throws(
    () =>
      updateCard(
        added,
        { cardId: 'new-card', title: 'Ship the Kanban plugin' },
        { workflow: DEFAULT_WORKFLOW },
      ),
    /already has that title/,
  )
  const edited = updateCard(
    added,
    {
      cardId: 'new-card',
      title: 'Ship the Git-backed Kanban plugin',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  const moved = moveCard(
    edited,
    {
      cardId: 'new-card',
      columnId: 'in-progress',
      updatedAt: '2026-01-03T00:00:00.000Z',
    },
    { workflow: DEFAULT_WORKFLOW },
  )
  const removed = removeCard(moved, { cardId: 'welcome-card' }, {
    workflow: DEFAULT_WORKFLOW,
  })

  assert.equal(original.cards.length, 1)
  assert.equal(added.cards.length, 2)
  assert.equal(added.cards.find((card) => card.id === 'new-card').title, 'Ship the Kanban plugin')
  assert.equal(
    moved.cards.find((card) => card.id === 'new-card').columnId,
    'in-progress',
  )
  assert.equal(
    moved.cards.find((card) => card.id === 'new-card').updatedAt,
    '2026-01-02T00:00:00.000Z',
  )
  assert.deepEqual(removed.cards.map((card) => card.id), ['new-card'])
})

test('enforces configured movement restrictions', () => {
  const board = addCard(
    createBoard(),
    {
      id: 'new-card',
      title: 'Restricted card',
      columnId: 'backlog',
      createdAt: fixedTime,
    },
    { workflow: DEFAULT_WORKFLOW },
  )

  assert.throws(
    () =>
      moveCard(
        board,
        { cardId: 'new-card', columnId: 'backlog' },
        { workflow: DEFAULT_WORKFLOW },
      ),
    /already in backlog/,
  )
  assert.throws(
    () =>
      moveCard(
        board,
        { cardId: 'new-card', columnId: 'in-progress' },
        { workflow: DEFAULT_WORKFLOW },
      ),
    /cannot move from backlog to in-progress/,
  )
  assert.equal(
    moveCard(
      board,
      { cardId: 'new-card', columnId: 'ready' },
      { workflow: DEFAULT_WORKFLOW },
    ).cards.find((card) => card.id === 'new-card').columnId,
    'ready',
  )
})

test('uses configured column titles as the board authority', () => {
  const workflow = normalizeWorkflow([
    { id: 'queued', title: 'Queued', allowedTransitions: ['complete'] },
    { id: 'complete', title: 'Complete', allowedTransitions: ['queued'] },
  ])
  const board = normalizeBoard(
    {
      columns: [{ id: 'queued', title: 'Old title', order: 0 }],
      cards: [
        {
          id: 'card-1',
          title: 'Configured card',
          columnId: 'queued',
          createdAt: fixedTime,
        },
      ],
    },
    { workflow },
  )

  assert.deepEqual(board.columns.map((column) => column.title), [
    'Queued',
    'Complete',
  ])
})

test('rejects invalid workflow transitions and card references', () => {
  assert.throws(
    () =>
      normalizeWorkflow([
        { id: 'one', title: 'One', allowedTransitions: ['missing'] },
      ]),
    /unknown transition/,
  )
  assert.throws(
    () =>
      normalizeBoard({
        columns: [{ id: 'backlog', title: 'Backlog', order: 0 }],
        cards: [{ id: 'card-1', title: 'Broken', columnId: 'missing' }],
      }),
    /unknown column/,
  )
})

test('declares a statically configured Host plugin', () => {
  assert.equal(name, 'dddrop-kanban')
  assert.deepEqual(inject, ['webServer', 'webRuntime'])

  const valid = Config['~standard'].validate({
    repositoryPath: '/tmp/kanban-data',
    autoPull: false,
    autoPush: false,
  })
  assert.equal(valid.issues, undefined)
  assert.equal(valid.value.columns.length, 5)

  const invalid = Config['~standard'].validate({ autoPull: false })
  assert.equal(invalid.issues.length, 1)
  assert.match(invalid.issues[0].message, /repositoryPath/)
})
