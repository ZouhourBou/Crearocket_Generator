import React, { useRef, useState, useEffect } from 'react';
import { Download, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Loader2, X, AlertTriangle, SlidersHorizontal, RotateCcw, Minus, Plus, Scissors } from 'lucide-react';
import { GeneratorState, LayoutCalculationResult } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { LabelRenderer } from './LabelRenderer';
import { CoverRenderer } from './CoverRenderer';
import { exportToPdf, exportToPng } from '../utils/exportUtils';
import { computeTextFit } from '../utils/textFitEngine';

interface LivePaperPreviewProps {
  state: GeneratorState;
  layout: LayoutCalculationResult;
  onUpdateState: (updater: (prev: GeneratorState) => GeneratorState) => void;
}

export const LivePaperPreview: React.FC<LivePaperPreviewProps> = ({
  state,
  layout,
  onUpdateState,
}) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<'pdf' | 'png' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);

  // Measure available container width and update dynamically with ResizeObserver
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      if (el) {
        setContainerWidth(el.clientWidth);
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);
  const [isMarginsOpen, setIsMarginsOpen] = useState<boolean>(false);
  const marginsPanelRef = useRef<HTMLDivElement>(null);
  const marginsButtonRef = useRef<HTMLButtonElement>(null);

  const [isLabelSpacingOpen, setIsLabelSpacingOpen] = useState<boolean>(false);
  const labelSpacingPanelRef = useRef<HTMLDivElement>(null);
  const labelSpacingButtonRef = useRef<HTMLButtonElement>(null);

  // Calcul du nom de fichier par défaut basé sur le nom saisi dans les étiquettes
  const defaultFilename = React.useMemo(() => {
    const rawName = state.info?.fullName || '';
    if (!rawName.trim()) {
      return 'etiquettes-scolaires';
    }
    const slug = rawName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[/\\:*?"<>|]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return slug ? `etiquettes-${slug}` : 'etiquettes-scolaires';
  }, [state.info?.fullName]);

  const [filenameInput, setFilenameInput] = useState<string>('');
  const [hasUserEditedFilename, setHasUserEditedFilename] = useState<boolean>(false);

  // Synchronisation automatique de la valeur par défaut tant que l'utilisateur n'a pas modifié le champ
  useEffect(() => {
    if (!hasUserEditedFilename) {
      setFilenameInput(defaultFilename);
    }
  }, [defaultFilename, hasUserEditedFilename]);

  // Nom effectif nettoyé avec fallback automatique si le champ est vide
  const getEffectiveFilename = (): string => {
    const sanitized = filenameInput.replace(/[/\\:*?"<>|]/g, '').trim();
    const withoutExt = sanitized.replace(/\.(pdf|png)$/i, '').trim();
    return withoutExt || defaultFilename;
  };

  useEffect(() => {
    if (!isMarginsOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        marginsPanelRef.current?.contains(target) ||
        marginsButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsMarginsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMarginsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMarginsOpen]);

  useEffect(() => {
    if (!isLabelSpacingOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        labelSpacingPanelRef.current?.contains(target) ||
        labelSpacingButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsLabelSpacingOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLabelSpacingOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLabelSpacingOpen]);

  // Default gap value calculation
  const defaultGapValue = React.useMemo(() => {
    if (state.type === 'notebook_cover') {
      if (state.coversPerSheet === 2) return 6;
      if (state.coversPerSheet === 3) return 5;
      return 4;
    }
    return 3;
  }, [state.type, state.coversPerSheet]);

  const effectiveGap = state.labelSpacing !== undefined ? state.labelSpacing : defaultGapValue;

  const handleGapChange = (newGap: number) => {
    const clamped = Math.max(0, Math.min(25, Math.round(newGap * 10) / 10));
    onUpdateState((prev) => ({
      ...prev,
      labelSpacing: clamped,
    }));
  };

  const handleResetLabelSpacing = () => {
    onUpdateState((prev) => ({
      ...prev,
      labelSpacing: undefined,
    }));
  };

  const t = TRANSLATIONS[state.language];
  const isArabic = state.language === 'ar';

  const handleDownloadPdf = async () => {
    if (!paperRef.current || isExporting !== null) return;
    setIsExporting('pdf');
    setExportError(null);
    try {
      const baseName = getEffectiveFilename();
      const filename = `${baseName}.pdf`;
      await exportToPdf(
        paperRef.current,
        { widthMm: layout.paperWidthMm, heightMm: layout.paperHeightMm },
        filename
      );
    } catch (err) {
      console.error('PDF export error:', err);
      setExportError(
        isArabic
          ? 'تعذر إنشاء الملف. يرجى المحاولة مرة أخرى.'
          : state.language === 'en'
          ? 'Unable to generate file. Please try again.'
          : 'Impossible de générer le fichier. Veuillez réessayer.'
      );
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPng = async () => {
    if (!paperRef.current || isExporting !== null) return;
    setIsExporting('png');
    setExportError(null);
    try {
      const baseName = getEffectiveFilename();
      const filename = `${baseName}.png`;
      await exportToPng(paperRef.current, filename);
    } catch (err) {
      console.error('PNG export error:', err);
      setExportError(
        isArabic
          ? 'تعذر إنشاء الملف. يرجى المحاولة مرة أخرى.'
          : state.language === 'en'
          ? 'Unable to generate file. Please try again.'
          : 'Impossible de générer le fichier. Veuillez réessayer.'
      );
    } finally {
      setIsExporting(null);
    }
  };

  const toggleOption = (key: keyof GeneratorState['displayOptions']) => {
    onUpdateState((prev) => ({
      ...prev,
      displayOptions: {
        ...prev.displayOptions,
        [key]: !prev.displayOptions[key],
      },
    }));
  };

  // Marges actives dès qu'au moins une valeur > 0 est définie
  const hasActiveMargins = Boolean(
    (state.pageMargins?.top || 0) > 0 ||
    (state.pageMargins?.right || 0) > 0 ||
    (state.pageMargins?.bottom || 0) > 0 ||
    (state.pageMargins?.left || 0) > 0
  );

  const parseMarginNumber = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned) return 0;
    const n = parseInt(cleaned, 10);
    return Math.min(200, isNaN(n) ? 0 : n);
  };

  const handleUniformChange = (uniform: boolean) => {
    onUpdateState((prev) => {
      const current = prev.pageMargins || { enabled: true, uniform: true, top: 0, right: 0, bottom: 0, left: 0 };
      return {
        ...prev,
        pageMargins: {
          ...current,
          uniform,
          ...(uniform ? { right: current.top, bottom: current.top, left: current.top } : {}),
        },
      };
    });
  };

  const handleUniformValueChange = (valStr: string) => {
    const num = parseMarginNumber(valStr);
    onUpdateState((prev) => ({
      ...prev,
      pageMargins: {
        ...(prev.pageMargins || { enabled: true, uniform: true, top: 0, right: 0, bottom: 0, left: 0 }),
        enabled: num > 0,
        uniform: true,
        top: num,
        right: num,
        bottom: num,
        left: num,
      },
    }));
  };

  const handleIndividualValueChange = (side: 'top' | 'right' | 'bottom' | 'left', valStr: string) => {
    const num = parseMarginNumber(valStr);
    onUpdateState((prev) => {
      const current = prev.pageMargins || { enabled: true, uniform: false, top: 0, right: 0, bottom: 0, left: 0 };
      const updated = {
        ...current,
        [side]: num,
      };
      const anyActive = (updated.top || 0) > 0 || (updated.right || 0) > 0 || (updated.bottom || 0) > 0 || (updated.left || 0) > 0;
      return {
        ...prev,
        pageMargins: {
          ...updated,
          enabled: anyActive,
        },
      };
    });
  };

  const handleResetMargins = () => {
    onUpdateState((prev) => ({
      ...prev,
      pageMargins: {
        ...(prev.pageMargins || { enabled: false, uniform: true, top: 0, right: 0, bottom: 0, left: 0 }),
        enabled: false,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    }));
  };

  // Build items array for rendering
  const itemsCount = layout.actualCount;
  const itemsArray = Array.from({ length: itemsCount }, (_, i) => i);

  // Dynamic Fit-Text check for the active label layout
  const textFit = state.type !== 'notebook_cover'
    ? computeTextFit(
        layout.itemWidthMm,
        layout.itemHeightMm,
        state.info,
        state.language,
        state.illustrationId || state.themeId,
        state.type === 'supplies' ? (state.schoolLabelType || 'supplies') : 'books',
        state.iconSize,
        state.fieldFontSizes
      )
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-900/5 rounded-2xl border border-slate-200/80 p-4 lg:p-6 select-none">
      {/* Top Toolbar */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-200">
        {/* Ligne 1 : Titre et informations de format / étiquettes */}
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              {t.previewTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {layout.paperWidthMm} × {layout.paperHeightMm} mm • {layout.actualCount} {t.totalLabels} ({layout.cols} {t.columnsLabel} × {layout.rows} {t.rowsLabel})
          </p>
        </div>

        {/* Ligne 2 : Boutons d'action alignés à gauche avec hauteur et espacement cohérents */}
        <div className="flex items-center justify-start gap-2.5">
          {/* Marges de page toggle button & popover panel */}
          <div className="relative">
            <button
              ref={marginsButtonRef}
              type="button"
              id="page-margins-toggle-btn"
              onClick={() => setIsMarginsOpen((open) => !open)}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white transition-colors duration-150 ease-out cursor-pointer ${
                isMarginsOpen
                  ? 'bg-[#B91C1C] border border-[#B91C1C] shadow-xs'
                  : 'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#B91C1C] border border-[#DC2626] shadow-xs'
              }`}
              title={t.pageMarginsButton}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
              <span>{t.pageMarginsButton}</span>
            </button>

            {isMarginsOpen && (
              <div
                ref={marginsPanelRef}
                id="page-margins-panel"
                className="absolute top-full mt-2 left-0 w-[285px] sm:w-[310px] bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800"
              >
                <div className="flex items-start justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
                      {t.pageMarginsTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {t.pageMarginsSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMarginsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                    title="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <input
                    type="checkbox"
                    id="margin-uniform-checkbox"
                    checked={state.pageMargins.uniform}
                    onChange={(e) => handleUniformChange(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
                  />
                  <label
                    htmlFor="margin-uniform-checkbox"
                    className="text-xs font-medium text-slate-700 cursor-pointer select-none"
                  >
                    {t.marginUniformLabel}
                  </label>
                </div>

                {state.pageMargins.uniform ? (
                  <div className="mb-3">
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                      {t.marginAll}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={state.pageMargins.top === 0 && state.pageMargins.right === 0 ? '' : state.pageMargins.top}
                        placeholder="0"
                        onChange={(e) => handleUniformValueChange(e.target.value)}
                        className="w-full h-8 pl-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                      />
                      <span className="absolute right-2.5 text-[11px] font-medium text-slate-400 pointer-events-none">
                        mm
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                      <span>T: {state.pageMargins.top}mm</span>
                      <span>R: {state.pageMargins.right}mm</span>
                      <span>B: {state.pageMargins.bottom}mm</span>
                      <span>L: {state.pageMargins.left}mm</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                        {t.marginTop}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={state.pageMargins.top === 0 ? '' : state.pageMargins.top}
                          placeholder="0"
                          onChange={(e) => handleIndividualValueChange('top', e.target.value)}
                          className="w-full h-8 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                        <span className="absolute right-2 text-[10px] font-medium text-slate-400 pointer-events-none">
                          mm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                        {t.marginRight}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={state.pageMargins.right === 0 ? '' : state.pageMargins.right}
                          placeholder="0"
                          onChange={(e) => handleIndividualValueChange('right', e.target.value)}
                          className="w-full h-8 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                        <span className="absolute right-2 text-[10px] font-medium text-slate-400 pointer-events-none">
                          mm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                        {t.marginBottom}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={state.pageMargins.bottom === 0 ? '' : state.pageMargins.bottom}
                          placeholder="0"
                          onChange={(e) => handleIndividualValueChange('bottom', e.target.value)}
                          className="w-full h-8 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                        <span className="absolute right-2 text-[10px] font-medium text-slate-400 pointer-events-none">
                          mm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                        {t.marginLeft}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={state.pageMargins.left === 0 ? '' : state.pageMargins.left}
                          placeholder="0"
                          onChange={(e) => handleIndividualValueChange('left', e.target.value)}
                          className="w-full h-8 pl-2.5 pr-7 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                        <span className="absolute right-2 text-[10px] font-medium text-slate-400 pointer-events-none">
                          mm
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {layout.isMarginTooLarge && (
                  <div className="mb-2.5 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-1.5 text-amber-800 text-[11px] leading-snug">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{t.marginsTooLarge}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <button
                    type="button"
                    onClick={handleResetMargins}
                    className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t.resetMargins}
                  </button>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {layout.cols && layout.rows ? `${layout.cols}×${layout.rows} (${layout.actualCount})` : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Marge d'étiquette toggle button & popover panel */}
          <div className="relative">
            <button
              ref={labelSpacingButtonRef}
              type="button"
              id="label-spacing-toggle-btn"
              onClick={() => setIsLabelSpacingOpen((open) => !open)}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-white transition-colors duration-150 ease-out cursor-pointer ${
                isLabelSpacingOpen
                  ? 'bg-slate-900 border border-slate-900 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-900 active:bg-slate-950 border border-slate-800 shadow-xs'
              }`}
              title={t.labelSpacingButton}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
              <span>{t.labelSpacingButton}</span>
            </button>

            {isLabelSpacingOpen && (
              <div
                ref={labelSpacingPanelRef}
                id="label-spacing-panel"
                className="absolute top-full mt-2 left-0 w-[285px] sm:w-[310px] bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800"
              >
                {/* Panel Header */}
                <div className="flex items-start justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
                      {t.labelSpacingTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {t.labelSpacingSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLabelSpacingOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                    title="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Spacing Controls */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      {t.labelSpacingLabel}
                    </label>
                    <span className="text-xs font-bold text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {effectiveGap} mm
                    </span>
                  </div>

                  {/* Row: [ - ] [ Slider ] [ + ] [ Numeric Input mm ] */}
                  <div className="flex items-center gap-2">
                    {/* Bouton − */}
                    <button
                      type="button"
                      onClick={() => handleGapChange(Math.max(0, Number((effectiveGap - 1).toFixed(1))))}
                      disabled={effectiveGap <= 0}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                      title="Diminuer (-1 mm)"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    {/* Curseur Slider */}
                    <input
                      type="range"
                      min={0}
                      max={20}
                      step={0.5}
                      value={effectiveGap}
                      onChange={(e) => handleGapChange(parseFloat(e.target.value) || 0)}
                      className="flex-1 accent-slate-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />

                    {/* Bouton + */}
                    <button
                      type="button"
                      onClick={() => handleGapChange(Math.min(20, Number((effectiveGap + 1).toFixed(1))))}
                      disabled={effectiveGap >= 20}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
                      title="Augmenter (+1 mm)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    {/* Champ numérique édité directement avec unité */}
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-2xs shrink-0 focus-within:ring-2 focus-within:ring-slate-400 focus-within:border-slate-500 w-16">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={effectiveGap}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          handleGapChange(isNaN(val) ? 0 : Math.max(0, Math.min(20, val)));
                        }}
                        className="w-full text-center font-bold text-xs text-slate-800 bg-transparent outline-none"
                      />
                      <span className="text-[10px] font-bold text-slate-500 ml-0.5">mm</span>
                    </div>
                  </div>

                  {/* Informational hints */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min : 0 mm</span>
                    <span>Par défaut : {defaultGapValue} mm</span>
                    <span>Max : 20 mm</span>
                  </div>
                </div>

                {/* Panel Footer with Reset button and grid stats */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px]">
                  <button
                    type="button"
                    onClick={handleResetLabelSpacing}
                    className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t.resetLabelSpacing}
                  </button>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {layout.cols && layout.rows ? `${layout.cols}×${layout.rows} (${layout.actualCount})` : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center h-8 bg-white border border-[#E5E7EB] rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="h-7 w-7 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded hover:bg-[#F9FAFB] transition-colors duration-150 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 px-1.5 min-w-[38px] text-center select-none">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="h-7 w-7 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded hover:bg-[#F9FAFB] transition-colors duration-150 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Warning banner hidden per request */}

      {(() => {
        const sheetPixelWidth = layout.paperWidthMm * 2.2;
        const sheetPixelHeight = layout.paperHeightMm * 2.2;
        const availWidth = Math.max(150, (containerWidth || 600) - 48);
        const autoFitScale = Math.min(1, availWidth / sheetPixelWidth);
        const effectiveScale = (zoom / 100) * autoFitScale;
        const scaledWidth = sheetPixelWidth * effectiveScale;
        const scaledHeight = sheetPixelHeight * effectiveScale;

        return (
          /* Main Interactive Paper Preview Canvas */
          <div
            ref={previewContainerRef}
            className="flex-1 min-h-[480px] lg:min-h-[560px] overflow-auto flex items-center justify-center p-4 bg-slate-200/50 rounded-xl my-4 border border-slate-300/50"
          >
            <div
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                position: 'relative',
                flexShrink: 0,
                transition: 'width 0.15s ease-out, height 0.15s ease-out',
              }}
              className="flex items-center justify-center"
            >
              <div
                style={{
                  width: `${sheetPixelWidth}px`,
                  height: `${sheetPixelHeight}px`,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* Physical Sheet Container (White sheet with shadow and printing simulation) */}
                <div
                  ref={paperRef}
                  id="printable-paper-sheet"
                  className="relative bg-white shadow-2xl transition-all overflow-hidden flex flex-col justify-center"
                  style={{
                    width: `${sheetPixelWidth}px`,
                    height: `${sheetPixelHeight}px`,
                    boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)',
                    padding: hasActiveMargins
                      ? `${(layout.marginTopMm || 0) * 2.2}px ${(layout.marginRightMm || 0) * 2.2}px ${(layout.marginBottomMm || 0) * 2.2}px ${(layout.marginLeftMm || 0) * 2.2}px`
                      : '0px',
                  }}
                >
                  {/* Real Corner Crop / Cut Marks if enabled */}
                  {state.displayOptions.showCutMarks && (
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {/* Top-Left Cut Mark */}
                      <div
                        className="absolute border-l-2 border-t-2 border-slate-900"
                        style={{
                          left: `${(layout.marginLeftMm || 0) * 2.2 - 6}px`,
                          top: `${(layout.marginTopMm || 0) * 2.2 - 6}px`,
                          width: '12px',
                          height: '12px',
                        }}
                      />
                      {/* Top-Right Cut Mark */}
                      <div
                        className="absolute border-r-2 border-t-2 border-slate-900"
                        style={{
                          right: `${(layout.marginRightMm || 0) * 2.2 - 6}px`,
                          top: `${(layout.marginTopMm || 0) * 2.2 - 6}px`,
                          width: '12px',
                          height: '12px',
                        }}
                      />
                      {/* Bottom-Left Cut Mark */}
                      <div
                        className="absolute border-l-2 border-b-2 border-slate-900"
                        style={{
                          left: `${(layout.marginLeftMm || 0) * 2.2 - 6}px`,
                          bottom: `${(layout.marginBottomMm || 0) * 2.2 - 6}px`,
                          width: '12px',
                          height: '12px',
                        }}
                      />
                      {/* Bottom-Right Cut Mark */}
                      <div
                        className="absolute border-r-2 border-b-2 border-slate-900"
                        style={{
                          right: `${(layout.marginRightMm || 0) * 2.2 - 6}px`,
                          bottom: `${(layout.marginBottomMm || 0) * 2.2 - 6}px`,
                          width: '12px',
                          height: '12px',
                        }}
                      />
                    </div>
                  )}

                  {/* Dynamic Print Stylesheet for Automatic Page Orientation */}
                  <style>{`
                    @media print {
                      @page {
                        size: ${layout.paperWidthMm > layout.paperHeightMm ? 'landscape' : 'portrait'};
                        margin: 0;
                      }
                    }
                  `}</style>

                  {/* Ligne de découpe centrale discrète pour 2 couvertures par feuille (sans badge) */}
                  {state.type === 'notebook_cover' && state.coversPerSheet === 2 && (
                    <div
                      className="absolute inset-y-2 pointer-events-none z-20 flex flex-col items-center justify-between"
                      style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="w-0 h-full border-l border-dashed border-slate-300" />
                    </div>
                  )}

                  {/* Grid Container for All Items */}
                  <div
                    className="w-full h-full grid"
                    style={{
                      gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
                      gap: `${layout.gapYmm * 2.2}px ${layout.gapXmm * 2.2}px`,
                    }}
                  >
                    {itemsArray.map((idx) => (
                      <div
                        key={idx}
                        className={`relative w-full h-full flex items-center justify-center ${state.type === 'supplies' || layout.itemHeightMm <= 8 ? 'p-0' : 'p-0.5'}`}
                      >
                        {state.type === 'notebook_cover' ? (
                          <div
                            style={{
                              width: `${layout.itemWidthMm * 2.2}px`,
                              height: `${layout.itemHeightMm * 2.2}px`,
                              maxWidth: '100%',
                              maxHeight: '100%',
                            }}
                            className="flex items-center justify-center"
                          >
                            <CoverRenderer
                              widthMm={layout.itemWidthMm}
                              heightMm={layout.itemHeightMm}
                              subject={state.notebookSubject}
                              themeId={state.aiCoverThemeId || state.themeId}
                              paletteId={state.paletteId}
                              illustrationId={state.illustrationId}
                              info={state.info}
                              language={state.language}
                              variationIndex={state.aiCoverVariationIndex ?? 0}
                              aiCoverImage={state.aiCoverImage}
                              seed={state.aiCoverSeed}
                              centerText={state.centerText}
                            />
                          </div>
                        ) : (
                          <LabelRenderer
                            type={state.type}
                            schoolLabelType={state.schoolLabelType}
                            widthMm={layout.itemWidthMm}
                            heightMm={layout.itemHeightMm}
                            themeId={state.themeId}
                            paletteId={state.paletteId}
                            illustrationId={state.illustrationId}
                            duplicateIconRight={state.duplicateIconRight}
                            centerText={state.centerText}
                            borderRadius={state.borderRadius}
                            iconSize={state.iconSize}
                            fieldFontSizes={state.fieldFontSizes}
                            info={state.info}
                            language={state.language}
                            labelLanguage={state.labelLanguage || 'latin'}
                            index={idx}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Action Footer: Export PDF, PNG, Print Direct - Perfect uniform size and alignment */}
      {exportError && (
        <div className="w-full mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-150">
          <span>{exportError}</span>
          <button
            type="button"
            onClick={() => setExportError(null)}
            className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Champ pleine largeur : Nom du fichier */}
      <div className="w-full mb-2">
        <label
          htmlFor="export-filename-input"
          className="block text-xs font-bold text-slate-700 mb-1.5"
        >
          {isArabic ? 'اسم الملف' : state.language === 'en' ? 'File name' : 'Nom du fichier'}
        </label>
        <input
          id="export-filename-input"
          type="text"
          value={filenameInput}
          onChange={(e) => {
            setHasUserEditedFilename(true);
            setFilenameInput(e.target.value.replace(/[/\\:*?"<>|]/g, ''));
          }}
          onBlur={() => {
            if (!filenameInput.trim()) {
              setFilenameInput(defaultFilename);
            }
          }}
          placeholder={defaultFilename}
          className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-2xs"
        />
      </div>

      <div className="pt-2 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
        {/* BOUTON 1 : Télécharger PDF (Prêt à imprimer) */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isExporting !== null}
          className="w-full h-[58px] inline-flex items-center justify-center gap-2.5 px-3 py-2 bg-[#D1192A] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm ring-2 ring-red-500/20"
        >
          {isExporting === 'pdf' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="text-xs sm:text-sm font-bold">
                {isArabic ? 'جاري التحميل...' : state.language === 'en' ? 'Downloading...' : 'Téléchargement...'}
              </span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 shrink-0" />
              <div className="flex flex-col items-center justify-center text-center leading-tight">
                <span className="text-xs sm:text-[13px] font-bold whitespace-nowrap">
                  {isArabic ? 'تحميل ملف PDF' : state.language === 'en' ? 'Download PDF' : 'Télécharger PDF'}
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-medium opacity-85 leading-none mt-0.5 whitespace-nowrap">
                  {isArabic ? '(جاهز للطباعة)' : state.language === 'en' ? '(Print Ready)' : '(Prêt à imprimer)'}
                </span>
              </div>
            </>
          )}
        </button>

        {/* BOUTON 2 : Télécharger PNG (300 DPI) */}
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExporting !== null}
          className="w-full h-[58px] inline-flex items-center justify-center gap-2.5 px-3 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer disabled:opacity-50 text-sm"
        >
          {isExporting === 'png' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-slate-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                {isArabic ? 'جاري التحميل...' : state.language === 'en' ? 'Downloading...' : 'Téléchargement...'}
              </span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="flex flex-col items-center justify-center text-center leading-tight">
                <span className="text-xs sm:text-[13px] font-bold whitespace-nowrap">
                  {isArabic ? 'تحميل صورة PNG' : state.language === 'en' ? 'Download PNG' : 'Télécharger PNG'}
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-medium text-slate-500 leading-none mt-0.5 whitespace-nowrap">
                  {isArabic ? '(دقة 300 DPI)' : state.language === 'en' ? '(300 DPI)' : '(300 DPI)'}
                </span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
