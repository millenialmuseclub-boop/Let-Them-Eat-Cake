import { Link } from 'react-router-dom'
import { HUBS } from '../../data/ramen/hubs'
import { DiscoverFeatureCard } from '../../components/ramen/DiscoverFeatureCard'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'
import './MainPage.css'

// Matches Cake's actual (thin, launcher-style) Discover architecture per CAKE_REFERENCE_AUDIT.md
// §3 -- a brand header plus a feature-card grid into this hub's own sub-destinations, plus the
// single "About & Legal" text link at the bottom (§1/§4 of the legal-footer research). The route
// stays '/discover' -- Cake's own production nav renders this same route under the label "Main"
// (CAKE_REFERENCE_AUDIT.md §2), so Ramen follows that precedent rather than renaming the URL.
const mainHub = HUBS.find((hub) => hub.path === '/discover')!
const mainItems = mainHub.kind === 'landing' ? mainHub.items : []

const RAMEN_IDS: Record<string, string> = {
  '/ramen/encyclopedia': 'ramen_sapporo_miso',
  '/ramen/atlas': 'ramen_kurume',
  '/ramen/personality-quiz': 'ramen_tokyo_shoyu',
  '/ramen/collections': 'ramen_yokohama_iekei',
  '/ramen/curated-kitchen': 'ramen_kumamoto',
}

export function MainPage() {
  useDocumentTitle('Let Them Eat — Ramen Encyclopedia, Atlas & Sommelier')

  const scene = getSceneImage('main')

  return (
    <main className="page discover-page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="An overhead view of a bowl of ramen" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <div className="discover-brand">
        <h1>Let Them Eat</h1>
        <p>Explore ramen culture, master its components, and discover the bowls that define it.</p>
      </div>

      <div className="discover-feature-grid">
        {mainItems.map((item) => (
          <DiscoverFeatureCard
            key={item.to}
            to={item.to}
            title={item.title}
            description={item.description}
            cta={item.cta ?? 'Explore →'}
            ramenId={RAMEN_IDS[item.to] ?? 'ramen_sapporo_miso'}
          />
        ))}
      </div>

      <Link to="/ramen/about" className="discover-about-link">
        About &amp; Legal
      </Link>
    </main>
  )
}
