import type { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { checkRateLimit, countByPrefix } from './_shared/blobHelpers'
import type { BakeOffEntry } from '../../src/types/bakeOff'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let body: unknown
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  const { entryId, voterId } = body as Record<string, unknown>

  if (typeof entryId !== 'string' || entryId.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'entryId is required' }) }
  }
  if (typeof voterId !== 'string' || voterId.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'voterId is required' }) }
  }

  const allowed = await checkRateLimit(voterId, 'vote', 30)
  if (!allowed) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Too many votes — try again later' }) }
  }

  const entriesStore = getStore('bake-off-entries')
  const entry = (await entriesStore.get(entryId, { type: 'json' })) as BakeOffEntry | null
  if (!entry) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Entry not found' }) }
  }

  // Each vote is its own independent key (never overwritten) so counting is just a list —
  // no read-modify-write on a shared counter, and no lost updates under concurrent votes.
  const votesStore = getStore('bake-off-votes')
  const voteKey = `${entryId}__${voterId}`
  const existing = await votesStore.get(voteKey)
  if (existing) {
    return { statusCode: 409, body: JSON.stringify({ error: "You've already voted for this entry" }) }
  }
  await votesStore.set(voteKey, new Date().toISOString())

  const voteCount = await countByPrefix('bake-off-votes', `${entryId}__`)

  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voteCount }) }
}
