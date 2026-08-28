// Same "of the day" pattern as Cake's src/lib/discovery.ts -- deterministic by
// calendar day (not random) so the same ramen shows all day and the page
// doesn't need client-only rendering to avoid a server/client mismatch.

import { ramen, ramenImages } from './data'
import type { RamenProfile } from '../../types/ramen/ramen'

// Photography coverage is still partial (12 of 25 bowls have no photo yet), and this is the
// single most prominent featured slot in the Encyclopedia -- unlike a grid card, a placeholder
// here reads as broken, not "coming soon". Restrict the daily rotation to photographed bowls
// (falling back to the full list only if none have photos yet) so the featured entry always
// shows a real photo.
const photographedRamen = ramen.filter((r) => ramenImages[r.id])

export function getRamenOfTheDay(): RamenProfile {
  const pool = photographedRamen.length > 0 ? photographedRamen : ramen
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  return pool[dayIndex % pool.length]
}
