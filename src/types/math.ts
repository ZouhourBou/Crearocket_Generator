export type MathOperationType =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mixed';

export type MathLevel = 'basic' | 'advanced';

export type MathOrientation = 'horizontal' | 'vertical';

export type AnswerBoxStyle = 'dashed_line' | 'solid_box' | 'grid_box' | 'none';

export type DivisionStyle = 'european_french' | 'standard_horizontal' | 'american_box';

export interface MathProblem {
  id: string;
  operands: number[];
  operator: '+' | '−' | '×' | '÷';
  operatorSymbol: string;
  result: number;
  remainder?: number;
  isDecimal?: boolean;
  answerKey: string;
}

export interface MathWorksheetState {
  operationType: MathOperationType;
  level: MathLevel;
  orientation: MathOrientation;
  exerciseCount: number; // 6 to 48
  columnsCount: number; // 1 to 6
  spacing: 'compact' | 'normal' | 'spacious';
  showExerciseNumbers: boolean;
  numberingStyle: '1)' | '1.' | 'A)' | '#1';
  answerBoxStyle: AnswerBoxStyle;
  
  // Custom Ranges & Constraints
  minNumber: number;
  maxNumber: number;
  digitCount: number; // 1, 2, 3, 4
  allowDecimals: boolean;
  decimalPlaces: number;

  // Addition specifics
  additionTermsCount: 2 | 3 | 4;
  allowRegroupingAddition: boolean; // Retenue

  // Subtraction specifics
  allowRegroupingSubtraction: boolean; // Emprunt
  allowNegativeResult: boolean;

  // Multiplication specifics
  multiplicationTables: number[]; // 1 to 12
  customTablesOnly: boolean;

  // Division specifics
  exactDivisionOnly: boolean;
  divisionStyle: DivisionStyle;

  // Document & Header
  paperFormat: 'A4' | 'Letter' | 'A5';
  paperOrientation: 'portrait' | 'landscape';
  showHeader: boolean;
  headerTitle: string;
  headerSubtitle: string;
  showStudentName: boolean;
  showDate: boolean;
  showGradeScore: boolean;
  scoreMax: number;

  // Answer Key
  showAnswerKeyOnSheet: boolean;
  activePreviewTab: 'exercises' | 'answers'; // Sheet 1 (exercises) vs Sheet 2 (answers)

  // Zoom
  zoom: number;
}
