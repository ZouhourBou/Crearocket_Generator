import React, { useState, useRef, useEffect } from 'react';
import { WorksheetBlock, FillInBlanksLine } from '../../../types/worksheet';
import { InlineMathText } from './InlineMathText';
import { InlineMathToolbar } from './InlineMathToolbar';
import { Plus, Trash2, Copy } from 'lucide-react';
import { resolveBlockDirection } from '../../../utils/textDirection';

interface FillInBlanksBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdate: (updates: Partial<WorksheetBlock>) => void;
  documentDefaultDirection?: 'auto' | 'ltr' | 'rtl';
}

export const FillInBlanksBlockItem: React.FC<FillInBlanksBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdate,
  documentDefaultDirection = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);

  // Content extract
  const content = block.content || {};
  const blankStyle = content.blankStyle || 'solid';
  const blankThickness = content.blankThickness !== undefined ? content.blankThickness : 1.5;
  const blankLengthPreset = content.blankLengthPreset || 'medium';
  const numberingStyle = content.numberingStyle || 'numbers';
  const lineSpacing = content.lineSpacing !== undefined ? content.lineSpacing : 12;

  // Lines
  const lines: FillInBlanksLine[] =
    content.lines && content.lines.length > 0
      ? content.lines
      : [
          {
            id: 'line_1',
            text: '\\frac{8}{5} \\times ___ = \\frac{___}{___}',
          },
          {
            id: 'line_2',
            text: '13⁴ \\times 13⁹ = 13^{___}',
          },
          {
            id: 'line_3',
            text: '___ \\div 4 = 12',
          },
        ];

  // Styles extract
  const styles = block.styles || {};
  const fontSize = styles.fontSize || 15;
  const textColor = styles.color || '#0f172a';
  const textAlign = styles.textAlign || 'left';

  // Text direction
  const textDirection = styles.textDirection || 'auto';
  const sample = lines.map((l) => l.text).join(' ');
  const effectiveDirection = resolveBlockDirection(textDirection, sample, documentDefaultDirection);
  const isRtl = effectiveDirection === 'rtl';
  const fontFamily = styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  // Dynamic height adjustment
  useEffect(() => {
    if (containerRef.current) {
      const measuredHeight = Math.ceil(containerRef.current.scrollHeight);
      if (Math.abs(measuredHeight - block.height) > 4 && measuredHeight > 30) {
        onUpdate({ height: measuredHeight });
      }
    }
  }, [lines, lineSpacing, fontSize, activeLineId]);

  const updateContent = (partial: Partial<WorksheetBlock['content']>) => {
    onUpdate({
      content: {
        ...block.content,
        ...partial,
      },
    });
  };

  // Line operations
  const handleUpdateLineText = (lineId: string, newText: string) => {
    const updated = lines.map((l) => (l.id === lineId ? { ...l, text: newText } : l));
    updateContent({ lines: updated });
  };

  const handleAddLine = () => {
    const newLine: FillInBlanksLine = {
      id: `line_${Date.now()}`,
      text: '___ = ___',
    };
    updateContent({ lines: [...lines, newLine] });
    setActiveLineId(newLine.id);
  };

  const handleDuplicateLine = (lineId: string) => {
    const idx = lines.findIndex((l) => l.id === lineId);
    if (idx === -1) return;
    const target = lines[idx];
    const duplicated: FillInBlanksLine = {
      id: `line_${Date.now()}`,
      text: target.text,
    };
    const newLines = [...lines];
    newLines.splice(idx + 1, 0, duplicated);
    updateContent({ lines: newLines });
  };

  const handleDeleteLine = (lineId: string) => {
    if (lines.length <= 1) return;
    const updated = lines.filter((l) => l.id !== lineId);
    updateContent({ lines: updated });
    if (activeLineId === lineId) {
      setActiveLineId(null);
    }
  };

  const handleInsertSymbol = (symbol: string) => {
    if (!activeLineId) return;
    const line = lines.find((l) => l.id === activeLineId);
    if (!line) return;
    handleUpdateLineText(activeLineId, (line.text || '') + symbol);
  };

  // Line prefix: 1), a), or none
  const getLinePrefix = (index: number) => {
    if (numberingStyle === 'none') return '';
    if (numberingStyle === 'letters') {
      const letter = String.fromCharCode(97 + (index % 26)); // a, b, c...
      return `${letter})`;
    }
    return `${index + 1})`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full text-slate-900 select-text"
      style={{
        color: textColor,
        fontFamily,
      }}
      dir={effectiveDirection}
    >
      {/* Math symbols floating helper bar if editing */}
      {!readOnly && isSelected && activeLineId && (
        <div className="mb-2">
          <InlineMathToolbar
            onInsertSymbol={handleInsertSymbol}
            showBlankShortcuts={true}
          />
        </div>
      )}

      {/* Lines list */}
      <div className="flex flex-col" style={{ gap: `${lineSpacing}px` }}>
        {lines.map((line, idx) => {
          const isActive = activeLineId === line.id;
          const prefix = getLinePrefix(idx);

          return (
            <div
              key={line.id}
              className="relative group/line flex items-center gap-2 py-1 px-1.5 rounded-lg transition-colors hover:bg-slate-50/70"
              dir={effectiveDirection}
            >
              {/* Line numbering */}
              {prefix && (
                <span
                  className="font-bold text-slate-800 shrink-0 select-none min-w-[20px]"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {prefix}
                </span>
              )}

              {/* Text and Blanks */}
              <div className="flex-1 min-w-0" dir={effectiveDirection}>
                {readOnly ? (
                  <div
                    className="leading-relaxed"
                    style={{
                      fontSize: `${fontSize}px`,
                      textAlign: textAlign as any,
                    }}
                  >
                    <InlineMathText
                      text={line.text}
                      blankStyle={blankStyle}
                      blankThickness={blankThickness}
                      blankLengthPreset={blankLengthPreset}
                    />
                  </div>
                ) : isActive ? (
                  <div className="flex flex-col gap-1 w-full">
                    <input
                      type="text"
                      value={line.text}
                      onChange={(e) => handleUpdateLineText(line.id, e.target.value)}
                      onFocus={() => setActiveLineId(line.id)}
                      onBlur={() => {
                        // Small timeout to allow clicking buttons on toolbar
                        setTimeout(() => {
                          setActiveLineId((curr) => (curr === line.id ? null : curr));
                        }, 250);
                      }}
                      autoFocus
                      placeholder="Tapez le texte... utilisez '___' pour un trou souligné (ex: 8/5 × ___ = 1)"
                      className="w-full bg-white border border-indigo-400 rounded px-2 py-1 outline-none shadow-2xs text-sm"
                      style={{
                        fontSize: `${fontSize}px`,
                      }}
                      dir={effectiveDirection}
                    />
                    {/* Inline helper shortcuts */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Ajouter trou :
                      </span>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleUpdateLineText(line.id, line.text + ' ___ ');
                        }}
                        className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer font-medium"
                      >
                        Court (___)
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleUpdateLineText(line.id, line.text + ' ______ ');
                        }}
                        className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer font-medium"
                      >
                        Moyen (______)
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleUpdateLineText(line.id, line.text + ' _________ ');
                        }}
                        className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer font-medium"
                      >
                        Long (_________)
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleUpdateLineText(line.id, line.text + ' \\frac{___}{___} ');
                        }}
                        className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer font-medium"
                      >
                        Fraction à trous \frac&#123;___&#125;&#123;___&#125;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setActiveLineId(line.id)}
                    className="cursor-text hover:bg-indigo-50/40 rounded px-1.5 py-0.5 min-h-[26px] leading-relaxed transition-colors border border-transparent hover:border-indigo-200"
                    style={{
                      fontSize: `${fontSize}px`,
                      textAlign: textAlign as any,
                    }}
                  >
                    {line.text ? (
                      <InlineMathText
                        text={line.text}
                        blankStyle={blankStyle}
                        blankThickness={blankThickness}
                        blankLengthPreset={blankLengthPreset}
                      />
                    ) : (
                      <span className="text-slate-400 italic">
                        Cliquer pour saisir la ligne à compléter…
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Line Actions (Duplicate / Delete) */}
              {!readOnly && (
                <div className="opacity-0 group-hover/line:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleDuplicateLine(line.id)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                    title="Dupliquer cette ligne"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLine(line.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Supprimer cette ligne"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Line button */}
      {!readOnly && (
        <div className="mt-2 pt-1 border-t border-dashed border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleAddLine}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer border border-indigo-200/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une ligne</span>
          </button>
          <span className="text-[10px] text-slate-400">
            {lines.length} ligne{lines.length > 1 ? 's' : ''} à compléter
          </span>
        </div>
      )}
    </div>
  );
};
