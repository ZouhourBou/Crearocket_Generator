import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  WorksheetDocument,
  WorksheetBlock,
  WorksheetBlockType,
  WorksheetPageData,
  PageOrientation,
  DocumentSettings,
  A4_PORTRAIT_WIDTH,
  A4_PORTRAIT_HEIGHT,
  A4_LANDSCAPE_WIDTH,
  A4_LANDSCAPE_HEIGHT,
} from '../../types/worksheet';
import {
  createInitialDocument,
  createDefaultBlock,
} from '../../data/defaultWorksheet';
import {
  layoutVerticalFlow,
  reflowDocumentPages,
  cleanupTrailingEmptyPages,
} from '../../utils/worksheetLayout';
import {
  applyLanguageToDocument,
  duplicatePageAsIndependentArabic,
} from '../../utils/multilingual';
import { WorksheetTopBar } from './WorksheetTopBar';
import { WorksheetLeftPanel } from './WorksheetLeftPanel';
import { WorksheetCanvas } from './WorksheetCanvas';
import { WorksheetRightPanel } from './WorksheetRightPanel';
import { WorksheetPreviewModal } from './WorksheetPreviewModal';
import { WorksheetGridView } from './WorksheetGridView';
import { DocumentLanguage } from '../../types/worksheet';

interface WorksheetEditorProps {
  onBackToHome?: () => void;
}

export const WorksheetEditor: React.FC<WorksheetEditorProps> = ({ onBackToHome }) => {
  // Master Document State
  const [doc, setDoc] = useState<WorksheetDocument>(createInitialDocument);

  // Undo / Redo History Stacks
  const [history, setHistory] = useState<WorksheetDocument[]>([]);
  const [redoStack, setRedoStack] = useState<WorksheetDocument[]>([]);

  // Navigation & Selection
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // View Mode: 'single' (page by page) or 'continuous' (infinite vertical scroll by default)
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');

  // Grid View Mode (Canva-style thumbnails grid overview)
  const [isGridMode, setIsGridMode] = useState<boolean>(false);
  const savedScrollTopRef = useRef<number>(0);
  const lastActivePageRef = useRef<number>(0);

  // Zoom (50% to 150%)
  const [zoom, setZoom] = useState<number>(100);

  // Collapsible Panels (Modern Shopify / Page Builder UX)
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);

  // Resizable Panel Widths (Point 2)
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(240);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(240);
  const [isResizingLeft, setIsResizingLeft] = useState<boolean>(false);
  const [isResizingRight, setIsResizingRight] = useState<boolean>(false);

  // Synchronized refs to always have latest widths without re-triggering resize effects
  const leftPanelWidthRef = useRef(leftPanelWidth);
  leftPanelWidthRef.current = leftPanelWidth;

  const rightPanelWidthRef = useRef(rightPanelWidth);
  rightPanelWidthRef.current = rightPanelWidth;

  // Harmonized, symmetrical bounds for both panels
  const MIN_LEFT_WIDTH = 220;
  const MAX_LEFT_WIDTH = 360;
  const MIN_RIGHT_WIDTH = 220;
  const MAX_RIGHT_WIDTH = 360;
  const MIN_CANVAS_WIDTH = 340;

  // Print-ready Fullscreen Preview Modal State (Point 3)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Responsive: gracefully reduce column widths on window resize to guarantee central canvas room
  useEffect(() => {
    const handleResize = () => {
      // Do not auto-resize during manual dragging
      if (isResizingLeft || isResizingRight) return;

      const width = window.innerWidth;
      if (isLeftPanelOpen && isRightPanelOpen) {
        const requiredCanvas = MIN_CANVAS_WIDTH;
        const availableForPanels = width - requiredCanvas;
        const currentTotalPanels = leftPanelWidthRef.current + rightPanelWidthRef.current;
        if (currentTotalPanels > availableForPanels && availableForPanels > 0) {
          const excess = currentTotalPanels - availableForPanels;
          const leftCanShrink = Math.max(0, leftPanelWidthRef.current - MIN_LEFT_WIDTH);
          const rightCanShrink = Math.max(0, rightPanelWidthRef.current - MIN_RIGHT_WIDTH);
          const totalCanShrink = leftCanShrink + rightCanShrink;
          if (totalCanShrink > 0) {
            const leftReduction = Math.min(
              leftCanShrink,
              Math.round(excess * (leftCanShrink / totalCanShrink))
            );
            const rightReduction = Math.min(rightCanShrink, excess - leftReduction);
            if (leftReduction > 0) setLeftPanelWidth((w) => Math.max(MIN_LEFT_WIDTH, w - leftReduction));
            if (rightReduction > 0) setRightPanelWidth((w) => Math.max(MIN_RIGHT_WIDTH, w - rightReduction));
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLeftPanelOpen, isRightPanelOpen, isResizingLeft, isResizingRight]);

  // Resizing handlers with double-arrow ↔ cursor and boundary safety (Point 2)
  const handleStartResizeLeft = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = leftPanelWidthRef.current;
    setIsResizingLeft(true);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const totalWidth = window.innerWidth;
      const currentRightWidth = isRightPanelOpen ? rightPanelWidthRef.current : 0;
      const maxAllowed = Math.min(
        MAX_LEFT_WIDTH,
        Math.max(MIN_LEFT_WIDTH, totalWidth - currentRightWidth - MIN_CANVAS_WIDTH)
      );
      const newWidth = Math.max(MIN_LEFT_WIDTH, Math.min(maxAllowed, startWidth + deltaX));
      setLeftPanelWidth(newWidth);
    };

    const onPointerUp = () => {
      setIsResizingLeft(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleStartResizeRight = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = rightPanelWidthRef.current;
    setIsResizingRight(true);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onPointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      // Dragging left (moveEvent.clientX < startX) increases right panel width
      const deltaX = moveEvent.clientX - startX;
      const totalWidth = window.innerWidth;
      const currentLeftWidth = isLeftPanelOpen ? leftPanelWidthRef.current : 0;
      const maxAllowed = Math.min(
        MAX_RIGHT_WIDTH,
        Math.max(MIN_RIGHT_WIDTH, totalWidth - currentLeftWidth - MIN_CANVAS_WIDTH)
      );
      const newWidth = Math.max(MIN_RIGHT_WIDTH, Math.min(maxAllowed, startWidth - deltaX));
      setRightPanelWidth(newWidth);
    };

    const onPointerUp = () => {
      setIsResizingRight(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const currentPage = doc.pages[currentPageIndex] || doc.pages[0];
  const selectedBlock =
    currentPage?.blocks.find((b) => b.id === selectedBlockId) || null;

  // Helper to commit state with Undo record
  const pushState = useCallback(
    (newDoc: WorksheetDocument) => {
      setHistory((prev) => [...prev.slice(-25), doc]);
      setRedoStack([]);
      setDoc(newDoc);
    },
    [doc]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    setRedoStack((prev) => [doc, ...prev]);
    setHistory(newHistory);
    setDoc(previous);
  }, [history, doc]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    const newRedo = redoStack.slice(1);

    setHistory((prev) => [...prev, doc]);
    setRedoStack(newRedo);
    setDoc(next);
  }, [redoStack, doc]);

  // Document Title Change
  const handleTitleChange = (newTitle: string) => {
    setDoc((prev) => ({ ...prev, title: newTitle }));
  };

  // Orientation Change
  const handleOrientationChange = (orientation: PageOrientation) => {
    const isLandscape = orientation === 'landscape';
    const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;

    const { pages: reflowed } = reflowDocumentPages(
      doc.pages,
      pageHeight,
      doc.settings.margins,
      15
    );
    const cleaned = cleanupTrailingEmptyPages(reflowed, currentPageIndex);

    pushState({
      ...doc,
      settings: {
        ...doc.settings,
        orientation,
      },
      pages: cleaned,
    });
  };

  // Document Settings Change
  const handleUpdateDocumentSettings = (settings: Partial<DocumentSettings>) => {
    const newSettings = {
      ...doc.settings,
      ...settings,
    };
    const isLandscape = newSettings.orientation === 'landscape';
    const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;

    const { pages: reflowed } = reflowDocumentPages(
      doc.pages,
      pageHeight,
      newSettings.margins,
      15
    );
    const cleaned = cleanupTrailingEmptyPages(reflowed, currentPageIndex);

    pushState({
      ...doc,
      settings: newSettings,
      pages: cleaned,
    });
  };

  // Global Language Change (Français / English / العربية)
  const handleLanguageChange = (language: DocumentLanguage) => {
    const updatedDoc = applyLanguageToDocument(doc, language);
    pushState(updatedDoc);
  };

  // Auto-pagination / reflow logic (Point 1)
  const reflowDoc = useCallback(
    (
      pages: WorksheetPageData[],
      followBlockId?: string | null,
      preferredPageIndex?: number
    ): { pages: WorksheetPageData[]; targetPageIndex: number } => {
      const isLandscape = doc.settings.orientation === 'landscape';
      const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;

      // Automatically reflow across pages according to A4 printable boundaries
      const { pages: reflowed } = reflowDocumentPages(
        pages,
        pageHeight,
        doc.settings.margins,
        15
      );

      // Clean up empty trailing pages (leaving active page intact)
      const baseIdx = preferredPageIndex ?? currentPageIndex;
      const cleaned = cleanupTrailingEmptyPages(reflowed, baseIdx);

      // Determine where the user/focus should go
      let targetIdx = baseIdx;
      if (followBlockId) {
        const found = cleaned.findIndex((p) =>
          p.blocks.some((b) => b.id === followBlockId)
        );
        if (found !== -1) {
          targetIdx = found;
        }
      }

      targetIdx = Math.max(0, Math.min(cleaned.length - 1, targetIdx));

      return {
        pages: cleaned,
        targetPageIndex: targetIdx,
      };
    },
    [doc.settings.orientation, doc.settings.margins, currentPageIndex]
  );

  // Add Block to Current Page (supports inserting at specific index or target page)
  const handleAddBlock = (
    type: WorksheetBlockType,
    customProps?: Partial<WorksheetBlock>,
    insertIndex?: number,
    targetPageIndex?: number
  ) => {
    const isLandscape = doc.settings.orientation === 'landscape';
    const pageWidth = isLandscape ? A4_LANDSCAPE_WIDTH : A4_PORTRAIT_WIDTH;

    // Center horizontally by default with standard margin
    const blockWidth =
      customProps?.width ||
      (type === 'image' ? 240 : type === 'shape' ? 160 : Math.min(674, pageWidth - 100));
    const defaultX = customProps?.x ?? Math.round((pageWidth - blockWidth) / 2);

    const pageIdx = typeof targetPageIndex === 'number' ? targetPageIndex : currentPageIndex;
    const targetPage = doc.pages[pageIdx] || doc.pages[0];
    const currentBlocks = [...targetPage.blocks];
    const insertAt =
      typeof insertIndex === 'number' &&
      insertIndex >= 0 &&
      insertIndex <= currentBlocks.length
        ? insertIndex
        : currentBlocks.length;

    const newBlock = createDefaultBlock(type, defaultX, 0, {
      width: blockWidth,
      ...customProps,
    });

    const updatedBlocks = [...currentBlocks];
    updatedBlocks.splice(insertAt, 0, newBlock);

    const updatedPages = doc.pages.map((p, idx) => {
      if (idx !== pageIdx) return p;
      return {
        ...p,
        blocks: updatedBlocks,
      };
    });

    const { pages: finalPages, targetPageIndex: newPageIdx } = reflowDoc(
      updatedPages,
      newBlock.id,
      pageIdx
    );

    pushState({
      ...doc,
      pages: finalPages,
    });

    // Auto-select the newly added block and navigate to its page
    setCurrentPageIndex(newPageIdx);
    setSelectedBlockId(newBlock.id);
  };

  // Duplicate Block
  const handleDuplicateBlock = (blockId: string) => {
    let foundPageIdx = -1;
    let foundBlockIdx = -1;
    for (let pIdx = 0; pIdx < doc.pages.length; pIdx++) {
      const bIdx = doc.pages[pIdx].blocks.findIndex((b) => b.id === blockId);
      if (bIdx !== -1) {
        foundPageIdx = pIdx;
        foundBlockIdx = bIdx;
        break;
      }
    }
    if (foundPageIdx === -1) return;

    const page = doc.pages[foundPageIdx];
    const blockToCopy = page.blocks[foundBlockIdx];
    const duplicatedBlock: WorksheetBlock = {
      ...blockToCopy,
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    const currentBlocks = [...page.blocks];
    currentBlocks.splice(foundBlockIdx + 1, 0, duplicatedBlock);

    const updatedPages = doc.pages.map((p, idx) => {
      if (idx !== foundPageIdx) return p;
      return {
        ...p,
        blocks: currentBlocks,
      };
    });

    const { pages: finalPages, targetPageIndex: newPageIdx } = reflowDoc(
      updatedPages,
      duplicatedBlock.id,
      foundPageIdx
    );

    pushState({
      ...doc,
      pages: finalPages,
    });

    setCurrentPageIndex(newPageIdx);
    setSelectedBlockId(duplicatedBlock.id);
  };

  // Duplicate Block with Language flip (French <-> Arabic)
  const handleDuplicateBlockAsLanguage = (blockId: string, targetLang: 'ar' | 'fr') => {
    let foundPageIdx = -1;
    let foundBlockIdx = -1;
    for (let pIdx = 0; pIdx < doc.pages.length; pIdx++) {
      const bIdx = doc.pages[pIdx].blocks.findIndex((b) => b.id === blockId);
      if (bIdx !== -1) {
        foundPageIdx = pIdx;
        foundBlockIdx = bIdx;
        break;
      }
    }
    if (foundPageIdx === -1) return;

    const page = doc.pages[foundPageIdx];
    const blockToCopy = page.blocks[foundBlockIdx];

    const isTargetAr = targetLang === 'ar';
    const targetDirection = isTargetAr ? 'rtl' : 'ltr';
    const targetAlign =
      blockToCopy.styles.textAlign === 'center'
        ? 'center'
        : isTargetAr
        ? 'right'
        : 'left';

    const updatedStyles = {
      ...blockToCopy.styles,
      textDirection: targetDirection as 'rtl' | 'ltr',
      textAlign: targetAlign as any,
      languageMode: targetLang,
    };

    const updatedContent = { ...blockToCopy.content };
    if (blockToCopy.type === 'qcm_exam') {
      updatedContent.markerPosition = isTargetAr ? 'after' : 'before';
    } else if (blockToCopy.type === 'exercise_header') {
      updatedContent.pointsPosition = isTargetAr ? 'left' : 'right';
    }

    const duplicatedBlock: WorksheetBlock = {
      ...blockToCopy,
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      styles: updatedStyles,
      content: updatedContent,
    };

    const currentBlocks = [...page.blocks];
    currentBlocks.splice(foundBlockIdx + 1, 0, duplicatedBlock);

    const updatedPages = doc.pages.map((p, idx) => {
      if (idx !== foundPageIdx) return p;
      return {
        ...p,
        blocks: currentBlocks,
      };
    });

    const { pages: finalPages, targetPageIndex: newPageIdx } = reflowDoc(
      updatedPages,
      duplicatedBlock.id,
      foundPageIdx
    );

    pushState({
      ...doc,
      pages: finalPages,
    });

    setCurrentPageIndex(newPageIdx);
    setSelectedBlockId(duplicatedBlock.id);
  };

  // Delete Block
  const handleDeleteBlock = (blockId: string) => {
    const updatedPages = doc.pages.map((p) => ({
      ...p,
      blocks: p.blocks.filter((b) => b.id !== blockId),
    }));

    const { pages: finalPages, targetPageIndex: newPageIdx } = reflowDoc(
      updatedPages,
      null,
      currentPageIndex
    );

    pushState({
      ...doc,
      pages: finalPages,
    });

    setCurrentPageIndex(newPageIdx);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  // Update Block
  const handleUpdateBlock = (
    blockId: string,
    updates: Partial<WorksheetBlock>
  ) => {
    setDoc((prev) => {
      let changed = false;
      const updatedPages = prev.pages.map((p) => {
        const containsBlock = p.blocks.some((b) => b.id === blockId);
        if (!containsBlock) return p;
        changed = true;
        return {
          ...p,
          blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
        };
      });

      if (!changed) return prev;

      // Re-reflow pages when block dimensions or positions are modified
      const isLandscape = prev.settings.orientation === 'landscape';
      const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;
      const { pages: reflowed } = reflowDocumentPages(
        updatedPages,
        pageHeight,
        prev.settings.margins,
        15
      );
      const cleaned = cleanupTrailingEmptyPages(reflowed, currentPageIndex);

      return {
        ...prev,
        pages: cleaned,
      };
    });
  };

  // Update Block Styles
  const handleUpdateBlockStyles = (
    styles: Partial<WorksheetBlock['styles']>
  ) => {
    if (!selectedBlockId) return;
    setDoc((prev) => {
      const updatedPages = prev.pages.map((p) => ({
        ...p,
        blocks: p.blocks.map((b) =>
          b.id === selectedBlockId
            ? { ...b, styles: { ...b.styles, ...styles } }
            : b
        ),
      }));

      const isLandscape = prev.settings.orientation === 'landscape';
      const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;
      const { pages: reflowed } = reflowDocumentPages(
        updatedPages,
        pageHeight,
        prev.settings.margins,
        15
      );
      const cleaned = cleanupTrailingEmptyPages(reflowed, currentPageIndex);

      return { ...prev, pages: cleaned };
    });
  };

  // Update Block Content (e.g. adding questions or text lines)
  const handleUpdateBlockContent = (
    content: Partial<WorksheetBlock['content']>
  ) => {
    if (!selectedBlockId) return;
    setDoc((prev) => {
      const updatedPages = prev.pages.map((p) => ({
        ...p,
        blocks: p.blocks.map((b) =>
          b.id === selectedBlockId
            ? { ...b, content: { ...b.content, ...content } }
            : b
        ),
      }));

      const isLandscape = prev.settings.orientation === 'landscape';
      const pageHeight = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_PORTRAIT_HEIGHT;
      const { pages: reflowed } = reflowDocumentPages(
        updatedPages,
        pageHeight,
        prev.settings.margins,
        15
      );
      const cleaned = cleanupTrailingEmptyPages(reflowed, currentPageIndex);

      return { ...prev, pages: cleaned };
    });
  };

  // Move block across pages (for continuous scroll mode drag & drop)
  const handleMoveBlockToPage = (
    blockId: string,
    targetPageIndex: number,
    targetIndex?: number
  ) => {
    let blockToMove: WorksheetBlock | null = null;
    const pagesWithoutBlock = doc.pages.map((p) => {
      const found = p.blocks.find((b) => b.id === blockId);
      if (found) blockToMove = found;
      return {
        ...p,
        blocks: p.blocks.filter((b) => b.id !== blockId),
      };
    });

    if (!blockToMove) return;

    const safeTargetIdx = Math.max(0, Math.min(pagesWithoutBlock.length - 1, targetPageIndex));
    const targetBlocks = [...pagesWithoutBlock[safeTargetIdx].blocks];
    const insertAt =
      typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= targetBlocks.length
        ? targetIndex
        : targetBlocks.length;

    targetBlocks.splice(insertAt, 0, blockToMove);
    pagesWithoutBlock[safeTargetIdx].blocks = targetBlocks;

    const { pages: finalPages, targetPageIndex: newPageIdx } = reflowDoc(
      pagesWithoutBlock,
      blockId,
      safeTargetIdx
    );

    pushState({
      ...doc,
      pages: finalPages,
    });
    setCurrentPageIndex(newPageIdx);
    setSelectedBlockId(blockId);
  };

  // Reorder Block in Structure (by index drag & drop)
  const handleReorderBlocks = (
    fromIndex: number,
    toIndex: number,
    targetPageIndex?: number
  ) => {
    const pageIdx = typeof targetPageIndex === 'number' ? targetPageIndex : currentPageIndex;
    const page = doc.pages[pageIdx];
    if (!page || fromIndex === toIndex) return;

    const currentBlocks = [...page.blocks];
    if (
      fromIndex < 0 ||
      fromIndex >= currentBlocks.length ||
      toIndex < 0 ||
      toIndex >= currentBlocks.length
    ) {
      return;
    }

    const [movedBlock] = currentBlocks.splice(fromIndex, 1);
    currentBlocks.splice(toIndex, 0, movedBlock);

    const updatedPages = doc.pages.map((p, idx) => {
      if (idx !== pageIdx) return p;
      return { ...p, blocks: currentBlocks };
    });

    const { pages: finalPages, targetPageIndex: newPageIdx } = reflowDoc(
      updatedPages,
      movedBlock.id,
      pageIdx
    );

    pushState({
      ...doc,
      pages: finalPages,
    });
    setCurrentPageIndex(newPageIdx);
  };

  // Legacy Reorder Block in Structure (up / down)
  const handleReorderBlock = (blockId: string, direction: 'up' | 'down') => {
    const list = [...currentPage.blocks];
    const index = list.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      handleReorderBlocks(index, index - 1);
    } else if (direction === 'down' && index < list.length - 1) {
      handleReorderBlocks(index, index + 1);
    }
  };

  // Add New Page
  const handleAddPage = () => {
    const newPageNumber = doc.pages.length + 1;
    const newPage = {
      id: `page_${Date.now()}`,
      pageNumber: newPageNumber,
      blocks: [],
    };

    pushState({
      ...doc,
      pages: [...doc.pages, newPage],
    });

    setCurrentPageIndex(doc.pages.length);
    setSelectedBlockId(null);
  };

  // Delete Current Page
  const handleDeleteCurrentPage = () => {
    if (doc.pages.length <= 1) return;

    const updatedPages = doc.pages
      .filter((_, idx) => idx !== currentPageIndex)
      .map((p, i) => ({ ...p, pageNumber: i + 1 }));

    pushState({
      ...doc,
      pages: updatedPages,
    });

    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    setSelectedBlockId(null);
  };

  // Insert a new blank page at a specific position (e.g. between page 1 and 2, or at the end)
  const handleInsertPageAt = useCallback((index: number) => {
    const newPage: WorksheetPageData = {
      id: `page_${Date.now()}`,
      pageNumber: index + 1,
      blocks: [],
    };

    const newPages = [...doc.pages];
    const safeIndex = Math.max(0, Math.min(newPages.length, index));
    newPages.splice(safeIndex, 0, newPage);
    const reindexedPages = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

    pushState({
      ...doc,
      pages: reindexedPages,
    });
    setCurrentPageIndex(safeIndex);
    setSelectedBlockId(null);
  }, [doc, pushState]);

  // Duplicate a specific page (used by Grid View)
  const handleDuplicatePage = useCallback((pageIndex: number) => {
    const pageToCopy = doc.pages[pageIndex];
    if (!pageToCopy) return;

    const duplicatedBlocks = pageToCopy.blocks.map((b) => ({
      ...b,
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    }));

    const duplicatedPage: WorksheetPageData = {
      id: `page_${Date.now()}`,
      pageNumber: pageIndex + 2,
      blocks: duplicatedBlocks,
    };

    const newPages = [...doc.pages];
    newPages.splice(pageIndex + 1, 0, duplicatedPage);
    const reindexedPages = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

    pushState({
      ...doc,
      pages: reindexedPages,
    });
    setCurrentPageIndex(pageIndex + 1);
  }, [doc, pushState]);

  // Duplicate a specific page as an independent Arabic version (unlinked/autonomous)
  const handleDuplicatePageAsIndependentArabic = useCallback(
    (pageIndex: number) => {
      const pageToCopy = doc.pages[pageIndex];
      if (!pageToCopy) return;

      const duplicatedPage = duplicatePageAsIndependentArabic(pageToCopy, pageIndex + 2);
      const newPages = [...doc.pages];
      newPages.splice(pageIndex + 1, 0, duplicatedPage);
      const reindexedPages = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

      pushState({
        ...doc,
        pages: reindexedPages,
      });
      setCurrentPageIndex(pageIndex + 1);
      setSelectedBlockId(null);
    },
    [doc, pushState]
  );

  // Delete a specific page (used by Grid View)
  const handleDeletePage = useCallback((pageIndex: number) => {
    if (doc.pages.length <= 1) return;

    const updatedPages = doc.pages
      .filter((_, idx) => idx !== pageIndex)
      .map((p, i) => ({ ...p, pageNumber: i + 1 }));

    const newTargetIdx = Math.max(
      0,
      Math.min(
        updatedPages.length - 1,
        currentPageIndex >= pageIndex ? currentPageIndex - 1 : currentPageIndex
      )
    );

    pushState({
      ...doc,
      pages: updatedPages,
    });

    setCurrentPageIndex(newTargetIdx);
    setSelectedBlockId(null);
  }, [doc, currentPageIndex, pushState]);

  // Toggle Grid View Mode with scroll memorization (Canva-style)
  const handleToggleGridMode = useCallback(() => {
    if (!isGridMode) {
      // 1. Memorize current scroll position and current page before entering grid
      const canvasEl = document.getElementById('worksheet-canvas-container');
      if (canvasEl) {
        savedScrollTopRef.current = canvasEl.scrollTop;
      }
      lastActivePageRef.current = currentPageIndex;
      setIsGridMode(true);
    } else {
      // 2. Return to normal mode and restore previous scroll position
      setIsGridMode(false);
      setTimeout(() => {
        const canvasEl = document.getElementById('worksheet-canvas-container');
        if (canvasEl && savedScrollTopRef.current > 0) {
          canvasEl.scrollTop = savedScrollTopRef.current;
        }
      }, 50);
    }
  }, [isGridMode, currentPageIndex]);

  // Close Grid View Mode directly
  const handleCloseGridMode = useCallback(() => {
    setIsGridMode(false);
    setTimeout(() => {
      const canvasEl = document.getElementById('worksheet-canvas-container');
      if (canvasEl && savedScrollTopRef.current > 0) {
        canvasEl.scrollTop = savedScrollTopRef.current;
      }
    }, 50);
  }, []);

  // Select page from grid and return to normal editing mode
  const handleSelectPageFromGrid = useCallback((pageIndex: number) => {
    setCurrentPageIndex(pageIndex);
    setIsGridMode(false);
    // Smoothly scroll to that page in continuous editor view
    setTimeout(() => {
      const pageEl = document.getElementById(`worksheet-a4-page-${pageIndex}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }, []);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+D, Delete, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputActive =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Escape -> Close Grid Mode or Deselect
      if (e.key === 'Escape') {
        if (isGridMode) {
          handleCloseGridMode();
          return;
        }
        setSelectedBlockId(null);
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && !isInputActive) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          return;
        }
        if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleRedo();
          return;
        }
        // Duplicate (Ctrl+D)
        if (e.key === 'd' || e.key === 'D') {
          if (selectedBlockId) {
            e.preventDefault();
            handleDuplicateBlock(selectedBlockId);
            return;
          }
        }
      }

      // Delete or Backspace (only when not editing text!)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputActive) {
        if (selectedBlockId) {
          e.preventDefault();
          handleDeleteBlock(selectedBlockId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, handleUndo, handleRedo, handleDuplicateBlock, handleDeleteBlock]);

  return (
    <div className="h-screen w-full max-h-screen overflow-hidden flex flex-col bg-slate-100">
      {/* 1. TOP BAR */}
      <WorksheetTopBar
        title={doc.title}
        onTitleChange={handleTitleChange}
        orientation={doc.settings.orientation}
        onOrientationChange={handleOrientationChange}
        activeLanguage={doc.settings.activeLanguage || 'fr'}
        onLanguageChange={handleLanguageChange}
        isCurrentPageIndependentArabic={doc.pages[currentPageIndex]?.isIndependentArabic}
        onDuplicateCurrentPageAsIndependentArabic={() =>
          handleDuplicatePageAsIndependentArabic(currentPageIndex)
        }
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        currentPageIndex={currentPageIndex}
        totalPages={doc.pages.length}
        onSelectPage={setCurrentPageIndex}
        onAddPage={handleAddPage}
        onDeleteCurrentPage={handleDeleteCurrentPage}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((prev) => (prev === 'single' ? 'continuous' : 'single'))
        }
        isGridMode={isGridMode}
        onToggleGridMode={handleToggleGridMode}
        isLeftPanelOpen={isLeftPanelOpen}
        onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        onTogglePreview={() => setIsPreviewOpen(true)}
        onBackToHome={onBackToHome}
      />

      {/* 2. THREE-PANEL WORKSPACE */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* LEFT PANEL: STRUCTURE + BLOCS */}
        <WorksheetLeftPanel
          isOpen={isLeftPanelOpen && !isGridMode}
          onClose={() => setIsLeftPanelOpen(false)}
          width={leftPanelWidth}
          onStartResize={handleStartResizeLeft}
          isResizing={isResizingLeft}
          blocks={currentPage.blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(id) => setSelectedBlockId(id)}
          onAddBlock={handleAddBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onDeleteBlock={handleDeleteBlock}
          onReorderBlock={handleReorderBlock}
          onReorderBlocks={handleReorderBlocks}
          currentPageNumber={currentPageIndex + 1}
        />

        {/* CENTRAL AREA: A4 CANVAS OR GRID VIEW (CANVA-STYLE) */}
        {isGridMode ? (
          <WorksheetGridView
            pages={doc.pages}
            currentPageIndex={currentPageIndex}
            documentSettings={doc.settings}
            onSelectPageAndExit={handleSelectPageFromGrid}
            onCloseGrid={handleCloseGridMode}
            onAddPage={handleAddPage}
            onInsertPageAt={handleInsertPageAt}
            onDuplicatePage={handleDuplicatePage}
            onDuplicatePageAsIndependentArabic={handleDuplicatePageAsIndependentArabic}
            onDeletePage={handleDeletePage}
          />
        ) : (
          <WorksheetCanvas
            pages={doc.pages}
            currentPageIndex={currentPageIndex}
            onSelectPage={setCurrentPageIndex}
            viewMode={viewMode}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            documentSettings={doc.settings}
            zoom={zoom}
            onUpdateBlock={handleUpdateBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onDuplicateBlockAsLanguage={handleDuplicateBlockAsLanguage}
            onDuplicatePageAsIndependentArabic={handleDuplicatePageAsIndependentArabic}
            onDeleteBlock={handleDeleteBlock}
            onAddBlock={handleAddBlock}
            onReorderBlocks={handleReorderBlocks}
            onMoveBlockToPage={handleMoveBlockToPage}
            isLeftPanelOpen={isLeftPanelOpen}
            onOpenLeftPanel={() => setIsLeftPanelOpen(true)}
            isRightPanelOpen={isRightPanelOpen}
            onOpenRightPanel={() => setIsRightPanelOpen(true)}
          />
        )}

        {/* RIGHT PANEL: CONTEXTUAL PROPERTIES */}
        <WorksheetRightPanel
          isOpen={isRightPanelOpen && !isGridMode}
          onClose={() => setIsRightPanelOpen(false)}
          width={rightPanelWidth}
          onStartResize={handleStartResizeRight}
          isResizing={isResizingRight}
          selectedBlock={selectedBlock}
          documentSettings={doc.settings}
          onUpdateDocumentSettings={handleUpdateDocumentSettings}
          onUpdateSelectedBlock={(updates) => {
            if (selectedBlockId) handleUpdateBlock(selectedBlockId, updates);
          }}
          onUpdateBlockStyles={handleUpdateBlockStyles}
          onUpdateBlockContent={handleUpdateBlockContent}
        />
      </div>

      {/* Active resize overlay for seamless dragging across canvas & elements */}
      {(isResizingLeft || isResizingRight) && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}

      {/* 3. FULLSCREEN / MODAL PREVIEW (Point 3) */}
      <WorksheetPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={doc}
        initialPageIndex={currentPageIndex}
      />
    </div>
  );
};
