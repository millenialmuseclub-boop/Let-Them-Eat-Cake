import './CakeOriginStory.css'

export interface OriginPoint {
  label: string
  text: string
}

export function CakeOriginStory({ points }: { points: OriginPoint[] }) {
  return (
    <div className="origin-story">
      {points.map((point, i) => (
        <div key={`${point.label}-${i}`} className="origin-story-point">
          <div className="origin-story-marker">
            <span className="origin-story-dot" />
            {i < points.length - 1 && <span className="origin-story-line" />}
          </div>
          <div className="origin-story-content">
            <span className="origin-story-label">{point.label}</span>
            <p className="origin-story-text">{point.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
