export interface BakeOffChallenge {
  id: string
  /** 1-12, cycles yearly — no expiry, always exactly one active */
  month: number
  name: string
  description: string
}

export interface BakeOffEntry {
  id: string
  bakerName: string
  title: string
  story: string
  spongeId: string
  fillingId: string
  frostingId: string
  garnishId?: string
  challengeId: string
  createdAt: string
  voteCount: number
}

export interface BakeOffComment {
  id: string
  entryId: string
  bakerName: string
  text: string
  createdAt: string
}
