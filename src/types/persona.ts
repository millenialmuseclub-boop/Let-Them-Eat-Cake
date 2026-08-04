export type MoodTag =
  | 'breakup-catharsis'
  | 'cozy-sunday'
  | 'pure-hype'
  | 'homesick'
  | 'celebration'
  | 'lazy-weekend'

export type AestheticTag =
  | 'coquette-vintage'
  | 'dark-academia'
  | 'minimalist-k-style'
  | 'cottagecore'
  | 'y2k-maximalist'

export interface PersonaTags {
  moods?: MoodTag[]
  aesthetics?: AestheticTag[]
}
