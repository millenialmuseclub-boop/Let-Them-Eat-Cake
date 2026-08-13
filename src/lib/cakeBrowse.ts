import { cakes } from './data'
import type { CakeTexture } from '../types/cake'

// Shared by the Encyclopedia (Origin/Occasion only) and Sommelier's
// secondary flavor/ingredient/texture discovery -- one source of truth for
// the cake dataset's own filterable attributes, not duplicated per page.

export const CAKE_TEXTURES: CakeTexture[] = ['sponge', 'dense', 'creamy', 'crumbly']

export function getTopFlavorNotes(limit: number): string[] {
  const counts = new Map<string, number>()
  for (const cake of cakes) {
    for (const note of cake.flavorNotes) counts.set(note, (counts.get(note) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([note]) => note)
}

export function distinctOccasions(): string[] {
  const seen = new Set<string>()
  for (const cake of cakes) for (const o of cake.occasion ?? []) seen.add(o)
  return [...seen].sort()
}
