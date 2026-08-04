import { useState } from 'react'
import { getComponentsByCategory, buildAssembledRecipe, combineFlavorProfile, describeCombo } from '../lib/assemblyLab'
import { calculateStability } from '../lib/stabilityCalculator'
import { CakeBlueprintDiagram } from '../components/CakeBlueprintDiagram'
import { CakeAnatomyExplainer } from '../components/CakeAnatomyExplainer'
import { FlavorProfileBars } from '../components/FlavorProfileBars'
import { RecipeCard } from '../components/RecipeCard'
import type { FillingWeight, StabilityTemperature, TransportCondition } from '../types/stabilityCalculator'
import './AssemblyLabPage.css'

const sponges = getComponentsByCategory('sponge')
const fillings = getComponentsByCategory('filling')
const frostings = getComponentsByCategory('frosting')
const garnishes = getComponentsByCategory('garnish')

export function AssemblyLabPage() {
  const [spongeId, setSpongeId] = useState(sponges[0].id)
  const [fillingId, setFillingId] = useState(fillings[0].id)
  const [frostingId, setFrostingId] = useState(frostings[0].id)
  const [garnishId, setGarnishId] = useState<string>('none')

  const [tierCount, setTierCount] = useState(2)
  const [diameterIn, setDiameterIn] = useState(8)
  const [fillingWeight, setFillingWeight] = useState<FillingWeight>('medium')
  const [temperature, setTemperature] = useState<StabilityTemperature>('moderate')
  const [transport, setTransport] = useState<TransportCondition>('short')

  const sponge = sponges.find((s) => s.id === spongeId)!
  const filling = fillings.find((f) => f.id === fillingId)!
  const frosting = frostings.find((f) => f.id === frostingId)!
  const garnish = garnishId === 'none' ? undefined : garnishes.find((g) => g.id === garnishId)

  const combinedProfile = combineFlavorProfile(sponge, filling, frosting)
  const description = describeCombo(sponge, filling, frosting, garnish)
  const assembledRecipe = buildAssembledRecipe(sponge, filling, frosting, garnish)
  const stability = calculateStability({ tierCount, diameterIn, fillingWeight, temperature, transport })

  return (
    <main className="page assembly-page">
      <h1>Assembly Lab</h1>
      <p>Pick a sponge, filling, and frosting — and an optional garnish — to build your own cake from scratch.</p>

      <div className="card assembly-form">
        <label>
          Sponge
          <select value={spongeId} onChange={(e) => setSpongeId(e.target.value)}>
            {sponges.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filling
          <select value={fillingId} onChange={(e) => setFillingId(e.target.value)}>
            {fillings.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Frosting
          <select value={frostingId} onChange={(e) => setFrostingId(e.target.value)}>
            {frostings.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Garnish
          <select value={garnishId} onChange={(e) => setGarnishId(e.target.value)}>
            <option value="none">None</option>
            {garnishes.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="assembly-preview">
        <div className="card assembly-illustration-card">
          <CakeBlueprintDiagram sponge={sponge} filling={filling} frosting={frosting} garnish={garnish} />
        </div>

        <div className="card assembly-summary-card">
          <p className="assembly-description">{description}</p>
          <FlavorProfileBars profile={combinedProfile} />
        </div>
      </div>

      <h2 className="recipe-heading">Full Recipe</h2>
      <RecipeCard key={assembledRecipe.id} recipe={assembledRecipe} />

      <h2 className="assembly-section-heading">Anatomy of a Cake</h2>
      <p>How professional layer cakes are actually built, stage by stage — click a stage to see its role.</p>
      <div className="card">
        <CakeAnatomyExplainer />
      </div>

      <h2 className="assembly-section-heading">Cake Stability Calculator</h2>
      <p>Figure out supports, chill time, and display guidance for your build before you start baking.</p>
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
    </main>
  )
}
