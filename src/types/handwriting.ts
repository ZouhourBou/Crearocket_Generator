export type HandwritingActivityType =
  | 'phrase_name'
  | 'alphabet'
  | 'tracing_lines'
  | 'shapes';

export type HandwritingLanguage = 'fr' | 'ar' | 'en';

export type PhraseTracingMode =
  | 'example_trace' // Mode 1: Ligne normale + lignes en pointillés
  | 'progressive'   // Mode 2: Normal -> Pointillés -> Gris clair -> Lignes vierges
  | 'free';          // Mode 3: Modèle en haut + lignes d'écriture vierges

export type TracingStyle =
  | 'solid'       // Couleur pleine (modèle)
  | 'dotted'      // Pointillés classiques
  | 'dashed'      // Tirets
  | 'outline'     // Contour creux à colorier/remplir
  | 'light_gray'  // Gris clair estompé
  | 'blank'       // Vide (écriture autonome sur la ligne)
  | 'arrows';     // Avec flèches numérotées de tracé

export type PedagogicalRulingType =
  | 'seyes'           // Lignage Seyès classique français (grands carreaux 8mm x interlignes 2mm)
  | 'grid'            // Quadrillage / Petits carreaux scolaires (5x5mm)
  | 'simple'          // Lignes simples horizontales
  | 'blank'           // Fond blanc uni (sans réglure)
  | 'three_lines'     // 3 lignes (haute, médiane en pointillés, base)
  | 'four_lines'      // 4 lignes (ascendante, médiane, base, descendante)
  | 'double_line'     // Double ligne maternelle (2 lignes d'écriture)
  | 'beginner_color'  // Lignage débutant tricolore (Ciel / Herbe / Terre)
  | 'arabic_school';  // Lignage calligraphie arabe scolaire (base marquée + repères)

export type SchoolGradeLevel =
  | 'maternelle_ps_ms'
  | 'maternelle_gs'
  | 'cp'
  | 'ce1'
  | 'ce2'
  | 'cm1_cm2';

export interface GradeTypographyPreset {
  id: SchoolGradeLevel;
  label: string;
  labelAr: string;
  idealFontSizePx: number;
  minFontSizePx: number;
  maxFontSizePx: number;
  defaultRuling: PedagogicalRulingType;
  defaultRulingScale: number;
  minRowHeightPx: number;
}

export interface AlternationPatternConfig {
  tracedRowsCount: number; // ex: 3 rangées tracées
  freeRowsCount: number;   // ex: 1 rangée libre
}

export type RepetitionGradientStyle = 'solid' | 'dotted' | 'light_gray' | 'blank';

export interface RepetitionCell {
  index: number;
  text: string;
  style: RepetitionGradientStyle;
}

export interface EditableTextSegment {
  id: string;
  text: string;
  isManuallyEdited?: boolean;
}

export interface ComputedHandwritingRow {
  rowId: string;
  rowIndex: number;
  patternIndex: number;
  indexInPattern: number;
  type: 'traced' | 'free';
  segmentId?: string;
  text: string;
  fontSizePx: number;
  measuredTextWidthPx: number;
  repetitionsCount: number;
  repetitions: RepetitionCell[];
  rowHeightPx: number;
}

export interface HandwritingPageHeaderConfig {
  enabled: boolean;
  fixedHeightPx: number;
  title: string;
  showStudentName: boolean;
  studentNameLabel: string;
  showDate: boolean;
  dateLabel: string;
  showGrade: boolean;
  gradeLabel: string;
  logoUrl?: string;
  showSchoolLogo: boolean;
}

export interface HandwritingSubPageData {
  pageId: string;
  pageNumber: 1 | 2;
  titleOverride?: string;
  rawInputText: string;
  segments: EditableTextSegment[];
  manualFontSizePx: number | null;
}

export type A5AssemblyOrientation = 'left_right' | 'top_bottom';

export interface A5OnA4AssemblyConfig {
  enabled: boolean;
  orientation: A5AssemblyOrientation; // 'left_right' (côte à côte sur A4 paysage) | 'top_bottom' (haut/bas sur A4 portrait)
  showPreviewModal: boolean;
  showCutLine: boolean;
  pageCount: 1 | 2; // Limité à 2 pages A5 par feuille A4
}

export type AlphabetLetterCase = 'upper' | 'lower' | 'both';

export type ArabicContextualForm = 'isolated' | 'initial' | 'medial' | 'final' | 'all';

export type LinePatternType =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'wave'
  | 'zigzag'
  | 'loops_up'
  | 'loops_down'
  | 'curve'
  | 'spiral'
  | 'mixed';

export type LineDifficultyLevel = 'basic' | 'intermediate' | 'advanced';

export type TracingShapeType =
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'oval'
  | 'star'
  | 'diamond'
  | 'heart'
  | 'pentagon'
  | 'hexagon';

export interface HandwritingState {
  activity: HandwritingActivityType;
  language: HandwritingLanguage;
  paperFormat: 'A4' | 'Letter' | 'A5';
  orientation: 'portrait' | 'landscape';
  rulingType: PedagogicalRulingType;
  showGuidelines: boolean;
  guidelineColor: string;
  rulingScale: number;

  // Grade & Automatic Font Sizing
  gradeLevel: SchoolGradeLevel;
  autoFontSize: boolean;
  manualFontSizePx: number | null;
  minRepetitionGapPx: number;

  // Alternation Pattern (Traced rows / Free rows)
  alternationPattern: AlternationPatternConfig;
  useFourStyleRowGradient: boolean; // couleur pleine -> pointillé -> gris clair estompé -> vide

  // Multi-row editable segments & overflow pages
  editableSegments: EditableTextSegment[];
  maxRowsPerExercise: number;
  overflowSegmentsCount: number;

  // A5 & Assembly on A4 (2 x A5 on 1 A4 sheet)
  a5Assembly: A5OnA4AssemblyConfig;
  subPages: HandwritingSubPageData[];
  activeSubPageIndex: 0 | 1;

  // Header options (Fixed Height Block)
  showHeader: boolean;
  headerTitle: string;
  headerStudentName: boolean;
  headerDate: boolean;
  headerGrade: boolean;
  headerShowLogo: boolean;
  headerLogoText: string;

  // Typography & Styling
  fontFamily: string;
  textColor: string;
  tracingOpacity: number;
  fontSize: number;
  lineSpacing: number;

  // 1. Phrase & Name Tracing State
  phraseInput: string;
  phraseMode: PhraseTracingMode;
  phraseTracingStyle: TracingStyle;
  repetitionsPerLine: number;
  totalLines: number;
  // Professional customization properties for Prénoms & Phrases
  letterCase: 'original' | 'lowercase' | 'uppercase';
  textAlignment: 'left' | 'center' | 'right';
  strokeColor: 'blue' | 'black' | 'pencil_gray';
  strokeWidth: number; // e.g. 1.0 (fine) to 2.5 (thick)
  letterSpacingPx: number; // in px
  wordSpacingPx: number; // in px
  lineSpacingMultiplier: number; // e.g. 1.0 to 2.0

  // 2. Alphabet Tracing State
  alphabetScope: 'full' | 'single' | 'custom';
  selectedLetters: string[];
  singleSelectedLetter: string;
  alphabetCase: AlphabetLetterCase;
  arabicFormsMode: ArabicContextualForm;
  alphabetLinesPerLetter: number;

  // 3. Tracing Lines (Graphisme)
  lineType: LinePatternType;
  lineDifficulty: LineDifficultyLevel;
  lineStrokeWidth: number;
  lineDashSize: number;
  lineRepeats: number;
  showStartEndPoint: boolean;
  showDirectionArrows: boolean;

  // 4. Lines & Shapes Tracing
  selectedShapes: TracingShapeType[];
  shapeMode: 'single' | 'multiple' | 'repeated' | 'progressive_size' | 'free_reproduce';
  shapeCount: number;
  shapeStyle: 'dotted' | 'solid' | 'dashed' | 'light_gray';

  // Preview options
  zoom: number;
  currentPage: number;
  totalPages: number;
}
