import type { DietTag, IngredientSubstitution, Recipe, RecipeComponent, RecipeIngredient } from '../types/cake'

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

/** Fills {0},{1}... placeholders in `replacement` with amounts scaled by the same ratio as the base ingredient. */
function formatSubstitution(sub: IngredientSubstitution, ratio: number): string {
  const text = sub.scalableAmounts
    ? sub.replacement.replace(/\{(\d+)\}/g, (_, i) => String(roundQty(sub.scalableAmounts![Number(i)] * ratio)))
    : sub.replacement
  return sub.notes ? `${text} — ${sub.notes}` : text
}

function scaleIngredient(ingredient: RecipeIngredient, ratio: number, system: UnitSystem, activeDiet?: DietTag): ScaledIngredient {
  const base = ingredient[system]
  const substitution = activeDiet ? ingredient.substitutions?.find((sub) => sub.diet === activeDiet) : undefined

  return {
    id: ingredient.id,
    name: ingredient.name,
    qty: roundQty(base.qty * ratio),
    unit: base.unit,
    substitutionNote: substitution ? formatSubstitution(substitution, ratio) : undefined,
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

/** Scales a Filling/Frosting & Finish component's own ingredient list — returns null for a real "none" declaration (nothing to scale). */
export function scaleRecipeComponent(
  component: RecipeComponent,
  recipe: Recipe,
  targetServings: number,
  system: UnitSystem,
  activeDiet?: DietTag,
): ScaledIngredient[] | null {
  if ('none' in component) return null
  const ratio = targetServings / recipe.baseServings
  return component.ingredients.map((ingredient) => scaleIngredient(ingredient, ratio, system, activeDiet))
}
