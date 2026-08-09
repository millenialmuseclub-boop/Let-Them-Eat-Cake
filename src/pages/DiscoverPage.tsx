import { Link } from 'react-router-dom'
import { HUBS } from '../data/hubs'
import { getCake } from '../lib/data'
import { getSavedCakeIds } from '../lib/notebook'
import { getRegionEntriesForCake } from '../lib/encyclopedia'
import { getSceneImage } from '../lib/sceneImages'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import './DiscoverPage.css'

const discoverHub = HUBS.find((hub) => hub.path === '/discover')!
const discoverItems = discoverHub.kind === 'landing' ? discoverHub.items : []

export function DiscoverPage() {
  const savedCakes = getSavedCakeIds()
    .map((id) => getCake(id))
    .filter((cake): cake is NonNullable<typeof cake> => Boolean(cake))
    .slice(0, 8)

  const collectionsScene = getSceneImage('curated-collections')
  const kitchenScene = getSceneImage('curated-kitchen')

  return (
    <main className="page discover-page">
      <h1>{discoverHub.title}</h1>
      <p>{discoverHub.description}</p>

      <div className="discover-feature-grid">
        {discoverItems.map((item) => (
          <DiscoverFeatureCard
            key={item.to}
            to={item.to}
            title={item.title}
            description={item.description}
            cta={item.cta ?? 'Explore →'}
            cakeId={item.cakeId}
          />
        ))}
      </div>

      <section className="discover-section">
        <h2>🍰 Saved Cakes</h2>
        {savedCakes.length > 0 ? (
          <div className="discover-saved-row">
            {savedCakes.map((cake) => {
              const origin = getRegionEntriesForCake(cake.id)[0]?.country
              return (
                <Link key={cake.id} to={`/cake/${cake.id}`} className="discover-saved-card">
                  <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
                  <div className="discover-saved-card-label">
                    {cake.name}
                    {origin && <span className="discover-saved-card-origin">{origin}</span>}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="discover-empty">
            Your cake library starts here. Save cakes as you explore the Encyclopedia, Atlas, Sommelier, recipes, and Celebrate.{' '}
            <Link to="/encyclopedia">Explore Cakes →</Link>
          </p>
        )}
      </section>

      <div className="discover-feature-grid discover-section">
        <DiscoverFeatureCard
          to="/collections"
          title="Curated Collections"
          description="Explore hand-picked cake collections organized by flavor, mood, tradition, and occasion."
          cta="Explore Collections →"
          imageUrl={collectionsScene?.url}
          imageAlt="Curated Collections"
          photographer={collectionsScene?.photographer}
          photographerUrl={collectionsScene?.photographerUrl}
          unsplashUrl={collectionsScene?.unsplashUrl}
        />
        <DiscoverFeatureCard
          to="/curated-kitchen"
          title="Curated Kitchen"
          description="A considered edit of the tools, equipment, and ingredients worth keeping close."
          cta="Enter the Kitchen →"
          imageUrl={kitchenScene?.url}
          imageAlt="Curated Kitchen"
          photographer={kitchenScene?.photographer}
          photographerUrl={kitchenScene?.photographerUrl}
          unsplashUrl={kitchenScene?.unsplashUrl}
        />
      </div>
    </main>
  )
}
