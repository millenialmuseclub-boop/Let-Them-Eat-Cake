import fs from 'node:fs'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { atlasJourneys } from '../src/data/atlasJourneys.ts'
const origin = process.env.AUDIT_ORIGIN ?? 'http://127.0.0.1:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const errors = [], checks = []
page.on('pageerror', error => errors.push(error.message))
try {
  // Remote photo outages must not affect local trail covers or navigation.
  await page.route('**/*', route => route.request().resourceType() === 'image' && !route.request().url().startsWith(origin) ? route.abort() : route.continue())
  for (const trail of atlasJourneys) {
    await page.goto(`${origin}/atlas`, { waitUntil: 'domcontentloaded' })
    const card = page.locator('.atlas-trail').filter({ hasText: trail.title })
    await card.scrollIntoViewIfNeeded()
    await card.locator('img').evaluate(image => image.decode())
    assert.ok((await card.locator('img').getAttribute('src')).startsWith('/photography/'))
    await card.click()
    await page.locator('.atlas-tasting-trail').waitFor()
    assert.equal(await page.locator('.atlas-tasting-trail li button').count(), 3)
    assert.equal(await page.locator('.atlas-food-card').count(), 0)
    for (let i = 0; i < 3; i++) {
      await page.locator('.atlas-stop-note').filter({ hasText: `Stop ${i + 1} of 3` }).waitFor()
      assert.equal(new URL(page.url()).searchParams.get('food'), trail.stops[i].foodId)
      assert.equal(await page.locator('.atlas-tasting-trail [aria-current="step"]').count(), 1)
      if (i > 0) assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.atlas-style-story h2')), true)
      assert.match(await page.locator('.atlas-stop-note').innerText(), new RegExp(`Stop ${i + 1} of 3`))
      assert.ok(await page.locator('.atlas-story-link').getAttribute('href'))
      if (i < 2) await page.getByRole('button', { name: 'Next stop →', exact: true }).click()
    }
    const url = page.url()
    await page.reload()
    await page.locator('.atlas-stop-note').waitFor()
    assert.equal(page.url(), url)
    await page.getByRole('button', { name: '← Previous stop', exact: true }).click()
    assert.equal(new URL(page.url()).searchParams.get('food'), trail.stops[1].foodId)
    await page.goBack()
    await page.locator('.atlas-stop-note').waitFor()
    assert.equal(new URL(page.url()).searchParams.get('food'), trail.stops[2].foodId)
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${trail.id}: ${width}px overflow`)
    }
    await page.screenshot({ path: `reports/trail-${trail.id}.png`, fullPage: true })
    checks.push(`${trail.country}: all 3 stops, reload, Back, local cover and 320/390/1440px layouts`)
  }
  await page.goto(`${origin}/atlas?country=Argentina&food=cookie_alfajor`)
  await page.locator('.taste-this-place a').waitFor()
  assert.match(await page.locator('.taste-this-place a').getAttribute('href'), /cafe-culture-in-buenos-aires/)
  await page.goto(`${origin}/atlas?country=Chile&food=cake_torta_mil_hojas`)
  await page.locator('.taste-this-place a').waitFor()
  assert.match(await page.locator('.taste-this-place a').getAttribute('href'), /santiago-by-cruiser-bike/)
  await page.goto(`${origin}/atlas?world=cake`)
  await page.locator('.atlas-trails').waitFor()
  assert.equal(await page.locator('.atlas-trail').count(), 0)
  await page.goto(`${origin}/atlas?country=Italy&trail=japan-regional-ramen`)
  await page.locator('.atlas-country-story').waitFor()
  assert.equal(await page.locator('.atlas-tasting-trail').count(), 0)
  checks.push('verified travel destinations, incompatible world filters and malformed trail recovery')
  assert.deepEqual(errors, [])
  fs.writeFileSync('reports/atlas-journeys-audit.json', JSON.stringify({ origin, checks, errors }, null, 2) + '\n')
  console.log(JSON.stringify({ checks, errors }, null, 2))
} finally { await browser.close() }
