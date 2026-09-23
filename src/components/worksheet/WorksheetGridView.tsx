import React, { useState, useEffect, useCallback } from 'react';
import {
  WorksheetPageData,
  DocumentSettings,
  A4_PORTRAIT_WIDTH,
  A4_PORTRAIT_HEIGHT,
  A4_LANDSCAPE_WIDTH,
  A4_LANDSCAPE_HEIGHT,
} from '../../types/worksheet';
import { WorksheetBlockItem } from './WorksheetBlockItem';
import {
  Plus,
  Trash2,
  Copy,
  X,
  FileText,
} from 'lucide-react';

interface WorksheetGridViewProps {
  pages: WorksheetPageData[];
  currentPageIndex: number;
  documentSettings: DocumentSettings;
  onSelectPageAndExit: (pageIndex: number) => void;
  onCloseGrid: () => void;
  onAddPage: () => void;
  onInsertPageAt: (index: number) => void;
  onDuplicatePage?: (pageIndex: number) => void;
  onDuplicatePageAsIndependentArabic?: (pageIndex: number) => void;
  onDeletePage?: (pageIndex: number) => void;
}

export const WorksheetGridView: React.FC<WorksheetGridViewProps> = ({
  pages,
  currentPageIndex,
  documentSettings,
  onSelectPageAndExit,
  onCloseGrid,
  onAddPage,
  onInsertPageAt,
  onDuplicatePage,
  onDuplicatePageAsIndependentArabic,
  onDeletePage,
}) => {
  // Currently highlighted page in grid view
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(() => {
    return Math.max(0, Math.min(pages.length - 1, currentPageIndex));
  });

  // Keep selected index within bounds if pages array changes
  useEffect(() => {
    if (selectedPageIndex >= pages.length) {
      setSelectedPageIndex(Math.max(0, pages.length - 1));
    }
  }, [pages.length, selectedPageIndex]);

  const isLandscape = documentSettings.orientation === 'landscape';
  const pageWidth = isLandscape ? A4_LANDSCAPE_WIDTH : A4_PORTRAIT_WIDTH;
  const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;

  // Exact math-scaled thumbnail dimensions (Canva proportions: ~6 cards per row on desktop)
  const thumbWidth = isLandscape ? 190 : 142;
  const scale = thumbWidth / pageWidth;
  const thumbHeight = Math.round(pageHeight * scale);
  const cardWidth = thumbWidth + 16; // 8px padding on each side

  // Keyboard navigation inside grid view (Arrow keys, Enter, Escape, Delete)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseGrid();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        onSelectPageAndExit(selectedPageIndex);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedPageIndex((prev) => Math.max(0, prev - 1));
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.repeat) {
        if (pages.length > 1 && onDeletePage) {
          e.preventDefault();
          onDeletePage(selectedPageIndex);
        }
      }
    },
    [selectedPageIndex, pages.length, onSelectPageAndExit, onCloseGrid, onDeletePage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      id="worksheet-grid-view"
      className="flex-1 w-full h-full overflow-y-auto bg-slate-100/90 flex flex-col select-none custom-scrollbar relative"
      style={{
        backgroundImage:
          'radial-gradient(#cbd5e1 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #f1f5f9 0.75px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px',
      }}
    >
      {/* 1. CANVA-STYLE TOP FLOATING TOOLBAR: COMPACT & CLEAN (Without "Ajouter une page" & "Modifier cette page") */}
      <div className="sticky top-3 z-40 flex justify-center w-full px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/90 shadow-lg flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Total Pages Indicator */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 text-xs font-semibold text-slate-800">
            <span>
              {pages.length} {pages.length > 1 ? 'pages' : 'page'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-bold">
              Page {selectedPageIndex + 1}
            </span>
          </div>

          {/* Action: Duplicate Page */}
          {onDuplicatePage && (
            <button
              type="button"
              onClick={() => onDuplicatePage(selectedPageIndex)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={`Dupliquer la page ${selectedPageIndex + 1}`}
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          {/* Action: Duplicate as Independent Arabic Page */}
          {onDuplicatePageAsIndependentArabic && (
            <button
              type="button"
              onClick={() => onDuplicatePageAsIndependentArabic(selectedPageIndex)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer shadow-2xs"
              title={`Dupliquer la page ${selectedPageIndex + 1} en tant que version Arabe indépendante (autonome)`}
            >
              <span>🇹🇳</span>
              <span className="hidden sm:inline">Version Arabe autonome</span>
            </button>
          )}

          {/* Action: Delete Page */}
          {onDeletePage && (
            <button
              type="button"
              onClick={() => {
                if (pages.length > 1) onDeletePage(selectedPageIndex);
              }}
              disabled={pages.length <= 1}
              className={`p-1.5 rounded-lg transition-colors ${
                pages.length <= 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer'
              }`}
              title={
                pages.length <= 1
                  ? "Impossible de supprimer l'unique page"
                  : `Supprimer la page ${selectedPageIndex + 1}`
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="w-px h-4 bg-slate-200" />

          {/* Action: Close Grid */}
          <button
            type="button"
            onClick={onCloseGrid}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Fermer la vue grille (Échap)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CANVA-STYLE GRID CONTAINER: REGULAR ROWS, TIGHT CONTROLLED SPACING, NO EMPTY VOID */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div
          className="grid justify-center gap-x-4 sm:gap-x-5 gap-y-6"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, ${cardWidth}px))`,
          }}
        >
          {pages.map((page, pageIdx) => {
            const isSelected = pageIdx === selectedPageIndex;

            return (
              <div
                key={page.id || `grid-page-${pageIdx}`}
                className="flex flex-col items-center relative group"
                style={{ width: `${cardWidth}px` }}
              >
                {/* Page Card Box */}
                <div
                  onClick={() => setSelectedPageIndex(pageIdx)}
                  onDoubleClick={() => onSelectPageAndExit(pageIdx)}
                  className={`relative p-1.5 sm:p-2 rounded-xl transition-all duration-150 cursor-pointer select-none flex flex-col items-center ${
                    isSelected
                      ? 'border-2 border-indigo-600 ring-4 ring-indigo-500/20 bg-indigo-50/40 shadow-md'
                      : 'border-2 border-transparent hover:border-slate-300 bg-white/40 hover:bg-white hover:shadow-sm'
                  }`}
                  title={`Page ${pageIdx + 1} ${page.isIndependentArabic ? '(Version Arabe indépendante)' : ''} • Double-cliquez pour ouvrir dans l'éditeur`}
                >
                  {/* Visual Indicator Badge for Independent Arabic Page */}
                  {page.isIndependentArabic && (
                    <div className="absolute top-3 right-3 z-30 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <span>🇹🇳</span>
                      <span>Version indépendante (AR)</span>
                    </div>
                  )}

                  {/* Miniature Sheet */}
                  <div
                    style={{
                      width: `${thumbWidth}px`,
                      height: `${thumbHeight}px`,
                      overflow: 'hidden',
                      position: 'relative',
                      borderRadius: '8px',
                      backgroundColor:
                        documentSettings.backgroundColor || '#ffffff',
                      boxShadow:
                        '0 1px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
                    }}
                    className="border border-slate-200/90 shrink-0"
                  >
                    {/* Realistic Scaled A4 Content */}
                    <div
                      style={{
                        width: `${pageWidth}px`,
                        height: `${pageHeight}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        backgroundColor:
                          documentSettings.backgroundColor || '#ffffff',
                        fontFamily:
                          documentSettings.fontFamily ||
                          (page.isIndependentArabic || documentSettings.activeLanguage === 'ar'
                            ? 'Cairo, sans-serif'
                            : 'Outfit, sans-serif'),
                        fontWeight: 'normal',
                      }}
                    >
                      {/* Printable Area Guides if enabled */}
                      {documentSettings.showMarginGuides && (
                        <div
                          className="absolute border border-dashed border-indigo-200/70 pointer-events-none"
                          style={{
                            top: `${documentSettings.margins.top}px`,
                            left: `${documentSettings.margins.left}px`,
                            right: `${documentSettings.margins.right}px`,
                            bottom: `${documentSettings.margins.bottom}px`,
                          }}
                        />
                      )}

                      {/* Blocks preview */}
                      {page.blocks.map((block) => (
                        <WorksheetBlockItem
                          key={block.id}
                          block={block}
                          isSelected={false}
                          readOnly={true}
                          onSelect={() => {}}
                          onUpdate={() => {}}
                          onDuplicate={() => {}}
                          onDelete={() => {}}
                          onAddAfter={() => {}}
                          zoom={100}
                          pageWidth={pageWidth}
                          pageHeight={pageHeight}
                          onStartDrag={() => {}}
                          onStartResize={() => {}}
                          documentDefaultDirection={
                            page.isIndependentArabic
                              ? 'rtl'
                              : documentSettings.defaultTextDirection || (documentSettings.activeLanguage === 'ar' ? 'rtl' : 'ltr')
                          }
                          activeDocumentLanguage={
                            page.isIndependentArabic ? 'ar' : (documentSettings.activeLanguage || 'fr')
                          }
                          isPageIndependentArabic={page.isIndependentArabic}
                        />
                      ))}

                      {/* Footer page number */}
                      {documentSettings.showPageNumber && (
                        <div
                          className="absolute bottom-4 inset-x-0 text-center text-xs text-slate-400 pointer-events-none"
                          style={{
                            fontFamily: documentSettings.fontFamily || 'inherit',
                          }}
                        >
                          Page {pageIdx + 1}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Canva-style Page Number */}
                <div
                  className={`flex items-center justify-center gap-1.5 mt-1.5 text-xs font-semibold select-none transition-colors ${
                    isSelected ? 'text-indigo-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  <FileText
                    className={`w-3 h-3 ${
                      isSelected ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>Page {pageIdx + 1}</span>
                  {page.isIndependentArabic && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-200">
                      AR autonome
                    </span>
                  )}
                </div>

                {/* Quick Hover '+' Insert Button on right edge between pages */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsertPageAt(pageIdx + 1);
                  }}
                  title={`Ajouter une page entre la page ${pageIdx + 1} et la page ${pageIdx + 2}`}
                  className="absolute -right-3 top-[42%] -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white text-slate-500 hover:text-white hover:bg-indigo-600 border border-slate-300 hover:border-indigo-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-115 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            );
          })}

          {/* Canva '+' Card at end of grid */}
          <div
            className="flex flex-col items-center relative"
            style={{ width: `${cardWidth}px` }}
          >
            <div className="p-1.5 sm:p-2">
              <button
                type="button"
                onClick={onAddPage}
                style={{
                  width: `${thumbWidth}px`,
                  height: `${thumbHeight}px`,
                }}
                className="rounded-xl border border-slate-200/80 bg-slate-200/70 hover:bg-slate-300/70 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-all duration-150 shadow-xs hover:shadow-sm group"
                title="Ajouter une page à la fin"
              >
                <Plus className="w-7 h-7 stroke-[2] group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Bottom Page Number for next page */}
            <div className="flex items-center justify-center gap-1 mt-1.5 text-xs font-medium text-slate-400 select-none">
              <FileText className="w-3 h-3 text-slate-300" />
              <span>{pages.length + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
