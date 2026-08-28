import { Link } from 'react-router-dom';
import { labs } from '../../data/noodles/workshop';
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
    <div className="page-container">
      <span className="eyebrow">Workshop</span>
      <h1>The Noodle Workshop</h1>
      <p className="prose" style={{ maxWidth: 560 }}>
        Deterministic, structured lessons — no calculators, no AI chatbot. Pick a described option
        and see what it actually does to the noodle.
      </p>

      {GROUPS.map((group) => {
        const groupLabs = labs.filter((l) => l.group === group.id);
        if (groupLabs.length === 0) return null;
        return (
          <div key={group.id}>
            <div className="section-heading">
              <h2>{group.title}</h2>
            </div>
            <div className="lab-list">
              {groupLabs.map((lab) => (
                <Link key={lab.slug} to={`/noodles/workshop/lab/${lab.slug}`} className="lab-item">
                  <h3 style={{ marginBottom: 3 }}>{lab.title}</h3>
                  <p style={{ fontSize: 13.5, opacity: 0.75, margin: 0 }}>{lab.summary}</p>
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
    </div>
  );
}
