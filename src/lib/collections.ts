import { cakes } from './data'
import type { Collection } from '../types/collection'
import type { CakeProfile } from '../types/cake'

function matchesRule(cake: CakeProfile, rule: Collection['rule']): boolean {
  switch (rule.type) {
    case 'flavorNote':
      return cake.flavorNotes.some((note) => rule.values.includes(note))
    case 'texture':
      return cake.texture === rule.value
    case 'mood':
      return cake.personaTags?.moods?.includes(rule.value) ?? false
  }
}

export function getCollectionCakes(collection: Collection): CakeProfile[] {
  return cakes.filter((cake) => matchesRule(cake, collection.rule))
}
