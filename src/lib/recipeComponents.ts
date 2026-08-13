import type { RecipeComponent } from '../types/cake'

/** "Lemon curd" for a real filling/finish, or its "none traditionally used" note. Undefined if the recipe doesn't document this component at all. */
export function formatComponentLabel(component: RecipeComponent | undefined): string | undefined {
  if (!component) return undefined
  return 'none' in component ? component.note : component.name
}
