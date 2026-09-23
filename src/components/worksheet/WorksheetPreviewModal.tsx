import React, { useState, useEffect } from 'react';
import {
  WorksheetDocument,
  A4_PORTRAIT_WIDTH,
  A4_PORTRAIT_HEIGHT,
  A4_LANDSCAPE_WIDTH,
  A4_LANDSCAPE_HEIGHT,
} from '../../types/worksheet';
import { WorksheetBlockItem } from './WorksheetBlockItem';
import {
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  ArrowLeft,
} from 'lucide-react';

interface WorksheetPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: WorksheetDocument;
  initialPageIndex?: number;
}

export const WorksheetPreviewModal: React.FC<WorksheetPreviewModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  initialPageIndex = 0,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);

  useEffect(() => {
    setCurrentPageIndex(initialPageIndex);
  }, [initialPageIndex, isOpen]);

  // Handle ESC key to close preview
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLandscape = doc.settings.orientation === 'landscape';
  const pageWidth = isLandscape ? A4_LANDSCAPE_WIDTH : A4_PORTRAIT_WIDTH;
  const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;

  const totalPages = doc.pages.length;
  const currentPage = doc.pages[currentPageIndex] || doc.pages[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="worksheet-preview-modal"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col select-none animate-in fade-in duration-150"
    >
      {/* 1. PREVIEW MODAL TOP BAR */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-lg print:hidden">
        {/* Left: Back to Editor & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Revenir à l'éditeur (Échap)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'éditeur</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold truncate text-slate-100">
              Aperçu avant impression : {doc.title || 'Fiche pédagogique'}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 hidden md:inline">
              A4 {isLandscape ? 'Paysage' : 'Portrait'}
            </span>
          </div>
        </div>

        {/* Center: Multi-page Selector if > 1 page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-200">
              Page {currentPageIndex + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPageIndex >= totalPages - 1}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Print Button & Close */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Imprimer ou enregistrer en PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimer / PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fermer l'aperçu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. PREVIEW CANVAS CONTAINER (SCROLLABLE) */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900/60 print:p-0 print:bg-white">
        <div
          id="worksheet-print-area"
          className="bg-white shadow-2xl relative transition-transform duration-200 print:shadow-none print:m-0"
          style={{
            width: `${pageWidth}px`,
            minWidth: `${pageWidth}px`,
            maxWidth: `${pageWidth}px`,
            height: `${pageHeight}px`,
            minHeight: `${pageHeight}px`,
            maxHeight: `${pageHeight}px`,
            transform: 'scale(0.92)',
            transformOrigin: 'top center',
          }}
        >
          {/* Subtle Print Margin Guidelines (hidden during printing) */}
          <div
            className="absolute border border-dashed border-slate-200 pointer-events-none print:hidden"
            style={{
              left: `${doc.settings.margins.left}px`,
              top: `${doc.settings.margins.top}px`,
              right: `${doc.settings.margins.right}px`,
              bottom: `${doc.settings.margins.bottom}px`,
            }}
          />

          {/* Clean Blocks in Read-Only Mode (Exact print appearance) */}
          {currentPage.blocks.map((block) => (
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
              documentDefaultDirection={doc.settings.defaultTextDirection || 'auto'}
            />
          ))}

          {/* Footer Page Number in preview if enabled */}
          {doc.settings.showPageNumber && (
            <div
              className="absolute bottom-4 inset-x-0 text-center text-xs text-slate-400 pointer-events-none"
              style={{
                fontFamily: doc.settings.fontFamily || 'inherit',
              }}
            >
              Page {currentPageIndex + 1} / {totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #worksheet-print-area, #worksheet-print-area * {
            visibility: visible !important;
          }
          #worksheet-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};
