import React from 'react';
import {
  SchoolPlannerState,
  DayOfWeek,
  TimeSlot,
  SubjectItem,
} from '../../types/plannerAndCertificates';
import { PLANNER_TEMPLATES, ALL_DAYS } from './PlannerTemplateLibrary';
import {
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  BookOpen,
  Sun,
  Moon,
  MapPin,
  Smile,
} from 'lucide-react';

interface Props {
  state: SchoolPlannerState;
}

export const PlannerRenderer: React.FC<Props> = ({ state }) => {
  const tpl = PLANNER_TEMPLATES[state.templateId] || PLANNER_TEMPLATES.classic_school;
  const isLandscape = state.orientation === 'landscape';

  return (
    <div
      className="w-full h-full relative flex flex-col justify-between select-none overflow-hidden box-border p-6 sm:p-8"
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily: tpl.fontFamily,
      }}
    >
      {/* Optional Trim / Bleed marks guide for professional printing */}
      {state.showTrimMarks && (
        <>
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gray-400 pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gray-400 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gray-400 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gray-400 pointer-events-none" />
        </>
      )}

      {/* 1. Header Section */}
      <header
        className={`px-5 py-3.5 ${tpl.rounded} border transition-all flex items-center justify-between mb-4 shadow-xs`}
        style={{
          backgroundColor: tpl.headerBg,
          borderColor: tpl.cellBorderColor,
          color: tpl.headerTextColor,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl filter drop-shadow-xs">{tpl.decorativeBadgeEmoji}</span>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              {state.customTitle ||
                (state.viewMode === 'timetable'
                  ? 'EMPLOI DU TEMPS SCOLAIRE'
                  : state.viewMode === 'weekly_planner'
                  ? 'MON SEMAINIER SCOLAIRE'
                  : state.viewMode === 'activity'
                  ? "ORGANISATEUR D'ACTIVITÉS"
                  : 'MA ROUTINE QUOTIDIENNE')}
            </h1>
            <p className="text-xs opacity-90 font-medium">
              {state.subtitle ||
                (state.schoolName ? `${state.schoolName} • Année ${state.academicYear}` : `Année Scolaire ${state.academicYear}`)}
            </p>
          </div>
        </div>

        {/* Student metadata box */}
        <div className="flex items-center gap-3 text-xs">
          {state.studentName && (
            <div
              className="px-3 py-1.5 rounded-lg border font-bold shadow-2xs"
              style={{
                backgroundColor: '#FFFFFF',
                color: tpl.primaryColor,
                borderColor: tpl.cellBorderColor,
              }}
            >
              Élève : <span className="underline decoration-dotted">{state.studentName}</span>
            </div>
          )}
          {state.studentClass && (
            <div
              className="px-2.5 py-1.5 rounded-lg border font-bold"
              style={{
                backgroundColor: '#FFFFFF',
                color: tpl.primaryColor,
                borderColor: tpl.cellBorderColor,
              }}
            >
              Classe : {state.studentClass}
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Content View based on state.viewMode */}
      <div className="flex-1 overflow-hidden flex flex-col justify-start">
        {state.viewMode === 'timetable' && renderTimetableGrid(state, tpl)}
        {state.viewMode === 'weekly_planner' && renderWeeklyPlanner(state, tpl)}
        {state.viewMode === 'activity' && renderActivityOrganizer(state, tpl)}
        {state.viewMode === 'daily_routine' && renderDailyRoutine(state, tpl)}
      </div>

      {/* 3. Footer Branding & Motivational Line */}
      <footer className="mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-semibold text-gray-500" style={{ borderColor: tpl.cellBorderColor }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tpl.primaryColor }} />
          <span>CreatRocket Education • {tpl.nameFr}</span>
        </div>
        <div className="italic text-gray-400">
          « L’organisation est la clé de la réussite scolaire et personnelle. »
        </div>
      </footer>
    </div>
  );
};

// -------------------------------------------------------------
// VIEW 1: TIMETABLE GRID
// -------------------------------------------------------------
function renderTimetableGrid(state: SchoolPlannerState, tpl: any) {
  const activeDaysList = ALL_DAYS.filter((d) => state.activeDays.includes(d.id));

  return (
    <div className="w-full h-full flex flex-col justify-between border rounded-xl overflow-hidden shadow-xs" style={{ borderColor: tpl.cellBorderColor }}>
      {/* Day Headers Row */}
      <div
        className="grid border-b text-xs font-black uppercase tracking-wider"
        style={{
          gridTemplateColumns: `85px repeat(${activeDaysList.length}, minmax(0, 1fr))`,
          backgroundColor: tpl.dayHeaderBg,
          color: tpl.dayHeaderTextColor,
          borderColor: tpl.cellBorderColor,
        }}
      >
        <div className="p-2.5 text-center flex items-center justify-center border-r font-extrabold" style={{ borderColor: tpl.cellBorderColor }}>
          <Clock className="w-3.5 h-3.5 inline mr-1 opacity-70" />
          Heures
        </div>
        {activeDaysList.map((day) => (
          <div key={day.id} className="p-2.5 text-center border-r last:border-r-0 flex flex-col items-center justify-center" style={{ borderColor: tpl.cellBorderColor }}>
            <span>{day.labelFr}</span>
            <span className="text-[10px] opacity-75 font-normal">{day.labelAr}</span>
          </div>
        ))}
      </div>

      {/* Slots Body */}
      <div className="flex-1 flex flex-col divide-y" style={{ borderColor: tpl.cellBorderColor }}>
        {state.timeSlots.map((slot) => {
          if (slot.isBreak) {
            return (
              <div
                key={slot.id}
                className="py-1 px-4 text-center text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 border-dashed"
                style={{
                  backgroundColor: tpl.accentBg,
                  color: tpl.secondaryColor,
                  borderColor: tpl.cellBorderColor,
                }}
              >
                <span>☕</span>
                <span>{slot.label || `Pause (${slot.startTime} - ${slot.endTime})`}</span>
                <span>★</span>
              </div>
            );
          }

          return (
            <div
              key={slot.id}
              className="grid flex-1 divide-x"
              style={{
                gridTemplateColumns: `85px repeat(${activeDaysList.length}, minmax(0, 1fr))`,
                borderColor: tpl.cellBorderColor,
              }}
            >
              {/* Time Column */}
              <div
                className="flex flex-col items-center justify-center text-[10px] font-extrabold p-1 text-center border-r"
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  borderColor: tpl.cellBorderColor,
                }}
              >
                <span>{slot.startTime}</span>
                <span className="opacity-40 leading-none">↓</span>
                <span>{slot.endTime}</span>
              </div>

              {/* Day cells */}
              {activeDaysList.map((day) => {
                const cellKey = `${day.id}_${slot.id}`;
                const cell = state.timetableGrid[cellKey];
                const subject = state.subjects.find((s) => s.id === cell?.subjectId);

                return (
                  <div
                    key={day.id}
                    className="p-1.5 flex flex-col justify-center items-center text-center relative transition-colors border-r last:border-r-0"
                    style={{
                      backgroundColor: subject?.color || '#FFFFFF',
                      borderColor: tpl.cellBorderColor,
                      color: subject?.textColor || '#1E293B',
                    }}
                  >
                    {subject ? (
                      <div className="w-full flex flex-col justify-center items-center">
                        <div className="font-extrabold text-[11px] sm:text-xs leading-tight flex items-center gap-1">
                          {subject.icon && <span className="text-xs">{subject.icon}</span>}
                          <span>{subject.name}</span>
                        </div>
                        {cell?.room && (
                          <span className="text-[9px] font-semibold opacity-80 mt-0.5">
                            Salle {cell.room}
                          </span>
                        )}
                        {cell?.teacher && (
                          <span className="text-[9px] opacity-75 truncate max-w-full">
                            {cell.teacher}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full border border-dashed border-gray-100 rounded-sm opacity-20" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// VIEW 2: WEEKLY PLANNER (SEMAINIER SCOLAIRE / DEVOIRS)
// -------------------------------------------------------------
function renderWeeklyPlanner(state: SchoolPlannerState, tpl: any) {
  const activeDaysList = ALL_DAYS.filter((d) => state.activeDays.includes(d.id));

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      {/* Top Objective & Week banner */}
      <div className="flex items-center justify-between p-2.5 rounded-xl border" style={{ backgroundColor: tpl.accentBg, borderColor: tpl.cellBorderColor }}>
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: tpl.primaryColor }}>
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Objectif de la Semaine :</span>
          <span className="font-normal italic text-gray-700">
            {state.weeklyGoal || 'Concentration, révisions régulières et bonne humeur !'}
          </span>
        </div>
        <div className="text-xs font-bold text-gray-500">
          Semaine N° {state.weekNumber || '34'} {state.dateRange && `• ${state.dateRange}`}
        </div>
      </div>

      {/* Week Columns Grid */}
      <div
        className="grid gap-2 flex-1"
        style={{
          gridTemplateColumns: `repeat(${activeDaysList.length}, minmax(0, 1fr))`,
        }}
      >
        {activeDaysList.map((day) => {
          const dayTasks = state.weeklyTasks.filter((t) => t.day === day.id);

          return (
            <div
              key={day.id}
              className="border rounded-xl flex flex-col justify-between overflow-hidden shadow-2xs"
              style={{ borderColor: tpl.cellBorderColor, backgroundColor: '#FFFFFF' }}
            >
              {/* Day header */}
              <div
                className="py-1.5 px-2 text-center font-extrabold text-xs border-b"
                style={{
                  backgroundColor: tpl.dayHeaderBg,
                  color: tpl.dayHeaderTextColor,
                  borderColor: tpl.cellBorderColor,
                }}
              >
                {day.labelFr}
              </div>

              {/* Tasks Checklist */}
              <div className="p-2 flex-1 flex flex-col justify-start space-y-2 overflow-y-auto">
                <div className="text-[10px] font-black uppercase text-gray-400">Devoirs & Rappels</div>
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-1.5 text-[11px] leading-tight text-gray-700">
                      <div className="w-3.5 h-3.5 mt-0.5 rounded border border-gray-300 shrink-0" />
                      <span className="flex-1">{task.text}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1">
                      <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
                      <div className="flex-1 h-3 border-b border-gray-200" />
                    </div>
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1">
                      <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
                      <div className="flex-1 h-3 border-b border-gray-200" />
                    </div>
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1">
                      <div className="w-3.5 h-3.5 rounded border border-gray-300 shrink-0" />
                      <div className="flex-1 h-3 border-b border-gray-200" />
                    </div>
                  </>
                )}
              </div>

              {/* Bottom memo space */}
              <div className="p-1.5 bg-gray-50 border-t text-[10px] text-gray-400" style={{ borderColor: tpl.cellBorderColor }}>
                Notes / Contrôles
              </div>
            </div>
          );
        })}
      </div>

      {/* General Notes Banner */}
      <div className="p-2 border rounded-xl flex items-center justify-between text-xs" style={{ borderColor: tpl.cellBorderColor }}>
        <span className="font-bold text-gray-700">Notes & Projets importants :</span>
        <span className="text-gray-500 italic flex-1 ml-3 border-b border-gray-200">
          {state.generalNotes || 'Préparer l’exposé de sciences et relire la poésie.'}
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// VIEW 3: ACTIVITY ORGANIZER (EXTRASCOLAIRE, SPORT, MUSIQUE)
// -------------------------------------------------------------
function renderActivityOrganizer(state: SchoolPlannerState, tpl: any) {
  const activeDaysList = ALL_DAYS.filter((d) => state.activeDays.includes(d.id));

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      <div className="p-3 rounded-xl border flex items-center justify-between" style={{ backgroundColor: tpl.accentBg, borderColor: tpl.cellBorderColor }}>
        <div>
          <h3 className="font-black text-xs text-gray-800 uppercase tracking-wider">
            Mes Activités Extra-scolaires, Passions & Sports
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Musique, clubs, entraînements sportifs et loisirs créatifs de la semaine.
          </p>
        </div>
        <div className="text-2xl">⚽ 🎨 🥋 🎹</div>
      </div>

      <div
        className="grid gap-2.5 flex-1"
        style={{
          gridTemplateColumns: `repeat(${activeDaysList.length}, minmax(0, 1fr))`,
        }}
      >
        {activeDaysList.map((day) => {
          const dayActs = state.activities.filter((a) => a.day === day.id);

          return (
            <div
              key={day.id}
              className="border rounded-xl flex flex-col justify-between overflow-hidden shadow-2xs"
              style={{ borderColor: tpl.cellBorderColor, backgroundColor: '#FFFFFF' }}
            >
              <div
                className="py-1.5 px-2 text-center font-extrabold text-xs border-b"
                style={{
                  backgroundColor: tpl.dayHeaderBg,
                  color: tpl.dayHeaderTextColor,
                  borderColor: tpl.cellBorderColor,
                }}
              >
                {day.labelFr}
              </div>

              <div className="p-2 flex-1 flex flex-col justify-start space-y-2">
                {dayActs.length > 0 ? (
                  dayActs.map((act) => (
                    <div
                      key={act.id}
                      className="p-2 rounded-lg border text-left text-xs leading-tight font-bold shadow-2xs"
                      style={{
                        backgroundColor: act.color || '#FEF3C7',
                        borderColor: tpl.cellBorderColor,
                        color: '#1E293B',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{act.name}</span>
                        {act.time && <span className="text-[10px] opacity-75">{act.time}</span>}
                      </div>
                      {act.location && (
                        <div className="text-[10px] font-normal text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{act.location}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-[10px] text-gray-300 italic">
                    Journée détente & devoirs
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// VIEW 4: DAILY ROUTINE PLANNER (ROUTINE DU MATIN / DU SOIR)
// -------------------------------------------------------------
function renderDailyRoutine(state: SchoolPlannerState, tpl: any) {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-4">
      {/* Morning Routine Box */}
      <div className="border rounded-2xl p-4 flex flex-col justify-between shadow-xs" style={{ borderColor: tpl.cellBorderColor, backgroundColor: '#FFFFFF' }}>
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: tpl.cellBorderColor }}>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">Ma Routine du Matin</h3>
              <p className="text-[11px] text-gray-500">Pour bien démarrer la journée d'école</p>
            </div>
          </div>

          <div className="space-y-3">
            {state.morningRoutines.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-amber-50/60 border border-amber-200/60">
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 font-bold text-xs text-gray-800">{item.title}</span>
                <div className="w-5 h-5 rounded-md border-2 border-amber-400 flex items-center justify-center" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] font-bold text-amber-800 flex items-center justify-between mt-3">
          <span>Prêt(e) pour l’école à l’heure !</span>
          <span>🎒 ⭐</span>
        </div>
      </div>

      {/* Evening Routine Box */}
      <div className="border rounded-2xl p-4 flex flex-col justify-between shadow-xs" style={{ borderColor: tpl.cellBorderColor, backgroundColor: '#FFFFFF' }}>
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: tpl.cellBorderColor }}>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">Ma Routine du Soir</h3>
              <p className="text-[11px] text-gray-500">Calme, préparation du cartable et sommeil réparateur</p>
            </div>
          </div>

          <div className="space-y-3">
            {state.eveningRoutines.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 font-bold text-xs text-gray-800">{item.title}</span>
                <div className="w-5 h-5 rounded-md border-2 border-indigo-400 flex items-center justify-center" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-50 text-[11px] font-bold text-indigo-800 flex items-center justify-between mt-3">
          <span>Une bonne nuit pour grandir en pleine forme !</span>
          <span>🌙 ✨</span>
        </div>
      </div>
    </div>
  );
}
