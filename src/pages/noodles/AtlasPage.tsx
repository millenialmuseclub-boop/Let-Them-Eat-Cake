import { Link } from 'react-router-dom';
import { regions, countries, places, dishes } from '../../lib/noodles/data';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

/* Global Atlas, deliberately list-first: Region -> Country -> City/Place -> Dish. Works entirely
   without a map, per the master spec ("the Atlas should work even without interacting with a
   map"). A restrained map layer using react-simple-maps + world-atlas (the proven family
   library) is documented as a Phase 2 addition in the master spec rather than built now, since
   Noodles needs a genuinely global default view rather than Ramen's single-country-scoped map,
   and that view logic deserves its own pass. */
export function AtlasPage() {
  useDocumentTitle('Atlas');

  return (
    <div className="page-container">
      <span className="eyebrow">Atlas</span>
      <h1>Browse by Origin</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        A global atlas of noodle traditions. Where a dish comes from is rarely one uncontested
        point — each entry below reflects the region most strongly and widely associated with it.
      </p>

      <div className="atlas-list">
        {regions.map((region) => {
          const regionCountries = countries.filter((c) => c.regionId === region.id);
          return (
            <div key={region.id} className="atlas-region">
              <h2 style={{ marginBottom: 0 }}>{region.name}</h2>
              <div className="atlas-region__countries">
                {regionCountries.map((country) => {
                  const countryPlaces = places.filter((p) => p.countryId === country.id);
                  const countryDishes = dishes.filter((d) => d.place.countryId === country.id);
                  return (
                    <div key={country.id} className="atlas-country">
                      <h3 style={{ marginBottom: 4 }}>{country.name}</h3>
                      {countryPlaces.map((place) => (
                        <p key={place.id} style={{ fontSize: 13.5, opacity: 0.8, margin: '2px 0' }}>
                          <strong>{place.name}</strong> — {place.noteOnSignificance}
                        </p>
                      ))}
                      <div className="atlas-place-list">
                        {countryDishes.map((dish) => (
                          <Link key={dish.id} to={`/noodles/encyclopedia/${dish.id}`} className="chip chip-brass">
                            {dish.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
