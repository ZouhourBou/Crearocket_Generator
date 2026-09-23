import React, { useState, useRef } from 'react';
import { Language } from '../../types';
import {
  ColoringBookState,
  UploadedPhoto,
  ColoringPaperFormat,
} from '../../types/coloring';
import { PhotoUpload } from './PhotoUpload';
import { CoverRenderer } from './CoverRenderer';
import { ColoringPageRenderer } from './ColoringPageRenderer';
import { DedicationPageRenderer } from './DedicationPageRenderer';
import { convertPhotoToColoringClassic } from './ClassicConversion';
import { convertPhotoToColoringAI } from './PremiumAIConversion';
import {
  exportToPdf,
  exportMultiPagePdf,
  exportToPng,
  printDirect,
} from '../../utils/exportUtils';
import {
  Palette,
  ArrowLeft,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sliders,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Layers,
  Heart,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigate?: (route: string) => void;
}

const DEFAULT_SAMPLE_PHOTO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23fff1f2"/><circle cx="300" cy="240" r="110" fill="%23fecdd3"/><circle cx="270" cy="220" r="14" fill="%231f2937"/><circle cx="330" cy="220" r="14" fill="%231f2937"/><path d="M260,280 Q300,320 340,280" stroke="%231f2937" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M220,400 Q300,480 380,400 L380,560 L220,560 Z" fill="%23fb7185"/><text x="300" y="80" font-family="sans-serif" font-weight="bold" font-size="28" fill="%23e11d48" text-anchor="middle">Exemple Enfant Souriant</text></svg>';

export const PhotoColoringPage: React.FC<Props> = ({
  language,
  onNavigate,
}) => {
  const isArabic = language === 'ar';

  const [state, setState] = useState<ColoringBookState>(() => ({
    photos: [
      {
        id: 'sample_photo_1',
        name: 'portrait_enfant.jpg',
        originalDataUrl: DEFAULT_SAMPLE_PHOTO,
        convertedDataUrl: '',
        rotation: 0,
        cropZoom: 1.0,
        brightness: 0,
        contrast: 10,
        status: 'idle',
        pageTitle: 'Mon Sourire Rayonnant',
      },
    ],
    activePhotoIndex: 0,
    activeViewIndex: 0, // 0: Cover, 1..5: Coloring, 6: Dedication
    conversionMode: 'classic',
    paperFormat: 'a4',
    lineThickness: 'thick',
    detailLevel: 'balanced',
    backgroundMode: 'simplify',
    difficulty: 'kids',
    framing: 'portrait',
    showDecorativeFrame: true,
    frameStyle: 'playful_stars',
    showPageNumbers: true,
    showPageTitle: true,
    doubleSidedPrint: false,
    addBlankReversePages: false,
    finalDedicationEnabled: true,
    finalDedicationText:
      "Que chaque page t'apporte joie, créativité et couleurs magiques. Prends tes plus beaux feutres et crayons !",
    finalDedicationSignoff: 'Toute la Famille',
    cover: {
      template: 'magical_stars',
      childName: 'Lina',
      title: 'Mon Cahier de Coloriage Magique',
      subtitle: 'Les plus beaux souvenirs',
      age: '5 ans',
      dedication: 'Pour ma petite artiste pleine de talents',
      date: 'Édition 2026',
      fontTheme: 'playful',
    },
    zoom: 90,
  }));

  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'conversion' | 'book' | 'cover'>('photos');

  const activeSheetRef = useRef<HTMLDivElement>(null);
  const hiddenPagesContainerRef = useRef<HTMLDivElement>(null);

  // Compute paper dimensions in mm
  const paperDimensions = {
    widthMm: state.paperFormat === 'a5' ? 148 : state.paperFormat === 'square' ? 210 : 210,
    heightMm: state.paperFormat === 'a5' ? 210 : state.paperFormat === 'square' ? 210 : 297,
  };

  // Process single photo
  const handleProcessPhoto = async (index: number) => {
    const photo = state.photos[index];
    if (!photo) return;

    setIsProcessing(true);
    try {
      if (state.conversionMode === 'ai') {
        const aiRes = await convertPhotoToColoringAI(photo.originalDataUrl, {
          lineThickness: state.lineThickness,
          detailLevel: state.detailLevel,
          backgroundMode: state.backgroundMode,
          difficulty: state.difficulty,
          framing: state.framing,
          rotation: photo.rotation,
          cropZoom: photo.cropZoom,
          brightness: photo.brightness,
          contrast: photo.contrast,
        });

        if (aiRes.success && aiRes.dataUrl) {
          updatePhoto(index, { convertedDataUrl: aiRes.dataUrl, status: 'ready' });
          return;
        }
      }

      // Classic high-fidelity deterministic engine
      const converted = await convertPhotoToColoringClassic(photo.originalDataUrl, {
        lineThickness: state.lineThickness,
        detailLevel: state.detailLevel,
        backgroundMode: state.backgroundMode,
        difficulty: state.difficulty,
        framing: state.framing,
        rotation: photo.rotation,
        cropZoom: photo.cropZoom,
        brightness: photo.brightness,
        contrast: photo.contrast,
      });

      updatePhoto(index, { convertedDataUrl: converted, status: 'ready' });
    } catch (err) {
      console.error('Error converting photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process all uploaded photos
  const handleProcessAll = async () => {
    setIsProcessing(true);
    try {
      for (let i = 0; i < state.photos.length; i++) {
        await handleProcessPhoto(i);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePhoto = (index: number, updates: Partial<UploadedPhoto>) => {
    setState((prev) => {
      const next = [...prev.photos];
      if (next[index]) {
        next[index] = { ...next[index], ...updates };
      }
      return { ...prev, photos: next };
    });
  };

  const deletePhoto = (index: number) => {
    setState((prev) => {
      const next = prev.photos.filter((_, i) => i !== index);
      const newActive = Math.max(0, Math.min(prev.activePhotoIndex, next.length - 1));
      return { ...prev, photos: next, activePhotoIndex: newActive };
    });
  };

  const reorderPhotos = (fromIdx: number, toIdx: number) => {
    setState((prev) => {
      const next = [...prev.photos];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return { ...prev, photos: next, activePhotoIndex: toIdx };
    });
  };

  // Total book pages: Cover (1) + Photos (N) + Dedication (1 if enabled)
  const totalBookPages = 1 + state.photos.length + (state.finalDedicationEnabled ? 1 : 0);

  // Export handlers
  const handlePrint = () => {
    printDirect();
  };

  const handleExportSinglePdf = async () => {
    if (!activeSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPdf(
        activeSheetRef.current,
        paperDimensions,
        `coloriage_${state.cover.childName || 'enfant'}_page_${state.activeViewIndex + 1}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFullBookletPdf = async () => {
    if (!hiddenPagesContainerRef.current) return;
    setIsExporting(true);
    try {
      const pageElements: HTMLElement[] = [];
      hiddenPagesContainerRef.current
        .querySelectorAll('.booklet-hidden-page')
        .forEach((node) => {
          if (node instanceof HTMLElement) {
            pageElements.push(node);
          }
        });

      if (pageElements.length > 0) {
        await exportMultiPagePdf(
          pageElements,
          paperDimensions,
          `livre_coloriage_${state.cover.childName || 'personnalise'}_complet.pdf`
        );
      } else if (activeSheetRef.current) {
        await exportToPdf(
          activeSheetRef.current,
          paperDimensions,
          `livre_coloriage_${state.cover.childName || 'enfant'}.pdf`
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (!activeSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPng(
        activeSheetRef.current,
        `coloriage_${state.cover.childName || 'enfant'}_page_${state.activeViewIndex + 1}.png`
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Render current view page
  const renderCurrentPage = () => {
    if (state.activeViewIndex === 0) {
      return (
        <CoverRenderer
          cover={state.cover}
          paperFormat={state.paperFormat}
          illustrationSampleUrl={state.photos[0]?.convertedDataUrl || state.photos[0]?.originalDataUrl}
        />
      );
    }

    const photoIdx = state.activeViewIndex - 1;
    if (photoIdx < state.photos.length) {
      const photo = state.photos[photoIdx];
      return (
        <ColoringPageRenderer
          photo={photo}
          pageNumber={photoIdx + 1}
          totalPages={state.photos.length}
          paperFormat={state.paperFormat}
          showDecorativeFrame={state.showDecorativeFrame}
          frameStyle={state.frameStyle}
          showPageNumbers={state.showPageNumbers}
          showPageTitle={state.showPageTitle}
        />
      );
    }

    // Dedication
    return (
      <DedicationPageRenderer
        childName={state.cover.childName}
        messageText={state.finalDedicationText}
        signoff={state.finalDedicationSignoff}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-900 select-none">
      {/* Top Utility Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/80">
              <Palette className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Générateur Photo → Livre de Coloriage
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  Studio Premium
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>

          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Page PNG</span>
          </button>

          <button
            onClick={handleExportSinglePdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Page PDF</span>
          </button>

          <button
            onClick={handleExportFullBookletPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-extrabold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Livre Complet (PDF Multi-pages)</span>
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Customization Panel */}
        <aside className="w-full lg:w-105 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col shrink-0 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto">
          {/* Tabs */}
          <div className="grid grid-cols-4 border-b border-gray-200 p-1 bg-gray-50/70 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Photos ({state.photos.length}/5)
            </button>
            <button
              onClick={() => setActiveTab('conversion')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'conversion'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Trait & Rendu
            </button>
            <button
              onClick={() => setActiveTab('cover')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'cover'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3. Couverture
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'book'
                  ? 'bg-white text-rose-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              4. Assemblage
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* TAB 1: PHOTOS */}
            {activeTab === 'photos' && (
              <PhotoUpload
                photos={state.photos}
                activePhotoIndex={state.activePhotoIndex}
                onSelectPhoto={(idx) => {
                  setState((prev) => ({
                    ...prev,
                    activePhotoIndex: idx,
                    activeViewIndex: idx + 1, // jump preview to this photo
                  }));
                }}
                onAddPhotos={(newPhotos) => {
                  setState((prev) => ({
                    ...prev,
                    photos: [...prev.photos, ...newPhotos],
                  }));
                }}
                onUpdatePhoto={updatePhoto}
                onDeletePhoto={deletePhoto}
                onReorderPhotos={reorderPhotos}
                onProcessPhoto={handleProcessPhoto}
                onProcessAll={handleProcessAll}
                isProcessing={isProcessing}
              />
            )}

            {/* TAB 2: CONVERSION ENGINE SETTINGS */}
            {activeTab === 'conversion' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-rose-600" />
                    Moteur de Transformation Photo → Coloriage
                  </span>
                  <button
                    onClick={() => handleProcessPhoto(state.activePhotoIndex)}
                    disabled={isProcessing}
                    className="px-2.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                    Appliquer à la sélection
                  </button>
                </div>

                {/* Conversion Mode Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mode de conversion
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setState((p) => ({ ...p, conversionMode: 'classic' }))}
                      className={`p-2.5 text-left border rounded-xl text-xs transition-all cursor-pointer ${
                        state.conversionMode === 'classic'
                          ? 'border-rose-600 bg-rose-50/50 text-rose-900 font-bold ring-2 ring-rose-600/10'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Mode A : Classique Pro</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                          Instantané
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Extraction multi-passes DoG & Sobel. Contours nets garantis sans dépendance externe.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setState((p) => ({ ...p, conversionMode: 'ai' }))}
                      className={`p-2.5 text-left border rounded-xl text-xs transition-all cursor-pointer ${
                        state.conversionMode === 'ai'
                          ? 'border-rose-600 bg-rose-50/50 text-rose-900 font-bold ring-2 ring-rose-600/10'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Mode B : IA Premium</span>
                        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Redessiné par modèle d'illustration adapté aux enfants.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Line Thickness */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Épaisseur des contours du dessin
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['thin', 'medium', 'thick'] as const).map((thick) => (
                      <button
                        key={thick}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, lineThickness: thick }))}
                        className={`py-1.5 text-xs rounded-lg border font-semibold capitalize cursor-pointer transition-all ${
                          state.lineThickness === thick
                            ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {thick === 'thin' ? 'Fin' : thick === 'medium' ? 'Moyen' : 'Épais (Feutre)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detail Level */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Niveau de détails du visage
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['simple', 'balanced', 'detailed'] as const).map((detail) => (
                      <button
                        key={detail}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, detailLevel: detail }))}
                        className={`py-1.5 text-xs rounded-lg border font-semibold capitalize cursor-pointer transition-all ${
                          state.detailLevel === detail
                            ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {detail === 'simple' ? 'Épuré' : detail === 'balanced' ? 'Équilibré' : 'Détaillé'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coloring Difficulty */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Âge & Facilité de coloriage
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['toddler', 'kids', 'advanced'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, difficulty: diff }))}
                        className={`py-1.5 text-xs rounded-lg border font-semibold capitalize cursor-pointer transition-all ${
                          state.difficulty === diff
                            ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {diff === 'toddler' ? 'Tout-petits (2-4)' : diff === 'kids' ? 'Enfants (5-8)' : 'Avancé (9+)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Mode */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Arrière-plan de la photo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['remove', 'simplify', 'preserve'] as const).map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, backgroundMode: bg }))}
                        className={`py-1.5 text-xs rounded-lg border font-semibold capitalize cursor-pointer transition-all ${
                          state.backgroundMode === bg
                            ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {bg === 'remove' ? 'Supprimer' : bg === 'simplify' ? 'Simplifier' : 'Conserver'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COVER DESIGN */}
            {activeTab === 'cover' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                    Personnalisation de la Couverture
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Prénom de l'enfant
                  </label>
                  <input
                    type="text"
                    value={state.cover.childName}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        cover: { ...p.cover, childName: e.target.value },
                      }))
                    }
                    placeholder="Lina, Adam, Lucas..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Titre du livre
                  </label>
                  <input
                    type="text"
                    value={state.cover.title}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        cover: { ...p.cover, title: e.target.value },
                      }))
                    }
                    placeholder="Mon Cahier de Coloriage Magique"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Âge (facultatif)
                    </label>
                    <input
                      type="text"
                      value={state.cover.age || ''}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          cover: { ...p.cover, age: e.target.value },
                        }))
                      }
                      placeholder="5 ans"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Date ou Année
                    </label>
                    <input
                      type="text"
                      value={state.cover.date || ''}
                      onChange={(e) =>
                        setState((p) => ({
                          ...p,
                          cover: { ...p.cover, date: e.target.value },
                        }))
                      }
                      placeholder="2026"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dédicace de couverture
                  </label>
                  <input
                    type="text"
                    value={state.cover.dedication || ''}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        cover: { ...p.cover, dedication: e.target.value },
                      }))
                    }
                    placeholder="Pour ma petite artiste pleine de talents"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: BOOK ASSEMBLY & PRINT OPTIONS */}
            {activeTab === 'book' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-rose-600" />
                    Format du Livre & Options d'Impression
                  </span>
                </div>

                {/* Paper Format */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Format physique du livret
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['a4', 'a5', 'square'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setState((p) => ({ ...p, paperFormat: fmt }))}
                        className={`py-2 text-xs rounded-lg border font-semibold uppercase cursor-pointer transition-all ${
                          state.paperFormat === fmt
                            ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {fmt === 'a4' ? 'A4 Portrait' : fmt === 'a5' ? 'A5 Cahier' : 'Carré 21×21'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Decorative Frame */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer">
                    <span>Cadre décoratif autour des dessins</span>
                    <input
                      type="checkbox"
                      checked={state.showDecorativeFrame}
                      onChange={(e) =>
                        setState((p) => ({ ...p, showDecorativeFrame: e.target.checked }))
                      }
                      className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer">
                    <span>Numérotation des pages</span>
                    <input
                      type="checkbox"
                      checked={state.showPageNumbers}
                      onChange={(e) =>
                        setState((p) => ({ ...p, showPageNumbers: e.target.checked }))
                      }
                      className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-gray-800 cursor-pointer">
                    <span>Page de dédicace finale (Certificat)</span>
                    <input
                      type="checkbox"
                      checked={state.finalDedicationEnabled}
                      onChange={(e) =>
                        setState((p) => ({ ...p, finalDedicationEnabled: e.target.checked }))
                      }
                      className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {state.finalDedicationEnabled && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                    <label className="font-semibold text-gray-700 block">
                      Message de dédicace finale
                    </label>
                    <textarea
                      rows={2}
                      value={state.finalDedicationText}
                      onChange={(e) =>
                        setState((p) => ({ ...p, finalDedicationText: e.target.value }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                    />
                    <input
                      type="text"
                      placeholder="Signé: Papa et Maman, Mamie..."
                      value={state.finalDedicationSignoff}
                      onChange={(e) =>
                        setState((p) => ({ ...p, finalDedicationSignoff: e.target.value }))
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Right Live Document Preview Panel */}
        <main className="flex-1 flex flex-col bg-slate-200/80 overflow-y-auto">
          {/* Top Preview Pagination & Navigation Bar */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-2xs">
            {/* Page navigation */}
            <div className="flex items-center gap-1 text-xs">
              <button
                disabled={state.activeViewIndex <= 0}
                onClick={() =>
                  setState((p) => ({ ...p, activeViewIndex: Math.max(0, p.activeViewIndex - 1) }))
                }
                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold text-gray-800 px-2">
                {state.activeViewIndex === 0
                  ? 'Page 1 : Couverture Personnalisée'
                  : state.activeViewIndex <= state.photos.length
                  ? `Page ${state.activeViewIndex + 1} : Coloriage #${state.activeViewIndex}`
                  : `Page ${totalBookPages} : Dédicace Finale`}
                <span className="text-gray-400 font-normal ml-1">
                  ({state.activeViewIndex + 1}/{totalBookPages})
                </span>
              </span>

              <button
                disabled={state.activeViewIndex >= totalBookPages - 1}
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    activeViewIndex: Math.min(totalBookPages - 1, p.activeViewIndex + 1),
                  }))
                }
                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <button
                onClick={() => setState((p) => ({ ...p, zoom: Math.max(50, p.zoom - 10) }))}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                title="Dézoomer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-gray-700 min-w-10 text-center">
                {state.zoom}%
              </span>
              <button
                onClick={() => setState((p) => ({ ...p, zoom: Math.min(150, p.zoom + 10) }))}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                title="Zoomer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Realistic Printable Paper Canvas Area */}
          <div className="flex-1 p-4 sm:p-8 flex items-center justify-center overflow-auto">
            <div
              style={{
                transform: `scale(${state.zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Paper Sheet Frame with realistic physical drop shadow */}
              <div
                ref={activeSheetRef}
                style={{
                  width: `${paperDimensions.widthMm}mm`,
                  height: `${paperDimensions.heightMm}mm`,
                }}
                className="bg-white shadow-2xl border border-gray-300 relative box-border overflow-hidden"
              >
                {renderCurrentPage()}
              </div>
            </div>
          </div>

          {/* Bottom Thumbnails Strip for Quick Page Jumps */}
          <div className="bg-white border-t border-gray-200 p-2.5 flex items-center gap-2 overflow-x-auto">
            {/* Cover Thumb */}
            <button
              onClick={() => setState((p) => ({ ...p, activeViewIndex: 0 }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border cursor-pointer transition-all ${
                state.activeViewIndex === 0
                  ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-2xs'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              ★ Couverture
            </button>

            {/* Photo Pages Thumbnails */}
            {state.photos.map((ph, idx) => (
              <button
                key={ph.id}
                onClick={() => setState((p) => ({ ...p, activeViewIndex: idx + 1 }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border cursor-pointer transition-all ${
                  state.activeViewIndex === idx + 1
                    ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Page {idx + 2} : Coloriage #{idx + 1}
              </button>
            ))}

            {/* Dedication Page Thumb */}
            {state.finalDedicationEnabled && (
              <button
                onClick={() => setState((p) => ({ ...p, activeViewIndex: totalBookPages - 1 }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border cursor-pointer transition-all ${
                  state.activeViewIndex === totalBookPages - 1
                    ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-2xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                ❤ Dédicace Finale
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Hidden Offscreen Container for Clean Multi-Page PDF Generation */}
      <div
        ref={hiddenPagesContainerRef}
        style={{
          position: 'fixed',
          top: -99999,
          left: -99999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Page 1: Cover */}
        <div
          className="booklet-hidden-page bg-white"
          style={{
            width: `${paperDimensions.widthMm}mm`,
            height: `${paperDimensions.heightMm}mm`,
          }}
        >
          <CoverRenderer
            cover={state.cover}
            paperFormat={state.paperFormat}
            illustrationSampleUrl={state.photos[0]?.convertedDataUrl || state.photos[0]?.originalDataUrl}
          />
        </div>

        {/* Pages 2..N: Photo coloring pages */}
        {state.photos.map((ph, idx) => (
          <div
            key={`hidden_page_${ph.id}`}
            className="booklet-hidden-page bg-white"
            style={{
              width: `${paperDimensions.widthMm}mm`,
              height: `${paperDimensions.heightMm}mm`,
            }}
          >
            <ColoringPageRenderer
              photo={ph}
              pageNumber={idx + 1}
              totalPages={state.photos.length}
              paperFormat={state.paperFormat}
              showDecorativeFrame={state.showDecorativeFrame}
              frameStyle={state.frameStyle}
              showPageNumbers={state.showPageNumbers}
              showPageTitle={state.showPageTitle}
            />
          </div>
        ))}

        {/* Final Dedication */}
        {state.finalDedicationEnabled && (
          <div
            className="booklet-hidden-page bg-white"
            style={{
              width: `${paperDimensions.widthMm}mm`,
              height: `${paperDimensions.heightMm}mm`,
            }}
          >
            <DedicationPageRenderer
              childName={state.cover.childName}
              messageText={state.finalDedicationText}
              signoff={state.finalDedicationSignoff}
            />
          </div>
        )}
      </div>
    </div>
  );
};
