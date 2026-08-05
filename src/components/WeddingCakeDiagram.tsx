import type { CakeShape, DecorationCategory, TierSpec } from '../types/weddingCake'
import './WeddingCakeDiagram.css'

interface WeddingCakeDiagramProps {
  /** ordered base (widest) first to top (narrowest) last — matches architecturePlan.tiers */
  tiers: TierSpec[]
  shape: CakeShape
  swatchHex: string
  decorationCategory: DecorationCategory
  decorationSwatchHex: string
}

const VIEW_WIDTH = 320
const BOARD_Y = 300
const STACK_BOTTOM = 296
const STACK_TOP = 30
const MIN_TIER_WIDTH = 90
const MAX_TIER_WIDTH = 220

function tierWidth(diameterIn: number): number {
  return Math.min(MAX_TIER_WIDTH, Math.max(MIN_TIER_WIDTH, 60 + diameterIn * 8))
}

function shapeProps(shape: CakeShape): { rx: number; clipPath?: string } {
  if (shape === 'round') return { rx: 18 }
  if (shape === 'hexagon') return { rx: 4, clipPath: 'polygon(8% 0, 92% 0, 100% 15%, 100% 85%, 92% 100%, 8% 100%, 0 85%, 0 15%)' }
  return { rx: 0 }
}

function DecorationOverlay({
  category,
  x,
  y,
  width,
  height,
  hex,
  keyPrefix,
}: {
  category: DecorationCategory
  x: number
  y: number
  width: number
  height: number
  hex: string
  keyPrefix: string
}) {
  const cx = x + width / 2
  switch (category) {
    case 'floral':
      return (
        <g>
          {[0.2, 0.32, 0.14].map((r, i) => (
            <circle key={`${keyPrefix}-floral-${i}`} cx={x + width * 0.78 + i * 6} cy={y + i * 14} r={6 + r * 10} fill={hex} opacity={0.85} />
          ))}
        </g>
      )
    case 'piped':
      return (
        <g>
          {Array.from({ length: Math.max(3, Math.round(width / 22)) }).map((_, i, arr) => (
            <circle key={`${keyPrefix}-piped-${i}`} cx={x + ((i + 0.5) * width) / arr.length} cy={y + height - 6} r={5} fill={hex} opacity={0.9} />
          ))}
        </g>
      )
    case 'lace':
      return (
        <g opacity={0.5} stroke={hex} strokeWidth={1}>
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`${keyPrefix}-lace-${i}`} x1={x + i * (width / 5)} y1={y + height} x2={x + i * (width / 5) + 14} y2={y} />
          ))}
        </g>
      )
    case 'geometric':
      return (
        <g fill={hex} opacity={0.85}>
          {Array.from({ length: Math.max(3, Math.round(width / 30)) }).map((_, i, arr) => {
            const px = x + ((i + 0.5) * width) / arr.length
            return <polygon key={`${keyPrefix}-geo-${i}`} points={`${px},${y + 6} ${px - 7},${y + height - 6} ${px + 7},${y + height - 6}`} />
          })}
        </g>
      )
    case 'painted':
      return (
        <g fill={hex} opacity={0.3}>
          <circle cx={cx - width * 0.15} cy={y + height * 0.4} r={width * 0.18} />
          <circle cx={cx + width * 0.2} cy={y + height * 0.6} r={width * 0.14} />
        </g>
      )
    case 'metallic':
      return (
        <g stroke={hex} strokeWidth={2} opacity={0.9}>
          {Array.from({ length: Math.max(4, Math.round(width / 20)) }).map((_, i, arr) => {
            const px = x + ((i + 0.5) * width) / arr.length
            const drip = 8 + ((i * 7) % 14)
            return <line key={`${keyPrefix}-drip-${i}`} x1={px} y1={y} x2={px} y2={y + drip} />
          })}
        </g>
      )
    case 'natural':
    default:
      return (
        <g fill={hex} opacity={0.8}>
          {[0.3, 0.55, 0.75].map((f, i) => (
            <circle key={`${keyPrefix}-natural-${i}`} cx={x + width * f} cy={y + height - 8} r={4} />
          ))}
        </g>
      )
  }
}

export function WeddingCakeDiagram({ tiers, shape, swatchHex, decorationCategory, decorationSwatchHex }: WeddingCakeDiagramProps) {
  const { rx, clipPath } = shapeProps(shape)
  const totalHeight = STACK_BOTTOM - STACK_TOP
  const tierHeight = Math.min(90, totalHeight / Math.max(1, tiers.length))

  let currentBottom = STACK_BOTTOM
  const positioned = tiers.map((tier, index) => {
    const width = tierWidth(tier.diameterIn)
    const height = tierHeight
    const y = currentBottom - height
    const x = (VIEW_WIDTH - width) / 2
    currentBottom = y
    return { tier, key: `${tier.role}-${index}`, x, y, width, height }
  })

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} 320`}
      className="wedding-cake-diagram"
      role="img"
      aria-label={`${shape} ${tiers.length}-tier wedding cake with ${decorationCategory} decoration`}
    >
      <rect x={40} y={BOARD_Y} width={VIEW_WIDTH - 80} height={12} rx={4} className="wedding-diagram-board" />
      {positioned.map(({ key, x, y, width, height }) => (
        <g key={key}>
          <rect x={x} y={y} width={width} height={height} rx={rx} style={{ fill: swatchHex, clipPath }} className="wedding-diagram-tier" />
          <DecorationOverlay category={decorationCategory} x={x} y={y} width={width} height={height} hex={decorationSwatchHex} keyPrefix={key} />
        </g>
      ))}
    </svg>
  )
}
