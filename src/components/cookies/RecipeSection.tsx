import { Link } from 'react-router-dom'
import type { Recipe } from '../../types/cookies/recipe'
import { LABS_BY_SLUG } from '../../lib/cookies/data'

export function RecipeSection({ recipe }: { recipe: Recipe }) {
  return (
    <section className="cookie-detail-section recipe-section" aria-labelledby="recipe-heading">
      <h2 id="recipe-heading">The Recipe</h2>
      <p className="recipe-intro">{recipe.intro}</p>

      <dl className="recipe-glance" aria-label="Recipe at a glance">
        <div className="recipe-glance-item"><dt>Yield</dt><dd>{recipe.yield}</dd></div>
        <div className="recipe-glance-item"><dt>Prep</dt><dd>{recipe.prepTime}</dd></div>
        {recipe.chillTime && <div className="recipe-glance-item"><dt>Chill</dt><dd>{recipe.chillTime}</dd></div>}
        <div className="recipe-glance-item"><dt>Bake</dt><dd>{recipe.bakeTime}</dd></div>
        <div className="recipe-glance-item"><dt>Total</dt><dd>{recipe.totalTime}</dd></div>
        <div className="recipe-glance-item"><dt>Difficulty</dt><dd className="recipe-glance-difficulty">{recipe.difficulty}</dd></div>
      </dl>

      <p className="recipe-meta-line"><strong>Oven:</strong> {recipe.temperature} &middot; <strong>Equipment:</strong> {recipe.equipment.join(', ')}</p>

      <div className="recipe-body-grid">
        <div className="recipe-ingredients">
          <h3>Ingredients</h3>
          {recipe.ingredientGroups.map((group) => (
            <div className="recipe-ingredient-group" key={group.title}>
              {recipe.ingredientGroups.length > 1 && <h4>{group.title}</h4>}
              <ul>
                {group.ingredients.map((ing, i) => (
                  <li key={i}>
                    <span className="recipe-ingredient-amount">{ing.amount}{ing.unit ? ` ${ing.unit}` : ''}</span>{' '}
                    {ing.ingredient}
                    {ing.note && <span className="recipe-ingredient-note"> ({ing.note})</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="recipe-instructions">
          <h3>Method</h3>
          <ol>
            {recipe.instructions.map((step) => {
              const lab = step.relatedLabSlug ? LABS_BY_SLUG.get(step.relatedLabSlug) : undefined
              return (
                <li key={step.step}>
                  {step.stage && <span className="recipe-step-stage">{step.stage}</span>}
                  <p>{step.instruction}</p>
                  {step.techniqueNote && <p className="recipe-technique-note">{step.techniqueNote}</p>}
                  {lab && (
                    <Link className="recipe-lab-link" to={`/cookies/workshop/labs/${lab.slug}`}>
                      Why this works &rarr; {lab.title}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <details className="recipe-details-disclosure">
        <summary>Baker's notes, storage &amp; variations</summary>
        <div className="recipe-disclosure-body">
          {recipe.bakersNotes.length > 0 && (
            <div className="recipe-notes-block">
              <h4>Baker's Notes</h4>
              <ul>
                {recipe.bakersNotes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
          )}

          <div className="recipe-notes-block">
            <h4>Storage &amp; Make Ahead</h4>
            <p>{recipe.storage}</p>
            {recipe.makeAhead && <p>{recipe.makeAhead}</p>}
            {recipe.freezing && <p>{recipe.freezing}</p>}
          </div>

          {recipe.variations && recipe.variations.length > 0 && (
            <div className="recipe-notes-block">
              <h4>Recipe Variations</h4>
              <ul>
                {recipe.variations.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            </div>
          )}

          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div className="recipe-notes-block">
              <h4>Substitutions</h4>
              <ul>
                {recipe.substitutions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {recipe.allergenNotes && <p className="recipe-allergen-note"><strong>Allergen notes:</strong> {recipe.allergenNotes}</p>}
        </div>
      </details>

      <p className="recipe-source-note">{recipe.sourceNote}</p>
    </section>
  )
}
