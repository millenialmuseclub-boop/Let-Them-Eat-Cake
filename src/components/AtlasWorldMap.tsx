import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import worldTopoJson from 'world-atlas/countries-110m.json'
import { ATLAS_COUNTRY_COORDINATES } from '../lib/atlasCoordinates'
import { getCountriesForIsoNumeric } from '../lib/atlasCountryCodes'
import './AtlasWorldMap.css'

interface AtlasWorldMapProps {
  countries: string[]
  selectedCountry: string | null
  onSelectCountry: (country: string) => void
}

const DEFAULT_VIEW = { coordinates: [0, 20] as [number, number], zoom: 1 }

export function AtlasWorldMap({ countries, selectedCountry, onSelectCountry }: AtlasWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [view, setView] = useState(DEFAULT_VIEW)

  const countrySet = new Set(countries.map((c) => c.toLowerCase()))

  /** A shape's tap picks the first of our countries sharing that landmass (e.g. the UK shape resolves to "United Kingdom"). */
  function handleShapeClick(geoId: string) {
    const matches = getCountriesForIsoNumeric(geoId).filter((c) => countrySet.has(c.toLowerCase()))
    if (matches.length > 0) onSelectCountry(matches[0])
  }

  return (
    <div className="atlas-map-wrap">
      <button type="button" className="atlas-map-reset" onClick={() => setView(DEFAULT_VIEW)}>
        Reset view
      </button>
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} role="img" aria-label="Interactive world map of Atlas countries">
        <ZoomableGroup
          center={view.coordinates}
          zoom={view.zoom}
          minZoom={1}
          maxZoom={5}
          onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}
        >
          <Geographies geography={worldTopoJson}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const matches = getCountriesForIsoNumeric(String(geo.id)).filter((c) => countrySet.has(c.toLowerCase()))
                const isTappable = matches.length > 0
                const isSelected = selectedCountry !== null && matches.some((c) => c.toLowerCase() === selectedCountry.toLowerCase())
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={isSelected ? 'atlas-map-country selected' : isTappable ? 'atlas-map-country tappable' : 'atlas-map-country'}
                    onClick={isTappable ? () => handleShapeClick(String(geo.id)) : undefined}
                  />
                )
              })
            }
          </Geographies>
          {countries.map((country) => {
            const coordinates = ATLAS_COUNTRY_COORDINATES[country]
            if (!coordinates) return null
            const isSelected = country === selectedCountry
            return (
              <Marker key={country} coordinates={coordinates}>
                <circle
                  r={12}
                  fill="transparent"
                  className="atlas-map-pin-hitarea"
                  onClick={() => onSelectCountry(country)}
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry((prev) => (prev === country ? null : prev))}
                />
                <circle
                  r={isSelected ? 7 : 5}
                  className={isSelected ? 'atlas-map-pin active' : 'atlas-map-pin'}
                  pointerEvents="none"
                />
                {hoveredCountry === country && (
                  <text textAnchor="middle" y={-14} className="atlas-map-label">
                    {country}
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
