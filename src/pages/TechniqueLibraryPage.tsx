import { TechniqueLibrary } from '../components/TechniqueLibrary'

export function TechniqueLibraryPage() {
  return (
    <main className="page">
      <h1>🔧 Technique Library</h1>
      <p>The hands-on techniques behind every stage of construction — what each one is, common mistakes, and a chef's tip.</p>
      <div className="card">
        <TechniqueLibrary />
      </div>
    </main>
  )
}
