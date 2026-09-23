// Run with: node --env-file=.env.local scripts/fetch-crossworld-product-images.mjs
// Fills imageUrl/photographer/imageSource on the Ramen/Cookies/Noodles cross-world product
// catalogs (src/data/<world>/products.json, types/product.ts AffiliateProduct), which shipped
// with zero photography -- ContextualCuratedKitchen now renders imageUrl when present and falls
// back to the branded placeholder otherwise, so this can be run incrementally / re-run safely.
// Active-offer products (the ones actually clickable) are fetched first, then the rest.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILES = ['ramen', 'cookies', 'noodles'].map((world) => join(__dirname, `../src/data/${world}/products.json`))

const accessKey = process.env.UNSPLASH_ACCESS_KEY
if (!accessKey) {
  console.error('UNSPLASH_ACCESS_KEY is not set. Run with: node --env-file=.env.local scripts/fetch-crossworld-product-images.mjs')
  process.exit(1)
}

function urlSlug(url) {
  return url.match(/photo-([a-zA-Z0-9_-]+)\?/)?.[1]
}

// Strip retailer/brand marketing noise so the query is about the physical object, not the listing title.
function toQuery(product) {
  return product.name
    .replace(/\b(set|kit)\b/gi, '')
    .trim()
}

let usedPhotoIds = new Set()
for (const file of FILES) {
  const items = JSON.parse(readFileSync(file, 'utf-8'))
  for (const p of items) {
    const slug = urlSlug(p.imageUrl ?? '')
    if (slug) usedPhotoIds.add(slug)
  }
}

async function fetchOne(product) {
  const query = toQuery(product)
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=squarish`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })
  if (!res.ok) return { error: res.status }
  const data = await res.json()
  const photo = (data.results ?? []).find((p) => !usedPhotoIds.has(urlSlug(p.urls.regular)))
  return { photo }
}

for (const file of FILES) {
  const items = JSON.parse(readFileSync(file, 'utf-8'))
  // Active-offer products first -- they're the ones actually clickable/live -- without disturbing
  // the file's on-disk order, which the write-back below preserves.
  const queue = items
    .filter((p) => !p.imageUrl)
    .sort((a, b) => {
      const aActive = a.offers.some((o) => o.status === 'active') ? 0 : 1
      const bActive = b.offers.some((o) => o.status === 'active') ? 0 : 1
      return aActive - bActive
    })

  let changed = false
  for (const product of queue) {
    const { photo, error } = await fetchOne(product)
    if (error) {
      console.warn(`${file}: ${product.id} -> Unsplash ${error}`)
      if (error === 403) break
      continue
    }
    if (!photo) {
      console.warn(`${file}: no match for ${product.id} (${product.name})`)
      continue
    }
    product.imageUrl = photo.urls.regular
    product.photographer = photo.user.name
    product.photographerUrl = photo.user.links.html
    product.imageSource = 'Unsplash'
    product.imageSourceUrl = photo.links.html
    usedPhotoIds.add(urlSlug(photo.urls.regular))
    changed = true
    console.log(`${file}: fetched ${product.id}`)
  }

  if (changed) {
    writeFileSync(file, JSON.stringify(items, null, 2) + '\n')
  }
}

console.log('Done.')
