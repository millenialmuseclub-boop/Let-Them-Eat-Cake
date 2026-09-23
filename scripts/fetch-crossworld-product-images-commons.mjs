// Run with: node scripts/fetch-crossworld-product-images-commons.mjs
// Fills imageUrl/photographer/imageSource on the Ramen/Cookies/Noodles cross-world product
// catalogs using Wikimedia Commons (no API key, no rate limit) instead of Unsplash, whose key is
// shared/rate-limited by other concurrent work on this repo. Generic object queries (not brand
// names -- Commons is an encyclopedia media repo, not a product-stock site) with a text-based
// relevance check against each candidate's Commons categories/description before accepting, to
// avoid the kind of off-topic mismatch already found once in cakeImages.json (a photo of a jacket
// patch tagged onto a pastry).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILES = ['ramen', 'cookies', 'noodles'].map((world) => join(__dirname, `../src/data/${world}/products.json`))
const QUERIES = JSON.parse(readFileSync(process.argv[2], 'utf-8'))
const RESULTS_PATH = process.argv[3]

const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'with', 'of', 'in', 'on', 'kitchen', 'baking', 'tool', 'utensil'])
function keywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

const REJECT_CATEGORY_HINTS = ['logo', 'flag of', 'coat of arms', 'crest', 'map of', 'diagram', 'people', 'person', 'portrait']

// Wikimedia's API etiquette policy blocks requests with no/generic User-Agent.
const HEADERS = { 'User-Agent': 'LetThemEatApp/1.0 (https://github.com/millenialmuseclub-boop/Let-Them-Eat-Cake)' }

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    query + ' filetype:bitmap',
  )}&srnamespace=6&format=json&srlimit=6`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) return []
  const data = await res.json()
  return (data.query?.search ?? []).map((r) => r.title)
}

async function getImageInfo(titles) {
  if (titles.length === 0) return {}
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    titles.join('|'),
  )}&prop=imageinfo&iiprop=url|extmetadata|size&format=json`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) return {}
  const data = await res.json()
  return data.query?.pages ?? {}
}

function scoreCandidate(query, info) {
  const meta = info.imageinfo?.[0]?.extmetadata ?? {}
  const text = [meta.ObjectName?.value, meta.ImageDescription?.value, meta.Categories?.value].filter(Boolean).join(' ').toLowerCase()
  if (!text) return -1
  for (const hint of REJECT_CATEGORY_HINTS) {
    if (text.includes(hint)) return -1
  }
  const width = info.imageinfo?.[0]?.width ?? 0
  const height = info.imageinfo?.[0]?.height ?? 0
  if (width < 400 || height < 400) return -1
  const qWords = keywords(query)
  let score = 0
  for (const w of qWords) if (text.includes(w)) score++
  return score
}

function stripHtml(s) {
  return (s ?? '').replace(/<[^>]+>/g, '').trim()
}

const usedUrls = new Set()
for (const file of FILES) {
  const items = JSON.parse(readFileSync(file, 'utf-8'))
  for (const p of items) if (p.imageUrl) usedUrls.add(p.imageUrl)
}

const results = { accepted: [], rejected: [] }

for (const file of FILES) {
  const items = JSON.parse(readFileSync(file, 'utf-8'))
  let changed = false
  for (const product of items) {
    const query = QUERIES[product.id]
    if (!query || product.imageUrl) continue

    const titles = await searchCommons(query)
    const pages = await getImageInfo(titles)
    let best = null
    let bestScore = 0
    for (const page of Object.values(pages)) {
      if (!page.imageinfo) continue
      const url = page.imageinfo[0].url
      if (usedUrls.has(url)) continue
      const score = scoreCandidate(query, page)
      if (score > bestScore) {
        bestScore = score
        best = page
      }
    }

    if (best && bestScore >= 1) {
      const info = best.imageinfo[0]
      const artist = stripHtml(info.extmetadata?.Artist?.value) || 'Unknown'
      product.imageUrl = info.url
      product.photographer = artist.length > 60 ? artist.slice(0, 60) : artist
      product.imageSource = 'Wikimedia Commons'
      product.imageSourceUrl = info.descriptionurl
      usedUrls.add(info.url)
      changed = true
      results.accepted.push({ id: product.id, query, title: best.title, score: bestScore, url: info.url })
      console.log(`ACCEPTED ${product.id} <- ${best.title} (score ${bestScore})`)
    } else {
      results.rejected.push({ id: product.id, query, candidates: titles })
      console.log(`no confident match for ${product.id} (query: "${query}")`)
    }
  }
  if (changed) writeFileSync(file, JSON.stringify(items, null, 2) + '\n')
}

if (RESULTS_PATH) writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2))
console.log(`Done. Accepted ${results.accepted.length}, rejected ${results.rejected.length}.`)
