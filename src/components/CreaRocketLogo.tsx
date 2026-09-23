import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white';
}

export const CreaRocketLogo: React.FC<LogoProps> = ({ className = 'h-10 w-auto', variant = 'full' }) => {
  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 260 52"
        className="h-full w-auto max-h-12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="CreaRocket Generator Pro"
      >
        <defs>
          <linearGradient id="crRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="40%" stopColor="#D1192A" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <filter id="crRedShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#991B1B" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Official CreaRocket Red Rounded Badge with White Icon */}
        <g transform="translate(4, 4)">
          {/* Rounded Square Red Container (matching image.png) */}
          <rect
            x="0"
            y="0"
            width="44"
            height="44"
            rx="11"
            fill="url(#crRedGradient)"
            filter="url(#crRedShadow)"
          />

          {/* Exact White Vector Rocket Icon from CreaRocket identity */}
          <g transform="translate(6, 6)">
            {/* Rocket Main Fuselage Body */}
            <path
              d="M24.8 7.2 C24.8 7.2, 17.5 9.8, 12.8 17.2 C12.2 18.2, 12.5 19.5, 13.5 20.2 L17.8 23.5 C18.7 24.2, 19.8 24.0, 20.6 23.2 C26.2 17.5, 24.8 7.2, 24.8 7.2 Z"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Left Delta Fin / Wing */}
            <path
              d="M14.8 14.2 L9.5 14.8 C8.2 14.9, 7.6 16.5, 8.6 17.4 L12.5 20.2"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Delta Fin / Wing */}
            <path
              d="M21.8 19.2 L22.4 24.5 C22.5 25.8, 24.1 26.4, 25.0 25.4 L23.8 20.5"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Porthole / Window */}
            <circle
              cx="19.5"
              cy="12.5"
              r="2.3"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
            />

            {/* Exhaust Thruster Plumes / Flames (3 trails to bottom-left) */}
            {/* Center Main Flame */}
            <path
              d="M13.8 23.2 C11.5 26.0, 8.5 28.5, 6.8 30.5"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Left Flame Trail */}
            <path
              d="M11.5 21.8 C9.8 23.8, 7.2 25.8, 5.5 27.2"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Right Flame Trail */}
            <path
              d="M16.2 25.5 C14.5 27.5, 12.0 29.5, 10.2 31.0"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* 2. Official Brand Typography: 'Crea' (Black) + 'Rocket' (Red) */}
        <text
          x="58"
          y="24"
          fontFamily="'Plus Jakarta Sans', 'Outfit', 'Inter', system-ui, -apple-system, sans-serif"
          letterSpacing="-0.3"
        >
          <tspan
            fill={isWhite ? '#FFFFFF' : '#000000'}
            fontWeight="700"
            fontSize="22"
          >
            Crea
          </tspan>
          <tspan
            fill="#D1192A"
            fontWeight="800"
            fontSize="22"
          >
            Rocket
          </tspan>
        </text>

        {/* 3. Sub-label: GENERATOR PRO */}
        <g transform="translate(58, 30)">
          <text
            x="0"
            y="13"
            fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
            fontWeight="800"
            fontSize="11.5"
            fill={isWhite ? '#FDA4AF' : '#D1192A'}
            letterSpacing="2.6"
          >
            GENERATOR
          </text>

          {/* PRO Badge */}
          <g transform="translate(98, 3.5)">
            <rect
              x="0"
              y="0"
              width="30"
              height="11"
              rx="5.5"
              fill={isWhite ? 'rgba(255,255,255,0.2)' : '#FEF2F2'}
              stroke={isWhite ? '#FFFFFF' : '#FCA5A5'}
              strokeWidth="1"
            />
            <text
              x="15"
              y="8"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="900"
              fontSize="7"
              fill={isWhite ? '#FFFFFF' : '#B91C1C'}
              letterSpacing="0.8"
            >
              PRO
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
