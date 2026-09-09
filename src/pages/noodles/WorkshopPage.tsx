import { Link } from 'react-router-dom';
import { labs } from '../../data/noodles/workshop';
import { PhotoFrame } from '../../components/noodles/PhotoFrame';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

const GROUPS: { id: (typeof labs)[number]['group']; title: string }[] = [
  { id: 'understand', title: 'Understand the Noodle' },
  { id: 'foundations', title: 'Master the Foundations' },
  { id: 'form', title: 'Master the Form' },
  { id: 'bowl', title: 'Master the Bowl' },
];

export function WorkshopPage() {
  useDocumentTitle('Workshop');
  return (
    <main className="page-container noodle-workshop">
      <div className="hero-bleed">
        <PhotoFrame subjectId="lanzhou-lamian" fallbackLabel="The Noodle Workshop" variant="hero" />
        <div className="hero-bleed__scrim" />
        <div className="hero-bleed__content">
          <span className="eyebrow">Workshop</span>
          <h1>The Noodle Workshop</h1>
        </div>
      </div>
      <p className="prose" style={{ maxWidth: 560 }}>
        Find your next kitchen skill: build a better dough, shape it by hand, or bring the whole bowl together.
      </p>

      {GROUPS.map((group) => {
        const groupLabs = labs.filter((l) => l.group === group.id);
        if (groupLabs.length === 0) return null;
        return (
          <div key={group.id}>
            <div className="section-heading">
              <h2>{group.title}</h2>
            </div>
            <div className="noodle-workshop-grid">
              {groupLabs.map((lab) => (
                <Link key={lab.slug} to={`/noodles/workshop/lab/${lab.slug}`} className="noodle-workshop-card">
                  <div className="noodle-workshop-photo"><PhotoFrame subjectId={lab.relatedDishIds?.[0] ?? lab.slug} fallbackLabel={lab.title} variant="tile" /></div>
                  <div className="noodle-workshop-copy">
                    <h3>{lab.title}</h3>
                    <p>{lab.summary}</p>
                    <span>Explore the lesson →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <hr className="divider" />
      <div className="section-heading">
        <h2>Solve a Problem</h2>
        <Link to="/noodles/workshop/troubleshooter">Open the Troubleshooter →</Link>
      </div>
    </main>
  );
}
