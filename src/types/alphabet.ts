export type AlphabetLanguage = 'fr' | 'ar';

export type PedagogicalLevel = 'ps' | 'ms' | 'gs' | 'cp';

export type AlphabetActivityType =
  | 'writing'
  | 'search'
  | 'coloring'
  | 'matching'
  | 'cut_paste'
  | 'vocabulary';

export type PaperFormat = 'a4' | 'letter';
export type PaperOrientation = 'portrait' | 'landscape';
export type DocumentStyle =
  | 'school_playful'
  | 'minimalist_clean'
  | 'academic_classic'
  | 'nature_animals';

export interface LetterVocabularyWord {
  word: string;
  cleanWord?: string;
  translation?: string;
  phonetic?: string;
  iconName: string;
  emoji: string;
  letters?: string[];
  isTargetInitial?: boolean;
}

export interface LetterMeta {
  letter: string;
  lowercase?: string;
  name: string;
  nameAr?: string;
  soundHint: string;
  strokeGuide: string[];
  contextualForms?: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  words: LetterVocabularyWord[];
  distractors: string[];
}

export interface WritingActivityConfig {
  rulingType: 'seyes' | 'three_lines' | 'simple' | 'arabic_guide';
  showArrows: boolean;
  caseType: 'both' | 'uppercase' | 'lowercase';
  repeatCount: number;
  showFreeLine: boolean;
}

export interface SearchActivityConfig {
  gridColumns: number;
  totalLetters: number;
  targetCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ColoringActivityConfig {
  showUppercase: boolean;
  showLowercase: boolean;
  includeIllustration: boolean;
  style: 'outline' | 'bubble';
}

export interface MatchingActivityConfig {
  variant: 'letter_image' | 'letter_word' | 'word_image';
  itemCount: number;
  includeDistractors: boolean;
}

export interface CutPasteActivityConfig {
  mode: 'complete_words' | 'reorder_word' | 'sort_images';
}

export interface VocabularyActivityConfig {
  wordsCount: number;
  showTracing: boolean;
  highlightColor: string;
}

export interface AlphabetHeaderConfig {
  showStudentName: boolean;
  showClass: boolean;
  showDate: boolean;
  showSubject: boolean;
  customTitle: string;
  showPageNumber: boolean;
  showScoreBox: boolean;
}

export interface AlphabetGeneratorState {
  language: AlphabetLanguage;
  targetLetter: string;
  pedagogicalLevel: PedagogicalLevel;
  selectedActivities: AlphabetActivityType[];
  pageCount: 1 | 2 | 3 | 4 | 6;
  activePageIndex: number;
  paperFormat: PaperFormat;
  paperOrientation: PaperOrientation;
  documentStyle: DocumentStyle;
  zoom: number;
  showAnswerKey: boolean;

  headerConfig: AlphabetHeaderConfig;
  instructions: Record<AlphabetActivityType, string>;

  writingConfig: WritingActivityConfig;
  searchConfig: SearchActivityConfig;
  coloringConfig: ColoringActivityConfig;
  matchingConfig: MatchingActivityConfig;
  cutPasteConfig: CutPasteActivityConfig;
  vocabularyConfig: VocabularyActivityConfig;
}
