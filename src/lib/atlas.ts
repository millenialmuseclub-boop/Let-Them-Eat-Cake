import { regions } from './data'
import type { RegionalCakeEntry } from '../types/atlas'

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
