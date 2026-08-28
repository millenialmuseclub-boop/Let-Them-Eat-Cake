import { Link, useLocation } from 'react-router-dom'
import { HUBS, isHubActive, hubWorld, type HubWorld } from '../data/hubs'
import './BottomTabBar.css'

/** Which world's tabs to show, based on the current path. Home ("/") shows no tabs -- the world
    selector itself does the choosing. Everything else defaults to Cake, since Cake's own routes
    (e.g. /discover, /workshop) were never given a /cake prefix -- they predate the merge and
    must keep working exactly as they do today. */
function worldForPath(pathname: string): HubWorld | null {
  if (pathname === '/') return null
  if (pathname.startsWith('/ramen')) return 'ramen'
  if (pathname.startsWith('/cookies')) return 'cookies'
  if (pathname.startsWith('/noodles')) return 'noodles'
  return 'cake'
}

export function BottomTabBar() {
  const { pathname } = useLocation()
  const world = worldForPath(pathname)
  if (!world) return null

  const tabs = HUBS.filter((hub) => hubWorld(hub) === world)

  return (
    <nav className="bottom-tab-bar" aria-label="Primary">
      {tabs.map((hub) => (
        <Link key={hub.path} to={hub.path} className={isHubActive(hub, pathname) ? 'tab-bar-item active' : 'tab-bar-item'}>
          <span className="tab-bar-label">{hub.navLabel}</span>
        </Link>
      ))}
    </nav>
  )
}
