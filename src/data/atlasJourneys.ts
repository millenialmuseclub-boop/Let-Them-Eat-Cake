import type { FoodEntry } from '../lib/foodSearch'

export interface AtlasJourney {
  id: string
  country: string
  world: FoodEntry['world'] | 'all'
  food: string
  title: string
  note: string
  stops: { foodId: string; place: string; note: string }[]
}

// Short editorial comparisons built from the canonical food and regional entries.
// Stops are tasting comparisons, not driving routes or claims of exclusive birthplace.
export const atlasJourneys: AtlasJourney[] = [
  {
    id: 'japan-regional-ramen', country: 'Japan', world: 'ramen', food: 'ramen_sapporo_miso',
    title: 'One country. Many bowls.', note: 'Three regional bowls. Follow what changes in the broth, the noodle and the finish.',
    stops: [
      { foodId: 'ramen_sapporo_miso', place: 'Sapporo, Hokkaido', note: 'Start with a winter-weight bowl: miso-seasoned broth and thick, springy noodles. Butter and corn are familiar later additions to the style.' },
      { foodId: 'ramen_hakodate_shio', place: 'Hakodate, Hokkaido', note: 'Stay on Hokkaido and change the register. A clear, salt-seasoned broth brings a lighter expression of the northern ramen tradition.' },
      { foodId: 'ramen_hakata_tonkotsu', place: 'Hakata, Fukuoka', note: 'Head south for creamy pork-bone broth and thin noodles. The kaedama refill changes how the bowl is eaten, not just how it tastes.' },
    ],
  },
  {
    id: 'mexico-sweet-table', country: 'Mexico', world: 'all', food: 'cookie_marranitos',
    title: 'A sweet side of Mexico', note: 'From the panadería to the celebration table: three ways to build sweetness and texture.',
    stops: [
      { foodId: 'cookie_marranitos', place: 'Mexican panadería traditions', note: 'Begin with the pig-shaped cookie. Piloncillo brings a deep sweetness to a soft, substantial bite.' },
      { foodId: 'cake_pan_de_elote', place: 'Mexican home baking', note: 'Fresh corn changes the texture of the crumb. Compare its gentle sweetness with the darker sugar character of marranitos.' },
      { foodId: 'cake_tres_leches', place: 'A shared Latin American tradition', note: 'Finish with sponge transformed by a milk soak. Its exact origin is debated; its place at celebration tables stretches across borders.' },
    ],
  },
  {
    id: 'vietnam-noodle-journey', country: 'Vietnam', world: 'noodles', food: 'pho-bo',
    title: 'Follow the rice noodle', note: 'From Hanoi to Huế and Hội An, discover how a bowl changes with its place.',
    stops: [
      { foodId: 'pho-bo', place: 'Hanoi and northern Vietnam', note: 'Begin with flat rice noodles in a fragrant beef broth. Phở’s early history is associated with northern Vietnam, with no single uncontested birthplace.' },
      { foodId: 'bun-bo-hue', place: 'Huế', note: 'Move to round noodles and a bolder broth scented with lemongrass. Notice the shift in both noodle shape and seasoning.' },
      { foodId: 'cao-lau', place: 'Hội An', note: 'Finish with chewy noodles, pork and greens with much less broth. Stories about local water form part of this town’s culinary identity.' },
    ],
  },
  {
    id: 'italy-sweet-traditions', country: 'Italy', world: 'all', food: 'cookie_biscotti',
    title: 'The Italian sweet table', note: 'Almonds take three forms: a crisp cookie, a dense chocolate cake and a ricotta-filled celebration.',
    stops: [
      { foodId: 'cookie_biscotti', place: 'Tuscany', note: 'Twice-baking produces the crisp bite of biscotti. Their dipping tradition makes texture part of how they are served.' },
      { foodId: 'cake_torta_caprese', place: 'Capri', note: 'Compare that crunch with a dense chocolate-almond cake made without flour. Stories of its accidental creation are local legend, not settled history.' },
      { foodId: 'cake_cassata_siciliana', place: 'Sicily', note: 'Almonds return as marzipan around sponge and sweet ricotta. Candied fruit and layered textures make this a different kind of festive sweet.' },
    ],
  },
  {
    id: 'france-butter-and-pastry', country: 'France', world: 'all', food: 'cake_paris_brest',
    title: 'Butter, three different ways', note: 'Compare a sandy cookie, caramelized Breton layers and a praline-filled choux ring.',
    stops: [
      { foodId: 'cookie_french_sable', place: 'The French tea table', note: 'Start with a sablé’s delicate, sandy crumb. Here, butter makes a cookie that breaks rather than bends.' },
      { foodId: 'cake_kouign_amann', place: 'Brittany', note: 'Fold butter and sugar through dough and the result changes completely: laminated layers and a caramelized surface.' },
      { foodId: 'cake_paris_brest', place: 'French pâtisserie', note: 'End with hollow choux and hazelnut praline cream. Compare its airy shell and rich filling with the dense layers of kouign-amann.' },
    ],
  },
  {
    id: 'argentina-afternoon-sweets', country: 'Argentina', world: 'all', food: 'cookie_alfajor',
    title: 'An Argentine sweet afternoon', note: 'Explore the bakery counter through dulce de leche, fruit preserves and crisp pastry.',
    stops: [
      { foodId: 'cookie_alfajor', place: 'Argentine confectionery', note: 'Begin with two cookies around a dulce de leche filling. The alfajor is a shared tradition with a particularly rich life in Argentina.' },
      { foodId: 'cookie_pepas', place: 'The panadería counter', note: 'Switch to a thumbprint cookie filled with fruit paste or jam. It offers a lighter contrast to dulce de leche-heavy sweets.' },
      { foodId: 'cake_torta_rogel', place: 'Argentine celebration tables', note: 'Bring dulce de leche back between thin pastry discs. The crisp layers and meringue finish turn familiar sweetness into a celebration cake.' },
    ],
  },
]
