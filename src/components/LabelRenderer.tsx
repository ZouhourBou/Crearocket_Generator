import React, { useRef, useState, useLayoutEffect } from 'react';
import { GeneratorType, StudentInfo, Language, LabelLanguage, SchoolLabelType, FieldFontSizes } from '../types';
import { getEffectiveTheme } from '../constants/themes';
import { ThemeVectorIllustration } from './ThemeIllustrations';
import { ThemeBordersAndDecor } from './ThemeBordersAndDecor';
import { SchoolSubjectDecor } from './SchoolSubjectDecor';
import { computeTextFit } from '../utils/textFitEngine';

interface LabelRendererProps {
  type: GeneratorType;
  schoolLabelType?: SchoolLabelType;
  widthMm: number;
  heightMm: number;
  themeId?: string;
  paletteId?: string;
  illustrationId?: string;
  studentPhotoUrl?: string;
  schoolSubjectDecor?: string;
  duplicateIconRight?: boolean;
  centerText?: boolean;
  borderRadius?: number;
  iconSize?: number;
  fieldFontSizes?: FieldFontSizes;
  info: StudentInfo;
  language: Language;
  labelLanguage?: LabelLanguage;
  index?: number;
  className?: string;
}

export const LabelRenderer: React.FC<LabelRendererProps> = ({
  type,
  schoolLabelType,
  widthMm,
  heightMm,
  themeId,
  paletteId,
  illustrationId,
  studentPhotoUrl,
  schoolSubjectDecor,
  duplicateIconRight,
  centerText,
  borderRadius = 8,
  iconSize,
  fieldFontSizes,
  info,
  language,
  labelLanguage,
  index = 0,
  className = '',
}) => {
  // Seamlessly resolve the effective theme combining independent palette + illustration
  const theme = getEffectiveTheme(paletteId || themeId, illustrationId || themeId);
  const activeIllustrationId = illustrationId || theme.illustrationType || themeId || 'cute';

  const isArabic = (labelLanguage ? labelLanguage === 'ar' : language === 'ar');
  const isCompact = heightMm <= 25;
  const isSlim = heightMm <= 14;
  const isUltraCompact = heightMm <= 8;

  // Determine effective label type: supplies vs notebook vs books
  const effectiveLabelType = schoolLabelType || (type === 'supplies' ? 'supplies' : 'books');

  // Run the dynamic 4-Field Fit-Text and Geometry Engine
  const fit = computeTextFit(
    widthMm,
    heightMm,
    info,
    language,
    activeIllustrationId,
    effectiveLabelType,
    iconSize,
    fieldFontSizes,
    duplicateIconRight
  );

  // Convert mm to SVG viewBox coordinates (1mm = 4 px viewBox scale)
  const viewBoxW = widthMm * 4;
  const viewBoxH = heightMm * 4;
  const hasIcon = fit.geometry.illustrationWidthPx > 0;

  // DOM Measurement & Dynamic Auto-fit with ResizeObserver (Rule 5)
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const line4Ref = useRef<HTMLDivElement>(null);

  const isSuppliesOver6mm = effectiveLabelType === 'supplies' && heightMm > 6;
  const isBooksLabel = effectiveLabelType !== 'supplies';

  const [lineScales, setLineScales] = useState<number[]>([1, 1, 1, 1]);
  const lineScalesRef = useRef<number[]>(lineScales);
  lineScalesRef.current = lineScales;

  useLayoutEffect(() => {
    const adjustScale = () => {
      if (effectiveLabelType === 'supplies' || effectiveLabelType === 'books' || effectiveLabelType === 'school_books' || effectiveLabelType === 'notebook') {
        if (lineScalesRef.current.some((s) => s !== 1)) {
          setLineScales([1, 1, 1, 1]);
        }
        return;
      }

      const availW = ((isSuppliesOver6mm || isBooksLabel) && textContainerRef.current)
        ? Math.max(textContainerRef.current.clientWidth, fit.geometry.availableWidthPx)
        : fit.geometry.availableWidthPx;
      if (availW <= 0) return;

      const refs = [line1Ref, line2Ref, line3Ref, line4Ref];
      const nextLineScales = [1, 1, 1, 1];
      let changed = false;
      const minAllowedRatio = 0.45;

      refs.forEach((ref, idx) => {
        if (ref.current) {
          const currentScale = lineScalesRef.current[idx] ?? 1;
          const sw = ref.current.scrollWidth;
          const unscaledSw = currentScale > 0 ? (sw / currentScale) : sw;
          if (unscaledSw > availW + 0.5) {
            const r = Math.max(minAllowedRatio, Math.min(1, Math.floor((availW / unscaledSw) * 100) / 100));
            nextLineScales[idx] = r;
          } else {
            nextLineScales[idx] = 1;
          }
        }
        if (Math.abs((lineScalesRef.current[idx] ?? 1) - nextLineScales[idx]) > 0.02) {
          changed = true;
        }
      });
      if (changed) {
        setLineScales(nextLineScales);
      }
    };

    adjustScale();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        adjustScale();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, [
    fit.geometry.availableWidthPx,
    fit.nameText,
    fit.gradeText,
    fit.schoolText,
    fit.subjectText,
    fit.nameFontSizePx,
    fit.gradeFontSizePx,
    widthMm,
    heightMm,
    effectiveLabelType,
  ]);

  // Dynamically auto-fitted font sizes (indépendants pour chaque champ)
  const isDirectFontSize = effectiveLabelType === 'supplies' || effectiveLabelType === 'books' || effectiveLabelType === 'school_books' || effectiveLabelType === 'notebook';
  const effectiveNameSize = isDirectFontSize ? fit.nameFontSizePx : Math.round(fit.nameFontSizePx * (lineScales[0] ?? 1) * 10) / 10;
  const effectiveGradeSize = isDirectFontSize ? fit.gradeFontSizePx : Math.round(fit.gradeFontSizePx * (lineScales[1] ?? 1) * 10) / 10;
  const effectiveSchoolSize = isDirectFontSize ? fit.schoolFontSizePx : Math.round(fit.schoolFontSizePx * (lineScales[2] ?? 1) * 10) / 10;
  const effectiveSubjectSize = isDirectFontSize ? fit.subjectFontSizePx : Math.round(fit.subjectFontSizePx * (lineScales[3] ?? 1) * 10) / 10;

  // Calcul dynamique vertical : hauteur disponible, line-height proportionnel et espacement inter-lignes
  const linesCount = fit.activeLines.length;
  const availHeightPx = fit.geometry.availableHeightPx;

  const { lineHeightMultiplier, effectiveGapPx } = React.useMemo(() => {
    if (linesCount <= 0) {
      return { lineHeightMultiplier: 1.25, effectiveGapPx: 0 };
    }

    // Récupérer les tailles réelles de chaque ligne active
    const lineEffectiveSizes = fit.activeLines.map((line, idx) => {
      const isCustomized = fieldFontSizes?.[line.key as keyof FieldFontSizes] !== undefined;
      const currentScale = (isCustomized || isDirectFontSize) ? 1 : (lineScales[idx] ?? 1);
      return (isCustomized || isDirectFontSize) ? line.fontSizePx : Math.round(line.fontSizePx * currentScale * 10) / 10;
    });

    if (linesCount === 1) {
      // 1 seule ligne (ex: « أمين بن علي » ou « Amine Ben Ali ») :
      // Line-height proportionnel identique pour l'arabe et le français
      const targetSize = lineEffectiveSizes[0] || 10;
      const ratio = targetSize > 0 ? availHeightPx / targetSize : 1.25;
      const idealMultiplier = 1.25;
      const clampedMultiplier = Math.max(1.15, Math.min(idealMultiplier, Math.max(1.15, ratio)));
      return { lineHeightMultiplier: clampedMultiplier, effectiveGapPx: 0 };
    }

    // Plusieurs lignes (ex: nom + classe) :
    const sumFontSizes = lineEffectiveSizes.reduce((sum, s) => sum + s, 0);

    if (effectiveLabelType === 'supplies') {
      // Fournitures : logique conservée
      const baseInterLineGap = Math.max(0.6, (fit.interLineGapPx || 1.8) * 0.6);
      const nominalGaps = (linesCount - 1) * baseInterLineGap;
      const spaceForLines = Math.max(0, availHeightPx - nominalGaps);
      const availableMultiplier = sumFontSizes > 0 ? spaceForLines / sumFontSizes : 1.15;

      const mult = Math.max(1.10, Math.min(1.16, availableMultiplier));
      const totalLinesH = sumFontSizes * mult;
      const remainingForGaps = Math.max(0, availHeightPx - totalLinesH);
      const gap = Math.max(0.6, Math.min(baseInterLineGap, remainingForGaps / (linesCount - 1)));

      return { lineHeightMultiplier: mult, effectiveGapPx: Math.round(gap * 10) / 10 };
    }

    // Cahier / Livre (Français et Arabe) :
    // - Garder le line-height actuel sans modification
    // - Ajouter un très léger espacement vertical supplémentaire entre les champs (différence subtile mais visible)
    const baseInterLineGap = Math.max(1.8, Math.min(3.2, (fit.interLineGapPx || 2.4)));
    const nominalGaps = (linesCount - 1) * baseInterLineGap;
    const spaceForLines = Math.max(0, availHeightPx - nominalGaps);
    const availableMultiplier = sumFontSizes > 0 ? spaceForLines / sumFontSizes : 1.15;

    const mult = Math.max(1.10, Math.min(1.16, availableMultiplier));
    const totalLinesH = sumFontSizes * mult;
    const remainingForGaps = Math.max(0, availHeightPx - totalLinesH);
    const gap = Math.max(1.8, Math.min(3.0, remainingForGaps > 0 ? remainingForGaps / (linesCount - 1) * 0.45 : baseInterLineGap));

    return { lineHeightMultiplier: mult, effectiveGapPx: Math.round(gap * 10) / 10 };
  }, [linesCount, availHeightPx, fit.activeLines, fit.interLineGapPx, fieldFontSizes, effectiveLabelType, lineScales]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden transition-all duration-150 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.bgColor,
        border: `${isUltraCompact ? '1px' : '1.5px'} solid ${theme.borderColor}`,
        borderRadius: `${borderRadius}px`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Layer: Unique Theme Border & Subtle Vector Decorations */}
      <svg
        viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
        className="w-full h-full block pointer-events-none absolute inset-0"
        preserveAspectRatio="none"
      >
        <ThemeBordersAndDecor
          theme={theme}
          w={viewBoxW}
          h={viewBoxH}
          isArabic={isArabic}
          isCompact={isCompact}
        />
      </svg>

      {/* Centrage Total: Global Flexbox container centering vertically */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-start pointer-events-none"
        dir="ltr"
        style={{
          paddingLeft: isArabic ? `${fit.geometry.paddingRightPx}px` : `${fit.geometry.paddingLeftPx}px`,
          paddingRight: isArabic ? `${fit.geometry.paddingLeftPx}px` : `${fit.geometry.paddingRightPx}px`,
          paddingTop: `${fit.geometry.paddingTopPx}px`,
          paddingBottom: `${fit.geometry.paddingBottomPx}px`,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          className={`flex items-center justify-start w-full h-full ${
            isSuppliesOver6mm || isBooksLabel ? 'min-w-0' : ''
          }`}
          style={{
            gap: `${fit.geometry.gapPx}px`,
            flexDirection: isArabic ? 'row-reverse' : 'row',
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {/* 1. ICÔNE FIXE (À GAUCHE en LTR, À DROITE en RTL) */}
          {hasIcon && (
            <div
              className="shrink-0 flex items-center justify-center self-center select-none"
              style={{
                width: `${fit.geometry.illustrationWidthPx}px`,
                height: `${fit.geometry.illustrationHeightPx}px`,
                flex: '0 0 auto',
              }}
            >
              <ThemeVectorIllustration
                themeId={activeIllustrationId}
                className="w-full h-full object-contain filter drop-shadow-2xs"
              />
            </div>
          )}

          {/* 2. BLOC TEXTE (À DROITE en LTR, À GAUCHE en RTL miroir) */}
          <div
            ref={textContainerRef}
            dir={isArabic ? 'rtl' : 'ltr'}
            className={`flex-1 min-w-0 flex flex-col justify-center h-full ${
              centerText
                ? 'items-center text-center'
                : isArabic
                ? 'items-end text-right'
                : 'items-start text-left'
            } ${isSuppliesOver6mm || isBooksLabel ? 'w-full max-w-none' : ''}`}
            style={{
              maxWidth: (isSuppliesOver6mm || isBooksLabel) ? 'none' : `${fit.geometry.availableWidthPx}px`,
              gap: `${effectiveGapPx}px`,
              flex: (isSuppliesOver6mm || isBooksLabel) ? '1 1 auto' : undefined,
              width: (isSuppliesOver6mm || isBooksLabel) ? '100%' : undefined,
              height: '100%',
              maxHeight: '100%',
              minHeight: 0,
              alignSelf: 'stretch',
              minWidth: 0,
              direction: isArabic ? 'rtl' : 'ltr',
              textAlign: centerText ? 'center' : isArabic ? 'right' : 'left',
              overflow: 'visible',
            }}
          >
            {!fit.hasAnyText ? (
              <div
                className="w-full h-full flex flex-col justify-evenly pointer-events-none select-none overflow-hidden"
                style={{
                  paddingTop: '2px',
                  paddingBottom: '2px',
                }}
              >
                {Array.from({ length: Math.min(3, Math.max(1, fit.limits?.maxLines || 2)) }).map((_, idx) => (
                  <div
                    key={`empty-writing-line-${idx}`}
                    className="w-full flex items-center py-0.5"
                  >
                    <div
                      className="w-full border-b-[1.5px] border-dotted"
                      style={{
                        borderColor: theme.textColor,
                        opacity: 0.38,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              fit.activeLines.map((line, idx) => {
                const isFirst = idx === 0;
                const isCustomized = fieldFontSizes?.[line.key as keyof FieldFontSizes] !== undefined;
                const currentScale = (isCustomized || isDirectFontSize) ? 1 : (lineScales[idx] ?? 1);
                const scaledSize = (isCustomized || isDirectFontSize) ? line.fontSizePx : Math.round(line.fontSizePx * currentScale * 10) / 10;
                const lineRef = idx === 0 ? line1Ref : idx === 1 ? line2Ref : idx === 2 ? line3Ref : line4Ref;
                return (
                  <div
                    key={`${line.key}-${idx}`}
                    ref={lineRef}
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className={`w-full min-w-0 whitespace-nowrap transition-colors overflow-visible ${
                      centerText
                        ? 'text-center'
                        : isArabic
                        ? 'text-right'
                        : 'text-left tracking-tight'
                    } ${
                      isArabic
                        ? isFirst
                          ? 'font-arabic font-extrabold'
                          : line.key === 'grade'
                          ? 'font-arabic font-bold'
                          : 'font-bold'
                        : isFirst
                        ? 'font-label-name font-extrabold'
                        : line.key === 'grade'
                        ? 'font-label-name font-bold'
                        : 'font-medium'
                    }`}
                    style={{
                      fontSize: `${scaledSize}px`,
                      lineHeight: lineHeightMultiplier,
                      paddingBottom: '1px',
                      overflow: 'visible',
                      width: '100%',
                      minWidth: 0,
                      direction: isArabic ? 'rtl' : 'ltr',
                      textAlign: centerText ? 'center' : isArabic ? 'right' : 'left',
                      fontFamily: isArabic
                        ? isFirst || line.key === 'grade'
                          ? "'Cairo', 'Tajawal', system-ui, sans-serif"
                          : "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                        : undefined,
                      fontWeight: isArabic
                        ? isFirst
                          ? 800
                          : 700
                        : undefined,
                      letterSpacing: isArabic ? '0px' : undefined,
                      fontVariantLigatures: isArabic ? 'normal' : undefined,
                      textRendering: isArabic ? 'optimizeLegibility' : undefined,
                      color: isFirst
                        ? theme.textColor
                        : line.key === 'grade'
                        ? theme.badgeText
                        : theme.textColor,
                      opacity: isFirst ? 1 : 0.95,
                    }}
                    title={line.text}
                  >
                    {line.text}
                  </div>
                );
              })
            )}
          </div>

          {/* 3. ICÔNE DUPLIQUÉE EN MIROIR (À DROITE en LTR, À GAUCHE en RTL) */}
          {hasIcon && Boolean(duplicateIconRight) && (
            <div
              className="shrink-0 flex items-center justify-center self-center select-none"
              style={{
                width: `${fit.geometry.illustrationWidthPx}px`,
                height: `${fit.geometry.illustrationHeightPx}px`,
                flex: '0 0 auto',
                transform: 'scaleX(-1)',
              }}
            >
              <ThemeVectorIllustration
                themeId={activeIllustrationId}
                className="w-full h-full object-contain filter drop-shadow-2xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
