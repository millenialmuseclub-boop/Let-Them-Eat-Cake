// FIND + PAIR types (master spec §20-21). Adapted from Cake's src/types/sommelier.ts
// (CAKE_REFERENCE_AUDIT.md §7) -- same shape (weighted score -> ranked list -> plain-language
// explainer -> Bridging/Cutting/Echoing labels), new dimensions (richness/broth character/heat
// instead of sweetness/fat/acidity), and a query-driven FIND instead of Cake's cake-first mode
// (Ramen FIND has no existing bowl to start from -- it starts from stated preferences).

import type { FlavorTag, BrothCharacter, ProteinCategory } from './ramen'

export interface FindQuery {
  /** 1 (light) to 5 (very rich) */
  richness: number
  /** 1 (delicate) to 5 (bold) */
  intensity: number
  /** 0 (none) to 5 (very spicy) */
  heat: number
  brothCharacter: BrothCharacter
  flavorPreferences: FlavorTag[]
  /** 'flexible' matches any proteinCategory. */
  proteinPreference: ProteinCategory | 'flexible'
}

export interface FindWeights {
  baseScore: number
  richnessGapPenalty: number
  intensityGapPenalty: number
  heatGapPenalty: number
  brothCharacterMatchBonus: number
  flavorTagBonus: number
  proteinMatchBonus: number
}

export interface FindResult {
  score: number
  breakdown: {
    richnessGap: number
    intensityGap: number
    heatGap: number
    brothCharacterMatched: boolean
    matchedFlavorTags: FlavorTag[]
    proteinMatched: boolean
  }
}

export type PairingCategory = 'beverage' | 'non_alcoholic' | 'side' | 'condiment' | 'finishing_element' | 'dessert'

export interface PairingItem {
  id: string
  name: string
  category: PairingCategory
  description: string
  /** 1 (delicate) to 5 (bold) -- the only axis compared directly against the ramen's own intensity, for Echoing. */
  intensity: number
  /** 0 (none) to 5 (very acidic/carbonated/palate-cleansing) -- the Cutting signal, standing in for Cake's
      combined acidity+carbonation+tannin composite (CAKE_REFERENCE_AUDIT.md §7), simplified to one axis. */
  cuttingPower: number
  flavorTags: FlavorTag[]
}

export interface PairingWeights {
  baseScore: number
  intensityGapPenalty: number
  richnessCuttingThreshold: number
  cuttingPowerThreshold: number
  cuttingBonus: number
  flavorTagBonus: number
}

export interface PairingResult {
  score: number
  breakdown: {
    intensityGap: number
    cuttingBonus: boolean
    matchedFlavorTags: FlavorTag[]
  }
}
