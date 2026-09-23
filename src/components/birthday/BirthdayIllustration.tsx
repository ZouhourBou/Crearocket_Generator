import React from 'react';
import { BirthdayThemeId } from '../../types/birthdayKit';

interface BirthdayIllustrationProps {
  themeId: BirthdayThemeId;
  variant?: 'main' | 'secondary' | 'badge' | 'corner';
  className?: string;
}

export const BirthdayIllustration: React.FC<BirthdayIllustrationProps> = ({
  themeId,
  variant = 'main',
  className = 'w-full h-full',
}) => {
  switch (themeId) {
    case 'magical_unicorn':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="uni-horn" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#FFFBEB" />
            </linearGradient>
            <linearGradient id="uni-mane" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#67E8F9" />
            </linearGradient>
          </defs>
          {/* Cloud base */}
          <ellipse cx="50" cy="82" rx="35" ry="12" fill="#FDF2F8" stroke="#FBCFE8" strokeWidth="2" />
          <circle cx="32" cy="78" r="12" fill="#FDF2F8" />
          <circle cx="68" cy="78" r="12" fill="#FDF2F8" />
          {/* Mane */}
          <path d="M35 32C25 45 28 65 42 70C35 60 38 45 48 38Z" fill="url(#uni-mane)" />
          {/* Head & Neck */}
          <path d="M45 70C42 55 45 42 54 36C62 30 74 34 76 44C78 52 70 60 62 65L65 72Z" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Snout */}
          <path d="M68 45C75 46 78 52 74 56C70 60 64 56 64 50Z" fill="#FCE7F3" />
          <circle cx="71" cy="50" r="1" fill="#DB2777" />
          {/* Ear */}
          <path d="M50 36L48 24L56 30Z" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
          <path d="M50 32L49 26L54 29Z" fill="#FCE7F3" />
          {/* Horn */}
          <path d="M57 32L68 12L63 30Z" fill="url(#uni-horn)" stroke="#D97706" strokeWidth="1.5" />
          {/* Eye with eyelashes */}
          <path d="M58 45C60 48 64 48 66 45" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
          <path d="M64 47L66 49" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M60 47L59 49" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cheerful star sparkle */}
          <path d="M80 28L82 22L84 28L90 30L84 32L82 38L80 32L74 30Z" fill="#FBBF24" />
        </svg>
      );

    case 'dinosaur_adventure':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Back spines */}
          <polygon points="35,38 32,30 40,36" fill="#F59E0B" />
          <polygon points="45,40 43,28 50,38" fill="#F59E0B" />
          <polygon points="28,48 22,42 32,48" fill="#F59E0B" />
          {/* Dino Body */}
          <path d="M22 68C20 54 26 40 40 38C52 36 60 42 62 30C63 24 70 20 78 22C84 24 86 32 82 38C76 46 68 50 66 60C64 74 54 82 38 80C26 78 22 72 22 68Z" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
          {/* Belly */}
          <path d="M38 52C46 54 52 64 50 74C42 76 34 70 34 60Z" fill="#A7F3D0" />
          {/* Legs */}
          <rect x="34" y="74" width="7" height="12" rx="3.5" fill="#059669" stroke="#047857" strokeWidth="1.5" />
          <rect x="46" y="74" width="7" height="12" rx="3.5" fill="#059669" stroke="#047857" strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="74" cy="28" r="3.5" fill="#FFFFFF" />
          <circle cx="75" cy="28" r="2" fill="#064E3B" />
          <circle cx="76" cy="27" r="0.8" fill="#FFFFFF" />
          {/* Smile */}
          <path d="M72 34C75 36 80 34 82 32" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
          {/* Palm leaf */}
          <path d="M12 78C18 68 25 72 30 84C20 84 15 80 12 78Z" fill="#047857" opacity="0.6" />
        </svg>
      );

    case 'space_explorer':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rocket-flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* Flame */}
          <path d="M44 72L50 92L56 72C52 75 48 75 44 72Z" fill="url(#rocket-flame)" />
          {/* Fins */}
          <path d="M34 56L22 72L36 68Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <path d="M66 56L78 72L64 68Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          {/* Rocket Body */}
          <path d="M50 16C40 28 36 46 36 70L64 70C64 46 60 28 50 16Z" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />
          {/* Nose tip */}
          <path d="M50 16C45 22 43 28 42 34L58 34C57 28 55 22 50 16Z" fill="#EF4444" />
          {/* Window */}
          <circle cx="50" cy="46" r="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <ellipse cx="48" cy="43" rx="4" ry="2" fill="#FFFFFF" opacity="0.7" />
          {/* Small planet in bg */}
          <circle cx="80" cy="22" r="7" fill="#F59E0B" />
          <ellipse cx="80" cy="22" rx="11" ry="3" fill="none" stroke="#FBBF24" strokeWidth="1.5" transform="rotate(-20 80 22)" />
        </svg>
      );

    case 'princess_garden':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Crown */}
          <path d="M25 68L30 42L42 54L50 32L58 54L70 42L75 68Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Crown Base Band */}
          <rect x="25" y="68" width="50" height="8" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          {/* Jewels */}
          <circle cx="30" cy="42" r="3.5" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
          <circle cx="50" cy="32" r="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
          <circle cx="70" cy="42" r="3.5" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
          <circle cx="38" cy="72" r="2" fill="#EC4899" />
          <circle cx="50" cy="72" r="2.5" fill="#F8FAFC" />
          <circle cx="62" cy="72" r="2" fill="#EC4899" />
          {/* Butterflies */}
          <path d="M16 26C12 20 18 16 20 22C22 16 28 20 24 26Z" fill="#F472B6" />
          <path d="M84 26C88 20 82 16 80 22C78 16 72 20 76 26Z" fill="#F472B6" />
        </svg>
      );

    case 'jungle_safari':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lion Mane */}
          <circle cx="50" cy="50" r="32" fill="#D97706" />
          <circle cx="28" cy="32" r="9" fill="#B45309" />
          <circle cx="72" cy="32" r="9" fill="#B45309" />
          {/* Lion Face */}
          <circle cx="50" cy="52" r="23" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          {/* Ears */}
          <circle cx="34" cy="36" r="6" fill="#FDE68A" />
          <circle cx="34" cy="36" r="3" fill="#F87171" />
          <circle cx="66" cy="36" r="6" fill="#FDE68A" />
          <circle cx="66" cy="36" r="3" fill="#F87171" />
          {/* Eyes */}
          <circle cx="42" cy="48" r="3" fill="#78350F" />
          <circle cx="43" cy="47" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="48" r="3" fill="#78350F" />
          <circle cx="59" cy="47" r="1" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <polygon points="50,56 46,52 54,52" fill="#78350F" />
          <path d="M50 56L50 62C48 64 45 64 44 62" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 62C52 64 55 64 56 62" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Whiskers */}
          <path d="M38 58L28 56" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 61L28 62" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M62 58L72 56" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M62 61L72 62" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'ocean_adventure':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Water Spout */}
          <path d="M42 32C42 22 36 18 30 20" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <path d="M44 32C46 20 54 16 60 18" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          {/* Whale Body */}
          <path d="M18 58C18 42 36 34 58 36C78 38 88 52 86 64C82 74 64 76 42 74C26 72 18 66 18 58Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
          {/* Whale Belly */}
          <path d="M28 66C38 72 56 74 72 66C66 60 48 58 28 66Z" fill="#BAE6FD" />
          {/* Whale Tail */}
          <path d="M18 58L8 48C10 58 12 62 8 70Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" strokeLinejoin="round" />
          {/* Eye */}
          <circle cx="68" cy="48" r="3" fill="#FFFFFF" />
          <circle cx="69" cy="48" r="1.8" fill="#082F49" />
          {/* Smile */}
          <path d="M64 56C68 59 74 58 76 55" stroke="#082F49" strokeWidth="2" strokeLinecap="round" />
          {/* Cheek */}
          <circle cx="62" cy="54" r="3" fill="#F472B6" opacity="0.6" />
        </svg>
      );

    case 'teddy_bear_party':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <circle cx="32" cy="34" r="10" fill="#9A3412" />
          <circle cx="32" cy="34" r="6" fill="#FDBA74" />
          <circle cx="68" cy="34" r="10" fill="#9A3412" />
          <circle cx="68" cy="34" r="6" fill="#FDBA74" />
          {/* Head */}
          <circle cx="50" cy="52" r="26" fill="#C2410C" stroke="#9A3412" strokeWidth="2" />
          {/* Muzzle */}
          <ellipse cx="50" cy="58" rx="12" ry="9" fill="#FFEDD5" />
          {/* Nose */}
          <path d="M46 54C48 52 52 52 54 54C54 56 50 59 46 54Z" fill="#431407" />
          <path d="M50 57L50 63C48 64 46 64 45 62" stroke="#431407" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M50 63C52 64 54 64 55 62" stroke="#431407" strokeWidth="1.8" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="40" cy="48" r="3" fill="#431407" />
          <circle cx="41" cy="47" r="1" fill="#FFFFFF" />
          <circle cx="60" cy="48" r="3" fill="#431407" />
          <circle cx="61" cy="47" r="1" fill="#FFFFFF" />
          {/* Party Hat */}
          <polygon points="50,14 40,34 60,34" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="50" cy="14" r="3" fill="#EF4444" />
        </svg>
      );

    case 'rainbow_birthday':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rainbow Arcs */}
          <path d="M18 72A32 32 0 0 1 82 72" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
          <path d="M24 72A26 26 0 0 1 76 72" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
          <path d="M30 72A20 20 0 0 1 70 72" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
          <path d="M36 72A14 14 0 0 1 64 72" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
          <path d="M42 72A8 8 0 0 1 58 72" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
          {/* Clouds */}
          <ellipse cx="22" cy="74" rx="14" ry="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="16" cy="70" r="7" fill="#FFFFFF" />
          <circle cx="26" cy="68" r="8" fill="#FFFFFF" />
          <ellipse cx="78" cy="74" rx="14" ry="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="72" cy="68" r="8" fill="#FFFFFF" />
          <circle cx="82" cy="70" r="7" fill="#FFFFFF" />
          {/* Smiling Sun in Top Center */}
          <circle cx="50" cy="24" r="8" fill="#FBBF24" />
          <path d="M48 24C48 26 52 26 52 24" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'cute_animals':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bunny Ears */}
          <ellipse cx="38" cy="28" rx="7" ry="18" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
          <ellipse cx="38" cy="28" rx="4" ry="12" fill="#FCE7F3" />
          <ellipse cx="62" cy="28" rx="7" ry="18" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
          <ellipse cx="62" cy="28" rx="4" ry="12" fill="#FCE7F3" />
          {/* Bunny Head */}
          <circle cx="50" cy="56" r="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Cheeks */}
          <circle cx="34" cy="60" r="4.5" fill="#FCE7F3" />
          <circle cx="66" cy="60" r="4.5" fill="#FCE7F3" />
          {/* Eyes */}
          <circle cx="42" cy="52" r="3" fill="#1E293B" />
          <circle cx="43" cy="51" r="1" fill="#FFFFFF" />
          <circle cx="58" cy="52" r="3" fill="#1E293B" />
          <circle cx="59" cy="51" r="1" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <ellipse cx="50" cy="58" rx="2" ry="1.5" fill="#EC4899" />
          <path d="M50 59C48 62 46 62 45 60" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M50 59C52 62 54 62 55 60" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bow tie */}
          <polygon points="50,78 42,74 42,82" fill="#EC4899" />
          <polygon points="50,78 58,74 58,82" fill="#EC4899" />
          <circle cx="50" cy="78" r="2.5" fill="#BE185D" />
        </svg>
      );

    case 'football_party':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Trophy Base */}
          <rect x="42" y="74" width="16" height="8" rx="2" fill="#D97706" />
          <path d="M46 62L46 74L54 74L54 62Z" fill="#F59E0B" />
          {/* Cup */}
          <path d="M32 30L68 30C68 48 58 58 50 62C42 58 32 48 32 30Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
          {/* Handles */}
          <path d="M32 36C22 36 22 50 34 52" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M68 36C78 36 78 50 66 52" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Soccer Ball on Top */}
          <circle cx="50" cy="22" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          {/* Pentagons */}
          <polygon points="50,18 45,21 47,26 53,26 55,21" fill="#0F172A" />
          <polygon points="50,8 46,11 48,13 52,13 54,11" fill="#0F172A" />
          <polygon points="38,20 36,23 38,26 40,24" fill="#0F172A" />
          <polygon points="62,20 64,23 62,26 60,24" fill="#0F172A" />
        </svg>
      );

    case 'construction_party':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Excavator Body */}
          <rect x="24" y="52" width="36" height="20" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          {/* Cabin */}
          <path d="M28 52L34 36L48 36L48 52Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          <path d="M35 40L44 40L44 50L31 50Z" fill="#38BDF8" />
          {/* Arm & Bucket */}
          <path d="M48 46L68 38L78 50" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 46L68 38L78 50" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Bucket */}
          <path d="M76 46L86 52L82 62L72 58Z" fill="#64748B" stroke="#334155" strokeWidth="2" />
          {/* Tracks / Wheels */}
          <rect x="20" y="68" width="44" height="12" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <circle cx="26" cy="74" r="3" fill="#94A3B8" />
          <circle cx="36" cy="74" r="3" fill="#94A3B8" />
          <circle cx="48" cy="74" r="3" fill="#94A3B8" />
          <circle cx="58" cy="74" r="3" fill="#94A3B8" />
          {/* Warning stripes */}
          <rect x="26" y="64" width="32" height="4" fill="#0F172A" />
          <line x1="30" y1="64" x2="34" y2="68" stroke="#F59E0B" strokeWidth="2" />
          <line x1="38" y1="64" x2="42" y2="68" stroke="#F59E0B" strokeWidth="2" />
          <line x1="46" y1="64" x2="50" y2="68" stroke="#F59E0B" strokeWidth="2" />
        </svg>
      );

    case 'candy_cupcake':
    default:
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cupcake Wrapper */}
          <polygon points="30,56 36,86 64,86 70,56" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
          <line x1="42" y1="56" x2="44" y2="86" stroke="#BE185D" strokeWidth="1.5" />
          <line x1="50" y1="56" x2="50" y2="86" stroke="#BE185D" strokeWidth="1.5" />
          <line x1="58" y1="56" x2="56" y2="86" stroke="#BE185D" strokeWidth="1.5" />
          {/* Frosting Swirls */}
          <circle cx="36" cy="52" r="10" fill="#FDF2F8" />
          <circle cx="50" cy="50" r="12" fill="#FDF2F8" />
          <circle cx="64" cy="52" r="10" fill="#FDF2F8" />
          <circle cx="42" cy="40" r="9" fill="#FCE7F3" />
          <circle cx="56" cy="38" r="9" fill="#FCE7F3" />
          <circle cx="50" cy="30" r="7" fill="#FBCFE8" />
          {/* Sprinkles */}
          <circle cx="38" cy="46" r="1.5" fill="#3B82F6" />
          <circle cx="62" cy="46" r="1.5" fill="#10B981" />
          <circle cx="48" cy="42" r="1.5" fill="#F59E0B" />
          <circle cx="54" cy="34" r="1.5" fill="#8B5CF6" />
          {/* Cherry on Top */}
          <circle cx="50" cy="22" r="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <path d="M50 17C54 10 62 8 66 12" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
