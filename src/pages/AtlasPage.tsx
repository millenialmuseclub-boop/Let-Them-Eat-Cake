import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AtlasWorldMap } from '../components/AtlasWorldMap'
import { EditorialImage } from '../components/EditorialImage'
import { ContentShare } from '../components/ContentShare'
import { TasteThisPlace } from '../components/TasteThisPlace'
import { atlasCountries, atlasFoods, atlasTrails, atlasWorlds, placesFor } from '../lib/foodAtlas'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { trackDiscovery } from '../lib/analytics'
import './WorldAtlasPage.css'

const worldNames: Record<string, string> = { all: 'All worlds', cake: 'Cakes', cookies: 'Cookies', ramen: 'Ramen', noodles: 'Noodles' }
export function AtlasPage() {
  const [params, setParams] = useSearchParams()
  const world = atlasWorlds.find(w => w === params.get('world')) ?? 'all'
  const country = atlasCountries.find(c => c.toLowerCase() === params.get('country')?.toLowerCase()) ?? ''
  const [query, setQuery] = useState('')
  const region = params.get('region') ?? ''
  const [shown, setShown] = useState(12)
  const heading = useRef<HTMLHeadingElement>(null)
  const storyHeading = useRef<HTMLHeadingElement>(null)
  const entries = placesFor(country, world)
  const areas = [...new Set(entries.map(e => e.area).filter(Boolean))].sort()
  const activeRegion = areas.includes(region) ? region : ''
  const displayed = entries.filter(e => !activeRegion || e.area === activeRegion)
  const selected = displayed.find(e => e.foodId === params.get('food'))
  const food = selected && atlasFoods.get(selected.foodId)
  const countries = atlasCountries.filter(c => placesFor(c, world).length)
  const shownCountries = countries.filter(c => c.toLowerCase().includes(query.toLowerCase()))
  useDocumentTitle(country ? `${country} — World Food Atlas | Let Them Eat` : 'World Food Atlas | Let Them Eat')
  function browse(nextCountry = country, nextWorld = world, nextRegion = '', nextFood = '') {
    setParams({ ...(nextCountry ? { country: nextCountry } : {}), ...(nextWorld !== 'all' ? { world: nextWorld } : {}), ...(nextRegion ? { region: nextRegion } : {}), ...(nextFood ? { food: nextFood } : {}) })
    if (!nextFood) setShown(12)
    trackDiscovery('Atlas Selection', { country: nextCountry || 'world', world: nextWorld, id: nextFood })
  }
  function selectCountry(value: string) {
    browse(value)
    requestAnimationFrame(() => heading.current?.focus())
  }
  const photo = food ?? atlasFoods.get((entries.find(e => atlasFoods.get(e.foodId)?.image)?.foodId) ?? '')
  return <main className="page world-food-atlas">
    <header className="world-atlas-intro">
      <p className="eyebrow">Let Them Eat · The Atlas</p>
      <h1>The world, one bite at a time.</h1>
      <p>Start with a place. Follow a flavor. Discover the little details that make it unmistakably local.</p>
      <span>{countries.length} places to explore · Four food worlds</span>
    </header>
    <div className="atlas-world-tabs" role="group" aria-label="Food world">
      {atlasWorlds.map(w => <button key={w} aria-pressed={w === world} onClick={() => browse(country && placesFor(country, w).length ? country : '', w)}>{worldNames[w]}</button>)}
    </div>
    <nav className="atlas-breadcrumb" aria-label="Atlas journey"><button onClick={() => browse('', world)}>World</button>{country && <><span aria-hidden="true">/</span><button onClick={() => browse(country)}>{country}</button></>}{activeRegion && <span>/ {activeRegion}</span>}{food && <span>/ {food.name}</span>}</nav>
    <div className="atlas-exploration">
      <AtlasWorldMap countries={countries} selectedCountry={country || null} onSelectCountry={selectCountry} />
      <aside className="atlas-place-picker">
        <label htmlFor="atlas-place-query">Where are you curious about?</label>
        <input id="atlas-place-query" type="search" placeholder="Search a country or place" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="atlas-place-list" aria-label="Choose a country">
          {shownCountries.map(c => <button key={c} aria-pressed={c === country} onClick={() => selectCountry(c)}><span>{c}</span><small>{placesFor(c, world).length} discoveries ↗</small></button>)}
          {!shownCountries.length && <p>No places match. Try another name or food world.</p>}
        </div>
      </aside>
    </div>
    {!country && <section className="atlas-trails"><div className="atlas-section-title"><p className="eyebrow">A few places to begin</p><h2>Follow an appetite.</h2></div>
      <div className="atlas-trail-grid">{atlasTrails.filter(t => world === 'all' || placesFor(t.country, world).length).map(trail => {
        const imageFood = atlasFoods.get(trail.food)
        return <button key={trail.country} className="atlas-trail" onClick={() => selectCountry(trail.country)}>
          <EditorialImage src={imageFood?.image} alt={imageFood?.name} loading="lazy" width={480} height={320} />
          <div><p className="eyebrow">{trail.country}</p><h3>{trail.title}</h3><p>{trail.note}</p><strong>Explore this place →</strong></div>
        </button>
      })}</div>
    </section>}
    {country && <section className="atlas-country-story" key={country}>
      <div className="atlas-country-heading"><div><p className="eyebrow">What does this place taste like?</p><h2 ref={heading} tabIndex={-1}>{country}</h2><p>{entries.length} discoveries across {new Set(entries.map(e => e.world)).size} food {new Set(entries.map(e => e.world)).size === 1 ? 'world' : 'worlds'}. Choose a style to meet the place behind it.</p><p className="atlas-association-note">Places mark culinary associations; shared traditions and debated origins cross borders.</p></div>
        {photo && <figure><EditorialImage src={photo.image} alt={photo.name} width={500} height={330} loading="lazy" /><figcaption>{photo.name}{photo.credit && ` · Photo: ${photo.credit}`}</figcaption></figure>}
      </div>
      {areas.length > 0 && <div className="atlas-region-picker"><label htmlFor="atlas-area">Look closer: region or city</label><select id="atlas-area" value={activeRegion} onChange={e => browse(country, world, e.target.value)}><option value="">All regional traditions</option>{areas.map(area => <option key={area}>{area}</option>)}</select></div>}
      {country === 'Japan' && <Link className="atlas-deeper-map" to="/ramen/atlas">Go deeper: explore Japan’s ramen city map →</Link>}
      <div className="atlas-food-grid">{displayed.slice(0, shown).map(entry => {
        const item = atlasFoods.get(entry.foodId)
        if (!item) return null
        return <button key={entry.foodId} className="atlas-food-card" aria-pressed={selected?.foodId === entry.foodId} onClick={() => { browse(country, world, activeRegion, entry.foodId); requestAnimationFrame(() => storyHeading.current?.focus()) }}>
          <EditorialImage src={item.image} alt={item.name} width={400} height={280} loading="lazy" />
          <div><p className="eyebrow">{worldNames[entry.world]} · {entry.area || country}</p><h3>{item.name}</h3><p>{item.description}</p><span>Meet the style →</span></div>
        </button>
      })}</div>
      {displayed.length > shown && <button className="atlas-more" onClick={() => setShown(n => n + 12)}>Show more regional discoveries</button>}
      {selected && food && <article className="atlas-style-story" key={food.id}>
        <figure><EditorialImage src={food.image} alt={food.name} loading="lazy" width={800} height={600} />{food.credit && <figcaption>Photo: {food.credit}</figcaption>}</figure>
        <div><p className="eyebrow">{selected.area || country} · {worldNames[food.world]}</p><h2 ref={storyHeading} tabIndex={-1}>{food.name}</h2>
          <p>{selected.context}</p><h3>What makes it distinctive</h3><p>{food.lesson}</p>
          {selected.ingredients?.map(ingredient => <p key={ingredient}>{ingredient}</p>)}
          {selected.variations?.length ? <details><summary>Variations on the tradition</summary>{selected.variations.map(v => <p key={v}>{v}</p>)}</details> : null}
          <details><summary>The deeper story</summary><p>{selected.story}</p>{selected.association && <p>{selected.association}</p>}</details>
          <Link className="atlas-story-link" to={food.path}>Explore the full story & recipe →</Link>
          <ContentShare title={`${food.name} · ${country}`} path={`/atlas?${params}`} />
        </div>
      </article>}
      <TasteThisPlace country={country} foodId={food?.id} />
      <div className="atlas-continue"><h3>Keep wandering</h3><p>Another style, another place, another reason to be curious.</p>{atlasTrails.filter(t => t.country !== country && placesFor(t.country, world).length).map(t => <button key={t.country} onClick={() => selectCountry(t.country)}>{t.country} →</button>)}</div>
    </section>}
    <footer className="atlas-collections"><h2>Explore the specialist atlases</h2><p>Spend a little longer with one food world.</p><div><Link to="/atlas/cakes">Cake heritage & recipes →</Link><Link to="/cookies/atlas">Cookie traditions →</Link><Link to="/ramen/atlas">Ramen regions & cities →</Link><Link to="/noodles/atlas">Noodle places & techniques →</Link></div></footer>
  </main>
}
