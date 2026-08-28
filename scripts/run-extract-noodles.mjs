import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const prefixes = fs.readFileSync('scratch-noodles-prefixes.txt', 'utf8').trim()
execFileSync(
  'node',
  [
    'scripts/extract-world-css.mjs',
    'C:/Users/Jordann Lopez/Dev/Let Them Eat Noodles/src/index.css',
    'src/pages/noodles/noodles-content.css',
    prefixes,
  ],
  { stdio: 'inherit' },
)
