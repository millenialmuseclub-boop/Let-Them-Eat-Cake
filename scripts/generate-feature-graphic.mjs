// One-time script — renders the 1024x500 Play Store feature graphic from an inline SVG.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../play-store-assets/feature-graphic')
mkdirSync(outDir, { recursive: true })

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff8f0" />
      <stop offset="1" stop-color="#ffe9ef" />
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)" />

  <!-- decorative cake icon, left -->
  <g transform="translate(60,130) scale(2.4)">
    <rect width="100" height="100" rx="22" fill="#ffffff" />
    <rect x="20" y="58" width="60" height="22" rx="5" fill="#e88d9e" />
    <rect x="32" y="38" width="36" height="20" rx="5" fill="#e88d9e" />
    <rect x="18" y="56" width="64" height="4" rx="2" fill="#3d2314" opacity="0.15" />
    <rect x="30" y="36" width="40" height="4" rx="2" fill="#3d2314" opacity="0.15" />
    <rect x="48" y="20" width="4" height="16" rx="2" fill="#3d2314" />
    <path d="M50 12c3 3 3 6 0 9-3-3-3-6 0-9z" fill="#d4af37" />
  </g>

  <text x="370" y="230" font-family="Georgia, 'Times New Roman', serif" font-size="60" fill="#3d2314" font-weight="700">Let Them Eat Cake</text>
  <text x="370" y="280" font-family="system-ui, sans-serif" font-size="28" fill="#3d2314" opacity="0.75">The world's cake encyclopedia &amp; sommelier</text>
  <text x="370" y="322" font-family="system-ui, sans-serif" font-size="22" fill="#3d2314" opacity="0.55">History · Flavor Pairings · Recipes</text>

  <circle cx="980" cy="50" r="10" fill="#d4af37" opacity="0.8" />
  <circle cx="990" cy="450" r="16" fill="#e88d9e" opacity="0.6" />
  <circle cx="40" cy="460" r="8" fill="#d4af37" opacity="0.6" />
  <circle cx="440" cy="70" r="6" fill="#e88d9e" opacity="0.5" />
</svg>
`

await sharp(Buffer.from(svg)).resize(1024, 500).png().toFile(join(outDir, 'feature-graphic.png'))
console.log('Generated feature-graphic.png (1024x500)')
