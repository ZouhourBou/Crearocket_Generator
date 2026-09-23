import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Palette,
  BookOpen,
  Layers,
  Rocket,
  Layout,
  FileText,
  User,
  GraduationCap,
  Building,
  Calendar,
  RotateCcw,
  Eye,
  Ruler,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratorState, NotebookCoverInputParams, NotebookPageFormat, NotebookTypeMatiere } from '../types';
import {
  getSubjectDefinition,
  selectNextTemplateForSubject,
  ACTIVE_MODEL_COUNT,
  ART_DIRECTIONS,
} from '../data/subjectRegistry';
import {
  NOTEBOOK_SUBJECT_PROFILES,
  CREAROCKET_BRAND,
  MATIERES,
  THEMES,
  subjectToTypeMatiere,
  typeMatiereToSubject,
} from '../data/notebookThemes';
import { generateNotebookCoverFromParams } from '../services/notebookAiService';

interface NotebookAiGeneratorCardProps {
  state: GeneratorState;
  onUpdateState: React.Dispatch<React.SetStateAction<GeneratorState>>;
}

const NOTEBOOK_COVER_SIZES = [
  { id: 'auto', label: 'Automatique (Ajusté au format de page)' },
  { id: '17x22', label: 'Petit format 17 × 22 cm (Cahier scolaire standard)' },
  { id: '21x29.7', label: 'Grand format 21 × 29.7 cm (A4)' },
  { id: 'A5', label: 'Format A5 (14.8 × 21 cm)' },
  { id: '16x24', label: 'Format 16 × 24 cm (Format intermédiaire)' },
  { id: '24x32', label: 'Grand format 24 × 32 cm (Travaux pratiques)' },
  { id: 'custom', label: 'Personnalisé (largeur × hauteur en cm)...' },
];

export const NotebookAiGeneratorCard: React.FC<NotebookAiGeneratorCardProps> = ({
  state,
  onUpdateState,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState<boolean>(Boolean(state.aiCoverImage || state.aiCoverModelNumber));

  // Determine initial selectedMatiere and titreCahier
  const [selectedMatiere, setSelectedMatiere] = useState<string>(() => {
    if (state.info.subjectName?.trim()) {
      const byLabel = MATIERES.find((m) => m.label === state.info.subjectName);
      if (byLabel) return byLabel.id;
      const bySubject = subjectToTypeMatiere(state.notebookSubject);
      if (bySubject && MATIERES.some((m) => m.id === bySubject)) return bySubject;
    }
    return '';
  });

  // Compteur séquentiel de modèle (1 à 5 en boucle pour les modèles actifs)
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(() => state.aiCoverModelNumber || 0);
  // Direction artistique choisie (0 = rotation automatique, 1 à 5 = modèle fixe)
  const [selectedArtModelId, setSelectedArtModelId] = useState<number>(0);
  const lastMatiereRef = useRef<string>(selectedMatiere);

  const [customMatiereText, setCustomMatiereText] = useState<string>('');

  const [titreCahier, setTitreCahier] = useState<string>(() => {
    if (state.info.subjectName?.trim()) return state.info.subjectName;
    return '';
  });

  const [titreModifieManuellement, setTitreModifieManuellement] = useState<boolean>(() => {
    if (!state.info.subjectName?.trim()) return false;
    const matchesKnownLabel = MATIERES.some((m) => m.label === state.info.subjectName);
    return !matchesKnownLabel;
  });

  // Active parameters derived from state
  const selectedFormat: NotebookPageFormat =
    state.paperFormat === 'custom'
      ? state.coversPerSheet === 2
        ? 'custom_double_horizontal'
        : 'custom_unique'
      : state.coversPerSheet === 2
      ? 'A4_double_horizontal'
      : 'A4_unique';
  const selectedType = selectedMatiere || 'autre';

  const currentTheme = THEMES[selectedType] || THEMES.autre;
  const profile =
    NOTEBOOK_SUBJECT_PROFILES[state.notebookSubject] || NOTEBOOK_SUBJECT_PROFILES.other;

  // Change format (1 par A4, 2 par A4, 1 par personnalisé, 2 par personnalisé)
  const handleFormatChange = (format: NotebookPageFormat) => {
    if (format === 'A4_unique') {
      onUpdateState((prev) => ({
        ...prev,
        paperFormat: 'A4',
        coversPerSheet: 1,
      }));
    } else if (format === 'A4_double_horizontal') {
      onUpdateState((prev) => ({
        ...prev,
        paperFormat: 'A4',
        coversPerSheet: 2,
      }));
    } else if (format === 'custom_unique') {
      onUpdateState((prev) => ({
        ...prev,
        paperFormat: 'custom',
        coversPerSheet: 1,
        customPaper: prev.customPaper || { widthMm: 210, heightMm: 297 },
      }));
    } else if (format === 'custom_double_horizontal') {
      onUpdateState((prev) => ({
        ...prev,
        paperFormat: 'custom',
        coversPerSheet: 2,
        customPaper: prev.customPaper || { widthMm: 297, heightMm: 210 },
      }));
    }
  };

  const pageCustomWidthCm = (state.customPaper?.widthMm ?? 210) / 10;
  const pageCustomHeightCm = (state.customPaper?.heightMm ?? 297) / 10;

  const activeCoverPreset = state.notebookCoverSizePreset || 'auto';
  const coverCustomWidthCm = state.notebookCoverCustomDimensions?.widthCm ?? 17;
  const coverCustomHeightCm = state.notebookCoverCustomDimensions?.heightCm ?? 22;

  // Réagit à chaque changement de matière
  useEffect(() => {
    // Règle 5 : Si le client change de matière (att_2), le compteur repart au Modèle 1 pour cette nouvelle matière
    if (lastMatiereRef.current !== selectedMatiere) {
      setCurrentModelIndex(0);
      lastMatiereRef.current = selectedMatiere;
    }

    const matiere = MATIERES.find((m) => m.id === selectedMatiere);

    if (!matiere) return;

    if (matiere.id === 'autre') {
      setTitreCahier('');
      setTitreModifieManuellement(false);
      onUpdateState((prev) => ({
        ...prev,
        notebookSubject: 'other',
        info: {
          ...prev.info,
          subjectName: '',
          hasSubject: false,
        },
      }));
      return;
    }

    if (!titreModifieManuellement) {
      setTitreCahier(matiere.label); // copie exacte, déclenché à coup sûr
      const matchedSubject = typeMatiereToSubject(matiere.id);
      onUpdateState((prev) => ({
        ...prev,
        notebookSubject: matchedSubject,
        info: {
          ...prev.info,
          subjectName: matiere.label,
          hasSubject: Boolean(matiere.label.trim()),
        },
      }));
    }
  }, [selectedMatiere]); // se déclenche à chaque changement de matière

  function handleMatiereChange(matiereId: string) {
    setSelectedMatiere(matiereId);
  }

  // Dès qu'il tape, on arrête d'écraser son texte
  function handleTitreInputChange(e: React.ChangeEvent<HTMLInputElement> | string) {
    const value = typeof e === 'string' ? e : e.target.value;
    setTitreCahier(value);
    setTitreModifieManuellement(true);

    onUpdateState((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        subjectName: value,
        hasSubject: Boolean(value.trim()),
      },
    }));
  }

  function resetTitreVersMatiere() {
    const matiere = MATIERES.find((m) => m.id === selectedMatiere);
    if (matiere) {
      setTitreCahier(matiere.label);
      setTitreModifieManuellement(false);

      onUpdateState((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          subjectName: matiere.label,
          hasSubject: Boolean(matiere.label.trim()),
        },
      }));
    }
  }

  /**
   * DÉCLENCHEMENT À L'APPUI DU BOUTON "GÉNÉRER"
   * Conforme au workflow CreaRocket direct :
   * att_2 (matière) → background fixe correspondant → att_3 grand titre → att_4...att_7 bloc élève → aperçu → PDF/PNG.
   */
  const onClickGenerer = () => {
    const activeTitre =
      titreCahier.trim() || (selectedMatiere === 'autre' ? customMatiereText.trim() : '');

    // Vérifier que les champs obligatoires sont remplis
    if (!selectedMatiere || !activeTitre) {
      setErrorMsg('Merci de choisir une matière et de saisir un titre de cahier.');
      return;
    }

    // 1. HARD SUBJECT LOCK: att_2 is the sole source of truth
    const subjectDef = getSubjectDefinition(selectedMatiere || 'autre');

    // 2. Sélection du modèle décoratif (modèle fixe ou rotation 1 à 5)
    let chosenModelNumber: number;
    if (selectedArtModelId > 0) {
      chosenModelNumber = selectedArtModelId;
    } else {
      chosenModelNumber = (currentModelIndex % ACTIVE_MODEL_COUNT) + 1;
    }
    setCurrentModelIndex(chosenModelNumber);
    const chosenTemplate = selectNextTemplateForSubject(subjectDef.id, chosenModelNumber);

    onUpdateState((prev) => ({
      ...prev,
      notebookSubject: subjectDef.id as any,
      aiCoverImage: undefined, // Clears any legacy AI image, displays vector template
      aiCoverVariationIndex: chosenTemplate.id - 1,
      aiCoverModelNumber: chosenTemplate.id,
      aiCoverThemeId: `template-${chosenTemplate.id}`,
      themeId: `template-${chosenTemplate.id}`,
      aiCoverBrandSlogan: CREAROCKET_BRAND.slogan,
      aiCoverStyleTitle: `${chosenTemplate.name}`,
      info: {
        ...prev.info,
        subjectName: activeTitre,
        hasSubject: true,
      },
    }));

    setHasGeneratedOnce(true);
    setErrorMsg(null);

    // Animation festive
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.75 },
        colors: [chosenTemplate.palette[0] || '#2563EB', chosenTemplate.palette[1] || '#0D9488', '#F59E0B'],
      });
    } catch {
      // Safe failover
    }
  };

  const isTitreArabic = /[\u0600-\u06FF]/.test(titreCahier);
  console.log("titreCahier:", titreCahier);

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs animate-fadeIn"
      dir="ltr"
    >
      {/* En-tête de section */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Wand2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              2. Génération IA de la couverture
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Créez une couverture de cahier personnalisée prête à imprimer
            </p>
          </div>
        </div>

        {hasGeneratedOnce && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Prête
          </span>
        )}
      </div>

      {/* PARAMÈTRE 1 : FORMAT DE PAGE */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-slate-500" />
          <span>Format de page (format_page) :</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFormatChange('A4_unique')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedFormat === 'A4_unique'
                ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900 shadow-2xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70'
            }`}
          >
            <span>1 par A4</span>
            <span className="text-[10px] font-normal text-slate-500 text-center">
              Pleine page Portrait
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFormatChange('A4_double_horizontal')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedFormat === 'A4_double_horizontal'
                ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900 shadow-2xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70'
            }`}
          >
            <span>2 par A4</span>
            <span className="text-[10px] font-normal text-slate-500 text-center">
              Page A4 paysage (2 cahiers verticaux)
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFormatChange('custom_unique')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedFormat === 'custom_unique'
                ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900 shadow-2xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70'
            }`}
          >
            <span>1 par personnalisé</span>
            <span className="text-[10px] font-normal text-slate-500 text-center">
              Pleine page, dimensions custom
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFormatChange('custom_double_horizontal')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedFormat === 'custom_double_horizontal'
                ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900 shadow-2xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100/70'
            }`}
          >
            <span>2 par personnalisé</span>
            <span className="text-[10px] font-normal text-slate-500 text-center">
              Page paysage (2 cahiers verticaux)
            </span>
          </button>
        </div>

        {/* Champs de dimensions personnalisées pour la feuille de page */}
        {(selectedFormat === 'custom_unique' || selectedFormat === 'custom_double_horizontal') && (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-fadeIn">
            <span className="block text-[11px] font-bold text-slate-700 mb-2">
              Dimensions de la feuille de page (en cm) :
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Largeur feuille (cm) :
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={pageCustomWidthCm}
                  onChange={(e) => {
                    const val = Math.max(5, Math.min(100, parseFloat(e.target.value) || 21));
                    onUpdateState((prev) => ({
                      ...prev,
                      customPaper: {
                        widthMm: Math.round(val * 10),
                        heightMm: prev.customPaper?.heightMm ?? 297,
                      },
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Hauteur feuille (cm) :
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={pageCustomHeightCm}
                  onChange={(e) => {
                    const val = Math.max(5, Math.min(100, parseFloat(e.target.value) || 29.7));
                    onUpdateState((prev) => ({
                      ...prev,
                      customPaper: {
                        widthMm: prev.customPaper?.widthMm ?? 210,
                        heightMm: Math.round(val * 10),
                      },
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PARAMÈTRE NOUVEAU : TAILLE DE LA COUVERTURE DE CAHIER */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-slate-500" />
          <span>Taille de la couverture de cahier :</span>
        </label>
        <select
          value={activeCoverPreset}
          onChange={(e) => {
            const val = e.target.value as any;
            onUpdateState((prev) => ({
              ...prev,
              notebookCoverSizePreset: val,
            }));
          }}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-2xs"
        >
          {NOTEBOOK_COVER_SIZES.map((size) => (
            <option key={size.id} value={size.id}>
              {size.label}
            </option>
          ))}
        </select>

        {activeCoverPreset === 'custom' && (
          <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-fadeIn">
            <span className="block text-[11px] font-bold text-slate-700 mb-2">
              Dimensions de la couverture de cahier (en cm) :
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Largeur couverture (cm) :
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={coverCustomWidthCm}
                  onChange={(e) => {
                    const val = Math.max(5, Math.min(100, parseFloat(e.target.value) || 17));
                    onUpdateState((prev) => ({
                      ...prev,
                      notebookCoverCustomDimensions: {
                        widthCm: val,
                        heightCm: prev.notebookCoverCustomDimensions?.heightCm ?? 22,
                      },
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Hauteur couverture (cm) :
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={coverCustomHeightCm}
                  onChange={(e) => {
                    const val = Math.max(5, Math.min(100, parseFloat(e.target.value) || 22));
                    onUpdateState((prev) => ({
                      ...prev,
                      notebookCoverCustomDimensions: {
                        widthCm: prev.notebookCoverCustomDimensions?.widthCm ?? 17,
                        heightCm: val,
                      },
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PARAMÈTRE 2 : CHOIX DE LA MATIÈRE */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Matière (type_matiere) :</span>
        </label>
        <select
          value={selectedMatiere}
          onChange={(e) => handleMatiereChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-2xs"
        >
          <option value="">-- Choisir une matière --</option>
          {MATIERES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label || 'Autre (Spécifier...)'}
            </option>
          ))}
        </select>

        {/* Gestion du cas "Autre (Spécifier...)" */}
        {selectedMatiere === 'autre' && (
          <div className="mt-2.5 animate-fadeIn">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Préciser la matière :
            </label>
            <input
              type="text"
              placeholder="Ex: Théâtre, Robotique, Échecs..."
              value={customMatiereText}
              onChange={(e) => {
                const val = e.target.value;
                setCustomMatiereText(val);
                if (!titreModifieManuellement && !titreCahier.trim()) {
                  setTitreCahier(val);
                  onUpdateState((prev) => ({
                    ...prev,
                    info: {
                      ...prev.info,
                      subjectName: val,
                      hasSubject: Boolean(val.trim()),
                    },
                  }));
                }
              }}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        )}
      </div>

      {/* PARAMÈTRE 3 : TITRE DU CAHIER (OBLIGATOIRE) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Titre du cahier (obligatoire) :</span>
          </label>
          <div className="flex items-center gap-2">
            {titreModifieManuellement && selectedMatiere && selectedMatiere !== 'autre' && (
              <button
                type="button"
                onClick={resetTitreVersMatiere}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                title="Réinitialiser au nom de la matière"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>↺ Revenir au nom de la matière</span>
              </button>
            )}
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Requis
            </span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Ex: Cahier de Mathématiques ou كرّاس الرياضيات"
          value={titreCahier}
          onChange={(e) => handleTitreInputChange(e.target.value)}
          required
          dir={isTitreArabic ? 'rtl' : 'ltr'}
          className={`w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold transition-all placeholder:text-slate-400 focus:outline-none text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 ${
            isTitreArabic ? 'text-right' : 'text-left'
          }`}
        />
        <p className="text-[10px] text-slate-500 mt-1">
          Apparaît en haut de la couverture en typographie claire et soignée, exactement comme saisi ici.
        </p>
      </div>

      {/* Direction Artistique / Modèle Graphique */}
      <div className="rounded-xl p-3.5 mb-4 border border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Layout className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direction Artistique (5 Modèles Actifs) :</span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            130 Variantes (26 × 5)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => setSelectedArtModelId(0)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left flex items-center gap-1.5 cursor-pointer border ${
              selectedArtModelId === 0
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <RefreshCw className={`w-3 h-3 shrink-0 ${selectedArtModelId === 0 ? 'animate-spin' : ''}`} />
            <span className="truncate">Rotation Auto</span>
          </button>

          {ART_DIRECTIONS.slice(0, ACTIVE_MODEL_COUNT).map((ad) => (
            <button
              key={ad.id}
              type="button"
              onClick={() => {
                setSelectedArtModelId(ad.id);
                setCurrentModelIndex(ad.id);
                onUpdateState((prev) => ({
                  ...prev,
                  aiCoverVariationIndex: ad.id - 1,
                  aiCoverModelNumber: ad.id,
                  aiCoverImage: undefined,
                }));
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left truncate cursor-pointer border ${
                selectedArtModelId === ad.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title={ad.styleDescription}
            >
              <span className="font-extrabold mr-1">M{ad.id}</span>
              <span>{ad.artDirectionName}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-600 italic">
          {selectedArtModelId === 0
            ? 'Rotation continue entre les 5 directions artistiques premium avec anti-répétition.'
            : ART_DIRECTIONS.find((a) => a.id === selectedArtModelId)?.styleDescription}
        </p>
      </div>

      {/* Thème visuel actif & Identité de la matière */}
      {(() => {
        const activeSubjDef = getSubjectDefinition(selectedType);
        return (
          <div
            className="rounded-xl p-3.5 mb-4 border transition-all"
            style={{
              backgroundColor: profile.dominantPalette.bg,
              borderColor: profile.dominantPalette.border + '70',
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs">
                <Palette className="w-4 h-4 text-slate-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">
                    Palette de marque :
                  </span>{' '}
                  <span className="text-slate-700 font-semibold">{currentTheme.palette}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-white rounded-full border border-slate-200 font-bold text-amber-600 shrink-0">
                <Rocket className="w-3 h-3 text-amber-500" />
                CreaRocket
              </span>
            </div>

            {/* Visual Identity Hero Objects & Composition */}
            {activeSubjDef.heroObjects && activeSubjDef.heroObjects.length > 0 && (
              <div className="text-[11px] text-slate-700 mt-1.5 pt-1.5 border-t border-slate-200/60 flex flex-col gap-1">
                <div>
                  <span className="font-bold text-slate-900">Objets phares : </span>
                  <span className="text-slate-600">{activeSubjDef.heroObjects.join(', ')}</span>
                </div>
                {activeSubjDef.lowerSceneDescription && (
                  <div className="italic text-slate-500">
                    "{activeSubjDef.lowerSceneDescription}"
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Message d'erreur */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold text-red-700 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={onClickGenerer}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* État de chargement */}
      {isGenerating && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
            <div className="flex-1">
              <h5 className="font-bold text-xs sm:text-sm text-emerald-900">
                Génération de la couverture en cours…
              </h5>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {generationStep === 1
                  ? '1/3 : Composition artistique et palette pastel CreaRocket…'
                  : generationStep === 2
                  ? '2/3 : Cadrage haute résolution selon le format de page…'
                  : '3/3 : Finalisation du visuel prêt pour l’impression…'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Indicateur de modèle actif */}
      {currentModelIndex > 0 && (
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direction artistique active :</span>
          </div>
          <span className="font-extrabold px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[11px] shadow-2xs">
            Modèle {currentModelIndex} — {ART_DIRECTIONS.find((a) => a.id === currentModelIndex)?.artDirectionName || 'Actif'}
          </span>
        </div>
      )}

      {/* Bouton principal "Générer" */}
      <button
        type="button"
        onClick={onClickGenerer}
        disabled={isGenerating}
        className={`w-full py-3.5 px-5 rounded-xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
          isGenerating
            ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
            : hasGeneratedOnce
            ? 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md active:scale-[0.99]'
            : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white hover:shadow-md active:scale-[0.99]'
        }`}
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Génération en cours…</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>
              {selectedArtModelId > 0
                ? `GÉNÉRER — MODÈLE 0${selectedArtModelId} (${ART_DIRECTIONS.find((a) => a.id === selectedArtModelId)?.artDirectionName})`
                : `GÉNÉRER LA COUVERTURE (Modèle ${(currentModelIndex % ACTIVE_MODEL_COUNT) + 1} / ${ACTIVE_MODEL_COUNT})`}
            </span>
          </>
        )}
      </button>

      {/* Mention de garantie */}
      <p className="text-[10px] text-slate-400 text-center mt-2.5 leading-normal">
        🚀 Design commercial haut de gamme CreaRocket, composition équilibrée et prête à imprimer.
      </p>
    </div>
  );
};

