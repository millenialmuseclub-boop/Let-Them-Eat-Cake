import { Link } from 'react-router-dom'
import { HUBS } from '../../data/hubs'
import { DiscoverFeatureCard } from '../../components/cookies/DiscoverFeatureCard'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { getCookieImage, getSceneImage } from '../../lib/cookies/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './MainPage.css'

// Cookies previously reused Cake's generic HubPage for its landing route, which rendered as two
// bare text tiles with no photography -- HubPage only looks up Cake-world images (getCakeImage/
// getSceneImage from ../../lib/*), so Cookies items never matched and always fell through to the
// plain-Link branch. This mirrors Ramen's MainPage (a real hub page, not the shared generic one):
// a photographic hero band plus a feature-card grid using Cookies' own image data.
const mainHub = HUBS.find((h) => h.path === '/cookies' && h.kind === 'landing')!
const mainItems = mainHub.kind === 'landing' ? mainHub.items : []

const FEATURE_COOKIE_IDS: Record<string, string> = {
  '/cookies/encyclopedia': 'cookie_chocolate_chip',
  '/cookies/sommelier': 'cookie_french_sable',
}

export function CookiesMainPage() {
  useDocumentTitle('Let Them Eat — Cookie Encyclopedia, Atlas & Sommelier')

  const heroImage = getCookieImage('cookie_chocolate_chip') ?? getSceneImage('scene_baking_tray')

  return (
    <main className="page discover-page">
      <PageHeroBand
        image={heroImage}
        eyebrow="Cookies"
        title="Cookies"
        description="The world of cookies — dough science, techniques, and cookie culture."
      />

      <div className="discover-feature-grid">
        {mainItems.map((item) => {
          const cookieId = FEATURE_COOKIE_IDS[item.to]
          const image = cookieId ? getCookieImage(cookieId) : undefined
          return (
            <DiscoverFeatureCard
              key={item.to}
              to={item.to}
              title={item.title}
              description={item.description}
              icon="🍪"
              image={image}
            />
          )
        })}
      </div>

      <Link to="/about" className="discover-about-link">
        About &amp; Legal
      </Link>
    </main>
  )
}
