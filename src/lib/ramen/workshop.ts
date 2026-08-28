// Build a Bowl compatibility foundation (master spec §12). Deliberately not a
// rules engine: one derived signal (do two components co-occur on the same
// canonical ramen record?) plus one small authored exception list, rather
// than a scored/weighted system. This is intended as the seed Sommelier
// CREATE's richer compatibility model (§22) grows from later, not the final
// form of it -- see BowlComponent's sourceRamenIds in types/workshop.ts.

import { bowlComponents, ramenById } from './data'
import type { BowlComponent, BowlComponentCategory, CompatibilityResult, CompatibilityTier } from '../../types/ramen/workshop'

export function getBowlComponentsByCategory(category: BowlComponentCategory): BowlComponent[] {
  return bowlComponents.filter((c) => c.category === category)
}

/** Small, hand-curated set of real culinary mismatches that co-occurrence data alone can't
    surface (absence of two components sharing a canonical bowl is not evidence they clash --
    most cross-category pairs are simply untested combinations, i.e. "experimental"). Keep this
    list short and specific; it's an editorial judgment call, not a derived signal. */
const DISCOURAGED_PAIRS: { a: string; b: string; reason: string }[] = [
  {
    a: 'aroma_mayu_garlic_oil',
    b: 'broth_shio_clear',
    reason: "Black garlic oil's intensity overwhelms a shio broth built specifically to showcase clarity and restraint.",
  },
  {
    a: 'noodle_thin_straight',
    b: 'broth_tonkotsu_shoyu_hybrid',
    reason: 'This broth is traditionally paired with thick noodles specifically because it needs the extra weight to stand up to it -- a thin noodle would go limp and disappear.',
  },
]

function findDiscouraged(aId: string, bId: string) {
  return DISCOURAGED_PAIRS.find((pair) => (pair.a === aId && pair.b === bId) || (pair.a === bId && pair.b === aId))
}

export function computeCompatibility(a: BowlComponent, b: BowlComponent): CompatibilityResult {
  const sharedRamenId = a.sourceRamenIds.find((id) => b.sourceRamenIds.includes(id))
  if (sharedRamenId) {
    const sourceName = ramenById.get(sharedRamenId)?.name ?? 'the same traditional bowl'
    return { tier: 'traditional', reason: `Both appear together on ${sourceName}.` }
  }

  const discouraged = findDiscouraged(a.id, b.id)
  if (discouraged) {
    return { tier: 'discouraged', reason: discouraged.reason }
  }

  const richnessGap = Math.abs(a.richness - b.richness)
  if (richnessGap <= 1.5) {
    return { tier: 'compatible', reason: `${a.name} and ${b.name} sit at a similar richness, so neither overwhelms the other.` }
  }

  return { tier: 'experimental', reason: `${a.name} and ${b.name} haven't been paired on a documented traditional bowl and differ noticeably in richness -- an untested combination rather than a discouraged one.` }
}

export const TIER_LABEL: Record<CompatibilityTier, string> = {
  traditional: 'Traditional',
  compatible: 'Compatible',
  experimental: 'Experimental',
  discouraged: 'Discouraged',
}

/** Unweighted average richness across every selected component -- the single axis this
    foundation tracks (see types/workshop.ts). Garnish-weight categories (topping, finish)
    are included since even small additions were authored with a real richness value. */
export function combineBowlRichness(selections: BowlComponent[]): number {
  if (selections.length === 0) return 0
  return selections.reduce((sum, c) => sum + c.richness, 0) / selections.length
}

export function describeBowl(selections: Partial<Record<BowlComponentCategory, BowlComponent>>): string {
  const { broth, tare, aromaOil, noodle, protein } = selections
  if (!broth || !tare || !noodle) return 'Keep selecting components to see your bowl take shape.'

  const aromaClause = aromaOil && aromaOil.id !== 'aroma_none_clear' ? `, finished with ${aromaOil.name.toLowerCase()}` : ''
  const proteinClause = protein ? ` and topped with ${protein.name.toLowerCase()}` : ''

  return `A ${broth.name.toLowerCase()} seasoned with ${tare.name.toLowerCase()}${aromaClause}, served over ${noodle.name.toLowerCase()}${proteinClause}.`
}
