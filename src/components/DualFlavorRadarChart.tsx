import type { FlavorProfile } from '../types/cake'
import './DualFlavorRadarChart.css'

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

function dataPoints(profile: FlavorProfile): string {
  return AXES.map((axis, i) => pointAt(i, profile[axis.key] / 5).join(',')).join(' ')
}

export function DualFlavorRadarChart({
  cakeProfile,
  drinkProfile,
  cakeLabel = 'Cake',
  drinkLabel = 'Drink',
  score,
}: {
  cakeProfile: FlavorProfile
  drinkProfile: FlavorProfile
  cakeLabel?: string
  drinkLabel?: string
  score: number
}) {
  return (
    <div className="dual-radar-wrap">
      <svg viewBox="0 0 220 220" className="dual-flavor-radar-chart" role="img" aria-label="Cake and drink flavor profile comparison">
        {GRID_RINGS.map((ring) => (
          <polygon key={ring} points={polygonPoints(ring)} className="radar-grid-ring" />
        ))}
        {AXES.map((axis, i) => {
          const [x, y] = pointAt(i, 1)
          return <line key={axis.key} x1={CENTER} y1={CENTER} x2={x} y2={y} className="radar-axis-line" />
        })}
        <polygon points={dataPoints(cakeProfile)} className="radar-data-shape" style={{ fill: 'var(--raspberry)', stroke: 'var(--raspberry)' }} />
        <polygon points={dataPoints(drinkProfile)} className="radar-data-shape" style={{ fill: 'var(--gold)', stroke: 'var(--gold)' }} />
        {AXES.map((axis, i) => {
          const [x, y] = pointAt(i, 1.28)
          return (
            <text key={axis.key} x={x} y={y} className="radar-axis-label" textAnchor="middle" dominantBaseline="middle">
              {axis.label}
            </text>
          )
        })}
      </svg>
      <div className="dual-radar-legend">
        <span className="dual-radar-legend-item">
          <span className="dual-radar-swatch" style={{ background: 'var(--raspberry)' }} /> {cakeLabel}
        </span>
        <span className="dual-radar-legend-item">
          <span className="dual-radar-swatch" style={{ background: 'var(--gold)' }} /> {drinkLabel}
        </span>
        <span className="dual-radar-score">Harmony score: {score}</span>
      </div>
    </div>
  )
}
