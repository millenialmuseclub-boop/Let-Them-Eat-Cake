// FIND types (master spec §20). Adapted from Ramen's src/types/sommelier.ts, itself adapted from
// Cake's -- same shape (weighted score -> ranked list -> plain-language explainer), new
// dimensions (sweetness/richness/crispness/flavor tags instead of richness/broth character/heat).
// PAIR and CREATE are intentionally not modeled yet -- PAIR needs real pairing data before it's
// worth building (Phase 1 instruction §14: "do not fake depth with tiny meaningless pairing
// data"), and CREATE has no precedent to adapt from until FIND/PAIR exist (master spec §20).

import type { CookieFamily, CookieFlavorTag } from './cookie'

export interface FindQuery {
  /** 1 (barely sweet) to 5 (very sweet) */
  sweetness: number
  /** 1 (light) to 5 (very rich/buttery) */
  richness: number
  /** 1 (soft/chewy) to 5 (crisp/crunchy) */
  crispness: number
  flavorPreferences: CookieFlavorTag[]
  /** 'flexible' matches any family. */
  familyPreference: CookieFamily | 'flexible'
}

export interface FindWeights {
  baseScore: number
  sweetnessGapPenalty: number
  richnessGapPenalty: number
  crispnessGapPenalty: number
  flavorTagBonus: number
  familyMatchBonus: number
}

export interface FindResult {
  score: number
  breakdown: {
    sweetnessGap: number
    richnessGap: number
    crispnessGap: number
    matchedFlavorTags: CookieFlavorTag[]
    familyMatched: boolean
  }
}
