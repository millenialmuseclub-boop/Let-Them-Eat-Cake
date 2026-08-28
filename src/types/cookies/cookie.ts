// Cookies' own parallel domain model (master spec §26) -- deliberately NOT an extension of any
// Cake or Ramen type. Field set follows the "Cookie record fields" list in
// LET_THEM_EAT_COOKIES_MASTER_SPEC.md §8, trimmed to what the seeded Phase 1 records actually use.

export interface CookieFlavorProfile {
  /** 1 (barely sweet) to 5 (very sweet) */
  sweetness: number
  /** 1 (light) to 5 (very rich/buttery) */
  richness: number
  /** 1 (soft/chewy) to 5 (crisp/crunchy) */
  crispness: number
  /** 0 (none) to 5 (strongly spiced) */
  spice: number
}

export type TextureCategory = 'crisp' | 'chewy' | 'soft' | 'crumbly' | 'cakey'

export type DominantFat = 'butter' | 'oil' | 'shortening' | 'lard' | 'mixed'

export type CookieFamily = 'drop' | 'rolled' | 'shaped' | 'bar' | 'sandwich' | 'wafer'

/** Small, fixed vocabulary shared between cookie records and Sommelier FIND (types/sommelier.ts)
    -- the "shared notes" signal FIND's flavor-tag bonus is computed from. */
export type CookieFlavorTag = 'chocolate-forward' | 'nutty' | 'citrus' | 'spiced' | 'fruity' | 'buttery' | 'caramel' | 'coconut' | 'floral'

export type VariationTag = 'traditional' | 'common' | 'modern'

export interface CookieProfile {
  id: string
  name: string
  /** Native-language or alternate name, where genuinely part of how the cookie is known. */
  localName?: string
  /** Short card/list description. */
  description: string
  origin: string
  historicalContext: string
  culturalSignificance: string
  dominantFat: DominantFat
  sweetener: string
  leavening: string
  family: CookieFamily
  textureCategory: TextureCategory
  commonMixIns: string[]
  commonVariations: string[]
  modernVariations: string[]
  flavorProfile: CookieFlavorProfile
  flavorTags: CookieFlavorTag[]
  preparationOverview: string
  variationTag: VariationTag
  variationNote: string
}
