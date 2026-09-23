import React, { useState } from 'react';
import { StorybookState, BookFormat, BookPageCount, GenerationMode, StoryGenderForm } from './types';
import { STORY_TEMPLATES, getStoryTemplateById } from './StoryTemplateLibrary';
import { Language } from '../../types';
import {
  Sparkles,
  BookOpen,
  User,
  Heart,
  Settings2,
  FileText,
  Printer,
  Undo2,
  CheckCircle2,
  Sliders,
  Shield,
  HelpCircle,
  Palette,
  Lightbulb,
} from 'lucide-react';

interface ConfigPanelProps {
  state: StorybookState;
  onChange: (updater: (prev: StorybookState) => StorybookState) => void;
  language: Language;
}

export const StorybookConfigPanel: React.FC<ConfigPanelProps> = ({
  state,
  onChange,
  language,
}) => {
  const isArabic = state.language === 'ar';
  const [activeTab, setActiveTab] = useState<'child' | 'story' | 'format' | 'editor' | 'booklet'>('child');

  const selectedTemplate = getStoryTemplateById(state.storyId);
  const child = state.child;

  // Handler for child profile changes
  const updateChild = (field: string, value: any) => {
    onChange((prev) => ({
      ...prev,
      child: {
        ...prev.child,
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none overflow-hidden">
      {/* Mode Switcher: Mode 1 (Templates) vs Mode 2 (AI Story) */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, generationMode: 'templates' }))}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all ${
              state.generationMode === 'templates'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isArabic ? 'نماذج الحكايات المصورة' : 'Modèles Illustrés (Recommandé)'}</span>
          </button>

          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, generationMode: 'ai_custom' }))}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all ${
              state.generationMode === 'ai_custom'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isArabic ? 'قصة مخصصة بالذكاء' : 'Aventure IA (Avancé)'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white px-2 overflow-x-auto scrollbar-none text-xs font-bold text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('child')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'child'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{isArabic ? 'الطفل' : 'Enfant'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'story'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isArabic ? 'القصة' : 'Histoire'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('format')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'format'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{isArabic ? 'الحجم والصفحات' : 'Format'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'editor'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تعديل النصوص' : 'Éditeur'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('booklet')}
          className={`flex items-center gap-1.5 py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'booklet'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{isArabic ? 'دليل الكتيب' : 'Livret'}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* TAB 1: CHILD PERSONALIZATION */}
        {activeTab === 'child' && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-900">
              <span className="font-bold">✨ Personnalisation Magique :</span> Le prénom et les informations de votre enfant s’intègrent naturellement dans le récit avec les accords grammaticaux corrects.
            </div>

            {/* Child's Name */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                {isArabic ? 'اسم الطفل (مطلوب)' : 'Prénom de l’enfant *'}
              </label>
              <input
                type="text"
                value={child.name}
                onChange={(e) => updateChild('name', e.target.value)}
                placeholder={isArabic ? 'مثال: لينا' : 'Ex: Lina, Léo, Youssef...'}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            {/* Child's Age */}
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase text-slate-700 mb-1">
                <span>{isArabic ? 'عمر الطفل' : 'Âge de l’enfant'}</span>
                <span className="text-emerald-700 font-extrabold px-2 py-0.5 bg-emerald-50 rounded-md">
                  {child.age} {isArabic ? 'سنوات' : 'ans'}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                value={child.age}
                onChange={(e) => updateChild('age', parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>2 ans (Éveil)</span>
                <span>5 ans (Maternelle)</span>
                <span>8+ ans (Primaire)</span>
              </div>
            </div>

            {/* Story Language */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                {isArabic ? 'لغة القصة' : 'Langue du livre'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fr', label: 'Français' },
                  { id: 'ar', label: 'العربية (RTL)' },
                  { id: 'en', label: 'English' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => onChange((prev) => ({ ...prev, language: lang.id as Language }))}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      state.language === lang.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender / Grammatical Agreement */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                {isArabic ? 'الصيغة النحوية / الجنس' : 'Accord grammatical'}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => updateChild('gender', 'girl')}
                  className={`py-2 px-2 rounded-xl border transition-all ${
                    child.gender === 'girl'
                      ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isArabic ? 'مؤنث (بطلتنا)' : 'Féminin (elle)'}
                </button>
                <button
                  type="button"
                  onClick={() => updateChild('gender', 'boy')}
                  className={`py-2 px-2 rounded-xl border transition-all ${
                    child.gender === 'boy'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isArabic ? 'مذكر (بطلنا)' : 'Masculin (il)'}
                </button>
                <button
                  type="button"
                  onClick={() => updateChild('gender', 'neutral')}
                  className={`py-2 px-2 rounded-xl border transition-all ${
                    child.gender === 'neutral'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isArabic ? 'محايد' : 'Neutre'}
                </button>
              </div>
            </div>

            {/* Optional Personalization Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                {isArabic ? 'تخصيصات اختيارية إضافية' : 'Détails optionnels'}
              </span>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isArabic ? 'الحيوان المفضل' : 'Animal préféré'}
                </label>
                <input
                  type="text"
                  value={child.favoriteAnimal || ''}
                  onChange={(e) => updateChild('favoriteAnimal', e.target.value)}
                  placeholder={isArabic ? 'مثال: الأرنب، الدلفين' : 'Ex: petit lapin, renard, dauphin...'}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isArabic ? 'اللون المفضل' : 'Couleur préférée'}
                </label>
                <input
                  type="text"
                  value={child.favoriteColor || ''}
                  onChange={(e) => updateChild('favoriteColor', e.target.value)}
                  placeholder={isArabic ? 'مثال: الأزرق السماوي' : 'Ex: bleu ciel, rose pastel, jaune soleil...'}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isArabic ? 'إهداء أو رسالة تذكارية (صفحة 2)' : 'Message de dédicace (Page 2)'}
                </label>
                <textarea
                  rows={2}
                  value={child.dedication || ''}
                  onChange={(e) => updateChild('dedication', e.target.value)}
                  placeholder={isArabic ? 'اكتب إهداءك الخاص هنا...' : 'Ex: Pour notre petite aventurière qui illumine nos journées...'}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isArabic ? 'هدية مقدمة من' : 'Offert par (Cadeau de la part de)'}
                </label>
                <input
                  type="text"
                  value={child.giftFrom || ''}
                  onChange={(e) => updateChild('giftFrom', e.target.value)}
                  placeholder={isArabic ? 'مثال: ماما وبابا بكل حب' : 'Ex: Maman et Papa, Papi et Mamie...'}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORY SELECTION */}
        {activeTab === 'story' && (
          <div className="space-y-4">
            <div className="text-xs font-black uppercase text-slate-700">
              {isArabic ? 'اختر حكاية طفلك المفضلة' : 'Bibliothèque d’histoires exclusives'}
            </div>

            <div className="space-y-3">
              {STORY_TEMPLATES.map((tmpl) => {
                const isSelected = state.storyId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => onChange((prev) => ({ ...prev, storyId: tmpl.id, editedPages: {} }))}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-extrabold text-slate-900">
                        {isArabic ? tmpl.titleAr : state.language === 'en' ? tmpl.titleEn : tmpl.titleFr}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: tmpl.colorScheme.badgeBg, color: tmpl.colorScheme.badgeText }}
                      >
                        {isArabic ? tmpl.badgeAr : state.language === 'en' ? tmpl.badgeEn : tmpl.badgeFr}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                      {isArabic ? tmpl.descriptionAr : state.language === 'en' ? tmpl.descriptionEn : tmpl.descriptionFr}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Âge : {tmpl.ageMin} à {tmpl.ageMax} ans</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isSelected ? 'Sélectionné' : 'Choisir'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FORMAT & PAGE COUNT */}
        {activeTab === 'format' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                {isArabic ? 'عدد صفحات الكتاب' : 'Longueur du livre'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([8, 10, 12] as BookPageCount[]).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onChange((prev) => ({ ...prev, pageCount: count }))}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      state.pageCount === count
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold'
                    }`}
                  >
                    <div className="text-sm">{count} pages</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      {count === 8 ? 'Idéal tout-petit' : count === 10 ? 'Récit complet' : 'Grand conte'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                {isArabic ? 'حجم وشكل الورق' : 'Format du livre'}
              </label>
              <div className="space-y-2">
                {[
                  { id: 'a5', name: 'A5 Portrait (148 × 210 mm)', desc: 'Le format standard idéal pour les petites mains et l’impression livret A4 plié en deux.' },
                  { id: 'a4', name: 'A4 Portrait (210 × 297 mm)', desc: 'Grand livre illustré avec textes généreux et illustrations détaillées.' },
                  { id: 'square', name: 'Format Carré (200 × 200 mm)', desc: 'Style moderne album jeunesse contemporain.' },
                ].map((fmt) => (
                  <div
                    key={fmt.id}
                    onClick={() => onChange((prev) => ({ ...prev, bookFormat: fmt.id as BookFormat }))}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      state.bookFormat === fmt.id
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-slate-800">{fmt.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{fmt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Guides Toggle */}
            <div className="pt-3 border-t border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-700">
                  {isArabic ? 'إظهار خطوط الأمان والقص للطباعة' : 'Repères d’impression & zone de sécurité'}
                </span>
                <input
                  type="checkbox"
                  checked={state.showPrintGuides}
                  onChange={(e) => onChange((prev) => ({ ...prev, showPrintGuides: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: PAGE-BY-PAGE TEXT EDITOR */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700">
                Page {state.currentPageIndex + 1} sur {state.pageCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange((prev) => {
                    const next = { ...prev.editedPages };
                    delete next[prev.currentPageIndex + 1];
                    return { ...prev, editedPages: next };
                  });
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800"
              >
                <Undo2 className="w-3 h-3" />
                <span>Rétablir le texte original</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {isArabic ? 'نص الصفحة المعروضة حالياً' : 'Modifier le texte de cette page :'}
              </label>
              <textarea
                rows={6}
                value={
                  state.editedPages[state.currentPageIndex + 1] !== undefined
                    ? state.editedPages[state.currentPageIndex + 1]
                    : selectedTemplate.pagesByCount[state.pageCount]?.[state.currentPageIndex]?.[
                        isArabic ? 'textAr' : state.language === 'en' ? 'textEn' : 'textFr'
                      ] || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onChange((prev) => ({
                    ...prev,
                    editedPages: {
                      ...prev.editedPages,
                      [prev.currentPageIndex + 1]: val,
                    },
                  }));
                }}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Astuce : Vous pouvez utiliser les balises &#123;&#123;childName&#125;&#125; ou saisir directement votre texte personnalisé.
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: BOOKLET PRINTING GUIDE */}
        {activeTab === 'booklet' && (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">📘 Impression en livret A5 sur feuilles A4 :</span>
              <p className="mt-1">
                Pour créer un véritable livret relié au centre avec des agrafes, imprimez en mode <strong>Recto-Verso (bord court)</strong> avec 2 pages par feuille A4.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Ordre d’imposition des pages :</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-emerald-800">Feuille 1 Recto :</span> Page 8 (Dos) & Page 1 (Couverture)
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-emerald-800">Feuille 1 Verso :</span> Page 2 (Dédicace) & Page 7
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-emerald-800">Feuille 2 Recto :</span> Page 6 & Page 3
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-emerald-800">Feuille 2 Verso :</span> Page 4 & Page 5 (Centre du livre)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
