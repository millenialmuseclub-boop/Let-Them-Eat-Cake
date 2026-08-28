// Canonical recipe architecture, one per canonical Cookie. Deliberately structured data (never a
// prose blob) so the UI can render a glanceable summary strip, grouped ingredients, and staged
// steps without parsing free text. Family-reusable shape: Canonical Food Entity -> Recipe ->
// Ingredients -> Method -> Technique Knowledge -> Troubleshooting -> Contextual Commerce (see
// DESIGN_SYSTEM.md).

export interface RecipeIngredient {
  ingredient: string
  amount: string
  unit?: string
  note?: string
}

export interface RecipeIngredientGroup {
  title: string
  ingredients: RecipeIngredient[]
}

export interface RecipeInstruction {
  step: number
  stage?: string
  instruction: string
  techniqueNote?: string
  /** Slug of a related Workshop Lab (see src/data/labs.json), when this step's "why" is explained
      more deeply there -- e.g. a chilling step links to dough-lab rather than re-explaining. */
  relatedLabSlug?: string
}

export interface Recipe {
  id: string
  cookieId: string
  title: string
  intro: string
  yield: string
  prepTime: string
  chillTime?: string
  bakeTime: string
  totalTime: string
  difficulty: 'easy' | 'intermediate' | 'advanced'
  equipment: string[]
  temperature: string
  ingredientGroups: RecipeIngredientGroup[]
  instructions: RecipeInstruction[]
  bakersNotes: string[]
  storage: string
  makeAhead?: string
  freezing?: string
  substitutions?: string[]
  variations?: string[]
  allergenNotes?: string
  relatedWorkshopLessons?: string[]
  sourceNote: string
}
