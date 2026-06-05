export const SUPPORTED_LOCALES = ['vi', 'en', 'ja'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const SUPPORTED_CURRENCIES = ['VND', 'USD'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const LANGUAGES: { code: SupportedLocale; name: string; flag: string }[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export const CURRENCIES: { code: SupportedCurrency; symbol: string; rate: number }[] = [
  { code: 'VND', symbol: '₫', rate: 25000 },
  { code: 'USD', symbol: '$', rate: 1 },
];
