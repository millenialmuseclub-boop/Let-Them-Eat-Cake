export interface HubSubItem {
  to: string
  title: string
  description: string
}

export interface Hub {
  path: string
  navLabel: string
  title: string
  description: string
  items: HubSubItem[]
}

export const HUBS: Hub[] = [
  {
    path: '/discover',
    navLabel: 'Discover',
    title: 'Discover',
    description: "Explore the world's cakes through history and geography.",
    items: [
      {
        to: '/encyclopedia',
        title: 'Cake Encyclopedia',
        description: 'Browse the full archive of 50 cakes — history, flavor profile, traditional recipe, and related finds for every entry.',
      },
      {
        to: '/atlas',
        title: 'Global Cake Atlas',
        description:
          'Click a pin on an interactive world map — or search directly — for any country’s most popular cake, complete with a full recipe and background story.',
      },
      {
        to: '/time-machine',
        title: 'Birthday Time Machine',
        description:
          'Enter your date of birth — or scroll the decade timeline — to discover the cake that defined an era, with its history and full recipe.',
      },
    ],
  },
  {
    path: '/bake',
    navLabel: 'Bake',
    title: 'Bake',
    description: 'Build, calculate, and troubleshoot your next cake.',
    items: [
      {
        to: '/assembly-lab',
        title: 'Assembly Lab',
        description: 'Pick a sponge, filling, frosting, and garnish, watch your cake come together live, and get the full recipe to bake it.',
      },
      {
        to: '/pantry-raid',
        title: 'Pantry Raid',
        description: "Check off what's in your kitchen and find the emergency cake that needs the least shopping.",
      },
    ],
  },
  {
    path: '/pair',
    navLabel: 'Pair',
    title: 'Pair',
    description: 'Find the perfect cake and drink pairing, from either direction.',
    items: [
      {
        to: '/sommelier',
        title: 'Cake Sommelier',
        description: 'Start from a cake to find its best drink pairings, or start from a drink to find the cakes that match it — scored by flavor science.',
      },
    ],
  },
  {
    path: '/plan',
    navLabel: 'Plan',
    title: 'Plan',
    description: 'Plan a full custom cake for your next big event.',
    items: [
      {
        to: '/wedding-cake-planner',
        title: 'Wedding Cake Planner',
        description: 'Set your culture, guest count, season, and aesthetic to get a full master planning sheet — structure, flavors, allergens, and decor.',
      },
    ],
  },
  {
    path: '/community',
    navLabel: 'Community',
    title: 'Community',
    description: 'See what other bakers are making.',
    items: [
      {
        to: '/bake-off',
        title: 'Bake Off',
        description: "Submit your Assembly Lab creation, vote on the community's favorites, and compete under this month's theme.",
      },
    ],
  },
  {
    path: '/my-cakes',
    navLabel: 'My Cakes',
    title: 'My Cakes',
    description: 'Your personal cake identity and saved collection.',
    items: [
      {
        to: '/persona-match',
        title: 'Cake Personality Quiz',
        description: 'Answer four quick questions and get matched to a cake personality, complete with a flavor radar chart and a shareable card.',
      },
      {
        to: '/notebook',
        title: 'Pastry Notebook',
        description: 'Save your favorite cakes and cake personalities to come back to anytime — stored right in your browser.',
      },
    ],
  },
]
