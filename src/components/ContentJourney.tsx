import { Link } from 'react-router-dom'
import { ContentShare } from './ContentShare'
import { trackDiscovery } from '../lib/analytics'
import './ContentJourney.css'
import { TasteThisPlace } from './TasteThisPlace'

const learning = {
  cake: { path: '/cake-anatomy', label: 'Understand the layers', sommelier: '/sommelier' },
  cookies: { path: '/cookies/workshop/labs/dough-lab', label: 'Explore dough and texture', sommelier: '/cookies/sommelier/find' },
  ramen: { path: '/ramen/ramen-anatomy', label: 'Understand the bowl', sommelier: '/ramen/sommelier/pair' },
  noodles: { path: '/noodles/workshop/lab/noodle-anatomy', label: 'Understand the noodle', sommelier: '/noodles/sommelier' },
}
export function ContentJourney({ world, id, title, path, notes }: {
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
    <TasteThisPlace foodId={id} />
    <ContentShare title={title} path={path} />
  </aside>
}
