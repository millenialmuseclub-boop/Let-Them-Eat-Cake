// Data-driven hub definitions powering both BottomTabBar and each hub landing page, ported from
// Ramen's src/data/hubs.ts pattern. Four tabs per the locked Phase 1 nav decision: Main / Workshop
// / Sommelier / Crumb. My Cookies is reached via the TopNavBar library icon, not a 5th tab.

export interface Hub {
  id: string
  label: string
  path: string
  icon: string
  tagline: string
}

export const HUBS: Hub[] = [
  { id: 'main', label: 'Main', path: '/', icon: '🏠', tagline: 'Discover cookies from every tradition' },
  { id: 'workshop', label: 'Workshop', path: '/workshop', icon: '🥣', tagline: 'Understand the craft behind every cookie' },
  { id: 'sommelier', label: 'Sommelier', path: '/sommelier', icon: '🍪', tagline: 'Find the cookie that matches your taste' },
  { id: 'crumb', label: 'Crumb', path: '/crumb', icon: '📖', tagline: 'Culture, history, and cookie trivia' },
]
