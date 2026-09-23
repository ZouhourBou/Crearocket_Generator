import React from 'react';
import { StorybookState, StoryPageTemplate } from './types';
import { getStoryTemplateById } from './StoryTemplateLibrary';
import { personalizeText } from './PersonalizationEngine';
import { StoryIllustration } from './StoryIllustrations';
import { Sparkles, Star, Heart, Bookmark } from 'lucide-react';

interface PageRendererProps {
  state: StorybookState;
  pageIndex: number; // 0 to pageCount - 1
  pageTemplate: StoryPageTemplate;
  isCover?: boolean;
  isBackCover?: boolean;
  isDedication?: boolean;
}

export const StorybookPageRenderer: React.FC<PageRendererProps> = ({
  state,
  pageIndex,
  pageTemplate,
  isCover = false,
  isBackCover = false,
  isDedication = false,
}) => {
  const isArabic = state.language === 'ar';
  const template = getStoryTemplateById(state.storyId);
  const child = state.child;

  // Retrieve raw text (either custom-edited or from template)
  const rawText =
    state.editedPages[pageIndex + 1] !== undefined
      ? state.editedPages[pageIndex + 1]
      : isArabic
      ? pageTemplate.textAr
      : state.language === 'en'
      ? pageTemplate.textEn
      : pageTemplate.textFr;

  // Resolve personalized placeholders with grammar agreement
  const personalizedContent = personalizeText(rawText, child, state.language);

  // Title on cover
  const bookTitle =
    state.customTitle ||
    (isArabic
      ? template.titleAr.replace('{{childName}}', child.name || 'لينا')
      : state.language === 'en'
      ? template.titleEn.replace('{{childName}}', child.name || 'Lily')
      : template.titleFr.replace('{{childName}}', child.name || 'Lina'));

  const bookSubtitle =
    isArabic ? template.subtitleAr : state.language === 'en' ? template.subtitleEn : template.subtitleFr;

  // Aspect ratio styling based on book format
  const formatAspectClass =
    state.bookFormat === 'square'
      ? 'aspect-square'
      : state.bookFormat === 'a4'
      ? 'aspect-[210/297]'
      : 'aspect-[148/210]';

  return (
    <div
      className={`relative w-full ${formatAspectClass} bg-white rounded-lg shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all print:shadow-none print:m-0`}
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{
        fontFamily: isArabic ? "'Cairo', 'Tajawal', sans-serif" : "'Quicksand', 'Nunito', sans-serif",
      }}
    >
      {/* Print Safety Guides & Bleed (conditional overlay) */}
      {state.showPrintGuides && (
        <div className="absolute inset-0 pointer-events-none z-40 border-2 border-dashed border-red-400/60 m-2">
          <div className="absolute top-1 left-2 text-[9px] font-bold text-red-500 bg-white/90 px-1 rounded">
            Zone de sécurité (Print Safe)
          </div>
          {/* Crop marks at corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />
        </div>
      )}

      {/* 1. FRONT COVER LAYOUT */}
      {isCover ? (
        <div className="relative w-full h-full flex flex-col justify-between text-white p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 overflow-hidden">
          {/* Background Illustration */}
          <div className="absolute inset-0 z-0">
            <StoryIllustration
              id={template.coverIllustrationId}
              themeColor={template.colorScheme.primary}
              className="w-full h-full object-cover"
            />
            {/* Soft gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/75" />
          </div>

          {/* Top: Header Badges & Series Label */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/90 text-slate-900 shadow-md backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {isArabic ? template.badgeAr : state.language === 'en' ? template.badgeEn : template.badgeFr}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300/90 drop-shadow-sm">
              {isArabic ? 'كتاب مخصص فاخر' : state.language === 'en' ? 'Premium Personalized Edition' : 'Édition Personnalisée'}
            </span>
          </div>

          {/* Middle/Bottom: Personalized Title, Child Protagonist & Subtitle */}
          <div className="relative z-10 text-center my-auto py-4">
            <div className="inline-block px-4 py-1.5 mb-3 rounded-full bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg uppercase tracking-wider">
              {isArabic ? `مغامرة خاصة بـ ${child.name || 'لينا'}` : `L'aventure extraordinaire de ${child.name || 'Lina'}`}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight leading-tight mb-2">
              {bookTitle}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-amber-100/90 max-w-sm mx-auto drop-shadow-sm leading-relaxed">
              {bookSubtitle}
            </p>
          </div>

          {/* Bottom Bar: Dedication snippet & Gold seal */}
          <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/20 text-white/90 text-[11px]">
            <span className="font-semibold truncate max-w-[200px]">
              {child.giftFrom ? (isArabic ? `مهدى من: ${child.giftFrom}` : `Offert par : ${child.giftFrom}`) : (isArabic ? 'قصة مصورة للأطفال' : 'Livre illustré pour enfants')}
            </span>
            <div className="flex items-center gap-1 font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{isArabic ? `${child.age} سنوات` : `${child.age} ans`}</span>
            </div>
          </div>
        </div>
      ) : isDedication ? (
        /* 2. DEDICATION PAGE (Page 2) */
        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-amber-50/40 text-slate-800 border-8 border-double border-amber-200/70">
          {/* Top Decorative Ornament */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto mb-2 shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-amber-700">
              {isArabic ? 'إهداء خاص' : state.language === 'en' ? 'Special Dedication' : 'Dédicace'}
            </h2>
          </div>

          {/* Center Card with Dedication Text */}
          <div className="my-auto bg-white/90 rounded-2xl p-6 shadow-sm border border-amber-200/80 text-center">
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed italic">
              « {personalizedContent} »
            </p>

            {child.giftFrom && (
              <div className="mt-6 pt-4 border-t border-amber-100 text-xs font-bold text-amber-800">
                {isArabic ? `بكل محبة من: ${child.giftFrom}` : `Avec tout notre amour, ${child.giftFrom}`}
              </div>
            )}
          </div>

          {/* Bottom Footer & Page Number */}
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold">
            <span>{isArabic ? 'طبعة تذكارية فريدة' : 'Exemplaire unique'}</span>
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              {pageIndex + 1}
            </span>
          </div>
        </div>
      ) : isBackCover ? (
        /* 3. BACK COVER LAYOUT */
        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
          <div className="text-center pt-4">
            <div className="inline-flex p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-amber-300 mx-auto mb-3">
              <Star className="w-6 h-6 fill-amber-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-amber-200">
              {bookTitle}
            </h3>
          </div>

          {/* Back summary blurb */}
          <div className="my-auto bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center">
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
              {personalizedContent}
            </p>
          </div>

          {/* Souvenir Badge & ISBN / Barcode look */}
          <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs text-slate-300">
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-amber-300">{child.name}</span>
              <span className="text-[10px] text-slate-400">
                {isArabic ? 'مجموعة الحكايات الفاخرة' : 'Collection Contes Merveilleux'}
              </span>
            </div>
            {/* Barcode decorative stamp */}
            <div className="flex gap-0.5 items-end h-7 bg-white p-1 rounded">
              <div className="w-1 h-full bg-slate-900" />
              <div className="w-0.5 h-full bg-slate-900" />
              <div className="w-1.5 h-full bg-slate-900" />
              <div className="w-0.5 h-full bg-slate-900" />
              <div className="w-1 h-full bg-slate-900" />
              <div className="w-1 h-full bg-slate-900" />
            </div>
          </div>
        </div>
      ) : (
        /* 4. INNER STORY PAGES (Page 3 to N-1) */
        <div className="relative w-full h-full flex flex-col justify-between bg-amber-50/20">
          {/* Upper: High-definition Scene Illustration */}
          <div className="relative w-full h-[58%] overflow-hidden bg-slate-100 border-b border-slate-100">
            <StoryIllustration
              id={pageTemplate.sceneIllustrationId}
              themeColor={template.colorScheme.primary}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lower: Readable Story Text Card */}
          <div className="relative flex-1 flex flex-col justify-between p-4 sm:p-5 bg-white">
            <div className="overflow-y-auto pr-1">
              <p className="text-xs sm:text-sm md:text-[15px] text-slate-800 leading-relaxed font-medium tracking-normal">
                {personalizedContent}
              </p>
            </div>

            {/* Bottom Page Number & Tiny Ornament */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-400 text-[11px] font-semibold">
              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                {bookTitle}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                {pageIndex + 1}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
