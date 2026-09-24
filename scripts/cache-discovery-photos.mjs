// Run manually once when refreshing existing editorial assets; never a network build step.
import fs from 'node:fs'
import sharp from 'sharp'
const selections = [
  ['src/data/cakeImages.json', 'cake_yellow_choc_1950s', 'Classic Yellow Layer Cake', 'Cake'],
  ['src/data/ramen/ramenImages.json', 'ramen_hakata_tonkotsu', 'Hakata Tonkotsu Ramen', 'Ramen'],
  ['src/data/ramen/ramenImages.json', 'ramen_sapporo_miso', 'Sapporo Miso Ramen', 'Ramen'],
  ['src/data/cookies/cookieImages.json', 'cookie_chocolate_chip', 'Chocolate Chip Cookie', 'Cookies'],
  ['src/data/cookies/cookieImages.json', 'cookie_scottish_shortbread', 'Scottish Shortbread', 'Cookies'],
  ['src/data/cookies/sceneImages.json', 'scene_dough_lab', 'Rolling cookie dough', 'Cookies'],
]
const credits = JSON.parse(fs.readFileSync('public/photography/credits.json', 'utf8'))
const summary = []
for (const [file, id, name, world] of selections) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  const image = data[id]
  if (!image || image.url.startsWith('/')) continue
  let license, licenseUrl
  if (image.source === 'Wikimedia Commons') {
    const title = decodeURIComponent(image.sourceUrl.split('/wiki/')[1]).replaceAll('_', ' ')
    const response = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(title)}`, { signal: AbortSignal.timeout(15000) })
    if (!response.ok) { summary.push({id, status: response.status}); continue }
    const body = await response.json()
    const metadata = Object.values(body.query?.pages ?? {})[0]?.imageinfo?.[0]?.extmetadata
    license = metadata?.LicenseShortName?.value
    licenseUrl = metadata?.LicenseUrl?.value
    if (!license || !licenseUrl || !/^CC (BY|0)/.test(license)) { summary.push({id, status: 'license needs review'}); continue }
  } else if (image.source === 'Pexels') {
    license = 'Pexels License'; licenseUrl = 'https://www.pexels.com/license/'
  } else if (image.unsplashUrl) {
    license = 'Unsplash License'; licenseUrl = 'https://unsplash.com/license'
  } else continue
  try {
    const response = await fetch(image.url, { signal: AbortSignal.timeout(20000) })
    if (!response.ok) { summary.push({id, status: response.status}); continue }
    const bytes = Buffer.from(await response.arrayBuffer())
    const localUrl = `/photography/${id}.webp`
    await sharp(bytes).rotate().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${localUrl}`)
    credits.push({ id, name, world, title: name, url: image.url, source: image.sourceUrl ?? image.unsplashUrl, author: image.photographer, license, licenseUrl, description: name, localUrl, changes: 'Resized and converted to WebP; no content edits.' })
    data[id] = { ...image, url: localUrl, license, licenseUrl }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
    fs.writeFileSync('public/photography/credits.json', JSON.stringify(credits, null, 2) + '\n')
    summary.push({id, bytes: fs.statSync(`public${localUrl}`).size, status: 'cached'})
  } catch (error) { summary.push({id, error: error.message}) }
}
fs.writeFileSync('reports/discovery-photo-cache.json', JSON.stringify(summary, null, 2))
console.log(JSON.stringify(summary, null, 2))
