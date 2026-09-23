import React from 'react';
import {
  StationeryGeneratorState,
  StationeryPageType,
} from '../../types/stationery';
import { KAWAII_THEMES } from './ThemeLibrary';
import { ThemeIllustrations } from './ThemeIllustrations';
import {
  Heart,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Droplets,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';

interface Props {
  state: StationeryGeneratorState;
  pageNumber: number;
}

export const StationeryRenderer: React.FC<Props> = ({ state, pageNumber }) => {
  const theme = KAWAII_THEMES[state.themeId] || KAWAII_THEMES.peachy_dreams;

  return (
    <div
      className="w-full h-full relative flex flex-col justify-between select-none overflow-hidden box-border p-6 sm:p-10"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Background Soft Pastel Tint or Watermark Illustration */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-7 transition-opacity"
        style={{
          opacity: state.backgroundIllustrationOpacity || 0.08,
        }}
      >
        <ThemeIllustrations themeId={state.themeId} size={380} className="w-80 h-80" />
      </div>

      {/* Decorative Frame */}
      {state.showDecorativeFrame && (
        <div
          className="absolute inset-4 sm:inset-6 pointer-events-none rounded-2xl border-2 transition-all"
          style={{
            borderColor: theme.borderColor,
            borderStyle: state.frameStyle === 'dashed_kawaii' ? 'dashed' : 'solid',
          }}
        />
      )}

      {/* Corner Ornaments */}
      <div className="absolute top-5 left-5 pointer-events-none z-10">
        <ThemeIllustrations themeId={state.themeId} size={32} className="w-8 h-8" />
      </div>
      <div className="absolute top-5 right-5 pointer-events-none z-10 scale-x-[-1]">
        <ThemeIllustrations themeId={state.themeId} size={32} className="w-8 h-8" />
      </div>
      <div className="absolute bottom-5 left-5 pointer-events-none z-10">
        <ThemeIllustrations themeId={state.themeId} size={28} className="w-7 h-7" />
      </div>
      <div className="absolute bottom-5 right-5 pointer-events-none z-10 scale-x-[-1]">
        <ThemeIllustrations themeId={state.themeId} size={28} className="w-7 h-7" />
      </div>

      {/* 1. Header Section */}
      {state.showHeader && (
        <div className="relative z-10 pt-2 pb-3 px-8 flex items-center justify-between border-b" style={{ borderColor: theme.badgeBg }}>
          <div>
            <h1
              className="text-lg sm:text-xl font-black tracking-wide"
              style={{ color: theme.primaryColor }}
            >
              {state.title || theme.name}
            </h1>
            {state.subtitle && (
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                {state.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            {state.userName && (
              <div
                className="px-3 py-1 rounded-full font-bold text-[11px] border"
                style={{
                  backgroundColor: theme.bgTint,
                  borderColor: theme.borderColor,
                  color: theme.primaryColor,
                }}
              >
                ★ {state.userName}
              </div>
            )}
            <div className="text-gray-400 font-semibold text-[11px]">
              {state.dateText || 'Date: ____ / ____ / 2026'}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Writing / Planner Content Body */}
      <div className="flex-1 my-3 relative z-10 px-4 sm:px-6 flex flex-col justify-start overflow-hidden">
        {renderPageContent(state.pageType, state, theme)}
      </div>

      {/* 3. Footer Section */}
      {state.showFooter && (
        <div className="relative z-10 pt-2 px-8 flex items-center justify-between text-[11px] font-semibold text-gray-400 border-t" style={{ borderColor: theme.badgeBg }}>
          <span className="flex items-center gap-1.5" style={{ color: theme.secondaryColor }}>
            <span>{theme.mascotEmoji}</span>
            <span>{theme.name} Collection</span>
          </span>

          {state.showPageNumbers && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
              style={{
                backgroundColor: theme.bgTint,
                color: theme.primaryColor,
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              {state.pageNumberPrefix ? `${state.pageNumberPrefix} ` : ''}
              {pageNumber}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function renderPageContent(
  type: StationeryPageType,
  state: StationeryGeneratorState,
  theme: any
) {
  switch (type) {
    case 'lined':
      return (
        <div className="w-full h-full flex flex-col justify-between py-2 relative">
          {/* Optional vertical left margin line */}
          {state.leftMarginLine && (
            <div
              className="absolute top-0 bottom-0 left-12 w-0.5"
              style={{ backgroundColor: '#FCA5A5' }}
            />
          )}
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="w-full border-b"
              style={{
                borderColor: theme.lineColor,
                borderBottomWidth: `${state.lineThickness || 1}px`,
                height: `${state.lineSpacing ? state.lineSpacing * 3.7 : 24}px`,
              }}
            />
          ))}
        </div>
      );

    case 'grid':
      return (
        <div
          className="w-full h-full rounded-lg"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme.lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${theme.lineColor} 1px, transparent 1px)`,
            backgroundSize: `${state.gridSize ? state.gridSize * 3.8 : 20}px ${state.gridSize ? state.gridSize * 3.8 : 20}px`,
            opacity: state.gridOpacity || 0.7,
          }}
        />
      );

    case 'dotted':
      return (
        <div
          className="w-full h-full rounded-lg"
          style={{
            backgroundImage: `radial-gradient(${theme.primaryColor} ${state.dotSize || 1.5}px, transparent ${state.dotSize || 1.5}px)`,
            backgroundSize: `${state.dotSpacing ? state.dotSpacing * 3.8 : 20}px ${state.dotSpacing ? state.dotSpacing * 3.8 : 20}px`,
            opacity: state.dotOpacity || 0.5,
          }}
        />
      );

    case 'blank':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
          <p className="text-xs font-semibold text-gray-300 italic">
            Page blanche créative pour dessin, notes libres, collage ou calligraphie
          </p>
        </div>
      );

    case 'checklist':
      return (
        <div className="w-full h-full flex flex-col justify-start space-y-3 py-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-md border-2 shrink-0"
                style={{ borderColor: theme.primaryColor }}
              />
              <div
                className="flex-1 border-b pb-1"
                style={{ borderColor: theme.lineColor }}
              />
            </div>
          ))}
        </div>
      );

    case 'daily_planner':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-4 py-1 text-xs">
          {/* Left Column: Schedule */}
          <div className="flex flex-col border rounded-xl p-3" style={{ borderColor: theme.borderColor, backgroundColor: theme.bgTint }}>
            <h3 className="font-bold mb-2 flex items-center gap-1.5" style={{ color: theme.primaryColor }}>
              <Clock className="w-3.5 h-3.5" />
              Planning de la journée
            </h3>
            <div className="flex-1 space-y-2">
              {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                <div key={time} className="flex items-center gap-2">
                  <span className="font-extrabold text-[10px] w-10 text-gray-400">{time}</span>
                  <div className="flex-1 border-b border-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Priorities, Tasks & Habits */}
          <div className="flex flex-col space-y-3">
            {/* Top 3 Priorities */}
            <div className="border rounded-xl p-2.5" style={{ borderColor: theme.borderColor }}>
              <h4 className="font-bold text-[11px] mb-1.5" style={{ color: theme.primaryColor }}>
                ★ Top 3 Priorités
              </h4>
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2 mb-1.5">
                  <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: theme.primaryColor }}>
                    {n}
                  </span>
                  <div className="flex-1 border-b border-gray-200" />
                </div>
              ))}
            </div>

            {/* To-Do Checklist */}
            <div className="flex-1 border rounded-xl p-2.5 flex flex-col justify-between" style={{ borderColor: theme.borderColor }}>
              <h4 className="font-bold text-[11px] mb-1" style={{ color: theme.primaryColor }}>
                ✓ À faire aujourd'hui
              </h4>
              {[1, 2, 3, 4, 5].map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-gray-300" />
                  <div className="flex-1 border-b border-gray-200" />
                </div>
              ))}
            </div>

            {/* Mood & Hydration */}
            <div className="p-2 border rounded-xl flex items-center justify-between" style={{ borderColor: theme.borderColor, backgroundColor: theme.bgTint }}>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Humeur:</span>
                <span className="text-xs">😊 😐 😴</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600">
                <Droplets className="w-3.5 h-3.5" />
                <span>💧💧💧💧</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'weekly_planner':
      return (
        <div className="w-full h-full flex flex-col justify-between py-1 text-xs">
          <div className="grid grid-cols-7 gap-1.5 flex-1">
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
              <div
                key={day}
                className="border rounded-xl p-2 flex flex-col justify-between"
                style={{ borderColor: theme.borderColor, backgroundColor: theme.bgTint }}
              >
                <div className="font-extrabold text-[10px] text-center border-b pb-1" style={{ color: theme.primaryColor, borderColor: theme.borderColor }}>
                  {day}
                </div>
                <div className="flex-1 flex flex-col justify-around py-2">
                  <div className="border-b border-gray-200" />
                  <div className="border-b border-gray-200" />
                  <div className="border-b border-gray-200" />
                  <div className="border-b border-gray-200" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-2.5 border rounded-xl flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
            <span className="font-bold text-[11px]" style={{ color: theme.primaryColor }}>
              Objectif de la semaine:
            </span>
            <div className="flex-1 border-b border-gray-200 ml-3" />
          </div>
        </div>
      );

    case 'journal':
    default:
      return (
        <div className="w-full h-full flex flex-col justify-between py-2">
          {/* Journal prompt or title */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 italic">
              Pensée du jour & Réflexion :
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-500">Météo : ☀️ ⛅ 🌧️</span>
            </div>
          </div>

          {/* Clean wide writing lines */}
          <div className="flex-1 flex flex-col justify-between">
            {Array.from({ length: 18 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full border-b"
                style={{
                  borderColor: theme.lineColor,
                  borderBottomWidth: '1px',
                }}
              />
            ))}
          </div>
        </div>
      );
  }
}
