import { getStore } from '@netlify/blobs'

/**
 * The installed @netlify/blobs version has no onlyIfNew/onlyIfMatch conditional writes —
 * set() is always last-write-wins. To stay concurrency-safe without a CAS primitive, votes,
 * comments, and rate-limit hits are each written as their OWN independent key (never
 * read-modify-written) and aggregated by listing a key prefix at read time.
 */

export async function countByPrefix(storeName: string, prefix: string): Promise<number> {
  const store = getStore(storeName)
  const { blobs } = await store.list({ prefix })
  return blobs.length
}

export async function getAllByPrefix<T>(storeName: string, prefix: string): Promise<T[]> {
  const store = getStore(storeName)
  const { blobs } = await store.list({ prefix })
  const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<T | null>))
  return items.filter((item) => item != null) as T[]
}

const RATE_LIMIT_WINDOW_MS = 3_600_000

/** Returns true if the action is still within its per-hour cap for this voter, false if it should be rejected. */
export async function checkRateLimit(voterId: string, action: string, maxPerHour: number): Promise<boolean> {
  const store = getStore('bake-off-rate-limits')
  const prefix = `${action}__${voterId}__`
  const now = Date.now()

  const { blobs } = await store.list({ prefix })
  const recentCount = blobs.filter((b) => {
    const ts = Number(b.key.slice(prefix.length))
    return !Number.isNaN(ts) && now - ts < RATE_LIMIT_WINDOW_MS
  }).length

  if (recentCount >= maxPerHour) return false

  await store.set(`${prefix}${now}`, '1')
  return true
}

const PROFANITY_BLOCKLIST = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'faggot', 'nigger', 'retard']

export function containsBlockedContent(text: string): boolean {
  const lower = text.toLowerCase()
  return PROFANITY_BLOCKLIST.some((word) => lower.includes(word))
}
