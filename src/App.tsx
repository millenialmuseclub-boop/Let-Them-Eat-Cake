import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { TimeMachinePage } from './pages/TimeMachinePage'
import { AtlasPage } from './pages/AtlasPage'
import { AtlasRegionPage } from './pages/AtlasRegionPage'
import { SommelierPage } from './pages/SommelierPage'
import { PersonaMatchPage } from './pages/PersonaMatchPage'
import { PantryRaidPage } from './pages/PantryRaidPage'
import { WeddingJourneyPage } from './pages/WeddingJourneyPage'
import { BirthdayPlannerPage } from './pages/BirthdayPlannerPage'
import { OtherCelebrationsPage } from './pages/OtherCelebrationsPage'
import { AssemblyLabPage } from './pages/AssemblyLabPage'
import { CakeAnatomyPage } from './pages/CakeAnatomyPage'
import { CakeStabilityPage } from './pages/CakeStabilityPage'
import { TechniqueLibraryPage } from './pages/TechniqueLibraryPage'
import { CakeSciencePage } from './pages/CakeSciencePage'
import { CakeBlueprintsPage } from './pages/CakeBlueprintsPage'
import { CakeFailureLabPage } from './pages/CakeFailureLabPage'
import { CakeEncyclopediaIndexPage } from './pages/CakeEncyclopediaIndexPage'
import { CakeDetailPage } from './pages/CakeDetailPage'
import { PastryNotebookPage } from './pages/PastryNotebookPage'
import { IngredientIndexPage } from './pages/IngredientIndexPage'
import { IngredientDetailPage } from './pages/IngredientDetailPage'
import { CollectionsIndexPage } from './pages/CollectionsIndexPage'
import { CollectionDetailPage } from './pages/CollectionDetailPage'
import { BakingTraditionsIndexPage } from './pages/BakingTraditionsIndexPage'
import { BakingTraditionDetailPage } from './pages/BakingTraditionDetailPage'
import { CuratedKitchenPage } from './pages/CuratedKitchenPage'
import { CelebrateLandingPage } from './pages/CelebrateLandingPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { AboutPage } from './pages/AboutPage'
import { HubPage } from './components/HubPage'
import { TopNavBar } from './components/TopNavBar'
import { BottomTabBar } from './components/BottomTabBar'
import { FloatingBackButton } from './components/FloatingBackButton'
import { HUBS, hubWorld } from './data/hubs'

// Each other world's page bundle is route-level code-split via React.lazy, so visiting Cake
// (or Home) never pulls in Ramen/Cookies/Noodles' content -- each world's <World>Routes.tsx is
// the single lazy-loaded entry point for all of that world's pages, hub-landing routes included.
const RamenRoutes = lazy(() => import('./pages/ramen/RamenRoutes'))
const CookiesRoutes = lazy(() => import('./pages/cookies/CookiesRoutes'))
const NoodlesRoutes = lazy(() => import('./pages/noodles/NoodlesRoutes'))

function App() {
  return (
    <>
      <TopNavBar />
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

        {/* Other worlds -- each is its own lazily-loaded chunk, mounted at /<world>/* */}
        <Route
          path="/ramen/*"
          element={
            <Suspense fallback={<div className="page" />}>
              <RamenRoutes />
            </Suspense>
          }
        />
        <Route
          path="/cookies/*"
          element={
            <Suspense fallback={<div className="page" />}>
              <CookiesRoutes />
            </Suspense>
          }
        />
        <Route
          path="/noodles/*"
          element={
            <Suspense fallback={<div className="page" />}>
              <NoodlesRoutes />
            </Suspense>
          }
        />
      </Routes>
      <FloatingBackButton />
      <BottomTabBar />
    </>
  )
}

export default App
