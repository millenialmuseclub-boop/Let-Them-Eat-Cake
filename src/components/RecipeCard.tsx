import { useState } from 'react'
import type { DietTag, Recipe } from '../types/cake'
import { scaleRecipe, type UnitSystem } from '../lib/units'
import './RecipeCard.css'

const DIET_OPTIONS: { value: DietTag | 'none'; label: string }[] = [
  { value: 'none', label: 'No substitutions' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'egg-free', label: 'Egg-free' },
  { value: 'nut-free', label: 'Nut-free' },
]

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [servings, setServings] = useState(recipe.baseServings)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [diet, setDiet] = useState<DietTag | 'none'>('none')

  const ingredients = scaleRecipe(recipe, servings, unitSystem, diet === 'none' ? undefined : diet)

  return (
    <div className="card recipe-card">
      <div className="recipe-controls">
        <label>
          Servings
          <input
            type="number"
            min={1}
            max={50}
            value={servings}
            onChange={(e) => setServings(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <div className="unit-toggle">
          <button className={unitSystem === 'metric' ? 'active' : ''} onClick={() => setUnitSystem('metric')}>
            Metric
          </button>
          <button className={unitSystem === 'imperial' ? 'active' : ''} onClick={() => setUnitSystem('imperial')}>
            Imperial
          </button>
        </div>
        <label>
          Dietary swap
          <select value={diet} onChange={(e) => setDiet(e.target.value as DietTag | 'none')}>
            {DIET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h3>Ingredients</h3>
      <ul className="ingredient-list">
        {ingredients.map((ing) => (
          <li key={ing.id}>
            <span className="ingredient-qty">
              {ing.qty} {ing.unit === 'count' ? '' : ing.unit}
            </span>{' '}
            {ing.name}
            {ing.substitutionNote && <span className="substitution-note"> — use {ing.substitutionNote}</span>}
          </li>
        ))}
      </ul>

      <h3>Steps</h3>
      <ol className="step-list">
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  )
}
