import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import worldTopoJson from 'world-atlas/countries-110m.json'
import { ATLAS_COUNTRY_COORDINATES } from '../lib/atlasCoordinates'
import { getCountriesForIsoNumeric } from '../lib/atlasCountryCodes'
import { WorldCountryPins } from './WorldCountryPins'
import './AtlasWorldMap.css'

interface AtlasWorldMapProps {
  countries: string[]
  selectedCountry: string | null
  onSelectCountry: (country: string) => void
}
const DEFAULT_VIEW = { coordinates: [0, 10] as [number, number], zoom: 1 }
export function AtlasWorldMap({ countries, selectedCountry, onSelectCountry }: AtlasWorldMapProps) {
  const [view, setView] = useState(DEFAULT_VIEW)
  const [choices, setChoices] = useState<string[]>([])
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)
  const countrySet = new Set(countries)
  const choiceHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const coordinates = selectedCountry && ATLAS_COUNTRY_COORDINATES[selectedCountry]
    setView(coordinates ? { coordinates, zoom: 2.5 } : DEFAULT_VIEW)
    setChoices([])
  }, [selectedCountry])
  useEffect(() => { if (choices.length) choiceHeading.current?.focus() }, [choices])
  function choose(items: string[]) {
    if (items.length !== 1) { setChoices(items); return }
    const country = items[0]
    onSelectCountry(country)
    setChoices([])
    const coordinates = ATLAS_COUNTRY_COORDINATES[country]
    if (coordinates) setView({ coordinates, zoom: 2.5 })
  }
  return <div className="atlas-world-map"><div className="atlas-map-wrap"
    onPointerDownCapture={event => { pointerStart.current = { x: event.clientX, y: event.clientY }; dragged.current = false }}
    onPointerMoveCapture={event => { const start = pointerStart.current; if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) dragged.current = true }}
    onPointerUpCapture={() => { pointerStart.current = null }}
    onPointerCancelCapture={() => { dragged.current = true; pointerStart.current = null }}
    onClickCapture={event => { if (event.detail > 0 && dragged.current) { event.preventDefault(); event.stopPropagation() } }}>
    <button type="button" className="atlas-map-reset" onClick={() => { setView(DEFAULT_VIEW); setChoices([]) }}>Reset view</button>
    <div className="atlas-world-controls">
      <button type="button" aria-label="Zoom in" disabled={view.zoom >= 5} onClick={() => setView(v => ({ ...v, zoom: Math.min(5, v.zoom * 1.5) }))}>+</button>
      <button type="button" aria-label="Zoom out" disabled={view.zoom <= 1} onClick={() => setView(v => ({ ...v, zoom: Math.max(1, v.zoom / 1.5) }))}>−</button>
    </div>
    <ComposableMap height={480} projection="geoEqualEarth" projectionConfig={{ scale: 150 }} role="group" aria-label="Interactive world map of Atlas countries">
      <ZoomableGroup center={view.coordinates} zoom={view.zoom} minZoom={1} maxZoom={5} onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}>
        <Geographies geography={worldTopoJson}>{({ geographies }) => geographies.map(geo => {
          const matches = getCountriesForIsoNumeric(String(geo.id)).filter(country => countrySet.has(country))
          const selected = matches.includes(selectedCountry ?? '')
          return <Geography key={geo.rsmKey} geography={geo} tabIndex={-1} aria-hidden="true"
            className={`atlas-map-country${selected ? ' selected' : matches.length ? ' tappable' : ''}`}
            onClick={matches.length ? () => choose(matches) : undefined} />
        })}</Geographies>
        <WorldCountryPins countries={countries} selectedCountry={selectedCountry} zoom={view.zoom} onChoose={choose} />
      </ZoomableGroup>
    </ComposableMap>
    <p className="atlas-world-map-note">Drag to explore · Pinch or use + to zoom · Numbers group nearby places</p>
  </div>
  {choices.length > 0 && <section className="atlas-world-choices" aria-label="Places in this cluster">
    <h3 ref={choiceHeading} tabIndex={-1}>Choose a place</h3>
    {choices.map(country => <button key={country} onClick={() => choose([country])}>{country} →</button>)}
    <button onClick={() => setChoices([])}>Close choices</button>
  </section>}
  </div>
}
