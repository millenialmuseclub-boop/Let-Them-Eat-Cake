import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ramen, pairingItems } from '../../lib/ramen/data'
import { bestPairingByCategory, explainPairingScience } from '../../lib/ramen/sommelier'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { RamenStateBadges } from '../../components/ramen/RamenStateBadges'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import type { PairingCategory } from '../../types/ramen/sommelier'
import '../ramen/LabPage.css'
import './SommelierPairPage.css'

// Adapted from Cake's pairing architecture and Bridging/Cutting/Echoing concepts
// (CAKE_REFERENCE_AUDIT.md §7). Cake ranks and lists every drink; PAIR instead shows the single
// best match per category, matching master spec §21's "recommend appropriate: beverage,
// non-alcoholic, side, condiment, finishing element, dessert" -- one concise pick each, not a
// ranked catalog browse.
const CATEGORY_LABEL: Record<PairingCategory, string> = {
  beverage: 'Beverage',
  non_alcoholic: 'Non-Alcoholic',
  side: 'Side',
  condiment: 'Condiment',
  finishing_element: 'Finishing Element',
  dessert: 'Dessert',
}

export function SommelierPairPage() {
  useDocumentTitle('Pair My Ramen | Let Them Eat')

  const scene = getSceneImage('sommelier')
  const [ramenId, setRamenId] = useState(ramen[0].id)
  const candidate = ramen.find((r) => r.id === ramenId)!
  const bestByCategory = bestPairingByCategory(candidate, pairingItems)

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="A Japanese table setting with ramen, yakitori, and a beer" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Pair My Ramen</h1>
      <p>Pick a bowl, and we'll recommend a beverage, side, condiment, and finishing touch that actually work with it -- and explain why.</p>

      <div className="card pair-form">
        <label>
          Ramen
          <select value={ramenId} onChange={(e) => setRamenId(e.target.value)}>
            {ramen.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="card pair-summary">
        <RamenThumbnail ramenId={candidate.id} variant="hero" alt={candidate.name} />
        <RamenStateBadges ramenId={candidate.id} />
        <h3>{candidate.name}</h3>
        <p>{candidate.description}</p>
        <Link to={`/ramen/ramen/${candidate.id}`} className="encyclopedia-link">
          View full encyclopedia entry →
        </Link>
      </div>

      <h2 className="sommelier-section-heading">Recommended Pairings</h2>
      <div className="pair-grid">
        {bestByCategory.map(({ item, ...result }) => {
          const science = explainPairingScience(candidate, item, result)
          const reason = science.bridging ?? science.cutting ?? science.echoing ?? `A solid, if untested, pairing with ${candidate.name}.`
          return (
            <div key={item.id} className="card pair-card">
              <span className="tag pair-category-tag">{CATEGORY_LABEL[item.category]}</span>
              <h3>{item.name}</h3>
              <p className="pair-item-description">{item.description}</p>
              <p className="pair-reason">{reason}</p>
            </div>
          )
        })}
      </div>
    </main>
  )
}
