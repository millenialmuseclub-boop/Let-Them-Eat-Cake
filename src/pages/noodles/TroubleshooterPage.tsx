import { useState } from 'react';
import { Link } from 'react-router-dom';
import { troubleshooterProblems } from '../../data/noodles/workshop';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

/* Flat data-only troubleshooter — zero branching decision-tree code, all logic lives in the
   data. Matches the family pattern (Ramen's getTroubleshooterProblem). */
export function TroubleshooterPage() {
  useDocumentTitle('Troubleshooter');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = troubleshooterProblems.find((p) => p.id === selectedId);

  return (
    <div className="page-container">
      <span className="eyebrow">Workshop</span>
      <h1>Troubleshooter</h1>
      <p className="prose" style={{ maxWidth: 560 }}>What's going wrong?</p>

      <div role="group" aria-label="Choose a problem" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {troubleshooterProblems.map((p) => (
          <button
            key={p.id}
            type="button"
            className="chip"
            aria-pressed={selectedId === p.id}
            onClick={() => setSelectedId(p.id)}
          >
            {p.problem}
          </button>
        ))}
      </div>

      {selected && (
        <div className="card" style={{ marginTop: 20 }} aria-live="polite">
          <h2>{selected.problem}</h2>
          {selected.diagnosticQuestions.length > 0 && (
            <>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Ask yourself:</p>
              <ul style={{ paddingLeft: 18, marginTop: 0 }}>
                {selected.diagnosticQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </>
          )}
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Likely causes:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selected.causes.map((c, i) => (
              <div key={i}>
                <strong>{c.cause}</strong>
                <p style={{ margin: '2px 0 0' }}>{c.correction}</p>
              </div>
            ))}
          </div>
          {selected.relatedLessonSlug && (
            <p style={{ marginTop: 12 }}>
              <Link to={`/noodles/workshop/lab/${selected.relatedLessonSlug}`}>See the related lab →</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
