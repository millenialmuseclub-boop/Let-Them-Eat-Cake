import fs from 'node:fs'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844}});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));const results=[]
const go=async route=>{await p.goto('http://127.0.0.1:5173'+route);await p.locator('h1').first().waitFor()}
try {
 for(const [route,label] of [['/cake/cake_black_forest','Save to favorites'],['/ramen/ramen/ramen_sapporo_miso','★ Favorite'],['/cookies/encyclopedia/cookie_chocolate_chip','Favorite'],['/noodles/encyclopedia/pho-bo','Favorite']]) {
  await go(route);const button=p.getByRole('button',{name:label,exact:true});await button.click();await p.reload();await p.locator('h1').first().waitFor();assert.equal(await p.locator('button[aria-pressed="true"]').count()>0,true,route);results.push({check:'save persists after reload',route,passed:true})
 }
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('letThemEat.savedItems.v1')).items.length),4)
 await p.getByRole('link',{name:'Let Them Eat — Home',exact:true}).click();await p.getByRole('navigation',{name:'Worlds'}).getByRole('link',{name:'Cookies',exact:true}).click();await p.getByRole('link',{name:'Saved Cookies',exact:true}).click();await p.waitForURL('**/cookies/my-cookies');await p.getByRole('heading',{name:'My Cookies',exact:true}).waitFor();assert.match(await p.locator('body').innerText(),/Chocolate Chip/);results.push({check:'world switching and saved library',passed:true})
 for(const [route,app] of [['/ramen/atlas','rallii'],['/noodles/atlas','rallii'],['/celebrate','luxejetter']]) {
  await go(route);const link=p.locator('.companion-app a');assert.equal(await link.getAttribute('href'),app==='rallii'?'https://apps.apple.com/us/app/rallii/id6804085679':'https://apps.apple.com/us/app/luxejetter/id6808023085');await link.scrollIntoViewIfNeeded();await p.screenshot({path:`reports/companion-${app}-${route.split('/')[1]}.png`});results.push({check:'companion link',route,passed:true})
 }
 for(const route of ['/ramen/broth-lab','/cookies/workshop/labs/dough-lab','/noodles/workshop/lab/hydration-lab','/noodles/workshop/lab/rice-noodle-lab','/noodles/workshop/lab/hand-pulled-lab']){
  await go(route);assert.equal(await p.locator('.curated-kitchen-section .affiliate-disclosure').count(),1);results.push({check:'contextual offers and disclosure',route,passed:true})
 }
 await c.route('https://**/*',r=>r.abort())
 for(const route of ['/','/sommelier','/ingredients','/cookies/workshop','/noodles/atlas','/ramen/curated-kitchen']) {
  await go(route);await p.locator('img').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));await p.waitForTimeout(600);assert.equal(await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&!i.naturalWidth).length),0,route);results.push({check:'failed images use fallback',route,passed:true})
 }
 await go('/');await p.waitForTimeout(400);await p.screenshot({path:'reports/fallback-mobile.png'})
 assert.deepEqual(errors,[])
} catch(e){results.push({failure:e.message});process.exitCode=1}
await b.close();fs.writeFileSync('reports/interaction-audit.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify(results,null,2))
