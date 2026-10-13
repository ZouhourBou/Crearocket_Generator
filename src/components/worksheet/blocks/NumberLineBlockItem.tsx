import React, { useState } from 'react';
import {
  WorksheetBlock,
  NumberLineData,
  NumberLinePoint,
} from '../../../types/worksheet';
import {
  Plus,
  Trash2,
  Settings2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface NumberLineBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles?: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const NumberLineBlockItem: React.FC<NumberLineBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const s = block.styles;
  const isRtl = s.textDirection === 'rtl' || s.languageMode === 'ar';

  const defaultData: NumberLineData = {
    min: 0,
    max: 10,
    step: 1,
    subdivisions: 2,
    arrowEnd: true,
    arrowStart: false,
    showNumbers: true,
    showOriginZero: true,
    points: [
      { id: 'pt_1', value: 3, label: 'A', color: '#4f46e5', style: 'dot', showLabel: true },
      { id: 'pt_2', value: 7.5, label: 'B', color: '#dc2626', style: 'cross', showLabel: true },
    ],
    studentCompletionMode: false,
    blankIndices: [2, 5, 8],
    lineHeight: 90,
    caption: 'Graduation régulière',
  };

  const lineData: NumberLineData = c.numberLineData || defaultData;
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const min = lineData.min ?? 0;
  const max = lineData.max ?? 10;
  const step = lineData.step > 0 ? lineData.step : 1;
  const subdivisions = lineData.subdivisions || 1;
  const points = lineData.points || [];

  // SVG dimensions
  const svgWidth = 660;
  const svgHeight = lineData.lineHeight || 90;
  const paddingX = 45;
  const axisY = 46;
  const usableWidth = svgWidth - 2 * paddingX;
  const range = max - min > 0 ? max - min : 1;

  // Coordinate mapping
  const valToX = (val: number) => {
    const fraction = (val - min) / range;
    return isRtl
      ? svgWidth - paddingX - fraction * usableWidth
      : paddingX + fraction * usableWidth;
  };

  const xToVal = (x: number) => {
    const fraction = isRtl
      ? (svgWidth - paddingX - x) / usableWidth
      : (x - paddingX) / usableWidth;
    return min + fraction * range;
  };

  // Generate main ticks
  const mainTicks: number[] = [];
  for (let v = min; v <= max + 0.0001; v += step) {
    mainTicks.push(Math.round(v * 1000) / 1000);
  }

  // Generate sub ticks
  const subTicks: number[] = [];
  if (subdivisions > 1) {
    const subStep = step / subdivisions;
    for (let v = min; v <= max + 0.0001; v += subStep) {
      const rounded = Math.round(v * 1000) / 1000;
      if (!mainTicks.some((mt) => Math.abs(mt - rounded) < 0.0001)) {
        subTicks.push(rounded);
      }
    }
  }

  const handleAddPoint = () => {
    const newPt: NumberLinePoint = {
      id: `pt_${Date.now()}`,
      value: Math.round(((min + max) / 2) * 2) / 2,
      label: String.fromCharCode(65 + (points.length % 26)),
      color: '#4f46e5',
      style: 'dot',
      showLabel: true,
    };
    onUpdateContent({
      numberLineData: {
        ...lineData,
        points: [...points, newPt],
      },
    });
    setSelectedPointId(newPt.id);
  };

  const handleUpdatePoint = (id: string, updates: Partial<NumberLinePoint>) => {
    onUpdateContent({
      numberLineData: {
        ...lineData,
        points: points.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    });
  };

  const handleDeletePoint = (id: string) => {
    onUpdateContent({
      numberLineData: {
        ...lineData,
        points: points.filter((p) => p.id !== id),
      },
    });
    if (selectedPointId === id) setSelectedPointId(null);
  };

  const handleToggleBlank = (valIndex: number) => {
    const currentBlanks = lineData.blankIndices || [];
    const exists = currentBlanks.includes(valIndex);
    const newBlanks = exists
      ? currentBlanks.filter((i) => i !== valIndex)
      : [...currentBlanks, valIndex];
    onUpdateContent({
      numberLineData: {
        ...lineData,
        blankIndices: newBlanks,
      },
    });
  };

  return (
    <div className="w-full relative select-none">
      {/* Teacher Tooling Bar */}
      {isSelected && !readOnly && (
        <div className="mb-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs shadow-md print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Axe gradué
            </span>
            <div className="h-3.5 w-px bg-slate-700" />
            <span className="text-slate-300">
              [{min} ; {max}] (pas: {step})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAddPoint}
              className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Ajouter point
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateContent({
                  numberLineData: {
                    ...lineData,
                    studentCompletionMode: !lineData.studentCompletionMode,
                  },
                })
              }
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                lineData.studentCompletionMode
                  ? 'bg-amber-500 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              Mode Élève à compléter
            </button>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Configurer les graduations"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Configuration Drawer */}
      {isSelected && showConfig && !readOnly && (
        <div className="mb-2 p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs print:hidden">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Min</label>
            <input
              type="number"
              value={min}
              onChange={(e) =>
                onUpdateContent({
                  numberLineData: { ...lineData, min: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Max</label>
            <input
              type="number"
              value={max}
              onChange={(e) =>
                onUpdateContent({
                  numberLineData: { ...lineData, max: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Pas principal</label>
            <input
              type="number"
              step="0.5"
              value={step}
              onChange={(e) =>
                onUpdateContent({
                  numberLineData: { ...lineData, step: Number(e.target.value) || 1 },
                })
              }
              className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Sous-graduations</label>
            <select
              value={subdivisions}
              onChange={(e) =>
                onUpdateContent({
                  numberLineData: { ...lineData, subdivisions: Number(e.target.value) },
                })
              }
              className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            >
              <option value="1">Aucune</option>
              <option value="2">2 (demis)</option>
              <option value="4">4 (quarts)</option>
              <option value="5">5 (cinquièmes)</option>
              <option value="10">10 (dixièmes)</option>
            </select>
          </div>
        </div>
      )}

      {/* Vector SVG Axis */}
      <div
        className={`w-full relative bg-white rounded-lg border transition-all ${
          isSelected
            ? 'border-indigo-400 ring-1 ring-indigo-200'
            : 'border-slate-200/80 shadow-2xs'
        }`}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block select-none"
          style={{ maxHeight: `${svgHeight}px`, minHeight: '65px' }}
        >
          <defs>
            <marker
              id="numline-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0f172a" />
            </marker>
          </defs>

          {/* Main Axis Line */}
          <line
            x1={paddingX - 15}
            y1={axisY}
            x2={svgWidth - paddingX + 15}
            y2={axisY}
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            markerEnd={isRtl ? undefined : 'url(#numline-arrow)'}
            markerStart={isRtl ? 'url(#numline-arrow)' : undefined}
          />

          {/* Sub Ticks */}
          {subTicks.map((st, idx) => {
            const x = valToX(st);
            return (
              <line
                key={`sub_${idx}`}
                x1={x}
                y1={axisY - 4}
                x2={x}
                y2={axisY + 4}
                stroke="#64748b"
                strokeWidth="1"
              />
            );
          })}

          {/* Main Ticks & Numbers */}
          {mainTicks.map((val, idx) => {
            const x = valToX(val);
            const isOrigin = val === 0;
            const isBlank =
              lineData.studentCompletionMode &&
              (lineData.blankIndices || []).includes(idx);

            return (
              <g
                key={`main_${idx}`}
                className="cursor-pointer"
                onClick={() => isSelected && handleToggleBlank(idx)}
              >
                {/* Tick Mark */}
                <line
                  x1={x}
                  y1={axisY - 8}
                  x2={x}
                  y2={axisY + 8}
                  stroke={isOrigin ? '#0f172a' : '#334155'}
                  strokeWidth={isOrigin ? 2.2 : 1.6}
                />

                {/* Number or Student Blank Box */}
                {lineData.showNumbers !== false && (
                  <>
                    {isBlank ? (
                      /* Blank box for student to complete */
                      <g>
                        <rect
                          x={x - 12}
                          y={axisY + 14}
                          width={24}
                          height={18}
                          rx={3}
                          fill="#f8fafc"
                          stroke="#64748b"
                          strokeWidth="1.2"
                          strokeDasharray="2,2"
                        />
                        <text
                          x={x}
                          y={axisY + 27}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontStyle="italic"
                        >
                          ...
                        </text>
                      </g>
                    ) : (
                      /* Normal printed number */
                      <text
                        x={x}
                        y={axisY + 24}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="13"
                        fontWeight={isOrigin ? 'bold' : '600'}
                        fontFamily="serif"
                        className="select-none"
                      >
                        {val}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}

          {/* Placed Points on Number Line */}
          {points.map((pt) => {
            const x = valToX(pt.value);
            const isPtSelected = selectedPointId === pt.id;
            const ptColor = pt.color || '#4f46e5';

            return (
              <g
                key={pt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPointId(pt.id);
                }}
                className="cursor-pointer group"
              >
                {/* Hit target */}
                <circle cx={x} cy={axisY - 14} r={16} fill="transparent" />

                {/* Marker on Axis */}
                {pt.style === 'cross' ? (
                  <g stroke={ptColor} strokeWidth="2.2" strokeLinecap="round">
                    <line x1={x - 4} y1={axisY - 4} x2={x + 4} y2={axisY + 4} />
                    <line x1={x - 4} y1={axisY + 4} x2={x + 4} y2={axisY - 4} />
                  </g>
                ) : (
                  <circle
                    cx={x}
                    cy={axisY}
                    r={isPtSelected ? 5.5 : 4}
                    fill={ptColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}

                {/* Vertical helper line to label */}
                <line
                  x1={x}
                  y1={axisY - 2}
                  x2={x}
                  y2={axisY - 16}
                  stroke={ptColor}
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                />

                {/* Point Label (e.g. A, B) */}
                {pt.showLabel !== false && pt.label && (
                  <g>
                    <rect
                      x={x - 10}
                      y={axisY - 34}
                      width={20}
                      height={16}
                      rx={3}
                      fill={isPtSelected ? '#e0e7ff' : '#f1f5f9'}
                      stroke={ptColor}
                      strokeWidth="1.2"
                    />
                    <text
                      x={x}
                      y={axisY - 22}
                      textAnchor="middle"
                      fill={ptColor}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="serif"
                      className="select-none"
                    >
                      {pt.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Point Inspector */}
        {isSelected && selectedPointId && !readOnly && (
          <div className="px-3 py-2 bg-indigo-50/70 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
            {(() => {
              const pt = points.find((p) => p.id === selectedPointId);
              if (!pt) return null;
              return (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-900">Point {pt.label} :</span>
                  <label className="text-[11px] text-slate-600">Nom :</label>
                  <input
                    type="text"
                    value={pt.label || ''}
                    onChange={(e) => handleUpdatePoint(pt.id, { label: e.target.value })}
                    className="w-12 px-1.5 py-0.5 border border-indigo-200 rounded bg-white text-xs font-bold"
                  />
                  <label className="text-[11px] text-slate-600">Abscisse :</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pt.value}
                    onChange={(e) =>
                      handleUpdatePoint(pt.id, { value: Number(e.target.value) })
                    }
                    className="w-16 px-1.5 py-0.5 border border-indigo-200 rounded bg-white text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePoint(pt.id)}
                    className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                    title="Supprimer ce point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}
            <button
              type="button"
              onClick={() => setSelectedPointId(null)}
              className="text-[11px] text-indigo-700 hover:underline cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
