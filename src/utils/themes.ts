import type { ThemeKey } from '../types/wedding';

export interface Theme {
  key: ThemeKey;
  label: string;
  accent: string;
}

export const THEMES: Theme[] = [
  { key: 'rose', label: '로즈', accent: '#B08E8E' },
  { key: 'blush', label: '블러쉬', accent: '#C49090' },
  { key: 'sage', label: '세이지', accent: '#7A9E8A' },
  { key: 'navy', label: '블루', accent: '#7A8EA8' },
  { key: 'gold', label: '골드', accent: '#A8976B' },
];

export function getThemeAccent(key?: ThemeKey): string {
  return THEMES.find(t => t.key === key)?.accent ?? THEMES[0].accent;
}
