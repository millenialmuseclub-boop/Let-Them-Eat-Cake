import { bakeOffChallenges } from './data'
import type { BakeOffChallenge, BakeOffComment, BakeOffEntry } from '../types/bakeOff'

const VOTER_ID_KEY = 'bakeOffVoterId'
const VOTED_ENTRIES_KEY = 'bakeOffVotedEntryIds'

export function getVoterId(): string {
  let id = localStorage.getItem(VOTER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VOTER_ID_KEY, id)
  }
  return id
}

export function getVotedEntryIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_ENTRIES_KEY) || '[]')
  } catch {
    return []
  }
}

function markEntryVoted(entryId: string) {
  const voted = getVotedEntryIds()
  if (!voted.includes(entryId)) {
    localStorage.setItem(VOTED_ENTRIES_KEY, JSON.stringify([...voted, entryId]))
  }
}

export function getActiveChallenge(): BakeOffChallenge {
  const month = new Date().getMonth() + 1
  return bakeOffChallenges.find((c) => c.month === month) ?? bakeOffChallenges[0]
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function fetchEntries(sort: 'top' | 'new' = 'top'): Promise<BakeOffEntry[]> {
  const response = await fetch(`/api/bake-off-entries?sort=${sort}`)
  return handleResponse<BakeOffEntry[]>(response)
}

export interface SubmitEntryInput {
  bakerName: string
  title: string
  story: string
  spongeId: string
  fillingId: string
  frostingId: string
  garnishId?: string
}

export async function submitEntry(input: SubmitEntryInput): Promise<BakeOffEntry> {
  const response = await fetch('/api/bake-off-entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, voterId: getVoterId() }),
  })
  return handleResponse<BakeOffEntry>(response)
}

export async function castVote(entryId: string): Promise<{ voteCount: number }> {
  const response = await fetch('/api/bake-off-votes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId, voterId: getVoterId() }),
  })
  const result = await handleResponse<{ voteCount: number }>(response)
  markEntryVoted(entryId)
  return result
}

export async function fetchComments(entryId: string): Promise<BakeOffComment[]> {
  const response = await fetch(`/api/bake-off-comments?entryId=${encodeURIComponent(entryId)}`)
  return handleResponse<BakeOffComment[]>(response)
}

export async function submitComment(entryId: string, bakerName: string, text: string): Promise<BakeOffComment[]> {
  const response = await fetch('/api/bake-off-comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId, bakerName, text, voterId: getVoterId() }),
  })
  return handleResponse<BakeOffComment[]>(response)
}
