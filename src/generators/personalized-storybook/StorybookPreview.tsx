import React, { useRef, useState } from 'react';
import { StorybookState } from './types';
import { getStoryTemplateById } from './StoryTemplateLibrary';
import { StorybookPageRenderer } from './StorybookPageRenderer';
import { exportMultiPagePdf, exportToPng, printDirect } from '../../utils/exportUtils';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Printer,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';

interface PreviewProps {
  state: StorybookState;
  onChange: (updater: (prev: StorybookState) => StorybookState) => void;
}

export const StorybookPreview: React.FC<PreviewProps> = ({ state, onChange }) => {
  const isArabic = state.language === 'ar';
  const template = getStoryTemplateById(state.storyId);
  const pages = template.pagesByCount[state.pageCount] || template.pagesByCount[8];

  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activePageRef = useRef<HTMLDivElement>(null);
  const hiddenBookPagesRef = useRef<HTMLDivElement>(null);

  const currentPage = pages[state.currentPageIndex] || pages[0];

  const handlePrevPage = () => {
    onChange((prev) => ({
      ...prev,
      currentPageIndex: Math.max(0, prev.currentPageIndex - 1),
    }));
  };

  const handleNextPage = () => {
    onChange((prev) => ({
      ...prev,
      currentPageIndex: Math.min(state.pageCount - 1, prev.currentPageIndex + 1),
    }));
  };

  const handleZoomIn = () => {
    onChange((prev) => ({ ...prev, zoom: Math.min(150, prev.zoom + 10) }));
  };

  const handleZoomOut = () => {
    onChange((prev) => ({ ...prev, zoom: Math.max(50, prev.zoom - 10) }));
  };

  const handleFitScreen = () => {
    onChange((prev) => ({ ...prev, zoom: 100 }));
  };

  // Full Multi-page PDF Export
  const handleExportPdf = async () => {
    if (!hiddenBookPagesRef.current) return;
    setIsExporting(true);
    try {
      const pageElements = Array.from(
        hiddenBookPagesRef.current.children
      ) as HTMLElement[];

      const paperDim =
        state.bookFormat === 'square'
          ? { widthMm: 200, heightMm: 200 }
          : state.bookFormat === 'a4'
          ? { widthMm: 210, heightMm: 297 }
          : { widthMm: 148, heightMm: 210 }; // Default A5

      const filename = `livre-${state.child.name || 'enfant'}-${state.storyId}.pdf`;
      await exportMultiPagePdf(pageElements, paperDim, filename);
    } catch (err) {
      console.error('Erreur export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Single Page PNG Export
  const handleExportPng = async () => {
    if (!activePageRef.current) return;
    setIsExporting(true);
    try {
      const filename = `page-${state.currentPageIndex + 1}-${state.child.name || 'enfant'}.png`;
      await exportToPng(activePageRef.current, filename);
    } catch (err) {
      console.error('Erreur export PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print
  const handlePrint = () => {
    printDirect();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 select-none overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Page navigation controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={state.currentPageIndex === 0}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Page précédente"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>

          <span className="text-xs font-black text-slate-800 px-2 py-1 bg-slate-100 rounded-lg">
            Page {state.currentPageIndex + 1} / {state.pageCount}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={state.currentPageIndex === state.pageCount - 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Page suivante"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>

          <span className="text-xs font-semibold text-slate-500 hidden sm:inline ml-2">
            {state.currentPageIndex === 0
              ? 'Couverture'
              : state.currentPageIndex === 1
              ? 'Dédicace'
              : state.currentPageIndex === state.pageCount - 1
              ? 'Quatrième de couverture'
              : `Chapitre ${state.currentPageIndex - 1}`}
          </span>
        </div>

        {/* Zoom & View controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Zoom -"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-600 px-1.5 w-12 text-center">
            {state.zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Zoom +"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleFitScreen}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 ml-1"
            title="Ajuster"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExporting}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>PNG</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isExporting}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Imprimer</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Génération...' : 'Télécharger le livre (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Book Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center p-6 md:p-8"
      >
        <div
          ref={activePageRef}
          style={{
            transform: `scale(${state.zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            width: state.bookFormat === 'square' ? '460px' : '380px',
            maxWidth: '100%',
          }}
          className="relative shadow-2xl rounded-lg"
        >
          <StorybookPageRenderer
            state={state}
            pageIndex={state.currentPageIndex}
            pageTemplate={currentPage}
            isCover={state.currentPageIndex === 0}
            isDedication={state.currentPageIndex === 1}
            isBackCover={state.currentPageIndex === state.pageCount - 1}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="h-20 bg-white border-t border-slate-200 px-4 py-2 flex items-center gap-3 overflow-x-auto shrink-0 shadow-inner">
        {pages.map((p, idx) => {
          const isSelected = state.currentPageIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, currentPageIndex: idx }))}
              className={`relative h-16 w-12 rounded-md border-2 overflow-hidden shrink-0 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20 scale-105'
                  : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`flex-1 w-full flex items-center justify-center text-[9px] font-black ${
                  idx === 0
                    ? 'bg-emerald-800 text-white'
                    : idx === 1
                    ? 'bg-amber-100 text-amber-900'
                    : idx === state.pageCount - 1
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                {idx === 0 ? 'Couv' : idx === state.pageCount - 1 ? 'Dos' : p.pageNumber}
              </div>
              <div className="w-full bg-white text-[8px] font-bold text-slate-500 py-0.5 text-center border-t border-slate-100">
                p.{idx + 1}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hidden Offscreen Container for Multipage PDF Generation */}
      <div
        ref={hiddenBookPagesRef}
        style={{
          position: 'fixed',
          top: '-99999px',
          left: '-99999px',
          width: state.bookFormat === 'square' ? '800px' : '595px', // Exact print scale
        }}
      >
        {pages.map((p, idx) => (
          <div
            key={idx}
            style={{
              width: state.bookFormat === 'square' ? '800px' : '595px',
              height: state.bookFormat === 'square' ? '800px' : state.bookFormat === 'a4' ? '842px' : '842px',
              marginBottom: '20px',
            }}
          >
            <StorybookPageRenderer
              state={state}
              pageIndex={idx}
              pageTemplate={p}
              isCover={idx === 0}
              isDedication={idx === 1}
              isBackCover={idx === state.pageCount - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
