// Run with: node --env-file=.env.local scripts/fetch-ingredient-images.mjs
// One-time build-time script — the Unsplash key is only ever used here, never shipped to the browser.
// Covers the most-used ingredients across the recipe catalog (by how many cakes reference them);
// the long tail of rarely-used ingredients keeps the branded placeholder rather than a forced,
// possibly-generic photo.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, '../src/data/ingredientImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-ingredient-images.mjs')
  process.exit(1)
}

// Descriptive, ingredient-specific queries -- not a generic "cake" query, which is exactly the
// "repeated generic cake imagery" problem this fixes.
const INGREDIENTS = {
  'granulated-sugar': 'white sugar granules close up',
  'all-purpose-flour': 'flour scoop baking',
  butter: 'butter block baking',
  eggs: 'eggs baking ingredient',
  'baking-powder': 'baking powder spoon ingredient',
  milk: 'milk pouring glass',
  'vanilla-extract': 'vanilla bean extract bottle',
  'vegetable-oil': 'cooking oil bottle baking',
  salt: 'salt pinch baking',
  'egg-whites': 'egg whites bowl whisk',
  'brown-sugar': 'brown sugar close up',
  'mixed-dried-fruit': 'dried fruit mix baking',
  'cocoa-powder': 'cocoa powder scoop',
  'egg-yolks': 'egg yolks bowl',
  'bread-flour': 'flour bag baking',
  'mixed-spice': 'baking spices cinnamon nutmeg',
  'baking-soda': 'baking soda spoon',
  egg: 'egg baking ingredient',
  'active-dry-yeast': 'yeast baking ingredient',
  'warm-milk': 'warm milk pouring',
  'coconut-milk': 'coconut milk can baking',
  'lemon-zest': 'lemon zest grater',
  'almond-flour': 'almond flour bowl',
  'ground-cardamom': 'cardamom pods spice',
  'shredded-coconut': 'shredded coconut bowl baking',
  'rice-flour': 'rice flour bowl',
  'dark-rum': 'dark rum bottle baking',
  cinnamon: 'cinnamon sticks spice',
  'ground-cinnamon': 'ground cinnamon spice',
  'dark-chocolate': 'dark chocolate baking',
  buttermilk: 'buttermilk pouring glass',
  'almond-extract': 'almond extract bottle',
  honey: 'honey jar baking',
  'pandan-extract': 'pandan leaves green',
  'fine-semolina': 'semolina flour bowl',
  cornstarch: 'cornstarch bowl baking',
  raisins: 'raisins bowl baking',
}

const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}

function urlSlug(url) {
  return url.match(/photo-([a-zA-Z0-9_-]+)\?/)?.[1]
}
const usedPhotoIds = new Set(Object.values(existing).map((img) => urlSlug(img.url)))

function save() {
  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

for (const [slug, query] of Object.entries(INGREDIENTS)) {
  if (existing[slug]) {
    console.log(`Skipping ${slug}, already have an image.`)
    continue
  }

  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=squarish`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!res.ok) {
    console.warn(`Skipping ${slug}: Unsplash returned ${res.status}`)
    if (res.status === 403) break
    continue
  }

  const data = await res.json()
  const photo = (data.results ?? []).find((p) => !usedPhotoIds.has(urlSlug(p.urls.regular)))

  if (!photo) {
    console.warn(`No unused match found for ${slug}`)
    continue
  }

  existing[slug] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  }
  usedPhotoIds.add(urlSlug(photo.urls.regular))
  console.log(`Fetched image for ${slug}`)
  save()
}

console.log('Done.')
