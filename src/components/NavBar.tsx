import { Link, NavLink, useLocation } from 'react-router-dom'
import { HUBS, isHubActive } from '../data/hubs'
import './NavBar.css'

export function NavBar() {
  const { pathname } = useLocation()

  return (
    <header className="nav-bar">
      <NavLink to="/" className="nav-brand" end>
        Let Them Eat Cake
      </NavLink>
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Home
        </NavLink>
        {HUBS.map((hub) => (
          <Link key={hub.path} to={hub.path} className={isHubActive(hub, pathname) ? 'nav-link active' : 'nav-link'}>
            {hub.navLabel}
          </Link>
        ))}
      </nav>
    </header>
  )
}
