import fs from 'node:fs'

function collectCakeCssClasses() {
  const classes = new Set()
  for (const dir of ['src/components', 'src/pages']) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.css')) continue
      const content = fs.readFileSync(`${dir}/${f}`, 'utf8')
      for (const m of content.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) classes.add(m[1])
    }
  }
  return classes
}

function collectUsedClasses(dirs) {
  const classes = new Set()
  for (const dir of dirs) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.tsx')) continue
      const content = fs.readFileSync(`${dir}/${f}`, 'utf8')
      for (const m of content.matchAll(/className=\{?["'`]([^"'`]*)["'`]/g)) {
        for (const c of m[1].split(/\s+/)) if (c) classes.add(c)
      }
    }
  }
  return classes
}

const EXTRA_EXCLUDE = new Set(['card', 'btn', 'btn-secondary', 'tag', 'page', 'active'])

const cakeClasses = collectCakeCssClasses()
const usedClasses = collectUsedClasses(['src/pages/noodles', 'src/components/noodles'])

const safe = [...usedClasses].filter((c) => !cakeClasses.has(c) && !EXTRA_EXCLUDE.has(c))
const unsafe = [...usedClasses].filter((c) => cakeClasses.has(c) || EXTRA_EXCLUDE.has(c))

console.log('SAFE (' + safe.length + '):')
console.log(safe.sort().join(','))
console.log('\nEXCLUDED as Cake collisions (' + unsafe.length + '):')
console.log(unsafe.sort().join(', '))
