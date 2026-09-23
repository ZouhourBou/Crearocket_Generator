export type GameType = 'word_search' | 'game_cards' | 'sudoku';

// ----------------------------------------------------
// 1. WORD SEARCH (Mots Mêlés)
// ----------------------------------------------------
export type WordSearchDifficulty = 'basic' | 'intermediate' | 'advanced';

export interface WordPlacement {
  word: string;
  originalWord: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  direction: 'H' | 'V' | 'D' | 'H_REV' | 'V_REV' | 'D_REV';
  color: string;
}

export interface WordSearchGrid {
  size: number;
  grid: string[][];
  placedWords: WordPlacement[];
  unplacedWords: string[];
}

export type WordSearchTheme =
  | 'animals'
  | 'school'
  | 'food'
  | 'nature'
  | 'space'
  | 'colors'
  | 'custom';

// ----------------------------------------------------
// 2. GAME CARDS (Cartes Éducatives)
// ----------------------------------------------------
export type GameCardCategory =
  | 'memory'
  | 'vocabulary'
  | 'qa'
  | 'image_word'
  | 'letter_image'
  | 'number_quantity';

export interface EducationalCardItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  iconName: string;
  accentColor: string;
  pairId?: string; // for memory match pairs
}

export interface GameCardsConfig {
  category: GameCardCategory;
  cardsCount: number; // 4, 6, 8, 9, 12
  columns: number;
  showCutMarks: boolean;
  showCardBorders: boolean;
  borderRadius: number;
  cardTheme: 'classic' | 'pastel' | 'vibrant' | 'minimal';
  items: EducationalCardItem[];
}

// ----------------------------------------------------
// 3. SUDOKU GENERATOR (Sudoku Enfants)
// ----------------------------------------------------
export type SudokuDifficulty = 'basic' | 'intermediate' | 'advanced';
export type SudokuGridSize = 4 | 6 | 9;

export interface SudokuPuzzle {
  id: string;
  size: SudokuGridSize;
  subRows: number;
  subCols: number;
  initialGrid: (number | null)[][];
  solutionGrid: number[][];
  difficulty: SudokuDifficulty;
}

// ----------------------------------------------------
// GLOBAL GAMES GENERATOR STATE
// ----------------------------------------------------
export interface GameGeneratorState {
  activeGame: GameType;
  language: 'fr' | 'en' | 'ar';
  paperFormat: 'A4' | 'Letter';
  paperOrientation: 'portrait' | 'landscape';
  
  // Header
  showHeader: boolean;
  title: string;
  subtitle: string;
  showStudentName: boolean;
  showDate: boolean;
  showInstructions: boolean;

  // Word Search Settings
  wordSearchTheme: WordSearchTheme;
  customWordList: string;
  wordSearchGridSize: number; // 8 to 16
  wordSearchDifficulty: WordSearchDifficulty;
  showWordBank: boolean;
  wordSearchLetterCase: 'upper' | 'lower';

  // Game Cards Settings
  cardsConfig: GameCardsConfig;

  // Sudoku Settings
  sudokuSize: SudokuGridSize;
  sudokuDifficulty: SudokuDifficulty;
  sudokuPuzzlesCount: number; // 1, 2, or 4 per page
  sudokuCellSize: 'normal' | 'large';

  // Output / View
  activeViewTab: 'game' | 'solution';
  zoom: number;
}
