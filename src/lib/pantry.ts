import type { EmergencyRecipe, PantryIngredient, PantryMatch } from '../types/pantry'

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

export function rankEmergencyRecipes(onHand: PantryIngredient[], recipes: EmergencyRecipe[]): PantryMatch[] {
  const onHandSet = new Set(onHand)
  return recipes
    .map((recipe) => ({
      recipe,
      missing: recipe.requiredIngredients.filter((ingredient) => !onHandSet.has(ingredient)),
    }))
    .sort((a, b) => a.missing.length - b.missing.length)
}
