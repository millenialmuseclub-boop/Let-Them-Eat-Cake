import { Link, useParams } from 'react-router-dom'
import { collections, ramen } from '../../lib/ramen/data'
import { RamenCard } from '../../components/ramen/RamenCard'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './RamenEncyclopediaIndexPage.css'
import './CollectionsPage.css'

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const collection = id ? collections.find((c) => c.id === id) : undefined

  useDocumentTitle(collection ? `${collection.title} | Let Them Eat Ramen` : 'Collection Not Found | Let Them Eat Ramen')

  if (!collection) {
    return (
      <main className="page">
        <h1>Collection not found</h1>
        <p>
          We couldn't find that collection. <Link to="/ramen/collections">Back to Collections →</Link>
        </p>
      </main>
    )
  }

  const items = collection.ramenIds.map((rid) => ramen.find((r) => r.id === rid)).filter((r): r is NonNullable<typeof r> => !!r)

  return (
    <main className="page">
      <h1>{collection.title}</h1>
      <p>{collection.description}</p>

      <div className="encyclopedia-grid">
        {items.map((item) => (
          <RamenCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
