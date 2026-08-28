import { bakingTraditions } from '../lib/data'
import { getTraditionCakes } from '../lib/bakingTraditions'
import { getCakeImage } from '../lib/images'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import './BakingTraditionsIndexPage.css'

export function BakingTraditionsIndexPage() {
  return (
    <main className="page baking-traditions-index-page">
      <h1>Baking Traditions</h1>
      <p>Editorial spotlights on the baking styles and techniques that shape cakes region by region.</p>

      <div className="traditions-grid">
        {bakingTraditions.map((tradition) => {
          const traditionCakes = getTraditionCakes(tradition)
          const coverCake = traditionCakes.find((c) => getCakeImage(c.id))
          return (
            <DiscoverFeatureCard
              key={tradition.id}
              to={`/traditions/${tradition.id}`}
              title={tradition.title}
              description={tradition.specialty}
              cta="Explore Tradition →"
              meta={`${traditionCakes.length} ${traditionCakes.length === 1 ? 'cake' : 'cakes'}`}
              cakeId={coverCake?.id}
            />
          )
        })}
      </div>
    </main>
  )
}
