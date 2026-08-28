import { Link } from 'react-router-dom';
import { twirlStories, vocabulary } from '../../data/noodles/twirl';
import { getImageFor } from '../../data/noodles/images';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function TwirlPage() {
  useDocumentTitle('Twirl');
  return (
    <div className="page-container">
      <span className="eyebrow">Twirl</span>
      <h1>A Small Noodle Culture Magazine</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        How the world eats noodles — technique stories, vocabulary, and the culture behind the bowl.
      </p>

      <div className="section-heading">
        <h2>Editorial Stories</h2>
      </div>
      <div className="story-list">
        {twirlStories.map((story, i) => {
          const relatedDishId = story.relatedDishIds?.[0];
          const image = relatedDishId ? getImageFor(relatedDishId) : undefined;
          return (
            <Link key={story.slug} to={`/noodles/twirl/${story.slug}`} className="story-item">
              <span className="story-item__index">{String(i + 1).padStart(2, '0')}</span>
              {image && (
                <span className="story-item__media">
                  <img src={image.src} alt="" />
                </span>
              )}
              <span className="story-item__body">
                <h3 style={{ marginBottom: 4 }}>{story.title}</h3>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>{story.dek}</p>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="section-heading">
        <h2>Vocabulary</h2>
      </div>
      <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
        {vocabulary.map((term) => (
          <div key={term.term} style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
            <dt style={{ fontWeight: 700 }}>
              {term.term} {term.localScript && <span style={{ opacity: 0.6, fontWeight: 400 }}>{term.localScript}</span>}
            </dt>
            <dd style={{ margin: '2px 0 0' }}>{term.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
