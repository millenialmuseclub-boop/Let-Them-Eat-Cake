import type { AiCakeResult } from '../types/atlas'

export async function lookupCakeForLocation(location: string): Promise<AiCakeResult> {
  const response = await fetch('/api/atlas-lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Lookup failed with status ${response.status}`)
  }

  return response.json() as Promise<AiCakeResult>
}
