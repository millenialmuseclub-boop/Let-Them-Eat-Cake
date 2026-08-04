import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, drinks } from '../lib/data'
import { explainPairing, rankPairings } from '../lib/sommelier'
import { FlavorProfileCompare } from '../components/FlavorProfileCompare'
import './SommelierPage.css'

export function SommelierPage() {
  const [cakeId, setCakeId] = useState(cakes[0].id)
  const [expandedDrinkId, setExpandedDrinkId] = useState<string | null>(null)
  const cake = cakes.find((c) => c.id === cakeId)!
  const pairings = rankPairings(cake, drinks)

  return (
    <main className="page sommelier-page">
      <h1>Cake Sommelier</h1>
      <p>Pick a cake and see which drinks pair best with it, scored by flavor science.</p>

      <label className="cake-select">
        Cake
        <select
          value={cakeId}
          onChange={(e) => {
            setCakeId(e.target.value)
            setExpandedDrinkId(null)
          }}
        >
          {cakes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="card cake-summary">
        <h3>{cake.name}</h3>
        <p>{cake.description}</p>
        <p className="flavor-notes">Notes: {cake.flavorNotes.join(', ')}</p>
        <Link to={`/cake/${cake.id}`} className="encyclopedia-link">
          View full encyclopedia entry →
        </Link>
      </div>

      <div className="pairing-list">
        {pairings.map((pairing) => {
          const { drink, score, breakdown } = pairing
          const isExpanded = expandedDrinkId === drink.id
          return (
            <div key={drink.id} className="card pairing-card">
              <button className="pairing-row" onClick={() => setExpandedDrinkId(isExpanded ? null : drink.id)}>
                <div className="pairing-score" style={{ background: scoreColor(score) }}>
                  {score}
                </div>
                <div className="pairing-details">
                  <h3>
                    {drink.name} <span className="tag">{drink.category.replace('_', ' ')}</span>
                  </h3>
                  {breakdown.sharedNotes.length > 0 && (
                    <p className="pairing-bridge">Shared notes: {breakdown.sharedNotes.join(', ')}</p>
                  )}
                  {breakdown.cleansingBonus > 0 && <p className="pairing-bridge">Cuts through the richness of this cake</p>}
                </div>
                <span className="pairing-toggle">{isExpanded ? 'Hide details' : 'Show details'}</span>
              </button>

              {isExpanded && (
                <div className="pairing-expanded">
                  <div className="pairing-expanded-section">
                    <h4>Why this pairing works</h4>
                    <ul>
                      {explainPairing(cake, drink, pairing).map((sentence, i) => (
                        <li key={i}>{sentence}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pairing-expanded-section">
                    <h4>Serving guidance</h4>
                    <p>
                      <strong>Temperature:</strong> {drink.serving.temperature}
                    </p>
                    <p>
                      <strong>Glassware:</strong> {drink.serving.glassware}
                    </p>
                    {drink.serving.garnish && (
                      <p>
                        <strong>Garnish:</strong> {drink.serving.garnish}
                      </p>
                    )}
                  </div>

                  <div className="pairing-expanded-section">
                    <h4>Flavor profile comparison</h4>
                    <FlavorProfileCompare cake={cake} drink={drink} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}
