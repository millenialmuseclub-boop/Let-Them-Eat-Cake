import { useRef } from 'react'
import type { AffiliateProduct } from '../types/affiliateProduct'
import { AffiliateProductCard } from './AffiliateProductCard'
import { AffiliateDisclosure } from './AffiliateDisclosure'
import { trackAffiliateViewed } from '../lib/analytics'
import './CuratorsToolDrawer.css'

const DRAWER_CONTEXT = "Curator's Tool Drawer"

export function CuratorsToolDrawer({ products, note }: { products: AffiliateProduct[]; note?: string }) {
  const hasTrackedOpen = useRef(false)

  if (products.length === 0) return null

  function handleToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    if (e.currentTarget.open && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true
      products.forEach((product) => trackAffiliateViewed(product, DRAWER_CONTEXT))
    }
  }

  return (
    <details className="curators-tool-drawer" onToggle={handleToggle}>
      <summary>🧰 Curator's Tool Drawer</summary>
      <div className="curators-tool-drawer-content">
        {note && <p className="curators-tool-drawer-note">{note}</p>}
        <div className="affiliate-product-grid">
          {products.map((product) => (
            <AffiliateProductCard key={product.id} product={product} context={DRAWER_CONTEXT} />
          ))}
        </div>
        <AffiliateDisclosure />
      </div>
    </details>
  )
}
