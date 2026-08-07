import { CakeScienceExplainer } from '../components/CakeScienceExplainer'

export function CakeSciencePage() {
  return (
    <main className="page">
      <h1>🧪 Cake Science</h1>
      <p>The baking science behind why each ingredient and technique does what it does.</p>
      <div className="card">
        <CakeScienceExplainer />
      </div>
    </main>
  )
}
