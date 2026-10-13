import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Plus, Trash2 } from 'lucide-react';

interface OrderingBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const OrderingBlockItem: React.FC<OrderingBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  const items: { id: string; text: string }[] =
    c.orderingItems && c.orderingItems.length > 0
      ? c.orderingItems
      : [
          { id: 'it_1', text: '$\\frac{3}{4}$' },
          { id: 'it_2', text: '$-2,5$' },
          { id: 'it_3', text: '$\\sqrt{9}$' },
          { id: 'it_4', text: '$0,75$' },
        ];

  const handleUpdateItem = (idx: number, text: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], text };
    onUpdateContent({ orderingItems: next });
  };

  const handleAddItem = () => {
    const newId = `it_${Date.now()}`;
    onUpdateContent({
      orderingItems: [...items, { id: newId, text: isRtl ? '$0$' : '$1$' }],
    });
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    const next = items.filter((_, i) => i !== idx);
    onUpdateContent({ orderingItems: next });
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex flex-col gap-3 py-1.5 select-none text-slate-800"
      style={{ fontFamily: defaultFont }}
    >
      {/* Items list displayed as badges/cards to order */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50/70 border border-slate-200 rounded-xl">
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">
          {isRtl ? 'العناصر :' : 'Éléments :'}
        </span>
        {items.map((it, idx) => (
          <div
            key={it.id}
            className="group/item flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-2xs"
          >
            <div className="min-w-[40px]">
              <CoreRichTextField
                value={it.text}
                onChange={(val) => handleUpdateItem(idx, val)}
                readOnly={readOnly}
                isSelected={isSelected}
                isRtl={isRtl}
                singleLine
                className="text-xs font-bold text-center"
              />
            </div>
            {!readOnly && isSelected && items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                title="Supprimer"
                className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {!readOnly && isSelected && (
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة' : '+'}</span>
          </button>
        )}
      </div>

      {/* Answer Area with comparison symbols */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs font-bold text-slate-600">
          {isRtl ? 'الترتيب :' : 'Réponse :'}
        </span>
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          {items.map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="w-16 border-b-2 border-dotted border-slate-500 h-5 inline-block text-center" />
              {idx < items.length - 1 && (
                <span className="text-xs font-bold text-slate-400">
                  {isRtl ? '≥' : '<'}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
