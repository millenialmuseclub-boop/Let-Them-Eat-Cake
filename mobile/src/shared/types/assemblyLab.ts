import type { FlavorProfile, RecipeIngredient } from './cake'

export type AssemblyComponentCategory = 'sponge' | 'filling' | 'frosting' | 'garnish'

export interface AssemblyComponent {
  id: string
  category: AssemblyComponentCategory
  name: string
  description: string
  /** drives the live illustration's fill color for this layer */
  colorHex: string
  flavorProfile: FlavorProfile
  flavorNotes: string[]
  /** authored at a shared base serving count (12) so components combine cleanly */
  ingredients: RecipeIngredient[]
  steps: string[]
}
