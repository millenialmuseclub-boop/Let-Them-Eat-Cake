// One reusable Workshop Lab architecture (Dough/Flour/Sugar/Butter-Fat/Chocolate/Texture), ported
// directly from Ramen's types/lab.ts. Deliberately not a calculator: LabVariableOption carries a
// short qualitative "bars" visualization (0-5 scale, a couple of named axes) driven by picking a
// described option, never a numeric input/output.

import type { CookieFlavorTag } from './cookie'
import type { DoughComponentCategory } from './workshop'

export interface LabConcept {
  id: string
  term: string
  definition: string
  relatedCookieIds?: string[]
}

export interface LabVariableOption {
  id: string
  label: string
  effect: string
  bars: { label: string; value: number }[]
  flavorTags?: CookieFlavorTag[]
  relatedCookieIds?: string[]
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
  /** Links back to the matching Cookie Anatomy component. */
  anatomyComponentId: string
  /** Links to the matching Build a Cookie component category, where one exists. */
  doughComponentCategory?: DoughComponentCategory
  concepts: LabConcept[]
  variables: LabVariable[]
}
