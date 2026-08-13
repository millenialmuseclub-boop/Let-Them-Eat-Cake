import { GUEST_RANGES, type GuestRange } from '../lib/guestRanges'
import './GuestRangeSelector.css'

export function GuestRangeSelector({ value, onChange }: { value: GuestRange; onChange: (range: GuestRange) => void }) {
  return (
    <div className="guest-range-selector" role="group" aria-label="Guest count">
      {GUEST_RANGES.map((range) => (
        <button
          key={range.label}
          type="button"
          className={range.label === value.label ? 'guest-range-tile active' : 'guest-range-tile'}
          onClick={() => onChange(range)}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
