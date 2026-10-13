import React from 'react';
import { WorksheetBlock, MatchingItemData } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Plus, Trash2 } from 'lucide-react';

interface MatchingBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const MatchingBlockItem: React.FC<MatchingBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  const leftItems: MatchingItemData[] =
    c.matchingLeft && c.matchingLeft.length > 0
      ? c.matchingLeft
      : [
          { id: 'l1', text: isRtl ? 'المثلث المتطابق الأضلاع' : 'Triangle équilatéral' },
          { id: 'l2', text: isRtl ? 'المربع' : 'Carré' },
          { id: 'l3', text: isRtl ? 'الدائرة' : 'Cercle' },
        ];

  const rightItems: MatchingItemData[] =
    c.matchingRight && c.matchingRight.length > 0
      ? c.matchingRight
      : [
          { id: 'r1', text: isRtl ? 'له 4 أضلاع متقايسة و4 زوايا قائمة' : '4 côtés égaux et 4 angles droits' },
          { id: 'r2', text: isRtl ? 'ليس له أضلاع' : 'Aucun côté' },
          { id: 'r3', text: isRtl ? 'له 3 أضلاع متقايسة' : '3 côtés de même longueur' },
        ];

  const displayMode = c.matchingDisplayMode || 'lines';

  const handleUpdateLeft = (idx: number, text: string) => {
    const next = [...leftItems];
    next[idx] = { ...next[idx], text };
    onUpdateContent({ matchingLeft: next });
  };

  const handleUpdateRight = (idx: number, text: string) => {
    const next = [...rightItems];
    next[idx] = { ...next[idx], text };
    onUpdateContent({ matchingRight: next });
  };

  const handleAddPair = () => {
    const newLId = `l_${Date.now()}`;
    const newRId = `r_${Date.now()}`;
    onUpdateContent({
      matchingLeft: [...leftItems, { id: newLId, text: isRtl ? 'عنصر جديد' : 'Nouvel élément' }],
      matchingRight: [...rightItems, { id: newRId, text: isRtl ? 'وصف جديد' : 'Nouvelle description' }],
    });
  };

  const handleRemovePair = (idx: number) => {
    if (leftItems.length <= 1) return;
    const nextL = leftItems.filter((_, i) => i !== idx);
    const nextR = rightItems.filter((_, i) => i !== idx);
    onUpdateContent({ matchingLeft: nextL, matchingRight: nextR });
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex flex-col gap-3 py-1 select-none text-slate-800"
      style={{ fontFamily: defaultFont }}
    >
      <div className="w-full flex justify-between gap-6 relative">
        {/* Left Column (Items) */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="font-bold text-xs uppercase text-slate-500 pb-1 border-b border-slate-200">
            {isRtl ? 'العمود (أ)' : 'Colonne A'}
          </div>
          {leftItems.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 group/pair min-h-[36px]">
              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 border border-slate-200 rounded-lg p-1.5 bg-white shadow-2xs">
                <CoreRichTextField
                  value={item.text}
                  onChange={(val) => handleUpdateLeft(idx, val)}
                  readOnly={readOnly}
                  isSelected={isSelected}
                  isRtl={isRtl}
                  singleLine
                  className="text-xs font-semibold"
                />
              </div>
              <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500 bg-white shrink-0" />
            </div>
          ))}
        </div>

        {/* Space for drawing connection lines */}
        <div className="w-16 flex flex-col justify-center items-center text-slate-300 text-xs italic select-none">
          {displayMode === 'lines' && (
            <span className="text-[10px] text-slate-400 font-medium">
              {isRtl ? 'صل بسهم' : 'Relier'}
            </span>
          )}
        </div>

        {/* Right Column (Definitions/Matches) */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="font-bold text-xs uppercase text-slate-500 pb-1 border-b border-slate-200">
            {isRtl ? 'العمود (ب)' : 'Colonne B'}
          </div>
          {rightItems.map((item, idx) => {
            const letter = isRtl
              ? ['أ', 'ب', 'ج', 'د', 'هـ'][idx] || String(idx + 1)
              : ['A', 'B', 'C', 'D', 'E'][idx] || String(idx + 1);

            return (
              <div key={item.id} className="flex items-center gap-2 group/pair min-h-[36px]">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500 bg-white shrink-0" />
                <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {letter}
                </span>
                <div className="flex-1 border border-slate-200 rounded-lg p-1.5 bg-white shadow-2xs">
                  <CoreRichTextField
                    value={item.text}
                    onChange={(val) => handleUpdateRight(idx, val)}
                    readOnly={readOnly}
                    isSelected={isSelected}
                    isRtl={isRtl}
                    singleLine
                    className="text-xs font-medium"
                  />
                </div>
                {!readOnly && isSelected && leftItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePair(idx)}
                    title="Supprimer cette ligne"
                    className="opacity-0 group-hover/pair:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-opacity cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer notation if write_answer mode is active */}
      {displayMode === 'write_answer' && (
        <div className="pt-2 border-t border-slate-200 flex items-center justify-center gap-4 text-xs font-bold text-slate-600">
          {leftItems.map((_, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span>{idx + 1} →</span>
              <span className="w-8 border-b-2 border-slate-400 h-4 inline-block text-center" />
            </div>
          ))}
        </div>
      )}

      {/* Add pair button */}
      {!readOnly && isSelected && (
        <div className="pt-1">
          <button
            type="button"
            onClick={handleAddPair}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة عنصر للمطابقة' : '+ Ajouter un élément'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
