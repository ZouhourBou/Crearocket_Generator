import React from 'react';
import { UploadedPhoto, ColoringPaperFormat } from '../../types/coloring';
import { Star, Heart } from 'lucide-react';

interface Props {
  photo: UploadedPhoto;
  pageNumber: number;
  totalPages: number;
  paperFormat: ColoringPaperFormat;
  showDecorativeFrame: boolean;
  frameStyle: 'playful_stars' | 'floral_delight' | 'cute_doodles' | 'minimalist' | 'none';
  showPageNumbers: boolean;
  showPageTitle: boolean;
}

export const ColoringPageRenderer: React.FC<Props> = ({
  photo,
  pageNumber,
  totalPages,
  showDecorativeFrame,
  frameStyle,
  showPageNumbers,
  showPageTitle,
}) => {
  return (
    <div className="w-full h-full bg-white relative flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden box-border">
      {/* Decorative Frame */}
      {showDecorativeFrame && frameStyle !== 'none' && (
        <div className="absolute inset-4 pointer-events-none rounded-xl border-3 border-slate-900">
          {frameStyle === 'playful_stars' && (
            <>
              <Star className="w-4 h-4 fill-slate-900 text-slate-900 absolute -top-2 -left-2" />
              <Star className="w-4 h-4 fill-slate-900 text-slate-900 absolute -top-2 -right-2" />
              <Star className="w-4 h-4 fill-slate-900 text-slate-900 absolute -bottom-2 -left-2" />
              <Star className="w-4 h-4 fill-slate-900 text-slate-900 absolute -bottom-2 -right-2" />
            </>
          )}
          {frameStyle === 'floral_delight' && (
            <>
              <Heart className="w-4 h-4 fill-slate-900 text-slate-900 absolute -top-2 -left-2" />
              <Heart className="w-4 h-4 fill-slate-900 text-slate-900 absolute -top-2 -right-2" />
              <Heart className="w-4 h-4 fill-slate-900 text-slate-900 absolute -bottom-2 -left-2" />
              <Heart className="w-4 h-4 fill-slate-900 text-slate-900 absolute -bottom-2 -right-2" />
            </>
          )}
        </div>
      )}

      {/* Optional Top Title Header */}
      {showPageTitle && (
        <div className="text-center pt-1 z-10">
          <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
            {photo.pageTitle || `Coloriage #${pageNumber}`}
          </h2>
        </div>
      )}

      {/* Main Coloring Illustration Canvas */}
      <div className="flex-1 my-3 flex items-center justify-center p-2 relative z-10 overflow-hidden">
        {photo.convertedDataUrl ? (
          <img
            src={photo.convertedDataUrl}
            alt={photo.name}
            className="w-full h-full object-contain filter contrast-125"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <img
              src={photo.originalDataUrl}
              alt="Preview"
              className="max-h-60 opacity-30 grayscale object-contain mb-3"
            />
            <p className="text-xs font-bold text-gray-500">
              Prêt pour la conversion
            </p>
            <p className="text-[11px] text-gray-400">
              Cliquez sur "Générer coloriage" pour extraire les contours nets prêts à colorier.
            </p>
          </div>
        )}
      </div>

      {/* Footer / Page Number */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-2 pt-1 border-t border-slate-100 z-10">
        <span className="text-slate-400 uppercase tracking-widest text-[9px]">
          Mon Cahier Créatif
        </span>
        {showPageNumbers && (
          <div className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 font-extrabold text-[10px]">
            {pageNumber}
          </div>
        )}
      </div>
    </div>
  );
};
