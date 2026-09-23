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
  | 'dotted'      // Pointillés classiques
  | 'dashed'      // Tirets
  | 'outline'     // Contour creux à colorier/remplir
  | 'light_gray'  // Gris clair estompé
  | 'arrows';     // Avec flèches numérotées de tracé

export type PedagogicalRulingType =
  | 'seyes'           // Lignage Seyès classique français (grands carreaux 8mm x interlignes 2mm)
  | 'three_lines'     // 3 lignes (haute, médiane en pointillés, base)
  | 'four_lines'      // 4 lignes (ascendante, médiane, base, descendante)
  | 'double_line'     // Double ligne maternelle (2 lignes d'écriture)
  | 'beginner_color'  // Lignage débutant tricolore (Ciel / Herbe / Terre)
  | 'arabic_school'   // Lignage calligraphie arabe scolaire (base marquée + repères)
  | 'simple';         // Ligne simple de base

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
  rulingScale: number; // e.g. 1.0 (standard), 1.25 (maternelle/grand), 0.85 (primaire/fin)
  
  // Header options
  showHeader: boolean;
  headerTitle: string;
  headerStudentName: boolean;
  headerDate: boolean;
  headerGrade: boolean;

  // Typography & Styling
  fontFamily: string;
  textColor: string;
  tracingOpacity: number;
  fontSize: number;
  lineSpacing: number; // in mm or relative ratio

  // 1. Phrase & Name Tracing State
  phraseInput: string;
  phraseMode: PhraseTracingMode;
  phraseTracingStyle: TracingStyle;
  repetitionsPerLine: number;
  totalLines: number;

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
