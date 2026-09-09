import { useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { getStorageIssue, subscribe } from '../lib/savedItems'

export function StorageNotice() {
  const issue = useSyncExternalStore(subscribe, getStorageIssue, () => false)
  return issue ? <p className="storage-notice" role="status">Your latest saves are available for this session only. Device storage is unavailable; keep this page open and try saving again.</p> : null
}

export function RouteLoading() {
  return <main className="page" aria-busy="true"><p role="status">Opening your next discovery…</p></main>
}

export function RouteNotFound() {
  return <main className="page"><h1>A little off the menu</h1><p>This page isn’t available. Find your next discovery in one of our four worlds.</p><Link className="btn" to="/">Explore Let Them Eat</Link></main>
}
