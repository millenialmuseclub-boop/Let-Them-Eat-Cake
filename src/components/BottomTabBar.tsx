import { Link, useLocation } from 'react-router-dom'
import { HUBS, activeHubPath, hubWorld, worldFromPathname } from '../data/hubs'
import './BottomTabBar.css'

export function BottomTabBar() {
  const { pathname } = useLocation()
  const world = worldFromPathname(pathname)
  if (!world) return null

  const tabs = HUBS.filter((hub) => hubWorld(hub) === world)
  const active = activeHubPath(pathname)

  return (
    <nav className="bottom-tab-bar" aria-label="Primary">
      {tabs.map((hub) => (
        <Link key={hub.path} to={hub.path} aria-current={hub.path === active ? 'page' : undefined} className={hub.path === active ? 'tab-bar-item active' : 'tab-bar-item'}>
          <span className="tab-bar-label">{hub.navLabel}</span>
        </Link>
      ))}
    </nav>
  )
}
