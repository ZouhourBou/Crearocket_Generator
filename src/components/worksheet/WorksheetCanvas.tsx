import React, { useRef, useState, useEffect } from 'react';
import {
  WorksheetBlock,
  WorksheetPageData,
  DocumentSettings,
  WorksheetBlockType,
  A4_PORTRAIT_WIDTH,
  A4_PORTRAIT_HEIGHT,
  A4_LANDSCAPE_WIDTH,
  A4_LANDSCAPE_HEIGHT,
} from '../../types/worksheet';
import { WorksheetBlockItem } from './WorksheetBlockItem';
import { BlockInsertPopover } from './BlockInsertPopover';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { findInsertIndexForY } from '../../utils/worksheetLayout';

interface WorksheetCanvasProps {
  pages: WorksheetPageData[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  viewMode?: 'single' | 'continuous';
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  documentSettings: DocumentSettings;
  zoom: number;
  onUpdateBlock: (blockId: string, updates: Partial<WorksheetBlock>) => void;
  onDuplicateBlock: (blockId: string) => void;
  onDuplicateBlockAsLanguage?: (blockId: string, lang: 'ar' | 'fr') => void;
  onDuplicatePageAsIndependentArabic?: (pageIndex: number) => void;
  onDeleteBlock: (blockId: string) => void;
  onAddBlock: (
    type: WorksheetBlockType,
    customProps?: Partial<WorksheetBlock>,
    insertIndex?: number,
    targetPageIndex?: number
  ) => void;
  onReorderBlocks?: (fromIndex: number, toIndex: number, targetPageIndex?: number) => void;
  onMoveBlockToPage?: (blockId: string, targetPageIndex: number, targetIndex?: number) => void;
  isLeftPanelOpen: boolean;
  onOpenLeftPanel: () => void;
  isRightPanelOpen: boolean;
  onOpenRightPanel: () => void;
}

export const WorksheetCanvas: React.FC<WorksheetCanvasProps> = ({
  pages,
  currentPageIndex,
  onSelectPage,
  viewMode = 'single',
  selectedBlockId,
  onSelectBlock,
  documentSettings,
  zoom,
  onUpdateBlock,
  onDuplicateBlock,
  onDuplicateBlockAsLanguage,
  onDuplicatePageAsIndependentArabic,
  onDeleteBlock,
  onAddBlock,
  onReorderBlocks,
  onMoveBlockToPage,
  isLeftPanelOpen,
  onOpenLeftPanel,
  isRightPanelOpen,
  onOpenRightPanel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);

  const [canvasInsertPopover, setCanvasInsertPopover] = useState<{
    isOpen: boolean;
    afterBlock: WorksheetBlock | null;
    targetPageIndex: number;
    triggerRect: DOMRect | null;
  }>({
    isOpen: false,
    afterBlock: null,
    targetPageIndex: 0,
    triggerRect: null,
  });

  // Active snap guides during drag
  const [snapGuides, setSnapGuides] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });

  // Real-time insertion indicator during drag across pages
  const [insertionIndicator, setInsertionIndicator] = useState<{
    pageIndex: number;
    y: number;
  } | null>(null);

  // Page dimensions
  const isLandscape = documentSettings.orientation === 'landscape';
  const pageWidth = isLandscape ? A4_LANDSCAPE_WIDTH : A4_PORTRAIT_WIDTH;
  const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;
  const scale = zoom / 100;
  const scaledWidth = Math.round(pageWidth * scale);
  const scaledHeight = Math.round(pageHeight * scale);

  // In continuous mode, synchronize top bar page counter when scrolling
  const handleScroll = () => {
    if (viewMode !== 'continuous' || isProgrammaticScrollRef.current) return;
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const pageElements = containerRef.current.querySelectorAll<HTMLElement>('[data-page-index]');

    let bestIdx = currentPageIndex;
    let minDistance = Infinity;

    pageElements.forEach((el) => {
      const idx = parseInt(el.getAttribute('data-page-index') || '0', 10);
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerTop - 40);
      if (distance < minDistance) {
        minDistance = distance;
        bestIdx = idx;
      }
    });

    if (bestIdx !== currentPageIndex && bestIdx >= 0 && bestIdx < pages.length) {
      onSelectPage(bestIdx);
    }
  };

  // When switching pages or clicking prev/next in continuous mode, scroll to page
  useEffect(() => {
    if (viewMode === 'continuous') {
      const pageEl = document.getElementById(`worksheet-a4-page-${currentPageIndex}`);
      if (pageEl && containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const pRect = pageEl.getBoundingClientRect();
        const isInView = pRect.top >= cRect.top - 80 && pRect.top <= cRect.top + 250;
        if (!isInView) {
          isProgrammaticScrollRef.current = true;
          pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const timer = setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 450);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [currentPageIndex, viewMode]);

  // Handle Dragging Blocks with vertical flow reordering and live insertion indicator across pages
  const handleStartDrag = (e: React.MouseEvent, blockId: string, sourcePageIdx: number) => {
    e.preventDefault();
    const sourcePage = pages[sourcePageIdx];
    if (!sourcePage) return;
    const block = sourcePage.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startBlockX = block.x;
    const startBlockY = block.y;

    let currentTargetPageIdx = sourcePageIdx;
    let currentInsertIndex = sourcePage.blocks.findIndex((b) => b.id === blockId);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startMouseX) / scale;
      const deltaY = (moveEvent.clientY - startMouseY) / scale;

      let newX = Math.round(startBlockX + deltaX);
      let newY = Math.round(startBlockY + deltaY);

      newX = Math.max(0, Math.min(pageWidth - block.width, newX));
      newY = Math.max(0, Math.min(pageHeight - block.height, newY));

      // Determine which page is under the cursor
      const elUnder = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
      const pageCard = elUnder?.closest('[data-page-index]') as HTMLElement | null;
      if (pageCard) {
        const pageIdxAttr = pageCard.getAttribute('data-page-index');
        if (pageIdxAttr !== null) {
          currentTargetPageIdx = parseInt(pageIdxAttr, 10);
        }
      }

      const targetPage = pages[currentTargetPageIdx] || sourcePage;
      const targetRect = pageCard?.getBoundingClientRect();
      const localY = targetRect
        ? (moveEvent.clientY - targetRect.top) / scale
        : newY;

      // Filter other blocks on target page
      const candidateBlocks =
        currentTargetPageIdx === sourcePageIdx
          ? targetPage.blocks.filter((b) => b.id !== blockId)
          : targetPage.blocks;

      currentInsertIndex = findInsertIndexForY(candidateBlocks, localY);

      // Position the live insertion line
      let indY: number;
      if (candidateBlocks.length === 0) {
        indY = documentSettings.margins.top || 50;
      } else if (currentInsertIndex === 0) {
        indY = Math.max(20, candidateBlocks[0].y - 8);
      } else if (currentInsertIndex >= candidateBlocks.length) {
        const last = candidateBlocks[candidateBlocks.length - 1];
        indY = last.y + last.height + 7.5;
      } else {
        const prev = candidateBlocks[currentInsertIndex - 1];
        indY = prev.y + prev.height + 7.5;
      }

      setInsertionIndicator({ pageIndex: currentTargetPageIdx, y: indY });
      onUpdateBlock(blockId, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setInsertionIndicator(null);
      setSnapGuides({ vertical: [], horizontal: [] });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (currentTargetPageIdx === sourcePageIdx) {
        const fromIndex = sourcePage.blocks.findIndex((b) => b.id === blockId);
        if (fromIndex !== -1 && onReorderBlocks) {
          onReorderBlocks(fromIndex, currentInsertIndex, sourcePageIdx);
        }
      } else {
        if (onMoveBlockToPage) {
          onMoveBlockToPage(blockId, currentTargetPageIdx, currentInsertIndex);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Resize Block from Corner Handles
  const handleStartResize = (
    e: React.MouseEvent,
    blockId: string,
    handle: 'nw' | 'ne' | 'se' | 'sw',
    pageIndex: number
  ) => {
    e.preventDefault();
    const page = pages[pageIndex];
    if (!page) return;
    const block = page.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = block.x;
    const startY = block.y;
    const startW = block.width;
    const startH = block.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startMouseX) / scale;
      const deltaY = (moveEvent.clientY - startMouseY) / scale;

      let newX = startX;
      let newY = startY;
      let newW = startW;
      let newH = startH;

      if (handle === 'se') {
        newW = Math.max(30, startW + deltaX);
        newH = Math.max(15, startH + deltaY);
      } else if (handle === 'sw') {
        newW = Math.max(30, startW - deltaX);
        newX = startX + (startW - newW);
        newH = Math.max(15, startH + deltaY);
      } else if (handle === 'ne') {
        newW = Math.max(30, startW + deltaX);
        newH = Math.max(15, startH - deltaY);
        newY = startY + (startH - newH);
      } else if (handle === 'nw') {
        newW = Math.max(30, startW - deltaX);
        newX = startX + (startW - newW);
        newH = Math.max(15, startH - deltaY);
        newY = startY + (startH - newH);
      }

      onUpdateBlock(blockId, {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Drop zone: Drag from left panel onto page into vertical flow
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnPage = (e: React.DragEvent, pageIndex: number) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as WorksheetBlockType;
    if (!type) return;

    const targetPage = pages[pageIndex] || pages[0];
    const pageCard = (e.currentTarget as HTMLElement).closest('[data-page-index]') as HTMLElement | null;
    if (!pageCard) return;

    const rect = pageCard.getBoundingClientRect();
    const dropY = Math.round((e.clientY - rect.top) / scale);

    const insertIndex = findInsertIndexForY(targetPage.blocks, dropY);
    onAddBlock(type, undefined, insertIndex, pageIndex);
  };

  // Determine pages to render based on viewMode
  const pagesToRender: Array<{ page: WorksheetPageData; index: number }> =
    viewMode === 'continuous'
      ? pages.map((page, index) => ({ page, index }))
      : [{ page: pages[currentPageIndex] || pages[0], index: currentPageIndex }];

  return (
    <div
      id="worksheet-canvas-container"
      ref={containerRef}
      onScroll={handleScroll}
      onClick={() => onSelectBlock(null)}
      className="flex-1 min-w-[340px] min-h-0 h-full overflow-x-auto overflow-y-auto bg-slate-100/90 relative custom-scrollbar select-none"
      style={{
        backgroundImage:
          'radial-gradient(#cbd5e1 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #f1f5f9 0.75px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px',
      }}
    >
      {/* Floating Handle to reopen Left Panel if closed */}
      {!isLeftPanelOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLeftPanel();
          }}
          title="Ouvrir la bibliothèque de blocs"
          className="absolute left-2 top-3 z-40 bg-white hover:bg-indigo-50 text-indigo-700 p-2 rounded-r-lg border border-l-0 border-slate-200 shadow-sm transition-all cursor-pointer hover:scale-105"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* Floating Handle to reopen Right Panel if closed */}
      {!isRightPanelOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenRightPanel();
          }}
          title="Ouvrir le panneau de propriétés"
          className="absolute right-2 top-3 z-40 bg-white hover:bg-indigo-50 text-indigo-700 p-2 rounded-l-lg border border-r-0 border-slate-200 shadow-sm transition-all cursor-pointer hover:scale-105"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      )}

      {/* Canvas Workspace: Centered single page or vertically stacked continuous scroll */}
      <div
        className={`w-fit min-w-full min-h-full p-4 sm:p-8 flex flex-col items-center ${
          viewMode === 'continuous' ? 'gap-10 pb-16' : 'justify-center'
        }`}
      >
        {pagesToRender.map(({ page, index: pageIdx }) => (
          <div key={page.id || `page-${pageIdx}`} className="flex flex-col items-center shrink-0">
            {/* Page Header Indicator (Word / Canva style) */}
            <div
              style={{ width: `${scaledWidth}px` }}
              className="flex items-center justify-between mb-2 px-1 select-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md border text-xs font-bold shadow-2xs transition-colors ${
                    pageIdx === currentPageIndex
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white/90 border-slate-200/90 text-slate-600'
                  }`}
                >
                  Page {pageIdx + 1}
                </span>

                {page.isIndependentArabic ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                    <span>🇹🇳</span>
                    <span>Version Arabe autonome</span>
                  </span>
                ) : (
                  onDuplicatePageAsIndependentArabic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicatePageAsIndependentArabic(pageIdx);
                      }}
                      title="Dupliquer cette page en tant que version Arabe autonome (non liée)"
                      className="text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>🇹🇳</span>
                      <span>Copie AR autonome</span>
                    </button>
                  )
                )}

                <span className="text-[11px] text-slate-400 font-medium">
                  {page.blocks.length} {page.blocks.length > 1 ? 'blocs' : 'bloc'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                A4 {isLandscape ? 'Paysage' : 'Portrait'}
              </div>
            </div>

            {/* Scaled Wrapper for Zoom & Canvas Size */}
            <div
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
              className="shrink-0 relative"
            >
              <div
                style={{
                  width: `${pageWidth}px`,
                  height: `${pageHeight}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative"
              >
                {/* The Realistic A4 Sheet */}
                <div
                  id={`worksheet-a4-page-${pageIdx}`}
                  data-page-index={pageIdx}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnPage(e, pageIdx)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPage(pageIdx);
                    const target = e.target as HTMLElement;
                    const isBlockOrControl = target.closest(
                      '[data-block-id], [id^="block-"], button, input, textarea, [contenteditable="true"]'
                    );
                    if (!isBlockOrControl) {
                      onSelectBlock(null);
                    }
                  }}
                  className="w-full h-full relative rounded-xs border border-slate-300/80 shadow-2xl transition-colors"
                  style={{
                    backgroundColor: documentSettings.backgroundColor || '#ffffff',
                    fontFamily:
                      documentSettings.fontFamily ||
                      (page.isIndependentArabic || documentSettings.activeLanguage === 'ar'
                        ? 'Cairo, sans-serif'
                        : 'Outfit, sans-serif'),
                    fontWeight: 'normal',
                  }}
                >
                  {/* Margin Guides (Printable area boundaries) */}
                  {documentSettings.showMarginGuides && (
                    <div
                      className="absolute pointer-events-none border border-dashed border-indigo-200/70"
                      style={{
                        top: `${documentSettings.margins.top}px`,
                        left: `${documentSettings.margins.left}px`,
                        right: `${documentSettings.margins.right}px`,
                        bottom: `${documentSettings.margins.bottom}px`,
                      }}
                    />
                  )}

                  {/* Real-time Vertical Flow Insertion Indicator on this page */}
                  {insertionIndicator && insertionIndicator.pageIndex === pageIdx && (
                    <div
                      className="absolute left-8 right-8 h-1 bg-indigo-600 rounded-full z-40 pointer-events-none transition-all shadow-md flex items-center justify-between"
                      style={{ top: `${insertionIndicator.y}px` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-200" />
                    </div>
                  )}

                  {/* Render Page Blocks */}
                  {page.blocks.map((block) => (
                    <WorksheetBlockItem
                      key={block.id}
                      block={block}
                      isSelected={block.id === selectedBlockId}
                      onSelect={() => {
                        onSelectBlock(block.id);
                        onSelectPage(pageIdx);
                      }}
                      onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                      onDuplicate={() => onDuplicateBlock(block.id)}
                      onDuplicateAsLanguage={(lang) => onDuplicateBlockAsLanguage?.(block.id, lang)}
                      onDelete={() => onDeleteBlock(block.id)}
                      onAddAfter={(e) => {
                        const rect = (e?.currentTarget as HTMLElement)?.getBoundingClientRect() || null;
                        setCanvasInsertPopover({
                          isOpen: true,
                          afterBlock: block,
                          targetPageIndex: pageIdx,
                          triggerRect: rect,
                        });
                      }}
                      zoom={zoom}
                      pageWidth={pageWidth}
                      pageHeight={pageHeight}
                      onStartDrag={(e, bId) => handleStartDrag(e, bId, pageIdx)}
                      onStartResize={(e, bId, handle) => handleStartResize(e, bId, handle, pageIdx)}
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

                  {/* Page Footer Number if enabled */}
                  {documentSettings.showPageNumber && (
                    <div
                      className="absolute bottom-4 inset-x-0 text-center text-xs text-slate-400 pointer-events-none select-none"
                      style={{ fontFamily: documentSettings.fontFamily || 'inherit' }}
                    >
                      Page {pageIdx + 1} / {pages.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shopify-style Block Insertion Popover on Canvas */}
      <BlockInsertPopover
        isOpen={canvasInsertPopover.isOpen}
        onClose={() =>
          setCanvasInsertPopover({
            isOpen: false,
            afterBlock: null,
            targetPageIndex: 0,
            triggerRect: null,
          })
        }
        triggerRect={canvasInsertPopover.triggerRect}
        positionHint="center"
        onSelectOption={(opt) => {
          const targetPageIndex = canvasInsertPopover.targetPageIndex;
          const targetPage = pages[targetPageIndex] || pages[0];
          const afterBlock = canvasInsertPopover.afterBlock;
          const targetY = afterBlock
            ? Math.min(pageHeight - (opt.customProps?.height || 60), afterBlock.y + afterBlock.height + 15)
            : 100;
          const targetX = afterBlock ? afterBlock.x : 60;
          const targetWidth = afterBlock ? afterBlock.width : 674;

          const blockIndex = afterBlock
            ? targetPage.blocks.findIndex((b) => b.id === afterBlock.id)
            : -1;
          const insertIdx = blockIndex !== -1 ? blockIndex + 1 : undefined;

          onAddBlock(
            opt.type,
            {
              y: targetY,
              x: targetX,
              width: targetWidth,
              ...opt.customProps,
            },
            insertIdx,
            targetPageIndex
          );
          setCanvasInsertPopover({
            isOpen: false,
            afterBlock: null,
            targetPageIndex: 0,
            triggerRect: null,
          });
        }}
      />
    </div>
  );
};
