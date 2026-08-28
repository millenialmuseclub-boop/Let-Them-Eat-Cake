import { Link } from 'react-router-dom'
import { trails } from '../../lib/ramen/data'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './TrailsIndexPage.css'

export function TrailsIndexPage() {
  useDocumentTitle('Ramen Trails | Let Them Eat')

  return (
    <main className="page">
      <h1>Ramen Trails</h1>
      <p>Editorial guides to regional styles -- what defines them, what to notice, and how to approach the experience. Not a restaurant directory.</p>

      <div className="trails-grid">
        {trails.map((trail) => (
          <Link key={trail.id} to={`/ramen/slurp/trails/${trail.id}`} className="card trails-card">
            <RamenThumbnail ramenId={trail.relatedRamenId} alt={trail.title} />
            <span className="tag">{trail.region}</span>
            <h3>{trail.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}
