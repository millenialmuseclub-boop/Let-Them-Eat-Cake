import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { findMatches } from '../../lib/noodles/sommelier';
import { getDish, getPlaceLabel } from '../../lib/noodles/data';
import { PhotoFrame } from '../../components/noodles/PhotoFrame';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import type { FindCraving } from '../../types/noodles/sommelier';
import type { FlavorTag } from '../../types/noodles/noodle';

const TAGS: FlavorTag[] = ['garlicky', 'sesame', 'chili', 'savory', 'tangy', 'herbal', 'nutty', 'fermented', 'smoky', 'aromatic', 'fresh', 'citrus', 'sweet'];

const DIMENSIONS: { key: keyof Omit<FindCraving, 'desiredTags'>; left: string; right: string }[] = [
  { key: 'brothiness', left: 'Dry', right: 'Brothy' },
  { key: 'boldness', left: 'Delicate', right: 'Bold' },
  { key: 'richness', left: 'Light', right: 'Rich' },
  { key: 'chewiness', left: 'Soft', right: 'Chewy' },
  { key: 'spice', left: 'Mild', right: 'Spicy' },
];

export function SommelierFindPage() {
  useDocumentTitle('Find Your Noodle');
  const [craving, setCraving] = useState<FindCraving>({
    brothiness: 3,
    boldness: 3,
    richness: 3,
    chewiness: 3,
    spice: 2,
    desiredTags: [],
  });

  const matches = useMemo(() => findMatches(craving, 3), [craving]);

  function toggleTag(tag: FlavorTag) {
    setCraving((c) => ({
      ...c,
      desiredTags: c.desiredTags.includes(tag) ? c.desiredTags.filter((t) => t !== tag) : [...c.desiredTags, tag],
    }));
  }

  return (
    <div className="page-container">
      <span className="eyebrow">Sommelier</span>
      <h1>What Kind of Noodle Are You Craving?</h1>

      {DIMENSIONS.map((dim) => (
        <div key={dim.key} style={{ marginTop: 16 }}>
          <label htmlFor={`dim-${dim.key}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
            <span>{dim.left}</span>
            <span>{dim.right}</span>
          </label>
          <input
            id={`dim-${dim.key}`}
            type="range"
            min={0}
            max={5}
            step={1}
            value={craving[dim.key]}
            onChange={(e) => setCraving((c) => ({ ...c, [dim.key]: Number(e.target.value) }))}
          />
        </div>
      ))}

      <div className="section-heading">
        <h2>Flavor Notes</h2>
      </div>
      <div role="group" aria-label="Flavor notes" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TAGS.map((tag) => (
          <button key={tag} type="button" className="chip" aria-pressed={craving.desiredTags.includes(tag)} onClick={() => toggleTag(tag)}>
            {tag}
          </button>
        ))}
      </div>

      <div className="section-heading">
        <h2>Try These</h2>
      </div>
      <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {matches.map((match) => {
          const dish = getDish(match.dishId);
          if (!dish) return null;
          return (
            <div key={match.dishId} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <Link to={`/noodles/encyclopedia/${dish.id}`} className="tile" style={{ width: 84, flexShrink: 0 }}>
                <PhotoFrame subjectId={dish.id} fallbackLabel={dish.name} variant="tile" />
              </Link>
              <div>
                <h3 style={{ margin: '0 0 4px' }}>{dish.name}</h3>
                <p style={{ margin: '0 0 6px', fontSize: 12.5, opacity: 0.7 }}>{getPlaceLabel(dish.place)}</p>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13 }}>
                  {match.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
