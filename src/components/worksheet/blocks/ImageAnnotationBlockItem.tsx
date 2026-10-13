import React, { useState, useRef } from 'react';
import {
  WorksheetBlock,
  ImageAnnotationData,
  AnnotationMarker,
} from '../../../types/worksheet';
import { Upload, Plus, Trash2, Eye, EyeOff, Tag } from 'lucide-react';
import { InlineMathText } from './InlineMathText';

interface ImageAnnotationBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
}

export const ImageAnnotationBlockItem: React.FC<ImageAnnotationBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const c = block.content;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const defaultAnnotation: ImageAnnotationData = {
    src: '',
    alt: 'Schéma à annoter',
    mode: 'student_exercise', // 'complete' or 'student_exercise'
    markerStyle: 'number',
    markers: [
      { id: 'm_1', index: 1, xPercent: 35, yPercent: 40, label: 'Sommet', expectedAnswer: 'Sommet du triangle' },
      { id: 'm_2', index: 2, xPercent: 65, yPercent: 80, label: 'Hypoténuse', expectedAnswer: 'Hypoténuse' },
    ],
    caption: 'Schéma anatomique ou géométrique à annoter',
  };

  const data: ImageAnnotationData = c.annotationData || defaultAnnotation;
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  const updateData = (updates: Partial<ImageAnnotationData>) => {
    onUpdateContent({
      annotationData: {
        ...data,
        ...updates,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateData({ src: dataUrl, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  // Add marker by clicking on image
  const handleImageClick = (e: React.MouseEvent) => {
    if (readOnly || !isSelected || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const nextIndex = data.markers.length + 1;
    const newMarker: AnnotationMarker = {
      id: `mark_${Date.now()}`,
      index: nextIndex,
      letter: String.fromCharCode(64 + nextIndex),
      xPercent: Math.max(5, Math.min(95, xPct)),
      yPercent: Math.max(5, Math.min(95, yPct)),
      label: `Élément ${nextIndex}`,
      expectedAnswer: '',
    };
    updateData({ markers: [...data.markers, newMarker] });
    setActiveMarkerId(newMarker.id);
  };

  const handleDeleteMarker = (id: string) => {
    updateData({
      markers: data.markers.filter((m) => m.id !== id),
    });
    setActiveMarkerId(null);
  };

  return (
    <div className="w-full flex flex-col select-none py-1.5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Mode & Toolbar (Shown when selected) */}
      {isSelected && !readOnly && (
        <div className="w-full mb-2 p-1.5 bg-slate-900/90 text-white rounded-xl shadow-md flex items-center justify-between text-xs backdrop-blur-xs print:hidden z-30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Mode pédagogique :</span>
            <button
              type="button"
              onClick={() => updateData({ mode: 'complete' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                data.mode === 'complete'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Schéma complet
            </button>
            <button
              type="button"
              onClick={() => updateData({ mode: 'student_exercise' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                data.mode === 'student_exercise'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Exercice à compléter
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {data.src ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Changer d'image
              </button>
            ) : null}

            {data.mode === 'student_exercise' && (
              <button
                type="button"
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                title="Aperçu des réponses enseignant (non imprimé)"
                className="px-2 py-1 rounded-md bg-slate-800 text-indigo-300 hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
              >
                {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAnswerKey ? 'Masquer corrigé' : 'Voir corrigé'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image with Pins Container */}
      <div
        ref={imageContainerRef}
        onClick={handleImageClick}
        className={`w-full relative rounded-xl border overflow-hidden bg-slate-50 flex items-center justify-center transition-all min-h-[220px] ${
          isSelected
            ? 'border-indigo-400 shadow-sm ring-1 ring-indigo-200'
            : 'border-slate-200/90 shadow-2xs'
        }`}
      >
        {data.src ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={data.src}
              alt={data.alt || 'Schéma'}
              className="max-h-[360px] w-auto max-w-full block select-none pointer-events-none"
            />

            {/* Pins overlay */}
            {data.markers.map((m) => {
              const isActive = activeMarkerId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!readOnly) setActiveMarkerId(m.id);
                  }}
                  style={{
                    left: `${m.xPercent}%`,
                    top: `${m.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute cursor-pointer group z-20"
                >
                  {/* Pin Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 transition-transform ${
                      isActive
                        ? 'bg-indigo-600 text-white border-white scale-110 ring-2 ring-indigo-400'
                        : 'bg-slate-900 text-white border-white group-hover:scale-105'
                    }`}
                  >
                    {data.markerStyle === 'letter' ? m.letter || m.index : m.index}
                  </div>

                  {/* Complete mode or teacher preview label bubble */}
                  {(data.mode === 'complete' || (showAnswerKey && isSelected)) && (
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/95 border border-slate-700/80 rounded-md px-2 py-0.5 shadow-sm text-xs font-bold text-slate-800 whitespace-nowrap">
                      {m.label || m.expectedAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            onClick={() => !readOnly && fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              Importer l’image du schéma à annoter
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Cliquez ensuite sur l’image pour poser des marqueurs numérotés (1, 2, 3...)
            </span>
          </div>
        )}
      </div>

      {/* STUDENT MODE (Prompt Item 30): Clean Dotted Answer Lines for Student */}
      {data.mode === 'student_exercise' && data.markers.length > 0 && (
        <div className="mt-3 p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            Légende à compléter par l'élève :
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {data.markers.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {data.markerStyle === 'letter' ? m.letter || m.index : m.index}
                </span>
                <span className="font-semibold text-slate-400">:</span>
                <div className="flex-1 border-b border-dotted border-slate-400 h-4 flex items-end">
                  {showAnswerKey && m.expectedAnswer && (
                    <span className="text-emerald-700 font-bold italic text-xs pb-0.5">
                      {m.expectedAnswer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Marker Editor in Bottom Bar */}
      {isSelected && !readOnly && activeMarkerId && (
        <div className="mt-2 p-2 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between gap-2 text-xs">
          {(() => {
            const m = data.markers.find((item) => item.id === activeMarkerId);
            if (!m) return null;
            return (
              <>
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-bold text-indigo-900">
                    Marqueur {m.index} :
                  </span>
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) =>
                      updateData({
                        markers: data.markers.map((item) =>
                          item.id === m.id ? { ...item, label: e.target.value } : item
                        ),
                      })
                    }
                    placeholder="Titre de l'élément..."
                    className="flex-1 bg-white border border-indigo-300 rounded px-2 py-1 text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={m.expectedAnswer || ''}
                    onChange={(e) =>
                      updateData({
                        markers: data.markers.map((item) =>
                          item.id === m.id ? { ...item, expectedAnswer: e.target.value } : item
                        ),
                      })
                    }
                    placeholder="Réponse attendue (corrigé)..."
                    className="flex-1 bg-white border border-indigo-300 rounded px-2 py-1 text-xs outline-none text-emerald-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteMarker(m.id)}
                  className="p-1 rounded text-red-600 hover:bg-red-100 cursor-pointer"
                  title="Supprimer ce marqueur"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Caption */}
      {data.caption && (
        <div className="mt-1 text-center text-xs text-slate-500 italic">
          <InlineMathText text={data.caption} />
        </div>
      )}
    </div>
  );
};
