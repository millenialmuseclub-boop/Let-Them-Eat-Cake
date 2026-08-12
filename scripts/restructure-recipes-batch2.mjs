import fs from 'node:fs'

const path = 'src/data/recipes.json'
const recipes = JSON.parse(fs.readFileSync(path, 'utf8'))

function byId(id) {
  const r = recipes.find((r) => r.id === id)
  if (!r) throw new Error('missing ' + id)
  return r
}

// Pull named ingredients out of the flat list by id, strip a trailing "(...)" qualifier from the name.
function extract(recipe, ids) {
  const out = []
  recipe.ingredients = recipe.ingredients.filter((ing) => {
    if (ids.includes(ing.id)) {
      out.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  return out
}

function overview(recipe, { ovenTempC, ovenTempF, bakeTimeMinutes, panSize, equipment, storage }) {
  Object.assign(recipe, {
    yield: recipe.baseServings,
    bakeTimeMinutes,
    ovenTempC,
    ovenTempF,
    panSize,
    equipment,
    storage,
  })
}

// 1. Hummingbird — cream cheese frosting spread between layers and on top; no distinct filling.
{
  const r = byId('recipe_hummingbird')
  const frosting = extract(r, ['cream-cheese', 'butter-frosting', 'powdered-sugar'].filter((id) => r.ingredients.some((i) => i.id === id)))
  // ids may differ; fall back to name-based match
  if (frosting.length === 0) {
    const names = ['Cream cheese', 'Butter (frosting)', 'Powdered sugar']
    r.ingredients = r.ingredients.filter((ing) => {
      if (names.includes(ing.name)) {
        frosting.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
        return false
      }
      return true
    })
  }
  r.filling = { none: true, note: 'The cream cheese frosting is spread between the layers as well as over the top, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Cream Cheese Frosting',
    ingredients: frosting,
    prep: 'Beat the cream cheese, butter, and powdered sugar together until smooth and fluffy.',
    applicationNotes: 'Spread between the three layers and over the top and sides; garnish with extra chopped pecans.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 25,
    panSize: 'Three 8-inch round pans',
    equipment: ['Oven', 'Three 8-inch round pans'],
    storage: 'Refrigerate, covered, up to 4 days — cream cheese frosting is not shelf-stable at room temperature.',
  })
}

// 2. Carrot Cake — same pattern as Hummingbird.
{
  const r = byId('recipe_carrot_cream_cheese_1980s')
  const names = ['Cream cheese', 'Butter (frosting)', 'Powdered sugar']
  const frosting = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (names.includes(ing.name)) {
      frosting.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = { none: true, note: 'The cream cheese frosting is spread between the layers as well as over the top, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Cream Cheese Frosting',
    ingredients: frosting,
    prep: 'Beat the cream cheese, butter, and powdered sugar together until smooth and fluffy.',
    applicationNotes: 'Spread between the layers and over the top and sides.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 32,
    panSize: 'Two 9-inch round pans',
    equipment: ['Oven', 'Two 9-inch round pans'],
    storage: 'Refrigerate, covered, up to 4 days — cream cheese frosting is not shelf-stable at room temperature.',
  })
}

// 3. Red Velvet Cupcake — cream cheese frosting piped on top; no filling (cupcakes).
{
  const r = byId('recipe_red_velvet_cupcake_2000s')
  const names = ['Cream cheese', 'Butter (frosting)', 'Powdered sugar']
  const frosting = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (names.includes(ing.name)) {
      frosting.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = { none: true, note: 'No separate filling is used — these are single-layer cupcakes.' }
  r.frostingFinish = {
    name: 'Cream Cheese Frosting',
    ingredients: frosting,
    prep: 'Beat the cream cheese, butter, and powdered sugar together until smooth.',
    applicationNotes: 'Pipe onto the cooled cupcakes just before serving.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 19,
    panSize: '12-cup muffin tin',
    equipment: ['Oven', '12-cup muffin tin', 'Piping bag'],
    storage: 'Refrigerate, covered, up to 4 days — cream cheese frosting is not shelf-stable at room temperature.',
  })
}

// 4. Tres Leches — milk soak functions as the "filling" (soaks into the cake), whipped cream is the finish.
{
  const r = byId('recipe_tres_leches')
  const soakNames = ['Whole milk', 'Evaporated milk', 'Sweetened condensed milk']
  const soak = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (soakNames.includes(ing.name)) {
      soak.push({ ...ing, name: ing.name })
      return false
    }
    return true
  })
  const cream = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (ing.name === 'Heavy cream, whipped') {
      cream.push({ ...ing, name: 'Heavy cream' })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Three-Milk Soak',
    ingredients: soak,
    prep: 'Whisk the whole milk, evaporated milk, and condensed milk together.',
    applicationNotes: 'Poke holes all over the cooled cake, then pour the milk mixture slowly over the top so it soaks all the way through.',
    chillGuidance: 'Chill at least 2 hours so the soak fully absorbs before serving.',
  }
  r.frostingFinish = {
    name: 'Whipped Cream Topping',
    ingredients: cream,
    prep: 'Whip the heavy cream to soft peaks.',
    applicationNotes: 'Spread over the top just before serving.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 25,
    panSize: '9x13-inch pan',
    equipment: ['Oven', '9x13-inch baking pan'],
    storage: 'Refrigerate, covered, up to 3 days — the milk soak means it must stay chilled.',
  })
}

// 5. Sachertorte — apricot jam filling/coat, chocolate glaze finish.
{
  const r = byId('recipe_sachertorte')
  const jam = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (ing.name === 'Apricot jam, warmed') {
      jam.push({ ...ing, name: 'Apricot jam' })
      return false
    }
    return true
  })
  const glazeNames = ['Dark chocolate (glaze)', 'Heavy cream (glaze)']
  const glaze = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (glazeNames.includes(ing.name)) {
      glaze.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Apricot Jam',
    ingredients: jam,
    prep: 'Warm the jam gently until spreadable.',
    applicationNotes: 'Spread between the two sliced layers and over the top and sides as a thin coat before glazing.',
  }
  r.frostingFinish = {
    name: 'Chocolate Glaze',
    ingredients: glaze,
    prep: 'Warm the cream, pour over the chopped chocolate, and stir until smooth and glossy.',
    applicationNotes: 'Pour over the jam-coated cake, letting it drip down the sides.',
    chillGuidance: 'Let the glaze set at room temperature before slicing.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 48,
    panSize: '9-inch springform pan',
    equipment: ['Oven', '9-inch springform pan'],
    storage: 'Keeps at room temperature, covered, for 3-4 days — the glaze seals in moisture.',
  })
}

// 6. Black Forest — cherry+kirsch filling, whipped cream frosting used both between layers and outside.
{
  const r = byId('recipe_black_forest')
  const fillingNames = ['Pitted cherries, jarred', 'Kirsch (cherry brandy)']
  const filling = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (fillingNames.includes(ing.name)) {
      filling.push({ ...ing, name: ing.name })
      return false
    }
    return true
  })
  const creamNames = ['Heavy cream', 'Sugar (for cream)', 'Dark chocolate shavings']
  const cream = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (creamNames.includes(ing.name)) {
      cream.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Cherry & Kirsch',
    ingredients: filling,
    prep: 'Drizzle kirsch over each cake layer before assembling.',
    applicationNotes: 'Scatter cherries over the whipped cream between each layer.',
  }
  r.frostingFinish = {
    name: 'Whipped Cream & Chocolate Shavings',
    ingredients: cream,
    prep: 'Whip the cream with sugar to soft peaks.',
    applicationNotes: 'Use the same whipped cream both between the layers (with the cherries) and to frost the outside; finish with chocolate shavings and extra cherries on top.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 24,
    panSize: 'Three 8-inch round pans',
    equipment: ['Oven', 'Three 8-inch round pans'],
    storage: 'Refrigerate, covered, up to 3 days — the whipped cream and cherries need to stay chilled.',
  })
}

// 7. Victoria Sponge — jam + whipped cream sandwiched between layers; no separate frosting (dusted with sugar).
{
  const r = byId('recipe_victoria_sponge')
  const fillingNames = ['Raspberry jam', 'Whipped cream']
  const filling = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (fillingNames.includes(ing.name)) {
      filling.push({ ...ing, name: ing.name })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Jam & Whipped Cream',
    ingredients: filling,
    prep: 'No cooking required — the jam is used as-is and the cream is whipped to soft peaks.',
    applicationNotes: 'Spread jam over one layer, top with whipped cream, then sandwich with the second layer.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally finished with a simple dusting of powdered sugar rather than a frosting.' }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 22,
    panSize: 'Two 8-inch round pans',
    equipment: ['Oven', 'Two 8-inch round pans'],
    storage: 'Refrigerate, covered, up to 2 days — the whipped cream filling needs to stay chilled.',
  })
}

// 8. Baumkuchen — no filling (layers are built directly from batter); apricot/chocolate glaze finish.
{
  const r = byId('recipe_baumkuchen')
  const glazeNames = ['Apricot jam (glaze)', 'Dark chocolate (glaze, optional)']
  const glaze = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (glazeNames.includes(ing.name)) {
      glaze.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = { none: true, note: 'No separate filling is used — each thin layer is broiled directly onto the previous one, building the cake from the batter itself.' }
  r.frostingFinish = {
    name: 'Apricot & Chocolate Glaze',
    ingredients: glaze,
    prep: 'Warm the apricot jam until spreadable; melt the chocolate if using.',
    applicationNotes: 'Brush the cooled cake with warm apricot jam, then finish with a chocolate glaze if desired.',
  }
  overview(r, {
    ovenTempC: undefined,
    ovenTempF: undefined,
    bakeTimeMinutes: undefined,
    panSize: 'Round pan (built up in thin broiled layers)',
    equipment: ['Broiler', 'Round cake pan', 'Pastry brush'],
    storage: 'Keeps at room temperature, covered, for 4-5 days thanks to the glaze seal.',
  })
}

// 9. Napoleon Torte — pastry cream filling, no frosting (crushed trimmings on top).
{
  const r = byId('recipe_napoleon_torte')
  const custardNames = ['Whole milk (custard)', 'Egg yolks (custard)', 'Granulated sugar (custard)', 'Cornstarch (custard)', 'Vanilla extract']
  const custard = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (custardNames.includes(ing.name)) {
      custard.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Pastry Cream',
    ingredients: custard,
    prep: 'Whisk egg yolks, sugar, and cornstarch together, temper with hot milk, then cook until thick. Stir in vanilla and cool completely before using.',
    textureGoal: 'Thick enough to hold its shape between the pastry sheets without oozing out.',
    applicationNotes: 'Layer between each pastry sheet, ending with pastry on top.',
    chillGuidance: 'Chill the assembled torte overnight so the layers soften slightly before slicing.',
  }
  r.frostingFinish = { none: true, note: 'Finished with crushed pastry trimmings scattered on top rather than a frosting.' }
  overview(r, {
    ovenTempC: 200,
    ovenTempF: 400,
    bakeTimeMinutes: 9,
    panSize: 'Baking sheet (individual pastry rounds)',
    equipment: ['Oven', 'Rolling pin', 'Baking sheet'],
    storage: 'Refrigerate, covered, up to 2 days — the pastry cream filling needs to stay chilled.',
  })
}

// 10. Boston Cream Pie — pastry cream filling, chocolate glaze finish.
{
  const r = byId('recipe_boston_cream_pie')
  const custardNames = ['Milk (custard)', 'Egg yolks (custard)', 'Cornstarch (custard)']
  const custard = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (custardNames.includes(ing.name)) {
      custard.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  const glaze = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (ing.name === 'Dark chocolate (glaze)') {
      glaze.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Pastry Cream',
    ingredients: custard,
    prep: 'Whisk egg yolks and cornstarch with a little sugar, temper with hot milk, and cook until thick. Cool completely before using.',
    applicationNotes: 'Sandwich between the two sponge layers.',
  }
  r.frostingFinish = {
    name: 'Chocolate Glaze',
    ingredients: glaze,
    prep: 'Melt the dark chocolate until smooth and pourable.',
    applicationNotes: 'Pour over the top, letting it drip down the sides.',
    chillGuidance: 'Chill until the glaze sets before slicing.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 20,
    panSize: 'Two thin round layers',
    equipment: ['Oven', 'Two round cake pans'],
    storage: 'Refrigerate, covered, up to 3 days — the pastry cream filling needs to stay chilled.',
  })
}

// 11. Italian Cream Cake — cream cheese frosting between layers and outside, pecans/coconut pressed on; no distinct filling.
{
  const r = byId('recipe_italian_cream_cake')
  const frosting = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (ing.name === 'Cream cheese (frosting)') {
      frosting.push({ ...ing, name: 'Cream cheese' })
      return false
    }
    return true
  })
  r.filling = { none: true, note: 'The cream cheese frosting is spread between the layers as well as over the top, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Cream Cheese Frosting',
    ingredients: frosting,
    prep: 'Beat the cream cheese with powdered sugar and a little butter until smooth.',
    applicationNotes: 'Frost between the layers and over the top and sides, then press extra pecans and coconut onto the surface.',
  }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 27,
    panSize: 'Two round pans',
    equipment: ['Oven', 'Two round cake pans'],
    storage: 'Refrigerate, covered, up to 4 days — cream cheese frosting is not shelf-stable at room temperature.',
  })
}

// 12. German Chocolate — coconut-pecan mixture is filling AND top finish; sides traditionally bare.
{
  const r = byId('recipe_german_chocolate')
  const names = ['Shredded coconut (frosting)', 'Chopped pecans (frosting)', 'Evaporated milk (frosting)']
  const mix = []
  r.ingredients = r.ingredients.filter((ing) => {
    if (names.includes(ing.name)) {
      mix.push({ ...ing, name: ing.name.replace(/\s*\([^)]*\)\s*$/, '') })
      return false
    }
    return true
  })
  r.filling = {
    name: 'Coconut-Pecan Filling',
    ingredients: mix,
    prep: 'Cook the evaporated milk, sugar, and egg yolks over low heat until thickened, then stir in the coconut and pecans. Cool until spreadable.',
    applicationNotes: 'Layer between the cooled cake layers and over the top only.',
    chillGuidance: 'Let set before slicing.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally left bare (unfrosted) on the sides — the coconut-pecan filling doubles as the top finish.' }
  overview(r, {
    ovenTempC: 175,
    ovenTempF: 350,
    bakeTimeMinutes: 24,
    panSize: 'Three round pans',
    equipment: ['Oven', 'Three round cake pans'],
    storage: 'Refrigerate, covered, up to 4 days.',
  })
}

// Drop any undefined keys we set (JSON.stringify drops them automatically, but be explicit for clarity)
fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
