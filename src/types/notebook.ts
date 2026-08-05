export type SavedItemType = 'cake' | 'personality'

export interface SavedItem {
  type: SavedItemType
  id: string
  savedAt: number
}
