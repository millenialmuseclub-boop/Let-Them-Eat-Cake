import type { DietTag } from './cake'

export interface CanonicalIngredient {
  slug: string
  displayName: string
  cakeIds: string[]
  substitutions: { diet: DietTag; replacement: string }[]
}
