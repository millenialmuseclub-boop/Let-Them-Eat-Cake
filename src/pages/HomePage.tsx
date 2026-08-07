import { Link } from 'react-router-dom'
import { HUBS } from '../data/hubs'
import { cakes, collections } from '../lib/data'
import { getRecentlyViewed } from '../lib/recentlyViewed'
import { FEATURED_COLLECTION_IDS } from '../lib/collections'
import { getCakeOfTheDay } from '../lib/discovery'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './HomePage.css'

export function HomePage() {
  const recentCakes = getRecentlyViewed(6)
    .map((id) => cakes.find((c) => c.id === id))
    .filter((c) => c !== undefined)

  const cakeOfTheDay = getCakeOfTheDay()

  const featuredCollections = FEATURED_COLLECTION_IDS.map((id) => collections.find((c) => c.id === id)).filter((c) => c !== undefined)

  return (
    <main className="page home-page">
      <section className="home-hero">
        <h1>Let Them Eat Cake</h1>
        <p>The ultimate confectionery universe for history, moods, regional roots, and perfect pairings.</p>
      </section>

      {recentCakes.length > 0 && (
        <section className="home-section">
          <h2>Continue Exploring</h2>
          <div className="home-cake-row">
            {recentCakes.map((cake) => (
              <Link key={cake.id} to={`/cake/${cake.id}`} className="card home-cake-card">
                <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
                <h3>{cake.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-section">
        <h2>🎂 Cake of the Day</h2>
        <Link to={`/cake/${cakeOfTheDay.id}`} className="card home-cake-of-day">
          <CakeHeroImage cakeId={cakeOfTheDay.id} variant="hero" alt={cakeOfTheDay.name} />
          <h3>{cakeOfTheDay.name}</h3>
          <p>{cakeOfTheDay.description}</p>
        </Link>
      </section>

      <section className="home-section">
        <h2>✨ Explore a Collection</h2>
        <div className="home-collections-row">
          {featuredCollections.map((collection) => (
            <Link key={collection.id} to={`/collections/${collection.id}`} className="card home-collection-card">
              <span aria-hidden="true">{collection.icon}</span> {collection.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="home-grid">
        {HUBS.map((hub) => (
          <Link key={hub.path} to={hub.path} className="card home-card">
            <h2>{hub.title}</h2>
            <p>{hub.description}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
