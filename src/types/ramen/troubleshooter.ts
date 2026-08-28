// Workshop Troubleshooter (master pass §6). Structured, deterministic, data-driven -- a flat
// problem -> cause/correction list, not a decision tree or AI chatbot. `flavorTags`/
// `relatedComponentCategory` on each cause exist so this data can inform Sommelier CREATE's
// compatibility model later without a redesign, matching the same convention already used by
// types/lab.ts and bowlComponents.json.

import type { FlavorTag } from './ramen'
import type { BowlComponentCategory } from './workshop'

export interface TroubleshooterCause {
  cause: string
  correction: string
  flavorTags?: FlavorTag[]
  relatedComponentCategory?: BowlComponentCategory
}

export interface TroubleshooterProblem {
  id: string
  problem: string
  diagnosticQuestions: string[]
  causes: TroubleshooterCause[]
  relatedLessonPath: string
  relatedLessonLabel: string
}
