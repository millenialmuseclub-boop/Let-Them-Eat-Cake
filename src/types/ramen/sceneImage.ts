// Generic, non-ramen-specific editorial photography (Workshop Labs, Main, Slurp, Collections,
// etc.) -- same shape/attribution requirements as RamenImage, but keyed by an arbitrary scene id
// instead of a canonical ramen id, mirroring Cake's sceneImages.json pattern
// (CAKE_REFERENCE_AUDIT.md §12) for exactly this "content that isn't one specific cake/ramen"
// case (e.g. Curated Kitchen's own hero art in Cake).

export interface SceneImage {
  url: string
  photographer: string
  photographerUrl?: string
  source: string
  sourceUrl?: string
}
