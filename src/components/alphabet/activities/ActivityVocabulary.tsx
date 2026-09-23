import React from 'react';
import {
  AlphabetLanguage,
  LetterMeta,
  VocabularyActivityConfig,
  DocumentStyle,
} from '../../../types/alphabet';

interface Props {
  language: AlphabetLanguage;
  meta: LetterMeta;
  config: VocabularyActivityConfig;
  instruction: string;
  style: DocumentStyle;
}

export const ActivityVocabulary: React.FC<Props> = ({
  language,
  meta,
  config,
  instruction,
  style,
}) => {
  const isArabic = language === 'ar';
  const displayWords = meta.words.slice(0, config.wordsCount || 3);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Activity Header with Badge and Instruction */}
      <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
          6
        </span>
        <h3 className="font-bold text-gray-800 text-sm tracking-tight leading-snug">
          {instruction}
        </h3>
      </div>

      {/* Main Vocabulary Showcase */}
      <div className="border border-violet-200/80 bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className={`grid grid-cols-1 sm:grid-cols-${displayWords.length > 2 ? '3' : '2'} gap-3`}>
          {displayWords.map((wordItem, idx) => {
            const firstChar = wordItem.word.charAt(0);
            const remainingChars = wordItem.word.slice(1);

            return (
              <div
                key={idx}
                className="border border-violet-100 rounded-xl bg-violet-50/20 p-3 flex flex-col items-center justify-between gap-2.5 text-center shadow-2xs hover:border-violet-300 transition-colors"
              >
                {/* Illustration Card */}
                <div className="w-16 h-16 rounded-xl bg-white border border-violet-100 flex items-center justify-center text-4xl shadow-xs">
                  {wordItem.emoji}
                </div>

                {/* Word with initial letter highlighted */}
                <div className="flex flex-col items-center">
                  <div className={`text-base font-black tracking-wide ${isArabic ? 'font-serif text-lg' : ''}`}>
                    {/* Highlighted target letter */}
                    <span className="text-violet-600 underline decoration-violet-300 decoration-2 font-black">
                      {firstChar}
                    </span>
                    <span className="text-gray-900">{remainingChars}</span>
                  </div>

                  {wordItem.translation && (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {wordItem.translation}
                    </span>
                  )}
                  {wordItem.phonetic && (
                    <span className="text-[10px] text-violet-700/70 font-mono">
                      {wordItem.phonetic}
                    </span>
                  )}
                </div>

                {/* Tracing or repetition line */}
                {config.showTracing && (
                  <div className="w-full border-t border-dashed border-violet-200 pt-2 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {isArabic ? 'تدرّب على كتابة الكلمة :' : 'Trace le mot :'}
                    </span>
                    <div className="w-full border-b-2 border-dotted border-violet-300 py-0.5 text-center text-xs text-violet-400 font-serif tracking-widest opacity-80">
                      {wordItem.cleanWord || wordItem.word}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Evaluation star box */}
        <div className={`flex items-center justify-between text-[11px] text-violet-900/80 bg-violet-50/60 px-3 py-1.5 rounded-lg border border-violet-100 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>
            {isArabic
              ? `⭐ أحسنت! اقرأ الكلمات بصوت واضح وضع علامة في النّجمة`
              : `⭐ Bravo ! Lis les mots à voix haute et colorie l'étoile quand tu as réussi !`}
          </span>
          <span className="font-bold text-violet-600">⭐⭐⭐</span>
        </div>
      </div>
    </div>
  );
};
