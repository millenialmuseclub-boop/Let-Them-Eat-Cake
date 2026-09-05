import { getProductsByIds } from '../lib/affiliateProducts'
import { AffiliateProductSet } from '../components/AffiliateProductSet'
import { getSceneImage } from '../lib/sceneImages'
import '../components/ContextualCuratedKitchen.css'

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

const CAKES_TO_ORDER_IDS = [
  'product_cake_brooklyn_blackout',
  'product_cake_inas_coconut',
  'product_cake_chocolate',
  'product_cake_jfk_wedding',
  'product_cake_carrot',
  'product_cake_seven_layer_caramel',
  'product_cake_confetti',
  'product_cake_strawberry_guava_entremet',
  'product_cake_red_velvet',
  'product_cake_smith_island',
  'product_cake_molten_lava',
  'product_cake_hummingbird',
  'product_cake_bridgerton_lemon_lavender',
  'product_cake_gateau_basque',
  'product_cake_earls_court_chocolate',
]

export function CuratedKitchenPage() {
  const scene = getSceneImage('curated-kitchen')

  return (
    <main className="page curated-kitchen-page">
      {scene && (
        <div className="lab-hero-image">
          <img src={scene.url} alt="A flat-lay of baking tools and kitchen equipment" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / Unsplash
          </span>
        </div>
      )}
      <h1>Curated Kitchen</h1>
      <p>The tools, equipment, and ingredients we reach for again and again — organized by what you're doing.</p>
      <AffiliateProductSet title="Core Baking" products={getProductsByIds(CORE_BAKING_IDS)} />
      <AffiliateProductSet title="Decorating" products={getProductsByIds(DECORATING_IDS)} />
      <AffiliateProductSet title="Ingredients" products={getProductsByIds(INGREDIENT_IDS)} />
      <AffiliateProductSet title="Coffee & Tea" products={getProductsByIds(COFFEE_TEA_IDS)} />
      <AffiliateProductSet title="Presentation" products={getProductsByIds(PRESENTATION_IDS)} />
      <AffiliateProductSet title="Cakes to Order" products={getProductsByIds(CAKES_TO_ORDER_IDS)} />
    </main>
  )
}
