import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { trackDiscovery } from '../lib/analytics'

export const PUBLIC_ORIGIN = 'https://letthemeatcake.netlify.app'

export function ContentShare({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState('')
  const url = `${PUBLIC_ORIGIN}${path}`
  async function share() {
    try {
      if (Capacitor.isNativePlatform()) await Share.share({ title, text: `Explore ${title} on Let Them Eat`, url })
      else if (navigator.share) await navigator.share({ title, url })
      else {
        await navigator.clipboard.writeText(url)
        setStatus('Link copied')
        trackDiscovery('Content Shared', { method: 'copy' })
        return
      }
      setStatus('Shared')
      trackDiscovery('Content Shared', { method: 'share' })
    } catch (error) {
      if (error instanceof Error && /abort|cancel/i.test(`${error.name} ${error.message}`)) return
      setStatus('Copy the link below to share.')
    }
  }
  return <div className="content-share">
    <button type="button" onClick={share}>Share this discovery</button>
    <span role="status">{status}</span>
    {status.startsWith('Copy the') && <input aria-label="Shareable link" readOnly value={url} onFocus={e => e.target.select()} />}
  </div>
}
