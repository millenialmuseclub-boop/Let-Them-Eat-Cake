import type { Recipe, DietTag } from '../types/cake'
import type { Allergen, AllergenAuditEntry } from '../types/weddingCake'

export const ALLERGEN_KEYWORDS: Record<Allergen, string[]> = {
  dairy: ['butter', 'milk', 'cream', 'cheese', 'yogurt', 'buttermilk'],
  eggs: ['egg'],
  'wheat-gluten': ['flour', 'wheat', 'semolina'],
  'tree-nuts': ['almond', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'cashew', 'macadamia'],
  peanuts: ['peanut'],
  soy: ['soy', 'tofu', 'edamame'],
}

export const DIET_ALLERGEN_CONFLICTS: Record<DietTag, Allergen[]> = {
  vegan: ['dairy', 'eggs'],
  'gluten-free': ['wheat-gluten'],
  'dairy-free': ['dairy'],
  'egg-free': ['eggs'],
  'nut-free': ['tree-nuts'],
}

const FALLBACK_ALLERGEN_GUIDANCE: Record<Allergen, string> = {
  dairy: 'Swap dairy milk/butter/cream for a 1:1 plant-based equivalent and cheese fillings for a cashew or coconut-based alternative.',
  eggs: 'Replace each egg with 1 tbsp ground flaxseed + 3 tbsp water (rested 5 min) or a commercial egg replacer; may soften crumb structure.',
  'wheat-gluten': 'Use a 1:1 gluten-free baking blend with xanthan gum; confirm the prep zone is cross-contamination free for celiac guests.',
  'tree-nuts': 'Omit nut inclusions/garnishes and confirm a nut-free prep zone; nut flours need a seed-flour (sunflower/pumpkin) swap.',
  peanuts: 'Confirm no cross-contact with peanut oil or praline garnishes; omit any peanut garnish entirely.',
  soy: 'Check packaged margarine/chocolate/non-dairy substitutes for soy lecithin and swap to a soy-free brand if needed.',
}

const ALL_ALLERGENS: Allergen[] = ['dairy', 'eggs', 'wheat-gluten', 'tree-nuts', 'peanuts', 'soy']

export function detectAllergensInRecipe(recipe: Recipe): Map<Allergen, string[]> {
  const found = new Map<Allergen, string[]>()
  for (const ingredient of recipe.ingredients) {
    const name = ingredient.name.toLowerCase()
    for (const allergen of ALL_ALLERGENS) {
      if (ALLERGEN_KEYWORDS[allergen].some((keyword) => name.includes(keyword))) {
        const existing = found.get(allergen) ?? []
        existing.push(ingredient.name)
        found.set(allergen, existing)
      }
    }
  }
  return found
}

export function auditAllergens(recipes: Recipe[], diet: DietTag | 'none'): AllergenAuditEntry[] {
  return ALL_ALLERGENS.map((allergen) => {
    const sourceIngredientNames: string[] = []
    let allMatchingHaveSubstitution = true
    let anyMatchingHasSubstitution = false
    let presentAnywhere = false

    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        const name = ingredient.name.toLowerCase()
        if (!ALLERGEN_KEYWORDS[allergen].some((keyword) => name.includes(keyword))) continue
        presentAnywhere = true
        sourceIngredientNames.push(ingredient.name)
        const sub = diet !== 'none' ? ingredient.substitutions?.find((s) => s.diet === diet) : undefined
        if (sub) {
          anyMatchingHasSubstitution = true
        } else {
          allMatchingHaveSubstitution = false
        }
      }
    }

    const uniqueNames = Array.from(new Set(sourceIngredientNames))

    if (!presentAnywhere) {
      return { allergen, present: false, sourceIngredientNames: [], status: 'not-present', guidance: 'Not present in the selected tiers.' }
    }

    if (diet !== 'none' && allMatchingHaveSubstitution) {
      return {
        allergen,
        present: true,
        sourceIngredientNames: uniqueNames,
        status: 'resolved',
        guidance: `A documented ${diet} substitution already covers every ${allergen.replace('-', '/')} ingredient in the selected tiers.`,
      }
    }

    const guidanceParts: string[] = []
    if (anyMatchingHasSubstitution) {
      guidanceParts.push(`Some ${allergen.replace('-', '/')} ingredients already have a documented ${diet} swap.`)
    }
    guidanceParts.push(FALLBACK_ALLERGEN_GUIDANCE[allergen])

    return {
      allergen,
      present: true,
      sourceIngredientNames: uniqueNames,
      status: 'unresolved',
      guidance: guidanceParts.join(' '),
    }
  })
}
