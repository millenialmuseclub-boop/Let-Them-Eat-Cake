export type PantryIngredient =
  | 'flour'
  | 'self-rising-flour'
  | 'sugar'
  | 'eggs'
  | 'butter'
  | 'vegetable-oil'
  | 'milk'
  | 'yogurt'
  | 'cocoa-powder'
  | 'baking-soda'
  | 'baking-powder'
  | 'vinegar'
  | 'vanilla-extract'
  | 'applesauce'
  | 'condensed-milk'
  | 'salt'
  | 'cinnamon'
  | 'lemon-juice'

export interface EmergencyRecipe {
  id: string
  name: string
  description: string
  requiredIngredients: PantryIngredient[]
  steps: string[]
}

export interface PantryMatch {
  recipe: EmergencyRecipe
  missing: PantryIngredient[]
}
