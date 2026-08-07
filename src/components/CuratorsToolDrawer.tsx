import type { AffiliateProduct } from '../types/affiliateProduct'
import { AffiliateProductCard } from './AffiliateProductCard'
import { AffiliateDisclosure } from './AffiliateDisclosure'
import './CuratorsToolDrawer.css'

export function CuratorsToolDrawer({ products, note }: { products: AffiliateProduct[]; note?: string }) {
  if (products.length === 0) return null

  return (
    <details className="curators-tool-drawer">
      <summary>🧰 Curator's Tool Drawer</summary>
      <div className="curators-tool-drawer-content">
        {note && <p className="curators-tool-drawer-note">{note}</p>}
        <div className="affiliate-product-grid">
          {products.map((product) => (
            <AffiliateProductCard key={product.id} product={product} />
          ))}
        </div>
        <AffiliateDisclosure />
      </div>
    </details>
  )
}
