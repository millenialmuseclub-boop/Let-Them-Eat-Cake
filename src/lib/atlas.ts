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
