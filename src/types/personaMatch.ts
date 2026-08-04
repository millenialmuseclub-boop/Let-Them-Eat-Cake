import type { CakeTexture, FlavorProfile } from './cake'
import type { AestheticTag, MoodTag } from './persona'

export interface CakePersonality {
  id: string
  name: string
  personalityTitle: string
  description: string
  culturalStory: string
  targetFlavorProfile: FlavorProfile
  targetTexture: CakeTexture
  colorHex: string
  moodAffinity?: MoodTag[]
  aestheticAffinity?: AestheticTag[]
}

export type FlavorPull = 'bright-tart' | 'rich-buttery' | 'bold-intense' | 'simply-sweet'

export interface QuizAnswers {
  mood: MoodTag
  flavorPull: FlavorPull
  texture: CakeTexture
  aesthetic: AestheticTag
}

export interface ScoredMatch<T> {
  item: T
  score: number
}
