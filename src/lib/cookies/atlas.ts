import { REGIONS, TRADITIONS } from './data'
import type { RegionalCookieEntry, WorldRegionTradition } from '../../types/cookies/atlas'

export function regionsByWorldRegion(): Map<string, RegionalCookieEntry[]> {
  const map = new Map<string, RegionalCookieEntry[]>()
  for (const entry of REGIONS) {
    const list = map.get(entry.worldRegion) ?? []
    list.push(entry)
    map.set(entry.worldRegion, list)
  }
  return map
}

export function getTradition(worldRegion: string): WorldRegionTradition | undefined {
  return TRADITIONS.find((t) => t.worldRegion === worldRegion)
}

export function worldRegions(): string[] {
  return Array.from(new Set(REGIONS.map((r) => r.worldRegion)))
}
