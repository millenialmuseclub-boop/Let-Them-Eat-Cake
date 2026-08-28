// Workshop Foundation types (master spec §10-12). RamenAnatomyStage mirrors
// Cake's CakeAnatomyStage shape (CAKE_REFERENCE_AUDIT.md §1) with ramen's own
// field names. BowlComponent is new: Cake's Assembly Lab has no compatibility
// concept at all (audit §6), so there's no Cake type to adapt for it.

export interface RamenAnatomyStage {
  id: string
  name: string
  whatItIs: string
  contributes: string
  commonExamples: string[]
  interaction: string
}

export type BowlComponentCategory = 'broth' | 'tare' | 'aromaOil' | 'noodle' | 'protein' | 'vegetable' | 'topping' | 'finish'

export interface BowlComponent {
  id: string
  category: BowlComponentCategory
  name: string
  description: string
  colorHex: string
  /** 1 (light) to 5 (very rich) -- borrowed from the canonical ramen(s) this option is drawn from. */
  richness: number
  /** Canonical ramen.json ids this option is documented on. Traditional-tier compatibility between
      two components is derived from these sets overlapping (master spec §12's "derive from the
      existing 8 canonical records" instruction) rather than hand-authored per pair. */
  sourceRamenIds: string[]
}

export type CompatibilityTier = 'traditional' | 'compatible' | 'experimental' | 'discouraged'

export interface CompatibilityResult {
  tier: CompatibilityTier
  reason: string
}
