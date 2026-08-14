// Run with: node --env-file=.env.local scripts/retry-unmatched-cake-images.mjs
// One-off retry pass for cakes in cakeImages.unmatched.json -- tries a wider
// set of query phrasings than the main fetch-cake-images.mjs script (which
// only tries "<name> cake" then "<name>") before giving up on a cake for good.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cakesPath = join(__dirname, '../src/data/cakes.json')
const outputPath = join(__dirname, '../src/data/cakeImages.json')
const unmatchedPath = join(__dirname, '../src/data/cakeImages.unmatched.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/retry-unmatched-cake-images.mjs')
  process.exit(1)
}

const cakes = JSON.parse(readFileSync(cakesPath, 'utf-8'))
const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}
const unmatchedIds = existsSync(unmatchedPath) ? JSON.parse(readFileSync(unmatchedPath, 'utf-8')) : []

function saveUnmatched(ids) {
  writeFileSync(unmatchedPath, JSON.stringify([...ids].sort(), null, 2) + '\n')
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
const stillUnmatched = new Set(unmatchedIds)

for (const id of unmatchedIds) {
  const cake = cakes.find((c) => c.id === id)
  if (!cake) continue

  // Broader phrasings than the primary script: "dessert" often surfaces food-blog
  // photography that "cake" alone misses, and a flavor-note-qualified query can
  // disambiguate short/generic names.
  const topNote = cake.flavorNotes[0]
  const queries = [`${cake.name} dessert`, `${cake.name} slice`, `${cake.name} ${topNote}`, `${cake.name} recipe`]

  let photo = null
  for (const q of queries) {
    const result = await searchUnsplash(q)
    if (result.rateLimited) {
      console.log(`Rate limit reached after ${fetched} new images. Stopping — re-run this script later to continue.`)
      saveUnmatched(stillUnmatched)
      process.exit(0)
    }
    if (result.photo) {
      photo = result.photo
      break
    }
  }

  if (!photo) {
    console.warn(`Still no match for ${cake.name} after ${queries.length} broader queries`)
    continue
  }

  existing[cake.id] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  }
  stillUnmatched.delete(id)
  fetched++
  console.log(`Fetched image for ${cake.name}`)

  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
  saveUnmatched(stillUnmatched)
}

console.log(`Done. ${fetched} new images fetched, ${stillUnmatched.size} still unmatched.`)
