// Geographic associations come from the four existing editorial datasets, never text guessing.
import fs from 'node:fs'
import { dishes } from '../src/data/noodles/dishes.ts'
import { countries, places } from '../src/data/noodles/geo.ts'
const read = name => JSON.parse(fs.readFileSync(`src/data/${name}.json`, 'utf8'))
const aliases = { England: 'United Kingdom', Scotland: 'United Kingdom', Wales: 'United Kingdom' }
const countryNames = value => [...new Set(value.split(' / ').map(name => aliases[name] ?? name))]
// These places are already named in the canonical entries' descriptions/history.
const cakeAreas = { cake_cassata_siciliana: 'Sicily', cake_torta_caprese: 'Capri', cake_panforte: 'Siena, Tuscany' }
const cake = read('regions').map(r => ({
  foodId: r.cakeId, world: 'cake', countries: countryNames(r.country),
  area: r.cityMicroRegion ?? cakeAreas[r.cakeId] ?? (aliases[r.country] ? r.country : ''),
  context: r.shortDescription, story: r.historyNote,
}))
const cookieFoods = read('cookies/cookies')
const cookies = read('cookies/regions').map(r => {
  const item = cookieFoods.find(c => c.id === r.cookieId)
  return { foodId: r.cookieId, world: 'cookies', countries: countryNames(r.country),
    area: aliases[r.country] ? r.country : '', context: item.culturalSignificance,
    story: item.historicalContext, variations: item.commonVariations,
    association: r.originComplexity === 'disputed' || r.originComplexity === 'multi-region' ? 'A shared or debated tradition' : undefined }
})
const ramen = read('ramen/ramen').map(r => ({
  foodId: r.id, world: 'ramen', countries: ['Japan'], area: r.origin,
  context: r.culturalSignificance, story: r.historicalContext,
  variations: [r.variationNote], ingredients: [r.tare, r.noodleStyle],
}))
const noodleCountry = { china: ['China'], japan: ['Japan'], korea: ['South Korea'], vietnam: ['Vietnam'], thailand: ['Thailand'], philippines: ['Philippines'], malaysia: ['Malaysia', 'Singapore'], myanmar: ['Myanmar'] }
const noodles = dishes.map(d => ({
  foodId: d.id, world: 'noodles', countries: d.place.countryId === 'malaysia' && d.place.cityOrAreaId
    ? [d.place.cityOrAreaId === 'singapore-city' ? 'Singapore' : 'Malaysia'] : noodleCountry[d.place.countryId],
  area: places.find(p => p.id === d.place.cityOrAreaId)?.name ?? '',
  context: [places.find(p => p.id === d.place.cityOrAreaId)?.noteOnSignificance, d.culturalContext].filter(Boolean).join(' '), story: d.historicalContext,
  association: countries.find(c => c.id === d.place.countryId)?.name,
}))
export const atlasCatalog = [...cake, ...cookies, ...ramen, ...noodles]
