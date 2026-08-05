import { Link } from 'react-router-dom'
import { HUBS } from '../data/hubs'
import './HomePage.css'

export function HomePage() {
  return (
    <main className="page home-page">
      <section className="home-hero">
        <h1>Let Them Eat Cake</h1>
        <p>The ultimate confectionery universe for history, moods, regional roots, and perfect pairings.</p>
      </section>
      <section className="home-grid">
        {HUBS.map((hub) => (
          <Link key={hub.path} to={hub.path} className="card home-card">
            <h2>{hub.title}</h2>
            <p>{hub.description}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
