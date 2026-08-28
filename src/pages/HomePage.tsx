import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { getSceneImage } from '../lib/sceneImages'
import { products } from '../lib/products'
import './HomePage.css'

// The umbrella "What are we eating?" home for the merged app. Rewritten from an equal four-card
// launcher grid into an editorial front page for one publication with four departments: a real
// masthead hero establishes "Let Them Eat" first, each world gets its own varied magazine-style
// introduction (real photography from that world's own content, not an emoji), and a handful of
// cross-world discovery sections surface real existing content (Atlas regions, Workshop/Lab
// pages, Curated Kitchen products) rather than fabricated placeholders. Once you follow a link
// into a world, that world's own identity (accent color, nav, tone) takes back over -- Home is
// the only place the umbrella brand leads.

const heroScene = getSceneImage('curated-collections')

interface WorldIntro {
  world: string
  eyebrow: string
  headline: string
  copy: string
  cta: string
  to: string
  image: { url: string; alt: string; credit?: string }
  imageFirst: boolean
}

const WORLD_INTROS: WorldIntro[] = [
  {
    world: 'cake',
    eyebrow: 'Cake',
    headline: 'The art of celebration.',
    copy: 'Structure, science, and flavor behind the cakes people build their biggest days around -- from a Victoria sponge to a full wedding build.',
    cta: 'Explore Cake',
    to: '/discover',
    image: {
      url: 'https://images.unsplash.com/photo-1586985289906-406988974504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDE5NzI1fDB8MXxzZWFyY2h8MXx8Q2xhc3NpYyUyMFllbGxvdyUyMExheWVyJTIwQ2FrZSUyMHdpdGglMjBDaG9jb2xhdGUlMjBGcm9zdGluZyUyMGNha2V8ZW58MHwwfHx8MTc4NjA0OTkyNXww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'A layered yellow cake with chocolate frosting',
      credit: 'American Heritage Chocolate / Unsplash',
    },
    imageFirst: false,
  },
  {
    world: 'ramen',
    eyebrow: 'Ramen',
    headline: 'Broth. Tare. Noodles. Place.',
    copy: "Japan's ramen regions, bowl by bowl -- and a full workshop for building your own, from the stock pot up.",
    cta: 'Explore Ramen',
    to: '/ramen',
    image: {
      url: 'https://images.pexels.com/photos/15085069/pexels-photo-15085069.jpeg',
      alt: 'Two bowls of ramen',
      credit: 'Яна Шабала / Pexels',
    },
    imageFirst: true,
  },
  {
    world: 'cookies',
    eyebrow: 'Cookies',
    headline: 'The chemistry of a good batch.',
    copy: 'What butter, sugar, and time actually do to a dough -- and the traditions and troubleshooting behind cookies from around the world.',
    cta: 'Explore Cookies',
    to: '/cookies',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Chocolate_chip_cookies_in_the_oven%2C_March_2008.jpg',
      alt: 'A tray of chocolate chip cookies fresh from the oven',
      credit: 'Sarah Fleming / Wikimedia Commons',
    },
    imageFirst: false,
  },
  {
    world: 'noodles',
    eyebrow: 'Noodles',
    headline: 'Global traditions, dish by dish.',
    copy: 'From phở to hand-pulled noodles -- the dishes and the noodle families behind them, region by region.',
    cta: 'Explore Noodles',
    to: '/noodles',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ph%E1%BB%9F_%C4%91%E1%BA%B7c_bi%E1%BB%87t.jpg',
      alt: 'A bowl of phở đặc biệt with rice noodles, broth, and herbs',
      credit: 'Azure Dragon of the East / Wikimedia Commons',
    },
    imageFirst: true,
  },
]

// Each image below is the real, specific photo already associated with that exact place/dish in
// its own world's existing image data (cakeImages.json / ramenImages.json / images.ts) -- not a
// generic stock substitute.
const ATLAS_HIGHLIGHTS = [
  {
    place: 'Mexico',
    note: 'Tres leches cake',
    to: '/atlas',
    image: 'https://images.unsplash.com/photo-1615735486329-c61cd40bfcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    place: 'Sapporo, Japan',
    note: 'Miso ramen',
    to: '/ramen/atlas',
    image: 'https://images.pexels.com/photos/16594958/pexels-photo-16594958.jpeg?w=400',
  },
  {
    place: 'Vietnam',
    note: 'Phở',
    to: '/noodles/atlas',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ph%E1%BB%9F_%C4%91%E1%BA%B7c_bi%E1%BB%87t.jpg?width=400',
  },
]

// Each image is that exact page's own hero/scene image where one exists in the ported content
// (Ramen's Broth Lab, Cookies' dough-lab scene); Cake Science reuses the cake photo hubs.ts
// already associates with that hub tile; Noodle Workshop uses a real hand-pulled-noodle dish
// photo (Lanzhou lamian) from Noodles' own image set, since Noodles has no dedicated workshop
// scene photo of its own.
const WORKSHOP_HIGHLIGHTS = [
  {
    world: 'Cake',
    title: 'Cake Science',
    to: '/cake-science',
    image: 'https://images.unsplash.com/photo-1638519651608-412009302a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    world: 'Ramen',
    title: 'Broth Lab',
    to: '/ramen/broth-lab',
    image: 'https://images.pexels.com/photos/15085069/pexels-photo-15085069.jpeg?w=400',
  },
  {
    world: 'Cookies',
    title: 'Cookie Workshop',
    to: '/cookies/workshop',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Rolling_Out_Cookie_Dough.JPG',
  },
  {
    world: 'Noodles',
    title: 'Noodle Workshop',
    to: '/noodles/workshop',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E5%85%B0%E5%B7%9E%E7%89%9B%E8%82%89%E9%9D%A2.jpg?width=400',
  },
]

const kitchenPicks = products.filter((p) => p.offers.some((o) => o.status === 'active' && o.url)).slice(0, 4)

// None of the three worlds' ported product catalogs carry a per-product photo (verified -- no
// imageUrl/image field exists anywhere in their source data), so a specific product photo here
// would have to be fabricated. Ramen's own category-level Curated Kitchen photography does
// genuinely exist and honestly represents this list (all four current picks are bowls/tableware),
// so that -- not an invented per-item photo -- is what's used, exactly as Ramen's own
// ContextualCuratedKitchen already does for the same category.
const kitchenCategoryImage = 'https://images.pexels.com/photos/27527988/pexels-photo-27527988.jpeg?w=800'

export function HomePage() {
  useDocumentTitle('Let Them Eat')

  return (
    <main className="home-page">
      <section className="home-hero">
        {heroScene && <img src={heroScene.url} alt="" className="home-hero-image" />}
        <div className="home-hero-copy">
          <p className="home-hero-mark">LET THEM EAT</p>
          <h1>A world of food, culture, craft &amp; flavor.</h1>
        </div>
      </section>

      {WORLD_INTROS.map((intro) => (
        <section key={intro.world} className={`home-world-intro${intro.imageFirst ? ' home-world-intro-image-first' : ''}`}>
          <div className="home-world-intro-image-wrap">
            <img src={intro.image.url} alt={intro.image.alt} className="home-world-intro-image" loading="lazy" />
            {intro.image.credit && <span className="home-world-intro-credit">{intro.image.credit}</span>}
          </div>
          <div className="home-world-intro-copy">
            <p className="home-world-intro-eyebrow">{intro.eyebrow}</p>
            <h2>{intro.headline}</h2>
            <p>{intro.copy}</p>
            <Link to={intro.to} className="home-world-intro-cta">
              {intro.cta} &rarr;
            </Link>
          </div>
        </section>
      ))}

      <hr className="home-divider" />

      <section className="home-discovery">
        <h3>From the Atlas</h3>
        <ul className="home-discovery-list">
          {ATLAS_HIGHLIGHTS.map((item) => (
            <li key={item.place}>
              <Link to={item.to}>
                <img src={item.image} alt="" className="home-discovery-thumb" loading="lazy" />
                <span className="home-discovery-text">
                  <span className="home-discovery-place">{item.place}</span>
                  <span className="home-discovery-note">{item.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-discovery">
        <h3>Learn Something Delicious</h3>
        <ul className="home-discovery-list">
          {WORKSHOP_HIGHLIGHTS.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>
                <img src={item.image} alt="" className="home-discovery-thumb" loading="lazy" />
                <span className="home-discovery-text">
                  <span className="home-discovery-place">{item.title}</span>
                  <span className="home-discovery-note">{item.world}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {kitchenPicks.length > 0 && (
        <section className="home-discovery">
          <h3>From the Kitchen</h3>
          <div className="home-kitchen-header">
            <img src={kitchenCategoryImage} alt="" className="home-kitchen-header-image" loading="lazy" />
          </div>
          <ul className="home-discovery-list home-discovery-list-no-thumb">
            {kitchenPicks.map((product) => {
              const offer = product.offers.find((o) => o.status === 'active' && o.url)!
              return (
                <li key={product.id}>
                  <a href={offer.url} target="_blank" rel="noreferrer sponsored">
                    <span className="home-discovery-text">
                      <span className="home-discovery-place">{product.name}</span>
                      <span className="home-discovery-note">{offer.cta ?? 'Shop'}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </main>
  )
}
