import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, drinks } from '../lib/data'
import { explainPairing, rankCakesForDrink, rankPairings } from '../lib/sommelier'
import { getLifestylePairing } from '../lib/lifestylePairings'
import { DualFlavorRadarChart } from '../components/DualFlavorRadarChart'
import type { DrinkCategory } from '../types/sommelier'
import './SommelierPage.css'

type Mode = 'cake-first' | 'drink-first'

export function SommelierPage() {
  const [mode, setMode] = useState<Mode>('cake-first')
  const [cakeId, setCakeId] = useState(cakes[0].id)
  const [drinkId, setDrinkId] = useState(drinks[0].id)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setExpandedId(null)
  }

  return (
    <main className="page sommelier-page">
      <h1>Cake Sommelier</h1>
      <p>Pick a cake to find its best drink pairings, or start from a drink to find the cakes that match it — all scored by flavor science.</p>

      <div className="mode-toggle">
        <button className={mode === 'cake-first' ? 'active' : ''} onClick={() => switchMode('cake-first')}>
          Start from a cake
        </button>
        <button className={mode === 'drink-first' ? 'active' : ''} onClick={() => switchMode('drink-first')}>
          Start from a drink
        </button>
      </div>

      {mode === 'cake-first' ? (
        <CakeFirstView cakeId={cakeId} setCakeId={setCakeId} expandedId={expandedId} setExpandedId={setExpandedId} />
      ) : (
        <DrinkFirstView drinkId={drinkId} setDrinkId={setDrinkId} expandedId={expandedId} setExpandedId={setExpandedId} />
      )}
    </main>
  )
}

function CakeFirstView({
  cakeId,
  setCakeId,
  expandedId,
  setExpandedId,
}: {
  cakeId: string
  setCakeId: (id: string) => void
  expandedId: string | null
  setExpandedId: (id: string | null) => void
}) {
  const cake = cakes.find((c) => c.id === cakeId)!
  const pairings = rankPairings(cake, drinks)

  return (
    <>
      <label className="cake-select">
        Cake
        <select
          value={cakeId}
          onChange={(e) => {
            setCakeId(e.target.value)
            setExpandedId(null)
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
          const isExpanded = expandedId === drink.id
          return (
            <div key={drink.id} className="card pairing-card">
              <button className="pairing-row" onClick={() => setExpandedId(isExpanded ? null : drink.id)}>
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
                    <p>
                      <strong>Prep tip:</strong> {drink.serving.prepTip}
                    </p>
                  </div>

                  <div className="pairing-expanded-section">
                    <h4>Flavor profile comparison</h4>
                    <DualFlavorRadarChart cakeProfile={cake.flavorProfile} drinkProfile={drink.flavorProfile} cakeLabel={cake.name} drinkLabel={drink.name} score={score} />
                  </div>

                  <LifestyleSection category={drink.category} />
                  <CopyPairingButton cakeName={cake.name} drinkName={drink.name} score={score} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function DrinkFirstView({
  drinkId,
  setDrinkId,
  expandedId,
  setExpandedId,
}: {
  drinkId: string
  setDrinkId: (id: string) => void
  expandedId: string | null
  setExpandedId: (id: string | null) => void
}) {
  const drink = drinks.find((d) => d.id === drinkId)!
  const matches = rankCakesForDrink(drink, cakes)

  return (
    <>
      <label className="cake-select">
        Drink
        <select
          value={drinkId}
          onChange={(e) => {
            setDrinkId(e.target.value)
            setExpandedId(null)
          }}
        >
          {drinks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <div className="card cake-summary">
        <h3>
          {drink.name} <span className="tag">{drink.category.replace('_', ' ')}</span>
        </h3>
        <p className="flavor-notes">Notes: {drink.flavorNotes.join(', ')}</p>
        <div className="drink-serving-guidance">
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
          <p>
            <strong>Prep tip:</strong> {drink.serving.prepTip}
          </p>
        </div>
      </div>

      <div className="pairing-list">
        {matches.map((match) => {
          const { cake, score, breakdown } = match
          const isExpanded = expandedId === cake.id
          return (
            <div key={cake.id} className="card pairing-card">
              <button className="pairing-row" onClick={() => setExpandedId(isExpanded ? null : cake.id)}>
                <div className="pairing-score" style={{ background: scoreColor(score) }}>
                  {score}
                </div>
                <div className="pairing-details">
                  <h3>{cake.name}</h3>
                  {breakdown.sharedNotes.length > 0 && (
                    <p className="pairing-bridge">Shared notes: {breakdown.sharedNotes.join(', ')}</p>
                  )}
                  {breakdown.cleansingBonus > 0 && <p className="pairing-bridge">This drink cuts through the richness of this cake</p>}
                </div>
                <span className="pairing-toggle">{isExpanded ? 'Hide details' : 'Show details'}</span>
              </button>

              {isExpanded && (
                <div className="pairing-expanded">
                  <div className="pairing-expanded-section">
                    <h4>Why this pairing works</h4>
                    <ul>
                      {explainPairing(cake, drink, match).map((sentence, i) => (
                        <li key={i}>{sentence}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pairing-expanded-section">
                    <h4>Flavor profile comparison</h4>
                    <DualFlavorRadarChart cakeProfile={cake.flavorProfile} drinkProfile={drink.flavorProfile} cakeLabel={cake.name} drinkLabel={drink.name} score={score} />
                  </div>

                  <LifestyleSection category={drink.category} />
                  <CopyPairingButton cakeName={cake.name} drinkName={drink.name} score={score} />

                  <Link to={`/cake/${cake.id}`} className="encyclopedia-link">
                    View full encyclopedia entry →
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function LifestyleSection({ category }: { category: DrinkCategory }) {
  const lifestyle = getLifestylePairing(category)
  if (!lifestyle) return null

  return (
    <div className="pairing-expanded-section">
      <h4>🎉 Complete the Celebration</h4>
      <p>
        <strong>Flowers:</strong> {lifestyle.flowers}
      </p>
      <p>
        <strong>Table styling:</strong> {lifestyle.tableStyle}
      </p>
      <p>
        <strong>Music:</strong> {lifestyle.music}
      </p>
      <p>
        <strong>Best for:</strong> {lifestyle.occasion}
      </p>
    </div>
  )
}

function CopyPairingButton({ cakeName, drinkName, score }: { cakeName: string; drinkName: string; score: number }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `${cakeName} + ${drinkName} — a ${score}/100 pairing 🍰🥂 #LetThemEatCake ${typeof window !== 'undefined' ? window.location.href : ''}`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className="btn btn-secondary pairing-copy-button" onClick={handleCopy}>
      {copied ? 'Copied!' : '📣 Copy this pairing'}
    </button>
  )
}

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}
