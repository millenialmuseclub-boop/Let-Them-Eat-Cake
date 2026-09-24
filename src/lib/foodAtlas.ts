import atlasJson from '../data/foodAtlas.json'
import foodJson from '../data/foodSearch.json'
import type { FoodEntry } from './foodSearch'

export interface FoodPlace {
  foodId: string; world: FoodEntry['world']; countries: string[]; area: string
  context: string; story: string; association?: string
  variations?: string[]; ingredients?: string[]
}
export const atlasPlaces = atlasJson as FoodPlace[]
export const atlasFoods = new Map((foodJson as FoodEntry[]).map(food => [food.id, food]))
export const atlasCountries = [...new Set(atlasPlaces.flatMap(place => place.countries))].sort()
export const atlasWorlds = ['all', 'cake', 'cookies', 'ramen', 'noodles'] as const
export function placesFor(country: string, world = 'all') {
  return atlasPlaces.filter(place => place.countries.includes(country) && (world === 'all' || place.world === world))
    .filter((place, index, all) => all.findIndex(other => other.foodId === place.foodId) === index)
}
import { atlasJourneys } from '../data/atlasJourneys'
export const atlasTrails = atlasJourneys
export function journeysFor(world = 'all') {
  return atlasJourneys.filter(journey => world === 'all' || journey.stops.every(stop => atlasFoods.get(stop.foodId)?.world === world))
}
export function resolveJourney(id: string | null, country: string, world: string, region: string, foodId: string | null) {
  if (region) return undefined
  return journeysFor(world).find(journey => journey.id === id && journey.country === country &&
    (!foodId || journey.stops.some(stop => stop.foodId === foodId)))
}
