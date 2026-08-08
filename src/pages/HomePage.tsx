import { Link } from 'react-router-dom'
import { cakes, regions } from '../lib/data'
import { getHeroCake, getDiscoveryOfTheDay, getTechniqueOfTheDay } from '../lib/discovery'
import { getRegionEntriesForCake, getTopPairings } from '../lib/encyclopedia'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { PairingComparisonCard } from '../components/PairingComparisonCard'
import './HomePage.css'

const WORLD_CARD_COUNTRIES = ['Mexico', 'Japan', 'Brazil']

export function HomePage() {
  const heroCake = getHeroCake()
  const heroOrigin = getRegionEntriesForCake(heroCake.id)[0]?.country
  const topPairing = getTopPairings(heroCake, 1)[0]
  const discovery = getDiscoveryOfTheDay()
  const technique = getTechniqueOfTheDay()

  const worldCards = WORLD_CARD_COUNTRIES.map((country) => {
    const entries = regions.filter((r) => r.country === country)
    const primaryCakeId = entries.find((e) => e.isPrimary)?.cakeId ?? entries[0]?.cakeId
    const cakeNames = entries.map((e) => cakes.find((c) => c.id === e.cakeId)?.name).filter((n): n is string => !!n)
    return primaryCakeId ? { country, primaryCakeId, cakeNames } : null
  }).filter((c): c is { country: string; primaryCakeId: string; cakeNames: string[] } => c !== null)

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
          <h2>🥂 Perfect Pairing</h2>
          <PairingComparisonCard cake={heroCake} drink={topPairing.drink} score={topPairing.score} />
          <Link to="/sommelier" className="encyclopedia-link">
            Explore Pairing →
          </Link>
        </section>
      )}

      {discovery && (
        <section className="home-section">
          <h2>{discovery.label}</h2>
          <Link to={discovery.linkTo} className="card home-photo-card home-discovery-card">
            {discovery.cake && <CakeHeroImage cakeId={discovery.cake.id} variant="thumbnail" alt={discovery.title} />}
            <div className="home-photo-card-label">
              {discovery.title}
              <p className="home-world-card-cakes">{discovery.teaser}</p>
            </div>
          </Link>
        </section>
      )}

      <section className="home-section">
        <h2>🌍 Around the World</h2>
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

      {technique && (
        <section className="home-section">
          <h2>👩‍🍳 From the Workshop</h2>
          <Link to="/technique-library" className="card home-photo-card home-discovery-card home-technique-card">
            <div className="home-photo-card-label">
              {technique.name}
              <p className="home-world-card-cakes">{technique.whatItIs}</p>
            </div>
          </Link>
          <Link to="/technique-library" className="encyclopedia-link">
            Learn Techniques →
          </Link>
        </section>
      )}
    </main>
  )
}
