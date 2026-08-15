import { Link } from 'react-router-dom'
import type { DietTag } from '../types/cake'
import { getCake, getRecipeForCake } from '../lib/data'
import { getTopPairings } from '../lib/encyclopedia'
import { getProductsByIds } from '../lib/affiliateProducts'
import type { GuestRange } from '../lib/guestRanges'
import { formatComponentLabel } from '../lib/recipeComponents'
import { CakeThumbnail } from './CakeThumbnail'
import { SaveButton } from './SaveButton'
import { AffiliateProductSet } from './AffiliateProductSet'
import { GuestRangeSelector } from './GuestRangeSelector'
import { useFocusOnMount } from '../lib/useFocusOnMount'
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
  guestRange,
  onGuestRangeChange,
  diet,
  onRefine,
}: {
  cakeId: string
  occasionName: string
  moodName: string
  flavorNames: string[]
  guestRange: GuestRange
  onGuestRangeChange: (guestRange: GuestRange) => void
  diet: DietTag | 'none'
  onRefine: () => void
}) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

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
    <div className="other-celebration-result-summary ltec-reveal">
      <section className="card wedding-hero">
        <CakeThumbnail cakeId={cake.id} variant="hero" alt={cake.name} />
        <p className="tag">{occasionName}</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {cake.name}
        </h1>
        <p className="wedding-hero-description">Matched for your {occasionName.toLowerCase()}.</p>
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
      </div>
    </div>
  )
}
