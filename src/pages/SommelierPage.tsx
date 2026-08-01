import { useState } from 'react'
import { cakes, drinks } from '../lib/data'
import { rankPairings } from '../lib/sommelier'
import './SommelierPage.css'

export function SommelierPage() {
  const [cakeId, setCakeId] = useState(cakes[0].id)
  const cake = cakes.find((c) => c.id === cakeId)!
  const pairings = rankPairings(cake, drinks)

  return (
    <main className="page sommelier-page">
      <h1>Cake Sommelier</h1>
      <p>Pick a cake and see which drinks pair best with it, scored by flavor science.</p>

      <label className="cake-select">
        Cake
        <select value={cakeId} onChange={(e) => setCakeId(e.target.value)}>
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
      </div>

      <div className="pairing-list">
        {pairings.map(({ drink, score, breakdown }) => (
          <div key={drink.id} className="card pairing-row">
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
          </div>
        ))}
      </div>
    </main>
  )
}

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}
