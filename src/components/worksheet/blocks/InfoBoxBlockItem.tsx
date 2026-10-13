import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Lightbulb, Bookmark, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

interface InfoBoxBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const InfoBoxBlockItem: React.FC<InfoBoxBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const boxType = c.infoBoxType || 'reminder';

  const defaultTitle =
    c.infoBoxTitle ??
    (boxType === 'formula'
      ? isRtl ? 'خاصية / صيغة رياضية' : 'Formule & Propriété'
      : boxType === 'note'
      ? isRtl ? 'ملاحظة' : 'Remarque'
      : boxType === 'warning'
      ? isRtl ? 'تنبيه مهم' : 'Attention'
      : boxType === 'method'
      ? isRtl ? 'طريقة الحل' : 'Méthode'
      : isRtl ? 'تذكير' : 'Rappel');

  const themeStyles = {
    reminder: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-300',
      headerText: 'text-amber-900',
      icon: Lightbulb,
    },
    formula: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-300',
      headerText: 'text-indigo-900',
      icon: Sparkles,
    },
    note: {
      bg: 'bg-slate-50/80',
      border: 'border-slate-300',
      headerText: 'text-slate-800',
      icon: Bookmark,
    },
    warning: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-300',
      headerText: 'text-rose-900',
      icon: AlertTriangle,
    },
    method: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-300',
      headerText: 'text-emerald-900',
      icon: BookOpen,
    },
  }[boxType] || {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    headerText: 'text-slate-800',
    icon: Bookmark,
  };

  const IconComp = themeStyles.icon;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full rounded-xl border p-3 select-none transition-all ${themeStyles.bg} ${themeStyles.border}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5 border-b border-black/5 pb-1">
        <IconComp className={`w-4 h-4 ${themeStyles.headerText}`} />
        <div className="flex-1">
          <CoreRichTextField
            value={defaultTitle}
            onChange={(title) => onUpdateContent({ infoBoxTitle: title })}
            readOnly={readOnly}
            isSelected={isSelected}
            isRtl={isRtl}
            singleLine
            className={`font-bold text-xs uppercase tracking-wide ${themeStyles.headerText}`}
          />
        </div>
      </div>

      <div className="text-sm">
        <CoreRichTextField
          value={
            c.text ||
            (isRtl
              ? 'تذكير : لكل عددين حقيقيين $a$ و $b$، $(a+b)^2 = a^2 + 2ab + b^2$'
              : 'Pour tous réels $a$ et $b$ : $(a+b)^2 = a^2 + 2ab + b^2$')
          }
          onChange={(newText) => onUpdateContent({ text: newText })}
          readOnly={readOnly}
          isSelected={isSelected}
          isRtl={isRtl}
          styles={block.styles}
          onUpdateStyles={onUpdateStyles}
        />
      </div>
    </div>
  );
};
