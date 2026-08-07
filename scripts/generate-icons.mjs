// One-time script — rasterizes the master SVG icon into the standard sizes needed for
// favicon/PWA/iOS. Run with: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const masterPath = join(__dirname, '../public/icon-master.svg')
const outDir = join(__dirname, '../public/icons')

mkdirSync(outDir, { recursive: true })

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size } of targets) {
  await sharp(masterPath).resize(size, size).png().toFile(join(outDir, file))
  console.log(`Generated ${file} (${size}x${size})`)
}
