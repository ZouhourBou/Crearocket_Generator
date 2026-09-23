import React from 'react';

export interface IllustrationProps {
  themeId?: string;
  illustrationId?: string;
  className?: string;
}

export const ThemeVectorIllustration: React.FC<IllustrationProps> = ({
  themeId,
  illustrationId,
  className = 'w-full h-full',
}) => {
  const activeId = illustrationId || themeId || 'cute';

  switch (activeId) {
    // 01 — FLEURS / CUTE (3D Puffy Daisy with Kawaii Smile)
    case 'cute':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cute-petal" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="45%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </radialGradient>
            <radialGradient id="cute-center" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <linearGradient id="cute-heart" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <filter id="cute-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#831843" floodOpacity="0.18" />
            </filter>
          </defs>
          <g filter="url(#cute-shadow)">
            {/* 3D Petals with volumetric radial gradient and glossy specular highlight */}
            <circle cx="50" cy="24" r="15" fill="url(#cute-petal)" />
            <circle cx="74" cy="40" r="15" fill="url(#cute-petal)" />
            <circle cx="65" cy="71" r="15" fill="url(#cute-petal)" />
            <circle cx="35" cy="71" r="15" fill="url(#cute-petal)" />
            <circle cx="26" cy="40" r="15" fill="url(#cute-petal)" />

            {/* Specular highlights on petals */}
            <ellipse cx="50" cy="17" rx="6" ry="2.5" fill="#FFFFFF" opacity="0.65" />
            <ellipse cx="74" cy="33" rx="5" ry="2.5" transform="rotate(45 74 33)" fill="#FFFFFF" opacity="0.5" />
            <ellipse cx="26" cy="33" rx="5" ry="2.5" transform="rotate(-45 26 33)" fill="#FFFFFF" opacity="0.5" />

            {/* Puffy 3D Center */}
            <circle cx="50" cy="50" r="21" fill="url(#cute-center)" />
            <ellipse cx="44" cy="38" rx="8" ry="3.5" fill="#FFFFFF" opacity="0.6" />

            {/* Kawaii Face */}
            <path d="M42 48C42 50.5 40 52 38 52" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M58 48C58 50.5 60 52 62 52" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M46 54C48 57.5 52 57.5 54 54" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />

            {/* Rosy 3D Cheeks */}
            <circle cx="36" cy="54" r="4" fill="#F43F5E" opacity="0.5" />
            <circle cx="64" cy="54" r="4" fill="#F43F5E" opacity="0.5" />

            {/* Mini 3D Heart */}
            <path
              d="M77 22C77 17.5 81.5 14.5 85 17.5C88.5 14.5 93 17.5 93 22C93 29 85 33.5 85 33.5C85 33.5 77 29 77 22Z"
              fill="url(#cute-heart)"
            />
            <circle cx="89" cy="19" r="1.3" fill="#FFFFFF" opacity="0.8" />
          </g>
        </svg>
      );

    // 02 — DINOSAURES (3D Cute Chubby Baby T-Rex)
    case 'dino':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="dino-body" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="35%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            <radialGradient id="dino-belly" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </radialGradient>
            <linearGradient id="dino-spike" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <filter id="dino-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#064E3B" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#dino-shadow)">
            {/* 3D Spikes on back */}
            <path d="M32 24L38 15L45 24Z" fill="url(#dino-spike)" />
            <path d="M23 37L15 32L23 44Z" fill="url(#dino-spike)" />
            <path d="M19 55L11 52L20 62Z" fill="url(#dino-spike)" />

            {/* 3D Dino Head and Body */}
            <path
              d="M34 26C34 14 53 11 65 17C75 23 79 36 75 48C72 54 70 61 72 73C72 78 66 82 59 82C49 82 43 82 36 82C28 82 24 75 26 67C29 57 34 44 34 26Z"
              fill="url(#dino-body)"
            />

            {/* Glossy top-of-head highlight */}
            <ellipse cx="52" cy="18" rx="10" ry="3.5" fill="#FFFFFF" opacity="0.5" />

            {/* 3D Puffy Belly */}
            <path d="M48 46C56 46 64 54 62 76C55 78 46 78 43 76C41 61 43 52 48 46Z" fill="url(#dino-belly)" />

            {/* Giant Sparkly Kawaii Eye */}
            <circle cx="58" cy="28" r="6.5" fill="#064E3B" />
            <circle cx="60" cy="26" r="2.5" fill="#FFFFFF" />
            <circle cx="56.5" cy="30" r="1.1" fill="#FFFFFF" />

            {/* Cute Smile & Cheek */}
            <path d="M68 37C67 40 64 41 62 40" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="64" cy="34" r="3.2" fill="#F43F5E" opacity="0.45" />

            {/* Tiny 3D Front Hand */}
            <path d="M63 53C67 53 69 55 67 58C65 60 61 59 60 57" fill="#059669" />
          </g>
        </svg>
      );

    // 03 — ESPACE (3D Glossy Rocket Ship)
    case 'space':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rocket-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="rocket-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
            <radialGradient id="rocket-window" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </radialGradient>
            <linearGradient id="rocket-flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <filter id="rocket-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#rocket-shadow)">
            {/* 3D Flame */}
            <path d="M37 66C32 78 28 86 28 88C34 85 41 81 48 76L37 66Z" fill="url(#rocket-flame)" />
            <path d="M35 68C32 75 30 80 30 81C33 79 38 76 42 73L35 68Z" fill="#FEF08A" />

            {/* Left & Right 3D Fins */}
            <path d="M31 52C23 58 17 69 19 75C25 74 35 68 38 64Z" fill="url(#rocket-red)" />
            <path d="M54 39C65 42 75 48 77 55C73 59 64 58 57 53Z" fill="url(#rocket-red)" />

            {/* Curvy Rocket Fuselage */}
            <path
              d="M72 17C64 21 44 38 37 61C43 65 52 64 57 58C69 47 79 28 72 17Z"
              fill="url(#rocket-body)"
            />
            {/* Nosecone */}
            <path d="M72 17C67 19 61 24 59 29C64 33 70 33 74 27C76 22 75 18 72 17Z" fill="url(#rocket-red)" />

            {/* Window with 3D Ring */}
            <circle cx="53" cy="43" r="8" fill="#475569" />
            <circle cx="53" cy="43" r="6.2" fill="url(#rocket-window)" />
            <ellipse cx="51" cy="40" rx="3.5" ry="1.5" transform="rotate(-35 51 40)" fill="#FFFFFF" opacity="0.8" />

            {/* Specular Streak along fuselage */}
            <path d="M66 22C59 28 47 43 43 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

            {/* Floating 3D Sparkle Star */}
            <path
              d="M84 45L86 39L92 37L86 35L84 29L82 35L76 37L82 39L84 45Z"
              fill="#FBBF24"
            />
          </g>
        </svg>
      );

    // 04 — FOOTBALL (3D Sphere Soccer Ball with Star)
    case 'football':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ball-sphere" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F1F5F9" />
              <stop offset="90%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>
            <linearGradient id="ball-patch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="gold-star" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <filter id="ball-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#ball-shadow)">
            {/* Main 3D Sphere */}
            <circle cx="50" cy="52" r="34" fill="url(#ball-sphere)" />

            {/* Central 3D Pentagon Patch */}
            <polygon points="50,38 62,47 57,61 43,61 38,47" fill="url(#ball-patch)" />

            {/* Radiating Seams to Outer Patches */}
            <path d="M50 38L50 25M62 47L75 49M57 61L67 74M43 61L33 74M38 47L25 49" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />

            {/* Outer Curved Patches */}
            <path d="M43 21C47 24 53 24 57 21L55 18C52 18 48 18 43 21Z" fill="url(#ball-patch)" />
            <path d="M78 44C76 49 76 54 79 58L83 55C82 50 81 46 78 44Z" fill="url(#ball-patch)" />
            <path d="M22 44C24 49 24 54 21 58L17 55C18 50 19 46 22 44Z" fill="url(#ball-patch)" />
            <path d="M65 77C62 81 58 83 54 86L58 86C62 84 65 80 65 77Z" fill="url(#ball-patch)" />
            <path d="M35 77C38 81 42 83 46 86L42 86C38 84 35 80 35 77Z" fill="url(#ball-patch)" />

            {/* Specular Gloss Sheen */}
            <ellipse cx="40" cy="32" rx="14" ry="6" transform="rotate(-30 40 32)" fill="#FFFFFF" opacity="0.6" />

            {/* Golden 3D Winner Star */}
            <path
              d="M74 19L77 25L84 26L79 30L80 37L74 33L68 37L69 30L64 26L71 25L74 19Z"
              fill="url(#gold-star)"
            />
            <circle cx="75" cy="24" r="1" fill="#FFFFFF" />
          </g>
        </svg>
      );

    // 05 — LICORNE (3D Cute Magical Unicorn)
    case 'unicorn':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="uni-face" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </radialGradient>
            <linearGradient id="uni-horn" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="uni-mane-pink" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
            <linearGradient id="uni-mane-purple" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="uni-mane-blue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <filter id="uni-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4C1D95" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#uni-shadow)">
            {/* 3D Mane Curls behind */}
            <path d="M30 38C22 42 16 52 18 64C26 62 34 56 36 48Z" fill="url(#uni-mane-purple)" />
            <path d="M26 56C20 62 16 72 20 80C28 78 35 72 36 64Z" fill="url(#uni-mane-blue)" />

            {/* 3D Unicorn Head */}
            <path
              d="M34 32C34 26 44 24 54 26C66 28 76 36 78 50C80 62 72 74 58 74C46 74 36 68 34 52Z"
              fill="url(#uni-face)"
            />

            {/* 3D Ear */}
            <path d="M36 26C33 18 36 12 40 10C44 14 43 22 41 26Z" fill="url(#uni-face)" />
            <path d="M37 22C36 17 38 13 40 12C42 15 41 20 40 22Z" fill="#F472B6" />

            {/* Golden Spiral 3D Horn */}
            <path d="M52 25L64 8C64 8 68 15 62 27Z" fill="url(#uni-horn)" />
            <path d="M54 22L62 18M57 17L64 13" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

            {/* Front Mane Puff */}
            <path d="M44 24C48 18 56 19 55 27C51 32 45 30 44 24Z" fill="url(#uni-mane-pink)" />

            {/* Closed Smiling Eye with Long Lashes */}
            <path d="M60 46C63 50 67 50 70 46" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M63 49L61 52M68 49L70 52" stroke="#4C1D95" strokeWidth="1.5" strokeLinecap="round" />

            {/* Cheek & Muzzle */}
            <circle cx="68" cy="55" r="4" fill="#FB7185" opacity="0.45" />
            <circle cx="74" cy="62" r="1.8" fill="#94A3B8" />

            {/* Magic 3D Twinkle */}
            <path d="M83 30L85 24L87 30L93 32L87 34L85 40L83 34L77 32L83 30Z" fill="url(#uni-horn)" />
          </g>
        </svg>
      );

    // 06 — ARC-EN-CIEL (3D Puffy Rainbow Arches with Kawaii Cloud)
    case 'rainbow':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="rb-red" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <linearGradient id="rb-yellow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="rb-green" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="rb-blue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <radialGradient id="rb-cloud" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
            <filter id="rb-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284C7" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#rb-shadow)">
            {/* Concentric 3D Rainbow Bands */}
            <path d="M18 64C18 34 32 18 52 18C72 18 86 34 86 64" stroke="url(#rb-red)" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M25 64C25 39 37 25 52 25C67 25 79 39 79 64" stroke="url(#rb-yellow)" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M32 64C32 44 41 32 52 32C63 32 72 44 72 64" stroke="url(#rb-green)" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M39 64C39 49 45 39 52 39C59 39 65 49 65 64" stroke="url(#rb-blue)" strokeWidth="6.5" strokeLinecap="round" />

            {/* Specular highlights on red arch */}
            <path d="M38 23C43 20 49 19 54 19" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

            {/* Puffy 3D Cloud Base */}
            <circle cx="28" cy="68" r="13" fill="url(#rb-cloud)" />
            <circle cx="44" cy="65" r="16" fill="url(#rb-cloud)" />
            <circle cx="60" cy="68" r="13" fill="url(#rb-cloud)" />
            <rect x="25" y="66" width="38" height="15" rx="7" fill="url(#rb-cloud)" />

            {/* Kawaii Face on Cloud */}
            <circle cx="39" cy="66" r="2.2" fill="#334155" />
            <circle cx="49" cy="66" r="2.2" fill="#334155" />
            <path d="M41 71C43 73 45 73 47 71" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="34" cy="68" r="2.8" fill="#F43F5E" opacity="0.45" />
            <circle cx="54" cy="68" r="2.8" fill="#F43F5E" opacity="0.45" />

            {/* Mini Sparkle */}
            <path d="M78 24L80 19L82 24L87 26L82 28L80 33L78 28L73 26L78 24Z" fill="#FBBF24" />
          </g>
        </svg>
      );

    // 07 — ANIMAUX (3D Chubby Teddy Bear Cub)
    case 'animals':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bear-fur" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
            <radialGradient id="bear-snout" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </radialGradient>
            <filter id="bear-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#78350F" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#bear-shadow)">
            {/* 3D Ears */}
            <circle cx="30" cy="28" r="13" fill="url(#bear-fur)" />
            <circle cx="30" cy="28" r="7" fill="url(#bear-snout)" />
            <circle cx="70" cy="28" r="13" fill="url(#bear-fur)" />
            <circle cx="70" cy="28" r="7" fill="url(#bear-snout)" />

            {/* 3D Bear Head */}
            <circle cx="50" cy="52" r="28" fill="url(#bear-fur)" />

            {/* Glossy Head Highlight */}
            <ellipse cx="50" cy="32" rx="12" ry="4" fill="#FFFFFF" opacity="0.45" />

            {/* Puffy 3D Snout */}
            <ellipse cx="50" cy="58" rx="14" ry="11" fill="url(#bear-snout)" />

            {/* Big Sparkling Kawaii Eyes */}
            <circle cx="39" cy="46" r="4.8" fill="#451A03" />
            <circle cx="40.5" cy="44.5" r="1.8" fill="#FFFFFF" />
            <circle cx="61" cy="46" r="4.8" fill="#451A03" />
            <circle cx="62.5" cy="44.5" r="1.8" fill="#FFFFFF" />

            {/* 3D Button Nose & Smile */}
            <ellipse cx="50" cy="54" rx="4.5" ry="3.2" fill="#451A03" />
            <ellipse cx="49" cy="53" rx="1.5" ry="0.8" fill="#FFFFFF" opacity="0.6" />
            <path d="M50 57V61M46 61C48 63 52 63 54 61" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="32" cy="56" r="4" fill="#F43F5E" opacity="0.4" />
            <circle cx="68" cy="56" r="4" fill="#F43F5E" opacity="0.4" />

            {/* Cute Little Sprout on Head */}
            <path d="M50 24C47 18 51 14 55 16C55 20 52 23 50 24Z" fill="#10B981" />
          </g>
        </svg>
      );

    // 08 — GAMER (3D Ergonomic Game Controller)
    case 'gamer':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pad-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <linearGradient id="pad-cyan" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
            <filter id="pad-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#312E81" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#pad-shadow)">
            {/* 3D Chubby Controller Body */}
            <path
              d="M32 30C42 30 58 30 68 30C80 30 90 40 88 56C86 70 76 80 66 74C60 70 56 60 50 60C44 60 40 70 34 74C24 80 14 70 12 56C10 40 20 30 32 30Z"
              fill="url(#pad-body)"
            />

            {/* Specular Top Arch */}
            <path d="M34 33C44 33 56 33 66 33" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

            {/* 3D D-Pad (Left) */}
            <rect x="28" y="44" width="7" height="17" rx="2.5" fill="url(#pad-cyan)" />
            <rect x="23" y="49" width="17" height="7" rx="2.5" fill="url(#pad-cyan)" />

            {/* 3D Action Buttons (Right) in Candy Colors */}
            <circle cx="69" cy="43" r="3.3" fill="#F43F5E" />
            <circle cx="76" cy="50" r="3.3" fill="#FBBF24" />
            <circle cx="62" cy="50" r="3.3" fill="#38BDF8" />
            <circle cx="69" cy="57" r="3.3" fill="#10B981" />

            {/* Button Shine Dots */}
            <circle cx="68" cy="42" r="1" fill="#FFFFFF" />
            <circle cx="75" cy="49" r="1" fill="#FFFFFF" />
            <circle cx="61" cy="49" r="1" fill="#FFFFFF" />
            <circle cx="68" cy="56" r="1" fill="#FFFFFF" />

            {/* Mini Center Display Screen with Heart */}
            <rect x="44" y="42" width="12" height="9" rx="2" fill="#1E1B4B" />
            <path d="M48 46C48 44.5 49.5 43.5 50 44.5C50.5 43.5 52 44.5 52 46C52 48 50 49 50 49C50 49 48 48 48 46Z" fill="#F43F5E" />
          </g>
        </svg>
      );

    // 09 — SUPER-HÉROS (3D Beveled Hero Shield with Golden Star)
    case 'superhero':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="shield-red" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <radialGradient id="shield-white" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>
            <radialGradient id="shield-blue" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="60%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>
            <linearGradient id="shield-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <filter id="hero-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#881337" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#hero-shadow)">
            {/* Concentric 3D Rings */}
            <circle cx="50" cy="50" r="35" fill="url(#shield-red)" />
            <circle cx="50" cy="50" r="28" fill="url(#shield-white)" />
            <circle cx="50" cy="50" r="21" fill="url(#shield-red)" />
            <circle cx="50" cy="50" r="14" fill="url(#shield-blue)" />

            {/* Specular Curved Highlight on Outer Rim */}
            <path
              d="M26 34C32 24 42 18 53 18"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Gleaming Raised 3D Golden Star */}
            <path
              d="M50 39L53 47L61 47L55 52L57 60L50 55L43 60L45 52L39 47L47 47L50 39Z"
              fill="url(#shield-gold)"
            />
            <circle cx="50" cy="46" r="1.3" fill="#FFFFFF" />

            {/* Sparkle Glint */}
            <path d="M72 26L74 21L76 26L81 28L76 30L74 35L72 30L67 28L72 26Z" fill="#FEF08A" />
          </g>
        </svg>
      );

    // 10 — VOITURE (3D Cute Cherry Beetle Car)
    case 'cars':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="45%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <radialGradient id="car-wheel" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="70%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
            <filter id="car-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#car-shadow)">
            {/* 3D Rounded Car Roof & Body */}
            <path
              d="M20 54C20 46 25 36 38 32C46 28 62 28 72 35C80 41 84 48 84 56C84 65 80 67 76 67H24C20 67 20 62 20 54Z"
              fill="url(#car-body)"
            />

            {/* Specular Roof Sheen */}
            <path d="M38 34C48 30 60 30 68 36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />

            {/* Curved Sky-Blue Windshield */}
            <path d="M36 36C44 33 58 33 66 38C68 45 66 50 63 51H36C34 46 34 41 36 36Z" fill="url(#car-glass)" />
            <path d="M44 37L40 48M52 36L48 48" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

            {/* Glowing 3D Headlights */}
            <circle cx="81" cy="56" r="4.5" fill="#FDE047" />
            <circle cx="80" cy="55" r="1.5" fill="#FFFFFF" />

            {/* 3D Chunky Wheels with Hubcaps */}
            <circle cx="34" cy="67" r="9" fill="url(#car-wheel)" />
            <circle cx="34" cy="67" r="4.5" fill="#E2E8F0" />
            <circle cx="68" cy="67" r="9" fill="url(#car-wheel)" />
            <circle cx="68" cy="67" r="4.5" fill="#E2E8F0" />
          </g>
        </svg>
      );

    // 11 — MONDE JURASSIQUE (3D Baby Brontosaurus with Monstera Leaf)
    case 'jurassic':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="jura-skin" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </radialGradient>
            <linearGradient id="jura-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
            <filter id="jura-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#14532D" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#jura-shadow)">
            {/* Lush 3D Jungle Monstera Leaf behind */}
            <path
              d="M74 24C60 20 48 30 46 44C58 46 68 40 74 24Z"
              fill="url(#jura-leaf)"
            />
            <path d="M58 34L68 38M52 40L60 44" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />

            {/* 3D Baby Long-Neck Dino */}
            <path
              d="M26 78C26 62 38 56 46 48C52 42 54 30 52 24C50 18 58 14 64 16C72 18 74 28 68 34C62 40 58 48 54 58C58 64 68 64 74 70C78 74 74 80 66 80C50 80 34 80 26 78Z"
              fill="url(#jura-skin)"
            />

            {/* Specular Highlight on Head */}
            <ellipse cx="62" cy="18" rx="5" ry="2" fill="#FFFFFF" opacity="0.6" />

            {/* Giant Sparkly Eye */}
            <circle cx="63" cy="22" r="3.5" fill="#064E3B" />
            <circle cx="64" cy="21" r="1.3" fill="#FFFFFF" />

            {/* Sweet Smile & Rosy Cheek */}
            <path d="M68 28C67 30 65 31 63 30" stroke="#064E3B" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="60" cy="27" r="2.2" fill="#F43F5E" opacity="0.45" />

            {/* Cute Spots on Neck */}
            <circle cx="52" cy="38" r="2" fill="#FEF08A" opacity="0.8" />
            <circle cx="48" cy="46" r="2.5" fill="#FEF08A" opacity="0.8" />
            <circle cx="44" cy="56" r="3" fill="#FEF08A" opacity="0.8" />
          </g>
        </svg>
      );

    // 12 — BONBONS (3D Swirl Candy with Glossy Sparkles)
    case 'candy':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="candy-swirl" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="40%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#BE185D" />
            </radialGradient>
            <linearGradient id="candy-wrap" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
            <filter id="candy-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#831843" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#candy-shadow)">
            {/* Left & Right Twisted Wrappers */}
            <path d="M26 50L10 36C10 50 10 60 10 64L26 50Z" fill="url(#candy-wrap)" />
            <path d="M74 50L90 36C90 50 90 60 90 64L74 50Z" fill="url(#candy-wrap)" />

            {/* 3D Round Candy Center */}
            <circle cx="50" cy="50" r="26" fill="url(#candy-swirl)" />

            {/* White Curving Swirl Ribbons */}
            <path
              d="M32 40C38 32 46 30 54 32C62 34 66 40 64 48C62 56 54 62 46 64C38 66 32 60 32 52"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Specular Highlight */}
            <ellipse cx="42" cy="34" rx="8" ry="3.5" transform="rotate(-30 42 34)" fill="#FFFFFF" opacity="0.65" />

            {/* Kawaii Face */}
            <circle cx="45" cy="51" r="2.2" fill="#831843" />
            <circle cx="55" cy="51" r="2.2" fill="#831843" />
            <path d="M47 55Q50 58 53 55" stroke="#831843" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="41" cy="53" r="2.5" fill="#FB7185" opacity="0.5" />
            <circle cx="59" cy="53" r="2.5" fill="#FB7185" opacity="0.5" />

            {/* Sugar Sparkle Stars */}
            <path d="M72 26L74 21L76 26L81 28L76 30L74 35L72 30L67 28L72 26Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 13 — OCÉAN (3D Baby Whale with Glistening Water Spout)
    case 'ocean':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="whale-skin" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </radialGradient>
            <radialGradient id="whale-belly" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </radialGradient>
            <linearGradient id="whale-spout" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="whale-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0C4A6E" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#whale-shadow)">
            {/* Water Spout & Drops */}
            <path d="M48 38C48 24 40 18 36 20M48 38C48 22 56 16 62 18" stroke="url(#whale-spout)" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="35" cy="18" r="2.8" fill="#38BDF8" />
            <circle cx="63" cy="16" r="2.8" fill="#38BDF8" />
            <circle cx="48" cy="12" r="3.2" fill="#7DD3FC" />

            {/* 3D Baby Whale Body */}
            <path
              d="M18 64C18 46 36 38 56 38C74 38 84 48 84 62C84 76 68 76 52 76C34 76 18 74 18 64Z"
              fill="url(#whale-skin)"
            />

            {/* Tail Flukes */}
            <path d="M19 62C12 56 10 48 14 46C18 52 22 56 24 60C22 64 18 68 14 74C10 72 12 64 19 62Z" fill="url(#whale-skin)" />

            {/* Specular Highlight on curved back */}
            <path d="M38 42C46 40 56 40 66 44" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

            {/* 3D Cream Belly */}
            <path d="M38 68C48 68 64 68 74 62C72 74 60 76 48 76C40 76 38 72 38 68Z" fill="url(#whale-belly)" />

            {/* Cute Fin */}
            <path d="M48 60C54 60 58 64 56 68C52 70 46 66 48 60Z" fill="#0369A1" />

            {/* Big Sparkly Kawaii Eye */}
            <circle cx="68" cy="52" r="4.2" fill="#0C4A6E" />
            <circle cx="69.5" cy="50.5" r="1.6" fill="#FFFFFF" />

            {/* Happy Smile & Pink Blush */}
            <path d="M74 58C73 60 70 61 68 60" stroke="#0C4A6E" strokeWidth="2" strokeLinecap="round" />
            <circle cx="64" cy="56" r="3" fill="#F43F5E" opacity="0.45" />
          </g>
        </svg>
      );

    // 14 — PIRATES (3D Cute Pirate Ship with Billowy Sail)
    case 'pirate':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ship-wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="60%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <radialGradient id="ship-sail" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </radialGradient>
            <filter id="ship-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#451A03" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#ship-shadow)">
            {/* Ocean Foam Splash */}
            <path d="M16 75C26 71 36 77 46 73C56 69 66 77 76 73C82 71 86 73 88 75" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />

            {/* 3D Hull */}
            <path d="M22 56L28 72C44 76 64 76 76 72L82 56Z" fill="url(#ship-wood)" />
            <rect x="20" y="54" width="64" height="4" rx="2" fill="#D97706" />

            {/* Hull Portholes */}
            <circle cx="38" cy="64" r="2.8" fill="#FBBF24" />
            <circle cx="52" cy="64" r="2.8" fill="#FBBF24" />
            <circle cx="66" cy="64" r="2.8" fill="#FBBF24" />

            {/* Wooden Mast */}
            <rect x="50" y="20" width="4.5" height="36" rx="2" fill="#451A03" />

            {/* Billowy Puffed 3D Sail */}
            <path d="M34 28C42 26 58 26 68 28C66 42 64 50 52 52C40 50 36 42 34 28Z" fill="url(#ship-sail)" />

            {/* Cute Red Anchor on Sail */}
            <circle cx="51" cy="38" r="3" stroke="#DC2626" strokeWidth="1.6" fill="none" />
            <path d="M51 41V47M47 45Q51 49 55 45" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />

            {/* Red Pennant Flag */}
            <polygon points="54,20 68,24 54,28" fill="#DC2626" />
          </g>
        </svg>
      );

    // 15 — NATURE (3D Golden Acorn with Oak Leaf)
    case 'nature':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="acorn-nut" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            <radialGradient id="acorn-cap" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
            <linearGradient id="oak-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="60%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <filter id="nature-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#451A03" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#nature-shadow)">
            {/* Vibrant 3D Oak Leaf behind */}
            <path
              d="M32 74C20 62 24 42 40 30C46 36 44 46 52 50C58 44 62 36 70 34C66 48 62 62 48 70Z"
              fill="url(#oak-leaf)"
            />
            <path d="M40 44L52 60" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" />

            {/* 3D Acorn Cap / Cupule */}
            <path d="M42 42C42 32 68 32 76 42L42 42Z" fill="url(#acorn-cap)" />
            <rect x="57" y="24" width="4.5" height="9" rx="2" fill="#451A03" />

            {/* Volumetric 3D Nut Body */}
            <path d="M44 42C44 60 56 72 60 74C64 72 74 60 74 42Z" fill="url(#acorn-nut)" />

            {/* Specular Highlight on Nut */}
            <ellipse cx="52" cy="48" rx="4.5" ry="2" transform="rotate(-25 52 48)" fill="#FFFFFF" opacity="0.6" />

            {/* Kawaii Face on Acorn */}
            <circle cx="55" cy="52" r="2.3" fill="#451A03" />
            <circle cx="65" cy="52" r="2.3" fill="#451A03" />
            <path d="M58 57Q60 59 62 57" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="52" cy="55" r="2" fill="#F43F5E" opacity="0.5" />
            <circle cx="68" cy="55" r="2" fill="#F43F5E" opacity="0.5" />

            {/* Little Sunbeam Sparkle */}
            <circle cx="25" cy="26" r="4.5" fill="#FDE047" />
            <path d="M25 18V20M25 32V34M17 26H19M31 26H33" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      );

    // 16 — PANDA KAWAII (3D Chubby Baby Panda with Bamboo)
    case 'panda':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="panda-face" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
            <radialGradient id="panda-dark" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="40%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
            <linearGradient id="bamboo-stalk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <filter id="panda-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#panda-shadow)">
            {/* Dark 3D Ears */}
            <circle cx="28" cy="26" r="12" fill="url(#panda-dark)" />
            <circle cx="72" cy="26" r="12" fill="url(#panda-dark)" />
            <circle cx="28" cy="24" r="5" fill="#334155" opacity="0.6" />
            <circle cx="72" cy="24" r="5" fill="#334155" opacity="0.6" />

            {/* Chubby Panda Head */}
            <circle cx="50" cy="52" r="32" fill="url(#panda-face)" />
            <ellipse cx="44" cy="30" rx="12" ry="4" fill="#FFFFFF" opacity="0.75" />

            {/* Eye Patches */}
            <ellipse cx="36" cy="48" rx="8" ry="10" transform="rotate(-15 36 48)" fill="url(#panda-dark)" />
            <ellipse cx="64" cy="48" rx="8" ry="10" transform="rotate(15 64 48)" fill="url(#panda-dark)" />

            {/* Twinkling Eyes */}
            <circle cx="37" cy="47" r="3.2" fill="#FFFFFF" />
            <circle cx="36" cy="46" r="1.8" fill="#0F172A" />
            <circle cx="35" cy="45" r="0.8" fill="#FFFFFF" />
            <circle cx="63" cy="47" r="3.2" fill="#FFFFFF" />
            <circle cx="64" cy="46" r="1.8" fill="#0F172A" />
            <circle cx="63" cy="45" r="0.8" fill="#FFFFFF" />

            {/* Cute Nose & Mouth */}
            <path d="M47 57C47 55.5 53 55.5 53 57C53 59 50 60.5 50 60.5C50 60.5 47 59 47 57Z" fill="#0F172A" />
            <path d="M47 62C48.5 64.5 51.5 64.5 53 62" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="27" cy="58" r="4.5" fill="#FB7185" opacity="0.45" />
            <circle cx="73" cy="58" r="4.5" fill="#FB7185" opacity="0.45" />

            {/* Little Bamboo Shoot in Paw */}
            <rect x="71" y="58" width="5" height="26" rx="2.5" transform="rotate(-20 71 58)" fill="url(#bamboo-stalk)" />
            <path d="M74 62Q84 56 86 64Q78 68 74 62Z" fill="#4ADE80" />
            <path d="M72 72Q62 70 64 78Q70 78 72 72Z" fill="#22C55E" />
            <ellipse cx="68" cy="74" rx="5" ry="4" fill="url(#panda-dark)" />
            <ellipse cx="32" cy="74" rx="5" ry="4" fill="url(#panda-dark)" />
          </g>
        </svg>
      );

    // 17 — CUPCAKE GOURMAND (3D Swirled Cupcake with Cherry)
    case 'cupcake':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cupcake-liner" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="30%" stopColor="#FDE68A" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <radialGradient id="frosting-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="45%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </radialGradient>
            <radialGradient id="cherry-grad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FECDD3" />
              <stop offset="35%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>
            <filter id="cupcake-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#831843" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#cupcake-shadow)">
            {/* Fluted Paper Base */}
            <path d="M26 56L34 86C35 88.5 37 90 40 90H60C63 90 65 88.5 66 86L74 56Z" fill="url(#cupcake-liner)" />
            {/* Paper pleat stripes */}
            <path d="M34 56L38 88M42 56L44 89M50 56L50 90M58 56L56 89M66 56L62 88" stroke="#D97706" strokeWidth="1.4" opacity="0.4" strokeLinecap="round" />

            {/* Bottom Frosting Mound */}
            <path d="M20 56C20 48 30 46 36 50C42 45 58 45 64 50C70 46 80 48 80 56C80 62 20 62 20 56Z" fill="url(#frosting-grad)" />

            {/* Middle Swirl */}
            <path d="M28 46C28 38 40 36 50 36C60 36 72 38 72 46C72 50 28 50 28 46Z" fill="url(#frosting-grad)" />

            {/* Top Swirl Dollop */}
            <path d="M38 36C38 28 46 26 50 22C54 26 62 28 62 36Z" fill="url(#frosting-grad)" />
            <ellipse cx="46" cy="30" rx="8" ry="3" fill="#FFFFFF" opacity="0.6" />

            {/* Colorful Sprinkles */}
            <circle cx="34" cy="50" r="1.5" fill="#38BDF8" />
            <circle cx="66" cy="50" r="1.5" fill="#FACC15" />
            <circle cx="44" cy="42" r="1.5" fill="#A855F7" />
            <circle cx="56" cy="40" r="1.5" fill="#4ADE80" />
            <circle cx="50" cy="48" r="1.5" fill="#FFFFFF" />

            {/* Glossy Red Cherry on Top */}
            <circle cx="50" cy="18" r="7.5" fill="url(#cherry-grad)" />
            <circle cx="48" cy="15" r="2" fill="#FFFFFF" opacity="0.8" />
            <path d="M50 12C50 6 56 4 60 6" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
            <ellipse cx="58" cy="6" rx="2.5" ry="1.2" transform="rotate(-30 58 6)" fill="#22C55E" />

            {/* Kawaii Face on Base */}
            <circle cx="44" cy="72" r="2" fill="#78350F" />
            <circle cx="56" cy="72" r="2" fill="#78350F" />
            <path d="M48 76Q50 78 52 76" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="40" cy="74" r="2" fill="#F43F5E" opacity="0.5" />
            <circle cx="60" cy="74" r="2" fill="#F43F5E" opacity="0.5" />
          </g>
        </svg>
      );

    // 18 — PAPILLON FÉERIQUE (3D Magical Butterfly with Glow)
    case 'butterfly':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="butterfly-wing-l" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="40%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <linearGradient id="butterfly-wing-r" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="40%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <radialGradient id="wing-heart" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FBBF24" />
            </radialGradient>
            <radialGradient id="butterfly-body" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </radialGradient>
            <filter id="butterfly-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#6B21A8" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#butterfly-shadow)">
            {/* Top Wings */}
            <path
              d="M50 48C45 32 20 18 12 32C6 42 16 62 50 56Z"
              fill="url(#butterfly-wing-l)"
            />
            <path
              d="M50 48C55 32 80 18 88 32C94 42 84 62 50 56Z"
              fill="url(#butterfly-wing-r)"
            />

            {/* Bottom Wings */}
            <path
              d="M50 56C38 60 22 68 26 80C30 90 46 86 50 68Z"
              fill="url(#butterfly-wing-l)"
              opacity="0.92"
            />
            <path
              d="M50 56C62 60 78 68 74 80C70 90 54 86 50 68Z"
              fill="url(#butterfly-wing-r)"
              opacity="0.92"
            />

            {/* Wing Inset Dots / Ornaments */}
            <circle cx="25" cy="36" r="4.5" fill="url(#wing-heart)" />
            <circle cx="75" cy="36" r="4.5" fill="url(#wing-heart)" />
            <circle cx="32" cy="74" r="3" fill="#FFFFFF" opacity="0.85" />
            <circle cx="68" cy="74" r="3" fill="#FFFFFF" opacity="0.85" />
            <circle cx="25" cy="34" r="1.3" fill="#FFFFFF" />
            <circle cx="75" cy="34" r="1.3" fill="#FFFFFF" />

            {/* Butterfly Antennae */}
            <path d="M48 38Q42 22 36 20" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 38Q58 22 64 20" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="36" cy="20" r="2.5" fill="#FBBF24" />
            <circle cx="64" cy="20" r="2.5" fill="#FBBF24" />

            {/* Slender Volumetric Body */}
            <ellipse cx="50" cy="56" rx="4.5" ry="16" fill="url(#butterfly-body)" />
            <circle cx="50" cy="38" r="6" fill="url(#butterfly-body)" />
            <ellipse cx="48" cy="36" rx="2" ry="1" fill="#FFFFFF" opacity="0.7" />

            {/* Kawaii Eyes */}
            <circle cx="48" cy="37" r="1.2" fill="#FFFFFF" />
            <circle cx="52" cy="37" r="1.2" fill="#FFFFFF" />

            {/* Magic Sparkles */}
            <path d="M18 16L20 20L24 22L20 24L18 28L16 24L12 22L16 20Z" fill="#FDE047" />
            <path d="M82 16L84 20L88 22L84 24L82 28L80 24L76 22L80 20Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 19 — KOALA MIGNON (3D Soft Baby Koala with Eucalyptus)
    case 'koala':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="koala-fur" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </radialGradient>
            <radialGradient id="koala-ear-in" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="100%" stopColor="#FDA4AF" />
            </radialGradient>
            <radialGradient id="koala-nose-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
            <filter id="koala-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#334155" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#koala-shadow)">
            {/* Big Fluffy Ears */}
            <circle cx="24" cy="34" r="15" fill="url(#koala-fur)" />
            <circle cx="24" cy="34" r="9" fill="url(#koala-ear-in)" />
            <circle cx="76" cy="34" r="15" fill="url(#koala-fur)" />
            <circle cx="76" cy="34" r="9" fill="url(#koala-ear-in)" />

            {/* Round Koala Head */}
            <circle cx="50" cy="52" r="30" fill="url(#koala-fur)" />
            <ellipse cx="44" cy="32" rx="10" ry="3.5" fill="#FFFFFF" opacity="0.65" />

            {/* Big Dark Koala Nose */}
            <ellipse cx="50" cy="55" rx="9" ry="13" fill="url(#koala-nose-grad)" />
            <ellipse cx="48" cy="48" rx="4" ry="2" fill="#FFFFFF" opacity="0.55" />

            {/* Kawaii Eyes */}
            <circle cx="34" cy="46" r="3" fill="#0F172A" />
            <circle cx="33" cy="45" r="1.2" fill="#FFFFFF" />
            <circle cx="66" cy="46" r="3" fill="#0F172A" />
            <circle cx="65" cy="45" r="1.2" fill="#FFFFFF" />

            {/* Rosy Cheeks */}
            <circle cx="28" cy="56" r="4.5" fill="#FB7185" opacity="0.5" />
            <circle cx="72" cy="56" r="4.5" fill="#FB7185" opacity="0.5" />

            {/* Happy Little Smile below nose */}
            <path d="M47 70C49 71.5 51 71.5 53 70" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />

            {/* Eucalyptus Leaf */}
            <path d="M72 68Q86 64 88 74Q78 80 72 68Z" fill="#22C55E" />
            <path d="M72 68L84 72" stroke="#86EFAC" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="70" cy="74" r="4" fill="url(#koala-fur)" />
          </g>
        </svg>
      );

    // 20 — ROBOT MIGNON (3D Friendly Retro Bot with Glowing Heart)
    case 'robot':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bot-body" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#CFFAFE" />
              <stop offset="40%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </radialGradient>
            <radialGradient id="bot-eye-glow" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </radialGradient>
            <radialGradient id="bot-heart" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </radialGradient>
            <filter id="bot-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0E7490" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#bot-shadow)">
            {/* Antenna with Glowing Orb */}
            <line x1="50" y1="26" x2="50" y2="15" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="12" r="5" fill="#FACC15" />
            <circle cx="48" cy="10" r="1.8" fill="#FFFFFF" />

            {/* Ear Bolts */}
            <rect x="18" y="38" width="6" height="12" rx="3" fill="#0E7490" />
            <rect x="76" y="38" width="6" height="12" rx="3" fill="#0E7490" />

            {/* Rounded Head */}
            <rect x="24" y="26" width="52" height="36" rx="12" fill="url(#bot-body)" />
            <rect x="28" y="28" width="44" height="6" rx="3" fill="#FFFFFF" opacity="0.45" />

            {/* Visor / Face Screen */}
            <rect x="30" y="34" width="40" height="20" rx="7" fill="#0F172A" />

            {/* Glowing Eyes */}
            <circle cx="40" cy="43" r="4.5" fill="url(#bot-eye-glow)" />
            <circle cx="39" cy="41" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="43" r="4.5" fill="url(#bot-eye-glow)" />
            <circle cx="59" cy="41" r="1.5" fill="#FFFFFF" />

            {/* Pixel Smile */}
            <path d="M46 48C48 50 52 50 54 48" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />

            {/* Bot Torso */}
            <rect x="30" y="66" width="40" height="26" rx="8" fill="url(#bot-body)" />

            {/* Neck Joint */}
            <rect x="44" y="62" width="12" height="4" rx="2" fill="#0E7490" />

            {/* Glowing Heart Gauge on Chest */}
            <path
              d="M50 75C50 72 46 70 44 72C42 70 38 72 38 75C38 79 44 82 44 82C44 82 50 79 50 75Z"
              transform="translate(6, 1)"
              fill="url(#bot-heart)"
            />

            {/* Dial Dots */}
            <circle cx="40" cy="85" r="2" fill="#FDE047" />
            <circle cx="48" cy="85" r="2" fill="#4ADE80" />
            <circle cx="56" cy="85" r="2" fill="#38BDF8" />
          </g>
        </svg>
      );

    // 21 — FRAISE SUCRÉE (3D Plump Kawaii Strawberry with Golden Seeds)
    case 'strawberry':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="berry-body" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="35%" stopColor="#F43F5E" />
              <stop offset="85%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>
            <linearGradient id="calyx-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <filter id="berry-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#881337" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#berry-shadow)">
            {/* Plump Strawberry Body */}
            <path
              d="M50 88C34 84 20 66 22 46C24 34 34 30 50 32C66 30 76 34 78 46C80 66 66 84 50 88Z"
              fill="url(#berry-body)"
            />
            {/* Specular Highlight */}
            <ellipse cx="36" cy="40" rx="8" ry="4" transform="rotate(-30 36 40)" fill="#FFFFFF" opacity="0.6" />

            {/* Golden Seeds */}
            <ellipse cx="32" cy="54" rx="1.5" ry="2.2" transform="rotate(-15 32 54)" fill="#FEF08A" />
            <ellipse cx="68" cy="54" rx="1.5" ry="2.2" transform="rotate(15 68 54)" fill="#FEF08A" />
            <ellipse cx="38" cy="72" rx="1.5" ry="2.2" transform="rotate(-10 38 72)" fill="#FEF08A" />
            <ellipse cx="62" cy="72" rx="1.5" ry="2.2" transform="rotate(10 62 72)" fill="#FEF08A" />
            <ellipse cx="50" cy="78" rx="1.5" ry="2.2" fill="#FEF08A" />

            {/* Kawaii Face */}
            <circle cx="42" cy="52" r="2.8" fill="#451A03" />
            <circle cx="41" cy="51" r="1" fill="#FFFFFF" />
            <circle cx="58" cy="52" r="2.8" fill="#451A03" />
            <circle cx="57" cy="51" r="1" fill="#FFFFFF" />
            <path d="M47 58C48.5 61 51.5 61 53 58" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
            <circle cx="36" cy="59" r="3.2" fill="#FB7185" opacity="0.65" />
            <circle cx="64" cy="59" r="3.2" fill="#FB7185" opacity="0.65" />

            {/* Green Leaf Calyx on Top */}
            <path d="M50 32C42 22 28 26 26 34C34 32 44 32 50 32Z" fill="url(#calyx-grad)" />
            <path d="M50 32C58 22 72 26 74 34C66 32 56 32 50 32Z" fill="url(#calyx-grad)" />
            <path d="M50 32C46 18 54 18 50 32Z" fill="url(#calyx-grad)" />
            <path d="M50 22Q50 14 56 12" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    // 22 — ÉTOILE MAGIQUE (3D Puffy Smiling Star with Rainbow Trail)
    case 'star':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="star-gold" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="star-trail-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id="star-trail-2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <filter id="star-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#B45309" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#star-shadow)">
            {/* Dynamic Shooting Star Trails */}
            <path d="M26 74Q14 84 8 92" stroke="url(#star-trail-1)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <path d="M36 82Q22 90 16 96" stroke="url(#star-trail-2)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <path d="M46 88Q34 94 28 98" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Puffy 3D Star Body */}
            <path
              d="M50 14L58 35C59 38 62 40 65 41L87 45C91 46 92 50 89 53L73 68C71 70 70 73 71 76L75 97C76 101 72 103 69 101L49 90C47 89 44 89 42 90L22 101C19 103 15 101 16 97L20 76C21 73 20 70 18 68L2 53C-1 50 0 46 4 45L26 41C29 40 32 38 33 35L41 14C43 10 48 10 50 14Z"
              transform="scale(0.85) translate(8, 4)"
              fill="url(#star-gold)"
            />

            {/* Glossy Highlights */}
            <ellipse cx="44" cy="38" rx="8" ry="3.5" transform="rotate(-25 44 38)" fill="#FFFFFF" opacity="0.65" />

            {/* Kawaii Face */}
            <circle cx="43" cy="52" r="2.8" fill="#78350F" />
            <circle cx="42" cy="51" r="1" fill="#FFFFFF" />
            <path d="M56 49C58 53 62 53 64 49" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M47 58C49 61 53 61 55 58" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="36" cy="58" r="3.5" fill="#F43F5E" opacity="0.5" />
            <circle cx="66" cy="58" r="3.5" fill="#F43F5E" opacity="0.5" />

            {/* Tiny Diamond Sparkles */}
            <path d="M80 20L82 24L86 26L82 28L80 32L78 28L74 26L78 24Z" fill="#FDE047" />
            <path d="M20 28L21.5 31L24.5 32.5L21.5 34L20 37L18.5 34L15.5 32.5L18.5 31Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 23 — PETIT RENARD (3D Baby Fox with Fluffy Tail)
    case 'fox':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="fox-coat" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="40%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#C2410C" />
            </radialGradient>
            <linearGradient id="fox-white" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>
            <filter id="fox-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7C2D12" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#fox-shadow)">
            {/* Bushy Tail Behind */}
            <path
              d="M62 76C82 78 92 60 86 44C82 34 72 38 68 48Z"
              fill="url(#fox-coat)"
            />
            {/* White Tail Tip */}
            <path d="M86 44C88 48 84 56 76 58C78 50 82 44 86 44Z" fill="url(#fox-white)" />

            {/* Fox Ears */}
            <path d="M26 44L20 18L44 32Z" fill="url(#fox-coat)" />
            <path d="M24 38L22 24L38 32Z" fill="#431407" />
            <path d="M74 44L80 18L56 32Z" fill="url(#fox-coat)" />
            <path d="M76 38L78 24L62 32Z" fill="#431407" />

            {/* Fox Head */}
            <circle cx="50" cy="52" r="28" fill="url(#fox-coat)" />

            {/* White Cheeks Mask */}
            <path
              d="M24 52C24 68 38 74 50 74C62 74 76 68 76 52C66 60 58 60 50 56C42 60 34 60 24 52Z"
              fill="url(#fox-white)"
            />

            {/* Cute Black Button Nose */}
            <ellipse cx="50" cy="62" rx="3.5" ry="2.5" fill="#431407" />
            <circle cx="49" cy="61" r="0.8" fill="#FFFFFF" />

            {/* Happy Closed Arc Eyes */}
            <path d="M34 50C36 53 40 53 42 50" stroke="#431407" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M58 50C60 53 64 53 66 50" stroke="#431407" strokeWidth="2.2" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="30" cy="58" r="4" fill="#FB7185" opacity="0.5" />
            <circle cx="70" cy="58" r="4" fill="#FB7185" opacity="0.5" />

            {/* Forehead Specular Highlight */}
            <ellipse cx="50" cy="32" rx="8" ry="3" fill="#FFFFFF" opacity="0.5" />
          </g>
        </svg>
      );

    // 24 — MUSIQUE POP (3D Pastel Headphones & Musical Beats)
    case 'music':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="music-note" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="headband-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <radialGradient id="earcup-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="45%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </radialGradient>
            <filter id="music-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#4C1D95" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#music-shadow)">
            {/* Arched Headband */}
            <path
              d="M26 56C26 32 40 20 50 20C60 20 74 32 74 56"
              stroke="url(#headband-grad)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Left & Right Cushioned Earcups */}
            <rect x="18" y="48" width="12" height="22" rx="6" fill="url(#earcup-grad)" />
            <rect x="26" y="52" width="5" height="14" rx="2" fill="#E2E8F0" />
            <rect x="70" y="48" width="12" height="22" rx="6" fill="url(#earcup-grad)" />
            <rect x="69" y="52" width="5" height="14" rx="2" fill="#E2E8F0" />

            {/* Center Smiling Eighth Note */}
            <ellipse cx="44" cy="74" rx="8" ry="6" transform="rotate(-20 44 74)" fill="url(#music-note)" />
            <rect x="49" y="48" width="4.5" height="26" rx="2" fill="#F59E0B" />
            <path d="M53 48Q66 44 68 56" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />

            {/* Kawaii Face on Note */}
            <circle cx="42" cy="72" r="1.5" fill="#78350F" />
            <circle cx="48" cy="70" r="1.5" fill="#78350F" />
            <path d="M44 75Q46 77 48 75" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />

            {/* Floating Mini Notes & Stars */}
            <path d="M78 30L82 28L80 34Z" fill="#38BDF8" />
            <circle cx="82" cy="34" r="2.5" fill="#38BDF8" />
            <path d="M16 34L20 32L18 38Z" fill="#C084FC" />
            <circle cx="16" cy="38" r="2.5" fill="#C084FC" />
            <path d="M50 10L51.5 13L54.5 14.5L51.5 16L50 19L48.5 16L45.5 14.5L48.5 13Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 25 — MONTGOLFIÈRE (3D Dreamy Pastel Hot-Air Balloon)
    case 'balloon':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="balloon-segment1" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FECDD3" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </radialGradient>
            <radialGradient id="balloon-segment2" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </radialGradient>
            <radialGradient id="balloon-segment3" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
            <radialGradient id="basket-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
            <filter id="balloon-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0369A1" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#balloon-shadow)">
            {/* Balloon Bulb Outlines & Colored Segments */}
            {/* Outer Left Segment */}
            <path
              d="M50 14C32 14 20 28 24 46C26 56 36 64 42 68L50 68Z"
              fill="url(#balloon-segment1)"
            />
            {/* Outer Right Segment */}
            <path
              d="M50 14C68 14 80 28 76 46C74 56 64 64 58 68L50 68Z"
              fill="url(#balloon-segment2)"
            />
            {/* Center Plump Segment */}
            <path
              d="M50 14C40 14 36 28 38 46C40 56 46 64 50 68C54 64 60 56 62 46C64 28 60 14 50 14Z"
              fill="url(#balloon-segment3)"
            />

            {/* Specular Highlight */}
            <ellipse cx="44" cy="22" rx="8" ry="3.5" fill="#FFFFFF" opacity="0.6" />

            {/* Kawaii Face on Center Segment */}
            <circle cx="47" cy="42" r="2" fill="#78350F" />
            <circle cx="53" cy="42" r="2" fill="#78350F" />
            <path d="M48 46C49.5 48 51.5 48 53 46" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="43" cy="46" r="2" fill="#FB7185" opacity="0.55" />
            <circle cx="57" cy="46" r="2" fill="#FB7185" opacity="0.55" />

            {/* Suspension Ropes */}
            <line x1="42" y1="68" x2="44" y2="78" stroke="#78350F" strokeWidth="1.4" />
            <line x1="58" y1="68" x2="56" y2="78" stroke="#78350F" strokeWidth="1.4" />

            {/* Bunting Garland */}
            <path d="M38 52Q50 56 62 52" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="2 2" />

            {/* Wicker Basket */}
            <rect x="42" y="78" width="16" height="12" rx="3" fill="url(#basket-grad)" />
            <line x1="42" y1="84" x2="58" y2="84" stroke="#78350F" strokeWidth="1" opacity="0.5" />

            {/* Fluffy Clouds Around Basket */}
            <circle cx="28" cy="86" r="8" fill="#FFFFFF" opacity="0.9" />
            <circle cx="38" cy="88" r="6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="68" cy="88" r="7" fill="#FFFFFF" opacity="0.9" />
            <circle cx="78" cy="86" r="9" fill="#FFFFFF" opacity="0.9" />
          </g>
        </svg>
      );

    // 26 — SIRÈNE PASTEL (Pastel Mermaid)
    case 'mermaid':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="m-hair" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <radialGradient id="m-skin" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF1F2" />
              <stop offset="70%" stopColor="#FFE4E6" />
              <stop offset="100%" stopColor="#FECDD3" />
            </radialGradient>
            <linearGradient id="m-tail" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="50%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
            <filter id="m-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#4C1D95" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#m-shadow)">
            {/* Flowing Mermaid Tail */}
            <path
              d="M48 60C50 68 56 74 65 72C73 70 76 60 74 54C71 58 64 62 58 58L48 60Z"
              fill="url(#m-tail)"
            />
            {/* Tail Fins / Flukes */}
            <path
              d="M74 54C80 48 88 47 90 52C91 58 84 61 78 60C85 64 87 71 82 74C76 77 72 68 74 54Z"
              fill="#2DD4BF"
            />
            <path d="M76 56C82 52 86 51 88 53" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

            {/* Lush Pastel Hair (Back Layer) */}
            <path
              d="M26 34C20 44 22 62 30 70C36 76 44 78 40 68C36 60 32 46 36 34Z"
              fill="url(#m-hair)"
            />

            {/* Torso & Head */}
            <ellipse cx="46" cy="52" rx="7" ry="10" fill="url(#m-skin)" />
            <circle cx="46" cy="34" r="13" fill="url(#m-skin)" />

            {/* Seashell Top */}
            <path d="M41 50C43 47 47 47 48 50C47 52 42 52 41 50Z" fill="#F472B6" />
            <path d="M48 50C50 47 54 47 55 50C54 52 49 52 48 50Z" fill="#F472B6" />
            <circle cx="48" cy="50" r="1.2" fill="#FFFFFF" />

            {/* Flowing Bangs & Hair (Front) */}
            <path
              d="M33 30C35 22 42 18 53 18C62 18 64 25 61 32C56 26 48 24 38 27C34 28 33 30 33 30Z"
              fill="url(#m-hair)"
            />
            <ellipse cx="50" cy="22" rx="6" ry="2" fill="#FFFFFF" opacity="0.55" transform="rotate(-10 50 22)" />

            {/* Starfish Hairclip */}
            <path
              d="M58 24L60 27L63 26L61 29L63 32L60 31L58 34L58 30L55 29L58 27Z"
              fill="#FDE047"
            />
            <circle cx="59" cy="29" r="0.8" fill="#FFFFFF" />

            {/* Kawaii Face */}
            <circle cx="43" cy="34" r="2" fill="#4C1D95" />
            <circle cx="43.6" cy="33.4" r="0.7" fill="#FFFFFF" />
            <circle cx="50" cy="34" r="2" fill="#4C1D95" />
            <circle cx="50.6" cy="33.4" r="0.7" fill="#FFFFFF" />
            <path d="M45.5 38C46.5 39.5 48 39.5 49 38" stroke="#E11D48" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="39" cy="37" r="2.2" fill="#FB7185" opacity="0.5" />
            <circle cx="54" cy="37" r="2.2" fill="#FB7185" opacity="0.5" />

            {/* Floating Water Bubbles */}
            <circle cx="22" cy="24" r="3" fill="#67E8F9" opacity="0.6" />
            <circle cx="21" cy="23" r="1" fill="#FFFFFF" />
            <circle cx="26" cy="16" r="2" fill="#67E8F9" opacity="0.5" />
            <circle cx="68" cy="38" r="2.5" fill="#67E8F9" opacity="0.6" />
          </g>
        </svg>
      );

    // 27 — LUNE SOURIANTE ÉTOILÉE (Smiling Moon & Stars)
    case 'moon':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="moon-grad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="cloud-moon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <filter id="moon-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#B45309" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#moon-shadow)">
            {/* Glowing Crescent Moon */}
            <path
              d="M56 16C40 16 26 28 26 48C26 68 42 82 60 82C66 82 72 80 77 77C63 76 52 64 52 48C52 33 62 21 75 18C69 16 63 16 56 16Z"
              fill="url(#moon-grad)"
            />

            {/* Specular Moon Highlight */}
            <path
              d="M36 32C32 40 32 54 38 64"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Sleeping Kawaii Face on Crescent */}
            {/* Eye 1 */}
            <path d="M38 46C40 49 43 49 45 46" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Eye 2 */}
            <path d="M47 44C49 47 52 47 54 44" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Sweet Smile */}
            <path d="M43 53C45 55 48 55 50 53" stroke="#B45309" strokeWidth="1.6" strokeLinecap="round" />
            {/* Rosy Cheeks */}
            <circle cx="39" cy="52" r="2.5" fill="#FB7185" opacity="0.6" />
            <circle cx="53" cy="50" r="2.5" fill="#FB7185" opacity="0.6" />

            {/* Dangling Golden Star on Ribbon */}
            <path d="M68 18C70 26 71 34 72 40" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
            <path
              d="M72 38L74 42L79 43L75 46L76 51L72 48L68 51L69 46L65 43L70 42Z"
              fill="#FDE047"
            />
            <circle cx="72" cy="44" r="1" fill="#FFFFFF" />

            {/* Fluffy Sleeping Cloud Pillow */}
            <path
              d="M24 76C24 70 30 65 37 66C40 60 48 58 54 62C58 59 65 60 67 66C74 66 78 71 77 77C76 83 70 85 64 85H32C26 85 24 81 24 76Z"
              fill="url(#cloud-moon)"
            />

            {/* Sparkling Magic Stars */}
            <path d="M20 28L21 24L23 28L27 29L23 30L21 34L20 30L16 29Z" fill="#FDE047" />
            <path d="M78 68L79 65L81 68L84 69L81 70L79 73L78 70L75 69Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 28 — CACTUS SOURIANT (Smiling Cactus)
    case 'cactus':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cactus-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="pot-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="40%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <filter id="cactus-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#064E3B" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#cactus-shadow)">
            {/* Terracotta Plant Pot */}
            <path d="M34 68L38 88H62L66 68H34Z" fill="url(#pot-grad)" />
            <rect x="31" y="64" width="38" height="6" rx="3" fill="#FB923C" />
            <line x1="33" y1="67" x2="67" y2="67" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.6" />
            {/* Soil */}
            <ellipse cx="50" cy="65" rx="16" ry="2.5" fill="#78350F" />

            {/* Left Arm */}
            <path
              d="M38 48H28C24 48 22 42 22 36C22 32 26 32 28 36C28 42 30 42 38 42"
              stroke="url(#cactus-body)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Arm */}
            <path
              d="M62 44H72C76 44 78 38 78 32C78 28 74 28 72 32C72 38 70 38 62 38"
              stroke="url(#cactus-body)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Main Chubby Cactus Body */}
            <rect x="38" y="24" width="24" height="42" rx="12" fill="url(#cactus-body)" />

            {/* Specular Highlight */}
            <path d="M43 28C41 34 41 48 42 56" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />

            {/* Blooming Pink Flower on Top */}
            <circle cx="50" cy="20" r="5" fill="#F43F5E" />
            <circle cx="45" cy="19" r="4" fill="#FB7185" />
            <circle cx="55" cy="19" r="4" fill="#FB7185" />
            <circle cx="50" cy="16" r="4" fill="#FB7185" />
            <circle cx="50" cy="19" r="2.5" fill="#FDE047" />

            {/* Soft White Needles (V-dots) */}
            <path d="M42 34L40 32M42 35L40 37" stroke="#ECFDF5" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M58 32L60 30M58 33L60 35" stroke="#ECFDF5" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M57 52L59 50M57 53L59 55" stroke="#ECFDF5" strokeWidth="1.3" strokeLinecap="round" />

            {/* Kawaii Face */}
            <circle cx="45" cy="44" r="2.2" fill="#064E3B" />
            <circle cx="45.6" cy="43.2" r="0.8" fill="#FFFFFF" />
            <circle cx="55" cy="44" r="2.2" fill="#064E3B" />
            <circle cx="55.6" cy="43.2" r="0.8" fill="#FFFFFF" />
            <path d="M47 48C48.5 51 51.5 51 53 48" stroke="#064E3B" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="41" cy="47" r="2.2" fill="#FB7185" opacity="0.65" />
            <circle cx="59" cy="47" r="2.2" fill="#FB7185" opacity="0.65" />
          </g>
        </svg>
      );

    // 29 — DONUT GLACÉ MIGNON (Sweet Glazed Donut)
    case 'donut':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="donut-dough" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            <radialGradient id="donut-glaze" cx="45%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="40%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </radialGradient>
            <filter id="donut-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#831843" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#donut-shadow)">
            {/* Golden Baked Dough Ring */}
            <circle cx="50" cy="50" r="35" fill="url(#donut-dough)" />

            {/* Wavy Dripping Strawberry Glaze */}
            <path
              d="M50 17C67 17 81 29 82 46C83 54 80 58 78 57C75 56 73 63 69 66C65 69 62 65 59 68C56 71 52 76 46 75C41 74 41 68 37 69C33 70 30 76 25 72C20 68 23 61 20 57C17 53 17 40 24 28C31 17 41 17 50 17Z"
              fill="url(#donut-glaze)"
            />

            {/* Specular Highlight on Glaze */}
            <path
              d="M32 28C40 22 56 22 66 27"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Donut Hole */}
            <circle cx="50" cy="48" r="11" fill="#FFFFFF" />
            <circle cx="50" cy="48" r="11" fill="#B45309" opacity="0.18" />

            {/* Kawaii Face on Lower Glaze */}
            <circle cx="43" cy="58" r="2" fill="#831843" />
            <circle cx="43.6" cy="57.4" r="0.7" fill="#FFFFFF" />
            <circle cx="57" cy="58" r="2" fill="#831843" />
            <circle cx="57.6" cy="57.4" r="0.7" fill="#FFFFFF" />
            <path d="M47 62C48.5 64 51.5 64 53 62" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="39" cy="60" r="2" fill="#F43F5E" opacity="0.6" />
            <circle cx="61" cy="60" r="2" fill="#F43F5E" opacity="0.6" />

            {/* Colorful Sprinkles */}
            {/* Yellow */}
            <rect x="36" y="24" width="2" height="6" rx="1" fill="#FEF08A" transform="rotate(30 36 24)" />
            <rect x="68" y="44" width="2" height="6" rx="1" fill="#FEF08A" transform="rotate(-40 68 44)" />
            {/* Mint Blue */}
            <rect x="58" y="23" width="2" height="6" rx="1" fill="#67E8F9" transform="rotate(-20 58 23)" />
            <rect x="25" y="46" width="2" height="6" rx="1" fill="#67E8F9" transform="rotate(45 25 46)" />
            {/* White */}
            <rect x="47" y="22" width="2" height="6" rx="1" fill="#FFFFFF" transform="rotate(15 47 22)" />
            <rect x="72" y="32" width="2" height="6" rx="1" fill="#FFFFFF" transform="rotate(-60 72 32)" />
            {/* Lavender */}
            <rect x="28" y="36" width="2" height="6" rx="1" fill="#DDD6FE" transform="rotate(70 28 36)" />
          </g>
        </svg>
      );

    // 30 — MANCHOT KAWAII (Kawaii Penguin)
    case 'penguin':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="peng-body" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
            <radialGradient id="peng-belly" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </radialGradient>
            <filter id="peng-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#peng-shadow)">
            {/* Tiny Webbed Feet */}
            <ellipse cx="40" cy="85" rx="7" ry="4" fill="#F59E0B" />
            <ellipse cx="60" cy="85" rx="7" ry="4" fill="#F59E0B" />

            {/* Little Flippers */}
            {/* Left Flipper */}
            <ellipse cx="23" cy="54" rx="6" ry="14" fill="#1E293B" transform="rotate(25 23 54)" />
            {/* Right Flipper */}
            <ellipse cx="77" cy="54" rx="6" ry="14" fill="#1E293B" transform="rotate(-25 77 54)" />

            {/* Chubby Pear Body */}
            <ellipse cx="50" cy="52" rx="28" ry="32" fill="url(#peng-body)" />

            {/* Soft White Heart/Oval Belly */}
            <ellipse cx="50" cy="57" rx="20" ry="24" fill="url(#peng-belly)" />

            {/* Specular Head Highlight */}
            <ellipse cx="42" cy="28" rx="8" ry="3" fill="#38BDF8" opacity="0.6" transform="rotate(-15 42 28)" />

            {/* Striped Cozy Winter Scarf */}
            <path
              d="M32 50C38 54 62 54 68 50C70 55 64 58 50 58C36 58 30 55 32 50Z"
              fill="#14B8A6"
            />
            {/* Scarf Dangling Tail */}
            <path d="M56 54L58 72H66L63 54Z" fill="#F43F5E" />
            <line x1="57" y1="60" x2="65" y2="60" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="57.5" y1="66" x2="65.5" y2="66" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Kawaii Face */}
            <circle cx="41" cy="40" r="3.2" fill="#0F172A" />
            <circle cx="42" cy="39" r="1.3" fill="#FFFFFF" />
            <circle cx="39.8" cy="41.5" r="0.6" fill="#FFFFFF" />

            <circle cx="59" cy="40" r="3.2" fill="#0F172A" />
            <circle cx="60" cy="39" r="1.3" fill="#FFFFFF" />
            <circle cx="57.8" cy="41.5" r="0.6" fill="#FFFFFF" />

            {/* Orange Little Beak */}
            <path d="M46 44C48 42 52 42 54 44L50 49Z" fill="#F59E0B" />
            <circle cx="50" cy="44" r="0.8" fill="#FEF08A" />

            {/* Rosy Cheeks */}
            <circle cx="34" cy="44" r="3" fill="#FB7185" opacity="0.65" />
            <circle cx="66" cy="44" r="3" fill="#FB7185" opacity="0.65" />
          </g>
        </svg>
      );

    // 31 — HÉRISSON KAWAII (Kawaii Hedgehog)
    case 'hedgehog':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="hedge-spines" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="50%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
            <radialGradient id="hedge-face" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF7ED" />
              <stop offset="60%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </radialGradient>
            <filter id="hedge-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#451A03" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#hedge-shadow)">
            {/* Spiky Spines Silhouette (Fluffy scalloped fan) */}
            <path
              d="M50 16C36 16 22 28 20 44C18 56 22 68 30 76C36 82 64 82 72 76C80 68 82 54 80 42C78 26 64 16 50 16Z"
              fill="url(#hedge-spines)"
            />
            {/* Outer Rounded Spines Accents */}
            <circle cx="28" cy="24" r="4" fill="#92400E" />
            <circle cx="38" cy="18" r="4" fill="#92400E" />
            <circle cx="50" cy="15" r="4" fill="#92400E" />
            <circle cx="62" cy="18" r="4" fill="#92400E" />
            <circle cx="72" cy="24" r="4" fill="#92400E" />
            <circle cx="80" cy="34" r="4" fill="#92400E" />
            <circle cx="82" cy="46" r="4" fill="#92400E" />
            <circle cx="20" cy="36" r="4" fill="#92400E" />
            <circle cx="18" cy="48" r="4" fill="#92400E" />

            {/* Cute Peach Face & Belly */}
            <path
              d="M32 50C32 38 40 32 50 32C60 32 68 38 68 50C68 64 62 74 50 74C38 74 32 64 32 50Z"
              fill="url(#hedge-face)"
            />

            {/* Little Round Ears */}
            <circle cx="33" cy="38" r="4.5" fill="#FED7AA" />
            <circle cx="33" cy="38" r="2.5" fill="#F472B6" />
            <circle cx="67" cy="38" r="4.5" fill="#FED7AA" />
            <circle cx="67" cy="38" r="2.5" fill="#F472B6" />

            {/* Kawaii Face */}
            <circle cx="43" cy="46" r="2.8" fill="#451A03" />
            <circle cx="43.8" cy="45.2" r="1" fill="#FFFFFF" />
            <circle cx="57" cy="46" r="2.8" fill="#451A03" />
            <circle cx="57.8" cy="45.2" r="1" fill="#FFFFFF" />

            {/* Shiny Button Nose */}
            <ellipse cx="50" cy="51" rx="2.5" ry="1.8" fill="#1C1917" />
            <circle cx="49.5" cy="50.4" r="0.7" fill="#FFFFFF" />

            {/* Joyful Smile */}
            <path d="M47 54C48.5 56.5 51.5 56.5 53 54" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="38" cy="51" r="2.5" fill="#FB7185" opacity="0.6" />
            <circle cx="62" cy="51" r="2.5" fill="#FB7185" opacity="0.6" />

            {/* Tiny Paws Holding a Red Strawberry */}
            <path d="M46 64C46 61 54 61 54 64C54 69 50 71 50 71C50 71 46 69 46 64Z" fill="#EF4444" />
            <path d="M48 61L50 59L52 61" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
            {/* Paws */}
            <circle cx="44" cy="65" r="2.5" fill="#FED7AA" />
            <circle cx="56" cy="65" r="2.5" fill="#FED7AA" />
          </g>
        </svg>
      );

    // 32 — CHAMPIGNON MAGIQUE SOURIANT (Magic Mushroom)
    case 'mushroom':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="mush-cap" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="45%" stopColor="#F43F5E" />
              <stop offset="85%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>
            <linearGradient id="mush-stem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <filter id="mush-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#881337" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#mush-shadow)">
            {/* Chubby Cream Stalk */}
            <path
              d="M38 48C38 48 34 76 36 82C38 86 62 86 64 82C66 76 62 48 62 48Z"
              fill="url(#mush-stem)"
            />

            {/* Specular Stem Sheen */}
            <path d="M42 54C41 62 41 72 43 78" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

            {/* Kawaii Face on Stem */}
            <circle cx="45" cy="62" r="2.5" fill="#881337" />
            <circle cx="45.7" cy="61.2" r="0.9" fill="#FFFFFF" />
            <circle cx="55" cy="62" r="2.5" fill="#881337" />
            <circle cx="55.7" cy="61.2" r="0.9" fill="#FFFFFF" />
            <path d="M47 67C48.5 70 51.5 70 53 67" stroke="#881337" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="40" cy="65" r="2.5" fill="#FB7185" opacity="0.6" />
            <circle cx="60" cy="65" r="2.5" fill="#FB7185" opacity="0.6" />

            {/* Plump Toadstool Cap */}
            <path
              d="M18 48C18 28 32 16 50 16C68 16 82 28 82 48C82 52 76 54 50 54C24 54 18 52 18 48Z"
              fill="url(#mush-cap)"
            />

            {/* Specular Cap Arc */}
            <path
              d="M30 26C38 20 54 20 64 26"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Big Glossy Polka Dots */}
            <circle cx="34" cy="34" r="6" fill="#FFFFFF" opacity="0.95" />
            <circle cx="50" cy="27" r="7.5" fill="#FFFFFF" opacity="0.95" />
            <circle cx="66" cy="35" r="5.5" fill="#FFFFFF" opacity="0.95" />
            <circle cx="25" cy="45" r="3.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="75" cy="46" r="3.5" fill="#FFFFFF" opacity="0.9" />

            {/* Floating Golden Magic Sparkles */}
            <path d="M14 30L15 26L17 30L21 31L17 32L15 36L14 32L10 31Z" fill="#FDE047" />
            <path d="M84 24L85 20L87 24L91 25L87 26L85 30L84 26L80 25Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 33 — POISSON TROPICAL MIGNON (Cute Tropical Fish)
    case 'tropical_fish':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="fish-body" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
            <linearGradient id="fish-coral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <linearGradient id="fish-fin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="60%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
            <filter id="fish-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#9A3412" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#fish-shadow)">
            {/* Wavy Tail Fin */}
            <path
              d="M32 50C20 38 12 36 10 44C8 50 14 52 14 50C14 48 8 56 10 60C12 66 20 62 32 50Z"
              fill="url(#fish-fin)"
            />
            {/* Dorsal Top Fin */}
            <path
              d="M42 30C46 18 58 18 64 28C56 26 48 26 42 30Z"
              fill="url(#fish-fin)"
            />
            {/* Pectoral Side Fin */}
            <path
              d="M44 54C40 60 42 66 48 64C50 62 50 56 44 54Z"
              fill="url(#fish-fin)"
            />

            {/* Plump Round Fish Body */}
            <ellipse cx="52" cy="50" rx="26" ry="22" fill="url(#fish-body)" />

            {/* Coral Tropical Stripes */}
            <path
              d="M46 30C50 38 50 62 46 70C42 66 42 34 46 30Z"
              fill="url(#fish-coral)"
            />
            <path
              d="M36 34C40 42 40 58 36 66C33 62 33 38 36 34Z"
              fill="url(#fish-coral)"
            />

            {/* Specular Sheen */}
            <path d="M46 34C54 30 64 32 70 38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

            {/* Cute Cartoon Eye */}
            <circle cx="66" cy="45" r="5" fill="#FFFFFF" />
            <circle cx="67" cy="45" r="3.2" fill="#0F172A" />
            <circle cx="68" cy="44" r="1.2" fill="#FFFFFF" />
            <circle cx="66" cy="46.5" r="0.6" fill="#FFFFFF" />

            {/* Little Pursed Fish Lips */}
            <path d="M78 48C81 47 82 51 78 52" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" />

            {/* Blushing Cheek */}
            <circle cx="58" cy="53" r="2.8" fill="#F43F5E" opacity="0.6" />

            {/* Rising Bubbles */}
            <circle cx="84" cy="40" r="2.5" fill="#67E8F9" opacity="0.75" />
            <circle cx="83.5" cy="39.2" r="0.8" fill="#FFFFFF" />
            <circle cx="88" cy="30" r="3.5" fill="#67E8F9" opacity="0.6" />
            <circle cx="87" cy="29" r="1.1" fill="#FFFFFF" />
          </g>
        </svg>
      );

    // 34 — PALETTE D'ARTISTE KAWAII (Kawaii Art Palette)
    case 'art_palette':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pal-wood" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            <linearGradient id="brush-handle" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <filter id="pal-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#78350F" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#pal-shadow)">
            {/* Wooden Kidney Palette Body */}
            <path
              d="M48 18C68 18 84 30 84 50C84 68 70 80 52 80C40 80 34 74 30 70C24 64 26 56 22 52C16 46 16 34 26 24C32 18 40 18 48 18Z"
              fill="url(#pal-wood)"
            />

            {/* Specular Highlight along Rim */}
            <path
              d="M32 24C42 20 62 20 74 28"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Thumb Hole */}
            <ellipse cx="68" cy="62" rx="5" ry="6" fill="#FFFFFF" />
            <ellipse cx="68" cy="62" rx="5" ry="6" fill="#78350F" opacity="0.2" />

            {/* 3D Colorful Paint Blobs */}
            {/* Turquoise */}
            <circle cx="34" cy="30" r="4.5" fill="#06B6D4" />
            <circle cx="33" cy="29" r="1.4" fill="#FFFFFF" />
            {/* Pink */}
            <circle cx="48" cy="25" r="4.5" fill="#EC4899" />
            <circle cx="47" cy="24" r="1.4" fill="#FFFFFF" />
            {/* Yellow */}
            <circle cx="62" cy="27" r="4.5" fill="#FACC15" />
            <circle cx="61" cy="26" r="1.4" fill="#FFFFFF" />
            {/* Purple */}
            <circle cx="74" cy="38" r="4.5" fill="#A855F7" />
            <circle cx="73" cy="37" r="1.4" fill="#FFFFFF" />
            {/* Lime */}
            <circle cx="26" cy="42" r="4.5" fill="#84CC16" />
            <circle cx="25" cy="41" r="1.4" fill="#FFFFFF" />

            {/* Artist Paintbrush crossing bottom left */}
            <line x1="20" y1="84" x2="48" y2="44" stroke="url(#brush-handle)" strokeWidth="4" strokeLinecap="round" />
            {/* Ferrule */}
            <line x1="45" y1="48" x2="50" y2="41" stroke="#E2E8F0" strokeWidth="4.5" strokeLinecap="round" />
            {/* Bristles Dipped in Rainbow */}
            <path d="M50 41C54 36 58 37 56 42C54 44 51 44 50 41Z" fill="#F43F5E" />

            {/* Kawaii Face on Center of Palette */}
            <circle cx="44" cy="50" r="2.2" fill="#78350F" />
            <circle cx="44.6" cy="49.3" r="0.7" fill="#FFFFFF" />
            <circle cx="56" cy="50" r="2.2" fill="#78350F" />
            <circle cx="56.6" cy="49.3" r="0.7" fill="#FFFFFF" />
            <path d="M48 54C49.5 56.5 52.5 56.5 54 54" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="39" cy="53" r="2.2" fill="#FB7185" opacity="0.6" />
            <circle cx="61" cy="53" r="2.2" fill="#FB7185" opacity="0.6" />

            {/* Sparkles */}
            <path d="M58 36L59 33L61 36L64 37L61 38L59 41L58 38L55 37Z" fill="#FDE047" />
          </g>
        </svg>
      );

    // 35 — LAPIN PASTEL (Pastel Bunny)
    case 'bunny':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bunny-fur" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#FFF1F2" />
              <stop offset="100%" stopColor="#FECDD3" />
            </radialGradient>
            <linearGradient id="bunny-ear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="60%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
            <filter id="bunny-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#9F1239" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#bunny-shadow)">
            {/* Left Ear (Tall) */}
            <ellipse cx="38" cy="28" rx="7" ry="18" fill="url(#bunny-fur)" transform="rotate(-10 38 28)" />
            <ellipse cx="38" cy="28" rx="4" ry="13" fill="url(#bunny-ear)" transform="rotate(-10 38 28)" />

            {/* Right Ear (Slightly Floppy Cute Tip) */}
            <path
              d="M58 40C58 24 64 12 72 14C78 16 76 28 72 32L64 42Z"
              fill="url(#bunny-fur)"
            />
            <path
              d="M60 38C60 27 64 18 69 20C73 22 71 30 67 34L62 40Z"
              fill="url(#bunny-ear)"
            />

            {/* Fluffy Round Head */}
            <circle cx="50" cy="58" r="26" fill="url(#bunny-fur)" />

            {/* Specular Forehead Sheen */}
            <ellipse cx="44" cy="42" rx="8" ry="3" fill="#FFFFFF" opacity="0.75" transform="rotate(-10 44 42)" />

            {/* Cute Yellow Flower near Left Ear */}
            <circle cx="34" cy="42" r="3.5" fill="#FDE047" />
            <circle cx="34" cy="42" r="1.5" fill="#F59E0B" />

            {/* Kawaii Face */}
            <circle cx="41" cy="56" r="3.2" fill="#4C0519" />
            <circle cx="42.2" cy="54.8" r="1.3" fill="#FFFFFF" />
            <circle cx="40" cy="57.5" r="0.6" fill="#FFFFFF" />

            <circle cx="59" cy="56" r="3.2" fill="#4C0519" />
            <circle cx="60.2" cy="54.8" r="1.3" fill="#FFFFFF" />
            <circle cx="58" cy="57.5" r="0.6" fill="#FFFFFF" />

            {/* Soft Pink Nose */}
            <polygon points="48,63 52,63 50,65.5" fill="#F43F5E" />

            {/* Cute Mouth */}
            <path d="M47 66C48.5 68 50 67 50 65.5C50 67 51.5 68 53 66" stroke="#4C0519" strokeWidth="1.3" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="33" cy="62" r="3.5" fill="#FB7185" opacity="0.55" />
            <circle cx="67" cy="62" r="3.5" fill="#FB7185" opacity="0.55" />

            {/* Whiskers */}
            <line x1="26" y1="59" x2="31" y2="60" stroke="#FECDD3" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="26" y1="64" x2="31" y2="63" stroke="#FECDD3" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="74" y1="59" x2="69" y2="60" stroke="#FECDD3" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="74" y1="64" x2="69" y2="63" stroke="#FECDD3" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      // Fallback cute sparkle
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="#EC4899" opacity="0.2" />
          <path d="M50 20L58 42L80 50L58 58L50 80L42 58L20 50L42 42L50 20Z" fill="#EC4899" />
        </svg>
      );
  }
};
