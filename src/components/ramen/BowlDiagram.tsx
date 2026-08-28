import type { BowlComponent, BowlComponentCategory } from '../../types/ramen/workshop'
import './BowlDiagram.css'

type Selections = Partial<Record<BowlComponentCategory, BowlComponent>>

const PLACEHOLDER = 'var(--border)'

/** A simplified bowl cross-section, in the same "line-art technical illustration" spirit as
    Cake's CakeBlueprintDiagram (CAKE_REFERENCE_AUDIT.md §6) but not a port of it -- a bowl has
    no layered stack to draw the same way a cake does, so this uses its own shape: broth fill,
    an aroma-oil surface ring, noodle strands, and topping/protein/vegetable/finish dots along
    the rim. Renders every category even before it's chosen, using a neutral placeholder color,
    so the illustration never looks broken mid-build. */
export function BowlDiagram({ selections }: { selections: Selections }) {
  const broth = selections.broth?.colorHex ?? PLACEHOLDER
  const aromaOil = selections.aromaOil?.colorHex ?? PLACEHOLDER
  const noodle = selections.noodle?.colorHex ?? PLACEHOLDER
  const protein = selections.protein?.colorHex ?? PLACEHOLDER
  const vegetable = selections.vegetable?.colorHex ?? PLACEHOLDER
  const topping = selections.topping?.colorHex ?? PLACEHOLDER
  const finish = selections.finish?.colorHex ?? PLACEHOLDER

  return (
    <svg viewBox="0 0 400 300" className="bowl-diagram" role="img" aria-label="Cross-section illustration of the assembled bowl">
      {/* bowl body */}
      <path d="M 40 90 L 60 220 Q 200 270 340 220 L 360 90 Z" className="bowl-diagram-body" />

      {/* broth fill */}
      <path d="M 55 120 L 65 210 Q 200 254 335 210 L 345 120 Z" style={{ fill: broth }} className="bowl-diagram-fill" />

      {/* aroma oil surface ring */}
      <ellipse cx="200" cy="120" rx="145" ry="16" style={{ fill: aromaOil }} className="bowl-diagram-oil" />

      {/* noodle strands */}
      <path d="M 100 150 Q 130 130 110 175 Q 90 210 130 195" style={{ stroke: noodle }} className="bowl-diagram-noodle" />
      <path d="M 160 150 Q 190 130 170 175 Q 150 210 190 195" style={{ stroke: noodle }} className="bowl-diagram-noodle" />
      <path d="M 220 150 Q 250 130 230 175 Q 210 210 250 195" style={{ stroke: noodle }} className="bowl-diagram-noodle" />

      {/* protein slice */}
      <rect x="255" y="140" width="34" height="22" rx="4" style={{ fill: protein }} className="bowl-diagram-topping" />

      {/* vegetable / topping / finish dots */}
      <circle cx="150" cy="118" r="9" style={{ fill: vegetable }} className="bowl-diagram-topping" />
      <circle cx="230" cy="112" r="9" style={{ fill: topping }} className="bowl-diagram-topping" />
      <circle cx="290" cy="118" r="7" style={{ fill: finish }} className="bowl-diagram-topping" />

      {/* rim */}
      <ellipse cx="200" cy="90" rx="160" ry="18" className="bowl-diagram-rim" />
    </svg>
  )
}
