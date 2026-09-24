import fs from 'node:fs'
import path from 'node:path'
const origin = 'https://letthemeatcake.netlify.app'
const foods = JSON.parse(fs.readFileSync('src/data/foodSearch.json', 'utf8'))
const template = fs.readFileSync('dist/index.html', 'utf8')
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const pages = [{ path: '/', name: 'Let Them Eat', description: 'Explore Cake, Cookies, Ramen and Noodles through flavor, culture and hands-on learning.' },
  { path: '/atlas', name: 'World Food Atlas', description: 'The world, one bite at a time. Explore food through geography, regional traditions and the stories behind the flavor.', image: '/photography/ramen_sapporo_miso.webp' },
  { path: '/explore', name: 'Explore food, flavor & place', description: `Discover ${foods.length} foods across four worlds. Search by ingredient, texture, technique or place.`, lesson: 'Follow an ingredient from one food tradition to another.', links: foods }, ...foods]
for (const item of pages) {
  const url = origin + item.path
  const title = item.name === 'Let Them Eat' ? item.name : `${item.name} | Let Them Eat`
  const description = item.description.slice(0, 220)
  const image = item.image ? new URL(item.image, origin).href : `${origin}/icons/icon-512.png`
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
  for (const [selector, content] of [['name="description"', description], ['property="og:title"', title], ['property="og:description"', description], ['property="og:image"', image], ['name="twitter:title"', title], ['name="twitter:description"', description], ['name="twitter:image"', image], ['name="twitter:card"', 'summary_large_image']]) {
    html = html.replace(new RegExp(`<meta\\s+${selector}\\s+content="[^"]*"\\s*/?>`), `<meta ${selector} content="${escape(content)}" />`)
  }
  html = html.replace('</head>', `<link rel="canonical" href="${escape(url)}" /><meta property="og:url" content="${escape(url)}" /></head>`)
  // Real existing content for no-JS readers; React replaces this on boot. No duplicate articles.
  const body = `<main><a href="/">Let Them Eat</a><h1>${escape(item.name)}</h1>${item.place ? `<p>${escape(item.place)}</p>` : ''}<p>${escape(item.description)}</p>${item.lesson ? `<h2>What makes it different?</h2><p>${escape(item.lesson)}</p>` : ''}<a href="/explore">Explore all foods</a>${item.links ? `<ul>${item.links.map(food => `<li><a href="${food.path}">${escape(food.name)}</a></li>`).join('')}</ul>` : ''}<p>Open the interactive guide for the full story, recipes and learning tools.</p></main>`
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const directory = path.join('dist', item.path.slice(1))
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'index.html'), html)
}
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(item => `<url><loc>${origin}${item.path}</loc></url>`).join('')}</urlset>`)
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
console.log(`Prepared metadata and readable HTML for ${pages.length} existing routes`)
