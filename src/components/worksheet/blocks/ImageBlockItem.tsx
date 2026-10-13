import React, { useRef, useState } from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import {
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Lock,
  Unlock,
} from 'lucide-react';
import { InlineMathText } from './InlineMathText';

interface ImageBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
}

export const ImageBlockItem: React.FC<ImageBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const c = block.content;
  const s = block.styles;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  const src = c.src || '';
  const alt = c.alt || 'Illustration pédagogique';
  const widthPercent = c.imageWidthPercent ?? 80;
  const alignment = c.imageAlignment || 'center';
  const fitMode = c.fitMode || 'contain';
  const showCaption = c.showCaption !== false;
  const captionText = c.captionText ?? 'Figure 1 — Illustration';
  const isAspectRatioLocked = c.aspectRatioLocked !== false;

  // Print DPI estimation: if naturalWidth < 400 and width > 400px, warning
  const isLowResolution =
    Boolean(src && c.naturalWidth && c.naturalWidth < 400 && widthPercent > 60);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, JPEG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        onUpdateContent({
          src: dataUrl,
          alt: file.name,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
        if (onUpdateHeight) {
          const calculatedH = Math.min(420, Math.max(160, Math.round((img.naturalHeight / img.naturalWidth) * 500)));
          onUpdateHeight(calculatedH + 40);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const alignClass =
    alignment === 'left'
      ? 'justify-start'
      : alignment === 'right'
      ? 'justify-end'
      : 'justify-center';

  return (
    <div className="w-full flex flex-col select-none py-1.5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Image Container */}
      <div className={`w-full flex ${alignClass}`}>
        <div
          style={{ width: `${widthPercent}%` }}
          className="relative group transition-all"
        >
          {src ? (
            <div
              className={`relative overflow-hidden transition-all ${
                s.borderWidth ? 'border' : ''
              }`}
              style={{
                borderColor: s.borderColor || '#cbd5e1',
                borderWidth: s.borderWidth ? `${s.borderWidth}px` : undefined,
                borderRadius: `${s.borderRadius ?? 8}px`,
                backgroundColor: s.backgroundColor || '#f8fafc',
              }}
            >
              <img
                src={src}
                alt={alt}
                style={{
                  maxHeight: `${block.height ? block.height - 40 : 280}px`,
                  objectFit: fitMode,
                }}
                className="w-full h-auto block select-none pointer-events-none"
                loading="eager"
              />

              {/* Discreet Print Quality Warning Badge (Prompt Item 7) */}
              {isLowResolution && !readOnly && (
                <div
                  title="Résolution faible pour l'impression haute définition (conseillé: > 150 DPI)"
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs print:hidden"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Qualité d'impression faible</span>
                </div>
              )}

              {/* Hover quick action to change image */}
              {isSelected && !readOnly && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all cursor-pointer opacity-0 group-hover:opacity-100 print:hidden"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Remplacer</span>
                </button>
              )}
            </div>
          ) : (
            /* Upload Placeholder */
            <div
              onClick={() => !readOnly && fileInputRef.current?.click()}
              className={`w-full min-h-[160px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${
                isSelected
                  ? 'border-indigo-400 bg-indigo-50/40 text-indigo-700'
                  : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 text-slate-500'
              } ${readOnly ? '' : 'cursor-pointer'}`}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                Cliquez pour importer une image
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPEG, WebP ou SVG (figure, schéma, document scientifique)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Caption with RichText/Math support (Prompt Item 8) */}
      {showCaption && (
        <div
          className={`mt-2 text-xs text-slate-600 flex ${alignClass}`}
          dir="auto"
        >
          <div
            style={{ width: `${widthPercent}%` }}
            className={`text-${alignment} italic px-1`}
          >
            {isEditingCaption && isSelected && !readOnly ? (
              <input
                type="text"
                value={captionText}
                autoFocus
                onBlur={() => setIsEditingCaption(false)}
                onChange={(e) => onUpdateContent({ captionText: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingCaption(false);
                }}
                className="w-full bg-white border border-indigo-300 rounded px-2 py-0.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder="Légende de la figure..."
              />
            ) : (
              <div
                onClick={() => isSelected && !readOnly && setIsEditingCaption(true)}
                title={isSelected && !readOnly ? 'Cliquer pour modifier la légende' : undefined}
                className="cursor-text"
              >
                <InlineMathText text={captionText} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
