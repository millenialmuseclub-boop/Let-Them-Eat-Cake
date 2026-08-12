import { cakes } from './data'
import type { CakeProfile, CakeTexture } from '../types/cake'
import type { MoodTag } from '../types/persona'

function matchesKeywords(cake: CakeProfile, keywords: string[]): boolean {
  if (keywords.length === 0) return true
  return cake.flavorNotes.some((note) => keywords.some((keyword) => note.toLowerCase().includes(keyword)))
}

export function pickBirthdayCake(keywords: string[], texture: CakeTexture, mood: MoodTag): CakeProfile {
  const pool = cakes.filter((cake) => matchesKeywords(cake, keywords))
  const candidates = pool.length > 0 ? pool : cakes

  let best = candidates[0]
  let bestScore = -Infinity
  for (const cake of candidates) {
    let score = 0
    if (cake.texture === texture) score += 15
    if (cake.personaTags?.moods?.includes(mood)) score += 10
    if (score > bestScore) {
      best = cake
      bestScore = score
    }
  }
  return best
}
