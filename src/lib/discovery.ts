import { cakes, regions, bakingTraditions, techniques } from './data'
import { getCakeImage } from './images'
import { getAllIngredients } from './ingredients'
import { getTraditionCakes } from './bakingTraditions'
import type { CakeProfile } from '../types/cake'

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/** Deterministic — the same cake all day, no backend/randomness. */
export function getCakeOfTheDay(): CakeProfile {
  return cakes[dayOfYear() % cakes.length]
}

const CAKES_WITH_PHOTOS = cakes.filter((c) => getCakeImage(c.id))

/** Same day-of-year determinism as getCakeOfTheDay, but only rotates through cakes with a real fetched photo — guarantees a photo hero never has a gap. */
export function getHeroCake(): CakeProfile {
  if (CAKES_WITH_PHOTOS.length === 0) return getCakeOfTheDay()
  return CAKES_WITH_PHOTOS[dayOfYear() % CAKES_WITH_PHOTOS.length]
}

function cakeWithPhoto(candidates: CakeProfile[]): CakeProfile | undefined {
  return candidates.find((c) => getCakeImage(c.id))
}

export type DiscoveryEntry =
  | { type: 'new-cake'; label: string; title: string; teaser: string; cake: CakeProfile; linkTo: string }
  | { type: 'country'; label: string; title: string; teaser: string; cake: CakeProfile; linkTo: string }
  | { type: 'ingredient'; label: string; title: string; teaser: string; cake?: CakeProfile; linkTo: string }
  | { type: 'technique'; label: string; title: string; teaser: string; cake?: CakeProfile; linkTo: string }
  | { type: 'tradition'; label: string; title: string; teaser: string; cake?: CakeProfile; linkTo: string }

/** One rotating discovery a day, spanning cake history/country/ingredient/technique/cultural tradition — same determinism as getHeroCake(). */
export function getDiscoveryOfTheDay(): DiscoveryEntry | undefined {
  const pool: DiscoveryEntry[] = []

  const newestWithPhoto = cakeWithPhoto([...cakes].reverse())
  if (newestWithPhoto) {
    pool.push({ type: 'new-cake', label: '🆕 New This Week', title: newestWithPhoto.name, teaser: newestWithPhoto.description, cake: newestWithPhoto, linkTo: `/cake/${newestWithPhoto.id}` })
  }

  const countryPrimaries = regions
    .filter((r) => r.isPrimary)
    .map((r) => ({ country: r.country, cake: cakes.find((c) => c.id === r.cakeId) }))
    .filter((entry): entry is { country: string; cake: CakeProfile } => !!entry.cake && !!getCakeImage(entry.cake.id))
  if (countryPrimaries.length > 0) {
    const pick = countryPrimaries[dayOfYear() % countryPrimaries.length]
    pool.push({ type: 'country', label: '🌍 Around the World', title: pick.country, teaser: `${pick.cake.name} — ${pick.cake.description}`, cake: pick.cake, linkTo: `/atlas?country=${encodeURIComponent(pick.country)}` })
  }

  const spotlightIngredient = getAllIngredients().find(
    (ing) => ing.cakeIds.length >= 3 && cakeWithPhoto(ing.cakeIds.map((id) => cakes.find((c) => c.id === id)).filter((c): c is CakeProfile => !!c)),
  )
  if (spotlightIngredient) {
    const cake = cakeWithPhoto(spotlightIngredient.cakeIds.map((id) => cakes.find((c) => c.id === id)).filter((c): c is CakeProfile => !!c))
    pool.push({
      type: 'ingredient',
      label: '🧂 Ingredient Spotlight',
      title: spotlightIngredient.displayName,
      teaser: `Used in ${spotlightIngredient.cakeIds.length} cakes across the Encyclopedia.`,
      cake,
      linkTo: `/ingredient/${spotlightIngredient.slug}`,
    })
  }

  if (techniques.length > 0) {
    const technique = techniques[dayOfYear() % techniques.length]
    pool.push({ type: 'technique', label: '👩‍🍳 From the Workshop', title: technique.name, teaser: technique.whatItIs, linkTo: '/technique-library' })
  }

  if (bakingTraditions.length > 0) {
    const tradition = bakingTraditions[dayOfYear() % bakingTraditions.length]
    const cake = cakeWithPhoto(getTraditionCakes(tradition))
    pool.push({ type: 'tradition', label: '📜 Cultural Tradition', title: tradition.title, teaser: tradition.specialty, cake, linkTo: `/traditions/${tradition.id}` })
  }

  if (pool.length === 0) return undefined
  return pool[dayOfYear() % pool.length]
}

/** Deterministic daily technique spotlight for the Home "From the Workshop" section. */
export function getTechniqueOfTheDay() {
  if (techniques.length === 0) return undefined
  return techniques[dayOfYear() % techniques.length]
}
