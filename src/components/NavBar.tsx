import { NavLink } from 'react-router-dom'
import { HUBS } from '../data/hubs'
import './NavBar.css'

const LINKS = [{ to: '/', label: 'Home', end: true }, ...HUBS.map((hub) => ({ to: hub.path, label: hub.navLabel, end: false }))]

export function NavBar() {
  return (
    <header className="nav-bar">
      <NavLink to="/" className="nav-brand" end>
        Let Them Eat Cake
      </NavLink>
      <nav>
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
