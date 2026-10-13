import React from 'react';
import { WorksheetBlock, ShapeData, ShapeKind } from '../../../types/worksheet';

interface ShapeBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const ShapeBlockItem: React.FC<ShapeBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const s = block.styles;

  const defaultShape: ShapeData = {
    shapeKind: (c.shapeType as ShapeKind) || 'rounded_rectangle',
    strokeColor: s.borderColor || '#3b82f6',
    strokeWidth: s.borderWidth || 2,
    strokeStyle: 'solid',
    fillColor: s.backgroundColor || '#eff6ff',
    arrowEnd: true,
  };

  const shape: ShapeData = c.shapeData || defaultShape;
  const kind = shape.shapeKind || 'rounded_rectangle';
  const stroke = shape.strokeColor || '#3b82f6';
  const strokeWidth = shape.strokeWidth || 2;
  const strokeDasharray =
    shape.strokeStyle === 'dashed'
      ? '6,4'
      : shape.strokeStyle === 'dotted'
      ? '2,3'
      : undefined;
  const fill = shape.fillColor || '#eff6ff';

  const w = 650;
  const h = block.height || 100;

  return (
    <div className="w-full h-full flex items-center justify-center select-none py-1">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full block select-none"
        style={{ maxHeight: `${h}px` }}
      >
        <defs>
          <marker
            id="shape-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={stroke} />
          </marker>
        </defs>

        {kind === 'rectangle' && (
          <rect
            x={10}
            y={10}
            width={w - 20}
            height={h - 20}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        )}

        {kind === 'rounded_rectangle' && (
          <rect
            x={10}
            y={10}
            width={w - 20}
            height={h - 20}
            rx={12}
            ry={12}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        )}

        {kind === 'circle' && (
          <circle
            cx={w / 2}
            cy={h / 2}
            r={Math.min(w, h) / 2 - 10}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        )}

        {kind === 'ellipse' && (
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={w / 2 - 15}
            ry={h / 2 - 10}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        )}

        {kind === 'line' && (
          <line
            x1={20}
            y1={h / 2}
            x2={w - 20}
            y2={h / 2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        )}

        {kind === 'arrow' && (
          <line
            x1={20}
            y1={h / 2}
            x2={w - 30}
            y2={h / 2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            markerEnd="url(#shape-arrow)"
            strokeLinecap="round"
          />
        )}

        {kind === 'double_arrow' && (
          <line
            x1={30}
            y1={h / 2}
            x2={w - 30}
            y2={h / 2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            markerStart="url(#shape-arrow)"
            markerEnd="url(#shape-arrow)"
            strokeLinecap="round"
          />
        )}

        {kind === 'triangle' && (
          <polygon
            points={`${w / 2},10 ${w - 20},${h - 10} 20,${h - 10}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinejoin="round"
          />
        )}

        {kind === 'brace' && (
          <path
            d={`M 20 20 Q ${w / 4} 20 ${w / 2} ${h / 2} Q ${w * 0.75} 20 ${w - 20} 20`}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};
