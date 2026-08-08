import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { DietTag } from '../types/cake'
import type { CakeShape, CelebrationOccasion, SeasonVariant, WeddingPlanInput, WeddingPlanResult, WeddingSeason } from '../types/weddingCake'
import { weddingCultures, weddingAesthetics, weddingDecorationStyles, getCake, getRecipe } from '../lib/data'
import { generateWeddingPlan, formatArchitectureLabel, formatFrostingLabel, formatOccasionLabel, formatRoleLabel, formatShapeLabel, toMarkdown } from '../lib/weddingCake'
import { rankDecorationStyles } from '../lib/weddingDecoration'
import { getTopPairings } from '../lib/encyclopedia'
import { RecipeCard } from '../components/RecipeCard'
import { WeddingCakeDiagram } from '../components/WeddingCakeDiagram'
import { AffiliateProductSet } from '../components/AffiliateProductSet'
import { getProductsByIds } from '../lib/affiliateProducts'
import './WeddingCakePlannerPage.css'

/** Only decoration styles with a genuine, defensible product connection get a mapping — not every style is forced to match. */
const DECORATION_STYLE_PRODUCT_IDS: Record<string, string[]> = {
  decor_classic_buttercream_rosettes: ['product_decorating_kit', 'product_revolving_cake_stand'],
  decor_fondant_lace: ['product_decorating_kit'],
  decor_watercolor_painted: ['product_gel_colors'],
  decor_sugar_flower_sculptural: ['product_gel_colors', 'product_marble_pastry_board'],
  decor_modern_geometric: ['product_scraper', 'product_offset_spatula'],
  decor_metallic_drip: ['product_offset_spatula'],
}

const OCCASION_OPTIONS: { value: CelebrationOccasion; label: string; swatchHex: string }[] = [
  { value: 'wedding', label: 'Wedding', swatchHex: '#f6cbe0' },
  { value: 'birthday', label: 'Birthday', swatchHex: '#ffd54f' },
  { value: 'baby-shower', label: 'Baby Shower', swatchHex: '#cfe8f3' },
  { value: 'holiday', label: 'Holiday', swatchHex: '#8b1e2b' },
  { value: 'graduation', label: 'Graduation', swatchHex: '#1c1c1c' },
  { value: 'anniversary', label: 'Anniversary', swatchHex: '#d9c2a3' },
]

/** Picks readable tile text color against an arbitrary swatch background. */
function tileTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1c1c1c' : '#ffffff'
}

const SHAPE_OPTIONS: { value: CakeShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'hexagon', label: 'Hexagon' },
]

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

export function WeddingCakePlannerPage({
  lockedOccasion,
  occasionChoices,
  headerContent,
}: {
  lockedOccasion?: CelebrationOccasion
  occasionChoices?: CelebrationOccasion[]
  headerContent?: ReactNode
}) {
  const [occasion, setOccasion] = useState<CelebrationOccasion>(lockedOccasion ?? 'wedding')
  const [cultureId, setCultureId] = useState(weddingCultures[0].id)
  const [guestCount, setGuestCount] = useState(100)
  const [season, setSeason] = useState<WeddingSeason>('summer')
  const [variant, setVariant] = useState<SeasonVariant>('indoor')
  const [aestheticId, setAestheticId] = useState(weddingAesthetics[0].id)
  const [diet, setDiet] = useState<DietTag | 'none'>('none')
  const [shape, setShape] = useState<CakeShape>('round')
  const [decorationStyleId, setDecorationStyleId] = useState(weddingDecorationStyles[0].id)
  const [result, setResult] = useState<WeddingPlanResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [occasionChosen, setOccasionChosen] = useState(!!lockedOccasion)
  const [inspirationChosen, setInspirationChosen] = useState(false)

  const visibleOccasionOptions = occasionChoices ? OCCASION_OPTIONS.filter((opt) => occasionChoices.includes(opt.value)) : OCCASION_OPTIONS

  function chooseOccasion(value: CelebrationOccasion) {
    setOccasion(value)
    setOccasionChosen(true)
  }

  function chooseInspiration(id: string) {
    setAestheticId(id)
    setInspirationChosen(true)
  }

  const decorationRanking = rankDecorationStyles(aestheticId)
  const topDecorationScore = decorationRanking[0]?.score
  const recommendedDecorationIds = new Set(decorationRanking.filter((r) => r.score === topDecorationScore).map((r) => r.style.id))

  function handleGenerate() {
    const input: WeddingPlanInput = { occasion, cultureId, guestCount, season, variant, aestheticId, diet, shape, decorationStyleId }
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
      <h1>
        {lockedOccasion === 'wedding'
          ? 'Wedding Cake Planner'
          : lockedOccasion === 'birthday'
            ? 'Birthday Cake Planner'
            : occasionChoices
              ? 'Other Celebrations'
              : 'Celebration Cake Planner'}
      </h1>
      <p>
        {lockedOccasion === 'wedding'
          ? "A full wedding cake planning journey — culture, structure, seasonal flavor, allergens, and decor in one pass."
          : lockedOccasion === 'birthday'
            ? 'A full birthday cake planning journey — flavor, structure, decor, and a budget estimate in one pass.'
            : occasionChoices
              ? 'For baby showers, holidays, graduations, and anniversaries — a quick, complete planning sheet.'
              : 'Build a full master planning sheet for any occasion — weddings, birthdays, baby showers, holidays, graduations, and anniversaries — covering structure, seasonal flavor, allergens, decor, and a budget estimate in one pass.'}
      </p>

      {headerContent}

      {!occasionChosen ? (
        <>
          <h2 className="inspiration-heading">What are you celebrating?</h2>
          <p className="inspiration-subtext">Start with the occasion — everything after is tailored to it.</p>
          <div className="inspiration-grid">
            {visibleOccasionOptions.map((opt) => (
              <button
                key={opt.value}
                className="inspiration-tile"
                style={{ background: opt.swatchHex, color: tileTextColor(opt.swatchHex) }}
                onClick={() => chooseOccasion(opt.value)}
              >
                <span className="inspiration-tile-name">{opt.label}</span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-secondary inspiration-skip"
            onClick={() => {
              setOccasionChosen(true)
              setInspirationChosen(true)
            }}
          >
            Skip — I'll pick later
          </button>
        </>
      ) : !inspirationChosen ? (
        <>
          {!lockedOccasion && (
            <button className="inspiration-change-link" onClick={() => setOccasionChosen(false)}>
              ← Change occasion
            </button>
          )}

          <h2 className="inspiration-heading">What's your vibe?</h2>
          <p className="inspiration-subtext">Start with a look that feels like you — you can fine-tune every detail after.</p>
          <div className="inspiration-grid">
            {weddingAesthetics.map((a) => (
              <button
                key={a.id}
                className="inspiration-tile"
                style={{ background: a.swatchHex, color: tileTextColor(a.swatchHex) }}
                onClick={() => chooseInspiration(a.id)}
              >
                <span className="inspiration-tile-name">{a.name}</span>
                <span className="inspiration-tile-description">{a.description}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-secondary inspiration-skip" onClick={() => setInspirationChosen(true)}>
            Skip — I'll pick later
          </button>
        </>
      ) : (
        <>
          <button className="inspiration-change-link" onClick={() => setInspirationChosen(false)}>
            ← Change inspiration
          </button>

          <div className="card wedding-form">
        <label>
          Occasion
          <select value={occasion} onChange={(e) => setOccasion(e.target.value as CelebrationOccasion)}>
            {OCCASION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

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

        <div className="variant-toggle-wrap">
          <span>Cake shape</span>
          <div className="unit-toggle">
            {SHAPE_OPTIONS.map((opt) => (
              <button key={opt.value} className={shape === opt.value ? 'active' : ''} onClick={() => setShape(opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <label>
          Decoration style
          <select value={decorationStyleId} onChange={(e) => setDecorationStyleId(e.target.value)}>
            {weddingDecorationStyles.map((d) => (
              <option key={d.id} value={d.id}>
                {recommendedDecorationIds.has(d.id) ? `⭐ ${d.name} (Recommended)` : d.name}
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
          <p className="tag wedding-occasion-tag">{formatOccasionLabel(result.input.occasion)}</p>
          <div className="wedding-result-actions">
            <button className="btn btn-secondary copy-markdown-btn" onClick={handleCopyMarkdown}>
              {copied ? 'Copied!' : 'Copy as Markdown'}
            </button>
            <button className="btn btn-secondary print-btn" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </div>

          <CelebrationConcept result={result} />

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
                <div key={`${pick.role}-${pick.cakeId}`} className="tier-pick">
                  <h3>
                    {formatRoleLabel(pick.role)}: <Link to={`/cake/${cake.id}`}>{cake.name}</Link>
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
            <Link to="/assembly-lab" className="encyclopedia-link">
              🧁 Build a custom tier in Assembly Lab →
            </Link>
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

          <section className="card wedding-section">
            <h2>📐 Cake Design Preview</h2>
            <p>
              <span className="tag">{formatShapeLabel(result.input.shape)}</span> <span className="tag">{result.decorationStyle.name}</span>
            </p>
            <div className="decoration-diagram-wrap">
              <WeddingCakeDiagram
                tiers={result.architecturePlan.tiers}
                shape={result.input.shape}
                swatchHex={result.aesthetic.swatchHex}
                decorationCategory={result.decorationStyle.category}
                decorationSwatchHex={result.decorationStyle.swatchHex}
              />
            </div>
            <p>{result.decorationStyle.description}</p>
            <p>
              <strong>Technique:</strong> {result.decorationStyle.techniqueNotes}
            </p>
          </section>

          <section className="card wedding-section">
            <h2>💰 Budget Estimate</h2>
            <p className="budget-range">
              ${result.budgetEstimate.low}–${result.budgetEstimate.high}
            </p>
            <p className="budget-per-serving">
              Roughly ${result.budgetEstimate.perServingLow}–${result.budgetEstimate.perServingHigh} per serving
            </p>
            <p className="budget-note">{result.budgetEstimate.note}</p>
          </section>

          {(() => {
            const stylingProducts = getProductsByIds(DECORATION_STYLE_PRODUCT_IDS[result.decorationStyle.id] ?? [])
            if (stylingProducts.length === 0) return null
            return (
              <section className="card wedding-section wedding-styling-section">
                <AffiliateProductSet title="Curator's Styling Picks" products={stylingProducts} />
              </section>
            )
          })()}
        </div>
      )}
        </>
      )}
    </main>
  )
}

function CelebrationConcept({ result }: { result: WeddingPlanResult }) {
  const tierCount = result.architecturePlan.tiers.length
  const totalServings = result.architecturePlan.tiers.reduce((sum, tier) => sum + tier.partySlices, 0)
  const flavorNames = result.tierPicks.map((pick) => getCake(pick.cakeId)?.name).filter((name): name is string => !!name)
  const baseCake = result.tierPicks.find((pick) => pick.role === 'base') ?? result.tierPicks[0]
  const baseCakeProfile = baseCake ? getCake(baseCake.cakeId) : undefined
  const topPairing = baseCakeProfile ? getTopPairings(baseCakeProfile, 1)[0] : undefined

  return (
    <section className="card wedding-section wedding-concept-card">
      <h2>✨ Your Celebration Cake</h2>
      <p className="wedding-concept-title">
        {tierCount}-Tier {result.aesthetic.name} {formatOccasionLabel(result.input.occasion)} Cake
      </p>
      <p className="wedding-concept-flavors">{flavorNames.join(' · ')}</p>
      <p className="wedding-concept-line">Serves {totalServings}</p>
      <p className="wedding-concept-line">
        <strong>Recommended finish:</strong> {result.decorationStyle.name}
      </p>
      {topPairing && (
        <p className="wedding-concept-line">
          <strong>Pairing:</strong> {topPairing.drink.name} —{' '}
          <Link to="/sommelier" className="encyclopedia-link">
            Explore in the Sommelier →
          </Link>
        </p>
      )}
    </section>
  )
}
