import { useState } from 'react'
import './ShareCard.css'

export function ShareCard({ year, cakeName }: { year: number; cakeName: string }) {
  const [copied, setCopied] = useState(false)
  const shareText = `Born in ${year} — My Official Cake is ${cakeName} 🎂 #LetThemEatCake`

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="share-card">
      <p className="share-eyebrow">Born in {year}</p>
      <h2>My Official Cake is</h2>
      <p className="share-cake-name">{cakeName}</p>
      <button className="btn btn-secondary" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy shareable caption'}
      </button>
    </div>
  )
}
