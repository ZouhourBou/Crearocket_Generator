import React from 'react';
import {
  AlphabetLanguage,
  LetterMeta,
  CutPasteActivityConfig,
  DocumentStyle,
} from '../../../types/alphabet';

interface Props {
  language: AlphabetLanguage;
  meta: LetterMeta;
  config: CutPasteActivityConfig;
  instruction: string;
  style: DocumentStyle;
  showAnswerKey?: boolean;
}

export const ActivityCutAndPaste: React.FC<Props> = ({
  language,
  meta,
  config,
  instruction,
  style,
  showAnswerKey = false,
}) => {
  const isArabic = language === 'ar';
  const wordsToComplete = meta.words.slice(0, 3);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Activity Header with Badge and Instruction */}
      <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
          5
        </span>
        <h3 className="font-bold text-gray-800 text-sm tracking-tight leading-snug">
          {instruction}
        </h3>
      </div>

      {/* Main Crafting Workspace */}
      <div className="border border-amber-200/80 bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3.5">
        {/* Section A: Glue Target Area */}
        <div className="flex flex-col gap-2">
          <div className={`flex items-center justify-between text-xs font-bold text-amber-900 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <span>{isArabic ? '📌 منطقة الإلصاق :' : '📌 Zone de collage :'}</span>
            <span className="text-[11px] font-normal text-gray-500">
              {isArabic ? 'أكمل الكلمات بإلصاق الحرف المناسب' : 'Complète les mots en collant la lettre manquante'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {wordsToComplete.map((item, idx) => {
              // Word without the first letter
              const restOfWord = item.word.slice(1);

              return (
                <div
                  key={idx}
                  className={`border border-amber-100 rounded-xl bg-amber-50/20 p-2.5 flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  <span className="text-3xl shrink-0">{item.emoji}</span>

                  <div className={`flex items-center gap-1.5 flex-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    {/* Glue Box Slot */}
                    <div
                      className={`w-9 h-9 border-2 border-dashed rounded-lg flex items-center justify-center font-bold text-lg shrink-0 transition-colors ${
                        showAnswerKey
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-amber-400 bg-amber-50/60 text-amber-700'
                      }`}
                    >
                      {showAnswerKey ? (
                        meta.letter
                      ) : (
                        <span className="text-[9px] text-amber-600 font-normal text-center leading-none px-0.5">
                          {isArabic ? 'ألصق هنا' : 'Colle ici'}
                        </span>
                      )}
                    </div>

                    {/* Remainder of the word */}
                    <span className="font-extrabold text-gray-800 text-sm tracking-wide">
                      {restOfWord}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section B: Scissor Cut Line Divider */}
        <div className="relative py-2 my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 py-0.5 text-gray-500 font-bold border border-gray-200 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span>✂️</span>
              <span className="text-[10px] tracking-wide">
                {isArabic ? 'قُصَّ على طول الخط المنقّط' : 'Ligne de découpe aux ciseaux'}
              </span>
            </span>
          </div>
        </div>

        {/* Section C: Cut-out Tokens to be cut by child */}
        <div className="flex flex-col gap-1.5">
          <div className={`text-[11px] font-bold text-gray-500 ${isArabic ? 'text-right' : 'text-left'}`}>
            {isArabic ? '🏷️ بطاقات الحروف القابلة للقص :' : '🏷️ Étiquettes lettres à découper :'}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
            {wordsToComplete.map((_, idx) => (
              <div
                key={idx}
                className="relative w-12 h-12 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 flex items-center justify-center shadow-xs"
              >
                {/* Scissor icon in corner */}
                <span className="absolute top-0.5 left-1 text-[8px] text-gray-400 select-none">
                  ✂
                </span>
                <span className={`text-2xl font-black text-gray-800 ${isArabic ? 'font-serif' : ''}`}>
                  {meta.letter}
                </span>
              </div>
            ))}

            {/* 1 Extra Distractor Token */}
            <div className="relative w-12 h-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 flex items-center justify-center shadow-xs opacity-60">
              <span className="absolute top-0.5 left-1 text-[8px] text-gray-400 select-none">
                ✂
              </span>
              <span className={`text-2xl font-bold text-gray-400 ${isArabic ? 'font-serif' : ''}`}>
                {isArabic ? 'و' : 'O'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
