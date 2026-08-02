import { useState, type FormEvent } from 'react'
import { lookupCakeForLocation } from '../lib/atlas'
import type { AiCakeResult, IngredientCategory } from '../types/atlas'
import './AtlasPage.css'

const INGREDIENT_CATEGORY_ORDER: IngredientCategory[] = ['Cake Base', 'Filling', 'Frosting', 'Decor']

const EXAMPLE_LOCATIONS = ['Vienna, Austria', 'Hokkaido, Japan', 'Tuscany, Italy', 'Lagos, Nigeria']

export function AtlasPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AiCakeResult | null>(null)

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setStatus('loading')
    setError(null)
    try {
      const data = await lookupCakeForLocation(query.trim())
      setResult(data)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <main className="page atlas-page">
      <h1>Global Cake Atlas</h1>
      <p>Search any city, region, or country to discover its most iconic cake — history and full recipe included.</p>

      <form className="atlas-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="e.g. Vienna, Austria"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'idle' && (
        <div className="atlas-examples">
          <span>Try:</span>
          {EXAMPLE_LOCATIONS.map((loc) => (
            <button key={loc} className="atlas-example-chip" onClick={() => setQuery(loc)}>
              {loc}
            </button>
          ))}
        </div>
      )}

      {status === 'loading' && <p className="atlas-status">Consulting the culinary archives…</p>}

      {status === 'error' && (
        <div className="card atlas-error">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => setStatus('idle')}>
            Try again
          </button>
        </div>
      )}

      {status === 'done' && result && (
        <section className="atlas-result">
          <div className="card">
            <span className="tag">{result.resolved_location.country}</span>
            {result.resolved_location.region_state && <span className="tag atlas-city-tag">{result.resolved_location.region_state}</span>}
            {result.resolved_location.city && <span className="tag atlas-city-tag">{result.resolved_location.city}</span>}
            <h2>
              {result.cake.name}
              {result.cake.local_name && <span className="atlas-local-name"> ({result.cake.local_name})</span>}
            </h2>
            <p className="atlas-tagline">{result.cake.tagline}</p>

            <h3>Background story</h3>
            <p className="atlas-era">{result.cake.origin.creation_era}</p>
            <p>{result.cake.origin.history_and_significance}</p>

            <p className="atlas-flavor-notes">Flavor notes: {result.cake.key_flavor_profile.join(', ')}</p>
          </div>

          <h2 className="recipe-heading">Recipe</h2>
          <div className="card">
            <div className="atlas-recipe-meta">
              <span>
                <strong>Prep:</strong> {result.cake.recipe.prep_time}
              </span>
              <span>
                <strong>Bake:</strong> {result.cake.recipe.bake_time}
              </span>
              <span>
                <strong>Difficulty:</strong> {result.cake.recipe.difficulty}
              </span>
              <span>
                <strong>Servings:</strong> {result.cake.recipe.servings}
              </span>
            </div>

            <h3>Ingredients</h3>
            {INGREDIENT_CATEGORY_ORDER.filter((category) =>
              result.cake.recipe.ingredients.some((ing) => ing.category === category),
            ).map((category) => (
              <div key={category} className="atlas-ingredient-group">
                <h4>{category}</h4>
                <ul className="ingredient-list">
                  {result.cake.recipe.ingredients
                    .filter((ing) => ing.category === category)
                    .map((ing, i) => (
                      <li key={i}>
                        <span className="ingredient-qty">
                          {ing.amount} {ing.unit}
                        </span>{' '}
                        {ing.item}
                      </li>
                    ))}
                </ul>
              </div>
            ))}

            <h3>Steps</h3>
            <ol className="step-list">
              {result.cake.recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <div className="atlas-baker-notes">
              <strong>Baker's notes:</strong> {result.cake.recipe.baker_notes}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
