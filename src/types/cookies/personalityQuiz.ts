// Cookie Personality Quiz -- adapted directly from Ramen's tally-style quiz (master spec §4 of
// the Phase 1 prompt). Each answer option points at one cookie id directly; whichever id
// accumulates the most picks wins. No shared code with Sommelier FIND's weighted scoring.

export interface QuizOption {
  id: string
  label: string
  cookieId: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface CookiePersonality {
  cookieId: string
  title: string
  description: string
  whyItFits: string
}
