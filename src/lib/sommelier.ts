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

export function rankCakesForDrink(drink: DrinkProfile, candidateCakes: CakeProfile[]): (PairingResult & { cake: CakeProfile })[] {
  return candidateCakes
    .map((cake) => ({ cake, ...calculatePairingScore(cake, drink) }))
    .sort((a, b) => b.score - a.score)
}

/** Turns a score breakdown into full-sentence reasoning, in priority order (strongest effect first). */
export function explainPairing(cake: CakeProfile, drink: DrinkProfile, result: PairingResult): string[] {
  const { breakdown } = result
  const sentences: string[] = []

  if (breakdown.intensityPenalty === 0) {
    sentences.push(`${cake.name}'s intensity is closely matched with ${drink.name}, so neither one overwhelms the other.`)
  } else if (breakdown.intensityPenalty >= 24) {
    sentences.push(`There's a large intensity gap here — one of these two flavors is going to dominate the other.`)
  } else if (breakdown.intensityPenalty >= 8) {
    sentences.push(`Their intensities aren't a perfect match, so expect one flavor to lead slightly over the other.`)
  }

  if (breakdown.cleansingBonus > 0) {
    sentences.push(
      `This cake is rich enough that ${drink.name}'s acidity, carbonation, or tannin cuts through the fat and resets your palate between bites.`,
    )
  }

  if (breakdown.sharedNotes.length > 0) {
    sentences.push(`They share ${breakdown.sharedNotes.join(', ')} flavor notes, creating a direct bridge between the cake and the drink.`)
  }

  const sweetnessDiff = cake.flavorProfile.sweetness - drink.flavorProfile.sweetness
  if (sweetnessDiff >= 2) {
    sentences.push(`${drink.name} is noticeably less sweet than the cake, so it acts as a contrast rather than piling on more sugar.`)
  } else if (sweetnessDiff <= -2) {
    sentences.push(`${drink.name} brings more sweetness than the cake itself, so expect the drink to lead on that front.`)
  }

  if (sentences.length === 0) {
    sentences.push(`This isn't a natural pairing — the flavors don't reinforce each other and there's little to bridge the gap.`)
  }

  return sentences
}

/** Restructures the same real score breakdown into the 3 named pairing-science concepts — no new scoring, just relabeling existing signals. */
export function explainPairingScience(cake: CakeProfile, drink: DrinkProfile, result: PairingResult): { bridging?: string; cutting?: string; echoing?: string } {
  const { breakdown } = result
  const science: { bridging?: string; cutting?: string; echoing?: string } = {}

  if (breakdown.sharedNotes.length > 0) {
    science.bridging = `${cake.name} and ${drink.name} share ${breakdown.sharedNotes.join(', ')} flavor notes, creating a direct bridge between the two.`
  }

  if (breakdown.cleansingBonus > 0) {
    science.cutting = `${drink.name}'s acidity, carbonation, or tannin cuts through the cake's richness and resets your palate between bites.`
  }

  if (breakdown.intensityPenalty === 0) {
    science.echoing = `${cake.name} and ${drink.name} are closely matched in intensity, so each one echoes and reinforces the other rather than one overwhelming it.`
  }

  return science
}
