import { Link, useParams } from 'react-router-dom';
import { twirlStories } from '../../data/noodles/twirl';
import { getDish, getNoodleType } from '../../lib/noodles/data';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function TwirlStoryPage() {
  const { slug = '' } = useParams();
  const story = twirlStories.find((s) => s.slug === slug);
  useDocumentTitle(story?.title ?? 'Story');

  if (!story) {
    return (
      <div className="page-container">
        <p>Story not found.</p>
        <Link to="/noodles/twirl">← Back to Twirl</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <span className="eyebrow">Twirl</span>
      <h1>{story.title}</h1>
      <p style={{ fontSize: 17, opacity: 0.8 }}>{story.dek}</p>
      <div className="prose" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 620 }}>
        {story.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {(story.relatedDishIds || story.relatedNoodleTypeIds) && (
        <>
          <div className="section-heading">
            <h2>Related</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {story.relatedDishIds?.map((id) => {
              const d = getDish(id);
              return d ? <Link key={id} to={`/noodles/encyclopedia/${d.id}`} className="chip">{d.name}</Link> : null;
            })}
            {story.relatedNoodleTypeIds?.map((id) => {
              const t = getNoodleType(id);
              return t ? <Link key={id} to={`/noodles/encyclopedia/type/${t.id}`} className="chip chip-brass">{t.name}</Link> : null;
            })}
          </div>
        </>
      )}
    </div>
  );
}
