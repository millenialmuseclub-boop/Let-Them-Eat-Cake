import { Link, useParams } from 'react-router-dom'
import { getCake, getRecipeForCake } from '../lib/data'
import { getRegionEntriesForCake, getDecadeForCake, getTopPairings, getRelatedCakes } from '../lib/encyclopedia'
import { getProductsForHubPath, getProductsForIngredient, getProductsForCakeId, getProductsByIds } from '../lib/affiliateProducts'
import { FlavorProfileBars } from '../components/FlavorProfileBars'
import { CakeOriginStory } from '../components/CakeOriginStory'
import { RecipeCard } from '../components/RecipeCard'
import { SaveButton } from '../components/SaveButton'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { CakeThumbnail } from '../components/CakeThumbnail'
import { SocialShareCard } from '../components/SocialShareCard'
import { AffiliateProductSet } from '../components/AffiliateProductSet'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import './CakeDetailPage.css'

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}

export function CakeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const cake = id ? getCake(id) : undefined

  useDocumentTitle(cake ? `${cake.name} — Cake Encyclopedia | Let Them Eat Cake` : 'Cake Not Found | Let Them Eat Cake')

  if (!cake) {
    return (
      <main className="page cake-detail-page">
        <h1>Cake not found</h1>
        <p>
          We couldn't find that cake. <Link to="/encyclopedia">Browse the full encyclopedia →</Link>
        </p>
      </main>
    )
  }

  const regionEntries = getRegionEntriesForCake(cake.id)
  const primaryRegion = regionEntries[0]
  const decade = getDecadeForCake(cake.id)
  const recipe = getRecipeForCake(cake.id)
  const relatedCakes = getRelatedCakes(cake)
  const pairings = getTopPairings(cake)

  const locationLabel = primaryRegion?.country ?? decade?.decadeLabel ?? null
  const originPoints = [
    ...(primaryRegion ? [{ label: primaryRegion.country, text: primaryRegion.historyNote }] : []),
    ...(decade ? [{ label: decade.decadeLabel, text: decade.eraContext }] : []),
  ]

  const bakingTools = getProductsForHubPath('/encyclopedia')
  const vanillaMatch = cake.flavorNotes.some((n) => /vanilla/i.test(n)) ? getProductsForIngredient('vanilla-extract') : []
  const chocolateMatch = cake.flavorNotes.some((n) => /chocolate|cocoa/i.test(n)) ? getProductsForIngredient('dark-chocolate') : []
  const almondMatch = cake.flavorNotes.some((n) => /marzipan|almond/i.test(n)) ? getProductsByIds(['product_almond_paste']) : []
  const cakeSpecificAll = getProductsForCakeId(cake.id)
  const cakeSpecificMatch = cakeSpecificAll.filter((p) => p.category !== 'featured-cake')
  const tasteThisCake = cakeSpecificAll.filter((p) => p.category === 'featured-cake')

  const isOrnate = cake.difficulty === 'hard' && (cake.occasion?.includes('Celebration') ?? false)
  const celebrationFinishes = isOrnate ? getProductsByIds(['product_gel_colors', 'product_gold_leaf', 'product_fancy_sprinkles']) : []

  return (
    <main className="page cake-detail-page">
      <div className="card cake-detail-hero">
        <CakeHeroImage cakeId={cake.id} variant="hero" alt={cake.name} />
        <div className="cake-detail-tags">
          {locationLabel && <span className="tag">{locationLabel}</span>}
          <span className="tag cake-detail-texture-tag">{cake.texture}</span>
          {cake.difficulty && <span className="tag cake-detail-difficulty-tag">{cake.difficulty}</span>}
          {cake.occasion?.map((o) => (
            <span key={o} className="tag cake-detail-occasion-tag">
              {o}
            </span>
          ))}
        </div>
        <h1>
          {cake.name}
          {cake.pronunciation && <span className="cake-detail-pronunciation"> ({cake.pronunciation})</span>}
        </h1>
        <p>{cake.description}</p>
        <SaveButton type="cake" id={cake.id} />
      </div>

      {originPoints.length > 0 && (
        <section className="card cake-detail-section">
          <h2>🕰️ Origin Story</h2>
          <CakeOriginStory points={originPoints} />
        </section>
      )}

      <section className="card cake-detail-section">
        <h2>🍰 Flavor Profile</h2>
        <FlavorProfileBars profile={cake.flavorProfile} />
        <p className="cake-detail-flavor-notes">Notes: {cake.flavorNotes.join(', ')}</p>
      </section>

      <section className="card cake-detail-section">
        <h2>📣 Share this Cake</h2>
        <SocialShareCard
          eyebrow="From the Cake Encyclopedia"
          title={cake.name}
          subtitle={locationLabel ?? undefined}
          bodyText={cake.flavorNotes.slice(0, 2).join(' · ')}
          cta="Discover its story"
          shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
          shareText={`${cake.name} — from the Let Them Eat Cake Encyclopedia 🎂`}
          filename={`${cake.id}-cake`}
        />
      </section>

      {recipe && (
        <section className="cake-detail-section">
          <h2>📖 Traditional Preparation</h2>
          <RecipeCard key={recipe.id} recipe={recipe} />
        </section>
      )}

      {relatedCakes.length > 0 && (
        <section className="cake-detail-section">
          <h2>🔗 Related Cakes</h2>
          <div className="cake-detail-related-grid">
            {relatedCakes.map(({ cake: related, reason }) => (
              <Link key={related.id} to={`/cake/${related.id}`} className="card cake-detail-related-card">
                <CakeThumbnail cakeId={related.id} alt={related.name} />
                <h3>{related.name}</h3>
                <p>{reason}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {pairings.length > 0 && (
        <section className="card cake-detail-section">
          <h2>🥂 Pairings</h2>
          <ul className="cake-detail-pairing-list">
            {pairings.map(({ drink, score }) => (
              <li key={drink.id}>
                <span className="cake-detail-pairing-score" style={{ background: scoreColor(score) }}>
                  {score}
                </span>
                {drink.name}
              </li>
            ))}
          </ul>
          <Link to="/sommelier" className="btn btn-secondary cake-detail-sommelier-link">
            Explore all pairings in the Sommelier →
          </Link>
        </section>
      )}

      <AffiliateProductSet title="Baking This Cake?" products={[...vanillaMatch, ...chocolateMatch, ...almondMatch, ...cakeSpecificMatch, ...bakingTools]} />
      <AffiliateProductSet title="Celebration Finishes" products={celebrationFinishes} />
      <AffiliateProductSet title="Taste This Cake" products={tasteThisCake} />
    </main>
  )
}
