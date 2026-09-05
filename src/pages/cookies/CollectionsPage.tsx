import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { COLLECTIONS, getCookie } from '../../lib/cookies/data'
import { getCollectionFlagshipCookieId, getCookieImage } from '../../lib/cookies/images'
import { CookieThumbnail } from '../../components/cookies/CookieHeroImage'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'

export function CollectionsPage() {
  useDocumentTitle('Curated Collections')
  return (
    <main className="page-container">
      <PageHeroBand
        image={getCookieImage('cookie_macaron')}
        eyebrow="Curated Collections"
        title="Curated Collections"
        description="Editorial groupings of the Encyclopedia's cookies -- each collection references existing entries, nothing duplicated."
      />
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
