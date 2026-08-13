import { cakes, getRecipeForCake } from './data'
import { ALLERGEN_KEYWORDS, DIET_ALLERGEN_CONFLICTS } from './weddingAllergens'
import type { CakeProfile, DietTag, Recipe } from '../types/cake'
import type { TierRole, TierFlavorPick, WeddingCulture, WeddingSeasonEntry } from '../types/weddingCake'

/**
 * Starting-point heuristic weights, not tuned against real tasting data.
 * Adjust these as user feedback comes in rather than editing the formula itself.
 */
export const DEFAULT_TIER_PICK_WEIGHTS = {
  baseScore: 50,
  seasonNoteBonus: 8,
  cultureNoteBonus: 10,
  signatureCakeBonus: 25,
  roleTextureBonus: 12,
  roleTextureMismatchPenalty: 10,
  roleFatRichnessBonus: 8,
  dietFullyCompliantBonus: 15,
}

interface TierScoreResult {
  score: number
  breakdown: Record<string, number>
}

interface TierCandidate {
  cake: CakeProfile
  recipe: Recipe
  score: number
  breakdown: Record<string, number>
}

function countNoteMatches(cakeNotes: string[], targetNotes: string[]): number {
  const targetSet = new Set(targetNotes.map((note) => note.toLowerCase()))
  return cakeNotes.filter((note) => targetSet.has(note.toLowerCase())).length
}

function isDietCompliant(recipe: Recipe, diet: DietTag | 'none'): boolean {
  if (diet === 'none') return true
  const conflicts = DIET_ALLERGEN_CONFLICTS[diet]
  for (const ingredient of recipe.ingredients) {
    const name = ingredient.name.toLowerCase()
    const triggersConflict = conflicts.some((allergen) => ALLERGEN_KEYWORDS[allergen].some((keyword) => name.includes(keyword)))
    if (triggersConflict && !ingredient.substitutions?.some((sub) => sub.diet === diet)) {
      return false
    }
  }
  return true
}

export function calculateTierScore(
  cake: CakeProfile,
  recipe: Recipe,
  role: TierRole,
  seasonEntry: WeddingSeasonEntry,
  culture: WeddingCulture,
  diet: DietTag | 'none',
  weights = DEFAULT_TIER_PICK_WEIGHTS,
): TierScoreResult {
  const seasonNoteBonus = countNoteMatches(cake.flavorNotes, seasonEntry.flavorAffinityNotes) * weights.seasonNoteBonus
  const cultureNoteBonus = countNoteMatches(cake.flavorNotes, culture.flavorNotes) * weights.cultureNoteBonus
  const signatureCakeBonus = culture.signatureCakeId === cake.id ? weights.signatureCakeBonus : 0

  const roleTextureBonus = (role === 'top' || role === 'base') && cake.texture === 'dense' ? weights.roleTextureBonus : 0
  const roleTextureMismatchPenalty = role === 'top' && cake.texture === 'creamy' ? weights.roleTextureMismatchPenalty : 0
  const roleFatRichnessBonus = role === 'base' && cake.flavorProfile.fatRichness >= 4 ? weights.roleFatRichnessBonus : 0

  const dietCompliant = isDietCompliant(recipe, diet)
  const dietFullyCompliantBonus = dietCompliant ? weights.dietFullyCompliantBonus : 0

  const rawScore =
    weights.baseScore +
    seasonNoteBonus +
    cultureNoteBonus +
    signatureCakeBonus +
    roleTextureBonus -
    roleTextureMismatchPenalty +
    roleFatRichnessBonus +
    dietFullyCompliantBonus

  const score = Math.min(100, Math.max(0, rawScore))

  return {
    score,
    breakdown: {
      base: weights.baseScore,
      seasonNoteBonus,
      cultureNoteBonus,
      signatureCakeBonus,
      roleTextureBonus,
      roleTextureMismatchPenalty,
      roleFatRichnessBonus,
      dietFullyCompliantBonus,
      dietCompliant: dietCompliant ? 1 : 0,
    },
  }
}

function rankTierCandidates(
  role: TierRole,
  seasonEntry: WeddingSeasonEntry,
  culture: WeddingCulture,
  diet: DietTag | 'none',
  excludeIds: Set<string>,
  pool: CakeProfile[] = cakes,
): TierCandidate[] {
  const candidates: TierCandidate[] = []
  for (const cake of pool) {
    if (excludeIds.has(cake.id)) continue
    const recipe = getRecipeForCake(cake.id)
    if (!recipe) continue
    const { score, breakdown } = calculateTierScore(cake, recipe, role, seasonEntry, culture, diet)
    candidates.push({ cake, recipe, score, breakdown })
  }
  return candidates.sort((a, b) => b.score - a.score)
}

/** Turns a score breakdown into short reasoning bullets, in priority order (strongest effect first). */
export function explainTierPick(cake: CakeProfile, role: TierRole, seasonEntry: WeddingSeasonEntry, culture: WeddingCulture, breakdown: Record<string, number>): string[] {
  const sentences: string[] = []

  if (breakdown.signatureCakeBonus > 0) {
    sentences.push(`${cake.name} is the signature cake most closely tied to ${culture.name}'s wedding traditions.`)
  }

  if (breakdown.cultureNoteBonus > 0) {
    sentences.push(`Its flavor notes echo ${culture.name}'s characteristic wedding flavors.`)
  }

  if (breakdown.seasonNoteBonus > 0) {
    sentences.push(`It leans into ${seasonEntry.name.toLowerCase()}'s seasonal flavor palette.`)
  }

  if (role === 'top' && breakdown.roleTextureBonus > 0) {
    sentences.push(`Its dense texture holds up well to freezing, a safe pick for a preserved anniversary tier.`)
  } else if (role === 'top' && breakdown.roleTextureMismatchPenalty > 0) {
    sentences.push(`This texture is on the creamier side, which can suffer in the freezer — ask the baker about a freezer-stable variation for the top tier.`)
  }

  if (role === 'base' && breakdown.roleFatRichnessBonus > 0) {
    sentences.push(`Its richness gives it the structural body needed to support the tiers above it.`)
  }

  if (sentences.length === 0) {
    sentences.push(`The best overall flavor match available for this tier's role.`)
  }

  return sentences
}

export function pickTiers(seasonEntry: WeddingSeasonEntry, culture: WeddingCulture, diet: DietTag | 'none', tierCount: number): TierFlavorPick[] {
  const excludeIds = new Set<string>()
  const picks: TierFlavorPick[] = []
  const roleOrder: TierRole[] = tierCount === 1 ? ['base'] : ['base', 'top']

  for (const role of roleOrder) {
    const ranked = rankTierCandidates(role, seasonEntry, culture, diet, excludeIds)
    if (ranked.length === 0) continue
    const top = ranked[0]
    excludeIds.add(top.cake.id)

    const anyCompliant = ranked.some((candidate) => candidate.breakdown.dietCompliant === 1)
    const dietCaveat =
      diet !== 'none' && !anyCompliant
        ? `No cake in the pool has a documented ${diet} substitution for every affected ingredient — pick below is the best flavor match; a baker will need to improvise.`
        : undefined

    picks.push({
      role,
      cakeId: top.cake.id,
      recipeId: top.recipe.id,
      reason: explainTierPick(top.cake, role, seasonEntry, culture, top.breakdown),
      scoreBreakdown: top.breakdown,
      dietCaveat,
    })
  }

  return picks
}
