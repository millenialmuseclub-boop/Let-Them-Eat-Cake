import '../scripts/register-typescript.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'
const { products } = await import('../src/lib/products.ts')
const { cookieRecommendations, noodleDishRecommendations, noodleTechniqueRecommendations, ramenRecommendations } = await import('../src/lib/contextualRecommendations.ts')
const { dishes } = await import('../src/data/noodles/dishes.ts')
const { noodleTypes } = await import('../src/data/noodles/noodleTypes.ts')
import fs from 'node:fs'
import { trackProductClicked, trackContentViewed } from '../src/lib/analytics.ts'

test('every contextual recommendation resolves to an active product in its own world', () => {
  const cookies = JSON.parse(fs.readFileSync('src/data/cookies/cookies.json'))
  const ramen = JSON.parse(fs.readFileSync('src/data/ramen/ramen.json'))
  const placements = [
    ...cookies.map(c => ['cookies', cookieRecommendations(c.family)]),
    ...ramen.map(r => ['ramen', ramenRecommendations(r.tare)]),
    ...dishes.map(d => ['noodles', noodleDishRecommendations(d)]),
    ...noodleTypes.map(n => ['noodles', noodleTechniqueRecommendations(n.techniqueIds)]),
  ]
  for (const [world, ids] of placements) {
    assert.ok(ids.length <= 3)
    assert.equal(new Set(ids).size, ids.length)
    for (const id of ids) {
      const p = products.find(p => p.id === id)
      assert.ok(p?.apps.includes(world), `${world}: ${id}`)
      assert.ok(p.offers.some(o => o.status === 'active' && new URL(o.url).protocol === 'https:'), id)
    }
  }
})

test('merchant tracking URLs remain exact and analytics failure cannot block navigation', () => {
  const events = []
  globalThis.window = { plausible: (...args) => events.push(args) }
  const p = products.find(p => p.offers.some(o => o.status === 'active'))
  const original = JSON.stringify(p.offers)
  trackProductClicked(p, 'shopmy', '/cookies/encyclopedia/cookie_chocolate_chip')
  trackContentViewed('/cookies', 'cookies')
  assert.equal(events[0][0], 'Affiliate Link Clicked')
  assert.equal(events[1][1].props.world, 'cookies')
  assert.equal(JSON.stringify(p.offers), original)
  window.plausible = () => { throw new Error('Provider unavailable') }
  assert.doesNotThrow(() => trackProductClicked(p, 'shopmy', '/'))
  delete window.plausible
  assert.doesNotThrow(() => trackProductClicked(p, 'shopmy', '/'))
  delete globalThis.window
})
