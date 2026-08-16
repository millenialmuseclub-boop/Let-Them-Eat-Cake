import { ingredientImages } from './data'
import type { IngredientImage } from '../types/ingredientImage'

export function getIngredientImage(slug: string): IngredientImage | undefined {
  return ingredientImages[slug]
}
