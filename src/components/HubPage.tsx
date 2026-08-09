import { Link } from 'react-router-dom'
import type { Hub } from '../data/hubs'
import { getCakeImage } from '../lib/images'
import { DiscoverFeatureCard } from './DiscoverFeatureCard'
import './HubPage.css'

type LandingHub = Extract<Hub, { kind: 'landing' }>

export function HubPage({ hub }: { hub: LandingHub }) {
  return (
    <main className="page hub-page">
      <h1>{hub.title}</h1>
      <p>{hub.description}</p>
      <div className="hub-grid">
        {hub.items.map((item) => {
          const hasPhoto = item.cakeId && !!getCakeImage(item.cakeId)
          if (hasPhoto) {
            return (
              <DiscoverFeatureCard
                key={item.to}
                to={item.to}
                title={item.title}
                description={item.description}
                cta={item.cta ?? 'Explore →'}
                cakeId={item.cakeId}
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
