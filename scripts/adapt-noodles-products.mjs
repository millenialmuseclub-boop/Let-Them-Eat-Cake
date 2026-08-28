// Adapts Noodles' product shape (single `route: {network,url,status}` per product) into the
// canonical AffiliateProduct { offers: AffiliateRoute[] } shape (src/types/product.ts), per the
// master decision that Ramen's commerce shape is canonical for the whole merged app. Noodles'
// data/products.ts is a plain-TS module (object literals + one type-only import), so we strip
// the TS-only bits and import it as plain ESM to read the data.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const SRC = 'C:/Users/Jordann Lopez/Dev/Let Them Eat Noodles/src/data/products.ts'
const OUT = 'src/data/noodles/products.json'

let src = fs.readFileSync(SRC, 'utf8')
src = src.replace(/^import type .*\n/m, '')
src = src.replace(/:\s*AffiliateProduct\[\]/, '')

const tmpFile = path.join(os.tmpdir(), `noodles-products-${Date.now()}.mjs`)
fs.writeFileSync(tmpFile, src)
const mod = await import(`file://${tmpFile}`)
fs.unlinkSync(tmpFile)

const adapted = mod.products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  apps: ['noodles'],
  contexts: p.contexts,
  offers: p.route
    ? [
        {
          id: `${p.id}-${p.route.network}`,
          network: p.route.network,
          url: p.route.url,
          status: p.route.status,
        },
      ]
    : [],
}))

fs.writeFileSync(OUT, JSON.stringify(adapted, null, 2) + '\n')
console.log(`Adapted ${adapted.length} Noodles products -> ${OUT}`)
