import React from 'react';
import {
  LinePatternType,
  LineDifficultyLevel,
  TracingShapeType,
} from '../../types/handwriting';

interface TracingLineItemProps {
  type: LinePatternType;
  difficulty: LineDifficultyLevel;
  strokeWidth?: number;
  dashSize?: number;
  style?: 'dotted' | 'dashed' | 'solid' | 'light_gray';
  showStartEndPoint?: boolean;
  showDirectionArrows?: boolean;
  width?: number;
  height?: number;
  color?: string;
  isRtl?: boolean;
}

export const TracingLineItem: React.FC<TracingLineItemProps> = ({
  type,
  difficulty,
  strokeWidth = 3,
  dashSize = 6,
  style = 'dotted',
  showStartEndPoint = true,
  showDirectionArrows = true,
  width = 540,
  height = 54,
  color = '#475569',
  isRtl = false,
}) => {
  const strokeDash =
    style === 'dotted'
      ? `${dashSize} ${dashSize * 1.2}`
      : style === 'dashed'
      ? `${dashSize * 2.5} ${dashSize * 1.5}`
      : style === 'light_gray'
      ? undefined
      : undefined;

  const actualColor = style === 'light_gray' ? '#cbd5e1' : color;
  const paddingX = 24;
  const usableWidth = width - paddingX * 2;
  const midY = height / 2;

  // Generate SVG path data according to pattern and difficulty
  let pathD = '';
  let startX = isRtl ? width - paddingX : paddingX;
  let endX = isRtl ? paddingX : width - paddingX;
  let startY = midY;
  let endY = midY;

  switch (type) {
    case 'horizontal': {
      pathD = `M ${startX} ${midY} L ${endX} ${midY}`;
      break;
    }

    case 'vertical': {
      startY = 10;
      endY = height - 10;
      pathD = `M ${midY} ${startY} L ${midY} ${endY}`;
      startX = midY;
      endX = midY;
      break;
    }

    case 'diagonal': {
      const stepCount = difficulty === 'basic' ? 3 : difficulty === 'intermediate' ? 5 : 8;
      const stepW = usableWidth / stepCount;
      const hAmp = height * 0.35;
      let d = `M ${startX} ${midY + hAmp}`;
      for (let i = 0; i < stepCount; i++) {
        const x1 = isRtl ? startX - (i + 0.5) * stepW : startX + (i + 0.5) * stepW;
        const x2 = isRtl ? startX - (i + 1) * stepW : startX + (i + 1) * stepW;
        d += ` L ${x1} ${midY - hAmp} L ${x2} ${midY + hAmp}`;
      }
      pathD = d;
      endY = midY + hAmp;
      break;
    }

    case 'wave': {
      // Smooth sinusoidal waves
      const wavesCount = difficulty === 'basic' ? 3 : difficulty === 'intermediate' ? 5 : 7;
      const waveW = usableWidth / wavesCount;
      const amp = height * 0.35;
      let d = `M ${startX} ${midY}`;
      for (let i = 0; i < wavesCount; i++) {
        const xStart = isRtl ? startX - i * waveW : startX + i * waveW;
        const xEnd = isRtl ? startX - (i + 1) * waveW : startX + (i + 1) * waveW;
        const xMid = (xStart + xEnd) / 2;
        const dir = i % 2 === 0 ? -1 : 1;
        d += ` Q ${xMid} ${midY + dir * amp * 1.3} ${xEnd} ${midY}`;
      }
      pathD = d;
      break;
    }

    case 'zigzag': {
      const zigs = difficulty === 'basic' ? 4 : difficulty === 'intermediate' ? 7 : 10;
      const zigW = usableWidth / zigs;
      const amp = height * 0.38;
      let d = `M ${startX} ${midY + amp}`;
      for (let i = 0; i < zigs; i++) {
        const xMid = isRtl ? startX - (i + 0.5) * zigW : startX + (i + 0.5) * zigW;
        const xEnd = isRtl ? startX - (i + 1) * zigW : startX + (i + 1) * zigW;
        d += ` L ${xMid} ${midY - amp} L ${xEnd} ${midY + amp}`;
      }
      pathD = d;
      endY = midY + amp;
      break;
    }

    case 'loops_up': {
      // Loops going upwards (like cursive l or e)
      const loops = difficulty === 'basic' ? 4 : difficulty === 'intermediate' ? 6 : 9;
      const loopW = usableWidth / loops;
      const topY = midY - height * 0.38;
      const botY = midY + height * 0.3;
      let d = `M ${startX} ${botY}`;
      for (let i = 0; i < loops; i++) {
        const curX = isRtl ? startX - i * loopW : startX + i * loopW;
        const nxtX = isRtl ? startX - (i + 1) * loopW : startX + (i + 1) * loopW;
        const c1x = curX + (nxtX - curX) * 0.7;
        const c2x = curX + (nxtX - curX) * 0.3;
        d += ` C ${c1x} ${botY} ${curX + (nxtX - curX) * 0.8} ${topY} ${curX + (nxtX - curX) * 0.5} ${topY}`;
        d += ` C ${c2x} ${topY} ${curX + (nxtX - curX) * 0.2} ${botY} ${nxtX} ${botY}`;
      }
      pathD = d;
      endY = botY;
      break;
    }

    case 'loops_down': {
      // Loops going downwards (like cursive j or g)
      const loops = difficulty === 'basic' ? 4 : difficulty === 'intermediate' ? 6 : 9;
      const loopW = usableWidth / loops;
      const topY = midY - height * 0.25;
      const botY = midY + height * 0.4;
      let d = `M ${startX} ${topY}`;
      for (let i = 0; i < loops; i++) {
        const curX = isRtl ? startX - i * loopW : startX + i * loopW;
        const nxtX = isRtl ? startX - (i + 1) * loopW : startX + (i + 1) * loopW;
        const c1x = curX + (nxtX - curX) * 0.7;
        const c2x = curX + (nxtX - curX) * 0.3;
        d += ` C ${c1x} ${topY} ${curX + (nxtX - curX) * 0.8} ${botY} ${curX + (nxtX - curX) * 0.5} ${botY}`;
        d += ` C ${c2x} ${botY} ${curX + (nxtX - curX) * 0.2} ${topY} ${nxtX} ${topY}`;
      }
      pathD = d;
      endY = topY;
      break;
    }

    case 'spiral': {
      // Concentric or repeating spirals
      const spirals = difficulty === 'basic' ? 3 : difficulty === 'intermediate' ? 5 : 7;
      const spW = usableWidth / spirals;
      let d = `M ${startX} ${midY}`;
      for (let i = 0; i < spirals; i++) {
        const cx = isRtl ? startX - (i + 0.5) * spW : startX + (i + 0.5) * spW;
        const r = height * 0.35;
        d += ` A ${r} ${r} 0 1 1 ${cx} ${midY + 0.1}`;
        d += ` A ${r * 0.6} ${r * 0.6} 0 1 1 ${cx} ${midY + 0.1}`;
      }
      pathD = d;
      break;
    }

    case 'curve':
    case 'mixed':
    default: {
      const parts = difficulty === 'basic' ? 3 : 5;
      const partW = usableWidth / parts;
      let d = `M ${startX} ${midY}`;
      for (let i = 0; i < parts; i++) {
        const curX = isRtl ? startX - i * partW : startX + i * partW;
        const nxtX = isRtl ? startX - (i + 1) * partW : startX + (i + 1) * partW;
        const dir = i % 2 === 0 ? -1 : 1;
        d += ` C ${curX + (nxtX - curX) * 0.3} ${midY + dir * height * 0.4} ${curX + (nxtX - curX) * 0.7} ${midY + dir * height * 0.4} ${nxtX} ${midY}`;
      }
      pathD = d;
      break;
    }
  }

  return (
    <div className="relative w-full flex items-center justify-center my-1 select-none">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill={actualColor} />
          </marker>
        </defs>

        {/* The main tracing path */}
        <path
          d={pathD}
          fill="none"
          stroke={actualColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDash}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerMid={showDirectionArrows ? 'url(#arrow)' : undefined}
        />

        {/* Start Point indicator (Green circle) */}
        {showStartEndPoint && (
          <g>
            <circle
              cx={startX}
              cy={startY}
              r={strokeWidth * 1.8 + 2}
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx={startX} cy={startY} r="2.5" fill="#ffffff" />
          </g>
        )}

        {/* End Point indicator (Red target or checkered flag) */}
        {showStartEndPoint && (
          <g>
            <circle
              cx={endX}
              cy={endY}
              r={strokeWidth * 1.8 + 2}
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx={endX} cy={endY} r="2.5" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
};

interface TracingShapeItemProps {
  shape: TracingShapeType;
  size?: number;
  style?: 'dotted' | 'dashed' | 'solid' | 'light_gray';
  color?: string;
  strokeWidth?: number;
  label?: string;
}

export const TracingShapeItem: React.FC<TracingShapeItemProps> = ({
  shape,
  size = 90,
  style = 'dotted',
  color = '#475569',
  strokeWidth = 3,
  label,
}) => {
  const dash =
    style === 'dotted'
      ? '5 5'
      : style === 'dashed'
      ? '10 6'
      : style === 'light_gray'
      ? undefined
      : undefined;

  const actualColor = style === 'light_gray' ? '#cbd5e1' : color;
  const pad = 10;
  const innerSize = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;

  const renderShapePath = () => {
    switch (shape) {
      case 'circle':
        return <circle cx={cx} cy={cy} r={innerSize / 2} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} />;

      case 'square':
        return <rect x={pad} y={pad} width={innerSize} height={innerSize} rx="4" fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} />;

      case 'rectangle':
        return <rect x={pad} y={pad + innerSize * 0.15} width={innerSize} height={innerSize * 0.7} rx="4" fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} />;

      case 'triangle': {
        const points = `${cx},${pad} ${size - pad},${size - pad} ${pad},${size - pad}`;
        return <polygon points={points} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />;
      }

      case 'oval':
        return <ellipse cx={cx} cy={cy} rx={innerSize / 2} ry={innerSize / 3} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} />;

      case 'diamond': {
        const points = `${cx},${pad} ${size - pad},${cy} ${cx},${size - pad} ${pad},${cy}`;
        return <polygon points={points} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />;
      }

      case 'star': {
        // 5-pointed star
        const points: string[] = [];
        const outerR = innerSize / 2;
        const innerR = outerR * 0.45;
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return <polygon points={points.join(' ')} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />;
      }

      case 'heart': {
        const topCurveHeight = innerSize * 0.3;
        const d = `
          M ${cx} ${size - pad}
          C ${cx - innerSize * 0.6} ${cy + innerSize * 0.1},
            ${pad} ${cy - topCurveHeight},
            ${cx - innerSize * 0.25} ${pad}
          C ${cx - innerSize * 0.05} ${pad},
            ${cx} ${pad + topCurveHeight * 0.6},
            ${cx} ${pad + topCurveHeight}
          C ${cx} ${pad + topCurveHeight * 0.6},
            ${cx + innerSize * 0.05} ${pad},
            ${cx + innerSize * 0.25} ${pad}
          C ${size - pad} ${cy - topCurveHeight},
            ${cx + innerSize * 0.6} ${cy + innerSize * 0.1},
            ${cx} ${size - pad}
          Z
        `;
        return <path d={d} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />;
      }

      case 'pentagon': {
        const points: string[] = [];
        const r = innerSize / 2;
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return <polygon points={points.join(' ')} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />;
      }

      case 'hexagon': {
        const points: string[] = [];
        const r = innerSize / 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i * 2 * Math.PI) / 6;
          points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return <polygon points={points.join(' ')} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} strokeLinejoin="round" />;
      }

      default:
        return <circle cx={cx} cy={cy} r={innerSize / 2} fill="none" stroke={actualColor} strokeWidth={strokeWidth} strokeDasharray={dash} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {renderShapePath()}
      </svg>
      {label && (
        <span className="text-xs font-bold text-slate-700 mt-1">{label}</span>
      )}
    </div>
  );
};
