import { guides, trails } from './data'

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug)
}

export function getTrail(id: string) {
  return trails.find((t) => t.id === id)
}
