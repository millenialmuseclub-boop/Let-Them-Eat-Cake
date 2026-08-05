import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import worldTopoJson from 'world-atlas/countries-110m.json'
import { ATLAS_COUNTRY_COORDINATES } from '../lib/atlasCoordinates'
import './AtlasWorldMap.css'

interface AtlasWorldMapProps {
  countries: string[]
  selectedCountry: string | null
  onSelectCountry: (country: string) => void
}

export function AtlasWorldMap({ countries, selectedCountry, onSelectCountry }: AtlasWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  return (
    <div className="atlas-map-wrap">
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 150 }} role="img" aria-label="Interactive world map of Atlas countries">
        <ZoomableGroup minZoom={1} maxZoom={4}>
          <Geographies geography={worldTopoJson}>
            {({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} className="atlas-map-country" />)}
          </Geographies>
          {countries.map((country) => {
            const coordinates = ATLAS_COUNTRY_COORDINATES[country]
            if (!coordinates) return null
            const isSelected = country === selectedCountry
            return (
              <Marker key={country} coordinates={coordinates}>
                <circle
                  r={isSelected ? 7 : 5}
                  className={isSelected ? 'atlas-map-pin active' : 'atlas-map-pin'}
                  onClick={() => onSelectCountry(country)}
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry((prev) => (prev === country ? null : prev))}
                />
                {hoveredCountry === country && (
                  <text textAnchor="middle" y={-12} className="atlas-map-label">
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
