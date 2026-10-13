import {
  AlternationPatternConfig,
  ComputedHandwritingRow,
  EditableTextSegment,
  GradeTypographyPreset,
  HandwritingLanguage,
  RepetitionCell,
  RepetitionGradientStyle,
  SchoolGradeLevel,
} from '../types/handwriting';

export interface HandwritingFontOption {
  id: string;
  name: string;
  category: string;
  className: string;
  canvasFontFamily: string;
}

export const HANDWRITING_FONTS: HandwritingFontOption[] = [
  { id: 'Courgette', name: 'Cursive scolaire (Attachée)', category: 'Cursive', className: 'font-courgette', canvasFontFamily: "'Courgette', cursive, sans-serif" },
  { id: 'Patrick Hand', name: 'Script (Lettres détachées)', category: 'Script', className: 'font-patrick', canvasFontFamily: "'Patrick Hand', cursive, sans-serif" },
  { id: 'Caveat', name: 'Manuscrite naturelle (Fluide)', category: 'Manuscrite', className: 'font-caveat', canvasFontFamily: "'Caveat', cursive, sans-serif" },
  { id: 'Kalam', name: 'Cursive simplifiée (Débutants)', category: 'Cursive', className: 'font-kalam', canvasFontFamily: "'Kalam', cursive, sans-serif" },
  { id: 'Schoolbell', name: 'Schoolbell (Enfantine)', category: 'Enfantine', className: 'font-schoolbell', canvasFontFamily: "'Schoolbell', cursive, sans-serif" },
  { id: 'Marck Script', name: 'Marck Script (Calligraphique)', category: 'Calligraphique', className: 'font-marck', canvasFontFamily: "'Marck Script', cursive, sans-serif" },
  { id: 'Mali', name: 'Mali (Arrondie)', category: 'Arrondie', className: 'font-mali', canvasFontFamily: "'Mali', cursive, sans-serif" },
  { id: 'Comic Neue', name: 'Comic Neue (Bâton)', category: 'Bâton', className: 'font-comic', canvasFontFamily: "'Comic Neue', cursive, sans-serif" },
];

export function resolveHandwritingFontClass(fontFamily?: string, language?: string): string {
  if (language === 'ar') return 'font-amiri font-arabic';
  const found = HANDWRITING_FONTS.find((f) => f.id === fontFamily);
  return found ? found.className : 'font-courgette';
}

export function resolveHandwritingCanvasFont(fontFamily?: string, language?: string): string {
  if (language === 'ar') return "'Amiri', 'Cairo', serif";
  const found = HANDWRITING_FONTS.find((f) => f.id === fontFamily);
  return found ? found.canvasFontFamily : "'Courgette', cursive, sans-serif";
}

export function applyTextCase(text: string, letterCase?: string): string {
  if (!text) return '';
  if (letterCase === 'lowercase') return text.toLowerCase();
  if (letterCase === 'uppercase') return text.toUpperCase();
  return text;
}

export function resolveStrokeColor(strokeColor?: string, fallback: string = '#1d4ed8'): string {
  if (strokeColor === 'blue') return '#1d4ed8';
  if (strokeColor === 'black') return '#0f172a';
  if (strokeColor === 'pencil_gray') return '#64748b';
  return fallback;
}

export const GRADE_TYPOGRAPHY_PRESETS: Record<SchoolGradeLevel, GradeTypographyPreset> = {
  maternelle_ps_ms: {
    id: 'maternelle_ps_ms',
    label: 'Maternelle (PS / MS)',
    labelAr: 'الروضة (صغار / أواسط)',
    idealFontSizePx: 38,
    minFontSizePx: 28,
    maxFontSizePx: 48,
    defaultRuling: 'double_line',
    defaultRulingScale: 1.35,
    minRowHeightPx: 54,
  },
  maternelle_gs: {
    id: 'maternelle_gs',
    label: 'Maternelle (GS)',
    labelAr: 'التمهيدي (القسم الكبير)',
    idealFontSizePx: 34,
    minFontSizePx: 24,
    maxFontSizePx: 44,
    defaultRuling: 'beginner_color',
    defaultRulingScale: 1.25,
    minRowHeightPx: 48,
  },
  cp: {
    id: 'cp',
    label: 'CP (Cours Préparatoire)',
    labelAr: 'السنة الأولى ابتدائي (CP)',
    idealFontSizePx: 28,
    minFontSizePx: 20,
    maxFontSizePx: 38,
    defaultRuling: 'seyes',
    defaultRulingScale: 1.15,
    minRowHeightPx: 44,
  },
  ce1: {
    id: 'ce1',
    label: 'CE1',
    labelAr: 'السنة الثانية ابتدائي (CE1)',
    idealFontSizePx: 24,
    minFontSizePx: 18,
    maxFontSizePx: 34,
    defaultRuling: 'seyes',
    defaultRulingScale: 1.0,
    minRowHeightPx: 40,
  },
  ce2: {
    id: 'ce2',
    label: 'CE2',
    labelAr: 'السنة الثالثة ابتدائي (CE2)',
    idealFontSizePx: 21,
    minFontSizePx: 16,
    maxFontSizePx: 30,
    defaultRuling: 'seyes',
    defaultRulingScale: 1.0,
    minRowHeightPx: 36,
  },
  cm1_cm2: {
    id: 'cm1_cm2',
    label: 'CM1 / CM2',
    labelAr: 'السنة الرابعة والخامسة (CM1/CM2)',
    idealFontSizePx: 18,
    minFontSizePx: 14,
    maxFontSizePx: 26,
    defaultRuling: 'seyes',
    defaultRulingScale: 0.85,
    minRowHeightPx: 32,
  },
};

export const FOUR_STYLE_GRADIENT: RepetitionGradientStyle[] = [
  'solid',      // 1. Couleur pleine (modèle)
  'dotted',     // 2. Pointillé
  'light_gray', // 3. Gris clair estompé
  'blank',      // 4. Vide (écriture libre sur la ligne)
];

let offscreenCanvas: HTMLCanvasElement | null = null;

/**
 * Mesure la largeur réelle (en px) d'un texte rendu à la police et taille actuelles.
 */
export function measureRenderedTextWidthPx(
  text: string,
  fontSizePx: number,
  fontFamily: string,
  language: HandwritingLanguage,
  letterSpacingPx: number = 0
): number {
  const cleanText = text.trim();
  if (!cleanText) return fontSizePx * 1.5;

  if (typeof document !== 'undefined') {
    if (!offscreenCanvas) {
      offscreenCanvas = document.createElement('canvas');
    }
    const ctx = offscreenCanvas.getContext('2d');
    if (ctx) {
      const resolvedFont = resolveHandwritingCanvasFont(fontFamily, language);
      ctx.font = `600 ${fontSizePx}px ${resolvedFont}`;
      const metrics = ctx.measureText(cleanText);
      // En latin, calcul de l'espacement entre lettres
      const extraLetterSpacingPx =
        language === 'ar'
          ? 0
          : Math.max(0, cleanText.length - 1) * (letterSpacingPx > 0 ? letterSpacingPx : fontSizePx * 0.08);
      return Math.ceil(metrics.width + extraLetterSpacingPx);
    }
  }

  // Fallback analytique si pas de DOM
  const avgFactor = language === 'ar' ? 0.55 : 0.68;
  return Math.ceil(cleanText.length * fontSizePx * avgFactor);
}

/**
 * Réduit progressivement la police de la taille idéale vers la taille minimale
 * jusqu'à ce que le texte tienne sur la largeur utile (avec au moins 1 répétition + marge).
 */
export function computeAutoFontSizePx(
  text: string,
  gradeLevel: SchoolGradeLevel,
  manualFontSizePx: number | null,
  usableWidthPx: number,
  minGapPx: number,
  fontFamily: string,
  language: HandwritingLanguage
): {
  effectiveFontSizePx: number;
  fitsAtMinFontSize: boolean;
  measuredWidthPx: number;
} {
  const preset = GRADE_TYPOGRAPHY_PRESETS[gradeLevel] || GRADE_TYPOGRAPHY_PRESETS.cp;

  if (manualFontSizePx !== null && manualFontSizePx > 0) {
    const width = measureRenderedTextWidthPx(text, manualFontSizePx, fontFamily, language);
    return {
      effectiveFontSizePx: manualFontSizePx,
      fitsAtMinFontSize: width + minGapPx <= usableWidthPx,
      measuredWidthPx: width,
    };
  }

  // Si le texte est court (ex: prénom), on privilégie qu'il tienne au moins 2 à 4 fois si possible,
  // sinon au minimum 1 fois dans la largeur utile sans descendre sous minFontSizePx.
  let currentSize = preset.idealFontSizePx;
  const minSize = preset.minFontSizePx;

  while (currentSize > minSize) {
    const w = measureRenderedTextWidthPx(text, currentSize, fontFamily, language);
    if (w + minGapPx <= usableWidthPx) {
      return {
        effectiveFontSizePx: currentSize,
        fitsAtMinFontSize: true,
        measuredWidthPx: w,
      };
    }
    currentSize -= 1;
  }

  const minWidth = measureRenderedTextWidthPx(text, minSize, fontFamily, language);
  return {
    effectiveFontSizePx: minSize,
    fitsAtMinFontSize: minWidth + minGapPx <= usableWidthPx,
    measuredWidthPx: minWidth,
  };
}

/**
 * Découpe un texte trop long en plusieurs segments uniquement entre les mots entiers
 * (aucun mot n'est jamais coupé en deux).
 */
export function splitTextIntoWordBoundarySegments(
  rawText: string,
  fontSizePx: number,
  usableWidthPx: number,
  minGapPx: number,
  fontFamily: string,
  language: HandwritingLanguage,
  letterSpacingPx: number = 0
): EditableTextSegment[] {
  // Respecter les retours à la ligne saisis par l'utilisateur
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalized.split('\n');

  const maxLineTextWidth = Math.max(80, usableWidthPx - minGapPx);
  const segments: EditableTextSegment[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Ligne vide explicitement sautée par l'utilisateur
      segments.push({
        id: `seg-${segments.length}`,
        text: '',
      });
      continue;
    }

    const fullWidth = measureRenderedTextWidthPx(
      trimmed,
      fontSizePx,
      fontFamily,
      language,
      letterSpacingPx
    );

    if (fullWidth <= maxLineTextWidth) {
      segments.push({
        id: `seg-${segments.length}`,
        text: trimmed,
      });
      continue;
    }

    // Si la ligne dépasse la largeur utile, découpage par mots entiers
    const words = trimmed.split(/\s+/);
    let currentWords: string[] = [];

    for (const word of words) {
      if (currentWords.length === 0) {
        currentWords.push(word);
        continue;
      }

      const candidateLine = [...currentWords, word].join(' ');
      const candidateWidth = measureRenderedTextWidthPx(
        candidateLine,
        fontSizePx,
        fontFamily,
        language,
        letterSpacingPx
      );

      if (candidateWidth <= maxLineTextWidth) {
        currentWords.push(word);
      } else {
        segments.push({
          id: `seg-${segments.length}`,
          text: currentWords.join(' '),
        });
        currentWords = [word];
      }
    }

    if (currentWords.length > 0) {
      segments.push({
        id: `seg-${segments.length}`,
        text: currentWords.join(' '),
      });
    }
  }

  if (segments.length === 0) {
    return [{ id: 'seg-0', text: '' }];
  }

  return segments;
}

/**
 * Calcule le nombre de répétitions sur une rangée selon la formule :
 * répétitions = floor(largeur utile de la page ÷ (largeur réelle du texte rendu + espacement minimum fixe))
 */
export function computeRepetitionsCount(
  usableWidthPx: number,
  measuredTextWidthPx: number,
  minGapPx: number
): number {
  if (usableWidthPx <= 0 || measuredTextWidthPx <= 0) return 1;
  const unitWidth = measuredTextWidthPx + Math.max(8, minGapPx);
  const count = Math.floor(usableWidthPx / unitWidth);
  return Math.max(1, Math.min(10, count));
}

/**
 * Construit les cellules de répétition d'une rangée tracée avec le dégradé des 4 styles :
 * couleur pleine (solid) -> pointillé (dotted) -> gris clair estompé (light_gray) -> vide (blank).
 * Si la phrase est longue et ne tient qu'une fois par rangée (repetitionsCount === 1),
 * le dégradé des styles progresse d'une rangée tracée à la suivante au sein du motif.
 */
export function buildRowRepetitions(
  text: string,
  repetitionsCount: number,
  indexInTracedBlock: number,
  tracedRowsInPattern: number,
  useFourStyleGradient: boolean
): RepetitionCell[] {
  if (!useFourStyleGradient) {
    return Array.from({ length: repetitionsCount }).map((_, idx) => ({
      index: idx,
      text,
      style: idx === 0 ? 'solid' : 'dotted',
    }));
  }

  // Cas 1 : Le texte se répète plusieurs fois sur la même rangée (ex: prénom ou mot court)
  // On applique le dégradé des 4 styles directement sur les répétitions de la rangée :
  // 1: couleur pleine -> 2: pointillé -> 3: gris clair estompé -> 4+: vide
  if (repetitionsCount >= 4) {
    return Array.from({ length: repetitionsCount }).map((_, idx) => {
      let style: RepetitionGradientStyle = 'blank';
      if (idx === 0) style = 'solid';
      else if (idx === 1) style = 'dotted';
      else if (idx === 2) style = 'light_gray';
      else style = 'blank';
      return { index: idx, text, style };
    });
  }

  if (repetitionsCount === 3) {
    const styles: RepetitionGradientStyle[] = ['solid', 'dotted', 'light_gray'];
    return styles.map((style, idx) => ({ index: idx, text, style }));
  }

  if (repetitionsCount === 2) {
    // Progression combinée horizontale + verticale
    const firstStyle: RepetitionGradientStyle = indexInTracedBlock === 0 ? 'solid' : 'dotted';
    const secondStyle: RepetitionGradientStyle =
      indexInTracedBlock === 0 ? 'dotted' : indexInTracedBlock === 1 ? 'light_gray' : 'blank';
    return [
      { index: 0, text, style: firstStyle },
      { index: 1, text, style: secondStyle },
    ];
  }

  // Cas 2 : repetitionsCount === 1 (phrase longue occupant toute la largeur de la rangée)
  // Le dégradé s'applique sur les rangées tracées successives du motif
  let rowStyle: RepetitionGradientStyle = 'solid';
  if (tracedRowsInPattern >= 3) {
    if (indexInTracedBlock === 0) rowStyle = 'solid';
    else if (indexInTracedBlock === 1) rowStyle = 'dotted';
    else rowStyle = 'light_gray';
  } else if (tracedRowsInPattern === 2) {
    rowStyle = indexInTracedBlock === 0 ? 'solid' : 'dotted';
  }

  return [{ index: 0, text, style: rowStyle }];
}

export interface PageLayoutComputationResult {
  paperFormat: 'A4' | 'Letter' | 'A5';
  paperWidthPx: number;
  paperHeightPx: number;
  paddingXPx: number;
  paddingYPx: number;
  headerHeightPx: number;
  headerBottomMarginPx: number;
  usableWidthPx: number;
  usableHeightPx: number;
  renderedContentHeightPx: number;
  effectiveFontSizePx: number;
  fitsSingleLineAtMinFont: boolean;
  patternSize: number;
  completePatternsCount: number;
  totalRowsOnPage: number;
  maxTracedSlotsOnPage: number;
  exactRowHeightPx: number;
  rows: ComputedHandwritingRow[];
  activeSegments: EditableTextSegment[];
  overflowSegments: EditableTextSegment[];
  hasOverflowForNextPage: boolean;
}

/**
 * Calcule l'intégralité de la mise en page d'une page (A4 ou A5) :
 * - En-tête mesuré réellement (ou hauteur fixe de repli) contenu dans sa zone
 * - Hauteur disponible = hauteur totale de la page - marges haut/bas - hauteur réelle de l'en-tête
 * - Taille de police automatique selon le niveau de classe
 * - Découpage en mots entiers si texte trop long
 * - Nombre de répétitions par rangée
 * - Alternance rangées tracées / rangées libres : seules les rangées qui rentrent
 *   entièrement dans la hauteur disponible sont ajoutées (aucune rangée tronquée en bas de page)
 */
export function computeHandwritingPageLayout(params: {
  paperFormat: 'A4' | 'Letter' | 'A5';
  paperWidthPx: number;
  paperHeightPx: number;
  showHeader: boolean;
  measuredHeaderHeightPx?: number;
  gradeLevel: SchoolGradeLevel;
  manualFontSizePx: number | null;
  minRepetitionGapPx: number;
  fontFamily: string;
  language: HandwritingLanguage;
  rawText: string;
  customSegments?: EditableTextSegment[];
  alternationPattern: AlternationPatternConfig;
  useFourStyleRowGradient: boolean;
  rulingType: string;
  rulingScale: number;
  letterSpacingPx?: number;
  lineSpacingMultiplier?: number;
}): PageLayoutComputationResult {
  const {
    paperFormat,
    paperWidthPx,
    paperHeightPx,
    showHeader,
    measuredHeaderHeightPx,
    gradeLevel,
    manualFontSizePx,
    minRepetitionGapPx,
    fontFamily,
    language,
    rawText,
    customSegments,
    alternationPattern,
    useFourStyleRowGradient,
    rulingType,
    rulingScale,
    letterSpacingPx = 0,
    lineSpacingMultiplier = 1.0,
  } = params;

  const isA5 = paperFormat === 'A5';
  const paddingXPx = isA5 ? 20 : 28;
  const paddingYPx = isA5 ? 18 : 24;

  // Marge Seyès si le lignage Seyès est actif (marge rouge à 42px * scale)
  const seyesMarginOffsetPx = rulingType === 'seyes' ? Math.round(42 * rulingScale) : 0;

  // 1. Hauteur réelle de l'en-tête (mesurée après rendu DOM, ou valeur par défaut sécurisée)
  const fallbackHeaderHeightPx = isA5 ? 58 : 72;
  const headerHeightPx = showHeader
    ? measuredHeaderHeightPx && measuredHeaderHeightPx > 0
      ? Math.ceil(measuredHeaderHeightPx)
      : fallbackHeaderHeightPx
    : 0;
  const headerBottomMarginPx = showHeader ? (isA5 ? 10 : 14) : 0;

  // 2. Hauteur disponible pour le contenu = hauteur totale de la page - marges haut/bas - hauteur réelle de l'en-tête
  const usableWidthPx = Math.max(120, paperWidthPx - paddingXPx * 2 - seyesMarginOffsetPx);
  const usableHeightPx = Math.max(
    120,
    Math.floor(paperHeightPx - paddingYPx * 2 - headerHeightPx - headerBottomMarginPx)
  );

  // Marge de sécurité de 2px en bas pour que l'épaisseur du trait de réglure final ne soit jamais coupée
  const safeContentHeightPx = Math.max(80, usableHeightPx - 2);

  // 3. Calcul automatique de la taille de police (de l'idéale vers le minimum du niveau)
  const autoFont = computeAutoFontSizePx(
    rawText,
    gradeLevel,
    manualFontSizePx,
    usableWidthPx,
    minRepetitionGapPx,
    fontFamily,
    language
  );

  const effectiveFontSizePx = autoFont.effectiveFontSizePx;

  // 4. Découpage en segments (mots entiers) ou utilisation des segments édités par l'enseignant
  const allSegments =
    customSegments && customSegments.length > 0
      ? customSegments
      : splitTextIntoWordBoundarySegments(
          rawText,
          effectiveFontSizePx,
          usableWidthPx,
          minRepetitionGapPx,
          fontFamily,
          language,
          letterSpacingPx
        );

  // 5. Calcul du motif d'alternance (ex: 3 rangées tracées + 1 rangée libre = 4 rangées par motif)
  const tracedCount = Math.max(1, alternationPattern.tracedRowsCount);
  const freeCount = Math.max(0, alternationPattern.freeRowsCount);
  const patternSize = tracedCount + freeCount;

  const preset = GRADE_TYPOGRAPHY_PRESETS[gradeLevel] || GRADE_TYPOGRAPHY_PRESETS.cp;
  const baseTargetMinRowHeightPx = Math.max(
    isA5 ? Math.round(preset.minRowHeightPx * 0.88) : preset.minRowHeightPx,
    Math.round(effectiveFontSizePx * 1.6)
  );
  const targetMinRowHeightPx = Math.max(24, Math.round(baseTargetMinRowHeightPx * lineSpacingMultiplier));

  // Nombre entier de rangées complètes pouvant rentrer dans la hauteur disponible sans jamais être tronquées
  const maxFittingRows = Math.max(1, Math.floor(safeContentHeightPx / targetMinRowHeightPx));

  // On conserve un nombre entier de motifs complets qui rentrent intégralement dans la hauteur disponible
  const completePatternsCount = Math.max(1, Math.floor(maxFittingRows / patternSize));
  const candidateTotalRows = completePatternsCount * patternSize;
  const totalRowsOnPage =
    candidateTotalRows <= maxFittingRows ? candidateTotalRows : maxFittingRows;

  // Hauteur entière d'une rangée : choisie avec Math.floor pour que (totalRowsOnPage * exactRowHeightPx) <= safeContentHeightPx
  const exactRowHeightPx = Math.max(
    targetMinRowHeightPx,
    Math.floor(safeContentHeightPx / totalRowsOnPage)
  );

  // 6. Génération des rangées : on n'ajoute une rangée QUE si elle rentre entièrement dans safeContentHeightPx
  const rows: ComputedHandwritingRow[] = [];
  let tracedRowGlobalCounter = 0;

  for (let pIdx = 0; pIdx < completePatternsCount; pIdx++) {
    for (let inPatIdx = 0; inPatIdx < patternSize; inPatIdx++) {
      // Vérification stricte : si la rangée suivante dépasse la hauteur disponible, on l'exclut pour éviter toute troncature
      if ((rows.length + 1) * exactRowHeightPx > safeContentHeightPx) {
        break;
      }

      const globalRowIdx = rows.length;
      const isTraced = inPatIdx < tracedCount;

      if (!isTraced) {
        // Rangée libre : affiche uniquement la réglure du cahier, sans aucun modèle
        rows.push({
          rowId: `row-${globalRowIdx}-free`,
          rowIndex: globalRowIdx,
          patternIndex: pIdx,
          indexInPattern: inPatIdx,
          type: 'free',
          text: '',
          fontSizePx: effectiveFontSizePx,
          measuredTextWidthPx: 0,
          repetitionsCount: 0,
          repetitions: [],
          rowHeightPx: exactRowHeightPx,
        });
      } else {
        const segIndex =
          allSegments.length > 0 ? tracedRowGlobalCounter % allSegments.length : 0;
        const segment = allSegments[segIndex] || { id: 'seg-0', text: rawText };
        const segText = segment.text || '';

        const measuredWidthPx = measureRenderedTextWidthPx(
          segText,
          effectiveFontSizePx,
          fontFamily,
          language,
          letterSpacingPx
        );

        const repetitionsCount = computeRepetitionsCount(
          usableWidthPx,
          measuredWidthPx,
          minRepetitionGapPx
        );

        const repetitions = buildRowRepetitions(
          segText,
          repetitionsCount,
          inPatIdx,
          tracedCount,
          useFourStyleRowGradient
        );

        rows.push({
          rowId: `row-${globalRowIdx}-traced`,
          rowIndex: globalRowIdx,
          patternIndex: pIdx,
          indexInPattern: inPatIdx,
          type: 'traced',
          segmentId: segment.id,
          text: segText,
          fontSizePx: effectiveFontSizePx,
          measuredTextWidthPx: measuredWidthPx,
          repetitionsCount,
          repetitions,
          rowHeightPx: exactRowHeightPx,
        });

        tracedRowGlobalCounter++;
      }
    }
  }

  const actualTotalRowsOnPage = rows.length;
  const maxTracedSlotsOnPage = rows.filter((r) => r.type === 'traced').length;
  const renderedContentHeightPx = actualTotalRowsOnPage * exactRowHeightPx;

  // Gestion du dépassement (si des rangées/segments n'ont pas pu rentrer sur la page actuelle)
  const activeSegments = allSegments.slice(0, Math.max(1, maxTracedSlotsOnPage));
  const overflowSegments = allSegments.slice(Math.max(1, maxTracedSlotsOnPage));
  const hasOverflowForNextPage = overflowSegments.length > 0;

  return {
    paperFormat,
    paperWidthPx,
    paperHeightPx,
    paddingXPx,
    paddingYPx,
    headerHeightPx,
    headerBottomMarginPx,
    usableWidthPx,
    usableHeightPx,
    renderedContentHeightPx,
    effectiveFontSizePx,
    fitsSingleLineAtMinFont: autoFont.fitsAtMinFontSize,
    patternSize,
    completePatternsCount,
    totalRowsOnPage: actualTotalRowsOnPage,
    maxTracedSlotsOnPage,
    exactRowHeightPx,
    rows,
    activeSegments,
    overflowSegments,
    hasOverflowForNextPage,
  };
}
