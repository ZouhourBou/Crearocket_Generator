import React, { useState, useRef } from 'react';
import {
  WorksheetBlock,
  DiagramData,
  DiagramNode,
  DiagramConnector,
} from '../../../types/worksheet';
import { Plus, ArrowRight, Trash2, Move, Sparkles } from 'lucide-react';
import { InlineMathText } from './InlineMathText';

interface DiagramBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
}

export const DiagramBlockItem: React.FC<DiagramBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const c = block.content;

  const defaultDiagram: DiagramData = {
    nodes: [
      { id: 'node_1', x: 60, y: 70, width: 130, height: 46, label: 'Hypothèse', shape: 'rounded', fillColor: '#f1f5f9', strokeColor: '#64748b' },
      { id: 'node_2', x: 260, y: 70, width: 140, height: 46, label: 'Propriété / Théorème', shape: 'box', fillColor: '#eff6ff', strokeColor: '#3b82f6' },
      { id: 'node_3', x: 470, y: 70, width: 130, height: 46, label: 'Conclusion', shape: 'rounded', fillColor: '#f0fdf4', strokeColor: '#22c55e' },
    ],
    connectors: [
      { id: 'conn_1_2', fromNodeId: 'node_1', toNodeId: 'node_2', arrowEnd: true },
      { id: 'conn_2_3', fromNodeId: 'node_2', toNodeId: 'node_3', arrowEnd: true },
    ],
    diagramHeight: 200,
    caption: 'Schéma de démonstration mathématique',
  };

  const diagram: DiagramData = c.diagramData || defaultDiagram;
  const height = diagram.diagramHeight || 200;
  const width = 650;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const updateDiagram = (updates: Partial<DiagramData>) => {
    onUpdateContent({
      diagramData: {
        ...diagram,
        ...updates,
      },
    });
  };

  // Node Dragging inside bounded local canvas
  const handleNodeMouseDown = (e: React.MouseEvent, node: DiagramNode) => {
    if (readOnly || !isSelected) return;
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      setDragOffset({
        x: (e.clientX - rect.left) * scaleX - node.x,
        y: (e.clientY - rect.top) * scaleY - node.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || readOnly || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const curX = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const curY = (e.clientY - rect.top) * scaleY - dragOffset.y;

    const node = diagram.nodes.find((n) => n.id === draggingNodeId);
    const nodeW = node?.width || 120;
    const nodeH = node?.height || 40;

    const boundedX = Math.max(10, Math.min(width - nodeW - 10, curX));
    const boundedY = Math.max(10, Math.min(height - nodeH - 10, curY));

    updateDiagram({
      nodes: diagram.nodes.map((n) =>
        n.id === draggingNodeId ? { ...n, x: Math.round(boundedX), y: Math.round(boundedY) } : n
      ),
    });
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Add new node
  const handleAddNode = () => {
    const newNode: DiagramNode = {
      id: `node_${Date.now()}`,
      x: 100 + (diagram.nodes.length % 5) * 40,
      y: 50 + (diagram.nodes.length % 3) * 40,
      width: 120,
      height: 44,
      label: `Étape ${diagram.nodes.length + 1}`,
      shape: 'rounded',
      fillColor: '#f8fafc',
      strokeColor: '#64748b',
    };
    updateDiagram({ nodes: [...diagram.nodes, newNode] });
    setSelectedNodeId(newNode.id);
  };

  // Connect selected node to another
  const handleConnect = () => {
    if (diagram.nodes.length < 2) return;
    const fromId = selectedNodeId || diagram.nodes[0].id;
    const otherNodes = diagram.nodes.filter((n) => n.id !== fromId);
    if (otherNodes.length === 0) return;
    const toId = otherNodes[0].id;

    const newConn: DiagramConnector = {
      id: `conn_${Date.now()}`,
      fromNodeId: fromId,
      toNodeId: toId,
      arrowEnd: true,
      style: 'solid',
    };
    updateDiagram({ connectors: [...diagram.connectors, newConn] });
  };

  // Delete selected node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    updateDiagram({
      nodes: diagram.nodes.filter((n) => n.id !== selectedNodeId),
      connectors: diagram.connectors.filter(
        (c) => c.fromNodeId !== selectedNodeId && c.toNodeId !== selectedNodeId
      ),
    });
    setSelectedNodeId(null);
  };

  return (
    <div className="w-full flex flex-col select-none py-1">
      {/* Contextual Toolbar for Diagram */}
      {isSelected && !readOnly && (
        <div className="w-full mb-2 p-1.5 bg-slate-900/90 text-white rounded-xl shadow-md flex items-center justify-between text-xs backdrop-blur-xs print:hidden z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNode}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une boîte</span>
            </button>
            <button
              type="button"
              onClick={handleConnect}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              <span>Relier (Flèche)</span>
            </button>
          </div>

          {selectedNodeId && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="p-1 rounded-lg text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
              title="Supprimer la boîte sélectionnée"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Bounded Local Canvas Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ height: `${height}px` }}
        className={`w-full relative rounded-xl border overflow-hidden bg-white ${
          isSelected
            ? 'border-indigo-400 shadow-sm ring-1 ring-indigo-200'
            : 'border-slate-200/90 shadow-2xs'
        }`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full block select-none pointer-events-none"
        >
          <defs>
            <marker
              id="arrow-end"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
            </marker>
          </defs>

          {/* Connectors / Arrows */}
          {diagram.connectors.map((conn) => {
            const n1 = diagram.nodes.find((n) => n.id === conn.fromNodeId);
            const n2 = diagram.nodes.find((n) => n.id === conn.toNodeId);
            if (!n1 || !n2) return null;

            const x1 = n1.x + n1.width;
            const y1 = n1.y + n1.height / 2;
            const x2 = n2.x;
            const y2 = n2.y + n2.height / 2;

            return (
              <line
                key={conn.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray={conn.style === 'dashed' ? '5,4' : undefined}
                markerEnd={conn.arrowEnd !== false ? 'url(#arrow-end)' : undefined}
              />
            );
          })}
        </svg>

        {/* Nodes (Bounded interactive elements) */}
        {diagram.nodes.map((node) => {
          const isNodeSelected = selectedNodeId === node.id;
          const isEditing = editingNodeId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              onDoubleClick={() => {
                if (!readOnly) {
                  setEditingNodeId(node.id);
                  setEditingText(node.label);
                }
              }}
              style={{
                left: `${(node.x / width) * 100}%`,
                top: `${(node.y / height) * 100}%`,
                width: `${(node.width / width) * 100}%`,
                height: `${(node.height / height) * 100}%`,
                backgroundColor: node.fillColor || '#f8fafc',
                borderColor: isNodeSelected ? '#4f46e5' : node.strokeColor || '#64748b',
                borderRadius: node.shape === 'pill' ? '999px' : node.shape === 'rounded' ? '10px' : '4px',
              }}
              className={`absolute border-2 flex items-center justify-center p-2 text-center text-xs font-bold text-slate-800 transition-shadow ${
                isNodeSelected ? 'shadow-md ring-2 ring-indigo-300' : 'shadow-2xs'
              } ${readOnly ? '' : 'cursor-grab active:cursor-grabbing'}`}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editingText}
                  autoFocus
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => {
                    updateDiagram({
                      nodes: diagram.nodes.map((n) =>
                        n.id === node.id ? { ...n, label: editingText } : n
                      ),
                    });
                    setEditingNodeId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateDiagram({
                        nodes: diagram.nodes.map((n) =>
                          n.id === node.id ? { ...n, label: editingText } : n
                        ),
                      });
                      setEditingNodeId(null);
                    }
                  }}
                  className="w-full bg-white text-xs text-center border border-indigo-400 rounded px-1 py-0.5 outline-none"
                />
              ) : (
                <span className="truncate select-none pointer-events-none">
                  {node.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Caption */}
      {diagram.caption && (
        <div className="mt-1.5 text-center text-xs text-slate-500 italic">
          <InlineMathText text={diagram.caption} />
        </div>
      )}
    </div>
  );
};
