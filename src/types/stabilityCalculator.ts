export type FillingWeight = 'light' | 'medium' | 'heavy'
export type StabilityTemperature = 'cool' | 'moderate' | 'warm'
export type TransportCondition = 'none' | 'short' | 'long'

export interface StabilityInput {
  tierCount: number
  diameterIn: number
  fillingWeight: FillingWeight
  temperature: StabilityTemperature
  transport: TransportCondition
}

export interface StabilityResult {
  supportNotes: string[]
  chillNotes: string[]
  displayNotes: string[]
  estimatedServings: number
}
