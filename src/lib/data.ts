import cakesJson from '../data/cakes.json'
import decadesJson from '../data/decades.json'
import recipesJson from '../data/recipes.json'
import regionsJson from '../data/regions.json'
import drinksJson from '../data/drinks.json'
import emergencyRecipesJson from '../data/emergency-recipes.json'
import weddingCulturesJson from '../data/weddingCultures.json'
import weddingAestheticsJson from '../data/weddingAesthetics.json'
import weddingSeasonsJson from '../data/weddingSeasons.json'
import type { CakeProfile, Recipe } from '../types/cake'
import type { HistoricalCakeEntry } from '../types/timeMachine'
import type { RegionalCakeEntry } from '../types/atlas'
import type { DrinkProfile } from '../types/sommelier'
import type { EmergencyRecipe } from '../types/pantry'
import type { WeddingCulture, WeddingAesthetic, WeddingSeasonEntry } from '../types/weddingCake'

export const cakes = cakesJson as CakeProfile[]
export const decades = decadesJson as HistoricalCakeEntry[]
export const recipes = recipesJson as Recipe[]
export const regions = regionsJson as RegionalCakeEntry[]
export const drinks = drinksJson as DrinkProfile[]
export const emergencyRecipes = emergencyRecipesJson as EmergencyRecipe[]
export const weddingCultures = weddingCulturesJson as WeddingCulture[]
export const weddingAesthetics = weddingAestheticsJson as WeddingAesthetic[]
export const weddingSeasons = weddingSeasonsJson as WeddingSeasonEntry[]

function toMap<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

export const cakesById = toMap(cakes)
export const recipesById = toMap(recipes)
export const recipesByCakeId = new Map(recipes.map((r) => [r.cakeId, r]))

export function getCake(cakeId: string): CakeProfile | undefined {
  return cakesById.get(cakeId)
}

export function getRecipe(recipeId: string): Recipe | undefined {
  return recipesById.get(recipeId)
}

export function getRecipeForCake(cakeId: string): Recipe | undefined {
  return recipesByCakeId.get(cakeId)
}
