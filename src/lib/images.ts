import { cakeImages, cakes } from './data'
import type { CakeImage } from '../types/cakeImage'

export function getCakeImage(cakeId: string): CakeImage | undefined {
  return cakeImages[cakeId]
}

export function getFirstPhotographedCakeId(cakeIds: string[]): string | undefined {
  return cakeIds.find((id) => getCakeImage(id))
}

/** Photographed cake whose flavorNotes overlap `keywords` the most -- used to give
    flavor-direction choice tiles (Wedding/Birthday/Other Celebrations) a real,
    genuinely-matched cake photo instead of an invented or generic one. */
export function getRepCakeForKeywords(keywords: string[]): string | undefined {
  if (keywords.length === 0) return undefined
  const lowerKeywords = keywords.map((k) => k.toLowerCase())
  const scored = cakes
    .map((cake) => {
      const notes = cake.flavorNotes.map((n) => n.toLowerCase())
      const score = lowerKeywords.filter((k) => notes.some((n) => n.includes(k) || k.includes(n))).length
      return { id: cake.id, score }
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
  return getFirstPhotographedCakeId(scored.map((c) => c.id))
}
