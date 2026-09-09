import fs from 'node:fs'
import sharp from 'sharp'
import { setTimeout as pause } from 'node:timers/promises'

// Reviewed Commons file descriptions identify these specific dishes, not generic lookalikes.
const selected = {
  ramen_niigata_shoyu: 'File:Niboshi Shoyu Ramen, Nishimaki-ryu, Niigata, Niigata, Japan, November 2021.jpg',
  cookie_marranitos: 'File:Galletas de puerquitos de la dulceria de celaya en la Colonia Roma.jpg',
  cake_nanaimo_bar: 'File:Nanaimo bar.JPG',
  cake_paris_brest: 'File:Paris-brest 1.jpg',
  cake_dundee_cake: 'File:North British Dundee cake.JPG',
  cake_vinarterta: 'File:Vínarterta.JPG',
  cake_galette_des_rois: 'File:Galette des rois dllu.jpg',
  cake_clootie_dumpling: 'File:Clootie dumpling.jpg',
  ramen_hakodate_shio: 'File:Hakodate-Shio-Ramen.png',
  ramen_kitakata: 'File:Kitakata ramen by macyu in Yamagata.jpg',
  ramen_asahikawa: 'File:Asahikawa Tenkin Shoyu Ramen.jpg',
  ramen_onomichi: 'File:Onomichi ramen by chicatan.jpg',
  ramen_wakayama: 'File:Wakayamaramen222.jpg',
  ramen_toyama_black: 'File:Toyama Black Daiki.jpg',
  ramen_kagoshima: 'File:Kagoshima Ramen.jpg',
  ramen_yonezawa: 'File:米沢ラーメン.jpg',
  ramen_muroran_curry: 'File:Muroran-CurryRamen.jpg',
  ramen_sano: 'File:Sano ramen 001.jpg',
  ramen_tokyo_abura_soba: 'File:Abura soba 01.jpg',
  cookie_barazek: 'File:Barazeq.jpg',
}
const candidates = JSON.parse(fs.readFileSync('reports/photo-candidates.json', 'utf8'))
fs.mkdirSync('public/photography', { recursive: true })
const records = fs.existsSync('public/photography/credits.json') ? JSON.parse(fs.readFileSync('public/photography/credits.json', 'utf8')) : []
for (const [id, title] of Object.entries(selected)) {
  if (records.some((record) => record.id === id)) continue
  const item = candidates.find((item) => item.id === id)
  const image = item.candidates.find((image) => image.title === title)
  if (!image?.author || !image.license || !image.source) throw new Error(`Incomplete attribution: ${id}`)
  await pause(6500)
  const response = await fetch(image.thumb ?? image.url, { signal: AbortSignal.timeout(20000) })
  if (response.status === 429) { console.log('Rate limited; stopped downloading.'); break }
  if (!response.ok) { console.log(id, response.status); continue }
  const buffer = Buffer.from(await response.arrayBuffer())
  const metadata = await sharp(buffer).metadata()
  if (Math.min(metadata.width, metadata.height) < 300) { console.log(id, 'Source too small'); continue }
  const output = `public/photography/${id}.webp`
  await sharp(buffer).rotate().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 83 }).toFile(output)
  records.push({ id, name: item.name, world: item.world, ...image, localUrl: `/photography/${id}.webp`, changes: 'Resized and converted to WebP; no content edits.' })
  fs.writeFileSync('public/photography/credits.json', JSON.stringify(records, null, 2) + '\n')
  console.log(id, fs.statSync(output).size)
}
const tiles = []
for (let i = 0; i < records.length; i++) {
  const image = await sharp(`public${records[i].localUrl}`).resize(240, 165, { fit: 'contain', background: '#fff8f0' }).png().toBuffer()
  const label = Buffer.from(`<svg width="240" height="30"><rect width="240" height="30" fill="white"/><text x="8" y="19" font-size="12">${i + 1}. ${records[i].id.replaceAll('_', ' ')}</text></svg>`)
  tiles.push({ input: image, left: (i % 4) * 240, top: Math.floor(i / 4) * 195 }, { input: label, left: (i % 4) * 240, top: Math.floor(i / 4) * 195 + 165 })
}
if (tiles.length) await sharp({ create: { width: 960, height: Math.ceil(records.length / 4) * 195, channels: 3, background: '#fff8f0' } }).composite(tiles).png().toFile('reports/photo-review.png')
