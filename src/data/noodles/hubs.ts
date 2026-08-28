/* Hub-array-driven navigation — family-reusable pattern (Cake/Ramen/Cookies data/hubs.ts +
   BottomTabBar). Final IA locked for Noodles: Discover / Workshop / Sommelier / Twirl, with
   My Noodles reached via the top nav icon (Cookies' Phase-1-locked pattern), not a 5th tab. */

export interface Hub {
  id: string;
  navLabel: string;
  path: string;
  icon: string;
}

export const hubs: Hub[] = [
  { id: 'discover', navLabel: 'Discover', path: '/', icon: '🍜' },
  { id: 'workshop', navLabel: 'Workshop', path: '/workshop', icon: '🥢' },
  { id: 'sommelier', navLabel: 'Find', path: '/sommelier', icon: '🧭' },
  { id: 'twirl', navLabel: 'Twirl', path: '/twirl', icon: '📖' },
];
