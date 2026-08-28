import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import './HomePage.css'

interface WorldCard {
  to: string
  emoji: string
  name: string
  tagline: string
}

const WORLDS: WorldCard[] = [
  {
    to: '/discover',
    emoji: '🍰',
    name: 'Cake',
    tagline: 'Celebration, baking, pastry, and cake culture.',
  },
  {
    to: '/ramen',
    emoji: '🍜',
    name: 'Ramen',
    tagline: 'Broth, tare, noodles, and the culture of the bowl.',
  },
  {
    to: '/cookies',
    emoji: '🍪',
    name: 'Cookies',
    tagline: 'Dough science, technique, and cookie culture.',
  },
  {
    to: '/noodles',
    emoji: '🍝',
    name: 'Noodles',
    tagline: 'Dish and noodle-type encyclopedias, and pasta culture.',
  },
]

/** The umbrella "What are we eating?" home for the merged app -- one editorial front door onto
    four distinct culinary worlds, rather than a launcher/folder of mini-apps. Each world keeps
    its own identity and bottom-tab navigation once entered; the top nav's world switcher always
    routes back here. */
export function HomePage() {
  useDocumentTitle('Let Them Eat')

  return (
    <main className="page home-page">
      <div className="home-brand">
        <h1>What are we eating?</h1>
        <p>One culinary discovery app, four worlds to explore — pick where to start.</p>
      </div>
      <div className="home-world-grid">
        {WORLDS.map((world) => (
          <Link key={world.to} to={world.to} className="card home-world-card">
            <span className="home-world-emoji" aria-hidden="true">
              {world.emoji}
            </span>
            <h2>{world.name}</h2>
            <p>{world.tagline}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
