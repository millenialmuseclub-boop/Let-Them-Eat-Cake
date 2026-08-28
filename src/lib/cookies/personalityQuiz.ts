import { PERSONALITY_QUIZ, PERSONALITIES_BY_COOKIE_ID } from './data'
import type { CookiePersonality } from '../../types/cookies/personalityQuiz'

export function tallyQuiz(answers: Record<string, string>): CookiePersonality | undefined {
  const counts = new Map<string, number>()
  for (const question of PERSONALITY_QUIZ) {
    const optionId = answers[question.id]
    const option = question.options.find((o) => o.id === optionId)
    if (!option) continue
    counts.set(option.cookieId, (counts.get(option.cookieId) ?? 0) + 1)
  }
  let winnerId: string | undefined
  let winnerCount = -1
  for (const [cookieId, count] of counts) {
    if (count > winnerCount) {
      winnerCount = count
      winnerId = cookieId
    }
  }
  if (!winnerId) return undefined
  return PERSONALITIES_BY_COOKIE_ID.get(winnerId)
}
