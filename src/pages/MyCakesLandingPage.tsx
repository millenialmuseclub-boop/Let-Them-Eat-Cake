import { Link } from 'react-router-dom'
import { getCake } from '../lib/data'
import { getSavedCakeIds } from '../lib/notebook'
import { getUserCollections } from '../lib/userCollections'
import { getRecentlyViewed } from '../lib/recentlyViewed'
import { getFirstPhotographedCakeId } from '../lib/images'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './MyCakesLandingPage.css'

export function MyCakesLandingPage() {
  const savedCakes = getSavedCakeIds()
    .map((id) => getCake(id))
    .filter((cake): cake is NonNullable<typeof cake> => Boolean(cake))
    .slice(0, 8)

  const collections = getUserCollections()

  const recentlyViewed = getRecentlyViewed()
    .map((id) => getCake(id))
    .filter((cake): cake is NonNullable<typeof cake> => Boolean(cake))

  return (
    <main className="page my-cakes-page">
      <h1>My Cakes</h1>
      <p>Your personal cake identity and saved collection.</p>

      <section className="home-section">
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
          <p className="my-cakes-empty">
            Nothing saved yet — <Link to="/encyclopedia">browse the Encyclopedia</Link> and save a cake you love.
          </p>
        )}
        <Link to="/notebook" className="encyclopedia-link">
          View Pastry Notebook →
        </Link>
      </section>

      <section className="home-section">
        <h2>📁 My Collections</h2>
        {collections.length > 0 ? (
          <div className="home-photo-row">
            {collections.map((collection) => {
              const coverCakeId = getFirstPhotographedCakeId(collection.cakeIds)
              return (
                <Link key={collection.id} to={`/my-collections/${collection.id}`} className="card home-photo-card">
                  {coverCakeId && <CakeHeroImage cakeId={coverCakeId} variant="thumbnail" alt={collection.name} />}
                  <div className="home-photo-card-label">
                    {collection.name}
                    <p className="home-world-card-cakes">
                      {collection.cakeIds.length} {collection.cakeIds.length === 1 ? 'cake' : 'cakes'} saved
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="my-cakes-empty">
            No collections yet — <Link to="/my-collections">create your first one</Link>.
          </p>
        )}
      </section>

      {recentlyViewed.length > 0 && (
        <section className="home-section">
          <h2>🕰️ Recently Viewed</h2>
          <div className="home-photo-row">
            {recentlyViewed.map((cake) => (
              <Link key={cake.id} to={`/cake/${cake.id}`} className="card home-photo-card">
                <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
                <div className="home-photo-card-label">{cake.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-section">
        <h2>🧰 Curated Kitchen</h2>
        <Link to="/curated-kitchen" className="hub-card card my-cakes-kitchen-card">
          <h2>The tools we reach for again and again</h2>
          <p>Baking essentials, decorating tools, and ingredients — organized by what you're doing.</p>
        </Link>
      </section>
    </main>
  )
}
