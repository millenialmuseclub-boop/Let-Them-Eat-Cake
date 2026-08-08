import { useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import './SocialShareCard.css'

export interface SocialShareCardProps {
  eyebrow: string
  title: string
  subtitle?: string
  detailLines?: string[]
  bodyLabel?: string
  bodyText?: string
  cta: string
  shareUrl: string
  shareText: string
  filename: string
}

export function SocialShareCard({ eyebrow, title, subtitle, detailLines, bodyLabel, bodyText, cta, shareUrl, shareText, filename }: SocialShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  async function withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Image generation timed out')), 15000))])
  }

  async function handleShare() {
    setSharing(true)
    try {
      if (cardRef.current && typeof navigator !== 'undefined' && 'share' in navigator) {
        const blob = await withTimeout(toBlob(cardRef.current, { pixelRatio: 4 }))
        const files = blob ? [new File([blob], `${filename}.png`, { type: 'image/png' })] : undefined
        const canShareFiles = files && navigator.canShare?.({ files })
        await navigator.share(canShareFiles ? { files, title, text: shareText, url: shareUrl } : { title, text: shareText, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // User cancelled the share sheet, or sharing failed — nothing to do.
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="social-share-wrap">
      <div ref={cardRef} className="social-share-card">
        <p className="social-share-brand">Let Them Eat Cake</p>
        <p className="social-share-eyebrow">{eyebrow}</p>
        <h2 className="social-share-title">{title}</h2>
        {subtitle && <p className="social-share-subtitle">{subtitle}</p>}

        {detailLines && detailLines.length > 0 && (
          <ul className="social-share-detail-list">
            {detailLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}

        {bodyText && (
          <div className="social-share-body-block">
            {bodyLabel && <p className="social-share-body-label">{bodyLabel}</p>}
            <p className="social-share-body">{bodyText}</p>
          </div>
        )}

        <p className="social-share-cta">{cta}</p>
        <p className="social-share-wordmark">LetThemEatCake</p>
      </div>

      <div className="social-share-actions">
        <button className="btn" onClick={handleShare} disabled={sharing}>
          {sharing ? 'Sharing…' : copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}
