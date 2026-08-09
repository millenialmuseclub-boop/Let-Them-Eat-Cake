export interface HubSubItem {
  to: string
  title: string
  description: string
  /** Real, defensible cake association for a full-bleed photo card — omit if no genuine link exists (e.g. Bake Off). */
  cakeId?: string
  cta?: string
}

export type Hub =
  | {
      kind: 'landing'
      path: string
      navLabel: string
      navIcon: string
      title: string
      description: string
      items: HubSubItem[]
    }
  | {
      kind: 'direct'
      path: string
      navLabel: string
      navIcon: string
      title: string
      description: string
    }

export const HUBS: Hub[] = [
  {
    kind: 'landing',
    path: '/discover',
    navLabel: 'Discover',
    navIcon: '📚',
    title: 'Discover',
    description: "Explore the world's cakes through history and geography.",
    items: [
      {
        to: '/encyclopedia',
        title: 'Cake Encyclopedia',
        description: 'The stories, flavors, techniques and traditions behind the world\'s cakes — history, flavor profile, traditional recipe, and related finds for every entry.',
        cakeId: 'cake_black_forest',
        cta: 'Explore Encyclopedia →',
      },
      {
        to: '/atlas',
        title: 'Global Cake Atlas',
        description:
          'Click a pin on an interactive world map — or search directly — for any country’s most popular cake, complete with a full recipe and background story.',
        cakeId: 'cake_tres_leches',
        cta: 'Open Atlas →',
      },
      {
        to: '/persona-match',
        title: 'Cake Personality',
        description: 'Answer a few quick questions and get matched to a cake personality, complete with its cultural story and a shareable card.',
        cakeId: 'cake_rainbow_drip_2010s',
        cta: 'Take the Quiz →',
      },
    ],
  },
  {
    kind: 'landing',
    path: '/workshop',
    navLabel: 'Workshop',
    navIcon: '👩‍🍳',
    title: 'Workshop',
    description: 'Build, calculate, and show off your next cake.',
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
    path: '/sommelier',
    navLabel: 'Sommelier',
    navIcon: '🍷',
    title: 'Cake Sommelier',
    description: 'Start from a cake to find its best drink pairings, or start from a drink to find the cakes that match it — scored by flavor science.',
  },
  {
    kind: 'landing',
    path: '/celebrate',
    navLabel: 'Celebrate',
    navIcon: '🎂',
    title: 'Celebrate',
    description: 'Plan a full custom cake for weddings, birthdays, and every celebration in between.',
    items: [
      {
        to: '/wedding-planner',
        title: 'Wedding',
        description: 'A dedicated wedding cake planning journey — culture, structure, seasonal flavor, allergens, and decor in one pass.',
      },
      {
        to: '/birthday-planner',
        title: 'Birthday',
        description: 'A dedicated birthday cake planning journey, with a link to the Birthday Time Machine to find the cake from your birth year.',
      },
      {
        to: '/other-celebrations',
        title: 'Other Celebrations',
        description: 'For baby showers, holidays, graduations, and anniversaries — a quick, complete planning sheet.',
      },
      {
        to: '/time-machine',
        title: 'Birthday Time Machine',
        description: 'Enter your date of birth — or scroll the decade timeline — to find the cake that defined your birth year, like a personal birthday keepsake.',
      },
    ],
  },
]

/** True if `pathname` is this hub's own path, or (for landing hubs) one of its sub-item paths. */
export function isHubActive(hub: Hub, pathname: string): boolean {
  if (pathname === hub.path) return true
  return hub.kind === 'landing' && hub.items.some((item) => item.to === pathname)
}
