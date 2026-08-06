import type { PersonaTags } from './persona'

export interface FlavorProfile {
  /** 1 (barely sweet) to 5 (very sweet) */
  sweetness: number
  /** 1 (light) to 5 (very rich/buttery) */
  fatRichness: number
  /** 1 (none) to 5 (very tart/acidic) */
  acidity: number
  /** 1 (subtle) to 5 (bold/intense flavor) */
  intensity: number
}

export type CakeTexture = 'sponge' | 'dense' | 'creamy' | 'crumbly'

export interface CakeProfile {
  id: string
  name: string
  description: string
  flavorProfile: FlavorProfile
  flavorNotes: string[]
  texture: CakeTexture
  personaTags?: PersonaTags
  /** Phonetic guide, only set for non-English names. */
  pronunciation?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  occasion?: string[]
}

export type DietTag = 'vegan' | 'gluten-free' | 'dairy-free' | 'egg-free' | 'nut-free'

export interface UnitQuantity {
  qty: number
  unit: string
}

export interface IngredientSubstitution {
  diet: DietTag
  replacement: string
  /** Amounts referenced via {0},{1}... placeholders in `replacement` — each scales with servings exactly like the base ingredient's own quantity. */
  scalableAmounts?: number[]
  notes?: string
}

export interface RecipeIngredient {
  id: string
  name: string
  metric: UnitQuantity
  imperial: UnitQuantity
  substitutions?: IngredientSubstitution[]
}

export interface Recipe {
  id: string
  cakeId: string
  baseServings: number
  ingredients: RecipeIngredient[]
  steps: string[]
}
