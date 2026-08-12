import type { ReactNode } from 'react'
import { Text, type TextProps } from 'react-native'
import { useTheme } from '../theme/useTheme'

interface Props extends TextProps {
  children: ReactNode
}

export function Eyebrow({ children, style, ...rest }: Props) {
  const theme = useTheme()
  return (
    <Text
      style={[{ color: theme.colors.raspberry, fontSize: theme.type.tiny, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }, style]}
      {...rest}
    >
      {children}
    </Text>
  )
}

export function Title({ children, style, ...rest }: Props) {
  const theme = useTheme()
  return (
    <Text style={[{ color: theme.colors.cocoaStrong, fontSize: theme.type.h1, fontWeight: '700', marginTop: 4 }, style]} {...rest}>
      {children}
    </Text>
  )
}

export function Subtitle({ children, style, ...rest }: Props) {
  const theme = useTheme()
  return (
    <Text style={[{ color: theme.colors.cocoaStrong, fontSize: theme.type.h3, fontWeight: '600' }, style]} {...rest}>
      {children}
    </Text>
  )
}

export function Body({ children, style, ...rest }: Props) {
  const theme = useTheme()
  return (
    <Text style={[{ color: theme.colors.text, fontSize: theme.type.body, lineHeight: 22 }, style]} {...rest}>
      {children}
    </Text>
  )
}

export function Caption({ children, style, ...rest }: Props) {
  const theme = useTheme()
  return (
    <Text style={[{ color: theme.colors.text + '99', fontSize: theme.type.small }, style]} {...rest}>
      {children}
    </Text>
  )
}
