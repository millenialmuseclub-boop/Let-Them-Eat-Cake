// Ramen's own parallel domain model (master spec §29) -- deliberately NOT an
// extension of any Cake type. Field set follows the "Ramen record fields"
// list in LET_THEM_EAT_RAMEN_MASTER_SPEC.md §8, trimmed to what the seeded
// Phase 2 records actually use.

export interface RamenFlavorProfile {
  /** 1 (light) to 5 (very rich) */
  richness: number
  /** 1 (delicate) to 5 (bold) */
  intensity: number
  /** 0 (none) to 5 (very spicy) */
  heat: number
  /** 1 (subtle) to 5 (very umami-forward) */
  umami: number
}

export type VariationTag = 'traditional' | 'common' | 'modern'

/** Small, fixed vocabulary shared between ramen records and pairing items (types/sommelier.ts) --
    the "shared notes" signal Sommelier FIND/PAIR bridging bonuses are computed from. */
export type FlavorTag = 'savory' | 'smoky' | 'garlicky' | 'seafood-forward' | 'fermented' | 'sweet-savory' | 'umami-heavy' | 'citrus' | 'spicy'

export type BrothCharacter = 'clear' | 'creamy'

/** All 8 canonical ramen currently in ramen.json are pork-based toppings (chashu/ground pork) --
    'chicken' | 'seafood' | 'vegetable' exist in the type for when the library grows, but nothing
    seeds them yet. Sommelier FIND is honest about this rather than fabricating a bowl to fill a gap. */
export type ProteinCategory = 'pork' | 'chicken' | 'seafood' | 'vegetable'

export interface RamenProfile {
  id: string
  name: string
  japaneseName?: string
  romanization?: string
  /** Short card/list description. */
  description: string
  origin: string
  historicalContext: string
  culturalSignificance: string
  broth: string
  tare: string
  aromaOil?: string
  noodleStyle: string
  noodleCharacteristics: string
  traditionalToppings: string[]
  commonProteins: string[]
  flavorProfile: RamenFlavorProfile
  texture: string
  preparationOverview: string
  variationTag: VariationTag
  variationNote: string
  /** Sommelier FIND/PAIR scoring attributes (master spec §20-21) -- extending the existing
      records rather than a separate parallel dataset, per the Phase 5 instruction to extend
      structured attributes "only as needed for scoring." */
  brothCharacter: BrothCharacter
  flavorTags: FlavorTag[]
  proteinCategory: ProteinCategory
}
