// Curated Collections (Phase 7 §3). References canonical ramen ids only -- no duplicated
// editorial content -- so the system scales as the Encyclopedia grows toward the 100-entry
// target (§10) without any redesign here.

export interface Collection {
  id: string
  title: string
  description: string
  ramenIds: string[]
}
