import { useState } from 'react'
import { getBowlComponentsByCategory, computeCompatibility, combineBowlRichness, describeBowl, TIER_LABEL } from '../../lib/ramen/workshop'
import { BowlDiagram } from '../../components/ramen/BowlDiagram'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import type { BowlComponent, BowlComponentCategory, CompatibilityTier } from '../../types/ramen/workshop'
import '../../components/ramen/FlavorProfileBars.css'
import './BuildABowlPage.css'

// Adapted from Cake's Assembly Lab interaction shell -- selectors driving a live illustration
// and summary (CAKE_REFERENCE_AUDIT.md §6) -- but Assembly Lab has no compatibility concept at
// all, so the tier badges/reasons below are new, not ported. Flow order matches master spec §12:
// Broth -> Tare -> Aroma Oil -> Noodles -> Protein -> Vegetables -> Toppings -> Finish.
const STEPS: { category: BowlComponentCategory; label: string }[] = [
  { category: 'broth', label: 'Broth' },
  { category: 'tare', label: 'Tare' },
  { category: 'aromaOil', label: 'Aroma Oil' },
  { category: 'noodle', label: 'Noodles' },
  { category: 'protein', label: 'Protein' },
  { category: 'vegetable', label: 'Vegetable' },
  { category: 'topping', label: 'Topping' },
  { category: 'finish', label: 'Finish' },
]

const OPTIONS_BY_CATEGORY = Object.fromEntries(STEPS.map((s) => [s.category, getBowlComponentsByCategory(s.category)])) as Record<BowlComponentCategory, BowlComponent[]>

function TierTag({ tier }: { tier: CompatibilityTier }) {
  return <span className={`tier-tag tier-tag-${tier}`}>{TIER_LABEL[tier]}</span>
}

export function BuildABowlPage() {
  useDocumentTitle('Build a Bowl | Let Them Eat Ramen')

  const [selectedIds, setSelectedIds] = useState<Record<BowlComponentCategory, string>>(() =>
    Object.fromEntries(STEPS.map((s) => [s.category, OPTIONS_BY_CATEGORY[s.category][0].id])) as Record<BowlComponentCategory, string>,
  )

  const selections = Object.fromEntries(
    STEPS.map((s) => [s.category, OPTIONS_BY_CATEGORY[s.category].find((c) => c.id === selectedIds[s.category])!]),
  ) as Record<BowlComponentCategory, BowlComponent>

  const brothPairs: { label: string; category: BowlComponentCategory }[] = [
    { label: 'Tare & Broth', category: 'tare' },
    { label: 'Aroma Oil & Broth', category: 'aromaOil' },
    { label: 'Noodles & Broth', category: 'noodle' },
    { label: 'Topping & Broth', category: 'topping' },
  ]

  const richness = combineBowlRichness(Object.values(selections))
  const description = describeBowl(selections)

  return (
    <main className="page build-a-bowl-page">
      <h1>Build a Bowl</h1>
      <p>Choose a broth, tare, and the rest of the bowl's components -- we'll flag how traditional each pairing is as you go.</p>

      <div className="card build-a-bowl-form">
        {STEPS.map((step) => (
          <label key={step.category}>
            {step.label}
            <select
              value={selectedIds[step.category]}
              onChange={(e) => setSelectedIds((prev) => ({ ...prev, [step.category]: e.target.value }))}
            >
              {OPTIONS_BY_CATEGORY[step.category].map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="build-a-bowl-preview">
        <div className="card build-a-bowl-illustration-card">
          <BowlDiagram selections={selections} />
        </div>

        <div className="card build-a-bowl-summary-card">
          <p className="build-a-bowl-description">{description}</p>
          <div className="build-a-bowl-richness">
            <span>Overall richness</span>
            <div className="flavor-profile-track">
              <div className="flavor-profile-fill" style={{ width: `${(richness / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <h2>Compatibility</h2>
      <p className="build-a-bowl-compatibility-note">How each component pairs against your chosen broth.</p>
      <div className="build-a-bowl-compatibility-grid">
        {brothPairs.map(({ label, category }) => {
          const result = computeCompatibility(selections.broth, selections[category])
          return (
            <div key={category} className="card build-a-bowl-compatibility-card">
              <div className="build-a-bowl-compatibility-header">
                <h3>{label}</h3>
                <TierTag tier={result.tier} />
              </div>
              <p>{result.reason}</p>
            </div>
          )
        })}
      </div>
    </main>
  )
}
