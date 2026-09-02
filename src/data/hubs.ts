export interface HubSubItem {
  to: string
  title: string
  description: string
  /** Real, defensible cake association for a full-bleed photo card — omit if no genuine link exists (e.g. Bake Off). */
  cakeId?: string
  /** Falls back to this scene-images.json entry when there's no natural cakeId to photograph (e.g. Curated Kitchen). */
  sceneId?: string
  /** Direct image URL for worlds without a cakeId/sceneId lookup table of their own (Ramen/
      Cookies/Noodles) -- takes precedence over cakeId/sceneId when set. Must be real, existing
      photography already used elsewhere in that world's own content, not a fabricated image. */
  imageUrl?: string
  imageCredit?: string
  cta?: string
}

/** Which of the four "Let Them Eat" worlds a hub belongs to. Omitted (undefined) means Cake --
    Cake's original hubs predate the multi-world merge and were never tagged, so this keeps them
    working unchanged. Every hub added for Ramen/Cookies/Noodles sets this explicitly. */
export type HubWorld = 'cake' | 'ramen' | 'cookies' | 'noodles'

export type Hub =
  | {
      kind: 'landing'
      path: string
      navLabel: string
      navIcon: string
      title: string
      description: string
      items: HubSubItem[]
      world?: HubWorld
    }
  | {
      kind: 'direct'
      path: string
      navLabel: string
      navIcon: string
      title: string
      description: string
      world?: HubWorld
    }

export function hubWorld(hub: Hub): HubWorld {
  return hub.world ?? 'cake'
}

/** Which world a given pathname belongs to, purely from its URL prefix. `null` only for "/"
    itself (the world-selector home, which belongs to no single world). Everything else defaults
    to Cake, since Cake's own routes predate the merge and were never given a /cake prefix. Single
    source of truth for BottomTabBar (which tabs to show), TopNavBar (which world's brand/saved
    links + accent color to show), and App.tsx (which world's accent-color class to apply). */
export function worldFromPathname(pathname: string): HubWorld | null {
  if (pathname === '/') return null
  if (pathname.startsWith('/ramen')) return 'ramen'
  if (pathname.startsWith('/cookies')) return 'cookies'
  if (pathname.startsWith('/noodles')) return 'noodles'
  return 'cake'
}

export const HUBS: Hub[] = [
  {
    kind: 'landing',
    path: '/discover',
    navLabel: 'Main',
    navIcon: '📚',
    title: 'Discover',
    description: "Explore the world's cakes through history and geography.",
    items: [
      {
        to: '/persona-match',
        title: 'Cake Personality',
        description: 'Answer a few quick questions and get matched to a cake personality, complete with its cultural story and a shareable card.',
        cakeId: 'cake_rainbow_drip_2010s',
        cta: 'Take the Quiz →',
      },
      {
        to: '/encyclopedia',
        title: 'Cake Encyclopedia',
        description: 'The stories, flavors, techniques and traditions behind the world\'s cakes — history, flavor profile, traditional recipe, and related finds for every entry.',
        cakeId: 'cake_black_forest',
        cta: 'Explore Encyclopedia →',
      },
      {
        to: '/sommelier',
        title: 'Cake Sommelier',
        description: 'Start from a cake to find its best drink pairings, or start from a drink to find the cakes that match it — scored by flavor science.',
        cakeId: 'cake_dobos_torte',
        cta: 'Find a Pairing →',
      },
      {
        to: '/celebrate',
        title: 'Celebrate',
        description: 'Plan a full custom cake for weddings, birthdays, and every celebration in between.',
        cakeId: 'cake_prinsesstarta',
        cta: 'Start Planning →',
      },
    ],
  },
  {
    kind: 'landing',
    path: '/workshop',
    navLabel: 'Workshop',
    navIcon: '👩‍🍳',
    title: 'Workshop',
    description: 'Cake techniques, science, and structure — build, calculate, and perfect your next cake.',
    items: [
      {
        to: '/assembly-lab',
        title: 'Assembly Lab',
        description: 'Pick a sponge, filling, frosting, and garnish, watch your cake come together live, and get the full recipe to bake it.',
        cakeId: 'cake_victoria_sponge',
        cta: 'Start Building →',
      },
      {
        to: '/cake-anatomy',
        title: 'Cake Anatomy',
        description: 'How professional layer cakes are actually built, stage by stage — tap a stage to see its role.',
        cakeId: 'cake_carrot_cream_cheese_1980s',
        cta: 'Explore Anatomy →',
      },
      {
        to: '/cake-stability',
        title: 'Cake Stability',
        description: 'Figure out supports, chill time, and display guidance for your build before you start baking.',
        cakeId: 'cake_kransekake',
        cta: 'Explore Stability →',
      },
      {
        to: '/technique-library',
        title: 'Technique Library',
        description: 'The hands-on techniques behind every stage of construction — what each one is, common mistakes, and a chef\'s tip.',
        cakeId: 'cake_rainbow_drip_2010s',
        cta: 'Learn Techniques →',
      },
      {
        to: '/cake-science',
        title: 'Cake Science',
        description: 'The baking science behind why each ingredient and technique does what it does.',
        cakeId: 'cake_basque_burnt_cheesecake',
        cta: 'Explore the Science →',
      },
      {
        to: '/cake-blueprints',
        title: 'Real Cake Blueprints',
        description: 'How real, well-known cake families are actually engineered, layer by layer.',
        cakeId: 'cake_sachertorte',
        cta: 'View Blueprints →',
      },
      {
        to: '/cake-failure-lab',
        title: 'Cake Failure Lab',
        description: 'Something went wrong? Pick the symptom to see likely causes and how to fix it.',
        cakeId: 'cake_molten_lava_1990s',
        cta: 'Diagnose a Cake →',
      },
      {
        to: '/pantry-raid',
        title: 'Pantry Raid',
        description: "Check off what's in your kitchen and find the emergency cake that needs the least shopping.",
        cakeId: 'cake_kladdkaka',
        cta: 'Create a Recipe →',
      },
    ],
  },
  {
    kind: 'direct',
    path: '/atlas',
    navLabel: 'Atlas',
    navIcon: '🗺️',
    title: 'Global Cake Atlas',
    description:
      'Click a pin on an interactive world map — or search directly — for any country’s most popular cake, complete with a full recipe and background story.',
  },
  {
    kind: 'direct',
    path: '/curated-kitchen',
    navLabel: 'Shop',
    navIcon: '🛒',
    title: 'Curated Kitchen',
    description: 'A considered edit of the tools, equipment, and ingredients worth keeping close.',
  },

  // --- Ramen world -----------------------------------------------------------------------
  {
    kind: 'landing',
    path: '/ramen',
    navLabel: 'Main',
    navIcon: '🍜',
    title: 'Ramen',
    description: 'The world of ramen — broth, tare, noodles, and the culture around the bowl.',
    world: 'ramen',
    items: [
      {
        to: '/ramen/encyclopedia',
        title: 'Ramen Encyclopedia',
        description: 'The stories, broths, and toppings behind ramen\'s major regional styles.',
        cta: 'Explore Encyclopedia →',
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
        description: 'Ramen culture and etiquette — vocabulary, shop-finding, trails, and a 101 quiz.',
        cta: 'Explore Slurp →',
      },
    ],
  },
  {
    kind: 'direct',
    path: '/ramen/workshop',
    navLabel: 'Workshop',
    navIcon: '🍲',
    title: 'Ramen Workshop',
    description: 'Build a bowl and dive into the broth, tare, noodle, aroma oil, ajitama, and chashu labs.',
    world: 'ramen',
  },
  {
    kind: 'direct',
    path: '/ramen/atlas',
    navLabel: 'Atlas',
    navIcon: '🗾',
    title: 'Ramen Atlas',
    description: 'Japan\'s ramen regions and cities, and the styles that define them.',
    world: 'ramen',
  },
  {
    kind: 'direct',
    path: '/ramen/curated-kitchen',
    navLabel: 'Shop',
    navIcon: '🛒',
    title: 'Ramen Curated Kitchen',
    description: 'A considered edit of the bowls, tools, and pantry staples worth keeping close.',
    world: 'ramen',
  },

  // --- Cookies world ---------------------------------------------------------------------
  {
    kind: 'landing',
    path: '/cookies',
    navLabel: 'Main',
    navIcon: '🍪',
    title: 'Cookies',
    description: 'The world of cookies — dough science, techniques, and cookie culture.',
    world: 'cookies',
    items: [
      {
        to: '/cookies/encyclopedia',
        title: 'Cookie Encyclopedia',
        description: 'The stories, flavors, and techniques behind the world\'s cookies.',
        cta: 'Explore Encyclopedia →',
      },
      {
        to: '/cookies/sommelier',
        title: 'Cookie Sommelier',
        description: 'Find the best drink pairing for any cookie.',
        cta: 'Find a Pairing →',
      },
      {
        to: '/cookies/crumb',
        title: 'Crumb',
        description: 'Cookie culture — vocabulary, trails, a 101 guide, and a quiz.',
        cta: 'Explore Crumb →',
      },
    ],
  },
  {
    kind: 'direct',
    path: '/cookies/workshop',
    navLabel: 'Workshop',
    navIcon: '🥣',
    title: 'Cookie Workshop',
    description: 'Cookie anatomy, dough science, build-a-cookie, and the doughtroubleshooter.',
    world: 'cookies',
  },
  {
    kind: 'direct',
    path: '/cookies/atlas',
    navLabel: 'Atlas',
    navIcon: '🗺️',
    title: 'Cookie Atlas',
    description: 'Cookie traditions from around the world, region by region.',
    world: 'cookies',
  },
  {
    kind: 'direct',
    path: '/cookies/curated-kitchen',
    navLabel: 'Shop',
    navIcon: '🛒',
    title: 'Cookie Curated Kitchen',
    description: 'A considered edit of the tools and pantry staples worth keeping close.',
    world: 'cookies',
  },

  // --- Noodles world ---------------------------------------------------------------------
  {
    kind: 'landing',
    path: '/noodles',
    navLabel: 'Main',
    navIcon: '🍝',
    title: 'Noodles',
    description: 'The world of noodles — dish and noodle-type encyclopedias, and pasta culture.',
    world: 'noodles',
    items: [
      {
        to: '/noodles/encyclopedia',
        title: 'Dish Encyclopedia',
        description: 'The stories and techniques behind the world\'s noodle dishes.',
        cta: 'Explore Dishes →',
        imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ph%E1%BB%9F_%C4%91%E1%BA%B7c_bi%E1%BB%87t.jpg',
        imageCredit: 'Azure Dragon of the East / Wikimedia Commons',
      },
      {
        to: '/noodles/encyclopedia/noodle-types',
        title: 'Noodle Types',
        description: 'The noodle shapes and families themselves, independent of any one dish.',
        cta: 'Explore Noodle Types →',
        imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E5%85%B0%E5%B7%9E%E7%89%9B%E8%82%89%E9%9D%A2.jpg',
        imageCredit: '三猎 / Wikimedia Commons',
      },
      {
        to: '/noodles/sommelier',
        title: 'Noodle Sommelier',
        description: 'Find the best drink pairing for any noodle dish.',
        cta: 'Find a Pairing →',
      },
      {
        to: '/noodles/twirl',
        title: 'Twirl',
        description: 'Noodle culture and stories from around the world.',
        cta: 'Explore Twirl →',
      },
    ],
  },
  {
    kind: 'direct',
    path: '/noodles/workshop',
    navLabel: 'Workshop',
    navIcon: '🍳',
    title: 'Noodle Workshop',
    description: 'Noodle-making technique labs and a troubleshooter for common problems.',
    world: 'noodles',
  },
  {
    kind: 'direct',
    path: '/noodles/atlas',
    navLabel: 'Atlas',
    navIcon: '🗺️',
    title: 'Noodle Atlas',
    description: 'Noodle traditions from around the world, region by region.',
    world: 'noodles',
  },
  {
    kind: 'direct',
    path: '/noodles/curated-kitchen',
    navLabel: 'Shop',
    navIcon: '🛒',
    title: 'Noodle Curated Kitchen',
    description: 'A considered edit of the bowls, tools, and pantry staples worth keeping close.',
    world: 'noodles',
  },
]

/** True if `pathname` is this hub's own path, one of its sub-item paths (landing hubs), or --
    for 'direct' hubs only, which render one real ported page rather than a generic tile list --
    a path nested beneath it (e.g. a direct hub's own sub-routes, like `/cookies/sommelier/find`
    under `/cookies/sommelier`). Landing hubs never match on nested paths: multiple sibling hubs
    in the same world share a path prefix (e.g. `/ramen` and `/ramen/workshop`), so a landing
    hub must only ever claim its own exact path or its own explicit items. */
export function isHubActive(hub: Hub, pathname: string): boolean {
  if (pathname === hub.path) return true
  if (hub.kind === 'direct') return pathname.startsWith(`${hub.path}/`)
  return hub.items.some((item) => item.to === pathname)
}
