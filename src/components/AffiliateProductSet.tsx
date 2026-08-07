import type { AffiliateProduct } from '../types/affiliateProduct'
import { AffiliateProductCard } from './AffiliateProductCard'
import { AffiliateDisclosure } from './AffiliateDisclosure'
import './AffiliateProductSet.css'

export function AffiliateProductSet({ title, products }: { title: string; products: AffiliateProduct[] }) {
  if (products.length === 0) return null

  return (
    <section className="affiliate-product-set">
      <h2 className="affiliate-product-set-heading">{title}</h2>
      <div className="affiliate-product-grid">
        {products.slice(0, 5).map((product) => (
          <AffiliateProductCard key={product.id} product={product} />
        ))}
      </div>
      <AffiliateDisclosure />
    </section>
  )
}
