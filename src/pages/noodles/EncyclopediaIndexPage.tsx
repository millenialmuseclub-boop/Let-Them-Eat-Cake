import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dishes, countries } from '../../lib/noodles/data';
import { DishTile } from '../../components/noodles/DishTile';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import type { PreparationStyle } from '../../types/noodles/noodle';

const PREP_STYLES: PreparationStyle[] = ['soup', 'dry-sauced', 'stir-fried', 'chilled', 'dressed'];

export function EncyclopediaIndexPage() {
  useDocumentTitle('Encyclopedia');
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [prepFilter, setPrepFilter] = useState<PreparationStyle | null>(null);
  const [letterFilter, setLetterFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return dishes
      .filter((d) => !countryFilter || d.place.countryId === countryFilter)
      .filter((d) => !prepFilter || d.preparationStyle === prepFilter)
      .filter((d) => !letterFilter || d.name[0].toUpperCase() === letterFilter)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countryFilter, prepFilter, letterFilter]);

  const availableLetters = useMemo(
    () => Array.from(new Set(dishes.map((d) => d.name[0].toUpperCase()))).sort(),
    [],
  );

  return (
    <div className="page-container">
      <span className="eyebrow">Encyclopedia</span>
      <h1>The Noodle Encyclopedia</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        Every canonical dish, browsable by region and by how it's prepared. All browsing here
        resolves to a canonical detail page.
      </p>

      <div className="section-heading">
        <h2>By Region</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Filter by country">
        <button type="button" className="chip" aria-pressed={countryFilter === null} onClick={() => setCountryFilter(null)}>
          All
        </button>
        {countries.map((c) => (
          <button
            key={c.id}
            type="button"
            className="chip"
            aria-pressed={countryFilter === c.id}
            onClick={() => setCountryFilter(c.id === countryFilter ? null : c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="section-heading">
        <h2>Browse A–Z</h2>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} role="group" aria-label="Filter by first letter">
        <button type="button" className="chip" aria-pressed={letterFilter === null} onClick={() => setLetterFilter(null)}>
          All
        </button>
        {availableLetters.map((letter) => (
          <button
            key={letter}
            type="button"
            className="chip"
            aria-pressed={letterFilter === letter}
            onClick={() => setLetterFilter(letter === letterFilter ? null : letter)}
            style={{ minWidth: 36, padding: '6px 0' }}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="section-heading">
        <h2>By Preparation</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="group" aria-label="Filter by preparation style">
        <button type="button" className="chip" aria-pressed={prepFilter === null} onClick={() => setPrepFilter(null)}>
          All
        </button>
        {PREP_STYLES.map((style) => (
          <button
            key={style}
            type="button"
            className="chip"
            aria-pressed={prepFilter === style}
            onClick={() => setPrepFilter(style === prepFilter ? null : style)}
          >
            {style.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="section-heading">
        <h2>
          {filtered.length} Dish{filtered.length === 1 ? '' : 'es'}
        </h2>
        <Link to="/noodles/encyclopedia/noodle-types">Browse by noodle type →</Link>
      </div>
      <div className="grid" aria-live="polite">
        {filtered.map((dish) => (
          <DishTile key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
