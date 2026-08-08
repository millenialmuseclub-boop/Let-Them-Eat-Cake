import { getProductsByIds } from '../lib/affiliateProducts'
import { AffiliateProductSet } from '../components/AffiliateProductSet'

const CORE_BAKING_IDS = [
  'product_stand_mixer',
  'product_cake_pan',
  'product_thermapen',
  'product_marble_pastry_board',
  'product_measuring_set',
  'product_zester',
  'product_digital_scale',
  'product_cake_leveler',
]

const DECORATING_IDS = ['product_revolving_cake_stand', 'product_scraper', 'product_decorating_kit', 'product_offset_spatula', 'product_fancy_sprinkles', 'product_gel_colors']

const INGREDIENT_IDS = ['product_vanilla', 'product_cake_flour', 'product_milk_chocolate']

const COFFEE_TEA_IDS = ['product_earl_grey_tea', 'product_espresso_machine']

export function CuratedKitchenPage() {
  return (
    <main className="page curated-kitchen-page">
      <h1>Curated Kitchen</h1>
      <p>The tools, equipment, and ingredients we reach for again and again — organized by what you're doing.</p>
      <AffiliateProductSet title="Core Baking" products={getProductsByIds(CORE_BAKING_IDS)} />
      <AffiliateProductSet title="Decorating" products={getProductsByIds(DECORATING_IDS)} />
      <AffiliateProductSet title="Ingredients" products={getProductsByIds(INGREDIENT_IDS)} />
      <AffiliateProductSet title="Coffee & Tea" products={getProductsByIds(COFFEE_TEA_IDS)} />
    </main>
  )
}
