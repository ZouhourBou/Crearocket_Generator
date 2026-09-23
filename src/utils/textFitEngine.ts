import { StudentInfo, Language, SchoolLabelType, GeneratorType, FieldFontSizes } from '../types';
import { TRANSLATIONS } from '../constants/translations';

/**
 * Screen preview pixel density constant
 * 1 mm = 2.2 px in standard preview scaling
 */
export const PX_PER_MM = 2.2;

/**
 * High-precision physical mm to pixels converter according to DPI
 * At 300 DPI: 46 mm ≈ 543 px, 6 mm ≈ 71 px
 * At 600 DPI: 46 mm ≈ 1087 px, 6 mm ≈ 142 px
 */
export function mmToPixels(mm: number, dpi: number = 300): number {
  return Math.round((mm * dpi) / 25.4);
}

/**
 * Pixels to physical mm converter
 */
export function pixelsToMm(pixels: number, dpi: number = 300): number {
  return (pixels * 25.4) / dpi;
}

export interface LabelGeometry {
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  paddingLeftPx: number;
  paddingRightPx: number;
  paddingTopPx: number;
  paddingBottomPx: number;
  safetyMarginXPx: number;
  safetyMarginYPx: number;
  illustrationWidthPx: number;
  illustrationHeightPx: number;
  gapPx: number;
  availableWidthPx: number;
  availableHeightPx: number;
  // Physical millimeter metrics
  availableWidthMm: number;
  availableHeightMm: number;
  duplicateIconRight?: boolean;
}

export interface FieldFitDetails {
  text: string;
  fontSizePx: number;
  fontSizeMm: number;
  lineHeightPx: number;
  lineHeightMm: number;
  widthPx: number;
  heightPx: number;
  isTooLong: boolean;
  errorMessage?: string;
}

export interface DynamicFieldLimits {
  maxLines: number;
  fullName: number;
  grade: number;
  schoolName: number;
  subjectName: number;
}

export interface ActiveLineInfo {
  key: 'fullName' | 'grade' | 'schoolName' | 'subjectName';
  label: string;
  text: string;
  isPrimary: boolean;
  fontSizePx: number;
  fontSizeMm: number;
  lineHeightPx: number;
  lineHeightMm: number;
  widthPx: number;
  heightPx: number;
  fontWeight: string;
  isTooLong: boolean;
  errorMessage?: string;
}

export interface TextFitResult {
  geometry: LabelGeometry;
  limits: DynamicFieldLimits;

  // Unified font size applied across ALL active lines
  fontSizeFinal: number;

  // Default auto-calculated font sizes for each field
  defaultFontSizes: {
    fullName: number;
    grade: number;
    subjectName: number;
    schoolName: number;
  };

  // Global validation flags & notices
  isNameTooLong: boolean;
  hasAnyError: boolean;
  errorMessage?: string;
  formatTooSmallForFields: boolean;
  formatNotice?: string;
  errors: {
    fullName?: string;
    grade?: string;
    subjectName?: string;
    schoolName?: string;
  };

  // Structured active lines in mandatory order (no empty lines)
  activeLines: ActiveLineInfo[];

  // Field by field details
  name: FieldFitDetails;
  grade: FieldFitDetails;
  subject: FieldFitDetails;
  school: FieldFitDetails;

  // Direct convenience fields
  nameText: string;
  nameFontSizePx: number;
  nameLineHeightPx: number;
  nameWidthPx: number;

  gradeText: string;
  gradeFontSizePx: number;
  gradeLineHeightPx: number;
  gradeWidthPx: number;

  subjectText: string;
  subjectFontSizePx: number;
  subjectLineHeightPx: number;
  subjectWidthPx: number;

  schoolText: string;
  schoolFontSizePx: number;
  schoolLineHeightPx: number;
  schoolWidthPx: number;

  // Active fields & layout metrics
  activeLinesCount: number;
  hasAnyText: boolean;
  interLineGapPx: number;
  totalBlockHeightPx: number;
  topPaddingOffsetPx: number;

  // Legacy line wrap flags
  isNameWrapped?: boolean;
  nameWrappedLine1?: string;
  nameWrappedLine2?: string;
}

// Canvas measurement singleton for high-accuracy pixel measurement
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementCtx: CanvasRenderingContext2D | null = null;

const FONT_FAMILIES = '"Outfit", "Tajawal", "Cairo", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function parseFontSizeFromSpec(fontSpec: string): number {
  const match = fontSpec.match(/([\d.]+)px/);
  if (match) {
    const val = parseFloat(match[1]);
    if (!isNaN(val) && val > 0) return val;
  }
  const fallback = parseFloat(fontSpec);
  return !isNaN(fallback) && fallback < 100 ? fallback : 10;
}

export function measureTextMetrics(
  text: string,
  fontSpec: string
): { width: number; height: number; ascent: number; descent: number } {
  if (!text) return { width: 0, height: 0, ascent: 0, descent: 0 };
  if (typeof document === 'undefined') {
    const size = parseFontSizeFromSpec(fontSpec);
    return {
      width: text.length * size * 0.58,
      height: size * 1.15,
      ascent: size * 0.85,
      descent: size * 0.3,
    };
  }
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
    measurementCtx = measurementCanvas.getContext('2d');
  }
  if (!measurementCtx) {
    const size = parseFontSizeFromSpec(fontSpec);
    return {
      width: text.length * size * 0.58,
      height: size * 1.15,
      ascent: size * 0.85,
      descent: size * 0.3,
    };
  }

  measurementCtx.font = fontSpec;
  const metrics = measurementCtx.measureText(text);

  let ascent = metrics.actualBoundingBoxAscent;
  let descent = metrics.actualBoundingBoxDescent;

  const parsedSize = parseFontSizeFromSpec(fontSpec);
  if (typeof ascent !== 'number' || typeof descent !== 'number' || (ascent === 0 && descent === 0)) {
    ascent = parsedSize * 0.8;
    descent = parsedSize * 0.25;
  }

  // Add 2% safety buffer for subpixel anti-aliasing variations
  const width = Math.ceil(metrics.width * 1.02);
  const height = Math.ceil((ascent + descent) * 1.02);

  return {
    width,
    height,
    ascent,
    descent,
  };
}

export function measureTextWidth(text: string, fontSpec: string): number {
  return measureTextMetrics(text, fontSpec).width;
}

export const LAYOUT_CONFIG = {
  PX_PER_MM: 2.2,
  MIN_LABEL_HEIGHT_FOR_2_LINES_MM: 9.0, // < 9 mm: STRICTEMENT 1 ligne (ex : 46 × 6 mm)
  MIN_LABEL_HEIGHT_FOR_3_LINES_MM: 14.0, // 9 mm <= H < 14 mm: MAXIMUM 2 lignes (ex : 56 × 11 mm)
  MIN_LABEL_HEIGHT_FOR_4_LINES_MM: 18.0, // 14 mm <= H < 18 mm: MAXIMUM 3 lignes (ex : 56 × 15 mm), H >= 18 mm: MAXIMUM 4 lignes (ex : 50 × 20 mm)
  MIN_READABLE_FONT_SIZE_PX: 3.2,
  MAX_FONT_SIZE_PX: 56.0,
  LINE_HEIGHT_MULTIPLIER: 1.15,
  ICON_HEIGHT_RATIO: 0.70, // Icon takes at most 70% of label height
  ICON_MAX_WIDTH_RATIO: 0.26, // Icon can occupy at most 26% of label width (text is always priority!)
  PADDING_RATIO_HEIGHT: 0.11, // 11% of height, min 0.75mm, max 3.5mm
  PADDING_RATIO_WIDTH: 0.045, // 4.5% of width, min 1.8mm, max 4.5mm
  GAP_RATIO_WIDTH: 0.038, // Gap between icon and text is ~3.8% of width, min 1.5mm
  LINE2_TO_LINE1_RATIO: 0.65, // Line 2 font size is ~65% of Line 1
  LINE3_TO_LINE1_RATIO: 0.58, // Line 3 font size is ~58% of Line 1
  LINE4_TO_LINE1_RATIO: 0.54, // Line 4 font size is ~54% of Line 1
};

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Returns default icon size in preview pixels: strictly proportional, never taking too much space
 */
export function getDefaultIconSizePx(heightMm: number): number {
  return Math.round(heightMm * PX_PER_MM * LAYOUT_CONFIG.ICON_HEIGHT_RATIO);
}

export interface LayoutSettings {
  labelType?: SchoolLabelType | GeneratorType;
  isSupplies?: boolean;
  hasIcon?: boolean;
  iconSize?: number;
  minFontSizePx?: number;
  fontFamily?: string;
  fontWeight?: string;
}

/**
 * Centralized dynamic calculation of available text lines based on physical label dimensions.
 * Strictly adheres to user-specified height thresholds:
 * - Hauteur < 9 mm : STRICTEMENT 1 ligne (ex : 46 × 6 mm)
 * - 9 mm ≤ Hauteur < 14 mm : MAXIMUM 2 lignes (ex : 56 × 11 mm)
 * - 14 mm ≤ Hauteur < 18 mm : MAXIMUM 3 lignes (ex : 56 × 15 mm)
 * - Hauteur ≥ 18 mm : MAXIMUM 4 lignes (ex : 50 × 20 mm)
 */
export function getAvailableLines(
  labelWidthMm: number,
  labelHeightMm: number,
  layoutSettings?: LayoutSettings
): number {
  const isSupplies = layoutSettings?.isSupplies || layoutSettings?.labelType === 'supplies';
  if (isSupplies) {
    // RÈGLE 1 & 17 : Pour « Étiquette fournitures »
    // Hauteur <= 6 mm : STRICTEMENT 1 ligne (ex : 46 × 6 mm)
    // Hauteur > 6 mm : MAXIMUM 2 lignes (ex : 56 × 11 mm, 56 × 15 mm, etc.)
    // JAMAIS plus de 2 lignes, quelle que soit la dimension.
    if (labelHeightMm <= 6) {
      return 1;
    }
    return 2;
  }

  if (labelHeightMm < LAYOUT_CONFIG.MIN_LABEL_HEIGHT_FOR_2_LINES_MM) {
    return 1;
  }
  if (labelHeightMm < LAYOUT_CONFIG.MIN_LABEL_HEIGHT_FOR_3_LINES_MM) {
    return 2;
  }
  if (labelHeightMm < LAYOUT_CONFIG.MIN_LABEL_HEIGHT_FOR_4_LINES_MM) {
    return 3;
  }
  return 4;
}

/**
 * Calculates physical geometry and available text zone using responsive, proportional measurements:
 * - Responsive internal padding: top/bottom (min 0.75mm for 6mm label, up to 3.5mm), left/right (min 1.8mm, up to 4.5mm)
 * - Icon sizing: placed on the left, vertical clearance above/below, capped at max 26% width (text has priority!)
 * - Responsive gap between icon and text: min 1.5mm for small labels, up to 3.5mm
 * - Content zone: availableWidthPx and availableHeightPx
 */
export function calculateLabelGeometry(
  widthMm: number,
  heightMm: number,
  illustrationId?: string,
  customIconSizePx?: number,
  labelType?: SchoolLabelType | GeneratorType,
  duplicateIconRight?: boolean
): LabelGeometry {
  const widthPx = Math.round(widthMm * PX_PER_MM * 10) / 10;
  const heightPx = Math.round(heightMm * PX_PER_MM * 10) / 10;

  const isSupplies = labelType === 'supplies';

  // 1. Responsive padding in millimeters, then converted to pixels
  let paddingTopMm = clamp(heightMm * 0.11, 0.75, 3.5);
  let paddingLeftMm = clamp(widthMm * 0.045, 1.8, 4.5);

  if (isSupplies) {
    if (heightMm <= 6) {
      // Pour 46 × 6 mm (Règle 2 : le texte doit être visible sans coupure) - CAS PROTÉGÉ
      paddingTopMm = 0.45;
      paddingLeftMm = 1.6;
    } else {
      // Pour les autres dimensions d'étiquettes fournitures (56 × 11, 56 × 15, etc.)
      paddingTopMm = clamp(heightMm * 0.07, 0.8, 2.0);
      paddingLeftMm = clamp(widthMm * 0.035, 1.6, 3.0);
    }
  }

  const paddingBottomMm = paddingTopMm;
  // Pour les fournitures > 6mm (sauf 46x11 protégé) : garder uniquement padding-right 3.5px
  const isProtected46x11 = isSupplies && widthMm === 46 && heightMm === 11;
  const paddingRightPx = (isSupplies && heightMm > 6 && !isProtected46x11)
    ? 3.5
    : Math.round(paddingLeftMm * PX_PER_MM * 10) / 10;
  const paddingRightMm = Math.round((paddingRightPx / PX_PER_MM) * 10) / 10;

  const paddingTopPx = Math.round(paddingTopMm * PX_PER_MM * 10) / 10;
  const paddingBottomPx = paddingTopPx;
  const paddingLeftPx = Math.round(paddingLeftMm * PX_PER_MM * 10) / 10;

  // 2. Icon sizing:
  // L'icône est un élément secondaire. Le TEXTE est prioritaire.
  // Elle doit rester suffisamment petite pour permettre au texte de rester lisible.
  const hasIllustration = Boolean(illustrationId && illustrationId !== 'none');
  let illustrationWidthPx = 0;
  let illustrationHeightPx = 0;
  let gapPx = 0;

  if (hasIllustration) {
    const availableHeightForIconMm = Math.max(2.0, heightMm - (paddingTopMm + paddingBottomMm));
    // Icon takes at most 70% of label height (or 60% for 6mm supplies), or available vertical space minus 0.25mm buffer
    const maxIconMmByHeight = isSupplies && heightMm <= 6
      ? Math.min(heightMm * 0.60, 3.6)
      : Math.min(heightMm * 0.70, availableHeightForIconMm - 0.25);
    // Icon width cannot exceed 26% of label width
    const maxIconMmByWidth = widthMm * 0.26;
    const defaultIconSizeMm = Math.min(maxIconMmByHeight, maxIconMmByWidth);

    let effectiveIconMm = defaultIconSizeMm;
    if (typeof customIconSizePx === 'number' && customIconSizePx > 0) {
      const customMm = customIconSizePx / PX_PER_MM;
      effectiveIconMm = Math.min(customMm, maxIconMmByHeight, maxIconMmByWidth);
    }

    illustrationWidthPx = Math.round(effectiveIconMm * PX_PER_MM * 10) / 10;
    illustrationHeightPx = illustrationWidthPx;

    // 3. Responsive gap between icon and text (1.4mm to 3.5mm)
    const gapMm = isSupplies && heightMm <= 6
      ? 1.4
      : isSupplies
      ? clamp(widthMm * 0.032, 1.4, 2.8)
      : clamp(widthMm * 0.038, 1.5, 3.5);
    gapPx = Math.round(gapMm * PX_PER_MM * 10) / 10;
  }

  // 4. Content zone:
  // RÈGLE STRICTE : La taille du TEXTE ne doit JAMAIS être réduite à cause de la duplication d'icône.
  // Par conséquent, availableWidthPx pour le texte est calculé sans déduire l'icône dupliquée.
  // Si l'espace manque à cause de la duplication, c'est l'icône elle-même qui sera réduite.
  const hasDuplicate = Boolean(hasIllustration && duplicateIconRight);
  const availableWidthPx = Math.max(
    10,
    Math.round(
      (widthPx - paddingLeftPx - paddingRightPx - (hasIllustration ? (illustrationWidthPx + gapPx) : 0)) * 10
    ) / 10
  );

  const availableHeightPx = Math.max(
    4,
    Math.round((heightPx - paddingTopPx - paddingBottomPx) * 10) / 10
  );

  const availableWidthMm = Math.round((availableWidthPx / PX_PER_MM) * 10) / 10;
  const availableHeightMm = Math.round((availableHeightPx / PX_PER_MM) * 10) / 10;

  return {
    widthMm,
    heightMm,
    widthPx,
    heightPx,
    paddingLeftPx,
    paddingRightPx,
    paddingTopPx,
    paddingBottomPx,
    safetyMarginXPx: paddingLeftPx,
    safetyMarginYPx: paddingTopPx,
    illustrationWidthPx,
    illustrationHeightPx,
    gapPx,
    availableWidthPx,
    availableHeightPx,
    availableWidthMm,
    availableHeightMm,
    duplicateIconRight: hasDuplicate,
  };
}

/**
 * RÈGLE STRICTE UTILISATEUR :
 * La taille du TEXTE (nom, prénom, matière, classe, etc.) ne doit JAMAIS être réduite
 * pour faire de la place à la duplication de l'icône.
 * Si l'espace manque à cause de la duplication de l'icône, c'est la TAILLE DE L'ICÔNE
 * elle-même qui doit être réduite (pas le texte), jusqu'à ce que tout rentre correctement dans l'étiquette.
 */
export function adjustIconSizeForDuplication(
  geometry: LabelGeometry,
  activeLines: ActiveLineInfo[]
): void {
  if (!geometry.duplicateIconRight || geometry.illustrationWidthPx <= 0) {
    return;
  }

  const maxTextWidthPx = activeLines.length > 0
    ? Math.max(0, ...activeLines.map((l) => l.widthPx))
    : 0;

  const totalHorizontalPadding = geometry.paddingLeftPx + geometry.paddingRightPx;
  const nominalTotalNeeded =
    totalHorizontalPadding +
    maxTextWidthPx +
    2 * (geometry.illustrationWidthPx + geometry.gapPx);

  if (nominalTotalNeeded > geometry.widthPx) {
    // Espace total disponible pour les deux icônes et les deux gaps
    const spaceForIconsAndGaps = Math.max(
      0,
      geometry.widthPx - totalHorizontalPadding - maxTextWidthPx
    );

    // Maintien d'un gap cohérent
    const effectiveGapPx = Math.min(
      geometry.gapPx,
      Math.max(1.0, Math.floor(spaceForIconsAndGaps * 0.07 * 10) / 10)
    );

    const spaceForTwoIcons = Math.max(0, spaceForIconsAndGaps - 2 * effectiveGapPx);
    const maxFittingIconPx = Math.floor((spaceForTwoIcons / 2) * 10) / 10;

    // Réduction de la taille de l'icône (le texte conserve 100% de sa taille)
    const clampedIconPx = Math.max(3.5, Math.min(geometry.illustrationWidthPx, maxFittingIconPx));

    geometry.illustrationWidthPx = clampedIconPx;
    geometry.illustrationHeightPx = clampedIconPx;
    geometry.gapPx = effectiveGapPx;
  }
}

/**
 * Checks if a given text string fits within the available pixel width at the given minimum readable font size.
 * Uses real canvas measurement to prevent overflow with wide characters ("WWWW" vs "IIII").
 */
export function isTextWithinPhysicalBudget(
  text: string,
  availableWidthPx: number,
  minFontSizePx: number,
  fontWeight: string = '800',
  fontFamily: string = FONT_FAMILIES
): boolean {
  if (!text) return true;
  const spec = `${fontWeight} ${minFontSizePx}px ${fontFamily}`;
  const w = measureTextWidth(text, spec);
  return w <= availableWidthPx;
}

export interface TextFontSizeParams {
  text: string;
  availableWidth: number;
  availableHeight: number;
  maxFontSize?: number;
  minFontSize?: number;
  lineCount?: number;
  fontFamily?: string;
  fontWeight?: string;
  lineHeightMultiplier?: number;
}

export interface TextFontSizeResult {
  fontSizePx: number;
  fontSizeMm: number;
  lineHeightPx: number;
  lineHeightMm: number;
  widthPx: number;
  heightPx: number;
  isTooLong: boolean;
  fits: boolean;
}

/**
 * Intelligently adapts text font size to fit available width and height.
 * 1. Computes actual available space
 * 2. Measures text using canvas with actual font/weight
 * 3. Starts with maximum font size (very short names display comfortably large)
 * 4. Progressively reduces size if text overflows
 * 5. Stops at minimum readable size
 * 6. Sets isTooLong = true if text does not fit at min size
 */
export function calculateTextFontSize({
  text,
  availableWidth,
  availableHeight,
  maxFontSize = LAYOUT_CONFIG.MAX_FONT_SIZE_PX,
  minFontSize = LAYOUT_CONFIG.MIN_READABLE_FONT_SIZE_PX,
  fontFamily = FONT_FAMILIES,
  fontWeight = '800',
  lineHeightMultiplier = LAYOUT_CONFIG.LINE_HEIGHT_MULTIPLIER,
}: TextFontSizeParams): TextFontSizeResult {
  const defaultLineHeight = Math.round(availableHeight * 10) / 10;

  if (!text) {
    const emptySize = Math.max(minFontSize, Math.round((availableHeight / lineHeightMultiplier) * 10) / 10);
    return {
      fontSizePx: emptySize,
      fontSizeMm: Math.round((emptySize / PX_PER_MM) * 100) / 100,
      lineHeightPx: defaultLineHeight,
      lineHeightMm: Math.round((defaultLineHeight / PX_PER_MM) * 100) / 100,
      widthPx: 0,
      heightPx: defaultLineHeight,
      isTooLong: false,
      fits: true,
    };
  }

  // Maximum font size bounded purely by vertical height budget
  const maxPossibleSize = Math.min(
    maxFontSize,
    Math.max(minFontSize, Math.floor((availableHeight / lineHeightMultiplier) * 10) / 10)
  );

  let bestSize = minFontSize;
  let bestWidth = 0;
  let bestHeight = 0;
  let fits = false;

  // 1. Check if complete text fits at maxPossibleSize (short names like "Ahmed" or 2-3 chars)
  const maxSpec = `${fontWeight} ${maxPossibleSize}px ${fontFamily}`;
  const maxMetrics = measureTextMetrics(text, maxSpec);

  if (maxMetrics.width <= availableWidth) {
    bestSize = maxPossibleSize;
    bestWidth = maxMetrics.width;
    bestHeight = maxMetrics.height;
    fits = true;
  } else {
    // 2. Check if text fits at minimum readable size
    const minSpec = `${fontWeight} ${minFontSize}px ${fontFamily}`;
    const minMetrics = measureTextMetrics(text, minSpec);

    if (minMetrics.width > availableWidth) {
      // Even at minimum readable size it overflows the available width
      bestSize = minFontSize;
      bestWidth = minMetrics.width;
      bestHeight = minMetrics.height;
      fits = false;
    } else {
      // 3. High-precision binary search (0.1px step) to find the absolute maximum font size
      fits = true;
      let low = minFontSize;
      let high = maxPossibleSize;

      for (let iter = 0; iter < 16; iter++) {
        const mid = Math.round(((low + high) / 2) * 10) / 10;
        const spec = `${fontWeight} ${mid}px ${fontFamily}`;
        const m = measureTextMetrics(text, spec);
        const lineH = mid * lineHeightMultiplier;

        if (m.width <= availableWidth && lineH <= availableHeight) {
          bestSize = mid;
          bestWidth = m.width;
          bestHeight = m.height;
          low = mid + 0.1; // Try larger
        } else {
          high = mid - 0.1; // Try smaller
        }
      }
    }
  }

  const roundedSize = Math.round(bestSize * 10) / 10;
  const lineHeightPx = Math.round(roundedSize * lineHeightMultiplier * 10) / 10;
  const fontSizeMm = Math.round((roundedSize / PX_PER_MM) * 100) / 100;
  const lineHeightMm = Math.round((lineHeightPx / PX_PER_MM) * 100) / 100;
  const isTooLong = !fits && (bestWidth > availableWidth || lineHeightPx > availableHeight);

  return {
    fontSizePx: roundedSize,
    fontSizeMm,
    lineHeightPx,
    lineHeightMm,
    widthPx: bestWidth,
    heightPx: bestHeight,
    isTooLong,
    fits,
  };
}

export interface MaxCharactersParams {
  labelWidth: number; // in mm
  labelHeight: number; // in mm
  lineCount?: number;
  iconEnabled?: boolean;
  iconSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  minFontSize?: number;
  padding?: { left: number; right: number; top: number; bottom: number };
}

export const CSS_PX_PER_MM = 96 / 25.4; // standard 96 DPI CSS px per mm (3.7795)
export const MM_PER_CSS_PX = 25.4 / 96;

export function mmToCssPx(mm: number): number {
  return (mm * 96) / 25.4;
}

export function cssPxToMm(px: number): number {
  return (px * 25.4) / 96;
}

/**
 * Calculates dynamic character capacity for a line using real Canvas measureText.
 * Takes into account:
 * - font-family
 * - font-size (the unified font size)
 * - font-weight
 * - available text width (labelWidth - padding - icon - gap)
 * - real character metrics (differentiates between narrow chars 'i','l' and wide chars 'W','M', Arabic glyphs)
 */
export function calculateDynamicFieldCapacity(
  text: string,
  availableWidthPx: number,
  fontSizePx: number,
  fontWeight: string = '800',
  fontFamily: string = FONT_FAMILIES
): { maxCharacters: number; isOverLimit: boolean } {
  const spec = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  // Representative sample containing typical mix of uppercase, lowercase, accents, Arabic and digits:
  const sample = 'Abcdefghij Klmnopqr stuvwxy Z 1234 محمد علي';
  const sampleMetrics = measureTextMetrics(sample, spec);
  const avgSampleCharWidth = sampleMetrics.width > 0 ? (sampleMetrics.width / sample.length) : (fontSizePx * 0.55);

  const trimmed = text ? text.trim() : '';
  if (!trimmed) {
    const rawCapacity = Math.max(1, Math.floor(availableWidthPx / avgSampleCharWidth));
    return { maxCharacters: rawCapacity, isOverLimit: false };
  }

  const textMetrics = measureTextMetrics(trimmed, spec);
  if (textMetrics.width <= availableWidthPx) {
    // Current text fits! Calculate remaining character capacity based on user's actual character density
    const userCharWidth = textMetrics.width / trimmed.length;
    // Blend with sample character width for stability when short (< 3 chars)
    const effectiveCharWidth = trimmed.length >= 3
      ? userCharWidth
      : (userCharWidth * trimmed.length + avgSampleCharWidth * (3 - trimmed.length)) / 3;
    const remainingPx = availableWidthPx - textMetrics.width;
    const extraChars = Math.floor(remainingPx / effectiveCharWidth);
    return {
      maxCharacters: trimmed.length + extraChars,
      isOverLimit: false,
    };
  } else {
    // Text exceeds available width at current font size!
    // Find the exact number of characters from this text that fit
    let fitCount = 0;
    for (let i = 1; i <= trimmed.length; i++) {
      if (measureTextWidth(trimmed.slice(0, i), spec) <= availableWidthPx) {
        fitCount = i;
      } else {
        break;
      }
    }
    return {
      maxCharacters: Math.max(1, fitCount),
      isOverLimit: true,
    };
  }
}

/**
 * Calculates dynamic character and line limits based on physical label dimensions.
 * Backward compatible and updated with real Canvas measurement.
 */
export function calculateDynamicCharLimits(
  widthMm: number,
  heightMm: number,
  illustrationId?: string,
  labelType?: SchoolLabelType | GeneratorType,
  customIconSizePx?: number,
  info?: StudentInfo,
  fontSizePx?: number,
  duplicateIconRight?: boolean
): DynamicFieldLimits {
  const isSupplies = labelType === 'supplies';
  if (isSupplies) {
    // RÈGLES 1, 14 & 17 : « Étiquette fournitures »
    const maxLines = heightMm <= 6 ? 1 : 2;
    const geometry = calculateLabelGeometry(widthMm, heightMm, illustrationId, customIconSizePx, 'supplies', duplicateIconRight);
    const availW = geometry.availableWidthPx;
    const lineHeightMul = 1.15;
    const ratioSecondLine = heightMm <= 11 ? 0.64 : heightMm <= 15 ? 0.66 : 0.68;

    let targetFontSize1: number;
    let targetFontSize2: number;

    const is50x10 = Math.abs(widthMm - 50) < 0.5 && Math.abs(heightMm - 10) < 0.5;
    const is56x15 = Math.abs(widthMm - 56) < 0.5 && Math.abs(heightMm - 15) < 0.5;
    const is60x20 = Math.abs(widthMm - 60) < 0.5 && Math.abs(heightMm - 20) < 0.5;
    const is56x11 = Math.abs(widthMm - 56) < 0.5 && Math.abs(heightMm - 11) < 0.5;

    if (fontSizePx && fontSizePx > 0) {
      targetFontSize1 = fontSizePx;
      targetFontSize2 = Math.round(targetFontSize1 * ratioSecondLine * 10) / 10;
    } else if (is50x10) {
      targetFontSize1 = 9.0;
      targetFontSize2 = 7.0;
    } else if (is56x15 || is60x20) {
      targetFontSize1 = 12.0;
      targetFontSize2 = 10.0;
    } else if (is56x11) {
      targetFontSize1 = 11.0;
      targetFontSize2 = 8.0;
    } else if (maxLines === 1) {
      const maxSByHeight = Math.floor((geometry.availableHeightPx / lineHeightMul) * 10) / 10;
      targetFontSize1 = heightMm <= 6 ? Math.min(8.2, maxSByHeight) : Math.min(16.5, maxSByHeight);
      targetFontSize2 = 0;
    } else {
      const interLineGapPx = clamp(Math.round(geometry.availableHeightPx * 0.08 * 10) / 10, 1.2, 3.2);
      const totalHeightMultiplier = lineHeightMul * (1 + ratioSecondLine);
      const maxVerticalS1 = Math.floor(((geometry.availableHeightPx - interLineGapPx) / totalHeightMultiplier) * 10) / 10;
      targetFontSize1 = heightMm <= 11 ? Math.min(14.0, maxVerticalS1) : Math.min(18.5, maxVerticalS1);
      targetFontSize2 = Math.round(targetFontSize1 * ratioSecondLine * 10) / 10;
    }

    const nameCap = calculateDynamicFieldCapacity(info?.fullName || '', availW, targetFontSize1, '800');
    const gradeCap = maxLines >= 2
      ? calculateDynamicFieldCapacity(info?.grade || '', availW, targetFontSize2, '700')
      : { maxCharacters: 0, isOverLimit: false };

    return {
      maxLines,
      fullName: nameCap.maxCharacters,
      grade: gradeCap.maxCharacters,
      schoolName: 0,
      subjectName: 0,
    };
  }

  const hasIllustration = Boolean(illustrationId && illustrationId !== 'none');
  const maxLines = getAvailableLines(widthMm, heightMm, {
    labelType,
    isSupplies,
    hasIcon: hasIllustration,
    iconSize: customIconSizePx,
  });

  const geometry = calculateLabelGeometry(widthMm, heightMm, illustrationId, customIconSizePx, labelType, duplicateIconRight);
  const availW = geometry.availableWidthPx;

  // Effective font size: if provided, use it; otherwise compute based on available height and maxLines
  const lineHeightMul = LAYOUT_CONFIG.LINE_HEIGHT_MULTIPLIER;
  const interLineGapPx = maxLines > 1 ? clamp(Math.round(geometry.availableHeightPx * 0.08 * 10) / 10, 1.0, 3.5) : 0;
  const totalGapsPx = maxLines > 1 ? (maxLines - 1) * interLineGapPx : 0;
  const netVerticalPx = Math.max(2, geometry.availableHeightPx - totalGapsPx);
  const defaultFontSize = fontSizePx && fontSizePx > 0
    ? fontSizePx
    : Math.max(3.2, Math.floor((netVerticalPx / (maxLines * lineHeightMul)) * 10) / 10);

  const nameCap = calculateDynamicFieldCapacity(info?.fullName || '', availW, defaultFontSize, '800');
  const gradeCap = calculateDynamicFieldCapacity(info?.grade || '', availW, defaultFontSize, '700');
  const schoolCap = calculateDynamicFieldCapacity(info?.schoolName || '', availW, defaultFontSize, '600');
  const subjectCap = calculateDynamicFieldCapacity(info?.subjectName || '', availW, defaultFontSize, '600');

  return {
    maxLines,
    fullName: nameCap.maxCharacters,
    grade: gradeCap.maxCharacters,
    schoolName: schoolCap.maxCharacters,
    subjectName: subjectCap.maxCharacters,
  };
}

/**
 * Calculates the maximum realistic character capacity for a given label layout.
 * Kept for backwards compatibility.
 */
export function calculateMaxCharacters({
  labelWidth,
  labelHeight,
  iconEnabled = false,
  iconSize,
  fontFamily = FONT_FAMILIES,
  fontWeight = '800',
  minFontSize,
}: MaxCharactersParams): number {
  const geometry = calculateLabelGeometry(labelWidth, labelHeight, iconEnabled ? 'icon' : 'none', iconSize);
  const availW = geometry.availableWidthPx;
  const effectiveMinFont = minFontSize ?? (labelHeight <= 8 ? 3.2 : labelHeight <= 14 ? 3.6 : 4.0);
  const cap = calculateDynamicFieldCapacity('', availW, effectiveMinFont, fontWeight, fontFamily);
  return cap.maxCharacters;
}

/**
 * Tailles de police par défaut pour « Étiquette fournitures » (strictement respectées par dimension) :
 * | Dimension | Nom et prénom | Classe |
 * | 46 × 6 mm | 9px | — |
 * | 50 × 10 mm | 10px | 9px |
 * | 56 × 15 mm | 10px | 9px |
 * | Personnalisé (par défaut 60 × 20 mm) | 12px | 10px |
 */
export function getSuppliesDefaultFontSizes(
  widthMm: number,
  heightMm: number
): { fullName: number; grade: number } {
  // 46 × 6 mm (ou toute hauteur <= 6 mm)
  if ((Math.abs(widthMm - 46) < 0.5 && Math.abs(heightMm - 6) < 0.5) || heightMm <= 6) {
    return { fullName: 9, grade: 9 };
  }
  // 50 × 10 mm
  if (Math.abs(widthMm - 50) < 0.5 && Math.abs(heightMm - 10) < 0.5) {
    return { fullName: 10, grade: 9 };
  }
  // 56 × 15 mm
  if (Math.abs(widthMm - 56) < 0.5 && Math.abs(heightMm - 15) < 0.5) {
    return { fullName: 10, grade: 9 };
  }
  // Personnalisé (par défaut 60 × 20 mm)
  if (Math.abs(widthMm - 60) < 0.5 && Math.abs(heightMm - 20) < 0.5) {
    return { fullName: 12, grade: 10 };
  }

  // Échelle de référence pour autres dimensions personnalisées :
  if (heightMm <= 8) {
    return { fullName: 9, grade: 9 };
  } else if (heightMm <= 12) {
    return { fullName: 10, grade: 9 };
  } else if (heightMm <= 16) {
    return { fullName: 10, grade: 9 };
  } else if (heightMm <= 20) {
    return { fullName: 12, grade: 10 };
  } else {
    return {
      fullName: Math.min(22, Math.round(12 + (heightMm - 20) * 0.35)),
      grade: Math.min(16, Math.round(10 + (heightMm - 20) * 0.25)),
    };
  }
}

export function getSuppliesBaseFontSizes(widthMm: number, heightMm: number): { baseMain: number; baseSecond: number } {
  const defaults = getSuppliesDefaultFontSizes(widthMm, heightMm);
  return { baseMain: defaults.fullName, baseSecond: defaults.grade };
}

/**
 * Universal text-fitting logic for a single line of text:
 * CORE RULE:
 * 1. Start with the BASE font-size defined for the label dimension.
 * 2. Render/measure the COMPLETE text at that font-size.
 * 3. If the text fits and there is MORE than approximately 3.5px empty space on the right:
 *    -> DO NOT reduce the font-size.
 *    -> Instead, increase the font-size progressively.
 * 4. Continue increasing the font-size until the text occupies almost all available width.
 * 5. STOP when the text reaches approximately: AVAILABLE WIDTH - 3.5px.
 * 6. ONLY if the text becomes wider than the available width:
 *    -> reduce the font-size progressively until the COMPLETE text fits.
 * 7. NEVER reduce the font-size while there is still significant unused width.
 * Target: TEXT WIDTH ≈ AVAILABLE TEXT WIDTH with ONLY approximately 3.5px remaining on the RIGHT side.
 * Final right-side empty space must be approximately: 3.5px MAXIMUM (NOT 10px, NOT 15px, NOT a large empty area).
 */
export function fitTextLineToAvailableWidth(
  text: string,
  baseSize: number,
  weight: string,
  availableWidthPx: number,
  maxGrowthCap: number,
  minSize: number = 3.2
): number {
  if (!text || text.trim().length === 0) {
    return baseSize;
  }
  const clean = text.trim();

  const baseSpec = `${weight} ${baseSize}px ${FONT_FAMILIES}`;
  const baseW = measureTextWidth(clean, baseSpec);

  let current = baseSize;

  // RULE:
  // Avant de réduire le font size, utiliser TOUT le width du block text.
  // Le font-size est réduit UNIQUEMENT si le texte dépasse la largeur disponible du bloc de texte.
  if (baseW <= availableWidthPx + 2.5) {
    // 3. Le texte rentre à la taille de base (ou avec marge tolérance): NE PAS réduire.
    // Au contraire, si de la place reste, augmenter progressivement le font-size jusqu'au cap.
    if (baseW <= availableWidthPx) {
      while (current + 0.1 <= maxGrowthCap) {
        const cand = Math.round((current + 0.1) * 10) / 10;
        const candSpec = `${weight} ${cand}px ${FONT_FAMILIES}`;
        const candW = measureTextWidth(clean, candSpec);

        if (candW <= availableWidthPx) {
          current = cand;
        } else {
          // La taille suivante dépasse la largeur disponible: ARRÊTER à la taille maximale qui rentre
          break;
        }
      }
    }
  } else {
    // 6. UNIQUEMENT si le texte dépasse la largeur disponible:
    // réduire progressivement (-0.1px) jusqu'à ce que le texte COMPLET rentre.
    // ARRÊTER dès qu'il rentre, ne pas réduire davantage.
    while (current - 0.1 >= minSize) {
      const cand = Math.round((current - 0.1) * 10) / 10;
      current = cand;
      const candSpec = `${weight} ${current}px ${FONT_FAMILIES}`;
      const candW = measureTextWidth(clean, candSpec);
      if (candW <= availableWidthPx + 2.5) {
        break;
      }
    }
  }

  return Math.max(minSize, current);
}

/**
 * =========================================================================
 * MOTEUR DÉDIÉ : « ÉTIQUETTE FOURNITURES » (Règles 1 à 19)
 * Strictement isolé pour labelType === 'supplies'.
 * Aucune autre catégorie d'étiquettes n'est affectée.
 * =========================================================================
 */
function computeSuppliesTextFit(
  widthMm: number,
  heightMm: number,
  info: StudentInfo,
  language: Language,
  illustrationId?: string,
  customIconSizePx?: number,
  customFontSizes?: FieldFontSizes,
  duplicateIconRight?: boolean
): TextFitResult {
  const isArabic = language === 'ar';
  const t = TRANSLATIONS[language];

  // RÈGLE 1 & 17 : MATRICE DE COMPORTEMENT
  // Hauteur <= 6 mm : 1 ligne obligatoire (ex: 46 × 6 mm -> 1 ligne).
  // Hauteur > 6 mm : 1 ou 2 lignes maximum (JAMAIS plus de 2 lignes, quelle que soit la dimension).
  const maxLines = heightMm <= 6 ? 1 : 2;

  // Calcul de la géométrie adaptée aux fournitures (Règles 2 & 5)
  const geometry = calculateLabelGeometry(widthMm, heightMm, illustrationId, customIconSizePx, 'supplies', duplicateIconRight);

  // Textes saisis (Fournitures = uniquement Nom et prénom + Classe si maxLines >= 2)
  const rawName = info.fullName ? info.fullName.trim() : '';
  const rawGrade = maxLines >= 2 && info.grade ? info.grade.trim() : '';

  // Candidates for supplies:
  // Ligne 1 = Nom et prénom (Primary)
  // Ligne 2 = Classe (Secondary, only if maxLines >= 2)
  const hasLine1 = rawName.length > 0;
  const hasLine2 = maxLines >= 2 && rawGrade.length > 0;

  // Active lines count: reflects ONLY user-entered text (Règle 1: "S'il ne saisit qu'une ligne, l'étiquette aura 1 ligne")
  let activeLinesCount = 0;
  if (hasLine1 && hasLine2) {
    activeLinesCount = 2;
  } else if (hasLine1 || hasLine2) {
    activeLinesCount = 1;
  }

  const hasAnyText = activeLinesCount > 0;

  // Ratio hiérarchique Ligne 1 / Ligne 2 (Règle 3, Règle 4, Règle 10):
  // fontSizeLine2 = fontSizeLine1 * ratioSecondLine (0.60 à 0.72)
  const ratioSecondLine = heightMm <= 11 ? 0.64 : heightMm <= 15 ? 0.66 : 0.68;

  // Line height multiplier: 1.15
  const lineHeightMul = 1.15;

  // Inter-line gap: only present if 2 active lines
  const interLineGapPx = activeLinesCount === 2
    ? clamp(Math.round(geometry.availableHeightPx * 0.06 * 10) / 10, 1.0, 2.5)
    : 0;

  // Détermination des tailles par défaut et application des tailles personnalisées
  const defaultSizes = getSuppliesDefaultFontSizes(widthMm, heightMm);
  const defaultSize1 = defaultSizes.fullName;
  const defaultSize2 = defaultSizes.grade;

  let fontSizeLine1 = (customFontSizes?.fullName !== undefined && customFontSizes.fullName > 0)
    ? customFontSizes.fullName
    : defaultSize1;

  let fontSizeLine2 = 0;
  if (hasLine2) {
    fontSizeLine2 = (customFontSizes?.grade !== undefined && customFontSizes.grade > 0)
      ? customFontSizes.grade
      : defaultSize2;
  }

  // Construction des lignes actives
  const activeLines: ActiveLineInfo[] = [];
  const errors: { fullName?: string; grade?: string; schoolName?: string; subjectName?: string } = {};

  const defaultMaxLengthError = isArabic
    ? 'النص يتجاوز الحد الأقصى المسموح به لهذا الملصق.'
    : 'Le texte dépasse la longueur maximale autorisée pour cette étiquette.';

  if (hasLine1) {
    const spec1 = `800 ${fontSizeLine1}px ${FONT_FAMILIES}`;
    const metrics1 = measureTextMetrics(rawName, spec1);
    const isTooLong1 = metrics1.width > geometry.availableWidthPx + 2.5;
    let errorMsg1: string | undefined = undefined;
    if (isTooLong1) {
      errorMsg1 = t.fieldErrors?.fullName || defaultMaxLengthError;
      errors.fullName = errorMsg1;
    }

    const lineHeightPx1 = Math.round(fontSizeLine1 * lineHeightMul * 10) / 10;
    activeLines.push({
      key: 'fullName',
      label: t.fullNameLabel,
      text: rawName,
      isPrimary: true,
      fontSizePx: fontSizeLine1,
      fontSizeMm: Math.round((fontSizeLine1 / PX_PER_MM) * 100) / 100,
      lineHeightPx: lineHeightPx1,
      lineHeightMm: Math.round((lineHeightPx1 / PX_PER_MM) * 100) / 100,
      widthPx: Math.round(metrics1.width * 10) / 10,
      heightPx: lineHeightPx1,
      fontWeight: '800',
      isTooLong: isTooLong1,
      errorMessage: errorMsg1,
    });
  }

  if (hasLine2) {
    const effectiveS2 = fontSizeLine2 > 0 ? fontSizeLine2 : defaultSize2;
    const spec2 = `700 ${effectiveS2}px ${FONT_FAMILIES}`;
    const metrics2 = measureTextMetrics(rawGrade, spec2);
    const isTooLong2 = metrics2.width > geometry.availableWidthPx + 2.5;
    let errorMsg2: string | undefined = undefined;
    if (isTooLong2) {
      errorMsg2 = t.fieldErrors?.grade || defaultMaxLengthError;
      errors.grade = errorMsg2;
    }

    const lineHeightPx2 = Math.round(effectiveS2 * lineHeightMul * 10) / 10;
    activeLines.push({
      key: 'grade',
      label: t.gradeLabel,
      text: rawGrade,
      isPrimary: false,
      fontSizePx: effectiveS2,
      fontSizeMm: Math.round((effectiveS2 / PX_PER_MM) * 100) / 100,
      lineHeightPx: lineHeightPx2,
      lineHeightMm: Math.round((lineHeightPx2 / PX_PER_MM) * 100) / 100,
      widthPx: Math.round(metrics2.width * 10) / 10,
      heightPx: lineHeightPx2,
      fontWeight: '700',
      isTooLong: isTooLong2,
      errorMessage: errorMsg2,
    });
  }

  // RÈGLE 14 : COMPTEUR DE CARACTÈRES CALCULÉ RÉELLEMENT AVEC measureText()
  const nameCap = calculateDynamicFieldCapacity(rawName, geometry.availableWidthPx, fontSizeLine1, '800');
  const gradeFontSize = fontSizeLine2 > 0 ? fontSizeLine2 : defaultSize2;
  const gradeCap = maxLines >= 2
    ? calculateDynamicFieldCapacity(rawGrade, geometry.availableWidthPx, gradeFontSize, '700')
    : { maxCharacters: 0, isOverLimit: false };

  const limits: DynamicFieldLimits = {
    maxLines,
    fullName: nameCap.maxCharacters,
    grade: gradeCap.maxCharacters,
    schoolName: 0,
    subjectName: 0,
  };

  // RÈGLE 13 : CENTRAGE VERTICAL DU GROUPE DE TEXTE
  const linesHeightSum = activeLines.reduce((acc, l) => acc + l.lineHeightPx, 0);
  const totalBlockHeightPx = linesHeightSum + (activeLines.length > 1 ? interLineGapPx : 0);
  const remainingVerticalPx = Math.max(0, geometry.heightPx - totalBlockHeightPx);
  const topPaddingOffsetPx = Math.round((remainingVerticalPx / 2) * 10) / 10;

  const hasAnyError = Boolean(errors.fullName || errors.grade);
  const isNameTooLong = Boolean(errors.fullName);
  const errorMessage = errors.fullName || errors.grade;

  const nameDetails: FieldFitDetails = activeLines.find((l) => l.key === 'fullName')
    ? {
        text: rawName,
        fontSizePx: fontSizeLine1,
        fontSizeMm: Math.round((fontSizeLine1 / PX_PER_MM) * 100) / 100,
        lineHeightPx: Math.round(fontSizeLine1 * lineHeightMul * 10) / 10,
        lineHeightMm: Math.round(((fontSizeLine1 * lineHeightMul) / PX_PER_MM) * 100) / 100,
        widthPx: activeLines.find((l) => l.key === 'fullName')!.widthPx,
        heightPx: activeLines.find((l) => l.key === 'fullName')!.heightPx,
        isTooLong: isNameTooLong,
        errorMessage: errors.fullName,
      }
    : {
        text: rawName,
        fontSizePx: fontSizeLine1,
        fontSizeMm: Math.round((fontSizeLine1 / PX_PER_MM) * 100) / 100,
        lineHeightPx: Math.round(fontSizeLine1 * lineHeightMul * 10) / 10,
        lineHeightMm: Math.round(((fontSizeLine1 * lineHeightMul) / PX_PER_MM) * 100) / 100,
        widthPx: 0,
        heightPx: Math.round(fontSizeLine1 * lineHeightMul * 10) / 10,
        isTooLong: false,
      };

  const effectiveGradeFontSize = fontSizeLine2 > 0 ? fontSizeLine2 : defaultSize2;
  const gradeDetails: FieldFitDetails = activeLines.find((l) => l.key === 'grade')
    ? {
        text: rawGrade,
        fontSizePx: effectiveGradeFontSize,
        fontSizeMm: Math.round((effectiveGradeFontSize / PX_PER_MM) * 100) / 100,
        lineHeightPx: Math.round(effectiveGradeFontSize * lineHeightMul * 10) / 10,
        lineHeightMm: Math.round(((effectiveGradeFontSize * lineHeightMul) / PX_PER_MM) * 100) / 100,
        widthPx: activeLines.find((l) => l.key === 'grade')!.widthPx,
        heightPx: activeLines.find((l) => l.key === 'grade')!.heightPx,
        isTooLong: Boolean(errors.grade),
        errorMessage: errors.grade,
      }
    : {
        text: rawGrade,
        fontSizePx: effectiveGradeFontSize,
        fontSizeMm: Math.round((effectiveGradeFontSize / PX_PER_MM) * 100) / 100,
        lineHeightPx: Math.round(effectiveGradeFontSize * lineHeightMul * 10) / 10,
        lineHeightMm: Math.round(((effectiveGradeFontSize * lineHeightMul) / PX_PER_MM) * 100) / 100,
        widthPx: 0,
        heightPx: Math.round(effectiveGradeFontSize * lineHeightMul * 10) / 10,
        isTooLong: false,
      };

  const emptyField = (key: string, text: string): FieldFitDetails => ({
    text,
    fontSizePx: fontSizeLine1,
    fontSizeMm: Math.round((fontSizeLine1 / PX_PER_MM) * 100) / 100,
    lineHeightPx: Math.round(fontSizeLine1 * lineHeightMul * 10) / 10,
    lineHeightMm: Math.round(((fontSizeLine1 * lineHeightMul) / PX_PER_MM) * 100) / 100,
    widthPx: 0,
    heightPx: Math.round(fontSizeLine1 * lineHeightMul * 10) / 10,
    isTooLong: false,
  });

  // RÈGLE STRICTE : Si la duplication d'icône est active, ne jamais réduire le texte.
  // Si l'espace manque, c'est la taille de l'icône qui est réduite pour que tout rentre.
  adjustIconSizeForDuplication(geometry, activeLines);

  return {
    geometry,
    limits,
    fontSizeFinal: fontSizeLine1,
    defaultFontSizes: {
      fullName: Math.round(defaultSize1),
      grade: Math.round(defaultSize2),
      schoolName: Math.round(defaultSize2),
      subjectName: Math.round(defaultSize2),
    },
    isNameTooLong,
    hasAnyError,
    errorMessage,
    formatTooSmallForFields: false,
    formatNotice: undefined,
    errors,

    activeLines,

    name: nameDetails,
    grade: gradeDetails,
    school: emptyField('schoolName', ''),
    subject: emptyField('subjectName', ''),

    nameText: nameDetails.text,
    nameFontSizePx: fontSizeLine1,
    nameLineHeightPx: nameDetails.lineHeightPx,
    nameWidthPx: nameDetails.widthPx,

    gradeText: gradeDetails.text,
    gradeFontSizePx: effectiveGradeFontSize,
    gradeLineHeightPx: gradeDetails.lineHeightPx,
    gradeWidthPx: gradeDetails.widthPx,

    schoolText: '',
    schoolFontSizePx: fontSizeLine1,
    schoolLineHeightPx: nameDetails.lineHeightPx,
    schoolWidthPx: 0,

    subjectText: '',
    subjectFontSizePx: fontSizeLine1,
    subjectLineHeightPx: nameDetails.lineHeightPx,
    subjectWidthPx: 0,

    activeLinesCount,
    hasAnyText,
    interLineGapPx,
    totalBlockHeightPx,
    topPaddingOffsetPx,
  };
}

/**
 * Tailles par défaut indépendantes par champ pour les étiquettes Cahier / Livre (ex: 70 × 35 mm).
 * Règle stricte utilisateur :
 * 70 × 35 mm :
 * - Nom et prénom → 12 px
 * - Classe → 10 px
 * - Matière → 10 px
 * - École → 8 px
 */
/**
 * Tailles de police par défaut pour chaque dimension de l'étiquette « Cahier & livres ».
 * TABLEAU STRICT DES VALEURS PAR DÉFAUT ATTENDUES :
 * | Dimension           | Nom et prénom | Classe | Matière | École |
 * | 70 × 35 mm          | 12px          | 12px   | 10px    | 10px  |
 * | 80 × 40 mm          | 12px          | 12px   | 10px    | 10px  |
 * | Personnalisé (défaut)| 12px         | 12px   | 10px    | 10px  |
 */
export function getBooksDefaultFontSizes(widthMm?: number, heightMm?: number): {
  fullName: number;
  grade: number;
  subjectName: number;
  schoolName: number;
} {
  return {
    fullName: 12,
    grade: 12,
    subjectName: 10,
    schoolName: 10,
  };
}

export function getBooksBaseFontSizes(widthMm?: number, heightMm?: number): {
  fullName: number;
  grade: number;
  subjectName: number;
  schoolName: number;
} {
  return getBooksDefaultFontSizes(widthMm, heightMm);
}

/**
 * Intelligent "Fit Text" and Layout Engine for School Labels
 * 
 * CORE ARCHITECTURAL PRINCIPLES:
 * 1. UNIFIED FONT SIZE: All lines in the same label share the EXACT same font size.
 *    fontSizeFinal = MIN(horizontal necessary size for all lines, vertical available size)
 *    NO independent line resizing!
 * 2. 46 × 6 mm (height < 9mm): Strict 1-line layout. NOM + PRÉNOM on a single line, never wrapped.
 * 3. Space utilization: Uses labelWidth - padding - iconWidth - gap = availableTextWidth cleanly.
 * 4. Centering: Perfectly centered vertically in the label.
 * 5. Dynamic character counting: Real Canvas measureText based on font-family, font-size, font-weight.
 * 6. Minimum readable size: Never shrinks below readable print size (3.2px).
 */
export function computeTextFit(
  widthMm: number,
  heightMm: number,
  info: StudentInfo,
  language: Language,
  illustrationId?: string,
  labelType?: SchoolLabelType | GeneratorType,
  customIconSizePx?: number,
  customFontSizes?: FieldFontSizes,
  duplicateIconRight?: boolean
): TextFitResult {
  // RÈGLE 18 : CODE ISOLÉ POUR « ÉTIQUETTE FOURNITURES »
  if (labelType === 'supplies') {
    return computeSuppliesTextFit(widthMm, heightMm, info, language, illustrationId, customIconSizePx, customFontSizes, duplicateIconRight);
  }

  const isArabic = language === 'ar';
  const geometry = calculateLabelGeometry(widthMm, heightMm, illustrationId, customIconSizePx, labelType, duplicateIconRight);
  const t = TRANSLATIONS[language];
  const isSuppliesOnly = false;

  // Determine allowed lines strictly according to height rules:
  // - < 9 mm: STRICTLY 1 line
  // - 9 mm <= H < 14 mm: MAXIMUM 2 lines
  // - 14 mm <= H < 18 mm: MAXIMUM 3 lines
  // - H >= 18 mm: MAXIMUM 4 lines
  const maxLines = getAvailableLines(widthMm, heightMm, {
    labelType,
    isSupplies: isSuppliesOnly,
    hasIcon: Boolean(illustrationId && illustrationId !== 'none'),
    iconSize: customIconSizePx,
  });

  // Read raw user text without artificial truncation or slicing
  const rawName = info.fullName ? info.fullName.trim() : '';
  const rawGrade = info.grade ? info.grade.trim() : '';
  const rawSchool = !isSuppliesOnly && info.schoolName ? info.schoolName.trim() : '';
  const rawSubject = !isSuppliesOnly && info.subjectName ? info.subjectName.trim() : '';

  // Active fields present
  const enteredFieldsCount =
    (rawName ? 1 : 0) +
    (rawGrade ? 1 : 0) +
    (rawSchool ? 1 : 0) +
    (rawSubject ? 1 : 0);

  // Check if format is too small to display all entered information
  const formatTooSmallForFields = enteredFieldsCount > maxLines;
  const formatNotice = formatTooSmallForFields ? t.formatTooSmall : undefined;

  // Strict mandatory order of candidates:
  // 1. Nom et prénom (weight: 800)
  // 2. Classe (weight: 700)
  // 3. Matière (weight: 600)
  // 4. École (weight: 600)
  const orderedCandidates: Array<{
    key: 'fullName' | 'grade' | 'schoolName' | 'subjectName';
    text: string;
    label: string;
    weight: string;
  }> = [
    {
      key: 'fullName',
      text: rawName,
      label: t.fullNameLabel,
      weight: '800',
    },
    {
      key: 'grade',
      text: rawGrade,
      label: t.gradeLabel,
      weight: '700',
    },
    {
      key: 'subjectName',
      text: rawSubject,
      label: t.subjectCheckbox,
      weight: '600',
    },
    {
      key: 'schoolName',
      text: rawSchool,
      label: t.schoolCheckbox,
      weight: '600',
    },
  ];

  // Filter out empty fields so we NEVER create an empty line:
  const nonEmptyCandidates = orderedCandidates.filter((c) => c.text.length > 0);

  // Keep up to maxLines (e.g. 46x6mm strictly gets 1 line!):
  const linesToRender = nonEmptyCandidates.slice(0, maxLines);
  const activeLinesCount = linesToRender.length;
  const hasAnyText = activeLinesCount > 0;

  const lineHeightMul = LAYOUT_CONFIG.LINE_HEIGHT_MULTIPLIER; // 1.15
  // Dynamic interline gap: proportional to available height
  const interLineGapPx = activeLinesCount > 1
    ? clamp(Math.round(geometry.availableHeightPx * 0.08 * 10) / 10, 2.0, 3.2)
    : 0;
  const totalGapsPx = activeLinesCount > 1 ? (activeLinesCount - 1) * interLineGapPx : 0;

  // =========================================================================
  // CALCUL INDÉPENDANT PAR CHAMP (Règle stricte utilisateur)
  // Chaque champ possède sa propre taille par défaut et son propre calcul.
  // Aucun champ n'influence la taille d'un autre champ.
  // Format 70 × 35 mm : Nom = 12px, Classe = 10px, Matière = 10px, École = 8px.
  // =========================================================================
  const baseSizes = getBooksBaseFontSizes(widthMm, heightMm);
  const fontSizeFinal = baseSizes.fullName;

  const errors: {
    fullName?: string;
    grade?: string;
    subjectName?: string;
    schoolName?: string;
  } = {};

  const defaultMaxLengthError = isArabic
    ? 'النص يتجاوز الحد الأقصى المسموح به لهذا الملصق.'
    : 'Le texte dépasse la longueur maximale autorisée pour cette étiquette.';

  const activeLines: ActiveLineInfo[] = linesToRender.map((cfg, idx) => {
    const baseSize = baseSizes[cfg.key];
    const customSize = customFontSizes?.[cfg.key];
    const fontSizePx = (customSize !== undefined && customSize > 0) ? customSize : baseSize;
    const fontSizeMm = Math.round((fontSizePx / PX_PER_MM) * 100) / 100;
    const lineHeightPx = Math.round(fontSizePx * lineHeightMul * 10) / 10;
    const lineHeightMm = Math.round(((fontSizePx * lineHeightMul) / PX_PER_MM) * 100) / 100;
    const spec = `${cfg.weight} ${fontSizePx}px ${FONT_FAMILIES}`;
    const metrics = measureTextMetrics(cfg.text, spec);
    const isTooLong = metrics.width > geometry.availableWidthPx + 2.5;
    let errorMsg: string | undefined = undefined;

    if (isTooLong) {
      errorMsg = t.fieldErrors?.[cfg.key] || defaultMaxLengthError;
      errors[cfg.key] = errorMsg;
    }

    return {
      key: cfg.key,
      label: cfg.label,
      text: cfg.text,
      isPrimary: idx === 0,
      fontSizePx,
      fontSizeMm,
      lineHeightPx,
      lineHeightMm,
      widthPx: Math.round(metrics.width * 10) / 10,
      heightPx: lineHeightPx,
      fontWeight: cfg.weight,
      isTooLong,
      errorMessage: errorMsg,
    };
  });

  const effNameSize = (customFontSizes?.fullName && customFontSizes.fullName > 0) ? customFontSizes.fullName : baseSizes.fullName;
  const effGradeSize = (customFontSizes?.grade && customFontSizes.grade > 0) ? customFontSizes.grade : baseSizes.grade;
  const effSchoolSize = (customFontSizes?.schoolName && customFontSizes.schoolName > 0) ? customFontSizes.schoolName : baseSizes.schoolName;
  const effSubjectSize = (customFontSizes?.subjectName && customFontSizes.subjectName > 0) ? customFontSizes.subjectName : baseSizes.subjectName;

  // Calculate real dynamic character limits for UI form based on effective font size and actual user text:
  const nameCap = calculateDynamicFieldCapacity(rawName, geometry.availableWidthPx, effNameSize, '800');
  const gradeCap = calculateDynamicFieldCapacity(rawGrade, geometry.availableWidthPx, effGradeSize, '700');
  const schoolCap = calculateDynamicFieldCapacity(rawSchool, geometry.availableWidthPx, effSchoolSize, '600');
  const subjectCap = calculateDynamicFieldCapacity(rawSubject, geometry.availableWidthPx, effSubjectSize, '600');

  const limits: DynamicFieldLimits = {
    maxLines,
    fullName: nameCap.maxCharacters,
    grade: gradeCap.maxCharacters,
    schoolName: schoolCap.maxCharacters,
    subjectName: subjectCap.maxCharacters,
  };

  // Calculate total rendered block height
  const linesHeightSum = activeLines.reduce((acc, l) => acc + l.lineHeightPx, 0);
  const totalBlockHeightPx = linesHeightSum + totalGapsPx;
  const remainingVerticalPx = Math.max(0, geometry.heightPx - totalBlockHeightPx);
  const topPaddingOffsetPx = Math.round((remainingVerticalPx / 2) * 10) / 10;

  const hasAnyError = Boolean(errors.fullName || errors.grade || errors.subjectName || errors.schoolName);
  const isNameTooLong = Boolean(errors.fullName);
  const errorMessage = errors.fullName || errors.grade || errors.subjectName || errors.schoolName;

  // Helper for field backward compatibility
  const createFieldDetails = (key: 'fullName' | 'grade' | 'schoolName' | 'subjectName', defaultText: string): FieldFitDetails => {
    const line = activeLines.find((l) => l.key === key);
    if (line) {
      return {
        text: line.text,
        fontSizePx: line.fontSizePx,
        fontSizeMm: line.fontSizeMm,
        lineHeightPx: line.lineHeightPx,
        lineHeightMm: line.lineHeightMm,
        widthPx: line.widthPx,
        heightPx: line.heightPx,
        isTooLong: line.isTooLong,
        errorMessage: line.errorMessage,
      };
    }
    const fallbackSize = baseSizes[key];
    return {
      text: defaultText,
      fontSizePx: fallbackSize,
      fontSizeMm: Math.round((fallbackSize / PX_PER_MM) * 100) / 100,
      lineHeightPx: Math.round(fallbackSize * lineHeightMul * 10) / 10,
      lineHeightMm: Math.round(((fallbackSize * lineHeightMul) / PX_PER_MM) * 100) / 100,
      widthPx: 0,
      heightPx: Math.round(fallbackSize * lineHeightMul * 10) / 10,
      isTooLong: false,
    };
  };

  const nameDetails = createFieldDetails('fullName', rawName);
  const gradeDetails = createFieldDetails('grade', rawGrade);
  const schoolDetails = createFieldDetails('schoolName', rawSchool);
  const subjectDetails = createFieldDetails('subjectName', rawSubject);

  // RÈGLE STRICTE : Si la duplication d'icône est active, ne jamais réduire le texte.
  // Si l'espace manque, c'est la taille de l'icône qui est réduite pour que tout rentre.
  adjustIconSizeForDuplication(geometry, activeLines);

  return {
    geometry,
    limits,
    fontSizeFinal,
    defaultFontSizes: {
      fullName: Math.round(baseSizes.fullName),
      grade: Math.round(baseSizes.grade),
      subjectName: Math.round(baseSizes.subjectName),
      schoolName: Math.round(baseSizes.schoolName),
    },
    isNameTooLong,
    hasAnyError,
    errorMessage,
    formatTooSmallForFields,
    formatNotice,
    errors,

    activeLines,

    name: nameDetails,
    grade: gradeDetails,
    school: schoolDetails,
    subject: subjectDetails,

    nameText: nameDetails.text,
    nameFontSizePx: effNameSize,
    nameLineHeightPx: nameDetails.lineHeightPx,
    nameWidthPx: nameDetails.widthPx,

    gradeText: gradeDetails.text,
    gradeFontSizePx: effGradeSize,
    gradeLineHeightPx: gradeDetails.lineHeightPx,
    gradeWidthPx: gradeDetails.widthPx,

    schoolText: schoolDetails.text,
    schoolFontSizePx: effSchoolSize,
    schoolLineHeightPx: schoolDetails.lineHeightPx,
    schoolWidthPx: schoolDetails.widthPx,

    subjectText: subjectDetails.text,
    subjectFontSizePx: effSubjectSize,
    subjectLineHeightPx: subjectDetails.lineHeightPx,
    subjectWidthPx: subjectDetails.widthPx,

    activeLinesCount,
    hasAnyText,
    interLineGapPx,
    totalBlockHeightPx,
    topPaddingOffsetPx,
  };
}
