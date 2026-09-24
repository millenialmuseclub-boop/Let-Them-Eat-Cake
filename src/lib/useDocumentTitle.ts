import { useEffect } from 'react'

/** Sets a page-specific document title while mounted, restoring the previous title on unmount -- needed since every route currently shares index.html's static title, which hurts deep-link previews and browser history/tab discoverability. */
export function useDocumentTitle(title: string, metadata?: { description?: string; image?: string }): void {
  const description = metadata?.description ?? 'Explore food, flavor, culture and technique across Cake, Cookies, Ramen and Noodles with Let Them Eat.'
  const image = metadata?.image
  useEffect(() => {
    const previous = document.title
    document.title = title
    const origin = 'https://letthemeatcake.netlify.app'
    const url = origin + window.location.pathname.replace(/\/$/, '')
    for (const [attribute, name, content] of [
      ['name', 'description', description], ['property', 'og:title', title],
      ['property', 'og:description', description], ['property', 'og:url', url],
      ['property', 'og:image', image ? new URL(image, origin).href : `${origin}/icons/icon-512.png`],
      ['name', 'twitter:title', title], ['name', 'twitter:description', description],
      ['name', 'twitter:image', image ? new URL(image, origin).href : `${origin}/icons/icon-512.png`],
    ]) {
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.append(element) }
      element.content = content
    }
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = url || origin
    return () => {
      document.title = previous
    }
  }, [title, description, image])
}
