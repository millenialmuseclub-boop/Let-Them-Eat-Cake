// One-time script — captures Play Store screenshots (phone, 7in tablet, 10in tablet)
// from the running local dev server. Run with: node scripts/capture-store-screenshots.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outRoot = join(__dirname, '../play-store-assets/screenshots')
const baseUrl = 'http://localhost:5173'

// CSS viewport + deviceScaleFactor chosen to match real device pixel densities
// (physical output = viewport * dsf) so the app's mobile/tablet breakpoints render
// the way they actually do on-device, instead of stretching a phone layout across
// a huge low-density canvas.
// Tablets are captured in landscape (16:9) — the app's content is capped at
// max-width: 960px and isn't tall enough to fill a portrait tablet viewport
// without a large dead zone, but fills a landscape frame naturally.
const devices = {
  phone: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 }, // -> 1080x1920 (9:16)
  'tablet-7in': { viewport: { width: 1200, height: 675 }, deviceScaleFactor: 2 }, // -> 2400x1350 (16:9)
  'tablet-10in': { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 }, // -> 3200x1800 (16:9)
}

const pages = [
  { path: '/discover', name: '01-discover' },
  { path: '/atlas', name: '02-atlas' },
  { path: '/encyclopedia', name: '03-encyclopedia' },
  { path: '/sommelier', name: '04-sommelier' },
  { path: '/collections', name: '05-collections' },
]

for (const [device, config] of Object.entries(devices)) {
  const outDir = join(outRoot, device)
  mkdirSync(outDir, { recursive: true })
  const browser = await chromium.launch()
  const context = await browser.newContext(config)
  const page = await context.newPage()

  for (const { path, name } of pages) {
    await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    await page.screenshot({ path: join(outDir, `${name}.png`) })
    console.log(`Captured ${device}/${name}.png`)
  }

  await browser.close()
}
