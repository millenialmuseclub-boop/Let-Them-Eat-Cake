import { Link } from 'react-router-dom'
import { collections } from '../lib/data'
import { getCollectionCakes } from '../lib/collections'
import './CollectionsIndexPage.css'

export function CollectionsIndexPage() {
  return (
    <main className="page collections-index-page">
      <h1>Curated Collections</h1>
      <p>Hand-picked groupings of cakes from across the Encyclopedia.</p>

      <div className="collections-grid">
        {collections.map((collection) => (
          <Link key={collection.id} to={`/collections/${collection.id}`} className="card collection-card">
            <span className="collection-card-icon" aria-hidden="true">
              {collection.icon}
            </span>
            <h2>{collection.title}</h2>
            <p>{collection.description}</p>
            <span className="collection-card-count">{getCollectionCakes(collection).length} cakes</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
