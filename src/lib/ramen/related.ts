import type { RamenProfile } from '../../types/ramen/ramen'

export function relatedRamen(item: RamenProfile, all: RamenProfile[], limit = 3) {
  return all.filter(candidate => candidate.id !== item.id).map(candidate => {
    const shared = candidate.flavorTags.filter(tag => item.flavorTags.includes(tag))
    const broth = candidate.brothCharacter === item.brothCharacter
    return { ...candidate, relatedScore: shared.length * 3 + (broth ? 2 : 0),
      relatedReason: shared.length ? `Shares ${shared[0].replace(/-/g, ' ')} notes` : broth ? `A different take on ${item.brothCharacter} broth` : '' }
  }).filter(candidate => candidate.relatedScore > 0).sort((a, b) => b.relatedScore - a.relatedScore).slice(0, limit)
}
