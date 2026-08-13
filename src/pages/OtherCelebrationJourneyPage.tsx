import { useEffect, useRef, useState } from 'react'
import type { DietTag } from '../types/cake'
import { otherCelebrationOccasions, otherCelebrationMoods, birthdayFlavors } from '../lib/data'
import { pickBirthdayCake } from '../lib/birthdayMatch'
import { registerBackHandler } from '../lib/backButtonInterceptor'
import { GUEST_RANGES, type GuestRange } from '../lib/guestRanges'
import { GuestRangeSelector } from '../components/GuestRangeSelector'
import { OtherCelebrationResultSummary } from '../components/OtherCelebrationResultSummary'
import './OtherCelebrationJourneyPage.css'

type Step = 'occasion' | 'mood' | 'flavor' | 'details' | 'result'

const DIET_OPTIONS: { value: DietTag | 'none'; label: string }[] = [
  { value: 'none', label: 'No constraint' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'egg-free', label: 'Egg-free' },
  { value: 'nut-free', label: 'Nut-free' },
]

const STEP_ORDER: Step[] = ['occasion', 'mood', 'flavor', 'details', 'result']

export function OtherCelebrationJourneyPage() {
  const [step, setStep] = useState<Step>('occasion')
  const [occasionId, setOccasionId] = useState(otherCelebrationOccasions[0].id)
  const [moodId, setMoodId] = useState(otherCelebrationMoods[0].id)
  const [flavorIds, setFlavorIds] = useState<string[]>([])
  const [guestRange, setGuestRange] = useState<GuestRange>(GUEST_RANGES[1])
  const [diet, setDiet] = useState<DietTag | 'none'>('none')
  const [cakeId, setCakeId] = useState<string | null>(null)

  const stepIndex = STEP_ORDER.indexOf(step)
  const occasion = otherCelebrationOccasions.find((o) => o.id === occasionId)!
  const mood = otherCelebrationMoods.find((m) => m.id === moodId)!
  const selectedFlavors = birthdayFlavors.filter((f) => flavorIds.includes(f.id))

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

  function toggleFlavor(id: string) {
    setFlavorIds((prev) => {
      if (prev.includes(id)) return prev.filter((f) => f !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  function generate() {
    const keywords = selectedFlavors.flatMap((f) => f.keywords)
    const cake = pickBirthdayCake(keywords, mood.texture, mood.mood)
    setCakeId(cake.id)
    setStep('result')
  }

  if (step === 'result' && cakeId) {
    return (
      <main className="page other-celebration-journey-page">
        <OtherCelebrationResultSummary
          cakeId={cakeId}
          occasionName={occasion.name}
          moodName={mood.name}
          flavorNames={selectedFlavors.map((f) => f.name)}
          guestRange={guestRange}
          onGuestRangeChange={setGuestRange}
          diet={diet}
          onRefine={() => setStep('occasion')}
        />
      </main>
    )
  }

  return (
    <main className="page other-celebration-journey-page">
      <h1>Other Celebrations</h1>
      <p>A lighter, faster planning experience for anniversaries, showers, graduations, and more.</p>
      <p className="other-celebration-progress">Step {stepIndex + 1} of 4</p>

      {step === 'occasion' && (
        <>
          <h2 className="inspiration-heading">What are you celebrating?</h2>
          <div className="inspiration-grid">
            {otherCelebrationOccasions.map((o) => (
              <button
                key={o.id}
                className="inspiration-tile birthday-tile"
                onClick={() => {
                  setOccasionId(o.id)
                  setStep('mood')
                }}
              >
                <span className="inspiration-tile-name">{o.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'mood' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('occasion')}>
            ← Change occasion
          </button>
          <h2 className="inspiration-heading">Mood</h2>
          <div className="inspiration-grid">
            {otherCelebrationMoods.map((m) => (
              <button
                key={m.id}
                className="inspiration-tile birthday-tile"
                onClick={() => {
                  setMoodId(m.id)
                  setStep('flavor')
                }}
              >
                <span className="inspiration-tile-name">{m.name}</span>
                <span className="inspiration-tile-description">{m.description}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'flavor' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('mood')}>
            ← Change mood
          </button>
          <h2 className="inspiration-heading">Flavor</h2>
          <p className="inspiration-subtext">Choose 1-2 flavor directions.</p>
          <div className="inspiration-grid">
            {birthdayFlavors.map((f) => (
              <button
                key={f.id}
                className={flavorIds.includes(f.id) ? 'inspiration-tile birthday-tile active' : 'inspiration-tile birthday-tile'}
                onClick={() => toggleFlavor(f.id)}
              >
                <span className="inspiration-tile-name">{f.name}</span>
                <span className="inspiration-tile-description">{f.description}</span>
              </button>
            ))}
          </div>
          <button className="btn" disabled={flavorIds.length === 0} onClick={() => setStep('details')}>
            Continue
          </button>
        </>
      )}

      {step === 'details' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('flavor')}>
            ← Change flavor
          </button>
          <h2 className="inspiration-heading">A couple of details</h2>
          <div className="card wedding-form">
            <div className="variant-toggle-wrap">
              <span>Guest count (max 50)</span>
              <GuestRangeSelector value={guestRange} onChange={setGuestRange} />
            </div>
            <label>
              Dietary needs (optional)
              <select value={diet} onChange={(e) => setDiet(e.target.value as DietTag | 'none')}>
                {DIET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn" onClick={generate}>
              Create My Cake
            </button>
          </div>
        </>
      )}
    </main>
  )
}
