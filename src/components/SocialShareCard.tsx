import { useRef, useState, type ReactNode } from 'react'
import { toBlob } from 'html-to-image'
import './SocialShareCard.css'

const CARD_BOTTOM_COLOR = '#3d2314'

export interface SocialShareCardProps {
  eyebrow: string
  title: string
  subtitle?: string
  bodyText?: string
  colorHex: string
  imageUrl?: string
  shareUrl: string
  shareText: string
  filename: string
  children?: ReactNode
}

export function SocialShareCard({ eyebrow, title, subtitle, bodyText, colorHex, imageUrl, shareUrl, shareText, filename, children }: SocialShareCardProps) {
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

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(shareText)

  return (
    <div className="social-share-wrap">
      <div
        ref={cardRef}
        className="social-share-card"
        style={{ background: `linear-gradient(180deg, ${colorHex} 0%, ${colorHex} 35%, ${CARD_BOTTOM_COLOR} 100%)` }}
      >
        <p className="social-share-eyebrow">{eyebrow}</p>
        <h2 className="social-share-title">{title}</h2>
        {subtitle && <p className="social-share-subtitle">{subtitle}</p>}
        {bodyText && <p className="social-share-body">{bodyText}</p>}
        {imageUrl && <img src={imageUrl} alt="" className="social-share-image" crossOrigin="anonymous" />}
        {!imageUrl && !children && (
          <div className="social-share-fallback-visual" aria-hidden="true">
            🍰
          </div>
        )}
        {children && <div className="social-share-visual">{children}</div>}
        <p className="social-share-wordmark">🍰 Let Them Eat Cake</p>
      </div>

      <div className="social-share-actions">
        <button className="btn" onClick={handleShare} disabled={sharing}>
          {sharing ? 'Sharing…' : copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      <div className="social-share-platform-row">
        <a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noreferrer" className="social-share-platform-link">
          𝕏
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" className="social-share-platform-link">
          📘
        </a>
        <a
          href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}`}
          target="_blank"
          rel="noreferrer"
          className="social-share-platform-link"
        >
          📌
        </a>
      </div>
    </div>
  )
}
