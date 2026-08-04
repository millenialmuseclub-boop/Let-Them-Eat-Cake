import type { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'
import { checkRateLimit, containsBlockedContent, countByPrefix } from './_shared/blobHelpers'
import assemblyComponentsJson from '../../src/data/assemblyComponents.json'
import bakeOffChallengesJson from '../../src/data/bakeOffChallenges.json'
import type { AssemblyComponent } from '../../src/types/assemblyLab'
import type { BakeOffChallenge, BakeOffEntry } from '../../src/types/bakeOff'

const assemblyComponents = assemblyComponentsJson as AssemblyComponent[]
const bakeOffChallenges = bakeOffChallengesJson as BakeOffChallenge[]

const STORE_NAME = 'bake-off-entries'

function getActiveChallenge(): BakeOffChallenge {
  const month = new Date().getMonth() + 1
  return bakeOffChallenges.find((c) => c.month === month) ?? bakeOffChallenges[0]
}

function isValidComponentId(id: string, category: string): boolean {
  return assemblyComponents.some((c) => c.id === id && c.category === category)
}

export const handler: Handler = async (event) => {
  const store = getStore(STORE_NAME)

  if (event.httpMethod === 'GET') {
    const sort = event.queryStringParameters?.sort === 'top' ? 'top' : 'new'
    const challengeId = event.queryStringParameters?.challengeId

    const { blobs } = await store.list()
    const fetched = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<BakeOffEntry | null>))
    const rawEntries = fetched.filter((e): e is BakeOffEntry => e !== null)

    // Vote counts are never stored on the entry — always computed fresh from the votes store
    // (see blobHelpers.ts: each vote is its own key, aggregated by prefix, to stay concurrency-safe
    // without a compare-and-swap primitive).
    const entries = await Promise.all(
      rawEntries.map(async (entry) => ({ ...entry, voteCount: await countByPrefix('bake-off-votes', `${entry.id}__`) })),
    )

    const filtered = challengeId ? entries.filter((e) => e.challengeId === challengeId) : entries
    filtered.sort((a, b) => (sort === 'top' ? b.voteCount - a.voteCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filtered) }
  }

  if (event.httpMethod === 'POST') {
    let body: unknown
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
    }

    const { bakerName, title, story, spongeId, fillingId, frostingId, garnishId, voterId } = body as Record<string, unknown>

    if (typeof voterId !== 'string' || voterId.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'voterId is required' }) }
    }
    if (typeof bakerName !== 'string' || bakerName.trim().length === 0 || bakerName.length > 40) {
      return { statusCode: 400, body: JSON.stringify({ error: 'bakerName must be 1-40 characters' }) }
    }
    if (typeof title !== 'string' || title.trim().length === 0 || title.length > 80) {
      return { statusCode: 400, body: JSON.stringify({ error: 'title must be 1-80 characters' }) }
    }
    if (typeof story !== 'string' || story.trim().length === 0 || story.length > 500) {
      return { statusCode: 400, body: JSON.stringify({ error: 'story must be 1-500 characters' }) }
    }
    if (typeof spongeId !== 'string' || !isValidComponentId(spongeId, 'sponge')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid spongeId' }) }
    }
    if (typeof fillingId !== 'string' || !isValidComponentId(fillingId, 'filling')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid fillingId' }) }
    }
    if (typeof frostingId !== 'string' || !isValidComponentId(frostingId, 'frosting')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid frostingId' }) }
    }
    if (garnishId !== undefined && garnishId !== null && (typeof garnishId !== 'string' || !isValidComponentId(garnishId, 'garnish'))) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid garnishId' }) }
    }
    if (containsBlockedContent(bakerName) || containsBlockedContent(title) || containsBlockedContent(story)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Content violates community guidelines' }) }
    }

    const allowed = await checkRateLimit(voterId, 'submit', 5)
    if (!allowed) {
      return { statusCode: 429, body: JSON.stringify({ error: 'Too many submissions — try again later' }) }
    }

    const entry: BakeOffEntry = {
      id: randomUUID(),
      bakerName: bakerName.trim(),
      title: title.trim(),
      story: story.trim(),
      spongeId,
      fillingId,
      frostingId,
      garnishId: typeof garnishId === 'string' ? garnishId : undefined,
      challengeId: getActiveChallenge().id,
      createdAt: new Date().toISOString(),
      voteCount: 0,
    }

    await store.setJSON(entry.id, entry)

    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
}
