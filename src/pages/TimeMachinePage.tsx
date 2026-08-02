import { useState, type FormEvent } from 'react'
import { getCakeForBirthYear } from '../lib/timeMachine'
import { getYearVariant } from '../lib/yearVintage'
import { getCake, getRecipe } from '../lib/data'
import { RecipeCard } from '../components/RecipeCard'
import { ShareCard } from '../components/ShareCard'
import './TimeMachinePage.css'

export function TimeMachinePage() {
  const [dobInput, setDobInput] = useState('')
  const [birthYear, setBirthYear] = useState<number | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!dobInput) return
    const year = new Date(dobInput).getFullYear()
    setBirthYear(year)
  }

  const entry = birthYear !== null ? getCakeForBirthYear(birthYear) : null
  const cake = entry ? getCake(entry.cakeId) : null
  const recipe = entry ? getRecipe(entry.recipeId) : null
  const variant = cake && birthYear !== null ? getYearVariant(birthYear, cake.name) : null

  return (
    <main className="page time-machine-page">
      <h1>Birthday Time Machine</h1>
      <p>Enter your date of birth to uncover the cake that defined your exact year.</p>

      <form className="dob-form" onSubmit={handleSubmit}>
        <label>
          Date of birth
          <input type="date" value={dobInput} onChange={(e) => setDobInput(e.target.value)} required />
        </label>
        <button type="submit" className="btn">
          Reveal my cake
        </button>
      </form>

      {entry && cake && recipe && variant && (
        <section className="time-machine-result">
          <ShareCard year={birthYear!} cakeName={variant.variantName} subtitle={`a ${entry.decadeLabel} ${cake.name}`} />

          <div className="card">
            <span className="tag">{entry.decadeLabel}</span>
            <h2>{cake.name}</h2>
            <p>{cake.description}</p>
            <h3>Why this cake?</h3>
            <p>{entry.eraContext}</p>
          </div>

          <div className="card year-twist-card">
            <span className="tag tag-gold">{birthYear} vintage</span>
            <h2>{variant.variantName}</h2>
            <p>{variant.twist}</p>
            <p className="year-twist-note">{variant.recipeTwistNote}</p>
          </div>

          <h2 className="recipe-heading">Base Recipe</h2>
          <RecipeCard key={recipe.id} recipe={recipe} />
        </section>
      )}
    </main>
  )
}
