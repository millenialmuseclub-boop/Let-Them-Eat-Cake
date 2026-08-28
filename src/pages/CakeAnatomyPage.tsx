import { CakeAnatomyExplainer } from '../components/CakeAnatomyExplainer'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { CuratorsToolDrawer } from '../components/CuratorsToolDrawer'
import { getProductsForHubPath } from '../lib/affiliateProducts'

export function CakeAnatomyPage() {
  return (
    <main className="page">
      <CakeHeroImage cakeId="cake_hummingbird" variant="hero" alt="A cut layer cake showing its internal structure" />
      <h1>Anatomy of a Cake</h1>
      <p>How professional layer cakes are actually built, stage by stage — click a stage to see its role.</p>
      <div className="card">
        <CakeAnatomyExplainer />
      </div>
      <CuratorsToolDrawer products={getProductsForHubPath('/cake-anatomy')} />
    </main>
  )
}
