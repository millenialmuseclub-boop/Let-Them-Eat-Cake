import type { AffiliateProduct } from '../types/affiliateProduct'
import './AffiliateProductCard.css'

const NETWORK_LABELS: Record<AffiliateProduct['network'], string> = {
  shopmy: 'ShopMy',
  ltk: 'LTK',
}

export function AffiliateProductCard({ product }: { product: AffiliateProduct }) {
  return (
    <div className="card affiliate-product-card">
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="affiliate-product-image" />}
      <h4 className="affiliate-product-name">{product.name}</h4>
      {product.editorialNote && <p className="affiliate-product-note">{product.editorialNote}</p>}
      <a href={product.url} target="_blank" rel="noreferrer sponsored" className="affiliate-product-link">
        View Recommendation →
      </a>
      <span className="affiliate-product-network">via {NETWORK_LABELS[product.network]}</span>
    </div>
  )
}
