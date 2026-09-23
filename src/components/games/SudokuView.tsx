import React from 'react';
import { SudokuPuzzle } from '../../types/games';

interface SudokuViewProps {
  puzzles: SudokuPuzzle[];
  isSolution: boolean;
  language: 'fr' | 'en' | 'ar';
  showInstructions: boolean;
}

export const SudokuView: React.FC<SudokuViewProps> = ({
  puzzles,
  isSolution,
  language,
  showInstructions,
}) => {
  const isArabic = language === 'ar';

  return (
    <div className="w-full flex flex-col items-center gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Instructions header for children */}
      {showInstructions && (
        <div className="w-full p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-xs">
          <p className="font-bold flex items-center gap-1.5 mb-1">
            <span>🎯</span>
            <span>
              {isArabic
                ? 'قَوَاعِدُ اللُّعْبَةِ لِلأَبْطَال :'
                : language === 'en'
                ? 'SUDOKU RULES FOR KIDS:'
                : 'RÈGLES DU SUDOKU POUR LES CHAMPIONS :'}
            </span>
          </p>
          <p className="opacity-90 leading-relaxed">
            {isArabic
              ? 'املأ كل صف، كل عمود، وكل مربع فرعي بالأرقام دون أن يتكرر أي رقم مرتين في نفس السطر أو المربع!'
              : language === 'en'
              ? 'Fill each row, column, and block with the correct numbers without repeating any number twice!'
              : 'Remplis chaque ligne, chaque colonne et chaque bloc avec les bons chiffres sans jamais répéter le même chiffre !'}
          </p>
        </div>
      )}

      {/* Grid of Puzzles (1, 2, or 4) */}
      <div
        className={`w-full grid gap-8 justify-items-center ${
          puzzles.length === 1
            ? 'grid-cols-1'
            : puzzles.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-2'
        }`}
      >
        {puzzles.map((puzzle, pIdx) => {
          const { size, subRows, subCols, initialGrid, solutionGrid } = puzzle;

          // Sizing based on puzzle count and size
          const cellSizeClass =
            size === 4
              ? puzzles.length === 1
                ? 'w-16 h-16 text-3xl'
                : 'w-12 h-12 text-2xl'
              : size === 6
              ? puzzles.length === 1
                ? 'w-12 h-12 text-2xl'
                : 'w-9 h-9 text-lg'
              : puzzles.length === 1
              ? 'w-9 h-9 text-lg'
              : 'w-7 h-7 text-sm';

          return (
            <div
              key={puzzle.id || pIdx}
              className="flex flex-col items-center p-3 bg-white rounded-xl border-2 border-slate-800 shadow-sm"
            >
              {/* Puzzle label */}
              <div className="w-full flex items-center justify-between mb-2 text-xs font-bold text-slate-600">
                <span>
                  {isArabic
                    ? `شَبَكَةُ سُودُوكُو ${pIdx + 1}`
                    : `GRILLE SUDOKU ${pIdx + 1}`}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 uppercase">
                  {size} × {size}
                </span>
              </div>

              {/* The Sudoku Board */}
              <div
                className="border-2 border-slate-900 bg-slate-900 inline-block"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                  gap: '1px',
                }}
              >
                {Array.from({ length: size }).map((_, r) =>
                  Array.from({ length: size }).map((__, c) => {
                    const initialVal = initialGrid[r][c];
                    const solVal = solutionGrid[r][c];
                    const isGiven = initialVal !== null;

                    // Compute borders for sub-grids
                    const isBottomSubBorder = (r + 1) % subRows === 0 && r + 1 < size;
                    const isRightSubBorder = (c + 1) % subCols === 0 && c + 1 < size;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`${cellSizeClass} flex items-center justify-center bg-white font-mono select-none font-black ${
                          isGiven
                            ? 'text-slate-900'
                            : isSolution
                            ? 'text-blue-600 bg-blue-50/50'
                            : 'text-transparent'
                        }`}
                        style={{
                          borderBottom: isBottomSubBorder
                            ? '3px solid #0f172a'
                            : undefined,
                          borderRight: isRightSubBorder
                            ? '3px solid #0f172a'
                            : undefined,
                        }}
                      >
                        {isSolution ? solVal : initialVal ?? ''}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Digits allowed helper bar */}
              <div className="mt-2 text-[10px] font-mono font-semibold text-slate-400">
                {Array.from({ length: size }, (_, i) => i + 1).join(' · ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
