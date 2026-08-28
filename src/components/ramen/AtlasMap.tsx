import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import worldTopoJson from 'world-atlas/countries-110m.json'
import type { RegionalRamenEntry } from '../../types/ramen/atlas'
import './AtlasMap.css'

interface AtlasMapProps {
  entries: RegionalRamenEntry[]
  selectedCity: string | null
  onSelectCity: (city: string) => void
}

// Centered on Japan by default -- the master spec's Phase 1 Atlas anchors
// (§9) are all Japanese cities. Adapted from Cake's world-view AtlasWorldMap
// (CAKE_REFERENCE_AUDIT.md §5): same map/marker/zoom mechanics, but simplified
// to marker-only selection -- Cake also supports tapping a country *shape*,
// resolved through an ISO-country-code lookup table that has no equivalent at
// city granularity, so that interaction is deliberately left out here rather
// than force-fit.
const JAPAN_VIEW = { coordinates: [140, 38] as [number, number], zoom: 3.2 }

export function AtlasMap({ entries, selectedCity, onSelectCity }: AtlasMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [view, setView] = useState(JAPAN_VIEW)

  return (
    <div className="atlas-map-wrap">
      <button type="button" className="atlas-map-reset" onClick={() => setView(JAPAN_VIEW)}>
        Reset view
      </button>
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} role="img" aria-label="Interactive map of Ramen Atlas cities">
        {/* minZoom raised from 1 to 2.2 -- low enough to still see all of Japan comfortably, high
            enough that a diner can't accidentally zoom/pan out into a de facto world map, which
            this Atlas is deliberately not (master pass §2). */}
        <ZoomableGroup center={view.coordinates} zoom={view.zoom} minZoom={2.2} maxZoom={8} onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}>
          <Geographies geography={worldTopoJson}>{({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} className="atlas-map-country" />)}</Geographies>
          {entries.map((entry) => {
            const isSelected = entry.cityMicroRegion === selectedCity
            return (
              <Marker key={entry.id} coordinates={entry.coordinates}>
                <circle
                  r={34}
                  fill="transparent"
                  className="atlas-map-pin-hitarea"
                  tabIndex={0}
                  role="button"
                  aria-label={entry.cityMicroRegion}
                  onClick={() => onSelectCity(entry.cityMicroRegion)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectCity(entry.cityMicroRegion)
                    }
                  }}
                  onMouseEnter={() => setHovered(entry.cityMicroRegion)}
                  onMouseLeave={() => setHovered((prev) => (prev === entry.cityMicroRegion ? null : prev))}
                  onFocus={() => setHovered(entry.cityMicroRegion)}
                  onBlur={() => setHovered((prev) => (prev === entry.cityMicroRegion ? null : prev))}
                />
                <circle r={isSelected ? 7 : 5} className={isSelected ? 'atlas-map-pin active' : 'atlas-map-pin'} pointerEvents="none" />
                {hovered === entry.cityMicroRegion && (
                  <text textAnchor="middle" y={-14} className="atlas-map-label">
                    {entry.cityMicroRegion}
                  </text>
                )}
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
