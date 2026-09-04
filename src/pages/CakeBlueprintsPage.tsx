import { BlueprintExamples } from '../components/BlueprintExamples'
import { CuratorsToolDrawer } from '../components/CuratorsToolDrawer'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { getProductsForHubPath } from '../lib/affiliateProducts'

export function CakeBlueprintsPage() {
  return (
    <main className="page">
      <CakeHeroImage cakeId="cake_black_forest" variant="hero" alt="A cake built up layer by layer, exactly as engineered" />
      <h1>Real Cake Blueprints</h1>
      <p>How real, well-known cake families are actually engineered, layer by layer.</p>
      <BlueprintExamples />
      <CuratorsToolDrawer
        products={getProductsForHubPath('/cake-blueprints')}
        note="Tools for precise, layered builds like these."
      />
    </main>
  )
}
