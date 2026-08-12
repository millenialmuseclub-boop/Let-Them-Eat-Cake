import { useColorScheme } from 'react-native'
import { darkColors, lightColors, type ThemeColors } from './colors'

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
}

export const type = {
  display: 34,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  small: 14,
  tiny: 12,
}

export interface Theme {
  colors: ThemeColors
  spacing: typeof spacing
  radius: typeof radius
  type: typeof type
  dark: boolean
}

export function useTheme(): Theme {
  const scheme = useColorScheme()
  const dark = scheme === 'dark'
  return {
    colors: dark ? darkColors : lightColors,
    spacing,
    radius,
    type,
    dark,
  }
}
