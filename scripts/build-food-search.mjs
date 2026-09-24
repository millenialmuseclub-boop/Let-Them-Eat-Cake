import fs from 'node:fs'
import { catalog } from './food-catalog.mjs'
fs.writeFileSync('src/data/foodSearch.json', JSON.stringify(catalog) + '\n')
console.log(`Prepared ${catalog.length} existing foods for local search`)
