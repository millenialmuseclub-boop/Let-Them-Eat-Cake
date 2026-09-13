import './CompanionApp.css'

const companions = {
  rallii: {
    name: 'Rallii',
    url: 'https://apps.apple.com/us/app/rallii/id6804085679',
    title: 'Make the journey part of the meal.',
    description: 'Going there? Explore scenic rail and outdoor routes with Rallii.',
  },
  luxejetter: {
    name: 'Luxe Jetter',
    url: 'https://apps.apple.com/us/app/luxejetter/id6808023085',
    title: 'A little inspiration for the rest of the occasion.',
    description: 'Planning a celebration away? Build the travel wardrobe in Luxe Jetter.',
  },
} as const

export function CompanionApp({ app }: { app: keyof typeof companions }) {
  const companion = companions[app]
  return (
    <aside className="companion-app" aria-label={`Explore with ${companion.name}`}>
      <h2>{companion.title}</h2>
      <p>{companion.description}</p>
      <a href={companion.url} target="_blank" rel="noopener noreferrer">
        Explore {companion.name} on the App Store →
      </a>
    </aside>
  )
}
