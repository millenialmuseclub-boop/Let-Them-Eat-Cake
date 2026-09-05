import { useState } from 'react'
import { products } from '../lib/products'
import curatedKitchenScenes from '../data/curatedKitchenScenes.json'
import type { AffiliateNetwork, AffiliateProduct, ProductCategory } from '../types/product'
import './ContextualCuratedKitchen.css'

// Canonical Curated Kitchen renderer for the whole merged app -- ported (structure preserved
// faithfully) from Ramen's src/components/ContextualCuratedKitchen.tsx, the richest of the three
// sibling apps' variants (category hero images + pagination + context-filtered Lab slices), per
// the master decision that Ramen's version becomes canonical rather than Cookies'/Noodles'
// simplified ones. Reads from the aggregated cross-world catalog (lib/products.ts) instead of a
// single app's own product list, and category hero photography is optional (falls back to no
// hero image rather than requiring photography that may not exist yet for every category).

const NETWORK_LABEL: Record<AffiliateNetwork, string> = { shopmy: 'via ShopMy', ltk: 'via LTK', pending: '' }

const PREVIEW_COUNT = 6

type CuratedKitchenScene = { url: string; photographer?: string; source?: string; photographerUrl?: string }
const SCENES = curatedKitchenScenes as Record<string, CuratedKitchenScene>

function activeOffers(product: AffiliateProduct) {
  return product.offers.filter((o) => o.status === 'active' && o.url)
}

type ContextualCuratedKitchenProps = { title: string } & (
  | { context: string; category?: never }
  | { category: ProductCategory; context?: never }
)

/** Shared product-card renderer for both the full Curated Kitchen catalog (filtered by
    `category`) and any Workshop Lab's contextual slice of it (filtered by `context`) -- same
    "Editorial Product -> Merchant Offer -> Affiliate Route" data, same card treatment. Content
    determines placement: a Lab only shows products explicitly tagged for it. A `category`
    section additionally gets a section-level header photo when one exists, and caps itself to a
    preview with "View All" so a growing catalog doesn't turn into an endless scroll. */
export function ContextualCuratedKitchen({ context, category, title }: ContextualCuratedKitchenProps) {
  const [expanded, setExpanded] = useState(false)
  const scene = category ? SCENES[`curated-kitchen-${category}`] : undefined

  const items = products
    .filter((p) => (context ? p.contexts?.includes(context) : p.category === category))
    .sort((a, b) => (activeOffers(a).length > 0 ? -1 : 1) - (activeOffers(b).length > 0 ? -1 : 1))

  if (items.length === 0) return null

  const visible = category && !expanded ? items.slice(0, PREVIEW_COUNT) : items

  return (
    <section className="curated-kitchen-section">
      {scene && (
        <div className="lab-hero-image curated-kitchen-category-hero">
          <img src={scene.url} alt={`Editorial photography representing the ${title} category`} loading="lazy" />
          {scene.photographer && (
            <span className="lab-hero-credit">
              {scene.photographer}
              {scene.source ? ` / ${scene.source}` : ''}
            </span>
          )}
        </div>
      )}
      <h2>{title}</h2>
      <div className="curated-kitchen-grid">
        {visible.map((product) => {
          const live = activeOffers(product)
          return (
            <div
              key={product.id}
              className={live.length > 0 ? 'card curated-kitchen-card curated-kitchen-card-active' : 'card curated-kitchen-card'}
            >
              <div className="curated-kitchen-product-image">
                <img src="/icon-master.svg" alt="" loading="lazy" />
              </div>
              {product.editorialNote && <span className="tag curated-kitchen-editorial-tag">{product.editorialNote}</span>}
              <h3>{product.name}</h3>
              {product.brand && <p className="curated-kitchen-brand">{product.brand}</p>}
              <p>{product.description}</p>
              {live.length > 0 ? (
                <div className="curated-kitchen-offers">
                  {live.map((offer) => (
                    <div key={offer.id} className="curated-kitchen-active-footer">
                      <a href={offer.url} target="_blank" rel="sponsored noreferrer" className="btn">
                        {offer.cta ?? 'Shop →'}
                      </a>
                      <span className="curated-kitchen-network-label">{NETWORK_LABEL[offer.network]}</span>
                    </div>
                  ))}
                </div>
              ) : product.offers.some((o) => o.status === 'needs-verification') ? (
                <span className="tag curated-kitchen-needs-verification-tag">Needs Verification</span>
              ) : (
                <span className="tag curated-kitchen-pending-tag">Coming Soon</span>
              )}
            </div>
          )
        })}
      </div>
      {category && !expanded && items.length > PREVIEW_COUNT && (
        <button className="btn btn-secondary encyclopedia-view-all" onClick={() => setExpanded(true)}>
          View All {items.length} in {title} →
        </button>
      )}
    </section>
  )
}
