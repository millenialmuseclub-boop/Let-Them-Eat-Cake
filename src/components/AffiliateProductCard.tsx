import { EditorialImage } from './EditorialImage'
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
  const onSale = product.salePrice != null && product.price != null && product.salePrice < product.price

  return (
    <div className="card affiliate-product-card">
      <div className="affiliate-product-image-wrap">
        <EditorialImage src={imageUrl} alt={product.name} className="affiliate-product-image" loading="lazy" />
        {onSale && <span className="affiliate-product-sale-badge">Sale</span>}
      </div>
      <div className="affiliate-product-body">
        {product.retailer && <span className="affiliate-product-retailer">{product.retailer}</span>}
        <h4 className="affiliate-product-name">{product.name}</h4>
        {product.editorialNote && <p className="affiliate-product-note">{product.editorialNote}</p>}
        {product.price != null && (
          <p className="affiliate-product-price">
            {onSale && <span className="affiliate-product-price-original">${product.price.toFixed(2)}</span>}
            <span className={onSale ? 'affiliate-product-price-sale' : undefined}>
              ${(onSale ? product.salePrice! : product.price).toFixed(2)}
            </span>
          </p>
        )}
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer sponsored"
          className="affiliate-product-link"
          onClick={() => trackAffiliateClicked(product, context ?? 'unknown')}
        >
          Shop This →
        </a>
        <span className="affiliate-product-network">via {NETWORK_LABELS[product.network]}</span>
      </div>
    </div>
  )
}
