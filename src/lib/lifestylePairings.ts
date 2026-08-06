import { lifestylePairings } from './data'
import type { DrinkCategory } from '../types/sommelier'
import type { LifestylePairing } from '../types/lifestylePairing'

export function getLifestylePairing(category: DrinkCategory): LifestylePairing | undefined {
  return lifestylePairings.find((p) => p.category === category)
}
