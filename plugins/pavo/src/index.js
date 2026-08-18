import {
  ROOT_WORKFLOW_ID,
  addProject,
  addTemplate,
  addWork,
  addWorkflow,
  compareWaterLevels,
  instantiateTemplate,
  moveWork,
  removeProject,
  removeTemplate,
  removeWork,
  removeWorkflow,
  updateTemplate,
  updateWork,
  updateWorkflow,
  workTemplateContentFromWork,
  workflowTemplateContentFromWorkflow,
} from './board.js'
import { Config, RepositoryError } from './git-store.js'
import { RepositoryController } from './repository-settings.js'
import { uuidv7 } from './uuid-v7.js'

export const name = 'dddrop-pavo'
export const inject = ['webServer', 'webRuntime']
export { Config }

const API_PATH = '/_dddrop/pavo'
const LEGACY_API_PATH = '/_dddrop/kanban'
const MAX_REQUEST_BYTES = 1024 * 1024

function compileToolSchema(specification) {
  if (!specification || typeof specification !== 'object') return specification
  const schema = Object.fromEntries(
    Object.entries(specification)
      .filter(([key]) => key !== 'required' && key !== 'properties' && key !== 'items')
      .map(([key, value]) => [
        key,
        key === 'additionalProperties' && value && typeof value === 'object'
          ? compileToolSchema(value)
          : value,
      ]),
  )
  if (specification.properties) {
    schema.properties = Object.fromEntries(
      Object.entries(specification.properties).map(([key, value]) => [
        key,
        compileToolSchema(value),
      ]),
    )
    const required = Object.entries(specification.properties)
      .filter(([, value]) => value.required === true)
      .map(([key]) => key)
    if (required.length > 0) schema.required = required
  }
  if (specification.items) schema.items = compileToolSchema(specification.items)
  return schema
}

function toolSchemaViolations(schema, value, path = 'arguments') {
  const violations = []
  const matchesType =
    schema.type === 'object'
      ? value !== null && typeof value === 'object' && !Array.isArray(value)
      : schema.type === 'array'
        ? Array.isArray(value)
        : schema.type === 'integer'
          ? Number.isSafeInteger(value)
          : schema.type === 'number'
            ? typeof value === 'number' && Number.isFinite(value)
            : schema.type === 'null'
              ? value === null
              : typeof value === schema.type
  if (!matchesType) return [`${path} must be ${schema.type}.`]
  if (schema.enum && !schema.enum.includes(value)) {
    return [`${path} must be one of ${schema.enum.join(', ')}.`]
  }
  if (schema.type === 'array' && schema.items) {
    value.forEach((item, index) => {
      violations.push(...toolSchemaViolations(schema.items, item, `${path}[${index}]`))
    })
  }
  if (schema.type === 'object') {
    for (const key of schema.required ?? []) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        violations.push(`${path}.${key} is required.`)
      }
    }
    const properties = schema.properties ?? {}
    for (const [key, child] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        violations.push(...toolSchemaViolations(child, value[key], `${path}.${key}`))
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(properties, key)) {
          violations.push(`${path}.${key} is not allowed.`)
        }
      }
    }
  }
  return violations
}

function defineTool(definition) {
  const parameters = compileToolSchema({
    type: 'object',
    properties: definition.parameters,
    additionalProperties: false,
  })
  return {
    ...definition,
    parameters,
    output: {
      ...definition.output,
      schema: compileToolSchema(definition.output.schema),
    },
    execute(args, exec) {
      const violations = toolSchemaViolations(parameters, args)
      if (violations.length > 0) {
        throw new TypeError(`Invalid Pavo tool arguments: ${violations.join(' ')}`)
      }
      return definition.execute(args, exec)
    },
  }
}

class RequestError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

function normalizedAuthority(value) {
  if (typeof value !== 'string' || value.length === 0) return undefined
  try {
    const parsed = new URL(`http://${value}`)
    return {
      authority: parsed.host.toLowerCase(),
      hostname: parsed.hostname.toLowerCase().replace(/\.$/, ''),
    }
  } catch {
    return undefined
  }
}

function matchesTrustedAuthority(host, trustedHosts) {
  return trustedHosts.some((value) => {
    const trusted = normalizedAuthority(value)
    if (!trusted) return false
    let hasExplicitPort = false
    try {
      hasExplicitPort = new URL(`http://${value}`).port.length > 0
    } catch {
      return false
    }
    return hasExplicitPort
      ? trusted.authority === host.authority
      : trusted.hostname === host.hostname
  })
}

function assertTrustedRequest(request, trustedHosts) {
  const host = normalizedAuthority(request.headers.host)
  const loopback =
    host &&
    (host.hostname === '127.0.0.1' ||
      host.hostname === '::1' ||
      host.hostname === 'localhost')
  const trusted = host && matchesTrustedAuthority(host, trustedHosts)

  if (!loopback && !trusted) {
    throw new RequestError('The Pavo endpoint rejected the request Host.', 403)
  }
  if (request.headers['sec-fetch-site'] === 'cross-site') {
    throw new RequestError('Cross-site Pavo requests are not allowed.', 403)
  }

  const origin = request.headers.origin
  if (origin !== undefined) {
    let originAuthority
    try {
      originAuthority = new URL(origin).host.toLowerCase()
    } catch {
      throw new RequestError('The request Origin header is invalid.', 403)
    }
    if (!host || originAuthority !== host.authority) {
      throw new RequestError('The request Origin does not match the Host.', 403)
    }
  }
}

function assertRepositorySettingsRequest(request) {
  if (
    request.headers.origin === undefined ||
    request.headers['sec-fetch-site'] !== 'same-origin' ||
    !['cors', 'same-origin'].includes(request.headers['sec-fetch-mode'])
  ) {
    throw new RequestError(
      'Repository settings can only be changed from the Pavo Settings page.',
      403,
    )
  }
}

async function readJsonBody(request) {
  const contentType = request.headers['content-type'] ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new RequestError('Content-Type must be application/json.', 415)
  }
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_REQUEST_BYTES) {
      throw new RequestError('The request body is too large.', 413)
    }
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new RequestError('The request body must contain valid JSON.')
  }
}

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload)
  response.writeHead(status, {
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
    'content-type': 'application/json; charset=utf-8',
    'x-content-type-options': 'nosniff',
  })
  response.end(body)
}

function publicBoard(board) {
  return {
    ...board,
    // Temporary shape-compatible alias for clients loaded before the Work migration.
    cards: board.works.map((work) => ({
      ...work,
      body: work.description,
    })),
  }
}

function publicSnapshot(snapshot, controller) {
  return {
    board: publicBoard(snapshot.board),
    revision: snapshot.revision,
    pollIntervalMs:
      snapshot.pollIntervalMs ?? controller.config.pollIntervalMs,
    workflow: snapshot.workflow ?? controller.config.columns,
    syncError:
      typeof snapshot.syncError === 'string' ? snapshot.syncError : undefined,
    ...controller.describe(),
  }
}

function mergedWorkInput(work, args) {
  return {
    ...work,
    type: args.type ?? work.type,
    project: args.project ?? work.project,
    key: args.key ?? work.key,
    title: args.title ?? work.title,
    description: args.description ?? args.body ?? work.description,
    assignee: args.assignee ?? work.assignee,
    waterLevel: args.waterLevel ?? work.waterLevel,
    upstreamWaterLevels:
      args.upstreamWaterLevels ?? work.upstreamWaterLevels,
    workflowId: args.workflowId ?? work.workflowId,
  }
}

function templateContentFromArgs(board, args, kind) {
  if (kind === 'work') {
    if (args.sourceWorkId !== undefined) {
      const work = board.works.find((candidate) => candidate.id === args.sourceWorkId)
      if (!work) throw new TypeError(`Unknown Work: ${args.sourceWorkId}`)
      return {
        content: workTemplateContentFromWork(work),
        excludedExternalDependencies: Object.keys(work.upstreamWaterLevels).length,
      }
    }
    return {
      content: args.content,
      excludedExternalDependencies: args.excludedExternalDependencies ?? 0,
    }
  }
  if (kind === 'workflow') {
    if (args.sourceWorkflowId !== undefined) {
      return workflowTemplateContentFromWorkflow(board, args.sourceWorkflowId)
    }
    if (args.content !== undefined) {
      return {
        content: args.content,
        excludedExternalDependencies: args.excludedExternalDependencies ?? 0,
      }
    }
    const title = args.rootTitle ?? args.name
    return {
      content: {
        rootWorkflowId: 'root',
        workflows: [{ id: 'root', title, parentWorkflowId: null }],
        works: [],
      },
      excludedExternalDependencies: 0,
    }
  }
  throw new TypeError('Template kind must be work or workflow.')
}

async function dispatch(controller, request) {
  const body = await readJsonBody(request)
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new RequestError('The request body must be an object.')
  }
  const args =
    body.args && typeof body.args === 'object' && !Array.isArray(body.args)
      ? body.args
      : {}
  const mutationOptions = { expectedRevision: args.expectedRevision }

  switch (body.method) {
    case 'repositorySettings':
      return controller.describe()
    case 'overview':
      return publicSnapshot(await controller.overview(), controller)
    case 'saveRepository':
      assertRepositorySettingsRequest(request)
      return controller.updateRepository(
        args.repository,
        args.expectedRepositoryRevision,
      )
    case 'add':
    case 'addWork':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): add work',
          mutation: (board) =>
            addWork(
              board,
              {
                id: uuidv7(),
                type: args.type ?? 'goal',
                project: args.project,
                key: args.key,
                title: args.title,
                description: args.description ?? args.body ?? '',
                assignee: args.assignee,
                waterLevel: args.waterLevel,
                upstreamWaterLevels: args.upstreamWaterLevels ?? {},
                workflowId: args.workflowId ?? ROOT_WORKFLOW_ID,
                columnId: args.columnId,
                createdAt: new Date().toISOString(),
              },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'update':
    case 'updateWork':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): update work',
          mutation: (board) => {
            const workId = args.workId ?? args.cardId
            const work = board.works.find((candidate) => candidate.id === workId)
            if (!work) throw new TypeError(`Unknown Work: ${workId}`)
            return updateWork(
              board,
              {
                workId,
                ...mergedWorkInput(work, args),
                updatedAt: new Date().toISOString(),
              },
              { workflow: controller.config.columns },
            )
          },
        }),
        controller,
      )
    case 'addWorkflow':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): add workflow',
          mutation: (board) =>
            addWorkflow(
              board,
              {
                id: uuidv7(),
                title: args.title,
                parentWorkflowId: args.parentWorkflowId ?? ROOT_WORKFLOW_ID,
                createdAt: new Date().toISOString(),
              },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'updateWorkflow':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): update workflow',
          mutation: (board) =>
            updateWorkflow(
              board,
              {
                workflowId: args.workflowId,
                title: args.title,
                parentWorkflowId: args.parentWorkflowId,
                updatedAt: new Date().toISOString(),
              },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'removeWorkflow':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): remove workflow',
          mutation: (board) =>
            removeWorkflow(
              board,
              { workflowId: args.workflowId },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'addTemplate':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): add template',
          mutation: (board) => {
            const kind = args.kind
            const captured = templateContentFromArgs(board, args, kind)
            return addTemplate(
              board,
              {
                id: uuidv7(),
                kind,
                name: args.name,
                ...captured,
                createdAt: new Date().toISOString(),
              },
              { workflow: controller.config.columns },
            )
          },
        }),
        controller,
      )
    case 'updateTemplate':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): update template',
          mutation: (board) => {
            const current = board.templates.find(
              (template) => template.id === args.templateId,
            )
            if (!current) throw new TypeError(`Unknown template: ${args.templateId}`)
            const replacesContent =
              args.content !== undefined ||
              args.sourceWorkId !== undefined ||
              args.sourceWorkflowId !== undefined
            const captured = replacesContent
              ? templateContentFromArgs(board, args, current.kind)
              : {}
            return updateTemplate(
              board,
              {
                templateId: current.id,
                name: args.name,
                ...captured,
                updatedAt: new Date().toISOString(),
              },
              { workflow: controller.config.columns },
            )
          },
        }),
        controller,
      )
    case 'removeTemplate':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): remove template',
          mutation: (board) =>
            removeTemplate(
              board,
              { templateId: args.templateId },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'instantiateTemplate':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): instantiate template',
          mutation: (board) =>
            instantiateTemplate(
              board,
              {
                templateId: args.templateId,
                targetWorkflowId: args.targetWorkflowId ?? ROOT_WORKFLOW_ID,
              },
              {
                workflow: controller.config.columns,
                idFactory: uuidv7,
                now: new Date().toISOString(),
              },
            ),
        }),
        controller,
      )
    case 'addProject':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): add project',
          mutation: (board) =>
            addProject(
              board,
              { project: args.project },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'removeProject':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): remove project',
          mutation: (board) =>
            removeProject(
              board,
              { project: args.project },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'move':
    case 'moveWork':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): move work',
          mutation: (board) =>
            moveWork(
              board,
              {
                workId: args.workId ?? args.cardId,
                columnId: args.columnId,
              },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    case 'remove':
    case 'removeWork':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: 'feat(pavo): remove work',
          mutation: (board) =>
            removeWork(
              board,
              { workId: args.workId ?? args.cardId },
              { workflow: controller.config.columns },
            ),
        }),
        controller,
      )
    default:
      throw new RequestError('Unknown Pavo method.')
  }
}

function createHandler(controller, trustedHosts) {
  return async (request, response) => {
    try {
      assertTrustedRequest(request, trustedHosts)
      if (request.method !== 'POST') {
        response.setHeader('allow', 'POST')
        sendJson(response, 405, { ok: false, error: 'Method not allowed.' })
        return
      }
      const value = await dispatch(controller, request)
      sendJson(response, 200, { ok: true, value })
    } catch (error) {
      const clientError =
        error instanceof RequestError ||
        error instanceof RepositoryError ||
        error instanceof TypeError
      const status =
        error instanceof RequestError || error instanceof RepositoryError
          ? error.status
          : clientError
            ? 400
            : 500
      const message = clientError
        ? error.message
        : 'The Pavo request failed unexpectedly.'
      sendJson(response, status, { ok: false, error: message })
    }
  }
}

function renderToolValue(label, value) {
  return [
    {
      type: 'text',
      text: `${label}\n${JSON.stringify(value, null, 2)}`,
    },
  ]
}

function workView(work) {
  return {
    id: work.id,
    type: work.type,
    project: work.project,
    key: work.key,
    title: work.title,
    description: work.description,
    assignee: work.assignee,
    waterLevel: work.waterLevel,
    upstreamWaterLevels: { ...work.upstreamWaterLevels },
    workflowId: work.workflowId,
    columnId: work.columnId,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
  }
}

function workSummary(work) {
  return {
    id: work.id,
    type: work.type,
    project: work.project,
    key: work.key,
    title: work.title,
    assignee: work.assignee,
    waterLevel: work.waterLevel,
    workflowId: work.workflowId,
    columnId: work.columnId,
    upstreamCount: Object.keys(work.upstreamWaterLevels).length,
    updatedAt: work.updatedAt,
  }
}

function workflowPath(board, workflowId) {
  const byId = new Map(board.workflows.map((workflow) => [workflow.id, workflow]))
  const path = []
  let current = byId.get(workflowId)
  while (current) {
    path.unshift({ ...current })
    current = current.parentWorkflowId ? byId.get(current.parentWorkflowId) : undefined
  }
  return path
}

function upstreamView(board, work) {
  return Object.entries(work.upstreamWaterLevels).map(
    ([upstreamWorkId, acknowledgedWaterLevel]) => {
      const upstream = board.works.find(
        (candidate) => candidate.id === upstreamWorkId,
      )
      const comparison = compareWaterLevels(
        upstream.waterLevel,
        acknowledgedWaterLevel,
      )
      return {
        work: workView(upstream),
        acknowledgedWaterLevel,
        state:
          comparison > 0
            ? 'changed'
            : comparison < 0
              ? 'rollback'
              : 'synchronized',
      }
    },
  )
}

const WATER_LEVEL_MAP_SCHEMA = {
  type: 'object',
  additionalProperties: true,
  description:
    'Dictionary whose keys are immutable upstream Work IDs and values are acknowledged non-negative decimal WaterLevels.',
}

const WORKFLOW_COLUMN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    allowedTransitions: {
      type: 'array',
      required: true,
      items: { type: 'string' },
    },
  },
}

const WORK_SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    type: { type: 'string', enum: ['goal', 'ongoing'], required: true },
    project: { type: 'string', required: true },
    key: { type: 'string', required: true },
    title: { type: 'string', required: true },
    assignee: { type: 'string', required: true },
    waterLevel: { type: 'string', required: true },
    workflowId: { type: 'string', required: true },
    columnId: { type: 'string', required: true },
    upstreamCount: { type: 'integer', required: true },
    updatedAt: { type: 'string', required: true },
  },
}

const WORKFLOW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    parentWorkflowId: { oneOf: [{ type: 'string' }, { type: 'null' }], required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
  },
}

const WORK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    type: { type: 'string', enum: ['goal', 'ongoing'], required: true },
    project: { type: 'string', required: true },
    key: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    assignee: { type: 'string', required: true },
    waterLevel: { type: 'string', required: true },
    upstreamWaterLevels: { ...WATER_LEVEL_MAP_SCHEMA, required: true },
    workflowId: { type: 'string', required: true },
    columnId: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
  },
}

const TEMPLATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    kind: { type: 'string', enum: ['work', 'workflow'], required: true },
    name: { type: 'string', required: true },
    content: { type: 'object', required: true },
    excludedExternalDependencies: { type: 'integer', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
  },
}

function templateView(template) {
  return {
    id: template.id,
    kind: template.kind,
    name: template.name,
    content: template.content,
    excludedExternalDependencies: template.excludedExternalDependencies,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  }
}

function requireToolWork(board, workId) {
  if (typeof workId !== 'string' || workId.trim().length === 0) {
    throw new TypeError('workId must be a non-empty string.')
  }
  const work = board.works.find((candidate) => candidate.id === workId)
  if (!work) throw new TypeError(`Unknown Pavo Work: ${workId}`)
  return work
}

function registerAgentTools(ctx, controller) {
  const tools = ctx.get('tools')
  if (!tools) return

  const listTool = defineTool({
    name: 'pavo_list_works',
    description:
      'List Pavo Works and the current optimistic revision. Pavo is passive: inspect the Works and decide what, if anything, to execute or change.',
    parameters: {
      project: { type: 'string', description: 'Filter by exact Project.' },
      columnId: { type: 'string', description: 'Filter by status column.' },
      workflowId: { type: 'string', description: 'Filter by exact Workflow container.' },
      assignee: { type: 'string', description: 'Filter by exact assignee.' },
      query: {
        type: 'string',
        description: 'Case-insensitive text matched across Work content.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          revision: { type: 'string', required: true },
          works: { type: 'array', required: true, items: WORK_SUMMARY_SCHEMA },
          total: { type: 'integer', required: true },
          projects: {
            type: 'array',
            required: true,
            items: { type: 'string' },
          },
          workflow: {
            type: 'array',
            required: true,
            items: WORKFLOW_COLUMN_SCHEMA,
          },
          workflows: {
            type: 'array',
            required: true,
            items: WORKFLOW_SCHEMA,
          },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Work list', value),
    },
    async execute(args) {
      const snapshot = await controller.overview()
      const query = args.query?.toLocaleLowerCase('en-US')
      const works = snapshot.board.works.filter((work) => {
        if (args.project !== undefined && work.project !== args.project) return false
        if (args.columnId !== undefined && work.columnId !== args.columnId) return false
        if (args.workflowId !== undefined && work.workflowId !== args.workflowId) return false
        if (args.assignee !== undefined && work.assignee !== args.assignee) return false
        if (!query) return true
        return [
          work.key,
          work.title,
          work.description,
          work.project,
          work.assignee,
        ].some((value) => value.toLocaleLowerCase('en-US').includes(query))
      })
      return {
        revision: snapshot.revision,
        works: works.map(workSummary),
        total: works.length,
        projects: [...snapshot.board.projects],
        workflow: snapshot.workflow.map((column) => ({
          id: column.id,
          title: column.title,
          allowedTransitions: [...column.allowedTransitions],
        })),
        workflows: snapshot.board.workflows.map((container) => ({ ...container })),
      }
    },
    presentCall: () => ({ card: 'generic', title: 'List Pavo Works', kind: 'read' }),
  })

  const readTool = defineTool({
    name: 'pavo_read_work',
    description:
      'Read one Pavo Work, its Description (used by the Agent as the Prompt), its upstream Work context, and the current optimistic revision.',
    parameters: {
      workId: {
        type: 'string',
        required: true,
        description: 'Canonical immutable Work ID, not the human-readable key.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          revision: { type: 'string', required: true },
          work: { ...WORK_SCHEMA, required: true },
          upstreams: { type: 'array', required: true, items: { type: 'object' } },
          workflowPath: { type: 'array', required: true, items: WORKFLOW_SCHEMA },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Work', value),
    },
    async execute(args) {
      const snapshot = await controller.overview()
      const work = requireToolWork(snapshot.board, args.workId)
      return {
        revision: snapshot.revision,
        work: workView(work),
        upstreams: upstreamView(snapshot.board, work),
        workflowPath: workflowPath(snapshot.board, work.workflowId),
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: 'Read Pavo Work',
      kind: 'read',
      rawInput: args.workId,
    }),
  })

  const updateTool = defineTool({
    name: 'pavo_update_work',
    description:
      'Create, edit, move, or delete a Pavo Work using an exact revision. The Agent owns every decision; Pavo does not infer, schedule, retry, increment WaterLevel, or acknowledge upstream versions automatically.',
    parameters: {
      action: {
        type: 'string',
        enum: ['create', 'edit', 'move', 'delete'],
        required: true,
      },
      expectedRevision: { type: 'string', required: true },
      workId: { type: 'string' },
      type: { type: 'string', enum: ['goal', 'ongoing'] },
      project: { type: 'string' },
      key: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      assignee: { type: 'string' },
      waterLevel: { type: 'string' },
      upstreamWaterLevels: WATER_LEVEL_MAP_SCHEMA,
      workflowId: { type: 'string' },
      columnId: { type: 'string' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: { type: 'string', required: true },
          previousRevision: { type: 'string', required: true },
          revision: { type: 'string', required: true },
          work: WORK_SCHEMA,
          deletedWorkId: { type: 'string' },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Work mutation', value),
    },
    async execute(args) {
      const contentFields = [
        'type',
        'project',
        'key',
        'title',
        'description',
        'assignee',
        'waterLevel',
        'upstreamWaterLevels',
        'workflowId',
      ]
      const suppliedContent = contentFields.filter((field) => args[field] !== undefined)
      if (args.action === 'create') {
        if (args.workId !== undefined) {
          throw new TypeError('workId must be omitted when creating a Work.')
        }
        if (typeof args.title !== 'string' || args.title.trim().length === 0) {
          throw new TypeError('title is required when creating a Work.')
        }
      } else {
        if (typeof args.workId !== 'string' || args.workId.trim().length === 0) {
          throw new TypeError(`workId is required for the ${args.action} action.`)
        }
        if (args.action === 'edit' && suppliedContent.length === 0) {
          throw new TypeError('The edit action requires at least one editable Work field.')
        }
        if (args.action === 'edit' && args.columnId !== undefined) {
          throw new TypeError('Use the move action to change a Work column.')
        }
        if (['move', 'delete'].includes(args.action) && suppliedContent.length > 0) {
          throw new TypeError(`${args.action} does not accept editable Work fields.`)
        }
        if (
          args.action === 'move' &&
          (typeof args.columnId !== 'string' || args.columnId.trim().length === 0)
        ) {
          throw new TypeError('columnId is required for the move action.')
        }
        if (args.action === 'delete' && args.columnId !== undefined) {
          throw new TypeError('delete does not accept columnId.')
        }
      }

      const now = new Date().toISOString()
      let targetWorkId = args.workId
      const snapshot = await controller.mutate({
        expectedRevision: args.expectedRevision,
        commitMessage: `feat(pavo): ${args.action} work`,
        mutation: (board) => {
          switch (args.action) {
            case 'create': {
              if (args.workId !== undefined) {
                throw new TypeError('workId must be omitted when creating a Work.')
              }
              targetWorkId = uuidv7()
              return addWork(
                board,
                {
                  id: targetWorkId,
                  type: args.type ?? 'goal',
                  project: args.project,
                  key: args.key,
                  title: args.title,
                  description: args.description ?? '',
                  assignee: args.assignee ?? '',
                  waterLevel: args.waterLevel ?? '0',
                  upstreamWaterLevels: args.upstreamWaterLevels ?? {},
                  workflowId: args.workflowId ?? ROOT_WORKFLOW_ID,
                  columnId: args.columnId,
                  createdAt: now,
                },
                { workflow: controller.config.columns },
              )
            }
            case 'edit': {
              const work = requireToolWork(board, args.workId)
              return updateWork(
                board,
                {
                  workId: work.id,
                  ...mergedWorkInput(work, args),
                  updatedAt: now,
                },
                { workflow: controller.config.columns },
              )
            }
            case 'move':
              return moveWork(
                board,
                { workId: args.workId, columnId: args.columnId },
                { workflow: controller.config.columns },
              )
            case 'delete':
              return removeWork(
                board,
                { workId: args.workId },
                { workflow: controller.config.columns },
              )
            default:
              throw new TypeError(`Unknown Pavo Work action: ${args.action}`)
          }
        },
      })
      return {
        action: args.action,
        previousRevision: args.expectedRevision,
        revision: snapshot.revision,
        ...(args.action === 'delete'
          ? { deletedWorkId: targetWorkId }
          : {
              work: workView(
                snapshot.board.works.find((work) => work.id === targetWorkId),
              ),
            }),
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: `${args.action} Pavo Work`,
      kind: args.action === 'delete' ? 'delete' : 'other',
      rawInput: args.workId ?? args.title,
    }),
  })

  const updateWorkflowTool = defineTool({
    name: 'pavo_update_workflow',
    description:
      'Create, rename, move, or delete a nested Pavo Workflow using an exact revision. Workflow containers never execute Works, aggregate WaterLevels, or alter dependencies automatically.',
    parameters: {
      action: {
        type: 'string',
        enum: ['create', 'edit', 'move', 'delete'],
        required: true,
      },
      expectedRevision: { type: 'string', required: true },
      workflowId: { type: 'string' },
      title: { type: 'string' },
      parentWorkflowId: { type: 'string' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: { type: 'string', required: true },
          previousRevision: { type: 'string', required: true },
          revision: { type: 'string', required: true },
          workflow: WORKFLOW_SCHEMA,
          deletedWorkflowId: { type: 'string' },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Workflow mutation', value),
    },
    async execute(args) {
      if (args.action === 'create') {
        if (args.workflowId !== undefined) {
          throw new TypeError('workflowId must be omitted when creating a Workflow.')
        }
        if (typeof args.title !== 'string' || args.title.trim().length === 0) {
          throw new TypeError('title is required when creating a Workflow.')
        }
      } else if (typeof args.workflowId !== 'string' || args.workflowId.trim().length === 0) {
        throw new TypeError(`workflowId is required for the ${args.action} action.`)
      }
      if (args.action === 'edit') {
        if (typeof args.title !== 'string' || args.title.trim().length === 0) {
          throw new TypeError('title is required for the edit action.')
        }
        if (args.parentWorkflowId !== undefined) {
          throw new TypeError('Use the move action to change a Workflow parent.')
        }
      }
      if (args.action === 'move') {
        if (
          typeof args.parentWorkflowId !== 'string' ||
          args.parentWorkflowId.trim().length === 0
        ) {
          throw new TypeError('parentWorkflowId is required for the move action.')
        }
        if (args.title !== undefined) {
          throw new TypeError('move does not accept title.')
        }
      }
      if (args.action === 'delete' && (args.title !== undefined || args.parentWorkflowId !== undefined)) {
        throw new TypeError('delete does not accept title or parentWorkflowId.')
      }

      const now = new Date().toISOString()
      let targetWorkflowId = args.workflowId
      const snapshot = await controller.mutate({
        expectedRevision: args.expectedRevision,
        commitMessage: `feat(pavo): ${args.action} workflow`,
        mutation: (board) => {
          switch (args.action) {
            case 'create':
              targetWorkflowId = uuidv7()
              return addWorkflow(
                board,
                {
                  id: targetWorkflowId,
                  title: args.title,
                  parentWorkflowId: args.parentWorkflowId ?? ROOT_WORKFLOW_ID,
                  createdAt: now,
                },
                { workflow: controller.config.columns },
              )
            case 'edit': {
              const current = board.workflows.find((item) => item.id === args.workflowId)
              if (!current) throw new TypeError(`Unknown Workflow: ${args.workflowId}`)
              return updateWorkflow(
                board,
                { workflowId: current.id, title: args.title, updatedAt: now },
                { workflow: controller.config.columns },
              )
            }
            case 'move': {
              const current = board.workflows.find((item) => item.id === args.workflowId)
              if (!current) throw new TypeError(`Unknown Workflow: ${args.workflowId}`)
              return updateWorkflow(
                board,
                {
                  workflowId: current.id,
                  title: current.title,
                  parentWorkflowId: args.parentWorkflowId,
                  updatedAt: now,
                },
                { workflow: controller.config.columns },
              )
            }
            case 'delete':
              return removeWorkflow(
                board,
                { workflowId: args.workflowId },
                { workflow: controller.config.columns },
              )
            default:
              throw new TypeError(`Unknown Pavo Workflow action: ${args.action}`)
          }
        },
      })
      return {
        action: args.action,
        previousRevision: args.expectedRevision,
        revision: snapshot.revision,
        ...(args.action === 'delete'
          ? { deletedWorkflowId: targetWorkflowId }
          : {
              workflow: {
                ...snapshot.board.workflows.find(
                  (item) => item.id === targetWorkflowId,
                ),
              },
            }),
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: `${args.action} Pavo Workflow`,
      kind: args.action === 'delete' ? 'delete' : 'other',
      rawInput: args.workflowId ?? args.title,
    }),
  })

  const listTemplatesTool = defineTool({
    name: 'pavo_list_templates',
    description:
      'List reusable Pavo Work and Workflow templates. Templates are passive records and never execute or schedule Works.',
    parameters: {
      kind: { type: 'string', enum: ['work', 'workflow'] },
      query: { type: 'string' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          revision: { type: 'string', required: true },
          templates: { type: 'array', required: true, items: TEMPLATE_SCHEMA },
          total: { type: 'integer', required: true },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Template Library', value),
    },
    async execute(args) {
      const snapshot = await controller.overview()
      const query = args.query?.toLocaleLowerCase('en-US')
      const templates = snapshot.board.templates.filter((template) => {
        if (args.kind !== undefined && template.kind !== args.kind) return false
        return !query || template.name.toLocaleLowerCase('en-US').includes(query)
      })
      return {
        revision: snapshot.revision,
        templates: templates.map(templateView),
        total: templates.length,
      }
    },
    presentCall: () => ({
      card: 'generic',
      title: 'List Pavo Templates',
      kind: 'read',
    }),
  })

  const updateTemplateTool = defineTool({
    name: 'pavo_update_template',
    description:
      'Create, edit, refresh, or delete a passive Pavo Work or Workflow template using an exact revision. Captured external dependencies are excluded.',
    parameters: {
      action: {
        type: 'string',
        enum: ['create', 'edit', 'delete'],
        required: true,
      },
      expectedRevision: { type: 'string', required: true },
      templateId: { type: 'string' },
      kind: { type: 'string', enum: ['work', 'workflow'] },
      name: { type: 'string' },
      sourceWorkId: { type: 'string' },
      sourceWorkflowId: { type: 'string' },
      rootTitle: { type: 'string' },
      content: { type: 'object' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: { type: 'string', required: true },
          previousRevision: { type: 'string', required: true },
          revision: { type: 'string', required: true },
          template: TEMPLATE_SCHEMA,
          deletedTemplateId: { type: 'string' },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Template mutation', value),
    },
    async execute(args) {
      if (args.action === 'create') {
        if (!['work', 'workflow'].includes(args.kind)) {
          throw new TypeError('kind is required when creating a template.')
        }
        if (typeof args.name !== 'string' || args.name.trim().length === 0) {
          throw new TypeError('name is required when creating a template.')
        }
      } else if (
        typeof args.templateId !== 'string' ||
        args.templateId.trim().length === 0
      ) {
        throw new TypeError(`templateId is required for the ${args.action} action.`)
      }
      if (args.action === 'edit' && ![
        args.name,
        args.content,
        args.sourceWorkId,
        args.sourceWorkflowId,
      ].some((value) => value !== undefined)) {
        throw new TypeError('The edit action requires a name or replacement content.')
      }
      if (args.action === 'delete' && [
        args.kind,
        args.name,
        args.content,
        args.sourceWorkId,
        args.sourceWorkflowId,
        args.rootTitle,
      ].some((value) => value !== undefined)) {
        throw new TypeError('delete accepts only templateId and expectedRevision.')
      }

      const now = new Date().toISOString()
      let targetTemplateId = args.templateId
      const snapshot = await controller.mutate({
        expectedRevision: args.expectedRevision,
        commitMessage: `feat(pavo): ${args.action} template`,
        mutation: (board) => {
          if (args.action === 'delete') {
            return removeTemplate(
              board,
              { templateId: args.templateId },
              { workflow: controller.config.columns },
            )
          }
          if (args.action === 'create') {
            targetTemplateId = uuidv7()
            const captured = templateContentFromArgs(board, args, args.kind)
            return addTemplate(
              board,
              {
                id: targetTemplateId,
                kind: args.kind,
                name: args.name,
                ...captured,
                createdAt: now,
              },
              { workflow: controller.config.columns },
            )
          }
          const current = board.templates.find(
            (template) => template.id === args.templateId,
          )
          if (!current) throw new TypeError(`Unknown template: ${args.templateId}`)
          const replacesContent =
            args.content !== undefined ||
            args.sourceWorkId !== undefined ||
            args.sourceWorkflowId !== undefined
          return updateTemplate(
            board,
            {
              templateId: current.id,
              name: args.name,
              ...(replacesContent
                ? templateContentFromArgs(board, args, current.kind)
                : {}),
              updatedAt: now,
            },
            { workflow: controller.config.columns },
          )
        },
      })
      return {
        action: args.action,
        previousRevision: args.expectedRevision,
        revision: snapshot.revision,
        ...(args.action === 'delete'
          ? { deletedTemplateId: targetTemplateId }
          : {
              template: templateView(
                snapshot.board.templates.find(
                  (template) => template.id === targetTemplateId,
                ),
              ),
            }),
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: `${args.action} Pavo Template`,
      kind: args.action === 'delete' ? 'delete' : 'other',
      rawInput: args.templateId ?? args.name,
    }),
  })

  const applyTemplateTool = defineTool({
    name: 'pavo_apply_template',
    description:
      'Instantiate one Pavo template under an explicit target Workflow using fresh IDs. This only creates passive records; it never executes Works, schedules Agents, changes WaterLevels, or acknowledges dependencies.',
    parameters: {
      expectedRevision: { type: 'string', required: true },
      templateId: { type: 'string', required: true },
      targetWorkflowId: { type: 'string', required: true },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          previousRevision: { type: 'string', required: true },
          revision: { type: 'string', required: true },
          templateId: { type: 'string', required: true },
          createdWorkIds: {
            type: 'array',
            required: true,
            items: { type: 'string' },
          },
          createdWorkflowIds: {
            type: 'array',
            required: true,
            items: { type: 'string' },
          },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Template instance', value),
    },
    async execute(args) {
      let createdWorkIds = []
      let createdWorkflowIds = []
      const snapshot = await controller.mutate({
        expectedRevision: args.expectedRevision,
        commitMessage: 'feat(pavo): instantiate template',
        mutation: (board) => {
          const workIds = new Set(board.works.map((work) => work.id))
          const workflowIds = new Set(board.workflows.map((item) => item.id))
          const next = instantiateTemplate(
            board,
            {
              templateId: args.templateId,
              targetWorkflowId: args.targetWorkflowId,
            },
            {
              workflow: controller.config.columns,
              idFactory: uuidv7,
              now: new Date().toISOString(),
            },
          )
          createdWorkIds = next.works
            .filter((work) => !workIds.has(work.id))
            .map((work) => work.id)
          createdWorkflowIds = next.workflows
            .filter((item) => !workflowIds.has(item.id))
            .map((item) => item.id)
          return next
        },
      })
      return {
        previousRevision: args.expectedRevision,
        revision: snapshot.revision,
        templateId: args.templateId,
        createdWorkIds,
        createdWorkflowIds,
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: 'Apply Pavo Template',
      kind: 'other',
      rawInput: args.templateId,
    }),
  })

  for (const tool of [
    listTool,
    readTool,
    updateTool,
    updateWorkflowTool,
    listTemplatesTool,
    updateTemplateTool,
    applyTemplateTool,
  ]) {
    ctx.effect(() => tools.register(tool))
  }
}

export async function apply(ctx, config) {
  const controller = await RepositoryController.create(config)
  const trustedHosts = ctx.get('webRuntime')?.trustedHosts ?? []
  const handler = createHandler(controller, trustedHosts)

  for (const path of [API_PATH, LEGACY_API_PATH]) {
    ctx.effect(() =>
      ctx.webServer.register({
        kind: 'exact',
        path,
        handler,
      }),
    )
  }
  if (ctx.get('tools')) {
    registerAgentTools(ctx, controller)
  } else if (typeof ctx.inject === 'function') {
    ctx.inject(['tools'], (toolCtx) => registerAgentTools(toolCtx, controller))
  }
}
