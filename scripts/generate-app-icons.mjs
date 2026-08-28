// Regenerates every platform icon asset from the new "Let Them Eat" master icon (black
// background, gold circular brushstroke, wordmark, fork+pasta). Only replaces image content and
// dimensions -- every existing file path/name/format is preserved so nothing needs re-wiring in
// native project files or React components that reference these paths.
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const SRC = 'C:/Users/Jordann Lopez/Downloads/Codex Image Aug 27, 2026, 04_46_55 PM.png'

async function resizeSquareTo(outPath, size) {
  await sharp(SRC).resize(size, size, { fit: 'cover' }).png().toFile(outPath)
  console.log('wrote', outPath, size, 'x', size)
}

async function main() {
  const srcBuf = await fs.readFile(SRC)

  // --- iOS: single 1024x1024 marketing/app icon (Xcode's single-size appiconset format) ---
  await resizeSquareTo(
    path.join(ROOT, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'),
    1024,
  )

  // --- Android: legacy square + adaptive foreground, at each existing density ---
  const densities = [
    { dir: 'mipmap-mdpi', legacy: 48, fg: 108 },
    { dir: 'mipmap-hdpi', legacy: 72, fg: 162 },
    { dir: 'mipmap-xhdpi', legacy: 96, fg: 216 },
    { dir: 'mipmap-xxhdpi', legacy: 144, fg: 324 },
    { dir: 'mipmap-xxxhdpi', legacy: 192, fg: 432 },
  ]
  for (const d of densities) {
    const base = path.join(ROOT, 'android/app/src/main/res', d.dir)
    await resizeSquareTo(path.join(base, 'ic_launcher.png'), d.legacy)
    await resizeSquareTo(path.join(base, 'ic_launcher_round.png'), d.legacy)
    // Foreground layer: cover-fit crop (same treatment as legacy) so the adaptive mask crops
    // consistently with the legacy icon instead of introducing extra letterboxing -- the source
    // icon is a solid, edge-to-edge design (no built-in safe-zone padding) so a plain cover-fit
    // keeps the wordmark/fork centered the way it appears in the legacy icon.
    await resizeSquareTo(path.join(base, 'ic_launcher_foreground.png'), d.fg)
  }

  // --- Web/PWA ---
  await resizeSquareTo(path.join(ROOT, 'public/icons/icon-192.png'), 192)
  await resizeSquareTo(path.join(ROOT, 'public/icons/icon-512.png'), 512)
  await resizeSquareTo(path.join(ROOT, 'public/apple-touch-icon.png'), 180)

  // --- App-shell SVG icons (icon-master.svg / icon-foreground.svg / favicon.svg) ---
  // These are referenced by path from React components (e.g. TopNavBar's `/icon-master.svg`)
  // and from index.html/manifest.json, so the file paths/extensions must stay the same. Since
  // the new master icon is a raster PNG (not vector art), each SVG becomes a thin vector wrapper
  // embedding the resized PNG as a base64 data URI -- same file path/extension, new visual
  // content, no React/HTML changes required.
  async function svgWrapper(size) {
    const resized = await sharp(srcBuf).resize(size, size, { fit: 'cover' }).png().toBuffer()
    const b64 = resized.toString('base64')
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">\n  <image href="data:image/png;base64,${b64}" width="${size}" height="${size}" />\n</svg>\n`
  }

  await fs.writeFile(path.join(ROOT, 'public/icon-master.svg'), await svgWrapper(256))
  await fs.writeFile(path.join(ROOT, 'public/icon-foreground.svg'), await svgWrapper(256))
  await fs.writeFile(path.join(ROOT, 'public/favicon.svg'), await svgWrapper(64))

  console.log('Icon regeneration complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
