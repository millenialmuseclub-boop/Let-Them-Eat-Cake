import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import trailsJson from '../../data/cookies/trails.json'
import type { CookieTrail } from '../../types/cookies/trails'
import { getCookie } from '../../lib/cookies/data'
import { CookieThumbnail } from '../../components/cookies/CookieHeroImage'

const TRAILS = trailsJson as CookieTrail[]

export function TrailsIndexPage() {
  useDocumentTitle('Cookie Trails')
  return (
    <main className="page-container">
      <h1>Cookie Trails</h1>
      <p>Themed paths through the Encyclopedia -- a starting point when you're not sure where to look.</p>
      <div className="trails-grid">
        {TRAILS.map((trail) => {
          const leadCookieId = trail.cookieIds[0]
          const leadCookie = leadCookieId ? getCookie(leadCookieId) : undefined
          return (
            <Link to={`/cookies/crumb/trails/${trail.id}`} className="collection-card collection-card-photo" key={trail.id}>
              <CookieThumbnail cookieId={leadCookieId ?? trail.id} name={leadCookie?.name ?? trail.title} />
              <div className="collection-card-body">
                <h2>{trail.title}</h2>
                <p>{trail.description}</p>
                <span className="collection-preview-count">{trail.cookieIds.length} cookies</span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
