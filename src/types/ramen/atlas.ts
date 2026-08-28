// Same shape as Cake's src/types/atlas.ts (CAKE_REFERENCE_AUDIT.md §5): a flat
// list of regional entries joined to the canonical record by id, plus a
// 6-bucket AtlasRegion used for future browse-by-region grouping. Only the
// "Asia" bucket is populated in Phase 2 (master spec §9 -- Japan-first).

export type AtlasRegion = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Middle East' | 'Oceania'

export interface RegionalRamenEntry {
  id: string
  region: AtlasRegion
  country: string
  cityMicroRegion: string
  ramenId: string
  shortDescription: string
  historyNote: string
  /** Coordinates for the Atlas map marker. */
  coordinates: [number, number]
  isPrimary: boolean
}
