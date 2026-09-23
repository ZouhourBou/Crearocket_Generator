import React from 'react';
import { GameCardsConfig } from '../../types/games';
import {
  Apple,
  BookOpen,
  Cat,
  Clock,
  Crown,
  DoorClosed,
  Gift,
  Globe,
  Heart,
  HelpCircle,
  Lightbulb,
  Music,
  PenTool,
  Plane,
  Rocket,
  Scissors,
  Ship,
  Star,
  Sun,
  Trees,
  Dog,
  Sparkles,
} from 'lucide-react';

interface GameCardsViewProps {
  config: GameCardsConfig;
  language: 'fr' | 'en' | 'ar';
}

const ICON_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  Apple,
  BookOpen,
  Cat,
  Clock,
  Crown,
  DoorClosed,
  Gift,
  Globe,
  Heart,
  HelpCircle,
  Lightbulb,
  Music,
  PenTool,
  Plane,
  Rocket,
  Ship,
  Star,
  Sun,
  Trees,
  Dog,
};

export const GameCardsView: React.FC<GameCardsViewProps> = ({
  config,
  language,
}) => {
  const isArabic = language === 'ar';
  const {
    cardsCount,
    columns,
    showCutMarks,
    showCardBorders,
    borderRadius,
    items,
  } = config;

  // Render cards limited to cardsCount
  const cardsToRender = items.slice(0, cardsCount);

  // Dynamic grid column class
  const colClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
      ? 'grid-cols-3'
      : columns === 4
      ? 'grid-cols-4'
      : 'grid-cols-3';

  return (
    <div className="w-full flex flex-col items-center" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Cut lines explanation hint in print header */}
      {showCutMarks && (
        <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-dashed border-slate-300 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5" />
            {isArabic
              ? 'اتبع الخطوط المتقطعة لقص البطاقات بالتساوي'
              : language === 'en'
              ? 'Cut along dashed lines for uniform cards'
              : 'Découper le long des traits pointillés pour des cartes régulières'}
          </span>
          <span className="font-mono">{cardsToRender.length} CARDS</span>
        </div>
      )}

      {/* Cards Grid */}
      <div
        className={`w-full grid ${colClass} gap-4 p-1`}
        style={{
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {cardsToRender.map((card, idx) => {
          const IconComp = ICON_COMPONENTS[card.iconName] || Sparkles;

          return (
            <div
              key={card.id || idx}
              className={`relative flex flex-col items-center justify-between p-4 bg-white transition-shadow ${
                showCardBorders
                  ? 'border-2 border-slate-700'
                  : 'border border-slate-200'
              } ${showCutMarks ? 'border-dashed' : ''} shadow-xs`}
              style={{
                borderRadius: `${borderRadius}px`,
                minHeight: columns >= 4 ? '150px' : '185px',
              }}
            >
              {/* Scissors cut indicator marks in corners if enabled */}
              {showCutMarks && (
                <>
                  <span className="absolute -top-2 -left-2 text-slate-400 opacity-60">
                    <Scissors className="w-3 h-3" />
                  </span>
                  <span className="absolute -bottom-2 -right-2 text-slate-400 opacity-60">
                    <Scissors className="w-3 h-3 rotate-180" />
                  </span>
                </>
              )}

              {/* Card Header: Category Badge or Pair Identifier */}
              <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{card.category || `CARD ${idx + 1}`}</span>
                {card.pairId && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    PAIR
                  </span>
                )}
              </div>

              {/* Central Illustration / Icon */}
              <div
                className="my-2 p-3 rounded-2xl flex items-center justify-center transition-transform"
                style={{
                  backgroundColor: `${card.accentColor}18`,
                  color: card.accentColor,
                }}
              >
                <IconComp className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              {/* Card Footer: Title & Optional Subtitle */}
              <div className="w-full text-center mt-1">
                <h3
                  className={`font-black text-slate-800 leading-tight ${
                    isArabic ? 'font-arabic text-base' : 'text-sm'
                  }`}
                  style={{ color: card.accentColor }}
                >
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p
                    className={`text-xs font-medium text-slate-500 mt-0.5 ${
                      isArabic ? 'font-arabic' : ''
                    }`}
                  >
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
