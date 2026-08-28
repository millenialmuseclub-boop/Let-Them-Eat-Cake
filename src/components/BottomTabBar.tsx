import { Link, useLocation } from 'react-router-dom'
import { HUBS, isHubActive, hubWorld, worldFromPathname } from '../data/hubs'
import './BottomTabBar.css'

export function BottomTabBar() {
  const { pathname } = useLocation()
  const world = worldFromPathname(pathname)
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
