import { Link } from 'react-router-dom'
import { WeddingCakePlannerPage } from './WeddingCakePlannerPage'
import './BirthdayPlannerPage.css'

export function BirthdayPlannerPage() {
  return (
    <WeddingCakePlannerPage
      lockedOccasion="birthday"
      headerContent={
        <Link to="/time-machine" className="card birthday-time-machine-link">
          🎂 Curious what cake defined your birth year? Try the Birthday Time Machine →
        </Link>
      }
    />
  )
}
