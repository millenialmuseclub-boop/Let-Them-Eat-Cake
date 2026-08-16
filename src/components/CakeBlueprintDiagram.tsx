import type { AssemblyComponent } from '../types/assemblyLab'
import './CakeBlueprintDiagram.css'

interface CakeBlueprintDiagramProps {
  sponge: AssemblyComponent
  filling: AssemblyComponent
  frosting: AssemblyComponent
  garnish?: AssemblyComponent
}

/** Component names can run long ("Swiss Meringue Buttercream"), so labels wrap onto a
    second line at a fixed character budget rather than running past the viewBox edge. */
function wrapLabel(prefix: string, name: string): [string, string | null] {
  const full = `${prefix} — ${name}`
  if (full.length <= 24) return [full, null]
  return [`${prefix} —`, name]
}

export function CakeBlueprintDiagram({ sponge, filling, frosting, garnish }: CakeBlueprintDiagramProps) {
  const [frostingLine1, frostingLine2] = wrapLabel('Frosting', frosting.name)
  const [fillingLine1, fillingLine2] = wrapLabel('Filling', filling.name)
  const [spongeLine1, spongeLine2] = wrapLabel('Sponge', sponge.name)
  const [garnishLine1, garnishLine2] = garnish ? wrapLabel('Garnish', garnish.name) : [null, null]

  return (
    <svg viewBox="0 0 560 320" className="blueprint-diagram" role="img" aria-label="Technical diagram of the assembled cake">
      {/* centerline */}
      <line x1="230" y1="48" x2="230" y2="262" className="blueprint-centerline" />

      {/* dimension line */}
      <line x1="95" y1="60" x2="95" y2="250" className="blueprint-dimension-line" />
      <line x1="88" y1="60" x2="102" y2="60" className="blueprint-tick" />
      <line x1="88" y1="250" x2="102" y2="250" className="blueprint-tick" />
      <text x="72" y="155" className="blueprint-dimension-label" transform="rotate(-90, 72, 155)">
        ≈7.5 in tall
      </text>

      {/* cake board */}
      <rect x="110" y="250" width="240" height="14" rx="4" className="blueprint-board" />

      {/* frosting exterior */}
      <rect x="125" y="60" width="210" height="190" rx="16" style={{ fill: frosting.colorHex }} className="blueprint-frosting" />

      {/* sponge / filling stack */}
      <rect x="139" y="74" width="182" height="40" style={{ fill: sponge.colorHex }} className="blueprint-layer" />
      <rect x="139" y="114" width="182" height="20" style={{ fill: filling.colorHex }} className="blueprint-layer" />
      <rect x="139" y="134" width="182" height="40" style={{ fill: sponge.colorHex }} className="blueprint-layer" />
      <rect x="139" y="174" width="182" height="20" style={{ fill: filling.colorHex }} className="blueprint-layer" />
      <rect x="139" y="194" width="182" height="40" style={{ fill: sponge.colorHex }} className="blueprint-layer" />

      {garnishLine1 && (
        <>
          <line x1="335" y1="52" x2="365" y2="40" className="blueprint-leader" />
          <text x="368" y="43" className="blueprint-label">
            {garnishLine1}
            {garnishLine2 && <tspan x="368" dy="13">{garnishLine2}</tspan>}
          </text>
        </>
      )}

      <line x1="335" y1="76" x2="365" y2="76" className="blueprint-leader" />
      <text x="368" y="80" className="blueprint-label">
        {frostingLine1}
        {frostingLine2 && <tspan x="368" dy="13">{frostingLine2}</tspan>}
      </text>

      <line x1="321" y1="124" x2="365" y2="124" className="blueprint-leader" />
      <text x="368" y="128" className="blueprint-label">
        {fillingLine1}
        {fillingLine2 && <tspan x="368" dy="13">{fillingLine2}</tspan>}
      </text>

      <line x1="321" y1="154" x2="365" y2="154" className="blueprint-leader" />
      <text x="368" y="158" className="blueprint-label">
        {spongeLine1}
        {spongeLine2 && <tspan x="368" dy="13">{spongeLine2}</tspan>}
      </text>

      <line x1="139" y1="205" x2="95" y2="200" className="blueprint-leader" />
      <text x="18" y="200" className="blueprint-label blueprint-label-left">
        8 in diameter
      </text>

      {/* title block */}
      <rect x="125" y="275" width="210" height="35" className="blueprint-title-block" />
      <text x="135" y="290" className="blueprint-title-text">
        ASSEMBLY LAB — CUSTOM BUILD
      </text>
      <text x="135" y="303" className="blueprint-title-subtext">
        3-layer round · scale 1:1
      </text>
    </svg>
  )
}
