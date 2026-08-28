import { useState } from 'react'
import { useDocumentTitle } from '../../lib/useDocumentTitle'
import cookie101QuizJson from '../../data/cookies/cookie101Quiz.json'
import type { KnowledgeQuizQuestion } from '../../types/cookies/knowledgeQuiz'

const QUESTIONS = cookie101QuizJson as KnowledgeQuizQuestion[]

export function Cookie101QuizPage() {
  useDocumentTitle('Cookie 101 Quiz')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = QUESTIONS.filter((q) => answers[q.id] === q.correctIndex).length

  return (
    <main className="page-container">
      <h1>Cookie 101 Quiz</h1>
      {submitted && (
        <p aria-live="polite" className="quiz-score">You scored {score} out of {QUESTIONS.length}.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        {QUESTIONS.map((question) => (
          <fieldset className="quiz-question" key={question.id}>
            <legend>{question.question}</legend>
            {question.options.map((option, i) => (
              <label className="quiz-option" key={option}>
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[question.id] === i}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: i }))}
                />
                {option}
              </label>
            ))}
            {submitted && (
              <p className="quiz-explanation">
                {answers[question.id] === question.correctIndex ? 'Correct. ' : 'Not quite. '}
                {question.explanation}
              </p>
            )}
          </fieldset>
        ))}
        <button type="submit" className="button-primary">Check my answers</button>
      </form>
    </main>
  )
}
