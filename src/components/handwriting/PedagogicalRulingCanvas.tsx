import React from 'react';
import { PedagogicalRulingType } from '../../types/handwriting';

interface PedagogicalRulingCanvasProps {
  rulingType: PedagogicalRulingType;
  width: number;
  height: number;
  scale?: number; // scale multiplier
  isRtl?: boolean;
  className?: string;
  showMargin?: boolean;
  exactRowHeightPx?: number;
  exactRowsCount?: number;
  paddingXPx?: number;
}

export const PedagogicalRulingCanvas: React.FC<PedagogicalRulingCanvasProps> = ({
  rulingType,
  width,
  height,
  scale = 1.0,
  isRtl = false,
  className = '',
  showMargin = true,
  exactRowHeightPx,
  exactRowsCount,
  paddingXPx = 20,
}) => {
  if (width <= 0 || height <= 0) return null;

  const uniquePatternId = React.useId().replace(/:/g, '');
  const resolvedLineHeight =
    exactRowHeightPx && exactRowHeightPx > 0 ? exactRowHeightPx : 40 * scale;
  const resolvedLinesCount =
    exactRowsCount && exactRowsCount > 0
      ? exactRowsCount
      : Math.max(1, Math.floor((height - 2) / resolvedLineHeight));

  // Render SVG based on rulingType
  switch (rulingType) {
    case 'seyes': {
      // Seyès authentic grid aligned to row height when exactRowHeightPx is provided
      const mainStep = exactRowHeightPx ? exactRowHeightPx : 32 * scale;
      const linesCount =
        exactRowsCount && exactRowsCount > 0
          ? exactRowsCount
          : Math.max(1, Math.floor((height - 2) / mainStep));
      const gridHeight = linesCount * mainStep;
      const subStep = mainStep / 4; // 4 sub-lines per Seyès box
      const marginX = isRtl ? width - 42 * scale : 42 * scale;
      const patId = `seyes-pattern-${uniquePatternId}`;

      return (
        <svg
          className={`absolute top-0 left-0 pointer-events-none select-none ${className}`}
          width={width}
          height={Math.min(height, Math.ceil(gridHeight + 2))}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={patId}
              width={mainStep}
              height={mainStep}
              patternUnits="userSpaceOnUse"
            >
              {/* Intermediate 2mm lines (fine cyan / blue) */}
              <line x1="0" y1={subStep} x2={mainStep} y2={subStep} stroke="#a5f3fc" strokeWidth="0.75" />
              <line x1="0" y1={subStep * 2} x2={mainStep} y2={subStep * 2} stroke="#a5f3fc" strokeWidth="0.75" />
              <line x1="0" y1={subStep * 3} x2={mainStep} y2={subStep * 3} stroke="#a5f3fc" strokeWidth="0.75" />

              {/* Main baseline (violet / dark lavender) */}
              <line x1="0" y1={subStep * 3} x2={mainStep} y2={subStep * 3} stroke="#818cf8" strokeWidth="1.35" />

              {/* Bottom box separator */}
              <line x1="0" y1={mainStep} x2={mainStep} y2={mainStep} stroke="#c7d2fe" strokeWidth="0.9" />

              {/* Vertical main grid lines */}
              <line x1={mainStep} y1="0" x2={mainStep} y2={mainStep} stroke="#c7d2fe" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Grid Background constrained strictly to complete rows (gridHeight) */}
          <rect x="0" y="0" width={width} height={gridHeight} fill={`url(#${patId})`} />

          {/* Clean top & bottom border of the Seyès grid */}
          <line x1="0" y1="0.5" x2={width} y2="0.5" stroke="#c7d2fe" strokeWidth="0.9" />
          <line x1="0" y1={gridHeight} x2={width} y2={gridHeight} stroke="#c7d2fe" strokeWidth="1" />

          {/* Authentic French Red Margin constrained to complete rows */}
          {showMargin && (
            <line
              x1={marginX}
              y1="0"
              x2={marginX}
              y2={gridHeight}
              stroke="#f87171"
              strokeWidth="1.5"
            />
          )}
        </svg>
      );
    }

    case 'beginner_color': {
      // Sky (blue) -> Grass (green baseline) -> Earth (brown)
      const lineHeight = exactRowHeightPx || 44 * scale;
      const linesCount =
        exactRowsCount && exactRowsCount > 0
          ? exactRowsCount
          : Math.max(1, Math.floor((height - 2) / lineHeight));
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const rowTop = i * lineHeight;
            const ySky = rowTop + lineHeight * 0.2;
            const yMid = rowTop + lineHeight * 0.46;
            const yBase = rowTop + lineHeight * 0.75;
            const yEarth = rowTop + lineHeight * 0.94;

            return (
              <g key={i}>
                {/* Light grass band */}
                <rect
                  x={paddingXPx}
                  y={yMid}
                  width={Math.max(0, width - paddingXPx * 2)}
                  height={yBase - yMid}
                  fill="#dcfce7"
                  opacity="0.35"
                />
                {/* Sky line (Ciel) */}
                <line x1={paddingXPx} y1={ySky} x2={width - paddingXPx} y2={ySky} stroke="#38bdf8" strokeWidth="1.2" />
                {/* Mid dashed line */}
                <line x1={paddingXPx} y1={yMid} x2={width - paddingXPx} y2={yMid} stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" />
                {/* Grass baseline (Herbe) */}
                <line x1={paddingXPx} y1={yBase} x2={width - paddingXPx} y2={yBase} stroke="#16a34a" strokeWidth="1.8" />
                {/* Earth line (Terre) */}
                <line x1={paddingXPx} y1={yEarth} x2={width - paddingXPx} y2={yEarth} stroke="#b45309" strokeWidth="1.1" strokeDasharray="3 3" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'three_lines': {
      // 3 lines: Top, Mid (dashed), Base
      const lineHeight = exactRowHeightPx || 40 * scale;
      const linesCount =
        exactRowsCount && exactRowsCount > 0
          ? exactRowsCount
          : Math.max(1, Math.floor((height - 2) / lineHeight));
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const rowTop = i * lineHeight;
            const yTop = rowTop + lineHeight * 0.22;
            const yMid = rowTop + lineHeight * 0.48;
            const yBase = rowTop + lineHeight * 0.75;

            return (
              <g key={i}>
                <line x1={paddingXPx} y1={yTop} x2={width - paddingXPx} y2={yTop} stroke="#94a3b8" strokeWidth="1" />
                <line x1={paddingXPx} y1={yMid} x2={width - paddingXPx} y2={yMid} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
                <line x1={paddingXPx} y1={yBase} x2={width - paddingXPx} y2={yBase} stroke="#64748b" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'four_lines': {
      // 4 lines: Ascender, Midline, Baseline, Descender
      const lineHeight = exactRowHeightPx || 48 * scale;
      const linesCount =
        exactRowsCount && exactRowsCount > 0
          ? exactRowsCount
          : Math.max(1, Math.floor((height - 2) / lineHeight));
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const rowTop = i * lineHeight;
            const yAsc = rowTop + lineHeight * 0.18;
            const yMid = rowTop + lineHeight * 0.45;
            const yBase = rowTop + lineHeight * 0.75;
            const yDesc = rowTop + lineHeight * 0.93;

            return (
              <g key={i}>
                <line x1={paddingXPx} y1={yAsc} x2={width - paddingXPx} y2={yAsc} stroke="#93c5fd" strokeWidth="1" />
                <line x1={paddingXPx} y1={yMid} x2={width - paddingXPx} y2={yMid} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={paddingXPx} y1={yBase} x2={width - paddingXPx} y2={yBase} stroke="#3b82f6" strokeWidth="1.7" />
                <line x1={paddingXPx} y1={yDesc} x2={width - paddingXPx} y2={yDesc} stroke="#fca5a5" strokeWidth="1" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'double_line': {
      // Double line for preschool / kindergarten
      const lineHeight = exactRowHeightPx || 36 * scale;
      const linesCount =
        exactRowsCount && exactRowsCount > 0
          ? exactRowsCount
          : Math.max(1, Math.floor((height - 2) / lineHeight));
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const rowTop = i * lineHeight;
            const yTop = rowTop + lineHeight * 0.35;
            const yBase = rowTop + lineHeight * 0.75;

            return (
              <g key={i}>
                <rect
                  x={paddingXPx}
                  y={yTop}
                  width={Math.max(0, width - paddingXPx * 2)}
                  height={yBase - yTop}
                  fill="#f1f5f9"
                  opacity="0.55"
                />
                <line x1={paddingXPx} y1={yTop} x2={width - paddingXPx} y2={yTop} stroke="#94a3b8" strokeWidth="1.2" />
                <line x1={paddingXPx} y1={yBase} x2={width - paddingXPx} y2={yBase} stroke="#475569" strokeWidth="1.8" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'arabic_school': {
      const lineHeight = exactRowHeightPx || 46 * scale;
      const linesCount =
        exactRowsCount && exactRowsCount > 0
          ? exactRowsCount
          : Math.max(1, Math.floor((height - 2) / lineHeight));
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const rowTop = i * lineHeight;
            const yAsc = rowTop + lineHeight * 0.2;
            const yTeeth = rowTop + lineHeight * 0.48;
            const yBase = rowTop + lineHeight * 0.75;
            const yDesc = rowTop + lineHeight * 0.94;

            return (
              <g key={i}>
                {/* Ascender line (Alif / Laam) */}
                <line x1={paddingXPx} y1={yAsc} x2={width - paddingXPx} y2={yAsc} stroke="#60a5fa" strokeWidth="1" strokeDasharray="5 3" />
                {/* Teeth line */}
                <line x1={paddingXPx} y1={yTeeth} x2={width - paddingXPx} y2={yTeeth} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                {/* Strong main baseline */}
                <line x1={paddingXPx} y1={yBase} x2={width - paddingXPx} y2={yBase} stroke="#1e293b" strokeWidth="2.0" />
                {/* Descender line */}
                <line x1={paddingXPx} y1={yDesc} x2={width - paddingXPx} y2={yDesc} stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'blank': {
      // Fond blanc uni sans réglure
      return null;
    }

    case 'grid': {
      // Quadrillage / Petits carreaux scolaires (5x5mm environ 19px)
      const step = Math.max(12, Math.round(18.9 * scale));
      const patId = `grid-pattern-${uniquePatternId}`;
      const effectiveGridHeight = exactRowsCount && exactRowHeightPx ? exactRowsCount * exactRowHeightPx : height;

      return (
        <svg
          className={`absolute top-0 left-0 pointer-events-none select-none ${className}`}
          width={width}
          height={effectiveGridHeight}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={patId}
              width={step}
              height={step}
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1={step} x2={step} y2={step} stroke="#e2e8f0" strokeWidth="0.75" />
              <line x1={step} y1="0" x2={step} y2={step} stroke="#e2e8f0" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={width} height={effectiveGridHeight} fill={`url(#${patId})`} />
          <line x1="0" y1="0.5" x2={width} y2="0.5" stroke="#cbd5e1" strokeWidth="0.75" />
          <line x1="0" y1={effectiveGridHeight - 0.5} x2={width} y2={effectiveGridHeight - 0.5} stroke="#cbd5e1" strokeWidth="0.75" />
          {/* Marge discrète à gauche */}
          {showMargin && (
            <line
              x1={isRtl ? width - 36 * scale : 36 * scale}
              y1="0"
              x2={isRtl ? width - 36 * scale : 36 * scale}
              y2={effectiveGridHeight}
              stroke="#fca5a5"
              strokeWidth="1.25"
            />
          )}
        </svg>
      );
    }

    case 'simple':
    default: {
      const lineHeight = resolvedLineHeight;
      const linesCount = resolvedLinesCount;
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const y = (i + 1) * lineHeight - lineHeight * 0.24;
            return (
              <line
                key={i}
                x1={paddingXPx}
                y1={y}
                x2={width - paddingXPx}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1.3"
              />
            );
          })}
        </svg>
      );
    }
  }
};
