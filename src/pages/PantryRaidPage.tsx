import { useState } from 'react'
import type { PantryIngredient } from '../types/pantry'
import { ALL_PANTRY_INGREDIENTS, PANTRY_INGREDIENT_LABELS, rankEmergencyRecipes } from '../lib/pantry'
import { emergencyRecipes } from '../lib/data'
import './PantryRaidPage.css'

export function PantryRaidPage() {
  const [onHand, setOnHand] = useState<Set<PantryIngredient>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleIngredient(ingredient: PantryIngredient) {
    setOnHand((prev) => {
      const next = new Set(prev)
      if (next.has(ingredient)) next.delete(ingredient)
      else next.add(ingredient)
      return next
    })
  }

  const ranked = rankEmergencyRecipes(Array.from(onHand), emergencyRecipes)

  return (
    <main className="page pantry-page">
      <h1>Pantry Raid</h1>
      <p>Check off what you have on hand and we'll find the emergency cake that needs the least shopping.</p>

      <div className="pantry-checklist">
        {ALL_PANTRY_INGREDIENTS.map((ingredient) => (
          <button
            key={ingredient}
            className={onHand.has(ingredient) ? 'pantry-chip active' : 'pantry-chip'}
            onClick={() => toggleIngredient(ingredient)}
          >
            {PANTRY_INGREDIENT_LABELS[ingredient]}
          </button>
        ))}
      </div>

      <div className="pantry-results">
        {ranked.map(({ recipe, missing }) => (
          <div key={recipe.id} className="card pantry-result-card">
            <div className="pantry-result-header">
              <h3>{recipe.name}</h3>
              {missing.length === 0 ? (
                <span className="tag pantry-ready">Ready to bake</span>
              ) : (
                <span className="pantry-missing-count">
                  Missing {missing.length} item{missing.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
            <p>{recipe.description}</p>
            {missing.length > 0 && (
              <p className="pantry-missing-list">
                Need: {missing.map((m) => PANTRY_INGREDIENT_LABELS[m]).join(', ')}
              </p>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
            >
              {expandedId === recipe.id ? 'Hide steps' : 'Show steps'}
            </button>
            {expandedId === recipe.id && (
              <ol className="pantry-steps">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
