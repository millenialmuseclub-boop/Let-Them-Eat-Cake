import fs from 'node:fs'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const origin = process.env.AUDIT_ORIGIN ?? 'http://127.0.0.1:4173'
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await context.newPage()
const errors = [], checks = []
page.on('pageerror', error => errors.push(error.message))
const go = async route => {
  await page.goto(origin + route, { waitUntil: 'domcontentloaded' })
  await page.locator('.top-nav-bar').waitFor()
  await page.locator('h1').first().waitFor()
}
const pass = name => checks.push(name)
try {
  await go('/explore')
  await page.getByLabel('Search all four worlds').fill('sesame')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await page.waitForURL('**/explore?q=sesame')
  assert.ok(await page.locator('.food-result').count() > 2)
  assert.match(await page.locator('.food-result-grid').innerText(), /cookies/i)
  pass('cross-world ingredient search')
  await page.getByRole('button', { name: 'cookies', exact: true }).click()
  await page.reload()
  await page.getByRole('button', { name: 'cookies', exact: true }).waitFor()
  assert.equal(await page.getByRole('button', { name: 'cookies', exact: true }).getAttribute('aria-pressed'), 'true')
  assert.ok((await page.locator('.food-result .eyebrow').allTextContents()).every(t => t.startsWith('cookies')))
  pass('search filters survive reload')
  await page.getByLabel('Search all four worlds').fill('not-a-real-food-xyz')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await page.getByRole('heading', { name: 'A different trail?' }).waitFor()
  await page.getByRole('button', { name: 'Show all discoveries' }).click()
  await page.getByRole('button', { name: 'Surprise me' }).click()
  await page.locator('.content-journey').waitFor()
  pass('empty-state recovery and random discovery open a real detail')
  for (const [route, label] of [['/cake/cake_black_forest','Save to favorites'], ['/ramen/ramen/ramen_sapporo_miso','★ Favorite'], ['/cookies/encyclopedia/cookie_chocolate_chip','Favorite'], ['/noodles/encyclopedia/pho-bo','Favorite']]) {
    await go(route)
    await page.getByRole('button', { name: label, exact: true }).click()
    await page.reload()
    await page.locator('.content-journey').waitFor()
    assert.ok(await page.locator('button[aria-pressed="true"]').count() > 0)
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://letthemeatcake.netlify.app' + route)
    assert.ok(await page.getByRole('button', { name: 'Share this discovery' }).count())
  }
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('letThemEat.savedItems.v1')).items.length), 4)
  pass('all four saves survive reload; detail metadata and sharing render')
  await go('/ramen/ramen/ramen_tokyo_shoyu')
  await page.getByRole('link', { name: 'Find a pairing →', exact: true }).click()
  await page.locator('select').waitFor()
  assert.equal(await page.locator('select').first().inputValue(), 'ramen_tokyo_shoyu')
  pass('ramen pairing preserves selected bowl')
  await go('/cake/cake_tres_leches')
  assert.equal(await page.getByRole('link', { name: 'Explore Mexico City with Jet Set ↗' }).getAttribute('href'), 'https://thebrunchmanifesto.blog/2025/10/22/mexico-city-by-cruiser-bike-parks-culture-and-ciclovia-charm/')
  await page.getByRole('link', { name: 'Find a pairing →', exact: true }).click()
  await page.locator('.sommelier-page').waitFor()
  assert.match(await page.locator('main').innerText(), /Tres Leches/i)
  pass('cake pairing preserves selection; geographically relevant Jet Set link')
  await go('/noodles/encyclopedia/pho-bo')
  assert.equal(await page.getByRole('link', { name: 'Explore Mexico City with Jet Set ↗' }).count(), 0)
  await go('/noodles/sommelier')
  await page.getByRole('button', { name: 'Light & brothy' }).click()
  const light = await page.locator('.card h3').allTextContents()
  await page.getByRole('button', { name: 'Bold & saucy' }).click()
  assert.notDeepEqual(await page.locator('.card h3').allTextContents(), light)
  pass('noodle craving presets change recommendations')
  await go('/cookies/sommelier/find')
  await page.getByRole('button', { name: 'Find my cookie', exact: true }).click()
  await page.getByRole('heading', { name: 'Your Matches' }).waitFor()
  assert.doesNotMatch(await page.locator('.find-results').innerText(), /as requested/)
  pass('cookie flexible matches explain actual preferences')
  for (const route of ['/ramen/atlas?city=Sapporo%2C+Hokkaido','/cookies/atlas?region=Latin+America','/noodles/atlas?country=vietnam']) {
    await go(route)
    await page.reload()
    await page.locator('h1').first().waitFor()
    assert.ok(page.url().includes('?'))
    if (route.includes('/noodles/')) { await page.locator('#noodle-atlas-country').waitFor(); assert.equal(await page.locator('.atlas-country h3').innerText(), 'Vietnam') }
    if (route.includes('/cookies/')) { await page.locator('.atlas-country-card').waitFor(); assert.equal(await page.locator('.atlas-country-card').count(), 1) }
    if (route.includes('/ramen/')) { await page.getByRole('button', { name: 'Sapporo, Hokkaido', exact: true }).waitFor(); assert.equal(await page.getByRole('button', { name: 'Sapporo, Hokkaido', exact: true }).getAttribute('aria-pressed'), 'true') }
  }
  pass('three Atlas deep links restore filtered context')
  await go('/cookies/workshop/labs/dough-lab')
  await page.getByRole('button', { name: 'Creaming Method', exact: true }).click()
  assert.match(await page.locator('.lab-concept-definition').innerText(), /Chocolate Chip Cookie/)
  await page.getByRole('button', { name: 'Fully Melted', exact: true }).click()
  assert.match(await page.locator('.lab-variable-effect').first().innerText(), /chewiest/)
  pass('Cookie Lab shows related examples and cause/effect')
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/explore', '/cookies/workshop', '/noodles/sommelier', '/cake/cake_tres_leches']) {
      await go(route)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${width} ${route}`)
    }
    await go('/explore?q=sesame')
    await page.screenshot({ path: `reports/discovery-${width}.png`, fullPage: true })
  }
  pass('320/390/1440px layouts without horizontal overflow')
  assert.deepEqual(errors, [])
} catch (error) { checks.push({ failure: error.message }); process.exitCode = 1 }
await browser.close()
fs.writeFileSync('reports/discovery-interactions.json', JSON.stringify({ checks, errors }, null, 2))
console.log(JSON.stringify({ checks, errors }, null, 2))
