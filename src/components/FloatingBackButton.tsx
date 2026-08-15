import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { runBackHandlers } from '../lib/backButtonInterceptor'
import './FloatingBackButton.css'

/** A visible, always-present "Back" affordance for iOS and web/PWA, which have no built-in
    back control of their own (iOS only has an invisible edge-swipe gesture; the browser/PWA
    chrome may not show one either). Native Android already has this covered by its own
    hardware/gesture back button (see the backButton listener in src/main.tsx, which runs the
    identical wizard-interception-first logic below), so this renders nothing there -- a
    second on-screen back control would be redundant with the OS-level one. */
export function FloatingBackButton() {
  const navigate = useNavigate()

  if (Capacitor.getPlatform() === 'android') return null

  function handleBack() {
    if (runBackHandlers()) return

    const idx = (window.history.state as { idx?: number } | null)?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }

    navigate('/discover')
  }

  return (
    <div className="floating-back-button-wrap">
      <button type="button" className="floating-back-button" onClick={handleBack}>
        ← Back
      </button>
    </div>
  )
}
