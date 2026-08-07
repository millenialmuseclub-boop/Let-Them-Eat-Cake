import { cakeImages } from './data'
import type { CakeImage } from '../types/cakeImage'

export function getCakeImage(cakeId: string): CakeImage | undefined {
  return cakeImages[cakeId]
}
