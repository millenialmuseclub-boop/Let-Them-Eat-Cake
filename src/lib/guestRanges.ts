export interface GuestRange {
  min: number
  max: number
  label: string
}

// Hard cap at 50 -- replaces the old open-ended numeric guest count across
// all three Celebrate flows. Each range's upper bound (max) is what feeds
// serving-capacity math elsewhere, per "generate a cake that comfortably
// serves the upper end of that range."
export const GUEST_RANGES: GuestRange[] = [
  { min: 1, max: 10, label: '1–10' },
  { min: 11, max: 20, label: '11–20' },
  { min: 21, max: 30, label: '21–30' },
  { min: 31, max: 40, label: '31–40' },
  { min: 41, max: 50, label: '41–50' },
]
