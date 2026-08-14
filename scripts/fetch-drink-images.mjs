// Run with: node --env-file=.env.local scripts/fetch-drink-images.mjs
// One-time build-time script — the Unsplash key is only ever used here, never shipped to the browser.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const drinksPath = join(__dirname, '../src/data/drinks.json')
const outputPath = join(__dirname, '../src/data/drinkImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-drink-images.mjs')
  process.exit(1)
}

const drinks = JSON.parse(readFileSync(drinksPath, 'utf-8'))
const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}

// Compare via URL slug (not Unsplash's API photo.id) so a generic query can't silently
// reuse a photo another drink already has.
function urlSlug(url) {
  return url.match(/photo-([a-zA-Z0-9_-]+)\?/)?.[1]
}
const usedPhotoIds = new Set(Object.values(existing).map((img) => urlSlug(img.url)))

let fetched = 0
let skipped = 0

for (const drink of drinks) {
  if (existing[drink.id]) {
    skipped++
    continue
  }

  const query = encodeURIComponent(`${drink.name} drink`)
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=10&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (res.status === 403) {
    console.log(`Rate limit reached after ${fetched} new images. Stopping — re-run this script later to continue.`)
    break
  }

  if (!res.ok) {
    console.warn(`Skipping ${drink.name}: Unsplash returned ${res.status}`)
    continue
  }

  const data = await res.json()
  const photo = (data.results ?? []).find((p) => !usedPhotoIds.has(urlSlug(p.urls.regular)))

  if (!photo) {
    console.warn(`No unused match found for ${drink.name}`)
    continue
  }

  existing[drink.id] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  }
  usedPhotoIds.add(urlSlug(photo.urls.regular))
  fetched++
  console.log(`Fetched image for ${drink.name}`)

  // Save incrementally so progress is never lost if the script stops partway.
  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

console.log(`Done. ${fetched} new images fetched, ${skipped} already had one, ${drinks.length - fetched - skipped} still remain.`)
