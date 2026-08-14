import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DietTag } from '../types/cake'
import { getCake, getRecipeForCake } from '../lib/data'
import { getTopPairings } from '../lib/encyclopedia'
import { getProductsByIds } from '../lib/affiliateProducts'
import { registerBackHandler } from '../lib/backButtonInterceptor'
import type { GuestRange } from '../lib/guestRanges'
import { formatComponentLabel } from '../lib/recipeComponents'
import { CakeThumbnail } from './CakeThumbnail'
import { SaveButton } from './SaveButton'
import { BirthdayShareCard } from './BirthdayShareCard'
import { AffiliateProductSet } from './AffiliateProductSet'
import { GuestRangeSelector } from './GuestRangeSelector'
import { useFocusOnMount } from '../lib/useFocusOnMount'
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
  guestRange,
  onGuestRangeChange,
  diet,
  theme,
  onRefine,
}: {
  cakeId: string
  who: string
  energyName: string
  flavorName: string
  guestRange: GuestRange
  onGuestRangeChange: (guestRange: GuestRange) => void
  diet: DietTag | 'none'
  theme: string
  onRefine: () => void
}) {
  const [showShare, setShowShare] = useState(false)

  const showShareRef = useRef(showShare)
  showShareRef.current = showShare
  useEffect(
    () =>
      registerBackHandler(() => {
        if (!showShareRef.current) return false
        setShowShare(false)
        return true
      }),
    [],
  )

  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  const cake = getCake(cakeId)
  if (!cake) return null

  const recipe = getRecipeForCake(cake.id)
  const topPairing = getTopPairings(cake, 1)[0]
  const whoArticle = /^[aeiou]/i.test(who) ? 'an' : 'a'
  const whoLabel = who === 'Me' ? 'your birthday' : `${who === 'Milestone Birthday' ? 'a milestone birthday' : `${whoArticle} ${who.toLowerCase()}'s birthday`}`
  const article = /^[aeiou]/i.test(energyName) ? 'An' : 'A'
  const whyItFits = `${article} ${energyName.toLowerCase()} ${flavorName.toLowerCase()} cake, matched for ${whoLabel}${theme ? ` with a ${theme} theme` : ''}.`
  const cakeInspirationProducts = getProductsByIds([
    ...(BIRTHDAY_CAKE_PRODUCT_IDS_BY_FLAVOR[flavorName] ?? []),
    ...(BIRTHDAY_CAKE_PRODUCT_IDS_BY_ENERGY[energyName] ?? []),
  ])

  return (
    <div className="birthday-result-summary ltec-reveal">
      <section className="card wedding-hero">
        <CakeThumbnail cakeId={cake.id} variant="hero" alt={cake.name} />
        <p className="tag">Birthday</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {cake.name}
        </h1>
        <p className="wedding-hero-description">
          Perfect for {whoLabel}.
        </p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🍰 Flavor</h2>
        <p>{cake.flavorNotes.join(' · ')}</p>
        {formatComponentLabel(recipe?.filling) && (
          <p className="wedding-hero-description">
            <strong>Filling:</strong> {formatComponentLabel(recipe?.filling)}
          </p>
        )}
        {formatComponentLabel(recipe?.frostingFinish) && (
          <p className="wedding-hero-description">
            <strong>Finish:</strong> {formatComponentLabel(recipe?.frostingFinish)}
          </p>
        )}
      </section>

      <section className="card wedding-primary-card">
        <h2>🎉 Serves</h2>
        <p className="wedding-concept-title">Serves {guestRange.label}</p>
        {recipe && (
          <p className="wedding-hero-description">
            {guestRange.max > recipe.baseServings
              ? `Bake ${Math.ceil(guestRange.max / recipe.baseServings)}× this recipe (~${
                  Math.ceil(guestRange.max / recipe.baseServings) * recipe.baseServings
                } servings) to comfortably cover this range.`
              : `This recipe serves ${recipe.baseServings} on its own — comfortably covers this range.`}
          </p>
        )}
        <div className="wedding-guest-count-editor">
          <span>Guest count (max 50)</span>
          <GuestRangeSelector value={guestRange} onChange={onGuestRangeChange} />
        </div>
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
