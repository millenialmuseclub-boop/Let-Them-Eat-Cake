import { Link } from 'react-router-dom'
import type { Hub } from '../data/hubs'
import { getCakeImage } from '../lib/images'
import { CakeHeroImage } from './CakeHeroImage'
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
          return (
            <Link key={item.to} to={item.to} className={hasPhoto ? 'hub-photo-card' : 'card hub-card'}>
              {hasPhoto && <CakeHeroImage cakeId={item.cakeId!} variant="hero" alt={item.title} />}
              <div className={hasPhoto ? 'hub-photo-card-content' : undefined}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {hasPhoto && <span className="btn hub-photo-card-cta">{item.cta ?? 'Explore →'}</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
