import React from 'react';
import { GeneratorState, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { transitionModuleState, GeneratorModule } from '../utils/moduleTransitions';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LabelTypeSelectorBarProps {
  state: GeneratorState;
  onUpdateState: (updater: (prev: GeneratorState) => GeneratorState) => void;
  language: Language;
}

export const LabelTypeSelectorBar: React.FC<LabelTypeSelectorBarProps> = ({
  state,
  onUpdateState,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  const isSuppliesActive =
    state.type === 'supplies' && (state.schoolLabelType || 'supplies') === 'supplies';
  const isBooksActive =
    state.type === 'supplies' && state.schoolLabelType === 'books';
  const isNotebookActive = state.type === 'notebook_cover';
  const isBirthdayActive = state.type === 'birthday_kit';

  const handleSelect = (targetModule: GeneratorModule) => {
    onUpdateState((prev) => transitionModuleState(prev, targetModule));

    // Smoothly scroll to frame the studio workspace exactly as in the capture:
    // Keeps the 3 type selector cards (with their titles, badges & outline) clearly in view at the top,
    // while displaying Step 1 (Language), Step 2 (Size), and the Live Preview right below.
    setTimeout(() => {
      const selectorElement = document.getElementById('types-selector-bar-container');
      if (selectorElement) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 72;
        const breadcrumb = document.querySelector('nav')?.closest('div.sticky');
        const breadcrumbHeight = breadcrumb ? breadcrumb.getBoundingClientRect().height : 36;
        const totalStickyOffset = headerHeight + breadcrumbHeight;

        // Position so the top of the cards aligns comfortably below the sticky bars,
        // with a ~40px shift so the titles and badges sit clearly visible at the top.
        const rect = selectorElement.getBoundingClientRect();
        const targetY = rect.top + window.pageYOffset - totalStickyOffset + 40;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  return (
    <div className="w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Type 1: Étiquette fournitures (2 lignes) */}
        <motion.button
          type="button"
          id="btn-select-supplies"
          whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={() => handleSelect('supplies')}
          className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-colors cursor-pointer relative bg-white w-full ${
            isSuppliesActive
              ? 'border-red-600 shadow-md ring-2 ring-red-500/15'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          {isSuppliesActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`absolute top-3.5 ${isArabic ? 'left-3.5' : 'right-3.5'} text-red-600`}
            >
              <CheckCircle2 className="w-5 h-5 fill-red-600 text-white" />
            </motion.div>
          )}

          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl shadow-2xs mb-2.5 shrink-0 transition-transform group-hover:scale-105">
            ✏️
          </div>

          <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1.5 text-center">
            {t.schoolLabelTypes.supplies.name}
          </h4>

          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold tracking-tight">
              {isArabic ? 'سطران' : language === 'en' ? '2 lines' : '2 lignes'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed text-center max-w-[280px]">
            {t.schoolLabelTypes.supplies.desc}
          </p>
        </motion.button>

        {/* Type 2: Étiquette cahier & livres (4 lignes) */}
        <motion.button
          type="button"
          id="btn-select-books"
          whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={() => handleSelect('school_books')}
          className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-colors cursor-pointer relative bg-white w-full ${
            isBooksActive
              ? 'border-red-600 shadow-md ring-2 ring-red-500/15'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          {isBooksActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`absolute top-3.5 ${isArabic ? 'left-3.5' : 'right-3.5'} text-red-600`}
            >
              <CheckCircle2 className="w-5 h-5 fill-red-600 text-white" />
            </motion.div>
          )}

          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl shadow-2xs mb-2.5 shrink-0 transition-transform group-hover:scale-105">
            📚
          </div>

          <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1.5 text-center">
            {t.schoolLabelTypes.books.name}
          </h4>

          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold tracking-tight">
              {isArabic ? '4 أسطر' : language === 'en' ? '4 lines' : '4 lignes'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed text-center max-w-[280px]">
            {t.schoolLabelTypes.books.desc}
          </p>
        </motion.button>

        {/* Type 3: واجهة كراس (Couverture de cahier) */}
        <motion.button
          type="button"
          id="btn-select-notebook-cover"
          whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={() => handleSelect('notebook_cover')}
          className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-colors cursor-pointer relative bg-white w-full ${
            isNotebookActive
              ? 'border-red-600 shadow-md ring-2 ring-red-500/15'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          {isNotebookActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`absolute top-3.5 ${isArabic ? 'left-3.5' : 'right-3.5'} text-red-600`}
            >
              <CheckCircle2 className="w-5 h-5 fill-red-600 text-white" />
            </motion.div>
          )}

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl shadow-2xs mb-2.5 shrink-0 transition-transform group-hover:scale-105">
            📒
          </div>

          <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mb-0.5 text-center">
            {isArabic ? 'واجهة كراس' : language === 'en' ? 'Notebook Cover' : 'واجهة كراس'}
          </h4>

          <div className="mb-2">
            <span className="font-bold text-sm text-slate-800 block text-center">
              {isArabic ? '(غلاف كراس)' : '(Couverture de cahier)'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed text-center max-w-[280px]">
            {isArabic
              ? 'أنشئ واجهة كراس مخصصة وأنيقة لكراسك المدرسي.'
              : language === 'en'
              ? 'Create a personalized and elegant cover for your notebook.'
              : 'Créez une couverture personnalisée et élégante pour votre cahier.'}
          </p>
        </motion.button>

        {/* Type 4: Kits Anniversaire */}
        <motion.button
          type="button"
          id="btn-select-birthday-kit"
          whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          onClick={() => handleSelect('birthday_kit')}
          className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-colors cursor-pointer relative bg-white w-full ${
            isBirthdayActive
              ? 'border-pink-600 shadow-md ring-2 ring-pink-500/15'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          {isBirthdayActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`absolute top-3.5 ${isArabic ? 'left-3.5' : 'right-3.5'} text-pink-600`}
            >
              <CheckCircle2 className="w-5 h-5 fill-pink-600 text-white" />
            </motion.div>
          )}

          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl shadow-2xs mb-2.5 shrink-0 transition-transform group-hover:scale-105">
            🎂
          </div>

          <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1.5 text-center">
            {isArabic ? 'باقة أعياد الميلاد' : language === 'en' ? 'Birthday Kits' : 'Kits anniversaire'}
          </h4>

          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold tracking-tight">
              {isArabic ? '8 منتجات في باقة واحدة' : language === 'en' ? '8 Products in 1 Kit' : '8 produits en 1'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed text-center max-w-[280px]">
            {isArabic
              ? 'دعوات، لافتات، ملصقات هدايا، وتوبرز متناسقة بالكامل.'
              : language === 'en'
              ? 'Invitations, posters, gift labels, and coordinated toppers.'
              : 'Invitations, affiches, étiquettes cadeaux et toppers coordonnés.'}
          </p>
        </motion.button>
      </div>
    </div>
  );
};
