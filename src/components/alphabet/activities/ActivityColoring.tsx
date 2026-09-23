import React from 'react';
import {
  AlphabetLanguage,
  LetterMeta,
  ColoringActivityConfig,
  DocumentStyle,
} from '../../../types/alphabet';

interface Props {
  language: AlphabetLanguage;
  meta: LetterMeta;
  config: ColoringActivityConfig;
  instruction: string;
  style: DocumentStyle;
}

export const ActivityColoring: React.FC<Props> = ({
  language,
  meta,
  config,
  instruction,
  style,
}) => {
  const isArabic = language === 'ar';
  const primaryWord = meta.words[0] || {
    word: meta.letter,
    emoji: '⭐',
    translation: '',
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Activity Header with Badge and Instruction */}
      <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
          3
        </span>
        <h3 className="font-bold text-gray-800 text-sm tracking-tight leading-snug">
          {instruction}
        </h3>
      </div>

      {/* Main Coloring Stage */}
      <div className="border border-rose-200/80 bg-white rounded-xl p-4 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {/* Giant Outline Letter for coloring */}
          <div className="flex items-center justify-center gap-4">
            {/* Primary Letter in Giant Outline */}
            <div className="relative flex flex-col items-center">
              <svg
                viewBox="0 0 140 140"
                className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xs"
              >
                {/* Decorative coloring bubbles */}
                <circle cx="20" cy="25" r="7" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="120" cy="30" r="9" fill="none" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="15" cy="115" r="8" fill="none" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="125" cy="110" r="6" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="2 2" />

                {/* Main Hollow Letter */}
                <text
                  x="70"
                  y={isArabic ? '90' : '105'}
                  textAnchor="middle"
                  fill="#ffffff"
                  stroke="#1e293b"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={`text-[96px] font-black select-none ${isArabic ? 'font-serif' : 'font-sans'}`}
                  style={{
                    paintOrder: 'stroke fill',
                  }}
                >
                  {meta.letter}
                </text>
              </svg>
              <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                {isArabic ? meta.nameAr : `Majuscule`}
              </span>
            </div>

            {/* If French and lowercase requested */}
            {!isArabic && config.showLowercase && meta.lowercase && (
              <div className="relative flex flex-col items-center">
                <svg
                  viewBox="0 0 100 120"
                  className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-xs"
                >
                  <text
                    x="50"
                    y="85"
                    textAnchor="middle"
                    fill="#ffffff"
                    stroke="#1e293b"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="text-[76px] font-black select-none font-sans"
                    style={{
                      paintOrder: 'stroke fill',
                    }}
                  >
                    {meta.lowercase}
                  </text>
                </svg>
                <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                  Minuscule
                </span>
              </div>
            )}
          </div>

          {/* Decorative Divider */}
          <div className="hidden sm:block w-px h-28 bg-rose-100" />

          {/* Associated Illustration for Coloring */}
          {config.includeIllustration && (
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/20 max-w-[200px] text-center">
              {/* Mascot / Object */}
              <div className="w-24 h-24 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-5xl shadow-xs">
                {primaryWord.emoji}
              </div>

              {/* Word with initial highlighted */}
              <div className="mt-2 text-center">
                <span className="text-base font-extrabold text-gray-900 tracking-wide">
                  <span className="text-rose-600 underline decoration-rose-300 decoration-2">
                    {primaryWord.word.charAt(0)}
                  </span>
                  {primaryWord.word.slice(1)}
                </span>
                {primaryWord.translation && (
                  <span className="block text-[11px] text-gray-400 italic">
                    ({primaryWord.translation})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Child coloring palette icons */}
        <div className={`flex items-center justify-between text-[11px] text-rose-800/80 bg-rose-50/60 px-3 py-1.5 rounded-lg border border-rose-100 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>🎨 {isArabic ? 'استخدم ألوانك المفضلة لتلوين الحرف والرسمة' : 'Utilise tes plus beaux crayons pour colorier la lettre !'}</span>
          <span className="font-semibold text-rose-700">🖍️ ⭐ ✨</span>
        </div>
      </div>
    </div>
  );
};
