import React, { useState } from 'react';
import { Language } from '../../types';
import { StorybookState } from './types';
import { StorybookConfigPanel } from './StorybookConfigPanel';
import { StorybookPreview } from './StorybookPreview';
import { Header } from '../../components/Header';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
  onNavigate: (route: string) => void;
}

export const PersonalizedStorybookPage: React.FC<Props> = ({
  language,
  onNavigate,
}) => {
  const [state, setState] = useState<StorybookState>(() => ({
    generationMode: 'templates',
    storyId: 'magical_forest',
    pageCount: 8,
    bookFormat: 'a5',
    language: language,
    child: {
      name: language === 'ar' ? 'لينا' : language === 'en' ? 'Lily' : 'Lina',
      age: 5,
      gender: 'girl',
      nickname: '',
      favoriteAnimal: language === 'ar' ? 'الأرنب الصغير' : language === 'en' ? 'little rabbit' : 'petit renard',
      favoriteColor: language === 'ar' ? 'الوردي الفاتح' : language === 'en' ? 'soft pink' : 'rose poudré',
      favoriteActivity: language === 'ar' ? 'الرسم واكتشاف الطبيعة' : language === 'en' ? 'drawing and nature walks' : 'dessiner et explorer la forêt',
      dedication: language === 'ar' ? 'إلى صغيرتنا الحبيبة، لتكن حياتك كلها مغامرات سعيدة.' : language === 'en' ? 'To our darling child, may your days be filled with magical adventures.' : 'Pour notre petit trésor d’amour, que tes journées soient remplies de rires et d’aventures.',
      giftFrom: language === 'ar' ? 'ماما وبابا' : language === 'en' ? 'Mom and Dad' : 'Maman et Papa',
    },
    customAiPrompt: '',
    isAiGenerating: false,
    editedPages: {},
    currentPageIndex: 0,
    zoom: 100,
    spreadMode: 'single',
    showPrintGuides: false,
    showBookletGuide: false,
  }));

  const handleLanguageChange = (newLang: Language) => {
    setState((prev) => ({
      ...prev,
      language: newLang,
    }));
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col bg-slate-100 font-sans text-slate-900">
      {/* 1. Top Header with Breadcrumbs & Language */}
      <Header
        language={state.language}
        onLanguageChange={handleLanguageChange}
        currentRoute="/generator/personalized-storybook"
        onNavigate={onNavigate}
      />

      {/* 2. Sub-Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour au catalogue</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-none">
                Générateur de petites histoires personnalisées
              </h2>
              <span className="text-[10px] text-slate-500 font-medium">
                Livres jeunesse illustrés 8 à 12 pages • Prêt à imprimer
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Édition Pro 300 DPI
          </span>
        </div>
      </div>

      {/* 3. Main Workspace: Left Config Panel + Right Live Book Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Panel */}
        <div className="w-full md:w-[380px] lg:w-[420px] h-full shrink-0 flex flex-col z-10 shadow-lg md:shadow-none">
          <StorybookConfigPanel
            state={state}
            onChange={setState}
            language={state.language}
          />
        </div>

        {/* Right Live Book Preview Panel */}
        <div className="hidden md:flex flex-1 h-full overflow-hidden">
          <StorybookPreview
            state={state}
            onChange={setState}
          />
        </div>
      </div>
    </div>
  );
};
