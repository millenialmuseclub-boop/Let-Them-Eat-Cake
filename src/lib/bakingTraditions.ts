import { cakes } from './data'
import { getRegionEntriesForCake } from './encyclopedia'
import type { BakingTradition } from '../types/bakingTradition'
import type { CakeProfile } from '../types/cake'

export function getTraditionCakes(tradition: BakingTradition): CakeProfile[] {
  return cakes.filter((cake) => getRegionEntriesForCake(cake.id).some((entry) => entry.region === tradition.region))
}
