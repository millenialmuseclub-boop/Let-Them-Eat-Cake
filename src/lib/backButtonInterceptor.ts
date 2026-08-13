// Lets a mounted component claim the Android hardware back button before it
// falls through to real browser history (see src/main.tsx). Only needed
// where there's no history entry to represent the thing that should close
// first -- multi-step Celebrate wizards track their step in plain component
// state, not the URL, so there's nothing for history.back() to unwind there.
// Everything else (route changes, detail pages) is real BrowserRouter
// history and needs no entry here at all.

type BackHandler = () => boolean // return true if this handler consumed the back press

const handlers: BackHandler[] = []

/** Registers a handler for the lifetime of the calling component; call the returned function on unmount. */
export function registerBackHandler(handler: BackHandler): () => void {
  handlers.push(handler)
  return () => {
    const i = handlers.indexOf(handler)
    if (i !== -1) handlers.splice(i, 1)
  }
}

/** Most-recently-registered (innermost-mounted) handler gets first chance. */
export function runBackHandlers(): boolean {
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i]()) return true
  }
  return false
}
