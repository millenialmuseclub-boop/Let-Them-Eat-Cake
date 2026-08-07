import { drinkImages } from './data'
import type { DrinkImage } from '../types/drinkImage'

export function getDrinkImage(drinkId: string): DrinkImage | undefined {
  return drinkImages[drinkId]
}
