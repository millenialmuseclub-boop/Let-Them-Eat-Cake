import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { HomePage } from './pages/HomePage'
import { TimeMachinePage } from './pages/TimeMachinePage'
import { AtlasPage } from './pages/AtlasPage'
import { SommelierPage } from './pages/SommelierPage'
import { PersonaMatchPage } from './pages/PersonaMatchPage'
import { PantryRaidPage } from './pages/PantryRaidPage'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/time-machine" element={<TimeMachinePage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/sommelier" element={<SommelierPage />} />
        <Route path="/persona-match" element={<PersonaMatchPage />} />
        <Route path="/pantry-raid" element={<PantryRaidPage />} />
      </Routes>
    </>
  )
}

export default App
