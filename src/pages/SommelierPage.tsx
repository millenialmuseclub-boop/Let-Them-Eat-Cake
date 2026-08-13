import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, drinks } from '../lib/data'
import { explainPairing, explainPairingScience, rankCakesForDrink, rankPairings } from '../lib/sommelier'
import type { CakeProfile } from '../types/cake'
import type { DrinkProfile, PairingResult } from '../types/sommelier'
import { getLifestylePairing } from '../lib/lifestylePairings'
import { getRegionEntriesForCake, getDecadeForCake } from '../lib/encyclopedia'
import { CAKE_TEXTURES, getTopFlavorNotes } from '../lib/cakeBrowse'
import { getAllIngredients } from '../lib/ingredients'
import { getFirstPhotographedCakeId } from '../lib/images'
import { PairingComparisonCard } from '../components/PairingComparisonCard'
import { DrinkThumbnail } from '../components/DrinkThumbnail'
import { CakeThumbnail } from '../components/CakeThumbnail'
import { AffiliateProductSet } from '../components/AffiliateProductSet'
import { SommelierShareCard } from '../components/SommelierShareCard'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import { getProductsForPairingCategory } from '../lib/affiliateProducts'
import { getDrinkImage, getFirstPhotographedDrinkId } from '../lib/drinkImages'
import type { DrinkCategory } from '../types/sommelier'
import { SearchableSelect } from '../components/SearchableSelect'
import './SommelierPage.css'

const TOP_FLAVORS = getTopFlavorNotes(10)

type Mode = 'cake-first' | 'drink-first'

const DRINK_GROUPS: { id: string; label: string; categories: DrinkCategory[] }[] = [
  { id: 'red-wine', label: 'Red Wine', categories: ['red_wine'] },
  { id: 'white-wine', label: 'White Wine', categories: ['white_wine'] },
  { id: 'sparkling-dessert-wine', label: 'Champagne & Specialty Wine', categories: ['wine', 'port', 'champagne'] },
  { id: 'coffee', label: 'Coffee', categories: ['coffee'] },
  { id: 'tea', label: 'Tea', categories: ['tea'] },
  { id: 'spirits-beer', label: 'Spirits & Beer', categories: ['spirits', 'beer'] },
  { id: 'cocktails', label: 'Cocktails', categories: ['cocktails'] },
  { id: 'non-alcoholic', label: 'Non-Alcoholic', categories: ['non_alcoholic'] },
]

/** One representative, ideally-photographed drink per beverage group -- computed once, the groups/catalog are both static. */
const DRINK_GROUP_IMAGE: Record<string, ReturnType<typeof getDrinkImage>> = Object.fromEntries(
  DRINK_GROUPS.map((group) => {
    const groupDrinkIds = drinks.filter((d) => group.categories.includes(d.category)).map((d) => d.id)
    const repId = getFirstPhotographedDrinkId(groupDrinkIds) ?? groupDrinkIds[0]
    return [group.id, repId ? getDrinkImage(repId) : undefined]
  }),
)

function DrinkGroupCards({ onChoose }: { onChoose: (groupId: string) => void }) {
  return (
    <div className="discover-feature-grid">
      {DRINK_GROUPS.map((group) => {
        const image = DRINK_GROUP_IMAGE[group.id]
        return (
          <DiscoverFeatureCard
            key={group.id}
            onClick={() => onChoose(group.id)}
            title={group.label}
            description="See top-rated cake pairings"
            cta="Explore →"
            imageUrl={image?.url}
            imageAlt={group.label}
            photographer={image?.photographer}
          />
        )
      })}
    </div>
  )
}

export function SommelierPage() {
  const [mode, setMode] = useState<Mode>('cake-first')
  const [modeChosen, setModeChosen] = useState(false)
  const [cakeId, setCakeId] = useState<string | null>(null)
  const [drinkId, setDrinkId] = useState<string | null>(null)
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
        <div className="discover-feature-grid">
          <DiscoverFeatureCard
            onClick={() => chooseMode('cake-first')}
            title="Pair by Cake"
            description="Choose a cake and discover what belongs beside it."
            cta="Start With Cake →"
            cakeId="cake_pavlova"
          />
          <DiscoverFeatureCard
            onClick={() => chooseMode('drink-first')}
            title="Pair by Drink"
            description="Choose your drink and discover its perfect cakes."
            cta="Start With Drink →"
            imageUrl={getDrinkImage('drink_espresso')?.url}
            imageAlt="Pair by Drink"
            photographer={getDrinkImage('drink_espresso')?.photographer}
            photographerUrl={getDrinkImage('drink_espresso')?.photographerUrl}
            unsplashUrl={getDrinkImage('drink_espresso')?.unsplashUrl}
          />
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
  cakeId: string | null
  setCakeId: (id: string | null) => void
  expandedId: string | null
  setExpandedId: (id: string | null) => void
}) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [showAllPairings, setShowAllPairings] = useState(false)

  if (!cakeId) {
    function pickCake(id: string) {
      setCakeId(id)
      setExpandedId(null)
      setActiveGroupId(null)
    }

    return (
      <>
        <h2 className="sommelier-section-heading">Search for a cake</h2>
        <SearchableSelect items={cakes} getId={(c) => c.id} getLabel={(c) => c.name} placeholder="Search for a cake..." onSelect={(c) => pickCake(c.id)} />

        <h3 className="sommelier-discovery-heading">Or discover cakes by flavor, ingredient, or texture</h3>
        <div className="sommelier-discovery-content">
          <CakeDiscoveryPicker onPickCake={pickCake} />
        </div>
      </>
    )
  }

  const cake = cakes.find((c) => c.id === cakeId)!
  const pairings = rankPairings(cake, drinks)

  function renderPairingCard(pairing: ReturnType<typeof rankPairings>[number]) {
    const { drink, score, breakdown } = pairing
    const isExpanded = expandedId === drink.id
    return (
      <div key={drink.id} className="card pairing-card">
        <button className="pairing-row" onClick={() => setExpandedId(isExpanded ? null : drink.id)}>
          <DrinkThumbnail drinkId={drink.id} alt={drink.name} />
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

            <PairingScienceSection cake={cake} drink={drink} result={pairing} />

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
      <button
        className="sommelier-back-link"
        onClick={() => {
          setCakeId(null)
          setExpandedId(null)
          setActiveGroupId(null)
          setShowAllPairings(false)
        }}
      >
        ← Search a different cake
      </button>

      <div className="card cake-summary">
        <CakeThumbnail cakeId={cake.id} variant="hero" alt={cake.name} />
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

          {pairings.length > 4 && !showAllPairings && (
            <button className="btn btn-secondary" onClick={() => setShowAllPairings(true)}>
              View More Pairings →
            </button>
          )}

          {pairings.length > 4 && showAllPairings && (
            <>
              <h2 className="sommelier-section-heading">Also Excellent</h2>
              <div className="pairing-list">{pairings.slice(4).map(renderPairingCard)}</div>
            </>
          )}

          <h2 className="sommelier-section-heading">Explore by Category</h2>
          <DrinkGroupCards onChoose={setActiveGroupId} />
        </>
      )}
    </>
  )
}

type DiscoveryType = 'flavor' | 'ingredient' | 'texture'

interface DiscoveryValue {
  type: DiscoveryType
  value: string
  label: string
}

const DISCOVERY_CATEGORIES: { type: DiscoveryType; label: string; description: string; icon: string; repCakeId: string }[] = [
  { type: 'flavor', label: 'Flavor', description: 'Explore cakes by flavor', icon: '🍫', repCakeId: 'cake_black_forest' },
  { type: 'texture', label: 'Texture', description: 'Explore cakes by texture', icon: '🍮', repCakeId: 'cake_pavlova' },
  { type: 'ingredient', label: 'Ingredient', description: 'Explore cakes by ingredient', icon: '🧂', repCakeId: 'cake_moroccan_orange_almond' },
]

/**
 * Secondary discovery path for Pair by Cake -- answers "what cakes are
 * chocolate-forward / contain coffee / are light and airy" etc. A 3-level
 * drill-down (category card -> that category's options -> matching cakes)
 * instead of dumping every Flavor/Texture/Ingredient option on the page at
 * once, which is what made the Start-From-Cake screen too long. Reuses the
 * same cake/ingredient data and filter logic as everywhere else in the app;
 * picking a cake at the bottom feeds straight into the same onPickCake
 * handler the search box uses, so it continues naturally into the normal
 * pairing results.
 */
function CakeDiscoveryPicker({ onPickCake }: { onPickCake: (cakeId: string) => void }) {
  const [type, setType] = useState<DiscoveryType | null>(null)
  const [active, setActive] = useState<DiscoveryValue | null>(null)
  const ingredients = useMemo(() => getAllIngredients(), [])

  const matchingCakes: CakeProfile[] = useMemo(() => {
    if (!active) return []
    if (active.type === 'flavor') return cakes.filter((c) => c.flavorNotes.includes(active.value))
    if (active.type === 'texture') return cakes.filter((c) => c.texture === active.value)
    const ingredient = ingredients.find((i) => i.slug === active.value)
    return ingredient ? ingredient.cakeIds.map((id) => cakes.find((c) => c.id === id)).filter((c): c is CakeProfile => !!c) : []
  }, [active, ingredients])

  if (active) {
    return (
      <>
        <button className="sommelier-back-link" onClick={() => setActive(null)}>
          ← Back
        </button>
        <h3 className="sommelier-discovery-value-heading">{active.label}</h3>
        {matchingCakes.length === 0 ? (
          <p className="sommelier-discovery-empty">No cakes found.</p>
        ) : (
          <div className="sommelier-discovery-grid">
            {matchingCakes.map((cake) => (
              <button key={cake.id} className="card sommelier-discovery-cake" onClick={() => onPickCake(cake.id)}>
                <CakeThumbnail cakeId={cake.id} alt={cake.name} />
                <h4>{cake.name}</h4>
              </button>
            ))}
          </div>
        )}
      </>
    )
  }

  if (type === 'flavor') {
    const flavorCards = TOP_FLAVORS.map((flavor) => ({
      flavor,
      repCakeId: getFirstPhotographedCakeId(cakes.filter((c) => c.flavorNotes.includes(flavor)).map((c) => c.id)),
    }))
    return (
      <>
        <button className="sommelier-back-link" onClick={() => setType(null)}>
          ← Back
        </button>
        <h3 className="sommelier-discovery-value-heading">🍫 Flavor</h3>
        <div className="discover-feature-grid">
          {flavorCards.map(
            ({ flavor, repCakeId }) =>
              repCakeId && (
                <DiscoverFeatureCard
                  key={flavor}
                  onClick={() => setActive({ type: 'flavor', value: flavor, label: flavor })}
                  title={flavor}
                  description="See matching cakes"
                  cta="Browse →"
                  cakeId={repCakeId}
                />
              ),
          )}
        </div>
      </>
    )
  }

  if (type === 'texture') {
    const textureCards = CAKE_TEXTURES.map((texture) => ({
      texture,
      repCakeId: getFirstPhotographedCakeId(cakes.filter((c) => c.texture === texture).map((c) => c.id)),
    }))
    return (
      <>
        <button className="sommelier-back-link" onClick={() => setType(null)}>
          ← Back
        </button>
        <h3 className="sommelier-discovery-value-heading">🍮 Texture</h3>
        <div className="discover-feature-grid">
          {textureCards.map(
            ({ texture, repCakeId }) =>
              repCakeId && (
                <DiscoverFeatureCard
                  key={texture}
                  onClick={() => setActive({ type: 'texture', value: texture, label: texture })}
                  title={texture}
                  description="See matching cakes"
                  cta="Browse →"
                  cakeId={repCakeId}
                />
              ),
          )}
        </div>
      </>
    )
  }

  if (type === 'ingredient') {
    const topIngredients = ingredients.slice(0, 8)
    return (
      <>
        <button className="sommelier-back-link" onClick={() => setType(null)}>
          ← Back
        </button>
        <h3 className="sommelier-discovery-value-heading">🧂 Ingredient</h3>
        <div className="discover-feature-grid">
          {topIngredients.map((ingredient) => {
            const repCakeId = getFirstPhotographedCakeId(ingredient.cakeIds) ?? ingredient.cakeIds[0]
            return (
              repCakeId && (
                <DiscoverFeatureCard
                  key={ingredient.slug}
                  onClick={() => setActive({ type: 'ingredient', value: ingredient.slug, label: ingredient.displayName })}
                  title={ingredient.displayName}
                  description={`${ingredient.cakeIds.length} ${ingredient.cakeIds.length === 1 ? 'cake' : 'cakes'}`}
                  cta="Browse →"
                  cakeId={repCakeId}
                />
              )
            )
          })}
        </div>
        <SearchableSelect
          items={ingredients}
          getId={(i) => i.slug}
          getLabel={(i) => i.displayName}
          getSubLabel={(i) => `${i.cakeIds.length} ${i.cakeIds.length === 1 ? 'cake' : 'cakes'}`}
          placeholder="Search for any ingredient..."
          onSelect={(i) => setActive({ type: 'ingredient', value: i.slug, label: i.displayName })}
        />
      </>
    )
  }

  return (
    <div className="discover-feature-grid">
      {DISCOVERY_CATEGORIES.map((category) => (
        <DiscoverFeatureCard
          key={category.type}
          onClick={() => setType(category.type)}
          title={`${category.icon} ${category.label}`}
          description={category.description}
          cta="Browse →"
          cakeId={category.repCakeId}
        />
      ))}
    </div>
  )
}

function DrinkFirstView({
  drinkId,
  setDrinkId,
  expandedId,
  setExpandedId,
}: {
  drinkId: string | null
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
        <DrinkGroupCards onChoose={chooseCategory} />
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
        <SearchableSelect
          items={categoryDrinks}
          getId={(d) => d.id}
          getLabel={(d) => d.name}
          placeholder="Search or choose a drink..."
          showAllThreshold={20}
          onSelect={(d) => chooseDrink(d.id)}
        />
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
          <CakeThumbnail cakeId={cake.id} alt={cake.name} />
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
            {breakdown.cleansingBonus > 0 && <p className="pairing-bridge">Cuts through the richness of this cake</p>}
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

            <PairingScienceSection cake={cake} drink={drink} result={match} />

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
        <DrinkThumbnail drinkId={drink.id} variant="hero" alt={drink.name} />
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

      <h2 className="sommelier-section-heading">🥇 Top Pairing</h2>
      <div className="pairing-list">{bestMatch.map(renderMatchRow)}</div>

      {strongMatches.length > 0 && (
        <>
          <h2 className="sommelier-section-heading">Also Excellent</h2>
          <div className="pairing-list">{strongMatches.map(renderMatchRow)}</div>
        </>
      )}

      {moreMatches.length > 0 && !showAllMatches && (
        <button className="btn btn-secondary" onClick={() => setShowAllMatches(true)}>
          View More Pairings →
        </button>
      )}

      {moreMatches.length > 0 && showAllMatches && (
        <>
          <h2 className="sommelier-section-heading">Also Excellent</h2>
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

function PairingScienceSection({ cake, drink, result }: { cake: CakeProfile; drink: DrinkProfile; result: PairingResult }) {
  const science = explainPairingScience(cake, drink, result)
  if (!science.bridging && !science.cutting && !science.echoing) return null

  return (
    <div className="pairing-expanded-section">
      <h4>🔬 Pairing Science</h4>
      {science.bridging && (
        <p>
          <strong>Bridging:</strong> {science.bridging}
        </p>
      )}
      {science.cutting && (
        <p>
          <strong>Cutting:</strong> {science.cutting}
        </p>
      )}
      {science.echoing && (
        <p>
          <strong>Echoing:</strong> {science.echoing}
        </p>
      )}
    </div>
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

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}
