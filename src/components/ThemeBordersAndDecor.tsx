import React from 'react';
import { ThemeDefinition } from '../types';

interface ThemeBordersAndDecorProps {
  theme: ThemeDefinition;
  w: number;
  h: number;
  isArabic: boolean;
  isCompact: boolean;
}

export const ThemeBordersAndDecor: React.FC<ThemeBordersAndDecorProps> = ({
  theme,
  w,
  h,
  isArabic,
  isCompact,
}) => {
  const inset = isCompact ? 2.5 : 3.5;

  switch (theme.id) {
    // 01 — CUTE PASTEL: Corner hearts + floating mini flowers
    case 'cute':
      return (
        <g pointerEvents="none">
          {/* Corner Hearts */}
          <path
            d={`M${w - 12} 8C${w - 12} 6 ${w - 10} 4.5 ${w - 8} 6C${w - 6} 4.5 ${w - 4} 6C${w - 4} 9 ${w - 8} 12 ${w - 8} 12C${w - 8} 12 ${w - 12} 9 ${w - 12} 8Z`}
            fill={theme.primaryColor}
            opacity="0.25"
          />
          <path
            d="M8 8C8 6 10 4.5 12 6C14 4.5 16 6 16 9C16 12 12 15 12 15C12 15 8 12 8 8Z"
            fill={theme.primaryColor}
            opacity="0.25"
          />
          {/* Subtle background petals */}
          <circle cx={w - 22} cy={h - 10} r="3" fill="#FB7185" opacity="0.12" />
          <circle cx={w - 14} cy={h - 14} r="2.5" fill="#FB7185" opacity="0.12" />
          <circle cx={w * 0.55} cy={8} r="1.5" fill="#F472B6" opacity="0.15" />
        </g>
      );

    // 02 — DINO ADVENTURE: Baby dino paw prints in corners + leaf accents
    case 'dino':
      return (
        <g pointerEvents="none">
          {/* Dino Pawprint in corner (3 toes + pad) */}
          <g opacity="0.2" transform={`translate(${w - 16}, 6)`}>
            <circle cx="2" cy="1" r="1.2" fill={theme.primaryColor} />
            <circle cx="5" cy="0" r="1.2" fill={theme.primaryColor} />
            <circle cx="8" cy="1" r="1.2" fill={theme.primaryColor} />
            <ellipse cx="5" cy="4" rx="2.5" ry="2" fill={theme.primaryColor} />
          </g>
          {/* Subtle leaves in bottom corner */}
          <path
            d={`M${w - 12} ${h - 8} Q${w - 6} ${h - 14} ${w - 4} ${h - 8} Q${w - 8} ${h - 4} ${w - 12} ${h - 8}Z`}
            fill={theme.primaryColor}
            opacity="0.16"
          />
          <circle cx={w * 0.6} cy={h - 6} r="1.2" fill={theme.accentColor} opacity="0.2" />
        </g>
      );

    // 03 — SPACE EXPLORER: 4-point sparkle stars + cosmic dots
    case 'space':
      return (
        <g pointerEvents="none">
          {/* Twinkling star in top right */}
          <path
            d={`M${w - 10} 5L${w - 9} 7.5L${w - 6.5} 8.5L${w - 9} 9.5L${w - 10} 12L${w - 11} 9.5L${w - 13.5} 8.5L${w - 11} 7.5Z`}
            fill="#F59E0B"
            opacity="0.35"
          />
          {/* Tiny cosmos dots */}
          <circle cx={w - 24} cy={h - 9} r="1.5" fill="#38BDF8" opacity="0.25" />
          <circle cx={w - 14} cy={h - 14} r="1" fill="#F59E0B" opacity="0.3" />
          <circle cx={w * 0.45} cy={6} r="1" fill="#38BDF8" opacity="0.25" />
        </g>
      );

    // 04 — FOOTBALL FUN: Pitch corner arcs + champion star
    case 'football':
      return (
        <g pointerEvents="none">
          {/* Corner Pitch Arc */}
          <path
            d={`M${w - inset} ${inset + 8} A8 8 0 0 1 ${w - inset - 8} ${inset}`}
            fill="none"
            stroke={theme.primaryColor}
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Golden champion star accent */}
          <path
            d={`M${w - 12} ${h - 10}L${w - 11} ${h - 7.5}L${w - 8.5} ${h - 7.5}L${w - 10.5} ${h - 6}L${w - 9.5} ${h - 3.5}L${w - 12} ${h - 5}L${w - 14.5} ${h - 3.5}L${w - 13.5} ${h - 6}L${w - 15.5} ${h - 7.5}L${w - 13} ${h - 7.5}Z`}
            fill="#F59E0B"
            opacity="0.35"
          />
        </g>
      );

    // 05 — MAGICAL UNICORN: Magic sparkles & stardust
    case 'unicorn':
      return (
        <g pointerEvents="none">
          {/* Magic Sparkle Diamond */}
          <path
            d={`M${w - 10} 6L${w - 8} 9L${w - 10} 12L${w - 12} 9Z`}
            fill={theme.primaryColor}
            opacity="0.3"
          />
          <circle cx={w - 18} cy={h - 8} r="1.5" fill="#F472B6" opacity="0.3" />
          <circle cx={w - 10} cy={h - 12} r="1.2" fill="#9333EA" opacity="0.25" />
        </g>
      );

    // 06 — RAINBOW WORLD: Corner rainbow arc + confetti dots
    case 'rainbow':
      return (
        <g pointerEvents="none">
          {/* Rainbow Corner Arc in bottom right */}
          <path
            d={`M${w - inset} ${h - inset - 10} A10 10 0 0 0 ${w - inset - 10} ${h - inset}`}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d={`M${w - inset} ${h - inset - 7} A7 7 0 0 0 ${w - inset - 7} ${h - inset}`}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Confetti dots */}
          <circle cx={w - 10} cy={8} r="1.5" fill="#06B6D4" opacity="0.25" />
          <circle cx={w - 18} cy={6} r="1" fill="#F59E0B" opacity="0.25" />
        </g>
      );

    // 07 — ANIMAL FRIENDS: Soft leaf accents & friendly dots
    case 'animals':
      return (
        <g pointerEvents="none">
          {/* Sprout Leaf motif */}
          <path
            d={`M${w - 12} 6 C${w - 8} 6 ${w - 6} 9 ${w - 6} 12 C${w - 10} 12 ${w - 12} 9 ${w - 12} 6 Z`}
            fill="#10B981"
            opacity="0.25"
          />
          <circle cx={w - 12} cy={h - 8} r="1.5" fill={theme.primaryColor} opacity="0.2" />
          <circle cx={w - 8} cy={h - 12} r="1" fill={theme.primaryColor} opacity="0.2" />
        </g>
      );

    // 08 — GAMER KIDS: Pixel cross (+) and pixel dots
    case 'gamer':
      return (
        <g pointerEvents="none">
          {/* Pixel Cross in top corner */}
          <rect x={w - 11} y={6} width="6" height="2" fill={theme.accentColor} opacity="0.4" />
          <rect x={w - 9} y={4} width="2" height="6" fill={theme.accentColor} opacity="0.4" />
          {/* Floating Pixel Dots */}
          <rect x={w - 16} y={h - 9} width="2.5" height="2.5" fill={theme.primaryColor} opacity="0.2" />
          <rect x={w - 10} y={h - 13} width="2" height="2" fill="#EC4899" opacity="0.3" />
        </g>
      );

    // 09 — SUPER HERO: Hero star stud & lightning bolt
    case 'superhero':
      return (
        <g pointerEvents="none">
          {/* Hero Star Stud in top-right */}
          <path
            d={`M${w - 10} 5L${w - 9} 7.5L${w - 6.5} 7.5L${w - 8.5} 9L${w - 7.5} 11.5L${w - 10} 10L${w - 12.5} 11.5L${w - 11.5} 9L${w - 13.5} 7.5L${w - 11} 7.5Z`}
            fill="#FBBF24"
            opacity="0.4"
          />
          {/* Tiny lightning bolt */}
          <polygon
            points={`${w - 10},${h - 14} ${w - 12},${h - 8} ${w - 9},${h - 8} ${w - 11},${h - 4} ${w - 6},${h - 10} ${w - 9},${h - 10}`}
            fill="#F59E0B"
            opacity="0.3"
          />
        </g>
      );

    // 10 — LITTLE CARS: Finish line check pattern
    case 'cars':
      return (
        <g pointerEvents="none">
          {/* Finish Line Check Pattern in corner */}
          <rect x={w - 12} y={6} width="3" height="3" fill={theme.primaryColor} opacity="0.3" />
          <rect x={w - 9} y={9} width="3" height="3" fill={theme.primaryColor} opacity="0.3" />
          <rect x={w - 9} y={6} width="3" height="3" fill="#F59E0B" opacity="0.3" />
          <rect x={w - 12} y={9} width="3" height="3" fill="#F59E0B" opacity="0.3" />
        </g>
      );

    // 11 — JURASSIC WORLD: Tropical foliage silhouette + amber dot
    case 'jurassic':
      return (
        <g pointerEvents="none">
          {/* Tropical leaf silhouette in corner */}
          <path
            d={`M${w - 14} 6C${w - 8} 4 ${w - 4} 8 ${w - 4} 14C${w - 10} 14 ${w - 14} 10 ${w - 14} 6Z`}
            fill={theme.primaryColor}
            opacity="0.2"
          />
          {/* Amber fossil dot */}
          <circle cx={w - 12} cy={h - 8} r="2" fill="#F97316" opacity="0.25" />
          <circle cx={w - 8} cy={h - 12} r="1.5" fill={theme.primaryColor} opacity="0.2" />
        </g>
      );

    // 12 — SWEET CANDY: Floating candy sprinkles
    case 'candy':
      return (
        <g pointerEvents="none">
          {/* Floating candy sprinkles */}
          <rect x={w - 12} y={6} width="4" height="1.8" rx="0.9" fill="#EC4899" opacity="0.3" transform="rotate(30)" />
          <rect x={w - 16} y={h - 8} width="4" height="1.8" rx="0.9" fill="#A855F7" opacity="0.3" transform="rotate(-20)" />
          <circle cx={w - 8} cy={h - 12} r="1.5" fill="#F59E0B" opacity="0.3" />
        </g>
      );

    // 13 — OCEAN ADVENTURE: Floating bubbles & wave arc
    case 'ocean':
      return (
        <g pointerEvents="none">
          {/* Floating water bubbles in bottom-right */}
          <circle cx={w - 12} cy={h - 8} r="2.5" fill="none" stroke="#0284C7" strokeWidth="0.8" opacity="0.3" />
          <circle cx={w - 7} cy={h - 12} r="1.5" fill="none" stroke="#0284C7" strokeWidth="0.8" opacity="0.3" />
          {/* Wave arc in top corner */}
          <path
            d={`M${w - 16} 8Q${w - 12} 5 ${w - 8} 8`}
            fill="none"
            stroke={theme.primaryColor}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>
      );

    // 14 — PIRATE ADVENTURE: Compass star & ocean ripple
    case 'pirate':
      return (
        <g pointerEvents="none">
          {/* Compass Star in corner */}
          <path
            d={`M${w - 10} 5L${w - 9} 8L${w - 6} 9L${w - 9} 10L${w - 10} 13L${w - 11} 10L${w - 14} 9L${w - 11} 8Z`}
            fill="#D97706"
            opacity="0.35"
          />
          {/* Ocean ripple in bottom right */}
          <path
            d={`M${w - 16} ${h - 8}Q${w - 12} ${h - 10} ${w - 8} ${h - 8}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>
      );

    // 15 — NATURE EXPLORER: Sprouting leaf motif + sun spot
    case 'nature':
      return (
        <g pointerEvents="none">
          {/* Sprouting leaf motif in top right */}
          <path
            d={`M${w - 14} 10C${w - 12} 6 ${w - 8} 6 ${w - 6} 8C${w - 6} 11 ${w - 10} 12 ${w - 14} 10Z`}
            fill={theme.primaryColor}
            opacity="0.3"
          />
          {/* Acorn sun spot in bottom corner */}
          <circle cx={w - 10} cy={h - 8} r="2" fill="#EAB308" opacity="0.3" />
        </g>
      );

    default:
      return null;
  }
};
