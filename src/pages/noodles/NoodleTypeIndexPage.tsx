import { Link } from 'react-router-dom';
import { noodleTypes } from '../../lib/noodles/data';
import { PhotoFrame } from '../../components/noodles/PhotoFrame';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

export function NoodleTypeIndexPage() {
  useDocumentTitle('Noodle Types');
  return (
    <div className="page-container">
      <span className="eyebrow">Noodle Types</span>
      <h1>What's the Noodle, Actually?</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        A noodle type is the physical product — its base, its form, how it's made. Many dishes
        across different cuisines can share the same, or a closely related, noodle type.
      </p>
      <div className="grid">
        {noodleTypes.map((type) => (
          <Link key={type.id} to={`/noodles/encyclopedia/type/${type.id}`} className="tile">
            <PhotoFrame subjectId={type.id} fallbackLabel={type.name} variant="tile" />
            <div className="tile__scrim" />
            <div className="tile__label">
              <span className="kicker">{type.base.replace('-', ' ')}</span>
              <strong>{type.name}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
