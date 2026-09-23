import { Language } from '../../types';

export type BookFormat = 'a5' | 'a4' | 'square';

export type BookPageCount = 8 | 10 | 12;

export type PageLayoutType =
  | 'illustration_top' // Classic children book: illustration upper 60%, readable text card below
  | 'full_illustration_badge' // Full illustration with elegant semi-transparent reading card
  | 'side_by_side' // Illustration on left/right, text beside
  | 'cover_hero' // Premium cover layout
  | 'dedication_page' // Formal or tender dedication page with decorative borders
  | 'back_cover'; // Back cover with summary badge, barcode/star ornament, and souvenir note

export type StoryGenderForm = 'girl' | 'boy' | 'neutral';

export interface ChildProfile {
  name: string;
  age: number;
  gender: StoryGenderForm;
  nickname?: string;
  favoriteAnimal?: string;
  favoriteColor?: string;
  favoriteActivity?: string;
  dedication?: string;
  giftFrom?: string;
  // Optional protagonist visual personalization attributes
  hairColor?: string;
  hairStyle?: string;
  skinTone?: string;
  clothingColor?: string;
}

export interface StoryPageTemplate {
  pageNumber: number;
  titleKey?: string;
  textFr: string;
  textAr: string;
  textEn: string;
  layout: PageLayoutType;
  sceneIllustrationId: string;
  sceneThemeColor?: string;
  chapterBadge?: {
    fr: string;
    ar: string;
    en: string;
  };
}

export interface StoryTemplate {
  id: string;
  titleFr: string;
  titleAr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeFr: string;
  badgeAr: string;
  badgeEn: string;
  themes: string[];
  ageMin: number;
  ageMax: number;
  colorScheme: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    coverGradient: string;
  };
  coverIllustrationId: string;
  // Supported page counts: 8, 10, 12
  supportedPageCounts: BookPageCount[];
  pagesByCount: Record<BookPageCount, StoryPageTemplate[]>;
}

export type GenerationMode = 'templates' | 'ai_custom';

export interface StorybookState {
  generationMode: GenerationMode;
  storyId: string;
  pageCount: BookPageCount;
  bookFormat: BookFormat;
  language: Language;
  
  // Child Personalization
  child: ChildProfile;

  // Custom AI prompt if in ai_custom mode
  customAiPrompt: string;
  isAiGenerating: boolean;
  aiGenerationError?: string;

  // Custom edited page texts (overrides template text if edited)
  editedPages: Record<number, string>;
  customTitle?: string;

  // UI state
  currentPageIndex: number; // 0 to pageCount - 1
  zoom: number; // 50 to 150
  spreadMode: 'single' | 'spread'; // Single page or double-page spread
  showPrintGuides: boolean;
  showBookletGuide: boolean;
}
