// Canonical commerce shape for the merged "Let Them Eat" app, ported verbatim (structure-wise)
// from Ramen's types/product.ts -- Editorial Product -> Merchant Offer -> Affiliate Route, since
// the same physical product can legitimately have more than one affiliate route (e.g. sold
// through both ShopMy and LTK). This is the shape all NEW cross-world commerce data (Ramen,
// Cookies, Noodles) is written in. Cake's existing types/affiliateProduct.ts + AffiliateProductCard
// stay as-is (untouched, still shipping) rather than being retrofitted -- see
// src/lib/products.ts for how the two coexist.

// Left as a plain string rather than a strict union: Ramen, Cookies, and Noodles each shipped
// their own category vocabulary (e.g. Ramen's "broth-essentials" vs Cookies' "chocolate-decorating"
// vs Noodles' own set), and forcing them into one shared enum would be exactly the kind of
// generic-flattening the merge is explicitly not supposed to do to each world's domain model.
export type ProductCategory = string

export type AffiliateNetwork = 'shopmy' | 'ltk' | 'pending'

/** 'needs-verification' is distinct from 'pending': a URL exists but is suspect (e.g. flagged as
    duplicating another product's URL) and must never render as a clickable live link until a
    human confirms it. 'retired' is for a route that used to be active and no longer is. */
export type OfferStatus = 'active' | 'pending' | 'needs-verification' | 'retired'

export interface AffiliateRoute {
  /** Stable semantic id, not a list position -- e.g. "mora-ceramic-bowls-ltk". */
  id: string
  network: AffiliateNetwork
  cta?: string
  url?: string
  status: OfferStatus
  notes?: string
}

export type World = 'cake' | 'ramen' | 'cookies' | 'noodles'

export interface AffiliateProduct {
  /** Stable semantic product id -- never a list index/number. */
  id: string
  name: string
  brand?: string
  category: ProductCategory
  description: string
  editorialNote?: string
  /** Which world(s) this product surfaces in. */
  apps: World[]
  /** Contexts this product should surface in beyond the general Curated Kitchen catalog, e.g. Workshop Lab slugs. */
  contexts?: string[]
  offers: AffiliateRoute[]
}
