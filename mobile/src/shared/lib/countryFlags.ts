const COUNTRY_FLAGS: Record<string, string> = {
  France: '🇫🇷',
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Germany: '🇩🇪',
  'Australia / New Zealand': '🇦🇺🇳🇿',
}

export function getCountryFlag(country: string): string | undefined {
  return COUNTRY_FLAGS[country]
}
