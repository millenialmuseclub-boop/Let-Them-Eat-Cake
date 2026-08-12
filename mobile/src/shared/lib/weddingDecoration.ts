import { weddingDecorationStyles } from './data'
import type { WeddingDecorationStyle } from '../types/weddingCake'

interface DecorationScoreWeights {
  baseScore: number
  aestheticMatchBonus: number
}

/**
 * Starting-point heuristic weights, same spirit as sommelier.ts's DEFAULT_PAIRING_WEIGHTS —
 * tune here rather than in the scoring formula itself.
 */
export const DEFAULT_DECORATION_SCORE_WEIGHTS: DecorationScoreWeights = {
  baseScore: 50,
  aestheticMatchBonus: 30,
}

export interface ScoredDecorationStyle {
  style: WeddingDecorationStyle
  score: number
  breakdown: Record<string, number>
}

export function scoreDecorationStyle(
  style: WeddingDecorationStyle,
  aestheticId: string,
  weights: DecorationScoreWeights = DEFAULT_DECORATION_SCORE_WEIGHTS,
): { score: number; breakdown: Record<string, number> } {
  const aestheticMatchBonus = style.bestForAestheticIds?.includes(aestheticId) ? weights.aestheticMatchBonus : 0
  const rawScore = weights.baseScore + aestheticMatchBonus
  const score = Math.min(100, Math.max(0, rawScore))
  return { score, breakdown: { base: weights.baseScore, aestheticMatchBonus } }
}

export function rankDecorationStyles(aestheticId: string, pool: WeddingDecorationStyle[] = weddingDecorationStyles): ScoredDecorationStyle[] {
  return pool.map((style) => ({ style, ...scoreDecorationStyle(style, aestheticId) })).sort((a, b) => b.score - a.score)
}
