import type { FlavorProfile } from './cake'

export type DrinkCategory = 'coffee' | 'tea' | 'wine' | 'spirits' | 'beer' | 'non_alcoholic' | 'champagne' | 'port' | 'cocktails'

export interface DrinkFlavorProfile extends FlavorProfile {
  /** 0 (none) to 5 (very tannic/bitter) */
  bitternessTannin: number
  /** 0 (still) to 5 (highly carbonated) */
  carbonation: number
}

export interface ServingGuidance {
  temperature: string
  glassware: string
  garnish?: string
  prepTip: string
}

export interface DrinkProfile {
  id: string
  name: string
  category: DrinkCategory
  flavorProfile: DrinkFlavorProfile
  flavorNotes: string[]
  serving: ServingGuidance
}

/** Named, tunable weights for calculatePairingScore. Adjust here instead of hardcoding magic numbers. */
export interface PairingWeights {
  baseScore: number
  intensityMismatchPenalty: number
  fatRichnessCleansingThreshold: number
  cleansingPowerThreshold: number
  cleansingBonus: number
  sharedNoteBonus: number
}

export interface PairingResult {
  score: number
  breakdown: {
    base: number
    intensityPenalty: number
    cleansingBonus: number
    sharedNoteBonus: number
    sharedNotes: string[]
  }
}
