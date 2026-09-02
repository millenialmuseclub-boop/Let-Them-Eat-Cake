import { HUBS } from '../../data/ramen/hubs'
import { DiscoverFeatureCard } from '../../components/ramen/DiscoverFeatureCard'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'

// Bespoke page, same pattern as WorkshopPage -- active modes as DiscoverFeatureCard tiles.
// Matches Cake's Sommelier visual structure (feature-card grid into modes,
// CAKE_REFERENCE_AUDIT.md §7) rather than Cake's own query-param mode toggle, since Ramen's
// modes are real distinct routes here. "Create a Bowl" (master spec §22) is not built anywhere
// in the app family yet, so no placeholder tile is shown for it.
const sommelierHub = HUBS.find((hub) => hub.path === '/sommelier')!
const activeItems = sommelierHub.kind === 'landing' ? sommelierHub.items : []

export function SommelierPage() {
  useDocumentTitle('Ramen Sommelier | Let Them Eat')

  const scene = getSceneImage('sommelier')

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="A Japanese table setting with ramen, yakitori, and a beer" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Ramen Sommelier</h1>
      <p>Structured taste and pairing intelligence — find the right bowl, or the right pairing for one.</p>

      <div className="discover-feature-grid">
        {activeItems.map((item, i) => (
          <DiscoverFeatureCard
            key={item.to}
            to={item.to}
            title={item.title}
            description={item.description}
            cta={item.cta ?? 'Explore →'}
            ramenId={i === 0 ? 'ramen_kumamoto' : 'ramen_yokohama_iekei'}
          />
        ))}
      </div>
    </main>
  )
}
