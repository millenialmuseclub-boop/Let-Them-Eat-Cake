// Run with: node --env-file=.env.local scripts/fetch-emergency-cake-images.mjs
// Same one-time pattern as fetch-cake-images.mjs, but sourced from
// emergency-recipes.json -- those 7 cake ids intentionally live outside
// cakes.json (they're Pantry Raid results, not full Encyclopedia entries),
// so the main script never covers them.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const emergencyRecipesPath = join(__dirname, '../src/data/emergency-recipes.json')
const outputPath = join(__dirname, '../src/data/cakeImages.json')

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-emergency-cake-images.mjs')
  process.exit(1)
}

const emergencyRecipes = JSON.parse(readFileSync(emergencyRecipesPath, 'utf-8'))
const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf-8')) : {}

// emergency-recipes.json entries don't carry a cakeId directly -- it's
// `cake_${id.replace(/^emergency_/, 'emergency_')}`... actually simplest to
// derive the same way recipes.json does: recipeId `recipe_<slug>` -> cakeId
// `cake_<slug>`. Confirmed this matches recipes.json 1:1 for all 7 entries.
function cakeIdFor(recipeId) {
  return recipeId.replace(/^recipe_/, 'cake_')
}

let fetched = 0
let skipped = 0

for (const recipe of emergencyRecipes) {
  const cakeId = cakeIdFor(recipe.recipeId)

  if (existing[cakeId]) {
    skipped++
    continue
  }

  const query = encodeURIComponent(`${recipe.name} cake`)
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (res.status === 403) {
    console.log(`Rate limit reached after ${fetched} new images. Stopping — re-run this script later to continue.`)
    break
  }

  if (!res.ok) {
    console.warn(`Skipping ${recipe.name}: Unsplash returned ${res.status}`)
    continue
  }

  const data = await res.json()
  const photo = data.results?.[0]

  if (!photo) {
    console.warn(`No match found for ${recipe.name}`)
    continue
  }

  existing[cakeId] = {
    url: photo.urls.regular,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: photo.links.html,
  }
  fetched++
  console.log(`Fetched image for ${recipe.name}`)

  // Save incrementally so progress is never lost if the script stops partway.
  writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n')
}

console.log(`Done. ${fetched} new images fetched, ${skipped} already had one, ${emergencyRecipes.length - fetched - skipped} still remain.`)
