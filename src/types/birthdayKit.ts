import { Language } from '../types';

export type BirthdayProductId =
  | 'poster'
  | 'invitations'
  | 'labels'
  | 'cupcake_toppers'
  | 'cake_topper'
  | 'thank_you_cards'
  | 'photo_booth'
  | 'decorations';

export type BirthdayThemeId =
  | 'magical_unicorn'
  | 'dinosaur_adventure'
  | 'space_explorer'
  | 'princess_garden'
  | 'jungle_safari'
  | 'ocean_adventure'
  | 'teddy_bear_party'
  | 'rainbow_birthday'
  | 'cute_animals'
  | 'football_party'
  | 'construction_party'
  | 'candy_cupcake';

export interface BirthdayThemeDefinition {
  id: BirthdayThemeId;
  name: {
    fr: string;
    ar: string;
    en: string;
  };
  subtitle: {
    fr: string;
    ar: string;
    en: string;
  };
  badgeColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  illustrationKey: string;
  emoji: string;
}

export interface BirthdayKitData {
  childName: string;
  age: number;
  showAge: boolean;
  date: string;
  time: string;
  location: string;
  contact: string;
  message: string;
  language: Language;
  themeId: BirthdayThemeId;
  selectedProducts: BirthdayProductId[];
  activePreviewProduct: BirthdayProductId;
  // Options
  showCutGuides: boolean;
  topperDiameterMm: number; // default 50mm
  posterFormat: 'a4_portrait' | 'a4_landscape' | 'a3_portrait' | 'a3_landscape';
  labelsFormat: 'round' | 'rect_favor' | 'bottle_water';
}

export const DEFAULT_BIRTHDAY_KIT: BirthdayKitData = {
  childName: 'Lina',
  age: 5,
  showAge: true,
  date: '2026-07-15',
  time: '15:00',
  location: '12 Rue des Cerisiers, 75015 Paris',
  contact: '06 12 34 56 78',
  message: 'Viens fêter mes 5 ans avec moi !',
  language: 'fr',
  themeId: 'magical_unicorn',
  selectedProducts: [
    'poster',
    'invitations',
    'labels',
    'cupcake_toppers',
    'cake_topper',
    'thank_you_cards',
    'photo_booth',
    'decorations',
  ],
  activePreviewProduct: 'poster',
  showCutGuides: true,
  topperDiameterMm: 50,
  posterFormat: 'a4_portrait',
  labelsFormat: 'rect_favor',
};
