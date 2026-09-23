import React, { useState, useRef } from 'react';
import { Language } from '../types';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  BookOpen,
  LayoutGrid,
  Columns,
  Sparkles,
  HelpCircle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckSquare,
  ListChecks,
  Split,
  Table as TableIcon,
  PenLine,
} from 'lucide-react';
import { exportToPdf } from '../utils/exportUtils';

interface WorksheetEditorWorkspaceProps {
  language: Language;
}

export type BlockType = 'mcq' | 'true_false' | 'matching' | 'open_question' | 'table';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title: string;
  points: number;
}

export interface MCQBlock extends BaseBlock {
  type: 'mcq';
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TrueFalseBlock extends BaseBlock {
  type: 'true_false';
  instruction: string;
  statements: { text: string; isTrue: boolean }[];
}

export interface MatchingBlock extends BaseBlock {
  type: 'matching';
  instruction: string;
  leftItems: string[];
  rightItems: string[];
  correctPairs: [number, number][]; // [leftIndex, rightIndex]
}

export interface OpenQuestionBlock extends BaseBlock {
  type: 'open_question';
  question: string;
  linesCount: number;
  modelAnswer: string;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  instruction: string;
  headers: string[];
  rows: string[][];
  solutionRows: string[][];
}

export type WorksheetBlock =
  | MCQBlock
  | TrueFalseBlock
  | MatchingBlock
  | OpenQuestionBlock
  | TableBlock;

const INITIAL_BLOCKS: WorksheetBlock[] = [
  {
    id: 'block-1',
    type: 'mcq',
    title: 'Exercice 1 : Nombres décimaux & fractions',
    points: 4,
    question: 'Quelle est la fraction irréductible équivalente au nombre décimal 0,75 ?',
    options: ['1 / 2', '3 / 4', '7 / 5', '3 / 10'],
    correctIndex: 1,
  },
  {
    id: 'block-2',
    type: 'true_false',
    title: 'Exercice 2 : Géométrie & Propriétés',
    points: 4,
    instruction: 'Cochez la case Vrai ou Faux pour chaque affirmation.',
    statements: [
      { text: 'Un triangle équilatéral possède 3 côtés de même longueur.', isTrue: true },
      { text: 'La somme des trois angles d’un triangle vaut toujours 180°.', isTrue: true },
      { text: 'Un rectangle possède 4 côtés de même longueur.', isTrue: false },
      { text: 'Le losange possède des diagonales perpendiculaires.', isTrue: true },
    ],
  },
  {
    id: 'block-3',
    type: 'matching',
    title: 'Exercice 3 : Calcul mental rapide',
    points: 4,
    instruction: 'Reliez chaque calcul de la colonne de gauche à son résultat correspondant à droite.',
    leftItems: ['15 × 4', '120 ÷ 3', '25 + 35', '90 − 45'],
    rightItems: ['40', '60', '45', '60'],
    correctPairs: [
      [0, 1], // 15*4 = 60
      [1, 0], // 120/3 = 40
      [2, 3], // 25+35 = 60
      [3, 2], // 90-45 = 45
    ],
  },
  {
    id: 'block-4',
    type: 'open_question',
    title: 'Exercice 4 : Résolution de problème & Rédaction',
    points: 5,
    question:
      'Un libraire reçoit 8 cartons contenant chacun 24 cahiers d’exercices. Il vend ensuite 65 cahiers dans la journée. Combien de cahiers lui reste-t-il ? Détaillez votre démarche et écrivez une phrase réponse.',
    linesCount: 4,
    modelAnswer:
      'Nombre total de cahiers reçus : 8 × 24 = 192 cahiers.\nNombre de cahiers restants : 192 − 65 = 127 cahiers.\nPhrase réponse : Il reste 127 cahiers au libraire.',
  },
  {
    id: 'block-5',
    type: 'table',
    title: 'Exercice 5 : Tableau de proportionnalité',
    points: 3,
    instruction: 'Complétez le tableau suivant sachant que le prix est proportionnel au nombre de stylos.',
    headers: ['Nombre de stylos', '2', '4', '6', '10'],
    rows: [['Prix en euros (€)', '3,00', '...', '9,00', '...']],
    solutionRows: [['Prix en euros (€)', '3,00', '6,00', '9,00', '15,00']],
  },
];

export const WorksheetEditorWorkspace: React.FC<WorksheetEditorWorkspaceProps> = ({
  language,
}) => {
  const isArabic = language === 'ar';

  // Worksheet Document Metadata State
  const [schoolName, setSchoolName] = useState('École Élémentaire Victor Hugo');
  const [title, setTitle] = useState('Évaluation de Mathématiques : Nombres, Calculs & Géométrie');
  const [subject, setSubject] = useState('Mathématiques');
  const [grade, setGrade] = useState('Classe de CM2');
  const [dateStr, setDateStr] = useState('Trimestre 1 • 2024-2025');
  const [generalInstruction, setGeneralInstruction] = useState(
    'Lisez attentivement chaque consigne. Soignez la présentation et la propreté de votre copie.'
  );
  const [maxScore, setMaxScore] = useState(20);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [columns, setColumns] = useState<1 | 2>(1);

  // Display options
  const [showStudentName, setShowStudentName] = useState(true);
  const [showScoreBox, setShowScoreBox] = useState(true);
  const [showDate, setShowDate] = useState(true);

  // View mode: 'student' (Fiche élève) or 'teacher' (Corrigé)
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  // Blocks
  const [blocks, setBlocks] = useState<WorksheetBlock[]>(INITIAL_BLOCKS);

  // UI / Preview Controls
  const [zoom, setZoom] = useState<number>(100);
  const [isExporting, setIsExporting] = useState(false);
  const printSheetRef = useRef<HTMLDivElement>(null);

  // Total points calculation
  const calculatedPoints = blocks.reduce((sum, b) => sum + (Number(b.points) || 0), 0);

  // Block management handlers
  const handleAddBlock = (type: BlockType) => {
    const nextIndex = blocks.length + 1;
    let newBlock: WorksheetBlock;

    switch (type) {
      case 'mcq':
        newBlock = {
          id: `block-${Date.now()}`,
          type: 'mcq',
          title: `Exercice ${nextIndex} : Question à choix multiples`,
          points: 3,
          question: 'Quelle est la bonne réponse ?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
        };
        break;
      case 'true_false':
        newBlock = {
          id: `block-${Date.now()}`,
          type: 'true_false',
          title: `Exercice ${nextIndex} : Vrai ou Faux`,
          points: 3,
          instruction: 'Cochez la case Vrai ou Faux.',
          statements: [
            { text: 'Affirmation numéro 1', isTrue: true },
            { text: 'Affirmation numéro 2', isTrue: false },
            { text: 'Affirmation numéro 3', isTrue: true },
          ],
        };
        break;
      case 'matching':
        newBlock = {
          id: `block-${Date.now()}`,
          type: 'matching',
          title: `Exercice ${nextIndex} : Relier les éléments`,
          points: 4,
          instruction: 'Reliez chaque élément de gauche à sa réponse de droite.',
          leftItems: ['Élément A', 'Élément B', 'Élément C'],
          rightItems: ['Réponse 1', 'Réponse 2', 'Réponse 3'],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        };
        break;
      case 'open_question':
        newBlock = {
          id: `block-${Date.now()}`,
          type: 'open_question',
          title: `Exercice ${nextIndex} : Rédaction / Problème`,
          points: 4,
          question: 'Écrivez votre réponse détaillée ci-dessous.',
          linesCount: 3,
          modelAnswer: 'Exemple de réponse attendue pour le corrigé.',
        };
        break;
      case 'table':
        newBlock = {
          id: `block-${Date.now()}`,
          type: 'table',
          title: `Exercice ${nextIndex} : Tableau à compléter`,
          points: 4,
          instruction: 'Complétez les cases vides du tableau.',
          headers: ['Grandeur', 'Valeur 1', 'Valeur 2', 'Valeur 3'],
          rows: [['Ligne 1', '10', '...', '30']],
          solutionRows: [['Ligne 1', '10', '20', '30']],
        };
        break;
    }

    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleUpdateBlockTitle = (id: string, newTitle: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, title: newTitle } : b)));
  };

  const handleUpdateBlockPoints = (id: string, newPoints: number) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, points: newPoints } : b)));
  };

  // PDF Export
  const handleExportPdf = async () => {
    if (!printSheetRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const paperDim =
        orientation === 'portrait'
          ? { widthMm: 210, heightMm: 297 }
          : { widthMm: 297, heightMm: 210 };
      const safeFilename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'fiche_exercices'}_${viewMode}.pdf`;
      await exportToPdf(printSheetRef.current, paperDim, safeFilename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Print
  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div id="worksheet-studio" className="w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Quick Actions Bar */}
      <div className="bg-white border-b border-slate-200/90 py-3.5 px-4 sm:px-6 lg:px-8 shadow-2xs sticky top-18 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: View Mode Toggle (Fiche élève vs Corrigé) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Fiche Élève (Prête à imprimer)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('teacher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Corrigé Enseignant</span>
            </button>
          </div>

          {/* Right: PDF & Print Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleDirectPrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#D1192A] hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-sm shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Génération...' : 'Télécharger PDF (A4)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid (5 cols editor form, 7 cols live A4 preview) */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Editor Form & Pedagogical Blocks (5 cols)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            {/* Card 1: En-tête & Informations Générales */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-50 text-red-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      En-tête & Document
                    </h2>
                    <p className="text-xs text-slate-500">
                      Personnalisez le titre, l’école et les consignes
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                  {calculatedPoints} / {maxScore} pts
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* School Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom de l’établissement / École
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Ex: École Primaire Jules Ferry"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium text-slate-800"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre de la fiche / Évaluation
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Évaluation de Mathématiques"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-bold text-slate-900"
                  />
                </div>

                {/* Subject & Grade */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Matière
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ex: Mathématiques"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Classe / Niveau
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Ex: CM2"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Date & Max Score */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Date / Période
                    </label>
                    <input
                      type="text"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      placeholder="Ex: 2024-2025"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Barème total (pts)
                    </label>
                    <input
                      type="number"
                      value={maxScore}
                      onChange={(e) => setMaxScore(Number(e.target.value) || 20)}
                      min={1}
                      max={100}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Consignes générales */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Consigne générale
                  </label>
                  <textarea
                    rows={2}
                    value={generalInstruction}
                    onChange={(e) => setGeneralInstruction(e.target.value)}
                    placeholder="Instructions affichées sous l’en-tête..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all font-medium text-slate-800 text-xs resize-none"
                  />
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showStudentName}
                      onChange={(e) => setShowStudentName(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span>Ligne Nom / Prénom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showScoreBox}
                      onChange={(e) => setShowScoreBox(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span>Cadre Note / Barème</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDate}
                      onChange={(e) => setShowDate(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span>Date</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Card 2: Mise en page A4 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                Format & Mise en page
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block font-bold text-slate-700 mb-1.5">Orientation A4</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrientation('portrait')}
                      className={`px-3 py-2 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                        orientation === 'portrait'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('landscape')}
                      className={`px-3 py-2 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                        orientation === 'landscape'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Paysage
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block font-bold text-slate-700 mb-1.5">Colonnes</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setColumns(1)}
                      className={`px-3 py-2 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                        columns === 1
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      1 Colonne
                    </button>
                    <button
                      type="button"
                      onClick={() => setColumns(2)}
                      className={`px-3 py-2 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                        columns === 2
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      2 Colonnes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Blocs Pédagogiques (Liste et Ajout) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Blocs Pédagogiques ({blocks.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Modifiez les exercices ou ajoutez de nouveaux modules
                  </p>
                </div>
              </div>

              {/* Quick Add Block Buttons */}
              <div className="mb-5">
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  + Ajouter un exercice :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddBlock('mcq')}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>QCM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('true_false')}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Vrai / Faux</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('matching')}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Split className="w-3.5 h-3.5 text-purple-500" />
                    <span>Relier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('open_question')}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <PenLine className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rédaction</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('table')}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <TableIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tableau</span>
                  </button>
                </div>
              </div>

              {/* Block List */}
              <div className="space-y-3">
                {blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => handleUpdateBlockTitle(block.id, e.target.value)}
                          className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-red-500 focus:bg-white outline-none px-1 py-0.5 rounded transition-colors text-xs truncate max-w-[200px] sm:max-w-[240px]"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          <input
                            type="number"
                            value={block.points}
                            onChange={(e) =>
                              handleUpdateBlockPoints(block.id, Number(e.target.value) || 0)
                            }
                            className="w-8 text-center font-bold text-slate-800 outline-none"
                            min={0}
                            max={50}
                          />
                          <span className="text-[10px] text-slate-400 font-bold">pts</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Supprimer l'exercice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick description per block type */}
                    <div className="text-[11px] text-slate-500 pl-7 flex items-center gap-1.5">
                      {block.type === 'mcq' && (
                        <span>QCM • {block.options.length} options (Bonne réponse : {block.options[block.correctIndex]})</span>
                      )}
                      {block.type === 'true_false' && (
                        <span>Vrai / Faux • {block.statements.length} propositions</span>
                      )}
                      {block.type === 'matching' && (
                        <span>Relier • {block.leftItems.length} paires</span>
                      )}
                      {block.type === 'open_question' && (
                        <span>Question ouverte • {block.linesCount} lignes de réponse</span>
                      )}
                      {block.type === 'table' && (
                        <span>Tableau à compléter • {block.headers.length} colonnes</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Sticky Live A4 Worksheet Preview (7 cols)  */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-36">
            <div className="bg-slate-900/5 rounded-3xl p-4 sm:p-6 border border-slate-200/80">
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    Aperçu Feuille A4
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 border border-slate-200">
                    210 × 297 mm
                  </span>
                  {viewMode === 'teacher' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Mode Corrigé
                    </span>
                  )}
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(50, z - 10))}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-700 px-1.5 min-w-[40px] text-center">
                    {zoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(150, z + 10))}
                    className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(100)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
                    title="Réinitialiser zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Scrollable Container with Sheet */}
              <div className="w-full overflow-auto flex justify-center py-2 max-h-[78vh]">
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="shrink-0"
                >
                  {/* The A4 Sheet Paper */}
                  <div
                    ref={printSheetRef}
                    style={{
                      width: orientation === 'portrait' ? '210mm' : '297mm',
                      minHeight: orientation === 'portrait' ? '297mm' : '210mm',
                      boxSizing: 'border-box',
                    }}
                    className="bg-white text-slate-900 shadow-xl border border-slate-300 p-8 sm:p-10 flex flex-col justify-between select-text"
                  >
                    {/* Top Sheet Header */}
                    <div>
                      {/* School & Assessment Identification Box */}
                      <div className="border-2 border-slate-800 rounded-xl p-4 mb-4 bg-slate-50/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                              {schoolName || 'Établissement scolaire'}
                            </div>
                            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                              {title || 'Titre de l’évaluation'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-700 font-semibold">
                              <span className="bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                                {subject}
                              </span>
                              <span>•</span>
                              <span>{grade}</span>
                              {showDate && dateStr && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-500">{dateStr}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Score / Note Box */}
                          {showScoreBox && (
                            <div className="border-2 border-slate-800 rounded-lg p-2.5 text-center min-w-[85px] bg-white">
                              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                                Note
                              </div>
                              <div className="text-lg font-black text-slate-900 tracking-tight my-0.5">
                                {viewMode === 'teacher' ? (
                                  <span className="text-emerald-700">{calculatedPoints}</span>
                                ) : (
                                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                )}
                              </div>
                              <div className="text-[10px] font-bold text-slate-500 border-t border-slate-300 pt-0.5">
                                / {maxScore}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Student Name Line */}
                        {showStudentName && (
                          <div className="mt-3 pt-3 border-t border-slate-300/80 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-800">
                            <div className="flex items-baseline gap-2 flex-1 min-w-[200px]">
                              <span className="text-slate-600">Nom & Prénom :</span>
                              <div className="flex-1 border-b border-dashed border-slate-400 min-h-[16px]" />
                            </div>
                            <div className="flex items-baseline gap-2 w-36">
                              <span className="text-slate-600">Date :</span>
                              <div className="flex-1 border-b border-dashed border-slate-400 min-h-[16px]" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* General Instruction */}
                      {generalInstruction && (
                        <div className="mb-5 text-[11px] italic text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-lg border-l-3 border-slate-700">
                          {generalInstruction}
                        </div>
                      )}

                      {/* Teacher Key Watermark Header in Teacher Mode */}
                      {viewMode === 'teacher' && (
                        <div className="mb-5 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            DOCUMENT CORRIGÉ OFFICIEL • ÉVALUATION ENSEIGNANT
                          </span>
                          <span className="text-[11px] bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-800">
                            Barème total : {calculatedPoints} points
                          </span>
                        </div>
                      )}

                      {/* Exercises Container */}
                      <div
                        className={`space-y-6 ${
                          columns === 2 ? 'grid grid-cols-2 gap-6 space-y-0' : ''
                        }`}
                      >
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            className="text-xs text-slate-800 break-inside-avoid pb-2"
                          >
                            {/* Exercise Header */}
                            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1 mb-2.5">
                              <h3 className="font-black text-xs uppercase tracking-wide text-slate-900 flex items-center gap-1.5">
                                <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-[10px]">
                                  Ex
                                </span>
                                {block.title}
                              </h3>
                              <span className="font-bold text-[10px] text-slate-600">
                                ({block.points} {block.points > 1 ? 'points' : 'point'})
                              </span>
                            </div>

                            {/* Block Type 1: MCQ */}
                            {block.type === 'mcq' && (
                              <div className="pl-1">
                                <p className="font-semibold text-slate-900 mb-2.5">
                                  {block.question}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {block.options.map((opt, i) => {
                                    const isCorrect = i === block.correctIndex;
                                    const isTeacher = viewMode === 'teacher';
                                    return (
                                      <div
                                        key={i}
                                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                                          isTeacher && isCorrect
                                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900 ring-1 ring-emerald-400'
                                            : 'border-slate-300 bg-white'
                                        }`}
                                      >
                                        <div
                                          className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[10px] shrink-0 ${
                                            isTeacher && isCorrect
                                              ? 'border-emerald-600 bg-emerald-600 text-white'
                                              : 'border-slate-500 bg-white'
                                          }`}
                                        >
                                          {isTeacher && isCorrect ? '✓' : ''}
                                        </div>
                                        <span>{opt}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Block Type 2: True / False */}
                            {block.type === 'true_false' && (
                              <div className="pl-1">
                                <p className="text-slate-600 italic text-[11px] mb-2">
                                  {block.instruction}
                                </p>
                                <div className="border border-slate-300 rounded-lg overflow-hidden">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[10px] uppercase">
                                        <th className="p-2">Affirmation</th>
                                        <th className="p-2 text-center w-12 border-l border-slate-300">
                                          Vrai
                                        </th>
                                        <th className="p-2 text-center w-12 border-l border-slate-300">
                                          Faux
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {block.statements.map((stmt, sIdx) => {
                                        const isTeacher = viewMode === 'teacher';
                                        return (
                                          <tr
                                            key={sIdx}
                                            className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50"
                                          >
                                            <td className="p-2 font-medium text-slate-800">
                                              {stmt.text}
                                            </td>
                                            <td className="p-2 text-center border-l border-slate-300">
                                              <div
                                                className={`w-4 h-4 mx-auto rounded border-2 flex items-center justify-center text-[10px] ${
                                                  isTeacher && stmt.isTrue
                                                    ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                                                    : 'border-slate-400'
                                                }`}
                                              >
                                                {isTeacher && stmt.isTrue ? '✓' : ''}
                                              </div>
                                            </td>
                                            <td className="p-2 text-center border-l border-slate-300">
                                              <div
                                                className={`w-4 h-4 mx-auto rounded border-2 flex items-center justify-center text-[10px] ${
                                                  isTeacher && !stmt.isTrue
                                                    ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                                                    : 'border-slate-400'
                                                }`}
                                              >
                                                {isTeacher && !stmt.isTrue ? '✓' : ''}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Block Type 3: Matching */}
                            {block.type === 'matching' && (
                              <div className="pl-1">
                                <p className="text-slate-600 italic text-[11px] mb-2">
                                  {block.instruction}
                                </p>
                                <div className="grid grid-cols-2 gap-8 relative py-2">
                                  {/* Left Column */}
                                  <div className="space-y-3">
                                    {block.leftItems.map((item, lIdx) => (
                                      <div
                                        key={lIdx}
                                        className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 font-semibold"
                                      >
                                        <span>{item}</span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-white shadow-2xs" />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Right Column */}
                                  <div className="space-y-3">
                                    {block.rightItems.map((item, rIdx) => (
                                      <div
                                        key={rIdx}
                                        className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 font-semibold"
                                      >
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-white shadow-2xs" />
                                        <span>{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {viewMode === 'teacher' && (
                                  <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                                    Corrigé des correspondances :{' '}
                                    {block.correctPairs
                                      .map(
                                        ([l, r]) =>
                                          `[${block.leftItems[l]} ➔ ${block.rightItems[r]}]`
                                      )
                                      .join(' • ')}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Block Type 4: Open Question */}
                            {block.type === 'open_question' && (
                              <div className="pl-1">
                                <p className="font-semibold text-slate-900 mb-2">
                                  {block.question}
                                </p>
                                {viewMode === 'teacher' ? (
                                  <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-emerald-900 text-xs font-semibold whitespace-pre-line">
                                    <div className="text-[10px] font-black uppercase text-emerald-700 mb-1">
                                      Réponse modèle attendue :
                                    </div>
                                    {block.modelAnswer}
                                  </div>
                                ) : (
                                  <div className="space-y-3 pt-1">
                                    {Array.from({ length: block.linesCount }).map((_, lIdx) => (
                                      <div
                                        key={lIdx}
                                        className="w-full border-b border-slate-300 min-h-[22px]"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Block Type 5: Table */}
                            {block.type === 'table' && (
                              <div className="pl-1">
                                <p className="text-slate-600 italic text-[11px] mb-2">
                                  {block.instruction}
                                </p>
                                <div className="border border-slate-300 rounded-lg overflow-hidden">
                                  <table className="w-full text-center border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                                        {block.headers.map((h, hIdx) => (
                                          <th
                                            key={hIdx}
                                            className="p-2 border-r border-slate-300 last:border-r-0"
                                          >
                                            {h}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(viewMode === 'teacher'
                                        ? block.solutionRows
                                        : block.rows
                                      ).map((row, rIdx) => (
                                        <tr
                                          key={rIdx}
                                          className="border-b border-slate-300 last:border-b-0"
                                        >
                                          {row.map((cell, cIdx) => (
                                            <td
                                              key={cIdx}
                                              className={`p-2 border-r border-slate-300 last:border-r-0 ${
                                                viewMode === 'teacher' && cell !== block.rows[rIdx]?.[cIdx]
                                                  ? 'bg-emerald-50 font-bold text-emerald-900'
                                                  : ''
                                              }`}
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Sheet Footer */}
                    <div className="mt-8 pt-3 border-t border-slate-300 text-[9px] text-slate-400 flex items-center justify-between uppercase tracking-wider font-semibold">
                      <span>CreaRocket Generator Pro • Smart Worksheet Editor</span>
                      <span>Page 1 / 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
