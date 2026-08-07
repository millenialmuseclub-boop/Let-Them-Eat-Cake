import { blueprintExamples } from '../lib/data'
import './BlueprintExamples.css'

export function BlueprintExamples() {
  return (
    <div className="blueprint-examples">
      {blueprintExamples.map((example) => (
        <div key={example.id} className="card blueprint-example-card">
          <h3>{example.name}</h3>
          <p className="blueprint-example-description">{example.description}</p>
          <ol className="blueprint-example-layers">
            {example.layers.map((layer, i) => (
              <li key={i}>
                <span className="blueprint-example-layer-name">{layer.name}</span>
                <span className="blueprint-example-layer-note">{layer.note}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
