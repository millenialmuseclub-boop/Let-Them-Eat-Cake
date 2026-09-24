import { useEffect, useRef, useState } from 'react'
import { useMapContext } from 'react-simple-maps'
import { ATLAS_COUNTRY_COORDINATES } from '../lib/atlasCoordinates'
import { clusterMapPoints } from '../lib/ramen/mapClusters'

// Reuse the Ramen Atlas's screen-space clustering to preserve 44px touch targets.
export function WorldCountryPins({ countries, selectedCountry, zoom, onChoose }: {
  countries: string[]; selectedCountry: string | null; zoom: number; onChoose: (countries: string[]) => void
}) {
  const { projection, width } = useMapContext()
  const root = useRef<SVGGElement>(null)
  const [displayWidth, setDisplayWidth] = useState(375)
  useEffect(() => {
    const svg = root.current?.ownerSVGElement
    if (!svg) return
    const observer = new ResizeObserver(([entry]) => setDisplayWidth(Math.max(1, entry.contentRect.width)))
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])
  const scale = zoom * displayWidth / width
  const points = countries.flatMap(country => {
    const coordinates = ATLAS_COUNTRY_COORDINATES[country]
    const point = coordinates && projection(coordinates)
    return point ? [{ x: point[0] * scale, y: point[1] * scale, items: [country] }] : []
  })
  return <g ref={root}>{clusterMapPoints(points).map(cluster => {
    const selected = cluster.items.includes(selectedCountry ?? '')
    const label = cluster.items.length === 1 ? cluster.items[0] : `Explore ${cluster.items.length} places: ${cluster.items.join(', ')}`
    return <g key={cluster.items.join('-')} transform={`translate(${cluster.x / scale},${cluster.y / scale}) scale(${1 / scale})`}>
      <circle r={22} fill="transparent" className="atlas-map-pin-hitarea" role="button" tabIndex={0} aria-label={label} aria-pressed={selected}
        onClick={() => onChoose(cluster.items)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onChoose(cluster.items) } }} />
      <circle r={cluster.items.length > 1 ? 16 : 8} className={`atlas-map-pin${selected ? ' active' : ''}`} pointerEvents="none" />
      {cluster.items.length > 1 && <text y={4} textAnchor="middle" className="atlas-world-count" pointerEvents="none">{cluster.items.length}</text>}
      {selected && <text y={-25} textAnchor="middle" className="atlas-map-label" pointerEvents="none">{selectedCountry}</text>}
      <title>{label}</title>
    </g>
  })}</g>
}
