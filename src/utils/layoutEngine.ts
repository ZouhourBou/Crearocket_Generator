import { PaperFormat, PaperDimensions, LabelDimensions, LayoutCalculationResult, GeneratorType, SchoolLabelType, PageMargins } from '../types';
import {
  calculateDynamicCharLimits,
  DynamicFieldLimits,
  getAvailableLines,
  calculateLabelGeometry,
  calculateTextFontSize,
  calculateMaxCharacters,
} from './textFitEngine';

export {
  getAvailableLines,
  calculateLabelGeometry,
  calculateTextFontSize,
  calculateMaxCharacters,
};

export const PAPER_SIZES: Record<Exclude<PaperFormat, 'custom'>, PaperDimensions> = {
  A4: { widthMm: 210, heightMm: 297 },
  A5: { widthMm: 148, heightMm: 210 },
};

export const SUPPLIES_PRESETS: Record<string, LabelDimensions> = {
  '46x6': { widthMm: 46, heightMm: 6 },
  '50x10': { widthMm: 50, heightMm: 10 },
  '56x11': { widthMm: 56, heightMm: 11 },
  '56x15': { widthMm: 56, heightMm: 15 },
  '50x20': { widthMm: 50, heightMm: 20 },
  '60x20': { widthMm: 60, heightMm: 20 },
  '70x25': { widthMm: 70, heightMm: 25 },
  '70x35': { widthMm: 70, heightMm: 35 },
  '80x40': { widthMm: 80, heightMm: 40 },
};

export const BOOKS_PRESETS: Record<string, LabelDimensions> = {
  '70x35': { widthMm: 70, heightMm: 35 },
  '80x40': { widthMm: 80, heightMm: 40 },
};

export function getPaperDimensions(format: PaperFormat, customPaper: PaperDimensions): PaperDimensions {
  if (format === 'custom') {
    return {
      widthMm: Math.max(50, customPaper.widthMm || 210),
      heightMm: Math.max(50, customPaper.heightMm || 297),
    };
  }
  return PAPER_SIZES[format] || PAPER_SIZES.A4;
}

export function getLabelDimensions(
  type: GeneratorType,
  preset: string,
  customLabel: LabelDimensions,
  coversPerSheet?: 1 | 2 | 3 | 'custom',
  customCover?: LabelDimensions,
  paperDim?: PaperDimensions,
  schoolLabelType?: SchoolLabelType
): LabelDimensions {
  if (type === 'books' || schoolLabelType === 'books') {
    if (preset === 'custom') {
      return {
        widthMm: Math.max(30, customLabel.widthMm || 90),
        heightMm: Math.max(20, customLabel.heightMm || 35),
      };
    }
    return BOOKS_PRESETS[preset] || BOOKS_PRESETS['70x35'];
  }

  if (type === 'supplies') {
    if (preset === 'custom') {
      return {
        widthMm: Math.max(15, customLabel.widthMm || 46),
        heightMm: Math.max(5, customLabel.heightMm || 6),
      };
    }
    return SUPPLIES_PRESETS[preset] || BOOKS_PRESETS[preset] || SUPPLIES_PRESETS['56x11'];
  }

  // Type: notebook_cover (واجهة كراس)
  const pWidth = paperDim?.widthMm || 210;
  const pHeight = paperDim?.heightMm || 297;

  if (coversPerSheet === 'custom' && customCover) {
    return {
      widthMm: Math.max(40, customCover.widthMm || 100),
      heightMm: Math.max(40, customCover.heightMm || 140),
    };
  }

  if (coversPerSheet === 1) {
    // 1 big cover using entire A4 page minus safe margins
    return {
      widthMm: pWidth - 16, // 194mm on A4
      heightMm: pHeight - 16, // 281mm on A4
    };
  }

  if (coversPerSheet === 2) {
    // 2 vertical (portrait A5) covers side-by-side on an A4 sheet in LANDSCAPE (orientation: 'landscape')
    const landscapeW = Math.max(pWidth, pHeight); // 297mm for A4
    const landscapeH = Math.min(pWidth, pHeight); // 210mm for A4
    const gapX = 6;
    const marginX = 8;
    const marginY = 8;
    return {
      widthMm: Math.round((landscapeW - marginX * 2 - gapX) / 2), // ~138mm (portrait A5 width)
      heightMm: landscapeH - marginY * 2, // ~194mm (portrait A5 height)
    };
  }

  if (coversPerSheet === 3) {
    // 3 covers per A4 (e.g. 3 x approx 194 x 88 mm)
    return {
      widthMm: 194,
      heightMm: 88,
    };
  }

  return { widthMm: 194, heightMm: 281 };
}

export type LabelFieldLimits = DynamicFieldLimits;

/**
 * Computes dynamic character limits and maximum lines based on physical label dimensions.
 * Delegates to calculateDynamicCharLimits for a single unified calculation source of truth.
 */
export function getLabelFieldLimits(
  widthMm: number,
  heightMm: number,
  illustrationId?: string,
  labelType?: SchoolLabelType | GeneratorType,
  customIconSizePx?: number,
  duplicateIconRight?: boolean
): LabelFieldLimits {
  return calculateDynamicCharLimits(widthMm, heightMm, illustrationId, labelType, customIconSizePx, undefined, undefined, duplicateIconRight);
}

export function getTargetCoverDimensions(
  preset?: string,
  customDims?: { widthCm: number; heightCm: number }
): { widthMm: number; heightMm: number } | null {
  if (!preset || preset === 'auto') return null;
  switch (preset) {
    case '17x22':
      return { widthMm: 170, heightMm: 220 };
    case '21x29.7':
      return { widthMm: 210, heightMm: 297 };
    case 'A5':
      return { widthMm: 148, heightMm: 210 };
    case '16x24':
      return { widthMm: 160, heightMm: 240 };
    case '24x32':
      return { widthMm: 240, heightMm: 320 };
    case 'custom':
      return {
        widthMm: Math.max(50, Math.round((customDims?.widthCm || 17) * 10)),
        heightMm: Math.max(50, Math.round((customDims?.heightCm || 22) * 10)),
      };
    default:
      return null;
  }
}

export function computeLayout(
  type: GeneratorType,
  paperFormat: PaperFormat,
  customPaper: PaperDimensions,
  labelPreset: string,
  customLabel: LabelDimensions,
  requestedItemCount: number,
  coversPerSheet: 1 | 2 | 3 | 'custom' = 1,
  customCover?: LabelDimensions,
  pageMargins?: PageMargins,
  labelSpacing?: number,
  schoolLabelType?: SchoolLabelType,
  notebookCoverSizePreset?: string,
  notebookCoverCustomDimensions?: { widthCm: number; heightCm: number }
): LayoutCalculationResult {
  const paper = getPaperDimensions(paperFormat, customPaper);
  const paperW = paper.widthMm;
  const paperH = paper.heightMm;

  // Add-on conditionnel : activé UNIQUEMENT si le bouton est actif ET au moins une marge > 0
  const hasActiveMargins = Boolean(
    pageMargins?.enabled &&
    (
      (pageMargins.top || 0) > 0 ||
      (pageMargins.right || 0) > 0 ||
      (pageMargins.bottom || 0) > 0 ||
      (pageMargins.left || 0) > 0
    )
  );

  const marginTopMm = hasActiveMargins ? Math.max(0, pageMargins?.top || 0) : 0;
  const marginRightMm = hasActiveMargins ? Math.max(0, pageMargins?.right || 0) : 0;
  const marginBottomMm = hasActiveMargins ? Math.max(0, pageMargins?.bottom || 0) : 0;
  const marginLeftMm = hasActiveMargins ? Math.max(0, pageMargins?.left || 0) : 0;

  const availW = hasActiveMargins ? Math.max(0, paperW - (marginLeftMm + marginRightMm)) : paperW;
  const availH = hasActiveMargins ? Math.max(0, paperH - (marginTopMm + marginBottomMm)) : paperH;

  if (type === 'notebook_cover') {
    const targetDims = getTargetCoverDimensions(notebookCoverSizePreset, notebookCoverCustomDimensions);

    if (coversPerSheet === 1) {
      const maxW = hasActiveMargins ? Math.max(20, availW - 16) : paperW - 16;
      const maxH = hasActiveMargins ? Math.max(20, availH - 16) : paperH - 16;

      let itemW = maxW;
      let itemH = maxH;

      if (targetDims) {
        if (targetDims.widthMm <= maxW && targetDims.heightMm <= maxH) {
          itemW = targetDims.widthMm;
          itemH = targetDims.heightMm;
        } else {
          // Scale down proportionally to fit the printable sheet area
          const scale = Math.min(maxW / targetDims.widthMm, maxH / targetDims.heightMm);
          itemW = Math.max(20, Math.round(targetDims.widthMm * scale));
          itemH = Math.max(20, Math.round(targetDims.heightMm * scale));
        }
      }

      return {
        cols: 1,
        rows: 1,
        maxCapacity: 1,
        actualCount: 1,
        marginHorizontalMm: 8,
        marginVerticalMm: 8,
        gapXmm: 0,
        gapYmm: 0,
        itemWidthMm: itemW,
        itemHeightMm: itemH,
        paperWidthMm: paperW,
        paperHeightMm: paperH,
        isOverCapacity: false,
        orientation: paperW > paperH ? 'landscape' : 'portrait',
        marginTopMm,
        marginRightMm,
        marginBottomMm,
        marginLeftMm,
        isMarginTooLarge: hasActiveMargins && (availW < 30 || availH < 30),
      };
    }

    if (coversPerSheet === 2) {
      // Page en orientation PAYSAGE (horizontale) contenant 2 couvertures VERTICALES côte à côte
      const landscapePaperW = Math.max(paperW, paperH); // 297mm pour A4
      const landscapePaperH = Math.min(paperW, paperH); // 210mm pour A4

      const gapX = labelSpacing !== undefined ? Math.max(0, labelSpacing) : 6;
      const marginX = 8;
      const marginY = 8;

      const availLandscapeW = hasActiveMargins
        ? Math.max(0, landscapePaperW - (marginLeftMm + marginRightMm))
        : landscapePaperW;
      const availLandscapeH = hasActiveMargins
        ? Math.max(0, landscapePaperH - (marginTopMm + marginBottomMm))
        : landscapePaperH;

      const maxHalfW = hasActiveMargins
        ? Math.max(20, (availLandscapeW - marginX * 2 - gapX) / 2)
        : (landscapePaperW - marginX * 2 - gapX) / 2; // ~137.5mm (largeur d'un cahier A5 vertical)
      const maxH = hasActiveMargins
        ? Math.max(20, availLandscapeH - marginY * 2)
        : landscapePaperH - marginY * 2; // ~194mm (hauteur d'un cahier A5 vertical)

      let itemW = maxHalfW;
      let itemH = maxH;

      if (targetDims) {
        if (targetDims.widthMm <= maxHalfW && targetDims.heightMm <= maxH) {
          itemW = targetDims.widthMm;
          itemH = targetDims.heightMm;
        } else {
          // Scale down proportionally to fit half the landscape page while maintaining exact aspect ratio
          const scale = Math.min(maxHalfW / targetDims.widthMm, maxH / targetDims.heightMm);
          itemW = Math.max(20, Math.round(targetDims.widthMm * scale));
          itemH = Math.max(20, Math.round(targetDims.heightMm * scale));
        }
      }

      return {
        cols: 2,
        rows: 1,
        maxCapacity: 2,
        actualCount: 2,
        marginHorizontalMm: marginX,
        marginVerticalMm: marginY,
        gapXmm: gapX,
        gapYmm: 0,
        itemWidthMm: itemW,
        itemHeightMm: itemH,
        paperWidthMm: landscapePaperW,
        paperHeightMm: landscapePaperH,
        isOverCapacity: false,
        orientation: 'landscape',
        marginTopMm,
        marginRightMm,
        marginBottomMm,
        marginLeftMm,
        isMarginTooLarge: hasActiveMargins && (availLandscapeW < 30 || availLandscapeH < 30),
      };
    }

    if (coversPerSheet === 3) {
      const gapY = labelSpacing !== undefined ? Math.max(0, labelSpacing) : 5;
      const marginX = 8;
      const marginY = 8;
      const itemW = hasActiveMargins ? Math.max(20, availW - marginX * 2) : paperW - marginX * 2;
      const itemH = hasActiveMargins ? Math.max(20, (availH - marginY * 2 - gapY * 2) / 3) : (paperH - marginY * 2 - gapY * 2) / 3;
      return {
        cols: 1,
        rows: 3,
        maxCapacity: 3,
        actualCount: 3,
        marginHorizontalMm: marginX,
        marginVerticalMm: marginY,
        gapXmm: 0,
        gapYmm: gapY,
        itemWidthMm: itemW,
        itemHeightMm: itemH,
        paperWidthMm: paperW,
        paperHeightMm: paperH,
        isOverCapacity: false,
        orientation: 'portrait',
        marginTopMm,
        marginRightMm,
        marginBottomMm,
        marginLeftMm,
        isMarginTooLarge: hasActiveMargins && (availW < 30 || availH < 30),
      };
    }

    // Custom notebook cover size
    const item = getLabelDimensions(type, labelPreset, customLabel, 'custom', customCover, paper);
    const gap = labelSpacing !== undefined ? Math.max(0, labelSpacing) : 4;
    const minMargin = 6;
    const baseW = hasActiveMargins ? availW : paperW;
    const baseH = hasActiveMargins ? availH : paperH;
    const cols = Math.max(1, Math.floor((baseW - minMargin * 2 + gap) / (item.widthMm + gap)));
    const rows = Math.max(1, Math.floor((baseH - minMargin * 2 + gap) / (item.heightMm + gap)));
    const maxCapacity = cols * rows;
    const usedW = cols * item.widthMm + (cols - 1) * gap;
    const usedH = rows * item.heightMm + (rows - 1) * gap;
    const marginX = Math.max(minMargin, (baseW - usedW) / 2);
    const marginY = Math.max(minMargin, (baseH - usedH) / 2);

    return {
      cols,
      rows,
      maxCapacity,
      actualCount: Math.min(requestedItemCount || maxCapacity, maxCapacity),
      marginHorizontalMm: marginX,
      marginVerticalMm: marginY,
      gapXmm: gap,
      gapYmm: gap,
      itemWidthMm: item.widthMm,
      itemHeightMm: item.heightMm,
      paperWidthMm: paperW,
      paperHeightMm: paperH,
      isOverCapacity: requestedItemCount > maxCapacity,
      orientation: 'portrait',
      marginTopMm,
      marginRightMm,
      marginBottomMm,
      marginLeftMm,
      isMarginTooLarge: hasActiveMargins && (availW < item.widthMm || availH < item.heightMm),
    };
  }

  // Standard labels (supplies or books)
  const item = getLabelDimensions(type, labelPreset, customLabel, undefined, undefined, paper, schoolLabelType);
  const minMarginX = 6;
  const minMarginY = 8;
  const defaultGap = 3;
  const gapX = labelSpacing !== undefined ? Math.max(0, labelSpacing) : defaultGap;
  const gapY = labelSpacing !== undefined ? Math.max(0, labelSpacing) : defaultGap;

  // CAS PAR DÉFAUT (inchangé au pixel près si margins inactives)
  if (!hasActiveMargins) {
    const cols = Math.max(1, Math.floor((paperW - minMarginX * 2 + gapX) / (item.widthMm + gapX)));
    const rows = Math.max(1, Math.floor((paperH - minMarginY * 2 + gapY) / (item.heightMm + gapY)));
    const maxCapacity = cols * rows;

    const totalUsedW = cols * item.widthMm + (cols - 1) * gapX;
    const totalUsedH = rows * item.heightMm + (rows - 1) * gapY;
    const marginHorizontalMm = Math.max(minMarginX, (paperW - totalUsedW) / 2);
    const marginVerticalMm = Math.max(minMarginY, (paperH - totalUsedH) / 2);

    const actualCount = Math.min(requestedItemCount > 0 ? requestedItemCount : maxCapacity, maxCapacity);
    const isOverCapacity = requestedItemCount > maxCapacity;

    return {
      cols,
      rows,
      maxCapacity,
      actualCount,
      marginHorizontalMm,
      marginVerticalMm,
      gapXmm: gapX,
      gapYmm: gapY,
      itemWidthMm: item.widthMm,
      itemHeightMm: item.heightMm,
      paperWidthMm: paperW,
      paperHeightMm: paperH,
      isOverCapacity,
      orientation: 'portrait',
      marginTopMm: 0,
      marginRightMm: 0,
      marginBottomMm: 0,
      marginLeftMm: 0,
      isMarginTooLarge: false,
    };
  }

  // CAS ACTIF : les marges réduisent l'espace disponible et recalculent colonnes/lignes
  const isMarginTooLarge = availW < item.widthMm || availH < item.heightMm;
  if (isMarginTooLarge) {
    return {
      cols: 1,
      rows: 1,
      maxCapacity: 1,
      actualCount: 1,
      marginHorizontalMm: minMarginX,
      marginVerticalMm: minMarginY,
      gapXmm: gapX,
      gapYmm: gapY,
      itemWidthMm: item.widthMm,
      itemHeightMm: item.heightMm,
      paperWidthMm: paperW,
      paperHeightMm: paperH,
      isOverCapacity: false,
      orientation: 'portrait',
      isMarginTooLarge: true,
      marginTopMm,
      marginRightMm,
      marginBottomMm,
      marginLeftMm,
    };
  }

  const cols = Math.max(1, Math.floor((availW + gapX) / (item.widthMm + gapX)));
  const rows = Math.max(1, Math.floor((availH + gapY) / (item.heightMm + gapY)));
  const maxCapacity = cols * rows;

  const totalUsedW = cols * item.widthMm + (cols - 1) * gapX;
  const totalUsedH = rows * item.heightMm + (rows - 1) * gapY;
  const marginHorizontalMm = Math.max(0, (availW - totalUsedW) / 2);
  const marginVerticalMm = Math.max(0, (availH - totalUsedH) / 2);

  const actualCount = Math.min(requestedItemCount > 0 ? requestedItemCount : maxCapacity, maxCapacity);
  const isOverCapacity = requestedItemCount > maxCapacity;

  return {
    cols,
    rows,
    maxCapacity,
    actualCount,
    marginHorizontalMm,
    marginVerticalMm,
    gapXmm: gapX,
    gapYmm: gapY,
    itemWidthMm: item.widthMm,
    itemHeightMm: item.heightMm,
    paperWidthMm: paperW,
    paperHeightMm: paperH,
    isOverCapacity,
    orientation: 'portrait',
    marginTopMm,
    marginRightMm,
    marginBottomMm,
    marginLeftMm,
    isMarginTooLarge: false,
  };
}
