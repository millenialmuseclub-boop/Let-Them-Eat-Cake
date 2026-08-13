import { cakes } from './data'
import type { CakeTexture } from '../types/cake'

// Sommelier's secondary flavor/ingredient/texture discovery -- one source of
// truth for the cake dataset's own filterable attributes.

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
