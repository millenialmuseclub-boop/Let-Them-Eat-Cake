export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces'

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water'

export const ZODIAC_ELEMENT_BY_SIGN: Record<ZodiacSign, ZodiacElement> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
}

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
  zodiacElements?: ZodiacElement[]
  moods?: MoodTag[]
  aesthetics?: AestheticTag[]
}
