export type WorksheetBlockType =
  | 'title'
  | 'subtitle'
  | 'instruction'
  | 'text'
  | 'image'
  | 'line'
  | 'shape'
  | 'spacer'
  | 'answer_zone'
  | 'exercise_header'
  | 'fill_in_blanks'
  | 'qcm_exam';

export type QCMQuestionNumberingStyle =
  | 'number'
  | 'letter'
  | 'letter_ar'
  | 'icon'
  | 'none'
  | 'paren'
  | 'dot'
  | 'dash'
  | 'both_paren';

export type QCMQuestionIcon =
  | 'bullet'
  | 'star'
  | 'arrow'
  | 'check'
  | 'diamond'
  | 'circle_dot'
  | 'square_small';

export interface QCMExamOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  // Individual option styling & prefix configuration
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  markerShape?: 'square' | 'rounded_square' | 'circle' | 'none';
  borderRadius?: number; // for rounded square e.g. 2 to 12
  showPrefix?: boolean;
  prefixType?: 'letter' | 'letter_lower' | 'letter_ar' | 'number' | 'none';
  prefixSeparator?: 'paren' | 'dot' | 'dash' | 'both_paren' | 'none';
}

export interface QCMExamQuestion {
  id: string;
  statement: string;
  options: QCMExamOption[];
  // Individual question configuration & styling
  numberingStyle?: QCMQuestionNumberingStyle;
  iconName?: QCMQuestionIcon;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  optionColumns?: 1 | 2 | 3 | 4 | 'horizontal_row';
}

export interface QCMSubSelection {
  type: 'block' | 'title' | 'question' | 'option';
  questionId?: string;
  questionIds?: string[];
  optionId?: string;
  optionIds?: string[];
}

export interface FillInBlanksLine {
  id: string;
  text: string; // e.g. "8/5 × ___ = \frac{___}{___}"
}

export type PageOrientation = 'portrait' | 'landscape';

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DocumentLanguage = 'fr' | 'en' | 'ar';

export interface BlockLocalizedText {
  text?: string;
  label?: string; // for instruction e.g. "Consigne :" / "Instruction :" / "التعليمة :"
  placeholder?: string;
  exerciseTitle?: string; // e.g. "Exercice 1" or "تمرين عدد 1"
  points?: string | number; // e.g. "5 points" or "( 5 نقاط )"
  instructionText?: string;
  // For QCM: question statements and option texts
  questions?: Array<{
    id: string;
    statement: string;
    options: Array<{ id: string; text: string; isCorrect?: boolean }>;
  }>;
  // For fill_in_blanks: line texts
  lines?: Array<{ id: string; text: string }>;
}

export interface DocumentSettings {
  format: 'A4';
  orientation: PageOrientation;
  margins: PageMargins; // in pixels (default ~50px = ~13mm)
  backgroundColor: string;
  showMarginGuides: boolean;
  showGridGuides: boolean;
  activeLanguage?: DocumentLanguage; // Global document language: 'fr' | 'en' | 'ar'
  languageMode?: 'fr' | 'en' | 'ar'; // Backwards compatibility alias
  defaultTextDirection?: 'auto' | 'ltr' | 'rtl';
  fontFamily?: string;
  showPageNumber?: boolean;
}

export interface WorksheetBlock {
  id: string;
  type: WorksheetBlockType;
  x: number; // in pixels relative to page
  y: number;
  width: number;
  height: number;
  rotation?: number;
  content: {
    text?: string;
    label?: string; // for instruction e.g. "Consigne :"
    src?: string; // for image
    alt?: string;
    shapeType?: 'rectangle' | 'circle';
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    answerType?: 'lines' | 'dots' | 'grid' | 'box';
    lineCount?: number;
    placeholder?: string;
    titleNumbering?: 'paren' | 'letters' | 'roman' | 'bullet' | 'none' | string;
    // For qcm_exam (Universal QCM):
    optionColumns?: 1 | 2 | 3 | 4;
    markerStyle?:
      | 'square'
      | 'circle'
      | 'box_letter_lower'
      | 'box_letter_upper'
      | 'box_letter_ar'
      | 'letter_ar_square'
      | 'number_square'
      | 'letter_paren'
      | 'letter_paren_upper'
      | 'letter_dot'
      | 'letter_dot_upper'
      | 'letter_ar_paren'
      | 'letter_ar_dot'
      | 'none';
    checkboxStyle?: string; // backwards compatibility alias for markerStyle
    markerPosition?: 'before' | 'after'; // before or after text (vital for RTL)
    questionNumberingStyle?: 'paren' | 'dot' | 'dash' | 'both_paren' | 'none';
    showInstruction?: boolean;
    instructionText?: string;
    instructionNumbering?:
      | 'none'
      | 'numbers'
      | 'roman'
      | 'letters'
      | '1.'
      | '1)'
      | 'A.'
      | 'A)'
      | 'custom'
      | string;
    instructionCustomPrefix?: string;
    showAnswers?: boolean; // Mode Corrigé: Afficher les réponses cochées
    questions?: QCMExamQuestion[];
    selectedSubElement?: QCMSubSelection;
    // For exercise_header:
    exerciseTitle?: string; // e.g. "Exercice 1" or "تمرين عدد 1"
    points?: string | number; // e.g. "5 points" or "( 5 نقاط )"
    pointsPosition?: 'right' | 'left' | 'below'; // Layout relative to title
    headerStyle?: 'underlined' | 'boxed' | 'simple'; // Visual style
    // For fill_in_blanks:
    lines?: FillInBlanksLine[];
    blankStyle?: 'solid' | 'dotted';
    blankThickness?: number;
    blankLengthPreset?: 'short' | 'medium' | 'long';
    numberingStyle?: 'numbers' | 'letters' | 'none'; // "1)" vs "a)" vs none
    lineSpacing?: number;
  };
  // Internal versions per language (Français, English, Arabe)
  translations?: {
    fr?: BlockLocalizedText;
    en?: BlockLocalizedText;
    ar?: BlockLocalizedText;
  };
  styles: {
    fontFamily?: string;
    fontSize?: number;
    languageMode?: 'fr' | 'ar'; // Block bilingual version: 'fr' or 'ar'
    statementFontSize?: number;
    statementFontFamily?: string;
    optionFontSize?: number;
    optionFontFamily?: string;
    instructionFontSize?: number;
    instructionFontFamily?: string;
    instructionFontWeight?: 'normal' | 'bold' | '900';
    instructionFontStyle?: 'normal' | 'italic';
    instructionTextDecoration?: 'none' | 'underline';
    instructionTextAlign?: 'left' | 'center' | 'right' | 'justify';
    instructionColor?: string;
    instructionBackgroundColor?: string;
    instructionBorderColor?: string;
    instructionBorderWidth?: number;
    instructionBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
    instructionBorderRadius?: number;
    instructionTextTransform?: 'none' | 'uppercase' | 'lowercase';
    questionSpacing?: number;
    optionSpacing?: number;
    fontWeight?: 'normal' | 'bold' | '900';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textDirection?: 'auto' | 'ltr' | 'rtl'; // Bilingual support
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;
    padding?: number;
    opacity?: number;
    lineHeight?: number | string;
    strikethrough?: boolean;
    highlightColor?: string;
    isBulletList?: boolean;
    isNumberedList?: boolean;
  };
  zIndex: number;
}

export interface WorksheetPageData {
  id: string;
  pageNumber: number;
  blocks: WorksheetBlock[];
  isIndependentArabic?: boolean; // Dupliquée en tant que version Arabe autonome
  independentLanguage?: 'ar';
}

export interface WorksheetDocument {
  id: string;
  title: string;
  settings: DocumentSettings;
  pages: WorksheetPageData[];
}

export const A4_PORTRAIT_WIDTH = 794;
export const A4_PORTRAIT_HEIGHT = 1123;
export const A4_LANDSCAPE_WIDTH = 1123;
export const A4_LANDSCAPE_HEIGHT = 794;

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number; // coordinate where snap occurs
}
