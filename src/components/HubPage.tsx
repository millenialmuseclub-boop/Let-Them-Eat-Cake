import { Link } from 'react-router-dom'
import type { Hub } from '../data/hubs'
import { getCakeImage } from '../lib/images'
import { getSceneImage } from '../lib/sceneImages'
import { DiscoverFeatureCard } from './DiscoverFeatureCard'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import './HubPage.css'

type LandingHub = Extract<Hub, { kind: 'landing' }>

export function HubPage({ hub }: { hub: LandingHub }) {
  useDocumentTitle(`${hub.title} | Let Them Eat`)

  return (
    <main className="page hub-page">
      <h1>{hub.title}</h1>
      <p>{hub.description}</p>
      <div className="hub-grid">
        {hub.items.map((item) => {
          const hasCakePhoto = item.cakeId && !!getCakeImage(item.cakeId)
          const scene = !hasCakePhoto && item.sceneId ? getSceneImage(item.sceneId) : undefined

          if (hasCakePhoto || scene) {
            return (
              <DiscoverFeatureCard
                key={item.to}
                to={item.to}
                title={item.title}
                description={item.description}
                cta={item.cta ?? 'Explore →'}
                cakeId={hasCakePhoto ? item.cakeId : undefined}
                imageUrl={scene?.url}
                imageAlt={item.title}
                photographer={scene?.photographer}
                photographerUrl={scene?.photographerUrl}
                unsplashUrl={scene?.unsplashUrl}
              />
            )
          }
          return (
            <Link key={item.to} to={item.to} className="card hub-card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
