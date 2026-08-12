import { cakeImages } from './data'
import type { CakeImage } from '../types/cakeImage'

export function getCakeImage(cakeId: string): CakeImage | undefined {
  return cakeImages[cakeId]
}

export function getFirstPhotographedCakeId(cakeIds: string[]): string | undefined {
  return cakeIds.find((id) => getCakeImage(id))
}
