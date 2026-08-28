// Central typed data barrel. All page/component code should import from here rather than reading
// the raw JSON files directly, matching Ramen's src/lib/data.ts pattern.

import cookiesJson from '../../data/cookies/cookies.json'
import regionsJson from '../../data/cookies/regions.json'
import traditionsJson from '../../data/cookies/traditions.json'
import collectionsJson from '../../data/cookies/collections.json'
import cookieAnatomyJson from '../../data/cookies/cookieAnatomy.json'
import doughComponentsJson from '../../data/cookies/doughComponents.json'
import labsJson from '../../data/cookies/labs.json'
import troubleshooterJson from '../../data/cookies/troubleshooter.json'
import personalityQuizJson from '../../data/cookies/personalityQuiz.json'
import cookiePersonalitiesJson from '../../data/cookies/cookiePersonalities.json'
import productsJson from '../../data/cookies/products.json'
import recipesJson from '../../data/cookies/recipes.json'

import type { CookieProfile } from '../../types/cookies/cookie'
import type { RegionalCookieEntry, WorldRegionTradition } from '../../types/cookies/atlas'
import type { Collection } from '../../types/cookies/collections'
import type { CookieAnatomyStage, DoughComponent } from '../../types/cookies/workshop'
import type { Lab } from '../../types/cookies/lab'
import type { TroubleshooterProblem } from '../../types/cookies/troubleshooter'
import type { QuizQuestion, CookiePersonality } from '../../types/cookies/personalityQuiz'
import type { AffiliateProduct } from '../../types/product'
import type { Recipe } from '../../types/cookies/recipe'

export const COOKIES = cookiesJson as CookieProfile[]
export const REGIONS = regionsJson as RegionalCookieEntry[]
export const TRADITIONS = traditionsJson as WorldRegionTradition[]
export const COLLECTIONS = collectionsJson as Collection[]
export const COOKIE_ANATOMY = cookieAnatomyJson as CookieAnatomyStage[]
export const DOUGH_COMPONENTS = doughComponentsJson as DoughComponent[]
export const LABS = labsJson as Lab[]
export const TROUBLESHOOTER = troubleshooterJson as TroubleshooterProblem[]
export const PERSONALITY_QUIZ = personalityQuizJson as QuizQuestion[]
export const COOKIE_PERSONALITIES = cookiePersonalitiesJson as CookiePersonality[]
export const PRODUCTS = productsJson as AffiliateProduct[]
export const RECIPES = recipesJson as Recipe[]

function toMap<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

export const COOKIES_BY_ID = toMap(COOKIES)
export const COLLECTIONS_BY_ID = toMap(COLLECTIONS)
export const LABS_BY_SLUG = new Map(LABS.map((lab) => [lab.slug, lab]))
export const PERSONALITIES_BY_COOKIE_ID = new Map(COOKIE_PERSONALITIES.map((p) => [p.cookieId, p]))
export const RECIPE_BY_COOKIE_ID = new Map(RECIPES.map((r) => [r.cookieId, r]))

export function getRecipeForCookie(cookieId: string): Recipe | undefined {
  return RECIPE_BY_COOKIE_ID.get(cookieId)
}

export function getCookie(id: string): CookieProfile | undefined {
  return COOKIES_BY_ID.get(id)
}

export function getCookiesByIds(ids: string[]): CookieProfile[] {
  return ids.map((id) => COOKIES_BY_ID.get(id)).filter((c): c is CookieProfile => Boolean(c))
}

export function productsForContext(context: string): AffiliateProduct[] {
  return PRODUCTS.filter((p) => p.apps.includes('cookies') && p.contexts?.includes(context))
}

export function allCookiesProducts(): AffiliateProduct[] {
  return PRODUCTS.filter((p) => p.apps.includes('cookies'))
}
