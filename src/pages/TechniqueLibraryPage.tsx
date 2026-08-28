import { TechniqueLibrary } from '../components/TechniqueLibrary'
import { CakeHeroImage } from '../components/CakeHeroImage'

export function TechniqueLibraryPage() {
  return (
    <main className="page">
      <CakeHeroImage cakeId="cake_medovik" variant="hero" alt="A many-layered honey cake, built through repeated technique" />
      <h1>Technique Library</h1>
      <p>The hands-on techniques behind every stage of construction — what each one is, common mistakes, and a chef's tip.</p>
      <div className="card">
        <TechniqueLibrary />
      </div>
    </main>
  )
}
