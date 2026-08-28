import { RamenAnatomyExplainer } from '../../components/ramen/RamenAnatomyExplainer'
import { useDocumentTitle } from '../../lib/useDocumentTitle'

export function RamenAnatomyPage() {
  useDocumentTitle('Ramen Anatomy | Let Them Eat')

  return (
    <main className="page">
      <h1>Anatomy of a Bowl</h1>
      <p>Ramen is a system of eight interacting components, not one dish -- tap a component to see its role.</p>
      <div className="card">
        <RamenAnatomyExplainer />
      </div>
    </main>
  )
}
