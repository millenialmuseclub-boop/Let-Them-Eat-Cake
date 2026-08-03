import { useState } from 'react'
import type { DietTag } from '../types/cake'
import type { SeasonVariant, WeddingPlanInput, WeddingPlanResult, WeddingSeason } from '../types/weddingCake'
import { weddingCultures, weddingAesthetics, getCake, getRecipe } from '../lib/data'
import { generateWeddingPlan, formatArchitectureLabel, formatFrostingLabel, formatRoleLabel, toMarkdown } from '../lib/weddingCake'
import { RecipeCard } from '../components/RecipeCard'
import './WeddingCakePlannerPage.css'

const DIET_OPTIONS: { value: DietTag | 'none'; label: string }[] = [
  { value: 'none', label: 'No constraint' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'egg-free', label: 'Egg-free' },
  { value: 'nut-free', label: 'Nut-free' },
]

const SEASON_OPTIONS: { value: WeddingSeason; label: string }[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
]

const ALLERGEN_LABELS: Record<string, string> = {
  dairy: 'Dairy',
  eggs: 'Eggs',
  'wheat-gluten': 'Wheat / Gluten',
  'tree-nuts': 'Tree Nuts',
  peanuts: 'Peanuts',
  soy: 'Soy',
}

export function WeddingCakePlannerPage() {
  const [cultureId, setCultureId] = useState(weddingCultures[0].id)
  const [guestCount, setGuestCount] = useState(100)
  const [season, setSeason] = useState<WeddingSeason>('summer')
  const [variant, setVariant] = useState<SeasonVariant>('indoor')
  const [aestheticId, setAestheticId] = useState(weddingAesthetics[0].id)
  const [diet, setDiet] = useState<DietTag | 'none'>('none')
  const [result, setResult] = useState<WeddingPlanResult | null>(null)
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    const input: WeddingPlanInput = { cultureId, guestCount, season, variant, aestheticId, diet }
    setResult(generateWeddingPlan(input))
    setCopied(false)
  }

  async function handleCopyMarkdown() {
    if (!result) return
    await navigator.clipboard.writeText(toMarkdown(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="page wedding-page">
      <h1>Wedding Cake Planner</h1>
      <p>Build a full wedding cake master planning sheet — culture, structure, seasonal flavor, allergens, and decor — in one pass.</p>

      <div className="card wedding-form">
        <label>
          Location / Culture
          <select value={cultureId} onChange={(e) => setCultureId(e.target.value)}>
            {weddingCultures.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Guest count
          <input
            type="number"
            min={10}
            max={400}
            value={guestCount}
            onChange={(e) => setGuestCount(Math.min(400, Math.max(10, Number(e.target.value) || 10)))}
          />
        </label>

        <label>
          Season
          <select value={season} onChange={(e) => setSeason(e.target.value as WeddingSeason)}>
            {SEASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="variant-toggle-wrap">
          <span>Venue</span>
          <div className="unit-toggle">
            <button className={variant === 'indoor' ? 'active' : ''} onClick={() => setVariant('indoor')}>
              Indoor
            </button>
            <button className={variant === 'outdoor' ? 'active' : ''} onClick={() => setVariant('outdoor')}>
              Outdoor
            </button>
          </div>
        </div>

        <label>
          Aesthetic / Vibe
          <select value={aestheticId} onChange={(e) => setAestheticId(e.target.value)}>
            {weddingAesthetics.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Dietary constraint
          <select value={diet} onChange={(e) => setDiet(e.target.value as DietTag | 'none')}>
            {DIET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button className="btn" onClick={handleGenerate}>
          Generate Plan
        </button>
      </div>

      {result && (
        <div className="wedding-result">
          <button className="btn btn-secondary copy-markdown-btn" onClick={handleCopyMarkdown}>
            {copied ? 'Copied!' : 'Copy as Markdown'}
          </button>

          <section className="card wedding-section">
            <h2>💍 Cultural History &amp; Traditions</h2>
            <p>
              <strong>Traditions:</strong> {result.culture.traditions}
            </p>
            <p>
              <strong>Symbolism:</strong> {result.culture.symbolism}
            </p>
            <p>
              <strong>Ritual:</strong> {result.culture.ritual}
            </p>
          </section>

          <section className="card wedding-section">
            <h2>🏰 Cake Type &amp; Structural Architecture</h2>
            <p>
              <span className="tag">{formatArchitectureLabel(result.architecturePlan.architecture)}</span>
            </p>
            <p>{result.architecturePlan.architectureReason}</p>
            <h3>Tier breakdown</h3>
            <ul>
              {result.architecturePlan.tiers.map((tier, i) => (
                <li key={i}>
                  <strong>{formatRoleLabel(tier.role)}:</strong> {tier.diameterIn}" — {tier.venueSlices} venue slices (1"×1") / {tier.partySlices} party slices
                  (1"×2")
                </li>
              ))}
            </ul>
            <h3>Structural stability notes</h3>
            <ul>
              {result.architecturePlan.stabilityNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
              {result.architecturePlan.cappedGuestCountWarning && <li className="warning-note">⚠️ {result.architecturePlan.cappedGuestCountWarning}</li>}
            </ul>
          </section>

          <section className="card wedding-section">
            <h2>🍂 Seasonal Flavor Harmony &amp; Timing</h2>
            <p>
              {result.seasonEntry.name} favors flavors like {result.seasonEntry.flavorAffinityNotes.join(', ')}.
            </p>
            <p className="warning-note">
              <strong>
                {formatFrostingLabel(result.chosenFrosting)} — {result.input.variant}:
              </strong>{' '}
              {result.frostingGuidance}
            </p>
          </section>

          <section className="card wedding-section">
            <h2>🍰 Multi-Tier Flavor Specifications</h2>
            {result.tierPicks.map((pick) => {
              const recipe = getRecipe(pick.recipeId)
              const cake = getCake(pick.cakeId)
              if (!recipe || !cake) return null
              return (
                <div key={pick.role} className="tier-pick">
                  <h3>
                    {formatRoleLabel(pick.role)}: {cake.name}
                  </h3>
                  <ul>
                    {pick.reason.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                    {pick.dietCaveat && <li className="warning-note">⚠️ {pick.dietCaveat}</li>}
                  </ul>
                  <RecipeCard key={recipe.id} recipe={recipe} />
                </div>
              )
            })}
          </section>

          <section className="card wedding-section">
            <h2>⚠️ Allergen &amp; Dietary Compliance</h2>
            <ul className="allergen-audit">
              {result.allergenAudit.map((entry) => (
                <li key={entry.allergen} className={`allergen-row allergen-${entry.status}`}>
                  <span className="tag">{ALLERGEN_LABELS[entry.allergen]}</span> {entry.guidance}
                </li>
              ))}
            </ul>
            <p className="allergen-footer">{result.allergenFooterNote}</p>
          </section>

          <section className="card wedding-section">
            <h2>🎨 Aesthetic Decor &amp; Baker Logistics</h2>
            <p>
              <strong>Palette:</strong> {result.aesthetic.paletteGuidance}
            </p>
            <p>
              <strong>Texture &amp; sugarwork:</strong> {result.aesthetic.textureGuidance}
            </p>
            <p>
              <strong>Cultural accent:</strong> {result.culture.decorHint}
            </p>
            <h3>Caterer cutting guide</h3>
            <ul>
              {result.cuttingGuide.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  )
}
