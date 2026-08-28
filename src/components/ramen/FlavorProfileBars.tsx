import type { RamenFlavorProfile } from '../../types/ramen/ramen'
import './FlavorProfileBars.css'

const ROWS: { key: keyof RamenFlavorProfile; label: string; max: number }[] = [
  { key: 'richness', label: 'Richness', max: 5 },
  { key: 'intensity', label: 'Intensity', max: 5 },
  { key: 'heat', label: 'Heat', max: 5 },
  { key: 'umami', label: 'Umami', max: 5 },
]

export function FlavorProfileBars({ profile }: { profile: RamenFlavorProfile }) {
  return (
    <div className="flavor-profile-bars">
      {ROWS.map((row) => (
        <div key={row.key} className="flavor-profile-row">
          <span>{row.label}</span>
          <div className="flavor-profile-track">
            <div className="flavor-profile-fill" style={{ width: `${(profile[row.key] / row.max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
