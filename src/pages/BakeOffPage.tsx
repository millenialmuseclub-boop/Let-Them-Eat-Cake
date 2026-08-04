import { useEffect, useState, type FormEvent } from 'react'
import { getComponentsByCategory, combineFlavorProfile } from '../lib/assemblyLab'
import { getActiveChallenge, fetchEntries, submitEntry, castVote, fetchComments, submitComment, getVotedEntryIds } from '../lib/bakeOff'
import { CakeIllustration } from '../components/CakeIllustration'
import { FlavorProfileBars } from '../components/FlavorProfileBars'
import type { AssemblyComponent } from '../types/assemblyLab'
import type { BakeOffComment, BakeOffEntry } from '../types/bakeOff'
import './BakeOffPage.css'

const sponges = getComponentsByCategory('sponge')
const fillings = getComponentsByCategory('filling')
const frostings = getComponentsByCategory('frosting')
const garnishes = getComponentsByCategory('garnish')

function findComponent(pool: AssemblyComponent[], id: string | undefined): AssemblyComponent | undefined {
  return id ? pool.find((c) => c.id === id) : undefined
}

export function BakeOffPage() {
  const challenge = getActiveChallenge()

  const [entries, setEntries] = useState<BakeOffEntry[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [sort, setSort] = useState<'top' | 'new'>('top')

  const [showForm, setShowForm] = useState(false)
  const [bakerName, setBakerName] = useState('')
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [spongeId, setSpongeId] = useState(sponges[0].id)
  const [fillingId, setFillingId] = useState(fillings[0].id)
  const [frostingId, setFrostingId] = useState(frostings[0].id)
  const [garnishId, setGarnishId] = useState('none')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [votedIds, setVotedIds] = useState<string[]>([])
  const [votingId, setVotingId] = useState<string | null>(null)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [comments, setComments] = useState<BakeOffComment[] | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => {
    setVotedIds(getVotedEntryIds())
  }, [])

  useEffect(() => {
    let cancelled = false
    setEntries(null)
    setLoadError(null)
    fetchEntries(sort)
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load entries')
      })
    return () => {
      cancelled = true
    }
  }, [sort])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const entry = await submitEntry({
        bakerName,
        title,
        story,
        spongeId,
        fillingId,
        frostingId,
        garnishId: garnishId === 'none' ? undefined : garnishId,
      })
      setEntries((prev) => (prev ? [entry, ...prev] : [entry]))
      setBakerName('')
      setTitle('')
      setStory('')
      setShowForm(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVote(entryId: string) {
    setVotingId(entryId)
    try {
      const { voteCount } = await castVote(entryId)
      setEntries((prev) => prev?.map((e) => (e.id === entryId ? { ...e, voteCount } : e)) ?? prev)
      setVotedIds(getVotedEntryIds())
    } catch {
      // vote failed (already voted, rate-limited, etc.) — button state just stays as-is
    } finally {
      setVotingId(null)
    }
  }

  async function handleExpand(entryId: string) {
    if (expandedId === entryId) {
      setExpandedId(null)
      return
    }
    setExpandedId(entryId)
    setComments(null)
    setCommentsLoading(true)
    setCommentName('')
    setCommentText('')
    setCommentError(null)
    try {
      const data = await fetchComments(entryId)
      setComments(data)
    } catch {
      setComments([])
    } finally {
      setCommentsLoading(false)
    }
  }

  async function handleCommentSubmit(e: FormEvent, entryId: string) {
    e.preventDefault()
    setCommentSubmitting(true)
    setCommentError(null)
    try {
      const updated = await submitComment(entryId, commentName, commentText)
      setComments(updated)
      setCommentName('')
      setCommentText('')
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setCommentSubmitting(false)
    }
  }

  const previewSponge = findComponent(sponges, spongeId)!
  const previewFilling = findComponent(fillings, fillingId)!
  const previewFrosting = findComponent(frostings, frostingId)!
  const previewGarnish = garnishId === 'none' ? undefined : findComponent(garnishes, garnishId)

  return (
    <main className="page bakeoff-page">
      <h1>Bake Off</h1>
      <p>Submit your Assembly Lab creation, vote on your favorites, and compete under this month's theme.</p>

      <div className="card bakeoff-challenge-banner">
        <span className="tag">This month's theme</span>
        <h2>{challenge.name}</h2>
        <p>{challenge.description}</p>
      </div>

      <button className="btn" onClick={() => setShowForm((v) => !v)}>
        {showForm ? 'Cancel' : 'Submit Your Bake'}
      </button>

      {showForm && (
        <form className="card bakeoff-form" onSubmit={handleSubmit}>
          <div className="bakeoff-form-grid">
            <label>
              Baker name
              <input value={bakerName} onChange={(e) => setBakerName(e.target.value)} maxLength={40} required />
            </label>
            <label>
              Cake title
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} required />
            </label>
          </div>

          <label>
            The story behind it
            <textarea value={story} onChange={(e) => setStory(e.target.value)} maxLength={500} rows={3} required />
          </label>

          <div className="bakeoff-form-grid">
            <label>
              Sponge
              <select value={spongeId} onChange={(e) => setSpongeId(e.target.value)}>
                {sponges.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Filling
              <select value={fillingId} onChange={(e) => setFillingId(e.target.value)}>
                {fillings.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Frosting
              <select value={frostingId} onChange={(e) => setFrostingId(e.target.value)}>
                {frostings.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Garnish
              <select value={garnishId} onChange={(e) => setGarnishId(e.target.value)}>
                <option value="none">None</option>
                {garnishes.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="bakeoff-form-preview">
            <CakeIllustration
              spongeColor={previewSponge.colorHex}
              fillingColor={previewFilling.colorHex}
              frostingColor={previewFrosting.colorHex}
              garnishColor={previewGarnish?.colorHex}
            />
          </div>

          {submitError && <p className="bakeoff-error">{submitError}</p>}

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Enter the Bake Off'}
          </button>
        </form>
      )}

      <div className="bakeoff-sort-toggle unit-toggle">
        <button className={sort === 'top' ? 'active' : ''} onClick={() => setSort('top')}>
          Top Voted
        </button>
        <button className={sort === 'new' ? 'active' : ''} onClick={() => setSort('new')}>
          Newest
        </button>
      </div>

      {loadError && <p className="bakeoff-error">{loadError}</p>}
      {entries === null && !loadError && <p className="bakeoff-status">Loading entries…</p>}
      {entries !== null && entries.length === 0 && <p className="bakeoff-status">No entries yet — be the first to submit a bake!</p>}

      <div className="bakeoff-gallery">
        {entries?.map((entry) => {
          const sponge = findComponent(sponges, entry.spongeId)
          const filling = findComponent(fillings, entry.fillingId)
          const frosting = findComponent(frostings, entry.frostingId)
          const garnish = findComponent(garnishes, entry.garnishId)
          if (!sponge || !filling || !frosting) return null

          const isExpanded = expandedId === entry.id
          const hasVoted = votedIds.includes(entry.id)

          return (
            <div key={entry.id} className="card bakeoff-entry-card">
              <button className="bakeoff-entry-summary" onClick={() => handleExpand(entry.id)}>
                <CakeIllustration
                  spongeColor={sponge.colorHex}
                  fillingColor={filling.colorHex}
                  frostingColor={frosting.colorHex}
                  garnishColor={garnish?.colorHex}
                />
                <div className="bakeoff-entry-meta">
                  <h3>{entry.title}</h3>
                  <p className="bakeoff-baker-name">by {entry.bakerName}</p>
                </div>
              </button>

              <div className="bakeoff-entry-actions">
                <button className={hasVoted ? 'btn btn-secondary' : 'btn'} disabled={hasVoted || votingId === entry.id} onClick={() => handleVote(entry.id)}>
                  {hasVoted ? 'Voted' : 'Vote'} · {entry.voteCount}
                </button>
              </div>

              {isExpanded && (
                <div className="bakeoff-entry-expanded">
                  <p>{entry.story}</p>
                  <FlavorProfileBars profile={combineFlavorProfile(sponge, filling, frosting)} />

                  <h4>Comments</h4>
                  {commentsLoading && <p className="bakeoff-status">Loading comments…</p>}
                  {comments && comments.length === 0 && <p className="bakeoff-status">No comments yet.</p>}
                  <ul className="bakeoff-comment-list">
                    {comments?.map((c) => (
                      <li key={c.id}>
                        <strong>{c.bakerName}:</strong> {c.text}
                      </li>
                    ))}
                  </ul>

                  <form className="bakeoff-comment-form" onSubmit={(e) => handleCommentSubmit(e, entry.id)}>
                    <input placeholder="Your name" value={commentName} onChange={(e) => setCommentName(e.target.value)} maxLength={40} required />
                    <input placeholder="Add a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={500} required />
                    <button className="btn btn-secondary" type="submit" disabled={commentSubmitting}>
                      {commentSubmitting ? 'Posting…' : 'Post'}
                    </button>
                  </form>
                  {commentError && <p className="bakeoff-error">{commentError}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
