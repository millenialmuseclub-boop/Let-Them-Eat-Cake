import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasCountries, atlasPlaces, atlasFoods, placesFor } from '../src/lib/foodAtlas.ts'
import { ATLAS_COUNTRY_COORDINATES } from '../src/lib/atlasCoordinates.ts'
import { jetSetDestinations } from '../src/data/jetSetDestinations.ts'

test('every geographic association resolves to an existing food, map position and canonical story', () => {
  for (const place of atlasPlaces) {
    assert.ok(atlasFoods.has(place.foodId), place.foodId)
    assert.ok(place.story && place.context, place.foodId)
    assert.ok(place.countries.length)
  }
  for (const country of atlasCountries) {
    const position = ATLAS_COUNTRY_COORDINATES[country]
    assert.equal(position?.length, 2, country)
    assert.ok(Math.abs(position[0]) <= 180 && Math.abs(position[1]) <= 90, country)
  }
})
test('regional journeys retain meaningful geography without inventing food coverage', () => {
  const sapporo = placesFor('Japan', 'ramen').find(p => p.foodId === 'ramen_sapporo_miso')
  assert.match(sapporo.area, /Sapporo/)
  assert.ok(sapporo.variations.length)
  assert.equal(placesFor('Italy', 'noodles').length, 0)
  assert.ok(placesFor('Italy', 'cake').some(p => p.area === 'Siena, Tuscany'))
  assert.ok(placesFor('Mexico').some(p => p.foodId === 'cookie_marranitos'))
  assert.ok(!placesFor('Singapore').some(p => p.area === 'Penang'))
})
test('Jet Set handoffs use explicit verified guides and geographically associated food IDs', () => {
  for (const destination of jetSetDestinations) {
    const foods = placesFor(destination.country)
    assert.equal(new URL(destination.url).hostname, 'thebrunchmanifesto.blog')
    assert.match(new URL(destination.url).pathname, /^\/\d{4}\/\d{2}\/\d{2}\/.+\/$/)
    for (const foodId of destination.foodIds) assert.ok(foods.some(f => f.foodId === foodId), foodId)
  }
  assert.ok(!jetSetDestinations.some(d => d.country === 'Japan'))
  assert.ok(!jetSetDestinations.some(d => d.foodIds.includes('cake_bolo_de_rolo')))
})
import { journeysFor, resolveJourney, atlasTrails } from '../src/lib/foodAtlas.ts'

test('curated tasting trails contain three distinct existing foods in their stated place and world', () => {
  assert.equal(atlasTrails.length, 6)
  for (const journey of atlasTrails) {
    assert.equal(journey.stops.length, 3)
    assert.equal(new Set(journey.stops.map(s => s.foodId)).size, 3)
    for (const stop of journey.stops) assert.ok(placesFor(journey.country, journey.world).some(p => p.foodId === stop.foodId), `${journey.id}: ${stop.foodId}`)
    assert.ok(atlasFoods.get(journey.food)?.image.startsWith('/photography/'), journey.id)
  }
  assert.deepEqual(journeysFor('ramen').map(t => t.country), ['Japan'])
  assert.deepEqual(journeysFor('noodles').map(t => t.country), ['Vietnam'])
  assert.equal(journeysFor('cake').length, 0)
})
test('shared trail URLs reject mismatched geography, filter, region and food', () => {
  const id = 'japan-regional-ramen'
  assert.ok(resolveJourney(id, 'Japan', 'ramen', '', 'ramen_sapporo_miso'))
  assert.ok(resolveJourney(id, 'Japan', 'all', '', null))
  assert.equal(resolveJourney(id, 'Italy', 'all', '', null), undefined)
  assert.equal(resolveJourney(id, 'Japan', 'cookies', '', null), undefined)
  assert.equal(resolveJourney(id, 'Japan', 'ramen', 'Tokyo', null), undefined)
  assert.equal(resolveJourney(id, 'Japan', 'ramen', '', 'ramen_kitakata'), undefined)
  assert.equal(resolveJourney('unknown', 'Japan', 'all', '', null), undefined)
})
