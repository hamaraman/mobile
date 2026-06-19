export type TemplateKey = 'minimal' | 'classic' | 'modern' | 'romantic' | 'natural';

export interface Template {
  key: TemplateKey;
  name: string;
  description: string;
  accent: string;
  primary: string;
  secondary: string;
  mainBg: string;
  sectionBg: string;
  pageBg: string;
  cardBg: string;
}

export const TEMPLATES: Template[] = [
  {
    key: 'minimal',
    name: '미니멀',
    description: '깔끔한 화이트',
    accent: '#B08E8E',
    primary: '#5D5D5D',
    secondary: '#8E8E8E',
    mainBg: '#FDFBF7',
    sectionBg: '#FAF9F7',
    pageBg: '#FFFFFF',
    cardBg: '#FFFFFF',
  },
  {
    key: 'classic',
    name: '클래식',
    description: '아이보리 골드',
    accent: '#BF9A4A',
    primary: '#4A3728',
    secondary: '#7A6555',
    mainBg: '#FAF3E0',
    sectionBg: '#F5EBD0',
    pageBg: '#FAF3E0',
    cardBg: '#FFF8EC',
  },
  {
    key: 'modern',
    name: '모던',
    description: '쿨한 블루 그레이',
    accent: '#4A6FA5',
    primary: '#1E2D40',
    secondary: '#4A6080',
    mainBg: '#EEF3F8',
    sectionBg: '#E4EBF5',
    pageBg: '#F5F8FC',
    cardBg: '#FFFFFF',
  },
  {
    key: 'romantic',
    name: '로맨틱',
    description: '소프트 블러쉬',
    accent: '#C4687A',
    primary: '#5C2D3E',
    secondary: '#9B6070',
    mainBg: '#FFF5F7',
    sectionBg: '#FDEEF1',
    pageBg: '#FFF8FA',
    cardBg: '#FFFFFF',
  },
  {
    key: 'natural',
    name: '내추럴',
    description: '세이지 그린',
    accent: '#5D8A6A',
    primary: '#2D4A35',
    secondary: '#5B7A63',
    mainBg: '#F2F7F4',
    sectionBg: '#E8F2EB',
    pageBg: '#F5FAF6',
    cardBg: '#FFFFFF',
  },
];

export function getTemplate(key?: TemplateKey): Template {
  return TEMPLATES.find(t => t.key === key) ?? TEMPLATES[0];
}
