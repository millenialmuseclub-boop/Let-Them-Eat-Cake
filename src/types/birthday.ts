import type { CakeTexture } from './cake'
import type { MoodTag, AestheticTag } from './persona'

export interface BirthdayEnergy {
  id: string
  name: string
  description: string
  texture: CakeTexture
  mood: MoodTag
  aesthetic: AestheticTag
}

export interface BirthdayFlavor {
  id: string
  name: string
  description: string
  keywords: string[]
}
