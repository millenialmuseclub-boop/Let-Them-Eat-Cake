import { Link } from 'react-router-dom'
import './TopNavBar.css'

export function TopNavBar() {
  return (
    <header className="top-nav-bar">
      <Link to="/discover" className="top-nav-brand" aria-label="Let Them Eat Cake — Home">
        <img src="/icon-master.svg" alt="" className="top-nav-icon" />
      </Link>
      <Link to="/notebook" className="top-nav-favorites" aria-label="Saved Cakes">
        ♥
      </Link>
    </header>
  )
}
