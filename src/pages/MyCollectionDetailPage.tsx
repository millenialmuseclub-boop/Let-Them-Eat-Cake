import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUserCollection, updateUserCollectionNote, removeCakeFromCollection } from '../lib/userCollections'
import { getCake } from '../lib/data'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { SocialShareCard } from '../components/SocialShareCard'
import './MyCollectionDetailPage.css'

export function MyCollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [collection, setCollection] = useState(() => (id ? getUserCollection(id) : undefined))
  const [note, setNote] = useState(collection?.note ?? '')

  if (!collection) {
    return (
      <main className="page my-collection-detail-page">
        <h1>Collection not found</h1>
        <p>
          We couldn't find that collection. <Link to="/my-collections">Browse your collections →</Link>
        </p>
      </main>
    )
  }

  const cakes = collection.cakeIds.map((cakeId) => getCake(cakeId)).filter((c) => c !== undefined)

  function handleRemove(cakeId: string) {
    if (!collection) return
    removeCakeFromCollection(collection.id, cakeId)
    setCollection(getUserCollection(collection.id))
  }

  function handleNoteBlur() {
    if (!collection) return
    updateUserCollectionNote(collection.id, note)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const cakeNames = cakes.map((c) => c.name).join(', ')

  return (
    <main className="page my-collection-detail-page">
      <h1>{collection.name}</h1>

      <textarea
        className="my-collection-note"
        placeholder="Add a note about this collection…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleNoteBlur}
      />

      {cakes.length === 0 && (
        <p className="my-collection-empty">
          No cakes here yet — add some from the "📁 Add to Collection" button on any cake's encyclopedia entry.
        </p>
      )}

      <div className="my-collection-grid">
        {cakes.map((cake) => (
          <div key={cake.id} className="card my-collection-card">
            <Link to={`/cake/${cake.id}`}>
              <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
              <h3>{cake.name}</h3>
            </Link>
            <button className="btn btn-secondary my-collection-remove" onClick={() => handleRemove(cake.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {cakes.length > 0 && (
        <section className="my-collection-share-section">
          <h2>Share this collection</h2>
          <SocialShareCard
            eyebrow="My Collection"
            title={collection.name}
            subtitle={`${cakes.length} ${cakes.length === 1 ? 'cake' : 'cakes'}`}
            colorHex="var(--gold)"
            shareUrl={shareUrl}
            shareText={`Check out my "${collection.name}" collection: ${cakeNames} 🎂 #LetThemEatCake`}
            filename={`${collection.id}-collection`}
          />
        </section>
      )}
    </main>
  )
}
