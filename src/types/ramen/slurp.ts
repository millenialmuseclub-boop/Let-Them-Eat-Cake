// Slurp domain types (master spec §23). GuideSection/Guide back one reusable article template
// for Ramen Shop 101 / Ordering / How to Eat Ramen, rather than three bespoke page components.

export interface GuideSection {
  heading: string
  paragraphs: string[]
  /** Short callout list under the section -- etiquette points, ordering steps, common terms. Optional; not every section needs one. */
  tips?: string[]
}

export interface Guide {
  slug: string
  title: string
  description: string
  sections: GuideSection[]
}

export interface VocabularyTerm {
  id: string
  term: string
  japaneseName?: string
  romanization?: string
  definition: string
  relatedConcept: string
}

export interface Trail {
  id: string
  title: string
  region: string
  regionalContext: string
  whatDefines: string
  whatToNotice: string
  howToApproach: string
  relatedRamenId: string
}
