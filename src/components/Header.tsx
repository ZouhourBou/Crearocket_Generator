import React from 'react';
import { CreaRocketLogo } from './CreaRocketLogo';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onGenerateClick?: () => void;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onGenerateClick,
  currentRoute = '/',
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Official Brand Identity */}
        <div className="flex items-center min-w-0">
          <a
            href="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2 group transition-transform active:scale-95"
            title="CreaRocket Generator Pro"
          >
            <CreaRocketLogo className="h-10 sm:h-11 w-auto" />
          </a>
        </div>

        {/* Right: Actions & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Back to main Crearocket link with red background */}
          <a
            href="https://crearocket.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs hover:shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
            <span>{t.backToCrearocket}</span>
          </a>

          {/* Language Switcher: FR / EN symbols */}
          <div className="relative flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => onLanguageChange('fr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Français"
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
