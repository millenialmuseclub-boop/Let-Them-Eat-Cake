const RECENTLY_VIEWED_KEY = 'recentlyViewedCakeIds'
const MAX_ENTRIES = 12

function readAll(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
  } catch {
    return []
  }
}

export function recordCakeView(cakeId: string): void {
  const existing = readAll().filter((id) => id !== cakeId)
  const next = [cakeId, ...existing].slice(0, MAX_ENTRIES)
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next))
}

export function getRecentlyViewed(limit = MAX_ENTRIES): string[] {
  return readAll().slice(0, limit)
}
