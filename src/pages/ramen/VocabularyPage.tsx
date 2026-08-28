import { vocabulary } from '../../lib/ramen/data'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './LabPage.css'
import './VocabularyPage.css'

export function VocabularyPage() {
  useDocumentTitle('Ramen Vocabulary | Let Them Eat')

  const scene = getSceneImage('vocabulary')

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="Wooden chopsticks resting on a dark ramen bowl" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Ramen Vocabulary</h1>
      <p>The core terms you'll actually hear and see at a ramen shop, browsable in one place.</p>

      <div className="vocabulary-grid">
        {vocabulary.map((entry) => (
          <div key={entry.id} className="card vocabulary-card">
            <h3>
              {entry.term}
              {entry.japaneseName && <span className="vocabulary-japanese"> {entry.japaneseName}</span>}
            </h3>
            {entry.romanization && <p className="vocabulary-romanization">{entry.romanization}</p>}
            <p>{entry.definition}</p>
            <span className="tag">{entry.relatedConcept}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
