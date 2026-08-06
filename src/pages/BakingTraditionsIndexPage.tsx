import { Link } from 'react-router-dom'
import { bakingTraditions } from '../lib/data'
import { getTraditionCakes } from '../lib/bakingTraditions'
import './BakingTraditionsIndexPage.css'

export function BakingTraditionsIndexPage() {
  return (
    <main className="page baking-traditions-index-page">
      <h1>🌍 Baking Traditions</h1>
      <p>Editorial spotlights on the baking styles and techniques that shape cakes region by region.</p>

      <div className="traditions-grid">
        {bakingTraditions.map((tradition) => (
          <Link key={tradition.id} to={`/traditions/${tradition.id}`} className="card tradition-card">
            <h2>{tradition.title}</h2>
            <p>{tradition.specialty}</p>
            <span className="tradition-card-count">{getTraditionCakes(tradition).length} cakes</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
