import React from 'react';
import { WorksheetBlock, ColumnSlotData } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Plus } from 'lucide-react';

interface ColumnsBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  renderChildBlock?: (child: WorksheetBlock, colIdx: number, blockIdx: number) => React.ReactNode;
}

export const ColumnsBlockItem: React.FC<ColumnsBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  const preset = c.columnsPreset || '50_50';
  const gap = c.columnsGap || 16;

  // Initialize columns data if empty
  const defaultCols: ColumnSlotData[] =
    c.columnsData && c.columnsData.length > 0
      ? c.columnsData
      : preset === '33_33_33'
      ? [
          { id: 'col_0', blocks: [] },
          { id: 'col_1', blocks: [] },
          { id: 'col_2', blocks: [] },
        ]
      : [
          {
            id: 'col_0',
            blocks: [
              {
                id: `b_${Date.now()}_1`,
                type: 'answer_box',
                x: 0,
                y: 0,
                width: 340,
                height: 100,
                content: {
                  answerBoxTitle: isRtl ? 'الطريقة 1' : 'Méthode 1',
                  answerBoxHeight: 100,
                },
                styles: {},
              },
            ],
          },
          {
            id: 'col_1',
            blocks: [
              {
                id: `b_${Date.now()}_2`,
                type: 'answer_box',
                x: 0,
                y: 0,
                width: 340,
                height: 100,
                content: {
                  answerBoxTitle: isRtl ? 'الطريقة 2' : 'Méthode 2',
                  answerBoxHeight: 100,
                },
                styles: {},
              },
            ],
          },
        ];

  const cols = defaultCols;

  const handleUpdateColText = (colIdx: number, bIdx: number, text: string) => {
    const next = [...cols];
    const targetBlock = next[colIdx]?.blocks[bIdx];
    if (targetBlock) {
      targetBlock.content = { ...targetBlock.content, text };
      onUpdateContent({ columnsData: next });
    }
  };

  const handleAddBoxToCol = (colIdx: number) => {
    const next = [...cols];
    const newBlock: WorksheetBlock = {
      id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'answer_box',
      x: 0,
      y: 0,
      width: 340,
      height: 90,
      content: {
        answerBoxTitle: isRtl ? 'منطقة إجابة' : 'Zone de travail',
        answerBoxHeight: 90,
      },
      styles: {},
    };
    next[colIdx].blocks = [...(next[colIdx].blocks || []), newBlock];
    onUpdateContent({ columnsData: next });
  };

  // Determine column width proportions
  const getColWidthClass = (idx: number) => {
    if (preset === '33_33_33') return 'flex-1';
    if (preset === '40_60') return idx === 0 ? 'w-[40%]' : 'w-[60%]';
    if (preset === '60_40') return idx === 0 ? 'w-[60%]' : 'w-[40%]' ;
    return 'flex-1'; // 50_50
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex py-1 select-none text-slate-800"
      style={{
        fontFamily: defaultFont,
        gap: `${gap}px`,
      }}
    >
      {cols.map((col, colIdx) => (
        <div
          key={col.id}
          className={`${getColWidthClass(colIdx)} flex flex-col gap-2 min-h-[90px] border border-dashed border-slate-300/80 rounded-xl p-2.5 bg-slate-50/30`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>{isRtl ? `عمود ${colIdx + 1}` : `Colonne ${colIdx + 1}`}</span>
          </div>

          {/* Child blocks in this column */}
          <div className="flex flex-col gap-2 flex-1">
            {col.blocks.map((childBlock, bIdx) => (
              <div
                key={childBlock.id}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 shadow-2xs relative"
              >
                {childBlock.content?.answerBoxTitle !== undefined && (
                  <div className="mb-1 text-xs font-bold text-slate-700 bg-slate-100 rounded px-1.5 py-0.5 inline-block">
                    <CoreRichTextField
                      value={childBlock.content.answerBoxTitle || ''}
                      onChange={(val) => {
                        const next = [...cols];
                        next[colIdx].blocks[bIdx].content.answerBoxTitle = val;
                        onUpdateContent({ columnsData: next });
                      }}
                      readOnly={readOnly}
                      isSelected={isSelected}
                      isRtl={isRtl}
                      singleLine
                      className="text-xs font-bold"
                    />
                  </div>
                )}
                <div className="min-h-[48px] text-xs">
                  <CoreRichTextField
                    value={childBlock.content?.text || ''}
                    placeholder={isRtl ? 'أدخل المحتوى هنا...' : 'Écrire ou formuler dans cette colonne...'}
                    onChange={(val) => handleUpdateColText(colIdx, bIdx, val)}
                    readOnly={readOnly}
                    isSelected={isSelected}
                    isRtl={isRtl}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add block to column button */}
          {!readOnly && isSelected && (
            <button
              type="button"
              onClick={() => handleAddBoxToCol(colIdx)}
              className="mt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/80 py-1 rounded transition-colors cursor-pointer border border-dashed border-indigo-200"
            >
              <Plus className="w-3 h-3" />
              <span>{isRtl ? 'إضافة إطار' : '+ Cadre'}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
