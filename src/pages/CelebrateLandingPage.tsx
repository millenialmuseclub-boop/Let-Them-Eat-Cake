import { Link } from 'react-router-dom'
import { getCake } from '../lib/data'
import { CakeHeroImage } from '../components/CakeHeroImage'
import './CelebrateLandingPage.css'

/**
 * Hand-picked real cakes with real Unsplash photography (the `occasion` field only exists on the
 * 30 cakes added in the later Encyclopedia expansion, none of which have fetched photos yet, so an
 * occasion-tag lookup would come up empty — these are chosen directly for genuine occasion fit instead.
 */
const ENTRIES: { to: string; title: string; description: string; cakeId: string }[] = [
  { to: '/wedding-planner', title: 'Wedding', description: 'A premium, detailed design and logistics experience.', cakeId: 'cake_kransekake' },
  { to: '/birthday-planner', title: 'Birthday', description: 'A joyful, personalized cake-planning experience.', cakeId: 'cake_rainbow_drip_2010s' },
  {
    to: '/other-celebrations',
    title: 'Other Celebrations',
    description: 'A lighter, faster planning experience for anniversaries, showers, graduations, holidays, and more.',
    cakeId: 'cake_black_forest',
  },
]

export function CelebrateLandingPage() {
  const entryCakes = ENTRIES.map((entry) => ({ entry, cake: getCake(entry.cakeId) }))

  return (
    <main className="page celebrate-landing-page">
      <h1>Celebrate</h1>
      <p>Design a cake with us — not fill out a form about one. Choose what you're celebrating to begin.</p>

      <div className="celebrate-entry-grid">
        {entryCakes.map(({ entry, cake }) => (
          <Link key={entry.to} to={entry.to} className="celebrate-entry-card">
            {cake && <CakeHeroImage cakeId={cake.id} variant="hero" alt={entry.title} />}
            <div className="celebrate-entry-content">
              <h2>{entry.title}</h2>
              <p>{entry.description}</p>
              <span className="btn celebrate-entry-cta">Begin →</span>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/time-machine" className="celebrate-time-machine-link">
        🎂 Curious what cake defined your birth year? Try the Birthday Time Machine →
      </Link>
    </main>
  )
}
