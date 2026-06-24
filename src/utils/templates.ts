export type TemplateKey =
  | 'ivory' | 'blush' | 'sage' | 'blue'
  | 'mocha' | 'lavender' | 'rosegold' | 'charcoal';

export interface Template {
  key: TemplateKey;
  name: string;
  accent: string;
  primary: string;
  secondary: string;
  mainBg: string;
  sectionBg: string;
  pageBg: string;
  cardBg: string;
  soft: string;
}

export const TEMPLATES: Template[] = [
  {
    key: 'ivory',
    name: '아이보리',
    accent: '#C9A36B',
    primary: '#4A423A',
    secondary: '#9A8F80',
    soft: '#DBC9A8',
    mainBg: '#FBF8F2',
    sectionBg: '#F5EEE1',
    pageBg: '#FBF8F2',
    cardBg: '#F5EEE1',
  },
  {
    key: 'blush',
    name: '블러쉬',
    accent: '#C98A86',
    primary: '#574742',
    secondary: '#A4908A',
    soft: '#E2C4C0',
    mainBg: '#FBF4F2',
    sectionBg: '#F6E7E4',
    pageBg: '#FBF4F2',
    cardBg: '#F6E7E4',
  },
  {
    key: 'sage',
    name: '세이지',
    accent: '#8C9E76',
    primary: '#454B3E',
    secondary: '#8B9380',
    soft: '#CBD6BB',
    mainBg: '#F4F6F0',
    sectionBg: '#E8ECDF',
    pageBg: '#F4F6F0',
    cardBg: '#E8ECDF',
  },
  {
    key: 'blue',
    name: '더스티블루',
    accent: '#7A93AD',
    primary: '#3D4750',
    secondary: '#8893A0',
    soft: '#BFD0DE',
    mainBg: '#F1F5F8',
    sectionBg: '#E2EAF1',
    pageBg: '#F1F5F8',
    cardBg: '#E2EAF1',
  },
  {
    key: 'mocha',
    name: '모카',
    accent: '#A07850',
    primary: '#3D2B1F',
    secondary: '#8C7060',
    soft: '#D4B898',
    mainBg: '#FAF5EF',
    sectionBg: '#F0E6D8',
    pageBg: '#FAF5EF',
    cardBg: '#F0E6D8',
  },
  {
    key: 'lavender',
    name: '라벤더',
    accent: '#9B8EC4',
    primary: '#3D3055',
    secondary: '#9088A8',
    soft: '#CFC8E8',
    mainBg: '#F6F4FB',
    sectionBg: '#EDE9F6',
    pageBg: '#F6F4FB',
    cardBg: '#EDE9F6',
  },
  {
    key: 'rosegold',
    name: '로즈골드',
    accent: '#C4856A',
    primary: '#4A2D28',
    secondary: '#A07060',
    soft: '#E8C4B8',
    mainBg: '#FDF6F3',
    sectionBg: '#F5E8E3',
    pageBg: '#FDF6F3',
    cardBg: '#F5E8E3',
  },
  {
    key: 'charcoal',
    name: '차콜',
    accent: '#8C9898',
    primary: '#1E2428',
    secondary: '#707878',
    soft: '#C0CACA',
    mainBg: '#F4F6F6',
    sectionBg: '#E8ECEC',
    pageBg: '#F4F6F6',
    cardBg: '#E8ECEC',
  },
];

export function getTemplate(key?: TemplateKey): Template {
  return TEMPLATES.find(t => t.key === key) ?? TEMPLATES[0];
}
