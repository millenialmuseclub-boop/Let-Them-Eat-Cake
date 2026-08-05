import type { DietTag } from './cake'
import type { AtlasRegion } from './atlas'

export type ArchitectureType =
  | 'classic-tiered-sponge'
  | 'semi-naked-bare'
  | 'fondant-sculpted'
  | 'croquembouche-choux-tower'
  | 'ring-tower-kransekake'
  | 'separated-pillar-display'

export type WeddingSeason = 'spring' | 'summer' | 'fall' | 'winter'
export type SeasonVariant = 'indoor' | 'outdoor'
export type FrostingType = 'swiss-meringue-buttercream' | 'fondant' | 'whipped-cream'
export type TierRole = 'top' | 'middle' | 'base'
export type Allergen = 'dairy' | 'eggs' | 'wheat-gluten' | 'tree-nuts' | 'peanuts' | 'soy'
export type CakeShape = 'round' | 'square' | 'hexagon'
export type DecorationCategory = 'floral' | 'piped' | 'lace' | 'geometric' | 'painted' | 'metallic' | 'natural'

export interface WeddingDecorationStyle {
  id: string
  name: string
  description: string
  techniqueNotes: string
  category: DecorationCategory
  /** aesthetic ids this style scores a bonus against in rankDecorationStyles() */
  bestForAestheticIds?: string[]
  /** drives WeddingCakeDiagram's decoration overlay color */
  swatchHex: string
}

export interface WeddingCulture {
  id: string
  name: string
  region: AtlasRegion
  traditions: string
  symbolism: string
  ritual: string
  /** 2-4 keywords scored against CakeProfile.flavorNotes */
  flavorNotes: string[]
  /** flat scoring bonus toward one pool cake */
  signatureCakeId?: string
  /** rare — only cultures with a strongly tradition-specific structure set this */
  architectureNudge?: ArchitectureType
  decorHint: string
}

export interface WeddingAesthetic {
  id: string
  name: string
  description: string
  paletteGuidance: string
  textureGuidance: string
  /** always set — primary structure driver unless overridden by culture.architectureNudge */
  architectureNudge: ArchitectureType
  /** drives WeddingCakeDiagram's base tier color */
  swatchHex: string
}

export interface SeasonFrostingGuidance {
  frosting: FrostingType
  indoor: string
  outdoor: string
}

export interface WeddingSeasonEntry {
  id: WeddingSeason
  name: string
  flavorAffinityNotes: string[]
  /** exactly 3, one per FrostingType */
  frostingGuidance: SeasonFrostingGuidance[]
}

export interface TierSpec {
  role: TierRole
  diameterIn: number
  partySlices: number
  venueSlices: number
}

export interface TierArchitecturePlan {
  architecture: ArchitectureType
  architectureReason: string
  tiers: TierSpec[]
  stabilityNotes: string[]
  cappedGuestCountWarning?: string
}

export interface TierFlavorPick {
  role: TierRole
  cakeId: string
  recipeId: string
  reason: string[]
  scoreBreakdown: Record<string, number>
  dietCaveat?: string
}

export interface AllergenAuditEntry {
  allergen: Allergen
  present: boolean
  sourceIngredientNames: string[]
  status: 'not-present' | 'resolved' | 'unresolved'
  guidance: string
}

export interface WeddingPlanInput {
  cultureId: string
  guestCount: number
  season: WeddingSeason
  variant: SeasonVariant
  aestheticId: string
  diet: DietTag | 'none'
  shape: CakeShape
  decorationStyleId: string
}

export interface WeddingPlanResult {
  input: WeddingPlanInput
  culture: WeddingCulture
  aesthetic: WeddingAesthetic
  seasonEntry: WeddingSeasonEntry
  chosenFrosting: FrostingType
  frostingGuidance: string
  architecturePlan: TierArchitecturePlan
  /** 2 entries for a 2-tier cake, 3 otherwise */
  tierPicks: TierFlavorPick[]
  /** always all 6 allergens, present or not */
  allergenAudit: AllergenAuditEntry[]
  allergenFooterNote: string
  /** one line per physical tier */
  cuttingGuide: string[]
  decorationStyle: WeddingDecorationStyle
}
