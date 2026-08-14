import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { CakeProfile } from '../types/cake'
import type { MoodTag } from '../types/persona'
import type { CakePersonality, FlavorPull, QuizAnswers } from '../types/personaMatch'
import { AESTHETIC_OPTIONS, MOOD_OPTIONS } from '../lib/persona'
import { matchPersonality, matchRecommendedCakes, personalityResult, FLAVOR_PULL_AXIS } from '../lib/personaMatch'
import { getCakePersonality, cakes } from '../lib/data'
import { getFirstPhotographedCakeId } from '../lib/images'
import { getPersonalityImage } from '../lib/personalityImages'
import { getSceneImage } from '../lib/sceneImages'
import { getCountryFlag } from '../lib/countryFlags'
import { FlavorProfileBars } from '../components/FlavorProfileBars'
import { CakeHeroImage } from '../components/CakeHeroImage'
import { DiscoverFeatureCard } from '../components/DiscoverFeatureCard'
import { PersonaShareCard } from '../components/PersonaShareCard'
import { SaveButton } from '../components/SaveButton'
import { hapticSuccess } from '../lib/haptics'
import { useFocusOnMount } from '../lib/useFocusOnMount'
import './PersonaMatchPage.css'

const FLAVOR_PULL_OPTIONS: { value: FlavorPull; label: string; hint: string }[] = [
  { value: 'bright-tart', label: 'Bright & Tart', hint: 'Citrus, berries, anything that wakes your mouth up' },
  { value: 'rich-buttery', label: 'Rich & Buttery', hint: 'Butter, cream, the stuff that feels indulgent' },
  { value: 'bold-intense', label: 'Bold & Intense', hint: 'Deep chocolate, espresso, flavors that hit hard' },
  { value: 'simply-sweet', label: 'Simply Sweet', hint: 'Classic, straightforward, no surprises needed' },
]

const TEXTURE_OPTIONS: { value: CakeProfile['texture']; label: string; hint: string }[] = [
  { value: 'sponge', label: 'Sponge', hint: 'Light, airy, a little bounce' },
  { value: 'dense', label: 'Dense', hint: 'Substantial, a real bite' },
  { value: 'creamy', label: 'Creamy', hint: 'Soft, smooth, melts in' },
  { value: 'crumbly', label: 'Crumbly', hint: 'Layered, delicate, a little messy' },
]

const MOOD_DESCRIPTIONS: Record<MoodTag, string> = {
  'breakup-catharsis': 'For processing feelings',
  'cozy-sunday': 'Slow, soft, and comforting',
  'pure-hype': 'Big energy, big flavor',
  homesick: 'Familiar, comforting flavors',
  celebration: 'Made for the occasion',
  'lazy-weekend': 'No plans, just cake',
}

const AESTHETIC_DESCRIPTIONS: Record<string, string> = {
  'coquette-vintage': 'Delicate and romantic',
  'dark-academia': 'Moody and dramatic',
  'minimalist-k-style': 'Clean and understated',
  cottagecore: 'Rustic and floral',
  'y2k-maximalist': 'Bold, bright, maximal',
}

/** One representative, ideally-photographed cake per flavor-pull/texture option -- same computed pattern Sommelier's discovery cards already use. */
const FLAVOR_PULL_REP_CAKE: Partial<Record<FlavorPull, string>> = Object.fromEntries(
  FLAVOR_PULL_OPTIONS.map((opt) => {
    const axis = FLAVOR_PULL_AXIS[opt.value]
    const sorted = [...cakes].sort((a, b) => b.flavorProfile[axis] - a.flavorProfile[axis])
    return [opt.value, getFirstPhotographedCakeId(sorted.map((c) => c.id))]
  }),
)

const TEXTURE_REP_CAKE: Partial<Record<CakeProfile['texture'], string>> = Object.fromEntries(
  TEXTURE_OPTIONS.map((opt) => [opt.value, getFirstPhotographedCakeId(cakes.filter((c) => c.texture === opt.value).map((c) => c.id))]),
)

type Step = 0 | 1 | 2 | 3

const STEP_QUESTIONS: Record<Step, string> = {
  0: 'What kind of mood are you baking — or eating — for?',
  1: 'Which flavors pull you in first?',
  2: 'What texture makes a cake irresistible to you?',
  3: "What's your cake aesthetic?",
}

function ResultView({
  personality,
  recommendedCakes,
  deepLinkPath,
  onRetake,
}: {
  personality: CakePersonality
  recommendedCakes: CakeProfile[]
  deepLinkPath: string
  onRetake?: () => void
}) {
  const image = getPersonalityImage(personality.id)
  const flag = personality.originCountry ? getCountryFlag(personality.originCountry) : undefined
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  return (
    <div className="persona-result ltec-reveal">
      <div className="persona-result-hero">
        {image && <img src={image.url} alt="" className="persona-result-hero-image" />}
        <div
          className={image ? 'persona-result-hero-content' : 'persona-result-hero-content no-image'}
          style={{ background: image ? undefined : personality.colorHex }}
        >
          <p className="persona-result-eyebrow">Your cake personality is</p>
          <h1 ref={headingRef} tabIndex={-1}>
            {personality.name}
            {flag && <span className="persona-result-flag"> {flag}</span>}
          </h1>
          <p className="persona-result-title">{personality.personalityTitle}</p>
        </div>
      </div>

      <blockquote className="persona-result-quote">{personality.description}</blockquote>

      <SaveButton type="personality" id={personality.id} />

      <h2 className="persona-section-heading">The Story</h2>
      <p>{personality.culturalStory}</p>

      <h2 className="persona-section-heading">Flavor Notes</h2>
      <div className="card persona-result-flavor-card">
        <FlavorProfileBars profile={personality.targetFlavorProfile} colorVar={personality.colorHex} />
        <span className="tag persona-result-texture-tag">{personality.targetTexture}</span>
      </div>

      <h2 className="persona-section-heading">Cakes For You</h2>
      <div className="persona-results">
        {recommendedCakes.map((cake) => (
          <Link key={cake.id} to={`/cake/${cake.id}`} className="card persona-result-card">
            <CakeHeroImage cakeId={cake.id} variant="thumbnail" alt={cake.name} />
            <h3>{cake.name}</h3>
            <p>{cake.description}</p>
            <p className="persona-notes">Notes: {cake.flavorNotes.join(', ')}</p>
          </Link>
        ))}
      </div>

      <h2 className="persona-section-heading">Share It</h2>
      <PersonaShareCard personality={personality} deepLinkPath={deepLinkPath} />

      {onRetake ? (
        <button className="btn btn-secondary" onClick={onRetake}>
          Retake the quiz
        </button>
      ) : (
        <Link to="/persona-match" className="btn btn-secondary">
          Take the quiz yourself
        </Link>
      )}
    </div>
  )
}

export function PersonaMatchPage() {
  const [searchParams] = useSearchParams()
  const deepLinkPersonality = searchParams.get('personality')

  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})

  const linkedPersonality = deepLinkPersonality ? getCakePersonality(deepLinkPersonality) : undefined

  const quizResult = useMemo(() => {
    if (step < 3 || !isComplete(answers)) return undefined
    return {
      match: matchPersonality(answers),
      recommendedCakes: matchRecommendedCakes(answers, 3),
    }
  }, [step, answers])

  if (linkedPersonality) {
    return (
      <main className="page persona-page">
        <ResultView
          personality={linkedPersonality}
          recommendedCakes={personalityResult(linkedPersonality)}
          deepLinkPath={`/persona-match?personality=${linkedPersonality.id}`}
        />
      </main>
    )
  }

  function resetQuiz() {
    setStep(0)
    setAnswers({})
  }

  function choose<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev))
    if (isComplete({ ...answers, [key]: value })) hapticSuccess()
  }

  if (quizResult) {
    return (
      <main className="page persona-page">
        <ResultView
          personality={quizResult.match.item}
          recommendedCakes={quizResult.recommendedCakes}
          deepLinkPath={`/persona-match?personality=${quizResult.match.item.id}`}
          onRetake={resetQuiz}
        />
      </main>
    )
  }

  return (
    <main className="page persona-page">
      <h1>Cake Personality Quiz</h1>
      <p>Answer four quick questions and we'll match you to a cake personality — plus real cakes to try.</p>

      <p className="persona-step-indicator" role="status" aria-live="polite">
        Step {step + 1} of 4
      </p>
      <h2 className="persona-quiz-question">{STEP_QUESTIONS[step]}</h2>

      {step === 0 && (
        <div className="discover-feature-grid ltec-reveal">
          {MOOD_OPTIONS.map((opt) => {
            const scene = getSceneImage(`mood-${opt.value}`)
            return (
              <DiscoverFeatureCard
                key={opt.value}
                onClick={() => choose('mood', opt.value)}
                title={opt.label}
                description={MOOD_DESCRIPTIONS[opt.value]}
                cta="Choose →"
                imageUrl={scene?.url}
                imageAlt={opt.label}
                photographer={scene?.photographer}
                photographerUrl={scene?.photographerUrl}
                unsplashUrl={scene?.unsplashUrl}
              />
            )
          })}
        </div>
      )}

      {step === 1 && (
        <div className="discover-feature-grid ltec-reveal">
          {FLAVOR_PULL_OPTIONS.map((opt) => (
            <DiscoverFeatureCard
              key={opt.value}
              onClick={() => choose('flavorPull', opt.value)}
              title={opt.label}
              description={opt.hint}
              cta="Choose →"
              cakeId={FLAVOR_PULL_REP_CAKE[opt.value]}
            />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="discover-feature-grid ltec-reveal">
          {TEXTURE_OPTIONS.map((opt) => (
            <DiscoverFeatureCard
              key={opt.value}
              onClick={() => choose('texture', opt.value)}
              title={opt.label}
              description={opt.hint}
              cta="Choose →"
              cakeId={TEXTURE_REP_CAKE[opt.value]}
            />
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="discover-feature-grid ltec-reveal">
          {AESTHETIC_OPTIONS.map((opt) => {
            const scene = getSceneImage(`aesthetic-${opt.value}`)
            return (
              <DiscoverFeatureCard
                key={opt.value}
                onClick={() => choose('aesthetic', opt.value)}
                title={opt.label}
                description={AESTHETIC_DESCRIPTIONS[opt.value]}
                cta="Choose →"
                imageUrl={scene?.url}
                imageAlt={opt.label}
                photographer={scene?.photographer}
                photographerUrl={scene?.photographerUrl}
                unsplashUrl={scene?.unsplashUrl}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}

function isComplete(answers: Partial<QuizAnswers>): answers is QuizAnswers {
  return !!answers.mood && !!answers.flavorPull && !!answers.texture && !!answers.aesthetic
}
