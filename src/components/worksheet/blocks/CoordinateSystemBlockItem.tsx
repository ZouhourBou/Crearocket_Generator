import React, { useState } from 'react';
import {
  WorksheetBlock,
  CoordinateGraphData,
  GraphPoint,
  GraphSegment,
  GraphFunctionCurve,
} from '../../../types/worksheet';
import { Plus, Trash2, LineChart, Sparkles } from 'lucide-react';
import { InlineMathText } from './InlineMathText';

interface CoordinateSystemBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
}

export const CoordinateSystemBlockItem: React.FC<CoordinateSystemBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const c = block.content;
  const s = block.styles;

  const defaultGraphData: CoordinateGraphData = {
    xMin: -5,
    xMax: 5,
    yMin: -4,
    yMax: 5,
    step: 1,
    showGrid: true,
    showAxes: true,
    showAxisLabels: true,
    showNumbers: true,
    xAxisLabel: 'x',
    yAxisLabel: 'y',
    points: [
      { id: 'gp_A', label: 'A(2, 3)', x: 2, y: 3, color: '#4f46e5' },
      { id: 'gp_B', label: 'B(-2, 1)', x: -2, y: 1, color: '#dc2626' },
    ],
    segments: [{ id: 'gs_AB', from: 'gp_A', to: 'gp_B', style: 'solid', color: '#1e293b' }],
    functions: [
      { id: 'fn_1', expression: '0.5*x + 1', label: 'f(x) = 0,5x + 1', color: '#0284c7', style: 'solid' },
    ],
    graphHeight: 280,
    caption: 'Repère orthogonal (O, I, J)',
  };

  const graph: CoordinateGraphData = c.graphData || defaultGraphData;
  const [newPtName, setNewPtName] = useState('C');
  const [newPtX, setNewPtX] = useState('1');
  const [newPtY, setNewPtY] = useState('2');

  const width = 650;
  const height = graph.graphHeight || 280;
  const pad = 35; // margin around axes

  const xMin = graph.xMin ?? -5;
  const xMax = graph.xMax ?? 5;
  const yMin = graph.yMin ?? -4;
  const yMax = graph.yMax ?? 5;
  const step = graph.step || 1;

  // Coordinate transforms
  const toSvgX = (mathX: number) => {
    return pad + ((mathX - xMin) / (xMax - xMin)) * (width - 2 * pad);
  };

  const toSvgY = (mathY: number) => {
    return height - pad - ((mathY - yMin) / (yMax - yMin)) * (height - 2 * pad);
  };

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  const updateGraph = (updates: Partial<CoordinateGraphData>) => {
    onUpdateContent({
      graphData: {
        ...graph,
        ...updates,
      },
    });
  };

  // Add a new point
  const handleAddPoint = () => {
    const xVal = parseFloat(newPtX);
    const yVal = parseFloat(newPtY);
    if (isNaN(xVal) || isNaN(yVal)) return;

    const newPt: GraphPoint = {
      id: `pt_${Date.now()}`,
      label: `${newPtName}(${xVal}, ${yVal})`,
      x: xVal,
      y: yVal,
      color: '#4f46e5',
    };
    updateGraph({ points: [...graph.points, newPt] });
    setNewPtName(String.fromCharCode(newPtName.charCodeAt(0) + 1));
  };

  // Generate grid lines
  const gridLinesX: number[] = [];
  for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
    gridLinesX.push(x);
  }

  const gridLinesY: number[] = [];
  for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) {
    gridLinesY.push(y);
  }

  // Generate function curve path points
  const evaluateExpr = (expr: string, x: number): number | null => {
    try {
      // Safe math evaluator for linear/quadratic functions
      const sanitized = expr
        .replace(/\^/g, '**')
        .replace(/(\d)x/g, '$1*x')
        .replace(/x/g, `(${x})`);
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      return typeof res === 'number' && !isNaN(res) ? res : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="w-full flex flex-col select-none py-1">
      {/* Visual Canvas Container */}
      <div
        className={`w-full relative rounded-xl border overflow-hidden bg-white ${
          isSelected
            ? 'border-indigo-400 shadow-sm ring-1 ring-indigo-200'
            : 'border-slate-200/90 shadow-2xs'
        }`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block select-none bg-white"
          style={{ maxHeight: `${height}px`, minHeight: '220px' }}
        >
          {/* 1. Grid Lines */}
          {graph.showGrid && (
            <g stroke="#e2e8f0" strokeWidth="0.8">
              {gridLinesX.map((x) => (
                <line
                  key={`gx_${x}`}
                  x1={toSvgX(x)}
                  y1={toSvgY(yMin)}
                  x2={toSvgX(x)}
                  y2={toSvgY(yMax)}
                />
              ))}
              {gridLinesY.map((y) => (
                <line
                  key={`gy_${y}`}
                  x1={toSvgX(xMin)}
                  y1={toSvgY(y)}
                  x2={toSvgX(xMax)}
                  y2={toSvgY(y)}
                />
              ))}
            </g>
          )}

          {/* 2. Axes */}
          {graph.showAxes && (
            <g stroke="#0f172a" strokeWidth="1.5">
              {/* X Axis */}
              <line
                x1={toSvgX(xMin)}
                y1={originY}
                x2={toSvgX(xMax)}
                y2={originY}
              />
              {/* Arrow on X Axis */}
              <polygon
                points={`${toSvgX(xMax)},${originY} ${toSvgX(xMax) - 8},${originY - 4} ${toSvgX(xMax) - 8},${originY + 4}`}
                fill="#0f172a"
              />

              {/* Y Axis */}
              <line
                x1={originX}
                y1={toSvgY(yMin)}
                x2={originX}
                y2={toSvgY(yMax)}
              />
              {/* Arrow on Y Axis */}
              <polygon
                points={`${originX},${toSvgY(yMax)} ${originX - 4},${toSvgY(yMax) + 8} ${originX + 4},${toSvgY(yMax) + 8}`}
                fill="#0f172a"
              />
            </g>
          )}

          {/* 3. Axis Ticks & Numbers */}
          {graph.showNumbers && (
            <g fill="#475569" fontSize="11" fontFamily="serif">
              {/* X Axis Numbers */}
              {gridLinesX.map((x) => {
                if (x === 0) return null;
                const sx = toSvgX(x);
                return (
                  <g key={`tx_${x}`}>
                    <line x1={sx} y1={originY - 3} x2={sx} y2={originY + 3} stroke="#0f172a" strokeWidth="1.2" />
                    <text x={sx} y={originY + 16} textAnchor="middle">
                      {x}
                    </text>
                  </g>
                );
              })}

              {/* Y Axis Numbers */}
              {gridLinesY.map((y) => {
                if (y === 0) return null;
                const sy = toSvgY(y);
                return (
                  <g key={`ty_${y}`}>
                    <line x1={originX - 3} y1={sy} x2={originX + 3} y2={sy} stroke="#0f172a" strokeWidth="1.2" />
                    <text x={originX - 8} y={sy + 4} textAnchor="end">
                      {y}
                    </text>
                  </g>
                );
              })}

              {/* Origin O */}
              <text x={originX - 8} y={originY + 14} textAnchor="end" fontWeight="bold">
                0
              </text>
            </g>
          )}

          {/* Axis Labels (x and y) */}
          {graph.showAxisLabels && (
            <g fill="#0f172a" fontSize="13" fontWeight="bold" fontFamily="serif">
              <text x={toSvgX(xMax) + 12} y={originY + 4} textAnchor="start">
                {graph.xAxisLabel || 'x'}
              </text>
              <text x={originX} y={toSvgY(yMax) - 10} textAnchor="middle">
                {graph.yAxisLabel || 'y'}
              </text>
            </g>
          )}

          {/* 4. Function Curves (Prompt Item 24) */}
          {graph.functions?.map((fn) => {
            const numSteps = 80;
            const pts: [number, number][] = [];
            for (let i = 0; i <= numSteps; i++) {
              const mx = xMin + (i / numSteps) * (xMax - xMin);
              const my = evaluateExpr(fn.expression, mx);
              if (my !== null && my >= yMin - 1 && my <= yMax + 1) {
                pts.push([toSvgX(mx), toSvgY(my)]);
              }
            }
            if (pts.length < 2) return null;
            const pathData = pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

            return (
              <g key={fn.id}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={fn.color || '#0284c7'}
                  strokeWidth="2"
                  strokeDasharray={fn.style === 'dashed' ? '5,4' : undefined}
                />
                {fn.label && pts.length > 0 && (
                  <text
                    x={pts[pts.length - 1][0] - 10}
                    y={pts[pts.length - 1][1] - 8}
                    fill={fn.color || '#0284c7'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    {fn.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* 5. Segments connecting points */}
          {graph.segments.map((seg) => {
            const pFrom = graph.points.find((p) => p.id === seg.from);
            const pTo = graph.points.find((p) => p.id === seg.to);
            if (!pFrom || !pTo) return null;

            return (
              <line
                key={seg.id}
                x1={toSvgX(pFrom.x)}
                y1={toSvgY(pFrom.y)}
                x2={toSvgX(pTo.x)}
                y2={toSvgY(pTo.y)}
                stroke={seg.color || '#1e293b'}
                strokeWidth="1.8"
                strokeDasharray={seg.style === 'dashed' ? '5,4' : undefined}
              />
            );
          })}

          {/* 6. Points & Labels (Prompt Item 23) */}
          {graph.points.map((pt) => {
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);

            return (
              <g key={pt.id} className="cursor-pointer">
                {/* Dotted projection lines to axes */}
                <line
                  x1={sx}
                  y1={sy}
                  x2={sx}
                  y2={originY}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <line
                  x1={sx}
                  y1={sy}
                  x2={originX}
                  y2={sy}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />

                {/* Point dot */}
                <circle cx={sx} cy={sy} r={4.5} fill={pt.color || '#4f46e5'} stroke="#ffffff" strokeWidth="1.5" />

                {/* Point Label */}
                <text
                  x={sx + 8}
                  y={sy - 8}
                  fill="#0f172a"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive Point Adder Toolbar inside Block */}
        {isSelected && !readOnly && (
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Placer un point :</span>
              <input
                type="text"
                value={newPtName}
                onChange={(e) => setNewPtName(e.target.value)}
                className="w-8 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-bold"
                placeholder="Nom"
              />
              <span className="text-slate-400">(</span>
              <input
                type="number"
                value={newPtX}
                onChange={(e) => setNewPtX(e.target.value)}
                className="w-12 px-1 py-0.5 bg-white border border-slate-300 rounded text-center text-xs"
                placeholder="x"
              />
              <span className="text-slate-400">;</span>
              <input
                type="number"
                value={newPtY}
                onChange={(e) => setNewPtY(e.target.value)}
                className="w-12 px-1 py-0.5 bg-white border border-slate-300 rounded text-center text-xs"
                placeholder="y"
              />
              <span className="text-slate-400">)</span>

              <button
                type="button"
                onClick={handleAddPoint}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Axes : x ∈ [{xMin}, {xMax}], y ∈ [{yMin}, {yMax}]
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {graph.caption && (
        <div className="mt-1.5 text-center text-xs text-slate-500 italic">
          <InlineMathText text={graph.caption} />
        </div>
      )}
    </div>
  );
};
