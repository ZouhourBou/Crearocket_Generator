import React from 'react';
import { WordSearchGrid } from '../../types/games';

interface WordPuzzleViewProps {
  gridData: WordSearchGrid;
  isSolution: boolean;
  language: 'fr' | 'en' | 'ar';
  letterCase: 'upper' | 'lower';
  showWordBank: boolean;
  themeTitle: string;
}

export const WordPuzzleView: React.FC<WordPuzzleViewProps> = ({
  gridData,
  isSolution,
  language,
  letterCase,
  showWordBank,
  themeTitle,
}) => {
  const isArabic = language === 'ar';
  const { grid, size, placedWords } = gridData;

  // Build a lookup map of coordinates for highlighted solution cells
  const solutionCellMap = React.useMemo(() => {
    const map = new Map<string, { color: string; word: string }>();
    if (!isSolution) return map;

    for (const placement of placedWords) {
      const dRow =
        placement.endRow === placement.startRow
          ? 0
          : (placement.endRow - placement.startRow) / (placement.word.length - 1);
      const dCol =
        placement.endCol === placement.startCol
          ? 0
          : (placement.endCol - placement.startCol) / (placement.word.length - 1);

      for (let i = 0; i < placement.word.length; i++) {
        const r = placement.startRow + dRow * i;
        const c = placement.startCol + dCol * i;
        const key = `${r}_${c}`;
        if (!map.has(key)) {
          map.set(key, { color: placement.color, word: placement.originalWord });
        }
      }
    }
    return map;
  }, [placedWords, isSolution]);

  // Adjust cell sizing dynamically based on grid size (8x8 to 16x16)
  const cellSizeClass =
    size <= 8
      ? 'w-11 h-11 text-xl font-bold'
      : size <= 10
      ? 'w-9 h-9 text-lg font-bold'
      : size <= 12
      ? 'w-8 h-8 text-base font-semibold'
      : size <= 14
      ? 'w-7 h-7 text-sm font-semibold'
      : 'w-6 h-6 text-xs font-medium';

  return (
    <div className="flex flex-col items-center w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Grid Container */}
      <div
        className="p-3 bg-white rounded-xl border-2 border-slate-700 shadow-sm inline-block"
        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const sol = solutionCellMap.get(`${r}_${c}`);
              const displayChar =
                letterCase === 'lower' && !isArabic
                  ? letter.toLowerCase()
                  : letter;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`${cellSizeClass} flex items-center justify-center rounded-md transition-colors select-none font-mono ${
                    isArabic ? 'font-arabic' : ''
                  } ${
                    sol
                      ? 'border border-slate-400 font-extrabold shadow-inner'
                      : 'border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                  }`}
                  style={{
                    backgroundColor: sol ? sol.color : undefined,
                  }}
                  title={sol ? `Mot: ${sol.word}` : undefined}
                >
                  {displayChar}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Word Bank / List */}
      {showWordBank && (
        <div className="w-full mt-6 pt-4 border-t border-dashed border-slate-300">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-700">
              {isArabic
                ? `الْكَلِمَاتُ الْمَطْلُوبَة (${placedWords.length})`
                : language === 'en'
                ? `WORDS TO FIND (${placedWords.length})`
                : `MOTS À RETROUVER (${placedWords.length})`}
            </h4>
            <span className="text-xs text-slate-500 font-medium italic">
              {themeTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {placedWords.map((placement, idx) => {
              const wordText =
                letterCase === 'lower' && !isArabic
                  ? placement.originalWord.toLowerCase()
                  : placement.originalWord.toUpperCase();

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
                    isSolution
                      ? 'border-slate-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                  style={{
                    backgroundColor: isSolution ? `${placement.color}40` : undefined,
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-slate-400 shrink-0 inline-block"
                    style={{
                      backgroundColor: isSolution ? placement.color : 'transparent',
                    }}
                  />
                  <span className={`truncate ${isArabic ? 'font-arabic text-sm' : 'font-mono'}`}>
                    {wordText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
