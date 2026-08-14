// Run with: node --env-file=.env.local scripts/fetch-cake-images.mjs
// One-time build-time script — the Unsplash key is only ever used here, never shipped to the browser.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cakesPath = join(__dirname, '../src/data/cakes.json')
const outputPath = join(__dirname, '../src/data/cakeImages.json')
// Cake ids that returned zero Unsplash results on every query tried, so future
// runs don't keep re-spending scarce rate-limited requests on known dead ends
// before ever reaching cakes that haven't been attempted yet.
const unmatchedPath = join(__dirname, '../src/data/cakeImages.unmatched.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-cake-images.mjs')
  process.exit(1)
}

const cakes = JSON.parse(readFileSync(cakesPath, 'utf-8'))
const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}
const unmatched = new Set(existsSync(unmatchedPath) ? JSON.parse(readFileSync(unmatchedPath, 'utf-8')) : [])

function saveUnmatched() {
  writeFileSync(unmatchedPath, JSON.stringify([...unmatched].sort(), null, 2) + '\n')
}

async function searchUnsplash(query) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })
  if (res.status === 403) return { rateLimited: true }
  if (!res.ok) return { photo: null, error: res.status }
  const data = await res.json()
  return { photo: data.results?.[0] ?? null }
}

let fetched = 0
let skipped = 0
let stillUnmatched = 0

for (const cake of cakes) {
  if (existing[cake.id]) {
    skipped++
    continue
  }
  if (unmatched.has(cake.id)) {
    stillUnmatched++
    continue
  }

  // Primary query, then a bare-name fallback (no "cake" suffix) for names that
  // already contain a descriptive word ("Torte", "Bar", "Pie"...) where
  // appending "cake" can dilute the search instead of helping it.
  let { photo, rateLimited } = await searchUnsplash(`${cake.name} cake`)
  if (rateLimited) {
    console.log(`Rate limit reached after ${fetched} new images. Stopping — re-run this script later to continue.`)
    break
  }

  if (!photo) {
    const fallback = await searchUnsplash(cake.name)
    if (fallback.rateLimited) {
      console.log(`Rate limit reached after ${fetched} new images. Stopping — re-run this script later to continue.`)
      break
    }
    photo = fallback.photo
  }

  if (!photo) {
    console.warn(`No match found for ${cake.name} (tried both queries) — added to skip list`)
    unmatched.add(cake.id)
    saveUnmatched()
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

console.log(
  `Done. ${fetched} new images fetched, ${skipped} already had one, ${stillUnmatched} previously confirmed unmatched (skipped), ${cakes.length - fetched - skipped - stillUnmatched} untried remain.`,
)
