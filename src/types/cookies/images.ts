// Source-agnostic image record -- Cookies deliberately does NOT hard-code one photography
// provider the way Cake (Unsplash) or Ramen (Pexels) did (Phase 1 instruction §1: "Photography
// infrastructure must remain SOURCE-AGNOSTIC"). Every image carries its own `source` label, so
// Unsplash, Pexels, or any other legitimately-licensed source can be mixed within the same
// dataset without a type or component change.

export interface CookieImage {
  url: string
  photographer: string
  photographerUrl?: string
  source: string
  sourceUrl?: string
}

/** Generic, non-cookie-specific editorial photography (Workshop Labs, Main, Crumb, Sommelier,
    Collections, Curated Kitchen category headers, etc.) -- same shape/attribution requirements as
    CookieImage, keyed by an arbitrary scene id instead of a canonical cookie id. */
export type SceneImage = CookieImage
