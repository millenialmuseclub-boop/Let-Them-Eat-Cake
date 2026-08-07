import { Link, useParams } from 'react-router-dom'
import { bakingTraditions } from '../lib/data'
import { getTraditionCakes } from '../lib/bakingTraditions'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { SocialShareCard } from '../components/SocialShareCard'
import './BakingTraditionDetailPage.css'

export function BakingTraditionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const tradition = bakingTraditions.find((t) => t.id === id)

  if (!tradition) {
    return (
      <main className="page tradition-detail-page">
        <h1>Tradition not found</h1>
        <p>
          We couldn't find that tradition. <Link to="/traditions">Browse all Baking Traditions →</Link>
        </p>
      </main>
    )
  }

  const cakes = getTraditionCakes(tradition)

  return (
    <main className="page tradition-detail-page">
      <h1>{tradition.title}</h1>
      <p className="tradition-detail-specialty">{tradition.specialty}</p>
      <p>{tradition.description}</p>

      <div className="tradition-detail-grid">
        {cakes.map((cake) => (
          <Link key={cake.id} to={`/cake/${cake.id}`} className="card tradition-detail-card">
            <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
            <h3>{cake.name}</h3>
            <p>{cake.description}</p>
          </Link>
        ))}
      </div>

      <section className="tradition-detail-share">
        <h2>Share this tradition</h2>
        <SocialShareCard
          eyebrow="Baking Tradition"
          title={tradition.title}
          subtitle={tradition.specialty}
          colorHex="var(--gold)"
          shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
          shareText={`${tradition.title}: ${tradition.description}`}
          filename={`${tradition.id}-tradition`}
        />
      </section>
    </main>
  )
}
