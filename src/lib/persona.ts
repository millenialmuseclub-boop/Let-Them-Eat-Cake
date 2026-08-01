import { cakes } from './data'
import type { CakeProfile } from '../types/cake'
import type { AestheticTag, MoodTag, ZodiacElement, ZodiacSign } from '../types/persona'
import { ZODIAC_ELEMENT_BY_SIGN } from '../types/persona'

function hasTag(tags: string[] | undefined, value: string): boolean {
  return !!tags?.includes(value)
}

export function cakesByZodiacElement(element: ZodiacElement, pool: CakeProfile[] = cakes): CakeProfile[] {
  return pool.filter((cake) => hasTag(cake.personaTags?.zodiacElements, element))
}

export function cakesByZodiacSign(sign: ZodiacSign, pool: CakeProfile[] = cakes): CakeProfile[] {
  return cakesByZodiacElement(ZODIAC_ELEMENT_BY_SIGN[sign], pool)
}

export function cakesByMood(mood: MoodTag, pool: CakeProfile[] = cakes): CakeProfile[] {
  return pool.filter((cake) => hasTag(cake.personaTags?.moods, mood))
}

export function cakesByAesthetic(aesthetic: AestheticTag, pool: CakeProfile[] = cakes): CakeProfile[] {
  return pool.filter((cake) => hasTag(cake.personaTags?.aesthetics, aesthetic))
}

export const ZODIAC_SIGN_OPTIONS: { value: ZodiacSign; label: string }[] = [
  { value: 'aries', label: 'Aries' },
  { value: 'taurus', label: 'Taurus' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'cancer', label: 'Cancer' },
  { value: 'leo', label: 'Leo' },
  { value: 'virgo', label: 'Virgo' },
  { value: 'libra', label: 'Libra' },
  { value: 'scorpio', label: 'Scorpio' },
  { value: 'sagittarius', label: 'Sagittarius' },
  { value: 'capricorn', label: 'Capricorn' },
  { value: 'aquarius', label: 'Aquarius' },
  { value: 'pisces', label: 'Pisces' },
]

export const MOOD_OPTIONS: { value: MoodTag; label: string }[] = [
  { value: 'breakup-catharsis', label: 'Breakup / Catharsis' },
  { value: 'cozy-sunday', label: 'Cozy Sunday' },
  { value: 'pure-hype', label: 'Pure Hype' },
  { value: 'homesick', label: 'Homesick' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'lazy-weekend', label: 'Lazy Weekend' },
]

export const AESTHETIC_OPTIONS: { value: AestheticTag; label: string }[] = [
  { value: 'coquette-vintage', label: 'Coquette / Vintage Piping' },
  { value: 'dark-academia', label: 'Dark Academia' },
  { value: 'minimalist-k-style', label: 'Minimalist / K-Style' },
  { value: 'cottagecore', label: 'Cottagecore' },
  { value: 'y2k-maximalist', label: 'Y2K Maximalist' },
]
