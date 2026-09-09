import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './styles/worldAccents.css'
import { markAppReady, checkForOtaUpdate } from './lib/otaUpdater'
import { HomePage } from './pages/HomePage'
const TimeMachinePage = lazy(() => import('./pages/TimeMachinePage').then((module) => ({ default: module.TimeMachinePage })))
const AtlasPage = lazy(() => import('./pages/AtlasPage').then((module) => ({ default: module.AtlasPage })))
const AtlasRegionPage = lazy(() => import('./pages/AtlasRegionPage').then((module) => ({ default: module.AtlasRegionPage })))
const SommelierPage = lazy(() => import('./pages/SommelierPage').then((module) => ({ default: module.SommelierPage })))
const PersonaMatchPage = lazy(() => import('./pages/PersonaMatchPage').then((module) => ({ default: module.PersonaMatchPage })))
const PantryRaidPage = lazy(() => import('./pages/PantryRaidPage').then((module) => ({ default: module.PantryRaidPage })))
const WeddingJourneyPage = lazy(() => import('./pages/WeddingJourneyPage').then((module) => ({ default: module.WeddingJourneyPage })))
const BirthdayPlannerPage = lazy(() => import('./pages/BirthdayPlannerPage').then((module) => ({ default: module.BirthdayPlannerPage })))
const OtherCelebrationsPage = lazy(() => import('./pages/OtherCelebrationsPage').then((module) => ({ default: module.OtherCelebrationsPage })))
const AssemblyLabPage = lazy(() => import('./pages/AssemblyLabPage').then((module) => ({ default: module.AssemblyLabPage })))
const CakeAnatomyPage = lazy(() => import('./pages/CakeAnatomyPage').then((module) => ({ default: module.CakeAnatomyPage })))
const CakeStabilityPage = lazy(() => import('./pages/CakeStabilityPage').then((module) => ({ default: module.CakeStabilityPage })))
const TechniqueLibraryPage = lazy(() => import('./pages/TechniqueLibraryPage').then((module) => ({ default: module.TechniqueLibraryPage })))
const CakeSciencePage = lazy(() => import('./pages/CakeSciencePage').then((module) => ({ default: module.CakeSciencePage })))
const CakeBlueprintsPage = lazy(() => import('./pages/CakeBlueprintsPage').then((module) => ({ default: module.CakeBlueprintsPage })))
const CakeFailureLabPage = lazy(() => import('./pages/CakeFailureLabPage').then((module) => ({ default: module.CakeFailureLabPage })))
const CakeEncyclopediaIndexPage = lazy(() => import('./pages/CakeEncyclopediaIndexPage').then((module) => ({ default: module.CakeEncyclopediaIndexPage })))
const CakeDetailPage = lazy(() => import('./pages/CakeDetailPage').then((module) => ({ default: module.CakeDetailPage })))
const PastryNotebookPage = lazy(() => import('./pages/PastryNotebookPage').then((module) => ({ default: module.PastryNotebookPage })))
const IngredientIndexPage = lazy(() => import('./pages/IngredientIndexPage').then((module) => ({ default: module.IngredientIndexPage })))
const IngredientDetailPage = lazy(() => import('./pages/IngredientDetailPage').then((module) => ({ default: module.IngredientDetailPage })))
const CollectionsIndexPage = lazy(() => import('./pages/CollectionsIndexPage').then((module) => ({ default: module.CollectionsIndexPage })))
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage').then((module) => ({ default: module.CollectionDetailPage })))
const BakingTraditionsIndexPage = lazy(() => import('./pages/BakingTraditionsIndexPage').then((module) => ({ default: module.BakingTraditionsIndexPage })))
const BakingTraditionDetailPage = lazy(() => import('./pages/BakingTraditionDetailPage').then((module) => ({ default: module.BakingTraditionDetailPage })))
const CuratedKitchenPage = lazy(() => import('./pages/CuratedKitchenPage').then((module) => ({ default: module.CuratedKitchenPage })))
const CelebrateLandingPage = lazy(() => import('./pages/CelebrateLandingPage').then((module) => ({ default: module.CelebrateLandingPage })))
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then((module) => ({ default: module.DiscoverPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })))
const HubPage = lazy(() => import('./components/HubPage').then((module) => ({ default: module.HubPage })))
import { TopNavBar } from './components/TopNavBar'
import { BottomTabBar } from './components/BottomTabBar'
import { FloatingBackButton } from './components/FloatingBackButton'
import { RouteLoading, RouteNotFound, StorageNotice } from './components/RouteStatus'
import { HUBS, hubWorld, worldFromPathname } from './data/hubs'

// Each other world's page bundle is route-level code-split via React.lazy, so visiting Cake
// (or Home) never pulls in Ramen/Cookies/Noodles' content -- each world's <World>Routes.tsx is
// the single lazy-loaded entry point for all of that world's pages, hub-landing routes included.
const RamenRoutes = lazy(() => import('./pages/ramen/RamenRoutes'))
const PhotoCreditsPage = lazy(() => import('./pages/PhotoCreditsPage').then((module) => ({ default: module.PhotoCreditsPage })))
const CookiesRoutes = lazy(() => import('./pages/cookies/CookiesRoutes'))
const NoodlesRoutes = lazy(() => import('./pages/noodles/NoodlesRoutes'))

// Non-Cake worlds get their own accent color (see styles/worldAccents.css) applied across the
// whole shell -- nav chrome included, not just in-page content -- via a class on a wrapper div
// computed from the current route. The class only overrides a couple of accent tokens scoped to
// itself, so it can never bleed into Cake's own pages: there's no :root involved, and the
// override simply doesn't apply once its wrapper unmounts on navigating elsewhere.
function worldAccentClass(pathname: string): string | undefined {
  const world = worldFromPathname(pathname)
  return world && world !== 'cake' ? `${world}-world` : undefined
}

let didConfirmBoot = false
function ConfirmBoot() {
  useEffect(() => {
    if (didConfirmBoot) return
    didConfirmBoot = true
    void markAppReady()
    void checkForOtaUpdate()
  }, [])
  return null
}

function App() {
  const { pathname } = useLocation()
  return (
    <div className={worldAccentClass(pathname)}>
      <TopNavBar />
      <StorageNotice />
      <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/celebrate" element={<CelebrateLandingPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/my-cakes" element={<Navigate to="/discover" replace />} />
        <Route path="/my-collections" element={<Navigate to="/discover" replace />} />
        {HUBS.filter(
          (hub): hub is Extract<typeof hub, { kind: 'landing' }> =>
            hub.kind === 'landing' && hubWorld(hub) === 'cake' && hub.path !== '/celebrate' && hub.path !== '/discover',
        ).map((hub) => (
          <Route key={hub.path} path={hub.path} element={<HubPage hub={hub} />} />
        ))}
        <Route path="/time-machine" element={<TimeMachinePage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/atlas/region/:region" element={<AtlasRegionPage />} />
        <Route path="/sommelier" element={<SommelierPage />} />
        <Route path="/persona-match" element={<PersonaMatchPage />} />
        <Route path="/pantry-raid" element={<PantryRaidPage />} />
        <Route path="/wedding-cake-planner" element={<Navigate to="/wedding-planner" replace />} />
        <Route path="/wedding-planner" element={<WeddingJourneyPage />} />
        <Route path="/birthday-planner" element={<BirthdayPlannerPage />} />
        <Route path="/other-celebrations" element={<OtherCelebrationsPage />} />
        <Route path="/assembly-lab" element={<AssemblyLabPage />} />
        <Route path="/cake-anatomy" element={<CakeAnatomyPage />} />
        <Route path="/cake-stability" element={<CakeStabilityPage />} />
        <Route path="/technique-library" element={<TechniqueLibraryPage />} />
        <Route path="/cake-science" element={<CakeSciencePage />} />
        <Route path="/cake-blueprints" element={<CakeBlueprintsPage />} />
        <Route path="/cake-failure-lab" element={<CakeFailureLabPage />} />
        <Route path="/encyclopedia" element={<CakeEncyclopediaIndexPage />} />
        <Route path="/cake/:id" element={<CakeDetailPage />} />
        <Route path="/notebook" element={<PastryNotebookPage />} />
        <Route path="/ingredients" element={<IngredientIndexPage />} />
        <Route path="/ingredient/:slug" element={<IngredientDetailPage />} />
        <Route path="/collections" element={<CollectionsIndexPage />} />
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
        <Route path="/traditions" element={<BakingTraditionsIndexPage />} />
        <Route path="/traditions/:id" element={<BakingTraditionDetailPage />} />
        <Route path="/curated-kitchen" element={<CuratedKitchenPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/photo-credits" element={<PhotoCreditsPage />} />

        {/* Other worlds -- each is its own lazily-loaded chunk, mounted at /<world>/* */}
        <Route
          path="/ramen/*"
          element={
            <RamenRoutes />
          }
        />
        <Route
          path="/cookies/*"
          element={
            <CookiesRoutes />
          }
        />
        <Route
          path="/noodles/*"
          element={
            <NoodlesRoutes />
          }
        />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
      <ConfirmBoot />
      </Suspense>
      <FloatingBackButton />
      <BottomTabBar />
    </div>
  )
}

export default App
