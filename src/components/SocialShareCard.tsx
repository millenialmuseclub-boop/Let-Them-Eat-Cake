import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
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
}

type ShareState = 'idle' | 'sharing' | 'shared' | 'copied' | 'error'

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

export function SocialShareCard({ eyebrow, title, subtitle, detailLines, bodyLabel, bodyText, cta, shareUrl, shareText }: SocialShareCardProps) {
  const [state, setState] = useState<ShareState>('idle')

  useEffect(() => {
    if (state !== 'shared' && state !== 'copied') return
    const timer = setTimeout(() => setState('idle'), 2500)
    return () => clearTimeout(timer)
  }, [state])

  async function handleShare() {
    setState('sharing')
    const fullText = `${shareText} ${shareUrl}`

    try {
      if (Capacitor.isNativePlatform()) {
        // Native iOS/Android: navigator.share() is unreliable inside a Capacitor
        // WebView on both platforms, so this always goes through the real native
        // share sheet instead.
        await Share.share({ title, text: shareText, url: shareUrl, dialogTitle: title })
        hapticSuccess()
        setState('shared')
        return
      }

      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share({ title, text: shareText, url: shareUrl })
        setState('shared')
        return
      }

      const copied = await copyToClipboard(fullText)
      setState(copied ? 'copied' : 'error')
    } catch (err) {
      if (isUserCancelled(err)) {
        setState('idle')
        return
      }
      // The native or Web Share API failed for a real reason (not a user cancel) --
      // fall back to clipboard rather than leaving the user with no outcome at all.
      const copied = await copyToClipboard(fullText)
      setState(copied ? 'copied' : 'error')
    }
  }

  const buttonLabel =
    state === 'sharing' ? 'Sharing…' : state === 'shared' ? 'Shared!' : state === 'copied' ? 'Link Copied!' : state === 'error' ? 'Try Again' : cta

  return (
    <div className="social-share-wrap ltec-reveal">
      <div className="social-share-card">
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
        <button className="btn" onClick={handleShare} disabled={state === 'sharing'}>
          {buttonLabel}
        </button>
        <p className="social-share-status" role="status" aria-live="polite">
          {state === 'error' && `Couldn't share automatically — copy this link: ${shareUrl}`}
        </p>
      </div>
    </div>
  )
}
