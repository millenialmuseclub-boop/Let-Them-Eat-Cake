// Replaces leftover standalone-app branding strings ("Let Them Eat Ramen"/"Let Them Eat
// Cookies"/"Let Them Eat Noodles") carried over verbatim from each sibling app's own copy with
// the merged app's actual name, "Let Them Eat" -- these are document titles, About/legal page
// prose, etc. that read as if each world were still its own separate app.
import fs from 'node:fs'
import path from 'node:path'

const REPLACEMENTS = [
  [/Let Them Eat Ramen/g, 'Let Them Eat'],
  [/Let Them Eat Cookies/g, 'Let Them Eat'],
  [/Let Them Eat Noodles/g, 'Let Them Eat'],
]

const DIRS = [
  'src/pages/ramen',
  'src/pages/cookies',
  'src/pages/noodles',
  'src/components/ramen',
  'src/components/cookies',
  'src/components/noodles',
  'src/lib/ramen',
  'src/lib/cookies',
  'src/lib/noodles',
]

let filesChanged = 0
for (const dir of DIRS) {
  const full = path.join(process.cwd(), dir)
  if (!fs.existsSync(full)) continue
  for (const entry of fs.readdirSync(full)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue
    const file = path.join(full, entry)
    const original = fs.readFileSync(file, 'utf8')
    let content = original
    for (const [pattern, replacement] of REPLACEMENTS) content = content.replace(pattern, replacement)
    if (content !== original) {
      fs.writeFileSync(file, content)
      filesChanged++
    }
  }
}
console.log(`Rebranded strings in ${filesChanged} files.`)
