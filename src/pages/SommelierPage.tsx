import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, drinks } from '../lib/data'
import { explainPairing, rankCakesForDrink, rankPairings } from '../lib/sommelier'
import { getLifestylePairing } from '../lib/lifestylePairings'
import { getRegionEntriesForCake, getDecadeForCake } from '../lib/encyclopedia'
import { PairingComparisonCard } from '../components/PairingComparisonCard'
import { DrinkImage } from '../components/DrinkImage'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { AffiliateProductSet } from '../components/AffiliateProductSet'
import { SommelierShareCard } from '../components/SommelierShareCard'
import { getProductsForPairingCategory } from '../lib/affiliateProducts'
import type { DrinkCategory } from '../types/sommelier'
import './SommelierPage.css'

type Mode = 'cake-first' | 'drink-first'

const DRINK_GROUPS: { id: string; label: string; categories: DrinkCategory[] }[] = [
  { id: 'wine-champagne', label: 'Wine & Champagne', categories: ['wine', 'port', 'champagne'] },
  { id: 'coffee', label: 'Coffee', categories: ['coffee'] },
  { id: 'tea', label: 'Tea', categories: ['tea'] },
  { id: 'spirits-beer', label: 'Spirits & Beer', categories: ['spirits', 'beer'] },
  { id: 'cocktails', label: 'Cocktails', categories: ['cocktails'] },
  { id: 'non-alcoholic', label: 'Non-Alcoholic', categories: ['non_alcoholic'] },
]

export function SommelierPage() {
  const [mode, setMode] = useState<Mode>('cake-first')
  const [modeChosen, setModeChosen] = useState(false)
  const [cakeId, setCakeId] = useState(cakes[0].id)
  const [drinkId, setDrinkId] = useState(drinks[0].id)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setExpandedId(null)
  }

  function chooseMode(next: Mode) {
    setMode(next)
    setModeChosen(true)
  }

  return (
    <main className="page sommelier-page">
      <h1>Cake Sommelier</h1>
      <p>Pick a cake to find its best drink pairings, or start from a drink to find the cakes that match it — all scored by flavor science.</p>

      {!modeChosen ? (
        <div className="sommelier-landing-grid">
          <button className="hub-photo-card" onClick={() => chooseMode('cake-first')}>
            <CakeHeroImage cakeId="cake_pavlova" variant="hero" alt="Pair by Cake" />
            <div className="hub-photo-card-content">
              <h2>Pair by Cake</h2>
              <p>Choose a cake and discover what belongs beside it.</p>
              <span className="btn hub-photo-card-cta">Start With Cake →</span>
            </div>
          </button>
          <button className="hub-photo-card" onClick={() => chooseMode('drink-first')}>
            <DrinkImage drinkId="drink_espresso" variant="hero" alt="Pair by Drink" />
            <div className="hub-photo-card-content">
              <h2>Pair by Drink</h2>
              <p>Choose your drink and discover its perfect cakes.</p>
              <span className="btn hub-photo-card-cta">Start With Drink →</span>
            </div>
          </button>
        </div>
      ) : (
        <>
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
        </>
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
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)

  function renderPairingCard(pairing: ReturnType<typeof rankPairings>[number]) {
    const { drink, score, breakdown } = pairing
    const isExpanded = expandedId === drink.id
    return (
      <div key={drink.id} className="card pairing-card">
        <button className="pairing-row" onClick={() => setExpandedId(isExpanded ? null : drink.id)}>
          <DrinkImage drinkId={drink.id} variant="thumbnail" alt={drink.name} />
          <div className="pairing-score" style={{ background: scoreColor(score) }}>
            {score}
          </div>
          <div className="pairing-details">
            <h3>
              {drink.name} <span className="tag">{drink.category.replace('_', ' ')}</span>
            </h3>
            {breakdown.sharedNotes.length > 0 && <p className="pairing-bridge">Shared notes: {breakdown.sharedNotes.join(', ')}</p>}
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
              <PairingComparisonCard cake={cake} drink={drink} score={score} />
            </div>

            <LifestyleSection category={drink.category} />
            <AffiliateProductSet title="Complete the Experience" products={getProductsForPairingCategory(drink.category)} />
            <SommelierShareCard cake={cake} drink={drink} score={score} reason={explainPairing(cake, drink, pairing)[0]} />
          </div>
        )}
      </div>
    )
  }

  const activeGroup = DRINK_GROUPS.find((g) => g.id === activeGroupId)
  const categoryPairings = activeGroup ? pairings.filter((p) => activeGroup.categories.includes(p.drink.category)) : []

  return (
    <>
      <label className="cake-select">
        Cake
        <select
          value={cakeId}
          onChange={(e) => {
            setCakeId(e.target.value)
            setExpandedId(null)
            setActiveGroupId(null)
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

      {activeGroup ? (
        <>
          <button className="sommelier-back-link" onClick={() => setActiveGroupId(null)}>
            ← Back to Top Pairings
          </button>
          <h2 className="sommelier-section-heading">{activeGroup.label}</h2>
          <div className="pairing-list">{categoryPairings.map(renderPairingCard)}</div>
        </>
      ) : (
        <>
          <h2 className="sommelier-section-heading">🥇 Top Pairing</h2>
          <div className="pairing-list">{pairings.slice(0, 1).map(renderPairingCard)}</div>

          <h2 className="sommelier-section-heading">Also Excellent</h2>
          <div className="pairing-list">{pairings.slice(1, 4).map(renderPairingCard)}</div>

          <h2 className="sommelier-section-heading">Explore by Category</h2>
          <div className="sommelier-category-chips">
            {DRINK_GROUPS.map((group) => (
              <button key={group.id} className="sommelier-category-chip" onClick={() => setActiveGroupId(group.id)}>
                {group.label}
              </button>
            ))}
          </div>
        </>
      )}
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
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [drinkChosen, setDrinkChosen] = useState(false)
  const [showAllMatches, setShowAllMatches] = useState(false)

  const activeGroup = DRINK_GROUPS.find((g) => g.id === categoryId)

  function chooseCategory(id: string) {
    setCategoryId(id)
    setDrinkChosen(false)
  }

  function chooseDrink(id: string) {
    setDrinkId(id)
    setDrinkChosen(true)
    setExpandedId(null)
    setShowAllMatches(false)
  }

  if (!activeGroup) {
    return (
      <>
        <h2 className="sommelier-section-heading">Choose a beverage category</h2>
        <div className="sommelier-category-chips">
          {DRINK_GROUPS.map((group) => (
            <button key={group.id} className="sommelier-category-chip" onClick={() => chooseCategory(group.id)}>
              {group.label}
            </button>
          ))}
        </div>
      </>
    )
  }

  if (!drinkChosen) {
    const categoryDrinks = drinks.filter((d) => activeGroup.categories.includes(d.category))
    return (
      <>
        <button className="sommelier-back-link" onClick={() => setCategoryId(null)}>
          ← Back to categories
        </button>
        <h2 className="sommelier-section-heading">{activeGroup.label}</h2>
        <div className="sommelier-category-chips">
          {categoryDrinks.map((d) => (
            <button key={d.id} className="sommelier-category-chip" onClick={() => chooseDrink(d.id)}>
              {d.name}
            </button>
          ))}
        </div>
      </>
    )
  }

  const drink = drinks.find((d) => d.id === drinkId)!
  const matches = rankCakesForDrink(drink, cakes)
  const bestMatch = matches.slice(0, 1)
  const strongMatches = matches.slice(1, 4)
  const moreMatches = matches.slice(4)

  function renderMatchRow(match: ReturnType<typeof rankCakesForDrink>[number]) {
    const { cake, score, breakdown } = match
    const isExpanded = expandedId === cake.id
    const origin = getRegionEntriesForCake(cake.id)[0]?.country ?? getDecadeForCake(cake.id)?.decadeLabel
    const reason = explainPairing(cake, drink, match)[0]
    return (
      <div key={cake.id} className="card pairing-card">
        <button className="pairing-row" onClick={() => setExpandedId(isExpanded ? null : cake.id)}>
          <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
          <div className="pairing-score" style={{ background: scoreColor(score) }}>
            {score}
          </div>
          <div className="pairing-details">
            <h3>{cake.name}</h3>
            {origin && <p className="pairing-bridge">{origin}</p>}
            <p className="pairing-bridge">
              {matchQualityLabel(score)} — {reason}
            </p>
            {breakdown.sharedNotes.length > 0 && <p className="pairing-bridge">Shared notes: {breakdown.sharedNotes.join(', ')}</p>}
          </div>
          <span className="pairing-toggle">{isExpanded ? 'Hide Pairing' : 'Explore Pairing →'}</span>
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
              <PairingComparisonCard cake={cake} drink={drink} score={score} />
            </div>

            <LifestyleSection category={drink.category} />
            <AffiliateProductSet title="Complete the Experience" products={getProductsForPairingCategory(drink.category)} />
            <SommelierShareCard cake={cake} drink={drink} score={score} reason={reason} />

            <Link to={`/cake/${cake.id}`} className="encyclopedia-link">
              View full encyclopedia entry →
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <button className="sommelier-back-link" onClick={() => setDrinkChosen(false)}>
        ← Back to drinks
      </button>

      <div className="card cake-summary">
        <DrinkImage drinkId={drink.id} variant="hero" alt={drink.name} />
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

      <h2 className="sommelier-section-heading">🥇 Best Match</h2>
      <div className="pairing-list">{bestMatch.map(renderMatchRow)}</div>

      {strongMatches.length > 0 && (
        <>
          <h2 className="sommelier-section-heading">Strong Matches</h2>
          <div className="pairing-list">{strongMatches.map(renderMatchRow)}</div>
        </>
      )}

      {moreMatches.length > 0 && !showAllMatches && (
        <button className="btn btn-secondary" onClick={() => setShowAllMatches(true)}>
          View More Matches
        </button>
      )}

      {moreMatches.length > 0 && showAllMatches && (
        <>
          <h2 className="sommelier-section-heading">More Matches</h2>
          <div className="pairing-list">{moreMatches.map(renderMatchRow)}</div>
        </>
      )}
    </>
  )
}

function matchQualityLabel(score: number): string {
  if (score >= 70) return 'Excellent Match'
  if (score >= 45) return 'Good Match'
  return 'Playful Pairing'
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

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}
