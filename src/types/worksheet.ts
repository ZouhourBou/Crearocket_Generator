export type WorksheetBlockType =
  // Structure
  | 'exam_header'
  | 'exercise'
  | 'instruction'
  | 'info_box'
  | 'separator'
  // Text
  | 'title'
  | 'rich_text'
  // Questions
  | 'qcm'
  | 'true_false'
  | 'short_answer'
  | 'long_answer'
  | 'fill_blank'
  // Activities
  | 'matching'
  | 'ordering'
  | 'table'
  // Answers
  | 'answer_lines'
  | 'answer_box'
  | 'blank_space'
  // Layout
  | 'columns'
  // Phase 4 & 5 — Visual, Geometry & Scientific Tools
  | 'image'
  | 'geometry_figure'
  | 'coordinate_system'
  | 'number_line'
  | 'diagram'
  | 'construction_area'
  | 'image_annotation'
  | 'shape'
  // Legacy aliases mapped to core blocks
  | 'subtitle'
  | 'text'
  | 'answer_zone'
  | 'line'
  | 'spacer'
  | 'exercise_header'
  | 'fill_in_blanks'
  | 'qcm_exam'
  | 'question';

export type Phase3BlockCategory =
  | 'structure'
  | 'text'
  | 'questions'
  | 'activities'
  | 'answers'
  | 'layout'
  | 'visual';

// Phase 4 Geometry Types
export interface GeometryPoint {
  id: string;
  label: string; // e.g., "A", "B", "C", "O"
  x: number; // in svg coordinate system (0 to 600)
  y: number; // in svg coordinate system (0 to 300)
  showLabel?: boolean;
  labelPosition?: 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  style?: 'dot' | 'cross' | 'ring';
  color?: string;
}

export interface GeometrySegment {
  id: string;
  from: string; // point id
  to: string; // point id
  style?: 'solid' | 'dashed' | 'dotted';
  strokeWidth?: number;
  color?: string;
  lengthLabel?: string; // e.g. "5 cm"
  showLength?: boolean;
  tickMarks?: 0 | 1 | 2 | 3; // for equal length indicators
}

export interface GeometryCircle {
  id: string;
  center: string; // point id
  radius: number; // in svg units
  style?: 'solid' | 'dashed';
  strokeWidth?: number;
  color?: string;
  fill?: string;
}

export interface GeometryAngle {
  id: string;
  vertex: string; // point id
  arm1: string; // point id
  arm2: string; // point id
  isRightAngle?: boolean; // right angle square marker
  label?: string; // e.g. "60°"
  showArc?: boolean;
  color?: string;
}

export interface GeometryFigureData {
  points: GeometryPoint[];
  segments: GeometrySegment[];
  circles: GeometryCircle[];
  angles: GeometryAngle[];
  labels?: { id: string; text: string; x: number; y: number }[];
  figureHeight?: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridStep?: number;
  caption?: string;
}

// Phase 4 Coordinate Graph Types
export interface GraphPoint {
  id: string;
  label: string; // "A(2,3)"
  x: number; // math units
  y: number; // math units
  color?: string;
}

export interface GraphSegment {
  id: string;
  from: string; // point id
  to: string; // point id
  style?: 'solid' | 'dashed';
  color?: string;
}

export interface GraphFunctionCurve {
  id: string;
  expression: string; // e.g. "2*x + 1", "-0.5*x^2", etc.
  label?: string; // "f(x) = 2x + 1"
  color?: string;
  style?: 'solid' | 'dashed';
}

export interface CoordinateGraphData {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  step: number;
  showGrid: boolean;
  showAxes: boolean;
  showAxisLabels: boolean;
  showNumbers: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  points: GraphPoint[];
  segments: GraphSegment[];
  functions?: GraphFunctionCurve[];
  graphHeight?: number;
  caption?: string;
}

// Phase 4 Construction Area Types
export interface ConstructionAreaData {
  height: number;
  backgroundType: 'blank' | 'square_grid' | 'dot_grid' | 'coordinate_grid';
  gridSize: number;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor: string;
  instructionHint?: string;
  initialGeometry?: GeometryFigureData;
}

// Phase 4 Diagram Types
export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  shape: 'box' | 'rounded' | 'circle' | 'pill';
  fillColor?: string;
  strokeColor?: string;
  textColor?: string;
}

export interface DiagramConnector {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  arrowEnd?: boolean;
  style?: 'solid' | 'dashed';
  color?: string;
}

export interface DiagramData {
  nodes: DiagramNode[];
  connectors: DiagramConnector[];
  diagramHeight?: number;
  caption?: string;
}

// Phase 4 Image Annotation Types
export interface AnnotationMarker {
  id: string;
  index: number; // 1, 2, 3...
  letter?: string; // A, B, C...
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  label: string; // title or term
  expectedAnswer?: string; // correct answer for teacher / solutions
  pointerDirection?: 'top' | 'bottom' | 'left' | 'right';
}

export interface ImageAnnotationData {
  src: string;
  alt?: string;
  mode: 'complete' | 'student_exercise'; // complete: shows labels; student_exercise: shows numbered lines
  markerStyle: 'number' | 'letter';
  markers: AnnotationMarker[];
  caption?: string;
}

// Phase 4 Shape Types
export type ShapeKind =
  | 'rectangle'
  | 'rounded_rectangle'
  | 'circle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'double_arrow'
  | 'triangle'
  | 'brace';

export interface ShapeData {
  shapeKind: ShapeKind;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  fillColor: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;
}

// Phase 5 Reusable Pedagogical Block: Number Line (Axe gradué)
export interface NumberLinePoint {
  id: string;
  value: number; // e.g. 2.5
  label?: string; // e.g. "A", "M", "3/4"
  color?: string;
  style?: 'dot' | 'cross' | 'arrow';
  showLabel?: boolean;
}

export interface NumberLineData {
  min: number; // e.g. 0, -5
  max: number; // e.g. 10, 5
  step: number; // main step e.g. 1
  subdivisions?: number; // small ticks between main ticks (e.g. 2, 4, 10)
  arrowStart?: boolean;
  arrowEnd?: boolean;
  showNumbers?: boolean;
  showOriginZero?: boolean;
  points: NumberLinePoint[];
  studentCompletionMode?: boolean; // leaves blank boxes for students to write numbers
  blankIndices?: number[]; // indices of numbers that should be empty blanks
  lineHeight?: number;
  caption?: string;
}

export type ExamHeaderPreset =
  | 'classic'
  | 'compact'
  | 'institutional'
  | 'three_columns'
  | 'minimal';

export type TablePreset = 'data' | 'complete' | 'comparison' | 'custom';
export type ColumnsPreset = '50_50' | '33_33_33' | '40_60' | '60_40';

export interface QCMOptionItem {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface TableCellData {
  id: string;
  text: string;
  colSpan?: number;
  rowSpan?: number;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export interface TableRowData {
  id: string;
  cells: TableCellData[];
}

export interface MatchingItemData {
  id: string;
  text: string;
}

export interface ColumnSlotData {
  id: string;
  blocks: WorksheetBlock[];
}

export type Phase2CoreBlockType =
  | 'title'
  | 'rich_text'
  | 'exercise'
  | 'answer_lines'
  | 'separator';

export type TextDirectionMode = 'auto' | 'ltr' | 'rtl';
export type DocumentLanguage = 'fr' | 'en' | 'ar';
export type PageOrientation = 'portrait' | 'landscape';
export type PaperFormat = 'A4' | 'A5' | 'Letter';

export type AnswerLineStyle = 'solid' | 'dotted' | 'dashed';
export type ExerciseHeaderStyle = 'underlined' | 'boxed' | 'simple';
export type ExerciseNumberingStyle = 'exercice_n' | 'exercice' | 'roman' | 'numeric' | 'none';
export type RichTextVariant = 'paragraph' | 'instruction' | 'subtitle' | 'callout';

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DocumentSettings {
  format: PaperFormat;
  orientation: PageOrientation;
  margins: PageMargins;
  backgroundColor: string;
  showMarginGuides: boolean;
  showGridGuides: boolean;
  activeLanguage?: DocumentLanguage;
  languageMode?: DocumentLanguage;
  defaultTextDirection?: TextDirectionMode;
  fontFamily?: string;
  showPageNumber?: boolean;
  blockGap?: number;
}

export interface BlockMetadata {
  createdAt?: number;
  updatedAt?: number;
  keepWithNext?: boolean;
  keepTogether?: boolean;
  aiGenerated?: boolean;
  // Phase 5 Traceability & Confidence
  sourcePage?: number;
  sourceRegion?: { x: number; y: number; width: number; height: number };
  confidence?: 'high' | 'medium' | 'low';
  isUncertain?: boolean;
  uncertaintyNotes?: string;
  originalLabel?: string;
}

export interface BlockLocalizedText {
  text?: string;
  label?: string;
  placeholder?: string;
  exerciseTitle?: string;
  points?: string | number;
  instructionText?: string;
  questions?: any[];
  lines?: any[];
  pedagogicalQuestions?: any[];
  questionData?: any;
}

export interface WorksheetBlock {
  id: string;
  type: WorksheetBlockType;
  /** Child blocks for container blocks such as Exercise */
  children?: WorksheetBlock[];
  /** Document Flow layout coordinates (managed automatically by layoutVerticalFlow) */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
  content: {
    /** Primary rich text content (contains plain text + inline $math$ nodes) */
    text?: string;
    /** Optional semantic variant for rich_text / title */
    variant?: RichTextVariant;
    label?: string;
    placeholder?: string;
    titleNumbering?: 'paren' | 'letters' | 'roman' | 'bullet' | 'none' | string;

    /** Exercise Container properties */
    exerciseNumber?: number;
    exerciseTitle?: string;
    points?: string | number;
    showPoints?: boolean;
    pointsPosition?: 'right' | 'left' | 'below';
    headerStyle?: ExerciseHeaderStyle;
    numberingStyle?: ExerciseNumberingStyle | 'numbers' | 'letters';
    showInstruction?: boolean;
    instructionText?: string;
    keepTogether?: boolean;

    /** Answer Lines properties */
    lineCount?: number;
    lineSpacing?: number; // in px (e.g., 28, 34, 42)
    lineStyle?: AnswerLineStyle;
    answerType?: 'lines' | 'dots' | 'grid' | 'box';

    /** Separator / Spacer properties */
    separatorMode?: 'line' | 'space';
    spacerHeight?: number;

    /** Phase 3 — Exam Header properties */
    headerPreset?: ExamHeaderPreset;
    schoolName?: string;
    teacherName?: string;
    subjectName?: string;
    testTitle?: string;
    classGrade?: string;
    academicYear?: string;
    testDate?: string;
    durationText?: string;
    studentNamePlaceholder?: string;
    maxScore?: number | string;
    scoreValue?: string;
    headerBorderStyle?: 'boxed' | 'double' | 'underlined' | 'clean';
    showStudentArea?: boolean;
    showScoreArea?: boolean;
    showDuration?: boolean;
    logoUrl?: string;

    /** Phase 3 — Info Box properties */
    infoBoxType?: 'reminder' | 'formula' | 'note' | 'warning' | 'method';
    infoBoxTitle?: string;

    /** Phase 3 — QCM Question properties */
    qcmStatement?: string;
    qcmOptions?: QCMOptionItem[];
    qcmLayout?: 'vertical' | 'horizontal' | 'grid';
    qcmColumns?: 1 | 2 | 3 | 4 | 'auto';
    qcmSelectionMode?: 'single' | 'multiple';
    qcmCheckboxStyle?: 'square' | 'circle' | 'paren';
    questionNumber?: string | number;

    /** Phase 3 — True/False properties */
    tfStatement?: string;
    trueLabel?: string;
    falseLabel?: string;
    correctAnswer?: 'true' | 'false' | 'none';
    tfLayout?: 'horizontal' | 'vertical';

    /** Phase 3 — Short & Long Answer properties */
    shortAnswerQuestion?: string;
    shortAnswerLayout?: 'inline' | 'below';
    shortAnswerLineWidth?: 'short' | 'medium' | 'full';
    shortAnswerLineStyle?: 'solid' | 'dotted' | 'dashed';
    longAnswerQuestion?: string;

    /** Phase 3 — Matching Activity properties */
    matchingLeft?: MatchingItemData[];
    matchingRight?: MatchingItemData[];
    matchingDisplayMode?: 'lines' | 'write_answer';

    /** Phase 3 — Ordering Activity properties */
    orderingItems?: { id: string; text: string }[];
    orderingPresentation?: 'inline' | 'cards' | 'list';

    /** Phase 3 — Pedagogical Table properties */
    tableRowsData?: TableRowData[];
    tableColWidths?: number[];
    tableBorderStyle?: 'all' | 'horizontal' | 'minimal' | 'none';
    tablePreset?: TablePreset;

    /** Phase 3 — Answer Box properties */
    answerBoxTitle?: string;
    answerBoxHeight?: number;
    answerBoxBorder?: boolean;
    answerBoxBorderStyle?: 'solid' | 'dashed' | 'double';
    answerBoxPattern?: 'blank' | 'lines' | 'grid';

    /** Phase 3 — Columns Container properties */
    columnsPreset?: ColumnsPreset;
    columnsGap?: number;
    columnsData?: ColumnSlotData[];

    /** Phase 4 — Visual, Geometry & Scientific properties */
    // Image properties
    imageWidthPercent?: number;
    imageAlignment?: 'left' | 'center' | 'right';
    aspectRatioLocked?: boolean;
    fitMode?: 'contain' | 'cover';
    showCaption?: boolean;
    captionText?: string;
    captionNumber?: string;
    printDpiWarning?: boolean;

    // Geometry Figure properties
    geometryData?: GeometryFigureData;

    // Coordinate System / Graph properties
    graphData?: CoordinateGraphData;

    // Phase 5 Number Line properties
    numberLineData?: NumberLineData;

    // Construction Area properties
    constructionData?: ConstructionAreaData;

    // Diagram properties
    diagramData?: DiagramData;

    // Image Annotation properties
    annotationData?: ImageAnnotationData;

    // Simple Shapes properties
    shapeData?: ShapeData;

    /** Legacy optional fields kept only so utility types compile cleanly */
    src?: string;
    alt?: string;
    shapeType?: 'rectangle' | 'circle';
    optionColumns?: 1 | 2 | 3 | 4;
    selectionMode?: 'single' | 'multiple';
    markerStyle?: string;
    checkboxStyle?: string;
    markerPosition?: 'before' | 'after';
    questionNumberingStyle?: string;
    instructionNumbering?: string;
    instructionCustomPrefix?: string;
    showAnswers?: boolean;
    questions?: any[];
    selectedSubElement?: any;
    pedagogicalQuestions?: any[];
    questionData?: any;
    lines?: any[];
    blankStyle?: 'solid' | 'dotted';
    blankThickness?: number;
    blankLengthPreset?: 'short' | 'medium' | 'long';
  };
  translations?: {
    fr?: BlockLocalizedText;
    en?: BlockLocalizedText;
    ar?: BlockLocalizedText;
  };
  styles: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | '900';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    strikethrough?: boolean;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textDirection?: TextDirectionMode;
    languageMode?: 'fr' | 'ar';
    color?: string;
    highlightColor?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;
    padding?: number;
    spacing?: number; // Vertical gap between children or bottom spacing
    lineHeight?: number | string;
    opacity?: number;
    isBulletList?: boolean;
    isNumberedList?: boolean;
    // Legacy style fields
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
  };
  metadata?: BlockMetadata;
}

export interface WorksheetPageData {
  id: string;
  pageNumber: number;
  blocks: WorksheetBlock[];
  isIndependentArabic?: boolean;
  independentLanguage?: 'ar';
}

export interface WorksheetDocument {
  id: string;
  schemaVersion?: number;
  title: string;
  settings: DocumentSettings;
  pages: WorksheetPageData[];
}

export const CURRENT_SCHEMA_VERSION = 1;

export const A4_PORTRAIT_WIDTH = 794;
export const A4_PORTRAIT_HEIGHT = 1123;
export const A4_LANDSCAPE_WIDTH = 1123;
export const A4_LANDSCAPE_HEIGHT = 794;

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
}

// Legacy type exports kept for unused/auxiliary files compilation safety
export type QCMSelectionMode = 'single' | 'multiple';
export type PedagogicalQuestionType =
  | 'qcm'
  | 'open_question'
  | 'true_false'
  | 'fill_in_blanks'
  | 'table'
  | 'paragraph';
export interface TrueFalseStatementItem {
  id: string;
  statement: string;
  isTrue: boolean;
  correction?: string;
}
export interface PedagogicalQuestionItem {
  id: string;
  type: PedagogicalQuestionType;
  numberLabel?: string;
  statement: string;
  points: number;
  selectionMode?: QCMSelectionMode;
  options?: QCMExamOption[];
  optionColumns?: 1 | 2 | 3 | 4 | 'horizontal_row';
  trueFalseItems?: TrueFalseStatementItem[];
  answerType?: 'lines' | 'dots' | 'grid' | 'box' | 'none';
  answerLines?: number;
  correction?: string;
  explanation?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
}
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
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  markerShape?: 'square' | 'rounded_square' | 'circle' | 'none';
  borderRadius?: number;
  showPrefix?: boolean;
  prefixType?: 'letter' | 'letter_lower' | 'letter_ar' | 'number' | 'none';
  prefixSeparator?: 'paren' | 'dot' | 'dash' | 'both_paren' | 'none';
}
export interface QCMExamQuestion {
  id: string;
  statement: string;
  options: QCMExamOption[];
  points?: number;
  selectionMode?: QCMSelectionMode;
  explanation?: string;
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
  text: string;
}
