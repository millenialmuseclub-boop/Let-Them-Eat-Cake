import fs from 'node:fs'
// Merchant destinations recorded in reports/content-audit.json on 2026-09-19.
const corrections = {
  'https://go.shopmy.us/p-79936778': ['World Market Pad Print Noodle Bowls, Set of Four', 'A patterned set of four noodle bowls for serving at the table.'],
  'https://go.shopmy.us/p-79938809': ['Williams Sonoma Cyprus Reactive Glaze Noodle Bowls', 'Reactive-glaze noodle bowls from the Cyprus collection.'],
  'https://go.shopmy.us/p-80170036': ['Aero Chopsticks with Rest', 'A chopstick and rest set for keeping the tips off the table between bites.'],
  'https://go.shopmy.us/p-80169747': ['Williams Sonoma Red Sandalwood Chopsticks', 'A set of four red sandalwood chopsticks for the table.'],
  'https://go.shopmy.us/p-80170507': ['Japanese Artwork Chopstick and Rest Gift Set', 'A coordinated chopstick and rest gift set featuring Japanese artwork.'],
  'https://go.shopmy.us/p-80168972': ['Musubi Kiln Ramen Spoon Collection', 'Browse the retailer’s ramen spoon collection and choose a material and shape to suit your bowl.'],
  'https://on.ltk.com/+yvyFJ7sFf2P04TqtCXA-sQ': ['Acacia Serving Tray with Handles', 'An acacia wood tray with handles for carrying bowls and side dishes.'],
}
for (const world of ['ramen', 'noodles', 'cookies']) {
  const file = `src/data/${world}/products.json`
  const products = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const p of products) {
    const offer = p.offers.find(o => o.status === 'active' && corrections[o.url])
    if (!offer) continue
    ;[p.name, p.description] = corrections[offer.url]
    for (const o of p.offers) if (o.status === 'active') o.cta = `View ${p.name} →`
    if (p.id === 'bamboo-noodle-tray') { p.contexts = []; p.category = world === 'ramen' ? 'bowls-tableware' : 'serving' }
  }
  fs.writeFileSync(file, JSON.stringify(products, null, 2) + '\n')
}
const cakeFile = 'src/data/affiliateProducts.json'
const cake = JSON.parse(fs.readFileSync(cakeFile, 'utf8'))
const pan = cake.find(p => p.id === 'product_cake_pan')
pan.name = 'Fat Daddio’s Bakeware Collection'
pan.editorialNote = 'Browse the bakeware collection and select the pan size and shape specified by your recipe.'
fs.writeFileSync(cakeFile, JSON.stringify(cake, null, 2) + '\n')
