import React, { useEffect, useMemo, useState } from 'react';
import {
  GeneratorState,
  LayoutCalculationResult,
  GeneratorType,
  PaperFormat,
  NotebookSubject,
  SchoolLabelType,
  FieldFontSizes,
} from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { getThemesForSelection, COLOR_PALETTES, ILLUSTRATION_THEMES } from '../constants/themes';
import { ThemeVectorIllustration } from './ThemeIllustrations';
import { NotebookAiGeneratorCard } from './NotebookAiGeneratorCard';
import { getLabelFieldLimits } from '../utils/layoutEngine';
import { computeTextFit, getDefaultIconSizePx } from '../utils/textFitEngine';
import { IntegerInput } from './IntegerInput';
import {
  Sparkles,
  Palette,
  Image as ImageIcon,
  BookOpen,
  PenTool,
  GraduationCap,
  Layers,
  FileText,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  Grid,
  Sliders,
  Minus,
  Plus,
  Type,
  Languages,
  Ruler,
  User,
  Calendar,
} from 'lucide-react';

interface DynamicFormProps {
  state: GeneratorState;
  layout: LayoutCalculationResult;
  onUpdateState: (updater: (prev: GeneratorState) => GeneratorState) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  state,
  layout,
  onUpdateState,
}) => {
  const t = TRANSLATIONS[state.language];
  const isArabic = state.language === 'ar';

  const [showAllPalettes, setShowAllPalettes] = useState(false);
  const [showAllIllustrations, setShowAllIllustrations] = useState(false);

  const themes = getThemesForSelection(state.type, state.notebookSubject);

  // Dynamic limits based on current label width & height in mm, illustration, and label type
  const currentLimits = useMemo(
    () =>
      getLabelFieldLimits(
        layout.itemWidthMm,
        layout.itemHeightMm,
        state.illustrationId || state.themeId,
        state.type === 'supplies' ? (state.schoolLabelType || 'supplies') : 'books',
        state.iconSize,
        state.duplicateIconRight
      ),
    [
      layout.itemWidthMm,
      layout.itemHeightMm,
      state.illustrationId,
      state.themeId,
      state.type,
      state.schoolLabelType,
      state.iconSize,
      state.duplicateIconRight,
    ]
  );

  return (
    <div className="flex flex-col gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 1. Langue de l'étiquette (Compact Radio Format) */}
      {state.type === 'supplies' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Languages className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isArabic ? '1. لغة الملصق' : state.language === 'en' ? '1. Label Language' : "1. Langue de l’étiquette"}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isArabic
                  ? 'اختر لغة عرض ملصقاتك'
                  : state.language === 'en'
                  ? 'Choose the display language for your labels'
                  : "Choisissez la langue d'affichage de vos étiquettes"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option 1 : Français / Anglais */}
            {(() => {
              const isSelected = (state.labelLanguage ?? 'latin') === 'latin';
              return (
                <button
                  type="button"
                  onClick={() => onUpdateState((prev) => ({ ...prev, labelLanguage: 'latin' }))}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                    isSelected
                      ? 'border-[#DC2626] bg-red-50/40 text-slate-900 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-medium'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-[#DC2626] bg-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#DC2626]" />}
                  </span>
                  <span className="text-xs sm:text-sm">Français / Anglais</span>
                </button>
              );
            })()}

            {/* Option 2 : Arabe */}
            {(() => {
              const isSelected = state.labelLanguage === 'ar';
              return (
                <button
                  type="button"
                  onClick={() => onUpdateState((prev) => ({ ...prev, labelLanguage: 'ar' }))}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                    isSelected
                      ? 'border-[#DC2626] bg-red-50/40 text-slate-900 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-medium'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-[#DC2626] bg-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#DC2626]" />}
                  </span>
                  <span className="text-xs sm:text-sm">Arabe</span>
                </button>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TYPE 1: ÉTIQUETTE SCOLAIRE SPECIFIC CONTROLS */}
      {/* ========================================================================= */}
      {state.type === 'supplies' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* 2. Format & Dimensions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Ruler className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isArabic ? '2. مقاس الملصق' : state.language === 'en' ? '2. Label Size' : "2. Taille de l’étiquette"}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isArabic
                    ? 'حدد الأبعاد أو اختر قالباً مناسباً'
                    : state.language === 'en'
                    ? 'Select predefined format or customize dimensions'
                    : "Sélectionnez un format prédéfini ou personnalisez les dimensions"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {(state.schoolLabelType === 'books'
                ? [
                    { id: '70x35', label: '70 × 35 mm' },
                    { id: '80x40', label: '80 × 40 mm' },
                    { id: 'custom', label: isArabic ? 'مخصص' : 'Personnalisé' },
                  ]
                : state.schoolLabelType === 'notebook'
                ? [
                    { id: '70x35', label: '70 × 35 mm' },
                    { id: '80x40', label: '80 × 40 mm' },
                    { id: '70x25', label: '70 × 25 mm' },
                    { id: 'custom', label: isArabic ? 'مخصص' : 'Personnalisé' },
                  ]
                : [
                    { id: '46x6', label: '46 × 6 mm' },
                    { id: '50x10', label: '50 × 10 mm' },
                    { id: '56x15', label: '56 × 15 mm' },
                    { id: 'custom', label: isArabic ? 'مخصص' : 'Personnalisé' },
                  ]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onUpdateState((prev) => ({
                      ...prev,
                      labelPreset: item.id,
                      ...(item.id === 'custom'
                        ? {
                            customLabel:
                              prev.schoolLabelType === 'books' || prev.type === 'books'
                                ? { widthMm: 90, heightMm: 35 }
                                : { widthMm: 60, heightMm: 20 },
                          }
                        : {}),
                      ...(prev.labelPreset !== item.id ? { fieldFontSizes: undefined } : {}),
                    }))
                  }
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    state.labelPreset === item.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {state.labelPreset === 'custom' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {t.widthLabel} (mm)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    value={state.customLabel.widthMm}
                    onChange={(e) =>
                      onUpdateState((prev) => ({
                        ...prev,
                        customLabel: { ...prev.customLabel, widthMm: Number(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {t.heightLabel} (mm)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={state.customLabel.heightMm}
                    onChange={(e) =>
                      onUpdateState((prev) => ({
                        ...prev,
                        customLabel: { ...prev.customLabel, heightMm: Number(e.target.value) },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Border Radius */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-500" />
                  <h4 className="text-sm font-bold text-slate-900">Border Radius</h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {isArabic ? 'انحناء زوايا الملصق' : 'Rayon des coins (px)'}
                </span>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Slider */}
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={state.borderRadius ?? 8}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(30, parseInt(e.target.value, 10) || 0));
                      onUpdateState((prev) => ({
                        ...prev,
                        borderRadius: val,
                      }));
                    }}
                    className="flex-1 accent-red-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />

                  {/* Numeric input with px */}
                  <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1 shadow-2xs shrink-0 focus-within:ring-2 focus-within:ring-red-400 focus-within:border-red-500">
                    <IntegerInput
                      value={Math.round(state.borderRadius ?? 8)}
                      min={0}
                      max={30}
                      onChange={(val) => {
                        onUpdateState((prev) => ({
                          ...prev,
                          borderRadius: Math.round(val),
                        }));
                      }}
                      className="w-10 text-center font-bold text-sm text-slate-800 bg-transparent outline-hidden"
                      aria-label={isArabic ? 'انحناء زوايا الملصق' : 'Rayon des coins (px)'}
                    />
                    <span className="text-xs font-bold text-slate-500 ml-0.5">px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paper Format */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {t.step3Paper}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['A4', 'A5', 'custom'] as PaperFormat[]).map((fmt) => {
                  const label =
                    fmt === 'custom'
                      ? isArabic
                        ? 'مخصص'
                        : state.language === 'en'
                        ? 'Custom'
                        : 'Personnalisé'
                      : fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => onUpdateState((prev) => ({ ...prev, paperFormat: fmt }))}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        state.paperFormat === fmt
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {state.paperFormat === 'custom' && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {isArabic ? 'عرض الورقة (ملم)' : state.language === 'en' ? 'Paper Width (mm)' : 'Largeur du papier (mm)'}
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      value={state.customPaper.widthMm}
                      onChange={(e) => {
                        const val = Math.max(20, Math.min(1000, Number(e.target.value) || 0));
                        onUpdateState((prev) => ({
                          ...prev,
                          customPaper: { ...prev.customPaper, widthMm: val },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {isArabic ? 'ارتفاع الورقة (ملم)' : state.language === 'en' ? 'Paper Height (mm)' : 'Hauteur du papier (mm)'}
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      value={state.customPaper.heightMm}
                      onChange={(e) => {
                        const val = Math.max(20, Math.min(1000, Number(e.target.value) || 0));
                        onUpdateState((prev) => ({
                          ...prev,
                          customPaper: { ...prev.customPaper, heightMm: val },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Item Count & Grid Calculation */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">
                  {t.step4Count}
                </label>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  {t.maxCapacityText} {layout.maxCapacity} {t.totalLabels}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={layout.maxCapacity}
                  value={state.itemCount}
                  onChange={(e) =>
                    onUpdateState((prev) => ({
                      ...prev,
                      itemCount: Math.max(1, Number(e.target.value)),
                    }))
                  }
                  className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => onUpdateState((prev) => ({ ...prev, itemCount: layout.maxCapacity }))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Remplir la page ({layout.maxCapacity})
                </button>
              </div>

              {state.itemCount > layout.maxCapacity && (
                <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{t.overCapacityAlert}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THEMES LIBRARY (Palette de couleurs & Illustration / Univers graphique) */}
      {/* ========================================================================= */}
      {state.type !== 'notebook_cover' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isArabic ? '3. النمط والتصميم الفني' : state.language === 'en' ? '3. Design Theme' : '3. Thème graphique'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isArabic
                  ? 'اختر لوحة الألوان وعالم الرسوم بشكل مستقل'
                  : 'Personnalisez indépendamment la palette de couleurs et l’univers graphique'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SOUS-SECTION 1 : PALETTE DE COULEURS */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-bold text-slate-900">{t.paletteTitle}</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              {t.paletteSubtitle}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(showAllPalettes ? COLOR_PALETTES : COLOR_PALETTES.slice(0, 8)).map((palette) => {
              const isSelected = (state.paletteId || 'rose_pastel') === palette.id;
              const paletteName = palette.name[state.language] || palette.name.fr;

              return (
                <button
                  key={palette.id}
                  type="button"
                  title={paletteName}
                  aria-label={paletteName}
                  onClick={() =>
                    onUpdateState((prev) => ({
                      ...prev,
                      paletteId: palette.id,
                      themeId: palette.id,
                    }))
                  }
                  className={`group relative flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer h-10 sm:h-11 ${
                    isSelected
                      ? 'border-red-500 bg-red-50/70 shadow-xs ring-2 ring-red-400/25'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  {/* Selected checkmark indicator badge in top-right corner */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white z-10">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
                    </span>
                  )}

                  {/* Petits échantillons de couleurs [ ● ● ● ● ] */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    {palette.colors.map((colorHex, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full inline-block shrink-0 shadow-2xs border border-black/10 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: colorHex }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lien textuel d'action élégant avec chevron - aligné à droite */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAllPalettes((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer group"
            >
              <span>
                {showAllPalettes
                  ? (isArabic ? 'عرض أقل ‹' : 'Afficher moins ‹')
                  : (isArabic ? 'عرض جميع اللوحات ›' : 'Voir toutes les palettes ›')}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SOUS-SECTION 2 : ILLUSTRATION / UNIVERS GRAPHIQUE */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-bold text-slate-900">{t.illustrationTitle}</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              {t.illustrationSubtitle}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {(showAllIllustrations ? ILLUSTRATION_THEMES : ILLUSTRATION_THEMES.slice(0, 10)).map((themeItem) => {
              const isSelected = (state.illustrationId || 'cute') === themeItem.id;
              const themeName = themeItem.name[state.language] || themeItem.name.fr;

              return (
                <button
                  key={themeItem.id}
                  type="button"
                  title={themeName}
                  aria-label={themeName}
                  onClick={() =>
                    onUpdateState((prev) => ({
                      ...prev,
                      illustrationId: themeItem.id,
                    }))
                  }
                  className={`group relative flex items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer h-12 sm:h-14 ${
                    isSelected
                      ? 'border-red-500 bg-red-50/70 shadow-xs ring-2 ring-red-400/25'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white z-10">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </span>
                  )}

                  {/* 3D Cute Vector Illustration */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 pointer-events-none transition-transform group-hover:scale-110">
                    <ThemeVectorIllustration
                      illustrationId={themeItem.id}
                      className="w-full h-full object-contain filter drop-shadow-2xs"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lien textuel d'action élégant avec chevron - aligné à droite */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAllIllustrations((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer group"
            >
              <span>
                {showAllIllustrations
                  ? (isArabic ? 'عرض أقل ‹' : 'Afficher moins ‹')
                  : (isArabic ? 'عرض جميع الرسومات ›' : 'Voir toutes les illustrations ›')}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SOUS-SECTION 3 : TAILLE DE L'ICÔNE (ICON SIZE) */}
        {/* ========================================================================= */}
        {Boolean(state.illustrationId !== 'none') && (
          <div className="pt-4 border-t border-slate-100">
            {(() => {
              const heightPx = layout.itemHeightMm * 2.2;
              const widthPx = layout.itemWidthMm * 2.2;
              const defaultIconSize = Math.round(getDefaultIconSizePx(layout.itemHeightMm));
              const maxIconSize = Math.max(6, Math.min(Math.floor(heightPx - 3), Math.floor(widthPx * 0.35)));
              const minIconSize = 6;
              const currentIconVal = Math.round(
                Math.min(maxIconSize, Math.max(minIconSize, state.iconSize !== undefined ? Math.round(state.iconSize) : defaultIconSize))
              );

              return (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-red-500" />
                      <h4 className="text-sm font-bold text-slate-900">Icon Size</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isArabic ? 'حجم الأيقونة (px)' : "Taille de l'icône (px)"}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      {/* Slider */}
                      <input
                        type="range"
                        min={minIconSize}
                        max={maxIconSize}
                        step={1}
                        value={currentIconVal}
                        onChange={(e) => {
                          const val = Math.round(Number(e.target.value));
                          onUpdateState((prev) => ({
                            ...prev,
                            iconSize: val,
                          }));
                        }}
                        className="flex-1 accent-red-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />

                      {/* Numeric input with px */}
                      <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1 shadow-2xs shrink-0 focus-within:ring-2 focus-within:ring-red-400 focus-within:border-red-500">
                        <IntegerInput
                          value={currentIconVal}
                          min={minIconSize}
                          max={maxIconSize}
                          onChange={(val) => {
                            onUpdateState((prev) => ({
                              ...prev,
                              iconSize: Math.round(val),
                            }));
                          }}
                          className="w-10 text-center font-bold text-sm text-slate-800 bg-transparent outline-hidden"
                          aria-label={isArabic ? 'حجم الأيقونة (px)' : "Taille de l'icône (px)"}
                        />
                        <span className="text-xs font-bold text-slate-500 ml-0.5">px</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      )}

      {/* ========================================================================= */}
      {/* AI COVER GENERATION CARD (DEDICATED FOR NOTEBOOK COVERS - STEP 2) */}
      {/* ========================================================================= */}
      {state.type === 'notebook_cover' && (
        <NotebookAiGeneratorCard state={state} onUpdateState={onUpdateState} />
      )}

      {/* ========================================================================= */}
      {/* PERSONAL & SCHOOL INFORMATION FORM */}
      {/* ========================================================================= */}
      {(() => {
        const isSuppliesOnly = state.type === 'supplies' && (state.schoolLabelType === 'supplies' || !state.schoolLabelType);

        // Dynamic Fit-Text evaluation
        const textFit = computeTextFit(
          layout.itemWidthMm,
          layout.itemHeightMm,
          state.info,
          state.language,
          state.illustrationId || state.themeId,
          state.type === 'supplies' ? (state.schoolLabelType || 'supplies') : 'books',
          state.iconSize,
          state.fieldFontSizes,
          state.duplicateIconRight
        );

        const isNotebookCover = state.type === 'notebook_cover';
        const maxLines = isNotebookCover ? 4 : currentLimits.maxLines;

        // Active lines used calculation
        const usedLines = isNotebookCover
          ? (state.info.fullName.trim() ? 1 : 0) +
            (state.info.grade.trim() ? 1 : 0) +
            (state.info.schoolName.trim() ? 1 : 0) +
            ((state.info.academicYear || '').trim() ? 1 : 0)
          : (state.info.fullName.trim() ? 1 : 0) +
            (maxLines >= 2 && state.info.grade.trim() ? 1 : 0) +
            (maxLines >= 3 && state.info.subjectName.trim() ? 1 : 0) +
            (maxLines >= 4 && state.info.schoolName.trim() ? 1 : 0);

        return (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            {/* Header: Title and Active Lines Counter */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isArabic
                      ? state.type === 'notebook_cover'
                        ? '2. بيانات التلميذ والمعلومات'
                        : '4. المعلومات الشخصية'
                      : state.language === 'en'
                      ? state.type === 'notebook_cover'
                        ? '2. Student Information'
                        : '4. Personal Information'
                      : state.type === 'notebook_cover'
                      ? "2. Informations de l'élève"
                      : '4. Informations personnelles'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isNotebookCover
                      ? isArabic
                        ? 'أدخل البيانات التي تريد ظهورها في بطاقة الكراس (اختياري بالكامل)'
                        : state.language === 'en'
                        ? 'Enter the details to display on the notebook cover box (100% optional)'
                        : "Renseignez les données à faire figurer sur l'encadré du cahier (100% facultatif)"
                      : isArabic
                      ? 'أدخل البيانات التي تريد ظهورها على الملصقات (اختياري بالكامل)'
                      : state.language === 'en'
                      ? 'Enter the details to display on the labels (100% optional)'
                      : 'Renseignez les données à faire figurer sur les étiquettes (100% facultatif)'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                {usedLines} / {maxLines} {maxLines === 1 ? (isArabic ? 'سطر' : 'ligne') : (isArabic ? 'أسطر' : 'lignes')}
              </span>
            </div>

            {/* Alert banner hidden per request */}

            {/* Vertical Form: strictly one field per line, full width, 100% optional */}
            {(() => {
              const activeLimits = textFit.limits;
              const nameLen = state.info.fullName.length;
              const nameMax = isNotebookCover ? 45 : activeLimits.fullName;
              const isNameAtLimit = nameLen > nameMax || Boolean(textFit.errors.fullName);
              const hasNameError = isNameAtLimit;

              const gradeLen = state.info.grade.length;
              const gradeMax = isNotebookCover ? 35 : activeLimits.grade;
              const isGradeAtLimit = gradeLen > gradeMax || Boolean(textFit.errors.grade);
              const hasGradeError = isGradeAtLimit;

              const schoolLen = state.info.schoolName.length;
              const schoolMax = isNotebookCover ? 45 : activeLimits.schoolName;
              const isSchoolAtLimit = schoolLen > schoolMax || Boolean(textFit.errors.schoolName);
              const hasSchoolError = isSchoolAtLimit;

              const subjectLen = state.info.subjectName.length;
              const subjectMax = activeLimits.subjectName;
              const isSubjectAtLimit = subjectLen > subjectMax || Boolean(textFit.errors.subjectName);
              const hasSubjectError = isSubjectAtLimit;

              const yearVal = state.info.academicYear || '';
              const yearLen = yearVal.length;
              const yearMax = 30;
              const isYearAtLimit = yearLen > yearMax;

              const limitErrorMsg = isArabic
                ? 'النص يتجاوز الحد الأقصى المسموح به لهذا الملصق.'
                : 'Le texte dépasse la longueur maximale autorisée pour cette étiquette.';

              const updateFieldFontSize = (field: keyof FieldFontSizes, size: number) => {
                onUpdateState((prev) => ({
                  ...prev,
                  fieldFontSizes: {
                    ...prev.fieldFontSizes,
                    [field]: Math.round(size),
                  },
                }));
              };

              const resetFieldFontSize = (field: keyof FieldFontSizes) => {
                onUpdateState((prev) => {
                  if (!prev.fieldFontSizes) return prev;
                  const next = { ...prev.fieldFontSizes };
                  delete next[field];
                  return {
                    ...prev,
                    fieldFontSizes: Object.keys(next).length > 0 ? next : undefined,
                  };
                });
              };

              const renderFontSizeControl = (
                fieldKey: keyof FieldFontSizes,
                defaultSize: number,
                customSize?: number
              ) => {
                const isCustom = customSize !== undefined;
                const currentSize = isCustom ? Math.round(customSize) : Math.round(defaultSize);

                return (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Type className="w-3 h-3 text-slate-400" />
                      <span>{t.fontSizeLabel} :</span>
                    </span>
                    <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateFieldFontSize(fieldKey, Math.max(1, currentSize - 1))}
                        disabled={currentSize <= 1}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 cursor-pointer"
                        title="-1 px"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <IntegerInput
                        value={currentSize}
                        min={1}
                        max={100}
                        onChange={(newVal) => updateFieldFontSize(fieldKey, newVal)}
                        className="w-9 text-center font-bold text-xs text-slate-800 bg-transparent outline-none py-0.5"
                        title={isArabic ? 'الحجم بالبكسل' : 'Taille en px'}
                        aria-label={t.fontSizeLabel}
                      />
                      <span className="text-[10px] font-bold text-slate-400 pr-1">px</span>
                      <button
                        type="button"
                        onClick={() => updateFieldFontSize(fieldKey, Math.min(100, currentSize + 1))}
                        disabled={currentSize >= 100}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 cursor-pointer"
                        title="+1 px"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {isCustom ? (
                      <button
                        type="button"
                        onClick={() => resetFieldFontSize(fieldKey)}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 border border-blue-200 transition-colors cursor-pointer"
                        title={isArabic ? 'إعادة للوضع التلقائي' : 'Réinitialiser en automatique'}
                      >
                        {t.autoFontSize}
                      </button>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/60">
                        {t.autoFontSize}
                      </span>
                    )}
                  </div>
                );
              };

              return (
                <div className="flex flex-col gap-4">
                  {/* REGROUPEMENT DES OPTIONS : DUPLIQUER L'ICÔNE & CENTRER LES INFORMATIONS */}
                  {state.type !== 'notebook_cover' ? (
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {/* Option 1 : Dupliquer l'icône */}
                        {Boolean(state.illustrationId && state.illustrationId !== 'none') && (
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(state.duplicateIconRight)}
                              onChange={(e) =>
                                onUpdateState((prev) => ({
                                  ...prev,
                                  duplicateIconRight: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-700">
                              {isArabic
                                ? 'تكرار الأيقونة'
                                : state.language === 'en'
                                ? 'Duplicate icon'
                                : "Dupliquer l'icône"}
                            </span>
                          </label>
                        )}

                        {/* Option 2 : Centrer les informations */}
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(state.centerText)}
                            onChange={(e) =>
                              onUpdateState((prev) => ({
                                ...prev,
                                centerText: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            {isArabic
                              ? 'توسيط المعلومات'
                              : state.language === 'en'
                              ? 'Center information'
                              : 'Centrer les informations'}
                          </span>
                        </label>
                      </div>

                      {/* Message d'aide / recommandation visuelle */}
                      {Boolean(state.illustrationId && state.illustrationId !== 'none') && (
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {isArabic
                            ? "💡 للحصول على مظهر أفضل، يُوصى بتفعيل الخيارين معاً: تكرار الأيقونة وتوسيط المعلومات، لنتيجة أكثر تناسقاً وتوازناً."
                            : state.language === 'en'
                            ? "💡 For the best look, it is recommended to enable both options together: duplicate icon AND center information, for a more balanced and harmonious result."
                            : "💡 Pour un meilleur rendu, il est recommandé d'activer les deux options ensemble : dupliquer l'icône ET centrer les informations, pour un résultat plus harmonieux et équilibré."}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(state.centerText)}
                          onChange={(e) =>
                            onUpdateState((prev) => ({
                              ...prev,
                              centerText: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {isArabic
                            ? 'توسيط المعلومات'
                            : state.language === 'en'
                            ? 'Center information'
                            : 'Centrer les informations'}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* CHAMP 1 : NOM ET PRÉNOM */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        {t.fullNameLabel}
                      </label>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-mono font-bold transition-colors ${
                            isNameAtLimit ? 'text-red-600' : 'text-slate-400'
                          }`}
                        >
                          {nameLen}/{nameMax}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {t.optionalBadge}
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      maxLength={Math.max(nameMax + 15, 60)}
                      value={state.info.fullName}
                      placeholder={t.fullNamePlaceholder}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, Math.max(nameMax + 15, 60));
                        onUpdateState((prev) => ({
                          ...prev,
                          info: { ...prev.info, fullName: val },
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold transition-all placeholder:text-slate-400 focus:outline-none text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />

                    {/* Font Size control */}
                    <div className="mt-2 px-0.5">
                      {renderFontSizeControl('fullName', textFit.defaultFontSizes.fullName, state.fieldFontSizes?.fullName)}
                    </div>
                  </div>

                  {/* CHAMP 2 : CLASSE / NIVEAU (Désactivé avec message clair si 1 seule ligne disponible pour étiquettes) */}
                  {!isNotebookCover && currentLimits.maxLines === 1 ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-500">
                      <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                      <p className="font-medium">
                        {isArabic
                          ? 'القسم: غير متاح لهذا المقاس (سطر واحد فقط)'
                          : 'Classe : Non disponible pour ce format (1 seule ligne autorisée)'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          {t.gradeLabel}
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-mono font-bold transition-colors ${
                              isGradeAtLimit ? 'text-red-600' : 'text-slate-400'
                            }`}
                          >
                            {gradeLen}/{gradeMax}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {t.optionalBadge}
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        maxLength={Math.max(gradeMax + 15, 60)}
                        value={state.info.grade}
                        placeholder={t.gradePlaceholder}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, Math.max(gradeMax + 15, 60));
                          onUpdateState((prev) => ({
                            ...prev,
                            info: { ...prev.info, grade: val },
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold transition-all placeholder:text-slate-400 focus:outline-none text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />

                      {/* Font Size control */}
                      <div className="mt-2 px-0.5">
                        {renderFontSizeControl('grade', textFit.defaultFontSizes.grade, state.fieldFontSizes?.grade)}
                      </div>
                    </div>
                  )}

                  {/* CHAMP 3 (Étiquettes uniquement) : MATIÈRE */}
                  {!isNotebookCover && currentLimits.maxLines >= 3 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          {t.subjectCheckbox}
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-mono font-bold transition-colors ${
                              isSubjectAtLimit ? 'text-red-600' : 'text-slate-400'
                            }`}
                          >
                            {subjectLen}/{subjectMax}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {t.optionalBadge}
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        maxLength={Math.max(subjectMax + 15, 60)}
                        value={state.info.subjectName}
                        placeholder={t.subjectPlaceholder}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, Math.max(subjectMax + 15, 60));
                          onUpdateState((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              subjectName: val,
                              hasSubject: Boolean(val.trim()),
                            },
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold transition-all placeholder:text-slate-400 focus:outline-none text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />

                      {/* Font Size control */}
                      <div className="mt-2 px-0.5">
                        {renderFontSizeControl('subjectName', textFit.defaultFontSizes.subjectName, state.fieldFontSizes?.subjectName)}
                      </div>
                    </div>
                  )}

                  {/* CHAMP : ÉCOLE (Champ 3 pour couverture de cahier, champ 4 pour étiquettes si 4 lignes) */}
                  {(isNotebookCover || currentLimits.maxLines >= 4) && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          {t.schoolCheckbox}
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-mono font-bold transition-colors ${
                              isSchoolAtLimit ? 'text-red-600' : 'text-slate-400'
                            }`}
                          >
                            {schoolLen}/{schoolMax}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {t.optionalBadge}
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        maxLength={Math.max(schoolMax + 15, 60)}
                        value={state.info.schoolName}
                        placeholder={t.schoolPlaceholder}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, Math.max(schoolMax + 15, 60));
                          onUpdateState((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              schoolName: val,
                              hasSchool: Boolean(val.trim()),
                            },
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold transition-all placeholder:text-slate-400 focus:outline-none text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />

                      {/* Font Size control */}
                      <div className="mt-2 px-0.5">
                        {renderFontSizeControl('schoolName', textFit.defaultFontSizes.schoolName, state.fieldFontSizes?.schoolName)}
                      </div>
                    </div>
                  )}

                  {/* CHAMP 4 : ANNÉE SCOLAIRE (Dernier dans le bloc pour Informations de l'élève) */}
                  {isNotebookCover && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          {t.academicYearLabel}
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-mono font-bold transition-colors ${
                              isYearAtLimit ? 'text-red-600' : 'text-slate-400'
                            }`}
                          >
                            {yearLen}/{yearMax}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {t.optionalBadge}
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        maxLength={Math.max(yearMax + 10, 40)}
                        value={state.info.academicYear || ''}
                        placeholder={t.academicYearPlaceholder}
                        onChange={(e) => {
                          const val = e.target.value.slice(0, Math.max(yearMax + 10, 40));
                          onUpdateState((prev) => ({
                            ...prev,
                            info: {
                              ...prev.info,
                              academicYear: val,
                            },
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold transition-all placeholder:text-slate-400 focus:outline-none text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />

                      {/* Font Size control */}
                      <div className="mt-2 px-0.5">
                        {renderFontSizeControl('academicYear', 14, state.fieldFontSizes?.academicYear)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );
      })()}
    </div>
  );
};
