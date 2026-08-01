import { useState } from 'react'
import type { CakeProfile } from '../types/cake'
import type { AestheticTag, MoodTag, ZodiacSign } from '../types/persona'
import {
  AESTHETIC_OPTIONS,
  MOOD_OPTIONS,
  ZODIAC_SIGN_OPTIONS,
  cakesByAesthetic,
  cakesByMood,
  cakesByZodiacSign,
} from '../lib/persona'
import './PersonaMatchPage.css'

type MatchMode = 'zodiac' | 'mood' | 'aesthetic'

const MODES: { value: MatchMode; label: string }[] = [
  { value: 'zodiac', label: 'Zodiac' },
  { value: 'mood', label: 'Mood' },
  { value: 'aesthetic', label: 'Aesthetic' },
]

export function PersonaMatchPage() {
  const [mode, setMode] = useState<MatchMode>('zodiac')
  const [sign, setSign] = useState<ZodiacSign>('aries')
  const [mood, setMood] = useState<MoodTag>('cozy-sunday')
  const [aesthetic, setAesthetic] = useState<AestheticTag>('cottagecore')

  let results: CakeProfile[]
  if (mode === 'zodiac') results = cakesByZodiacSign(sign)
  else if (mode === 'mood') results = cakesByMood(mood)
  else results = cakesByAesthetic(aesthetic)

  return (
    <main className="page persona-page">
      <h1>Cosmic &amp; Mood Match</h1>
      <p>Match your sign, your mood, or your aesthetic to a cake built for it.</p>

      <div className="mode-toggle">
        {MODES.map((m) => (
          <button key={m.value} className={mode === m.value ? 'active' : ''} onClick={() => setMode(m.value)}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'zodiac' && (
        <label className="persona-select">
          Your sign
          <select value={sign} onChange={(e) => setSign(e.target.value as ZodiacSign)}>
            {ZODIAC_SIGN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {mode === 'mood' && (
        <label className="persona-select">
          Right now I feel
          <select value={mood} onChange={(e) => setMood(e.target.value as MoodTag)}>
            {MOOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {mode === 'aesthetic' && (
        <label className="persona-select">
          My aesthetic
          <select value={aesthetic} onChange={(e) => setAesthetic(e.target.value as AestheticTag)}>
            {AESTHETIC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="persona-results">
        {results.length === 0 && <p className="persona-empty">No matches tagged yet for this combination.</p>}
        {results.map((cake) => (
          <div key={cake.id} className="card persona-result-card">
            <h3>{cake.name}</h3>
            <p>{cake.description}</p>
            <p className="persona-notes">Notes: {cake.flavorNotes.join(', ')}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
