// Cookie 101 knowledge quiz (Crumb) -- immediate per-question feedback, no scoreboard, matching
// Ramen 101's pattern exactly.

export interface KnowledgeQuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}
