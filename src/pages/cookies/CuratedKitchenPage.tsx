import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { products } from '../../lib/products'
import { AffiliateDisclosure } from '../../components/AffiliateDisclosure'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { ContextualCuratedKitchen } from '../../components/ContextualCuratedKitchen'
import { getCookieImage } from '../../lib/cookies/images'

const CATEGORY_LABELS: Record<string, string> = {
  bakeware: 'Bakeware',
  'mixing-prep': 'Mixing & Prep',
  'cookie-tools': 'Cookie Tools',
  'ingredients-pantry': 'Ingredients & Pantry',
  'chocolate-decorating': 'Chocolate & Decorating',
  'serving-gifting': 'Serving & Gifting',
  storage: 'Storage',
  books: 'Books',
}

// Rewritten to use the shared canonical ContextualCuratedKitchen (Ramen's richest variant) and
// the aggregated cross-world catalog (lib/products.ts) in the canonical offers[] shape, instead
// of Cookies' own bespoke grid reading its old flat active/url product shape directly.
export function CuratedKitchenPage() {
  useDocumentTitle('Curated Kitchen | Cookies')
  const cookiesProducts = products.filter((p) => p.apps.includes('cookies'))
  const categories = Array.from(new Set(cookiesProducts.map((p) => p.category)))

  return (
    <main className="page-container">
      <PageHeroBand
        image={getCookieImage('cookie_scottish_shortbread')}
        eyebrow="Objects for the Cookie Kitchen"
        title="Curated Kitchen"
        description="A short, honest list of tools and ingredients we'd actually keep on our own counter, organized by what you're baking -- not a product database."
      />
      {categories.map((category) => (
        <ContextualCuratedKitchen key={category} category={category} title={CATEGORY_LABELS[category] ?? category} />
      ))}
      <AffiliateDisclosure />
    </main>
  )
}
