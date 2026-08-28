import { Link, useParams } from 'react-router-dom';
import { getNoodleType, getDishesForNoodleType, getTechnique } from '../../lib/noodles/data';
import { PhotoFrame } from '../../components/noodles/PhotoFrame';
import { DishTile } from '../../components/noodles/DishTile';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function NoodleTypeDetailPage() {
  const { id = '' } = useParams();
  const type = getNoodleType(id);
  useDocumentTitle(type?.name ?? 'Noodle Type');

  if (!type) {
    return (
      <div className="page-container">
        <p>Noodle type not found.</p>
        <Link to="/noodles/encyclopedia/noodle-types">← Back to noodle types</Link>
      </div>
    );
  }

  const relatedDishes = getDishesForNoodleType(type.id);

  return (
    <div className="page-container">
      <div className="hero-bleed">
        <PhotoFrame subjectId={type.id} fallbackLabel={type.name} variant="hero" fallbackEmoji="🍥" />
        <div className="hero-bleed__scrim" />
        <div className="hero-bleed__content">
          <span className="eyebrow">Noodle Type</span>
          <h1>{type.name}</h1>
        </div>
      </div>

      <div className="glance-strip">
        <div className="glance-strip__item"><span>Base</span><span>{type.base.replace('-', ' ')}</span></div>
        <div className="glance-strip__item"><span>Form</span><span>{type.form.replace('-', ' ')}</span></div>
        <div className="glance-strip__item"><span>Texture</span><span>{type.texture}</span></div>
      </div>

      <p className="prose">{type.description}</p>
      <p className="prose" style={{ opacity: 0.75 }}>
        <strong>Origin note:</strong> {type.originNote}
      </p>

      <div className="section-heading">
        <h2>Made By</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {type.techniqueIds.map((tid) => {
          const t = getTechnique(tid);
          return t ? (
            <span key={tid} className="chip chip-brass">
              {t.name}
            </span>
          ) : null;
        })}
      </div>

      <div className="section-heading">
        <h2>Dishes Made With This Noodle</h2>
      </div>
      <div className="grid">
        {relatedDishes.map((dish) => (
          <DishTile key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
