import { HUBS } from '../../data/ramen/hubs'
import { DiscoverFeatureCard } from '../../components/ramen/DiscoverFeatureCard'
import { ComingSoonGrid } from '../../components/ramen/ComingSoonGrid'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './WorkshopPage.css'

// Bespoke page rather than the generic HubPage/HUBS-driven grid (same pattern as
// Cake's Celebrate/Discover bespoke pages, CAKE_REFERENCE_AUDIT.md §8) -- Workshop
// needs a "Coming Soon" disabled-tile treatment and grouped sections the generic
// HubSubItem/HubPage shape has no concept of, since every Cake hub item is always a
// live route rendered in one flat grid.
const workshopHub = HUBS.find((hub) => hub.path === '/workshop')!
const activeItems = workshopHub.kind === 'landing' ? workshopHub.items : []

// Final structure (master pass §7): Understand the Bowl -> Master the Components -> Solve a
// Problem -> Curated Kitchen, in that order.
const GROUP_ORDER = ['Understand the Bowl', 'Master the Components', 'Solve a Problem']

// Ramen Anatomy and Build a Bowl keep their existing ramenId-based tile photography. The Labs and
// Troubleshooter use real scene photography (sceneImages.json) instead, since none of them are
// about one specific canonical ramen -- see lib/sceneImages.ts.
const TILE_RAMEN_ID: Record<string, string> = {
  '/ramen-anatomy': 'ramen_tokyo_shoyu',
  '/build-a-bowl': 'ramen_hakata_tonkotsu',
}

// Calculators (Recipe Scaler, Broth Ratio, Noodle Hydration, Egg Timer) stay removed from V1
// scope. Ajitama Lab, Chashu Lab, and Troubleshooter are now live and dropped from this list.
const COMING_SOON: string[] = []

export function WorkshopPage() {
  useDocumentTitle('Workshop | Let Them Eat')

  return (
    <main className="page workshop-page">
      <h1>Workshop</h1>
      <p>Ramen technique, science, and construction — build and understand your next bowl.</p>

      {GROUP_ORDER.map((group) => {
        const groupItems = activeItems.filter((item) => item.group === group)
        if (groupItems.length === 0) return null
        return (
          <section key={group} className="workshop-group">
            <h2 className="workshop-group-heading">{group}</h2>
            <div className="discover-feature-grid">
              {groupItems.map((item) => {
                const scene = getSceneImage(item.to.replace('/', ''))
                const ramenId = TILE_RAMEN_ID[item.to]
                return (
                  <DiscoverFeatureCard
                    key={item.to}
                    to={item.to}
                    title={item.title}
                    description={item.description}
                    cta={item.cta ?? 'Explore →'}
                    ramenId={ramenId}
                    imageUrl={!ramenId ? scene?.url : undefined}
                    photographer={scene?.photographer}
                    source={scene?.source}
                  />
                )
              })}
            </div>
          </section>
        )
      })}

      <section className="workshop-group">
        <h2 className="workshop-group-heading">Curated Kitchen</h2>
        <div className="discover-feature-grid">
          <DiscoverFeatureCard
            to="/ramen/curated-kitchen"
            title="Curated Kitchen"
            description="Contextual tools and ingredients for whatever you're building -- also reachable from Main."
            cta="Enter the Kitchen →"
          />
        </div>
      </section>

      {COMING_SOON.length > 0 && (
        <>
          <h2 className="coming-soon-heading">Coming Soon</h2>
          <ComingSoonGrid items={COMING_SOON} />
        </>
      )}
    </main>
  )
}
