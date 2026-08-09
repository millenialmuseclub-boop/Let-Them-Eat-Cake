import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DietTag } from '../types/cake'
import { getCake, getRecipeForCake } from '../lib/data'
import { getTopPairings } from '../lib/encyclopedia'
import { CakeHeroImage } from './CakeHeroImage'
import { SaveButton } from './SaveButton'
import { OtherCelebrationShareCard } from './OtherCelebrationShareCard'
import './OtherCelebrationResultSummary.css'

export function OtherCelebrationResultSummary({
  cakeId,
  occasionName,
  moodName,
  flavorNames,
  guestCount,
  diet,
  onRefine,
}: {
  cakeId: string
  occasionName: string
  moodName: string
  flavorNames: string[]
  guestCount: number
  diet: DietTag | 'none'
  onRefine: () => void
}) {
  const [showShare, setShowShare] = useState(false)
  const cake = getCake(cakeId)
  if (!cake) return null

  const recipe = getRecipeForCake(cake.id)
  const topPairing = getTopPairings(cake, 1)[0]
  const article = /^[aeiou]/i.test(moodName) ? 'an' : 'a'
  const whyItFits = `A ${flavorNames.join(' & ').toLowerCase()} cake with ${article} ${moodName.toLowerCase()} finish, matched for your ${occasionName.toLowerCase()}.`

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
