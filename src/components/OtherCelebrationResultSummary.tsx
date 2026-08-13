import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DietTag } from '../types/cake'
import { getCake, getRecipeForCake } from '../lib/data'
import { getTopPairings } from '../lib/encyclopedia'
import { getProductsByIds } from '../lib/affiliateProducts'
import { registerBackHandler } from '../lib/backButtonInterceptor'
import { CakeHeroImage } from './CakeHeroImage'
import { SaveButton } from './SaveButton'
import { OtherCelebrationShareCard } from './OtherCelebrationShareCard'
import { AffiliateProductSet } from './AffiliateProductSet'
import './OtherCelebrationResultSummary.css'

/** Only mood/flavor combos with a genuine, defensible cake-inspiration connection get a mapping. */
const OTHER_CAKE_PRODUCT_IDS_BY_MOOD: Record<string, string[]> = {
  Romantic: ['product_cake_bridgerton_lemon_lavender'],
  Traditional: ['product_cake_red_velvet', 'product_cake_hummingbird', 'product_cake_seven_layer_caramel'],
}
const OTHER_CAKE_PRODUCT_IDS_BY_FLAVOR: Record<string, string[]> = {
  Chocolate: ['product_cake_brooklyn_blackout', 'product_cake_earls_court_chocolate', 'product_cake_molten_lava'],
}

export function OtherCelebrationResultSummary({
  cakeId,
  occasionName,
  moodName,
  flavorNames,
  guestCount,
  onGuestCountChange,
  diet,
  onRefine,
}: {
  cakeId: string
  occasionName: string
  moodName: string
  flavorNames: string[]
  guestCount: number
  onGuestCountChange: (guestCount: number) => void
  diet: DietTag | 'none'
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

  const cake = getCake(cakeId)
  if (!cake) return null

  const recipe = getRecipeForCake(cake.id)
  const topPairing = getTopPairings(cake, 1)[0]
  const article = /^[aeiou]/i.test(moodName) ? 'an' : 'a'
  const whyItFits = `A ${flavorNames.join(' & ').toLowerCase()} cake with ${article} ${moodName.toLowerCase()} finish, matched for your ${occasionName.toLowerCase()}.`
  const cakeInspirationProducts = getProductsByIds([
    ...(OTHER_CAKE_PRODUCT_IDS_BY_MOOD[moodName] ?? []),
    ...flavorNames.flatMap((f) => OTHER_CAKE_PRODUCT_IDS_BY_FLAVOR[f] ?? []),
  ])

  return (
    <div className="other-celebration-result-summary">
      <section className="card wedding-hero">
        <CakeHeroImage cakeId={cake.id} variant="hero" alt={cake.name} />
        <p className="tag">{occasionName}</p>
        <h1>{cake.name}</h1>
        <p className="wedding-hero-description">Matched for your {occasionName.toLowerCase()}.</p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🍰 Flavor</h2>
        <p>{cake.flavorNotes.join(' · ')}</p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🎉 Serves</h2>
        <p className="wedding-concept-title">{recipe ? recipe.baseServings : guestCount}</p>
        {recipe && guestCount > recipe.baseServings && (
          <p className="wedding-hero-description">
            Bake {Math.ceil(guestCount / recipe.baseServings)}× this recipe to comfortably serve {guestCount} guests.
          </p>
        )}
        <label className="wedding-form wedding-guest-count-editor">
          Guest count
          <input
            type="number"
            min={1}
            max={400}
            value={guestCount}
            onChange={(e) => onGuestCountChange(Math.min(400, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>
      </section>

      <section className="card wedding-primary-card">
        <h2>✨ Why It Fits</h2>
        <p>{whyItFits}</p>
        {diet !== 'none' && <p className="other-celebration-diet-note">Let your baker know: {diet}.</p>}
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

      {showShare && <OtherCelebrationShareCard cake={cake} occasionName={occasionName} moodName={moodName} whyItFits={whyItFits} />}
    </div>
  )
}
