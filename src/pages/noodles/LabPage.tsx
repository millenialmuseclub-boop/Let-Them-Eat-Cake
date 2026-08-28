import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { labs } from '../../data/noodles/workshop';
import { getDish, getNoodleType } from '../../lib/noodles/data';
import { getImageFor } from '../../data/noodles/images';
import { ContextualCuratedKitchen } from '../../components/ContextualCuratedKitchen';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

/* ONE shared Lab component serves every lab via data — the strongest transferable Workshop
   pattern in the family (Ramen's LabExplorer). Picking a described option drives a qualitative
   0-5 bar chart, never a numeric calculator. */
export function LabPage() {
  const { slug = '' } = useParams();
  const lab = labs.find((l) => l.slug === slug);
  useDocumentTitle(lab?.title ?? 'Lab');
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (!lab) {
    return (
      <div className="page-container">
        <p>Lab not found.</p>
        <Link to="/noodles/workshop" className="btn btn-secondary" style={{ marginTop: 12 }}>← Back to Workshop</Link>
      </div>
    );
  }

  // Only the labs with a photographed related dish get the medium editorial photo — an honest
  // typographic-only header otherwise, rather than forcing an unrelated image.
  const featuredDishId = lab.relatedDishIds?.[0];
  const featuredImage = featuredDishId ? getImageFor(featuredDishId) : undefined;

  return (
    <div className="page-container">
      <span className="eyebrow">Workshop Lab</span>
      <h1>{lab.title}</h1>
      <p className="prose" style={{ maxWidth: 560 }}>{lab.summary}</p>

      {featuredImage && (
        <figure className="photo-medium">
          <img src={featuredImage.src} alt={featuredImage.alt} />
        </figure>
      )}

      {lab.variables.map((variable) => {
        const selectedOptionId = selected[variable.id] ?? variable.options[0].id;
        const selectedOption = variable.options.find((o) => o.id === selectedOptionId)!;
        return (
          <div key={variable.id} style={{ marginTop: 20 }}>
            <h2>{variable.label}</h2>
            <div role="group" aria-label={variable.label} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {variable.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="chip"
                  aria-pressed={selectedOptionId === option.id}
                  onClick={() => setSelected((s) => ({ ...s, [variable.id]: option.id }))}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="card" style={{ marginTop: 12 }} aria-live="polite">
              <p style={{ margin: '0 0 12px' }}>{selectedOption.description}</p>
              <div className="bars">
                {selectedOption.bars.map((bar) => (
                  <div className="bars__row" key={bar.label}>
                    <span>{bar.label}</span>
                    <div className="bars__track" role="img" aria-label={`${bar.label}: ${bar.value} of 5`}>
                      <div className="bars__fill" style={{ width: `${(bar.value / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {(lab.relatedDishIds || lab.relatedNoodleTypeIds) && (
        <>
          <div className="section-heading">
            <h2>Related</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {lab.relatedDishIds?.map((id) => {
              const d = getDish(id);
              return d ? (
                <Link key={id} to={`/noodles/encyclopedia/${d.id}`} className="chip">
                  {d.name}
                </Link>
              ) : null;
            })}
            {lab.relatedNoodleTypeIds?.map((id) => {
              const t = getNoodleType(id);
              return t ? (
                <Link key={id} to={`/noodles/encyclopedia/type/${t.id}`} className="chip chip-brass">
                  {t.name}
                </Link>
              ) : null;
            })}
          </div>
        </>
      )}

      <ContextualCuratedKitchen context={lab.slug} title="From the Curated Kitchen" />
    </div>
  );
}
