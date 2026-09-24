import { CompanionApp } from '../../components/CompanionApp'
import { EditorialImage } from '../../components/EditorialImage'
import { Link, useSearchParams } from 'react-router-dom';
import { regions, countries, places, dishes } from '../../lib/noodles/data';
import { getImageFor } from '../../data/noodles/images';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import '../../components/ContextualCuratedKitchen.css';

/* One real, attributed dish photo per region, used as a visual header strip so the flagship
   "global variety" page doesn't open on pure text before any imagery appears -- picked as the
   first dish in each region that actually has a sourced photo, so every tile is real. */
function regionSpotlightImage(regionId: string) {
  const regionDishes = dishes.filter((d) => d.place.regionId === regionId);
  for (const dish of regionDishes) {
    const image = getImageFor(dish.id);
    if (image) return { image, dish };
  }
  return undefined;
}

/* Global Atlas, deliberately list-first: Region -> Country -> City/Place -> Dish. Works entirely
   without a map, per the master spec ("the Atlas should work even without interacting with a
   map"). A restrained map layer using react-simple-maps + world-atlas (the proven family
   library) is documented as a Phase 2 addition in the master spec rather than built now, since
   Noodles needs a genuinely global default view rather than Ramen's single-country-scoped map,
   and that view logic deserves its own pass. */
const ATLAS_HERO_DISH_ID = 'pho-bo';

export function AtlasPage() {
  useDocumentTitle('Atlas');
  const heroImage = getImageFor(ATLAS_HERO_DISH_ID);
  const [params, setParams] = useSearchParams();
  const countryId = countries.some(c => c.id === params.get('country')) ? params.get('country') : null;
  const regionId = regions.some(r => r.id === params.get('region')) ? params.get('region') : null;

  return (
    <div className="page-container">
      <Link to="/atlas">← Explore the World Food Atlas</Link>
      {heroImage && (
        <div className="lab-hero-image">
          <EditorialImage src={heroImage.src} alt={heroImage.alt} loading="lazy" />
          <span className="lab-hero-credit">
            {heroImage.credit.creator} / Wikimedia Commons
          </span>
        </div>
      )}
      <span className="eyebrow">Atlas</span>
      <h1>Browse by Origin</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        A global atlas of noodle traditions. Where a dish comes from is rarely one uncontested
        point — each entry below reflects the region most strongly and widely associated with it.
      </p>

      <label htmlFor="noodle-atlas-country">Explore a country</label>
      <select id="noodle-atlas-country" value={countryId ?? ''} onChange={e => setParams(e.target.value ? { country: e.target.value } : {})}>
        <option value="">All countries</option>
        {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
      </select>
      {regionId && <p><button onClick={() => setParams({})}>Show all regions</button></p>}
      <div className="atlas-list">
        {regions.filter(r => (!regionId || r.id === regionId) && (!countryId || countries.some(c => c.id === countryId && c.regionId === r.id))).map((region) => {
          const regionCountries = countries.filter((c) => c.regionId === region.id && (!countryId || c.id === countryId));
          const spotlight = regionSpotlightImage(region.id);
          return (
            <div key={region.id} className="atlas-region">
              <div className="atlas-region__header">
                {spotlight && (
                  <EditorialImage
                    src={spotlight.image.src}
                    alt={spotlight.image.alt}
                    loading="lazy"
                    className="atlas-region__spotlight"
                  />
                )}
                <h2>{region.name}</h2>
              </div>
              <div className="atlas-region__countries">
                {regionCountries.map((country) => {
                  const countryPlaces = places.filter((p) => p.countryId === country.id);
                  const countryDishes = dishes.filter((d) => d.place.countryId === country.id);
                  return (
                    <div key={country.id} className="atlas-country">
                      <h3>{country.name}</h3>
                      {countryPlaces.map((place) => (
                        <p key={place.id} className="atlas-place-note">
                          <strong>{place.name}</strong> — {place.noteOnSignificance}
                        </p>
                      ))}
                      <div className="atlas-place-list">
                        {countryDishes.map((dish) => {
                          const dishImage = getImageFor(dish.id);
                          return (
                            <Link key={dish.id} to={`/noodles/encyclopedia/${dish.id}`} className="chip chip-brass">
                              {dishImage && <EditorialImage src={dishImage.src} alt="" loading="lazy" className="atlas-dish-avatar" />}
                              {dish.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <CompanionApp app="rallii" />
    </div>
  );
}
