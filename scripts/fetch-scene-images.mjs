// Run with: node --env-file=.env.local scripts/fetch-scene-images.mjs
// One-time build-time script — the Unsplash key is only ever used here, never shipped to the browser.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, '../src/data/sceneImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-scene-images.mjs')
  process.exit(1)
}

const scenes = [
  { id: 'curated-collections', query: 'pastry dessert table editorial' },
  { id: 'curated-kitchen', query: 'baking tools kitchen flatlay' },
  // Cake Personality quiz -- Mood and Aesthetic steps are lifestyle/vibe
  // concepts, not cake-specific, so they use editorial scene photography
  // instead of a cake photo (Flavor/Texture use real cake photos instead).
  { id: 'mood-breakup-catharsis', query: 'moody solo candlelight evening' },
  { id: 'mood-cozy-sunday', query: 'cozy sunday morning blanket coffee' },
  { id: 'mood-pure-hype', query: 'confetti celebration party energy' },
  { id: 'mood-homesick', query: 'family kitchen table warm nostalgia' },
  { id: 'mood-celebration', query: 'festive celebration table string lights' },
  { id: 'mood-lazy-weekend', query: 'lazy weekend sunlight relaxed morning' },
  { id: 'aesthetic-coquette-vintage', query: 'vintage pastel bow ribbon aesthetic' },
  { id: 'aesthetic-dark-academia', query: 'dark academia moody library aesthetic' },
  { id: 'aesthetic-minimalist-k-style', query: 'minimalist beige aesthetic clean' },
  { id: 'aesthetic-cottagecore', query: 'cottagecore floral rustic aesthetic' },
  { id: 'aesthetic-y2k-maximalist', query: 'y2k colorful maximalist aesthetic' },
  // Wedding Cake Planner -- style step (weddingAesthetics), editorial wedding-cake scenes.
  { id: 'wedding-aesthetic-rustic-botanical', query: 'rustic garden wedding cake botanical' },
  { id: 'wedding-aesthetic-modern-minimalist', query: 'modern minimalist wedding cake' },
  { id: 'wedding-aesthetic-traditional-luxury', query: 'elegant white tiered wedding cake' },
  { id: 'wedding-aesthetic-cultural-heritage', query: 'french croquembouche wedding tower' },
  { id: 'wedding-aesthetic-boho-garden', query: 'boho wildflower wedding decor' },
  { id: 'wedding-aesthetic-glam-art-deco', query: 'art deco gold wedding elegant' },
  { id: 'wedding-aesthetic-whimsical-pastel-piping', query: 'pastel piped wedding cake vintage' },
  { id: 'wedding-aesthetic-coastal-destination', query: 'coastal beach wedding decor' },
]

const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}

for (const scene of scenes) {
  if (existing[scene.id]) {
    console.log(`Skipping ${scene.id}, already have an image.`)
    continue
  }

  const query = encodeURIComponent(scene.query)
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!res.ok) {
    console.warn(`Skipping ${scene.id}: Unsplash returned ${res.status}`)
    continue
  }

  const data = await res.json()
  const photo = data.results?.[0]

  if (!photo) {
    console.warn(`No match found for ${scene.id}`)
    continue
  }

  existing[scene.id] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  }
  console.log(`Fetched image for ${scene.id}`)

  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

console.log('Done.')
