import { Link } from 'react-router-dom'
import type { Hub } from '../data/hubs'
import './HubPage.css'

type LandingHub = Extract<Hub, { kind: 'landing' }>

export function HubPage({ hub }: { hub: LandingHub }) {
  return (
    <main className="page hub-page">
      <h1>{hub.title}</h1>
      <p>{hub.description}</p>
      <div className="hub-grid">
        {hub.items.map((item) => (
          <Link key={item.to} to={item.to} className="card hub-card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
