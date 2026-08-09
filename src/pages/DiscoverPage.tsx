import { Link } from 'react-router-dom'
import { HUBS } from '../data/hubs'
import { getCake } from '../lib/data'
import { getSavedCakeIds } from '../lib/notebook'
import { getCakeImage } from '../lib/images'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './DiscoverPage.css'

const discoverHub = HUBS.find((hub) => hub.path === '/discover')!
const discoverItems = discoverHub.kind === 'landing' ? discoverHub.items : []

export function DiscoverPage() {
  const savedCakes = getSavedCakeIds()
    .map((id) => getCake(id))
    .filter((cake): cake is NonNullable<typeof cake> => Boolean(cake))
    .slice(0, 8)

  return (
    <main className="page discover-page">
      <h1>{discoverHub.title}</h1>
      <p>{discoverHub.description}</p>

      <div className="hub-grid">
        {discoverItems.map((item) => {
          const hasPhoto = item.cakeId && !!getCakeImage(item.cakeId)
          return (
            <Link key={item.to} to={item.to} className={hasPhoto ? 'hub-photo-card' : 'card hub-card'}>
              {hasPhoto && <CakeHeroImage cakeId={item.cakeId!} variant="hero" alt={item.title} />}
              <div className={hasPhoto ? 'hub-photo-card-content' : undefined}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {hasPhoto && <span className="btn hub-photo-card-cta">{item.cta ?? 'Explore →'}</span>}
              </div>
            </Link>
          )
        })}
      </div>

      <section className="discover-section">
        <h2>🍰 Saved Cakes</h2>
        {savedCakes.length > 0 ? (
          <div className="home-photo-row">
            {savedCakes.map((cake) => (
              <Link key={cake.id} to={`/cake/${cake.id}`} className="card home-photo-card">
                <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
                <div className="home-photo-card-label">{cake.name}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="discover-empty">
            Your cake library starts here. Save cakes as you explore the Encyclopedia, Atlas, Sommelier, recipes, and Celebrate.{' '}
            <Link to="/encyclopedia">Explore Cakes →</Link>
          </p>
        )}
      </section>

      <div className="hub-grid discover-section">
        <Link to="/collections" className="card hub-card">
          <h2>Curated Collections</h2>
          <p>Chocolate Classics, Coconut & Tropical, Celebration-Worthy, and more — hand-picked groupings across the Encyclopedia.</p>
        </Link>
        <Link to="/curated-kitchen" className="card hub-card">
          <h2>Curated Kitchen</h2>
          <p>The tools, equipment, and ingredients we reach for again and again — organized by what you're doing.</p>
        </Link>
      </div>
    </main>
  )
}
