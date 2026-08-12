import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DietTag, Recipe, RecipeComponent } from '../types/cake'
import { scaleRecipe, scaleRecipeComponent, type ScaledIngredient, type UnitSystem } from '../lib/units'
import { slugify } from '../lib/ingredients'
import { getCake } from '../lib/data'
import { RecipeShareCard } from './RecipeShareCard'
import './RecipeCard.css'

function IngredientList({ ingredients }: { ingredients: ScaledIngredient[] }) {
  return (
    <ul className="ingredient-list">
      {ingredients.map((ing) => (
        <li key={ing.id}>
          <span className="ingredient-qty">
            {ing.qty} {ing.unit === 'count' ? '' : ing.unit}
          </span>{' '}
          {ing.substitutionNote ? ing.name : <Link to={`/ingredient/${slugify(ing.name)}`}>{ing.name}</Link>}
          {ing.substitutionNote && <span className="substitution-note"> — use {ing.substitutionNote}</span>}
        </li>
      ))}
    </ul>
  )
}

function RecipeComponentSection({
  title,
  component,
  scaled,
}: {
  title: string
  component: RecipeComponent
  scaled: ScaledIngredient[] | null
}) {
  if ('none' in component) {
    return (
      <div className="recipe-component-section">
        <h3>{title}</h3>
        <p className="recipe-component-none">{component.note}</p>
      </div>
    )
  }
  return (
    <div className="recipe-component-section">
      <h3>
        {title}: {component.name}
      </h3>
      {scaled && <IngredientList ingredients={scaled} />}
      <p className="recipe-component-prep">{component.prep}</p>
      {component.textureGoal && (
        <p className="recipe-component-note">
          <strong>Texture goal:</strong> {component.textureGoal}
        </p>
      )}
      {component.applicationNotes && (
        <p className="recipe-component-note">
          <strong>Application:</strong> {component.applicationNotes}
        </p>
      )}
      {component.chillGuidance && (
        <p className="recipe-component-note">
          <strong>Chill/rest:</strong> {component.chillGuidance}
        </p>
      )}
    </div>
  )
}

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
  const [showShare, setShowShare] = useState(false)

  const activeDiet = diet === 'none' ? undefined : diet
  const ingredients = scaleRecipe(recipe, servings, unitSystem, activeDiet)
  const scaledFilling = recipe.filling ? scaleRecipeComponent(recipe.filling, recipe, servings, unitSystem, activeDiet) : null
  const scaledFrostingFinish = recipe.frostingFinish ? scaleRecipeComponent(recipe.frostingFinish, recipe, servings, unitSystem, activeDiet) : null
  const cake = getCake(recipe.cakeId)

  const hasOverview = recipe.yield || recipe.prepTimeMinutes || recipe.bakeTimeMinutes || recipe.totalTimeMinutes || recipe.ovenTempC || recipe.panSize || (recipe.equipment && recipe.equipment.length > 0)

  return (
    <div className="card recipe-card">
      {hasOverview && (
        <div className="recipe-overview">
          <h3>Overview</h3>
          <ul className="recipe-overview-list">
            {recipe.yield && <li>Yield: {recipe.yield} servings</li>}
            {recipe.prepTimeMinutes && <li>Prep: {recipe.prepTimeMinutes} min</li>}
            {recipe.bakeTimeMinutes && <li>Bake: {recipe.bakeTimeMinutes} min</li>}
            {recipe.totalTimeMinutes && <li>Total: {recipe.totalTimeMinutes} min</li>}
            {recipe.ovenTempC && recipe.ovenTempF && (
              <li>
                Oven: {recipe.ovenTempC}°C ({recipe.ovenTempF}°F)
              </li>
            )}
            {recipe.panSize && <li>Pan: {recipe.panSize}</li>}
            {recipe.equipment && recipe.equipment.length > 0 && <li>Equipment: {recipe.equipment.join(', ')}</li>}
          </ul>
        </div>
      )}

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

      <h3>{recipe.filling || recipe.frostingFinish ? 'Cake / Sponge' : 'Ingredients'}</h3>
      <IngredientList ingredients={ingredients} />

      {recipe.filling && <RecipeComponentSection title="Filling" component={recipe.filling} scaled={scaledFilling} />}
      {recipe.frostingFinish && <RecipeComponentSection title="Frosting & Finish" component={recipe.frostingFinish} scaled={scaledFrostingFinish} />}

      <h3>Assembly / Steps</h3>
      <ol className="step-list">
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {recipe.storage && (
        <p className="recipe-storage">
          <strong>Storage:</strong> {recipe.storage}
        </p>
      )}

      {cake && (
        <>
          <button className="btn btn-secondary" onClick={() => setShowShare((s) => !s)}>
            Share Recipe
          </button>
          {showShare && <RecipeShareCard cake={cake} />}
        </>
      )}
    </div>
  )
}
