// One-time script — captures App Store screenshots (iPhone 6.5"/6.7" display,
// 1284x2778 portrait) from the running local dev server.
// Run with: node scripts/capture-ios-screenshots.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../ios-store-assets/screenshots/iphone-6.5')
const baseUrl = 'http://localhost:5173'

// viewport 428x926 (iPhone 14/15 Pro Max CSS size) * deviceScaleFactor 3
// = 1284x2778, one of App Store Connect's accepted 6.5"/6.7" display sizes.
const device = { viewport: { width: 428, height: 926 }, deviceScaleFactor: 3 }

// Curated unified-app set: umbrella home first, then one strong screen for
// each culinary world, followed by two feature-rich discovery screens.
const pages = [
  { path: '/', name: '01-let-them-eat-home' },
  { path: '/discover', name: '02-cake' },
  { path: '/ramen', name: '03-ramen' },
  { path: '/cookies', name: '04-cookies' },
  { path: '/noodles', name: '05-noodles' },
  { path: '/ramen/atlas', name: '06-global-discovery' },
]

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext(device)
const page = await context.newPage()

for (const { path, name } of pages) {
  await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
  // let hero/lazy images finish decoding, fonts settle, any entrance animation complete
  await page.waitForTimeout(1200)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(200)
  await page.screenshot({ path: join(outDir, `${name}.png`) })
  console.log(`Captured ${name}.png`)
}

await browser.close()
