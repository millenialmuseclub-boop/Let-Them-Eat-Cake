import { useState } from 'react'
import type { DietTag } from '../types/cake'
import { birthdayEnergies, birthdayFlavors } from '../lib/data'
import { pickBirthdayCake } from '../lib/birthdayMatch'
import { BirthdayResultSummary } from '../components/BirthdayResultSummary'
import './BirthdayJourneyPage.css'

type Step = 'who' | 'energy' | 'flavor' | 'details' | 'result'

const WHO_OPTIONS = ['Me', 'Adult', 'Child', 'Teen', 'Milestone Birthday'] as const

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
  const [step, setStep] = useState<Step>('who')
  const [who, setWho] = useState<string>(WHO_OPTIONS[0])
  const [energyId, setEnergyId] = useState(birthdayEnergies[0].id)
  const [flavorId, setFlavorId] = useState(birthdayFlavors[0].id)
  const [guestCount, setGuestCount] = useState(12)
  const [age, setAge] = useState('')
  const [theme, setTheme] = useState('')
  const [color, setColor] = useState('')
  const [diet, setDiet] = useState<DietTag | 'none'>('none')
  const [cakeId, setCakeId] = useState<string | null>(null)

  const stepIndex = STEP_ORDER.indexOf(step)
  const energy = birthdayEnergies.find((e) => e.id === energyId)!
  const flavor = birthdayFlavors.find((f) => f.id === flavorId)!

  function generate() {
    const cake = pickBirthdayCake(flavor.keywords, energy.texture, energy.mood)
    setCakeId(cake.id)
    setStep('result')
  }

  if (step === 'result' && cakeId) {
    return (
      <main className="page birthday-journey-page">
        <BirthdayResultSummary
          cakeId={cakeId}
          who={who}
          energyName={energy.name}
          flavorName={flavor.name}
          guestCount={guestCount}
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
      <p className="birthday-journey-progress">Step {stepIndex + 1} of 4</p>

      {step === 'who' && (
        <>
          <h2 className="inspiration-heading">Who's celebrating?</h2>
          <div className="inspiration-grid">
            {WHO_OPTIONS.map((opt) => (
              <button
                key={opt}
                className="inspiration-tile birthday-tile"
                onClick={() => {
                  setWho(opt)
                  setStep('energy')
                }}
              >
                <span className="inspiration-tile-name">{opt}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'energy' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('who')}>
            ← Change who
          </button>
          <h2 className="inspiration-heading">What kind of birthday are we creating?</h2>
          <div className="inspiration-grid">
            {birthdayEnergies.map((e) => (
              <button
                key={e.id}
                className="inspiration-tile birthday-tile"
                onClick={() => {
                  setEnergyId(e.id)
                  setStep('flavor')
                }}
              >
                <span className="inspiration-tile-name">{e.name}</span>
                <span className="inspiration-tile-description">{e.description}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'flavor' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('energy')}>
            ← Change energy
          </button>
          <h2 className="inspiration-heading">What will make them happiest?</h2>
          <div className="inspiration-grid">
            {birthdayFlavors.map((f) => (
              <button
                key={f.id}
                className="inspiration-tile birthday-tile"
                onClick={() => {
                  setFlavorId(f.id)
                  setStep('details')
                }}
              >
                <span className="inspiration-tile-name">{f.name}</span>
                <span className="inspiration-tile-description">{f.description}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'details' && (
        <>
          <button className="inspiration-change-link" onClick={() => setStep('flavor')}>
            ← Change flavor
          </button>
          <h2 className="inspiration-heading">A few practical details</h2>
          <div className="card wedding-form">
            <label>
              Guest count
              <input
                type="number"
                min={1}
                max={200}
                value={guestCount}
                onChange={(e) => setGuestCount(Math.min(200, Math.max(1, Number(e.target.value) || 1)))}
              />
            </label>
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
        </>
      )}
    </main>
  )
}
