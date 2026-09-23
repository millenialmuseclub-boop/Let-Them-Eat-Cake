// Run with: node --env-file=.env.local scripts/fetch-missing-ramen-images.mjs
// One-off fill for the 12 regional ramen styles in ramen.json with no entry in
// ramenImages.json yet. Existing ramenImages.json entries are Pexels; these are
// Unsplash (RamenHeroImage/displayImageUrl already handle a mixed `source` field).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, '../src/data/ramen/ramenImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-missing-ramen-images.mjs')
  process.exit(1)
}

const RAMEN = {
  ramen_hakodate_shio: 'shio ramen clear broth',
  ramen_kitakata: 'shoyu ramen noodles',
  ramen_asahikawa: 'ramen bowl pork broth',
  ramen_onomichi: 'shoyu ramen bowl',
  ramen_wakayama: 'tonkotsu shoyu ramen',
  ramen_toyama_black: 'black shoyu ramen dark broth',
  ramen_niigata_shoyu: 'shoyu ramen bowl chicken',
  ramen_kagoshima: 'tonkotsu ramen bowl',
  ramen_yonezawa: 'chicken ramen clear broth',
  ramen_muroran_curry: 'curry ramen bowl',
  ramen_sano: 'ramen bowl noodles broth',
  ramen_tokyo_abura_soba: 'abura soba noodles no broth',
}

const existing = JSON.parse(readFileSync(outputPath, 'utf-8'))

function urlSlug(url) {
  return url.match(/photo-([a-zA-Z0-9_-]+)\?/)?.[1]
}
const usedPhotoIds = new Set(Object.values(existing).map((img) => urlSlug(img.url)).filter(Boolean))

function save() {
  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

for (const [id, query] of Object.entries(RAMEN)) {
  if (existing[id]) {
    console.log(`Skipping ${id}, already have an image.`)
    continue
  }

  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!res.ok) {
    console.warn(`Skipping ${id}: Unsplash returned ${res.status}`)
    if (res.status === 403) break
    continue
  }

  const data = await res.json()
  const photo = (data.results ?? []).find((p) => !usedPhotoIds.has(urlSlug(p.urls.regular)))

  if (!photo) {
    console.warn(`No unused match found for ${id}`)
    continue
  }

  existing[id] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    source: 'Unsplash',
    sourceUrl: photo.links.html,
  }
  usedPhotoIds.add(urlSlug(photo.urls.regular))
  console.log(`Fetched image for ${id}`)
  save()
}

console.log('Done.')
