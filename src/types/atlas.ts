export type AtlasRegion = 'Latin America' | 'Europe' | 'Asia & Middle East' | 'North America' | 'Africa' | 'Oceania'

export interface RegionalCakeEntry {
  id: string
  region: AtlasRegion
  country: string
  cityMicroRegion?: string
  cakeId: string
  recipeId: string
  shortDescription: string
  historyNote: string
  /** The one cake shown first when searching this country; other entries for the same country show as secondary favorites. */
  isPrimary: boolean
}
