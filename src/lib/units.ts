import type { DietTag, IngredientSubstitution, Recipe, RecipeComponent, RecipeIngredient } from '../types/cake'

export type UnitSystem = 'metric' | 'imperial'

export interface ScaledIngredient {
  id: string
  name: string
  qty: number
  unit: string
  substitutionNote?: string
}

/** Fills {0},{1}... placeholders in `replacement` with the substitution's own documented amounts. */
function formatSubstitution(sub: IngredientSubstitution): string {
  const text = sub.scalableAmounts ? sub.replacement.replace(/\{(\d+)\}/g, (_, i) => String(sub.scalableAmounts![Number(i)])) : sub.replacement
  return sub.notes ? `${text} — ${sub.notes}` : text
}

function formatIngredient(ingredient: RecipeIngredient, system: UnitSystem, activeDiet?: DietTag): ScaledIngredient {
  const base = ingredient[system]
  const substitution = activeDiet ? ingredient.substitutions?.find((sub) => sub.diet === activeDiet) : undefined

  return {
    id: ingredient.id,
    name: ingredient.name,
    qty: base.qty,
    unit: base.unit,
    substitutionNote: substitution ? formatSubstitution(substitution) : undefined,
  }
}

/** Recipe ingredients at their original documented quantities -- no serving-size scaling. */
export function getRecipeIngredients(recipe: Recipe, system: UnitSystem, activeDiet?: DietTag): ScaledIngredient[] {
  return recipe.ingredients.map((ingredient) => formatIngredient(ingredient, system, activeDiet))
}

/** A Filling/Frosting & Finish component's own ingredient list, at original quantities -- returns null for a real "none" declaration (nothing to list). */
export function getRecipeComponentIngredients(component: RecipeComponent, system: UnitSystem, activeDiet?: DietTag): ScaledIngredient[] | null {
  if ('none' in component) return null
  return component.ingredients.map((ingredient) => formatIngredient(ingredient, system, activeDiet))
}
