import cakesJson from '../data/cakes.json'
import decadesJson from '../data/decades.json'
import recipesJson from '../data/recipes.json'
import regionsJson from '../data/regions.json'
import drinksJson from '../data/drinks.json'
import emergencyRecipesJson from '../data/emergency-recipes.json'
import weddingCulturesJson from '../data/weddingCultures.json'
import weddingAestheticsJson from '../data/weddingAesthetics.json'
import weddingSeasonsJson from '../data/weddingSeasons.json'
import assemblyComponentsJson from '../data/assemblyComponents.json'
import bakeOffChallengesJson from '../data/bakeOffChallenges.json'
import cakeAnatomyJson from '../data/cakeAnatomy.json'
import cakePersonalitiesJson from '../data/cakePersonalities.json'
import weddingDecorationStylesJson from '../data/weddingDecorationStyles.json'
import collectionsJson from '../data/collections.json'
import type { CakeProfile, Recipe } from '../types/cake'
import type { HistoricalCakeEntry } from '../types/timeMachine'
import type { RegionalCakeEntry } from '../types/atlas'
import type { DrinkProfile } from '../types/sommelier'
import type { EmergencyRecipe } from '../types/pantry'
import type { WeddingCulture, WeddingAesthetic, WeddingSeasonEntry, WeddingDecorationStyle } from '../types/weddingCake'
import type { AssemblyComponent } from '../types/assemblyLab'
import type { BakeOffChallenge } from '../types/bakeOff'
import type { CakeAnatomyStage } from '../types/cakeAnatomy'
import type { CakePersonality } from '../types/personaMatch'
import type { Collection } from '../types/collection'

export const cakes = cakesJson as CakeProfile[]
export const decades = decadesJson as HistoricalCakeEntry[]
export const recipes = recipesJson as Recipe[]
export const regions = regionsJson as RegionalCakeEntry[]
export const drinks = drinksJson as DrinkProfile[]
export const emergencyRecipes = emergencyRecipesJson as EmergencyRecipe[]
export const weddingCultures = weddingCulturesJson as WeddingCulture[]
export const weddingAesthetics = weddingAestheticsJson as WeddingAesthetic[]
export const weddingSeasons = weddingSeasonsJson as WeddingSeasonEntry[]
export const assemblyComponents = assemblyComponentsJson as AssemblyComponent[]
export const bakeOffChallenges = bakeOffChallengesJson as BakeOffChallenge[]
export const cakeAnatomyStages = cakeAnatomyJson as CakeAnatomyStage[]
export const cakePersonalities = cakePersonalitiesJson as CakePersonality[]
export const weddingDecorationStyles = weddingDecorationStylesJson as WeddingDecorationStyle[]
export const collections = collectionsJson as Collection[]

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

export const cakePersonalitiesById = toMap(cakePersonalities)

export function getCakePersonality(personalityId: string): CakePersonality | undefined {
  return cakePersonalitiesById.get(personalityId)
}

export const weddingDecorationStylesById = toMap(weddingDecorationStyles)

export function getWeddingDecorationStyle(id: string): WeddingDecorationStyle | undefined {
  return weddingDecorationStylesById.get(id)
}

export const drinksById = toMap(drinks)

export function getDrink(drinkId: string): DrinkProfile | undefined {
  return drinksById.get(drinkId)
}

export const collectionsById = toMap(collections)

export function getCollection(collectionId: string): Collection | undefined {
  return collectionsById.get(collectionId)
}
