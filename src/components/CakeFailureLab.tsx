import { useState } from 'react'
import { cakeFailures } from '../lib/data'
import { getProductsByIds } from '../lib/affiliateProducts'
import { CuratorsToolDrawer } from './CuratorsToolDrawer'
import './CakeFailureLab.css'

/** Grounded in what each failure's own `fixes` text actually recommends — not every failure has a genuine product fit. */
const FAILURE_PRODUCT_IDS: Record<string, string[]> = {
  failure_sliding: ['product_cake_leveler'],
  failure_domed_layers: ['product_cake_leveler'],
  failure_ganache_split: ['product_thermapen'],
  failure_mousse_wont_set: ['product_thermapen'],
}

export function CakeFailureLab() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="cake-failure-lab">
      <div className="failure-chip-row">
        {cakeFailures.map((failure) => (
          <button
            key={failure.id}
            className={expandedId === failure.id ? 'failure-chip active' : 'failure-chip'}
            onClick={() => setExpandedId(expandedId === failure.id ? null : failure.id)}
          >
            {failure.symptom}
          </button>
        ))}
      </div>

      {expandedId &&
        (() => {
          const failure = cakeFailures.find((f) => f.id === expandedId)!
          return (
            <div className="card failure-detail">
              <h3>{failure.symptom}</h3>
              <h4>Possible causes</h4>
              <ul>
                {failure.causes.map((cause, i) => (
                  <li key={i}>{cause}</li>
                ))}
              </ul>
              <h4>Fixes</h4>
              <ul className="failure-fixes">
                {failure.fixes.map((fix, i) => (
                  <li key={i}>{fix}</li>
                ))}
              </ul>
              <CuratorsToolDrawer products={getProductsByIds(FAILURE_PRODUCT_IDS[failure.id] ?? [])} />
            </div>
          )
        })()}
    </div>
  )
}
