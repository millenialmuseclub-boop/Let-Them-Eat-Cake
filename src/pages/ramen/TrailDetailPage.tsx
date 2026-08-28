import { Link, useParams } from 'react-router-dom'
import { getTrail } from '../../lib/ramen/slurp'
import { getRamen } from '../../lib/ramen/data'
import { RamenHeroImage } from '../../components/ramen/RamenHeroImage'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import '../../components/ramen/GuideArticle.css'
import './TrailDetailPage.css'

export function TrailDetailPage() {
  const { id } = useParams<{ id: string }>()
  const trail = id ? getTrail(id) : undefined
  const relatedRamen = trail ? getRamen(trail.relatedRamenId) : undefined

  useDocumentTitle(trail ? `${trail.title} Trail | Let Them Eat Ramen` : 'Trail Not Found | Let Them Eat Ramen')

  if (!trail || !relatedRamen) {
    return (
      <main className="page">
        <h1>Trail not found</h1>
        <p>
          We couldn't find that trail. <Link to="/ramen/slurp/trails">Back to Ramen Trails →</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="page trail-detail-page">
      <div className="card trail-detail-hero">
        <RamenHeroImage ramenId={relatedRamen.id} variant="hero" alt={trail.title} />
        <span className="tag">{trail.region}</span>
        <h1>{trail.title}</h1>
      </div>

      <section className="card guide-section">
        <h2>Regional Context</h2>
        <p>{trail.regionalContext}</p>
      </section>

      <section className="card guide-section">
        <h2>What Defines the Style</h2>
        <p>{trail.whatDefines}</p>
      </section>

      <section className="card guide-section">
        <h2>What to Notice</h2>
        <p>{trail.whatToNotice}</p>
      </section>

      <section className="card guide-section">
        <h2>How to Approach the Experience</h2>
        <p>{trail.howToApproach}</p>
      </section>

      <Link to={`/ramen/ramen/${relatedRamen.id}`} className="encyclopedia-link">
        View {relatedRamen.name} in the Encyclopedia →
      </Link>
    </main>
  )
}
