import { affiliateProducts } from './data'
import type { AffiliateProduct } from '../types/affiliateProduct'
import type { DrinkCategory } from '../types/sommelier'

function activeProducts(): AffiliateProduct[] {
  return affiliateProducts.filter((p) => p.active)
}

export function getProductsForIngredient(slug: string): AffiliateProduct[] {
  return activeProducts().filter((p) => p.associatedIngredientSlugs?.includes(slug))
}

export function getProductsForTechnique(techniqueId: string): AffiliateProduct[] {
  return activeProducts().filter((p) => p.associatedTechniqueIds?.includes(techniqueId))
}

export function getProductsForHubPath(path: string): AffiliateProduct[] {
  return activeProducts().filter((p) => p.associatedHubPaths?.includes(path))
}

export function getProductsForPairingCategory(category: DrinkCategory): AffiliateProduct[] {
  return activeProducts().filter((p) => p.associatedPairingCategories?.includes(category))
}

export function getProductsForCakeId(cakeId: string): AffiliateProduct[] {
  return activeProducts().filter((p) => p.associatedCakeIds?.includes(cakeId))
}
