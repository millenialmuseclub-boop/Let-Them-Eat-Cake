import type { CookieFlavorProfile } from '../../types/cookies/cookie'

const LABELS: { key: keyof CookieFlavorProfile; label: string }[] = [
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'richness', label: 'Richness' },
  { key: 'crispness', label: 'Crispness' },
  { key: 'spice', label: 'Spice' },
]

export function FlavorProfileBars({ profile }: { profile: CookieFlavorProfile }) {
  return (
    <dl className="flavor-profile-bars">
      {LABELS.map(({ key, label }) => (
        <div className="flavor-profile-bar-row" key={key}>
          <dt>{label}</dt>
          <dd>
            <div className="flavor-profile-bar-track" role="img" aria-label={`${label}: ${profile[key]} out of 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`flavor-profile-bar-segment${i < profile[key] ? ' filled' : ''}`} aria-hidden="true" />
              ))}
            </div>
          </dd>
        </div>
      ))}
    </dl>
  )
}
