import type { TemplateKey } from '../utils/templates';
import type { DesignStyle } from '../utils/design-themes';

export type { TemplateKey };
export type { Template } from '../utils/templates';
export type { DesignStyle };

export type Person = {
  name: string;
  phoneNumber: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export type WeddingData = {
  groom: Person;
  bride: Person;
  groomParents: {
    father?: Person;
    mother?: Person;
  };
  brideParents: {
    father?: Person;
    mother?: Person;
  };
  weddingDate: string;
  weddingTime: string;
  location: {
    name: string;
    address: string;
    detailAddress?: string;
    lat?: number;
    lng?: number;
  };
  greeting: {
    title: string;
    content: string;
  };
  galleryImages: string[];
  template?: TemplateKey;
  designStyle?: DesignStyle;
}
