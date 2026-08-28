// Aggregated cross-world commerce catalog, in the canonical AffiliateProduct { offers: [] } shape
// (see src/types/product.ts). Ramen's own products.json already conforms to this shape; Cookies'
// and Noodles' were adapted into it while porting their content (see src/data/<world>/products.json
// and each world's product-adapter notes). Cake's existing data/affiliateProducts.json stays on
// its own separate, unchanged shape/pipeline (types/affiliateProduct.ts, lib/affiliateProducts.ts)
// -- it is not part of this aggregate, so the already-shipped Cake commerce UI is untouched.
import ramenProducts from '../data/ramen/products.json'
import cookiesProducts from '../data/cookies/products.json'
import noodlesProducts from '../data/noodles/products.json'
import type { AffiliateProduct } from '../types/product'

// Some products are legitimately shared across more than one world's own source data (e.g. a
// stand mixer useful in both Ramen's and Cookies' workshops) and can appear with the same id in
// more than one of the three files above -- deduped here (first occurrence wins) so a Curated
// Kitchen listing never renders/keys the same product twice.
function dedupeById(items: AffiliateProduct[]): AffiliateProduct[] {
  const seen = new Set<string>()
  return items.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
}

export const products: AffiliateProduct[] = dedupeById([
  ...(ramenProducts as AffiliateProduct[]),
  ...(cookiesProducts as AffiliateProduct[]),
  ...(noodlesProducts as AffiliateProduct[]),
])

export function getProductsForContext(context: string): AffiliateProduct[] {
  return products.filter((p) => p.contexts?.includes(context))
}

export function getProductsForCategory(category: AffiliateProduct['category']): AffiliateProduct[] {
  return products.filter((p) => p.category === category)
}
