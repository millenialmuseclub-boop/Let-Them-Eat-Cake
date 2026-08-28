// Curated Collections (master spec §32). References canonical cookie ids only -- no duplicated
// editorial content -- so the system scales as the Encyclopedia grows without a redesign.

export interface Collection {
  id: string
  title: string
  description: string
  cookieIds: string[]
}
