import type { AestheticTag, MoodTag } from '../types/persona'

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
