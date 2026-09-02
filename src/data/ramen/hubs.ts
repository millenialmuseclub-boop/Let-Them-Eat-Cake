// Same shape as Cake's src/data/hubs.ts (see CAKE_REFERENCE_AUDIT.md §2/§14):
// one data-driven HUBS array drives both BottomTabBar and (for landing hubs)
// the HubPage template. Ramen's real production nav is 4 tabs, confirmed
// against Cake's actual nav rather than the originally-assumed 5 -- see
// LET_THEM_EAT_RAMEN_MASTER_SPEC.md §3/§6.

export interface HubSubItem {
  to: string
  title: string
  description: string
  cta?: string
  /** Optional section label for hubs whose bespoke page groups items rather than rendering one flat grid (currently Workshop only). */
  group?: string
}

export type Hub =
  | {
      kind: 'landing'
      path: string
      navLabel: string
      title: string
      description: string
      items: HubSubItem[]
    }
  | {
      kind: 'direct'
      path: string
      navLabel: string
      title: string
      description: string
    }

export const HUBS: Hub[] = [
  {
    // Path stays '/discover' -- Cake's own production nav renders this exact route under the
    // label "Main" (CAKE_REFERENCE_AUDIT.md §2), so Ramen follows that precedent rather than
    // renaming the URL itself. Everything user-facing (tab label, page title, heading) says Main.
    kind: 'landing',
    path: '/discover',
    navLabel: 'Main',
    title: 'Main',
    description: "Explore the world's ramen through history, geography, and taste.",
    items: [
      {
        to: '/ramen/encyclopedia',
        title: 'Ramen Encyclopedia',
        description: 'The stories, broths, noodles and traditions behind the world\'s ramen — origin, flavor profile, and related finds for every entry.',
        cta: 'Explore Encyclopedia →',
      },
      {
        to: '/ramen/personality-quiz',
        title: 'Ramen Personality Quiz',
        description: 'A playful quiz about taste, habits, and travel style -- find the canonical ramen that matches your personality.',
        cta: 'Take the Quiz →',
      },
      {
        to: '/ramen/collections',
        title: 'Curated Collections',
        description: 'Editorial groupings of the Encyclopedia -- Rich & Comforting, Clear & Delicate, Regional Classics, and more.',
        cta: 'Browse Collections →',
      },
      {
        to: '/ramen/sommelier',
        title: 'Ramen Sommelier',
        description: 'Start from a bowl to find its best drink pairings, or start from a drink to find the bowls that match it.',
        cta: 'Find a Pairing →',
      },
      {
        to: '/ramen/slurp',
        title: 'Slurp',
        description: 'Ramen culture and etiquette -- vocabulary, shop-finding, trails, and a 101 quiz.',
        cta: 'Explore Slurp →',
      },
    ],
  },
  {
    kind: 'landing',
    path: '/workshop',
    navLabel: 'Workshop',
    title: 'Workshop',
    description: 'Ramen technique, science, and construction — build and understand your next bowl.',
    items: [
      {
        to: '/ramen/ramen-anatomy',
        title: 'Ramen Anatomy',
        description: 'How a bowl is actually built, component by component — tap a component to see its role.',
        cta: 'Explore Anatomy →',
        group: 'Understand the Bowl',
      },
      {
        to: '/ramen/build-a-bowl',
        title: 'Build a Bowl',
        description: "Choose a broth, tare, and the rest of the bowl's components, and see how traditional your combination is.",
        cta: 'Start Building →',
        group: 'Understand the Bowl',
      },
      {
        to: '/ramen/broth-lab',
        title: 'Broth Lab',
        description: 'Chintan vs paitan, bone base, extraction time, fat -- see how each choice changes a broth.',
        cta: 'Explore Broth →',
        group: 'Master the Components',
      },
      {
        to: '/ramen/noodle-lab',
        title: 'Noodle Lab',
        description: 'Kansui, hydration, thickness, shape -- what actually makes a ramen noodle a ramen noodle.',
        cta: 'Explore Noodles →',
        group: 'Master the Components',
      },
      {
        to: '/ramen/tare-lab',
        title: 'Tare Lab',
        description: 'Shoyu, shio, miso -- the seasoning base that defines a bowl, and how it works with the broth underneath it.',
        cta: 'Explore Tare →',
        group: 'Master the Components',
      },
      {
        to: '/ramen/aroma-oil-lab',
        title: 'Aroma Oil Lab',
        description: 'Chicken fat, garlic oil, mayu, chili oil -- how a small floated fat changes a bowl\'s whole character.',
        cta: 'Explore Aroma Oil →',
        group: 'Master the Components',
      },
      {
        to: '/ramen/ajitama-lab',
        title: 'Ajitama Lab',
        description: 'Cooking time, cooling, marinade, and marination time -- the small technique behind the marinated egg on nearly every bowl.',
        cta: 'Explore Ajitama →',
        group: 'Master the Components',
      },
      {
        to: '/ramen/chashu-lab',
        title: 'Chashu Lab',
        description: 'Cut, braise vs roast, rolling, slicing -- legitimate variations on ramen\'s signature pork topping.',
        cta: 'Explore Chashu →',
        group: 'Master the Components',
      },
      {
        to: '/ramen/troubleshooter',
        title: 'Troubleshooter',
        description: 'Something off about your bowl? Pick the problem for likely causes, corrections, and the related lesson.',
        cta: 'Diagnose a Bowl →',
        group: 'Solve a Problem',
      },
    ],
  },
  {
    kind: 'landing',
    path: '/sommelier',
    navLabel: 'Sommelier',
    title: 'Ramen Sommelier',
    description: 'Structured taste and pairing intelligence — find the right bowl, or the right pairing for one.',
    items: [
      {
        to: '/ramen/sommelier/find',
        title: 'Find My Ramen',
        description: 'Tell us what you like -- richness, broth style, heat, flavor -- and get a matched bowl with alternatives.',
        cta: 'Find My Ramen →',
      },
      {
        to: '/ramen/sommelier/pair',
        title: 'Pair My Ramen',
        description: 'Pick a bowl and get a beverage, side, condiment, and finishing element that actually work with it.',
        cta: 'Pair My Ramen →',
      },
    ],
  },
  {
    kind: 'landing',
    path: '/slurp',
    navLabel: 'Slurp',
    title: 'Slurp',
    description: 'Ramen-shop culture, ordering, and real-world exploration -- how to experience ramen, not just eat it.',
    items: [
      {
        to: '/ramen/slurp/guides/shop-101',
        title: 'Ramen Shop 101',
        description: 'Shop types, counter culture, and pacing -- what to expect once you walk in.',
        cta: 'Read the Guide →',
      },
      {
        to: '/ramen/slurp/guides/ordering',
        title: 'Ordering',
        description: 'Ticket machines, customization, kaedama, and how payment actually works.',
        cta: 'Read the Guide →',
      },
      {
        to: '/ramen/slurp/guides/how-to-eat',
        title: 'How to Eat Ramen',
        description: 'Practical, respectful guidance for the meal itself -- with the honest caveat that customs vary.',
        cta: 'Read the Guide →',
      },
      {
        to: '/ramen/slurp/vocabulary',
        title: 'Ramen Vocabulary',
        description: 'Tare, menma, ajitama, kaedama, and the other core terms, browsable in one place.',
        cta: 'Browse Terms →',
      },
      {
        to: '/ramen/slurp/find-your-bowl',
        title: 'Find Your Bowl',
        description: 'Three quick questions, one recommended bowl -- a lighter, faster version of Sommelier FIND.',
        cta: 'Find My Bowl →',
      },
      {
        to: '/ramen/slurp/trails',
        title: 'Ramen Trails',
        description: 'Editorial guides to Tokyo Shoyu, Sapporo Miso, and Hakata Tonkotsu -- what defines each style and how to approach it.',
        cta: 'Explore Trails →',
      },
      {
        to: '/ramen/slurp/ramen-101',
        title: 'Ramen 101 Quiz',
        description: 'A quick knowledge quiz on broth, tare, kansui, and shop terminology -- immediate answers and explanations, no scoreboard.',
        cta: 'Take the Quiz →',
      },
    ],
  },
]

/** True if `pathname` is this hub's own path, or (for landing hubs) one of its sub-item paths. */
export function isHubActive(hub: Hub, pathname: string): boolean {
  if (pathname === hub.path) return true
  return hub.kind === 'landing' && hub.items.some((item) => item.to === pathname)
}
