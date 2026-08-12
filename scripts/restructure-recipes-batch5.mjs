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

// 1. Basque Burnt Cheesecake — a single custard, no filling or applied finish (the burnt top comes from baking).
{
  const r = byId('recipe_basque_burnt_cheesecake')
  r.filling = { none: true, note: 'A single baked custard with no layers, so no separate filling is used.' }
  r.frostingFinish = { none: true, note: 'The deeply browned top comes from the high oven heat during baking, not from an applied frosting or glaze.' }
  overview(r, { ovenTempC: 230, ovenTempF: 450, bakeTimeMinutes: 52, panSize: '9-inch springform pan', equipment: ['Oven', '9-inch springform pan'], storage: 'Refrigerate, covered, up to 5 days.' })
}

// 2. Chocoflan — caramel base becomes the finish once inverted; the flan layer is the real filling poured over the cake batter.
{
  const r = byId('recipe_chocoflan')
  const caramel = pull(r, ['Granulated sugar (for caramel)'], () => 'Granulated sugar')
  const flan = pull(r, ['Sweetened condensed milk', 'Evaporated milk', 'Cream cheese', 'Eggs, large (flan)', 'Vanilla extract'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = {
    name: 'Flan Layer',
    ingredients: flan,
    prep: 'Blend the condensed milk, evaporated milk, cream cheese, flan eggs, and vanilla until smooth.',
    applicationNotes: 'Pour gently over the cake batter without stirring — the two layers swap places as they bake in a water bath.',
    chillGuidance: 'Chill at least 4 hours before inverting so both layers hold their shape when unmolded.',
  }
  r.frostingFinish = {
    name: 'Caramel',
    ingredients: caramel,
    prep: 'Melt the sugar in a saucepan until deep amber.',
    applicationNotes: 'Pour into the bottom of the bundt pan and swirl to coat before adding the batters — it becomes the glossy top once the cake is inverted.',
  }
  overview(r, { ovenTempC: 160, ovenTempF: 325, bakeTimeMinutes: 65, panSize: 'Bundt pan + water bath', equipment: ['Oven', 'Bundt pan', 'Larger roasting pan for the water bath'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 3. Kladdkaka — no tracked finish ingredient (the traditional dusting/cream are untracked in the data), leave both honest.
{
  const r = byId('recipe_kladdkaka')
  r.filling = { none: true, note: 'A single dense, fudgy layer with no filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally finished with a dusting of powdered sugar and served alongside whipped cream, rather than a spread-on frosting.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 20, panSize: '8-inch springform pan', equipment: ['Oven', '8-inch springform pan'], storage: 'Keeps at room temperature, covered, for 2-3 days — best eaten while still slightly gooey.' })
}

// 4. Lamington — chocolate icing + coconut coating is the entire defining finish; no internal filling.
{
  const r = byId('recipe_lamington')
  const finish = pull(r, ['Powdered sugar (icing)', 'Cocoa powder (icing)', 'Milk (icing)', 'Desiccated coconut'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A plain sponge cut into squares, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Chocolate Icing & Coconut',
    ingredients: finish,
    prep: 'Whisk the icing sugar, icing cocoa, and icing milk into a thin chocolate icing.',
    applicationNotes: 'Dip each sponge square in the icing, letting excess drip off, then roll in desiccated coconut.',
    chillGuidance: 'Let set on a wire rack before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 27, panSize: 'Square pan', equipment: ['Oven', 'Square pan', 'Wire rack'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 5. Panettone — candied fruit is kneaded into the dough itself; no separate filling or finish.
{
  const r = byId('recipe_panettone')
  r.filling = { none: true, note: 'The candied peel and raisins are kneaded directly into the dough, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally left plain, with no icing or glaze.' }
  overview(r, { ovenTempC: 170, ovenTempF: 340, bakeTimeMinutes: 47, panSize: 'Tall round panettone mold', equipment: ['Oven', 'Tall round mold', 'Stand mixer or hands for kneading'], storage: 'Keeps at room temperature, wrapped, for about a week.' })
}

// 6. Pastel de Nata — real egg custard filling; no tracked finish ingredient for the cinnamon dusting.
{
  const r = byId('recipe_pastel_de_nata')
  const custard = pull(r, ['Egg yolks', 'Granulated sugar', 'Cornstarch', 'Milk', 'Heavy cream', 'Cinnamon stick', 'Lemon peel strip'])
  r.filling = {
    name: 'Egg Custard',
    ingredients: custard,
    prep: 'Whisk sugar and cornstarch, then whisk in milk, cream, cinnamon stick, and lemon peel; simmer until slightly thickened. Remove the cinnamon and lemon peel, then whisk the hot mixture into the egg yolks.',
    applicationNotes: 'Fill the pastry cups with the custard before baking at very high heat until deeply spotted and caramelized on top.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally finished with a light dusting of ground cinnamon rather than a frosting.' }
  overview(r, { ovenTempC: 245, ovenTempF: 475, bakeTimeMinutes: 17, panSize: 'Muffin tin', equipment: ['Oven', 'Muffin tin', 'Rolling pin'], storage: 'Best eaten the day they\'re baked; keeps refrigerated up to 2 days.' })
}

// 7. Kyiv Cake — condensed-milk buttercream doubles as filling between the meringue layers and frosting outside.
{
  const r = byId('recipe_kyiv_cake')
  const buttercream = pull(r, ['Butter, softened (buttercream)', 'Sweetened condensed milk', 'Vanilla extract'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'The condensed-milk buttercream is spread between the meringue layers as well as over the top and sides, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Condensed Milk Buttercream',
    ingredients: buttercream,
    prep: 'Beat the butter until fluffy, then gradually beat in the condensed milk and vanilla until smooth.',
    applicationNotes: 'Spread between the two meringue layers and over the top and sides.',
    chillGuidance: 'Chill for at least 6 hours, ideally overnight, so the meringue softens slightly before slicing.',
  }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 60, panSize: 'Baking sheet (2 meringue rounds)', equipment: ['Oven', 'Baking sheet'], storage: 'Refrigerate, covered, up to 5 days.' })
}

// 8. Chajá — trifle-style: dulce de leche and peaches are the real internal filling; whipped cream and meringue are the finish.
{
  const r = byId('recipe_chaja')
  const filling = pull(r, ['Dulce de leche', 'Peaches, sliced'])
  const finish = pull(r, ['Egg whites (meringue)', 'Granulated sugar (meringue)', 'Heavy cream, whipped'], (n) => (n === 'Heavy cream, whipped' ? 'Heavy cream' : n.replace(/\s*\([^)]*\)\s*$/, '')))
  r.filling = {
    name: 'Dulce de Leche & Peaches',
    ingredients: filling,
    prep: 'No cooking required beyond slicing the peaches — the dulce de leche is used as-is.',
    applicationNotes: 'Layer with the sponge in a bowl or tall glass, alternating sponge, dulce de leche, and peaches.',
  }
  r.frostingFinish = {
    name: 'Whipped Cream & Meringue',
    ingredients: finish,
    prep: 'Whip the egg whites with sugar over a double boiler until stiff and glossy, then continue whipping off heat until cooled. Whip the cream separately to soft peaks.',
    applicationNotes: 'Layer whipped cream and meringue between the sponge layers along with the filling, then finish with a final layer of both on top.',
    chillGuidance: 'Chill before serving.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 22, panSize: 'Round pan, then assembled in a bowl or glass', equipment: ['Oven', 'Round cake pan', 'Double boiler'], storage: 'Refrigerate, covered, up to 2 days.' })
}

// 9. Torta Negra — dried fruit is soaked and folded into the batter itself; no separate filling or finish.
{
  const r = byId('recipe_torta_negra')
  r.filling = { none: true, note: 'The rum-soaked dried fruit is folded directly into the batter, so there is no separate filling.' }
  r.frostingFinish = { none: true, note: 'Traditionally left unfrosted — the cake firms up and deepens in flavor as it sits rather than being iced.' }
  overview(r, { ovenTempC: 160, ovenTempF: 325, bakeTimeMinutes: 65, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan'], storage: 'Wrapped tightly, keeps for 1-2 weeks at room temperature and improves with age.' })
}

// 10. Simnel Cake — marzipan forms both a hidden internal layer and the visible top decoration from one shared quantity.
{
  const r = byId('recipe_simnel_cake')
  const marzipan = pull(r, ['Marzipan'])
  r.filling = { none: true, note: 'A thin disk of marzipan is pressed inside as a hidden layer, using part of the marzipan listed under Frosting & Finish below.' }
  r.frostingFinish = {
    name: 'Marzipan',
    ingredients: marzipan,
    prep: 'Divide the marzipan and roll into a thin disk for the hidden inner layer, plus a top disk and eleven marzipan balls (traditionally one for each of the eleven faithful apostles).',
    applicationNotes: 'Press one disk into the batter partway through filling the pan before baking. After baking, top with the second disk and the eleven balls, then lightly toast under the broiler.',
  }
  overview(r, { ovenTempC: 150, ovenTempF: 300, bakeTimeMinutes: 105, panSize: 'Round cake pan', equipment: ['Oven', 'Round cake pan', 'Rolling pin', 'Broiler'], storage: 'Keeps at room temperature, wrapped, for 2-3 weeks.' })
}

// 11. Melktert — real custard filling in a blind-baked shell, real tracked cinnamon dusting as the finish.
{
  const r = byId('recipe_melktert')
  const custard = pull(r, ['Whole milk', 'Granulated sugar', 'Cornstarch', 'Eggs, large'])
  const dusting = pull(r, ['Ground cinnamon (topping)'], () => 'Ground cinnamon')
  r.filling = {
    name: 'Milk Custard',
    ingredients: custard,
    prep: 'Heat the milk with sugar until just simmering. Whisk the cornstarch and eggs together, then temper with the hot milk. Return to the pan and cook, stirring, until thick and custard-like.',
    applicationNotes: 'Pour into the blind-baked crust while still warm.',
    chillGuidance: 'Chill at least 2 hours until fully set before slicing.',
  }
  r.frostingFinish = {
    name: 'Cinnamon Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust generously over the custard while it is still warm, before chilling.',
  }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 12, panSize: 'Tart pan', equipment: ['Oven', 'Tart pan'], storage: 'Refrigerate, covered, up to 3 days.' })
}

// 12. Koeksisters — no internal filling; the ginger syrup soak is the real, defining finish.
{
  const r = byId('recipe_koeksisters')
  const syrup = pull(r, ['Granulated sugar (syrup)', 'Ground ginger (syrup)'], (n) => n.replace(/\s*\([^)]*\)\s*$/, ''))
  r.filling = { none: true, note: 'A twisted fried dough with no internal filling.' }
  r.frostingFinish = {
    name: 'Ginger Syrup Soak',
    ingredients: syrup,
    prep: 'Boil the sugar, ginger, and water together into a syrup, then chill completely — ideally overnight, so it is ice-cold when the hot dough hits it.',
    applicationNotes: 'Plunge the hot fried dough into the ice-cold syrup for a few seconds immediately after frying, then drain.',
    chillGuidance: 'The syrup must be fully chilled before use — the hot-to-cold contrast is what gives koeksisters their crisp shell and syrupy center.',
  }
  overview(r, { panSize: 'Deep pot for frying', equipment: ['Deep pot or fryer', 'Rolling pin'], storage: 'Refrigerate, covered, up to 1 week — they hold their syrupy texture well chilled.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
