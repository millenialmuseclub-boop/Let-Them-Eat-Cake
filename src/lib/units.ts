import type { DietTag, Recipe, RecipeIngredient } from '../types/cake'

export type UnitSystem = 'metric' | 'imperial'

export interface ScaledIngredient {
  id: string
  name: string
  qty: number
  unit: string
  substitutionNote?: string
}

/** Rounds to 2 decimal places to avoid floating-point noise like 1.0000000002 cups. */
function roundQty(qty: number): number {
  return Math.round(qty * 100) / 100
}

function scaleIngredient(ingredient: RecipeIngredient, ratio: number, system: UnitSystem, activeDiet?: DietTag): ScaledIngredient {
  const base = ingredient[system]
  const substitution = activeDiet ? ingredient.substitutions?.find((sub) => sub.diet === activeDiet) : undefined

  return {
    id: ingredient.id,
    name: ingredient.name,
    qty: roundQty(base.qty * ratio),
    unit: base.unit,
    substitutionNote: substitution ? `${substitution.replacement}${substitution.notes ? ` — ${substitution.notes}` : ''}` : undefined,
  }
}

export function scaleRecipe(
  recipe: Recipe,
  targetServings: number,
  system: UnitSystem,
  activeDiet?: DietTag,
): ScaledIngredient[] {
  const ratio = targetServings / recipe.baseServings
  return recipe.ingredients.map((ingredient) => scaleIngredient(ingredient, ratio, system, activeDiet))
}
