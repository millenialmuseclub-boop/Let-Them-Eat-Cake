import { useEffect, useRef, useState } from 'react'
import type { DietTag } from '../types/cake'
import { birthdayEnergies, birthdayFlavors } from '../lib/data'
import { pickBirthdayCake } from '../lib/birthdayMatch'
import { registerBackHandler } from '../lib/backButtonInterceptor'
import { GUEST_RANGES, type GuestRange } from '../lib/guestRanges'
import { GuestRangeSelector } from '../components/GuestRangeSelector'
import { BirthdayResultSummary } from '../components/BirthdayResultSummary'
import { InspirationTile } from '../components/InspirationTile'
import { getRepCakeForKeywords } from '../lib/images'
import { getSceneImage } from '../lib/sceneImages'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { hapticSuccess } from '../lib/haptics'
import '../styles/celebrateSteps.css'
import './BirthdayJourneyPage.css'

/** Editorial scene photo per energy's mood tag, and a genuinely-matched photographed
    cake per flavor -- both computed once since the option lists and catalog are static. */
const ENERGY_SCENE: Partial<Record<string, string>> = Object.fromEntries(
  birthdayEnergies.map((e) => [e.id, getSceneImage(`mood-${e.mood}`)?.url]),
)
const FLAVOR_REP_CAKE: Partial<Record<string, string>> = Object.fromEntries(
  birthdayFlavors.map((f) => [f.id, getRepCakeForKeywords(f.keywords)]),
)

type Step = 'who' | 'energy' | 'flavor' | 'details' | 'result'

const WHO_OPTIONS = ['Me', 'Adult', 'Child', 'Teen', 'Milestone Birthday'] as const

const WHO_SCENE: Record<(typeof WHO_OPTIONS)[number], string | undefined> = {
  Me: getSceneImage('birthday-who-me')?.url,
  Adult: getSceneImage('birthday-who-adult')?.url,
  Child: getSceneImage('birthday-who-child')?.url,
  Teen: getSceneImage('birthday-who-teen')?.url,
  'Milestone Birthday': getSceneImage('birthday-who-milestone')?.url,
}

const DIET_OPTIONS: { value: DietTag | 'none'; label: string }[] = [
  { value: 'none', label: 'No constraint' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
  { value: 'egg-free', label: 'Egg-free' },
  { value: 'nut-free', label: 'Nut-free' },
]

const STEP_ORDER: Step[] = ['who', 'energy', 'flavor', 'details', 'result']

export function BirthdayJourneyPage() {
  useDocumentTitle('Birthday Cake Planner | Let Them Eat Cake')

  const [step, setStep] = useState<Step>('who')
  const [who, setWho] = useState<string>(WHO_OPTIONS[0])
  const [energyId, setEnergyId] = useState(birthdayEnergies[0].id)
  const [flavorId, setFlavorId] = useState(birthdayFlavors[0].id)
  const [guestRange, setGuestRange] = useState<GuestRange>(GUEST_RANGES[1])
  const [age, setAge] = useState('')
  const [theme, setTheme] = useState('')
  const [color, setColor] = useState('')
  const [diet, setDiet] = useState<DietTag | 'none'>('none')
  const [cakeId, setCakeId] = useState<string | null>(null)

  const stepIndex = STEP_ORDER.indexOf(step)
  const energy = birthdayEnergies.find((e) => e.id === energyId)!
  const flavor = birthdayFlavors.find((f) => f.id === flavorId)!

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

  function generate() {
    const cake = pickBirthdayCake(flavor.keywords, energy.texture, energy.mood)
    setCakeId(cake.id)
    setStep('result')
    hapticSuccess()
  }

  if (step === 'result' && cakeId) {
    return (
      <main className="page birthday-journey-page">
        <BirthdayResultSummary
          cakeId={cakeId}
          who={who}
          energyName={energy.name}
          flavorName={flavor.name}
          guestRange={guestRange}
          onGuestRangeChange={setGuestRange}
          diet={diet}
          theme={theme}
          onRefine={() => setStep('who')}
        />
      </main>
    )
  }

  return (
    <main className="page birthday-journey-page">
      <h1>Birthday Cake Planner</h1>
      <p>A personal, playful cake-planning experience — built for the birthday, not a full event plan.</p>
      <p className="birthday-journey-progress" role="status" aria-live="polite">
        Step {stepIndex + 1} of 4
      </p>

      {step === 'who' && (
        <div className="ltec-reveal">
          <h2 className="inspiration-heading">Who's celebrating?</h2>
          <div className="inspiration-grid">
            {WHO_OPTIONS.map((opt) => (
              <InspirationTile
                key={opt}
                className="birthday-tile"
                name={opt}
                imageUrl={WHO_SCENE[opt]}
                onClick={() => {
                  setWho(opt)
                  setStep('energy')
                }}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'energy' && (
        <div className="ltec-reveal">
          <button className="inspiration-change-link" onClick={() => setStep('who')}>
            ← Change who
          </button>
          <h2 className="inspiration-heading">What kind of birthday are we creating?</h2>
          <div className="inspiration-grid">
            {birthdayEnergies.map((e) => (
              <InspirationTile
                key={e.id}
                className="birthday-tile"
                name={e.name}
                description={e.description}
                imageUrl={ENERGY_SCENE[e.id]}
                onClick={() => {
                  setEnergyId(e.id)
                  setStep('flavor')
                }}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'flavor' && (
        <div className="ltec-reveal">
          <button className="inspiration-change-link" onClick={() => setStep('energy')}>
            ← Change energy
          </button>
          <h2 className="inspiration-heading">What will make them happiest?</h2>
          <div className="inspiration-grid">
            {birthdayFlavors.map((f) => (
              <InspirationTile
                key={f.id}
                className="birthday-tile"
                name={f.name}
                description={f.description}
                cakeId={FLAVOR_REP_CAKE[f.id]}
                onClick={() => {
                  setFlavorId(f.id)
                  setStep('details')
                }}
              />
            ))}
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className="ltec-reveal">
          <button className="inspiration-change-link" onClick={() => setStep('flavor')}>
            ← Change flavor
          </button>
          <h2 className="inspiration-heading">A few practical details</h2>
          <div className="card wedding-form">
            <div className="variant-toggle-wrap">
              <span>Guest count (max 50)</span>
              <GuestRangeSelector value={guestRange} onChange={setGuestRange} />
            </div>
            <label>
              Age / milestone (optional)
              <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. Turning 30" />
            </label>
            <label>
              Theme (optional)
              <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. Dinosaurs" />
            </label>
            <label>
              Color (optional)
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Pastel pink" />
            </label>
            <label>
              Dietary needs
              <select value={diet} onChange={(e) => setDiet(e.target.value as DietTag | 'none')}>
                {DIET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn" onClick={generate}>
              Create My Birthday Cake
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
