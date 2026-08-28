import { Link, useLocation } from 'react-router-dom'
import './TopNavBar.css'

type WorldNavConfig = { home: string; saved: string; label: string; emoji: string }

const WORLD_CONFIG: Record<'cake' | 'ramen' | 'cookies' | 'noodles', WorldNavConfig> = {
  cake: { home: '/discover', saved: '/notebook', label: 'Cake', emoji: '🍰' },
  ramen: { home: '/ramen', saved: '/ramen/my-ramen', label: 'Ramen', emoji: '🍜' },
  cookies: { home: '/cookies', saved: '/cookies/my-cookies', label: 'Cookies', emoji: '🍪' },
  noodles: { home: '/noodles', saved: '/noodles/my-noodles', label: 'Noodles', emoji: '🍝' },
}

function currentWorld(pathname: string): keyof typeof WORLD_CONFIG | null {
  if (pathname === '/') return null
  if (pathname.startsWith('/ramen')) return 'ramen'
  if (pathname.startsWith('/cookies')) return 'cookies'
  if (pathname.startsWith('/noodles')) return 'noodles'
  return 'cake'
}

export function TopNavBar() {
  const { pathname } = useLocation()
  const world = currentWorld(pathname)

  if (!world) {
    // On the world-selector home itself, there's nothing to switch away from or save yet.
    return (
      <header className="top-nav-bar">
        <span className="top-nav-brand" aria-label="Let Them Eat">
          <img src="/icon-master.svg" alt="" className="top-nav-icon" />
        </span>
        <span />
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
