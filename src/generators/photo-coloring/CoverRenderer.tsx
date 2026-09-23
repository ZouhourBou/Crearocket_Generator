import React from 'react';
import {
  ColoringBookCoverConfig,
  ColoringPaperFormat,
} from '../../types/coloring';
import { Sparkles, Heart, Star, Compass, Palette } from 'lucide-react';

interface Props {
  cover: ColoringBookCoverConfig;
  paperFormat: ColoringPaperFormat;
  illustrationSampleUrl?: string;
  widthMm?: number;
  heightMm?: number;
}

export const CoverRenderer: React.FC<Props> = ({
  cover,
  paperFormat,
  illustrationSampleUrl,
}) => {
  const { childName, title, subtitle, age, dedication, date, template, fontTheme } = cover;

  // Font class selection
  const fontTitleClass =
    fontTheme === 'playful'
      ? 'font-extrabold tracking-wide'
      : fontTheme === 'elegant'
      ? 'font-serif italic tracking-normal'
      : fontTheme === 'storybook'
      ? 'font-serif font-black tracking-tight'
      : 'font-sans font-bold tracking-tight';

  return (
    <div className="w-full h-full bg-white relative flex flex-col justify-between p-8 sm:p-12 border-12 border-slate-900 rounded-sm text-center select-none overflow-hidden box-border">
      {/* Outer Decorative Line Inset */}
      <div className="absolute inset-2 border-2 border-dashed border-slate-400 pointer-events-none rounded-xs" />

      {/* Decorative Corner Ornaments */}
      <div className="absolute top-4 left-4 text-slate-800">
        <Star className="w-6 h-6 fill-slate-800" />
      </div>
      <div className="absolute top-4 right-4 text-slate-800">
        <Star className="w-6 h-6 fill-slate-800" />
      </div>
      <div className="absolute bottom-4 left-4 text-slate-800">
        <Heart className="w-6 h-6 fill-slate-800" />
      </div>
      <div className="absolute bottom-4 right-4 text-slate-800">
        <Heart className="w-6 h-6 fill-slate-800" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-4">
        {subtitle && (
          <p className="text-xs uppercase font-extrabold tracking-widest text-slate-600 mb-2">
            {subtitle}
          </p>
        )}
        <h1 className={`text-2xl sm:text-3xl text-slate-900 uppercase ${fontTitleClass}`}>
          {title || 'Mon Cahier de Coloriage Magique'}
        </h1>
        {childName && (
          <div className="mt-2 inline-block px-4 py-1.5 border-2 border-slate-900 rounded-full bg-slate-50 font-black text-lg text-slate-900 shadow-2xs">
            ★ {childName} {age ? `(${age})` : ''} ★
          </div>
        )}
      </div>

      {/* Centerpiece Illustration Frame ready to color */}
      <div className="relative z-10 my-4 flex-1 flex flex-col items-center justify-center">
        <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl border-4 border-slate-900 overflow-hidden bg-slate-50 shadow-sm flex items-center justify-center p-2 relative group">
          {illustrationSampleUrl ? (
            <img
              src={illustrationSampleUrl}
              alt="Cover art preview"
              className="w-full h-full object-contain filter contrast-125"
            />
          ) : (
            <div className="text-center p-4">
              <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">
                Illustration de couverture
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                La première photo convertie apparaîtra ici
              </p>
            </div>
          )}

          {/* Color me banner */}
          <div className="absolute bottom-2 bg-white/90 backdrop-blur-xs border border-slate-800 text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
            À COLORIER
          </div>
        </div>
      </div>

      {/* Footer & Dedication */}
      <div className="relative z-10 pb-2">
        {dedication && (
          <p className="text-xs italic text-slate-600 max-w-md mx-auto mb-2">
            « {dedication} »
          </p>
        )}
        {date && (
          <p className="text-[11px] font-semibold text-slate-500">
            Édition spéciale — {date}
          </p>
        )}
        <div className="mt-2 text-[9px] uppercase tracking-widest text-slate-400 font-bold">
          CreatRocket Studio • Collection Privée
        </div>
      </div>
    </div>
  );
};
