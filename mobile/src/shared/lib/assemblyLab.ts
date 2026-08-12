import { assemblyComponents } from './data'
import type { FlavorProfile, Recipe, RecipeIngredient } from '../types/cake'
import type { AssemblyComponent, AssemblyComponentCategory } from '../types/assemblyLab'

/** Every component is authored at this shared base serving count so a combined recipe scales correctly as one unit. */
const ASSEMBLED_BASE_SERVINGS = 12

export function getComponentsByCategory(category: AssemblyComponentCategory): AssemblyComponent[] {
  return assemblyComponents.filter((c) => c.category === category)
}

export function buildAssembledRecipe(sponge: AssemblyComponent, filling: AssemblyComponent, frosting: AssemblyComponent, garnish?: AssemblyComponent): Recipe {
  const parts = [sponge, filling, frosting, ...(garnish ? [garnish] : [])]

  const ingredients: RecipeIngredient[] = parts.flatMap((part) => part.ingredients.map((ing) => ({ ...ing, id: `${part.id}-${ing.id}` })))

  const steps = [...sponge.steps, ...filling.steps, ...frosting.steps, ...(garnish ? garnish.steps : [])]

  return {
    id: `assembly-${sponge.id}-${filling.id}-${frosting.id}-${garnish?.id ?? 'none'}`,
    cakeId: 'assembly-lab-custom',
    baseServings: ASSEMBLED_BASE_SERVINGS,
    ingredients,
    steps,
  }
}

/** Simple unweighted average across sponge + filling + frosting. Garnish is excluded — a small-quantity accent, not a primary flavor driver. */
export function combineFlavorProfile(sponge: AssemblyComponent, filling: AssemblyComponent, frosting: AssemblyComponent): FlavorProfile {
  const parts = [sponge, filling, frosting]
  const avg = (key: keyof FlavorProfile) => parts.reduce((sum, p) => sum + p.flavorProfile[key], 0) / parts.length
  return {
    sweetness: avg('sweetness'),
    fatRichness: avg('fatRichness'),
    acidity: avg('acidity'),
    intensity: avg('intensity'),
  }
}

export function describeCombo(sponge: AssemblyComponent, filling: AssemblyComponent, frosting: AssemblyComponent, garnish?: AssemblyComponent): string {
  const garnishClause = garnish ? ` and topped with ${garnish.name.toLowerCase()}` : ''
  return `A ${sponge.name.toLowerCase()} sponge, layered with ${filling.name.toLowerCase()}, finished in ${frosting.name.toLowerCase()}${garnishClause}.`
}
