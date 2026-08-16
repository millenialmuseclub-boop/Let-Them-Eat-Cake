// One-off: replaces ingredient photos confirmed (by visual inspection) to be wrong or
// too ambiguous -- e.g. milk poured into iced coffee, an empty decorative glass vase for oil,
// cookies for salt, a protein-supplement tub for cocoa powder, a barista latte scene for warm milk.
// Run with: node --env-file=.env.local scripts/fix-ingredient-images.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputPath = join(__dirname, '../src/data/ingredientImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fix-ingredient-images.mjs')
  process.exit(1)
}

const TARGETS = {
  milk: ['glass of milk white', 'milk jug pouring', 'fresh milk glass'],
  'vanilla-extract': ['vanilla bean pods', 'vanilla extract bottle close up', 'vanilla pod baking'],
  'vegetable-oil': ['cooking oil bottle kitchen', 'olive oil bottle pouring', 'oil bottle baking ingredient'],
  salt: ['sea salt flakes bowl', 'salt crystals close up', 'kosher salt bowl'],
  'egg-whites': ['egg white separated bowl', 'whisking egg whites bowl', 'egg white foam bowl'],
  'brown-sugar': ['brown sugar bowl close up', 'brown sugar scoop baking', 'light brown sugar'],
  'cocoa-powder': ['cocoa powder bowl baking', 'dark cocoa powder scoop', 'chocolate powder bowl'],
  'bread-flour': ['flour bag kitchen counter', 'white flour bowl scoop', 'flour sack baking'],
  'active-dry-yeast': ['dry yeast jar baking', 'yeast packet baking ingredient', 'instant yeast granules'],
  'warm-milk': ['milk pouring glass jug', 'warm milk saucepan', 'milk being poured'],
  'coconut-milk': ['coconut milk can pouring', 'coconut milk bowl baking', 'canned coconut milk'],
}

const existing = JSON.parse(readFileSync(outputPath, 'utf-8'))

function urlSlug(url) {
  return url.match(/photo-([a-zA-Z0-9_-]+)\?/)?.[1]
}
const usedPhotoIds = new Set(Object.values(existing).map((img) => urlSlug(img.url)))
// Free up the slots we're about to replace so a target can't be excluded by its own old photo.
for (const slug of Object.keys(TARGETS)) {
  const old = existing[slug]
  if (old) usedPhotoIds.delete(urlSlug(old.url))
}

function save() {
  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

async function search(query) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=squarish`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })
  if (!res.ok) return { status: res.status, results: [] }
  const data = await res.json()
  return { status: res.status, results: data.results ?? [] }
}

for (const [slug, queries] of Object.entries(TARGETS)) {
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
    console.warn(`No replacement found for ${slug} -- removing so it falls back to the branded placeholder.`)
    delete existing[slug]
    save()
    continue
  }

  existing[slug] = {
    url: picked.urls.regular,
    photographer: picked.user.name,
    photographerUrl: picked.user.links.html,
    unsplashUrl: picked.links.html,
  }
  usedPhotoIds.add(urlSlug(picked.urls.regular))
  console.log(`Fixed ${slug}: ${picked.links.html}`)
  save()
}

console.log('Done.')
