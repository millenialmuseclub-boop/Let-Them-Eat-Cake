// Workshop Foundation types (master spec §11-13). CookieAnatomyStage mirrors Ramen's
// RamenAnatomyStage shape with Cookies' own field names. DoughComponent is Cookies' own
// Build-a-Cookie equivalent of Ramen's BowlComponent -- same "derive traditional-tier
// compatibility from co-occurrence on real records" approach (master spec §12 of the Phase 1
// prompt: "seed only enough compatibility logic to validate the architecture").

export interface CookieAnatomyStage {
  id: string
  name: string
  whatItIs: string
  contributes: string
  commonForms: string[]
  interaction: string
}

export type DoughComponentCategory = 'family' | 'flour' | 'fat' | 'sugar' | 'leavening' | 'flavor' | 'mixIn' | 'filling' | 'finish'

export interface DoughComponent {
  id: string
  category: DoughComponentCategory
  name: string
  description: string
  colorHex: string
  /** 1 (light) to 5 (very rich) -- borrowed from the canonical cookie(s) this option is drawn from. */
  richness: number
  /** Canonical cookies.json ids this option is documented on. Traditional-tier compatibility
      between two components is derived from these sets overlapping, rather than hand-authored
      per pair. */
  sourceCookieIds: string[]
}

export type CompatibilityTier = 'traditional' | 'compatible' | 'experimental' | 'discouraged'

export interface CompatibilityResult {
  tier: CompatibilityTier
  reason: string
}
