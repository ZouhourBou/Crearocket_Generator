import React, { useState, useRef } from 'react';
import {
  WorksheetBlock,
  GeometryFigureData,
  GeometryPoint,
  GeometrySegment,
  GeometryCircle,
  GeometryAngle,
} from '../../../types/worksheet';
import {
  MousePointer,
  Dot,
  Minus,
  Circle as CircleIcon,
  Square,
  Sparkles,
  RotateCcw,
  Trash2,
  Tag,
  Compass,
} from 'lucide-react';
import { InlineMathText } from './InlineMathText';

interface GeometryFigureBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
}

type GeometryTool = 'select' | 'point' | 'segment' | 'circle' | 'right_angle' | 'angle';

export const GeometryFigureBlockItem: React.FC<GeometryFigureBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const c = block.content;
  const s = block.styles;
  const isRtl = s.textDirection === 'rtl' || s.languageMode === 'ar';

  // Default geometry data if empty
  const defaultGeometry: GeometryFigureData = {
    points: [
      { id: 'p_A', label: 'A', x: 80, y: 200, showLabel: true, labelPosition: 'bottom-right' },
      { id: 'p_B', label: 'B', x: 380, y: 200, showLabel: true, labelPosition: 'bottom-right' },
      { id: 'p_C', label: 'C', x: 80, y: 50, showLabel: true, labelPosition: 'top-left' },
    ],
    segments: [
      { id: 's_AB', from: 'p_A', to: 'p_B', style: 'solid', lengthLabel: '6 cm', showLength: true },
      { id: 's_AC', from: 'p_A', to: 'p_C', style: 'solid', lengthLabel: '4 cm', showLength: true },
      { id: 's_BC', from: 'p_B', to: 'p_C', style: 'solid', lengthLabel: '7,2 cm', showLength: false },
    ],
    circles: [],
    angles: [
      { id: 'ang_A', vertex: 'p_A', arm1: 'p_B', arm2: 'p_C', isRightAngle: true },
    ],
    figureHeight: 240,
    showGrid: false,
    caption: 'Figure géométrique',
  };

  const geom: GeometryFigureData = c.geometryData || defaultGeometry;

  const [activeTool, setActiveTool] = useState<GeometryTool>('select');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [segmentStartPointId, setSegmentStartPointId] = useState<string | null>(null);
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const svgWidth = 650;
  const svgHeight = geom.figureHeight || 240;

  // Helper to commit geometry changes
  const updateGeometry = (updates: Partial<GeometryFigureData>) => {
    onUpdateContent({
      geometryData: {
        ...geom,
        ...updates,
      },
    });
  };

  // Convert client coordinate to SVG space
  const getSvgCoordinates = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  // Canvas Click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (readOnly || !isSelected) return;
    const { x, y } = getSvgCoordinates(e);

    if (activeTool === 'point') {
      const nextLetter = String.fromCharCode(65 + (geom.points.length % 26));
      const newPoint: GeometryPoint = {
        id: `p_${Date.now()}`,
        label: nextLetter,
        x,
        y,
        showLabel: true,
        labelPosition: 'top-right',
      };
      updateGeometry({ points: [...geom.points, newPoint] });
      setSelectedObjectId(newPoint.id);
    } else if (activeTool === 'select') {
      setSelectedObjectId(null);
      setSegmentStartPointId(null);
    }
  };

  // Point Click
  const handlePointClick = (e: React.MouseEvent, pointId: string) => {
    e.stopPropagation();
    if (readOnly || !isSelected) return;

    if (activeTool === 'segment') {
      if (!segmentStartPointId) {
        setSegmentStartPointId(pointId);
      } else if (segmentStartPointId !== pointId) {
        // Create segment
        const newSegment: GeometrySegment = {
          id: `seg_${Date.now()}`,
          from: segmentStartPointId,
          to: pointId,
          style: 'solid',
          strokeWidth: 2,
        };
        updateGeometry({ segments: [...geom.segments, newSegment] });
        setSegmentStartPointId(null);
      }
    } else if (activeTool === 'right_angle') {
      // Find two segments sharing this point to create right angle
      const connectedSegs = geom.segments.filter(
        (s) => s.from === pointId || s.to === pointId
      );
      if (connectedSegs.length >= 2) {
        const other1 = connectedSegs[0].from === pointId ? connectedSegs[0].to : connectedSegs[0].from;
        const other2 = connectedSegs[1].from === pointId ? connectedSegs[1].to : connectedSegs[1].from;
        const newAngle: GeometryAngle = {
          id: `ang_${Date.now()}`,
          vertex: pointId,
          arm1: other1,
          arm2: other2,
          isRightAngle: true,
        };
        updateGeometry({ angles: [...geom.angles, newAngle] });
      }
    } else {
      setSelectedObjectId(pointId);
    }
  };

  // Point Dragging
  const handlePointMouseDown = (e: React.MouseEvent, pointId: string) => {
    if (readOnly || !isSelected || activeTool !== 'select') return;
    e.stopPropagation();
    setDraggingPointId(pointId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingPointId || readOnly) return;
    const { x, y } = getSvgCoordinates(e);
    const boundedX = Math.max(20, Math.min(svgWidth - 20, x));
    const boundedY = Math.max(20, Math.min(svgHeight - 20, y));

    updateGeometry({
      points: geom.points.map((p) =>
        p.id === draggingPointId ? { ...p, x: boundedX, y: boundedY } : p
      ),
    });
  };

  const handleMouseUp = () => {
    setDraggingPointId(null);
  };

  // Smart Presets (Prompt Item 12)
  const applyPreset = (preset: 'right_triangle' | 'isosceles' | 'rectangle' | 'circle_radius') => {
    if (preset === 'right_triangle') {
      updateGeometry({
        points: [
          { id: 'p_A', label: 'A', x: 120, y: 190, showLabel: true },
          { id: 'p_B', label: 'B', x: 420, y: 190, showLabel: true },
          { id: 'p_C', label: 'C', x: 120, y: 50, showLabel: true },
        ],
        segments: [
          { id: 's_AB', from: 'p_A', to: 'p_B', style: 'solid', lengthLabel: 'AB = 6 cm', showLength: true },
          { id: 's_AC', from: 'p_A', to: 'p_C', style: 'solid', lengthLabel: 'AC = 4 cm', showLength: true },
          { id: 's_BC', from: 'p_B', to: 'p_C', style: 'solid', lengthLabel: 'BC = 7,2 cm', showLength: true },
        ],
        circles: [],
        angles: [{ id: 'ang_A', vertex: 'p_A', arm1: 'p_B', arm2: 'p_C', isRightAngle: true }],
      });
    } else if (preset === 'isosceles') {
      updateGeometry({
        points: [
          { id: 'p_A', label: 'A', x: 260, y: 40, showLabel: true },
          { id: 'p_B', label: 'B', x: 140, y: 190, showLabel: true },
          { id: 'p_C', label: 'C', x: 380, y: 190, showLabel: true },
        ],
        segments: [
          { id: 's_AB', from: 'p_A', to: 'p_B', style: 'solid', tickMarks: 2 },
          { id: 's_AC', from: 'p_A', to: 'p_C', style: 'solid', tickMarks: 2 },
          { id: 's_BC', from: 'p_B', to: 'p_C', style: 'solid', lengthLabel: 'BC = 5 cm', showLength: true },
        ],
        circles: [],
        angles: [],
      });
    } else if (preset === 'rectangle') {
      updateGeometry({
        points: [
          { id: 'p_A', label: 'A', x: 100, y: 50, showLabel: true },
          { id: 'p_B', label: 'B', x: 400, y: 50, showLabel: true },
          { id: 'p_C', label: 'C', x: 400, y: 180, showLabel: true },
          { id: 'p_D', label: 'D', x: 100, y: 180, showLabel: true },
        ],
        segments: [
          { id: 's_AB', from: 'p_A', to: 'p_B', style: 'solid', lengthLabel: '8 cm', showLength: true },
          { id: 's_BC', from: 'p_B', to: 'p_C', style: 'solid', lengthLabel: '4 cm', showLength: true },
          { id: 's_CD', from: 'p_C', to: 'p_D', style: 'solid' },
          { id: 's_DA', from: 'p_D', to: 'p_A', style: 'solid' },
        ],
        circles: [],
        angles: [{ id: 'ang_A', vertex: 'p_A', arm1: 'p_B', arm2: 'p_D', isRightAngle: true }],
      });
    } else if (preset === 'circle_radius') {
      updateGeometry({
        points: [
          { id: 'p_O', label: 'O', x: 250, y: 120, showLabel: true },
          { id: 'p_M', label: 'M', x: 350, y: 120, showLabel: true },
        ],
        segments: [
          { id: 's_OM', from: 'p_O', to: 'p_M', style: 'dashed', lengthLabel: 'r = 3 cm', showLength: true },
        ],
        circles: [{ id: 'c_main', center: 'p_O', radius: 100, style: 'solid' }],
        angles: [],
      });
    }
  };

  // Helper point coordinate getter
  const getPt = (id: string) => geom.points.find((p) => p.id === id);

  return (
    <div className="w-full flex flex-col select-none py-1">
      {/* Contextual Visual Toolbar (Only shown when block is selected) */}
      {isSelected && !readOnly && (
        <div className="w-full mb-2 p-1 bg-slate-900/90 text-white rounded-xl shadow-md flex items-center justify-between gap-1 text-xs backdrop-blur-xs print:hidden z-30">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTool('select')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeTool === 'select'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>Sélection</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('point')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeTool === 'point'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Dot className="w-4 h-4" />
              <span>Point</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('segment');
                setSegmentStartPointId(null);
              }}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeTool === 'segment'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Segment</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('right_angle')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeTool === 'right_angle'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Angle Droit</span>
            </button>
          </div>

          {/* Quick Presets Dropdown */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => applyPreset('right_triangle')}
              title="Générer un triangle rectangle avec angle droit"
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Triangle Rect.</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('isosceles')}
              title="Générer un triangle isocèle"
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer hidden sm:block"
            >
              Isocèle
            </button>
            <button
              type="button"
              onClick={() => applyPreset('rectangle')}
              title="Générer un rectangle"
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer hidden md:block"
            >
              Rectangle
            </button>
            <button
              type="button"
              onClick={() => applyPreset('circle_radius')}
              title="Générer un cercle avec rayon"
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 cursor-pointer hidden lg:block"
            >
              Cercle
            </button>
          </div>
        </div>
      )}

      {/* Main SVG Vector Canvas */}
      <div
        className={`w-full relative rounded-xl border overflow-hidden transition-all bg-white ${
          isSelected
            ? 'border-indigo-400 shadow-sm ring-1 ring-indigo-200'
            : 'border-slate-200/90 shadow-2xs'
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block select-none cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ maxHeight: `${svgHeight}px`, minHeight: '180px' }}
        >
          {/* Subtle Grid if enabled */}
          {geom.showGrid && (
            <defs>
              <pattern id="geom-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>
            </defs>
          )}
          {geom.showGrid && <rect width={svgWidth} height={svgHeight} fill="url(#geom-grid)" />}

          {/* Circles */}
          {geom.circles.map((c) => {
            const center = getPt(c.center);
            if (!center) return null;
            return (
              <circle
                key={c.id}
                cx={center.x}
                cy={center.y}
                r={c.radius}
                fill={c.fill || 'none'}
                stroke={c.color || '#1e293b'}
                strokeWidth={c.strokeWidth || 1.8}
                strokeDasharray={c.style === 'dashed' ? '5,5' : undefined}
              />
            );
          })}

          {/* Angles & Right-Angle square markers (Prompt Item 10) */}
          {geom.angles.map((ang) => {
            const v = getPt(ang.vertex);
            const a1 = getPt(ang.arm1);
            const a2 = getPt(ang.arm2);
            if (!v || !a1 || !a2) return null;

            if (ang.isRightAngle) {
              const d1 = Math.hypot(a1.x - v.x, a1.y - v.y) || 1;
              const d2 = Math.hypot(a2.x - v.x, a2.y - v.y) || 1;
              const size = 14;
              const u1x = ((a1.x - v.x) / d1) * size;
              const u1y = ((a1.y - v.y) / d1) * size;
              const u2x = ((a2.x - v.x) / d2) * size;
              const u2y = ((a2.y - v.y) / d2) * size;
              const p1x = v.x + u1x;
              const p1y = v.y + u1y;
              const p2x = v.x + u1x + u2x;
              const p2y = v.y + u1y + u2y;
              const p3x = v.x + u2x;
              const p3y = v.y + u2y;

              return (
                <path
                  key={ang.id}
                  d={`M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y}`}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="1.8"
                />
              );
            }
            return null;
          })}

          {/* Segments */}
          {geom.segments.map((seg) => {
            const from = getPt(seg.from);
            const to = getPt(seg.to);
            if (!from || !to) return null;
            const isSegSelected = selectedObjectId === seg.id;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={seg.id} onClick={(e) => { e.stopPropagation(); setSelectedObjectId(seg.id); }}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isSegSelected ? '#4f46e5' : seg.color || '#0f172a'}
                  strokeWidth={isSegSelected ? 3 : seg.strokeWidth || 2}
                  strokeDasharray={
                    seg.style === 'dashed'
                      ? '6,4'
                      : seg.style === 'dotted'
                      ? '2,3'
                      : undefined
                  }
                  strokeLinecap="round"
                />

                {/* Length Label if enabled */}
                {seg.showLength && seg.lengthLabel && (
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    fill="#334155"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="serif"
                    className="select-none"
                  >
                    {seg.lengthLabel}
                  </text>
                )}

                {/* Tick marks for equal length */}
                {Boolean(seg.tickMarks && seg.tickMarks > 0) && (
                  <circle cx={midX} cy={midY} r={3} fill="#0f172a" />
                )}
              </g>
            );
          })}

          {/* Points & Point Labels */}
          {geom.points.map((pt) => {
            const isPtSelected = selectedObjectId === pt.id;
            return (
              <g
                key={pt.id}
                onClick={(e) => handlePointClick(e, pt.id)}
                onMouseDown={(e) => handlePointMouseDown(e, pt.id)}
                className="cursor-pointer group"
              >
                {/* Hit area */}
                <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />

                {/* Visible Point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isPtSelected ? 5.5 : 4}
                  fill={isPtSelected ? '#4f46e5' : '#0f172a'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Point Label */}
                {pt.showLabel !== false && (
                  <text
                    x={pt.x + (isRtl ? -12 : 8)}
                    y={pt.y - 8}
                    fill="#0f172a"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="serif"
                    textAnchor={isRtl ? 'end' : 'start'}
                    className="select-none pointer-events-none"
                  >
                    {pt.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Informative footer bar for teacher */}
        {isSelected && !readOnly && (
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 print:hidden">
            <span>
              {activeTool === 'point'
                ? 'Cliquez pour ajouter un point.'
                : activeTool === 'segment'
                ? segmentStartPointId
                  ? 'Cliquez sur le second point pour relier le segment.'
                  : 'Cliquez sur le premier point du segment.'
                : 'Glissez les points pour déformer la figure en direct.'}
            </span>
            <span className="font-semibold text-indigo-600">
              {geom.points.length} points • {geom.segments.length} segments
            </span>
          </div>
        )}
      </div>

      {/* Caption */}
      {geom.caption && (
        <div className="mt-1.5 text-center text-xs text-slate-500 italic">
          <InlineMathText text={geom.caption} />
        </div>
      )}
    </div>
  );
};
