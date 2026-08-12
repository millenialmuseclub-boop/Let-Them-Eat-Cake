// Screen-awake abstraction for future Kitchen View / active-recipe sessions.
// Not wired into any screen yet in Phase 1 — there is no Kitchen View mode on
// the frozen web app to port, so this is purely the prepared foundation the
// spec asks for. `useKeepScreenAwake` is a hook a future recipe/cooking-mode
// screen can call for its lifetime; nothing calls it today.

import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { useEffect } from 'react'

const KITCHEN_VIEW_TAG = 'kitchen-view'

export function useKeepScreenAwake(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return
    activateKeepAwakeAsync(KITCHEN_VIEW_TAG)
    return () => {
      deactivateKeepAwake(KITCHEN_VIEW_TAG)
    }
  }, [enabled])
}
