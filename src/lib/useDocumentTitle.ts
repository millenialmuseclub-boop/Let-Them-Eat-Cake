import { useEffect } from 'react'

/** Sets a page-specific document title while mounted, restoring the previous title on unmount -- needed since every route currently shares index.html's static title, which hurts deep-link previews and browser history/tab discoverability. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
