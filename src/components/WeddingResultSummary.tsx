import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { WeddingPlanResult } from '../types/weddingCake'
import { getCake, getRecipe } from '../lib/data'
import { getTopPairings } from '../lib/encyclopedia'
import { getProductsByIds } from '../lib/affiliateProducts'
import {
  generateWeddingPlan,
  toMarkdown,
  formatArchitectureLabel,
  formatFrostingLabel,
  formatShapeLabel,
  formatRoleLabel,
} from '../lib/weddingCake'
import { registerBackHandler } from '../lib/backButtonInterceptor'
import type { GuestRange } from '../lib/guestRanges'
import { formatComponentLabel } from '../lib/recipeComponents'
import { CakeThumbnail } from './CakeThumbnail'
import { RecipeCard } from './RecipeCard'
import { WeddingCakeDiagram } from './WeddingCakeDiagram'
import { AffiliateProductSet } from './AffiliateProductSet'
import { CelebrateShareCard } from './CelebrateShareCard'
import { GuestRangeSelector } from './GuestRangeSelector'
import { useFocusOnMount } from '../lib/useFocusOnMount'
import './WeddingResultSummary.css'

/** Only decoration styles with a genuine, defensible product connection get a mapping — not every style is forced to match. */
const DECORATION_STYLE_PRODUCT_IDS: Record<string, string[]> = {
  decor_classic_buttercream_rosettes: ['product_decorating_kit', 'product_revolving_cake_stand'],
  decor_fondant_lace: ['product_decorating_kit'],
  decor_watercolor_painted: ['product_gel_colors'],
  decor_sugar_flower_sculptural: ['product_gel_colors', 'product_marble_pastry_board'],
  decor_modern_geometric: ['product_scraper', 'product_offset_spatula'],
  decor_metallic_drip: ['product_offset_spatula'],
}
const WEDDING_PRESENTATION_IDS = ['product_cake_knife_set', 'product_floral_cake_stand', 'product_glass_cake_stand']

/** Only aesthetics with a genuine, defensible cake-inspiration connection get a mapping. */
const WEDDING_CAKE_PRODUCT_IDS: Record<string, string[]> = {
  'Black Tie': ['product_cake_jfk_wedding'],
  'Garden Romantic': ['product_cake_bridgerton_lemon_lavender'],
}

const ALLERGEN_LABELS: Record<string, string> = {
  dairy: 'Dairy',
  eggs: 'Eggs',
  'wheat-gluten': 'Wheat / Gluten',
  'tree-nuts': 'Tree Nuts',
  peanuts: 'Peanuts',
  soy: 'Soy',
}

export function WeddingResultSummary({
  result: initialResult,
  venueType,
  guestRange,
  onGuestRangeChange,
  onRefine,
}: {
  result: WeddingPlanResult
  venueType: string
  guestRange: GuestRange
  onGuestRangeChange: (guestRange: GuestRange) => void
  onRefine: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const structureRef = useRef<HTMLDetailsElement>(null)

  const showShareRef = useRef(showShare)
  showShareRef.current = showShare
  useEffect(
    () =>
      registerBackHandler(() => {
        if (!showShareRef.current) return false
        setShowShare(false)
        return true
      }),
    [],
  )

  // Recompute the full plan whenever the guest range changes -- tier
  // count/sizing, recipe picks (a 2nd tier can change which recipes get
  // chosen), budget, and cutting guide all depend on it, so a partial
  // recalculation would drift out of sync with what's actually displayed.
  // Always sized against the top of the range, per "comfortably serves the
  // upper end of that range."
  const result = useMemo(
    () =>
      guestRange.max === initialResult.input.guestCount ? initialResult : generateWeddingPlan({ ...initialResult.input, guestCount: guestRange.max }),
    [initialResult, guestRange],
  )

  const tierCount = result.architecturePlan.tiers.length
  const totalServings = result.architecturePlan.tiers.reduce((sum, tier) => sum + tier.partySlices, 0)
  const tierSizeLabel = result.architecturePlan.tiers.map((tier) => `${tier.diameterIn}"`).join(' + ')
  const flavorNames = result.tierPicks.map((pick) => getCake(pick.cakeId)?.name).filter((name): name is string => !!name)
  const baseCake = result.tierPicks.find((pick) => pick.role === 'base') ?? result.tierPicks[0]
  const baseCakeProfile = baseCake ? getCake(baseCake.cakeId) : undefined
  const baseCakeRecipe = baseCake ? getRecipe(baseCake.recipeId) : undefined
  const fillingLabel = formatComponentLabel(baseCakeRecipe?.filling)
  const finishLabel = formatComponentLabel(baseCakeRecipe?.frostingFinish)
  const topPairing = baseCakeProfile ? getTopPairings(baseCakeProfile, 1)[0] : undefined
  const conceptName = `${tierCount === 1 ? 'Single-Tier' : `${tierCount}-Tier`} ${result.aesthetic.name} Celebration Cake`
  const whyItWorks = [result.tierPicks[0]?.reason[0], result.culture.decorHint].filter(Boolean).join(' ')

  const presentAllergens = result.allergenAudit.filter((a) => a.present)

  async function handleCopyMarkdown() {
    await navigator.clipboard.writeText(toMarkdown(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openStructureDetails() {
    if (structureRef.current) structureRef.current.open = true
    structureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stylingProducts = getProductsByIds(DECORATION_STYLE_PRODUCT_IDS[result.decorationStyle.id] ?? [])
  const presentationProducts = getProductsByIds(WEDDING_PRESENTATION_IDS)
  const cakeInspirationProducts = getProductsByIds(WEDDING_CAKE_PRODUCT_IDS[result.aesthetic.name] ?? [])
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  return (
    <div className="wedding-result-summary ltec-reveal">
      <section className="card wedding-hero">
        {baseCakeProfile && <CakeThumbnail cakeId={baseCakeProfile.id} variant="hero" alt={conceptName} />}
        <p className="tag">Wedding</p>
        <h1 ref={headingRef} tabIndex={-1}>
          {conceptName}
        </h1>
        <p className="wedding-hero-description">{flavorNames.join(' · ')}</p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🍰 Flavor</h2>
        <p>{flavorNames.join(' · ')}</p>
        {fillingLabel && (
          <p className="wedding-hero-description">
            <strong>Filling:</strong> {fillingLabel}
          </p>
        )}
        <p className="wedding-hero-description">
          <strong>Finish:</strong> {finishLabel ?? `Finished in ${result.decorationStyle.name.toLowerCase()}`}.
        </p>
      </section>

      <section className="card wedding-primary-card">
        <h2>🎉 Serving</h2>
        <p className="wedding-concept-title">Serves {guestRange.label}</p>
        <p className="wedding-hero-description">
          {tierSizeLabel} tier{tierCount > 1 ? 's' : ''} — ~{totalServings} servings total capacity.
        </p>
        <div className="wedding-guest-count-editor">
          <span>Guest count (max 50)</span>
          <GuestRangeSelector value={guestRange} onChange={onGuestRangeChange} />
        </div>
      </section>

      <section className="card wedding-primary-card">
        <h2>✨ Why It Works</h2>
        <p>{whyItWorks || 'The best overall flavor match available for this concept.'}</p>
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
        <button className="btn btn-secondary" onClick={onRefine}>
          Refine Design
        </button>
        <button className="btn btn-secondary" onClick={openStructureDetails}>
          Portions &amp; Structure
        </button>
        <Link to="/sommelier" className="btn btn-secondary">
          Sommelier Pairing
        </Link>
        <button className="btn btn-secondary" onClick={handleCopyMarkdown}>
          {copied ? 'Copied!' : 'Copy Plan'}
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          Print
        </button>
        <button className="btn btn-secondary" onClick={() => setShowShare((s) => !s)}>
          Share
        </button>
      </div>

      {showShare && <CelebrateShareCard result={result} />}

      <details className="wedding-details-section">
        <summary>💍 Cultural History &amp; Traditions</summary>
        <div className="wedding-details-content">
          <p>
            <strong>Traditions:</strong> {result.culture.traditions}
          </p>
          <p>
            <strong>Symbolism:</strong> {result.culture.symbolism}
          </p>
          <p>
            <strong>Ritual:</strong> {result.culture.ritual}
          </p>
        </div>
      </details>

      <details className="wedding-details-section" ref={structureRef}>
        <summary>🏰 Portions &amp; Tier Structure</summary>
        <div className="wedding-details-content">
          <p>
            <span className="tag">{formatArchitectureLabel(result.architecturePlan.architecture)}</span>
          </p>
          <p>{result.architecturePlan.architectureReason}</p>
          <ul>
            {result.architecturePlan.tiers.map((tier, i) => (
              <li key={i}>
                <strong>{formatRoleLabel(tier.role)}:</strong> {tier.diameterIn}" — {tier.venueSlices} venue slices (1"×1") / {tier.partySlices} party slices
                (1"×2")
              </li>
            ))}
          </ul>
          <ul>
            {result.architecturePlan.stabilityNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
            {result.architecturePlan.cappedGuestCountWarning && <li className="warning-note">⚠️ {result.architecturePlan.cappedGuestCountWarning}</li>}
          </ul>
          <h3>Caterer cutting guide</h3>
          <ul>
            {result.cuttingGuide.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </details>

      <details className="wedding-details-section">
        <summary>🌤️ Venue &amp; Weather Advice</summary>
        <div className="wedding-details-content">
          <p>
            <strong>Venue type:</strong> {venueType}
          </p>
          <p>
            {result.seasonEntry.name} favors flavors like {result.seasonEntry.flavorAffinityNotes.join(', ')}.
          </p>
          <p className="warning-note">
            <strong>
              {formatFrostingLabel(result.chosenFrosting)} — {result.input.variant}:
            </strong>{' '}
            {result.frostingGuidance}
          </p>
        </div>
      </details>

      {presentAllergens.length > 0 && (
        <details className="wedding-details-section">
          <summary>⚠️ Dietary Notes</summary>
          <div className="wedding-details-content">
            <ul className="allergen-audit">
              {presentAllergens.map((entry) => (
                <li key={entry.allergen} className={`allergen-row allergen-${entry.status}`}>
                  <span className="tag">{ALLERGEN_LABELS[entry.allergen]}</span> {entry.guidance}
                </li>
              ))}
            </ul>
            <p className="allergen-footer">{result.allergenFooterNote}</p>
          </div>
        </details>
      )}

      <details className="wedding-details-section">
        <summary>📖 Recipe / Workshop Guidance</summary>
        <div className="wedding-details-content">
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
        </div>
      </details>

      <details className="wedding-details-section">
        <summary>🎨 Styling &amp; Presentation</summary>
        <div className="wedding-details-content">
          <div className="decoration-diagram-wrap">
            <WeddingCakeDiagram
              tiers={result.architecturePlan.tiers}
              shape={result.input.shape}
              swatchHex={result.aesthetic.swatchHex}
              decorationCategory={result.decorationStyle.category}
              decorationSwatchHex={result.decorationStyle.swatchHex}
            />
          </div>
          <p>
            <span className="tag">{formatShapeLabel(result.input.shape)}</span> <span className="tag">{result.decorationStyle.name}</span>
          </p>
          <p>{result.decorationStyle.description}</p>
          <p>
            <strong>Technique:</strong> {result.decorationStyle.techniqueNotes}
          </p>
          <p className="budget-note">
            Estimated ${result.budgetEstimate.low}–${result.budgetEstimate.high} (${result.budgetEstimate.perServingLow}–$
            {result.budgetEstimate.perServingHigh} per serving). {result.budgetEstimate.note}
          </p>
          {stylingProducts.length > 0 && <AffiliateProductSet title="Curator's Styling Picks" products={stylingProducts} />}
          {presentationProducts.length > 0 && <AffiliateProductSet title="Styling & Presentation" products={presentationProducts} />}
          {cakeInspirationProducts.length > 0 && <AffiliateProductSet title="Cake Inspiration" products={cakeInspirationProducts} />}
        </div>
      </details>
    </div>
  )
}
