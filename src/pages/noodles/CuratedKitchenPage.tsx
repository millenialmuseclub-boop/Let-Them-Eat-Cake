import { ContextualCuratedKitchen } from '../../components/ContextualCuratedKitchen'
import { AffiliateDisclosure } from '../../components/AffiliateDisclosure'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { products } from '../../lib/products'
import { getImageFor } from '../../data/noodles/images'
import '../../components/ContextualCuratedKitchen.css'

// Rewritten to use the shared canonical ContextualCuratedKitchen (Ramen's richest variant) and
// the aggregated cross-world catalog (lib/products.ts), instead of Noodles' own bespoke
// category-grid implementation reading its own local data/products.json directly -- this keeps
// Curated Kitchen's rendering identical across all three ported worlds (see Ramen's and Cookies'
// CuratedKitchenPage.tsx).
export function CuratedKitchenPage() {
  useDocumentTitle('Curated Kitchen | Noodles')
  const categories = Array.from(new Set(products.filter((p) => p.apps.includes('noodles')).map((p) => p.category)))
  const heroImage = getImageFor('pho-bo')

  return (
    <main className="page">
      {heroImage && (
        <div className="lab-hero-image">
          <img src={heroImage.src} alt={heroImage.alt} loading="lazy" />
          <span className="lab-hero-credit">
            {heroImage.credit.creator} / Wikimedia Commons
          </span>
        </div>
      )}
      <h1>Curated Kitchen</h1>
      <p>Bowls, hand-noodle tools, and pantry staples that translate directly to noodle cooking.</p>
      {categories.map((category) => (
        <ContextualCuratedKitchen key={category} category={category} title={category} />
      ))}
      <AffiliateDisclosure />
    </main>
  )
}
