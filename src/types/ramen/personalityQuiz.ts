// Ramen Personality Quiz (master spec-adjacent, Phase 7 instruction §2). Deliberately a
// different mechanism from Sommelier FIND's weighted attribute scoring (lib/sommelier.ts) --
// this is a classic tally-style personality quiz: each answer option points at one ramen id
// directly, and whichever id accumulates the most picks wins. No shared code with FIND/PAIR.

export interface QuizOption {
  id: string
  label: string
  ramenId: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface RamenPersonality {
  ramenId: string
  title: string
  description: string
  whyItFits: string
}
