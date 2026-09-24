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
