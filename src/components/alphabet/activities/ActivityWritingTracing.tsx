import React from 'react';
import {
  AlphabetLanguage,
  LetterMeta,
  WritingActivityConfig,
  DocumentStyle,
} from '../../../types/alphabet';

interface Props {
  language: AlphabetLanguage;
  meta: LetterMeta;
  config: WritingActivityConfig;
  instruction: string;
  style: DocumentStyle;
  isCompact?: boolean;
}

export const ActivityWritingTracing: React.FC<Props> = ({
  language,
  meta,
  config,
  instruction,
  style,
  isCompact = false,
}) => {
  const isArabic = language === 'ar';

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Activity Header with Badge and Instruction */}
      <div className={`flex items-center gap-2.5 ${isArabic ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
          1
        </span>
        <h3 className="font-bold text-gray-800 text-sm tracking-tight leading-snug">
          {instruction}
        </h3>
      </div>

      {/* Main Tracing Grid Box */}
      <div className="border border-indigo-200/80 bg-white rounded-xl p-3 shadow-xs flex flex-col gap-3">
        {/* Model Letter Showcase Bar */}
        <div className={`flex items-center justify-between border-b border-indigo-50 pb-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
            {/* Big Model Letter with directional guide */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-300 flex items-center justify-center shrink-0 shadow-xs">
              <span className={`text-4xl font-extrabold text-indigo-900 ${isArabic ? 'font-serif' : ''}`}>
                {meta.letter}
              </span>
              {config.showArrows && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                  1 ➔
                </span>
              )}
            </div>

            {/* Model details / hints */}
            <div className={`flex flex-col ${isArabic ? 'items-end text-right' : 'items-start text-left'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  {isArabic ? meta.nameAr : `Lettre ${meta.letter}`}
                </span>
                {!isArabic && meta.lowercase && (
                  <span className="text-xs text-gray-500 font-medium">
                    (minuscule: <b className="text-indigo-900">{meta.lowercase}</b>)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-500 line-clamp-1">
                {meta.soundHint}
              </span>
            </div>
          </div>

          {/* Stroke instructions pill */}
          <div className="hidden sm:flex flex-col text-[10px] text-indigo-700/80 bg-indigo-50/70 border border-indigo-100 rounded-lg px-2.5 py-1 max-w-[200px]">
            {meta.strokeGuide.map((step, idx) => (
              <span key={idx} className="truncate">
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Tracing Rows */}
        {isArabic && meta.contextualForms ? (
          /* Arabic Contextual Forms Rows (Isolée, Initiale, Médiane, Finale) */
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-indigo-800 bg-indigo-50/60 py-1 rounded-lg">
              <div>منفصلة (Isolée)</div>
              <div>في أول الكلمة (Initiale)</div>
              <div>في وسط الكلمة (Médiane)</div>
              <div>في آخر الكلمة (Finale)</div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'منفصلة', char: meta.contextualForms.isolated },
                { label: 'أول الكلمة', char: meta.contextualForms.initial },
                { label: 'وسط الكلمة', char: meta.contextualForms.medial },
                { label: 'آخر الكلمة', char: meta.contextualForms.final },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative border border-indigo-100 rounded-lg bg-indigo-50/20 p-2 flex flex-col items-center justify-center min-h-[70px] overflow-hidden"
                >
                  {/* Baseline guide line */}
                  <div className="absolute top-[65%] left-0 right-0 border-b border-indigo-400 border-dashed opacity-40" />

                  {/* Model & Dotted repetitions */}
                  <div className="flex items-center justify-around w-full z-10">
                    <span className="text-2xl font-bold text-indigo-900 font-serif">
                      {item.char}
                    </span>
                    <span className="text-2xl font-normal text-indigo-300 font-serif border-b border-dotted border-indigo-400">
                      {item.char}
                    </span>
                    <span className="text-2xl font-light text-gray-300 font-serif">
                      {item.char}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra free handwriting row on baseline */}
            {config.showFreeLine && (
              <div className="relative border-b-2 border-indigo-400 bg-indigo-50/10 rounded-sm h-9 flex items-center justify-between px-3 text-xs text-gray-400">
                <span className="text-indigo-400 font-serif text-lg">{meta.letter}</span>
                <span className="italic text-[10px] text-gray-400">
                  {isArabic ? 'اكتب الحرف بمفردك هنا ✏️' : 'Écris la lettre librement ici ✏️'}
                </span>
                <span className="opacity-0">.</span>
              </div>
            )}
          </div>
        ) : (
          /* French / Latin Tracing Rows (Uppercase & Lowercase) */
          <div className="flex flex-col gap-3">
            {/* Row 1: Uppercase */}
            {(config.caseType === 'both' || config.caseType === 'uppercase') && (
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-bold text-gray-600 flex items-center justify-between">
                  <span>Majuscule ({meta.letter})</span>
                  <span className="text-gray-400 text-[10px]">Repasse sur les pointillés puis écris</span>
                </div>
                <div className="relative border border-indigo-100 rounded-lg bg-indigo-50/10 p-2 flex items-center justify-between overflow-hidden h-12">
                  {/* Pedagogical Ruling Lines */}
                  <div className="absolute inset-x-0 top-1/4 border-b border-indigo-100" />
                  <div className="absolute inset-x-0 top-1/2 border-b border-indigo-200 border-dashed" />
                  <div className="absolute inset-x-0 top-3/4 border-b-2 border-indigo-400" />

                  {/* Letters repeated */}
                  <span className="text-2xl font-extrabold text-indigo-900 z-10 pl-2">
                    {meta.letter}
                  </span>
                  <span className="text-2xl font-normal text-indigo-400/80 z-10 border-b border-dotted border-indigo-400">
                    {meta.letter}
                  </span>
                  <span className="text-2xl font-normal text-indigo-300 z-10">
                    {meta.letter}
                  </span>
                  <span className="text-2xl font-light text-gray-300 z-10">
                    {meta.letter}
                  </span>
                  <span className="text-2xl font-light text-gray-200 z-10">
                    {meta.letter}
                  </span>
                  <div className="w-8 h-8 rounded border border-dashed border-gray-300 z-10" />
                </div>
              </div>
            )}

            {/* Row 2: Lowercase */}
            {(config.caseType === 'both' || config.caseType === 'lowercase') && meta.lowercase && (
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-bold text-gray-600 flex items-center justify-between">
                  <span>Minuscule ({meta.lowercase})</span>
                  <span className="text-gray-400 text-[10px]">Ligne d'écriture réglée</span>
                </div>
                <div className="relative border border-indigo-100 rounded-lg bg-indigo-50/10 p-2 flex items-center justify-between overflow-hidden h-12">
                  {/* Pedagogical Ruling Lines */}
                  <div className="absolute inset-x-0 top-1/4 border-b border-indigo-100" />
                  <div className="absolute inset-x-0 top-1/2 border-b border-indigo-200 border-dashed" />
                  <div className="absolute inset-x-0 top-3/4 border-b-2 border-indigo-400" />

                  {/* Letters repeated */}
                  <span className="text-xl font-bold text-indigo-900 z-10 pl-2 font-mono">
                    {meta.lowercase}
                  </span>
                  <span className="text-xl font-normal text-indigo-400/80 z-10 border-b border-dotted border-indigo-400 font-mono">
                    {meta.lowercase}
                  </span>
                  <span className="text-xl font-normal text-indigo-300 z-10 font-mono">
                    {meta.lowercase}
                  </span>
                  <span className="text-xl font-light text-gray-300 z-10 font-mono">
                    {meta.lowercase}
                  </span>
                  <span className="text-xl font-light text-gray-200 z-10 font-mono">
                    {meta.lowercase}
                  </span>
                  <div className="w-8 h-8 rounded border border-dashed border-gray-300 z-10" />
                </div>
              </div>
            )}

            {/* Row 3: Free writing line */}
            {config.showFreeLine && (
              <div className="relative border-b-2 border-indigo-400 bg-indigo-50/10 rounded-sm h-8 flex items-center justify-between px-3 text-xs text-gray-400">
                <span className="text-indigo-400 font-bold text-sm">{meta.letter}</span>
                <span className="italic text-[10px] text-gray-400">
                  Zone d'écriture libre ✏️
                </span>
                <span className="opacity-0">.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
