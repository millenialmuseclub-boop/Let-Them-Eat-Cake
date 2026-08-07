// Run with: node --env-file=.env.local scripts/fetch-cake-images.mjs
// One-time build-time script — the Unsplash key is only ever used here, never shipped to the browser.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cakesPath = join(__dirname, '../src/data/cakes.json')
const outputPath = join(__dirname, '../src/data/cakeImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-cake-images.mjs')
  process.exit(1)
}

const cakes = JSON.parse(readFileSync(cakesPath, 'utf-8'))
const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}

let fetched = 0
let skipped = 0

for (const cake of cakes) {
  if (existing[cake.id]) {
    skipped++
    continue
  }

  const query = encodeURIComponent(`${cake.name} cake`)
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (res.status === 403) {
    console.log(`Rate limit reached after ${fetched} new images. Stopping — re-run this script later to continue.`)
    break
  }

  if (!res.ok) {
    console.warn(`Skipping ${cake.name}: Unsplash returned ${res.status}`)
    continue
  }

  const data = await res.json()
  const photo = data.results?.[0]

  if (!photo) {
    console.warn(`No match found for ${cake.name}`)
    continue
  }

  existing[cake.id] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  }
  fetched++
  console.log(`Fetched image for ${cake.name}`)

  // Save incrementally so progress is never lost if the script stops partway.
  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

console.log(`Done. ${fetched} new images fetched, ${skipped} already had one, ${cakes.length - fetched - skipped} still remain.`)
