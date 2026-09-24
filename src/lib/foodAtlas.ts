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
export const atlasTrails = [
  { country: 'Japan', world: 'ramen', food: 'ramen_sapporo_miso', title: 'One country. Many bowls.', note: 'Follow ramen from Sapporo’s miso broth to Hakata’s pork-bone tradition.' },
  { country: 'Mexico', world: 'all', food: 'cookie_marranitos', title: 'A sweet side of Mexico', note: 'Pig-shaped cookies, milk-soaked sponge and the pleasure of the panadería.' },
  { country: 'Vietnam', world: 'noodles', food: 'pho-bo', title: 'Follow the rice noodle', note: 'Discover how broth, dipping sauce and herbs change the way a noodle is eaten.' },
  { country: 'Italy', world: 'all', food: 'cookie_biscotti', title: 'The Italian sweet table', note: 'Explore the cakes and cookies in our collection, one tradition at a time.' },
]
