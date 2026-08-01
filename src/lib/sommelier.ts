import type { CakeProfile } from '../types/cake'
import type { DrinkProfile, PairingResult, PairingWeights } from '../types/sommelier'

/**
 * Starting-point heuristic weights, not tuned against real tasting data.
 * Adjust these as user feedback comes in rather than editing the formula itself.
 */
export const DEFAULT_PAIRING_WEIGHTS: PairingWeights = {
  baseScore: 50,
  intensityMismatchPenalty: 8,
  fatRichnessCleansingThreshold: 4,
  cleansingPowerThreshold: 6,
  cleansingBonus: 20,
  sharedNoteBonus: 10,
}

export function calculatePairingScore(
  cake: CakeProfile,
  drink: DrinkProfile,
  weights: PairingWeights = DEFAULT_PAIRING_WEIGHTS,
): PairingResult {
  const intensityDiff = Math.abs(cake.flavorProfile.intensity - drink.flavorProfile.intensity)
  const intensityPenalty = intensityDiff * weights.intensityMismatchPenalty

  let cleansingBonus = 0
  if (cake.flavorProfile.fatRichness >= weights.fatRichnessCleansingThreshold) {
    const cleansingPower =
      drink.flavorProfile.acidity + drink.flavorProfile.carbonation + drink.flavorProfile.bitternessTannin
    if (cleansingPower >= weights.cleansingPowerThreshold) {
      cleansingBonus = weights.cleansingBonus
    }
  }

  const sharedNotes = cake.flavorNotes.filter((note) => drink.flavorNotes.includes(note))
  const sharedNoteBonus = sharedNotes.length * weights.sharedNoteBonus

  const rawScore = weights.baseScore - intensityPenalty + cleansingBonus + sharedNoteBonus
  const score = Math.min(100, Math.max(0, rawScore))

  return {
    score,
    breakdown: {
      base: weights.baseScore,
      intensityPenalty,
      cleansingBonus,
      sharedNoteBonus,
      sharedNotes,
    },
  }
}

export function rankPairings(cake: CakeProfile, candidateDrinks: DrinkProfile[]): (PairingResult & { drink: DrinkProfile })[] {
  return candidateDrinks
    .map((drink) => ({ drink, ...calculatePairingScore(cake, drink) }))
    .sort((a, b) => b.score - a.score)
}
