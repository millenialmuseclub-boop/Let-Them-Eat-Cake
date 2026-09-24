import '../scripts/register-typescript.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { searchFoods } from '../src/lib/foodSearch.ts'
import { catalog } from '../scripts/food-catalog.mjs'
import { relatedRamen } from '../src/lib/ramen/related.ts'
import { scoreCookie, explainResult } from '../src/lib/cookies/sommelier.ts'
import { findMatches } from '../src/lib/noodles/sommelier.ts'
import { dishes } from '../src/data/noodles/dishes.ts'

test('search spans existing worlds, ingredients, texture, place and technique', () => {
  assert.equal(catalog.length, 246)
  assert.equal(new Set(catalog.map(x => x.path)).size, catalog.length)
  assert.equal(searchFoods(catalog, 'pho bo')[0].id, 'pho-bo')
  assert.ok(searchFoods(catalog, 'sesame').some(x => x.world === 'cookies'))
  assert.ok(searchFoods(catalog, 'sesame').some(x => x.world === 'noodles'))
  assert.ok(searchFoods(catalog, 'Mexico').some(x => x.id === 'cake_tres_leches'))
  assert.ok(searchFoods(catalog, 'hand pulled', 'noodles').length)
  assert.ok(searchFoods(catalog, 'chewy', 'cookies').length)
  assert.equal(searchFoods(catalog, 'no-such-food-xyz').length, 0)
  assert.ok(searchFoods(catalog, 'sesame', 'cookies').every(x => x.world === 'cookies'))
})

test('generated search index stays synchronized with canonical content', () => {
  assert.deepEqual(JSON.parse(fs.readFileSync('src/data/foodSearch.json', 'utf8')), catalog)
  assert.ok(catalog.every(x => x.name && x.description && x.lesson && x.path.startsWith('/')))
})

test('related ramen changes with the bowl and explains an actual shared trait', () => {
  const ramen = JSON.parse(fs.readFileSync('src/data/ramen/ramen.json'))
  for (const item of ramen) {
    const related = relatedRamen(item, ramen)
    assert.ok(related.length)
    assert.ok(related.every(r => r.id !== item.id && r.relatedReason && (r.brothCharacter === item.brothCharacter || r.flavorTags.some(t => item.flavorTags.includes(t)))))
  }
  assert.notDeepEqual(relatedRamen(ramen[0], ramen).map(x => x.id), relatedRamen(ramen[2], ramen).map(x => x.id))
})

test('flexible cookie family does not invent a requested family', () => {
  const cookie = JSON.parse(fs.readFileSync('src/data/cookies/cookies.json'))[0]
  const query = { sweetness: 3, richness: 3, crispness: 3, flavorPreferences: [], familyPreference: 'flexible' }
  assert.doesNotMatch(explainResult(cookie, scoreCookie(cookie, query)), /as requested/)
  assert.match(explainResult(cookie, scoreCookie(cookie, {...query, familyPreference: cookie.family})), /as requested/)
})

test('brothy and dry cravings follow the data scale and produce different bowls', () => {
  const craving = { brothiness: 5, boldness: 2, richness: 1, chewiness: 2, spice: 0, desiredTags: [] }
  const brothy = findMatches(craving, 1)[0]
  const dry = findMatches({...craving, brothiness: 0}, 1)[0]
  assert.ok(dishes.find(d => d.id === brothy.dishId).flavorProfile.brothiness > dishes.find(d => d.id === dry.dishId).flavorProfile.brothiness)
})
