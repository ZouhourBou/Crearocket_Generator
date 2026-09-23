import React from 'react';
import { CreaRocketLogo } from './CreaRocketLogo';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs">
              <CreaRocketLogo variant="white" className="h-8 w-auto" />
            </div>
            <div>
              <p className="text-xs text-slate-200 font-bold">
                {t.platformTitle} — {t.platformSubtitle}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Outils de génération créative et supports d'apprentissage pour élèves, parents & enseignants.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://crearocket.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-200 hover:text-red-400 transition-colors"
            >
              Crearocket.com
            </a>
            <span>•</span>
            <span className="text-slate-400">Qualité Vectorielle 300 DPI</span>
            <span>•</span>
            <span className="text-slate-400">Impression Prête</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center">
          <p>{t.footerText}</p>
          <p className="flex items-center justify-center gap-1">
            Conçu pour l'écosystème <strong className="text-slate-300">Crearocket</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
