import { ContextualCuratedKitchen } from '../../components/ContextualCuratedKitchen'
import { AffiliateDisclosure } from '../../components/AffiliateDisclosure'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import type { ProductCategory } from '../../types/product'
import './CuratedKitchenPage.css'

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  'bowls-tableware': 'Ramen Bowls + Serving',
  'noodle-tools': 'Noodle Tools',
  'broth-essentials': 'Broth Essentials',
  'japanese-pantry': 'Japanese Pantry',
  cookbooks: 'Cookbooks',
}

const CATEGORY_ORDER: ProductCategory[] = ['bowls-tableware', 'noodle-tools', 'broth-essentials', 'japanese-pantry', 'cookbooks']

export function CuratedKitchenPage() {
  useDocumentTitle('Curated Kitchen | Let Them Eat')

  return (
    <main className="page">
      <h1>Curated Kitchen</h1>
      <p>A considered edit of the bowls, tools, and pantry staples worth keeping close -- content leads here, not commerce.</p>

      {CATEGORY_ORDER.map((category) => (
        <ContextualCuratedKitchen key={category} category={category} title={CATEGORY_LABEL[category]} />
      ))}

      <AffiliateDisclosure />
    </main>
  )
}
