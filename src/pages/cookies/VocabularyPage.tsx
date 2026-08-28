import { useDocumentTitle } from '../../lib/useDocumentTitle'
import vocabularyJson from '../../data/cookies/vocabulary.json'
import type { VocabularyTerm } from '../../types/cookies/trails'
import { PageHeroBand } from '../../components/cookies/PageHeroBand'
import { getSceneImage } from '../../lib/cookies/images'

const VOCABULARY = vocabularyJson as VocabularyTerm[]

export function VocabularyPage() {
  useDocumentTitle('Cookie Vocabulary')
  return (
    <main className="page-container">
      <PageHeroBand
        image={getSceneImage('scene_baking_tray')}
        eyebrow="Crumb"
        title="Cookie Vocabulary"
        description="The terms bakers actually use, defined plainly."
      />
      <dl className="vocabulary-list">
        {VOCABULARY.map((entry) => (
          <div className="vocabulary-item" key={entry.term}>
            <dt>{entry.term}</dt>
            <dd>{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
