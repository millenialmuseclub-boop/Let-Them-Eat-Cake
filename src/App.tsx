import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { HomePage } from './pages/HomePage'
import { TimeMachinePage } from './pages/TimeMachinePage'
import { AtlasPage } from './pages/AtlasPage'
import { SommelierPage } from './pages/SommelierPage'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/time-machine" element={<TimeMachinePage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/sommelier" element={<SommelierPage />} />
      </Routes>
    </>
  )
}

export default App
