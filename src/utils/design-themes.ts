export type DesignStyle = 'minimal' | 'classic' | 'romantic' | 'modern';

export interface DesignTheme {
  key: DesignStyle;
  name: string;
  desc: string;
}

export const DESIGN_THEMES: DesignTheme[] = [
  { key: 'minimal',  name: '미니멀',  desc: '여백과 얇은 선' },
  { key: 'classic',  name: '클래식',  desc: '금박·세리프 장식' },
  { key: 'romantic', name: '로맨틱',  desc: '플로럴 일러스트' },
  { key: 'modern',   name: '모던',    desc: '굵은 타이포' },
];
