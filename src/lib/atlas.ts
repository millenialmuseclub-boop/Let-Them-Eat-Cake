import { regions } from './data'
import type { AtlasRegion, RegionalCakeEntry } from '../types/atlas'

export type AtlasDisplayRegion = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Middle East' | 'Oceania'

export const ATLAS_DISPLAY_REGIONS: AtlasDisplayRegion[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Middle East', 'Oceania']

/** Countries in the data's combined "Asia & Middle East" bucket that read as Middle East for display grouping; the rest fall under Asia. */
const MIDDLE_EAST_COUNTRIES = new Set(['Egypt', 'Iran', 'Lebanon', 'Turkey'])

/** Maps the data's underlying AtlasRegion onto the simpler 6-region display grouping used for browsing -- display-only, doesn't touch the underlying data. */
export function getDisplayRegion(entry: Pick<RegionalCakeEntry, 'region' | 'country'>): AtlasDisplayRegion {
  switch (entry.region) {
    case 'Latin America':
    case 'North America':
      return 'Americas'
    case 'Asia & Middle East':
      return MIDDLE_EAST_COUNTRIES.has(entry.country) ? 'Middle East' : 'Asia'
    default:
      return entry.region as Exclude<AtlasRegion, 'Latin America' | 'North America' | 'Asia & Middle East'>
  }
}

export function getAllCountries(): string[] {
  return Array.from(new Set(regions.map((r) => r.country))).sort()
}

export function getCountryEntries(country: string): RegionalCakeEntry[] {
  return regions.filter((r) => r.country.toLowerCase() === country.toLowerCase())
}

export function getPrimaryEntry(country: string): RegionalCakeEntry | undefined {
  const entries = getCountryEntries(country)
  return entries.find((e) => e.isPrimary) ?? entries[0]
}

/** Distinct countries in a display region, each with its primary entry -- for photographic region-browse cards. */
export function getCountriesForDisplayRegion(displayRegion: AtlasDisplayRegion): RegionalCakeEntry[] {
  const seen = new Set<string>()
  const result: RegionalCakeEntry[] = []
  for (const entry of regions) {
    if (getDisplayRegion(entry) !== displayRegion) continue
    const key = entry.country.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(getPrimaryEntry(entry.country) ?? entry)
  }
  return result.sort((a, b) => a.country.localeCompare(b.country))
}

/** Other countries sharing the same AtlasRegion — no separate "related countries" data needed. */
export function getRelatedCountries(country: string, limit = 4): string[] {
  const primary = getPrimaryEntry(country)
  if (!primary) return []

  const seen = new Set<string>([country.toLowerCase()])
  const related: string[] = []
  for (const entry of regions) {
    if (entry.region !== primary.region) continue
    const key = entry.country.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    related.push(entry.country)
    if (related.length >= limit) break
  }
  return related
}
