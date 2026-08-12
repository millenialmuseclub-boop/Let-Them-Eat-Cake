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

// 1. Yellow Cake with Chocolate Frosting — frosting doubles as filling.
{
  const r = byId('recipe_yellow_choc_1950s')
  const frosting = pull(r, ['Butter (frosting)', 'Cocoa powder', 'Powdered sugar', 'Milk (frosting)'])
  r.filling = { none: true, note: 'The chocolate frosting is spread between the layers as well as over the top, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Chocolate Buttercream',
    ingredients: frosting,
    prep: 'Beat the frosting butter, cocoa, powdered sugar, and milk together until fluffy.',
    applicationNotes: 'Frost between the layers and over the top.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 27, panSize: 'Two 9-inch round pans', equipment: ['Oven', 'Two 9-inch round pans'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 2. Tunnel of Fudge Cake — bundt, no filling, glaze finish.
{
  const r = byId('recipe_tunnel_fudge_1960s')
  const glaze = pull(r, ['Powdered sugar (glaze)', 'Milk (glaze)'])
  r.filling = { none: true, note: 'A single bundt cake with no layers, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Milk Glaze',
    ingredients: glaze,
    prep: 'Whisk the powdered sugar with the milk until smooth and pourable.',
    applicationNotes: 'Drizzle over the cooled, inverted cake.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 55, panSize: '10-cup bundt pan', equipment: ['Oven', '10-cup bundt pan'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 3. Molten Chocolate Lava Cake — single individual dessert, no filling/frosting concept applies.
{
  const r = byId('recipe_molten_lava_1990s')
  overview(r, { ovenTempC: 220, ovenTempF: 425, bakeTimeMinutes: 11, panSize: 'Four ramekins', equipment: ['Oven', 'Four ramekins'], storage: 'Best served immediately; unbaked batter can be refrigerated in the ramekins up to 1 day ahead.' })
}

// 4. Rainbow Drip Cake — buttercream doubles as filling/crumb-coat; ganache is the drip finish.
{
  const r = byId('recipe_rainbow_drip_2010s')
  const finish = pull(r, ['White chocolate (ganache)', 'Heavy cream (ganache)', 'Butter (buttercream)', 'Powdered sugar (buttercream)'])
  r.filling = { none: true, note: 'The vanilla buttercream is spread between the layers as a crumb coat, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Vanilla Buttercream & Ganache Drip',
    ingredients: finish,
    prep: 'Beat the buttercream butter and powdered sugar together until smooth. Separately, warm the cream and pour over the white chocolate, stirring until glossy.',
    applicationNotes: 'Crumb-coat and frost the stacked, chilled layers with buttercream first, chilling again. Once the ganache has cooled slightly, drip it down the sides.',
    chillGuidance: 'Chill between the crumb coat and final coat, and again before adding the drip, so it holds a clean edge.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 24, panSize: 'Four 6-inch round pans', equipment: ['Oven', 'Four 6-inch round pans'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 5. Brooklyn Blackout Cake — chocolate pudding filling (also on top); crumb coat is not a separate frosting.
{
  const r = byId('recipe_brooklyn_blackout')
  const pudding = pull(r, ['Granulated sugar (pudding)', 'Cocoa powder (pudding)', 'Cornstarch', 'Milk (pudding)', 'Egg yolks (pudding)', 'Butter (pudding)'])
  r.filling = {
    name: 'Chocolate Pudding',
    ingredients: pudding,
    prep: 'Whisk the pudding sugar, pudding cocoa, and cornstarch in a saucepan, whisk in the pudding milk and egg yolks, and cook over medium heat, stirring constantly, until thickened. Stir in the pudding butter, then chill.',
    applicationNotes: 'Spread between the two remaining cake layers and over the top.',
    chillGuidance: 'Chill the pudding fully before assembling so it holds its shape.',
  }
  r.frostingFinish = { none: true, note: 'Finished with crumbs from the crumbled third cake layer pressed over the outside, rather than a separate frosting.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 24, panSize: 'Three 8-inch pans', equipment: ['Oven', 'Three 8-inch round pans'], storage: 'Refrigerate, covered, up to 4 days — the pudding filling needs to stay chilled.' })
}

// 6. Lane Cake — bourbon-pecan-cherry filling, deliberately bare outside.
{
  const r = byId('recipe_lane_cake')
  const filling = pull(r, ['Egg yolks (filling)', 'Granulated sugar (filling)', 'Butter (filling)', 'Bourbon', 'Chopped pecans', 'Candied cherries, chopped'])
  r.filling = {
    name: 'Bourbon-Pecan-Cherry Filling',
    ingredients: filling,
    prep: 'Cook the filling egg yolks, filling sugar, and filling butter over low heat, stirring constantly, until thickened. Remove from heat and stir in the bourbon, pecans, and cherries.',
    applicationNotes: 'Spread between the layers only.',
    chillGuidance: 'Let set before slicing.',
  }
  r.frostingFinish = { none: true, note: 'Traditionally left bare on the outside — only the filling shows between the layers.' }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 22, panSize: 'Three 9-inch pans', equipment: ['Oven', 'Three 9-inch round pans'], storage: 'Keeps at room temperature, covered, for 3-4 days.' })
}

// 7. Guinness Chocolate Cake — single layer, cream cheese frosting on top only.
{
  const r = byId('recipe_guinness_chocolate')
  const frosting = pull(r, ['Cream cheese', 'Powdered sugar', 'Heavy cream (frosting)'])
  r.filling = { none: true, note: 'A single-layer cake, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Cream Cheese Frosting',
    ingredients: frosting,
    prep: 'Beat the cream cheese, powdered sugar, and cream together until smooth.',
    applicationNotes: 'Spread over the top only, traditionally left white like the head of a stout.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 47, panSize: '9-inch springform pan', equipment: ['Oven', '9-inch springform pan'], storage: 'Refrigerate, covered, up to 4 days.' })
}

// 8. Dobos Torte — chocolate buttercream doubles as filling/frosting; caramel wedge garnish.
{
  const r = byId('recipe_dobos_torte')
  const finish = pull(r, ['Butter (buttercream)', 'Powdered sugar', 'Dark chocolate, melted', 'Granulated sugar (caramel)'], (n) =>
    n === 'Granulated sugar (caramel)' ? 'Granulated sugar (for caramel)' : n.replace(/\s*\([^)]*\)\s*$/, ''),
  )
  r.filling = { none: true, note: 'The chocolate buttercream is spread between the layers as well as over the outside, so no separate filling is used.' }
  r.frostingFinish = {
    name: 'Chocolate Buttercream & Caramel Wedges',
    ingredients: finish,
    prep: 'Beat the buttercream butter, powdered sugar, and melted chocolate together into a smooth buttercream. Separately, melt the caramel sugar until amber.',
    applicationNotes: 'Stack five layers with buttercream between each and over the outside. Pour the caramel over the sixth layer, quickly cut into wedges before it hardens, and arrange on top as a garnish.',
  }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 6, panSize: 'Baking sheet (6 thin layers)', equipment: ['Oven', 'Baking sheet', 'Offset spatula'], storage: 'Keeps at room temperature, covered, for 3 days.' })
}

// 9. Paris-Brest — praline pastry cream filling, powdered sugar dusting finish.
{
  const r = byId('recipe_paris_brest')
  const cream = pull(r, ['Whole milk', 'Egg yolks', 'Granulated sugar (cream)', 'Cornstarch', 'Hazelnut praline paste'])
  const dusting = pull(r, ['Powdered sugar (dusting)'], () => 'Powdered sugar')
  r.filling = {
    name: 'Praline Pastry Cream',
    ingredients: cream,
    prep: 'Whisk the egg yolks, sugar, and cornstarch, then temper with hot milk. Cook until thickened, then whisk in the praline paste. Chill fully.',
    applicationNotes: 'Split the choux ring horizontally and pipe the cream generously into the bottom half.',
    chillGuidance: 'Chill the pastry cream completely before piping so it holds its shape.',
  }
  r.frostingFinish = {
    name: 'Powdered Sugar Dusting',
    ingredients: dusting,
    prep: 'No preparation needed.',
    applicationNotes: 'Dust over the top just before serving.',
  }
  overview(r, { ovenTempC: 200, ovenTempF: 400, bakeTimeMinutes: 32, panSize: 'Baking sheet (piped ring)', equipment: ['Oven', 'Piping bag', 'Baking sheet'], storage: 'Refrigerate, assembled, up to 1 day — choux softens quickly once filled.' })
}

// 10. Cassata Siciliana — ricotta filling inside, marzipan-and-icing outer finish.
{
  const r = byId('recipe_cassata_siciliana')
  const filling = pull(r, ['Ricotta cheese', 'Powdered sugar', 'Candied citrus peel', 'Mini chocolate chips', 'Lemon zest'])
  const finish = pull(r, ['Green marzipan', 'White icing'])
  r.filling = {
    name: 'Sweet Ricotta',
    ingredients: filling,
    prep: 'Beat the ricotta with powdered sugar until smooth, then fold in the candied fruit, chocolate chips, and lemon zest.',
    applicationNotes: 'Fill the sponge-lined mold with the ricotta mixture and top with more sponge.',
    chillGuidance: 'Chill for at least 4 hours so the filling sets before unmolding.',
  }
  r.frostingFinish = {
    name: 'Marzipan & Icing',
    ingredients: finish,
    prep: 'Roll the marzipan out to wrap the sides.',
    applicationNotes: 'Wrap the unmolded cassata in marzipan, then top with white icing and decorate with additional candied fruit.',
  }
  overview(r, { panSize: 'Bowl or cassata mold', equipment: ['Cassata mold or bowl', 'Rolling pin'], storage: 'Refrigerate, covered, up to 3 days — the ricotta filling needs to stay chilled.' })
}

// 11. Battenberg — apricot jam glues the checkerboard, marzipan wraps the outside.
{
  const r = byId('recipe_battenberg')
  const jam = pull(r, ['Apricot jam'])
  const finish = pull(r, ['Marzipan'])
  r.filling = {
    name: 'Apricot Jam',
    ingredients: jam,
    prep: 'Warm the jam until spreadable.',
    applicationNotes: 'Brush over the trimmed sponge strips and use it to glue them into the checkerboard pattern.',
  }
  r.frostingFinish = {
    name: 'Marzipan Wrap',
    ingredients: finish,
    prep: 'Roll the marzipan out into a sheet large enough to wrap the assembled cake.',
    applicationNotes: 'Wrap the checkerboard cake in the marzipan sheet, trimming the seam neatly.',
  }
  overview(r, { ovenTempC: 175, ovenTempF: 350, bakeTimeMinutes: 27, panSize: 'Divided loaf pan (two sections)', equipment: ['Oven', 'Divided loaf pan'], storage: 'Keeps at room temperature, covered, for 4-5 days.' })
}

// 12. King Cake — cinnamon filling rolled inside; icing + sanding sugar finish.
{
  const r = byId('recipe_king_cake')
  const filling = pull(r, ['Cinnamon (filling)'], () => 'Cinnamon')
  const finish = pull(r, ['Powdered sugar (icing)', 'Purple, green, and gold sanding sugar'], (n) => (n === 'Powdered sugar (icing)' ? 'Powdered sugar' : n))
  r.filling = {
    name: 'Cinnamon Sugar',
    ingredients: filling,
    prep: 'No cooking required — the cinnamon is sprinkled directly onto the rolled dough along with a portion of the reserved sugar.',
    applicationNotes: 'Roll up into a long log before shaping into a ring.',
  }
  r.frostingFinish = {
    name: 'Icing & Sanding Sugar',
    ingredients: finish,
    prep: 'Whisk the powdered sugar with a splash of milk or water until smooth and pourable.',
    applicationNotes: 'Drizzle over the cooled ring, then immediately alternate bands of purple, green, and gold sanding sugar before the icing sets.',
  }
  overview(r, { ovenTempC: 190, ovenTempF: 375, bakeTimeMinutes: 27, panSize: 'Baking sheet (ring-shaped)', equipment: ['Oven', 'Baking sheet', 'Stand mixer or hands for kneading'], storage: 'Keeps at room temperature, covered, for 2-3 days — it is a yeasted bread, best fresh.' })
}

fs.writeFileSync(path, JSON.stringify(recipes, null, 2) + '\n', 'utf8')
console.log('done')
