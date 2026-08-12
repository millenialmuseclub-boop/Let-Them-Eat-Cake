import type { CakeTexture } from './cake'
import type { MoodTag } from './persona'

export type CollectionRule =
  | { type: 'flavorNote'; values: string[] }
  | { type: 'texture'; value: CakeTexture }
  | { type: 'mood'; value: MoodTag }

export interface Collection {
  id: string
  title: string
  description: string
  icon: string
  rule: CollectionRule
}
