import { CakeAnatomyExplainer } from '../components/CakeAnatomyExplainer'

export function CakeAnatomyPage() {
  return (
    <main className="page">
      <h1>Anatomy of a Cake</h1>
      <p>How professional layer cakes are actually built, stage by stage — click a stage to see its role.</p>
      <div className="card">
        <CakeAnatomyExplainer />
      </div>
    </main>
  )
}
