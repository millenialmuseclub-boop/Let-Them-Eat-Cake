import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { COLLECTIONS, getCookie } from '../../lib/cookies/data'
import { getCollectionFlagshipCookieId } from '../../lib/cookies/images'
import { CookieThumbnail } from '../../components/cookies/CookieHeroImage'

export function CollectionsPage() {
  useDocumentTitle('Curated Collections')
  return (
    <main className="page-container">
      <h1>Curated Collections</h1>
      <div className="collections-grid">
        {COLLECTIONS.map((collection) => {
          const flagshipId = getCollectionFlagshipCookieId(collection.id)
          const flagship = flagshipId ? getCookie(flagshipId) : undefined
          return (
            <Link to={`/cookies/collections/${collection.id}`} className="collection-card collection-card-photo" key={collection.id}>
              <CookieThumbnail cookieId={flagshipId ?? collection.id} name={flagship?.name ?? collection.title} />
              <div className="collection-card-body">
                <h2>{collection.title}</h2>
                <p>{collection.description}</p>
                <span className="collection-preview-count">{collection.cookieIds.length} cookies</span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
