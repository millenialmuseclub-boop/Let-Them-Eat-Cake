// Adapted from Cake's src/lib/atlas.ts (CAKE_REFERENCE_AUDIT.md §5). Cake
// browses by country; Ramen's Phase 1 spec anchors are cities within Japan
// (master spec §9), so the browsable unit here is cityMicroRegion instead of
// country. The 6-bucket AtlasRegion grouping is kept even though only "Asia"
// is populated yet, so the structure doesn't need a redesign when Ramen
// expands beyond Japan.

import { regions } from './data'
import type { RegionalRamenEntry } from '../../types/ramen/atlas'

export function getRegionEntryForRamen(ramenId: string): RegionalRamenEntry | undefined {
  return regions.find((r) => r.ramenId === ramenId)
}

export function getAllCities(): string[] {
  return Array.from(new Set(regions.map((r) => r.cityMicroRegion))).sort()
}

export function getEntryForCity(city: string): RegionalRamenEntry | undefined {
  return regions.find((r) => r.cityMicroRegion.toLowerCase() === city.toLowerCase())
}
