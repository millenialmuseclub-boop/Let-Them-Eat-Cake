import { useEffect, useRef } from 'react'

/** Moves keyboard/screen-reader focus to an element as soon as it mounts -- used on result
    reveals (a generated plan, a quiz result) so assistive tech notices new content appeared
    instead of silently leaving focus on a now-removed button. Attach the returned ref to a
    heading with `tabIndex={-1}`. */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return ref
}
