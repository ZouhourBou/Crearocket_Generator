import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface HeroSectionProps {
  language: Language;
  onCtaClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-slate-50/80 border-b border-slate-200/70 pt-4 pb-4 sm:pt-5 sm:pb-5" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Subtle brand radial glow */}
      <div className="absolute top-0 inset-x-0 h-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Title with exact 2.5rem font-size */}
        <h1 className="text-2xl sm:text-[2.5rem] font-black text-slate-900 tracking-tight leading-tight">
          {t.heroTitle}
        </h1>

        {/* Sub-description with refined color, smaller font size, and reduced margin */}
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
          {t.heroSubtitle}
        </p>
      </div>
    </section>
  );
};
