import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Equipment, PantryIngredient, PantryMatch, SkillLevel } from '../types/pantry'
import { ALL_EQUIPMENT, ALL_PANTRY_INGREDIENTS, EQUIPMENT_LABELS, PANTRY_INGREDIENT_LABELS, SKILL_LEVEL_LABELS, applyPantryFilters, matchEmergencyRecipes } from '../lib/pantry'
import { emergencyRecipes, getRecipe } from '../lib/data'
import { getProductsForIngredient } from '../lib/affiliateProducts'
import { RecipeCard } from '../components/RecipeCard'
import { AffiliateProductSet } from '../components/AffiliateProductSet'
import './PantryRaidPage.css'

const TIME_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: '15', label: 'Under 15 min' },
  { value: '30', label: 'Under 30 min' },
  { value: '60', label: 'Under 1 hour' },
]

const SKILL_OPTIONS: { value: SkillLevel | 'any'; label: string }[] = [
  { value: 'any', label: 'Any skill level' },
  { value: 'beginner', label: SKILL_LEVEL_LABELS.beginner },
  { value: 'intermediate', label: SKILL_LEVEL_LABELS.intermediate },
  { value: 'advanced', label: SKILL_LEVEL_LABELS.advanced },
]

export function PantryRaidPage() {
  const [onHand, setOnHand] = useState<Set<PantryIngredient>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState('any')
  const [skillFilter, setSkillFilter] = useState<SkillLevel | 'any'>('any')
  const [ownedEquipment, setOwnedEquipment] = useState<Set<Equipment>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)

  function toggleIngredient(ingredient: PantryIngredient) {
    setOnHand((prev) => {
      const next = new Set(prev)
      if (next.has(ingredient)) next.delete(ingredient)
      else next.add(ingredient)
      return next
    })
  }

  function toggleEquipment(equipment: Equipment) {
    setOwnedEquipment((prev) => {
      const next = new Set(prev)
      if (next.has(equipment)) next.delete(equipment)
      else next.add(equipment)
      return next
    })
  }

  const allMatches = matchEmergencyRecipes(Array.from(onHand), emergencyRecipes)
  const filtered = applyPantryFilters(allMatches, {
    maxTimeMinutes: timeFilter === 'any' ? undefined : Number(timeFilter),
    skillLevel: skillFilter === 'any' ? undefined : skillFilter,
    requiredEquipment: ownedEquipment,
  })
  const bestMatches = filtered.filter((m) => m.tier === 'best')
  const greatMatches = filtered.filter((m) => m.tier === 'great')
  const creativeMatches = filtered.filter((m) => m.tier === 'creative')

  function renderCard(match: PantryMatch) {
    const { recipe, missing, applicableSubstitutions, matchReason } = match
    const haveCount = recipe.requiredIngredients.length - missing.length
    const detailRecipe = getRecipe(recipe.recipeId)
    return (
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
        <p className="pantry-have-count">
          You have {haveCount} of {recipe.requiredIngredients.length} ingredients
        </p>
        <p className="pantry-match-reason">{matchReason}</p>
        <p>{recipe.description}</p>

        <div className="pantry-badges">
          <span className="pantry-badge">Yield: {recipe.yield}</span>
          <span className="pantry-badge">{recipe.timeMinutes} min</span>
          <span className="pantry-badge">{SKILL_LEVEL_LABELS[recipe.skillLevel]}</span>
          {recipe.equipment.map((e) => (
            <span key={e} className="pantry-badge">
              {EQUIPMENT_LABELS[e]}
            </span>
          ))}
        </div>

        {missing.length > 0 && <p className="pantry-missing-list">Need: {missing.map((m) => PANTRY_INGREDIENT_LABELS[m]).join(', ')}</p>}

        {applicableSubstitutions.length > 0 && (
          <div className="pantry-substitutions">
            <h4>Substitutions</h4>
            {applicableSubstitutions.map((sub) => (
              <div key={sub.missingIngredient} className="pantry-substitution-entry">
                <p>
                  <strong>Missing:</strong> {PANTRY_INGREDIENT_LABELS[sub.missingIngredient]}
                </p>
                <p>
                  <strong>Substitute:</strong> {sub.replacement}
                </p>
                <p>
                  <strong>Impact:</strong> {sub.flavorImpact} {sub.difficultyNote}
                </p>
              </div>
            ))}
          </div>
        )}

        <AffiliateProductSet title="Recommended" products={missing.flatMap((m) => getProductsForIngredient(m))} />

        <button className="btn btn-secondary" onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}>
          {expandedId === recipe.id ? 'Hide full recipe' : 'Show full recipe'}
        </button>
        {expandedId === recipe.id && detailRecipe && (
          <>
            <RecipeCard recipe={detailRecipe} />
            {recipe.bakersNotes && (
              <div className="pantry-bakers-notes">
                <h4>Baker's Notes</h4>
                <p>
                  <strong>Common mistakes:</strong> {recipe.bakersNotes.commonMistakes}
                </p>
                <p>
                  <strong>Make ahead:</strong> {recipe.bakersNotes.makeAhead}
                </p>
                <p>
                  <strong>Storage:</strong> {recipe.bakersNotes.storage}
                </p>
                <p>
                  <strong>Freezing:</strong> {recipe.bakersNotes.freezing}
                </p>
              </div>
            )}
          </>
        )}

        <div className="pantry-workshop-links">
          <Link to="/assembly-lab" className="encyclopedia-link">
            🧁 Build a custom version in Assembly Lab →
          </Link>
          <Link to="/ingredients" className="encyclopedia-link">
            🧂 Browse the Ingredient Explorer →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="page pantry-page">
      <h1>Pantry Raid</h1>
      <p>Check off what you have on hand and we'll find the emergency cake that needs the least shopping.</p>

      <div className="pantry-checklist">
        {ALL_PANTRY_INGREDIENTS.map((ingredient) => (
          <button key={ingredient} className={onHand.has(ingredient) ? 'pantry-chip active' : 'pantry-chip'} onClick={() => toggleIngredient(ingredient)}>
            {PANTRY_INGREDIENT_LABELS[ingredient]}
          </button>
        ))}
      </div>

      <div className="card pantry-filters">
        <label>
          Time required
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Skill level
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value as SkillLevel | 'any')}>
            {SKILL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="pantry-equipment-filter">
          <span className="pantry-equipment-label">Equipment available</span>
          <div className="pantry-equipment-chips">
            {ALL_EQUIPMENT.map((equipment) => (
              <button
                key={equipment}
                className={ownedEquipment.has(equipment) ? 'pantry-chip active' : 'pantry-chip'}
                onClick={() => toggleEquipment(equipment)}
              >
                {EQUIPMENT_LABELS[equipment]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="btn pantry-find-btn" onClick={() => setHasSearched(true)}>
        🍰 Find Cakes I Can Make
      </button>

      {!hasSearched ? (
        <div className="card pantry-prompt">
          <p>Check off what's in your kitchen above, then tap <strong>Find Cakes I Can Make</strong> to see your matches.</p>
        </div>
      ) : (
        <>
          <h2 className="pantry-section-heading">✨ Best Match</h2>
          <p className="pantry-section-subtext">You already have everything these cakes need.</p>
          <div className="pantry-results">
            {bestMatches.length === 0 && <p className="pantry-empty">Check off a few more ingredients to see a best match.</p>}
            {bestMatches.map(renderCard)}
          </div>

          <h2 className="pantry-section-heading">👍 Great Match</h2>
          <p className="pantry-section-subtext">Missing one ingredient — and it substitutes cleanly.</p>
          <div className="pantry-results">
            {greatMatches.length === 0 && <p className="pantry-empty">No great matches yet — try adjusting your filters or checking off more ingredients.</p>}
            {greatMatches.map(renderCard)}
          </div>

          <h2 className="pantry-section-heading">💡 Creative Match</h2>
          <p className="pantry-section-subtext">Missing 1-2 ingredients.</p>
          <div className="pantry-results">
            {creativeMatches.length === 0 && <p className="pantry-empty">No creative matches yet — try adjusting your filters or checking off more ingredients.</p>}
            {creativeMatches.map(renderCard)}
          </div>
        </>
      )}
    </main>
  )
}
