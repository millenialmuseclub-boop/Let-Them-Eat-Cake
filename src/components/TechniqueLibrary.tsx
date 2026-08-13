import { techniques } from '../lib/data'
import { getProductsForTechnique } from '../lib/affiliateProducts'
import { CuratorsToolDrawer } from './CuratorsToolDrawer'
import type { TechniqueCategory } from '../types/technique'
import './TechniqueLibrary.css'

const CATEGORY_ORDER: TechniqueCategory[] = ['Mixing', 'Baking', 'Layering & Filling', 'Frosting', 'Decorating', 'Chocolate', 'Finishing']

export function TechniqueLibrary() {
  return (
    <div className="technique-library">
      {CATEGORY_ORDER.map((category) => {
        const categoryTechniques = techniques.filter((t) => t.category === category)
        if (categoryTechniques.length === 0) return null

        return (
          <section key={category} className="technique-category">
            <h3 className="technique-category-heading">{category}</h3>
            <div className="technique-category-list">
              {categoryTechniques.map((technique) => (
                <details key={technique.id} className="technique-entry">
                  <summary>{technique.name}</summary>
                  <div className="technique-entry-body">
                    <p>{technique.whatItIs}</p>
                    <ol className="technique-steps">
                      {technique.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    <p className="technique-mistake">
                      <strong>⚠️ Common mistake:</strong> {technique.commonMistake}
                    </p>
                    <p className="technique-tip">
                      <strong>👩‍🍳 Chef tip:</strong> {technique.chefTip}
                    </p>
                    <CuratorsToolDrawer products={getProductsForTechnique(technique.id)} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
