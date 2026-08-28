import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const prefixes = fs.readFileSync('scratch-cookies-prefixes.txt', 'utf8').trim()
execFileSync(
  'node',
  [
    'scripts/extract-world-css.mjs',
    'C:/Users/Jordann Lopez/Dev/Let Them Eat Cookies/letthemeatcookies/src/index.css',
    'src/pages/cookies/cookies-content.css',
    prefixes,
  ],
  { stdio: 'inherit' },
)
