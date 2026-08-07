import { useState } from 'react'
import { getComponentsByCategory, buildAssembledRecipe, combineFlavorProfile, describeCombo } from '../lib/assemblyLab'
import { CakeBlueprintDiagram } from '../components/CakeBlueprintDiagram'
import { FlavorProfileBars } from '../components/FlavorProfileBars'
import { RecipeCard } from '../components/RecipeCard'
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

  const sponge = sponges.find((s) => s.id === spongeId)!
  const filling = fillings.find((f) => f.id === fillingId)!
  const frosting = frostings.find((f) => f.id === frostingId)!
  const garnish = garnishId === 'none' ? undefined : garnishes.find((g) => g.id === garnishId)

  const combinedProfile = combineFlavorProfile(sponge, filling, frosting)
  const description = describeCombo(sponge, filling, frosting, garnish)
  const assembledRecipe = buildAssembledRecipe(sponge, filling, frosting, garnish)

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
    </main>
  )
}
