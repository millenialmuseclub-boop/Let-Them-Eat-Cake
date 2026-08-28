import './ComingSoonGrid.css'

/** Extracted from WorkshopPage's original inline "Coming Soon" tile grid so Sommelier's
    Create a Bowl tile reuses the exact same non-routed, disabled-tile treatment. */
export function ComingSoonGrid({ items }: { items: string[] }) {
  return (
    <div className="coming-soon-grid">
      {items.map((title) => (
        <div key={title} className="card coming-soon-tile">
          <h3>{title}</h3>
          <span className="tag coming-soon-tag">Coming Soon</span>
        </div>
      ))}
    </div>
  )
}
