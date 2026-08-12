import fs from 'node:fs'

const path = 'src/data/recipes.json'
const recipes = JSON.parse(fs.readFileSync(path, 'utf8'))

function byId(id) {
  const r = recipes.find((r) => r.id === id)
  if (!r) throw new Error('missing ' + id)
  return r
}

function pull(recipe, names, renameFn) {
  const out = []
  recipe.ingredients = recipe.ingredients.filter((ing) => {
    if (names.includes(ing.name)) {
      out.push({ ...ing, name: renameFn ? renameFn(ing.name) : ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  return out
}

function overview(recipe, fields) {
  Object.assign(recipe, { yield: recipe.baseServings, ...fields })
}

// 1. Bizcocho Dominicano — syrup soak is the real filling; meringue buttercream is the finish (also used between layers).
{
  const r = byId('recipe_bizcocho_dominicano')
  const syrup = pull(r, ['Granulated sugar (syrup)', 'Water (syrup)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  const buttercream = pull(r, ['Egg whites', 'Granulated sugar (frosting)', 'Butter (frosting)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Simple Syrup Soak',
    ingredients: syrup,
    prep: 'Simmer the syrup sugar and water into a light syrup.',
    applicationNotes: 'Brush over each cooled cake layer before frosting.',
  }
  r.frostingFinish = {
    name: 'Meringue Buttercream',
    ingredients: buttercream,
    prep: 'Whisk egg whites and sugar over a double boiler until warm, then whip to stiff peaks. Beat in the butter a little at a time until a smooth buttercream forms.',
    applicationNotes: 'Frost between the syrup-soaked layers and over the outside.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 22, panSize: 'Three 8-inch round pans', equipment: ['Oven', 'Three 8-inch round pans'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 2. Kouign-Amann — sugar folds into the lamination itself (already in base); no separate filling or applied finish.
{
  const r = byId('recipe_kouign_amann')
  r.filling = { none: true, note: 'The sugar is folded directly into the laminated layers during lamination, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'The caramelized, shattering-crisp exterior comes from the sugar caramelizing during baking, not from an applied glaze.' }
  overview(r, { ovenTempC: 220, ovenTempF: 425, bakeTimeMinutes: 22, panSize: 'Muffin tin', equipment: ['Oven', 'Rolling pin', 'Muffin tin'], storage: 'Best eaten the day it\'s baked; keeps at room temperature, loosely covered, for 1 day.' })
}

// 3. Mawa Cake — single loaf, no filling or finish.
{
  const r = byId('recipe_mawa_cake')
  r.filling = { none: true, note: 'A single loaf cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 42, panSize: 'Loaf pan', equipment: ['Oven', 'Loaf pan'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 4. Pandan Chiffon — single tube cake, no filling or finish.
{
  const r = byId('recipe_pandan_chiffon')
  r.filling = { none: true, note: 'A single chiffon cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, unfrosted, to let the pandan flavor and airy texture speak for themselves.' }
  overview(r, { ovenTempC: 165, ovenTempF: 325, bakeTimeMinutes: 47, panSize: 'Ungreased tube pan', equipment: ['Oven', 'Ungreased tube pan'], storage: 'Keeps at room temperature, covered, for 2-3 days.' })
}

// 5. Basbousa — no filling; hot syrup soak is the real finish.
{
  const r = byId('recipe_basbousa')
  const syrup = pull(r, ['Granulated sugar (syrup)', 'Water (syrup)', 'Lemon juice', 'Orange blossom water'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single-layer semolina cake, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Syrup Soak',
    ingredients: syrup,
    prep: 'Simmer the syrup sugar, water, lemon juice, and orange blossom water into a syrup.',
    applicationNotes: 'Pour the hot syrup over the cake as soon as it comes out of the oven, letting it soak in fully.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 32, panSize: 'Baking pan', equipment: ['Oven', 'Baking pan'], storage: 'Keeps at room temperature, covered, for 4-5 days — the syrup keeps it moist.' })
}

// 6. Japanese Soufflé Cheesecake — single cake, no filling or finish.
{
  const r = byId('recipe_japanese_souffle_cheesecake')
  r.filling = { none: true, note: 'A single soufflé-style cheesecake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping, to showcase its jiggly texture.' }
  overview(r, { ovenTempC: 160, ovenTempF: 320, bakeTimeMinutes: 67, panSize: 'Lined round pan + water bath', equipment: ['Oven', 'Round cake pan', 'Roasting pan for water bath'], storage: 'Refrigerate, covered, up to 3 days — best eaten within a day for peak jiggle.' })
}

// 7. Castella — single loaf, no filling or finish.
{
  const r = byId('recipe_castella')
  r.filling = { none: true, note: 'A single loaf cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 160, ovenTempF: 320, bakeTimeMinutes: 52, panSize: 'Loaf pan, parchment-lined above the rim', equipment: ['Oven', 'Loaf pan', 'Water bath setup'], storage: 'Keeps at room temperature, wrapped in plastic, for 2-3 days — the wrap keeps it moist.' })
}

// 8. Gooey Butter Cake — buttery base stays plain; cream cheese topping baked on top is the real finish.
{
  const r = byId('recipe_gooey_butter_cake')
  const topping = pull(r, ['Cream cheese', 'Butter, softened (topping)', 'Eggs, large (topping)', 'Vanilla extract', 'Powdered sugar'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single buttery base with a topping baked directly on top, so there is no separate filling.' }
  r.frostingFinish = {
    name: 'Cream Cheese Topping',
    ingredients: topping,
    prep: 'Beat the cream cheese and topping butter until smooth, add the topping eggs and vanilla, then beat in the powdered sugar until smooth.',
    applicationNotes: 'Pour over the pressed-in base before baking together; dust with powdered sugar once cooled.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 42, panSize: '9x13-inch pan', equipment: ['Oven', '9x13-inch pan'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 9. Malva Pudding — no filling; the hot butter sauce soak is the real finish.
{
  const r = byId('recipe_malva_pudding')
  const sauce = pull(r, ['Heavy cream (sauce)', 'Butter (sauce)', 'Granulated sugar (sauce)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single baked pudding with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Hot Butter Sauce',
    ingredients: sauce,
    prep: 'Warm the sauce cream, sauce butter, and sauce sugar together until the butter melts.',
    applicationNotes: 'Pour the hot sauce evenly over the pudding as soon as it comes out of the oven, letting it soak in completely.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Baking dish', equipment: ['Oven', 'Baking dish'], storage: 'Keeps refrigerated, covered, for 3-4 days — best served warm.' })
}

// 10. Pavlova — no filling; whipped cream and passionfruit topping is the real finish.
{
  const r = byId('recipe_pavlova')
  const topping = pull(r, ['Heavy cream, whipped', 'Passionfruit pulp (or seasonal fruit)'], (n) => (n === 'Heavy cream, whipped' ? 'Heavy cream' : n))
  r.filling = { none: true, note: 'A single meringue base with no internal filling.' }
  r.frostingFinish = {
    name: 'Whipped Cream & Passionfruit',
    ingredients: topping,
    prep: 'Whip the cream to soft peaks.',
    applicationNotes: 'Top with whipped cream and passionfruit (or other fresh fruit) just before serving.',
  }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 68, panSize: 'Baking sheet (9-inch circle)', equipment: ['Oven', 'Baking sheet', 'Parchment paper'], storage: 'Assemble just before serving — the meringue softens once topped.' })
}

// 11. Sernik — crust and cheese filling are both structural, not a separable "filling" in the layered sense; no applied finish.
{
  const r = byId('recipe_sernik')
  r.filling = { none: true, note: 'The cheese custard is the cake itself, poured directly over the crust rather than sandwiched as a separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { ovenTempC: 165, ovenTempF: 330, bakeTimeMinutes: 62, panSize: '9-inch springform pan', equipment: ['Oven', '9-inch springform pan'], storage: 'Refrigerate, covered, up to 5 days.' })
}

// 12. Revani — no filling; lemon syrup soak is the real finish.
{
  const r = byId('recipe_revani')
  const syrup = pull(r, ['Granulated sugar (syrup)', 'Water (syrup)', 'Lemon juice'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single semolina cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Lemon Syrup Soak',
    ingredients: syrup,
    prep: 'Simmer the syrup sugar, water, and lemon juice into a syrup.',
    applicationNotes: 'Pour the cooled syrup over the hot cake as soon as it comes out of the oven and let it fully absorb before slicing.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 32, panSize: 'Baking pan', equipment: ['Oven', 'Baking pan'], storage: 'Keeps at room temperature, covered, for 4-5 days — the syrup keeps it moist.' })
}

// 13. Karydopita — no filling; spiced honey syrup soak is the real finish.
{
  const r = byId('recipe_karydopita')
  const syrup = pull(r, ['Granulated sugar (syrup)', 'Water (syrup)', 'Honey (syrup)', 'Cinnamon stick (syrup)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single walnut cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Spiced Honey Syrup',
    ingredients: syrup,
    prep: 'Simmer the syrup sugar, water, honey, and cinnamon stick into a syrup.',
    applicationNotes: 'Pour the warm syrup over the hot cake and let it soak in fully before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Baking pan', equipment: ['Oven', 'Baking pan'], storage: 'Keeps at room temperature, covered, for 5-6 days — the syrup keeps it moist.' })
}

// 14. Moroccan Orange & Almond Cake — single flourless cake, no filling or finish.
{
  const r = byId('recipe_moroccan_orange_almond')
  r.filling = { none: true, note: 'A single flourless cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 52, panSize: '9-inch springform pan', equipment: ['Oven', '9-inch springform pan', 'Food processor'], storage: 'Refrigerate, covered, up to 4 days — it stays moist thanks to the orange purée.' })
}

// 15. Persian Love Cake — no filling; pistachio topping is a real minimal finish.
{
  const r = byId('recipe_persian_love_cake')
  const topping = pull(r, ['Pistachios, chopped (topping)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Pistachio Topping',
    ingredients: topping,
    prep: 'No preparation needed.',
    applicationNotes: 'Scatter over the cooled cake along with dried rose petals, if available, before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: '9-inch round pan', equipment: ['Oven', '9-inch round pan'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 16. Mooncake — lotus paste and salted egg yolk are the real filling; egg wash is the real finish.
{
  const r = byId('recipe_mooncake')
  const filling = pull(r, ['Lotus seed paste', 'Salted egg yolks'])
  const wash = pull(r, ['Egg yolk (wash)', 'Water (wash)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Lotus Paste & Salted Egg Yolk',
    ingredients: filling,
    prep: 'Divide the lotus seed paste into portions and wrap each around a salted egg yolk.',
    applicationNotes: 'Wrap the dough completely around each lotus-paste ball, sealing fully before pressing into the mold.',
  }
  r.frostingFinish = {
    name: 'Egg Wash',
    ingredients: wash,
    prep: 'Whisk the egg yolk and water together.',
    applicationNotes: 'Brush over the shaped mooncakes partway through baking for a glossy finish.',
  }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 20, panSize: 'Mooncake mold + baking sheet', equipment: ['Oven', 'Mooncake mold', 'Baking sheet'], storage: 'Keeps at room temperature, wrapped, for about a week — flavor improves after 1-2 days as the crust softens.' })
}

// 17. Korean Strawberry Cream Cake — whipped cream and strawberries double as filling and frosting.
{
  const r = byId('recipe_korean_strawberry_cream')
  const finish = pull(r, ['Heavy cream', 'Sugar (for cream)', 'Fresh strawberries'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'The whipped cream and strawberries are used both between the layers and over the outside, so there is no separate filling.' }
  r.frostingFinish = {
    name: 'Whipped Cream & Strawberries',
    ingredients: finish,
    prep: 'Whip the cream and sugar to stiff peaks.',
    applicationNotes: 'Stack the sliced layers with whipped cream and sliced strawberries between each, then frost the outside smooth and decorate with whole strawberries.',
  }
  overview(r, { ovenTempC: 165, ovenTempF: 330, bakeTimeMinutes: 26, panSize: '8-inch round pan', equipment: ['Oven', '8-inch round pan'], storage: 'Refrigerate, covered, up to 3 days — fresh strawberries mean it doesn\'t keep as long as most layer cakes.' })
}

// 18. Ube Cake — ube buttercream doubles as filling and frosting.
{
  const r = byId('recipe_ube_cake')
  const frosting = pull(r, ['Butter (frosting)', 'Powdered sugar', 'Ube halaya (frosting)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'The ube buttercream is spread between the layers as well as over the outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Ube Buttercream',
    ingredients: frosting,
    prep: 'Beat the frosting butter, powdered sugar, and ube halaya together until smooth and evenly colored.',
    applicationNotes: 'Frost between the layers and over the outside.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 30, panSize: 'Two 8-inch round pans', equipment: ['Oven', 'Two 8-inch round pans'], storage: 'Refrigerate, covered, up to 4 days.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
