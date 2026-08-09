import { collections } from '../lib/data'
import { getCollectionCakes } from '../lib/collections'
import { getCakeImage } from '../lib/images'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import './CollectionsIndexPage.css'

export function CollectionsIndexPage() {
  return (
    <main className="page collections-index-page">
      <h1>Curated Collections</h1>
      <p>Hand-picked groupings of cakes from across the Encyclopedia.</p>

      <div className="collections-grid">
        {collections.map((collection) => {
          const collectionCakes = getCollectionCakes(collection)
          const coverCake = collectionCakes.find((c) => getCakeImage(c.id))
          return (
            <DiscoverFeatureCard
              key={collection.id}
              to={`/collections/${collection.id}`}
              title={collection.title}
              description={collection.description}
              cta="Explore Collection →"
              meta={`${collectionCakes.length} ${collectionCakes.length === 1 ? 'cake' : 'cakes'}`}
              cakeId={coverCake?.id}
            />
          )
        })}
      </div>
    </main>
  )
}
