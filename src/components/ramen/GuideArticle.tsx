import type { Guide } from '../../types/ramen/slurp'
import './GuideArticle.css'

/** One reusable article renderer for every Culture Guide (Ramen Shop 101 / Ordering / How to Eat
    Ramen, master spec §23) instead of three separate page implementations -- content lives in
    data/guides.json, this just renders whatever Guide it's given. */
export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <div className="guide-article">
      {guide.sections.map((section) => (
        <section key={section.heading} className="card guide-section">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {section.tips && (
            <ul className="guide-tips">
              {section.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
