import { Link } from 'react-router-dom'
import { getRegionEntryForRamen } from '../../lib/ramen/atlas'
import { RamenThumbnail } from './RamenThumbnail'
import { RamenStateBadges } from './RamenStateBadges'
import type { RamenProfile } from '../../types/ramen/ramen'
import '../../pages/ramen/RamenEncyclopediaIndexPage.css'

/** Extracted from RamenEncyclopediaIndexPage (previously duplicated inline in
    CollectionDetailPage) so saved-state badges (master spec Phase 8 §4 -- "one persistence/state
    system") only need to be added in one place to cover both surfaces. */
export function RamenCard({ item }: { item: RamenProfile }) {
  const region = getRegionEntryForRamen(item.id)
  return (
    <Link to={`/ramen/ramen/${item.id}`} className="card encyclopedia-card">
      <RamenThumbnail ramenId={item.id} alt={item.name} />
      <div className="encyclopedia-card-tags">
        {region && <span className="tag">{region.cityMicroRegion}</span>}
        <span className="tag">{item.variationTag}</span>
        <RamenStateBadges ramenId={item.id} />
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </Link>
  )
}
