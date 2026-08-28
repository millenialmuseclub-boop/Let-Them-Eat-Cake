// Adapts Cookies' flat product shape (single url/network/active per product) into the canonical
// AffiliateProduct { offers: AffiliateRoute[] } shape (src/types/product.ts), per the master
// decision that Ramen's commerce shape is canonical for the whole merged app.
import fs from 'node:fs'

const SRC = 'C:/Users/Jordann Lopez/Dev/Let Them Eat Cookies/letthemeatcookies/src/data/products.json'
const OUT = 'src/data/cookies/products.json'

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'))

const adapted = raw.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  editorialNote: p.editorialNote,
  apps: p.apps ?? ['cookies'],
  contexts: p.contexts,
  offers: p.url
    ? [
        {
          id: `${p.id}-${p.network ?? 'shopmy'}`,
          network: p.network ?? 'shopmy',
          url: p.url,
          status: p.active ? 'active' : 'pending',
        },
      ]
    : [],
}))

fs.writeFileSync(OUT, JSON.stringify(adapted, null, 2) + '\n')
console.log(`Adapted ${adapted.length} Cookies products -> ${OUT}`)
