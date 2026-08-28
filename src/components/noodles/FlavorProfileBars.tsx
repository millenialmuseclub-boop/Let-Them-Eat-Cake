import type { FlavorProfile } from '../../types/noodles/noodle'

const ROWS: { key: keyof FlavorProfile; left: string; right: string }[] = [
  { key: 'brothiness', left: 'Dry', right: 'Brothy' },
  { key: 'boldness', left: 'Delicate', right: 'Bold' },
  { key: 'richness', left: 'Light', right: 'Rich' },
  { key: 'chewiness', left: 'Soft', right: 'Chewy' },
  { key: 'spice', left: 'Mild', right: 'Spicy' },
]

export function FlavorProfileBars({ profile }: { profile: FlavorProfile }) {
  return (
    <div className="bars" role="group" aria-label="Flavor profile">
      {ROWS.map((row) => (
        <div className="bars__row" key={row.key}>
          <span>
            {row.left} · {row.right}
          </span>
          <div className="bars__track" role="img" aria-label={`${row.left} to ${row.right}: ${profile[row.key]} of 5`}>
            <div className="bars__fill" style={{ width: `${(profile[row.key] / 5) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
