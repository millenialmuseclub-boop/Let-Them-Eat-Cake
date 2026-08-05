import { useEffect, useRef } from 'react'
import type { HistoricalCakeEntry } from '../types/timeMachine'
import { getCake } from '../lib/data'
import './TimeMachineTimeline.css'

interface TimeMachineTimelineProps {
  decades: HistoricalCakeEntry[]
  activeDecadeId: string | null
  onSelectDecade: (decadeId: string) => void
}

export function TimeMachineTimeline({ decades, activeDecadeId, onSelectDecade }: TimeMachineTimelineProps) {
  const sorted = [...decades].sort((a, b) => a.yearStart - b.yearStart)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeDecadeId])

  return (
    <div className="time-machine-timeline">
      {sorted.map((entry) => {
        const cake = getCake(entry.cakeId)
        const isActive = entry.id === activeDecadeId
        return (
          <button
            key={entry.id}
            ref={isActive ? activeRef : undefined}
            className={isActive ? 'timeline-stop active' : 'timeline-stop'}
            onClick={() => onSelectDecade(entry.id)}
          >
            <span className="timeline-dot" />
            <span className="timeline-decade-label">{entry.decadeLabel}</span>
            <span className="timeline-cake-name">{cake?.name}</span>
          </button>
        )
      })}
    </div>
  )
}
