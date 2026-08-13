import type { EmergencyRecipe, Equipment, MatchTier, PantryFilters, PantryIngredient, PantryMatch, SkillLevel } from '../types/pantry'

export const PANTRY_INGREDIENT_LABELS: Record<PantryIngredient, string> = {
  flour: 'All-purpose flour',
  'self-rising-flour': 'Self-rising flour',
  sugar: 'Sugar',
  eggs: 'Eggs',
  butter: 'Butter',
  'vegetable-oil': 'Vegetable oil',
  milk: 'Milk',
  yogurt: 'Yogurt',
  'cocoa-powder': 'Cocoa powder',
  'baking-soda': 'Baking soda',
  'baking-powder': 'Baking powder',
  vinegar: 'Vinegar',
  'vanilla-extract': 'Vanilla extract',
  applesauce: 'Applesauce',
  'condensed-milk': 'Condensed milk',
  salt: 'Salt',
  cinnamon: 'Cinnamon',
  'lemon-juice': 'Lemon juice',
}

export const ALL_PANTRY_INGREDIENTS = Object.keys(PANTRY_INGREDIENT_LABELS) as PantryIngredient[]

/** Groups the flat pantry-ingredient list by type for a scannable Ingredient Explorer, instead of one long pill wall. */
export const PANTRY_INGREDIENT_GROUPS: { label: string; ingredients: PantryIngredient[] }[] = [
  { label: 'Flours & Leaveners', ingredients: ['flour', 'self-rising-flour', 'baking-soda', 'baking-powder'] },
  { label: 'Dairy & Eggs', ingredients: ['eggs', 'butter', 'milk', 'yogurt', 'condensed-milk'] },
  { label: 'Sugars & Sweeteners', ingredients: ['sugar'] },
  { label: 'Fats & Oils', ingredients: ['vegetable-oil'] },
  { label: 'Flavorings & Spices', ingredients: ['cocoa-powder', 'vanilla-extract', 'cinnamon', 'salt', 'lemon-juice'] },
  { label: 'Substitutes & Extras', ingredients: ['vinegar', 'applesauce'] },
]

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  oven: 'Oven',
  microwave: 'Microwave',
  'baking-pan': 'Baking pan',
  'loaf-pan': 'Loaf pan',
  'hand-mixer': 'Hand mixer',
}

export const ALL_EQUIPMENT = Object.keys(EQUIPMENT_LABELS) as Equipment[]

function reasonFor(tier: MatchTier, hasSubs: boolean): string {
  switch (tier) {
    case 'best':
      return 'You already have everything this recipe needs — no shopping required.'
    case 'great':
      return "You're missing just one ingredient, and it substitutes cleanly with what's likely already in your kitchen."
    case 'creative':
      return hasSubs
        ? 'A couple of ingredients are missing, but real substitutions can bridge the gap.'
        : "A couple of ingredients are missing — a quick trip to fill the gap and you're set."
    case 'far':
      return ''
  }
}

export function matchEmergencyRecipes(onHand: PantryIngredient[], recipes: EmergencyRecipe[]): PantryMatch[] {
  const onHandSet = new Set(onHand)
  return recipes.map((recipe) => {
    const missing = recipe.requiredIngredients.filter((ingredient) => !onHandSet.has(ingredient))
    const missingSet = new Set(missing)
    const applicableSubstitutions = (recipe.substitutions ?? []).filter((sub) => missingSet.has(sub.missingIngredient))
    const allMissingHaveSubs = missing.length > 0 && missing.every((m) => applicableSubstitutions.some((sub) => sub.missingIngredient === m))

    let tier: MatchTier
    if (missing.length === 0) tier = 'best'
    else if (missing.length === 1 && allMissingHaveSubs) tier = 'great'
    else if (missing.length <= 2) tier = 'creative'
    else tier = 'far'

    return { recipe, missing, tier, applicableSubstitutions, matchReason: reasonFor(tier, applicableSubstitutions.length > 0) }
  })
}

export function applyPantryFilters(matches: PantryMatch[], filters: PantryFilters): PantryMatch[] {
  return matches.filter(({ recipe }) => {
    if (filters.maxTimeMinutes && recipe.timeMinutes > filters.maxTimeMinutes) return false
    if (filters.skillLevel && recipe.skillLevel !== filters.skillLevel) return false
    if (filters.requiredEquipment.size > 0 && !recipe.equipment.every((e) => filters.requiredEquipment.has(e))) return false
    return true
  })
}
