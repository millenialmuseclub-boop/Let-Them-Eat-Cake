import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rankRamenForQuery, explainFindMatch } from '../../lib/ramen/sommelier'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import type { BrothCharacter } from '../../types/ramen/ramen'
import type { FindQuery } from '../../types/ramen/sommelier'
import './FindYourBowlPage.css'

// Reuses Sommelier FIND's scoring engine (lib/sommelier.ts) rather than a second recommendation
// system, per master spec §23 -- but with a shorter, tap-to-pick 3-question flow instead of
// Sommelier's sliders/multi-select, and a single result instead of best-match-plus-alternatives.
// Richness/heat "tiers" map to representative numeric values; intensity is coupled to richness
// (a simplifying assumption for this lighter flow, not a new scoring dimension) and flavor
// preferences/protein are left at their neutral defaults since this flow doesn't ask about them.

type RichnessTier = 'light' | 'medium' | 'rich'
type HeatTier = 'mild' | 'medium' | 'spicy'

const RICHNESS_VALUES: Record<RichnessTier, number> = { light: 1, medium: 3, rich: 5 }
const HEAT_VALUES: Record<HeatTier, number> = { mild: 0, medium: 2, spicy: 4 }

export function FindYourBowlPage() {
  useDocumentTitle('Find Your Bowl | Let Them Eat Ramen')

  const [richness, setRichness] = useState<RichnessTier>('medium')
  const [brothCharacter, setBrothCharacter] = useState<BrothCharacter>('clear')
  const [heat, setHeat] = useState<HeatTier>('mild')

  const query: FindQuery = {
    richness: RICHNESS_VALUES[richness],
    intensity: RICHNESS_VALUES[richness],
    heat: HEAT_VALUES[heat],
    brothCharacter,
    flavorPreferences: [],
    proteinPreference: 'flexible',
  }

  const best = rankRamenForQuery(query)[0]
  const reason = explainFindMatch(best.ramen, best)[0]

  return (
    <main className="page">
      <h1>Find Your Bowl</h1>
      <p>Three quick questions, one bowl -- for the full scored comparison with alternatives, try Sommelier FIND instead.</p>

      <div className="card find-your-bowl-form">
        <div className="find-your-bowl-question">
          <span id="fyb-richness-label">How rich do you like it?</span>
          <div className="find-your-bowl-options" role="group" aria-labelledby="fyb-richness-label">
            {(['light', 'medium', 'rich'] as const).map((tier) => (
              <button key={tier} className={richness === tier ? 'find-your-bowl-option active' : 'find-your-bowl-option'} onClick={() => setRichness(tier)} aria-pressed={richness === tier}>
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="find-your-bowl-question">
          <span id="fyb-broth-label">Clear or creamy broth?</span>
          <div className="find-your-bowl-options" role="group" aria-labelledby="fyb-broth-label">
            {(['clear', 'creamy'] as const).map((option) => (
              <button
                key={option}
                className={brothCharacter === option ? 'find-your-bowl-option active' : 'find-your-bowl-option'}
                onClick={() => setBrothCharacter(option)}
                aria-pressed={brothCharacter === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="find-your-bowl-question">
          <span id="fyb-heat-label">How much heat?</span>
          <div className="find-your-bowl-options" role="group" aria-labelledby="fyb-heat-label">
            {(['mild', 'medium', 'spicy'] as const).map((tier) => (
              <button key={tier} className={heat === tier ? 'find-your-bowl-option active' : 'find-your-bowl-option'} onClick={() => setHeat(tier)} aria-pressed={heat === tier}>
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card find-your-bowl-result" aria-live="polite">
        <RamenThumbnail ramenId={best.ramen.id} variant="hero" alt={best.ramen.name} />
        <h2>{best.ramen.name}</h2>
        <p>{reason}</p>
        <Link to={`/ramen/ramen/${best.ramen.id}`} className="encyclopedia-link">
          View full encyclopedia entry →
        </Link>
      </div>
    </main>
  )
}
