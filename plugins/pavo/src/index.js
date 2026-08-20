import {
  ROOT_WORKFLOW_ID,
  addTemplate,
  addWork,
  addWorkflow,
  compareWaterLevels,
  instantiateTemplate,
  moveWork,
  normalizeAssignee,
  reconcileAutoMode,
  removeTemplate,
  removeWork,
  removeWorkflow,
  setAutoMode,
  startWork,
  updateTemplate,
  updateWork,
  updateWorkflow,
  workTemplateContentFromWork,
  workflowTemplateContentFromWorkflow,
} from './board.js'
import {
  Config,
  RepositoryError,
  StaleRevisionError,
} from './git-store.js'
import { RepositoryController } from './repository-settings.js'
import { uuidv7 } from './uuid-v7.js'

export const name = 'dddrop-pavo'
export const inject = [
  'webServer',
  'webRuntime',
  'workspaceRegistry',
  'agents',
  'agentPresets',
  'agentDefaultModel',
  'sessionTitle',
]
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
    workflow:
      snapshot.workflow ??
      snapshot.board.columns.map((column) => ({
        id: column.id,
        title: column.title,
        allowedTransitions: [...column.allowedTransitions],
      })),
    syncError:
      typeof snapshot.syncError === 'string' ? snapshot.syncError : undefined,
    ...controller.describe(),
  }
}

async function publicAgentPresets(agentPresets) {
  if (!agentPresets) return []
  const presets = await agentPresets.list()
  return presets.map((preset) => ({
    id: preset.id,
    name: preset.name,
    description: preset.description,
    trust: preset.trust,
    ...(preset.broken ? { broken: true } : {}),
  }))
}

async function publicWorkspaces(workspaceRegistry) {
  return Promise.all(
    workspaceRegistry.list().map(async (workspace) => {
      let unavailable = false
      try {
        unavailable = (await workspace.status()) !== 'ok'
      } catch {
        unavailable = true
      }
      return {
        id: workspace.id,
        title: workspace.title,
        ...(unavailable ? { unavailable: true } : {}),
      }
    }),
  )
}

function installRunModelSelection(agentCtx, selection) {
  let assembled
  agentCtx.on(
    'system-prompt/assemble',
    async (_assembly, _context, next) => {
      const prompt = await next()
      assembled = selection
      return {
        ...prompt,
        variables: {
          ...prompt.variables,
          provider: selection.provider,
          model: selection.model,
        },
      }
    },
  )
  agentCtx.on('agent/request', async (_payload, next) => {
    const request = await next()
    if (!assembled) return request
    const { reasoningEffort: _inheritedEffort, ...base } = request
    return {
      ...base,
      provider: assembled.provider,
      model: assembled.model,
      ...(assembled.reasoningEffort === undefined
        ? {}
        : { reasoningEffort: assembled.reasoningEffort }),
    }
  })
}

function createRunPrompt(description) {
  return Object.freeze({
    id: uuidv7(),
    role: 'user',
    content: Object.freeze([
      Object.freeze({ type: 'text', text: description }),
    ]),
    source: Object.freeze({ kind: 'user' }),
  })
}

async function cleanupUnstartedSession(workspaceRegistry, workspace, handle) {
  const failures = []
  try {
    await workspace.detachSession(handle.agent.id)
  } catch (error) {
    failures.push(error)
  }
  try {
    await handle.dispose()
  } catch (error) {
    failures.push(error)
  }
  try {
    await workspaceRegistry.archiveSession(handle.agent.id)
  } catch (error) {
    failures.push(error)
  }
  if (failures.length > 0) {
    throw new Error(
      `The unstarted Session could not be cleaned up completely: ${failures.map(String).join('; ')}`,
    )
  }
}

async function launchWorkSession(controller, args, services) {
  const snapshot = await controller.overview()
  if (
    typeof args.expectedRevision !== 'string' ||
    args.expectedRevision !== snapshot.revision
  ) {
    throw new StaleRevisionError()
  }
  const work = snapshot.board.works.find(
    (candidate) => candidate.id === args.workId,
  )
  if (!work) throw new RequestError(`Unknown Work: ${args.workId}`)
  if (work.columnId !== 'ready') {
    throw new RequestError('A Work must be Ready before it can run.')
  }
  const worksById = new Map(
    snapshot.board.works.map((candidate) => [candidate.id, candidate]),
  )
  if (!automaticDependenciesAreDone(worksById, work)) {
    throw new RequestError('Every upstream Work must be Done before this Work can run.')
  }
  if (args.requireAutoMode && work.type === 'goal' && work.completedAt !== null) {
    throw new RequestError('A completed Goal Work can only be run again manually.')
  }
  if (!work.workspaceId) {
    throw new RequestError('Choose a DSH Workspace before running this Work.')
  }
  const workspace = services.workspaceRegistry.get(work.workspaceId)
  let workspaceAvailable = false
  try {
    workspaceAvailable = workspace !== undefined && (await workspace.status()) === 'ok'
  } catch {
    workspaceAvailable = false
  }
  if (!workspaceAvailable) {
    throw new RequestError(`Workspace ${work.workspaceId} is unavailable.`)
  }
  if (work.assignee.kind !== 'agent-preset') {
    throw new RequestError(
      'Assign an Agent Preset before running this Work.',
    )
  }
  let preset
  try {
    preset = await services.agentPresets.resolve(work.assignee.presetId)
  } catch {
    throw new RequestError(
      `Agent Preset ${work.assignee.presetId} is unavailable.`,
    )
  }
  if (preset.broken) {
    throw new RequestError(`Agent Preset ${preset.id} is unavailable.`)
  }
  const selection = services.agentDefaultModel.currentSelection()
  const reuseSession = work.type === 'ongoing' && Boolean(work.sessionId)
  const sessionId = reuseSession ? work.sessionId : `session-${uuidv7()}`
  const agentOptions = {
    provider: selection.provider,
    model: selection.model,
    ...(selection.reasoningEffort === undefined
      ? {}
      : { reasoningEffort: selection.reasoningEffort }),
  }
  const setup = async (agentCtx) => {
    const sessionPreset = agentCtx.agent.session.header.agentPreset
    const sessionCwd = agentCtx.agent.session.header.cwd
    if (reuseSession && sessionPreset !== preset.id) {
      throw new RequestError(
        `Session ${sessionId} uses Agent Preset ${sessionPreset ?? '(none)'} instead of ${preset.id}.`,
      )
    }
    if (reuseSession && sessionCwd !== workspace.path) {
      throw new RequestError(
        `Session ${sessionId} belongs to a different Workspace.`,
      )
    }
    installRunModelSelection(agentCtx, selection)
    await services.agentPresets.mount(agentCtx, preset.id)
  }

  let handle
  let agent = reuseSession ? services.agents.get(sessionId) : undefined
  try {
    if (agent) {
      if (agent.session.header.agentPreset !== preset.id) {
        throw new RequestError(
          `Session ${sessionId} uses Agent Preset ${agent.session.header.agentPreset ?? '(none)'} instead of ${preset.id}.`,
        )
      }
      if (agent.session.header.cwd !== workspace.path) {
        throw new RequestError(
          `Session ${sessionId} belongs to a different Workspace.`,
        )
      }
    } else if (reuseSession) {
      handle = await services.agents.resume({
        resumeSessionId: sessionId,
        agentOptions,
        setup,
      })
      agent = handle.agent
    } else {
      handle = await services.agents.create({
        sessionId,
        meta: {
          cwd: workspace.path,
          agentPreset: preset.id,
        },
        agentOptions,
        setup,
      })
      agent = handle.agent
    }
  } catch (error) {
    if (error instanceof RequestError) throw error
    throw new RequestError(
      `The Agent Session could not be ${reuseSession ? 'resumed' : 'created'}: ${String(error)}`,
      500,
    )
  }

  let claimedSnapshot
  try {
    if (!reuseSession) await workspace.attachSession(sessionId)
    services.sessionTitle.rename(agent.session, work.title)
    claimedSnapshot = await controller.mutate({
      expectedRevision: snapshot.revision,
      commitMessage: 'feat(pavo): run work',
      mutation: (board) => {
        if (args.requireAutoMode && !board.autoMode.enabled) {
          throw new RequestError('Pavo automatic mode was disabled before the Work could start.')
        }
        const currentWork = board.works.find((candidate) => candidate.id === work.id)
        if (
          args.requireAutoMode &&
          currentWork?.type === 'goal' &&
          currentWork.completedAt !== null
        ) {
          throw new RequestError('A completed Goal Work can only be run again manually.')
        }
        return startWork(
          board,
          {
            workId: work.id,
            sessionId,
            updatedAt: new Date().toISOString(),
          },
          { workflow: controller.config.columns },
        )
      },
    })
  } catch (error) {
    const current = await controller.overview().catch(() => undefined)
    const claimed = current?.board.works.find(
      (candidate) => candidate.id === work.id,
    )
    if (
      claimed?.sessionId === sessionId &&
      claimed.columnId === 'in-progress'
    ) {
      claimedSnapshot = current
    } else {
      try {
        if (reuseSession) {
          if (handle) await handle.dispose()
        } else {
          await cleanupUnstartedSession(
            services.workspaceRegistry,
            workspace,
            handle,
          )
        }
      } catch (cleanupError) {
        throw new RequestError(
          `${String(error)} ${String(cleanupError)}`,
          500,
        )
      }
      throw error
    }
  }

  const result = {
    ...publicSnapshot(claimedSnapshot, controller),
    run: {
      sessionId,
      workId: work.id,
      workspaceId: workspace.id,
      agentPresetId: preset.id,
      mode: reuseSession ? 'reused' : 'created',
    },
  }
  const deliverPrompt = async () => {
    try {
      await agent.whenIdle()
      agent.followup(createRunPrompt(work.description))
    } catch (error) {
      throw new RequestError(
        `Session ${sessionId} was ${reuseSession ? 'reused' : 'created'} and linked, but its Work prompt could not start: ${String(error)}`,
        500,
      )
    }
  }
  if (args.detachPrompt) {
    void deliverPrompt().then(args.onPromptSuccess, args.onPromptError)
    return result
  }
  await deliverPrompt()
  return result
}

function createRunCoordinator(controller, services) {
  const operations = new Map()

  function resultFor(record, detached) {
    if (detached) return record.claim
    return record.claim.then(async (result) => {
      await record.prompt
      return result
    })
  }

  return {
    run(args) {
      if (typeof args.workId !== 'string' || args.workId.trim().length === 0) {
        throw new RequestError('Run requires a Work id.')
      }
      const workId = args.workId.trim()
      const existing = operations.get(workId)
      if (existing) {
        if (args.expectedRevision !== existing.expectedRevision) {
          throw new StaleRevisionError()
        }
        return resultFor(existing, args.detached === true)
      }

      let resolvePrompt
      let rejectPrompt
      const prompt = new Promise((resolve, reject) => {
        resolvePrompt = resolve
        rejectPrompt = reject
      })
      void prompt.catch(() => {})
      const claim = launchWorkSession(
        controller,
        {
          ...args,
          workId,
          detachPrompt: true,
          onPromptSuccess: () => {
            resolvePrompt()
            args.onPromptSuccess?.()
          },
          onPromptError: (error) => {
            rejectPrompt(error)
            args.onPromptError?.(error)
          },
        },
        services,
      )
      const record = {
        expectedRevision: args.expectedRevision,
        claim,
        prompt,
      }
      operations.set(workId, record)
      void claim.catch((error) => rejectPrompt(error))
      void prompt.then(
        () => operations.delete(workId),
        () => operations.delete(workId),
      )
      return resultFor(record, args.detached === true)
    },
  }
}

function automaticDependenciesAreDone(worksById, work) {
  return Object.keys(work.upstreamWaterLevels).every(
    (upstreamId) => worksById.get(upstreamId)?.columnId === 'done',
  )
}

function automaticRunFingerprint(work) {
  return JSON.stringify([
    work.updatedAt,
    work.workspaceId,
    work.assignee.presetId,
    work.description,
    work.sessionId,
  ])
}

function createAutoModeManager(controller, runCoordinator, initialSnapshot) {
  const failedRuns = new Map()
  const retryTimers = new Set()
  let automaticModeEnabled = initialSnapshot.board.autoMode.enabled
  let lastError
  let disposed = false
  let running = false
  let drainPromise = Promise.resolve()
  let rerunRequested = false

  async function reconcile() {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const snapshot = await controller.overview()
      automaticModeEnabled = snapshot.board.autoMode.enabled
      if (!automaticModeEnabled) {
        failedRuns.clear()
        return snapshot
      }
      const next = reconcileAutoMode(snapshot.board, {
        now: new Date().toISOString(),
        workflow: controller.config.columns,
      })
      const changed = next.works.some((work, index) =>
        work.columnId !== snapshot.board.works[index]?.columnId,
      )
      if (!changed) return snapshot
      try {
        return await controller.mutate({
          expectedRevision: snapshot.revision,
          commitMessage: 'feat(pavo): reconcile automatic mode',
          mutation: (board) =>
            reconcileAutoMode(board, {
              now: new Date().toISOString(),
              workflow: controller.config.columns,
            }),
        })
      } catch (error) {
        if (!(error instanceof StaleRevisionError)) throw error
      }
    }
    return controller.overview()
  }

  function clearObsoleteFailures(snapshot) {
    const ready = new Map(
      snapshot.board.works
        .filter(
          (work) =>
            work.columnId === 'ready' &&
            work.assignee.kind === 'agent-preset' &&
            !(work.type === 'goal' && work.completedAt !== null),
        )
        .map((work) => [work.id, automaticRunFingerprint(work)]),
    )
    for (const [workId, failure] of failedRuns) {
      if (ready.get(workId) !== failure.fingerprint) failedRuns.delete(workId)
    }
  }

  function scheduleRetry(delayMs) {
    const timer = setTimeout(() => {
      retryTimers.delete(timer)
      schedule()
    }, delayMs)
    timer.unref?.()
    retryTimers.add(timer)
  }

  async function runReadyAgents(snapshot) {
    let current = snapshot
    while (!disposed && current.board.autoMode.enabled) {
      clearObsoleteFailures(current)
      const now = Date.now()
      const worksById = new Map(
        current.board.works.map((work) => [work.id, work]),
      )
      const work = current.board.works.find((candidate) => {
        if (
          candidate.columnId !== 'ready' ||
          !candidate.workspaceId ||
          candidate.assignee.kind !== 'agent-preset' ||
          (candidate.type === 'goal' && candidate.completedAt !== null) ||
          !automaticDependenciesAreDone(worksById, candidate)
        ) {
          return false
        }
        const failure = failedRuns.get(candidate.id)
        return (
          !failure ||
          failure.fingerprint !== automaticRunFingerprint(candidate) ||
          failure.nextAttemptAt <= now
        )
      })
      if (!work) return

      try {
        await runCoordinator.run({
          workId: work.id,
          expectedRevision: current.revision,
          requireAutoMode: true,
          detached: true,
          onPromptSuccess: () => {
            lastError = undefined
          },
          onPromptError: (error) => {
            lastError = error instanceof Error ? error.message : String(error)
          },
        })
        failedRuns.delete(work.id)
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        if (!(error instanceof StaleRevisionError)) {
          const fingerprint = automaticRunFingerprint(work)
          const previous = failedRuns.get(work.id)
          const attempts =
            previous?.fingerprint === fingerprint ? previous.attempts + 1 : 1
          const retryDelay = Math.min(60_000, 1_000 * 2 ** (attempts - 1))
          failedRuns.set(work.id, {
            fingerprint,
            attempts,
            nextAttemptAt: Date.now() + retryDelay,
          })
          scheduleRetry(retryDelay)
        }
      }
      current = await controller.overview()
    }
  }

  async function drain() {
    if (running || disposed) return
    running = true
    try {
      do {
        rerunRequested = false
        try {
          const snapshot = await reconcile()
          if (!disposed && snapshot.board.autoMode.enabled) {
            await runReadyAgents(snapshot)
          }
        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error)
          // Periodic ticks and future mutations retry transient failures.
        }
      } while (rerunRequested && !disposed)
    } finally {
      running = false
      if (rerunRequested && !disposed) startDrain()
    }
  }

  function startDrain() {
    drainPromise = drain()
    void drainPromise
  }

  function schedule(force = false) {
    if (disposed || (!force && !automaticModeEnabled)) return
    rerunRequested = true
    if (!running) startDrain()
  }

  return {
    observe(snapshot) {
      if (!snapshot?.board?.autoMode) return
      automaticModeEnabled = snapshot.board.autoMode.enabled
      if (automaticModeEnabled) schedule()
      else {
        failedRuns.clear()
        lastError = undefined
      }
    },
    describe() {
      return {
        running,
        retryingWorkCount: failedRuns.size,
        ...(lastError ? { lastError } : {}),
      }
    },
    schedule,
    stop() {
      disposed = true
      rerunRequested = false
      failedRuns.clear()
      for (const timer of retryTimers) clearTimeout(timer)
      retryTimers.clear()
      return drainPromise
    },
  }
}

function mergedWorkInput(work, args) {
  return {
    ...work,
    type: args.type ?? work.type,
    workspaceId:
      args.workspaceId === undefined ? work.workspaceId : args.workspaceId,
    legacyWorkspaceTitle:
      args.workspaceId === undefined
        ? work.legacyWorkspaceTitle
        : args.legacyWorkspaceTitle,
    key: args.key ?? work.key,
    title: args.title ?? work.title,
    description: args.description ?? args.body ?? work.description,
    assignee:
      args.assignee === undefined ? work.assignee : args.assignee,
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

async function dispatch(controller, request, services, runCoordinator) {
  const body = await readJsonBody(request)
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new RequestError('The request body must be an object.')
  }
  const args =
    body.args && typeof body.args === 'object' && !Array.isArray(body.args)
      ? body.args
      : {}
  const mutationOptions = { expectedRevision: args.expectedRevision }
  if (Object.hasOwn(args, 'project')) {
    throw new RequestError(
      'Pavo Projects were replaced by DSH Workspace references.',
    )
  }

  switch (body.method) {
    case 'repositorySettings':
      return controller.settings()
    case 'overview':
      return publicSnapshot(await controller.overview(), controller)
    case 'agentPresets':
      return { presets: await publicAgentPresets(services.agentPresets) }
    case 'workspaces':
      return {
        workspaces: await publicWorkspaces(services.workspaceRegistry),
      }
    case 'saveRepository':
      assertRepositorySettingsRequest(request)
      return controller.updateRepository(
        args.repository,
        args.expectedRepositoryRevision,
      )
    case 'saveArchiveVisibility':
      assertRepositorySettingsRequest(request)
      return controller.updateArchiveVisibility(
        args.archiveVisible,
        args.expectedArchiveVisibilityRevision,
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
                workspaceId: args.workspaceId ?? '',
                sessionId: '',
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
    case 'removeProject':
      throw new RequestError(
        'Pavo Projects were replaced by DSH Workspace references.',
      )
    case 'runWork':
      return runCoordinator.run(args)
    case 'setAutoMode':
      return publicSnapshot(
        await controller.mutate({
          ...mutationOptions,
          commitMessage: `feat(pavo): ${args.enabled ? 'enable' : 'disable'} automatic mode`,
          mutation: (board) =>
            setAutoMode(
              board,
              { enabled: args.enabled },
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
                updatedAt: new Date().toISOString(),
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

function createHandler(
  controller,
  trustedHosts,
  services,
  runCoordinator,
  autoModeManager,
) {
  return async (request, response) => {
    try {
      assertTrustedRequest(request, trustedHosts)
      if (request.method !== 'POST') {
        response.setHeader('allow', 'POST')
        sendJson(response, 405, { ok: false, error: 'Method not allowed.' })
        return
      }
      const value = await dispatch(
        controller,
        request,
        services,
        runCoordinator,
      )
      autoModeManager.observe(value)
      if (value?.board) value.automationStatus = autoModeManager.describe()
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
    workspaceId: work.workspaceId,
    sessionId: work.sessionId,
    ...(work.legacyWorkspaceTitle
      ? { legacyWorkspaceTitle: work.legacyWorkspaceTitle }
      : {}),
    key: work.key,
    title: work.title,
    description: work.description,
    assignee: work.assignee,
    waterLevel: work.waterLevel,
    upstreamWaterLevels: { ...work.upstreamWaterLevels },
    runUpstreamWaterLevels: { ...work.runUpstreamWaterLevels },
    completedAt: work.completedAt,
    workflowId: work.workflowId,
    columnId: work.columnId,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
  }
}

function assigneeText(assignee) {
  if (assignee.kind === 'human') return 'me human'
  if (assignee.kind === 'agent-preset') {
    return `agent preset ${assignee.presetId}`
  }
  return `unassigned ${assignee.legacyLabel ?? ''}`.trim()
}

function sameAssignee(left, right) {
  return JSON.stringify(left) === JSON.stringify(normalizeAssignee(right))
}

function workSummary(work) {
  return {
    id: work.id,
    type: work.type,
    workspaceId: work.workspaceId,
    sessionId: work.sessionId,
    ...(work.legacyWorkspaceTitle
      ? { legacyWorkspaceTitle: work.legacyWorkspaceTitle }
      : {}),
    key: work.key,
    title: work.title,
    assignee: work.assignee,
    waterLevel: work.waterLevel,
    completedAt: work.completedAt,
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
    'Dictionary whose keys are immutable upstream Work IDs and values are lifecycle-owned acknowledged WaterLevels. New dependencies must use 0; existing values advance only when the Work reaches Done.',
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

const ASSIGNEE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    kind: {
      type: 'string',
      enum: ['unassigned', 'human', 'agent-preset'],
      required: true,
    },
    presetId: { type: 'string' },
    legacyLabel: { type: 'string' },
  },
}

const AGENT_PRESET_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    name: { type: 'string' },
    description: { type: 'string' },
    trust: { type: 'string', enum: ['system', 'user'], required: true },
    broken: { type: 'boolean' },
  },
}

const DSH_WORKSPACE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    unavailable: { type: 'boolean' },
  },
}

const WORK_SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    type: { type: 'string', enum: ['goal', 'ongoing'], required: true },
    workspaceId: { type: 'string', required: true },
    sessionId: { type: 'string', required: true },
    legacyWorkspaceTitle: { type: 'string' },
    key: { type: 'string', required: true },
    title: { type: 'string', required: true },
    assignee: { ...ASSIGNEE_SCHEMA, required: true },
    waterLevel: { type: 'string', required: true },
    completedAt: {
      oneOf: [{ type: 'string' }, { type: 'null' }],
      required: true,
    },
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
    workspaceId: { type: 'string', required: true },
    sessionId: { type: 'string', required: true },
    legacyWorkspaceTitle: { type: 'string' },
    key: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    assignee: { ...ASSIGNEE_SCHEMA, required: true },
    waterLevel: { type: 'string', required: true },
    upstreamWaterLevels: { ...WATER_LEVEL_MAP_SCHEMA, required: true },
    runUpstreamWaterLevels: { ...WATER_LEVEL_MAP_SCHEMA, required: true },
    completedAt: {
      oneOf: [{ type: 'string' }, { type: 'null' }],
      required: true,
    },
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
      'List Pavo Works and the current optimistic revision. When board automatic mode is enabled, Pavo may reconcile eligible statuses and start Ready Agent-assigned Works.',
    parameters: {
      workspaceId: {
        type: 'string',
        description: 'Filter by exact DSH Workspace ID; empty means no Workspace.',
      },
      columnId: { type: 'string', description: 'Filter by status column.' },
      workflowId: { type: 'string', description: 'Filter by exact Workflow container.' },
      assignee: {
        ...ASSIGNEE_SCHEMA,
        description:
          'Filter by exact structured assignee: unassigned, human, or agent-preset.',
      },
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
          workspaces: {
            type: 'array',
            required: true,
            items: DSH_WORKSPACE_SCHEMA,
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
          agentPresets: {
            type: 'array',
            required: true,
            items: AGENT_PRESET_SCHEMA,
          },
        },
      },
      render: (_args, value) => renderToolValue('Pavo Work list', value),
    },
    async execute(args) {
      const [snapshot, agentPresetList, workspaceList] = await Promise.all([
        controller.overview(),
        publicAgentPresets(ctx.agentPresets),
        publicWorkspaces(ctx.workspaceRegistry),
      ])
      const workspaceTitles = new Map(
        workspaceList.map((workspace) => [workspace.id, workspace.title]),
      )
      const query = args.query?.toLocaleLowerCase('en-US')
      const works = snapshot.board.works.filter((work) => {
        if (
          args.workspaceId !== undefined &&
          work.workspaceId !== args.workspaceId
        ) return false
        if (args.columnId !== undefined && work.columnId !== args.columnId) return false
        if (args.workflowId !== undefined && work.workflowId !== args.workflowId) return false
        if (
          args.assignee !== undefined &&
          !sameAssignee(work.assignee, args.assignee)
        ) return false
        if (!query) return true
        return [
          work.key,
          work.title,
          work.description,
          work.workspaceId,
          work.sessionId,
          workspaceTitles.get(work.workspaceId) ?? work.legacyWorkspaceTitle ?? '',
          assigneeText(work.assignee),
        ].some((value) => value.toLocaleLowerCase('en-US').includes(query))
      })
      return {
        revision: snapshot.revision,
        works: works.map(workSummary),
        total: works.length,
        workspaces: workspaceList,
        workflow: snapshot.workflow.map((column) => ({
          id: column.id,
          title: column.title,
          allowedTransitions: [...column.allowedTransitions],
        })),
        workflows: snapshot.board.workflows.map((container) => ({ ...container })),
        agentPresets: agentPresetList,
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
      'Create, edit, move, or delete a Pavo Work using an exact revision. Automatic mode waits for every upstream Work to be Done, may run eligible Agent-assigned Works, and reactivates stale Ongoing Works. Pavo snapshots upstream WaterLevels at execution start and acknowledges that snapshot only when the Work reaches Done. It never increments a Work own WaterLevel.',
    parameters: {
      action: {
        type: 'string',
        enum: ['create', 'edit', 'move', 'delete'],
        required: true,
      },
      expectedRevision: { type: 'string', required: true },
      workId: { type: 'string' },
      type: { type: 'string', enum: ['goal', 'ongoing'] },
      workspaceId: {
        type: 'string',
        description: 'Stable DSH Workspace ID; empty clears the Workspace.',
      },
      key: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      assignee: ASSIGNEE_SCHEMA,
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
        'workspaceId',
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
                  workspaceId: args.workspaceId ?? '',
                  key: args.key,
                  title: args.title,
                  description: args.description ?? '',
                  assignee: args.assignee ?? { kind: 'unassigned' },
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
                { workId: args.workId, columnId: args.columnId, updatedAt: now },
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
      'Instantiate one Pavo template under an explicit target Workflow using fresh IDs. Automatic mode may subsequently run eligible created Works after every upstream Work is Done; instantiation itself never changes WaterLevels or acknowledges dependencies.',
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
  const services = {
    workspaceRegistry: ctx.workspaceRegistry,
    agents: ctx.agents,
    agentPresets: ctx.agentPresets,
    agentDefaultModel: ctx.agentDefaultModel,
    sessionTitle: ctx.sessionTitle,
  }
  const runCoordinator = createRunCoordinator(controller, services)
  const autoModeManager = createAutoModeManager(controller, runCoordinator, {
    board: { autoMode: { enabled: false } },
  })
  const handler = createHandler(
    controller,
    trustedHosts,
    services,
    runCoordinator,
    autoModeManager,
  )
  ctx.effect(() => {
    const disposeListener = controller.onMutation((snapshot) => {
      if (snapshot?.board) autoModeManager.observe(snapshot)
      else autoModeManager.schedule(true)
    })
    const timer = setInterval(
      () => autoModeManager.schedule(),
      Math.max(1_000, controller.config.pollIntervalMs),
    )
    const observationTimer = setInterval(
      () => autoModeManager.schedule(true),
      60_000,
    )
    timer.unref?.()
    observationTimer.unref?.()
    autoModeManager.schedule(true)
    return () => {
      clearInterval(timer)
      clearInterval(observationTimer)
      disposeListener()
      return autoModeManager.stop()
    }
  })

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
