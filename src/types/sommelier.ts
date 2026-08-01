import type { FlavorProfile } from './cake'

export type DrinkCategory = 'coffee' | 'tea' | 'wine' | 'spirits' | 'beer' | 'non_alcoholic'

export interface DrinkFlavorProfile extends FlavorProfile {
  /** 0 (none) to 5 (very tannic/bitter) */
  bitternessTannin: number
  /** 0 (still) to 5 (highly carbonated) */
  carbonation: number
}

export interface DrinkProfile {
  id: string
  name: string
  category: DrinkCategory
  flavorProfile: DrinkFlavorProfile
  flavorNotes: string[]
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
