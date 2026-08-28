import { Route, Routes } from 'react-router-dom'
import { HubPage } from '../../components/HubPage'
import { HUBS } from '../../data/hubs'
// Allowlisted component-level styling recovered from Noodles' own global index.css (see
// scripts/extract-world-css.mjs) -- image/tile sizing, atlas lists, etc. Nothing that redefines
// :root or a classname Cake's own shell/shared components already own. Lazy-loaded chunk only.
import './noodles-content.css'
import { EncyclopediaIndexPage } from './EncyclopediaIndexPage'
import { NoodleTypeIndexPage } from './NoodleTypeIndexPage'
import { NoodleTypeDetailPage } from './NoodleTypeDetailPage'
import { DishDetailPage } from './DishDetailPage'
import { AtlasPage } from './AtlasPage'
import { WorkshopPage } from './WorkshopPage'
import { LabPage } from './LabPage'
import { TroubleshooterPage } from './TroubleshooterPage'
import { SommelierFindPage } from './SommelierFindPage'
import { TwirlPage } from './TwirlPage'
import { TwirlStoryPage } from './TwirlStoryPage'
import { MyNoodlesPage } from './MyNoodlesPage'
import { CuratedKitchenPage } from './CuratedKitchenPage'
import { NotFoundPage } from './NotFoundPage'

// Single lazy-loaded entry point for the whole Noodles world (see App.tsx), mounted at
// /noodles/*. Workshop/Twirl/Sommelier are each a real ported page (direct hub); Main stays a
// generic hub-tile landing (Atlas/Encyclopedia/Noodle Types), matching Ramen/Cookies' pattern.
const mainHub = HUBS.find((h) => h.path === '/noodles' && h.kind === 'landing')!

export default function NoodlesRoutes() {
  return (
    <Routes>
      <Route path="" element={<HubPage hub={mainHub as Extract<typeof mainHub, { kind: 'landing' }>} />} />
      <Route path="atlas" element={<AtlasPage />} />
      <Route path="encyclopedia" element={<EncyclopediaIndexPage />} />
      <Route path="encyclopedia/noodle-types" element={<NoodleTypeIndexPage />} />
      <Route path="encyclopedia/type/:id" element={<NoodleTypeDetailPage />} />
      <Route path="encyclopedia/:id" element={<DishDetailPage />} />

      <Route path="workshop" element={<WorkshopPage />} />
      <Route path="workshop/lab/:slug" element={<LabPage />} />
      <Route path="workshop/troubleshooter" element={<TroubleshooterPage />} />

      <Route path="twirl" element={<TwirlPage />} />
      <Route path="twirl/:slug" element={<TwirlStoryPage />} />

      <Route path="sommelier" element={<SommelierFindPage />} />

      <Route path="my-noodles" element={<MyNoodlesPage />} />
      <Route path="curated-kitchen" element={<CuratedKitchenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
