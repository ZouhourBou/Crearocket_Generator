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
}

export const PedagogicalRulingCanvas: React.FC<PedagogicalRulingCanvasProps> = ({
  rulingType,
  width,
  height,
  scale = 1.0,
  isRtl = false,
  className = '',
  showMargin = true,
}) => {
  if (width <= 0 || height <= 0) return null;

  // Render SVG based on rulingType
  switch (rulingType) {
    case 'seyes': {
      // Seyès authentic grid:
      // Main square: 8mm x 8mm.
      // In web px at 96 DPI: 1mm ~= 3.78px. 8mm ~= 30px.
      // Interline: 2mm ~= 7.5px.
      const mainStep = 32 * scale;
      const subStep = mainStep / 4; // 4 sub-lines per 8mm box = 2mm each
      const marginX = isRtl ? width - 50 * scale : 50 * scale;

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="seyes-pattern"
              width={mainStep}
              height={mainStep}
              patternUnits="userSpaceOnUse"
            >
              {/* Intermediate 2mm lines (fine cyan / blue) */}
              <line x1="0" y1={subStep} x2={mainStep} y2={subStep} stroke="#a5f3fc" strokeWidth="0.75" />
              <line x1="0" y1={subStep * 2} x2={mainStep} y2={subStep * 2} stroke="#a5f3fc" strokeWidth="0.75" />
              <line x1="0" y1={subStep * 3} x2={mainStep} y2={subStep * 3} stroke="#a5f3fc" strokeWidth="0.75" />
              
              {/* Main baseline (violet / dark lavender) */}
              <line x1="0" y1={mainStep} x2={mainStep} y2={mainStep} stroke="#818cf8" strokeWidth="1.2" />
              
              {/* Vertical main grid lines */}
              <line x1={mainStep} y1="0" x2={mainStep} y2={mainStep} stroke="#c7d2fe" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#seyes-pattern)" />

          {/* Authentic French Red Margin */}
          {showMargin && (
            <line
              x1={marginX}
              y1="0"
              x2={marginX}
              y2={height}
              stroke="#f87171"
              strokeWidth="1.5"
            />
          )}
        </svg>
      );
    }

    case 'beginner_color': {
      // Sky (blue) -> Grass (green baseline) -> Earth (brown)
      const lineHeight = 44 * scale;
      const linesCount = Math.floor(height / lineHeight);
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const yBase = (i + 1) * lineHeight;
            const ySky = yBase - lineHeight * 0.65;
            const yEarth = yBase + lineHeight * 0.35;

            return (
              <g key={i}>
                {/* Sky line (Ciel) */}
                <line x1="20" y1={ySky} x2={width - 20} y2={ySky} stroke="#38bdf8" strokeWidth="1.2" />
                {/* Grass baseline (Herbe) */}
                <line x1="20" y1={yBase} x2={width - 20} y2={yBase} stroke="#22c55e" strokeWidth="2.0" />
                {/* Earth line (Terre) */}
                <line x1="20" y1={yEarth} x2={width - 20} y2={yEarth} stroke="#b45309" strokeWidth="1.2" strokeDasharray="3 3" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'three_lines': {
      // 3 lines: Top, Mid (dashed), Base
      const lineHeight = 40 * scale;
      const linesCount = Math.floor(height / lineHeight);
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const yBase = (i + 1) * lineHeight;
            const yMid = yBase - lineHeight * 0.35;
            const yTop = yBase - lineHeight * 0.7;

            return (
              <g key={i}>
                <line x1="20" y1={yTop} x2={width - 20} y2={yTop} stroke="#94a3b8" strokeWidth="1" />
                <line x1="20" y1={yMid} x2={width - 20} y2={yMid} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
                <line x1="20" y1={yBase} x2={width - 20} y2={yBase} stroke="#64748b" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'four_lines': {
      // 4 lines: Ascender, Midline, Baseline, Descender
      const lineHeight = 48 * scale;
      const linesCount = Math.floor(height / lineHeight);
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const yBase = (i + 1) * lineHeight;
            const yAsc = yBase - lineHeight * 0.7;
            const yMid = yBase - lineHeight * 0.35;
            const yDesc = yBase + lineHeight * 0.3;

            return (
              <g key={i}>
                <line x1="20" y1={yAsc} x2={width - 20} y2={yAsc} stroke="#93c5fd" strokeWidth="1" />
                <line x1="20" y1={yMid} x2={width - 20} y2={yMid} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="20" y1={yBase} x2={width - 20} y2={yBase} stroke="#3b82f6" strokeWidth="1.8" />
                <line x1="20" y1={yDesc} x2={width - 20} y2={yDesc} stroke="#fca5a5" strokeWidth="1" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'double_line': {
      // Double line for preschool / kindergarten
      const lineHeight = 36 * scale;
      const linesCount = Math.floor(height / lineHeight);
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const yBase = (i + 1) * lineHeight;
            const yTop = yBase - lineHeight * 0.45;

            return (
              <g key={i}>
                <line x1="20" y1={yTop} x2={width - 20} y2={yTop} stroke="#94a3b8" strokeWidth="1.2" />
                <line x1="20" y1={yBase} x2={width - 20} y2={yBase} stroke="#475569" strokeWidth="1.8" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'arabic_school': {
      // Arabic calligraphy school ruling:
      // Strong dark baseline (خط القاعدة)
      // Teeth/mid guide (خط الأسنان)
      // Ascender line for Alif/Laam (خط الألف واللام)
      // Descender line for Raa/Waw/Noon (خط الحروف الهابطة)
      const lineHeight = 46 * scale;
      const linesCount = Math.floor(height / lineHeight);
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const yBase = (i + 1) * lineHeight;
            const yTeeth = yBase - lineHeight * 0.3;
            const yAsc = yBase - lineHeight * 0.75;
            const yDesc = yBase + lineHeight * 0.35;

            return (
              <g key={i}>
                {/* Ascender line (Alif / Laam) */}
                <line x1="20" y1={yAsc} x2={width - 20} y2={yAsc} stroke="#60a5fa" strokeWidth="1" strokeDasharray="5 3" />
                {/* Teeth line */}
                <line x1="20" y1={yTeeth} x2={width - 20} y2={yTeeth} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                {/* Strong main baseline */}
                <line x1="20" y1={yBase} x2={width - 20} y2={yBase} stroke="#1e293b" strokeWidth="2.2" />
                {/* Descender line */}
                <line x1="20" y1={yDesc} x2={width - 20} y2={yDesc} stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" />
              </g>
            );
          })}
        </svg>
      );
    }

    case 'simple':
    default: {
      const lineHeight = 36 * scale;
      const linesCount = Math.floor(height / lineHeight);
      const lines = Array.from({ length: linesCount });

      return (
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          {lines.map((_, i) => {
            const y = (i + 1) * lineHeight;
            return (
              <line
                key={i}
                x1="20"
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1.2"
              />
            );
          })}
        </svg>
      );
    }
  }
};
