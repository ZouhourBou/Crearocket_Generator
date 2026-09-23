import { WorksheetBlock, WorksheetPageData } from '../types/worksheet';

export const VERTICAL_BLOCK_GAP = 15;
export const DEFAULT_PAGE_TOP_MARGIN = 50;

/**
 * Recomputes the Y positions of all blocks so that every block occupies its own vertical space
 * in the document stream, with a consistent gap between blocks and no overlap whatsoever.
 */
export function layoutVerticalFlow(
  blocks: WorksheetBlock[],
  topMargin = DEFAULT_PAGE_TOP_MARGIN,
  gap = VERTICAL_BLOCK_GAP
): WorksheetBlock[] {
  if (!blocks || blocks.length === 0) return [];

  let currentY = Math.max(20, topMargin);

  return blocks.map((block) => {
    const y = currentY;
    currentY += (block.height || 40) + gap;
    return {
      ...block,
      y,
    };
  });
}

/**
 * Finds the appropriate vertical insertion index for a given Y coordinate on the canvas.
 */
export function findInsertIndexForY(blocks: WorksheetBlock[], targetY: number): number {
  if (!blocks || blocks.length === 0) return 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const midY = block.y + block.height / 2;
    if (targetY < midY) {
      return i;
    }
  }

  return blocks.length;
}

export interface ReflowResult {
  pages: WorksheetPageData[];
  pageChanged: boolean;
  movedBlockIds: string[];
}

/**
 * Reflows blocks across document pages according to printable A4 height bounds.
 * If adding or expanding a block causes content to exceed the printable bottom margin
 * of an A4 page, the overflowing block(s) transition cleanly to the next page,
 * automatically creating a new page if necessary.
 */
export function reflowDocumentPages(
  pages: WorksheetPageData[],
  pageHeight: number,
  margins: { top?: number; bottom?: number; left?: number; right?: number } = {},
  gap = VERTICAL_BLOCK_GAP
): ReflowResult {
  const topMargin = Math.max(20, margins.top ?? DEFAULT_PAGE_TOP_MARGIN);
  const bottomMargin = Math.max(20, margins.bottom ?? DEFAULT_PAGE_TOP_MARGIN);
  const maxPrintableY = pageHeight - bottomMargin;

  let resultPages: WorksheetPageData[] = pages.map((p) => ({
    ...p,
    blocks: [...p.blocks],
  }));

  let pageChanged = false;
  const movedBlockIds: string[] = [];
  let pageIndex = 0;

  // Max 50 pages bound to guarantee termination
  while (pageIndex < resultPages.length && pageIndex < 50) {
    const currentPage = resultPages[pageIndex];

    // Compute layout flow for current page
    const flowed = layoutVerticalFlow(currentPage.blocks, topMargin, gap);

    // Check if any block exceeds printable area (starting from index 1: index 0 is first block on page)
    let overflowIndex = -1;
    for (let i = 0; i < flowed.length; i++) {
      const block = flowed[i];
      const blockBottom = block.y + (block.height || 40);
      if (i > 0 && blockBottom > maxPrintableY) {
        overflowIndex = i;
        break;
      }
    }

    if (overflowIndex !== -1) {
      const keeping = flowed.slice(0, overflowIndex);
      const overflowing = flowed.slice(overflowIndex);

      currentPage.blocks = keeping;
      pageChanged = true;
      overflowing.forEach((b) => movedBlockIds.push(b.id));

      if (pageIndex + 1 < resultPages.length) {
        // Prepend overflowing blocks to the next page
        const nextPage = resultPages[pageIndex + 1];
        nextPage.blocks = [...overflowing, ...nextPage.blocks];
      } else {
        // Automatically create a new page
        const newPage: WorksheetPageData = {
          id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          pageNumber: resultPages.length + 1,
          blocks: overflowing,
        };
        resultPages.push(newPage);
      }
    } else {
      currentPage.blocks = flowed;
    }

    pageIndex++;
  }

  // Renumber pages 1..N
  resultPages = resultPages.map((p, i) => ({
    ...p,
    pageNumber: i + 1,
  }));

  return {
    pages: resultPages,
    pageChanged,
    movedBlockIds,
  };
}

/**
 * Removes empty trailing pages if any, ensuring at least one page remains,
 * and never removes an empty page that is currently active.
 */
export function cleanupTrailingEmptyPages(
  pages: WorksheetPageData[],
  activePageIndex?: number
): WorksheetPageData[] {
  if (pages.length <= 1) return pages;

  const result = [...pages];
  while (
    result.length > 1 &&
    result[result.length - 1].blocks.length === 0 &&
    (activePageIndex === undefined || activePageIndex !== result.length - 1)
  ) {
    result.pop();
  }

  return result.map((p, i) => ({ ...p, pageNumber: i + 1 }));
}
