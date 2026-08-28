// FIND deterministic weighted-scoring engine. Ported structurally from Ramen's src/lib/sommelier.ts
// -- no LLM, no randomness, a plain-language explainer alongside the numeric score.

import { COOKIES } from './data'
import type { CookieProfile } from '../../types/cookies/cookie'
import type { FindQuery, FindWeights, FindResult } from '../../types/cookies/sommelier'

export const DEFAULT_WEIGHTS: FindWeights = {
  baseScore: 70,
  sweetnessGapPenalty: 6,
  richnessGapPenalty: 6,
  crispnessGapPenalty: 5,
  flavorTagBonus: 8,
  familyMatchBonus: 6,
}

export function scoreCookie(cookie: CookieProfile, query: FindQuery, weights: FindWeights = DEFAULT_WEIGHTS): FindResult {
  const sweetnessGap = Math.abs(cookie.flavorProfile.sweetness - query.sweetness)
  const richnessGap = Math.abs(cookie.flavorProfile.richness - query.richness)
  const crispnessGap = Math.abs(cookie.flavorProfile.crispness - query.crispness)
  const matchedFlavorTags = cookie.flavorTags.filter((tag) => query.flavorPreferences.includes(tag))
  const familyMatched = query.familyPreference === 'flexible' || cookie.family === query.familyPreference

  let score = weights.baseScore
  score -= sweetnessGap * weights.sweetnessGapPenalty
  score -= richnessGap * weights.richnessGapPenalty
  score -= crispnessGap * weights.crispnessGapPenalty
  score += matchedFlavorTags.length * weights.flavorTagBonus
  score += familyMatched ? weights.familyMatchBonus : 0

  score = Math.max(0, Math.min(100, Math.round(score)))

  return {
    score,
    breakdown: { sweetnessGap, richnessGap, crispnessGap, matchedFlavorTags, familyMatched },
  }
}

export function findCookies(query: FindQuery, limit = 5): { cookie: CookieProfile; result: FindResult }[] {
  return COOKIES.map((cookie) => ({ cookie, result: scoreCookie(cookie, query) }))
    .sort((a, b) => b.result.score - a.result.score)
    .slice(0, limit)
}

export function explainResult(cookie: CookieProfile, result: FindResult): string {
  const parts: string[] = []
  if (result.breakdown.sweetnessGap === 0) parts.push('matches your sweetness preference exactly')
  else if (result.breakdown.sweetnessGap <= 1) parts.push('is close to your sweetness preference')
  if (result.breakdown.richnessGap <= 1) parts.push('lines up well with the richness you want')
  if (result.breakdown.crispnessGap <= 1) parts.push('has close to the texture you asked for')
  if (result.breakdown.matchedFlavorTags.length > 0) {
    parts.push(`shares your interest in ${result.breakdown.matchedFlavorTags.join(', ')}`)
  }
  if (result.breakdown.familyMatched) parts.push(`is a ${cookie.family} cookie, as requested`)
  if (parts.length === 0) return `${cookie.name} is a reasonable overall match, even without a strong specific alignment.`
  return `${cookie.name} ${parts.join('; ')}.`
}
