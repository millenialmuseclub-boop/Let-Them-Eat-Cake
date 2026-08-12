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

// 1. Medovik — sour cream frosting doubles as filling.
{
  const r = byId('recipe_medovik')
  const frosting = pull(r, ['Powdered sugar', 'Heavy cream', 'Sour cream'])
  r.filling = { none: true, note: 'The sour cream frosting is spread between the layers as well as over the outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Sour Cream Frosting',
    ingredients: frosting,
    prep: 'Whip the sour cream, powdered sugar, and heavy cream together into a smooth frosting.',
    applicationNotes: 'Stack the layers with frosting between each, frost the outside, then press the reserved baked crumbs onto the sides.',
    chillGuidance: 'Refrigerate at least 8 hours, ideally overnight, so the layers soften into a torte before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 5, panSize: 'Baking sheet (8 thin layers)', equipment: ['Oven', 'Rolling pin', 'Baking sheet'], storage: 'Refrigerate, covered, up to 5 days — it improves as it sits.' })
}

// 2. Nanaimo Bar — three genuine stacked layers: base (stays plain), custard filling, chocolate topping.
{
  const r = byId('recipe_nanaimo_bar')
  const filling = pull(r, ['Butter (filling)', 'Custard powder', 'Powdered sugar (filling)', 'Milk (filling)'])
  const topping = pull(r, ['Dark chocolate (topping)', 'Butter (topping)'])
  r.filling = {
    name: 'Custard Filling',
    ingredients: filling,
    prep: 'Beat the filling butter, custard powder, filling sugar, and filling milk together until smooth and spreadable.',
    applicationNotes: 'Spread over the chilled crumb base.',
    chillGuidance: 'Chill again until firm before adding the chocolate topping.',
  }
  r.frostingFinish = {
    name: 'Chocolate Topping',
    ingredients: topping,
    prep: 'Melt the topping chocolate and butter together.',
    applicationNotes: 'Pour over the set custard layer, tilting to cover evenly.',
    chillGuidance: 'Chill until the chocolate sets before cutting into bars.',
  }
  overview(r, { panSize: '9-inch square pan', equipment: ['9-inch square pan', 'Saucepan'], storage: 'Refrigerate, covered, up to 2 weeks — best kept cold since it never gets baked.' })
}

// 3. Linzer Torte — redcurrant jam filling under a pastry lattice, no separate frosting.
{
  const r = byId('recipe_linzer_torte')
  const jam = pull(r, ['Redcurrant jam'])
  r.filling = {
    name: 'Redcurrant Jam',
    ingredients: jam,
    prep: 'No cooking required — the jam is used as-is.',
    applicationNotes: 'Spread over the pressed-in dough before topping with the lattice.',
  }
  r.frostingFinish = { none: true, note: 'Finished simply with its own pastry lattice on top rather than a separate frosting or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Tart pan', equipment: ['Oven', 'Tart pan', 'Rolling pin'], storage: 'Keeps at room temperature, covered, for 4-5 days — traditionally made a day ahead.' })
}

// 4. Tarta de Santiago — no filling, powdered-sugar stencil dusting finish.
{
  const r = byId('recipe_tarta_de_santiago')
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = { none: true, note: 'A single-layer almond cake, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Powdered Sugar Stencil',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Lay a Cross of Saint James stencil over the top and dust generously with powdered sugar, then lift the stencil away.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan', 'Cross of Saint James stencil'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 5. Dundee Cake — no filling; almonds bake into the top rather than a finish applied after.
{
  const r = byId('recipe_dundee_cake')
  r.filling = { none: true, note: 'A single fruitcake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Finished with a ring of whole almonds pressed onto the top before baking, rather than a separate icing — traditional Dundee cake is never iced.' }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 105, panSize: 'Deep round cake pan', equipment: ['Oven', 'Deep round cake pan'], storage: 'Keeps at room temperature, wrapped, for 2-3 weeks — it improves with age like most fruitcakes.' })
}

// 6. Prinsesstarta — jam + pastry cream as the internal filling; whipped-cream dome + marzipan drape as the finish.
{
  const r = byId('recipe_prinsesstarta')
  const filling = pull(r, ['Raspberry jam', 'Milk (pastry cream)', 'Egg yolks (pastry cream)', 'Granulated sugar (pastry cream)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  const finish = pull(r, ['Heavy cream, whipped', 'Green marzipan'], (n) => (n === 'Heavy cream, whipped' ? 'Heavy cream' : n))
  r.filling = {
    name: 'Jam & Pastry Cream',
    ingredients: filling,
    prep: 'Whisk the egg yolks and sugar, temper with hot milk, and cook until thick. Cool completely before assembling.',
    applicationNotes: 'Spread jam over the bottom sponge layer, then spread pastry cream over the middle layer.',
  }
  r.frostingFinish = {
    name: 'Whipped Cream Dome & Marzipan',
    ingredients: finish,
    prep: 'Whip the cream to stiff peaks. Roll the marzipan into a large circle.',
    applicationNotes: 'Mound the whipped cream over the top layer into a dome shape, chill until firm, then drape the marzipan over the dome, smoothing down the sides and trimming the base. Finish with a small marzipan rose on top.',
    chillGuidance: 'Chill the domed cake until firm before draping with marzipan.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 25, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan', 'Rolling pin'], storage: 'Refrigerate, covered, up to 2 days.' })
}

// 7. Jamaican Black Cake — no separate filling (fruit is folded into the batter) or frosting.
{
  const r = byId('recipe_jamaican_black_cake')
  r.filling = { none: true, note: 'The soaked fruit is blended into a paste and folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: "Traditionally left unfrosted — sometimes 'fed' with a little more rum after baking, but never iced." }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 120, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan', 'Blender'], storage: "Wrapped tightly, keeps for weeks at room temperature and improves with age — often 'fed' with rum every few days." })
}

// 8. Torta Caprese — flourless, no filling, powdered sugar dusting finish.
{
  const r = byId('recipe_torta_caprese')
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = { none: true, note: 'A single flourless chocolate-almond cake, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Powdered Sugar Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust over the cooled cake just before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 9. Panforte — no filling; the traditional powdered-sugar dusting isn't a tracked ingredient in this data, so leave the finish as an honest "none" rather than inventing a quantity.
{
  const r = byId('recipe_panforte')
  r.filling = { none: true, note: 'A dense, sliceable confection with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally finished with a dusting of powdered sugar rather than a frosting.' }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 32, panSize: 'Round pan, lined with rice paper or parchment', equipment: ['Oven', 'Candy thermometer', 'Round pan'], storage: 'Keeps at room temperature, wrapped, for several weeks — it only improves with age.' })
}

// 10. Galette des Rois — frangipane filling, egg wash finish.
{
  const r = byId('recipe_galette_des_rois')
  const frangipane = pull(r, ['Almond flour', 'Butter, softened', 'Granulated sugar', 'Eggs, large', 'Almond extract'])
  const eggWash = pull(r, ['Egg (for egg wash)'], () => 'Egg')
  r.filling = {
    name: 'Frangipane',
    ingredients: frangipane,
    prep: 'Beat the butter and sugar together, then beat in the eggs and almond extract, and fold in the almond flour.',
    applicationNotes: 'Spread in the center of the first pastry sheet, leaving a border, and tuck in a small charm or dried bean before sealing with the second sheet.',
  }
  r.frostingFinish = {
    name: 'Egg Wash',
    ingredients: eggWash,
    prep: 'Beat the egg.',
    applicationNotes: 'Brush over the top before baking, after scoring a decorative pattern.',
  }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 27, panSize: 'Baking sheet', equipment: ['Oven', 'Baking sheet', 'Pastry brush'], storage: 'Best eaten the day it\'s baked; keeps at room temperature, loosely covered, for 1-2 days.' })
}

// 11. Smith Island Cake — fudge frosting doubles as filling between the many thin layers.
{
  const r = byId('recipe_smith_island')
  const frosting = pull(r, ['Dark chocolate (frosting)', 'Heavy cream (frosting)'])
  r.filling = { none: true, note: 'The fudge frosting is spread thinly between every layer as well as over the outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Chocolate Fudge Frosting',
    ingredients: frosting,
    prep: 'Melt the chocolate with the cream until smooth and pourable.',
    applicationNotes: 'Stack the thin layers with a thin coat of frosting between each, then coat the top and sides with the remaining frosting.',
    chillGuidance: 'Chill before slicing so the many thin layers hold together cleanly.',
  }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 9, panSize: '8-10 thin round pans (or baked in batches)', equipment: ['Oven', 'Multiple round pans or one reused pan'], storage: 'Refrigerate, covered, up to 5 days.' })
}

// 12. Mont Blanc — meringue base stays plain; whipped cream dome + chestnut vermicelli is the finish.
{
  const r = byId('recipe_mont_blanc')
  const finish = pull(r, ['Sweetened chestnut purée', 'Dark rum', 'Heavy cream', 'Powdered sugar (cream)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'An assembled individual dessert with no internal filling — the meringue base is topped, not filled.' }
  r.frostingFinish = {
    name: 'Whipped Cream & Chestnut Vermicelli',
    ingredients: finish,
    prep: 'Loosen the chestnut purée with rum until smooth and pipeable. Whip the cream with powdered sugar to stiff peaks.',
    applicationNotes: 'Mound a dome of whipped cream onto each meringue base, then pipe the chestnut purée through a ricer or fine piping tip over the cream in thin vermicelli-like strands, covering it completely.',
    chillGuidance: 'Chill briefly and dust with a little powdered sugar just before serving.',
  }
  overview(r, { ovenTempC: 100, ovenTempF: 210, bakeTimeMinutes: 90, panSize: 'Baking sheet (piped meringue rounds)', equipment: ['Oven', 'Piping bag', 'Potato ricer or fine piping tip'], storage: 'Assemble just before serving — the meringue softens quickly once topped.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
