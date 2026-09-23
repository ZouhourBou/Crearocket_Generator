import { SudokuDifficulty, SudokuGridSize, SudokuPuzzle } from '../types/games';

/**
 * Validates whether a value can be placed at grid[row][col]
 */
function isValidPlacement(
  grid: number[][],
  size: number,
  subRows: number,
  subCols: number,
  row: number,
  col: number,
  val: number
): boolean {
  // Check Row & Column
  for (let i = 0; i < size; i++) {
    if (grid[row][i] === val && i !== col) return false;
    if (grid[i][col] === val && i !== row) return false;
  }

  // Check Sub-Grid Box
  const startRow = Math.floor(row / subRows) * subRows;
  const startCol = Math.floor(col / subCols) * subCols;

  for (let r = 0; r < subRows; r++) {
    for (let c = 0; c < subCols; c++) {
      const curR = startRow + r;
      const curC = startCol + c;
      if (grid[curR][curC] === val && (curR !== row || curC !== col)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Solves a Sudoku grid using backtracking, with a counter to ensure uniqueness.
 */
function countSolutions(
  grid: number[][],
  size: number,
  subRows: number,
  subCols: number,
  limit: number = 2
): number {
  let count = 0;

  function solve(): boolean {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) {
          for (let num = 1; num <= size; num++) {
            if (isValidPlacement(grid, size, subRows, subCols, r, c, num)) {
              grid[r][c] = num;
              if (solve()) {
                // If limit reached, return
                if (count >= limit) return true;
              }
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  solve();
  return count;
}

/**
 * Generates a complete valid solution using randomized backtracking
 */
function generateFullSolution(
  size: number,
  subRows: number,
  subCols: number
): number[][] {
  const grid: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0)
  );

  function fillGrid(): boolean {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) {
          // Shuffle numbers 1..size
          const numbers = Array.from({ length: size }, (_, i) => i + 1).sort(
            () => Math.random() - 0.5
          );

          for (const num of numbers) {
            if (isValidPlacement(grid, size, subRows, subCols, r, c, num)) {
              grid[r][c] = num;
              if (fillGrid()) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillGrid();
  return grid;
}

/**
 * Target clues count based on size and difficulty
 */
function getTargetClues(size: SudokuGridSize, diff: SudokuDifficulty): number {
  if (size === 4) {
    if (diff === 'basic') return 8;
    if (diff === 'intermediate') return 6;
    return 5;
  }
  if (size === 6) {
    if (diff === 'basic') return 22;
    if (diff === 'intermediate') return 18;
    return 15;
  }
  // size === 9
  if (diff === 'basic') return 42;
  if (diff === 'intermediate') return 34;
  return 28;
}

/**
 * Generate a valid, single-solution Sudoku puzzle
 */
export function generateSudokuPuzzle(
  size: SudokuGridSize = 4,
  difficulty: SudokuDifficulty = 'basic'
): SudokuPuzzle {
  const subRows = size === 4 ? 2 : size === 6 ? 2 : 3;
  const subCols = size === 4 ? 2 : size === 6 ? 3 : 3;

  // 1. Generate full solved grid
  const solution = generateFullSolution(size, subRows, subCols);

  // Copy solution to create puzzle with empty cells
  const puzzleGrid: number[][] = solution.map((row) => [...row]);
  const targetClues = getTargetClues(size, difficulty);
  const totalCells = size * size;
  const cellsToRemove = totalCells - targetClues;

  // List all positions and shuffle
  const positions: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => Math.random() - 0.5);

  let removedCount = 0;
  for (const [r, c] of positions) {
    if (removedCount >= cellsToRemove) break;

    const temp = puzzleGrid[r][c];
    puzzleGrid[r][c] = 0;

    // Check if still has unique solution
    const testCopy = puzzleGrid.map((row) => [...row]);
    const solutions = countSolutions(testCopy, size, subRows, subCols, 2);

    if (solutions === 1) {
      removedCount++;
    } else {
      // Revert if multiple solutions exist
      puzzleGrid[r][c] = temp;
    }
  }

  // Convert 0 to null for initialGrid representation
  const initialGrid: (number | null)[][] = puzzleGrid.map((row) =>
    row.map((val) => (val === 0 ? null : val))
  );

  return {
    id: `sudoku_${size}x${size}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    size,
    subRows,
    subCols,
    initialGrid,
    solutionGrid: solution,
    difficulty,
  };
}
