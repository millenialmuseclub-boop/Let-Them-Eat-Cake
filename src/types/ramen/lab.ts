// One reusable Workshop Lab architecture (Broth/Noodle/Tare/Aroma Oil) rather than four
// unrelated page systems. Deliberately not a calculator: LabVariableOption carries a short
// qualitative "bars" visualization (0-5 scale, a couple of named axes) driven by picking a
// described option, never a numeric input/output. flavorTags/relatedRamenIds/relatedComponentId
// on options exist specifically so this data can seed Sommelier CREATE's compatibility model
// later (master spec §22) without a redesign -- the same FlavorTag vocabulary already used by
// ramen records and bowlComponents.json.

import type { FlavorTag } from './ramen'
import type { BowlComponentCategory } from './workshop'

export interface LabConcept {
  id: string
  term: string
  definition: string
  relatedRamenIds?: string[]
}

export interface LabVariableOption {
  id: string
  label: string
  effect: string
  bars: { label: string; value: number }[]
  flavorTags?: FlavorTag[]
  relatedRamenIds?: string[]
}

export interface LabVariable {
  id: string
  label: string
  options: LabVariableOption[]
}

export interface Lab {
  slug: string
  title: string
  description: string
  /** Links back to the matching Ramen Anatomy component (master spec §11 cross-link). */
  anatomyComponentId: string
  /** Links to the matching Build a Bowl component category, where one exists. */
  bowlComponentCategory?: BowlComponentCategory
  concepts: LabConcept[]
  variables: LabVariable[]
}
