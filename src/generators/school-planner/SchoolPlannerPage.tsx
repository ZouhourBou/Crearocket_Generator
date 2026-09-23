import React, { useState, useRef } from 'react';
import { Language } from '../../types';
import {
  SchoolPlannerState,
  PlannerViewMode,
  PlannerTemplateId,
  DayOfWeek,
  PlannerPaperFormat,
} from '../../types/plannerAndCertificates';
import {
  PLANNER_TEMPLATES,
  DEFAULT_SCHOOL_SUBJECTS,
  ALL_DAYS,
} from './PlannerTemplateLibrary';
import { PlannerRenderer } from './PlannerRenderer';
import {
  exportToPdf,
  exportToPng,
  printDirect,
} from '../../utils/exportUtils';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Plus,
  Trash2,
  Check,
  Palette,
  BookOpen,
  Sun,
  Layers,
  RotateCw,
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigate?: (route: string) => void;
}

export const SchoolPlannerPage: React.FC<Props> = ({
  language,
  onNavigate,
}) => {
  const isArabic = language === 'ar';

  const [state, setState] = useState<SchoolPlannerState>(() => ({
    viewMode: 'timetable',
    templateId: 'classic_school',
    paperFormat: 'a4',
    orientation: 'landscape',

    studentName: 'Yasmine Benali',
    studentClass: 'CM2 / 5ème A',
    schoolName: 'École Primaire Victor Hugo',
    academicYear: '2025 - 2026',
    customTitle: 'EMPLOI DU TEMPS SCOLAIRE',
    subtitle: 'Semaine d’apprentissage & d’activités',

    activeDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    timeSlots: [
      { id: 's1', startTime: '08:30', endTime: '09:30', label: 'Cours 1' },
      { id: 's2', startTime: '09:30', endTime: '10:30', label: 'Cours 2' },
      { id: 'p1', startTime: '10:30', endTime: '10:45', label: 'Récréation du Matin', isBreak: true },
      { id: 's3', startTime: '10:45', endTime: '11:45', label: 'Cours 3' },
      { id: 'p2', startTime: '11:45', endTime: '13:30', label: 'Déjeuner & Pause méridienne', isBreak: true },
      { id: 's4', startTime: '13:30', endTime: '14:30', label: 'Cours 4' },
      { id: 's5', startTime: '14:30', endTime: '15:30', label: 'Cours 5' },
      { id: 'p3', startTime: '15:30', endTime: '15:45', label: 'Goûter', isBreak: true },
      { id: 's6', startTime: '15:45', endTime: '16:45', label: 'Aide aux devoirs / Étude' },
    ],
    subjects: DEFAULT_SCHOOL_SUBJECTS,
    timetableGrid: {
      'mon_s1': { day: 'mon', slotId: 's1', subjectId: 'maths', room: '12' },
      'mon_s2': { day: 'mon', slotId: 's2', subjectId: 'francais', room: '12' },
      'mon_s3': { day: 'mon', slotId: 's3', subjectId: 'histoire_geo', room: '12' },
      'mon_s4': { day: 'mon', slotId: 's4', subjectId: 'sciences', room: 'Labo' },
      'mon_s5': { day: 'mon', slotId: 's5', subjectId: 'anglais', room: '12' },
      'mon_s6': { day: 'mon', slotId: 's6', subjectId: 'arts', room: 'Atelier' },

      'tue_s1': { day: 'tue', slotId: 's1', subjectId: 'francais', room: '12' },
      'tue_s2': { day: 'tue', slotId: 's2', subjectId: 'maths', room: '12' },
      'tue_s3': { day: 'tue', slotId: 's3', subjectId: 'sport', room: 'Gymnase' },
      'tue_s4': { day: 'tue', slotId: 's4', subjectId: 'sport', room: 'Gymnase' },
      'tue_s5': { day: 'tue', slotId: 's5', subjectId: 'arabe', room: '12' },
      'tue_s6': { day: 'tue', slotId: 's6', subjectId: 'musique', room: 'Musique' },

      'wed_s1': { day: 'wed', slotId: 's1', subjectId: 'maths', room: '12' },
      'wed_s2': { day: 'wed', slotId: 's2', subjectId: 'francais', room: '12' },
      'wed_s3': { day: 'wed', slotId: 's3', subjectId: 'informatique', room: 'Info' },

      'thu_s1': { day: 'thu', slotId: 's1', subjectId: 'sciences', room: 'Labo' },
      'thu_s2': { day: 'thu', slotId: 's2', subjectId: 'anglais', room: '12' },
      'thu_s3': { day: 'thu', slotId: 's3', subjectId: 'francais', room: '12' },
      'thu_s4': { day: 'thu', slotId: 's4', subjectId: 'maths', room: '12' },
      'thu_s5': { day: 'thu', slotId: 's5', subjectId: 'histoire_geo', room: '12' },
      'thu_s6': { day: 'thu', slotId: 's6', subjectId: 'arabe', room: '12' },

      'fri_s1': { day: 'fri', slotId: 's1', subjectId: 'maths', room: '12' },
      'fri_s2': { day: 'fri', slotId: 's2', subjectId: 'francais', room: '12' },
      'fri_s3': { day: 'fri', slotId: 's3', subjectId: 'islamique', room: '12' },
      'fri_s4': { day: 'fri', slotId: 's4', subjectId: 'sciences', room: 'Labo' },
      'fri_s5': { day: 'fri', slotId: 's5', subjectId: 'arts', room: 'Atelier' },
      'fri_s6': { day: 'fri', slotId: 's6', subjectId: 'anglais', room: '12' },
    },

    weekNumber: '12',
    dateRange: 'Du 15 au 19 Septembre',
    weeklyGoal: 'Mémoriser la table de 7 et préparer le contrôle d’Histoire.',
    plannerType: 'academic',
    weeklyTasks: [
      { id: 'w1', day: 'mon', text: 'Exercice 4 page 32 en Mathématiques', type: 'homework' },
      { id: 'w2', day: 'mon', text: 'Apprendre les 10 mots invariables', type: 'homework' },
      { id: 'w3', day: 'tue', text: 'Tenue de sport et gourde', type: 'reminder' },
      { id: 'w4', day: 'thu', text: 'Contrôle de SVT : le cycle de l’eau', type: 'exam' },
      { id: 'w5', day: 'fri', text: 'Rendre le livre de bibliothèque', type: 'reminder' },
    ],
    generalNotes: 'Rappel : Réunion parents-professeurs vendredi à 17h30.',

    activities: [
      { id: 'a1', day: 'mon', name: 'Cours de Piano', time: '17h30 - 18h30', location: 'Conservatoire', color: '#EDE9FE' },
      { id: 'a2', day: 'wed', name: 'Entraînement Football', time: '14h00 - 16h00', location: 'Stade Municipal', color: '#DCFCE7' },
      { id: 'a3', day: 'sat', name: 'Atelier Dessin & Aquarelle', time: '10h00 - 11h30', location: 'Maison de quartier', color: '#FEF3C7' },
      { id: 'a4', day: 'fri', name: 'Natation club', time: '18h00 - 19h00', location: 'Piscine Olympique', color: '#CFFAFE' },
    ],

    morningRoutines: [
      { id: 'm1', period: 'morning', title: 'Réveil en douceur & étirements', icon: '⏰' },
      { id: 'm2', period: 'morning', title: 'Prendre un bon petit-déjeuner', icon: '🥛' },
      { id: 'm3', period: 'morning', title: 'Se brosser les dents & toilette', icon: '🪥' },
      { id: 'm4', period: 'morning', title: 'S’habiller proprement', icon: '👕' },
      { id: 'm5', period: 'morning', title: 'Vérifier la trousse et le cartable', icon: '🎒' },
    ],
    eveningRoutines: [
      { id: 'e1', period: 'evening', title: 'Faire les devoirs & relire la leçon', icon: '📚' },
      { id: 'e2', period: 'evening', title: 'Préparer les vêtements pour demain', icon: '👖' },
      { id: 'e3', period: 'evening', title: 'Dîner en famille sans écran', icon: '🍲' },
      { id: 'e4', period: 'evening', title: 'Brossage des dents & pyjama', icon: '🪥' },
      { id: 'e5', period: 'evening', title: 'Lecture calme au lit & dodo', icon: '📖' },
    ],

    primaryColor: '#1E3A8A',
    fontFamily: 'outfit',
    showBorders: true,
    zoom: 90,
    printMode: 'home',
    showTrimMarks: false,
  }));

  const [activeTab, setActiveTab] = useState<'mode' | 'content' | 'template' | 'settings'>('mode');
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const previewSheetRef = useRef<HTMLDivElement>(null);
  const activeTemplate = PLANNER_TEMPLATES[state.templateId] || PLANNER_TEMPLATES.classic_school;

  // Paper Dimensions in mm (A4 landscape is 297x210)
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
      await exportToPdf(
        previewSheetRef.current,
        paperDimensions,
        `emploi_du_temps_${state.templateId}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (!previewSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPng(
        previewSheetRef.current,
        `emploi_du_temps_${state.templateId}.png`
      );
    } finally {
      setIsExporting(false);
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
              style={{ backgroundColor: activeTemplate.primaryColor, borderColor: activeTemplate.cellBorderColor }}
            >
              <Calendar className="w-4 h-4 fill-white" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Générateur d'Emplois du Temps & Plannings Scolaires
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: activeTemplate.accentBg, color: activeTemplate.primaryColor }}
                >
                  {activeTemplate.nameFr}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Export and Print actions */}
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
              {state.orientation === 'landscape' ? 'Format Paysage' : 'Format Portrait'}
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
            <span>Exporter en PDF A4</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Settings & Customization Panel */}
        <aside className="w-full lg:w-110 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col shrink-0 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto">
          {/* Section Tabs */}
          <div className="grid grid-cols-4 border-b border-gray-200 p-1 bg-gray-50/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('mode')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'mode'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Type
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'template'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Thèmes (8)
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3. Contenu
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              4. Matières
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* TAB 1: VIEW MODE SELECTION */}
            {activeTab === 'mode' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Type de document à concevoir
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      id: 'timetable',
                      label: 'Emploi du Temps Hebdomadaire',
                      desc: 'Grille des cours avec matières, salles, enseignants et créneaux horaires configurables.',
                      icon: <Calendar className="w-5 h-5 text-blue-600" />,
                    },
                    {
                      id: 'weekly_planner',
                      label: 'Semainier Scolaire & Devoirs',
                      desc: 'Colonnes par jour pour noter les devoirs, examens et objectifs hebdomadaires.',
                      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
                    },
                    {
                      id: 'activity',
                      label: "Organisateur d'Activités & Sports",
                      desc: 'Planning hebdomadaire des loisirs, clubs de sport, conservatoire et sorties.',
                      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
                    },
                    {
                      id: 'daily_routine',
                      label: 'Routine Quotidienne (Matin / Soir)',
                      desc: 'Liste à cocher des habitudes et routines pour enfants avec icônes éducatives.',
                      icon: <Sun className="w-5 h-5 text-rose-600" />,
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setState((p) => ({ ...p, viewMode: m.id as PlannerViewMode }))
                      }
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        state.viewMode === m.id
                          ? 'border-2 border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-white border border-gray-200 shrink-0">
                        {m.icon}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-gray-900">{m.label}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Day selector */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Jours de classe actifs dans la grille
                  </label>
                  <div className="grid grid-cols-7 gap-1">
                    {ALL_DAYS.map((d) => {
                      const isActive = state.activeDays.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setState((p) => ({
                              ...p,
                              activeDays: isActive
                                ? p.activeDays.filter((x) => x !== d.id)
                                : [...p.activeDays, d.id],
                            }));
                          }}
                          className={`py-1.5 text-center text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {d.labelShortFr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TEMPLATE SELECTION (8 STYLES) */}
            {activeTab === 'template' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    8 Modèles Graphiques Décoratifs
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(PLANNER_TEMPLATES).map((tpl) => {
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
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'border-2 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        style={{
                          backgroundColor: isSelected ? tpl.accentBg : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xl">{tpl.decorativeBadgeEmoji}</span>
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

            {/* TAB 3: CONTENT & HEADER METADATA */}
            {activeTab === 'content' && (
              <div className="space-y-3.5">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Informations sur l’élève & l’école
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Titre du document
                  </label>
                  <input
                    type="text"
                    value={state.customTitle}
                    onChange={(e) => setState((p) => ({ ...p, customTitle: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nom de l'élève
                    </label>
                    <input
                      type="text"
                      value={state.studentName}
                      onChange={(e) => setState((p) => ({ ...p, studentName: e.target.value }))}
                      placeholder="Ex: Yasmine..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Classe
                    </label>
                    <input
                      type="text"
                      value={state.studentClass}
                      onChange={(e) => setState((p) => ({ ...p, studentClass: e.target.value }))}
                      placeholder="Ex: CM2 A..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nom de l'établissement
                    </label>
                    <input
                      type="text"
                      value={state.schoolName}
                      onChange={(e) => setState((p) => ({ ...p, schoolName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Année scolaire
                    </label>
                    <input
                      type="text"
                      value={state.academicYear}
                      onChange={(e) => setState((p) => ({ ...p, academicYear: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {state.viewMode === 'weekly_planner' && (
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Objectif de la semaine
                      </label>
                      <input
                        type="text"
                        value={state.weeklyGoal}
                        onChange={(e) => setState((p) => ({ ...p, weeklyGoal: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SUBJECTS & TIME SLOTS MANAGEMENT */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Bibliothèque des matières & Couleurs
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {state.subjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2 rounded-lg border text-xs font-bold flex items-center justify-between shadow-2xs"
                      style={{ backgroundColor: sub.color, color: sub.textColor }}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{sub.icon}</span>
                        <span>{sub.name}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Time slot quick toggles */}
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Créneaux horaires & Pauses ({state.timeSlots.length})
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {state.timeSlots.map((slot, idx) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                      >
                        <span className="font-mono font-bold text-gray-800">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-gray-500 truncate max-w-[130px]">
                          {slot.label || (slot.isBreak ? 'Pause' : `Période ${idx + 1}`)}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${slot.isBreak ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                          {slot.isBreak ? 'Pause' : 'Cours'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Live Document Preview Panel */}
        <main className="flex-1 flex flex-col bg-slate-200/80 overflow-y-auto">
          {/* Zoom and Preview Toolbar */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Aperçu Document Imprimable (Échelle Réelle A4 {state.orientation === 'landscape' ? 'Paysage' : 'Portrait'})</span>
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
                <PlannerRenderer state={state} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
