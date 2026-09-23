export type Language = 'fr' | 'ar' | 'en';

export type LabelLanguage = 'latin' | 'ar';

export type GeneratorType = 'supplies' | 'books' | 'notebook_cover' | 'birthday_kit';

export type SchoolLabelType = 'supplies' | 'books';

export type PaperFormat = 'A4' | 'A5' | 'custom';

export type NotebookSubject =
  | 'math'
  | 'french'
  | 'arabic'
  | 'english'
  | 'history'
  | 'geography'
  | 'science'
  | 'islamic'
  | 'exercise'
  | 'homework'
  | 'textbook'
  | 'other';

export type ExtendedNotebookSubject = NotebookSubject | NotebookTypeMatiere | string;

export type NotebookPageFormat =
  | 'A4_unique'
  | 'A4_double_horizontal'
  | 'custom_unique'
  | 'custom_double_horizontal';

export type NotebookTypeMatiere =
  | 'maths'
  | 'eveil_scientifique'
  | 'francais'
  | 'production_ecrite_fr'
  | 'lecture_fr'
  | 'grammaire_fr'
  | 'anglais'
  | 'arabe'
  | 'production_ecrite_ar'
  | 'lecture_ar'
  | 'grammaire_ar'
  | 'histoire_geo'
  | 'education_islamique'
  | 'education_civique'
  | 'arts_plastiques'
  | 'musique'
  | 'eveil_musical'
  | 'technologie'
  | 'informatique'
  | 'memorisation'
  | 'exercices'
  | 'mutalaa'
  | 'devoirs'
  | 'brouillon'
  | 'correspondance'
  | 'autre'
  | 'mathematiques'
  | 'sciences'
  | 'islamique'
  | 'civisme_devoirs'
  | 'cahier_texte'
  | 'dessin_arts'
  | 'multi_matieres'
  | string;

export interface NotebookCoverInputParams {
  format_page: NotebookPageFormat;
  type_matiere: NotebookTypeMatiere;
  titre_cahier: string;
  nom_prenom: string;
  classe: string;
  ecole: string;
  annee: string;
  att_numero_modele?: number; // 1 to 12
  variation_index: number;
}

export interface PaperDimensions {
  widthMm: number;
  heightMm: number;
}

export interface LabelDimensions {
  widthMm: number;
  heightMm: number;
}

export interface StudentInfo {
  fullName: string;
  grade: string;
  hasSchool: boolean;
  schoolName: string;
  hasSubject: boolean;
  subjectName: string;
  academicYear?: string;
  classLevel?: string;
  school?: string;
}

export interface FieldFontSizes {
  fullName?: number;
  grade?: number;
  subjectName?: number;
  schoolName?: number;
  academicYear?: number;
}

export interface PageMargins {
  enabled: boolean;
  uniform: boolean;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface GeneratorState {
  type: GeneratorType;
  schoolLabelType: SchoolLabelType;
  language: Language;
  labelLanguage?: LabelLanguage;
  paperFormat: PaperFormat;
  customPaper: PaperDimensions;
  labelPreset: string;
  customLabel: LabelDimensions;
  itemCount: number;
  coversPerSheet: 1 | 2 | 3 | 'custom';
  customCover: LabelDimensions;
  notebookCoverSizePreset?: string;
  notebookCoverCustomDimensions?: { widthCm: number; heightCm: number };
  notebookSubject: ExtendedNotebookSubject;
  themeId: string;
  paletteId: string;
  illustrationId: string;
  illustrationMode?: 'icon' | 'photo';
  studentPhotoUrl?: string;
  studentPhotoAiUrl?: string;
  isProcessingPhoto?: boolean;
  schoolSubjectDecor?: string;
  duplicateIconRight?: boolean;
  centerText?: boolean;
  borderRadius?: number;
  iconSize?: number;
  fieldFontSizes?: FieldFontSizes;
  info: StudentInfo;
  displayOptions: {
    showCutMarks: boolean;
    showDimensions: boolean;
    showSafeZone: boolean;
    zoom: number;
  };
  pageMargins?: PageMargins;
  labelSpacing?: number;
  aiCoverImage?: string;
  aiCoverSeed?: number;
  aiCoverVariationIndex?: number;
  aiCoverModelNumber?: number;
  aiCoverStyleTitle?: string;
  aiCoverThemeId?: string;
  aiCoverUsedThemeIds?: string[];
  aiCoverVariationHint?: string;
  aiCoverBrandSlogan?: string;
}

export interface LayoutCalculationResult {
  cols: number;
  rows: number;
  maxCapacity: number;
  actualCount: number;
  marginHorizontalMm: number;
  marginVerticalMm: number;
  gapXmm: number;
  gapYmm: number;
  itemWidthMm: number;
  itemHeightMm: number;
  paperWidthMm: number;
  paperHeightMm: number;
  isOverCapacity: boolean;
  orientation: 'portrait' | 'landscape';
  marginTopMm?: number;
  marginRightMm?: number;
  marginBottomMm?: number;
  marginLeftMm?: number;
  isMarginTooLarge?: boolean;
  marginError?: string;
}

export interface ThemeDefinition {
  id: string;
  name: {
    fr: string;
    ar: string;
    en: string;
  };
  icon: string;
  category: 'general' | 'math' | 'science' | 'languages' | 'humanities' | 'islamic' | 'notes';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  illustrationType: string;
  previewThumbnail: string;
}

export interface ColorPalette {
  id: string;
  name: {
    fr: string;
    ar: string;
    en: string;
  };
  colors: string[]; // Swatches for UI cards: [primary, accent, border, bg]
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface IllustrationDefinition {
  id: string;
  name: {
    fr: string;
    ar: string;
    en: string;
  };
  category?: string;
}
