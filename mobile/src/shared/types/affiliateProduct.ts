import type { DrinkCategory } from './sommelier'

export type AffiliateNetwork = 'shopmy' | 'ltk'

export type AffiliateProductCategory = 'equipment' | 'ingredient' | 'beverage-equipment' | 'presentation' | 'featured-cake'

export interface AffiliateProduct {
  id: string
  name: string
  category: AffiliateProductCategory
  /** Exact, unmodified tracking URL — never truncate or rewrite. */
  url: string
  network: AffiliateNetwork
  active: boolean
  associatedHubPaths?: string[]
  associatedTechniqueIds?: string[]
  associatedIngredientSlugs?: string[]
  associatedCakeIds?: string[]
  associatedPairingCategories?: DrinkCategory[]
  associatedOccasion?: string[]
  imageUrl?: string
  editorialNote?: string
  price?: number
  salePrice?: number
  retailer?: string
  seasonalFlag?: boolean
}
