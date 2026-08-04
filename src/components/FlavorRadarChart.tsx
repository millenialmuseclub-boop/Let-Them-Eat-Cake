import type { FlavorProfile } from '../types/cake'
import './FlavorRadarChart.css'

const AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'fatRichness', label: 'Richness' },
  { key: 'acidity', label: 'Acidity' },
  { key: 'intensity', label: 'Intensity' },
]

const CENTER = 110
const MAX_RADIUS = 80
const GRID_RINGS = [0.25, 0.5, 0.75, 1]

function axisAngle(index: number): number {
  return (Math.PI * 2 * index) / AXES.length - Math.PI / 2
}

function pointAt(index: number, radiusFraction: number): [number, number] {
  const angle = axisAngle(index)
  const radius = MAX_RADIUS * radiusFraction
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)]
}

function polygonPoints(radiusFraction: number): string {
  return AXES.map((_, i) => pointAt(i, radiusFraction).join(',')).join(' ')
}

export function FlavorRadarChart({ profile, colorHex = 'var(--raspberry)' }: { profile: FlavorProfile; colorHex?: string }) {
  const dataPoints = AXES.map((axis, i) => pointAt(i, profile[axis.key] / 5).join(',')).join(' ')

  return (
    <svg viewBox="0 0 220 220" className="flavor-radar-chart" role="img" aria-label="Flavor profile radar chart">
      {GRID_RINGS.map((ring) => (
        <polygon key={ring} points={polygonPoints(ring)} className="radar-grid-ring" />
      ))}
      {AXES.map((axis, i) => {
        const [x, y] = pointAt(i, 1)
        return <line key={axis.key} x1={CENTER} y1={CENTER} x2={x} y2={y} className="radar-axis-line" />
      })}
      <polygon points={dataPoints} className="radar-data-shape" style={{ fill: colorHex, stroke: colorHex }} />
      {AXES.map((axis, i) => {
        const [x, y] = pointAt(i, 1.28)
        return (
          <text key={axis.key} x={x} y={y} className="radar-axis-label" textAnchor="middle" dominantBaseline="middle">
            {axis.label}
          </text>
        )
      })}
    </svg>
  )
}
