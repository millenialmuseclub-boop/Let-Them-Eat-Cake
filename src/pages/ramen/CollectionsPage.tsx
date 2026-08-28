import { Link } from 'react-router-dom'
import { collections } from '../../lib/ramen/data'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'
import './CollectionsPage.css'

export function CollectionsPage() {
  useDocumentTitle('Curated Collections | Let Them Eat Ramen')

  const scene = getSceneImage('collections')

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="An overhead view of a ramen bowl with fresh vegetables" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Curated Collections</h1>
      <p>Editorial groupings of the Encyclopedia's canonical ramen -- each collection references existing entries, nothing duplicated.</p>

      <div className="collections-grid">
        {collections.map((collection) => (
          <Link key={collection.id} to={`/ramen/collections/${collection.id}`} className="card collections-card">
            <RamenThumbnail ramenId={collection.ramenIds[0]} alt={collection.title} />
            <h3>{collection.title}</h3>
            <p>{collection.description}</p>
            <span className="tag">
              {collection.ramenIds.length} {collection.ramenIds.length === 1 ? 'bowl' : 'bowls'}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
