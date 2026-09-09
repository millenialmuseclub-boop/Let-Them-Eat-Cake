import test from 'node:test'
import assert from 'node:assert/strict'
import { activeHubPath, worldFromPathname, HUBS, hubWorld } from '../src/data/hubs.ts'

test('world detection respects route boundaries and the editorial home', () => {
  assert.equal(worldFromPathname('/'), null)
  assert.equal(worldFromPathname('/ramen/atlas'), 'ramen')
  assert.equal(worldFromPathname('/ramenish'), 'cake')
  assert.equal(activeHubPath('/'), undefined)
})
test('each world retains four tabs and exactly one active department on deep links', () => {
  for (const world of ['cake', 'ramen', 'cookies', 'noodles']) assert.equal(HUBS.filter((hub) => hubWorld(hub) === world).length, 4)
  assert.equal(activeHubPath('/cookies/workshop/labs/dough-lab'), '/cookies/workshop')
  assert.equal(activeHubPath('/noodles/workshop/lab/hydration-lab'), '/noodles/workshop')
  assert.equal(activeHubPath('/ramen/my-ramen'), '/ramen')
  assert.equal(activeHubPath('/cake/cake_black_forest'), '/discover')
})
