import type { PassportProgress } from '../types/atlas'

const STORAGE_KEY = 'ltec:passport'

function readRaw(): PassportProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { stamps: [] }
    const parsed = JSON.parse(raw) as PassportProgress
    return Array.isArray(parsed.stamps) ? parsed : { stamps: [] }
  } catch {
    return { stamps: [] }
  }
}

function writeRaw(progress: PassportProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getPassport(): PassportProgress {
  return readRaw()
}

export function hasStamp(stampId: string): boolean {
  return readRaw().stamps.some((stamp) => stamp.stampId === stampId)
}

export function addStamp(stampId: string): PassportProgress {
  const progress = readRaw()
  if (progress.stamps.some((stamp) => stamp.stampId === stampId)) return progress
  const next: PassportProgress = {
    stamps: [...progress.stamps, { stampId, collectedAt: new Date().toISOString() }],
  }
  writeRaw(next)
  return next
}

export function removeStamp(stampId: string): PassportProgress {
  const progress = readRaw()
  const next: PassportProgress = {
    stamps: progress.stamps.filter((stamp) => stamp.stampId !== stampId),
  }
  writeRaw(next)
  return next
}
