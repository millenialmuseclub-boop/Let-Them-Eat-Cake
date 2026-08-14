// Run with: node --env-file=.env.local scripts/fetch-affiliate-product-images.mjs
// One-time build-time script — the Unsplash key is only ever used here, never shipped to the browser.
// Fills in `imageUrl` on affiliate products that don't already have a real photo (either their
// own imageUrl, or a genuine associatedCakeIds match already rendered via CakeThumbnail).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../src/data/affiliateProducts.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-affiliate-product-images.mjs')
  process.exit(1)
}

// Descriptive search queries -- product-photography style for equipment/ingredients,
// editorial food-photography style for the "Cakes to Order" entries that don't have a
// safe match in our own photographed catalog.
const QUERY_OVERRIDES = {
  product_stand_mixer: 'kitchen mixer baking',
  product_revolving_cake_stand: 'revolving cake decorating turntable',
  product_cake_pan: 'round cake pan baking',
  product_thermapen: 'digital cooking thermometer',
  product_marble_pastry_board: 'marble pastry board rolling pin',
  product_measuring_set: 'measuring cups spoons baking',
  product_zester: 'citrus zester kitchen tool',
  product_digital_scale: 'kitchen digital scale',
  product_scraper: 'bench scraper baking tool',
  product_cake_leveler: 'cake leveler wire tool',
  product_decorating_kit: 'piping tips decorating kit',
  product_offset_spatula: 'baking spatula frosting tool',
  product_vanilla: 'vanilla beans extract',
  product_cake_flour: 'flour baking ingredient',
  product_milk_chocolate: 'milk chocolate bars baking',
  product_earl_grey_tea: 'earl grey tea loose leaf',
  product_fancy_sprinkles: 'colorful sprinkles baking',
  product_gel_colors: 'food coloring gel baking',
  product_espresso_machine: 'espresso machine kitchen',
  product_cocoa_powder: 'cocoa powder baking',
  product_bourbon_vanilla_paste: 'vanilla beans jar',
  product_gold_leaf: 'edible gold leaf dessert',
  product_almond_paste: 'marzipan almonds',
  product_champagne_flutes: 'champagne flutes glasses',
  product_cake_knife_set: 'cake serving knife set',
  product_floral_cake_stand: 'floral cake stand dessert table',
  product_cabbage_cake_stand: 'decorative ceramic cake stand',
  product_glass_cake_stand: 'covered glass cake stand',
  product_heart_bundt_pan: 'heart bundt cake pan',
  product_cake_inas_coconut: 'coconut layer cake',
  product_cake_chocolate: 'chocolate layer cake slice',
  product_cake_jfk_wedding: 'elegant white wedding cake',
  product_cake_seven_layer_caramel: 'caramel layer cake',
  product_cake_confetti: 'confetti funfetti cake',
  product_cake_strawberry_guava_entremet: 'strawberry entremet dessert',
  product_cake_red_velvet: 'red velvet cake slice',
  product_cake_bridgerton_lemon_lavender: 'lemon lavender floral cake',
  product_cake_gateau_basque: 'basque cake dessert',
  product_cake_earls_court_chocolate: 'three layer chocolate cake',
}

const products = JSON.parse(readFileSync(dataPath, 'utf-8'))

function save() {
  writeFileSync(dataPath, JSON.stringify(products, null, 2) + '\n')
}

for (const product of products) {
  if (product.imageUrl) continue
  if (product.associatedCakeIds?.length) continue

  const query = encodeURIComponent(QUERY_OVERRIDES[product.id] ?? product.name)
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=squarish`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!res.ok) {
    console.warn(`Stopping: Unsplash returned ${res.status} for ${product.id}`)
    if (res.status === 403) break
    continue
  }

  const data = await res.json()
  const photo = data.results?.[0]

  if (!photo) {
    console.warn(`No match found for ${product.id}`)
    continue
  }

  product.imageUrl = photo.urls.regular
  console.log(`Fetched image for ${product.id}`)
  save()
}

console.log('Done.')
