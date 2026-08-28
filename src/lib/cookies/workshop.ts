// Build a Cookie compatibility engine. Ported from Ramen's bowl-compatibility approach: derive
// "traditional" from real co-occurrence on canonical cookie records, check a small hand-curated
// discouraged list, otherwise fall back to a richness-gap heuristic. Deliberately not exhaustive --
// seeded only enough to validate the architecture against the 13 seeded cookies (Phase 1 §12).

import { DOUGH_COMPONENTS } from './data'
import type { DoughComponent, CompatibilityResult } from '../../types/cookies/workshop'

const DISCOURAGED_PAIRS: [string, string][] = [
  ['fat_ghee', 'mixin_chocolate'],
  ['filling_caramel_syrup', 'finish_powdered_sugar'],
]

function isDiscouraged(aId: string, bId: string): boolean {
  return DISCOURAGED_PAIRS.some(([x, y]) => (x === aId && y === bId) || (x === bId && y === aId))
}

export function getDoughComponent(id: string): DoughComponent | undefined {
  return DOUGH_COMPONENTS.find((c) => c.id === id)
}

export function checkCompatibility(aId: string, bId: string): CompatibilityResult {
  const a = getDoughComponent(aId)
  const b = getDoughComponent(bId)
  if (!a || !b) return { tier: 'experimental', reason: 'Unknown component combination.' }

  const sharedCookie = a.sourceCookieIds.find((id) => b.sourceCookieIds.includes(id))
  if (sharedCookie) {
    return { tier: 'traditional', reason: `Both appear together on a real seeded cookie (${sharedCookie}).` }
  }

  if (isDiscouraged(a.id, b.id)) {
    return { tier: 'discouraged', reason: `${a.name} and ${b.name} tend to fight each other structurally or in flavor.` }
  }

  const richnessGap = Math.abs(a.richness - b.richness)
  if (richnessGap <= 1) {
    return { tier: 'compatible', reason: `${a.name} and ${b.name} are close in richness and generally work well together, even without a direct traditional precedent.` }
  }

  return { tier: 'experimental', reason: `${a.name} and ${b.name} haven't been documented together -- this combination is unproven, not necessarily bad.` }
}
