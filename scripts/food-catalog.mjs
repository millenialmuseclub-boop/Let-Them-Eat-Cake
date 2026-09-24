// Build-time adapter: reuse canonical content without shipping recipe payloads in search.
import fs from 'node:fs'
import { dishes } from '../src/data/noodles/dishes.ts'
import { noodleTypes } from '../src/data/noodles/noodleTypes.ts'
import { recipes as noodleRecipes } from '../src/data/noodles/recipes.ts'
import { countries, places } from '../src/data/noodles/geo.ts'
import { getImageFor } from '../src/data/noodles/images.ts'
const read = path => JSON.parse(fs.readFileSync(`src/data/${path}.json`, 'utf8'))
const cakeRegions = read('regions'), cakeRecipes = read('recipes')
const cookieRecipes = read('cookies/recipes')
const imageSets = { cake: read('cakeImages'), cookies: read('cookies/cookieImages'), ramen: read('ramen/ramenImages') }
const photo = (world, id) => {
  const image = imageSets[world][id]
  return image ? { image: image.url, credit: [image.photographer, image.source ?? (image.unsplashUrl ? "Unsplash" : undefined)].filter(Boolean).join(" / ") } : {}
}
const cakes = read('cakes').map(item => ({
  id: item.id, world: 'cake', name: item.name, path: `/cake/${item.id}`,
  place: [...new Set(cakeRegions.filter(r => r.cakeId === item.id).map(r => r.country))].join(' · '),
  description: item.description, lesson: `Texture: ${item.texture}. Flavor notes: ${item.flavorNotes.join(', ')}.`,
  tags: [item.texture, ...item.flavorNotes],
  searchText: cakeRecipes.filter(r => r.cakeId === item.id).flatMap(r => r.ingredients.map(i => i.name)).join(' '),
  ...photo('cake', item.id),
}))
const cookies = read('cookies/cookies').map(item => ({
  id: item.id, world: 'cookies', name: item.name, path: `/cookies/encyclopedia/${item.id}`,
  place: item.origin, description: item.description, lesson: item.preparationOverview,
  tags: [item.textureCategory, item.family, ...item.flavorTags],
  searchText: [item.localName, item.dominantFat, item.sweetener, item.leavening, ...item.commonMixIns,
    ...cookieRecipes.filter(r => r.cookieId === item.id).flatMap(r => r.ingredientGroups.flatMap(g => g.ingredients.map(i => i.ingredient)))].join(' '),
  ...photo('cookies', item.id),
}))
const ramen = read('ramen/ramen').map(item => ({
  id: item.id, world: 'ramen', name: item.name, path: `/ramen/ramen/${item.id}`,
  place: `${item.origin}, Japan`, description: item.description, lesson: item.noodleCharacteristics,
  tags: [item.brothCharacter, ...item.flavorTags],
  searchText: [item.japaneseName, item.romanization, item.broth, item.tare, item.aromaOil, item.noodleStyle,
    item.preparationOverview, ...item.traditionalToppings].join(' '), ...photo('ramen', item.id),
}))
const noodles = dishes.map(item => {
  const type = noodleTypes.find(t => t.id === item.noodleTypeId)
  const image = getImageFor(item.id)
  return {
    id: item.id, world: 'noodles', name: item.name, path: `/noodles/encyclopedia/${item.id}`,
    place: [places.find(p => p.id === item.place.cityOrAreaId)?.name, countries.find(c => c.id === item.place.countryId)?.name].filter(Boolean).join(', '),
    description: item.brothOrSauceRelationship, lesson: type ? `${type.name}: ${type.texture}` : item.culturalContext,
    tags: [item.preparationStyle, ...(type ? [type.base, type.form] : []), ...item.flavorTags],
    searchText: [item.localName, item.romanization, ...(item.alternateNames ?? []), ...item.primaryTechniqueIds,
      ...noodleRecipes.filter(r => r.dishId === item.id).flatMap(r => r.ingredientGroups.flatMap(g => g.items.map(i => i.ingredient)))].join(' '),
    ...(image ? { image: image.src, credit: image.credit.creator } : {}),
  }
})
function sizedImage(url) {
  if (!url || !url.startsWith('https://')) return url
  const parsed = new URL(url)
  if (['images.pexels.com', 'images.unsplash.com'].includes(parsed.hostname)) {
    parsed.searchParams.set('w', '640')
    parsed.searchParams.set('auto', 'compress')
  }
  return parsed.href
}
// Interleave worlds, so unfiltered discovery doesn't start with 118 cakes.
export const catalog = Array.from({length: Math.max(cakes.length, cookies.length, ramen.length, noodles.length)}, (_, i) =>
  [cakes[i], cookies[i], ramen[i], noodles[i]].filter(Boolean)).flat().map(item => ({ ...item, ...(item.image ? { image: sizedImage(item.image) } : {}) }))
