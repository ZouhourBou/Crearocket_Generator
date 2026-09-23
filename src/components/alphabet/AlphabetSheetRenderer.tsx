import React from 'react';
import {
  AlphabetGeneratorState,
  AlphabetActivityType,
  DocumentStyle,
} from '../../types/alphabet';
import { getLetterMeta } from '../../utils/alphabetData';
import { ActivityWritingTracing } from './activities/ActivityWritingTracing';
import { ActivityLetterSearch } from './activities/ActivityLetterSearch';
import { ActivityColoring } from './activities/ActivityColoring';
import { ActivityMatching } from './activities/ActivityMatching';
import { ActivityCutAndPaste } from './activities/ActivityCutAndPaste';
import { ActivityVocabulary } from './activities/ActivityVocabulary';

interface Props {
  state: AlphabetGeneratorState;
  pageIndex: number;
}

export const AlphabetSheetRenderer: React.FC<Props> = ({
  state,
  pageIndex,
}) => {
  const isArabic = state.language === 'ar';
  const meta = getLetterMeta(state.language, state.targetLetter);
  const isLandscape = state.paperOrientation === 'landscape';

  // Dimension in millimeters: A4 = 210 x 297 mm, Letter = 215.9 x 279.4 mm
  const paperDimensions =
    state.paperFormat === 'letter'
      ? isLandscape
        ? { width: '279.4mm', height: '215.9mm' }
        : { width: '215.9mm', height: '279.4mm' }
      : isLandscape
      ? { width: '297mm', height: '210mm' }
      : { width: '210mm', height: '297mm' };

  // Partition activities according to total page count
  // e.g. If 1 page: show up to 2 or 3 selected activities
  // If 2 pages: divide selected activities in half
  // If 3+ pages: allocate 1 or 2 per page
  const selected = state.selectedActivities;
  const totalPages = state.pageCount;

  const activitiesForThisPage: AlphabetActivityType[] = (() => {
    if (selected.length === 0) return ['writing'];
    if (totalPages === 1) {
      return selected.slice(0, 2); // 2 well-spaced activities fit without any overlap
    }
    const perPage = Math.ceil(selected.length / totalPages);
    const start = pageIndex * perPage;
    const pageItems = selected.slice(start, start + perPage);
    return pageItems.length > 0 ? pageItems : [selected[pageIndex % selected.length]];
  })();

  // Document Style classes
  const getStyleTheme = (style: DocumentStyle) => {
    switch (style) {
      case 'minimalist_clean':
        return {
          containerBorder: 'border-2 border-gray-900',
          headerBg: 'bg-transparent text-gray-900 border-b-2 border-gray-900',
          accentColor: 'text-gray-900',
          pageBg: 'bg-white',
        };
      case 'academic_classic':
        return {
          containerBorder: 'border-4 border-double border-slate-700',
          headerBg: 'bg-slate-50 border-b border-slate-300 text-slate-900',
          accentColor: 'text-slate-800',
          pageBg: 'bg-white',
        };
      case 'nature_animals':
        return {
          containerBorder: 'border-2 border-emerald-400 rounded-3xl',
          headerBg: 'bg-emerald-50/70 border-b border-emerald-200 text-emerald-950',
          accentColor: 'text-emerald-700',
          pageBg: 'bg-white',
        };
      case 'school_playful':
      default:
        return {
          containerBorder: 'border-2 border-indigo-300 rounded-2xl',
          headerBg: 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-b border-indigo-100 text-indigo-950',
          accentColor: 'text-indigo-600',
          pageBg: 'bg-white',
        };
    }
  };

  const theme = getStyleTheme(state.documentStyle);

  return (
    <div
      className={`relative mx-auto bg-white text-gray-900 box-border print:m-0 print:border-none shadow-xl print:shadow-none flex flex-col justify-between overflow-hidden select-none transition-all ${theme.pageBg}`}
      style={{
        width: paperDimensions.width,
        minHeight: paperDimensions.height,
        height: paperDimensions.height,
        padding: '12mm 14mm',
        boxSizing: 'border-box',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Outer Decorative Border Frame */}
      <div
        className={`w-full h-full flex flex-col justify-between p-4 box-border ${theme.containerBorder}`}
      >
        {/* ================= HEADER SECTION ================= */}
        <header className={`rounded-xl p-3 mb-3 ${theme.headerBg}`}>
          {/* Top Bar: Title & Big Letter Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mascot / Letter Badge */}
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-current flex items-center justify-center font-black text-2xl shadow-xs">
                <span>{meta.letter}</span>
              </div>

              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight leading-tight">
                  {state.headerConfig.customTitle ||
                    (isArabic
                      ? `كُرَّاسَةُ تَعَلُّمِ حَرْفِ (${meta.letter})`
                      : `Fiche d'apprentissage : La lettre ${meta.letter}`)}
                </h1>
                <div className="flex items-center gap-2 text-xs opacity-75 font-medium">
                  <span>
                    {isArabic
                      ? `المستوى : ${
                          state.pedagogicalLevel === 'ps'
                            ? 'روضة أولى (3-4 سنوات)'
                            : state.pedagogicalLevel === 'ms'
                            ? 'روضة ثانية (4-5 سنوات)'
                            : state.pedagogicalLevel === 'gs'
                            ? 'قسم تحضيري (5-6 سنوات)'
                            : 'سنة أولى ابتدائي'
                        }`
                      : `Niveau : ${
                          state.pedagogicalLevel === 'ps'
                            ? 'Petite Section (3-4 ans)'
                            : state.pedagogicalLevel === 'ms'
                            ? 'Moyenne Section (4-5 ans)'
                            : state.pedagogicalLevel === 'gs'
                            ? 'Grande Section (5-6 ans)'
                            : 'CP / Cycle 2'
                        }`}
                  </span>
                  <span>•</span>
                  <span>{meta.soundHint}</span>
                </div>
              </div>
            </div>

            {/* Evaluation Score Box */}
            {state.headerConfig.showScoreBox && (
              <div className="hidden sm:flex flex-col items-center bg-white px-2.5 py-1 rounded-lg border border-gray-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {isArabic ? 'التّقييم' : 'Évaluation'}
                </span>
                <span className="text-sm font-black text-amber-500">⭐⭐⭐</span>
              </div>
            )}
          </div>

          {/* Student Info Fields */}
          {(state.headerConfig.showStudentName ||
            state.headerConfig.showClass ||
            state.headerConfig.showDate ||
            state.headerConfig.showSubject) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 mt-2 border-t border-black/10 text-xs font-semibold">
              {state.headerConfig.showStudentName && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="opacity-70">{isArabic ? 'الاسم :' : 'Nom :'}</span>
                  <span className="flex-1 border-b border-dotted border-gray-400 h-4" />
                </div>
              )}
              {state.headerConfig.showClass && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="opacity-70">{isArabic ? 'القسم :' : 'Classe :'}</span>
                  <span className="flex-1 border-b border-dotted border-gray-400 h-4" />
                </div>
              )}
              {state.headerConfig.showDate && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="opacity-70">{isArabic ? 'التاريخ :' : 'Date :'}</span>
                  <span className="flex-1 border-b border-dotted border-gray-400 h-4" />
                </div>
              )}
              {state.headerConfig.showSubject && (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="opacity-70">{isArabic ? 'المادة :' : 'Matière :'}</span>
                  <span className="flex-1 border-b border-dotted border-gray-400 h-4">
                    {isArabic ? 'لغة عربية' : 'Français'}
                  </span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* ================= ACTIVITIES BODY ================= */}
        <main className="flex-1 flex flex-col justify-around gap-4 overflow-hidden py-1">
          {activitiesForThisPage.map((actType) => {
            const customInstr =
              state.instructions[actType] || `Activité ${actType}`;

            switch (actType) {
              case 'writing':
                return (
                  <ActivityWritingTracing
                    key="act-writing"
                    language={state.language}
                    meta={meta}
                    config={state.writingConfig}
                    instruction={customInstr}
                    style={state.documentStyle}
                    isCompact={activitiesForThisPage.length > 1}
                  />
                );
              case 'search':
                return (
                  <ActivityLetterSearch
                    key="act-search"
                    language={state.language}
                    meta={meta}
                    config={state.searchConfig}
                    instruction={customInstr}
                    style={state.documentStyle}
                    showAnswerKey={state.showAnswerKey}
                  />
                );
              case 'coloring':
                return (
                  <ActivityColoring
                    key="act-coloring"
                    language={state.language}
                    meta={meta}
                    config={state.coloringConfig}
                    instruction={customInstr}
                    style={state.documentStyle}
                  />
                );
              case 'matching':
                return (
                  <ActivityMatching
                    key="act-matching"
                    language={state.language}
                    meta={meta}
                    config={state.matchingConfig}
                    instruction={customInstr}
                    style={state.documentStyle}
                    showAnswerKey={state.showAnswerKey}
                  />
                );
              case 'cut_paste':
                return (
                  <ActivityCutAndPaste
                    key="act-cut-paste"
                    language={state.language}
                    meta={meta}
                    config={state.cutPasteConfig}
                    instruction={customInstr}
                    style={state.documentStyle}
                    showAnswerKey={state.showAnswerKey}
                  />
                );
              case 'vocabulary':
                return (
                  <ActivityVocabulary
                    key="act-vocabulary"
                    language={state.language}
                    meta={meta}
                    config={state.vocabularyConfig}
                    instruction={customInstr}
                    style={state.documentStyle}
                  />
                );
              default:
                return null;
            }
          })}
        </main>

        {/* ================= FOOTER SECTION ================= */}
        <footer className="mt-3 pt-2 border-t border-gray-200/80 flex items-center justify-between text-[10px] text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-700">CreatRocket Pro</span>
            <span>•</span>
            <span>
              {isArabic ? 'سلسلة الحروف الهجائية' : "Cahier d'apprentissage de l'alphabet"}
            </span>
          </div>

          {state.headerConfig.showPageNumber && (
            <div className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold border border-gray-200">
              {isArabic
                ? `صفحة ${pageIndex + 1} من ${state.pageCount}`
                : `Page ${pageIndex + 1} / ${state.pageCount}`}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};
