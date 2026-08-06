import type { DrinkCategory } from './sommelier'

export interface LifestylePairing {
  category: DrinkCategory
  flowers: string
  tableStyle: string
  music: string
  occasion: string
}
