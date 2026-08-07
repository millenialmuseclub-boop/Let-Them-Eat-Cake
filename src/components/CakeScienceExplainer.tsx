import { useState } from 'react'
import { cakeScienceTopics } from '../lib/data'
import './CakeScienceExplainer.css'

export function CakeScienceExplainer() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="cake-science">
      <div className="cake-science-chip-row">
        {cakeScienceTopics.map((topic) => (
          <button
            key={topic.id}
            className={expandedId === topic.id ? 'cake-science-chip active' : 'cake-science-chip'}
            onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
          >
            {topic.name}
          </button>
        ))}
      </div>

      {expandedId &&
        (() => {
          const topic = cakeScienceTopics.find((t) => t.id === expandedId)!
          return (
            <div className="card cake-science-detail">
              <h3>{topic.name}</h3>
              <p>{topic.explanation}</p>
            </div>
          )
        })()}
    </div>
  )
}
