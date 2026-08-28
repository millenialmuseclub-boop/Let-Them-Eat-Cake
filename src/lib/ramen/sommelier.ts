// FIND + PAIR scoring engine, adapted from Cake's src/lib/sommelier.ts (CAKE_REFERENCE_AUDIT.md
// §7) -- same architecture (weighted score, clamped 0-100, plus a separate plain-language
// explainer that re-narrates the score breakdown rather than doing new math). No AI/LLM
// involved anywhere in this file, per master spec §20/§22.

import { ramen } from './data'
import type { RamenProfile } from '../../types/ramen/ramen'
import type { FindQuery, FindResult, FindWeights, PairingItem, PairingResult, PairingWeights } from '../../types/ramen/sommelier'

export const DEFAULT_FIND_WEIGHTS: FindWeights = {
  baseScore: 50,
  richnessGapPenalty: 6,
  intensityGapPenalty: 6,
  heatGapPenalty: 4,
  brothCharacterMatchBonus: 12,
  flavorTagBonus: 8,
  proteinMatchBonus: 10,
}

export function calculateFindScore(query: FindQuery, candidate: RamenProfile, weights: FindWeights = DEFAULT_FIND_WEIGHTS): FindResult {
  const richnessGap = Math.abs(query.richness - candidate.flavorProfile.richness)
  const intensityGap = Math.abs(query.intensity - candidate.flavorProfile.intensity)
  const heatGap = Math.abs(query.heat - candidate.flavorProfile.heat)

  const brothCharacterMatched = query.brothCharacter === candidate.brothCharacter
  const matchedFlavorTags = query.flavorPreferences.filter((tag) => candidate.flavorTags.includes(tag))
  const proteinMatched = query.proteinPreference === 'flexible' || query.proteinPreference === candidate.proteinCategory

  const rawScore =
    weights.baseScore -
    richnessGap * weights.richnessGapPenalty -
    intensityGap * weights.intensityGapPenalty -
    heatGap * weights.heatGapPenalty +
    (brothCharacterMatched ? weights.brothCharacterMatchBonus : 0) +
    matchedFlavorTags.length * weights.flavorTagBonus +
    (proteinMatched ? weights.proteinMatchBonus : 0)

  const score = Math.min(100, Math.max(0, Math.round(rawScore)))

  return {
    score,
    breakdown: { richnessGap, intensityGap, heatGap, brothCharacterMatched, matchedFlavorTags, proteinMatched },
  }
}

export function rankRamenForQuery(query: FindQuery, candidates: RamenProfile[] = ramen): (FindResult & { ramen: RamenProfile })[] {
  return candidates.map((r) => ({ ramen: r, ...calculateFindScore(query, r) })).sort((a, b) => b.score - a.score)
}

/** Turns a FindResult breakdown into full-sentence reasoning, strongest signal first. */
export function explainFindMatch(candidate: RamenProfile, result: FindResult): string[] {
  const { breakdown } = result
  const sentences: string[] = []

  if (breakdown.richnessGap === 0 && breakdown.intensityGap === 0) {
    sentences.push(`${candidate.name}'s richness and intensity line up closely with what you asked for.`)
  } else if (breakdown.richnessGap <= 1 && breakdown.intensityGap <= 1) {
    sentences.push(`${candidate.name} is close to the richness and intensity you're looking for.`)
  }

  if (breakdown.brothCharacterMatched) {
    sentences.push(`It has the ${candidate.brothCharacter} broth style you asked for.`)
  }

  if (breakdown.matchedFlavorTags.length > 0) {
    sentences.push(`It shares your interest in ${breakdown.matchedFlavorTags.join(', ')} flavors.`)
  }

  if (breakdown.proteinMatched) {
    sentences.push(`Its protein (${candidate.proteinCategory}) matches what you asked for.`)
  }

  if (breakdown.heatGap >= 3) {
    sentences.push(`Its heat level is noticeably different from what you asked for, though.`)
  }

  if (sentences.length === 0) {
    sentences.push(`This is a stretch from what you asked for, but still worth a look.`)
  }

  return sentences
}

export const DEFAULT_PAIRING_WEIGHTS: PairingWeights = {
  baseScore: 50,
  intensityGapPenalty: 8,
  richnessCuttingThreshold: 4,
  cuttingPowerThreshold: 3,
  cuttingBonus: 20,
  flavorTagBonus: 10,
}

export function calculatePairingScore(candidate: RamenProfile, item: PairingItem, weights: PairingWeights = DEFAULT_PAIRING_WEIGHTS): PairingResult {
  const intensityGap = Math.abs(candidate.flavorProfile.intensity - item.intensity)
  const intensityPenalty = intensityGap * weights.intensityGapPenalty

  const cuttingBonus = candidate.flavorProfile.richness >= weights.richnessCuttingThreshold && item.cuttingPower >= weights.cuttingPowerThreshold

  const matchedFlavorTags = candidate.flavorTags.filter((tag) => item.flavorTags.includes(tag))

  const rawScore = weights.baseScore - intensityPenalty + (cuttingBonus ? weights.cuttingBonus : 0) + matchedFlavorTags.length * weights.flavorTagBonus
  const score = Math.min(100, Math.max(0, Math.round(rawScore)))

  return { score, breakdown: { intensityGap, cuttingBonus, matchedFlavorTags } }
}

export function bestPairingByCategory(candidate: RamenProfile, items: PairingItem[]): (PairingResult & { item: PairingItem })[] {
  const categories = Array.from(new Set(items.map((i) => i.category)))
  return categories
    .map((category) => {
      const ranked = items
        .filter((i) => i.category === category)
        .map((item) => ({ item, ...calculatePairingScore(candidate, item) }))
        .sort((a, b) => b.score - a.score)
      return ranked[0]
    })
    .filter((r): r is PairingResult & { item: PairingItem } => !!r)
}

/** Restructures the same score breakdown into Bridging / Cutting / Echoing (Cake's named pairing-science
    concepts, CAKE_REFERENCE_AUDIT.md §7) -- no new scoring, just relabeling existing signals. */
export function explainPairingScience(candidate: RamenProfile, item: PairingItem, result: PairingResult): { bridging?: string; cutting?: string; echoing?: string } {
  const { breakdown } = result
  const science: { bridging?: string; cutting?: string; echoing?: string } = {}

  if (breakdown.matchedFlavorTags.length > 0) {
    science.bridging = `${candidate.name} and ${item.name} share ${breakdown.matchedFlavorTags.join(', ')} notes, creating a direct bridge between the two.`
  }

  if (breakdown.cuttingBonus) {
    science.cutting = `${item.name} cuts through ${candidate.name}'s richness and resets your palate between bites.`
  }

  if (breakdown.intensityGap === 0) {
    science.echoing = `${candidate.name} and ${item.name} are closely matched in intensity, so each one echoes the other rather than one overwhelming it.`
  }

  return science
}
