import { useState } from 'react'
import { ramen101Quiz } from '../../lib/ramen/data'
import { getSceneImage } from '../../lib/ramen/sceneImages'
import { displayImageUrl } from '../../lib/ramen/images'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import './Ramen101QuizPage.css'

// Lightweight knowledge quiz, distinct from the Personality Quiz (Main) and Sommelier FIND --
// immediate per-question feedback, an in-session (not persisted) correct-count at the end, and
// deliberately no points/streaks/badges/leaderboards (Phase 7 §5).
export function Ramen101QuizPage() {
  useDocumentTitle('Ramen 101 Quiz | Let Them Eat')

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const question = ramen101Quiz[step]
  const isDone = step >= ramen101Quiz.length
  const scene = getSceneImage('main')

  function pick(index: number) {
    if (selected !== null) return
    setSelected(index)
    if (index === question.correctIndex) setCorrectCount((c) => c + 1)
  }

  function next() {
    setSelected(null)
    setStep((s) => s + 1)
  }

  function restart() {
    setSelected(null)
    setStep(0)
    setCorrectCount(0)
  }

  if (isDone) {
    return (
      <main className="page">
        {scene && (
          <div className="lab-hero-image">
            <img src={displayImageUrl(scene, 'hero')} alt="" loading="lazy" />
            <span className="lab-hero-credit">
              {scene.photographer} / {scene.source}
            </span>
          </div>
        )}
        <h1>Ramen 101 Quiz</h1>
        <div className="card ramen101-result-card">
          <h2>
            You got {correctCount} of {ramen101Quiz.length}
          </h2>
          <p>No score is saved -- take it again any time.</p>
          <button className="btn" onClick={restart}>
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      {scene && (
        <div className="lab-hero-image">
          <img src={displayImageUrl(scene, 'hero')} alt="" loading="lazy" />
          <span className="lab-hero-credit">
            {scene.photographer} / {scene.source}
          </span>
        </div>
      )}
      <h1>Ramen 101 Quiz</h1>
      <p className="quiz-progress">
        Question {step + 1} of {ramen101Quiz.length}
      </p>

      <div className="card ramen101-question-card">
        <h2>{question.question}</h2>
        <div className="ramen101-choices" role="group" aria-label="Answer choices">
          {question.choices.map((choice, i) => {
            let className = 'ramen101-choice'
            let marker = ''
            if (selected !== null) {
              if (i === question.correctIndex) {
                className += ' correct'
                marker = ' — Correct answer'
              } else if (i === selected) {
                className += ' incorrect'
                marker = ' — Your answer'
              }
            }
            return (
              <button key={i} className={className} onClick={() => pick(i)} disabled={selected !== null}>
                {choice}
                {marker && <span className="ramen101-choice-marker">{marker}</span>}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="ramen101-feedback" aria-live="polite">
            <p>{selected === question.correctIndex ? 'Correct!' : 'Not quite.'}</p>
            <p>{question.explanation}</p>
            <button className="btn" onClick={next}>
              {step + 1 < ramen101Quiz.length ? 'Next Question →' : 'See Results →'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
