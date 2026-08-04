import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import type { CakePersonality } from '../types/personaMatch'
import { FlavorRadarChart } from './FlavorRadarChart'
import './PersonaShareCard.css'

const CARD_BOTTOM_COLOR = '#3d2314'

export function PersonaShareCard({ personality, deepLinkPath }: { personality: CakePersonality; deepLinkPath: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${deepLinkPath}` : deepLinkPath
  const shareText = `My cake personality is ${personality.name} — ${personality.personalityTitle} 🎂 #LetThemEatCake ${shareUrl}`

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    setDownloadError(false)
    try {
      const dataUrl = await Promise.race([
        toPng(cardRef.current, { pixelRatio: 4 }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Image generation timed out')), 15000)),
      ])
      const link = document.createElement('a')
      link.download = `${personality.id}-cake-personality.png`
      link.href = dataUrl
      link.click()
    } catch {
      setDownloadError(true)
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="persona-share-wrap">
      <div
        ref={cardRef}
        className="persona-share-card"
        style={{ background: `linear-gradient(180deg, ${personality.colorHex} 0%, ${personality.colorHex} 35%, ${CARD_BOTTOM_COLOR} 100%)` }}
      >
        <p className="persona-share-eyebrow">My Cake Personality Is</p>
        <h2 className="persona-share-name">{personality.name}</h2>
        <p className="persona-share-title">{personality.personalityTitle}</p>
        <div className="persona-share-radar">
          <FlavorRadarChart profile={personality.targetFlavorProfile} colorHex="#ffffff" />
        </div>
        <p className="persona-share-url">{shareUrl}</p>
      </div>

      <div className="persona-share-actions">
        <button className="btn" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Preparing…' : downloadError ? 'Try again' : 'Download image'}
        </button>
        <button className="btn btn-secondary" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy caption'}
        </button>
      </div>
      {downloadError && <p className="persona-share-error">Couldn't generate the image — please try again.</p>}
    </div>
  )
}
