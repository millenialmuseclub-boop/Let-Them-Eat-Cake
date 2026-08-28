import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import trailsJson from '../../data/cookies/trails.json'
import type { CookieTrail } from '../../types/cookies/trails'

const TRAILS = trailsJson as CookieTrail[]

export function TrailsIndexPage() {
  useDocumentTitle('Cookie Trails')
  return (
    <main className="page-container">
      <h1>Cookie Trails</h1>
      <p>Themed paths through the Encyclopedia -- a starting point when you're not sure where to look.</p>
      <div className="trails-grid">
        {TRAILS.map((trail) => (
          <Link to={`/cookies/crumb/trails/${trail.id}`} className="collection-card" key={trail.id}>
            <h2>{trail.title}</h2>
            <p>{trail.description}</p>
            <span className="collection-preview-count">{trail.cookieIds.length} cookies</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
