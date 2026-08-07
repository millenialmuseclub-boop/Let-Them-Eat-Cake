import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, collections, regions } from '../lib/data'
import { getUserCollections } from '../lib/userCollections'
import { FEATURED_COLLECTION_IDS, getCollectionCakes } from '../lib/collections'
import { MOOD_OPTIONS } from '../lib/persona'
import { getHeroCake } from '../lib/discovery'
import { getRegionEntriesForCake, getTopPairings } from '../lib/encyclopedia'
import { getCakeImage } from '../lib/images'
import { getAllIngredients } from '../lib/ingredients'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { PairingComparisonCard } from '../components/PairingComparisonCard'
import type { CakeProfile } from '../types/cake'
import './HomePage.css'

const SEASONAL_CARDS: { icon: string; title: string; occasion: string }[] = [
  { icon: '💍', title: 'Wedding Season', occasion: 'Wedding' },
  { icon: '🎄', title: 'Holiday Cakes', occasion: 'Christmas' },
  { icon: '🎈', title: 'Birthday Favorites', occasion: 'Birthday' },
]

const WORLD_CARD_COUNTRIES = ['Mexico', 'Japan', 'Brazil']

function representativeCake(occasion: string): CakeProfile | undefined {
  return cakes.find((c) => c.occasion?.includes(occasion))
}

function cakeWithPhoto(candidates: CakeProfile[]): CakeProfile | undefined {
  return candidates.find((c) => getCakeImage(c.id)) ?? candidates[0]
}

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function HomePage() {
  const [userCollections] = useState(() => getUserCollections())

  const heroCake = getHeroCake()
  const heroOrigin = getRegionEntriesForCake(heroCake.id)[0]?.country
  const topPairing = getTopPairings(heroCake, 1)[0]

  const featuredCollections = FEATURED_COLLECTION_IDS.map((id) => collections.find((c) => c.id === id)).filter((c) => c !== undefined)

  const worldCards = WORLD_CARD_COUNTRIES.map((country) => {
    const entries = regions.filter((r) => r.country === country)
    const primaryCakeId = entries.find((e) => e.isPrimary)?.cakeId ?? entries[0]?.cakeId
    const cakeNames = entries.map((e) => cakes.find((c) => c.id === e.cakeId)?.name).filter((n): n is string => !!n)
    return primaryCakeId ? { country, primaryCakeId, cakeNames } : null
  }).filter((c) => c !== null)

  const isEvenDay = dayOfYear() % 2 === 0
  const newestCake = cakes[cakes.length - 1]
  const spotlightIngredient = getAllIngredients().find((ing) => ing.cakeIds.length >= 3)

  return (
    <main className="page home-page">
      <Link to={`/cake/${heroCake.id}`} className="home-hero">
        <CakeHeroImage cakeId={heroCake.id} variant="hero" alt={heroCake.name} />
        <div className="home-hero-content">
          {heroOrigin && <p className="home-hero-eyebrow">{heroOrigin}</p>}
          <h1>{heroCake.name}</h1>
          <p className="home-hero-hook">{heroCake.description}</p>
          <span className="btn home-hero-cta">Explore →</span>
        </div>
      </Link>

      {topPairing && (
        <section className="home-section">
          <h2>🥂 Today's Perfect Pairing</h2>
          <PairingComparisonCard cake={heroCake} drink={topPairing.drink} score={topPairing.score} />
        </section>
      )}

      <section className="home-section">
        <h2>✨ Explore the Encyclopedia</h2>
        <div className="home-photo-row">
          {featuredCollections.map((collection) => {
            const cake = cakeWithPhoto(getCollectionCakes(collection))
            return (
              <Link key={collection.id} to={`/collections/${collection.id}`} className="card home-photo-card">
                {cake && <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={collection.title} />}
                <div className="home-photo-card-label">
                  <span aria-hidden="true">{collection.icon}</span> {collection.title}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="home-section">
        <h2>🎭 Discover by Mood</h2>
        <div className="home-photo-row">
          {MOOD_OPTIONS.map((mood) => {
            const matches = cakes.filter((c) => c.personaTags?.moods?.includes(mood.value))
            const cake = cakeWithPhoto(matches)
            if (!cake) return null
            return (
              <Link key={mood.value} to={`/encyclopedia?mood=${encodeURIComponent(mood.value)}`} className="card home-photo-card">
                <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={mood.label} />
                <div className="home-photo-card-label">{mood.label}</div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="home-section">
        <h2>🌍 Explore the World</h2>
        <div className="home-photo-row">
          {worldCards.map((card) => (
            <Link key={card.country} to={`/atlas?country=${encodeURIComponent(card.country)}`} className="card home-photo-card">
              <CakeHeroImage cakeId={card.primaryCakeId} variant="thumbnail" alt={card.country} />
              <div className="home-photo-card-label">
                {card.country}
                <p className="home-world-card-cakes">{card.cakeNames.join(' · ')}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/atlas" className="encyclopedia-link">
          Open World Cake Atlas →
        </Link>
      </section>

      <section className="home-section">
        <h2>🔎 Fresh Discovery</h2>
        {isEvenDay && spotlightIngredient ? (
          <Link to={`/ingredient/${spotlightIngredient.slug}`} className="card home-photo-card home-discovery-card">
            {(() => {
              const cake = cakeWithPhoto(spotlightIngredient.cakeIds.map((id) => cakes.find((c) => c.id === id)).filter((c): c is CakeProfile => !!c))
              return cake && <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={spotlightIngredient.displayName} />
            })()}
            <div className="home-photo-card-label">
              🧂 Ingredient Spotlight: {spotlightIngredient.displayName}
              <p className="home-world-card-cakes">Used in {spotlightIngredient.cakeIds.length} cakes</p>
            </div>
          </Link>
        ) : (
          <Link to={`/cake/${newestCake.id}`} className="card home-photo-card home-discovery-card">
            <CakeHeroImage cakeId={newestCake.id} variant="thumbnail" alt={newestCake.name} />
            <div className="home-photo-card-label">
              🆕 Newly Added: {newestCake.name}
              <p className="home-world-card-cakes">{newestCake.description}</p>
            </div>
          </Link>
        )}
      </section>

      <section className="home-section">
        <h2>🍂 Seasonal Inspiration</h2>
        <div className="home-visual-row">
          {SEASONAL_CARDS.map((seasonal) => {
            const cake = representativeCake(seasonal.occasion)
            if (!cake) return null
            return (
              <Link key={seasonal.occasion} to={`/encyclopedia?occasion=${encodeURIComponent(seasonal.occasion)}`} className="card home-seasonal-card">
                <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
                <div className="home-seasonal-card-label">
                  <span aria-hidden="true">{seasonal.icon}</span> {seasonal.title}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {userCollections.length > 0 && (
        <section className="home-section">
          <h2>📁 Your Collections</h2>
          <div className="home-visual-row">
            {userCollections.slice(0, 4).map((collection) => (
              <Link key={collection.id} to={`/my-collections/${collection.id}`} className="card home-visual-card">
                <h3>{collection.name}</h3>
                <p>
                  {collection.cakeIds.length} {collection.cakeIds.length === 1 ? 'cake' : 'cakes'} saved
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
