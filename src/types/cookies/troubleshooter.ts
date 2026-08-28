// Deterministic problem -> likely causes -> corrections data, ported directly from Ramen's
// Troubleshooter pattern (no AI anywhere in this file, matching master spec §13).

export interface TroubleshooterProblem {
  id: string
  problem: string
  likelyCauses: string[]
  corrections: string[]
  relatedLabSlug?: string
}
