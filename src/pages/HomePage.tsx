import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cakes, collections } from '../lib/data'
import { getUserCollections } from '../lib/userCollections'
import { FEATURED_COLLECTION_IDS } from '../lib/collections'
import { getHeroCake } from '../lib/discovery'
import { getRegionEntriesForCake, getTopPairings } from '../lib/encyclopedia'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { PairingComparisonCard } from '../components/PairingComparisonCard'
import type { CakeProfile } from '../types/cake'
import './HomePage.css'

const SEASONAL_CARDS: { icon: string; title: string; occasion: string }[] = [
  { icon: '💍', title: 'Wedding Season', occasion: 'Wedding' },
  { icon: '🎄', title: 'Holiday Cakes', occasion: 'Christmas' },
  { icon: '🎈', title: 'Birthday Favorites', occasion: 'Birthday' },
]

function representativeCake(occasion: string): CakeProfile | undefined {
  return cakes.find((c) => c.occasion?.includes(occasion))
}

export function HomePage() {
  const [userCollections] = useState(() => getUserCollections())

  const heroCake = getHeroCake()
  const heroOrigin = getRegionEntriesForCake(heroCake.id)[0]?.country
  const topPairing = getTopPairings(heroCake, 1)[0]

  const featuredCollections = FEATURED_COLLECTION_IDS.map((id) => collections.find((c) => c.id === id)).filter((c) => c !== undefined)

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
        <div className="home-visual-row">
          {featuredCollections.map((collection) => (
            <Link key={collection.id} to={`/collections/${collection.id}`} className="card home-visual-card">
              <span className="home-visual-icon" aria-hidden="true">
                {collection.icon}
              </span>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>🌍 Explore the World</h2>
        <div className="home-visual-row">
          <Link to="/atlas" className="card home-visual-card">
            <span className="home-visual-icon" aria-hidden="true">
              🗺️
            </span>
            <h3>Global Cake Atlas</h3>
            <p>Click a pin on an interactive world map for any country's signature cake.</p>
          </Link>
          <Link to="/traditions" className="card home-visual-card">
            <span className="home-visual-icon" aria-hidden="true">
              📖
            </span>
            <h3>Baking Traditions</h3>
            <p>Editorial spotlights on the baking traditions of entire regions.</p>
          </Link>
        </div>
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
