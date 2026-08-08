import type { AffiliateProduct } from '../types/affiliateProduct'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

function track(event: string, props: Record<string, string>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props })
  }
}

export function trackAffiliateViewed(product: AffiliateProduct, context: string): void {
  track('Affiliate Recommendation Viewed', { product: product.name, network: product.network, category: product.category, context })
}

export function trackAffiliateClicked(product: AffiliateProduct, context: string): void {
  track('Affiliate Link Clicked', { product: product.name, network: product.network, category: product.category, context })
}
