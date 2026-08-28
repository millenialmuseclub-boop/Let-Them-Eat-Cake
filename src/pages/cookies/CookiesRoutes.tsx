import { Route, Routes } from 'react-router-dom'
import { HubPage } from '../../components/HubPage'
import { HUBS } from '../../data/hubs'
import { CookieEncyclopediaIndexPage } from './CookieEncyclopediaIndexPage'
import { CookieDetailPage } from './CookieDetailPage'
import { AtlasPage } from './AtlasPage'
import { WorkshopPage } from './WorkshopPage'
import { CookieAnatomyPage } from './CookieAnatomyPage'
import { BuildACookiePage } from './BuildACookiePage'
import { LabPage } from './LabPage'
import { TroubleshooterPage } from './TroubleshooterPage'
import { SommelierPage } from './SommelierPage'
import { SommelierFindPage } from './SommelierFindPage'
import { CrumbPage } from './CrumbPage'
import { Cookie101Page } from './Cookie101Page'
import { VocabularyPage } from './VocabularyPage'
import { TrailsIndexPage } from './TrailsIndexPage'
import { TrailDetailPage } from './TrailDetailPage'
import { Cookie101QuizPage } from './Cookie101QuizPage'
import { MyCookiesPage } from './MyCookiesPage'

// Single lazy-loaded entry point for the whole Cookies world (see App.tsx), mounted at
// /cookies/*. Workshop/Crumb/Sommelier are each a real ported page (direct hub); Main stays a
// generic hub-tile landing since Cookies never had its own MainPage in the port list.
const mainHub = HUBS.find((h) => h.path === '/cookies' && h.kind === 'landing')!

export default function CookiesRoutes() {
  return (
    <Routes>
      <Route path="" element={<HubPage hub={mainHub as Extract<typeof mainHub, { kind: 'landing' }>} />} />
      <Route path="atlas" element={<AtlasPage />} />
      <Route path="encyclopedia" element={<CookieEncyclopediaIndexPage />} />
      <Route path="encyclopedia/:cookieId" element={<CookieDetailPage />} />

      <Route path="workshop" element={<WorkshopPage />} />
      <Route path="workshop/anatomy" element={<CookieAnatomyPage />} />
      <Route path="workshop/build-a-cookie" element={<BuildACookiePage />} />
      <Route path="workshop/labs/:labSlug" element={<LabPage />} />
      <Route path="workshop/troubleshooter" element={<TroubleshooterPage />} />

      <Route path="sommelier" element={<SommelierPage />} />
      <Route path="sommelier/find" element={<SommelierFindPage />} />

      <Route path="crumb" element={<CrumbPage />} />
      <Route path="crumb/101" element={<Cookie101Page />} />
      <Route path="crumb/vocabulary" element={<VocabularyPage />} />
      <Route path="crumb/trails" element={<TrailsIndexPage />} />
      <Route path="crumb/trails/:trailId" element={<TrailDetailPage />} />
      <Route path="crumb/quiz" element={<Cookie101QuizPage />} />

      <Route path="my-cookies" element={<MyCookiesPage />} />
    </Routes>
  )
}
