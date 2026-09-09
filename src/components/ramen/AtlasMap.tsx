import { useEffect, useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup, useMapContext } from 'react-simple-maps'
import worldTopoJson from 'world-atlas/countries-110m.json'
import type { RegionalRamenEntry } from '../../types/ramen/atlas'
import { clusterMapPoints } from '../../lib/ramen/mapClusters'
import './AtlasMap.css'

interface AtlasMapProps {
  entries: RegionalRamenEntry[]
  selectedCity: string | null
  onSelectCity: (city: string) => void
}

// Preserve PR #5's full Japan view. Nearby cities share a visible target and an explicit choice.
const JAPAN_VIEW = { coordinates: [140, 38] as [number, number], zoom: 3.2 }

function CityMarkers({ entries, selectedCity, zoom, displayWidth, onChoose }: Omit<AtlasMapProps, 'onSelectCity'> & {
  zoom: number; displayWidth: number; onChoose: (entries: RegionalRamenEntry[]) => void
}) {
  const { projection, width } = useMapContext()
  const scale = zoom * displayWidth / width
  const points = entries.flatMap((entry) => {
    const point = projection(entry.coordinates)
    return point ? [{ x: point[0] * scale, y: point[1] * scale, items: [entry] }] : []
  })
  return clusterMapPoints(points).map((cluster) => {
    const label = cluster.items.length === 1 ? cluster.items[0].cityMicroRegion : `Choose from ${cluster.items.length} nearby cities: ${cluster.items.map((entry) => entry.cityMicroRegion).join(', ')}`
    const selected = cluster.items.some((entry) => entry.cityMicroRegion === selectedCity)
    return <g key={cluster.items.map((entry) => entry.id).join('-')} transform={`translate(${cluster.x / scale},${cluster.y / scale}) scale(${1 / scale})`}>
      <circle r={22} className="atlas-map-pin-hitarea" fill="transparent" tabIndex={0} role="button" aria-label={label} aria-pressed={selected}
        onClick={() => onChoose(cluster.items)}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onChoose(cluster.items) } }} />
      <circle r={cluster.items.length > 1 ? 16 : 7} className={selected ? 'atlas-map-pin active' : 'atlas-map-pin'} pointerEvents="none" />
      {cluster.items.length > 1 && <text textAnchor="middle" y={4} className="atlas-map-count" pointerEvents="none">{cluster.items.length}</text>}
      <title>{label}</title>
    </g>
  })
}

export function AtlasMap({ entries, selectedCity, onSelectCity }: AtlasMapProps) {
  const [view, setView] = useState(JAPAN_VIEW)
  const [displayWidth, setDisplayWidth] = useState(375)
  const [choices, setChoices] = useState<RegionalRamenEntry[]>([])
  const wrap = useRef<HTMLDivElement>(null)
  const choiceHeading = useRef<HTMLHeadingElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)
  useEffect(() => {
    if (!wrap.current) return
    const observer = new ResizeObserver(([entry]) => setDisplayWidth(Math.max(1, entry.contentRect.width)))
    observer.observe(wrap.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (choices.length) choiceHeading.current?.focus() }, [choices])

  return <div>
    <div className="atlas-map-wrap" ref={wrap}
      onPointerDownCapture={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; dragged.current = false }}
      onPointerMoveCapture={(event) => { const start = pointerStart.current; if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) dragged.current = true }}
      onPointerCancelCapture={() => { dragged.current = true; pointerStart.current = null }}
      onPointerUpCapture={() => { pointerStart.current = null }}
      onClickCapture={(event) => { if (event.detail > 0 && dragged.current) { event.preventDefault(); event.stopPropagation() } }}>
      <button type="button" className="atlas-map-reset" onClick={() => { setView(JAPAN_VIEW); setChoices([]) }}>Reset view</button>
      <div className="atlas-map-zoom">
        <button type="button" aria-label="Zoom in" disabled={view.zoom >= 8} onClick={() => setView((current) => ({ ...current, zoom: Math.min(8, current.zoom * 1.5) }))}>+</button>
        <button type="button" aria-label="Zoom out" disabled={view.zoom <= 2.2} onClick={() => setView((current) => ({ ...current, zoom: Math.max(2.2, current.zoom / 1.5) }))}>−</button>
      </div>
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 650 }} role="group" aria-label="Interactive map of Ramen Atlas cities">
        <ZoomableGroup center={view.coordinates} zoom={view.zoom} minZoom={2.2} maxZoom={8} onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}>
          <Geographies geography={worldTopoJson} aria-hidden="true">{({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} className="atlas-map-country" />)}</Geographies>
          <CityMarkers entries={entries} selectedCity={selectedCity} zoom={view.zoom} displayWidth={displayWidth} onChoose={(items) => {
            if (items.length === 1) { setChoices([]); onSelectCity(items[0].cityMicroRegion) } else setChoices(items)
          }} />
        </ZoomableGroup>
      </ComposableMap>
    </div>
    {choices.length > 0 && <section className="atlas-cluster-choices" aria-label="Nearby cities">
      <h2 ref={choiceHeading} tabIndex={-1}>Choose a city</h2>
      <div className="atlas-city-list">{choices.map((entry) => <button key={entry.id} type="button" className="atlas-city-chip" aria-pressed={selectedCity === entry.cityMicroRegion} onClick={() => onSelectCity(entry.cityMicroRegion)}>{entry.cityMicroRegion}</button>)}</div>
    </section>}
    <p className="atlas-map-hint" role="status">{selectedCity ? `Selected: ${selectedCity}.` : 'Numbered pins contain nearby cities.'} Choose a pin or browse the city buttons below.</p>
  </div>
}
