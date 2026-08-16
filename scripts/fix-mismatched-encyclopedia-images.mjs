// One-off: replaces cake photos confirmed (by visual inspection) to be genuinely wrong --
// pizza, city signs, unrelated people, neon signs, or a different dessert entirely.
// Run with: node --env-file=.env.local scripts/fix-mismatched-encyclopedia-images.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, '../src/data/cakeImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fix-mismatched-encyclopedia-images.mjs')
  process.exit(1)
}

// Multiple query attempts per cake, most-specific first.
const TARGETS = {
  cake_karydopita: ['karidopita greek walnut cake', 'greek walnut cake syrup', 'walnut spice cake slice'],
  cake_galaktoboureko: ['galaktoboureko greek custard pastry', 'phyllo custard pastry dessert', 'greek custard pie'],
  cake_brooklyn_blackout: ['chocolate blackout cake slice', 'dark chocolate pudding cake', 'chocolate layer cake dessert'],
  cake_gooey_butter_cake: ['gooey butter cake bars', 'butter cake dessert bars', 'st louis butter cake slice'],
  cake_boston_cream_pie: ['boston cream pie cake', 'cream filled chocolate glazed cake', 'custard cream cake slice'],
  cake_smith_island: ['smith island cake maryland', 'thin layer chocolate cake', 'many layer chocolate cake slice'],
  cake_angel_food: ['angel food cake plain', 'white sponge cake tube pan', 'angel food cake slice'],
  cake_lane_cake: ['southern lane cake', 'coconut pecan layer cake', 'bourbon coconut cake slice'],
}

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

for (const [cakeId, queries] of Object.entries(TARGETS)) {
  let picked = null
  for (const query of queries) {
    const { status, results } = await search(query)
    if (status === 403) {
      console.log('Rate limit reached — stopping. Re-run later to continue.')
      process.exit(0)
    }
    picked = results.find((p) => !usedPhotoIds.has(urlSlug(p.urls.regular)))
    if (picked) break
  }

  if (!picked) {
    console.warn(`No replacement found for ${cakeId} -- leaving existing (flagged) photo in place.`)
    continue
  }

  cakeImages[cakeId] = {
    url: picked.urls.regular,
    photographer: picked.user.name,
    photographerUrl: picked.user.links.html,
    unsplashUrl: picked.links.html,
  }
  usedPhotoIds.add(urlSlug(picked.urls.regular))
  console.log(`Fixed ${cakeId}`)
  save()
}

console.log('Done.')
