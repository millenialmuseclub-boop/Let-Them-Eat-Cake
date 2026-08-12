import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DietTag } from '../types/cake'
import { getCake, getRecipeForCake } from '../lib/data'
import { getTopPairings } from '../lib/encyclopedia'
import { getProductsByIds } from '../lib/affiliateProducts'
import { CakeHeroImage } from './CakeHeroImage'
import { SaveButton } from './SaveButton'
import { BirthdayShareCard } from './BirthdayShareCard'
import { AffiliateProductSet } from './AffiliateProductSet'
import './BirthdayResultSummary.css'

/** Only flavor/energy combos with a genuine, defensible cake-inspiration connection get a mapping. */
const BIRTHDAY_CAKE_PRODUCT_IDS_BY_FLAVOR: Record<string, string[]> = {
  Funfetti: ['product_cake_confetti'],
  Chocolate: ['product_cake_brooklyn_blackout', 'product_cake_earls_court_chocolate', 'product_cake_molten_lava'],
}
const BIRTHDAY_CAKE_PRODUCT_IDS_BY_ENERGY: Record<string, string[]> = {
  Romantic: ['product_cake_bridgerton_lemon_lavender'],
}

export function BirthdayResultSummary({
  cakeId,
  who,
  energyName,
  flavorName,
  guestCount,
  diet,
  theme,
  onRefine,
}: {
  cakeId: string
  who: string
  energyName: string
  flavorName: string
  guestCount: number
  diet: DietTag | 'none'
  theme: string
  onRefine: () => void
}) {
  const [showShare, setShowShare] = useState(false)
  const cake = getCake(cakeId)
  if (!cake) return null

  const recipe = getRecipeForCake(cake.id)
  const topPairing = getTopPairings(cake, 1)[0]
  const whoLabel = who === 'Me' ? 'your birthday' : `${who === 'Milestone Birthday' ? 'a milestone birthday' : `a ${who.toLowerCase()}'s birthday`}`
  const article = /^[aeiou]/i.test(energyName) ? 'An' : 'A'
  const whyItFits = `${article} ${energyName.toLowerCase()} ${flavorName.toLowerCase()} cake, matched for ${whoLabel}${theme ? ` with a ${theme} theme` : ''}.`
  const cakeInspirationProducts = getProductsByIds([
    ...(BIRTHDAY_CAKE_PRODUCT_IDS_BY_FLAVOR[flavorName] ?? []),
    ...(BIRTHDAY_CAKE_PRODUCT_IDS_BY_ENERGY[energyName] ?? []),
  ])

  return (
    <div className="birthday-result-summary">
      <section className="card wedding-hero">
        <CakeHeroImage cakeId={cake.id} variant="hero" alt={cake.name} />
        <p className="tag">Birthday</p>
        <h1>{cake.name}</h1>
        <p className="wedding-hero-description">
          Perfect for {whoLabel}.
        </p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🍰 Flavor</h2>
        <p>{cake.flavorNotes.join(' · ')}</p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🎉 Serves</h2>
        <p className="wedding-concept-title">{recipe ? recipe.baseServings : guestCount}</p>
      </section>

      <section className="card wedding-primary-card">
        <h2>✨ Why It Fits</h2>
        <p>{whyItFits}</p>
        {diet !== 'none' && <p className="birthday-diet-note">Let your baker know: {diet}.</p>}
      </section>

      {topPairing && (
        <section className="card wedding-primary-card">
          <h2>🥂 Perfect Pairing</h2>
          <p>{topPairing.drink.name}</p>
          <Link to="/sommelier" className="encyclopedia-link">
            Explore in the Sommelier →
          </Link>
        </section>
      )}

      <AffiliateProductSet title="Cake Inspiration" products={cakeInspirationProducts} />

      <Link to="/time-machine" className="card birthday-time-machine-link">
        🎂 Curious what cake defined your birth year? Try the Birthday Time Machine →
      </Link>

      <div className="wedding-action-row">
        <Link to={`/cake/${cake.id}`} className="btn btn-secondary">
          View Recipe
        </Link>
        <button className="btn btn-secondary" onClick={onRefine}>
          Refine
        </button>
        <SaveButton type="cake" id={cake.id} />
        <button className="btn btn-secondary" onClick={() => setShowShare((s) => !s)}>
          Share
        </button>
      </div>

      {showShare && <BirthdayShareCard cake={cake} energyName={energyName} flavorName={flavorName} whyItFits={whyItFits} />}
    </div>
  )
}
