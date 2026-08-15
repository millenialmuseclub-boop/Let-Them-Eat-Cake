import { Link, useParams } from 'react-router-dom'
import { getCollection } from '../lib/data'
import { getCollectionCakes } from '../lib/collections'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './CollectionDetailPage.css'

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const collection = id ? getCollection(id) : undefined

  if (!collection) {
    return (
      <main className="page collection-detail-page">
        <h1>Collection not found</h1>
        <p>
          We couldn't find that collection. <Link to="/collections">Browse all collections →</Link>
        </p>
      </main>
    )
  }

  const cakes = getCollectionCakes(collection)

  return (
    <main className="page collection-detail-page">
      <span className="collection-detail-icon" aria-hidden="true">
        {collection.icon}
      </span>
      <h1>{collection.title}</h1>
      <p>{collection.description}</p>

      <div className="collection-detail-grid">
        {cakes.map((cake) => (
          <Link key={cake.id} to={`/cake/${cake.id}`} className="card collection-detail-card">
            <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
            <h3>{cake.name}</h3>
            <p>{cake.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
