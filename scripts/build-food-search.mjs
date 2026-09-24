import fs from 'node:fs'
import { catalog } from './food-catalog.mjs'
import { atlasCatalog } from './atlas-catalog.mjs'
import { geoCentroid } from 'd3-geo'
import { feature } from 'topojson-client'
import { ATLAS_COUNTRY_ISO_NUMERIC } from '../src/lib/atlasCountryCodes.ts'
fs.writeFileSync('src/data/foodSearch.json', JSON.stringify(catalog) + '\n')
fs.writeFileSync('src/data/foodAtlas.json', JSON.stringify(atlasCatalog) + '\n')
// Both helpers are already installed by react-simple-maps. Generate offline from its existing map.
const topology = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'))
const shapes = feature(topology, topology.objects.countries).features
const centers = Object.fromEntries(Object.entries(ATLAS_COUNTRY_ISO_NUMERIC).flatMap(([country, iso]) => {
  const shape = shapes.find(s => Number(s.id) === Number(iso))
  return shape ? [[country, geoCentroid(shape).map(value => Math.round(value * 100) / 100)]] : []
}))
// Small islands omitted from the existing 110m geography retain a representative pin.
Object.assign(centers, { Barbados: [-59.55, 13.17], Mauritius: [57.55, -20.25], Singapore: [103.8, 1.35] })
fs.writeFileSync('src/data/atlasCountryCenters.json', JSON.stringify(centers) + '\n')
console.log(`Prepared ${catalog.length} existing foods for local search`)
