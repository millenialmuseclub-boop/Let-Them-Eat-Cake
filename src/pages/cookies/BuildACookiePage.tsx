import { useState } from 'react'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { DOUGH_COMPONENTS } from '../../lib/cookies/data'
import { checkCompatibility } from '../../lib/cookies/workshop'
import { CookieHeroImage } from '../../components/cookies/CookieHeroImage'
import type { DoughComponentCategory, CompatibilityTier } from '../../types/cookies/workshop'

const STAGES: { category: DoughComponentCategory; label: string }[] = [
  { category: 'family', label: 'Cookie / Dough Family' },
  { category: 'flour', label: 'Flour' },
  { category: 'fat', label: 'Fat' },
  { category: 'sugar', label: 'Sugar' },
  { category: 'leavening', label: 'Leavening' },
  { category: 'flavor', label: 'Flavor' },
  { category: 'mixIn', label: 'Mix-ins' },
  { category: 'filling', label: 'Filling' },
  { category: 'finish', label: 'Finish' },
]

const TIER_LABEL: Record<CompatibilityTier, string> = {
  traditional: 'Traditional',
  compatible: 'Compatible',
  experimental: 'Experimental',
  discouraged: 'Discouraged',
}

export function BuildACookiePage() {
  useDocumentTitle('Build a Cookie')
  const [selections, setSelections] = useState<Record<string, string>>({})

  const selectedIds = Object.values(selections)
  const pairResults = selectedIds.flatMap((a, i) =>
    selectedIds.slice(i + 1).map((b) => ({ a, b, result: checkCompatibility(a, b) }))
  )

  return (
    <main className="page-container build-a-cookie-page">
      <CookieHeroImage cookieId="cookie_snickerdoodle" name="Build a Cookie" />
      <h1>Build a Cookie</h1>
      <p>
        Pick a component for each stage and see how the combination reads -- traditional, compatible,
        experimental, or discouraged. This isn't a claim that every combination bakes equally well.
      </p>

      {STAGES.map((stage) => {
        const options = DOUGH_COMPONENTS.filter((c) => c.category === stage.category)
        if (options.length === 0) return null
        return (
          <div className="build-a-cookie-stage" key={stage.category}>
            <h2>{stage.label}</h2>
            <div className="lab-variable-choices" role="group" aria-label={stage.label}>
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="lab-variable-choice"
                  aria-pressed={selections[stage.category] === option.id}
                  onClick={() =>
                    setSelections((prev) => ({
                      ...prev,
                      [stage.category]: prev[stage.category] === option.id ? '' : option.id,
                    }))
                  }
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {pairResults.length > 0 && (
        <section className="build-a-cookie-results" aria-live="polite">
          <h2>How These Work Together</h2>
          <ul>
            {pairResults.map(({ a, b, result }) => (
              <li key={`${a}-${b}`}>
                <span className={`tier-tag tier-tag-${result.tier}`}>{TIER_LABEL[result.tier]}</span> {result.reason}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
