// Atlas / Browse by Origin types (master spec §9 of the master spec; Phase 1 instruction §7).
// Cookies is genuinely global, unlike Ramen's deliberate Japan-focus -- so the browsable unit is
// `country`/`worldRegion`, and `originComplexity` lets a record honestly represent a
// single-origin, regional, multi-region, or disputed history instead of forcing false precision.

export type OriginComplexity = 'single-origin' | 'regional' | 'multi-region' | 'disputed'

export interface RegionalCookieEntry {
  id: string
  cookieId: string
  worldRegion: string
  country: string
  originComplexity: OriginComplexity
  shortDescription: string
  historyNote: string
}

export interface WorldRegionTradition {
  id: string
  worldRegion: string
  introduction: string
  definingTendencies: string[]
  countries: string[]
  cookieIds: string[]
}
