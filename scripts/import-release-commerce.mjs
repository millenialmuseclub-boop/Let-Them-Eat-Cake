import fs from 'node:fs'
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (p, data) => fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
const manifest = 'reports/release-shopmy-links.json'
const entries = read(manifest)
const books = [
  { id: 'product_ramen_cookbook', name: 'Ivan Ramen by Ivan Orkin', apps: ['ramen'], contexts: ['broth-lab', 'noodle-lab'], description: 'Ivan Orkin’s story and recipes from his Tokyo ramen shop.', url: 'https://go.shopmy.us/p-87739738', destination: 'https://www.barnesandnoble.com/w/ivan-ramen-ivan-orkin/1114854986', imageUrl: 'https://static.shopmy.us/pins/zoom-87739738-1789823530780-9781607744467_p0.jpg' },
  { id: 'release-cookie-book', name: '100 Cookies by Sarah Kieffer', apps: ['cookies'], contexts: ['dough-lab'], description: 'A baking book spanning classic cookies, brownies, bars, and new variations.', url: 'https://go.shopmy.us/p-87740026', destination: 'https://www.barnesandnoble.com/w/100-cookies-sarah-kieffer/1136332114?terms=free-shipping', imageUrl: 'https://static.shopmy.us/pins/zoom-87740026-1789823640795-9781452180731_p0.jpg' },
]
for (const book of books) if (!entries.some(e => e.id === book.id)) entries.push({ ...book, category: 'books', verifiedIn: 'Authenticated ShopMy product picker and My Links', createdAt: '2026-09-19' })
write(manifest, entries)
for (const world of ['ramen', 'cookies', 'noodles']) {
  const file = `src/data/${world}/products.json`
  const catalog = read(file)
  for (const entry of entries.filter(e => e.apps.includes(world))) {
    let product = catalog.find(p => p.id === entry.id)
    if (!product) { product = { id: entry.id, offers: [] }; catalog.push(product) }
    Object.assign(product, { name: entry.name, description: entry.description, category: entry.category, apps: entry.apps, contexts: entry.contexts, imageUrl: entry.imageUrl })
    delete product.editorialNote
    if (!product.offers.some(o => o.url === entry.url)) product.offers.push({ id: `${entry.id}-shopmy-20260919`, network: 'shopmy', url: entry.url, status: 'active', notes: `Product and destination matched in ShopMy on ${entry.createdAt}.` })
  }
  write(file, catalog)
}
const cakeFile = 'src/data/affiliateProducts.json'
const cake = read(cakeFile)
const associations = { product_stand_mixer: ['creaming_method'], product_cake_pan: ['pan_preparation'], product_thermapen: ['doneness_testing', 'ganache'], product_revolving_cake_stand: ['crumb_coating'], product_measuring_set: ['soaking'] }
for (const p of cake) {
  if (associations[p.id]) p.associatedTechniqueIds = [...new Set([...(p.associatedTechniqueIds ?? []), ...associations[p.id]])]
  if (p.associatedIngredientSlugs?.includes('dark-chocolate') && /milk/i.test(p.name)) p.associatedIngredientSlugs = p.associatedIngredientSlugs.filter(s => !['dark-chocolate', 'sweet-baking-chocolate'].includes(s))
}
for (const id of ['release-square-pan', 'release-cooling-rack', 'release-rolling-pin']) {
  const e = entries.find(p => p.id === id)
  if (!cake.some(p => p.id === id)) cake.push({ id, name: e.name, category: id === 'release-matcha' ? 'ingredient' : 'equipment', url: e.url, network: 'shopmy', active: true, imageUrl: e.imageUrl, editorialNote: e.description, ...(id === 'release-matcha' ? { associatedIngredientSlugs: ['matcha'] } : { associatedTechniqueIds: id === 'release-cooling-rack' ? ['glazing'] : id === 'release-rolling-pin' ? ['fondant'] : ['pan_preparation'] }) })
}
write(cakeFile, cake)
console.log(`Imported ${entries.length} verified ShopMy products.`)
