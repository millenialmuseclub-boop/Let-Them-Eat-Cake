import { cakePersonalities, cakes } from './data'
import type { CakeProfile, CakeTexture, FlavorProfile } from '../types/cake'
import type { AestheticTag, MoodTag } from '../types/persona'
import type { CakePersonality, FlavorPull, QuizAnswers, ScoredMatch } from '../types/personaMatch'

interface PersonaMatchWeights {
  baseScore: number
  maxDistancePenalty: number
  textureMatchBonus: number
  moodTagBonus: number
  aestheticTagBonus: number
}

/**
 * Starting-point heuristic weights, same spirit as sommelier.ts's DEFAULT_PAIRING_WEIGHTS —
 * tune here rather than in the scoring formula itself.
 */
export const DEFAULT_PERSONA_MATCH_WEIGHTS: PersonaMatchWeights = {
  baseScore: 100,
  maxDistancePenalty: 60,
  textureMatchBonus: 15,
  moodTagBonus: 15,
  aestheticTagBonus: 10,
}

const FLAVOR_AXES: (keyof FlavorProfile)[] = ['sweetness', 'fatRichness', 'acidity', 'intensity']

// Every axis is 1-5, so the maximum possible distance across all 4 axes is sqrt(4 * 4^2) = 8.
const MAX_FLAVOR_DISTANCE = Math.sqrt(FLAVOR_AXES.length * 4 ** 2)

export const FLAVOR_PULL_AXIS: Record<FlavorPull, keyof FlavorProfile> = {
  'bright-tart': 'acidity',
  'rich-buttery': 'fatRichness',
  'bold-intense': 'intensity',
  'simply-sweet': 'sweetness',
}

export function quizToFlavorProfile(quiz: QuizAnswers): FlavorProfile {
  const profile: FlavorProfile = { sweetness: 3, fatRichness: 3, acidity: 3, intensity: 3 }
  profile[FLAVOR_PULL_AXIS[quiz.flavorPull]] = 5
  return profile
}

function flavorDistance(a: FlavorProfile, b: FlavorProfile): number {
  const sumSquares = FLAVOR_AXES.reduce((sum, axis) => sum + (a[axis] - b[axis]) ** 2, 0)
  return Math.sqrt(sumSquares)
}

function scoreCandidate(
  quiz: QuizAnswers,
  candidateProfile: FlavorProfile,
  candidateTexture: CakeTexture,
  candidateTags: { moods?: MoodTag[]; aesthetics?: AestheticTag[] } | undefined,
  weights: PersonaMatchWeights = DEFAULT_PERSONA_MATCH_WEIGHTS,
): number {
  const quizProfile = quizToFlavorProfile(quiz)
  const distance = flavorDistance(quizProfile, candidateProfile)
  const distancePenalty = (distance / MAX_FLAVOR_DISTANCE) * weights.maxDistancePenalty

  const textureBonus = candidateTexture === quiz.texture ? weights.textureMatchBonus : 0
  const moodBonus = candidateTags?.moods?.includes(quiz.mood) ? weights.moodTagBonus : 0
  const aestheticBonus = candidateTags?.aesthetics?.includes(quiz.aesthetic) ? weights.aestheticTagBonus : 0

  const rawScore = weights.baseScore - distancePenalty + textureBonus + moodBonus + aestheticBonus
  return Math.min(100, Math.max(0, rawScore))
}

export function matchPersonality(quiz: QuizAnswers, pool: CakePersonality[] = cakePersonalities): ScoredMatch<CakePersonality> {
  const scored = pool.map((personality) => ({
    item: personality,
    score: scoreCandidate(quiz, personality.targetFlavorProfile, personality.targetTexture, {
      moods: personality.moodAffinity,
      aesthetics: personality.aestheticAffinity,
    }),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored[0]
}

export function matchRecommendedCakes(quiz: QuizAnswers, limit = 3, pool: CakeProfile[] = cakes): CakeProfile[] {
  const scored = pool.map((cake) => ({
    item: cake,
    score: scoreCandidate(quiz, cake.flavorProfile, cake.texture, cake.personaTags),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.item)
}

export function personalityResult(personality: CakePersonality, limit = 3, pool: CakeProfile[] = cakes): CakeProfile[] {
  const syntheticQuiz: QuizAnswers = {
    mood: personality.moodAffinity?.[0] ?? 'cozy-sunday',
    flavorPull: dominantFlavorPull(personality.targetFlavorProfile),
    texture: personality.targetTexture,
    aesthetic: personality.aestheticAffinity?.[0] ?? 'cottagecore',
  }
  return matchRecommendedCakes(syntheticQuiz, limit, pool)
}

function dominantFlavorPull(profile: FlavorProfile): FlavorPull {
  let best: FlavorPull = 'simply-sweet'
  let bestValue = -Infinity
  for (const [pull, axis] of Object.entries(FLAVOR_PULL_AXIS) as [FlavorPull, keyof FlavorProfile][]) {
    if (profile[axis] > bestValue) {
      bestValue = profile[axis]
      best = pull
    }
  }
  return best
}
