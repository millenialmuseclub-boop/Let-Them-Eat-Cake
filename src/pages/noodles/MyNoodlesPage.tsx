import { Link } from 'react-router-dom';
import { useMyNoodles } from '../../lib/noodles/useMyNoodles';
import { getDish } from '../../lib/noodles/data';
import { DishTile } from '../../components/noodles/DishTile';
import { getImageFor } from '../../data/noodles/images';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import type { MyNoodlesState } from '../../types/noodles/myNoodles';

const SECTIONS: { state: MyNoodlesState; label: string }[] = [
  { state: 'want-to-try', label: 'Want to Try' },
  { state: 'tried', label: 'Tried' },
  { state: 'favorite', label: 'Favorites' },
];

export function MyNoodlesPage() {
  useDocumentTitle('My Noodles');
  const entries = useMyNoodles();
  const isEmpty = entries.length === 0;
  const heroImage = getImageFor('bun-cha');

  return (
    <div className="page-container">
      {heroImage && <img src={heroImage.src} alt={heroImage.alt} loading="lazy" className="photo-medium" />}
      <span className="eyebrow">My Noodles</span>
      <h1>My Noodles</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        Local and private — nothing here leaves your device. No account required.
      </p>

      {isEmpty ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <p className="prose" style={{ margin: '0 0 16px' }}>
            Your shelf is empty. Save a dish you want to try, have made, or love, and it'll show
            up here.
          </p>
          <Link to="/noodles/encyclopedia" className="btn btn-primary">
            Browse the Encyclopedia
          </Link>
        </div>
      ) : (
        SECTIONS.map((section) => {
          const sectionEntries = entries.filter((e) => e.states.includes(section.state));
          if (sectionEntries.length === 0) return null;
          return (
            <div key={section.state}>
              <div className="section-heading">
                <h2>{section.label}</h2>
              </div>
              <div className="grid">
                {sectionEntries.map((entry) => {
                  const dish = getDish(entry.dishId);
                  return dish ? <DishTile key={entry.dishId} dish={dish} /> : null;
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
