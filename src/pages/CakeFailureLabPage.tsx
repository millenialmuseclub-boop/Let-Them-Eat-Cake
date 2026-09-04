import { CakeFailureLab } from '../components/CakeFailureLab'
import { CakeHeroImage } from '../components/CakeHeroImage'

export function CakeFailureLabPage() {
  return (
    <main className="page">
      <CakeHeroImage cakeId="cake_kladdkaka" variant="hero" alt="A dense cake, the kind structural failures happen to" />
      <h1>🚨 Cake Failure Lab</h1>
      <p>Something went wrong? Pick the symptom to see likely causes and how to fix it.</p>
      <div className="card">
        <CakeFailureLab />
      </div>
    </main>
  )
}
