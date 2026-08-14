import type { AffiliateProduct } from '../types/affiliateProduct'
import { trackAffiliateClicked } from '../lib/analytics'
import { getCakeImage } from '../lib/images'
import './AffiliateProductCard.css'

const NETWORK_LABELS: Record<AffiliateProduct['network'], string> = {
  shopmy: 'ShopMy',
  ltk: 'LTK',
}

export function AffiliateProductCard({ product, context }: { product: AffiliateProduct; context?: string }) {
  // A "Cakes to Order" product with a genuine, verified match in our own cake catalog
  // gets that real photo; otherwise fall back to the product's own sourced image, and
  // only fall back further to the branded placeholder -- never a text-only card.
  const associatedCakeImage = product.associatedCakeIds?.[0] ? getCakeImage(product.associatedCakeIds[0]) : undefined
  const imageUrl = associatedCakeImage?.url ?? product.imageUrl

  return (
    <div className="card affiliate-product-card">
      {imageUrl ? (
        <img src={imageUrl} alt={product.name} className="affiliate-product-image" loading="lazy" />
      ) : (
        <div className="affiliate-product-image affiliate-product-image-placeholder">
          <img src="/icon-master.svg" alt="" />
        </div>
      )}
      <h4 className="affiliate-product-name">{product.name}</h4>
      {product.editorialNote && <p className="affiliate-product-note">{product.editorialNote}</p>}
      <a
        href={product.url}
        target="_blank"
        rel="noreferrer sponsored"
        className="affiliate-product-link"
        onClick={() => trackAffiliateClicked(product, context ?? 'unknown')}
      >
        View Recommendation →
      </a>
      <span className="affiliate-product-network">via {NETWORK_LABELS[product.network]}</span>
    </div>
  )
}
