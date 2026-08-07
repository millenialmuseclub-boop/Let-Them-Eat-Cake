import type { CakeProfile } from '../types/cake'
import type { DrinkProfile } from '../types/sommelier'
import { CakeHeroImage } from './CakeHeroImage'
import './PairingComparisonCard.css'

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--gold)'
  if (score >= 45) return 'var(--raspberry)'
  return 'var(--border)'
}

export function PairingComparisonCard({ cake, drink, score }: { cake: CakeProfile; drink: DrinkProfile; score: number }) {
  return (
    <div className="pairing-comparison-card">
      <div className="pairing-comparison-side">
        <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
        <h5>{cake.name}</h5>
        <span className="tag pairing-comparison-tag">{cake.texture}</span>
        <p className="pairing-comparison-notes">{cake.flavorNotes.join(', ')}</p>
      </div>

      <div className="pairing-comparison-score" style={{ background: scoreColor(score) }}>
        {score}
      </div>

      <div className="pairing-comparison-side">
        <h5>{drink.name}</h5>
        <span className="tag pairing-comparison-tag">{drink.category.replace('_', ' ')}</span>
        <p className="pairing-comparison-notes">{drink.flavorNotes.join(', ')}</p>
      </div>
    </div>
  )
}
