import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { checkForOtaUpdate, markAppReady } from './lib/otaUpdater'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Fire-and-forget, after the app has already rendered — never blocks startup.
markAppReady()
checkForOtaUpdate()
