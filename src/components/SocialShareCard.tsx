import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { hapticSuccess } from '../lib/haptics'
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
  /** Used only for the generated image's filename -- keep it filesystem-safe. */
  filename: string
}

type ShareState = 'idle' | 'generating' | 'sharing' | 'shared' | 'copied' | 'error'

function isUserCancelled(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  return err.name === 'AbortError' || /cancel/i.test(err.message)
}

/** Tries the modern Clipboard API first, then falls back to the older execCommand
    approach -- some embedded/locked-down webviews block the async Clipboard API
    outright, and silently doing nothing in that case is exactly the "sharing doesn't
    work" bug this replaces. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the execCommand fallback below.
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Image generation timed out')), ms))])
}

export function SocialShareCard({ eyebrow, title, subtitle, detailLines, bodyLabel, bodyText, cta, shareUrl, shareText, filename }: SocialShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ShareState>('idle')

  useEffect(() => {
    if (state !== 'shared' && state !== 'copied') return
    const timer = setTimeout(() => setState('idle'), 2500)
    return () => clearTimeout(timer)
  }, [state])

  async function handleShare() {
    setState('generating')

    // Native apps have no real web origin (window.location is capacitor://localhost/...,
    // which Instagram/Messages/Mail reject outright), so the URL only makes sense as a
    // share payload on a real web page -- never pass it to the native share sheet.
    const fullTextForClipboard = Capacitor.isNativePlatform() ? shareText : `${shareText} ${shareUrl}`

    try {
      // Card design is intentionally image-free/text-only, so this never captures a
      // photo, chrome, or anything beyond the card itself.
      const dataUrl = cardRef.current ? await withTimeout(toPng(cardRef.current, { pixelRatio: 3, cacheBust: true }), 15000) : null

      if (Capacitor.isNativePlatform()) {
        if (!dataUrl) throw new Error('Card image unavailable')
        const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
        const path = `${filename}-${Date.now()}.png`
        const written = await Filesystem.writeFile({ path, data: base64, directory: Directory.Cache })

        setState('sharing')
        // Image file only -- no url, so there's nothing capacitor://-scheme for the
        // destination app to choke on. text carries the caption instead.
        await Share.share({ title, text: shareText, files: [written.uri], dialogTitle: title })
        hapticSuccess()
        setState('shared')
        return
      }

      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        if (dataUrl && navigator.canShare) {
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], `${filename}.png`, { type: 'image/png' })
          if (navigator.canShare({ files: [file] })) {
            setState('sharing')
            await navigator.share({ files: [file], title, text: shareText })
            setState('shared')
            return
          }
        }
        // No file-share support in this browser -- a real https URL is a legitimate
        // payload here (this is an actual web page, not a native WebView).
        setState('sharing')
        await navigator.share({ title, text: shareText, url: shareUrl })
        setState('shared')
        return
      }

      const copied = await copyToClipboard(fullTextForClipboard)
      setState(copied ? 'copied' : 'error')
    } catch (err) {
      if (isUserCancelled(err)) {
        setState('idle')
        return
      }
      // Image generation or the share sheet failed for a real reason (not a user
      // cancel) -- fall back to clipboard rather than leaving the user with no outcome.
      const copied = await copyToClipboard(fullTextForClipboard)
      setState(copied ? 'copied' : 'error')
    }
  }

  const buttonLabel =
    state === 'generating'
      ? 'Preparing…'
      : state === 'sharing'
        ? 'Sharing…'
        : state === 'shared'
          ? 'Shared!'
          : state === 'copied'
            ? 'Copied!'
            : state === 'error'
              ? 'Try Again'
              : cta
  const busy = state === 'generating' || state === 'sharing'

  return (
    <div className="social-share-wrap ltec-reveal">
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
        <button className="btn" onClick={handleShare} disabled={busy}>
          {buttonLabel}
        </button>
        <p className="social-share-status" role="status" aria-live="polite">
          {state === 'error' &&
            (Capacitor.isNativePlatform() ? "Couldn't share automatically — copied the caption instead." : `Couldn't share automatically — copy this link: ${shareUrl}`)}
        </p>
      </div>
    </div>
  )
}
