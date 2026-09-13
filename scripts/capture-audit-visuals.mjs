import {chromium} from 'playwright'
const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}})
for(const [name,route] of [['home','/'],['cake','/discover'],['ramen','/ramen'],['cookies','/cookies'],['noodles','/noodles'],['celebrate','/celebrate'],['atlas','/noodles/atlas']]){
 await p.goto('http://127.0.0.1:5173'+route,{waitUntil:'domcontentloaded'});await p.locator('h1').first().waitFor();await p.waitForTimeout(800);await p.screenshot({path:`reports/visual-${name}-mobile.png`})
}
await b.close()
