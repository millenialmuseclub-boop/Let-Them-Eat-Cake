import { Link, useParams } from 'react-router-dom'
import { getIngredient } from '../lib/ingredients'
import { getCake } from '../lib/data'
import './IngredientDetailPage.css'

const DIET_LABELS: Record<string, string> = {
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
  'egg-free': 'Egg-free',
  'nut-free': 'Nut-free',
}

export function IngredientDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const ingredient = slug ? getIngredient(slug) : undefined

  if (!ingredient) {
    return (
      <main className="page ingredient-detail-page">
        <h1>Ingredient not found</h1>
        <p>
          We couldn't find that ingredient. <Link to="/ingredients">Browse all ingredients →</Link>
        </p>
      </main>
    )
  }

  const cakes = ingredient.cakeIds.map((id) => getCake(id)).filter((c) => c !== undefined)

  return (
    <main className="page ingredient-detail-page">
      <h1>{ingredient.displayName}</h1>
      <p>
        Used in {cakes.length} {cakes.length === 1 ? 'cake' : 'cakes'} in the Encyclopedia.
      </p>

      {ingredient.substitutions.length > 0 && (
        <section className="card ingredient-detail-section">
          <h2>Substitutions seen across recipes</h2>
          <ul className="ingredient-substitution-list">
            {ingredient.substitutions.map((sub, i) => (
              <li key={i}>
                <span className="tag">{DIET_LABELS[sub.diet] ?? sub.diet}</span> {sub.replacement}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="ingredient-detail-section">
        <h2>Cakes using {ingredient.displayName.toLowerCase()}</h2>
        <div className="ingredient-cake-grid">
          {cakes.map((cake) => (
            <Link key={cake.id} to={`/cake/${cake.id}`} className="card ingredient-cake-card">
              <h3>{cake.name}</h3>
              <p>{cake.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
