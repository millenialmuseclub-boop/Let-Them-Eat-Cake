import { labs } from './data'

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug)
}
