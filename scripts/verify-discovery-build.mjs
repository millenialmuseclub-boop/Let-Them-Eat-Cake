import fs from 'node:fs'
import assert from 'node:assert/strict'
const foods = JSON.parse(fs.readFileSync('src/data/foodSearch.json'))
for (const food of foods) {
  const html = fs.readFileSync(`dist${food.path}/index.html`, 'utf8')
  assert.ok(html.includes(`href="https://letthemeatcake.netlify.app${food.path}"`), food.path)
  assert.ok(html.includes('property="og:url"'), food.path)
  assert.ok(html.includes('<h2>What makes it different?</h2>'), food.path)
  assert.ok(!html.includes('capacitor://') && !html.includes('localhost'), food.path)
}
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8')
assert.equal((sitemap.match(/<loc>/g) ?? []).length, foods.length + 3)
console.log(`Verified ${foods.length} food metadata pages and ${foods.length + 3} sitemap routes`)
