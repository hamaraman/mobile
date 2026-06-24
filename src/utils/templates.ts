export type TemplateKey = 'ivory' | 'blush' | 'sage' | 'blue';

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
];

export function getTemplate(key?: TemplateKey): Template {
  return TEMPLATES.find(t => t.key === key) ?? TEMPLATES[0];
}
