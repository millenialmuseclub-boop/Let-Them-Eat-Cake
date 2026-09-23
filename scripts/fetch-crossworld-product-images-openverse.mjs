// Run with: node scripts/fetch-crossworld-product-images-openverse.mjs <queries.json> [results.json]
// Fills imageUrl/photographer/imageSource on the Ramen/Cookies/Noodles cross-world product
// catalogs using Openverse (openverse.org) -- a CC-licensed media search aggregator (Flickr,
// museums, etc.), no API key, no meaningful rate limit (200/day anon, 20/min burst). Used instead
// of Unsplash (shared key rate-limited by other work on this repo) and as a second source after
// Wikimedia Commons (an encyclopedia media repo, weak for everyday consumer-product photography --
// Openverse's Flickr coverage is much stronger there).
//
// license_type=commercial excludes NC-licensed results, since this app carries affiliate links.
// Every accepted candidate here is still meant to go through a visual review pass before being
// kept (see the accept/reject workflow used for the Commons batches) -- this script only narrows
// candidates and writes what's given to it, it does not guarantee visual correctness.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILES = ['ramen', 'cookies', 'noodles'].map((world) => join(__dirname, `../src/data/${world}/products.json`))
const QUERIES = JSON.parse(readFileSync(process.argv[2], 'utf-8'))
const RESULTS_PATH = process.argv[3]

async function searchOpenverse(query) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=commercial&page_size=8`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.results ?? []
}

const usedUrls = new Set()
for (const file of FILES) {
  const items = JSON.parse(readFileSync(file, 'utf-8'))
  for (const p of items) if (p.imageUrl) usedUrls.add(p.imageUrl)
}

const results = { candidates: [] }

for (const [id, query] of Object.entries(QUERIES)) {
  const found = await searchOpenverse(query)
  // Take the top 3 unused candidates per query for visual review, not just the first.
  const picks = found.filter((r) => !usedUrls.has(r.url) && r.url && !/\.svg$/i.test(r.url)).slice(0, 3)
  for (const r of picks) {
    results.candidates.push({
      id,
      query,
      title: r.title,
      creator: r.creator,
      license: r.license,
      url: r.url,
      thumbnail: r.thumbnail,
      foreign_landing_url: r.foreign_landing_url,
    })
  }
  console.log(`${id}: ${picks.length} candidate(s) for "${query}"`)
}

if (RESULTS_PATH) writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2))
console.log(`Done. ${results.candidates.length} total candidates for review.`)
