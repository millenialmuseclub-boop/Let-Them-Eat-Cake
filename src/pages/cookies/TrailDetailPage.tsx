import { useParams, Navigate } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { CookieCard } from '../../components/cookies/CookieCard'
import { getCookiesByIds } from '../../lib/cookies/data'
import trailsJson from '../../data/cookies/trails.json'
import type { CookieTrail } from '../../types/cookies/trails'

const TRAILS = trailsJson as CookieTrail[]

export function TrailDetailPage() {
  const { trailId = '' } = useParams()
  const trail = TRAILS.find((t) => t.id === trailId)
  useDocumentTitle(trail?.title ?? 'Trail')

  if (!trail) return <Navigate to="/cookies/crumb/trails" replace />
  const cookies = getCookiesByIds(trail.cookieIds)

  return (
    <main className="page-container">
      <h1>{trail.title}</h1>
      <p>{trail.description}</p>
      <div className="cookie-grid">
        {cookies.map((cookie) => (
          <CookieCard cookie={cookie} key={cookie.id} />
        ))}
      </div>
    </main>
  )
}
