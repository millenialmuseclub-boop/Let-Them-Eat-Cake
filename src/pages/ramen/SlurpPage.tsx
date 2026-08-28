import { HUBS } from '../../data/ramen/hubs'
import { DiscoverFeatureCard } from '../../components/ramen/DiscoverFeatureCard'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'

// Bespoke page, same pattern as Workshop/Sommelier -- all 6 Slurp destinations are active this
// phase (master spec §23), so no Coming Soon tiles are needed here.
const slurpHub = HUBS.find((hub) => hub.path === '/slurp')!
const items = slurpHub.kind === 'landing' ? slurpHub.items : []

const RAMEN_IDS = ['ramen_nagoya_taiwan', 'ramen_hakata_tonkotsu', 'ramen_tokyo_shoyu', 'ramen_imabari_yakiton', 'ramen_kurume', 'ramen_sapporo_miso']

export function SlurpPage() {
  useDocumentTitle('Slurp | Let Them Eat')

  const scene = getSceneImage('slurp')

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="A diner at a Tokyo ramen shop counter" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Slurp</h1>
      <p>Ramen-shop culture, ordering, and real-world exploration — how to experience ramen, not just eat it.</p>

      <div className="discover-feature-grid">
        {items.map((item, i) => (
          <DiscoverFeatureCard
            key={item.to}
            to={item.to}
            title={item.title}
            description={item.description}
            cta={item.cta ?? 'Explore →'}
            ramenId={RAMEN_IDS[i]}
          />
        ))}
      </div>
    </main>
  )
}
