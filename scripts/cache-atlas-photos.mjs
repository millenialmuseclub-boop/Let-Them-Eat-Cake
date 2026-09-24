// Manual refresh of existing photographs; licenses checked on their Commons file pages, 2026-09-24.
// Never runs during a build. Retains source/author/license and creates only resized WebP copies.
import fs from 'node:fs'
import sharp from 'sharp'
import { getImageFor } from '../src/data/noodles/images.ts'
const cookieLicenses = {
  cookie_alfajor: ['CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/'],
  cookie_biscotti: ['CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'],
  cookie_chocolate_chip: ['CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'],
  cookie_scottish_shortbread: ['CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'],
  cookie_french_sable: ['CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'],
}
const cookieFile = 'src/data/cookies/cookieImages.json'
const cookies = JSON.parse(fs.readFileSync(cookieFile, 'utf8'))
const noodleFile = 'src/data/noodles/images.ts'
let noodleSource = fs.readFileSync(noodleFile, 'utf8')
const credits = JSON.parse(fs.readFileSync('public/photography/credits.json', 'utf8'))
const results = JSON.parse(fs.readFileSync('reports/atlas-photo-cache.json', 'utf8'))
const directSources = { 'bun-bo-hue': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bun_Bo_Hue_1.jpg', 'cao-lau': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Cao_Lau_Hoi_An.JPG', 'pho-bo': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Ph%E1%BB%9F_%C4%91%E1%BA%B7c_bi%E1%BB%87t.jpg' }
const selections = Object.entries(cookieLicenses).map(([id, [license, licenseUrl]]) => ({
  id, url: cookies[id].url, source: cookies[id].sourceUrl, author: cookies[id].photographer,
  name: id.replace('cookie_', '').replaceAll('_', ' '), world: 'Cookies', license, licenseUrl,
}))
for (const id of ['pho-bo', 'bun-bo-hue', 'cao-lau']) {
  const image = getImageFor(id)
  selections.push({ id, url: image.src, source: image.credit.sourceUrl, author: image.credit.creator,
    name: image.alt, world: 'Noodles', license: image.credit.license,
    licenseUrl: `https://creativecommons.org/licenses/${image.credit.license.includes('BY-SA') ? 'by-sa' : 'by'}/${image.credit.license.split(' ').at(-1)}/` })
}
for (const item of selections) {
  if (item.url.startsWith('/')) continue
  const previous = results.findIndex(result => result.id === item.id)
  if (previous >= 0) results.splice(previous, 1)
  try {
    const response = await fetch(directSources[item.id] ?? item.url, { signal: AbortSignal.timeout(25000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    const localUrl = `/photography/${item.id}.webp`
    await sharp(bytes).rotate().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${localUrl}`)
    if (item.world === 'Cookies') cookies[item.id] = { ...cookies[item.id], url: localUrl, license: item.license, licenseUrl: item.licenseUrl }
    else noodleSource = noodleSource.replace(`src: '${item.url}'`, `src: '${localUrl}'`)
    const credit = { ...item, title: item.name, description: item.name, localUrl, changes: 'Resized and converted to WebP; no content edits.' }
    const existing = credits.findIndex(c => c.id === item.id)
    if (existing >= 0) credits[existing] = credit; else credits.push(credit)
    results.push({ id: item.id, status: 'cached', bytes: fs.statSync(`public${localUrl}`).size })
    fs.writeFileSync(cookieFile, JSON.stringify(cookies, null, 2) + '\n')
    fs.writeFileSync(noodleFile, noodleSource)
    fs.writeFileSync('public/photography/credits.json', JSON.stringify(credits, null, 2) + '\n')
  } catch (error) { results.push({ id: item.id, status: error.message }) }
  console.log(results.at(-1))
}
fs.writeFileSync('reports/atlas-photo-cache.json', JSON.stringify(results, null, 2) + '\n')
