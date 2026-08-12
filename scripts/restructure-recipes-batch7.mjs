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

// 1. Banh Bo Nuong — single honeycomb cake, no filling or finish.
{
  const r = byId('recipe_banh_bo_nuong')
  r.filling = { none: true, note: 'A single honeycomb-textured cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 32, panSize: 'Greased baking pan', equipment: ['Oven', 'Baking pan'], storage: 'Keeps at room temperature, covered, for 2-3 days.' })
}

// 2. Khanom Chan — the alternating pandan/plain layers are the cake itself, no separate filling or finish.
{
  const r = byId('recipe_khanom_chan')
  r.filling = { none: true, note: 'The alternating pandan and plain layers are steamed directly on top of one another from the same batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { panSize: 'Square steaming pan', equipment: ['Steamer', 'Square pan'], storage: 'Refrigerate, covered, up to 4 days — the layers hold together best chilled.' })
}

// 3. Lapis Legit — built entirely from repeated broiled layers, no separate filling or finish.
{
  const r = byId('recipe_lapis_legit')
  r.filling = { none: true, note: 'The cake is built entirely from dozens of thin broiled layers of its own batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing, to show off the fine layered cross-section.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 3, panSize: '8-inch square pan', equipment: ['Oven with broiler', '8-inch square pan'], storage: 'Keeps at room temperature, wrapped, for 1-2 weeks — it\'s traditionally made ahead.' })
}

// 4. Brigadeiro Cake — condensed-milk chocolate frosting and sprinkles double as filling and finish.
{
  const r = byId('recipe_brigadeiro_cake')
  const frosting = pull(r, ['Sweetened condensed milk', 'Cocoa powder (frosting)', 'Butter (frosting)', 'Chocolate sprinkles'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'The brigadeiro frosting is spread between the layers as well as over the outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Brigadeiro Frosting & Sprinkles',
    ingredients: frosting,
    prep: 'Cook the condensed milk, frosting cocoa, and frosting butter over low heat, stirring constantly, until thick enough to coat a spoon, about 10 minutes. Cool slightly before spreading.',
    applicationNotes: 'Spread between the layers and over the outside, then cover generously with chocolate sprinkles.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 26, panSize: 'Two 8-inch pans', equipment: ['Oven', 'Two 8-inch round pans'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 5. Torta Rogel — dulce de leche is the real filling between crisp wafers; torched meringue is the real finish.
{
  const r = byId('recipe_torta_rogel')
  const filling = pull(r, ['Dulce de leche'])
  const meringue = pull(r, ['Egg whites', 'Granulated sugar (meringue)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Dulce de Leche',
    ingredients: filling,
    prep: 'No cooking required — the dulce de leche is used as-is.',
    applicationNotes: 'Stack the baked wafer layers with dulce de leche spread between each.',
  }
  r.frostingFinish = {
    name: 'Torched Meringue',
    ingredients: meringue,
    prep: 'Whip the egg whites and meringue sugar over a double boiler until warm, then whip to stiff, glossy peaks.',
    applicationNotes: 'Pile over the top and sides, then lightly torch or broil until golden in spots.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 7, panSize: 'Baking sheet (6-8 thin wafers)', equipment: ['Oven', 'Baking sheet', 'Kitchen torch or broiler'], storage: 'Refrigerate, covered, up to 3 days.' })
}

// 6. Torta Mil Hojas — dulce de leche filling between puff pastry sheets; powdered sugar dusting finish.
{
  const r = byId('recipe_torta_mil_hojas')
  const filling = pull(r, ['Dulce de leche (manjar)'], () => 'Dulce de leche')
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = {
    name: 'Dulce de Leche',
    ingredients: filling,
    prep: 'No cooking required — the dulce de leche is used as-is.',
    applicationNotes: 'Stack the cooled, trimmed pastry sheets with a generous layer of dulce de leche between each.',
  }
  r.frostingFinish = {
    name: 'Powdered Sugar Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust the top layer heavily just before serving.',
  }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 17, panSize: 'Baking sheets', equipment: ['Oven', 'Two baking sheets'], storage: 'Refrigerate, covered, up to 2 days — best eaten within a day for the crispest layers.' })
}

// 7. Louise Cake — raspberry jam is the real filling; coconut meringue baked on top is the real finish.
{
  const r = byId('recipe_louise_cake')
  const jam = pull(r, ['Raspberry jam'])
  const meringue = pull(r, ['Egg whites', 'Granulated sugar (meringue)', 'Desiccated coconut'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Raspberry Jam',
    ingredients: jam,
    prep: 'No cooking required — the jam is used as-is.',
    applicationNotes: 'Spread evenly over the pressed-in shortbread base.',
  }
  r.frostingFinish = {
    name: 'Coconut Meringue',
    ingredients: meringue,
    prep: 'Whip the egg whites to soft peaks, gradually add the meringue sugar and whip to stiff peaks, then fold in the coconut.',
    applicationNotes: 'Spread over the jam layer and bake together until golden.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 32, panSize: '9-inch square pan', equipment: ['Oven', '9-inch square pan'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 8. Kransekake — stacked rings, no filling; royal icing is the real finish that secures and decorates the tower.
{
  const r = byId('recipe_kransekake')
  const icing = pull(r, ['Egg white (icing)', 'Powdered sugar (icing)', 'Lemon juice (icing)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A tower of stacked almond rings with no internal filling.' }
  r.frostingFinish = {
    name: 'Royal Icing',
    ingredients: icing,
    prep: 'Whisk the icing egg white, icing sugar, and lemon juice into a stiff royal icing.',
    applicationNotes: 'Stack the cooled rings from largest to smallest into a tower, piping icing in zigzags between each layer to secure and decorate.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 11, panSize: 'Graduated ring molds', equipment: ['Oven', 'Graduated kransekake ring molds', 'Piping bag'], storage: 'Keeps at room temperature, uncovered, for about a week — it\'s meant to dry slightly and firm up.' })
}

// 9. Runeberg Torte — no internal filling; jam-and-icing topping is the real finish.
{
  const r = byId('recipe_runeberg_torte')
  const finish = pull(r, ['Raspberry jam (topping)', 'Powdered sugar (icing)', 'Water (icing)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'Small individual cakes with no internal filling.' }
  r.frostingFinish = {
    name: 'Raspberry Jam & Icing Ring',
    ingredients: finish,
    prep: 'Whisk the icing sugar and water into a thin icing.',
    applicationNotes: 'Top each cooled cake with a small dollop of raspberry jam surrounded by a thin ring of icing.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 22, panSize: 'Small cylindrical molds or muffin tin', equipment: ['Oven', 'Cylindrical molds or muffin tin'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 10. Bolo Rei — fruit is folded into the dough itself; no tracked finish ingredient for the traditional brushed glaze.
{
  const r = byId('recipe_bolo_rei')
  r.filling = { none: true, note: 'The port-soaked fruit is kneaded directly into the dough, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally brushed with warm jam or egg wash for shine, but this data does not track a separate finish ingredient beyond what\'s already in the dough.' }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 32, panSize: 'Baking sheet (ring-shaped)', equipment: ['Oven', 'Baking sheet'], storage: 'Keeps at room temperature, wrapped, for 4-5 days.' })
}

// 11. Welsh Cakes — griddle-cooked, no filling or finish beyond the dough itself.
{
  const r = byId('recipe_welsh_cakes')
  r.filling = { none: true, note: 'Individual griddle cakes with no filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally finished with just a dusting of the dough\'s own sugar while warm, rather than a separate icing.' }
  overview(r, { bakeTimeMinutes: 6, panSize: 'Griddle or heavy skillet', equipment: ['Griddle or heavy skillet', 'Rolling pin', 'Round cutter'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 12. Drømmekage (Danish Dream Cake) — no filling; broiled coconut caramel topping is the real finish.
{
  const r = byId('recipe_drommekage')
  const topping = pull(r, ['Shredded coconut (topping)', 'Brown sugar (topping)', 'Butter (topping)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A single sponge cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Coconut Caramel Topping',
    ingredients: topping,
    prep: 'Melt the topping butter with the brown sugar and coconut into a spreadable paste.',
    applicationNotes: 'Spread over the warm cake, then broil for 2-3 minutes until bubbling and caramelized.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 27, panSize: 'Greased baking pan', equipment: ['Oven with broiler', 'Baking pan'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 13. Bublanina — cherries are scattered directly into the batter, not a separable filling; real cinnamon-free powdered sugar dusting finish.
{
  const r = byId('recipe_bublanina')
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = { none: true, note: 'The cherries are scattered directly over the poured batter and sink in as it bakes, rather than being layered in as a separate filling.' }
  r.frostingFinish = {
    name: 'Powdered Sugar Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust over the cooled cake before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Baking dish', equipment: ['Oven', 'Baking dish'], storage: 'Keeps at room temperature, covered, for 2-3 days — best eaten fresh while the cherries are juicy.' })
}

// 14. Cozonac — walnut-cocoa-rum filling rolled inside; no separate frosting.
{
  const r = byId('recipe_cozonac')
  const filling = pull(r, ['Ground walnuts (filling)', 'Cocoa powder (filling)', 'Rum'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Walnut-Cocoa Filling',
    ingredients: filling,
    prep: 'Mix the ground walnuts, cocoa powder, and rum into a spreadable filling.',
    applicationNotes: 'Roll the dough into a rectangle, spread with the filling, and roll up tightly before placing in the loaf pan.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally left plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 42, panSize: 'Loaf pan', equipment: ['Oven', 'Loaf pan', 'Rolling pin'], storage: 'Keeps at room temperature, wrapped, for 4-5 days.' })
}

// 15. Garash — chocolate cream doubles as filling and frosting.
{
  const r = byId('recipe_garash')
  const cream = pull(r, ['Butter, softened (cream)', 'Dark chocolate (cream)', 'Heavy cream', 'Powdered sugar (cream)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'The chocolate cream is spread between the layers as well as over the top and sides, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Chocolate Cream',
    ingredients: cream,
    prep: 'Melt the chocolate with the cream and cool slightly. Beat the butter with powdered sugar, then beat in the cooled chocolate mixture.',
    applicationNotes: 'Spread between the layers and over the top and sides.',
    chillGuidance: 'Chill at least 3 hours before slicing to let the cream set.',
  }
  overview(r, { ovenTempC: 160, ovenTempF: 325, bakeTimeMinutes: 22, panSize: 'Two or three thin round pans', equipment: ['Oven', 'Two or three round pans'], storage: 'Refrigerate, covered, up to 5 days.' })
}

// 16. Merveilleux — whipped cream doubles as internal sandwich and full outer coating; chocolate shavings are part of the same finish.
{
  const r = byId('recipe_merveilleux')
  const finish = pull(r, ['Heavy cream, whipped', 'Powdered sugar (cream)', 'Dark chocolate shavings'], (n) => (n === 'Heavy cream, whipped' ? 'Heavy cream' : n.replace(/\s*\([^)]*\)\s*$/, '')))
  r.filling = { none: true, note: 'The whipped cream is used both to sandwich the meringue disks and to coat the entire outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Whipped Cream & Chocolate Shavings',
    ingredients: finish,
    prep: 'Whip the cream with powdered sugar to stiff peaks.',
    applicationNotes: 'Sandwich two meringue disks together with whipped cream, coat the entire outside generously in more whipped cream, then roll in dark chocolate shavings until fully covered.',
  }
  overview(r, { ovenTempC: 100, ovenTempF: 210, bakeTimeMinutes: 90, panSize: 'Baking sheet (piped meringue disks)', equipment: ['Oven', 'Baking sheet', 'Piping bag'], storage: 'Refrigerate, covered, up to 1 day — best eaten fresh before the meringue softens.' })
}

// 17. Appeltaart — real apple-cinnamon-raisin filling inside a pastry shell; no separate frosting.
{
  const r = byId('recipe_appeltaart')
  const filling = pull(r, ['Apples, peeled and sliced', 'Cinnamon', 'Raisins', 'Lemon juice'])
  r.filling = {
    name: 'Spiced Apple Filling',
    ingredients: filling,
    prep: 'Toss the sliced apples with cinnamon, raisins, and lemon juice.',
    applicationNotes: 'Mound high into the pastry-lined pan before topping with a lattice or crumbled cap of the remaining dough.',
  }
  r.frostingFinish = { none: true, note: 'Finished with its own lattice pastry top rather than a separate frosting or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 65, panSize: 'Tall springform pan', equipment: ['Oven', 'Tall springform pan', 'Rolling pin'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 18. Zuger Kirschtorte — kirsch is genuinely split in half by the recipe's own steps: half into the soak, half into the buttercream.
{
  const r = byId('recipe_zuger_kirschtorte')
  const kirsch = r.ingredients.find((i) => i.name === 'Kirsch (cherry brandy)')
  const kirschHalfMetric = { qty: kirsch.metric.qty / 2, unit: kirsch.metric.unit }
  const kirschHalfImperial = { qty: Math.round(kirsch.imperial.qty * 50) / 100, unit: kirsch.imperial.unit }
  r.ingredients = r.ingredients.filter((i) => i.id !== kirsch.id)
  const syrup = pull(r, ['Sugar syrup for soaking'], () => 'Sugar syrup')
  syrup.push({ ...kirsch, id: 'kirsch-soak', name: 'Kirsch (cherry brandy)', metric: kirschHalfMetric, imperial: kirschHalfImperial })
  const buttercream = pull(r, ['Butter, softened (buttercream)', 'Powdered sugar (buttercream)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  buttercream.push({ ...kirsch, id: 'kirsch-buttercream', name: 'Kirsch (cherry brandy)', metric: kirschHalfMetric, imperial: kirschHalfImperial })
  const almonds = pull(r, ['Sliced almonds (topping)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  buttercream.push(...almonds)
  r.filling = {
    name: 'Kirsch Syrup Soak',
    ingredients: syrup,
    prep: 'Mix the sugar syrup with half the kirsch.',
    applicationNotes: 'Brush generously over the sponge layers before stacking with the meringue crunch layer and buttercream.',
  }
  r.frostingFinish = {
    name: 'Kirsch Buttercream',
    ingredients: buttercream,
    prep: 'Beat the butter with powdered sugar and the remaining kirsch.',
    applicationNotes: 'Alternate meringue, sponge, and buttercream layers, finishing with buttercream on top and sides, then press sliced almonds onto the sides.',
    chillGuidance: 'Chill at least 2 hours before slicing.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 20, panSize: 'Round pans (2 sponge + 1 meringue layer)', equipment: ['Oven', 'Round cake pans'], storage: 'Refrigerate, covered, up to 4 days.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
