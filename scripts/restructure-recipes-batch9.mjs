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

// 0. Molten Chocolate Lava Cake — fix-up: add explicit none/none now that every recipe requires an explicit declaration, not just Overview-only.
{
  const r = byId('recipe_molten_lava_1990s')
  r.filling = { none: true, note: 'A single-batter individual dessert with a molten center that forms during baking — there is no separate filling to add.' }
  r.frostingFinish = { none: true, note: 'Served straight from the ramekin with no applied frosting or glaze.' }
}

// 1. Trinidad Black Cake — fruit blended directly into the batter; no separate filling or finish.
{
  const r = byId('recipe_trinidad_black_cake')
  r.filling = { none: true, note: 'The rum-and-wine-soaked dried fruit is blended into a paste and folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: "Traditionally left unfrosted — sometimes 'fed' with more rum after baking, but never iced." }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 120, panSize: 'Lined round pan', equipment: ['Oven', 'Round cake pan', 'Blender'], storage: 'Wrapped tightly, keeps for weeks at room temperature and improves with age.' })
}

// 2. Bolo de Arroz — single cupcake-style rice cakes, no filling or finish.
{
  const r = byId('recipe_bolo_de_arroz')
  r.filling = { none: true, note: 'Individual cupcake-style cakes with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 22, panSize: 'Muffin tin', equipment: ['Oven', 'Muffin tin'], storage: 'Keeps at room temperature, covered, for 2-3 days.' })
}

// 3. Financier — single small cakes, no filling or finish.
{
  const r = byId('recipe_financier')
  r.filling = { none: true, note: 'Individual small cakes with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 13, panSize: 'Small rectangular molds or muffin tin', equipment: ['Oven', 'Financier molds or muffin tin'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 4. Boterkoek — no filling; the tracked egg-yolk wash is the real minimal finish.
{
  const r = byId('recipe_boterkoek')
  const wash = pull(r, ['Egg yolk (wash)'], () => 'Egg yolk')
  r.filling = { none: true, note: 'A single dense butter cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Egg Wash',
    ingredients: wash,
    prep: 'No preparation needed beyond separating the yolk.',
    applicationNotes: 'Brush over the scored dough before baking for a glossy, golden top.',
  }
  overview(r, { ovenTempC: 170, ovenTempF: 340, bakeTimeMinutes: 27, panSize: 'Round pan', equipment: ['Oven', 'Round cake pan'], storage: 'Keeps at room temperature, covered, for 5-6 days — it\'s a dense, keeping cake.' })
}

// 5. Guglhupf — raisins knead into the dough itself; real powdered sugar dusting finish.
{
  const r = byId('recipe_guglhupf')
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = { none: true, note: 'The rum-soaked raisins are kneaded directly into the dough, so there is no separate filling.' }
  r.frostingFinish = {
    name: 'Powdered Sugar Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust over the cooled, unmolded cake.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 42, panSize: 'Bundt (guglhupf) pan', equipment: ['Oven', 'Bundt pan'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 6. Chiffon Cake — single tube cake, traditionally unfrosted.
{
  const r = byId('recipe_chiffon')
  r.filling = { none: true, note: 'A single tube cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, unfrosted, to let its light, airy texture speak for itself.' }
  overview(r, { ovenTempC: 165, ovenTempF: 325, bakeTimeMinutes: 57, panSize: 'Ungreased tube pan', equipment: ['Oven', 'Ungreased tube pan'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 7. Election Cake — fruit kneads into the dough itself; no separate filling or finish.
{
  const r = byId('recipe_election_cake')
  r.filling = { none: true, note: 'The dried fruit is kneaded directly into the yeasted dough, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally left plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Baking sheet (round loaf)', equipment: ['Oven', 'Baking sheet'], storage: 'Keeps at room temperature, covered, for 4-5 days — it improves after a day or two.' })
}

// 8. Angel Food Cake — single tube cake, traditionally unfrosted.
{
  const r = byId('recipe_angel_food')
  r.filling = { none: true, note: 'A single tube cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, unfrosted — often alongside fresh fruit or whipped cream on the side rather than as an applied finish.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Ungreased tube pan', equipment: ['Oven', 'Ungreased tube pan'], storage: 'Keeps at room temperature, covered, for 2-3 days.' })
}

// 9. Clootie Dumpling — single steamed pudding, fruit folded into the dough itself.
{
  const r = byId('recipe_clootie_dumpling')
  r.filling = { none: true, note: 'The dried fruit is mixed directly into the dough, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or glaze.' }
  overview(r, { bakeTimeMinutes: 210, panSize: 'Cloth-wrapped bundle, steamed in a large pot', equipment: ['Large pot', 'Pudding cloth', 'String'], storage: 'Keeps at room temperature, wrapped, for about a week; also freezes well.' })
}

// 10. Barmbrack — fruit soaks then folds into the batter; no separate filling or finish.
{
  const r = byId('recipe_barmbrack')
  r.filling = { none: true, note: 'The tea-soaked dried fruit is folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, sliced and buttered rather than iced.' }
  overview(r, { ovenTempC: 160, ovenTempF: 325, bakeTimeMinutes: 65, panSize: 'Loaf pan', equipment: ['Oven', 'Loaf pan'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 11. Makowiec — real poppy seed filling rolled inside; no separate frosting.
{
  const r = byId('recipe_makowiec')
  const filling = pull(r, ['Ground poppy seeds (filling)', 'Honey (filling)', 'Raisins (filling)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Poppy Seed Filling',
    ingredients: filling,
    prep: 'Simmer the ground poppy seeds with honey and raisins into a thick, spreadable filling.',
    applicationNotes: 'Spread over the rolled-out dough rectangle, then roll up tightly into a log before baking.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally left plain once golden, with no icing or glaze.' }
  overview(r, { ovenTempC: 180, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Baking sheet', equipment: ['Oven', 'Rolling pin', 'Baking sheet'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 12. Rigó Jancsi — real whipped cream filling between two sponge layers; real chocolate glaze finish.
{
  const r = byId('recipe_rigo_jancsi')
  const filling = pull(r, ['Heavy cream (filling)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  const glaze = pull(r, ['Dark chocolate (glaze)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Whipped Cream',
    ingredients: filling,
    prep: 'Whip the cream to stiff peaks.',
    applicationNotes: 'Spread generously over one sponge layer before topping with the second.',
  }
  r.frostingFinish = {
    name: 'Chocolate Glaze',
    ingredients: glaze,
    prep: 'Melt the chocolate until smooth and pourable.',
    applicationNotes: 'Pour evenly over the top layer after pressing it down gently.',
    chillGuidance: 'Chill until set before cutting into neat squares.',
  }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 14, panSize: 'Two thin sheet pans', equipment: ['Oven', 'Two sheet pans'], storage: 'Refrigerate, covered, up to 3 days.' })
}

// 13. M'hanncha — almond paste is the real filling coiled inside; egg wash and honey drizzle are the real finish.
{
  const r = byId('recipe_mhanncha')
  const filling = pull(r, ['Ground almonds', 'Granulated sugar', 'Butter, melted', 'Orange blossom water'])
  const finish = pull(r, ['Egg (for sealing and wash)', 'Honey (finishing)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Almond Paste',
    ingredients: filling,
    prep: 'Mix the ground almonds, sugar, melted butter, and orange blossom water into a smooth paste.',
    applicationNotes: 'Roll into a long rope, lay along the edge of a phyllo sheet, and roll up into a long, thin log before coiling into a spiral.',
  }
  r.frostingFinish = {
    name: 'Egg Wash & Honey Drizzle',
    ingredients: finish,
    prep: 'Beat the egg for the wash; warm the honey slightly so it drizzles easily.',
    applicationNotes: 'Brush the coiled log with egg wash before baking (also used to seal the seams), then drizzle with warm honey while still hot from the oven.',
  }
  overview(r, { ovenTempC: 180, ovenTempF: 350, bakeTimeMinutes: 27, panSize: 'Baking sheet (coiled spiral)', equipment: ['Oven', 'Baking sheet', 'Pastry brush'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 14. Bánh Da Lợn — alternating steamed layers are two distinct batters that form the cake itself, no separate filling or finish.
{
  const r = byId('recipe_banh_da_lon')
  r.filling = { none: true, note: 'The alternating pandan and mung bean layers are steamed directly on top of one another, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain, with no icing or topping.' }
  overview(r, { panSize: 'Heatproof steaming pan', equipment: ['Steamer', 'Heatproof pan', 'Blender'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 15. Pan de Elote — single corn cake, no filling or finish.
{
  const r = byId('recipe_pan_de_elote')
  r.filling = { none: true, note: 'A single corn cake with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'Traditionally served plain and warm, with no icing or topping.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 37, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan', 'Blender'], storage: 'Keeps at room temperature, covered, for 2-3 days.' })
}

// 16. Genoa Cake — fruit folds into the batter; almonds bake into the top rather than an applied finish.
{
  const r = byId('recipe_genoa_cake')
  r.filling = { none: true, note: 'The dried fruit is folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Finished with whole almonds pressed onto the top before baking, rather than a separate icing.' }
  overview(r, { ovenTempC: 160, ovenTempF: 325, bakeTimeMinutes: 60, panSize: 'Lined round pan', equipment: ['Oven', 'Round cake pan'], storage: 'Keeps at room temperature, wrapped, for about a week — it improves with a couple of days\' rest.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
