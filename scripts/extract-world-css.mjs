// Extracts an ALLOWLIST of rule blocks (by selector prefix) from a sibling app's global index.css
// into a small per-world CSS file, safe to load globally for that world's lazy-loaded chunk.
//
// Rationale: excluding each sibling's entire global index.css (see consolidation notes on
// CSS-chunk bleed) was correct for the genuinely risky parts -- :root token redefinition, and
// re-styling classnames Cake's own canonical shell/shared components already own (.card, .btn,
// .page, .tag, top-nav-*, bottom-tab-bar, discover-feature-card, encyclopedia-card,
// curated-kitchen-*, affiliate-disclosure, etc.) -- but it also discarded legitimate,
// uniquely-named component styling (e.g. Cookies' .cookie-hero-image sizing) that happened to
// live in the same file, which is what caused images to render at unconstrained natural size.
// This does a much narrower, allowlist-based extraction: only rule blocks whose selector
// contains at least one of the given prefixes are kept, so nothing not explicitly asked for can
// leak through.
import fs from 'node:fs'

const [srcPath, outPath, prefixArg] = process.argv.slice(2)
if (!srcPath || !outPath || !prefixArg) {
  console.error('Usage: node scripts/extract-world-css.mjs <src.css> <out.css> <comma,separated,prefixes>')
  process.exit(1)
}

const prefixes = prefixArg.split(',')
const src = fs.readFileSync(srcPath, 'utf8')

// Split into top-level blocks (balanced braces at depth 0). Each block is either a plain rule
// (`selector { ... }`) or an at-rule with nested rules (`@media (...) { selector { ... } ... }`).
function splitTopLevelBlocks(text) {
  const blocks = []
  let depth = 0
  let start = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) {
        blocks.push(text.slice(start, i + 1))
        start = i + 1
      }
    }
  }
  return blocks
}

function blockMatches(block) {
  // For an @media block, check nested selectors too (keep the whole @media block if ANY nested
  // selector matches -- media queries here are always small and single-purpose in practice).
  return prefixes.some((p) => block.includes(`.${p}`))
}

const blocks = splitTopLevelBlocks(src)
const kept = blocks.filter(blockMatches)

const header = `/* Auto-extracted from ${srcPath.split('/').pop()} by scripts/extract-world-css.mjs.
   Allowlisted selector prefixes only: ${prefixes.join(', ')}. See that script for the rationale
   (narrow allowlist rather than the whole file, to avoid re-styling anything Cake's own shell/
   shared components or utility classes already own). */\n\n`

fs.writeFileSync(outPath, header + kept.join('\n\n') + '\n')
console.log(`Extracted ${kept.length} of ${blocks.length} top-level blocks -> ${outPath}`)
