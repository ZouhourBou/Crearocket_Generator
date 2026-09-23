import React from 'react';
import {
  AlphabetLanguage,
  LetterMeta,
  MatchingActivityConfig,
  DocumentStyle,
} from '../../../types/alphabet';

interface Props {
  language: AlphabetLanguage;
  meta: LetterMeta;
  config: MatchingActivityConfig;
  instruction: string;
  style: DocumentStyle;
  showAnswerKey?: boolean;
}

export const ActivityMatching: React.FC<Props> = ({
  language,
  meta,
  config,
  instruction,
  style,
  showAnswerKey = false,
}) => {
  const isArabic = language === 'ar';

  // Words that start with target letter
  const targetWords = meta.words.slice(0, Math.min(3, meta.words.length));

  // Add 1 or 2 distractors from other letters
  const distractorWord = isArabic
    ? { word: 'سَيَّارَةٌ', emoji: '🚗', translation: 'Voiture', isMatch: false }
    : { word: 'Ballon', emoji: '⚽', translation: '', isMatch: false };

  // Combine items for matching
  const matchingItems = [
    ...targetWords.map((w) => ({ ...w, isMatch: true })),
    distractorWord,
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Activity Header with Badge and Instruction */}
      <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
          4
        </span>
        <h3 className="font-bold text-gray-800 text-sm tracking-tight leading-snug">
          {instruction}
        </h3>
      </div>

      {/* Main Matching Area */}
      <div className="border border-emerald-200/80 bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className={`flex items-center justify-between gap-6 py-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
          {/* Left Column: Target Letter Hub */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <span className={`text-4xl font-extrabold ${isArabic ? 'font-serif' : ''}`}>
                {meta.letter}
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800">
              {isArabic ? `حرف (${meta.letter})` : `Lettre ${meta.letter}`}
            </span>
          </div>

          {/* Center Connection Lines Illustration */}
          <div className="flex-1 flex flex-col justify-around h-full py-2 border-x border-dashed border-gray-200 px-3 min-h-[140px]">
            {matchingItems.map((item, idx) => {
              const isCorrectMatch = item.isMatch;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between py-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  {/* Left Anchor Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      showAnswerKey && isCorrectMatch
                        ? 'border-emerald-500 bg-emerald-500 ring-2 ring-emerald-200'
                        : 'border-emerald-400 bg-white'
                    }`}
                  />

                  {/* Connecting Line Guide */}
                  <div
                    className={`flex-1 mx-2 border-b-2 border-dotted transition-colors ${
                      showAnswerKey && isCorrectMatch
                        ? 'border-emerald-500 border-solid opacity-100'
                        : 'border-gray-200 opacity-60'
                    }`}
                  />

                  {/* Right Anchor Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      showAnswerKey && isCorrectMatch
                        ? 'border-emerald-500 bg-emerald-500 ring-2 ring-emerald-200'
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Cards to Match */}
          <div className="flex flex-col gap-2 min-w-[130px] sm:min-w-[150px]">
            {matchingItems.map((item, idx) => {
              const isCorrectMatch = item.isMatch;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                    showAnswerKey && isCorrectMatch
                      ? 'border-emerald-400 bg-emerald-50/80 shadow-xs'
                      : 'border-gray-200 bg-gray-50/50'
                  } ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-gray-800 truncate">
                      {item.word}
                    </span>
                    {item.translation && (
                      <span className="text-[10px] text-gray-400 truncate">
                        {item.translation}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer guideline */}
        <div className={`flex items-center justify-between text-[11px] text-emerald-800/80 bg-emerald-50/60 px-3 py-1 rounded-lg border border-emerald-100 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>
            {isArabic
              ? `💡 تلميح: صِلِ الحرف بالصّور التي تبدأ بصوت (${meta.letter}) فقط واحذر المشتتات!`
              : `💡 Astuce : Relie uniquement les images dont le nom commence par le son [${meta.letter}] !`}
          </span>
          {showAnswerKey && (
            <span className="font-bold text-emerald-700">✓ Corrigé affiché</span>
          )}
        </div>
      </div>
    </div>
  );
};
