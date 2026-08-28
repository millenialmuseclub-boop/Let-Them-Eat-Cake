import { useRamenLibraryRecord } from '../../lib/ramen/useRamenLibrary'
import './RamenStateBadges.css'

/** The one shared "show saved state" surface reused across Encyclopedia cards/detail, Main
    collections, Atlas, and Sommelier results (master spec Phase 8 §4 -- "one persistence/state
    system rather than separate implementations"). Renders nothing if nothing is saved. */
export function RamenStateBadges({ ramenId }: { ramenId: string }) {
  const record = useRamenLibraryRecord(ramenId)
  if (!record) return null

  const badges: string[] = []
  if (record.favorite) badges.push('★ Favorite')
  if (record.tried) badges.push('✓ Tried')
  if (record.wantToTry) badges.push('♡ Want to Try')
  if (badges.length === 0) return null

  return (
    <span className="ramen-state-badges">
      {badges.map((b) => (
        <span key={b} className="tag ramen-state-badge">
          {b}
        </span>
      ))}
    </span>
  )
}
