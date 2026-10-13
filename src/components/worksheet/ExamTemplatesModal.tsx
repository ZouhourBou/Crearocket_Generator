import React, { useState } from 'react';
import {
  REFERENCE_EXAM_TEMPLATES,
  ReferenceExamTemplateDef,
} from '../../data/defaultWorksheet';
import {
  X,
  BookOpen,
  Sparkles,
  Check,
  Clock,
  Award,
  Layers,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';

interface ExamTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export const ExamTemplatesModal: React.FC<ExamTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedId, setSelectedId] = useState<string>(REFERENCE_EXAM_TEMPLATES[0].id);
  const [confirmReplace, setConfirmReplace] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDef =
    REFERENCE_EXAM_TEMPLATES.find((t) => t.id === selectedId) ||
    REFERENCE_EXAM_TEMPLATES[0];

  const handleApply = () => {
    onSelectTemplate(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-800">
                  Gabarits de Devoirs de Référence (Phase 4)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                  3 devoirs complets 1-clic
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chargez un sujet d'examen ou une fiche d'exercices complète avec en-tête, exercices LEGO, formules mathématiques et barème.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Master / Detail */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Template Cards List (5 cols) */}
          <div className="md:col-span-5 p-3.5 space-y-2.5 overflow-y-auto border-r border-slate-100 bg-slate-50/40 custom-scrollbar">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Sélectionnez un devoir :
            </div>

            {REFERENCE_EXAM_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedId;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedId(tmpl.id);
                    setConfirmReplace(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white/80 border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{tmpl.flag}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tmpl.badgeColor}`}
                      >
                        {tmpl.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {tmpl.pageCount} pages A4
                    </span>
                  </div>

                  <h3
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-indigo-950' : 'text-slate-800'
                    }`}
                  >
                    {tmpl.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {tmpl.subtitle}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {tmpl.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" />
                      {tmpl.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Preview & Description (7 cols) */}
          <div className="md:col-span-7 p-5 overflow-y-auto flex flex-col justify-between bg-white custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentDef.flag}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {currentDef.title}
                    </h3>
                    <p className="text-xs text-indigo-600 font-semibold">
                      {currentDef.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${currentDef.badgeColor}`}
                >
                  {currentDef.badge}
                </span>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">
                  Structure & Contenu pédagogique :
                </span>
                {currentDef.description}
              </div>

              {/* Topics / Blocs inclus */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Notions mathématiques & Blocs utilisés :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDef.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-indigo-500" />
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Caractéristiques d'impression */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Format
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">
                    A4 Portrait
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Durée
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">
                    {currentDef.duration}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Barème
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {currentDef.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Charger ce devoir dans l'éditeur</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Astuce : Vous pourrez ensuite modifier chaque texte, formule $...$, barème et sous-bloc à volonté.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
