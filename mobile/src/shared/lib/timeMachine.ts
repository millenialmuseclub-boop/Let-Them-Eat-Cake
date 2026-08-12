import { decades } from './data'
import type { HistoricalCakeEntry } from '../types/timeMachine'

export interface DateOfBirth {
  day: number
  month: number
  year: number
}

/**
 * Decades are seeded through the 2020s (yearEnd 2029). Birth years outside
 * the seeded range fall back to the closest bounded decade rather than
 * returning undefined, so the feature never dead-ends on real user input.
 */
export function getCakeForBirthYear(year: number): HistoricalCakeEntry {
  const sorted = [...decades].sort((a, b) => a.yearStart - b.yearStart)
  const match = sorted.find((entry) => year >= entry.yearStart && year <= entry.yearEnd)
  if (match) return match
  return year < sorted[0].yearStart ? sorted[0] : sorted[sorted.length - 1]
}

export function getCakeForDob(dob: DateOfBirth): HistoricalCakeEntry {
  return getCakeForBirthYear(dob.year)
}
