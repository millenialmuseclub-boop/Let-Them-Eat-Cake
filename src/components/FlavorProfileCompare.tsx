import type { CakeProfile, FlavorProfile } from '../types/cake'
import type { DrinkProfile } from '../types/sommelier'
import './FlavorProfileCompare.css'

const DIMENSIONS: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'fatRichness', label: 'Richness' },
  { key: 'acidity', label: 'Acidity' },
  { key: 'intensity', label: 'Intensity' },
]

export function FlavorProfileCompare({ cake, drink }: { cake: CakeProfile; drink: DrinkProfile }) {
  return (
    <div className="flavor-compare">
      <div className="flavor-compare-legend">
        <span className="legend-swatch legend-cake" /> {cake.name}
        <span className="legend-swatch legend-drink" /> {drink.name}
      </div>
      {DIMENSIONS.map((dim) => (
        <div key={dim.key} className="flavor-compare-row">
          <span className="flavor-compare-label">{dim.label}</span>
          <div className="flavor-compare-bars">
            <div className="flavor-bar-track">
              <div className="flavor-bar flavor-bar-cake" style={{ width: `${(cake.flavorProfile[dim.key] / 5) * 100}%` }} />
            </div>
            <div className="flavor-bar-track">
              <div className="flavor-bar flavor-bar-drink" style={{ width: `${(drink.flavorProfile[dim.key] / 5) * 100}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
