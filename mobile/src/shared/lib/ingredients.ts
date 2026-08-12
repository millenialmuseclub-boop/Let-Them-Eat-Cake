import { cakes, recipes } from './data'
import type { CanonicalIngredient } from '../types/ingredient'

/** Strips trailing ", softened"-style qualifiers and "(frosting)"-style parentheticals, then lowercases/trims. */
export function normalizeIngredientName(name: string): string {
  return name
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/,.*$/, '')
    .trim()
    .toLowerCase()
}

export function slugify(name: string): string {
  return normalizeIngredientName(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toDisplayName(normalized: string): string {
  return normalized
    .split(' ')
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}

function buildIngredientIndex(): Map<string, CanonicalIngredient> {
  const index = new Map<string, CanonicalIngredient>()
  const realCakeIds = new Set(cakes.map((c) => c.id))

  for (const recipe of recipes) {
    if (!realCakeIds.has(recipe.cakeId)) continue
    for (const ingredient of recipe.ingredients) {
      const slug = slugify(ingredient.name)
      if (!slug) continue

      let entry = index.get(slug)
      if (!entry) {
        entry = { slug, displayName: toDisplayName(normalizeIngredientName(ingredient.name)), cakeIds: [], substitutions: [] }
        index.set(slug, entry)
      }

      if (!entry.cakeIds.includes(recipe.cakeId)) {
        entry.cakeIds.push(recipe.cakeId)
      }

      for (const sub of ingredient.substitutions ?? []) {
        const alreadyHave = entry.substitutions.some((s) => s.diet === sub.diet && s.replacement === sub.replacement)
        if (!alreadyHave) {
          entry.substitutions.push({ diet: sub.diet, replacement: sub.replacement })
        }
      }
    }
  }

  return index
}

const INGREDIENT_INDEX = buildIngredientIndex()

export function getIngredient(slug: string): CanonicalIngredient | undefined {
  return INGREDIENT_INDEX.get(slug)
}

export function getAllIngredients(): CanonicalIngredient[] {
  return [...INGREDIENT_INDEX.values()].sort((a, b) => b.cakeIds.length - a.cakeIds.length || a.displayName.localeCompare(b.displayName))
}
