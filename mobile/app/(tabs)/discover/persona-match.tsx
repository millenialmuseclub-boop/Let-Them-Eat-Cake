import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { FlavorBars } from '../../../src/components/FlavorBars'
import { Screen } from '../../../src/components/Screen'
import { SaveButton } from '../../../src/components/SaveButton'
import { ShareButton } from '../../../src/components/ShareButton'
import { Body, Eyebrow, Subtitle, Title } from '../../../src/components/Typography'
import { AESTHETIC_OPTIONS, MOOD_OPTIONS } from '../../../src/shared/lib/persona'
import { matchPersonality, personalityResult } from '../../../src/shared/lib/personaMatch'
import type { CakeTexture } from '../../../src/shared/types/cake'
import type { FlavorPull, QuizAnswers } from '../../../src/shared/types/personaMatch'
import { useTheme } from '../../../src/theme/useTheme'

const FLAVOR_PULL_OPTIONS: { value: FlavorPull; label: string }[] = [
  { value: 'bright-tart', label: 'Bright & Tart' },
  { value: 'rich-buttery', label: 'Rich & Buttery' },
  { value: 'bold-intense', label: 'Bold & Intense' },
  { value: 'simply-sweet', label: 'Simply Sweet' },
]

const TEXTURE_OPTIONS: { value: CakeTexture; label: string }[] = [
  { value: 'sponge', label: 'Light Sponge' },
  { value: 'dense', label: 'Dense & Rich' },
  { value: 'creamy', label: 'Creamy' },
  { value: 'crumbly', label: 'Crumbly' },
]

type Step = 'mood' | 'flavorPull' | 'texture' | 'aesthetic' | 'result'

export default function PersonaMatchScreen() {
  const theme = useTheme()
  const [step, setStep] = useState<Step>('mood')
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})

  function pick<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K], next: Step) {
    setAnswers((a) => ({ ...a, [key]: value }))
    setStep(next)
  }

  if (step === 'result' && isComplete(answers)) {
    const match = matchPersonality(answers)
    const relatedCakes = personalityResult(match.item, 3)
    return (
      <Screen>
        <Eyebrow>Your Cake Personality</Eyebrow>
        <Title>{match.item.name}</Title>
        <Body style={{ marginTop: 4, fontStyle: 'italic' }}>{match.item.personalityTitle}</Body>
        <Body style={{ marginTop: 12 }}>{match.item.description}</Body>

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>🍰 Flavor Profile</Subtitle>
        <FlavorBars profile={match.item.targetFlavorProfile} />

        <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>Its Story</Subtitle>
        <Body>{match.item.culturalStory}</Body>

        {relatedCakes.length > 0 && (
          <>
            <Subtitle style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>Cakes Like You</Subtitle>
            {relatedCakes.map((cake) => (
              <Pressable key={cake.id} onPress={() => router.push(`/discover/cake/${cake.id}`)} style={{ paddingVertical: 6 }}>
                <Body style={{ color: theme.colors.raspberry, fontWeight: '600' }}>{cake.name} →</Body>
              </Pressable>
            ))}
          </>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: theme.spacing.lg }}>
          <SaveButton type="personality" id={match.item.id} />
          <ShareButton
            payload={{ text: `My cake personality is ${match.item.name} — ${match.item.personalityTitle} 🎂` }}
            context="persona-match"
          />
        </View>

        <Pressable onPress={() => { setAnswers({}); setStep('mood') }} style={{ marginTop: theme.spacing.lg }}>
          <Body style={{ color: theme.colors.text + '99' }}>Take the quiz again</Body>
        </Pressable>
      </Screen>
    )
  }

  return (
    <Screen>
      <Eyebrow>Cake Personality</Eyebrow>
      {step === 'mood' && (
        <QuizStep title="What's your mood right now?" options={MOOD_OPTIONS} onPick={(v) => pick('mood', v, 'flavorPull')} />
      )}
      {step === 'flavorPull' && (
        <QuizStep title="What flavor are you drawn to?" options={FLAVOR_PULL_OPTIONS} onPick={(v) => pick('flavorPull', v, 'texture')} />
      )}
      {step === 'texture' && (
        <QuizStep title="What texture speaks to you?" options={TEXTURE_OPTIONS} onPick={(v) => pick('texture', v, 'aesthetic')} />
      )}
      {step === 'aesthetic' && (
        <QuizStep title="Pick your aesthetic" options={AESTHETIC_OPTIONS} onPick={(v) => pick('aesthetic', v, 'result')} />
      )}
    </Screen>
  )
}

function isComplete(a: Partial<QuizAnswers>): a is QuizAnswers {
  return Boolean(a.mood && a.flavorPull && a.texture && a.aesthetic)
}

function QuizStep<T extends string>({ title, options, onPick }: { title: string; options: { value: T; label: string }[]; onPick: (v: T) => void }) {
  const theme = useTheme()
  return (
    <View>
      <Title style={{ marginBottom: theme.spacing.md }}>{title}</Title>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onPick(opt.value)}
          style={{
            padding: 16,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.bgCard,
            marginBottom: 10,
          }}
        >
          <Body style={{ fontWeight: '600' }}>{opt.label}</Body>
        </Pressable>
      ))}
    </View>
  )
}
