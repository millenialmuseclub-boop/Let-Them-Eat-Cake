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
