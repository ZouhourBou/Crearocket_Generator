import React from 'react';
import { KawaiiThemeId } from '../../types/stationery';

interface Props {
  themeId: KawaiiThemeId;
  className?: string;
  size?: number;
}

export const ThemeIllustrations: React.FC<Props> = ({
  themeId,
  className = 'w-10 h-10',
  size = 40,
}) => {
  switch (themeId) {
    case 'peachy_dreams':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Peach body */}
          <path d="M50 88 C32 88 18 72 18 52 C18 36 28 26 42 24 C48 24 50 28 50 28 C50 28 52 24 58 24 C72 26 82 36 82 52 C82 72 68 88 50 88 Z" fill="#FB923C" stroke="#EA580C" strokeWidth="4" strokeLinejoin="round" />
          {/* Peach Cheek highlight */}
          <ellipse cx="32" cy="54" rx="6" ry="4" fill="#F43F5E" fillOpacity="0.4" />
          <ellipse cx="68" cy="54" rx="6" ry="4" fill="#F43F5E" fillOpacity="0.4" />
          {/* Cute face */}
          <circle cx="36" cy="46" r="3.5" fill="#431407" />
          <circle cx="64" cy="46" r="3.5" fill="#431407" />
          <path d="M46 52 Q50 56 54 52" stroke="#431407" strokeWidth="3" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M50 26 C50 14 62 8 72 12 C68 20 60 24 50 26 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
        </svg>
      );

    case 'hamster_paradise':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <circle cx="30" cy="28" r="14" fill="#D97706" stroke="#92400E" strokeWidth="3" />
          <circle cx="30" cy="28" r="8" fill="#FDE68A" />
          <circle cx="70" cy="28" r="14" fill="#D97706" stroke="#92400E" strokeWidth="3" />
          <circle cx="70" cy="28" r="8" fill="#FDE68A" />
          {/* Head & Body */}
          <ellipse cx="50" cy="56" rx="36" ry="32" fill="#FBBF24" stroke="#92400E" strokeWidth="4" />
          <ellipse cx="50" cy="62" rx="20" ry="18" fill="#FFFBEB" />
          {/* Cheeks */}
          <circle cx="28" cy="58" r="6" fill="#F43F5E" fillOpacity="0.4" />
          <circle cx="72" cy="58" r="6" fill="#F43F5E" fillOpacity="0.4" />
          {/* Eyes */}
          <circle cx="38" cy="48" r="4" fill="#451A03" />
          <circle cx="62" cy="48" r="4" fill="#451A03" />
          <circle cx="39" cy="46" r="1.5" fill="#FFFFFF" />
          <circle cx="63" cy="46" r="1.5" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <polygon points="50,54 47,51 53,51" fill="#F43F5E" />
          <path d="M47 55 Q50 58 53 55" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'bunny_garden':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <ellipse cx="36" cy="26" rx="8" ry="20" fill="#FFFFFF" stroke="#059669" strokeWidth="3" transform="rotate(-10 36 26)" />
          <ellipse cx="36" cy="26" rx="4" ry="14" fill="#FBCFE8" transform="rotate(-10 36 26)" />
          <ellipse cx="64" cy="26" rx="8" ry="20" fill="#FFFFFF" stroke="#059669" strokeWidth="3" transform="rotate(10 64 26)" />
          <ellipse cx="64" cy="26" rx="4" ry="14" fill="#FBCFE8" transform="rotate(10 64 26)" />
          {/* Head */}
          <circle cx="50" cy="58" r="28" fill="#FFFFFF" stroke="#059669" strokeWidth="3.5" />
          <ellipse cx="34" cy="62" rx="5" ry="3" fill="#F43F5E" fillOpacity="0.3" />
          <ellipse cx="66" cy="62" rx="5" ry="3" fill="#F43F5E" fillOpacity="0.3" />
          {/* Face */}
          <circle cx="40" cy="54" r="3.5" fill="#064E3B" />
          <circle cx="60" cy="54" r="3.5" fill="#064E3B" />
          <polygon points="50,59 47,56 53,56" fill="#FB7185" />
          <path d="M47 62 Q50 64 53 62" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'strawberry_milk':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Strawberry body */}
          <path d="M50 86 C30 86 20 68 20 48 C20 34 32 26 50 26 C68 26 80 34 80 48 C80 68 70 86 50 86 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="3.5" />
          {/* Seeds */}
          <circle cx="34" cy="45" r="2" fill="#FEF08A" />
          <circle cx="66" cy="45" r="2" fill="#FEF08A" />
          <circle cx="50" cy="54" r="2" fill="#FEF08A" />
          <circle cx="38" cy="68" r="2" fill="#FEF08A" />
          <circle cx="62" cy="68" r="2" fill="#FEF08A" />
          {/* Face */}
          <circle cx="42" cy="48" r="3" fill="#881337" />
          <circle cx="58" cy="48" r="3" fill="#881337" />
          <path d="M48 54 Q50 57 52 54" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
          {/* Crown Leaves */}
          <path d="M50 26 L42 16 L50 20 L58 16 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
        </svg>
      );

    case 'cloudy_sky':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud */}
          <path d="M30 65 C22 65 16 59 16 51 C16 43 22 38 29 38 C31 28 40 20 52 20 C64 20 73 28 75 38 C81 39 86 44 86 51 C86 59 80 65 72 65 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3.5" />
          {/* Face */}
          <circle cx="42" cy="48" r="3" fill="#0C4A6E" />
          <circle cx="60" cy="48" r="3" fill="#0C4A6E" />
          <ellipse cx="36" cy="52" rx="4" ry="2.5" fill="#FB7185" fillOpacity="0.4" />
          <ellipse cx="66" cy="52" rx="4" ry="2.5" fill="#FB7185" fillOpacity="0.4" />
          <path d="M48 54 Q51 57 54 54" stroke="#0C4A6E" strokeWidth="2.5" strokeLinecap="round" />
          {/* Little star */}
          <path d="M78 24 L80 18 L82 24 L88 26 L82 28 L80 34 L78 28 L72 26 Z" fill="#FACC15" />
        </svg>
      );

    case 'little_panda':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <circle cx="26" cy="28" r="12" fill="#1F2937" />
          <circle cx="74" cy="28" r="12" fill="#1F2937" />
          {/* Head */}
          <circle cx="50" cy="56" r="30" fill="#FFFFFF" stroke="#1F2937" strokeWidth="3.5" />
          {/* Eye Patches */}
          <ellipse cx="36" cy="50" rx="9" ry="7" fill="#1F2937" transform="rotate(-15 36 50)" />
          <ellipse cx="64" cy="50" rx="9" ry="7" fill="#1F2937" transform="rotate(15 64 50)" />
          {/* Eyes */}
          <circle cx="36" cy="50" r="2.5" fill="#FFFFFF" />
          <circle cx="64" cy="50" r="2.5" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#1F2937" />
          <path d="M47 67 Q50 69 53 67" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'cherry_blossom':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 5 Petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="28"
              rx="12"
              ry="18"
              fill="#FBCFE8"
              stroke="#DB2777"
              strokeWidth="2.5"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          {/* Center */}
          <circle cx="50" cy="50" r="8" fill="#F472B6" />
          <circle cx="50" cy="50" r="4" fill="#BE185D" />
        </svg>
      );

    case 'kitty_cafe':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <polygon points="24,42 30,18 46,32" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="3" />
          <polygon points="76,42 70,18 54,32" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="3" />
          {/* Head */}
          <circle cx="50" cy="54" r="28" fill="#FAF5FF" stroke="#7E22CE" strokeWidth="3.5" />
          {/* Face */}
          <circle cx="38" cy="50" r="3" fill="#581C87" />
          <circle cx="62" cy="50" r="3" fill="#581C87" />
          <ellipse cx="32" cy="56" rx="4" ry="2" fill="#F472B6" fillOpacity="0.4" />
          <ellipse cx="68" cy="56" rx="4" ry="2" fill="#F472B6" fillOpacity="0.4" />
          <polygon points="50,56 48,54 52,54" fill="#EC4899" />
          <path d="M47 58 Q50 61 53 58" stroke="#581C87" strokeWidth="2" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="22" y1="52" x2="30" y2="53" stroke="#7E22CE" strokeWidth="1.5" />
          <line x1="22" y1="57" x2="30" y2="56" stroke="#7E22CE" strokeWidth="1.5" />
          <line x1="78" y1="52" x2="70" y2="53" stroke="#7E22CE" strokeWidth="1.5" />
          <line x1="78" y1="57" x2="70" y2="56" stroke="#7E22CE" strokeWidth="1.5" />
        </svg>
      );

    case 'ocean_friends':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Baby Whale */}
          <path d="M84 48 C84 34 68 28 50 28 C28 28 16 42 16 56 C16 66 26 72 44 72 C62 72 76 68 84 62 L90 68 L88 56 Z" fill="#2DD4BF" stroke="#0F766E" strokeWidth="3.5" />
          {/* Belly */}
          <path d="M22 60 C28 68 40 70 52 70 C60 70 70 66 76 60 Z" fill="#CCFBF1" />
          {/* Eye */}
          <circle cx="34" cy="46" r="3.5" fill="#134E4A" />
          <circle cx="35" cy="45" r="1.5" fill="#FFFFFF" />
          <ellipse cx="44" cy="52" rx="4" ry="2.5" fill="#F43F5E" fillOpacity="0.4" />
          {/* Water Spout */}
          <path d="M50 28 Q48 16 42 14" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 28 Q56 14 62 16" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'little_duck':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head & Body */}
          <ellipse cx="56" cy="62" rx="24" ry="18" fill="#FDE047" stroke="#A16207" strokeWidth="3.5" />
          <circle cx="44" cy="40" r="18" fill="#FDE047" stroke="#A16207" strokeWidth="3.5" />
          {/* Beak */}
          <path d="M30 42 C22 42 18 38 28 36 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
          {/* Eye */}
          <circle cx="42" cy="38" r="3" fill="#713F12" />
          <ellipse cx="46" cy="44" rx="4" ry="2" fill="#FB7185" fillOpacity="0.4" />
        </svg>
      );

    case 'magic_unicorn':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Horn */}
          <polygon points="50,14 44,38 56,38" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" />
          {/* Head */}
          <path d="M40 38 C32 38 28 46 28 54 C28 66 38 74 54 74 C66 74 72 66 72 54 C72 44 64 38 54 38 Z" fill="#FAF5FF" stroke="#7C3AED" strokeWidth="3.5" />
          {/* Mane */}
          <path d="M60 40 Q76 46 66 60 Q80 64 68 76" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Eye */}
          <path d="M38 52 Q44 56 48 52" stroke="#581C87" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="44" cy="58" rx="4" ry="2" fill="#F472B6" fillOpacity="0.4" />
        </svg>
      );

    case 'cozy_study':
    default:
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stack of books */}
          <rect x="22" y="62" width="56" height="14" rx="3" fill="#94A3B8" stroke="#334155" strokeWidth="3" />
          <rect x="26" y="46" width="48" height="14" rx="3" fill="#CBD5E1" stroke="#334155" strokeWidth="3" />
          <rect x="30" y="30" width="40" height="14" rx="3" fill="#F1F5F9" stroke="#334155" strokeWidth="3" />
          {/* Ribbon */}
          <path d="M42 30 L42 48 L46 44 L50 48 L50 30 Z" fill="#F43F5E" />
          {/* Bookmark pencil */}
          <rect x="64" y="20" width="6" height="28" rx="2" fill="#FBBF24" stroke="#B45309" strokeWidth="2" transform="rotate(15 64 20)" />
        </svg>
      );
  }
};
