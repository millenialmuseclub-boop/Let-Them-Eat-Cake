import { CakeFailureLab } from '../components/CakeFailureLab'

export function CakeFailureLabPage() {
  return (
    <main className="page">
      <h1>🚨 Cake Failure Lab</h1>
      <p>Something went wrong? Pick the symptom to see likely causes and how to fix it.</p>
      <div className="card">
        <CakeFailureLab />
      </div>
    </main>
  )
}
