import type { FlavorProfile } from '../types/cake'
import './FlavorProfileBars.css'

const DIMENSIONS: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'fatRichness', label: 'Richness' },
  { key: 'acidity', label: 'Acidity' },
  { key: 'intensity', label: 'Intensity' },
]

export function FlavorProfileBars({ profile, colorVar = 'var(--raspberry)' }: { profile: FlavorProfile; colorVar?: string }) {
  return (
    <div className="profile-bars">
      {DIMENSIONS.map((dim) => (
        <div key={dim.key} className="profile-bar-row">
          <span className="profile-bar-label">{dim.label}</span>
          <div className="profile-bar-track">
            <div className="profile-bar-fill" style={{ width: `${(profile[dim.key] / 5) * 100}%`, background: colorVar }} />
          </div>
        </div>
      ))}
    </div>
  )
}
