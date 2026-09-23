import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface HomeHeroSectionProps {
  language: Language;
  onExploreClick?: () => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/60 via-white to-slate-50/80 border-b border-slate-200/70 pt-6 pb-6 sm:pt-8 sm:pb-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Subtle brand radial glow */}
      <div className="absolute top-0 inset-x-0 h-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Large, bold Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          {t.generalHeroTitle}
        </h1>

        {/* Single-line concise subtitle */}
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          {t.generalHeroSubtitle}
        </p>
      </div>
    </section>
  );
};
