import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { matchRoutes } from 'react-router-dom'
import { HUBS } from '../src/data/hubs.ts'

const routeFiles = [['src/App.tsx', ''], ...['ramen', 'cookies', 'noodles'].map((world) => [`src/pages/${world}/${world[0].toUpperCase()+world.slice(1)}Routes.tsx`, `/${world}`])]
const routes = routeFiles.flatMap(([file, prefix]) => [...fs.readFileSync(file,'utf8').matchAll(/<Route\s+path="([^"]*)"/g)]
  .filter(([, route]) => !route.includes('*')).map(([, route]) => ({ path: prefix ? `${prefix}/${route}`.replace(/\/$/, '') : route })))
routes.push(...HUBS.map((hub) => ({ path: hub.path })))
const seen = new Set()
function reachable(file) {
  if (seen.has(file)) return
  seen.add(file)
  const source = fs.readFileSync(file, 'utf8')
  for (const [, reference] of source.matchAll(/(?:from\s+|import\()['"]([^'"]+)['"]/g)) {
    if (!reference.startsWith('.')) continue
    const base = path.resolve(path.dirname(file), reference)
    const dependency = [base, `${base}.tsx`, `${base}.ts`].find((candidate) => /\.tsx?$/.test(candidate) && fs.existsSync(candidate))
    if (dependency) reachable(dependency)
  }
}
reachable(path.resolve('src/App.tsx'))

test('every hub destination and literal link in reachable components has a real route', () => {
  const links = HUBS.flatMap((hub) => hub.kind === 'landing' ? hub.items.map((item) => ({ to: item.to, file: 'hubs.ts' })) : [])
  for (const file of seen) for (const [, to] of fs.readFileSync(file, 'utf8').matchAll(/\bto="(\/[^"#]*)"/g)) links.push({ to, file: path.relative('.', file) })
  const missing = links.filter(({ to }) => !matchRoutes(routes, to))
  assert.deepEqual(missing, [])
  console.log(`Checked ${links.length} link destinations across ${seen.size} reachable source modules and ${routes.length} route patterns.`)
})
