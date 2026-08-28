import { Link, useLocation } from 'react-router-dom'
import { worldFromPathname, type HubWorld } from '../data/hubs'
import './TopNavBar.css'

type WorldNavConfig = { home: string; saved: string; label: string; emoji: string }

const WORLD_CONFIG: Record<HubWorld, WorldNavConfig> = {
  cake: { home: '/discover', saved: '/notebook', label: 'Cake', emoji: '🍰' },
  ramen: { home: '/ramen', saved: '/ramen/my-ramen', label: 'Ramen', emoji: '🍜' },
  cookies: { home: '/cookies', saved: '/cookies/my-cookies', label: 'Cookies', emoji: '🍪' },
  noodles: { home: '/noodles', saved: '/noodles/my-noodles', label: 'Noodles', emoji: '🍝' },
}

export function TopNavBar() {
  const { pathname } = useLocation()
  const world = worldFromPathname(pathname)

  if (!world) {
    // On the home page, this is secondary navigation between magazine departments -- restrained
    // text, no icons/emoji/pills -- not an app switcher. The umbrella brand mark speaks for
    // itself; each world still gets its own full identity once you're inside it.
    return (
      <header className="top-nav-bar top-nav-bar-home">
        <span className="top-nav-brand" aria-label="Let Them Eat">
          <img src="/icon-master.svg" alt="" className="top-nav-icon" />
        </span>
        <nav className="top-nav-departments" aria-label="Worlds">
          {(Object.keys(WORLD_CONFIG) as HubWorld[]).map((w, i) => (
            <span key={w}>
              {i > 0 && <span className="top-nav-departments-divider" aria-hidden="true">&middot;</span>}
              <Link to={WORLD_CONFIG[w].home}>{WORLD_CONFIG[w].label}</Link>
            </span>
          ))}
        </nav>
      </header>
    )
  }

  const config = WORLD_CONFIG[world]

  return (
    <header className="top-nav-bar">
      <Link to={config.home} className="top-nav-brand" aria-label={`Let Them Eat — ${config.label} home`}>
        <img src="/icon-master.svg" alt="" className="top-nav-icon" />
      </Link>
      <div className="top-nav-actions">
        <Link to="/" className="top-nav-world-switcher" aria-label="Switch world">
          <span aria-hidden="true">{config.emoji}</span>
          <span className="top-nav-world-switcher-label">{config.label}</span>
        </Link>
        <Link to={config.saved} className="top-nav-favorites" aria-label={`Saved ${config.label}`}>
          ♥
        </Link>
      </div>
    </header>
  )
}
