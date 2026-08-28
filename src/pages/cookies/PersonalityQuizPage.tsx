import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import { PERSONALITY_QUIZ } from '../../lib/cookies/data'
import { tallyQuiz } from '../../lib/cookies/personalityQuiz'
import { CookieHeroImage } from '../../components/cookies/CookieHeroImage'
import { getCookie } from '../../lib/cookies/data'

export function PersonalityQuizPage() {
  useDocumentTitle('Cookie Personality Quiz')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = PERSONALITY_QUIZ.every((q) => answers[q.id])
  const result = submitted ? tallyQuiz(answers) : undefined
  const resultCookie = result ? getCookie(result.cookieId) : undefined

  if (submitted && result && resultCookie) {
    return (
      <main className="page-container quiz-result" aria-live="polite">
        <h1>You're a {result.title}</h1>
        <CookieHeroImage cookieId={resultCookie.id} name={resultCookie.name} />
        <h2>{resultCookie.name}</h2>
        <p>{result.description}</p>
        <p className="quiz-why-it-fits">{result.whyItFits}</p>
        <div className="quiz-result-actions">
          <Link to={`/cookies/encyclopedia/${resultCookie.id}`} className="button-primary">See the full profile</Link>
          <button type="button" className="button-secondary" onClick={() => { setSubmitted(false); setAnswers({}) }}>
            Take the quiz again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="page-container quiz-page">
      <h1>Cookie Personality Quiz</h1>
      <p>Answer six quick questions to find the cookie that matches your personality.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        {PERSONALITY_QUIZ.map((question) => (
          <fieldset className="quiz-question" key={question.id}>
            <legend>{question.question}</legend>
            {question.options.map((option) => (
              <label className="quiz-option" key={option.id}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        ))}
        <button type="submit" className="button-primary" disabled={!allAnswered}>
          See my result
        </button>
      </form>
    </main>
  )
}
