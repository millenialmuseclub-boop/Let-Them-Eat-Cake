// One-off: re-fetches a genuinely different photo for cakes that ended up sharing an
// identical Unsplash photo with another cake (fetch-cake-images.mjs used per_page=1 with
// no dedup against already-used photos, so generic queries sometimes collided).
// Run with: node --env-file=.env.local scripts/fix-duplicate-cake-images.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cakesPath = join(__dirname, '../src/data/cakes.json')
const outputPath = join(__dirname, '../src/data/cakeImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fix-duplicate-cake-images.mjs')
  process.exit(1)
}

// One cake per duplicate group keeps its current photo; these are the rest, which need a
// distinct replacement.
const NEEDS_REFETCH = [
  'cake_smith_island',
  'cake_chocoflan',
  'cake_baumkuchen',
  'cake_bolo_de_rolo',
  'cake_kladdkaka',
  'cake_kransekake',
  'cake_prinsesstarta',
  'cake_zuger_kirschtorte',
  'cake_torta_de_guayaba',
  'cake_bolo_de_fuba',
  'cake_bolo_de_arroz',
  'cake_election_cake',
  'cake_brigadeiro_cake',
  'cake_cozonac',
  'cake_genoa_cake',
  'cake_emergency_yogurt_pot_cake',
  'cake_angel_food',
  'cake_torta_mil_hojas',
]

const cakes = JSON.parse(readFileSync(cakesPath, 'utf-8'))
const cakeImages = JSON.parse(readFileSync(outputPath, 'utf-8'))

function urlSlug(url) {
  return url.match(/photo-([a-zA-Z0-9_-]+)\?/)?.[1]
}
const usedPhotoIds = new Set(Object.values(cakeImages).map((img) => urlSlug(img.url)))

function save() {
  writeFileSync(outputPath, JSON.stringify(cakeImages, null, 2) + '\n')
}

async function search(query) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })
  if (!res.ok) return { status: res.status, results: [] }
  const data = await res.json()
  return { status: res.status, results: data.results ?? [] }
}

for (const cakeId of NEEDS_REFETCH) {
  const cake = cakes.find((c) => c.id === cakeId)
  if (!cake) {
    console.warn(`Unknown cake id ${cakeId}, skipping.`)
    continue
  }

  let picked = null
  for (const query of [`${cake.name} cake`, cake.name, `${cake.name} dessert`]) {
    const { status, results } = await search(query)
    if (status === 403) {
      console.log('Rate limit reached — stopping. Re-run later to continue.')
      process.exit(0)
    }
    picked = results.find((p) => !usedPhotoIds.has(urlSlug(p.urls.regular)))
    if (picked) break
  }

  if (!picked) {
    console.warn(`No unused replacement found for ${cakeId} (${cake.name}) -- leaving existing photo in place.`)
    continue
  }

  cakeImages[cakeId] = {
    url: picked.urls.regular,
    photographer: picked.user.name,
    photographerUrl: picked.user.links.html,
    unsplashUrl: picked.links.html,
  }
  usedPhotoIds.add(urlSlug(picked.urls.regular))
  console.log(`Fixed ${cakeId} (${cake.name})`)
  save()
}

console.log('Done.')
