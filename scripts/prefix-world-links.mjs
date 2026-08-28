// Each sibling app's own router was mounted at "/", so its internal <Link to="/foo">,
// navigate('/foo'), and template-literal variants are absolute paths meaningful only within that
// app's own route space. Now that a world's Routes.tsx is mounted at /<world>/*, those same
// absolute paths need the /<world> prefix, or they'd navigate into Cake's (or another world's)
// route space instead. Scoped strictly to router-navigation call sites (`to=`, `navigate(`) so it
// never touches unrelated absolute paths like image `src`/`href` asset URLs.
import fs from 'node:fs'
import path from 'node:path'

const [world] = process.argv.slice(2)
if (!world) {
  console.error('Usage: node scripts/prefix-world-links.mjs <world>')
  process.exit(1)
}

const DIRS = [`src/pages/${world}`, `src/components/${world}`]

function rewrite(content) {
  let changed = false
  // to="/foo" or to='/foo'
  content = content.replace(/\bto=(["'])\/(?!\1)/g, (m, q) => {
    changed = true
    return `to=${q}/${world}/`
  })
  // to={`/foo${...}`}
  content = content.replace(/\bto=\{`\//g, () => {
    changed = true
    return `to={\`/${world}/`
  })
  // navigate('/foo') or navigate("/foo")
  content = content.replace(/\bnavigate\((["'])\//g, (m, q) => {
    changed = true
    return `navigate(${q}/${world}/`
  })
  // navigate(`/foo${...}`)
  content = content.replace(/\bnavigate\(`\//g, () => {
    changed = true
    return `navigate(\`/${world}/`
  })
  return { content, changed }
}

let count = 0
for (const dir of DIRS) {
  const full = path.join(process.cwd(), dir)
  if (!fs.existsSync(full)) continue
  for (const entry of fs.readdirSync(full)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue
    const file = path.join(full, entry)
    const original = fs.readFileSync(file, 'utf8')
    const { content, changed } = rewrite(original)
    if (changed) {
      fs.writeFileSync(file, content)
      count++
    }
  }
}
console.log(`Prefixed router links with /${world}/ in ${count} files.`)
