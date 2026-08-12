import { cakes } from './data'
import type { CakeProfile } from '../types/cake'

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/** Deterministic — the same cake all day, no backend/randomness. */
export function getCakeOfTheDay(): CakeProfile {
  return cakes[dayOfYear() % cakes.length]
}
