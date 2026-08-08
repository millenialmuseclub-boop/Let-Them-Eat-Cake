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

const INGREDIENT_IDS = [
  'product_vanilla',
  'product_cake_flour',
  'product_milk_chocolate',
  'product_cocoa_powder',
  'product_bourbon_vanilla_paste',
  'product_chestnut_paste',
  'product_almond_paste',
  'product_passion_fruit_flavoring',
  'product_gold_leaf',
]

const COFFEE_TEA_IDS = ['product_earl_grey_tea', 'product_espresso_machine']

const PRESENTATION_IDS = ['product_cake_knife_set', 'product_floral_cake_stand', 'product_cabbage_cake_stand', 'product_glass_cake_stand', 'product_heart_bundt_pan']

export function CuratedKitchenPage() {
  return (
    <main className="page curated-kitchen-page">
      <h1>Curated Kitchen</h1>
      <p>The tools, equipment, and ingredients we reach for again and again — organized by what you're doing.</p>
      <AffiliateProductSet title="Core Baking" products={getProductsByIds(CORE_BAKING_IDS)} />
      <AffiliateProductSet title="Decorating" products={getProductsByIds(DECORATING_IDS)} />
      <AffiliateProductSet title="Ingredients" products={getProductsByIds(INGREDIENT_IDS)} />
      <AffiliateProductSet title="Coffee & Tea" products={getProductsByIds(COFFEE_TEA_IDS)} />
      <AffiliateProductSet title="Presentation" products={getProductsByIds(PRESENTATION_IDS)} />
    </main>
  )
}
