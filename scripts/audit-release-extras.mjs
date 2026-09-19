import fs from 'node:fs'
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const products = ['ramen', 'cookies', 'noodles'].flatMap(w => read(`src/data/${w}/products.json`))
const cake = read('src/data/affiliateProducts.json')
const shops = read('src/data/ramen/shops.json')
const urls = [...new Set([...products.filter(p => p.offers.some(o => o.status === 'active')).map(p => p.imageUrl), ...cake.filter(p => p.active).map(p => p.imageUrl), ...shops.flatMap(s => [s.mapLink, s.officialWebsite])].filter(u => u?.startsWith('https://')))]
const output = []
const queue = [...urls]
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const url = queue.shift()
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) })
      output.push({ url, status: response.status, destination: response.url })
    } catch (error) { output.push({ url, error: error.message }) }
  }
}))
fs.writeFileSync('reports/release-extra-links.json', JSON.stringify({ checkedAt: new Date().toISOString(), results: output }, null, 2) + '\n')
console.log(JSON.stringify({ checked: output.length, issues: output.filter(x => !x.status || x.status >= 400) }, null, 2))
