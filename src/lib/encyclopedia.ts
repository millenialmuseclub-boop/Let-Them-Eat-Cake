import { cakes, regions, decades, drinks } from './data'
import { rankPairings } from './sommelier'
import type { CakeProfile } from '../types/cake'
import type { AtlasRegion, RegionalCakeEntry } from '../types/atlas'
import type { HistoricalCakeEntry } from '../types/timeMachine'
import type { RelatedCake } from '../types/encyclopedia'

export function getRegionEntriesForCake(cakeId: string): RegionalCakeEntry[] {
  return regions.filter((r) => r.cakeId === cakeId)
}

/** The 6 broad AtlasRegion groupings actually represented across the cake dataset -- lightweight enough for a browse chip row, unlike the 100+ individual countries. */
export function distinctOrigins(): AtlasRegion[] {
  const seen = new Set<AtlasRegion>()
  for (const cake of cakes) {
    for (const r of getRegionEntriesForCake(cake.id)) seen.add(r.region)
  }
  return [...seen].sort()
}

export function getDecadeForCake(cakeId: string): HistoricalCakeEntry | undefined {
  return decades.find((d) => d.cakeId === cakeId)
}

export function getTopPairings(cake: CakeProfile, limit = 3) {
  return rankPairings(cake, drinks).slice(0, limit)
}

/**
 * "Regional variations" reframed as computed related cakes rather than authored prose —
 * scores every other cake by shared country, shared flavor notes, and matching texture.
 */
export function getRelatedCakes(cake: CakeProfile, limit = 4): RelatedCake[] {
  const ownCountries = new Set(getRegionEntriesForCake(cake.id).map((r) => r.country))

  const scored = cakes
    .filter((c) => c.id !== cake.id)
    .map((c) => {
      let score = 0
      let reason = ''

      const sharedCountry = getRegionEntriesForCake(c.id).find((r) => ownCountries.has(r.country))
      if (sharedCountry) {
        score += 3
        reason = `Also from ${sharedCountry.country}`
      }

      const sharedNotes = c.flavorNotes.filter((note) => cake.flavorNotes.includes(note))
      if (sharedNotes.length > 0) {
        score += sharedNotes.length * 2
        if (!reason) reason = `Shares ${sharedNotes[0]} notes`
      }

      if (c.texture === cake.texture) {
        score += 1
        if (!reason) reason = `Shares a ${cake.texture} texture`
      }

      return { cake: c, score, reason }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map(({ cake: relatedCake, reason }) => ({ cake: relatedCake, reason }))
}
