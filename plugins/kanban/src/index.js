import { randomUUID } from 'node:crypto'

import {
  addCard,
  moveCard,
  removeCard,
  updateCard,
} from './board.js'
import {
  Config,
  GitBoardRepository,
  RepositoryError,
} from './git-store.js'

export const name = 'dddrop-kanban'
export const inject = ['webServer', 'webRuntime']
export { Config }

const API_PATH = '/_dddrop/kanban'
const MAX_REQUEST_BYTES = 64 * 1024

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
    throw new RequestError('The Kanban endpoint rejected the request Host.', 403)
  }

  if (request.headers['sec-fetch-site'] === 'cross-site') {
    throw new RequestError('Cross-site Kanban requests are not allowed.', 403)
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

function publicSnapshot(snapshot, config) {
  return {
    board: snapshot.board,
    revision: snapshot.revision,
    pollIntervalMs: snapshot.pollIntervalMs ?? config.pollIntervalMs,
    workflow: snapshot.workflow ?? config.columns,
    syncError:
      typeof snapshot.syncError === 'string' ? snapshot.syncError : undefined,
  }
}

async function dispatch(repository, request) {
  const body = await readJsonBody(request)
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new RequestError('The request body must be an object.')
  }

  const args =
    body.args && typeof body.args === 'object' && !Array.isArray(body.args)
      ? body.args
      : {}
  const mutationOptions = {
    expectedRevision: args.expectedRevision,
  }

  switch (body.method) {
    case 'overview':
      return publicSnapshot(await repository.overview(), repository.config)
    case 'add':
      return publicSnapshot(
        await repository.mutate({
          ...mutationOptions,
          commitMessage: 'feat(kanban): add card',
          mutation: (board) =>
            addCard(
              board,
              {
                title: args.title,
                columnId: args.columnId,
                id: randomUUID(),
                createdAt: new Date().toISOString(),
              },
              { workflow: repository.config.columns },
            ),
        }),
        repository.config,
      )
    case 'update':
      return publicSnapshot(
        await repository.mutate({
          ...mutationOptions,
          commitMessage: 'feat(kanban): update card',
          mutation: (board) =>
            updateCard(
              board,
              {
                cardId: args.cardId,
                title: args.title,
                updatedAt: new Date().toISOString(),
              },
              { workflow: repository.config.columns },
            ),
        }),
        repository.config,
      )
    case 'move':
      return publicSnapshot(
        await repository.mutate({
          ...mutationOptions,
          commitMessage: 'feat(kanban): move card',
          mutation: (board) =>
            moveCard(
              board,
              {
                cardId: args.cardId,
                columnId: args.columnId,
                updatedAt: new Date().toISOString(),
              },
              { workflow: repository.config.columns },
            ),
        }),
        repository.config,
      )
    case 'remove':
      return publicSnapshot(
        await repository.mutate({
          ...mutationOptions,
          commitMessage: 'feat(kanban): remove card',
          mutation: (board) =>
            removeCard(board, args, { workflow: repository.config.columns }),
        }),
        repository.config,
      )
    default:
      throw new RequestError('Unknown Kanban method.')
  }
}

export async function apply(ctx, config) {
  const repository = new GitBoardRepository(config)
  const trustedHosts = ctx.get('webRuntime')?.trustedHosts ?? []

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: API_PATH,
      async handler(request, response) {
        try {
          assertTrustedRequest(request, trustedHosts)

          if (request.method !== 'POST') {
            response.setHeader('allow', 'POST')
            sendJson(response, 405, { ok: false, error: 'Method not allowed.' })
            return
          }

          const value = await dispatch(repository, request)
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
            : 'The Kanban request failed unexpectedly.'
          sendJson(response, status, { ok: false, error: message })
        }
      },
    }),
  )
}
