import { ramenPersonalities } from './data'

export function scoreQuiz(selectedRamenIds: string[]): string {
  const counts = new Map<string, number>()
  for (const id of selectedRamenIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  let best = selectedRamenIds[0]
  let bestCount = 0
  for (const [id, count] of counts) {
    if (count > bestCount) {
      best = id
      bestCount = count
    }
  }
  return best
}

export function getPersonality(ramenId: string) {
  return ramenPersonalities.find((p) => p.ramenId === ramenId)
}
