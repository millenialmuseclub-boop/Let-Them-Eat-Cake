import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getCakeForBirthYear } from '../lib/timeMachine'
import { getYearVariant } from '../lib/yearVintage'
import { getCake, getRecipe, decades } from '../lib/data'
import { getRelatedCakes, getTopPairings } from '../lib/encyclopedia'
import { RecipeCard } from '../components/RecipeCard'
import { ShareCard } from '../components/ShareCard'
import { TimeMachineTimeline } from '../components/TimeMachineTimeline'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { SaveButton } from '../components/SaveButton'
import './TimeMachinePage.css'

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}

export function TimeMachinePage() {
  const [dobInput, setDobInput] = useState('')
  const [birthYear, setBirthYear] = useState<number | null>(null)
  const [activeDecadeId, setActiveDecadeId] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!dobInput) return
    const year = new Date(dobInput).getFullYear()
    setBirthYear(year)
    setActiveDecadeId(getCakeForBirthYear(year).id)
  }

  function handleTimelineSelect(decadeId: string) {
    setBirthYear(null)
    setActiveDecadeId(decadeId)
  }

  const entry = activeDecadeId ? (decades.find((d) => d.id === activeDecadeId) ?? null) : null
  const cake = entry ? getCake(entry.cakeId) : null
  const recipe = entry ? getRecipe(entry.recipeId) : null
  const variant = cake && birthYear !== null ? getYearVariant(birthYear, cake.name) : null
  const relatedCakes = cake ? getRelatedCakes(cake) : []
  const pairings = cake ? getTopPairings(cake) : []

  return (
    <main className="page time-machine-page">
      <h1>Birthday Time Machine</h1>
      <p>Enter your date of birth — or browse the decade timeline below — to uncover the cake that defined an era.</p>

      <TimeMachineTimeline decades={decades} activeDecadeId={activeDecadeId} onSelectDecade={handleTimelineSelect} />

      <form className="dob-form" onSubmit={handleSubmit}>
        <label>
          Date of birth
          <input type="date" value={dobInput} onChange={(e) => setDobInput(e.target.value)} required />
        </label>
        <button type="submit" className="btn">
          Reveal my cake
        </button>
      </form>

      {entry && cake && recipe && (
        <section className="time-machine-result">
          {birthYear !== null && variant && (
            <ShareCard
              year={birthYear}
              cakeName={variant.variantName}
              subtitle={`a ${entry.decadeLabel} ${cake.name}`}
              bodyText={`${cake.flavorNotes.slice(0, 2).join(' & ')} from the ${entry.decadeLabel}.`}
            />
          )}

          <div className="card">
            <CakeHeroImage cakeId={cake.id} variant="hero" alt={cake.name} />
            <span className="tag">{entry.decadeLabel}</span>
            <h2>{cake.name}</h2>
            <p>{cake.description}</p>
            <h3>Why this cake?</h3>
            <p>{entry.eraContext}</p>
            {entry.funFact && (
              <>
                <h3>A fun fact</h3>
                <p>{entry.funFact}</p>
              </>
            )}
            {entry.modernInterpretation && (
              <>
                <h3>The modern interpretation</h3>
                <p>{entry.modernInterpretation}</p>
              </>
            )}
            <SaveButton type="cake" id={cake.id} />
            <Link to={`/cake/${cake.id}`} className="encyclopedia-link">
              View full encyclopedia entry →
            </Link>
          </div>

          {birthYear !== null && variant && (
            <div className="card year-twist-card">
              <span className="tag tag-gold">{birthYear} vintage</span>
              <h2>{variant.variantName}</h2>
              <p>{variant.twist}</p>
              <p className="year-twist-note">{variant.recipeTwistNote}</p>
            </div>
          )}

          <h2 className="recipe-heading">Base Recipe</h2>
          <RecipeCard key={recipe.id} recipe={recipe} />

          {relatedCakes.length > 0 && (
            <section className="cake-detail-section">
              <h2>🔗 Related Cakes</h2>
              <div className="cake-detail-related-grid">
                {relatedCakes.map(({ cake: related, reason }) => (
                  <Link key={related.id} to={`/cake/${related.id}`} className="card cake-detail-related-card">
                    <CakeHeroImage cakeId={related.id} variant="thumbnail" alt={related.name} />
                    <h3>{related.name}</h3>
                    <p>{reason}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {pairings.length > 0 && (
            <section className="card cake-detail-section">
              <h2>🥂 Pairings</h2>
              <ul className="cake-detail-pairing-list">
                {pairings.map(({ drink, score }) => (
                  <li key={drink.id}>
                    <span className="cake-detail-pairing-score" style={{ background: scoreColor(score) }}>
                      {score}
                    </span>
                    {drink.name}
                  </li>
                ))}
              </ul>
              <Link to="/sommelier" className="btn btn-secondary cake-detail-sommelier-link">
                Explore all pairings in the Sommelier →
              </Link>
            </section>
          )}
        </section>
      )}
    </main>
  )
}
