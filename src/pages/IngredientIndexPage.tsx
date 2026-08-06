import { Link } from 'react-router-dom'
import { getAllIngredients } from '../lib/ingredients'
import './IngredientIndexPage.css'

export function IngredientIndexPage() {
  const ingredients = getAllIngredients()

  return (
    <main className="page ingredient-index-page">
      <h1>Ingredient Explorer</h1>
      <p>Every ingredient across the Encyclopedia, and every cake it shows up in.</p>

      <div className="ingredient-index-grid">
        {ingredients.map((ingredient) => (
          <Link key={ingredient.slug} to={`/ingredient/${ingredient.slug}`} className="card ingredient-index-card">
            <h3>{ingredient.displayName}</h3>
            <p>
              {ingredient.cakeIds.length} {ingredient.cakeIds.length === 1 ? 'cake' : 'cakes'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
