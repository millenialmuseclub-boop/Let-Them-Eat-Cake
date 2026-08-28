import { useState } from 'react'
import { Link } from 'react-router-dom'
import { personalityQuizQuestions, ramen } from '../../lib/ramen/data'
import { scoreQuiz, getPersonality } from '../../lib/ramen/personalityQuiz'
import { RamenThumbnail } from '../../components/ramen/RamenThumbnail'
import { FlavorProfileBars } from '../../components/ramen/FlavorProfileBars'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import '../../components/ramen/FlavorProfileBars.css'
import './PersonalityQuizPage.css'

// One-question-at-a-time flow, distinct from Sommelier FIND both in tone and mechanism (see
// lib/personalityQuiz.ts) -- no points/badges/accounts, just a single playful result screen.
export function PersonalityQuizPage() {
  useDocumentTitle('Ramen Personality Quiz | Let Them Eat Ramen')

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  function selectOption(ramenId: string) {
    const next = [...answers, ramenId]
    setAnswers(next)
    setStep(step + 1)
  }

  function restart() {
    setAnswers([])
    setStep(0)
  }

  if (step < personalityQuizQuestions.length) {
    const question = personalityQuizQuestions[step]
    return (
      <main className="page">
        <h1>Ramen Personality Quiz</h1>
        <p className="quiz-progress">
          Question {step + 1} of {personalityQuizQuestions.length}
        </p>

        <div className="card quiz-question-card">
          <h2>{question.question}</h2>
          <div className="quiz-options">
            {question.options.map((option) => (
              <button key={option.id} className="quiz-option" onClick={() => selectOption(option.ramenId)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  const resultRamenId = scoreQuiz(answers)
  const personality = getPersonality(resultRamenId)
  const candidate = ramen.find((r) => r.id === resultRamenId)

  if (!personality || !candidate) {
    return (
      <main className="page">
        <h1>Something went wrong</h1>
        <button className="btn" onClick={restart}>
          Try Again
        </button>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>Your Ramen Personality</h1>

      <div className="card quiz-result-card">
        <RamenThumbnail ramenId={candidate.id} variant="hero" alt={personality.title} />
        <h2>{personality.title}</h2>
        <p>{personality.description}</p>
        <p className="quiz-why-it-fits">
          <strong>Why it fits:</strong> {personality.whyItFits}
        </p>
        <FlavorProfileBars profile={candidate.flavorProfile} />
        <div className="quiz-result-actions">
          <Link to={`/ramen/ramen/${candidate.id}`} className="encyclopedia-link">
            View full encyclopedia entry →
          </Link>
          <button className="btn btn-secondary" onClick={restart}>
            Take the Quiz Again
          </button>
        </div>
      </div>
    </main>
  )
}
