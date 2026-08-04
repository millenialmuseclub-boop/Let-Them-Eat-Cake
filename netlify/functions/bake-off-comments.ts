import type { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'
import { checkRateLimit, containsBlockedContent, getAllByPrefix } from './_shared/blobHelpers'
import type { BakeOffComment } from '../../src/types/bakeOff'

const STORE_NAME = 'bake-off-comments'

async function listComments(entryId: string): Promise<BakeOffComment[]> {
  const comments = await getAllByPrefix<BakeOffComment>(STORE_NAME, `${entryId}__`)
  return comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const entryId = event.queryStringParameters?.entryId
    if (!entryId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'entryId query parameter is required' }) }
    }
    const comments = await listComments(entryId)
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(comments) }
  }

  if (event.httpMethod === 'POST') {
    let body: unknown
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
    }

    const { entryId, bakerName, text, voterId } = body as Record<string, unknown>

    if (typeof entryId !== 'string' || entryId.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'entryId is required' }) }
    }
    if (typeof voterId !== 'string' || voterId.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'voterId is required' }) }
    }
    if (typeof bakerName !== 'string' || bakerName.trim().length === 0 || bakerName.length > 40) {
      return { statusCode: 400, body: JSON.stringify({ error: 'bakerName must be 1-40 characters' }) }
    }
    if (typeof text !== 'string' || text.trim().length === 0 || text.length > 500) {
      return { statusCode: 400, body: JSON.stringify({ error: 'text must be 1-500 characters' }) }
    }
    if (containsBlockedContent(bakerName) || containsBlockedContent(text)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Content violates community guidelines' }) }
    }

    const allowed = await checkRateLimit(voterId, 'comment', 10)
    if (!allowed) {
      return { statusCode: 429, body: JSON.stringify({ error: 'Too many comments — try again later' }) }
    }

    const comment: BakeOffComment = {
      id: randomUUID(),
      entryId,
      bakerName: bakerName.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    // Each comment is its own independent key (never read-modify-written), same concurrency-safe
    // pattern as votes — no CAS primitive is available in the installed @netlify/blobs version.
    const store = getStore(STORE_NAME)
    await store.setJSON(`${entryId}__${comment.id}`, comment)

    const updated = await listComments(entryId)

    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
}
