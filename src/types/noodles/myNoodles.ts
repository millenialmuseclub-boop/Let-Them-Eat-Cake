export type MyNoodlesState = 'want-to-try' | 'tried' | 'favorite'

export interface MyNoodlesEntry {
  dishId: string
  states: MyNoodlesState[]
  note?: string
  savedAt: string // ISO timestamp, kept for API compatibility with the original hook
}
