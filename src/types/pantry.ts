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

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type Equipment = 'oven' | 'microwave' | 'baking-pan' | 'loaf-pan' | 'hand-mixer'

export interface PantrySubstitution {
  missingIngredient: PantryIngredient
  replacement: string
  flavorImpact: string
  difficultyNote: string
}

export interface BakersNotes {
  commonMistakes: string
  makeAhead: string
  storage: string
  freezing: string
}

export interface EmergencyRecipe {
  id: string
  name: string
  description: string
  requiredIngredients: PantryIngredient[]
  /** Points into the shared `recipes` array — carries exact quantities, units, and detailed steps via the existing Recipe schema. */
  recipeId: string
  yield: number
  timeMinutes: number
  skillLevel: SkillLevel
  equipment: Equipment[]
  substitutions?: PantrySubstitution[]
  bakersNotes?: BakersNotes
}

export type MatchTier = 'best' | 'great' | 'creative' | 'far'

export interface PantryMatch {
  recipe: EmergencyRecipe
  missing: PantryIngredient[]
  tier: MatchTier
  /** only the substitutions relevant to what this pantry is actually missing */
  applicableSubstitutions: PantrySubstitution[]
  /** short, generic explanation of why this result is a good match for the given tier */
  matchReason: string
}

export interface PantryFilters {
  maxTimeMinutes?: number
  skillLevel?: SkillLevel
  /** equipment the user has confirmed owning; empty = no equipment filtering */
  requiredEquipment: Set<Equipment>
}
