import { Link } from 'react-router-dom'
import { HUBS } from '../data/hubs'
import { getSceneImage } from '../lib/sceneImages'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import './DiscoverPage.css'

const discoverHub = HUBS.find((hub) => hub.path === '/discover')!
const discoverItems = discoverHub.kind === 'landing' ? discoverHub.items : []

export function DiscoverPage() {
  const collectionsScene = getSceneImage('curated-collections')
  const kitchenScene = getSceneImage('curated-kitchen')

  return (
    <main className="page discover-page">
      <div className="discover-brand">
        <h1>Let Them Eat Cake</h1>
        <p>Explore cake culture, master pastry, discover perfect pairing and create the best cakes.</p>
      </div>

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

      <Link to="/about" className="discover-about-link">
        About &amp; Legal
      </Link>
    </main>
  )
}
