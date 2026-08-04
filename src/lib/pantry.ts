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

export function matchEmergencyRecipes(onHand: PantryIngredient[], recipes: EmergencyRecipe[]): PantryMatch[] {
  const onHandSet = new Set(onHand)
  return recipes.map((recipe) => {
    const missing = recipe.requiredIngredients.filter((ingredient) => !onHandSet.has(ingredient))
    const tier: MatchTier = missing.length === 0 ? 'exact' : missing.length <= 2 ? 'close' : 'far'
    const missingSet = new Set(missing)
    const applicableSubstitutions = (recipe.substitutions ?? []).filter((sub) => missingSet.has(sub.missingIngredient))
    return { recipe, missing, tier, applicableSubstitutions }
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
