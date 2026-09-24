export interface FoodEntry {
  id: string
  world: 'cake' | 'cookies' | 'ramen' | 'noodles'
  name: string
  path: string
  place: string
  description: string
  lesson: string
  tags: string[]
  searchText: string
  image?: string
  credit?: string
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[-_]/g, ' ')
}

export function searchFoods(entries: FoodEntry[], query: string, world = 'all'): FoodEntry[] {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean)
  return entries.filter(item => world === 'all' || item.world === world)
    .map(item => {
      const name = normalizeSearch(item.name)
      const text = normalizeSearch(`${item.name} ${item.world} ${item.place} ${item.description} ${item.lesson} ${item.tags.join(' ')} ${item.searchText}`)
      return { item, score: words.every(word => text.includes(word))
        ? words.reduce((sum, word) => sum + (name.includes(word) ? 5 : 1), 1) : 0 }
    }).filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item)
}
