import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import './index.css'
import App from './App.tsx'
import { runBackHandlers } from './lib/backButtonInterceptor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// OTA readiness is confirmed after the initial route commits in App.tsx.

// Android hardware back button. Order: 1) let a mounted component (Celebrate
// wizard step, open share card) claim it first -- see backButtonInterceptor.ts.
// 2) otherwise defer to real browser history, which BrowserRouter keeps in
// sync with actual route navigation, so this correctly walks back through
// whatever the user really visited. 3) only exit the app when there's
// nothing left in this session's history to unwind.
if (Capacitor.isNativePlatform()) {
  CapacitorApp.addListener('backButton', () => {
    if (runBackHandlers()) return

    const idx = (window.history.state as { idx?: number } | null)?.idx
    if (typeof idx === 'number' && idx > 0) {
      window.history.back()
      return
    }

    CapacitorApp.exitApp()
  })
}
