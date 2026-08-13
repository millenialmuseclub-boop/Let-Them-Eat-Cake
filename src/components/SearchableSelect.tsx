import { useState } from 'react'
import './SearchableSelect.css'

/**
 * A search-to-select list. When `items.length` is at or below
 * `showAllThreshold`, all items are browsable with an empty query (fine for
 * a short, already-filtered list like drinks within one category); above
 * that threshold nothing shows until the user types (for a large catalog
 * like the full cake list, where showing everything by default defeats the
 * point of searching).
 */
export function SearchableSelect<T>({
  items,
  getId,
  getLabel,
  getSubLabel,
  placeholder,
  onSelect,
  showAllThreshold = 0,
  maxResults = 8,
}: {
  items: T[]
  getId: (item: T) => string
  getLabel: (item: T) => string
  getSubLabel?: (item: T) => string | undefined
  placeholder: string
  onSelect: (item: T) => void
  showAllThreshold?: number
  maxResults?: number
}) {
  const [query, setQuery] = useState('')

  const trimmed = query.trim().toLowerCase()
  const filtered = trimmed
    ? items.filter((item) => getLabel(item).toLowerCase().includes(trimmed))
    : items.length <= showAllThreshold
      ? items
      : []
  const results = filtered.slice(0, maxResults)
  const hiddenCount = filtered.length - results.length

  return (
    <div className="searchable-select">
      <input
        type="text"
        className="searchable-select-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={placeholder}
      />
      {results.length > 0 && (
        <div className="searchable-select-results">
          {results.map((item) => (
            <button key={getId(item)} type="button" className="searchable-select-result" onClick={() => onSelect(item)}>
              <span className="searchable-select-result-label">{getLabel(item)}</span>
              {getSubLabel?.(item) && <span className="searchable-select-result-sublabel">{getSubLabel(item)}</span>}
            </button>
          ))}
          {hiddenCount > 0 && <p className="searchable-select-hint">+{hiddenCount} more — keep typing to narrow it down</p>}
        </div>
      )}
      {trimmed && results.length === 0 && <p className="searchable-select-empty">No matches for "{query}"</p>}
    </div>
  )
}
