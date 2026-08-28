import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { useCookieLibrary } from '../../lib/cookies/useCookieLibrary'
import { getCookie } from '../../lib/cookies/data'
import { CookieThumbnail } from '../../components/cookies/CookieHeroImage'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { getSceneImage } from '../../lib/cookies/images'

export function MyCookiesPage() {
  useDocumentTitle('My Cookies')
  const records = useCookieLibrary()

  const wantToTry = records.filter((r) => r.wantToTry)
  const baked = records.filter((r) => r.baked)
  const favorites = records.filter((r) => r.favorite)

  function renderGroup(title: string, group: typeof records) {
    if (group.length === 0) return null
    return (
      <section className="my-cookies-group" aria-labelledby={`group-${title}`}>
        <h2 id={`group-${title}`}>{title}</h2>
        <div className="my-cookies-list">
          {group.map((record) => {
            const cookie = getCookie(record.cookieId)
            if (!cookie) return null
            return (
              <Link to={`/cookies/encyclopedia/${cookie.id}`} className="my-cookies-item" key={record.cookieId}>
                <CookieThumbnail cookieId={cookie.id} name={cookie.name} />
                <span>{cookie.name}</span>
              </Link>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <main className="page-container my-cookies-page">
      <PageHeroBand
        image={getSceneImage('scene_baking_tray')}
        eyebrow="My Cookies"
        title="My Cookies"
        description="Your private cookie shelf -- saved locally on this device. Nothing here is sent anywhere."
      />
      {records.length === 0 && (
        <div className="my-cookies-empty">
          <p>Your shelf is empty. Save a cookie you want to try, have baked, or love, and it'll show up here.</p>
          <Link to="/cookies/encyclopedia" className="button-primary">Browse the Encyclopedia</Link>
        </div>
      )}
      {renderGroup('Favorites', favorites)}
      {renderGroup('Want to Try', wantToTry)}
      {renderGroup('Baked / Tried', baked)}
    </main>
  )
}
