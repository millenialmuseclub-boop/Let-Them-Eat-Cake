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

// 1. Bolo de Rolo — guava paste is the real filling rolled into the spiral; no separate frosting.
{
  const r = byId('recipe_bolo_de_rolo')
  const filling = pull(r, ['Guava paste'])
  r.filling = {
    name: 'Guava Paste',
    ingredients: filling,
    prep: 'Soften the guava paste so it spreads easily.',
    applicationNotes: 'Spread evenly over the warm thin sponge, then roll tightly from one short edge into a spiral.',
    chillGuidance: 'Wrap tightly and chill at least 1 hour before slicing into thin spirals.',
  }
  r.frostingFinish = { none: true, note: 'Finished simply by the rolled spiral itself, with no icing or glaze.' }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 7, panSize: 'Lined baking sheet', equipment: ['Oven', 'Baking sheet', 'Parchment paper'], storage: 'Refrigerate, wrapped, up to 5 days.' })
}

// 2. Panettone (Panetón) — fruit is kneaded into the dough itself; no separate filling or finish.
{
  const r = byId('recipe_paneton')
  r.filling = { none: true, note: 'The candied fruit and raisins are kneaded directly into the dough, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally left plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 42, panSize: 'Tall paper panettone mold', equipment: ['Oven', 'Paper panettone mold'], storage: 'Keeps at room temperature, wrapped, for about a week.' })
}

// 3. Torta de Guayaba — real guava paste filling between layers; real cream cheese frosting outside.
{
  const r = byId('recipe_torta_de_guayaba')
  const filling = pull(r, ['Guava paste'])
  const frosting = pull(r, ['Cream cheese, softened (frosting)', 'Powdered sugar (frosting)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Guava Paste',
    ingredients: filling,
    prep: 'Warm the guava paste slightly until spreadable.',
    applicationNotes: 'Layer between the two cake rounds.',
  }
  r.frostingFinish = {
    name: 'Cream Cheese Frosting',
    ingredients: frosting,
    prep: 'Beat the cream cheese with powdered sugar until smooth.',
    applicationNotes: 'Frost the top and sides, and finish with a few small cubes of guava paste on top.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 27, panSize: 'Two round pans', equipment: ['Oven', 'Two round cake pans'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 4. Sfouf — no filling; pine nuts bake directly onto the top rather than being an applied finish.
{
  const r = byId('recipe_sfouf')
  r.filling = { none: true, note: 'A single turmeric-spiced cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Finished with pine nuts pressed onto the top before baking, rather than a separate icing or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 32, panSize: 'Square baking pan', equipment: ['Oven', 'Square baking pan'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 5. Ma Lai Go — single steamed sponge, no filling or finish.
{
  const r = byId('recipe_ma_lai_go')
  r.filling = { none: true, note: 'A single steamed sponge with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { bakeTimeMinutes: 27, panSize: 'Heatproof pan that fits inside a steamer', equipment: ['Steamer', 'Heatproof cake pan'], storage: 'Keeps at room temperature, covered, for 2-3 days.' })
}

// 6. Kerala Plum Cake — rum-soaked fruit folds directly into the batter; no separate filling or finish.
{
  const r = byId('recipe_kerala_plum_cake')
  r.filling = { none: true, note: 'The rum-soaked dried fruit is folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally left unfrosted, relying on the caramel and rum for flavor rather than an applied finish.' }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 105, panSize: 'Lined round pan', equipment: ['Oven', 'Round cake pan'], storage: 'Wrapped tightly, keeps for 2-3 weeks at room temperature and improves with age.' })
}

// 7. Kek Lapis Sarawak — built entirely from many broiled colored layers, no separate filling or finish.
{
  const r = byId('recipe_kek_lapis_sarawak')
  r.filling = { none: true, note: 'The cake is built entirely from many thin broiled layers of its own colored batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing, to show off the layered pattern inside.' }
  overview(r, { panSize: 'Greased pan (10-15 thin layers)', equipment: ['Oven or broiler', 'Baking pan'], storage: 'Keeps at room temperature, wrapped, for about a week — it\'s traditionally made ahead.' })
}

// 8. Gâteau Patate — the "filling" reserves part of the same dough mixture rather than a separately tracked ingredient; no applied finish.
{
  const r = byId('recipe_gateau_patate')
  r.filling = { none: true, note: 'A portion of the same sweet potato dough is pressed into the center of each round as a denser core, rather than a separately tracked filling.' }
  r.frostingFinish = { none: true, note: 'Deep-fried and served warm with no applied icing or glaze.' }
  overview(r, { panSize: 'Deep pot for frying', equipment: ['Deep pot or fryer'], storage: 'Best eaten warm the day they\'re fried.' })
}

// 9. Sans Rival — cashew buttercream doubles as filling and frosting; chopped cashew topping is part of the same finish.
{
  const r = byId('recipe_sans_rival')
  const finish = pull(r, ['Butter, softened (buttercream)', 'Egg yolks (buttercream)', 'Sweetened condensed milk (buttercream)', 'Chopped cashews (topping)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'The cashew buttercream is spread between the meringue layers as well as over the outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Cashew Buttercream & Cashew Coating',
    ingredients: finish,
    prep: 'Whisk the egg yolks and condensed milk over a double boiler until thick, then cool and beat into the softened butter.',
    applicationNotes: 'Layer the cashew meringue rounds with buttercream between each, coat the top and sides with more buttercream, then press chopped cashews over the whole exterior.',
    chillGuidance: 'Chill at least 4 hours before slicing — it cuts best cold.',
  }
  overview(r, { ovenTempC: 160, ovenTempF: 325, bakeTimeMinutes: 22, panSize: 'Baking sheet (thin meringue rounds)', equipment: ['Oven', 'Baking sheet'], storage: 'Refrigerate, covered, up to 5 days.' })
}

// 10. Kue Lapis — steamed colored layers built from the same batter, no separate filling or finish.
{
  const r = byId('recipe_kue_lapis')
  r.filling = { none: true, note: 'The colored layers are steamed directly on top of one another from the same batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { panSize: 'Heatproof steaming pan', equipment: ['Steamer', 'Heatproof pan'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 11. Bolo de Fubá — single cornmeal cake, no filling or finish.
{
  const r = byId('recipe_bolo_de_fuba')
  r.filling = { none: true, note: 'A single cornmeal cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 12. Šakotis (tree cake) — built entirely from repeated brushed layers over a spit, no separate filling or finish.
{
  const r = byId('recipe_sakotis')
  r.filling = { none: true, note: 'The cake is built entirely from thin layers of its own batter brushed onto a turning spit, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing, to show off its branch-like spiked exterior.' }
  overview(r, { panSize: 'Rotating spit near a grill or open flame', equipment: ['Rotating spit or vertical rotisserie', 'Pastry brush'], storage: 'Keeps at room temperature, wrapped, for about a week.' })
}

// 13. Kremšnita — real vanilla custard filling between pastry sheets; real powdered sugar dusting finish.
{
  const r = byId('recipe_kremsnita')
  const custard = pull(r, ['Whole milk', 'Egg yolks', 'Granulated sugar', 'Cornstarch', 'Vanilla extract'])
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = {
    name: 'Vanilla Custard',
    ingredients: custard,
    prep: 'Whisk the egg yolks, sugar, and cornstarch, then temper with hot milk and cook until very thick. Stir in vanilla and cool slightly.',
    applicationNotes: 'Pour the warm custard over the first pastry sheet, then top with the second sheet, pressing down gently.',
    chillGuidance: 'Chill at least 4 hours until fully set before cutting into squares.',
  }
  r.frostingFinish = {
    name: 'Powdered Sugar Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust over the top just before serving.',
  }
  overview(r, { panSize: 'Baking dish', equipment: ['Oven (for the pastry)', 'Baking dish'], storage: 'Refrigerate, covered, up to 3 days.' })
}

// 14. Nazook — real walnut-sugar filling rolled and coiled inside; no separate frosting.
{
  const r = byId('recipe_nazook')
  const filling = pull(r, ['Ground walnuts (filling)', 'Granulated sugar (filling)', 'Vanilla extract'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Walnut Filling',
    ingredients: filling,
    prep: 'Mix the ground walnuts, sugar, and vanilla into a sandy filling.',
    applicationNotes: 'Sprinkle over each rolled-out dough rectangle, then roll up tightly into a log and coil into a spiral before baking.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally left plain once golden, with no icing or glaze.' }
  overview(r, { ovenTempC: 180, ovenTempF: 350, bakeTimeMinutes: 22, panSize: 'Baking sheet', equipment: ['Oven', 'Rolling pin', 'Baking sheet'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 15. Galaktoboureko — real semolina custard filling inside the phyllo; real lemon syrup finish.
{
  const r = byId('recipe_galaktoboureko')
  const custard = pull(r, ['Whole milk', 'Fine semolina', 'Granulated sugar (custard)', 'Eggs, large'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  const syrup = pull(r, ['Lemon-sugar syrup'])
  r.filling = {
    name: 'Semolina Custard',
    ingredients: custard,
    prep: 'Heat the milk, whisk in semolina and sugar, and cook until thickened into a custard. Cool slightly, then whisk in the eggs.',
    applicationNotes: 'Pour over the first layer of buttered phyllo sheets before topping with the remaining phyllo.',
  }
  r.frostingFinish = {
    name: 'Lemon Syrup',
    ingredients: syrup,
    prep: 'Keep the syrup cold until ready to use.',
    applicationNotes: 'Pour the cold syrup over the hot cake immediately after baking and let it soak in fully before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 47, panSize: 'Buttered baking dish', equipment: ['Oven', 'Baking dish', 'Pastry brush'], storage: 'Keeps at room temperature, covered, for 3-4 days — the syrup keeps it moist.' })
}

// 16. Bizcocho de Ron — no filling; the tracked rum-butter glaze is the real finish (poked and brushed in after baking).
{
  const r = byId('recipe_bizcocho_de_ron')
  const glaze = pull(r, ['Rum-butter glaze'])
  r.filling = { none: true, note: 'A single bundt cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Rum-Butter Glaze',
    ingredients: glaze,
    prep: 'Have the glaze ready while the cake is still warm.',
    applicationNotes: 'Poke holes in the top of the warm cake and brush generously with the glaze until fully absorbed.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 47, panSize: 'Bundt pan', equipment: ['Oven', 'Bundt pan'], storage: 'Keeps at room temperature, covered, for 4-5 days — the glaze keeps it moist.' })
}

// 17. Great Cake — fruit is blended into the batter itself; no separate filling or finish.
{
  const r = byId('recipe_great_cake')
  r.filling = { none: true, note: 'The rum-and-wine-soaked dried fruit is blended into a paste and folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: "Traditionally left unfrosted — sometimes 'fed' with more rum after baking, but never iced." }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 120, panSize: 'Lined round pan', equipment: ['Oven', 'Round cake pan', 'Blender'], storage: 'Wrapped tightly, keeps for weeks at room temperature and improves with age.' })
}

// 18. Vínarterta — real prune filling between the many thin layers; no separate frosting.
{
  const r = byId('recipe_vinarterta')
  const filling = pull(r, ['Dried prunes (filling)', 'Almond extract (filling)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Prune Filling',
    ingredients: filling,
    prep: 'Simmer the prunes in water until soft, then blend with almond extract into a thick, jam-like filling.',
    applicationNotes: 'Stack the baked layers with prune filling spread between each.',
    chillGuidance: 'Wrap and rest overnight so the layers soften slightly before slicing.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally left unfrosted, wrapped and rested rather than iced.' }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 9, panSize: 'Baking sheet (5-7 thin rounds)', equipment: ['Oven', 'Baking sheet', 'Rolling pin'], storage: 'Keeps at room temperature, wrapped, for about a week — it\'s traditionally made ahead so the layers soften.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
