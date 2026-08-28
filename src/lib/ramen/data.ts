// Same "typed JSON barrel + toMap() id-index" pattern as Cake's src/lib/data.ts
// (CAKE_REFERENCE_AUDIT.md §1/§17) -- a new file, not a shared import, per the
// master spec's "parallel Ramen domain model" instruction (§29).

import ramenJson from '../../data/ramen/ramen.json'
import regionsJson from '../../data/ramen/regions.json'
import ramenImagesJson from '../../data/ramen/ramenImages.json'
import ramenAnatomyJson from '../../data/ramen/ramenAnatomy.json'
import bowlComponentsJson from '../../data/ramen/bowlComponents.json'
import pairingsJson from '../../data/ramen/pairings.json'
import guidesJson from '../../data/ramen/guides.json'
import vocabularyJson from '../../data/ramen/vocabulary.json'
import trailsJson from '../../data/ramen/trails.json'
import personalityQuizJson from '../../data/ramen/personalityQuiz.json'
import ramenPersonalitiesJson from '../../data/ramen/ramenPersonalities.json'
import collectionsJson from '../../data/ramen/collections.json'
import productsJson from '../../data/ramen/products.json'
import ramen101QuizJson from '../../data/ramen/ramen101Quiz.json'
import labsJson from '../../data/ramen/labs.json'
import sceneImagesJson from '../../data/ramen/sceneImages.json'
import troubleshooterJson from '../../data/ramen/troubleshooter.json'
import traditionsJson from '../../data/ramen/traditions.json'
import shopsJson from '../../data/ramen/shops.json'
import type { RamenProfile } from '../../types/ramen/ramen'
import type { RegionalRamenEntry } from '../../types/ramen/atlas'
import type { RamenImage } from '../../types/ramen/ramenImage'
import type { RamenAnatomyStage, BowlComponent } from '../../types/ramen/workshop'
import type { PairingItem } from '../../types/ramen/sommelier'
import type { Guide, VocabularyTerm, Trail } from '../../types/ramen/slurp'
import type { QuizQuestion, RamenPersonality } from '../../types/ramen/personalityQuiz'
import type { Collection } from '../../types/ramen/collections'
import type { AffiliateProduct } from '../../types/product'
import type { KnowledgeQuizQuestion } from '../../types/ramen/knowledgeQuiz'
import type { Lab } from '../../types/ramen/lab'
import type { SceneImage } from '../../types/ramen/sceneImage'
import type { TroubleshooterProblem } from '../../types/ramen/troubleshooter'
import type { RegionalTradition } from '../../types/ramen/tradition'
import type { RamenShop } from '../../types/ramen/shop'

export const ramen = ramenJson as RamenProfile[]
export const regions = regionsJson as RegionalRamenEntry[]
export const ramenImages = ramenImagesJson as Record<string, RamenImage>
export const ramenAnatomyStages = ramenAnatomyJson as RamenAnatomyStage[]
export const bowlComponents = bowlComponentsJson as BowlComponent[]
export const pairingItems = pairingsJson as PairingItem[]
export const guides = guidesJson as Guide[]
export const vocabulary = vocabularyJson as VocabularyTerm[]
export const trails = trailsJson as Trail[]
export const personalityQuizQuestions = personalityQuizJson as QuizQuestion[]
export const ramenPersonalities = ramenPersonalitiesJson as RamenPersonality[]
export const collections = collectionsJson as Collection[]
export const products = productsJson as AffiliateProduct[]
export const ramen101Quiz = ramen101QuizJson as KnowledgeQuizQuestion[]
export const labs = labsJson as Lab[]
export const sceneImages = sceneImagesJson as Record<string, SceneImage>
export const troubleshooterProblems = troubleshooterJson as TroubleshooterProblem[]
export const traditions = traditionsJson as RegionalTradition[]
export const shops = shopsJson as RamenShop[]

function toMap<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

export const ramenById = toMap(ramen)

export function getRamen(id: string): RamenProfile | undefined {
  return ramenById.get(id)
}
