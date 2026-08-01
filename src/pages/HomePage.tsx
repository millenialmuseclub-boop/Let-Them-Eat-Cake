import { Link } from 'react-router-dom'
import './HomePage.css'

const FEATURES = [
  {
    to: '/time-machine',
    title: 'Birthday Time Machine',
    description: 'Enter your date of birth to discover the cake that defined your decade — with its history and full recipe.',
  },
  {
    to: '/atlas',
    title: 'Global Cake Atlas',
    description: 'Explore iconic cakes from around the world and collect passport stamps as you go.',
  },
  {
    to: '/sommelier',
    title: 'Cake Sommelier',
    description: 'Pick a cake and see which drinks pair best with it, scored by flavor science.',
  },
  {
    to: '/persona-match',
    title: 'Cosmic & Mood Match',
    description: 'Match your zodiac sign, your current mood, or your aesthetic to a cake built for it.',
  },
  {
    to: '/pantry-raid',
    title: 'Pantry Raid',
    description: "Check off what's in your kitchen and find the emergency cake that needs the least shopping.",
  },
]

export function HomePage() {
  return (
    <main className="page home-page">
      <section className="home-hero">
        <h1>Let Them Eat Cake</h1>
        <p>The ultimate confectionery universe for history, moods, regional roots, and perfect pairings.</p>
      </section>
      <section className="home-grid">
        {FEATURES.map((feature) => (
          <Link key={feature.to} to={feature.to} className="card home-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
