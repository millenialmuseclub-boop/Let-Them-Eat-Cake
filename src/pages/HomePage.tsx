import { Link } from 'react-router-dom'
import './HomePage.css'

const FEATURES = [
  {
    to: '/time-machine',
    title: 'Birthday Time Machine',
    description: 'Enter your date of birth — or scroll the decade timeline — to discover the cake that defined an era, with its history and full recipe.',
  },
  {
    to: '/atlas',
    title: 'Global Cake Atlas',
    description: 'Click a pin on an interactive world map — or search directly — for any country’s most popular cake, complete with a full recipe and background story.',
  },
  {
    to: '/sommelier',
    title: 'Cake Sommelier',
    description: 'Start from a cake to find its best drink pairings, or start from a drink to find the cakes that match it — scored by flavor science.',
  },
  {
    to: '/persona-match',
    title: 'Cake Personality Quiz',
    description: 'Answer four quick questions and get matched to a cake personality, complete with a flavor radar chart and a shareable card.',
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
  {
    to: '/notebook',
    title: 'Pastry Notebook',
    description: 'Save your favorite cakes and cake personalities to come back to anytime — stored right in your browser.',
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
