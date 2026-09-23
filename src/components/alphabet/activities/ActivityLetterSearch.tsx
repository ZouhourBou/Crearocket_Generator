import React, { useMemo } from 'react';
import {
  AlphabetLanguage,
  LetterMeta,
  SearchActivityConfig,
  DocumentStyle,
} from '../../../types/alphabet';
import { generateLetterSearchGrid } from '../../../utils/alphabetData';

interface Props {
  language: AlphabetLanguage;
  meta: LetterMeta;
  config: SearchActivityConfig;
  instruction: string;
  style: DocumentStyle;
  showAnswerKey?: boolean;
}

export const ActivityLetterSearch: React.FC<Props> = ({
  language,
  meta,
  config,
  instruction,
  style,
  showAnswerKey = false,
}) => {
  const isArabic = language === 'ar';

  // Memoize search grid generation
  const gridItems = useMemo(() => {
    return generateLetterSearchGrid(
      language,
      meta.letter,
      config.totalLetters,
      config.targetCount,
      config.difficulty
    );
  }, [language, meta.letter, config.totalLetters, config.targetCount, config.difficulty]);

  const targetCountInGrid = gridItems.filter((i) => i.isTarget).length;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Activity Header with Badge and Instruction */}
      <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            2
          </span>
          <h3 className="font-bold text-gray-800 text-sm tracking-tight leading-snug">
            {instruction}
          </h3>
        </div>

        {/* Counter challenge badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>{isArabic ? 'المجموع :' : 'Total :'}</span>
          <span className="w-6 h-5 border border-dashed border-blue-400 bg-white rounded flex items-center justify-center font-bold text-blue-900">
            {showAnswerKey ? targetCountInGrid : ''}
          </span>
        </div>
      </div>

      {/* Grid of Letters */}
      <div className="border border-blue-200/80 bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3">
        <div
          className="grid gap-2.5 justify-items-center"
          style={{
            gridTemplateColumns: `repeat(${config.gridColumns || 5}, minmax(0, 1fr))`,
          }}
        >
          {gridItems.map((item) => {
            const isHighlighted = showAnswerKey && item.isTarget;

            return (
              <div
                key={item.id}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-extrabold text-xl sm:text-2xl transition-all border ${
                  isHighlighted
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/40 shadow-xs'
                    : 'border-gray-200/90 bg-gray-50/50 text-gray-800 hover:border-blue-300'
                } ${isArabic ? 'font-serif' : ''}`}
              >
                {item.char}

                {/* Answer key circle indicator */}
                {isHighlighted && (
                  <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none scale-105" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom hint or encouragement */}
        <div className={`flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>
            {isArabic
              ? `🎯 الهدف: العثور على جميع حروف (${meta.letter}) في الشبكة`
              : `🎯 Objectif : Trouve toutes les lettres ${meta.letter} dans la grille`}
          </span>
          {showAnswerKey && (
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {isArabic ? `تم العثور على ${targetCountInGrid} حروف` : `${targetCountInGrid} trouvées`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
