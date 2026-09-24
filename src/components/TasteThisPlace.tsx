import { jetSetDestinations } from '../data/jetSetDestinations'
import { trackDiscovery } from '../lib/analytics'
import './TasteThisPlace.css'

export function TasteThisPlace({ foodId, country }: { foodId?: string; country?: string }) {
  const destination = jetSetDestinations.find(d => foodId ? d.foodIds.includes(foodId) : d.country === country)
  if (!destination) return null
  return <aside className="taste-this-place" aria-label="Taste this place">
    <div><p className="eyebrow">Taste this place · Jet Set LatAM</p>
      <h3>From the table to {destination.city}.</h3><p>{destination.note}</p></div>
    <a href={destination.url} target="_blank" rel="noopener noreferrer" onClick={() => trackDiscovery('Jet Set Clicked', { id: foodId ?? destination.id, destination: destination.id })}>Explore {destination.city} with Jet Set ↗</a>
  </aside>
}
