import React from 'react';
import { WorksheetBlock, ConstructionAreaData } from '../../../types/worksheet';
import { Grid, HelpCircle, PenTool } from 'lucide-react';

interface ConstructionAreaBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
}

export const ConstructionAreaBlockItem: React.FC<ConstructionAreaBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const c = block.content;
  const s = block.styles;

  const defaultConstruction: ConstructionAreaData = {
    height: 220,
    backgroundType: 'square_grid',
    gridSize: 20,
    borderStyle: 'solid',
    borderColor: '#94a3b8',
    instructionHint: 'Zone de tracé & construction géométrique réservée à l’élève',
    initialGeometry: undefined,
  };

  const data: ConstructionAreaData = c.constructionData || defaultConstruction;
  const height = data.height || block.height || 220;
  const bgType = data.backgroundType || 'square_grid';
  const gridSize = data.gridSize || 20;
  const borderStyle = data.borderStyle || 'solid';
  const borderColor = data.borderColor || '#94a3b8';

  // Handle vertical resize drag
  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startH = height;

    const onMove = (moveEvt: MouseEvent) => {
      const deltaY = moveEvt.clientY - startY;
      const newH = Math.max(100, Math.min(600, startH + deltaY));
      onUpdateContent({
        constructionData: {
          ...data,
          height: newH,
        },
      });
      if (onUpdateHeight) onUpdateHeight(newH);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="w-full flex flex-col select-none py-1">
      {/* Visual Canvas Area for Student */}
      <div
        style={{
          height: `${height}px`,
          borderWidth: borderStyle === 'none' ? '0px' : '1.5px',
          borderStyle: borderStyle === 'none' ? 'none' : borderStyle,
          borderColor: isSelected ? '#6366f1' : borderColor,
        }}
        className={`w-full relative rounded-xl overflow-hidden transition-all bg-white ${
          isSelected ? 'shadow-sm ring-1 ring-indigo-300' : 'shadow-2xs'
        }`}
      >
        <svg
          width="100%"
          height="100%"
          className="w-full h-full block select-none pointer-events-none"
        >
          <defs>
            {/* Square Grid */}
            <pattern
              id={`grid-${block.id}`}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />
            </pattern>

            {/* Dot Grid */}
            <pattern
              id={`dots-${block.id}`}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={gridSize / 2} cy={gridSize / 2} r="1.2" fill="#94a3b8" />
            </pattern>
          </defs>

          {/* Background fill */}
          {bgType === 'square_grid' && (
            <rect width="100%" height="100%" fill={`url(#grid-${block.id})`} />
          )}
          {bgType === 'dot_grid' && (
            <rect width="100%" height="100%" fill={`url(#dots-${block.id})`} />
          )}
          {bgType === 'coordinate_grid' && (
            <>
              <rect width="100%" height="100%" fill={`url(#grid-${block.id})`} />
              {/* Central axes */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#64748b" strokeWidth="1.5" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#64748b" strokeWidth="1.5" />
            </>
          )}

          {/* Initial Pre-drawn Geometry for Partial Construction (Prompt Item 20) */}
          {data.initialGeometry && (
            <g className="initial-geom-layer">
              {data.initialGeometry.segments.map((seg) => {
                const p1 = data.initialGeometry?.points.find((p) => p.id === seg.from);
                const p2 = data.initialGeometry?.points.find((p) => p.id === seg.to);
                if (!p1 || !p2) return null;
                return (
                  <line
                    key={seg.id}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                );
              })}
              {data.initialGeometry.points.map((pt) => (
                <g key={pt.id}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#0f172a" />
                  <text
                    x={pt.x + 8}
                    y={pt.y - 8}
                    fill="#0f172a"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* Watermark / Teacher instruction indicator */}
        {data.instructionHint && (
          <div className="absolute top-2 right-2 text-[10px] font-semibold text-slate-400 italic px-2 py-0.5 rounded bg-white/70 backdrop-blur-2xs select-none pointer-events-none print:opacity-40">
            {data.instructionHint}
          </div>
        )}

        {/* Vertical Resize Drag Handle on Bottom */}
        {isSelected && !readOnly && (
          <div
            onMouseDown={handleStartResize}
            title="Glisser vers le bas pour agrandir l'espace de construction élève"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-white border border-indigo-500 rounded-t-md shadow-xs flex items-center justify-center cursor-ns-resize z-30 hover:bg-indigo-50 print:hidden"
          >
            <div className="w-8 h-1 rounded-full bg-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
};
