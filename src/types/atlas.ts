export type AtlasRegion = 'Latin America' | 'Europe' | 'Asia & Middle East' | 'North America' | 'Africa' | 'Oceania'

export interface RegionalCakeEntry {
  id: string
  region: AtlasRegion
  country: string
  cityMicroRegion?: string
  cakeId: string
  shortDescription: string
  passportStampId: string
}

export interface PassportStamp {
  stampId: string
  collectedAt: string
}

export interface PassportProgress {
  stamps: PassportStamp[]
}
