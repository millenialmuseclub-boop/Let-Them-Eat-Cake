import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { HomePage } from './pages/HomePage'
import { TimeMachinePage } from './pages/TimeMachinePage'
import { AtlasPage } from './pages/AtlasPage'
import { SommelierPage } from './pages/SommelierPage'
import { PersonaMatchPage } from './pages/PersonaMatchPage'
import { PantryRaidPage } from './pages/PantryRaidPage'
import { WeddingCakePlannerPage } from './pages/WeddingCakePlannerPage'
import { WeddingPlannerPage } from './pages/WeddingPlannerPage'
import { BirthdayPlannerPage } from './pages/BirthdayPlannerPage'
import { OtherCelebrationsPage } from './pages/OtherCelebrationsPage'
import { AssemblyLabPage } from './pages/AssemblyLabPage'
import { CakeAnatomyPage } from './pages/CakeAnatomyPage'
import { CakeStabilityPage } from './pages/CakeStabilityPage'
import { TechniqueLibraryPage } from './pages/TechniqueLibraryPage'
import { CakeSciencePage } from './pages/CakeSciencePage'
import { CakeBlueprintsPage } from './pages/CakeBlueprintsPage'
import { CakeFailureLabPage } from './pages/CakeFailureLabPage'
import { BakeOffPage } from './pages/BakeOffPage'
import { CakeEncyclopediaIndexPage } from './pages/CakeEncyclopediaIndexPage'
import { CakeDetailPage } from './pages/CakeDetailPage'
import { PastryNotebookPage } from './pages/PastryNotebookPage'
import { IngredientIndexPage } from './pages/IngredientIndexPage'
import { IngredientDetailPage } from './pages/IngredientDetailPage'
import { CollectionsIndexPage } from './pages/CollectionsIndexPage'
import { CollectionDetailPage } from './pages/CollectionDetailPage'
import { BakingTraditionsIndexPage } from './pages/BakingTraditionsIndexPage'
import { BakingTraditionDetailPage } from './pages/BakingTraditionDetailPage'
import { MyCollectionsIndexPage } from './pages/MyCollectionsIndexPage'
import { MyCollectionDetailPage } from './pages/MyCollectionDetailPage'
import { HubPage } from './components/HubPage'
import { BottomTabBar } from './components/BottomTabBar'
import { HUBS } from './data/hubs'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {HUBS.filter((hub): hub is Extract<typeof hub, { kind: 'landing' }> => hub.kind === 'landing').map((hub) => (
          <Route key={hub.path} path={hub.path} element={<HubPage hub={hub} />} />
        ))}
        <Route path="/time-machine" element={<TimeMachinePage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/sommelier" element={<SommelierPage />} />
        <Route path="/persona-match" element={<PersonaMatchPage />} />
        <Route path="/pantry-raid" element={<PantryRaidPage />} />
        <Route path="/wedding-cake-planner" element={<WeddingCakePlannerPage />} />
        <Route path="/wedding-planner" element={<WeddingPlannerPage />} />
        <Route path="/birthday-planner" element={<BirthdayPlannerPage />} />
        <Route path="/other-celebrations" element={<OtherCelebrationsPage />} />
        <Route path="/assembly-lab" element={<AssemblyLabPage />} />
        <Route path="/cake-anatomy" element={<CakeAnatomyPage />} />
        <Route path="/cake-stability" element={<CakeStabilityPage />} />
        <Route path="/technique-library" element={<TechniqueLibraryPage />} />
        <Route path="/cake-science" element={<CakeSciencePage />} />
        <Route path="/cake-blueprints" element={<CakeBlueprintsPage />} />
        <Route path="/cake-failure-lab" element={<CakeFailureLabPage />} />
        <Route path="/bake-off" element={<BakeOffPage />} />
        <Route path="/encyclopedia" element={<CakeEncyclopediaIndexPage />} />
        <Route path="/cake/:id" element={<CakeDetailPage />} />
        <Route path="/notebook" element={<PastryNotebookPage />} />
        <Route path="/ingredients" element={<IngredientIndexPage />} />
        <Route path="/ingredient/:slug" element={<IngredientDetailPage />} />
        <Route path="/collections" element={<CollectionsIndexPage />} />
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
        <Route path="/traditions" element={<BakingTraditionsIndexPage />} />
        <Route path="/traditions/:id" element={<BakingTraditionDetailPage />} />
        <Route path="/my-collections" element={<MyCollectionsIndexPage />} />
        <Route path="/my-collections/:id" element={<MyCollectionDetailPage />} />
      </Routes>
      <BottomTabBar />
    </>
  )
}

export default App
