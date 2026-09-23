import React from 'react';

interface IllustrationProps {
  id: string;
  themeColor?: string;
  className?: string;
}

export const StoryIllustration: React.FC<IllustrationProps> = ({
  id,
  themeColor = '#059669',
  className = 'w-full h-full object-cover',
}) => {
  // 1. FORÊT MAGIQUE
  if (id.startsWith('forest_')) {
    if (id === 'forest_cover') {
      return (
        <svg viewBox="0 0 600 500" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <radialGradient id="magicGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#a7f3d0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="500" fill="url(#forestSky)" />
          <circle cx="300" cy="200" r="160" fill="url(#magicGlow)" />
          {/* Background enchanted trees */}
          <path d="M50 500 L120 180 L190 500 Z" fill="#065f46" opacity="0.6" />
          <path d="M410 500 L480 160 L550 500 Z" fill="#065f46" opacity="0.6" />
          <path d="M140 500 L210 220 L280 500 Z" fill="#047857" opacity="0.7" />
          <path d="M320 500 L390 200 L460 500 Z" fill="#047857" opacity="0.7" />
          {/* Great central ancient magical tree */}
          <path d="M260 500 Q270 320 230 260 Q180 230 160 160 Q200 130 260 180 Q300 100 360 140 Q410 120 440 180 Q400 230 350 260 Q320 320 340 500 Z" fill="#022c22" />
          {/* Glowing stardust foliage */}
          <circle cx="230" cy="180" r="50" fill="#34d399" opacity="0.7" />
          <circle cx="360" cy="170" r="60" fill="#6ee7b7" opacity="0.7" />
          <circle cx="300" cy="130" r="55" fill="#a7f3d0" opacity="0.8" />
          {/* Twinkling star motes */}
          <circle cx="180" cy="120" r="4" fill="#fef08a" />
          <circle cx="420" cy="110" r="3.5" fill="#fde047" />
          <circle cx="290" cy="90" r="5" fill="#fff" />
          <circle cx="340" cy="220" r="3" fill="#fef08a" />
          <circle cx="160" cy="250" r="4" fill="#a7f3d0" />
          <circle cx="450" cy="260" r="4" fill="#fef08a" />
          {/* Mossy foreground rolling hills */}
          <path d="M0 430 Q150 370 300 420 Q450 470 600 400 L600 500 L0 500 Z" fill="#047857" />
          <path d="M0 460 Q200 420 400 460 Q500 480 600 450 L600 500 L0 500 Z" fill="#064e3b" />
          {/* Friendly forest animal (Barnaby the little rabbit/fox) */}
          <g transform="translate(260, 360)">
            <ellipse cx="40" cy="55" rx="22" ry="26" fill="#f97316" />
            <circle cx="40" cy="30" r="18" fill="#fb923c" />
            <ellipse cx="32" cy="12" rx="5" ry="14" fill="#ea580c" />
            <ellipse cx="48" cy="12" rx="5" ry="14" fill="#ea580c" />
            <circle cx="35" cy="28" r="2.5" fill="#1e293b" />
            <circle cx="45" cy="28" r="2.5" fill="#1e293b" />
            <ellipse cx="40" cy="34" rx="3" ry="2" fill="#7c2d12" />
            <ellipse cx="40" cy="62" rx="14" ry="16" fill="#fff7ed" />
          </g>
          {/* Little glowing key & lantern */}
          <circle cx="370" cy="400" r="12" fill="#fef08a" opacity="0.9" />
          <path d="M370 395 L370 415 M367 400 L373 400" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    // General Forest Scenes
    return (
      <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="forestPageGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#forestPageGrad)" />
        <path d="M-20 400 Q140 280 320 330 Q480 370 620 310 L620 400 Z" fill="#a7f3d0" />
        <path d="M-20 400 Q180 330 380 370 Q500 390 620 360 L620 400 Z" fill="#6ee7b7" />
        {/* Playful trees */}
        <g transform="translate(80, 140)">
          <rect x="35" y="80" width="16" height="90" fill="#78350f" rx="6" />
          <circle cx="43" cy="70" r="50" fill="#10b981" />
          <circle cx="30" cy="50" r="38" fill="#34d399" />
          <circle cx="60" cy="60" r="35" fill="#059669" />
        </g>
        <g transform="translate(420, 120)">
          <rect x="40" y="90" width="18" height="100" fill="#78350f" rx="6" />
          <circle cx="50" cy="70" r="60" fill="#059669" />
          <circle cx="35" cy="50" r="45" fill="#10b981" />
          <circle cx="70" cy="60" r="40" fill="#34d399" />
        </g>
        {/* Magic Brook */}
        <path d="M120 400 C200 360 280 370 360 350 C440 330 520 340 600 320 L600 350 C520 370 440 360 360 380 C280 400 200 390 120 400 Z" fill="#38bdf8" opacity="0.7" />
        {/* Characters in scene */}
        <g transform="translate(240, 240)">
          {/* Protagonist child figure (friendly silhouette/chibi style) */}
          <circle cx="50" cy="30" r="18" fill="#fde047" />
          <rect x="35" y="48" width="30" height="38" fill="#ec4899" rx="8" />
          <ellipse cx="50" cy="28" rx="14" ry="14" fill="#fed7aa" />
          <circle cx="45" cy="26" r="2" fill="#374151" />
          <circle cx="55" cy="26" r="2" fill="#374151" />
          <path d="M46 32 Q50 36 54 32" stroke="#ea580c" strokeWidth="1.5" fill="none" />
          {/* Little animal companion */}
          <circle cx="95" cy="65" r="12" fill="#fb923c" />
          <ellipse cx="91" cy="50" rx="3" ry="8" fill="#ea580c" />
          <ellipse cx="99" cy="50" rx="3" ry="8" fill="#ea580c" />
          <circle cx="95" cy="65" r="1.5" fill="#1e293b" />
        </g>
        {/* Magical stardust */}
        <circle cx="210" cy="180" r="3" fill="#f59e0b" />
        <circle cx="380" cy="190" r="4" fill="#10b981" />
        <circle cx="300" cy="160" r="3.5" fill="#ec4899" />
        <circle cx="270" cy="130" r="5" fill="#fbbf24" />
      </svg>
    );
  }

  // 2. ESPACE & COSMOS
  if (id.startsWith('space_')) {
    if (id === 'space_cover') {
      return (
        <svg viewBox="0 0 600 500" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="spaceSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <radialGradient id="nebula" cx="60%" cy="35%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="500" fill="url(#spaceSky)" />
          <rect width="600" height="500" fill="url(#nebula)" />
          {/* Ringed Dream Planet */}
          <g transform="translate(380, 160)">
            <circle cx="0" cy="0" r="70" fill="#f59e0b" />
            <circle cx="-15" cy="-10" r="60" fill="#fbbf24" />
            {/* Planet Rings */}
            <ellipse cx="0" cy="0" rx="120" ry="25" fill="none" stroke="#fde047" strokeWidth="12" opacity="0.75" transform="rotate(-20)" />
            <ellipse cx="0" cy="0" rx="135" ry="28" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.6" transform="rotate(-20)" />
          </g>
          {/* Smiling Moon */}
          <circle cx="110" cy="100" r="45" fill="#fef08a" />
          <circle cx="125" cy="90" r="38" fill="#0f172a" />
          {/* Constellations */}
          <g stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeDasharray="3 3">
            <line x1="80" y1="220" x2="140" y2="200" />
            <line x1="140" y1="200" x2="190" y2="240" />
            <line x1="190" y1="240" x2="250" y2="210" />
          </g>
          <circle cx="80" cy="220" r="3" fill="#fff" />
          <circle cx="140" cy="200" r="3.5" fill="#fff" />
          <circle cx="190" cy="240" r="3" fill="#fff" />
          <circle cx="250" cy="210" r="4" fill="#fef08a" />
          {/* Hero Spaceship */}
          <g transform="translate(190, 270) rotate(-15)">
            {/* Rocket flames */}
            <path d="M-20 60 L-35 90 L-10 75 L0 100 L10 75 L35 90 L20 60 Z" fill="#ef4444" />
            <path d="M-10 60 L-20 80 L0 70 L20 80 L10 60 Z" fill="#f59e0b" />
            {/* Rocket Body */}
            <ellipse cx="0" cy="15" rx="36" ry="60" fill="#f8fafc" />
            <path d="M0 -45 L25 10 L-25 10 Z" fill="#3b82f6" />
            {/* Wings */}
            <path d="M-36 20 L-65 55 L-30 48 Z" fill="#ef4444" />
            <path d="M36 20 L65 55 L30 48 Z" fill="#ef4444" />
            {/* Porthole window */}
            <circle cx="0" cy="5" r="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
            {/* Smiling astronaut face inside */}
            <circle cx="0" cy="5" r="10" fill="#fed7aa" />
            <circle cx="-3" cy="4" r="1.5" fill="#0f172a" />
            <circle cx="3" cy="4" r="1.5" fill="#0f172a" />
            <path d="M-3 8 Q0 10 3 8" stroke="#ea580c" strokeWidth="1" fill="none" />
          </g>
          {/* Little Beep-Beep scout bot */}
          <g transform="translate(420, 360)">
            <rect x="-18" y="-14" width="36" height="28" rx="8" fill="#06b6d4" />
            <circle cx="-7" cy="-2" r="4" fill="#fef08a" />
            <circle cx="7" cy="-2" r="4" fill="#fef08a" />
            <line x1="0" y1="-14" x2="0" y2="-25" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="0" cy="-26" r="3.5" fill="#ef4444" />
            <rect x="-10" y="14" width="20" height="6" rx="2" fill="#0891b2" />
          </g>
          {/* Twinkles */}
          <circle cx="280" cy="80" r="3" fill="#fff" />
          <circle cx="500" cy="90" r="4" fill="#fde047" />
          <circle cx="520" cy="270" r="2.5" fill="#fff" />
        </svg>
      );
    }
    // General Space Scene
    return (
      <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="spacePageSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#spacePageSky)" />
        {/* Soft cosmic glow */}
        <circle cx="300" cy="180" r="140" fill="#6366f1" opacity="0.25" />
        {/* Floating astronaut child & friendly bot */}
        <g transform="translate(240, 160)">
          {/* Astronaut suit */}
          <ellipse cx="50" cy="50" rx="30" ry="36" fill="#f8fafc" />
          {/* Helmet */}
          <circle cx="50" cy="20" r="24" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="3" />
          <ellipse cx="50" cy="20" rx="17" ry="14" fill="#38bdf8" opacity="0.9" />
          {/* Little reflected star on visor */}
          <circle cx="45" cy="16" r="3" fill="#fff" />
          {/* Chest badge */}
          <circle cx="50" cy="46" r="6" fill="#ef4444" />
        </g>
        {/* Companion robot */}
        <g transform="translate(370, 180)">
          <rect x="0" y="0" width="34" height="28" rx="8" fill="#06b6d4" />
          <circle cx="10" cy="12" r="3.5" fill="#fef08a" />
          <circle cx="24" cy="12" r="3.5" fill="#fef08a" />
          <line x1="17" y1="0" x2="17" y2="-12" stroke="#06b6d4" strokeWidth="2.5" />
          <circle cx="17" cy="-14" r="3" fill="#ec4899" />
        </g>
        {/* Colorful floating crystals */}
        <polygon points="120,240 135,215 150,240 135,265" fill="#a855f7" opacity="0.85" />
        <polygon points="460,110 475,90 490,110 475,130" fill="#38bdf8" opacity="0.85" />
        <polygon points="180,80 195,65 210,80 195,95" fill="#facc15" opacity="0.85" />
        {/* Star clusters */}
        <circle cx="90" cy="120" r="2.5" fill="#fff" />
        <circle cx="520" cy="240" r="3" fill="#fff" />
        <circle cx="340" cy="70" r="2" fill="#fef08a" />
        <circle cx="260" cy="310" r="3" fill="#fef08a" />
      </svg>
    );
  }

  // 3. OCÉAN & LAGON BLEU
  if (id.startsWith('ocean_')) {
    if (id === 'ocean_cover') {
      return (
        <svg viewBox="0 0 600 500" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oceanSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="40%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
            <radialGradient id="waterRays" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="500" fill="url(#oceanSky)" />
          <rect width="600" height="500" fill="url(#waterRays)" />
          {/* Light rays penetrating water */}
          <polygon points="200,0 260,0 340,500 240,500" fill="#fff" opacity="0.12" />
          <polygon points="360,0 420,0 520,500 440,500" fill="#fff" opacity="0.1" />
          {/* Coral Reef bed */}
          <path d="M0 440 Q150 400 300 430 Q450 460 600 420 L600 500 L0 500 Z" fill="#fdba74" />
          {/* Sea fans and pink coral */}
          <g transform="translate(60, 360)">
            <path d="M0 80 Q10 20 30 10 Q50 30 50 80 Z" fill="#f43f5e" opacity="0.8" />
            <path d="M40 80 Q60 10 80 20 Q90 50 90 80 Z" fill="#ec4899" opacity="0.85" />
          </g>
          <g transform="translate(460, 350)">
            <path d="M0 90 Q20 30 40 20 Q60 40 60 90 Z" fill="#a855f7" opacity="0.8" />
            <path d="M50 90 Q70 10 90 30 Q100 60 100 90 Z" fill="#06b6d4" opacity="0.85" />
          </g>
          {/* Playful Dolphin */}
          <g transform="translate(320, 160) rotate(-10)">
            <path d="M0 20 Q60 -20 120 10 Q160 30 180 15 Q170 35 150 45 Q100 65 50 45 Q15 45 0 20 Z" fill="#38bdf8" />
            {/* Dolphin snout & flippers */}
            <path d="M-15 25 Q-5 18 0 20 Q-5 28 -15 25 Z" fill="#38bdf8" />
            <path d="M50 40 Q40 70 65 65 Z" fill="#0284c7" />
            <path d="M80 0 Q95 -25 110 -10 Z" fill="#0284c7" />
            <circle cx="20" cy="24" r="3" fill="#0f172a" />
            <path d="M15 30 Q25 35 35 30" stroke="#0369a1" strokeWidth="1.5" fill="none" />
          </g>
          {/* Nori the baby sea turtle */}
          <g transform="translate(140, 240) rotate(15)">
            {/* Shell */}
            <ellipse cx="40" cy="30" rx="30" ry="24" fill="#10b981" />
            <ellipse cx="40" cy="30" rx="25" ry="19" fill="#34d399" />
            {/* Flippers */}
            <ellipse cx="20" cy="15" rx="16" ry="8" fill="#059669" transform="rotate(-30 20 15)" />
            <ellipse cx="60" cy="15" rx="16" ry="8" fill="#059669" transform="rotate(30 60 15)" />
            <ellipse cx="24" cy="45" rx="10" ry="6" fill="#059669" />
            <ellipse cx="56" cy="45" rx="10" ry="6" fill="#059669" />
            {/* Head */}
            <circle cx="40" cy="5" r="12" fill="#059669" />
            <circle cx="36" cy="3" r="2" fill="#fff" />
            <circle cx="44" cy="3" r="2" fill="#fff" />
          </g>
          {/* Little luminous pearl shell */}
          <g transform="translate(280, 410)">
            <path d="M0 20 Q25 -10 50 20 Z" fill="#fef08a" />
            <circle cx="25" cy="16" r="10" fill="#ffffff" />
            <circle cx="25" cy="16" r="14" fill="#fef08a" opacity="0.4" />
          </g>
          {/* Air bubbles */}
          <circle cx="220" cy="180" r="6" fill="#fff" opacity="0.5" />
          <circle cx="228" cy="140" r="4" fill="#fff" opacity="0.5" />
          <circle cx="440" cy="220" r="8" fill="#fff" opacity="0.4" />
          <circle cx="446" cy="180" r="5" fill="#fff" opacity="0.5" />
        </svg>
      );
    }
    // General Ocean Scene
    return (
      <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="oceanPageSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#oceanPageSky)" />
        {/* Soft underwater scene with fish and corals */}
        <path d="M0 360 Q150 320 300 350 Q450 380 600 340 L600 400 L0 400 Z" fill="#fed7aa" />
        <g transform="translate(180, 160)">
          {/* Swimmer child silhouette with mask and snorkel */}
          <ellipse cx="60" cy="40" rx="35" ry="20" fill="#38bdf8" />
          <circle cx="105" cy="35" r="16" fill="#fed7aa" />
          <ellipse cx="112" cy="34" rx="8" ry="6" fill="#0284c7" />
          <line x1="110" y1="28" x2="114" y2="12" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* Friendly sea turtle */}
        <g transform="translate(340, 200)">
          <ellipse cx="30" cy="20" rx="22" ry="16" fill="#10b981" />
          <circle cx="54" cy="20" r="8" fill="#059669" />
          <circle cx="56" cy="18" r="1.5" fill="#fff" />
        </g>
        {/* School of bright yellow fish */}
        <g fill="#facc15">
          <ellipse cx="120" cy="100" rx="10" ry="6" />
          <ellipse cx="145" cy="115" rx="10" ry="6" />
          <ellipse cx="110" cy="130" rx="10" ry="6" />
        </g>
        {/* Floating bubbles */}
        <circle cx="280" cy="110" r="5" fill="#38bdf8" opacity="0.6" />
        <circle cx="288" cy="80" r="7" fill="#38bdf8" opacity="0.6" />
        <circle cx="480" cy="160" r="6" fill="#38bdf8" opacity="0.5" />
      </svg>
    );
  }

  // 4. DINOSAURE AMI
  if (id.startsWith('dino_')) {
    if (id === 'dino_cover') {
      return (
        <svg viewBox="0 0 600 500" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dinoSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="40%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <rect width="600" height="500" fill="url(#dinoSky)" />
          {/* Distant prehistoric mountains and volcano */}
          <polygon points="120,380 230,220 340,380" fill="#9a3412" opacity="0.7" />
          <polygon points="260,380 390,190 520,380" fill="#7c2d12" opacity="0.8" />
          {/* Giant jungle ferns */}
          <path d="M0 450 Q160 380 320 440 Q480 470 600 420 L600 500 L0 500 Z" fill="#65a30d" />
          <path d="M-20 480 Q200 420 420 480 Q520 500 620 460 L620 500 L-20 500 Z" fill="#4d7c0f" />
          {/* Giant ferns leaves */}
          <g transform="translate(40, 280)">
            <path d="M0 120 Q50 40 100 20 Q60 80 0 120 Z" fill="#84cc16" />
            <path d="M0 120 Q30 20 80 0 Q40 60 0 120 Z" fill="#65a30d" />
          </g>
          {/* Friendly baby Triceratops Tito */}
          <g transform="translate(250, 310)">
            {/* Body */}
            <ellipse cx="60" cy="50" rx="45" ry="32" fill="#84cc16" />
            {/* Tail */}
            <path d="M100 50 Q130 55 140 70 Q115 65 95 60 Z" fill="#65a30d" />
            {/* Little legs */}
            <rect x="35" y="70" width="14" height="24" rx="6" fill="#4d7c0f" />
            <rect x="70" y="70" width="14" height="24" rx="6" fill="#4d7c0f" />
            {/* Frill / Collar */}
            <path d="M15 15 Q-5 25 5 45 Q-15 35 15 55 Q-5 65 30 70 Z" fill="#a3e635" />
            {/* Head */}
            <circle cx="25" cy="40" r="22" fill="#84cc16" />
            {/* Sweet round eye */}
            <circle cx="18" cy="35" r="4.5" fill="#1e293b" />
            <circle cx="16" cy="33" r="1.5" fill="#fff" />
            {/* Little horns */}
            <polygon points="12,24 8,10 18,18" fill="#fef08a" />
            <polygon points="26,18 32,5 34,18" fill="#fef08a" />
            <polygon points="3,36 -8,34 2,42" fill="#fef08a" />
            {/* Smiling beak */}
            <path d="M6 46 Q16 52 24 45" stroke="#365314" strokeWidth="2" fill="none" />
          </g>
        </svg>
      );
    }
    // General Dino Scene
    return (
      <svg viewBox="0 0 600 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dinoPageSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fefce8" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#dinoPageSky)" />
        <path d="M0 340 Q150 290 320 330 Q480 360 600 320 L600 400 L0 400 Z" fill="#bef264" />
        <path d="M0 370 Q180 330 380 370 Q500 390 600 360 L600 400 L0 400 Z" fill="#a3e635" />
        {/* Child playing with baby dino */}
        <g transform="translate(180, 230)">
          {/* Child */}
          <circle cx="30" cy="20" r="16" fill="#fed7aa" />
          <rect x="18" y="36" width="24" height="32" fill="#f97316" rx="6" />
          <circle cx="26" cy="18" r="2" fill="#1e293b" />
          <circle cx="34" cy="18" r="2" fill="#1e293b" />
          <path d="M26 24 Q30 28 34 24" stroke="#c2410c" strokeWidth="1.5" fill="none" />
        </g>
        <g transform="translate(300, 240)">
          {/* Baby Dino Tito */}
          <ellipse cx="40" cy="30" rx="30" ry="20" fill="#84cc16" />
          <circle cx="16" cy="22" r="15" fill="#a3e635" />
          <circle cx="12" cy="18" r="3" fill="#1e293b" />
          <polygon points="6,12 2,4 12,8" fill="#fef08a" />
        </g>
      </svg>
    );
  }

  // 5. ÉTOILE PERDUE (BEDTIME)
  if (id.startsWith('star_')) {
    return (
      <svg viewBox="0 0 600 450" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="starSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
        </defs>
        <rect width="600" height="450" fill="url(#starSky)" />
        {/* Fluffy dreamy clouds */}
        <g fill="#ede9fe" opacity="0.4">
          <circle cx="100" cy="380" r="80" />
          <circle cx="200" cy="360" r="90" />
          <circle cx="340" cy="380" r="100" />
          <circle cx="480" cy="360" r="90" />
        </g>
        {/* Crescent Sleepy Moon */}
        <circle cx="130" cy="120" r="50" fill="#fef08a" />
        <circle cx="150" cy="110" r="45" fill="#1e1b4b" />
        {/* Smiling Stella the little star */}
        <g transform="translate(300, 200)">
          {/* Glowing aura */}
          <circle cx="0" cy="0" r="60" fill="#fef08a" opacity="0.3" />
          {/* 5-pointed star body */}
          <polygon points="0,-45 13,-14 45,-14 20,8 30,40 0,20 -30,40 -20,8 -45,-14 -13,-14" fill="#fde047" stroke="#f59e0b" strokeWidth="3" />
          {/* Smiling face on star */}
          <circle cx="-8" cy="-2" r="3" fill="#1e293b" />
          <circle cx="8" cy="-2" r="3" fill="#1e293b" />
          <circle cx="-12" cy="6" r="4" fill="#fb7185" opacity="0.6" />
          <circle cx="12" cy="6" r="4" fill="#fb7185" opacity="0.6" />
          <path d="M-6 8 Q0 13 6 8" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        {/* Little twinkle sparkles */}
        <circle cx="220" cy="100" r="3" fill="#fff" />
        <circle cx="420" cy="110" r="4" fill="#fef08a" />
        <circle cx="460" cy="220" r="3" fill="#fff" />
        <circle cx="180" cy="260" r="2.5" fill="#fde047" />
      </svg>
    );
  }

  // Fallback whimsical illustration
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-amber-50 to-indigo-50 border border-slate-200/80 rounded-2xl p-6 ${className}`}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm text-2xl font-black">
          📖
        </div>
        <p className="text-xs font-bold text-slate-600">Illustration de l’aventure</p>
      </div>
    </div>
  );
};
