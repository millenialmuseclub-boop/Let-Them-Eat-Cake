import { useEffect } from 'react'
import type { AffiliateProduct } from '../types/affiliateProduct'
import { AffiliateProductCard } from './AffiliateProductCard'
import { AffiliateDisclosure } from './AffiliateDisclosure'
import { trackAffiliateViewed } from '../lib/analytics'
import './AffiliateProductSet.css'

export function AffiliateProductSet({ title, products }: { title: string; products: AffiliateProduct[] }) {
  const visibleProducts = products.slice(0, 5)

  useEffect(() => {
    visibleProducts.forEach((product) => trackAffiliateViewed(product, title))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, title])

  if (products.length === 0) return null

  return (
    <section className="affiliate-product-set">
      <h2 className="affiliate-product-set-heading">{title}</h2>
      <div className="affiliate-product-grid">
        {visibleProducts.map((product) => (
          <AffiliateProductCard key={product.id} product={product} context={title} />
        ))}
      </div>
      <AffiliateDisclosure />
    </section>
  )
}
