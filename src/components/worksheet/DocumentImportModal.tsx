import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Compass,
  SlidersHorizontal,
  Eraser,
  Globe2,
  ArrowRight,
  Eye,
  RefreshCw,
  Layers,
  Check,
  HelpCircle,
} from 'lucide-react';
import {
  ImportOptions,
  ReconstructionReport,
  DEMO_IMPORT_PRESETS,
  reconstructPedagogicalDocument,
  fileToBase64,
} from '../../services/documentImportService';
import { WorksheetDocument } from '../../types/worksheet';

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDocument: (
    document: WorksheetDocument,
    mode: 'replace' | 'append' | 'insert'
  ) => void;
}

type ModalStep = 'upload' | 'processing' | 'review';

export const DocumentImportModal: React.FC<DocumentImportModalProps> = ({
  isOpen,
  onClose,
  onApplyDocument,
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Configuration options
  const [options, setOptions] = useState<ImportOptions>({
    language: 'auto',
    cleanHandwriting: true,
    vectorizeGeometry: true,
    detectFormulas: true,
    targetDestination: 'replace',
  });

  // Processing state
  const [progressStepText, setProgressStepText] = useState('Démarrage de l’analyse…');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result Report
  const [report, setReport] = useState<ReconstructionReport | null>(null);
  const [previewTab, setPreviewTab] = useState<'comparative' | 'reconstructed' | 'raw'>('comparative');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('upload');
      setSelectedFile(null);
      setPreviewDataUrl(null);
      setSelectedPresetId(null);
      setErrorMsg(null);
      setReport(null);
      setProgressPercent(0);
    }
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedPresetId(null);
    setErrorMsg(null);

    if (file.type.startsWith('image/')) {
      const url = await fileToBase64(file);
      setPreviewDataUrl(url);
    } else {
      setPreviewDataUrl(null);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSelectedFile(null);
    setPreviewDataUrl(null);
    setErrorMsg(null);
  };

  const handleStartReconstruction = async () => {
    if (!selectedFile && !selectedPresetId) {
      setErrorMsg('Veuillez sélectionner un document (photo, scan, PDF) ou choisir un exemple ci-dessous.');
      return;
    }

    setCurrentStep('processing');
    setErrorMsg(null);
    setProgressPercent(10);

    try {
      const target = selectedFile || selectedPresetId!;
      const rep = await reconstructPedagogicalDocument(
        target,
        options,
        (text, percent) => {
          setProgressStepText(text);
          setProgressPercent(percent);
        }
      );

      setReport(rep);
      setCurrentStep('review');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors de la numérisation du document.');
      setCurrentStep('upload');
    }
  };

  const handleConfirmApply = () => {
    if (!report) return;
    onApplyDocument(report.document, options.targetDestination);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Importation & Reconstruction Intelligente
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Phase 5
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Transformez un scan, une photo de devoir ou un PDF en document interactif 100% vectoriel et modifiable.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* STEP 1: UPLOAD & CONFIGURATION */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-indigo-500 bg-indigo-50/30'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-slate-100/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedFile ? (
                        <span className="text-indigo-600 font-bold">
                          Fichier sélectionné : {selectedFile.name} (
                          {(selectedFile.size / 1024).toFixed(1)} Ko)
                        </span>
                      ) : (
                        <span>
                          Glissez-déposez un fichier ici ou{' '}
                          <span className="text-indigo-600 underline">parcourez votre ordinateur</span>
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Formats supportés : Images PNG, JPEG, WebP, Scans haute résolution ou documents PDF.
                    </p>
                  </div>
                </div>

                {previewDataUrl && (
                  <div className="mt-4 inline-block border border-slate-200 rounded-lg overflow-hidden max-h-40 shadow-xs">
                    <img
                      src={previewDataUrl}
                      alt="Aperçu import"
                      className="max-h-40 object-contain mx-auto"
                    />
                  </div>
                )}
              </div>

              {/* DEMO PRESETS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ou tester immédiatement avec un devoir réel audité :
                  </span>
                  <span className="text-[11px] text-slate-400">1 clic pour charger</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DEMO_IMPORT_PRESETS.map((p) => {
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPreset(p.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/30'
                            : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/80 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}
                          >
                            {p.subject}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {p.features.slice(0, 2).map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ADVANCED RECONSTRUCTION OPTIONS */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  Options de Reconstruction & Vectorisation Pédagogique
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Clean handwriting */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-300">
                    <input
                      type="checkbox"
                      checked={options.cleanHandwriting}
                      onChange={(e) =>
                        setOptions({ ...options, cleanHandwriting: e.target.checked })
                      }
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Eraser className="w-3.5 h-3.5 text-rose-500" />
                        Nettoyer l’écriture manuscrite élève
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supprime les ratures ou réponses au stylo pour obtenir un sujet vierge prêt à réimprimer.
                      </p>
                    </div>
                  </label>

                  {/* Vectorize Geometry */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-300">
                    <input
                      type="checkbox"
                      checked={options.vectorizeGeometry}
                      onChange={(e) =>
                        setOptions({ ...options, vectorizeGeometry: e.target.checked })
                      }
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-violet-500" />
                        Vectoriser les figures & axes gradués
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Convertit les croquis en figures vectorielles SVG modifiables (points, mesures, angles).
                      </p>
                    </div>
                  </label>

                  {/* Detect Formulas KaTeX */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-indigo-300">
                    <input
                      type="checkbox"
                      checked={options.detectFormulas}
                      onChange={(e) =>
                        setOptions({ ...options, detectFormulas: e.target.checked })
                      }
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="font-serif italic font-bold text-blue-600">∑</span>
                        Reconnaissance LaTeX / KaTeX
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Convertit les équations, fractions et racines en code mathématique interactif.
                      </p>
                    </div>
                  </label>

                  {/* Target destination */}
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      Mode d'insertion dans l'éditeur :
                    </div>
                    <select
                      value={options.targetDestination}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          targetDestination: e.target.value as any,
                        })
                      }
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                    >
                      <option value="replace">Remplacer le document actuel</option>
                      <option value="append">Ajouter à la fin comme nouvelles pages</option>
                      <option value="insert">Insérer les blocs à la page actuelle</option>
                    </select>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROCESSING / PROGRESS ANIMATION */}
          {currentStep === 'processing' && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-indigo-600 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-base font-bold text-slate-900">
                  Reconstruction Pédagogique en cours…
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {progressStepText}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 mt-4">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-indigo-600">
                  {progressPercent}% complété
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 max-w-lg mt-4">
                <span className="p-2 rounded bg-slate-50 border border-slate-100">
                  1. OCR Haute Définition
                </span>
                <span className="p-2 rounded bg-slate-50 border border-slate-100">
                  2. Parser KaTeX / Math
                </span>
                <span className="p-2 rounded bg-slate-50 border border-slate-100">
                  3. Figures Vectorielles
                </span>
                <span className="p-2 rounded bg-slate-50 border border-slate-100">
                  4. Structure A4 & Barème
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: COMPARATIVE REVIEW & APPLY */}
          {currentStep === 'review' && report && (
            <div className="space-y-5">
              {/* Score Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                  <div className="text-[11px] font-semibold text-emerald-800">
                    Confiance Globale
                  </div>
                  <div className="text-lg font-bold text-emerald-700">
                    {report.confidenceScore}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80">
                  <div className="text-[11px] font-semibold text-blue-800">
                    Précision OCR Texte
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    {report.ocrAccuracy}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200/80">
                  <div className="text-[11px] font-semibold text-indigo-800">
                    Formules Mathématiques
                  </div>
                  <div className="text-lg font-bold text-indigo-700">
                    {report.formulaAccuracy}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-violet-50 border border-violet-200/80">
                  <div className="text-[11px] font-semibold text-violet-800">
                    Vectorisation Figures
                  </div>
                  <div className="text-lg font-bold text-violet-700">
                    {report.vectorizationRate}%
                  </div>
                </div>
              </div>

              {/* Document Summary Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {report.title}
                  </h4>
                  <p className="text-slate-500">
                    Matière : <span className="font-medium text-slate-700">{report.subject}</span> • Niveau :{' '}
                    <span className="font-medium text-slate-700">{report.gradeLevel}</span> • Total :{' '}
                    <span className="font-bold text-indigo-600">{report.totalPoints} points</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold shadow-2xs">
                    {report.blocksExtractedCount} blocs interactifs créés
                  </span>
                </div>
              </div>

              {/* Comparative Preview Area */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    Aperçu de la reconstruction pédagogique
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('comparative')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-all ${
                        previewTab === 'comparative'
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Vue comparative
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('reconstructed')}
                      className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-all ${
                        previewTab === 'reconstructed'
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Devoir reconstitué (A4)
                    </button>
                  </div>
                </div>

                <div className="p-4 max-h-72 overflow-y-auto space-y-3 bg-slate-50/50">
                  {report.document.pages[0]?.blocks.map((block, idx) => (
                    <div
                      key={block.id || idx}
                      className="p-3 bg-white rounded-lg border border-slate-200/90 shadow-2xs text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-600 uppercase tracking-wider">
                          Bloc #{idx + 1} — {block.type}
                        </span>
                        {block.content?.points && (
                          <span className="text-slate-500 font-semibold">
                            Barème : {block.content.points}
                          </span>
                        )}
                      </div>
                      {block.type === 'exam_header' && (
                        <div className="text-slate-700 font-medium">
                          En-tête officiel : {block.content.title} ({block.content.subject})
                        </div>
                      )}
                      {block.type === 'exercise' && (
                        <div className="text-slate-800 font-bold">
                          {block.content.exerciseTitle} ({block.children?.length || 0} sous-questions)
                        </div>
                      )}
                      {block.type === 'geometry_figure' && (
                        <div className="text-violet-700 font-medium flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" />
                          Figure vectorielle géométrique avec segments et mesures calculées
                        </div>
                      )}
                      {block.type === 'number_line' && (
                        <div className="text-emerald-700 font-medium flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          Axe numérique gradué interactif
                        </div>
                      )}
                      {block.content?.text && (
                        <p className="text-slate-600 line-clamp-2">
                          {block.content.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          {currentStep === 'upload' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleStartReconstruction}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Lancer la Reconstruction IA
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {currentStep === 'processing' && (
            <div className="w-full text-center text-xs text-slate-500 italic">
              Veuillez patienter pendant le traitement multimodale du document…
            </div>
          )}

          {currentStep === 'review' && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('upload')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Importer un autre document
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApply}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Appliquer dans l’Éditeur ({report?.blocksExtractedCount} blocs)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
