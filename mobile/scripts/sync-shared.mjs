// Syncs pure, platform-agnostic TypeScript and JSON from the frozen web app
// into mobile/src/shared. This is a deliberate copy, not a symlink or workspace
// link — Metro (React Native's bundler) and Vite (the web bundler) have
// different module resolution rules, so a real npm/pnpm workspace package is
// the correct long-term shared-package shape, but a documented, re-runnable
// copy step is the pragmatic Phase 1 choice: zero bundler-config risk to the
// frozen web app, and `npm run sync-shared` re-copies on demand whenever the
// web data/logic changes.
//
// Excluded on purpose: src/lib/analytics.ts and src/lib/notebook.ts both
// touch browser globals (window.plausible, localStorage) directly. Their
// *interface* is ported by hand into mobile/src/services (analyticsService,
// storageService) instead of copying browser-coupled code — see NATIVE_HANDOFF.md
// and the Phase 1 build report for why.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webSrc = path.resolve(__dirname, '../../src')
const mobileShared = path.resolve(__dirname, '../src/shared')

const EXCLUDED_LIB_FILES = new Set(['analytics.ts', 'notebook.ts'])

function copyDir(srcDir, destDir, { exclude = new Set(), extensions } = {}) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (exclude.has(entry.name)) continue
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, { exclude, extensions })
    } else if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

console.log('Syncing shared logic + data from ../src into src/shared ...')

copyDir(path.join(webSrc, 'lib'), path.join(mobileShared, 'lib'), {
  exclude: EXCLUDED_LIB_FILES,
  extensions: ['.ts'],
})
copyDir(path.join(webSrc, 'types'), path.join(mobileShared, 'types'), { extensions: ['.ts'] })
copyDir(path.join(webSrc, 'data'), path.join(mobileShared, 'data'), { extensions: ['.json'] })

const libCount = fs.readdirSync(path.join(mobileShared, 'lib')).length
const typesCount = fs.readdirSync(path.join(mobileShared, 'types')).length
const dataCount = fs.readdirSync(path.join(mobileShared, 'data')).length

console.log(`Done: ${libCount} lib files, ${typesCount} type files, ${dataCount} data files.`)
console.log('Excluded (browser-coupled, ported by hand instead):', [...EXCLUDED_LIB_FILES].join(', '))
