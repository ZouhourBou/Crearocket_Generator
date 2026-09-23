import React, { useRef } from 'react';
import { UploadedPhoto } from '../../types/coloring';
import { validatePhotoQuality } from './PhotoQualityValidator';
import {
  Upload,
  Trash2,
  RotateCw,
  ZoomIn,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface Props {
  photos: UploadedPhoto[];
  activePhotoIndex: number;
  onSelectPhoto: (index: number) => void;
  onAddPhotos: (newPhotos: UploadedPhoto[]) => void;
  onUpdatePhoto: (index: number, updates: Partial<UploadedPhoto>) => void;
  onDeletePhoto: (index: number) => void;
  onReorderPhotos: (fromIndex: number, toIndex: number) => void;
  onProcessPhoto: (index: number) => void;
  onProcessAll: () => void;
  isProcessing: boolean;
}

export const PhotoUpload: React.FC<Props> = ({
  photos,
  activePhotoIndex,
  onSelectPhoto,
  onAddPhotos,
  onUpdatePhoto,
  onDeletePhoto,
  onReorderPhotos,
  onProcessPhoto,
  onProcessAll,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = Math.max(0, 5 - photos.length);
    if (remainingSlots <= 0) {
      alert("Le livre de coloriage standard est conçu pour 5 photographies principales. Vous pouvez remplacer ou supprimer une photo existante.");
      return;
    }

    const filesToLoad = Array.from(files).slice(0, remainingSlots);
    const newItems: UploadedPhoto[] = [];

    for (const file of filesToLoad) {
      const quality = await validatePhotoQuality(file);
      const dataUrl = await fileToDataUrl(file);

      newItems.push({
        id: 'photo_' + Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        originalDataUrl: dataUrl,
        rotation: 0,
        cropZoom: 1.0,
        brightness: 0,
        contrast: 0,
        status: 'idle',
        qualityWarning: quality.warning,
        pageTitle: `Page ${photos.length + newItems.length + 1}`,
      });
    }

    onAddPhotos(newItems);
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const activePhoto = photos[activePhotoIndex];

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      {photos.length < 5 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50/80 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-rose-100 group-hover:bg-rose-200 text-rose-600 flex items-center justify-center transition-colors shadow-2xs">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              Glissez-déposez vos photos ou <span className="text-rose-600 underline">parcourez</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              JPG, PNG, WebP — {5 - photos.length} emplacement(s) restant(s) sur 5
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Photo Privacy Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Confidentialité garantie :</span> Les photos d'enfants sont traitées localement et de manière éphémère. Aucun cliché n'est conservé ni utilisé à des fins d'entraînement.
        </div>
      </div>

      {/* Uploaded Thumbnails Grid */}
      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600 font-semibold px-1">
            <span>Galerie du livret ({photos.length}/5)</span>
            <button
              onClick={onProcessAll}
              disabled={isProcessing}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
              Convertir toutes les photos
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {photos.map((item, idx) => {
              const isSelected = idx === activePhotoIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectPhoto(idx)}
                  className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md scale-102'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <img
                    src={item.convertedDataUrl || item.originalDataUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `rotate(${item.rotation}deg) scale(${item.cropZoom})`,
                    }}
                  />

                  {/* Status Indicator */}
                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    #{idx + 1}
                  </div>

                  {item.convertedDataUrl ? (
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  ) : item.qualityWarning ? (
                    <div className="absolute top-1 right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-xs" title={item.qualityWarning}>
                      <AlertCircle className="w-3 h-3" />
                    </div>
                  ) : null}

                  {/* Hover Reorder/Delete */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white">
                    {idx > 0 && (
                      <button
                        title="Déplacer à gauche"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderPhotos(idx, idx - 1);
                        }}
                        className="p-1 hover:bg-white/20 rounded-md"
                      >
                        <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    )}
                    <button
                      title="Supprimer cette photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePhoto(idx);
                      }}
                      className="p-1 hover:bg-red-500/80 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx < photos.length - 1 && (
                      <button
                        title="Déplacer à droite"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderPhotos(idx, idx + 1);
                        }}
                        className="p-1 hover:bg-white/20 rounded-md"
                      >
                        <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Photo Fine-Tuning Tools */}
      {activePhoto && (
        <div className="bg-white rounded-xl border border-gray-200 p-3.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
              Ajustement Photo #{activePhotoIndex + 1}
            </span>
            <button
              onClick={() => onProcessPhoto(activePhotoIndex)}
              disabled={isProcessing}
              className="px-2.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
              Générer coloriage
            </button>
          </div>

          {activePhoto.qualityWarning && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>{activePhoto.qualityWarning}</span>
            </div>
          )}

          {/* Quick Rotation & Zoom sliders */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-gray-600 font-semibold mb-1 flex items-center justify-between">
                <span>Rotation</span>
                <span className="text-gray-400">{activePhoto.rotation}°</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  onUpdatePhoto(activePhotoIndex, {
                    rotation: (activePhoto.rotation + 90) % 360,
                  })
                }
                className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5 text-gray-600" />
                Pivoter 90°
              </button>
            </div>

            <div>
              <label className="text-gray-600 font-semibold mb-1 flex items-center justify-between">
                <span>Zoom & Cadrage</span>
                <span className="text-gray-400">{Math.round(activePhoto.cropZoom * 100)}%</span>
              </label>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.05"
                value={activePhoto.cropZoom}
                onChange={(e) =>
                  onUpdatePhoto(activePhotoIndex, {
                    cropZoom: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-rose-600 mt-1"
              />
            </div>
          </div>

          {/* Titre de page optionnel */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Légende / Titre de la page (ex: Lina à la plage)
            </label>
            <input
              type="text"
              value={activePhoto.pageTitle || ''}
              onChange={(e) =>
                onUpdatePhoto(activePhotoIndex, { pageTitle: e.target.value })
              }
              placeholder={`Page ${activePhotoIndex + 1}`}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
