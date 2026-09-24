import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import foods from '../data/foodSearch.json'
import { searchFoods, type FoodEntry } from '../lib/foodSearch'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { trackDiscovery } from '../lib/analytics'
import { EditorialImage } from '../components/EditorialImage'
import { ContentShare } from '../components/ContentShare'
import './ExplorePage.css'

const catalog = foods as FoodEntry[]
const worlds = ['all', 'cake', 'cookies', 'ramen', 'noodles']
const trails = ['sesame', 'citrus', 'chocolate', 'chewy', 'rice', 'Mexico', 'Japan', 'hand pulled']

export function ExplorePage() {
  useDocumentTitle('Explore food, flavor & place | Let Them Eat')
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const query = params.get('q') ?? ''
  const world = worlds.includes(params.get('world') ?? '') ? params.get('world')! : 'all'
  const [shown, setShown] = useState(18)
  const matches = useMemo(() => searchFoods(catalog, query, world), [query, world])
  function browse(q: string, w = world) {
    setParams({ ...(q ? { q } : {}), ...(w !== 'all' ? { world: w } : {}) })
    setShown(18)
    trackDiscovery('Search Used', { world: w, results: String(searchFoods(catalog, q, w).length) })
  }
  return <main className="page food-explore">
    <p className="eyebrow">Follow your curiosity</p>
    <h1>One ingredient. A world of discoveries.</h1>
    <p>Explore {catalog.length} foods through flavor, texture, technique and place. Every result opens the full story.</p>
    <form className="food-search" onSubmit={e => { e.preventDefault(); browse(String(new FormData(e.currentTarget).get("q") ?? "")) }}>
      <label htmlFor="food-query">Search all four worlds</label>
      <div><input key={query} id="food-query" name="q" type="search" defaultValue={query} placeholder="Try sesame, Mexico, chewy or phở" /><button type="submit">Search</button></div>
    </form>
    <div className="food-chips" role="group" aria-label="Food world">
      {worlds.map(w => <button key={w} aria-pressed={w === world} onClick={() => browse(query, w)}>{w === 'all' ? 'All worlds' : w}</button>)}
    </div>
    <div className="food-chips" aria-label="Ideas to explore">{trails.map(q => <Link key={q} to={`/explore?q=${encodeURIComponent(q)}`} onClick={() => { setShown(18) }}>{q}</Link>)}</div>
    <div className="food-explore-actions">
      <p role="status">{matches.length} discoveries{query && <> for “{query}”</>}</p>
      <button disabled={!matches.length} onClick={() => {
        trackDiscovery('Surprise Me', { world })
        navigate(matches[Math.floor(Math.random() * matches.length)].path)
      }}>Surprise me</button>
      <ContentShare title={query ? `${query} discoveries` : 'Food discoveries'} path={`/explore${params.size ? `?${params}` : ''}`} />
    </div>
    {!matches.length && <section><h2>A different trail?</h2><p>Try one ingredient, a country or a texture. Search matches words together; fewer words can uncover more.</p><button onClick={() => browse('', 'all')}>Show all discoveries</button></section>}
    <div className="food-result-grid">
      {matches.slice(0, shown).map(item => <article key={item.path} className="food-result">
        <Link to={item.path} onClick={() => trackDiscovery('Discovery Opened', { world: item.world, id: item.id })}>
          <EditorialImage src={item.image} alt={item.name} loading="lazy" width={480} height={320} />
          <div><p className="eyebrow">{item.world} · {item.place || 'Explore the style'}</p><h2>{item.name}</h2><p>{item.description}</p></div>
        </Link>
        <details><summary>What makes it different?</summary><p>{item.lesson}</p></details>
        {item.credit && <small>Photo: {item.credit}</small>}
      </article>)}
    </div>
    {matches.length > shown && <button className="food-show-more" onClick={() => setShown(n => n + 18)}>Show 18 more discoveries</button>}
  </main>
}
