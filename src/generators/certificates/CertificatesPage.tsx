import React, { useState, useRef } from 'react';
import { Language } from '../../types';
import {
  CertificateState,
  CertificateTypeId,
  CertificateTemplateId,
  CertificateRecipient,
} from '../../types/plannerAndCertificates';
import {
  CERTIFICATE_TEMPLATES,
  CERTIFICATE_PRESETS,
} from './CertificateLibrary';
import { CertificateRenderer } from './CertificateRenderer';
import {
  exportToPdf,
  exportToPng,
  printDirect,
} from '../../utils/exportUtils';
import {
  Award,
  ArrowLeft,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Palette,
  Users,
  Plus,
  Trash2,
  Check,
  RotateCw,
  FileSpreadsheet,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigate?: (route: string) => void;
}

export const CertificatesPage: React.FC<Props> = ({
  language,
  onNavigate,
}) => {
  const isArabic = language === 'ar';

  const [state, setState] = useState<CertificateState>(() => {
    const defaultType: CertificateTypeId = 'encouragement';
    const preset = CERTIFICATE_PRESETS[defaultType];

    return {
      typeId: defaultType,
      templateId: 'classic_gold',
      paperFormat: 'a4',
      orientation: 'landscape',

      title: preset.title,
      subtitle: preset.subtitle,
      studentName: 'Lucas Bernard',
      studentClass: 'CM1 B',
      schoolName: 'École Primaire Jules Ferry',
      academicYear: '2025 - 2026',
      awardTitle: preset.awardTitle,
      reasonText: preset.reasonText,
      issueDate: '26 Juin 2026',
      issueLocation: 'Lyon',
      certificateNumber: 'DIP-2026-089',

      schoolLogoUrl: '',
      showSchoolLogo: false,

      teacherSignatureLabel: 'La Professeure Principale',
      teacherSignatureName: 'Mme C. Martin',

      directorSignatureLabel: 'Le Directeur de l’École',
      directorSignatureName: 'M. Philippe Dubois',

      showOfficialStamp: true,
      stampText: 'SCEAU OFFICIEL',

      titleFont: 'outfit',
      nameFont: 'patrick',
      nameFontSize: 36,
      primaryColor: '#854D0E',
      secondaryColor: '#CA8A04',
      accentColor: '#FEF08A',
      borderColor: '#D97706',
      backgroundColor: '#FFFFFF',

      showBorder: true,
      showMedal: true,
      showStars: true,
      showSignatures: true,

      recipients: [
        { id: '1', studentName: 'Lucas Bernard', studentClass: 'CM1 B' },
        { id: '2', studentName: 'Inès Mansouri', studentClass: 'CM1 B' },
        { id: '3', studentName: 'Thomas Leroy', studentClass: 'CM1 B' },
        { id: '4', studentName: 'Camille Moreau', studentClass: 'CM1 B' },
      ],
      activeRecipientIndex: 0,

      zoom: 90,
      showTrimMarks: false,
    };
  });

  const [activeTab, setActiveTab] = useState<'type' | 'template' | 'recipient' | 'signatures'>('type');
  const [isExporting, setIsExporting] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);

  const previewSheetRef = useRef<HTMLDivElement>(null);
  const activeTemplate = CERTIFICATE_TEMPLATES[state.templateId] || CERTIFICATE_TEMPLATES.classic_gold;

  const isLandscape = state.orientation === 'landscape';
  const paperDimensions = {
    widthMm: isLandscape ? 297 : 210,
    heightMm: isLandscape ? 210 : 297,
  };

  const handlePrint = () => {
    printDirect();
  };

  const handleExportPdf = async () => {
    if (!previewSheetRef.current) return;
    setIsExporting(true);
    try {
      const currentName = state.recipients[state.activeRecipientIndex]?.studentName || 'eleve';
      const cleanName = currentName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await exportToPdf(
        previewSheetRef.current,
        paperDimensions,
        `diplome_${cleanName}_${state.templateId}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (!previewSheetRef.current) return;
    setIsExporting(true);
    try {
      const currentName = state.recipients[state.activeRecipientIndex]?.studentName || 'eleve';
      const cleanName = currentName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      await exportToPng(
        previewSheetRef.current,
        `diplome_${cleanName}_${state.templateId}.png`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectType = (typeId: CertificateTypeId) => {
    const preset = CERTIFICATE_PRESETS[typeId];
    setState((p) => ({
      ...p,
      typeId,
      title: preset.title,
      subtitle: preset.subtitle,
      awardTitle: preset.awardTitle,
      reasonText: preset.reasonText,
    }));
  };

  const handleAddRecipient = () => {
    const newId = String(Date.now());
    const newStudent: CertificateRecipient = {
      id: newId,
      studentName: 'Nouvel Élève',
      studentClass: state.studentClass,
    };
    setState((p) => ({
      ...p,
      recipients: [...p.recipients, newStudent],
      activeRecipientIndex: p.recipients.length,
      studentName: newStudent.studentName,
    }));
  };

  const handleRemoveRecipient = (idx: number) => {
    if (state.recipients.length <= 1) return;
    setState((p) => {
      const nextList = p.recipients.filter((_, i) => i !== idx);
      const nextIndex = Math.min(p.activeRecipientIndex, nextList.length - 1);
      return {
        ...p,
        recipients: nextList,
        activeRecipientIndex: nextIndex,
        studentName: nextList[nextIndex].studentName,
      };
    });
  };

  const handleImportCsv = () => {
    if (!csvText.trim()) return;
    const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: CertificateRecipient[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(/[,;\t]/).map((s) => s.trim());
      if (parts[0]) {
        parsed.push({
          id: `imp_${Date.now()}_${index}`,
          studentName: parts[0],
          studentClass: parts[1] || state.studentClass,
          awardTitle: parts[2] || state.awardTitle,
        });
      }
    });

    if (parsed.length > 0) {
      setState((p) => ({
        ...p,
        recipients: parsed,
        activeRecipientIndex: 0,
        studentName: parsed[0].studentName,
        studentClass: parsed[0].studentClass || p.studentClass,
      }));
      setShowCsvModal(false);
      setCsvText('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-900 select-none">
      {/* Top Utility Header */}
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
            <span
              className="p-1.5 rounded-lg border text-white shadow-2xs"
              style={{ backgroundColor: activeTemplate.primaryColor }}
            >
              <Award className="w-4 h-4 fill-white" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Générateur de Diplômes & Certificats d’Excellence
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: activeTemplate.accentColor, color: activeTemplate.primaryColor }}
                >
                  {activeTemplate.nameFr}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setState((p) => ({
                ...p,
                orientation: p.orientation === 'landscape' ? 'portrait' : 'landscape',
              }))
            }
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer"
            title="Basculer Paysage / Portrait"
          >
            <RotateCw className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">
              {state.orientation === 'landscape' ? 'Paysage' : 'Portrait'}
            </span>
          </button>

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
            <span className="hidden sm:inline">PNG HD</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-extrabold rounded-lg text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: activeTemplate.primaryColor }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Diplôme (PDF A4)</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Settings Panel */}
        <aside className="w-full lg:w-110 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col shrink-0 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-gray-200 p-1 bg-gray-50/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('type')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'type'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Type (10)
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'template'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Modèles (10)
            </button>
            <button
              onClick={() => setActiveTab('recipient')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'recipient'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3. Élèves ({state.recipients.length})
            </button>
            <button
              onClick={() => setActiveTab('signatures')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'signatures'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              4. Signatures
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* TAB 1: PRESET REASON & DISTINCTION */}
            {activeTab === 'type' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Objet & Catégorie de Récompense
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'encouragement', label: 'Diplôme d’Encouragement', desc: 'Efforts continus et persévérance scolaire', icon: '🌱' },
                    { id: 'excellence', label: 'Prix d’Excellence & Félicitations', desc: 'Résultats académiques de premier ordre', icon: '🏆' },
                    { id: 'reussite', label: 'Certificat de Réussite', desc: 'Validation complète des acquis du cycle', icon: '🎓' },
                    { id: 'brevet_fin_annee', label: 'Diplôme de Fin d’Année', desc: 'Célébration du passage en classe supérieure', icon: '📜' },
                    { id: 'lecture', label: 'Prix du Grand Lecteur', desc: 'Défi lecture et curiosité littéraire', icon: '📖' },
                    { id: 'sport', label: 'Champion Sportif & EPS', desc: 'Fair-play, endurance et tournois scolaires', icon: '⚽' },
                    { id: 'creativite', label: 'Prix du Jeune Artiste', desc: 'Imagination, arts plastiques et dessin', icon: '🎨' },
                    { id: 'merite', label: 'Mérite Scolaire & Citoyenneté', desc: 'Entraide, respect et camaraderie', icon: '🤝' },
                    { id: 'participation', label: 'Certificat de Participation', desc: 'Projet pédagogique ou sortie de classe', icon: '⭐' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectType(cat.id as CertificateTypeId)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        state.typeId === cat.id
                          ? 'border-2 border-amber-600 bg-amber-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <div className="font-extrabold text-xs text-gray-900">{cat.label}</div>
                          <div className="text-[11px] text-gray-500">{cat.desc}</div>
                        </div>
                      </div>
                      {state.typeId === cat.id && (
                        <Check className="w-4 h-4 text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GRAPHICAL TEMPLATES (10 STYLES) */}
            {activeTab === 'template' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    10 Modèles Décoratifs Haut de Gamme
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(CERTIFICATE_TEMPLATES).map((tpl) => {
                    const isSelected = tpl.id === state.templateId;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() =>
                          setState((p) => ({
                            ...p,
                            templateId: tpl.id,
                            primaryColor: tpl.primaryColor,
                            secondaryColor: tpl.secondaryColor,
                            borderColor: tpl.borderColor,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'border-2 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        style={{
                          backgroundColor: isSelected ? tpl.accentColor : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-2xl">{tpl.badgeEmoji}</span>
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: tpl.primaryColor }}
                          />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-gray-900">
                            {tpl.nameFr}
                          </div>
                          <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                            {tpl.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: RECIPIENT & BULK IMPORT */}
            {activeTab === 'recipient' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Élèves & Personnalisation ({state.recipients.length})
                  </h3>
                  <button
                    onClick={() => setShowCsvModal(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Import CSV</span>
                  </button>
                </div>

                {/* Recipient Picker List */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {state.recipients.map((rec, idx) => (
                    <div
                      key={rec.id}
                      onClick={() =>
                        setState((p) => ({
                          ...p,
                          activeRecipientIndex: idx,
                          studentName: rec.studentName,
                          studentClass: rec.studentClass || p.studentClass,
                        }))
                      }
                      className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        state.activeRecipientIndex === idx
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{rec.studentName}</span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          ({rec.studentClass || state.studentClass})
                        </span>
                      </div>
                      {state.recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRecipient(idx);
                          }}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddRecipient}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un élève</span>
                </button>

                {/* Selected Student Details Editor */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nom de l'élève à l'honneur
                    </label>
                    <input
                      type="text"
                      value={state.recipients[state.activeRecipientIndex]?.studentName || state.studentName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setState((p) => {
                          const nextRec = [...p.recipients];
                          if (nextRec[p.activeRecipientIndex]) {
                            nextRec[p.activeRecipientIndex].studentName = val;
                          }
                          return { ...p, studentName: val, recipients: nextRec };
                        });
                      }}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Classe
                      </label>
                      <input
                        type="text"
                        value={state.studentClass}
                        onChange={(e) => setState((p) => ({ ...p, studentClass: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Établissement
                      </label>
                      <input
                        type="text"
                        value={state.schoolName}
                        onChange={(e) => setState((p) => ({ ...p, schoolName: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mention / Titre honorifique
                    </label>
                    <input
                      type="text"
                      value={state.awardTitle}
                      onChange={(e) => setState((p) => ({ ...p, awardTitle: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Motivation de la distinction
                    </label>
                    <textarea
                      rows={2}
                      value={state.reasonText}
                      onChange={(e) => setState((p) => ({ ...p, reasonText: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SIGNATURES, DATE & OFFICIAL STAMP */}
            {activeTab === 'signatures' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Validation Officielle & Signatures
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Lieu de délivrance
                    </label>
                    <input
                      type="text"
                      value={state.issueLocation}
                      onChange={(e) => setState((p) => ({ ...p, issueLocation: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Date officielle
                    </label>
                    <input
                      type="text"
                      value={state.issueDate}
                      onChange={(e) => setState((p) => ({ ...p, issueDate: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-800">Signature 1 : Enseignant(e)</div>
                  <input
                    type="text"
                    value={state.teacherSignatureLabel}
                    onChange={(e) => setState((p) => ({ ...p, teacherSignatureLabel: e.target.value }))}
                    placeholder="Titre (ex: L'Enseignant(e))"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white outline-none"
                  />
                  <input
                    type="text"
                    value={state.teacherSignatureName}
                    onChange={(e) => setState((p) => ({ ...p, teacherSignatureName: e.target.value }))}
                    placeholder="Nom complet"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-800">Signature 2 : Direction</div>
                  <input
                    type="text"
                    value={state.directorSignatureLabel}
                    onChange={(e) => setState((p) => ({ ...p, directorSignatureLabel: e.target.value }))}
                    placeholder="Titre (ex: Le Directeur)"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white outline-none"
                  />
                  <input
                    type="text"
                    value={state.directorSignatureName}
                    onChange={(e) => setState((p) => ({ ...p, directorSignatureName: e.target.value }))}
                    placeholder="Nom complet"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">Sceau officiel en filigrane doré</span>
                  <input
                    type="checkbox"
                    checked={state.showOfficialStamp}
                    onChange={(e) => setState((p) => ({ ...p, showOfficialStamp: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Live Document Preview Panel */}
        <main className="flex-1 flex flex-col bg-slate-200/80 overflow-y-auto">
          {/* Zoom & Preview Toolbar */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Aperçu Diplôme Imprimable (Échelle Réelle A4 {state.orientation === 'landscape' ? 'Paysage' : 'Portrait'})</span>
            </div>

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

          {/* Paper Canvas Container */}
          <div className="flex-1 p-4 sm:p-8 flex items-center justify-center overflow-auto">
            <div
              style={{
                transform: `scale(${state.zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <div
                ref={previewSheetRef}
                style={{
                  width: `${paperDimensions.widthMm}mm`,
                  height: `${paperDimensions.heightMm}mm`,
                }}
                className="bg-white shadow-2xl border border-gray-300 relative box-border overflow-hidden"
              >
                <CertificateRenderer state={state} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Importer une liste d’élèves (CSV)
              </h3>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Collez ci-dessous la liste de vos élèves (un élève par ligne, format : <code>Nom, Classe, Mention</code>).
            </p>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Yasmine Benali, CM2 A, Félicitations du jury&#10;Thomas Martin, CM2 A, Progrès constants&#10;Inès Dubois, CM2 A, Prix de lecture"
              className="w-full p-3 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleImportCsv}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-xs"
              >
                Générer les diplômes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
