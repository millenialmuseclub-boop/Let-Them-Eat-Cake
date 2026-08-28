import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rankRamenForQuery, explainFindMatch } from '../../lib/ramen/sommelier'
import { getRegionEntryForRamen } from '../../lib/ramen/atlas'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { FlavorProfileBars } from '../../components/ramen/FlavorProfileBars'
import { RamenStateBadges } from '../../components/ramen/RamenStateBadges'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import type { BrothCharacter, FlavorTag, ProteinCategory } from '../../types/ramen/ramen'
import type { FindQuery } from '../../types/ramen/sommelier'
import './SommelierFindPage.css'

// Adapted from Cake's deterministic weighted-scoring architecture (CAKE_REFERENCE_AUDIT.md §7),
// but query-driven rather than cake-first: Ramen FIND has no existing bowl to start from, so the
// "starting point" is a live-updating preference form instead of a search box. Results recompute
// on every control change, same interaction pattern as Build a Bowl's live dropdowns.

const FLAVOR_TAG_OPTIONS: FlavorTag[] = ['savory', 'smoky', 'garlicky', 'seafood-forward', 'fermented', 'sweet-savory', 'umami-heavy']

const PROTEIN_OPTIONS: { value: ProteinCategory | 'flexible'; label: string }[] = [
  { value: 'flexible', label: 'No preference' },
  { value: 'pork', label: 'Pork' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'vegetable', label: 'Vegetable' },
]

export function SommelierFindPage() {
  useDocumentTitle('Find My Ramen | Let Them Eat')

  const [query, setQuery] = useState<FindQuery>({
    richness: 3,
    intensity: 3,
    heat: 1,
    brothCharacter: 'clear',
    flavorPreferences: [],
    proteinPreference: 'flexible',
  })

  function toggleFlavorTag(tag: FlavorTag) {
    setQuery((prev) => ({
      ...prev,
      flavorPreferences: prev.flavorPreferences.includes(tag) ? prev.flavorPreferences.filter((t) => t !== tag) : [...prev.flavorPreferences, tag],
    }))
  }

  const ranked = rankRamenForQuery(query)
  const best = ranked[0]
  const alternatives = ranked.slice(1, 4)

  return (
    <main className="page">
      <h1>Find My Ramen</h1>
      <p>Tell us what you like, and we'll match it against every bowl in the Encyclopedia -- no AI, just a real scored comparison.</p>

      <div className="card find-form">
        <label>
          Richness ({query.richness})
          <input type="range" min={1} max={5} value={query.richness} onChange={(e) => setQuery((p) => ({ ...p, richness: Number(e.target.value) }))} />
        </label>

        <label>
          Intensity ({query.intensity})
          <input type="range" min={1} max={5} value={query.intensity} onChange={(e) => setQuery((p) => ({ ...p, intensity: Number(e.target.value) }))} />
        </label>

        <label>
          Heat ({query.heat})
          <input type="range" min={0} max={5} value={query.heat} onChange={(e) => setQuery((p) => ({ ...p, heat: Number(e.target.value) }))} />
        </label>

        <label>
          Broth character
          <select value={query.brothCharacter} onChange={(e) => setQuery((p) => ({ ...p, brothCharacter: e.target.value as BrothCharacter }))}>
            <option value="clear">Clear</option>
            <option value="creamy">Creamy</option>
          </select>
        </label>

        <label>
          Protein preference
          <select value={query.proteinPreference} onChange={(e) => setQuery((p) => ({ ...p, proteinPreference: e.target.value as ProteinCategory | 'flexible' }))}>
            {PROTEIN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div className="find-flavor-preferences">
          <span id="find-flavor-preferences-label">Flavor preferences</span>
          <div className="find-flavor-tag-row" role="group" aria-labelledby="find-flavor-preferences-label">
            {FLAVOR_TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={query.flavorPreferences.includes(tag) ? 'find-flavor-tag active' : 'find-flavor-tag'}
                onClick={() => toggleFlavorTag(tag)}
                aria-pressed={query.flavorPreferences.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {best && (
        <div aria-live="polite">
          <h2 className="sommelier-section-heading">🥇 Best Match</h2>
          <FindResultCard result={best} highlight />

          {alternatives.length > 0 && (
            <>
              <h2 className="sommelier-section-heading">Also Worth Trying</h2>
              {alternatives.map((r) => (
                <FindResultCard key={r.ramen.id} result={r} />
              ))}
            </>
          )}
        </div>
      )}
    </main>
  )
}

function FindResultCard({ result, highlight }: { result: ReturnType<typeof rankRamenForQuery>[number]; highlight?: boolean }) {
  const { ramen: candidate, score } = result
  const region = getRegionEntryForRamen(candidate.id)
  const reasons = explainFindMatch(candidate, result)

  return (
    <div className={highlight ? 'card find-result-card find-result-card-highlight' : 'card find-result-card'}>
      <div className="find-result-row">
        <RamenThumbnail ramenId={candidate.id} alt={candidate.name} />
        <div className="find-result-score">{score}</div>
        <div className="find-result-details">
          <h3>{candidate.name}</h3>
          {region && <p className="find-result-region">{region.cityMicroRegion}</p>}
          <RamenStateBadges ramenId={candidate.id} />
          <ul>
            {reasons.map((sentence, i) => (
              <li key={i}>{sentence}</li>
            ))}
          </ul>
        </div>
      </div>
      <FlavorProfileBars profile={candidate.flavorProfile} />
      <Link to={`/ramen/ramen/${candidate.id}`} className="encyclopedia-link">
        View full encyclopedia entry →
      </Link>
    </div>
  )
}
