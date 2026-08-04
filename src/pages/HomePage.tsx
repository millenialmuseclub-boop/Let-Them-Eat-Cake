import { Link } from 'react-router-dom'
import './HomePage.css'

const FEATURES = [
  {
    to: '/time-machine',
    title: 'Birthday Time Machine',
    description: 'Enter your date of birth to discover the cake that defined your exact year — with its history and full recipe.',
  },
  {
    to: '/atlas',
    title: 'Global Cake Atlas',
    description: 'Search any country for its most popular cake, complete with a full recipe and background story.',
  },
  {
    to: '/sommelier',
    title: 'Cake Sommelier',
    description: 'Pick a cake and see which drinks pair best with it, scored by flavor science.',
  },
  {
    to: '/persona-match',
    title: 'Cosmic & Mood Match',
    description: 'Match your zodiac sign, your current mood, or your aesthetic to a cake built for it.',
  },
  {
    to: '/pantry-raid',
    title: 'Pantry Raid',
    description: "Check off what's in your kitchen and find the emergency cake that needs the least shopping.",
  },
  {
    to: '/wedding-cake-planner',
    title: 'Wedding Cake Planner',
    description: 'Set your culture, guest count, season, and aesthetic to get a full master planning sheet — structure, flavors, allergens, and decor.',
  },
  {
    to: '/assembly-lab',
    title: 'Assembly Lab',
    description: 'Pick a sponge, filling, frosting, and garnish, watch your cake come together live, and get the full recipe to bake it.',
  },
  {
    to: '/bake-off',
    title: 'Bake Off',
    description: "Submit your Assembly Lab creation, vote on the community's favorites, and compete under this month's theme.",
  },
  {
    to: '/encyclopedia',
    title: 'Cake Encyclopedia',
    description: 'Browse the full archive of 50 cakes — history, flavor profile, traditional recipe, and related finds for every entry.',
  },
]

export function HomePage() {
  return (
    <main className="page home-page">
      <section className="home-hero">
        <h1>Let Them Eat Cake</h1>
        <p>The ultimate confectionery universe for history, moods, regional roots, and perfect pairings.</p>
      </section>
      <section className="home-grid">
        {FEATURES.map((feature) => (
          <Link key={feature.to} to={feature.to} className="card home-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
