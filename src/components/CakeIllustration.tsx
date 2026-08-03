import './CakeIllustration.css'

interface CakeIllustrationProps {
  spongeColor: string
  fillingColor: string
  frostingColor: string
  garnishColor?: string
}

const GARNISH_DOT_X = [78, 122, 150, 178, 222]

export function CakeIllustration({ spongeColor, fillingColor, frostingColor, garnishColor }: CakeIllustrationProps) {
  return (
    <svg viewBox="0 0 300 260" className="cake-illustration" role="img" aria-label="Illustrated preview of the assembled cake">
      <rect x="30" y="228" width="240" height="16" rx="4" className="cake-board" />
      <rect x="45" y="40" width="210" height="188" rx="18" fill={frostingColor} className="cake-frosting" />
      <rect x="59" y="54" width="182" height="40" fill={spongeColor} className="cake-layer" />
      <rect x="59" y="94" width="182" height="20" fill={fillingColor} className="cake-layer" />
      <rect x="59" y="114" width="182" height="40" fill={spongeColor} className="cake-layer" />
      <rect x="59" y="154" width="182" height="20" fill={fillingColor} className="cake-layer" />
      <rect x="59" y="174" width="182" height="40" fill={spongeColor} className="cake-layer" />
      {garnishColor && GARNISH_DOT_X.map((x) => <circle key={x} cx={x} cy={46} r={6} fill={garnishColor} className="cake-garnish-dot" />)}
    </svg>
  )
}
