import { useEffect, useRef, useState } from 'react'
import type { DietTag } from '../types/cake'
import type { CakeShape, SeasonVariant, WeddingPlanInput, WeddingPlanResult, WeddingSeason } from '../types/weddingCake'
import { weddingCultures, weddingAesthetics, weddingDecorationStyles, weddingFlavorDirections } from '../lib/data'
import { generateWeddingPlan, pickCultureForFlavorDirection } from '../lib/weddingCake'
import { rankDecorationStyles } from '../lib/weddingDecoration'
import { registerBackHandler } from '../lib/backButtonInterceptor'
import { GUEST_RANGES, type GuestRange } from '../lib/guestRanges'
import { GuestRangeSelector } from '../components/GuestRangeSelector'
import { WeddingResultSummary } from '../components/WeddingResultSummary'
import './WeddingJourneyPage.css'

type Step = 'style' | 'event' | 'structure' | 'flavor' | 'result'

const VENUE_TYPES = ['Ballroom', 'Garden / Outdoor', 'Barn', 'Estate', 'Beach'] as const

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

/** Picks readable tile text color against an arbitrary swatch background. */
function tileTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1c1c1c' : '#ffffff'
}

const STEP_ORDER: Step[] = ['style', 'event', 'structure', 'flavor', 'result']

export function WeddingJourneyPage() {
  const [step, setStep] = useState<Step>('style')
  const [aestheticId, setAestheticId] = useState(weddingAesthetics[0].id)
  const [guestRange, setGuestRange] = useState<GuestRange>(GUEST_RANGES[2])
  const [season, setSeason] = useState<WeddingSeason>('summer')
  const [variant, setVariant] = useState<SeasonVariant>('indoor')
  const [venueType, setVenueType] = useState<string>(VENUE_TYPES[0])
  const [shape, setShape] = useState<CakeShape>('round')
  const [decorationStyleId, setDecorationStyleId] = useState(weddingDecorationStyles[0].id)
  const [diet, setDiet] = useState<DietTag | 'none'>('none')
  const [flavorDirectionId, setFlavorDirectionId] = useState<string | 'custom' | null>(null)
  const [customCultureId, setCustomCultureId] = useState(weddingCultures[0].id)
  const [result, setResult] = useState<WeddingPlanResult | null>(null)

  const decorationRanking = rankDecorationStyles(aestheticId)
  const topDecorationScore = decorationRanking[0]?.score
  const recommendedDecorationIds = new Set(decorationRanking.filter((r) => r.score === topDecorationScore).map((r) => r.style.id))

  const stepIndex = STEP_ORDER.indexOf(step)

  // Wizard steps are plain component state, not history entries, so the
  // Android back button has nothing to unwind on its own -- claim it here
  // and step back one screen at a time; only the first step (nothing to
  // step back to) lets the press fall through to real navigation.
  const stepRef = useRef(step)
  stepRef.current = step
  useEffect(
    () =>
      registerBackHandler(() => {
        const currentIndex = STEP_ORDER.indexOf(stepRef.current)
        if (currentIndex <= 0) return false
        setStep(STEP_ORDER[currentIndex - 1])
        return true
      }),
    [],
  )

  function generate(cultureId: string) {
    const input: WeddingPlanInput = {
      occasion: 'wedding',
      cultureId,
      guestCount: guestRange.max,
      season,
      variant,
      aestheticId,
      diet,
      shape,
      decorationStyleId,
    }
    setResult(generateWeddingPlan(input))
    setStep('result')
  }

  function chooseFlavorDirection(id: string) {
    setFlavorDirectionId(id)
    if (id === 'custom') return
    const direction = weddingFlavorDirections.find((d) => d.id === id)
    const cultureId = direction ? pickCultureForFlavorDirection(direction.keywords) : weddingCultures[0].id
    generate(cultureId)
  }

  if (step === 'result' && result) {
    return (
      <main className="page wedding-journey-page">
        <WeddingResultSummary
          result={result}
          venueType={venueType}
          guestRange={guestRange}
          onGuestRangeChange={setGuestRange}
          onRefine={() => setStep('style')}
        />
      </main>
    )
  }

  return (
    <main className="page wedding-journey-page">
      <h1>Wedding Cake Planner</h1>
      <p>A design consultation for your wedding cake — style, structure, and flavor, built specifically for a wedding.</p>
      <p className="wedding-journey-progress">
        Step {stepIndex + 1} of 4
      </p>

      {step === 'style' && (
        <>
          <h2 className="inspiration-heading">What should your wedding cake feel like?</h2>
          <p className="inspiration-subtext">Start with a style — everything after is tailored to it.</p>
          <div className="inspiration-grid">
            {weddingAesthetics.map((a) => (
              <button
                key={a.id}
                className="inspiration-tile"
                style={{ background: a.swatchHex, color: tileTextColor(a.swatchHex) }}
                onClick={() => {
                  setAestheticId(a.id)
                  setStep('event')
                }}
              >
                <span className="inspiration-tile-name">{a.name}</span>
                <span className="inspiration-tile-description">{a.description}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'event' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('style')}>
            ← Change style
          </button>
          <h2 className="inspiration-heading">Tell us about the event</h2>
          <div className="card wedding-form">
            <div className="variant-toggle-wrap">
              <span>Guest count (max 50)</span>
              <GuestRangeSelector value={guestRange} onChange={setGuestRange} />
            </div>

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
              Venue type
              <select value={venueType} onChange={(e) => setVenueType(e.target.value)}>
                {VENUE_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>

            <button className="btn" onClick={() => setStep('structure')}>
              Continue
            </button>
          </div>
        </>
      )}

      {step === 'structure' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('event')}>
            ← Change event details
          </button>
          <h2 className="inspiration-heading">Cake structure</h2>
          <div className="card wedding-form">
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
              Dietary requirements
              <select value={diet} onChange={(e) => setDiet(e.target.value as DietTag | 'none')}>
                {DIET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="btn" onClick={() => setStep('flavor')}>
              Continue
            </button>
          </div>
        </>
      )}

      {step === 'flavor' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('structure')}>
            ← Change structure
          </button>
          <h2 className="inspiration-heading">Flavor direction</h2>
          <p className="inspiration-subtext">Pick the flavor world your cake should live in.</p>
          <div className="inspiration-grid">
            {weddingFlavorDirections.map((d) => (
              <button key={d.id} className="inspiration-tile wedding-flavor-tile" onClick={() => chooseFlavorDirection(d.id)}>
                <span className="inspiration-tile-name">{d.name}</span>
                <span className="inspiration-tile-description">{d.description}</span>
              </button>
            ))}
            <button className="inspiration-tile wedding-flavor-tile" onClick={() => chooseFlavorDirection('custom')}>
              <span className="inspiration-tile-name">Custom</span>
              <span className="inspiration-tile-description">Pick a cultural tradition to draw flavor from directly.</span>
            </button>
          </div>

          {flavorDirectionId === 'custom' && (
            <div className="card wedding-form">
              <label>
                Location / Culture
                <select value={customCultureId} onChange={(e) => setCustomCultureId(e.target.value)}>
                  {weddingCultures.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn" onClick={() => generate(customCultureId)}>
                Generate My Cake
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
