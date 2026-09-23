import React, { useRef } from 'react';
import { GeneratorState, Language } from '../types';
import { computeLayout } from '../utils/layoutEngine';
import { HeroSection } from './HeroSection';
import { LabelTypeSelectorBar } from './LabelTypeSelectorBar';
import { DynamicForm } from './DynamicForm';
import { LivePaperPreview } from './LivePaperPreview';
import { BirthdayKitStudio } from './birthday/BirthdayKitStudio';
import { TRANSLATIONS } from '../constants/translations';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';

interface SchoolLabelsPageProps {
  state: GeneratorState;
  layout: ReturnType<typeof computeLayout>;
  onUpdateState: React.Dispatch<React.SetStateAction<GeneratorState>>;
  onNavigate: (route: string) => void;
  language: Language;
}

export const SchoolLabelsPage: React.FC<SchoolLabelsPageProps> = ({
  state,
  layout,
  onUpdateState,
  onNavigate,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';
  const generatorRef = useRef<HTMLDivElement>(null);

  const scrollToStudio = () => {
    if (generatorRef.current) {
      generatorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 1. Dedicated Top Navigation Bar: Breadcrumb ("fil d'ariane") */}
      <div className="bg-white/90 backdrop-blur-xs border-b border-slate-200/80 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="hover:text-red-600 transition-colors cursor-pointer"
            >
              Generator Pro
            </button>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isArabic ? 'rotate-180' : ''}`} />
            <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              {t.schoolLabelsTitle}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Visual Header for School Labels */}
      <HeroSection
        language={language}
        onCtaClick={scrollToStudio}
      />

      {/* 3. Main Generator Studio Workspace (Top: 3 Types Bar, Left: Form, Right: Live Preview) */}
      <main
        ref={generatorRef}
        id="generator-studio"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12"
      >
        {/* Top 3 Types Selector Bar */}
        <div id="types-selector-bar-container" className="mb-6 sm:mb-8">
          <LabelTypeSelectorBar
            state={state}
            onUpdateState={onUpdateState}
            language={language}
          />
        </div>

        {state.type === 'birthday_kit' ? (
          <div id="studio-birthday-start" className="scroll-mt-24">
            <BirthdayKitStudio
              language={language}
              onNavigateHome={() => onNavigate('/')}
            />
          </div>
        ) : (
          <div id="studio-form-start" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
            {/* Left Column: Adaptive Dynamic Form (5 cols) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <DynamicForm
                state={state}
                layout={layout}
                onUpdateState={onUpdateState}
              />
            </div>

            {/* Right Column: Sticky Live Paper Preview (7 cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-32">
              <LivePaperPreview
                state={state}
                layout={layout}
                onUpdateState={onUpdateState}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Quick Navigation back to Catalog */}
      <div className="bg-slate-100/80 border-t border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="font-semibold">CreatRocket Generator Pro</span>
            <span className="text-slate-400">•</span>
            <span>{isArabic ? 'استكشف بقية المولّدات التربوية' : 'Découvrez nos autres générateurs pédagogiques'}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs border border-slate-200 hover:border-red-200 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
            <span>{t.backToGenerators}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
