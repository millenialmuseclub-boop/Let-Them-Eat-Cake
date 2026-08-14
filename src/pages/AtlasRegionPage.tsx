import { Link, useParams } from 'react-router-dom'
import { getCountriesForDisplayRegion, slugToRegion } from '../lib/atlas'
import { getCake } from '../lib/data'
import { getFirstPhotographedCakeId } from '../lib/images'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import './AtlasRegionPage.css'

export function AtlasRegionPage() {
  const { region: regionSlug } = useParams<{ region: string }>()
  const region = regionSlug ? slugToRegion(regionSlug) : undefined

  useDocumentTitle(region ? `${region} Cakes — Global Cake Atlas | Let Them Eat Cake` : 'Global Cake Atlas | Let Them Eat Cake')

  if (!region) {
    return (
      <main className="page atlas-region-page">
        <Link to="/atlas" className="atlas-region-back">
          ← Back to Atlas
        </Link>
        <p className="atlas-empty">That region couldn't be found.</p>
      </main>
    )
  }

  const entries = getCountriesForDisplayRegion(region)

  return (
    <main className="page atlas-region-page">
      <Link to="/atlas" className="atlas-region-back">
        ← Back to Atlas
      </Link>
      <h1>{region} Cakes</h1>
      <p>Signature cakes from across {region} — tap any cake for its full story and recipe.</p>

      <div className="discover-feature-grid atlas-region-grid">
        {entries.map((entry) => {
          const cake = getCake(entry.cakeId)
          return (
            <DiscoverFeatureCard
              key={entry.id}
              to={`/cake/${entry.cakeId}`}
              title={cake?.name ?? entry.country}
              meta={entry.country}
              cta="View Cake →"
              cakeId={getFirstPhotographedCakeId([entry.cakeId]) ?? entry.cakeId}
              imageAlt={cake ? `${cake.name}, ${entry.country}` : entry.country}
            />
          )
        })}
      </div>
    </main>
  )
}
