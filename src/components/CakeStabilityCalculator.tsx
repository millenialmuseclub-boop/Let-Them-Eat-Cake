import { useState } from 'react'
import { calculateStability } from '../lib/stabilityCalculator'
import type { FillingWeight, StabilityTemperature, TransportCondition } from '../types/stabilityCalculator'
import './CakeStabilityCalculator.css'

export function CakeStabilityCalculator() {
  const [tierCount, setTierCount] = useState(2)
  const [diameterIn, setDiameterIn] = useState(8)
  const [fillingWeight, setFillingWeight] = useState<FillingWeight>('medium')
  const [temperature, setTemperature] = useState<StabilityTemperature>('moderate')
  const [transport, setTransport] = useState<TransportCondition>('short')

  const stability = calculateStability({ tierCount, diameterIn, fillingWeight, temperature, transport })

  return (
    <div className="card stability-calculator">
      <div className="stability-form">
        <label>
          Tiers
          <input type="number" min={1} max={6} value={tierCount} onChange={(e) => setTierCount(Math.min(6, Math.max(1, Number(e.target.value) || 1)))} />
        </label>
        <label>
          Base diameter
          <select value={diameterIn} onChange={(e) => setDiameterIn(Number(e.target.value))}>
            {[6, 8, 10, 12, 14, 16, 18, 20].map((d) => (
              <option key={d} value={d}>
                {d}"
              </option>
            ))}
          </select>
        </label>
        <label>
          Filling weight
          <select value={fillingWeight} onChange={(e) => setFillingWeight(e.target.value as FillingWeight)}>
            <option value="light">Light (whipped cream)</option>
            <option value="medium">Medium (buttercream)</option>
            <option value="heavy">Heavy (ganache, curd, mousse)</option>
          </select>
        </label>
        <label>
          Temperature
          <select value={temperature} onChange={(e) => setTemperature(e.target.value as StabilityTemperature)}>
            <option value="cool">Cool (under 65°F / 18°C)</option>
            <option value="moderate">Moderate (65-75°F / 18-24°C)</option>
            <option value="warm">Warm (over 75°F / 24°C)</option>
          </select>
        </label>
        <label>
          Transport
          <select value={transport} onChange={(e) => setTransport(e.target.value as TransportCondition)}>
            <option value="none">None — assembled on site</option>
            <option value="short">Short drive (under 30 min)</option>
            <option value="long">Long or multi-stop</option>
          </select>
        </label>
      </div>

      <div className="stability-results">
        <div className="stability-result-group">
          <h4>Supports</h4>
          <ul>
            {stability.supportNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="stability-result-group">
          <h4>Chilling</h4>
          <ul>
            {stability.chillNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="stability-result-group">
          <h4>Display</h4>
          <ul>
            {stability.displayNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
