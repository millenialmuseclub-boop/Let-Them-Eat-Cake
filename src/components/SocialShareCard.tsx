import { useRef, useState, type ReactNode } from 'react'
import { toPng, toBlob } from 'html-to-image'
import './SocialShareCard.css'

const CARD_BOTTOM_COLOR = '#3d2314'

export interface SocialShareCardProps {
  eyebrow: string
  title: string
  subtitle?: string
  colorHex: string
  imageUrl?: string
  shareUrl: string
  shareText: string
  filename: string
  children?: ReactNode
}

export function SocialShareCard({ eyebrow, title, subtitle, colorHex, imageUrl, shareUrl, shareText, filename, children }: SocialShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  async function withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Image generation timed out')), 15000))])
  }

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    setDownloadError(false)
    try {
      const dataUrl = await withTimeout(toPng(cardRef.current, { pixelRatio: 4 }))
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = dataUrl
      link.click()
    } catch {
      setDownloadError(true)
    } finally {
      setDownloading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    if (!cardRef.current || !('share' in navigator)) return
    setSharing(true)
    try {
      const blob = await withTimeout(toBlob(cardRef.current, { pixelRatio: 4 }))
      const files = blob ? [new File([blob], `${filename}.png`, { type: 'image/png' })] : undefined
      const canShareFiles = files && navigator.canShare?.({ files })
      await navigator.share(canShareFiles ? { files, title, text: shareText, url: shareUrl } : { title, text: shareText, url: shareUrl })
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
        {imageUrl && <img src={imageUrl} alt="" className="social-share-image" />}
        {!imageUrl && !children && (
          <div className="social-share-fallback-visual" aria-hidden="true">
            🍰
          </div>
        )}
        {children && <div className="social-share-visual">{children}</div>}
        <p className="social-share-wordmark">🍰 Let Them Eat Cake</p>
      </div>

      <div className="social-share-actions">
        <button className="btn" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Preparing…' : downloadError ? 'Try again' : 'Download image'}
        </button>
        <button className="btn btn-secondary" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy caption'}
        </button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button className="btn btn-secondary" onClick={handleShare} disabled={sharing}>
            {sharing ? 'Sharing…' : 'Share…'}
          </button>
        )}
      </div>
      {downloadError && <p className="social-share-error">Couldn't generate the image — please try again.</p>}

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
