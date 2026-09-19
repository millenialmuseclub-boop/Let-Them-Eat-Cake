import type { NoodleDish, NoodleType } from '../types/noodles/noodle'

// Editorial associations use the content's own technique/family fields, not browsing history.
export function cookieRecommendations(family: string): string[] {
  if (family === 'wafer') return ['product_digital_scale_cake', 'product_vanilla']
  if (family === 'bar') return ['release-square-pan', 'product_digital_scale_cake', 'release-cooling-rack']
  if (family === 'drop') return ['release-cookie-scoop', 'release-baking-sheets', 'release-cooling-rack']
  if (family === 'rolled') return ['release-rolling-pin', 'release-baking-mat', 'release-baking-sheets']
  return ['release-baking-sheets', 'release-baking-mat', 'product_digital_scale_cake']
}

export function noodleTechniqueRecommendations(techniques: NoodleType['techniqueIds']): string[] {
  if (techniques.includes('stretched')) return ['release-bamboo-steamer', 'precision-kitchen-scale']
  if (techniques.some(id => id === 'hand-pulled' || id === 'hand-torn')) return ['large-wood-cutting-board', 'dough-scraper', 'precision-kitchen-scale']
  if (techniques.includes('rolled-and-cut')) return ['marcato-atlas-150-pasta-machine', 'noodle-tools-bench-scraper', 'precision-kitchen-scale']
  if (techniques.includes('knife-cut')) return ['large-wood-cutting-board', 'precision-kitchen-scale']
  return ['precision-kitchen-scale']
}

export function noodleDishRecommendations(dish: NoodleDish): string[] {
  if (dish.preparationStyle === 'stir-fried') return ['release-carbon-steel-wok', 'ramen-noodle-strainer-basket', 'large-wood-cutting-board']
  if (dish.preparationStyle === 'soup') return ['stockpot-8qt', 'ramen-noodle-strainer-basket', 'broth-soup-ladle']
  return ['ramen-noodle-strainer-basket', 'product_donburi_bowls', 'reusable-bamboo-chopsticks']
}

export function ramenRecommendations(tare: string): string[] {
  const seasoning = /miso/i.test(tare) ? 'product_miso_paste' : /shoyu|soy/i.test(tare) ? 'product_shoyu_dark' : undefined
  return [seasoning, 'ramen-noodle-strainer-basket', 'product_donburi_bowls'].filter((id): id is string => !!id)
}
