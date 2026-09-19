import type { AffiliateProduct } from '../types/affiliateProduct'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

function track(event: string, props: Record<string, string>) {
  if (typeof window !== 'undefined' && window.plausible) {
    // Analytics must never prevent an outbound link or an app interaction.
    try { window.plausible(event, { props }) } catch { /* Optional analytics provider. */ }
  }
}

export function trackProductClicked(product: { id: string; name: string; category: string }, network: string, context: string): void {
  track('Affiliate Link Clicked', { product: product.name, productId: product.id, network, category: product.category, context })
}

export function trackContentViewed(path: string, world: string): void {
  // Only route identity; never include search terms, saved notes, or query parameters.
  track('Content Viewed', { path, world })
}

export function trackExperienceClicked(name: string, context: string): void {
  track('Experience Link Clicked', { name, context })
}

export function trackAffiliateViewed(product: AffiliateProduct, context: string): void {
  track('Affiliate Recommendation Viewed', { product: product.name, network: product.network, category: product.category, context })
}

export function trackAffiliateClicked(product: AffiliateProduct, context: string): void {
  track('Affiliate Link Clicked', { product: product.name, network: product.network, category: product.category, context })
}
