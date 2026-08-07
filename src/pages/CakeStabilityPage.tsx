import { CakeStabilityCalculator } from '../components/CakeStabilityCalculator'
import { CuratorsToolDrawer } from '../components/CuratorsToolDrawer'
import { getProductsForHubPath } from '../lib/affiliateProducts'

export function CakeStabilityPage() {
  return (
    <main className="page">
      <h1>Cake Stability Calculator</h1>
      <p>Figure out supports, chill time, and display guidance for your build before you start baking.</p>
      <CakeStabilityCalculator />
      <CuratorsToolDrawer products={getProductsForHubPath('/cake-stability')} />
    </main>
  )
}
