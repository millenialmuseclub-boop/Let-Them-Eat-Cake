// Mechanical copy + import-path-rewrite step for porting one sibling app's content into its
// per-world subfolder here (src/{pages,lib,data,types,components}/<world>/). All four repos put
// pages/lib/data/types/components directly under src/, one level deep, so the transform is
// uniform no matter which of those five folders a file lives in:
//   '../lib/Y'        -> '../../lib/<world>/Y'        (world-specific)
//   '../lib/Y'        -> '../../lib/Y'                (shared/canonical, no subfolder)
// Run: node scripts/port-world.mjs <world> <sourceSrcDir>
import fs from 'node:fs'
import path from 'node:path'

const [world, srcRoot] = process.argv.slice(2)
if (!world || !srcRoot) {
  console.error('Usage: node scripts/port-world.mjs <world> <path-to-sibling-repo-src>')
  process.exit(1)
}

const TARGET_ROOT = path.join(process.cwd(), 'src')
const CATEGORIES = ['pages', 'lib', 'data', 'types', 'components']

// Module basenames that resolve to Cake's shared/canonical top-level implementation instead of
// a per-world copy. Extend this list per-world via SHARED_EXTRA below.
const SHARED = {
  lib: new Set(['useDocumentTitle', 'products']),
  types: new Set(['product']),
  // FlavorProfileBars is intentionally NOT shared -- each world has genuinely different flavor
  // dimensions (Cake: sweetness/fatRichness/acidity/intensity; Ramen: richness/intensity/heat/
  // umami; Cookies: sweetness/richness/crispness/spice; Noodles: brothiness/boldness/richness/
  // chewiness/spice), so collapsing them into one shared component/type would flatten each
  // world's real domain model -- exactly what the merge is explicitly not supposed to do.
  components: new Set(['ContextualCuratedKitchen', 'AffiliateDisclosure', 'BottomTabBar', 'TopNavBar', 'FloatingBackButton']),
  data: new Set([]),
  pages: new Set([]),
}

function rewriteImports(content) {
  // Matches both `from '../lib/x'` and bare side-effect imports `import '../components/x.css'`.
  return content.replace(
    /\b(from|import)(\s*)(['"])\.\.\/(lib|types|data|components)\/([^'"]+)\3/g,
    (full, keyword, space, quote, category, modulePath) => {
      const basename = modulePath.split('/')[0].replace(/\.(json|css|tsx?|ts)$/, '')
      const isShared = SHARED[category]?.has(basename)
      const target = isShared ? `../../${category}/${modulePath}` : `../../${category}/${world}/${modulePath}`
      return `${keyword}${space}${quote}${target}${quote}`
    },
  )
}

let copied = 0
for (const category of CATEGORIES) {
  const srcDir = path.join(srcRoot, category)
  if (!fs.existsSync(srcDir)) continue
  const destDir = path.join(TARGET_ROOT, category, world)
  fs.mkdirSync(destDir, { recursive: true })
  for (const entry of fs.readdirSync(srcDir)) {
    const srcFile = path.join(srcDir, entry)
    if (fs.statSync(srcFile).isDirectory()) continue
    const destFile = path.join(destDir, entry)
    let content = fs.readFileSync(srcFile, 'utf8')
    if (/\.(tsx?|css)$/.test(entry)) {
      content = rewriteImports(content)
    }
    fs.writeFileSync(destFile, content)
    copied++
  }
}
console.log(`Ported ${copied} files for world "${world}" from ${srcRoot}`)
