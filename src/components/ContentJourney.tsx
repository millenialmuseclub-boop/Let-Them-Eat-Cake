import { Link } from 'react-router-dom'
import { ContentShare } from './ContentShare'
import { trackDiscovery } from '../lib/analytics'
import './ContentJourney.css'

const learning = {
  cake: { path: '/cake-anatomy', label: 'Understand the layers', sommelier: '/sommelier' },
  cookies: { path: '/cookies/workshop/labs/dough-lab', label: 'Explore dough and texture', sommelier: '/cookies/sommelier/find' },
  ramen: { path: '/ramen/ramen-anatomy', label: 'Understand the bowl', sommelier: '/ramen/sommelier/pair' },
  noodles: { path: '/noodles/workshop/lab/noodle-anatomy', label: 'Understand the noodle', sommelier: '/noodles/sommelier' },
}
// Geographic gate: never suggest Latin American travel on unrelated content.
function isLatinAmericanPlace(place: string): boolean {
  return /\b(Mexico|Argentina|Brazil|Chile|Peru|Colombia|Uruguay|Dominican Republic|Latin America|Nicaragua|Costa Rica|Cuba|Venezuela)\b/i.test(place)
}

export function ContentJourney({ world, id, title, path, notes, place = '' }: {
  world: keyof typeof learning; id: string; title: string; path: string; notes: string[]; place?: string
}) {
  const lesson = learning[world]
  return <aside className="content-journey" aria-label="Keep exploring">
    <h2>Follow the flavor</h2>
    <p>See how the same flavors and textures take a different shape in another kitchen.</p>
    <div className="content-journey-links">{notes.slice(0, 3).map(note => <Link key={note} to={`/explore?q=${encodeURIComponent(note.replace(/-forward$/, ''))}`} onClick={() => trackDiscovery('Related Content Clicked', { world, id })}>{note.replace(/-/g, ' ')} →</Link>)}</div>
    <div className="content-journey-links">
      <Link to={lesson.path}>{lesson.label} →</Link>
      <Link to={`${lesson.sommelier}${world === 'ramen' ? `?ramen=${encodeURIComponent(id)}` : world === 'cake' ? `?cake=${encodeURIComponent(id)}` : ''}`}>{world === 'cake' || world === 'ramen' ? 'Find a pairing' : 'Find your next favorite'} →</Link>
    </div>
    {isLatinAmericanPlace(place) && <div className="content-journey-travel"><h3>A taste of a place</h3><p>Curious about traveling in Latin America after exploring {title}? Discover destinations with Jet Set LatAM.</p><a href="https://apps.apple.com/us/app/jet-set-latam/id6810912801" target="_blank" rel="noopener noreferrer" onClick={() => trackDiscovery('Jet Set Clicked', { world, id })}>Explore Jet Set LatAM on the App Store →</a></div>}
    <ContentShare title={title} path={path} />
  </aside>
}
