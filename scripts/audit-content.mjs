import fs from 'node:fs'
import { images as noodleImages } from '../src/data/noodles/images.ts'
import { dishes } from '../src/data/noodles/dishes.ts'
import { products } from '../src/lib/products.ts'

const json = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const catalogs = [
  ['Cake', json('src/data/cakes.json'), json('src/data/cakeImages.json')],
  ['Ramen', json('src/data/ramen/ramen.json'), json('src/data/ramen/ramenImages.json')],
  ['Cookies', json('src/data/cookies/cookies.json'), json('src/data/cookies/cookieImages.json')],
  ['Noodles', dishes, Object.fromEntries(noodleImages.map((image) => [image.subjectId, { url: image.src }]))],
]
const coverage = catalogs.map(([world, items, images]) => {
  const used = new Map()
  for (const item of items) {
    const url = images[item.id]?.url
    if (url) { const canonical = new URL(url, 'https://local.invalid'); canonical.search = ''; used.set(canonical.href, [...(used.get(canonical.href) ?? []), item.id]) }
  }
  return { world, total: items.length, photographed: items.filter((item) => images[item.id]).length,
    missing: items.filter((item) => !images[item.id]).map(({ id, name }) => ({ id, name })),
    repeatedSources: [...used].filter(([, ids]) => ids.length > 1).map(([url, ids]) => ({ url, ids })) }
})
const offers = products.flatMap((product) => product.offers.filter((offer) => offer.status === 'active').map((offer) => ({ product: product.id, worlds: product.apps, url: offer.url })))
offers.push(...json('src/data/affiliateProducts.json').filter((product) => product.active).map((product) => ({ product: product.id, worlds: ['cake'], url: product.url })))
const invalidOffers = offers.filter(({ url }) => { try { return new URL(url).protocol !== 'https:' } catch { return true } })
const grouped = new Map()
for (const offer of offers) if (offer.url) grouped.set(offer.url, [...(grouped.get(offer.url) ?? []), offer.product])
const report = { generatedAt: new Date().toISOString(), coverage, activeOffers: offers.length, invalidOffers,
  sharedOfferUrls: [...grouped].filter(([, ids]) => new Set(ids).size > 1).map(([url, ids]) => ({ url, products: [...new Set(ids)] })), network: [] }

if (process.argv.includes('--network')) {
  const queue = [...new Set([...grouped.keys(), ...catalogs.flatMap(([, , images]) => Object.values(images).map((image) => image.url).filter((url) => url.startsWith('https://')))])]
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const url = queue.shift()
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) })
        report.network.push({ url, status: response.status, destination: response.url, contentType: response.headers.get('content-type') })
      } catch (error) { report.network.push({ url, error: error.message }) }
    }
  }))
}
if (!process.argv.includes('--network') && fs.existsSync('reports/content-audit.json')) {
  const previous = json('reports/content-audit.json')
  report.network = previous.network
  report.networkCheckedAt = previous.networkCheckedAt ?? previous.generatedAt
}
fs.mkdirSync('reports', { recursive: true })
fs.writeFileSync('reports/content-audit.json', JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ coverage, activeOffers: offers.length, invalidOffers, sharedOfferUrls: report.sharedOfferUrls,
  networkChecked: report.network.length, networkFailures: report.network.filter((entry) => !entry.status || entry.status >= 400).length }, null, 2))
if (invalidOffers.length) process.exitCode = 1
