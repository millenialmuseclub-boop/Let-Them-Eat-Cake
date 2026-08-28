import { Route, Routes } from 'react-router-dom'
import { HubPage } from '../../components/HubPage'
import { HUBS } from '../../data/hubs'
import { RamenEncyclopediaIndexPage } from './RamenEncyclopediaIndexPage'
import { RamenDetailPage } from './RamenDetailPage'
import { AtlasPage } from './AtlasPage'
import { WorkshopPage } from './WorkshopPage'
import { BuildABowlPage } from './BuildABowlPage'
import { LabPage } from './LabPage'
import { TroubleshooterPage } from './TroubleshooterPage'
import { SlurpPage } from './SlurpPage'
import { GuidePage } from './GuidePage'
import { VocabularyPage } from './VocabularyPage'
import { FindYourBowlPage } from './FindYourBowlPage'
import { TrailsIndexPage } from './TrailsIndexPage'
import { TrailDetailPage } from './TrailDetailPage'
import { Ramen101QuizPage } from './Ramen101QuizPage'
import { SommelierFindPage } from './SommelierFindPage'
import { SommelierPairPage } from './SommelierPairPage'
import { MyRamenPage } from './MyRamenPage'

// This is the single lazy-loaded entry point for the whole Ramen world (see App.tsx), mounted at
// /ramen/*. All routes here are relative (no leading /ramen). The four "tab" landing routes
// (Main, Workshop, Slurp, Sommelier) are rendered here rather than from App.tsx's generic
// HUBS-driven loop, since that loop only handles Cake's own hubs -- Cake's shell (BottomTabBar,
// TopNavBar, hubs.ts data model) stays canonical, but each world wires its own hub-backed routes.
const mainHub = HUBS.find((h) => h.path === '/ramen' && h.kind === 'landing')!
const sommelierHub = HUBS.find((h) => h.path === '/ramen/sommelier' && h.kind === 'landing')!

export default function RamenRoutes() {
  return (
    <Routes>
      <Route path="" element={<HubPage hub={mainHub as Extract<typeof mainHub, { kind: 'landing' }>} />} />
      <Route path="atlas" element={<AtlasPage />} />
      <Route path="encyclopedia" element={<RamenEncyclopediaIndexPage />} />
      <Route path="ramen/:id" element={<RamenDetailPage />} />

      <Route path="workshop" element={<WorkshopPage />} />
      <Route path="build-a-bowl" element={<BuildABowlPage />} />
      <Route path="broth-lab" element={<LabPage />} />
      <Route path="noodle-lab" element={<LabPage />} />
      <Route path="tare-lab" element={<LabPage />} />
      <Route path="aroma-oil-lab" element={<LabPage />} />
      <Route path="ajitama-lab" element={<LabPage />} />
      <Route path="chashu-lab" element={<LabPage />} />
      <Route path="troubleshooter" element={<TroubleshooterPage />} />

      <Route path="slurp" element={<SlurpPage />} />
      <Route path="slurp/guides/:slug" element={<GuidePage />} />
      <Route path="slurp/vocabulary" element={<VocabularyPage />} />
      <Route path="slurp/find-your-bowl" element={<FindYourBowlPage />} />
      <Route path="slurp/trails" element={<TrailsIndexPage />} />
      <Route path="slurp/trails/:id" element={<TrailDetailPage />} />
      <Route path="slurp/ramen-101" element={<Ramen101QuizPage />} />

      <Route path="sommelier" element={<HubPage hub={sommelierHub as Extract<typeof sommelierHub, { kind: 'landing' }>} />} />
      <Route path="sommelier/find" element={<SommelierFindPage />} />
      <Route path="sommelier/pair" element={<SommelierPairPage />} />

      <Route path="my-ramen" element={<MyRamenPage />} />
    </Routes>
  )
}
