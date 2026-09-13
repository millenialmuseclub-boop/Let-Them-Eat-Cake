import fs from 'node:fs'
import { chromium } from 'playwright'
import { HUBS } from '../src/data/hubs.ts'

const origin = process.env.AUDIT_ORIGIN ?? 'http://127.0.0.1:5173'
const routeFiles = [['src/App.tsx', ''], ...['ramen', 'cookies', 'noodles'].map(world => [`src/pages/${world}/${world[0].toUpperCase() + world.slice(1)}Routes.tsx`, `/${world}`])]
const routes = new Set(HUBS.map(hub => hub.path))
for (const [file, prefix] of routeFiles) {
  for (const [, route] of fs.readFileSync(file, 'utf8').matchAll(/<Route\s+path="([^"]*)"/g)) {
    if (!/[:*]/.test(route)) routes.add(`${prefix}/${route}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/')
  }
}
const json = path => JSON.parse(fs.readFileSync(path, 'utf8'))
routes.add(`/cake/${json('src/data/cakes.json')[0].id}`)
routes.add(`/ramen/ramen/${json('src/data/ramen/ramen.json')[0].id}`)
routes.add(`/cookies/encyclopedia/${json('src/data/cookies/cookies.json')[0].id}`)
routes.add('/noodles/encyclopedia/pho-bo')
routes.add('/cookies/workshop/labs/dough-lab')
routes.add('/noodles/workshop/lab/hydration-lab')
const browser = await chromium.launch({ headless: true })
const report = { generatedAt: new Date().toISOString(), origin, pages: [] }
for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  let errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const route of routes) {
    errors = []
    try {
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' })
      await page.locator('h1').first().waitFor({ timeout: 15000 })
      await page.waitForTimeout(150)
      const state = await page.evaluate(() => ({
        heading: document.querySelector('h1')?.textContent,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        overflowing: [...document.querySelectorAll('main *, .page-container *')].filter(el => el.getBoundingClientRect().right > innerWidth + 2 && el.getBoundingClientRect().width > 0).slice(0, 8).map(el => `${el.tagName}.${el.className}`),
        brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc),
        duplicateIds: [...document.querySelectorAll('[id]')].map(el => el.id).filter((id, i, all) => all.indexOf(id) !== i),
      }))
      report.pages.push({ route, width: viewport.width, ...state, errors: [...errors] })
    } catch (error) { report.pages.push({ route, width: viewport.width, failure: error.message, errors: [...errors] }) }
  }
  await context.close()
}
await browser.close()
fs.writeFileSync('reports/browser-audit.json', JSON.stringify(report, null, 2) + '\n')
const failures = report.pages.filter(p => p.failure || p.errors.length || p.overflow || p.duplicateIds?.length)
console.log(JSON.stringify({ checked: report.pages.length, failures, brokenImagePages: report.pages.filter(p => p.brokenImages?.length).map(p => ({route: p.route, width: p.width, images: p.brokenImages})) }, null, 2))
if (failures.length) process.exitCode = 1
