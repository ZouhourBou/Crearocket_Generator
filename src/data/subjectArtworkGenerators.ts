/**
 * Pure Decorative Artwork Generators (Vector Backgrounds)
 * 
 * Strict Architecture Rule:
 * Renders ONLY decorative backgrounds, borders, subject motifs, and textures.
 * ZERO readable text, ZERO titles, ZERO student labels in the bitmap.
 * The titleZone (top ~8-25%) and infoZone (bottom ~66-92%) are reserved and kept clean.
 */

import { SubjectDefinition, CoverTemplate } from './subjectRegistry';

/**
 * Escapes SVG content safely into a Data URI
 */
function svgToDataUri(svgString: string): string {
  const cleaned = svgString.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
}

/**
 * Subject-specific decorative motif generator
 * Renders rich, detailed, commercial scholastic illustrations in the central canvas (y: 280-740).
 * Strictly zero readable text or labels.
 */
function getSubjectDecorativeMotifs(subject: SubjectDefinition, palette: string[]): string {
  const primary = palette[0] || '#2563EB';
  const secondary = palette[1] || '#0D9488';
  const accent = palette[3] || palette[2] || '#F59E0B';
  const light = palette[4] || '#FFFFFF';

  switch (subject.id) {
    // =========================================================================
    // 19. كرّاس الإعلامية (Computer Science / Informatique)
    // =========================================================================
    case 'informatique':
      return `
        <!-- Informatique: Modern Laptop, Cute Coding Robot, Motherboard Circuits, Binary Cloud -->
        <g id="scene-informatique" opacity="0.95">
          <!-- Background Cybernetic Circuit Grid & Glow Nodes -->
          <g opacity="0.4">
            <path d="M 80,360 L 220,360 L 260,400 L 260,490" fill="none" stroke="${secondary}" stroke-width="2.5" stroke-dasharray="8 6" />
            <circle cx="80" cy="360" r="5" fill="${secondary}" />
            <circle cx="260" cy="490" r="5" fill="${accent}" />
            <path d="M 720,360 L 580,360 L 540,400 L 540,480" fill="none" stroke="${secondary}" stroke-width="2.5" stroke-dasharray="8 6" />
            <circle cx="720" cy="360" r="5" fill="${secondary}" />
            <circle cx="540" cy="480" r="5" fill="${accent}" />
            <!-- Floating Binary Tech Badges -->
            <rect x="100" y="420" width="80" height="28" rx="6" fill="${primary}" opacity="0.15" />
            <text x="140" y="438" font-family="monospace" font-size="12" font-weight="bold" fill="${primary}" text-anchor="middle" opacity="0.8">&lt; / &gt;</text>
            <rect x="620" y="420" width="80" height="28" rx="6" fill="${accent}" opacity="0.15" />
            <text x="660" y="438" font-family="monospace" font-size="12" font-weight="bold" fill="${accent}" text-anchor="middle" opacity="0.8">{ CODE }</text>
          </g>

          <!-- Central Desktop/Laptop Computer System -->
          <g transform="translate(400, 480)">
            <!-- Computer Shadow -->
            <ellipse cx="0" cy="120" rx="190" ry="25" fill="#000000" opacity="0.12" />

            <!-- Monitor Screen Shell -->
            <rect x="-140" y="-120" width="280" height="180" rx="14" fill="#1E293B" stroke="${primary}" stroke-width="4" />
            <!-- Screen Display -->
            <rect x="-124" y="-106" width="248" height="148" rx="8" fill="#0F172A" />
            <!-- Code Editor Window Header -->
            <rect x="-124" y="-106" width="248" height="22" rx="4" fill="#334155" />
            <circle cx="-110" cy="-95" r="4" fill="#EF4444" />
            <circle cx="-98" cy="-95" r="4" fill="#F59E0B" />
            <circle cx="-86" cy="-95" r="4" fill="#10B981" />
            <!-- Code Editor Syntax Lines -->
            <rect x="-110" y="-72" width="60" height="7" rx="3" fill="${secondary}" opacity="0.9" />
            <rect x="-42" y="-72" width="90" height="7" rx="3" fill="${accent}" opacity="0.9" />
            <rect x="-110" y="-56" width="40" height="6" rx="3" fill="#94A3B8" opacity="0.7" />
            <rect x="-62" y="-56" width="110" height="6" rx="3" fill="${primary}" opacity="0.8" />
            <rect x="-90" y="-40" width="120" height="6" rx="3" fill="#38BDF8" opacity="0.8" />
            <rect x="-90" y="-24" width="70" height="6" rx="3" fill="${accent}" opacity="0.8" />
            <rect x="-110" y="-8" width="50" height="6" rx="3" fill="${secondary}" opacity="0.9" />
            <rect x="-52" y="-8" width="80" height="6" rx="3" fill="#10B981" opacity="0.8" />
            <!-- Glowing Cursor -->
            <rect x="34" y="-8" width="4" height="9" fill="#38BDF8" opacity="0.9" />

            <!-- Monitor Stand and Base -->
            <polygon points="-25,60 25,60 16,95 -16,95" fill="#475569" />
            <rect x="-60" y="92" width="120" height="12" rx="6" fill="#334155" stroke="${primary}" stroke-width="2" />

            <!-- Keyboard -->
            <polygon points="-120,110 120,110 145,138 -145,138" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" />
            <rect x="-105" y="114" width="210" height="12" rx="2" fill="#CBD5E1" />
            <rect x="-40" y="129" width="80" height="6" rx="3" fill="#94A3B8" />

            <!-- Ergonomic Optical Mouse -->
            <ellipse cx="170" cy="125" rx="16" ry="24" fill="#F8FAFC" stroke="${secondary}" stroke-width="2" />
            <line x1="170" y1="105" x2="170" y2="120" stroke="${secondary}" stroke-width="2" />
            <circle cx="170" cy="115" r="2.5" fill="${accent}" />
            <path d="M 170,102 Q 170,80 150,95" fill="none" stroke="#94A3B8" stroke-width="1.5" />
          </g>

          <!-- Friendly Coding Mini Robot Assistant (Right) -->
          <g transform="translate(630, 520) scale(0.9)">
            <!-- Robot Shadow -->
            <ellipse cx="0" cy="65" rx="40" ry="10" fill="#000000" opacity="0.15" />
            <!-- Antenna -->
            <line x1="0" y1="-50" x2="0" y2="-72" stroke="${primary}" stroke-width="4" />
            <circle cx="0" cy="-76" r="8" fill="${accent}" stroke="#FFFFFF" stroke-width="2" />
            <!-- Head -->
            <rect x="-36" y="-50" width="72" height="52" rx="16" fill="#F8FAFC" stroke="${primary}" stroke-width="3" />
            <!-- Visor Screen -->
            <rect x="-26" y="-40" width="52" height="28" rx="8" fill="#0F172A" />
            <!-- Friendly LED Eyes -->
            <ellipse cx="-12" cy="-26" rx="5" ry="7" fill="${secondary}" />
            <ellipse cx="12" cy="-26" rx="5" ry="7" fill="${secondary}" />
            <circle cx="-14" cy="-28" r="2" fill="#FFFFFF" />
            <circle cx="10" cy="-28" r="2" fill="#FFFFFF" />
            <!-- Body -->
            <rect x="-30" y="8" width="60" height="48" rx="12" fill="${primary}" stroke="#FFFFFF" stroke-width="2" />
            <circle cx="0" cy="30" r="12" fill="#FFFFFF" opacity="0.9" />
            <polygon points="0,22 8,36 -8,36" fill="${accent}" />
            <!-- Wheels / Tracks -->
            <rect x="-38" y="52" width="76" height="14" rx="7" fill="#334155" />
            <circle cx="-24" cy="59" r="4" fill="#94A3B8" />
            <circle cx="0" cy="59" r="4" fill="#94A3B8" />
            <circle cx="24" cy="59" r="4" fill="#94A3B8" />
          </g>

          <!-- Microchip Processor & Memory (Left) -->
          <g transform="translate(160, 530) scale(0.85)">
            <rect x="-35" y="-35" width="70" height="70" rx="8" fill="#1E293B" stroke="${accent}" stroke-width="3" />
            <rect x="-22" y="-22" width="44" height="44" rx="4" fill="${primary}" />
            <!-- Chip Pins -->
            <line x1="-25" y1="-35" x2="-25" y2="-45" stroke="#F59E0B" stroke-width="3" />
            <line x1="0" y1="-35" x2="0" y2="-45" stroke="#F59E0B" stroke-width="3" />
            <line x1="25" y1="-35" x2="25" y2="-45" stroke="#F59E0B" stroke-width="3" />
            <line x1="-25" y1="35" x2="-25" y2="45" stroke="#F59E0B" stroke-width="3" />
            <line x1="0" y1="35" x2="0" y2="45" stroke="#F59E0B" stroke-width="3" />
            <line x1="25" y1="35" x2="25" y2="45" stroke="#F59E0B" stroke-width="3" />
            <line x1="-35" y1="-25" x2="-45" y2="-25" stroke="#F59E0B" stroke-width="3" />
            <line x1="-35" y1="0" x2="-45" y2="0" stroke="#F59E0B" stroke-width="3" />
            <line x1="-35" y1="25" x2="-45" y2="25" stroke="#F59E0B" stroke-width="3" />
            <line x1="35" y1="-25" x2="45" y2="-25" stroke="#F59E0B" stroke-width="3" />
            <line x1="35" y1="0" x2="45" y2="0" stroke="#F59E0B" stroke-width="3" />
            <line x1="35" y1="25" x2="45" y2="25" stroke="#F59E0B" stroke-width="3" />
          </g>
        </g>
      `;

    // =========================================================================
    // 08, 09, 10, 11, 20, 22. كراس اللغة العربية والمواد الأدبية
    // =========================================================================
    case 'arabe':
    case 'production_ecrite_ar':
    case 'lecture_ar':
    case 'grammaire_ar':
    case 'memorisation':
    case 'mutalaa':
      return `
        <!-- Arabic Scholarly Composition: Open Book with Arabesque, Calligraphic Reed Pen, Inkwell, Floating Letters -->
        <g id="scene-arabe" opacity="0.95">
          <!-- Ambient Calligraphic Arabesque Arcs -->
          <g opacity="0.25">
            <circle cx="400" cy="500" r="190" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="12 8" />
            <circle cx="400" cy="500" r="230" fill="none" stroke="${primary}" stroke-width="1.5" />
          </g>

          <!-- Floating Decorative Calligraphic Arabic Glyphs -->
          <g opacity="0.75" font-family="'Cairo', 'Amiri', serif" font-weight="bold">
            <!-- ض -->
            <g transform="translate(180, 370)">
              <circle cx="0" cy="0" r="28" fill="${primary}" opacity="0.15" />
              <text x="0" y="10" font-size="34" fill="${primary}" text-anchor="middle">ض</text>
            </g>
            <!-- أ -->
            <g transform="translate(620, 360)">
              <circle cx="0" cy="0" r="26" fill="${accent}" opacity="0.2" />
              <text x="0" y="10" font-size="32" fill="${accent}" text-anchor="middle">أ</text>
            </g>
            <!-- ق -->
            <g transform="translate(140, 520)">
              <circle cx="0" cy="0" r="24" fill="${secondary}" opacity="0.18" />
              <text x="0" y="8" font-size="28" fill="${secondary}" text-anchor="middle">ق</text>
            </g>
            <!-- ن -->
            <g transform="translate(660, 510)">
              <circle cx="0" cy="0" r="24" fill="${primary}" opacity="0.18" />
              <text x="0" y="8" font-size="28" fill="${primary}" text-anchor="middle">ن</text>
            </g>
          </g>

          <!-- Grand Open Book in Center -->
          <g transform="translate(400, 520)">
            <!-- Soft Book Shadow -->
            <ellipse cx="0" cy="90" rx="200" ry="24" fill="#000000" opacity="0.14" />

            <!-- Leather Cover Rim (Green/Burgundy) -->
            <path d="M -180,35 Q -80,60 0,65 Q 80,60 180,35 L 180,50 Q 80,75 0,80 Q -80,75 -180,50 Z" fill="${primary}" opacity="0.9" />

            <!-- Book Left Curved Page -->
            <path d="M 0,55 C -60,50 -120,40 -170,15 L -170,-45 C -120,-20 -60,-10 0,-5 Z" fill="#FFFDF8" stroke="${primary}" stroke-width="2" />
            <!-- Book Right Curved Page -->
            <path d="M 0,55 C 60,50 120,40 170,15 L 170,-45 C 120,-20 60,-10 0,-5 Z" fill="#FFFDF8" stroke="${primary}" stroke-width="2" />

            <!-- Inner Page Texture & Subtle Calligraphic Lines -->
            <!-- Left Lines -->
            <path d="M -150,-10 Q -90,0 -20,5" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <path d="M -145,8 Q -90,18 -20,23" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <path d="M -140,26 Q -90,36 -20,41" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <!-- Right Lines -->
            <path d="M 20,5 Q 90,0 150,-10" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <path d="M 20,23 Q 90,18 145,8" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <path d="M 20,41 Q 90,36 140,26" stroke="${secondary}" stroke-width="2" opacity="0.4" />

            <!-- Golden Ribbon Bookmark flowing from center spine -->
            <path d="M 0,-5 Q 15,30 -5,65 Q -15,90 -2,115 L 8,112 Q -5,85 5,60 Q 15,25 0,-5 Z" fill="${accent}" stroke="#D97706" stroke-width="1.5" />
          </g>

          <!-- Traditional Calligraphic Reed Pen (Qalam) Angled -->
          <g transform="translate(310, 420) rotate(-35)">
            <!-- Pen Shaft with Bamboo Knots -->
            <rect x="-7" y="-90" width="14" height="150" rx="4" fill="#B45309" stroke="#78350F" stroke-width="2" />
            <line x1="-7" y1="-40" x2="7" y2="-40" stroke="#78350F" stroke-width="2" />
            <line x1="-7" y1="15" x2="7" y2="15" stroke="#78350F" stroke-width="2" />
            <!-- Carved Chiseled Nib Tip -->
            <polygon points="-7,60 0,85 7,60" fill="#FDE68A" stroke="#B45309" stroke-width="1.5" />
            <line x1="0" y1="62" x2="0" y2="82" stroke="#78350F" stroke-width="1.5" />
            <!-- Black Ink Dip on tip -->
            <polygon points="-3,74 0,85 3,74" fill="#0F172A" />
          </g>

          <!-- Vintage Glass Inkwell (Dawat) on the Right -->
          <g transform="translate(560, 470)">
            <!-- Glass Shadow -->
            <ellipse cx="0" cy="36" rx="35" ry="12" fill="#000000" opacity="0.15" />
            <!-- Glass Base & Ink Reservoir -->
            <path d="M -28,28 C -32,20 -30,-5 -22,-15 L 22,-15 C 30,-5 32,20 28,28 Z" fill="${primary}" opacity="0.85" stroke="#FFFFFF" stroke-width="2" />
            <!-- Ink Level Inside -->
            <ellipse cx="0" cy="10" rx="22" ry="8" fill="#0F172A" />
            <!-- Inkwell Neck & Brass Collar -->
            <rect x="-16" y="-24" width="32" height="10" rx="3" fill="${accent}" stroke="#D97706" stroke-width="1.5" />
            <ellipse cx="0" cy="-24" rx="14" ry="4" fill="#0F172A" />
            <!-- Splashing Ink Drop -->
            <circle cx="15" cy="-35" r="4" fill="#0F172A" />
            <circle cx="24" cy="-48" r="2.5" fill="#0F172A" />
          </g>
        </g>
      `;

    // =========================================================================
    // 14. كرّاس التربية المدنية (Civic Education)
    // =========================================================================
    case 'education_civique':
      return `
        <!-- Civic Education: Schoolhouse, Scales of Justice, Handshake Emblem, Peace Dove -->
        <g id="scene-civique" opacity="0.95">
          <!-- Harmonious Community Sunburst / Aura -->
          <g opacity="0.25">
            <circle cx="400" cy="500" r="190" fill="${secondary}" opacity="0.08" />
            <circle cx="400" cy="500" r="230" fill="none" stroke="${secondary}" stroke-width="2" stroke-dasharray="10 8" />
          </g>

          <!-- Central Schoolhouse / Republic Building (Center-Top) -->
          <g transform="translate(400, 430)">
            <ellipse cx="0" cy="65" rx="140" ry="18" fill="#000000" opacity="0.1" />
            <!-- Building Base / Steps -->
            <rect x="-95" y="45" width="190" height="14" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" />
            <rect x="-85" y="32" width="170" height="14" rx="2" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" />
            <!-- Classical Columns -->
            <rect x="-75" y="-20" width="16" height="52" rx="2" fill="#FFFFFF" stroke="${primary}" stroke-width="2" />
            <rect x="-35" y="-20" width="16" height="52" rx="2" fill="#FFFFFF" stroke="${primary}" stroke-width="2" />
            <rect x="19" y="-20" width="16" height="52" rx="2" fill="#FFFFFF" stroke="${primary}" stroke-width="2" />
            <rect x="59" y="-20" width="16" height="52" rx="2" fill="#FFFFFF" stroke="${primary}" stroke-width="2" />
            <!-- Central Arch Doorway -->
            <path d="M -12,32 L -12,0 A 12 12 0 0 1 12,0 L 12,32 Z" fill="${primary}" opacity="0.7" />
            <!-- Triangular Pediment -->
            <polygon points="0,-60 -95,-20 95,-20" fill="${primary}" stroke="#FFFFFF" stroke-width="2" />
            <circle cx="0" cy="-35" r="10" fill="${accent}" />
            <!-- Clock Tower & National / School Flag -->
            <rect x="-16" y="-95" width="32" height="35" fill="#FFFFFF" stroke="${primary}" stroke-width="2" />
            <circle cx="0" cy="-78" r="8" fill="#F8FAFC" stroke="${primary}" stroke-width="1.5" />
            <line x1="0" y1="-78" x2="0" y2="-83" stroke="${primary}" stroke-width="2" />
            <line x1="0" y1="-78" x2="4" y2="-78" stroke="${primary}" stroke-width="1.5" />
            <line x1="0" y1="-95" x2="0" y2="-125" stroke="${accent}" stroke-width="3" />
            <polygon points="0,-125 35,-112 0,-100" fill="${accent}" />
          </g>

          <!-- Golden Scales of Justice (Balance of Equality & Fairness) -->
          <g transform="translate(230, 530) scale(0.9)">
            <!-- Stand Base -->
            <ellipse cx="0" cy="65" rx="35" ry="8" fill="#D97706" />
            <rect x="-4" y="-30" width="8" height="95" fill="#F59E0B" />
            <!-- Top Horizontal Beam -->
            <rect x="-55" y="-32" width="110" height="6" rx="2" fill="#D97706" />
            <circle cx="0" cy="-29" r="6" fill="#FDE68A" />
            <!-- Left Pan with Chains -->
            <line x1="-50" y1="-26" x2="-62" y2="10" stroke="#D97706" stroke-width="1.5" />
            <line x1="-50" y1="-26" x2="-38" y2="10" stroke="#D97706" stroke-width="1.5" />
            <path d="M -70,10 Q -50,28 -30,10 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5" />
            <!-- Right Pan with Chains -->
            <line x1="50" y1="-26" x2="38" y2="10" stroke="#D97706" stroke-width="1.5" />
            <line x1="50" y1="-26" x2="62" y2="10" stroke="#D97706" stroke-width="1.5" />
            <path d="M 30,10 Q 50,28 70,10 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5" />
          </g>

          <!-- Community Handshake / Solidarity Emblem (Right) -->
          <g transform="translate(570, 530) scale(0.95)">
            <!-- Outer Laurel Wreath Ring -->
            <circle cx="0" cy="15" r="48" fill="#FFFFFF" stroke="${secondary}" stroke-width="3" opacity="0.95" />
            <circle cx="0" cy="15" r="42" fill="${secondary}" opacity="0.1" />
            <!-- Stylized Friendly Handshake -->
            <path d="M -30,22 L -15,10 L 0,16 L 15,10 L 30,22 L 20,32 L 0,22 L -20,32 Z" fill="${primary}" />
            <path d="M -15,10 Q 0,0 15,10 L 0,20 Z" fill="${accent}" />
            <circle cx="0" cy="-5" r="6" fill="${secondary}" />
          </g>

          <!-- White Peace Dove with Olive Branch in Flight -->
          <g transform="translate(200, 390) scale(0.85)">
            <!-- Dove Wings & Body -->
            <path d="M -20,10 Q 0,-25 35,-30 Q 15,0 20,20 Q 0,25 -20,10 Z" fill="#FFFFFF" stroke="${secondary}" stroke-width="2" />
            <path d="M -5,-10 Q 20,-50 45,-40 Q 25,-15 10,-5 Z" fill="#FFFFFF" stroke="${secondary}" stroke-width="2" />
            <circle cx="30" cy="-24" r="2" fill="${primary}" />
            <!-- Olive Branch -->
            <path d="M 35,-20 Q 55,-10 65,-25" fill="none" stroke="#16A34A" stroke-width="2" />
            <ellipse cx="45" cy="-18" rx="5" ry="3" fill="#22C55E" transform="rotate(-20 45 -18)" />
            <ellipse cx="55" cy="-16" rx="5" ry="3" fill="#22C55E" transform="rotate(30 55 -16)" />
          </g>
        </g>
      `;

    // =========================================================================
    // 01. كرّاس الرياضيات (Mathematics)
    // =========================================================================
    case 'maths':
      return `
        <!-- Mathematics: Precision Compass, Protractor, Set Square, 3D Isometric Cube & Formulas -->
        <g id="scene-maths" opacity="0.95">
          <!-- Coordinate Grid & Graph Wave Backdrop -->
          <g opacity="0.25">
            <line x1="100" y1="515" x2="700" y2="515" stroke="${primary}" stroke-width="2" />
            <line x1="400" y1="320" x2="400" y2="690" stroke="${primary}" stroke-width="2" />
            <!-- Sine Wave Curve -->
            <path d="M 120,515 Q 260,400 400,515 Q 540,630 680,515" fill="none" stroke="${secondary}" stroke-width="3" />
          </g>

          <!-- Translucent Set Square (Équerre) Center-Left -->
          <g transform="translate(260, 480) rotate(-15)">
            <polygon points="0,0 0,160 160,160" fill="${primary}" opacity="0.2" stroke="${primary}" stroke-width="3" />
            <polygon points="25,45 25,135 115,135" fill="#FFFFFF" opacity="0.8" stroke="${primary}" stroke-width="1.5" />
            <!-- Graduation Marks -->
            <line x1="0" y1="30" x2="12" y2="30" stroke="${primary}" stroke-width="2" />
            <line x1="0" y1="60" x2="12" y2="60" stroke="${primary}" stroke-width="2" />
            <line x1="0" y1="90" x2="12" y2="90" stroke="${primary}" stroke-width="2" />
            <line x1="0" y1="120" x2="12" y2="120" stroke="${primary}" stroke-width="2" />
          </g>

          <!-- Precision Drafting Compass Center -->
          <g transform="translate(420, 460)">
            <ellipse cx="0" cy="110" rx="60" ry="12" fill="#000000" opacity="0.12" />
            <!-- Compass Top Hinge Knob -->
            <circle cx="0" cy="-70" r="10" fill="#94A3B8" stroke="#475569" stroke-width="2" />
            <rect x="-4" y="-85" width="8" height="15" rx="3" fill="#CBD5E1" />
            <!-- Left Leg (Steel Needle) -->
            <line x1="-4" y1="-62" x2="-45" y2="95" stroke="${accent}" stroke-width="6" stroke-linecap="round" />
            <polygon points="-45,95 -49,112 -41,108" fill="#334155" />
            <!-- Right Leg (Pencil Lead Clamp) -->
            <line x1="4" y1="-62" x2="45" y2="80" stroke="${accent}" stroke-width="6" stroke-linecap="round" />
            <rect x="36" y="70" width="16" height="28" rx="2" fill="#475569" />
            <polygon points="40,98 48,98 44,112" fill="#1E293B" />
            <!-- Adjustment Wheel Bar -->
            <line x1="-22" y1="10" x2="22" y2="10" stroke="#64748B" stroke-width="3" />
            <circle cx="0" cy="10" r="6" fill="#F59E0B" />
          </g>

          <!-- 3D Wireframe Isometric Cube (Right) -->
          <g transform="translate(580, 480)">
            <!-- Front Face -->
            <polygon points="0,-40 50,-10 50,50 0,20" fill="${secondary}" opacity="0.35" stroke="${secondary}" stroke-width="2.5" />
            <!-- Top Face -->
            <polygon points="0,-40 -50,-10 0,20 50,-10" fill="${primary}" opacity="0.45" stroke="${primary}" stroke-width="2.5" />
            <!-- Left Face -->
            <polygon points="-50,-10 0,20 0,80 -50,50" fill="${primary}" opacity="0.25" stroke="${primary}" stroke-width="2.5" />
            <circle cx="0" cy="20" r="4" fill="${accent}" />
          </g>

          <!-- Floating Educational Math Badges: π, √, ∑, %, + − × ÷ -->
          <g opacity="0.8" font-family="'Cairo', sans-serif" font-weight="900">
            <g transform="translate(160, 390)">
              <rect x="-24" y="-24" width="48" height="48" rx="12" fill="#FFFFFF" stroke="${primary}" stroke-width="2" />
              <text x="0" y="8" font-size="22" fill="${primary}" text-anchor="middle">π</text>
            </g>
            <g transform="translate(640, 380)">
              <rect x="-24" y="-24" width="48" height="48" rx="12" fill="#FFFFFF" stroke="${accent}" stroke-width="2" />
              <text x="0" y="8" font-size="22" fill="${accent}" text-anchor="middle">∞</text>
            </g>
            <g transform="translate(320, 610)">
              <rect x="-20" y="-20" width="40" height="40" rx="10" fill="${secondary}" opacity="0.15" />
              <text x="0" y="7" font-size="20" fill="${secondary}" text-anchor="middle">+</text>
            </g>
            <g transform="translate(500, 615)">
              <rect x="-20" y="-20" width="40" height="40" rx="10" fill="${accent}" opacity="0.15" />
              <text x="0" y="7" font-size="20" fill="${accent}" text-anchor="middle">÷</text>
            </g>
          </g>
        </g>
      `;

    // =========================================================================
    // 02. كرّاس الإيقاظ العلمي (Science / Eveil Scientifique)
    // =========================================================================
    case 'eveil_scientifique':
      return `
        <!-- Science: Optical Microscope, Glowing Erlenmeyer Flask, Orbiting Atom & DNA Strand -->
        <g id="scene-science" opacity="0.95">
          <!-- Cosmos & Orbiting Planetary Rings Backdrop -->
          <g opacity="0.25">
            <ellipse cx="400" cy="500" rx="220" ry="80" fill="none" stroke="${secondary}" stroke-width="2" transform="rotate(-25 400 500)" />
            <ellipse cx="400" cy="500" rx="220" ry="80" fill="none" stroke="${primary}" stroke-width="1.5" transform="rotate(25 400 500)" />
          </g>

          <!-- Central Optical Laboratory Microscope -->
          <g transform="translate(340, 480) scale(0.95)">
            <ellipse cx="20" cy="110" rx="85" ry="16" fill="#000000" opacity="0.14" />
            <!-- Heavy Cast Iron Horseshoe Base -->
            <path d="M -45,100 Q 20,115 85,100 L 70,80 Q 20,90 -30,80 Z" fill="#1E293B" stroke="${primary}" stroke-width="3" />
            <!-- Upright Pillar & Mirror -->
            <rect x="45" y="40" width="20" height="45" rx="4" fill="#64748B" />
            <circle cx="55" cy="58" r="10" fill="#94A3B8" />
            <!-- Curved Arm -->
            <path d="M 55,45 C 55,-10 30,-50 -20,-50 L -20,-30 C 15,-30 35,-5 35,45 Z" fill="${primary}" stroke="#FFFFFF" stroke-width="2" />
            <!-- Focus Knob -->
            <circle cx="45" cy="0" r="12" fill="${accent}" stroke="#B45309" stroke-width="2" />
            <!-- Specimen Stage with Slide Clips -->
            <rect x="-40" y="30" width="70" height="10" rx="2" fill="#334155" />
            <rect x="-25" y="27" width="40" height="4" fill="#93C5FD" opacity="0.9" />
            <!-- Optical Body Tube & Eyepiece -->
            <rect x="-35" y="-95" width="22" height="75" rx="3" fill="#F1F5F9" stroke="#64748B" stroke-width="2" transform="rotate(-15 -24 -57)" />
            <rect x="-45" y="-115" width="30" height="20" rx="4" fill="#334155" transform="rotate(-15 -30 -105)" />
            <!-- Revolving Nosepiece & Objective Lenses -->
            <polygon points="-15,-20 5,-20 -5,-5" fill="${accent}" />
            <rect x="-16" y="-5" width="8" height="18" fill="#64748B" />
          </g>

          <!-- Glowing Erlenmeyer Conical Flask with Bubbles (Right) -->
          <g transform="translate(530, 520) scale(0.9)">
            <!-- Glass Shadow -->
            <ellipse cx="0" cy="65" rx="50" ry="12" fill="#000000" opacity="0.14" />
            <!-- Conical Glass Body -->
            <path d="M -15,-40 L -45,50 C -48,58 -38,62 0,62 C 38,62 48,58 45,50 L 15,-40 Z" fill="#FFFFFF" opacity="0.4" stroke="${secondary}" stroke-width="3" />
            <!-- Colored Chemical Solution -->
            <path d="M -35,25 Q 0,35 35,25 L 44,50 C 46,56 36,60 0,60 C -36,60 -46,56 -44,50 Z" fill="${secondary}" opacity="0.75" />
            <!-- Bubbles Rising -->
            <circle cx="-10" cy="10" r="5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="15" cy="-5" r="4" fill="#FFFFFF" opacity="0.8" />
            <circle cx="-5" cy="-22" r="3" fill="#FFFFFF" opacity="0.8" />
            <circle cx="8" cy="-50" r="3.5" fill="${accent}" opacity="0.9" />
            <!-- Graduated Volume Marks -->
            <line x1="-12" y1="40" x2="5" y2="40" stroke="#FFFFFF" stroke-width="2" opacity="0.8" />
            <line x1="-9" y1="20" x2="5" y2="20" stroke="#FFFFFF" stroke-width="2" opacity="0.8" />
            <line x1="-6" y1="0" x2="5" y2="0" stroke="#FFFFFF" stroke-width="2" opacity="0.8" />
            <!-- Flask Lip -->
            <rect x="-20" y="-46" width="40" height="8" rx="4" fill="#E2E8F0" stroke="${secondary}" stroke-width="2" />
          </g>

          <!-- DNA Double Helix Ascent (Left) -->
          <g transform="translate(180, 480) scale(0.85)">
            <path d="M -20,-80 Q 20,-40 -20,0 Q 20,40 -20,80" fill="none" stroke="${primary}" stroke-width="5" stroke-linecap="round" />
            <path d="M 20,-80 Q -20,-40 20,0 Q -20,40 20,80" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" />
            <!-- Base Pairs -->
            <line x1="-12" y1="-60" x2="12" y2="-60" stroke="${secondary}" stroke-width="3" />
            <line x1="0" y1="-40" x2="0" y2="-40" stroke="${secondary}" stroke-width="4" />
            <line x1="-12" y1="-20" x2="12" y2="-20" stroke="${secondary}" stroke-width="3" />
            <line x1="-12" y1="20" x2="12" y2="20" stroke="${secondary}" stroke-width="3" />
            <line x1="0" y1="40" x2="0" y2="40" stroke="${secondary}" stroke-width="4" />
            <line x1="-12" y1="60" x2="12" y2="60" stroke="${secondary}" stroke-width="3" />
          </g>
        </g>
      `;

    // =========================================================================
    // 12. كرّاس التاريخ والجغرافيا (History & Geography)
    // =========================================================================
    case 'histoire_geo':
      return `
        <!-- History & Geography: Antique Terrestrial Globe, Parchment Compass Rose, Hourglass, Pyramid Silhouettes -->
        <g id="scene-hist-geo" opacity="0.95">
          <!-- Ancient Navigation Chart Meridians -->
          <g opacity="0.3">
            <circle cx="400" cy="500" r="190" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="10 8" />
            <path d="M 400,310 L 400,690 M 210,500 L 590,500" stroke="${accent}" stroke-width="1.5" />
          </g>

          <!-- Antique Terrestrial Globe on Turned Mahogany Stand (Center) -->
          <g transform="translate(370, 480) scale(0.95)">
            <ellipse cx="0" cy="115" rx="75" ry="16" fill="#000000" opacity="0.15" />
            <!-- Wooden Base & Turned Column -->
            <polygon points="-45,110 45,110 35,95 -35,95" fill="#78350F" stroke="#451A03" stroke-width="2" />
            <rect x="-10" y="60" width="20" height="38" rx="4" fill="#92400E" />
            <!-- Brass Semi-Meridian Arc -->
            <path d="M 0,-70 A 95 95 0 0 1 0,70" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" />
            <!-- Spherical Globe (Tilted 23.5°) -->
            <g transform="rotate(-23.5)">
              <circle cx="0" cy="0" r="75" fill="#0284C7" stroke="#1E293B" stroke-width="2.5" />
              <!-- Continents in Green / Amber -->
              <path d="M -45,-30 Q -20,-45 10,-35 Q 25,-10 0,15 Q -30,20 -45,-30 Z" fill="#16A34A" />
              <path d="M -10,25 Q 15,10 35,25 Q 45,60 10,55 Q -15,50 -10,25 Z" fill="#16A34A" />
              <path d="M 15,-55 Q 40,-45 55,-20 Q 35,-5 20,-30 Z" fill="#16A34A" />
              <!-- Latitude / Longitude lines -->
              <ellipse cx="0" cy="0" rx="75" ry="25" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6" />
              <line x1="0" y1="-75" x2="0" y2="75" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6" />
            </g>
          </g>

          <!-- Nautical Wind Rose / Compass Rose (Left) -->
          <g transform="translate(180, 450) scale(0.85)">
            <circle cx="0" cy="0" r="45" fill="#FFFDF5" stroke="${primary}" stroke-width="2.5" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" />
            <!-- 8-Point Compass Star -->
            <polygon points="0,-38 6,-10 0,0 -6,-10" fill="#DC2626" />
            <polygon points="0,38 6,10 0,0 -6,10" fill="${primary}" />
            <polygon points="38,0 10,6 0,0 10,-6" fill="${primary}" />
            <polygon points="-38,0 -10,6 0,0 -10,-6" fill="${primary}" />
            <circle cx="0" cy="0" r="5" fill="${accent}" />
          </g>

          <!-- Antique Hourglass (Right) -->
          <g transform="translate(580, 490) scale(0.85)">
            <ellipse cx="0" cy="65" rx="35" ry="8" fill="#000000" opacity="0.12" />
            <!-- Wooden Plates -->
            <rect x="-35" y="-60" width="70" height="12" rx="4" fill="#78350F" />
            <rect x="-35" y="48" width="70" height="12" rx="4" fill="#78350F" />
            <!-- Brass Pillars -->
            <line x1="-28" y1="-50" x2="-28" y2="50" stroke="${accent}" stroke-width="3" />
            <line x1="28" y1="-50" x2="28" y2="50" stroke="${accent}" stroke-width="3" />
            <!-- Glass Bulbs -->
            <path d="M -22,-48 Q -20, -5 0,0 Q 20, -5 22,-48 Z" fill="#E2E8F0" opacity="0.5" stroke="#64748B" stroke-width="2" />
            <path d="M -22,48 Q -20, 5 0,0 Q 20, 5 22,48 Z" fill="#E2E8F0" opacity="0.5" stroke="#64748B" stroke-width="2" />
            <!-- Flowing Sand -->
            <polygon points="-12,-48 12,-48 0,-15" fill="#F59E0B" />
            <polygon points="-16,48 16,48 0,15" fill="#F59E0B" />
            <line x1="0" y1="-5" x2="0" y2="15" stroke="#F59E0B" stroke-width="2" stroke-dasharray="2 2" />
          </g>
        </g>
      `;

    // =========================================================================
    // 15. كرّاس التربية التشكيليّة (Fine Arts / Arts Plastiques)
    // =========================================================================
    case 'arts_plastiques':
      return `
        <!-- Arts Plastiques: Wooden Artist Palette, Color Swatches, Paintbrushes, Paint Tube & Splatters -->
        <g id="scene-arts" opacity="0.95">
          <!-- Artist Splashes Backdrop -->
          <g opacity="0.35">
            <path d="M 120,400 Q 150,380 180,410 Q 150,440 120,400 Z" fill="#EF4444" />
            <circle cx="190" cy="390" r="6" fill="#EF4444" />
            <path d="M 660,390 Q 690,410 650,440 Q 630,410 660,390 Z" fill="#3B82F6" />
            <circle cx="680" cy="430" r="5" fill="#3B82F6" />
          </g>

          <!-- Large Curved Artist Paint Palette (Center) -->
          <g transform="translate(380, 500) rotate(-10)">
            <ellipse cx="0" cy="20" rx="160" ry="95" fill="#000000" opacity="0.12" />
            <!-- Wooden Palette Board -->
            <path d="M -140,-40 C -80,-80 80,-80 140,-30 C 180,10 160,70 110,80 C 60,90 20,40 -20,50 C -60,60 -100,80 -130,40 C -160,0 -160,-20 -140,-40 Z" fill="#FDE68A" stroke="#B45309" stroke-width="4" />
            <!-- Thumb Hole -->
            <ellipse cx="95" cy="40" rx="16" ry="22" fill="#FFFFFF" stroke="#B45309" stroke-width="3" />
            <!-- Rich Oil Paint Dollops -->
            <circle cx="-105" cy="-35" r="15" fill="#EF4444" stroke="#DC2626" stroke-width="1.5" />
            <circle cx="-65" cy="-55" r="14" fill="#F97316" stroke="#EA580C" stroke-width="1.5" />
            <circle cx="-20" cy="-60" r="15" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5" />
            <circle cx="28" cy="-55" r="14" fill="#10B981" stroke="#059669" stroke-width="1.5" />
            <circle cx="75" cy="-38" r="15" fill="#3B82F6" stroke="#2563EB" stroke-width="1.5" />
            <circle cx="115" cy="-10" r="14" fill="#8B5CF6" stroke="#7C3AED" stroke-width="1.5" />
          </g>

          <!-- Fan of Paintbrushes Across Palette -->
          <g transform="translate(420, 430) rotate(45)">
            <!-- Brush 1 -->
            <g transform="translate(-15, 0)">
              <rect x="-4" y="-110" width="8" height="170" rx="3" fill="#9A3412" />
              <rect x="-5" y="45" width="10" height="25" fill="#94A3B8" />
              <polygon points="-5,70 5,70 0,95" fill="#1E293B" />
              <circle cx="0" cy="92" r="3" fill="#EF4444" />
            </g>
            <!-- Brush 2 -->
            <g transform="translate(15, -10)">
              <rect x="-3" y="-100" width="6" height="150" rx="2" fill="#D97706" />
              <rect x="-4" y="35" width="8" height="22" fill="#CBD5E1" />
              <polygon points="-4,57 4,57 0,80" fill="#475569" />
              <circle cx="0" cy="78" r="3" fill="#3B82F6" />
            </g>
          </g>

          <!-- Squeezed Acrylic Paint Tube (Left) -->
          <g transform="translate(180, 520) rotate(-25) scale(0.9)">
            <rect x="-18" y="-35" width="36" height="60" rx="4" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2" />
            <rect x="-16" y="25" width="32" height="10" rx="2" fill="#CBD5E1" />
            <polygon points="-12,-35 12,-35 8,-50 -8,-50" fill="#94A3B8" />
            <rect x="-10" y="-58" width="20" height="10" rx="2" fill="#1E293B" />
            <path d="M 0,-58 Q -15,-70 -5,-85" fill="none" stroke="#3B82F6" stroke-width="6" stroke-linecap="round" />
          </g>
        </g>
      `;

    // =========================================================================
    // 16, 17. الموسيقى والإيقاظ الموسيقي (Music / Musique)
    // =========================================================================
    case 'musique':
    case 'eveil_musical':
      return `
        <!-- Music: Grand Piano Keyboard Arc, Acoustic Guitar, G-Clef, Flowing Staff Notes -->
        <g id="scene-musique" opacity="0.95">
          <!-- Harmonic Soundwave Equalizer Arcs -->
          <g opacity="0.3">
            <path d="M 120,440 Q 260,340 400,440 Q 540,540 680,440" fill="none" stroke="${secondary}" stroke-width="3" />
            <path d="M 140,460 Q 270,360 400,460 Q 530,560 660,460" fill="none" stroke="${primary}" stroke-width="2" />
          </g>

          <!-- Dynamic Piano Keyboard Ribbon Curve (Center) -->
          <g transform="translate(400, 510)">
            <ellipse cx="0" cy="55" rx="180" ry="18" fill="#000000" opacity="0.12" />
            <!-- White Keys Base -->
            <rect x="-170" y="-35" width="340" height="70" rx="8" fill="#FFFFFF" stroke="#334155" stroke-width="3" />
            <!-- Individual White Key Dividers -->
            <line x1="-136" y1="-35" x2="-136" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="-102" y1="-35" x2="-102" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="-68" y1="-35" x2="-68" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="-34" y1="-35" x2="-34" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="0" y1="-35" x2="0" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="34" y1="-35" x2="34" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="68" y1="-35" x2="68" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="102" y1="-35" x2="102" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <line x1="136" y1="-35" x2="136" y2="35" stroke="#CBD5E1" stroke-width="2" />
            <!-- Black Keys Groupings (2-3-2-3) -->
            <rect x="-146" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
            <rect x="-112" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
            <rect x="-44" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
            <rect x="-10" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
            <rect x="24" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
            <rect x="92" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
            <rect x="126" y="-35" width="18" height="42" rx="3" fill="#0F172A" />
          </g>

          <!-- Golden Majestic Treble Clef (Clef de Sol) Left -->
          <g transform="translate(190, 450) scale(0.95)">
            <path d="M 0,60 C 15,60 25,45 25,30 C 25,-10 -15,-30 -15,-60 C -15,-85 0,-100 10,-115 C 5,-100 -5,-70 5,-40 C 25,-40 45,-15 45,15 C 45,55 15,80 -10,80 C -30,80 -45,65 -45,45 C -45,25 -30,10 -15,10 C 0,10 5,25 0,35 C -5,45 -15,45 -20,40" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="-10" cy="80" r="8" fill="${accent}" />
          </g>

          <!-- Acoustic Guitar Silhouette (Right) -->
          <g transform="translate(600, 470) rotate(-20) scale(0.9)">
            <!-- Body -->
            <path d="M -30,-40 C -55,-40 -50,-10 -35,5 C -60,20 -55,60 -25,75 C 0,85 25,75 40,55 C 50,30 45,10 30,-5 C 45,-20 40,-40 20,-40 Z" fill="#D97706" stroke="#92400E" stroke-width="3" />
            <!-- Soundhole & Rosette -->
            <circle cx="0" cy="15" r="16" fill="#1E293B" stroke="#FDE68A" stroke-width="2.5" />
            <!-- Bridge -->
            <rect x="-18" y="52" width="36" height="8" rx="2" fill="#451A03" />
            <!-- Neck & Headstock -->
            <rect x="-6" y="-120" width="12" height="85" fill="#92400E" />
            <polygon points="-10,-140 10,-140 8,-120 -8,-120" fill="#78350F" />
          </g>
        </g>
      `;

    // =========================================================================
    // 13. كرّاس التربية الإسلامية (Islamic Education)
    // =========================================================================
    case 'education_islamique':
      return `
        <!-- Islamic Education: Quran Stand (Rehal), Crescent Moon & Star, Mosque Dome, Fanous Lantern -->
        <g id="scene-islamique" opacity="0.95">
          <!-- Geometric Arabesque Circle Rosette Backdrop -->
          <g opacity="0.25">
            <circle cx="400" cy="490" r="180" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="12 8" />
            <!-- 8-Point Star Overlay -->
            <rect x="330" y="420" width="140" height="140" fill="none" stroke="${accent}" stroke-width="1.5" />
            <rect x="330" y="420" width="140" height="140" fill="none" stroke="${accent}" stroke-width="1.5" transform="rotate(45 400 490)" />
          </g>

          <!-- Slender Luminous Golden Crescent Moon & Star (Top-Center) -->
          <g transform="translate(400, 390) scale(0.9)">
            <path d="M 0,-50 A 45 45 0 1 0 45,25 A 38 38 0 1 1 0,-50 Z" fill="${accent}" stroke="#D97706" stroke-width="1.5" />
            <!-- 8-Point Star -->
            <g transform="translate(22, -15) scale(0.7)">
              <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" fill="${accent}" stroke="#D97706" stroke-width="1" />
              <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" fill="${accent}" stroke="#D97706" stroke-width="1" transform="rotate(45)" />
            </g>
          </g>

          <!-- Traditional Carved Wooden Quran Stand (Rehal) Center -->
          <g transform="translate(400, 520)">
            <ellipse cx="0" cy="70" rx="140" ry="16" fill="#000000" opacity="0.14" />
            <!-- Interlocking Crossed Legs of the Stand -->
            <polygon points="-80,60 -60,65 0,0 -15,-10" fill="#78350F" stroke="#451A03" stroke-width="2" />
            <polygon points="80,60 60,65 0,0 15,-10" fill="#78350F" stroke="#451A03" stroke-width="2" />
            <polygon points="-65,-40 0,0 15,-10 -50,-50" fill="#92400E" stroke="#451A03" stroke-width="2" />
            <polygon points="65,-40 0,0 -15,-10 50,-50" fill="#92400E" stroke="#451A03" stroke-width="2" />
            <!-- Open Holy Book with Gilded Edges -->
            <path d="M 0,-5 C -45,-30 -90,-20 -130,-35 L -130,-75 C -90,-60 -45,-70 0,-45 Z" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
            <path d="M 0,-5 C 45,-30 90,-20 130,-35 L 130,-75 C 90,-60 45,-70 0,-45 Z" fill="#FFFBEB" stroke="#D97706" stroke-width="2" />
            <!-- Gold Illumination Margins -->
            <path d="M -115,-45 C -80,-35 -40,-45 -10,-25" stroke="${accent}" stroke-width="3" opacity="0.6" />
            <path d="M 115,-45 C 80,-35 40,-45 10,-25" stroke="${accent}" stroke-width="3" opacity="0.6" />
          </g>

          <!-- Hanging Traditional Fanous Lantern (Right) -->
          <g transform="translate(600, 440) scale(0.85)">
            <line x1="0" y1="-80" x2="0" y2="-40" stroke="${accent}" stroke-width="2.5" />
            <!-- Dome Cap -->
            <polygon points="0,-40 -20,-20 20,-20" fill="${accent}" stroke="#B45309" stroke-width="2" />
            <!-- Glass Body -->
            <polygon points="-20,-20 -30,25 30,25 20,-20" fill="#FEF3C7" opacity="0.8" stroke="${accent}" stroke-width="2" />
            <!-- Candle Flame Inside -->
            <circle cx="0" cy="5" r="8" fill="#F59E0B" />
            <!-- Base & Tassel -->
            <polygon points="-25,25 25,25 15,40 -15,40" fill="${accent}" stroke="#B45309" stroke-width="2" />
            <line x1="0" y1="40" x2="0" y2="55" stroke="${accent}" stroke-width="2" />
          </g>
        </g>
      `;

    // =========================================================================
    // 18. كرّاس التكنولوجيا (Technology & Engineering)
    // =========================================================================
    case 'technologie':
      return `
        <!-- Technology: Interlocking Precision Gears, Technical Blueprint, Caliper & Edison Lightbulb -->
        <g id="scene-techno" opacity="0.95">
          <!-- Blueprint Technical Grid Backdrop -->
          <g opacity="0.25">
            <rect x="140" y="340" width="520" height="320" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="10 5" />
            <line x1="140" y1="500" x2="660" y2="500" stroke="${primary}" stroke-width="1.5" />
            <line x1="400" y1="340" x2="400" y2="660" stroke="${primary}" stroke-width="1.5" />
          </g>

          <!-- Interlocking Large Mechanical Gears System (Center) -->
          <g transform="translate(380, 500)">
            <ellipse cx="0" cy="80" rx="140" ry="16" fill="#000000" opacity="0.12" />
            <!-- Main Large Gear -->
            <g>
              <circle cx="0" cy="0" r="75" fill="${primary}" stroke="#0F172A" stroke-width="3" />
              <!-- Gear Teeth (8 teeth) -->
              <rect x="-14" y="-88" width="28" height="20" rx="3" fill="${primary}" />
              <rect x="-14" y="68" width="28" height="20" rx="3" fill="${primary}" />
              <rect x="-88" y="-14" width="20" height="28" rx="3" fill="${primary}" />
              <rect x="68" y="-14" width="20" height="28" rx="3" fill="${primary}" />
              <rect x="-14" y="-88" width="28" height="20" rx="3" fill="${primary}" transform="rotate(45)" />
              <rect x="-14" y="68" width="28" height="20" rx="3" fill="${primary}" transform="rotate(45)" />
              <rect x="-88" y="-14" width="20" height="28" rx="3" fill="${primary}" transform="rotate(45)" />
              <rect x="68" y="-14" width="20" height="28" rx="3" fill="${primary}" transform="rotate(45)" />
              <!-- Inner Gear Hub -->
              <circle cx="0" cy="0" r="45" fill="#FFFFFF" stroke="${primary}" stroke-width="3" />
              <circle cx="0" cy="0" r="18" fill="${primary}" />
            </g>

            <!-- Interlocking Secondary Gear (Top-Right) -->
            <g transform="translate(95, -75) scale(0.65) rotate(22)">
              <circle cx="0" cy="0" r="75" fill="${accent}" stroke="#B45309" stroke-width="3" />
              <rect x="-14" y="-88" width="28" height="20" rx="3" fill="${accent}" />
              <rect x="-14" y="68" width="28" height="20" rx="3" fill="${accent}" />
              <rect x="-88" y="-14" width="20" height="28" rx="3" fill="${accent}" />
              <rect x="68" y="-14" width="20" height="28" rx="3" fill="${accent}" />
              <circle cx="0" cy="0" r="40" fill="#FFFFFF" stroke="${accent}" stroke-width="3" />
              <circle cx="0" cy="0" r="16" fill="${accent}" />
            </g>
          </g>

          <!-- Glowing Invention Edison Lightbulb (Left) -->
          <g transform="translate(180, 460) scale(0.9)">
            <!-- Glass Bulb -->
            <path d="M -30,-20 C -45,-50 -20,-80 0,-80 C 20,-80 45,-50 30,-20 C 22,-5 15,10 15,20 L -15,20 C -15,10 -22,-5 -30,-20 Z" fill="#FEF08A" opacity="0.85" stroke="${accent}" stroke-width="3" />
            <!-- Glowing Filament -->
            <path d="M -8,0 L -8,-45 Q 0,-60 8,-45 L 8,0" fill="none" stroke="#EA580C" stroke-width="3" />
            <!-- Screw Base -->
            <rect x="-14" y="20" width="28" height="6" rx="2" fill="#94A3B8" />
            <rect x="-14" y="28" width="28" height="6" rx="2" fill="#94A3B8" />
            <rect x="-10" y="36" width="20" height="6" rx="3" fill="#64748B" />
          </g>
        </g>
      `;

    // =========================================================================
    // 03, 04, 05, 06. matières françaises (Français, Lecture, Grammaire...)
    // =========================================================================
    case 'francais':
    case 'production_ecrite_fr':
    case 'lecture_fr':
    case 'grammaire_fr':
      return `
        <!-- French Scholarly Stationery: Classic Hardbound Book, Gold-Nib Fountain Pen, Alphabet Blocks -->
        <g id="scene-francais" opacity="0.95">
          <!-- Delicate French Academic Framing -->
          <g opacity="0.25">
            <circle cx="400" cy="500" r="210" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="10 8" />
          </g>

          <!-- Open Classical Hardbound Book (Center) -->
          <g transform="translate(400, 520)">
            <ellipse cx="0" cy="80" rx="180" ry="20" fill="#000000" opacity="0.14" />
            <path d="M -160,30 Q -80,50 0,55 Q 80,50 160,30 L 160,45 Q 80,65 0,70 Q -80,65 -160,45 Z" fill="${primary}" />
            <!-- Open Pages -->
            <path d="M 0,45 C -50,40 -110,30 -150,10 L -150,-50 C -110,-30 -50,-20 0,-15 Z" fill="#FFFDF8" stroke="${primary}" stroke-width="2" />
            <path d="M 0,45 C 50,40 110,30 150,10 L 150,-50 C 110,-30 50,-20 0,-15 Z" fill="#FFFDF8" stroke="${primary}" stroke-width="2" />
            <!-- Script Rules -->
            <line x1="-130" y1="-20" x2="-20" y2="-5" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <line x1="-125" y1="0" x2="-20" y2="15" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <line x1="-120" y1="20" x2="-20" y2="35" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <line x1="20" y1="-5" x2="130" y2="-20" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <line x1="20" y1="15" x2="125" y2="0" stroke="${secondary}" stroke-width="2" opacity="0.4" />
            <line x1="20" y1="35" x2="120" y2="20" stroke="${secondary}" stroke-width="2" opacity="0.4" />
          </g>

          <!-- Luxurious Fountain Pen with Gold Nib (Angled Across) -->
          <g transform="translate(320, 420) rotate(-35) scale(0.95)">
            <rect x="-7" y="-95" width="14" height="155" rx="5" fill="${primary}" stroke="#0F172A" stroke-width="2" />
            <!-- Gold Clip -->
            <rect x="5" y="-85" width="4" height="40" rx="1.5" fill="${accent}" />
            <rect x="-8" y="20" width="16" height="8" fill="${accent}" />
            <!-- Gold Nib -->
            <polygon points="-7,60 0,90 7,60" fill="${accent}" stroke="#B45309" stroke-width="1.5" />
            <line x1="0" y1="62" x2="0" y2="84" stroke="#78350F" stroke-width="1.5" />
            <circle cx="0" cy="74" r="1.5" fill="#78350F" />
          </g>

          <!-- Wooden Alphabet Blocks: A, B, C (Left) -->
          <g transform="translate(180, 500) scale(0.85)">
            <!-- Block A -->
            <rect x="-24" y="-24" width="48" height="48" rx="8" fill="#FDE047" stroke="#CA8A04" stroke-width="2.5" />
            <text x="0" y="10" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" fill="#1E3A8A" text-anchor="middle">A</text>
            <!-- Block B -->
            <rect x="15" y="-55" width="42" height="42" rx="7" fill="#F43F5E" stroke="#E11D48" stroke-width="2" />
            <text x="36" y="-25" font-family="'Outfit', sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">B</text>
          </g>

          <!-- Vintage Ink Pot with Shimmer (Right) -->
          <g transform="translate(580, 470) scale(0.9)">
            <ellipse cx="0" cy="35" rx="35" ry="10" fill="#000000" opacity="0.12" />
            <rect x="-26" y="-15" width="52" height="45" rx="10" fill="${primary}" opacity="0.9" stroke="#FFFFFF" stroke-width="2" />
            <rect x="-16" y="-28" width="32" height="14" rx="4" fill="${accent}" />
          </g>
        </g>
      `;

    // =========================================================================
    // 07. English Notebook
    // =========================================================================
    case 'anglais':
      return `
        <!-- English: London Double-Decker Bus, Big Ben Clock Silhouette, ABC Flag & School Satchel -->
        <g id="scene-anglais" opacity="0.95">
          <!-- British & International School Aura -->
          <g opacity="0.25">
            <circle cx="400" cy="500" r="200" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="10 6" />
          </g>

          <!-- Iconic Red Double-Decker Bus (Center) -->
          <g transform="translate(400, 490) scale(0.95)">
            <ellipse cx="0" cy="65" rx="140" ry="18" fill="#000000" opacity="0.14" />
            <!-- Bus Body -->
            <rect x="-120" y="-60" width="240" height="110" rx="16" fill="#DC2626" stroke="#991B1B" stroke-width="3" />
            <!-- Lower Floor Windows -->
            <rect x="-105" y="0" width="35" height="30" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="-60" y="0" width="35" height="30" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="-15" y="0" width="35" height="30" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="30" y="0" width="35" height="30" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="75" y="-10" width="35" height="40" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <!-- Upper Floor Windows -->
            <rect x="-105" y="-48" width="35" height="28" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="-60" y="-48" width="35" height="28" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="-15" y="-48" width="35" height="28" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="30" y="-48" width="35" height="28" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <rect x="75" y="-48" width="35" height="28" rx="5" fill="#E0F2FE" stroke="#334155" stroke-width="2" />
            <!-- Yellow Destination Banner -->
            <rect x="-95" y="-15" width="120" height="10" rx="2" fill="#FDE047" />
            <!-- Wheels -->
            <circle cx="-65" cy="52" r="20" fill="#1E293B" stroke="#94A3B8" stroke-width="4" />
            <circle cx="-65" cy="52" r="8" fill="#CBD5E1" />
            <circle cx="65" cy="52" r="20" fill="#1E293B" stroke="#94A3B8" stroke-width="4" />
            <circle cx="65" cy="52" r="8" fill="#CBD5E1" />
          </g>

          <!-- Big Ben Clock Tower Silhouette (Right) -->
          <g transform="translate(620, 460) scale(0.85)">
            <rect x="-18" y="-70" width="36" height="120" fill="#1E3A8A" opacity="0.8" />
            <polygon points="0,-120 -24,-70 24,-70" fill="#1E3A8A" opacity="0.9" />
            <circle cx="0" cy="-45" r="14" fill="#FFFFFF" stroke="#F59E0B" stroke-width="2" />
            <line x1="0" y1="-45" x2="0" y2="-53" stroke="#1E293B" stroke-width="2" />
            <line x1="0" y1="-45" x2="6" y2="-45" stroke="#1E293B" stroke-width="2" />
          </g>

          <!-- ABC Speech Bubble (Left) -->
          <g transform="translate(180, 440) scale(0.9)">
            <rect x="-40" y="-30" width="80" height="55" rx="14" fill="#FFFFFF" stroke="${primary}" stroke-width="3" />
            <polygon points="-10,25 0,40 10,25" fill="#FFFFFF" stroke="${primary}" stroke-width="3" />
            <text x="0" y="8" font-family="'Outfit', sans-serif" font-size="22" font-weight="900" fill="${primary}" text-anchor="middle">ABC</text>
          </g>
        </g>
      `;

    // =========================================================================
    // 21, 23. كرّاس التمارين وكراس الدفاتر (Exercices & Devoirs)
    // =========================================================================
    case 'exercices':
    case 'devoirs':
      return `
        <!-- Homework / Exercises: Study Desk, Validation Badges (✓ 10/10), Golden Trophy Cup, Clock -->
        <g id="scene-devoirs" opacity="0.95">
          <!-- Achievement Star Aura -->
          <g opacity="0.25">
            <circle cx="400" cy="500" r="190" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="8 6" />
          </g>

          <!-- Open Workbook with Neat Green Checkmarks (Center) -->
          <g transform="translate(400, 520)">
            <ellipse cx="0" cy="70" rx="170" ry="18" fill="#000000" opacity="0.12" />
            <rect x="-140" y="-45" width="280" height="100" rx="8" fill="#FFFFFF" stroke="${primary}" stroke-width="3" />
            <line x1="0" y1="-45" x2="0" y2="55" stroke="${primary}" stroke-width="2" stroke-dasharray="4 3" />
            <!-- Homework Checkmarks -->
            <path d="M -100,-15 L -85,0 L -60,-25" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" />
            <path d="M -100,20 L -85,35 L -60,10" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" />
            <path d="M 40,-15 L 55,0 L 80,-25" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" />
            <path d="M 40,20 L 55,35 L 80,10" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" />
          </g>

          <!-- Golden Champion Trophy Cup (Right) -->
          <g transform="translate(580, 480) scale(0.9)">
            <ellipse cx="0" cy="65" rx="35" ry="10" fill="#000000" opacity="0.14" />
            <!-- Pedestal -->
            <rect x="-25" y="45" width="50" height="18" rx="4" fill="#78350F" />
            <rect x="-10" y="25" width="20" height="22" fill="#D97706" />
            <!-- Cup Body -->
            <path d="M -35,-40 C -35,15 -15,25 0,25 C 15,25 35,15 35,-40 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2.5" />
            <!-- Handles -->
            <path d="M -35,-30 Q -55,-10 -30,10" fill="none" stroke="#D97706" stroke-width="4" />
            <path d="M 35,-30 Q 55,-10 30,10" fill="none" stroke="#D97706" stroke-width="4" />
            <!-- Star on Cup -->
            <polygon points="0,-18 4,-6 16,-6 6,2 10,14 0,6 -10,14 -6,2 -16,-6 -4,-6" fill="#FFFFFF" />
          </g>

          <!-- Desk Alarm Clock (Left) -->
          <g transform="translate(200, 480) scale(0.85)">
            <ellipse cx="0" cy="55" rx="30" ry="8" fill="#000000" opacity="0.14" />
            <!-- Twin Bells -->
            <circle cx="-28" cy="-35" r="12" fill="${accent}" />
            <circle cx="28" cy="-35" r="12" fill="${accent}" />
            <!-- Clock Face -->
            <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="${primary}" stroke-width="4" />
            <!-- Clock Hands -->
            <line x1="0" y1="0" x2="0" y2="-22" stroke="#0F172A" stroke-width="3" stroke-linecap="round" />
            <line x1="0" y1="0" x2="16" y2="0" stroke="#0F172A" stroke-width="3" stroke-linecap="round" />
            <!-- Legs -->
            <line x1="-25" y1="35" x2="-35" y2="50" stroke="${primary}" stroke-width="4" />
            <line x1="25" y1="35" x2="35" y2="50" stroke="${primary}" stroke-width="4" />
          </g>
        </g>
      `;

    // =========================================================================
    // 24. Cahier de brouillon
    // =========================================================================
    case 'brouillon':
      return `
        <!-- Brouillon: Soaring Origami Paper Plane, Graph Paper Blueprint, Wooden Pencil & Eraser -->
        <g id="scene-brouillon" opacity="0.95">
          <!-- Looping Flight Path of Paper Plane -->
          <path d="M 160,540 C 220,620 320,600 350,500 C 380,400 460,360 550,420" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="10 8" />

          <!-- Origami Paper Plane in Flight -->
          <g transform="translate(540, 420) rotate(-20) scale(0.95)">
            <polygon points="-60,10 60,0 0,-40" fill="#FFFFFF" stroke="${primary}" stroke-width="2.5" />
            <polygon points="-60,10 60,0 15,20" fill="#E2E8F0" stroke="${primary}" stroke-width="2" />
            <polygon points="0,-40 60,0 20,-10" fill="#CBD5E1" />
          </g>

          <!-- Large Wooden Pencil Angled (Center) -->
          <g transform="translate(340, 520) rotate(35) scale(0.95)">
            <rect x="-10" y="-120" width="20" height="180" rx="4" fill="${accent}" stroke="#B45309" stroke-width="2" />
            <!-- Eraser on end -->
            <rect x="-10" y="60" width="20" height="25" rx="3" fill="#F43F5E" />
            <rect x="-11" y="52" width="22" height="10" fill="#CBD5E1" />
            <!-- Sharpened Wood & Graphite Lead -->
            <polygon points="-10,-120 10,-120 0,-155" fill="#FDE68A" />
            <polygon points="-3,-142 3,-142 0,-155" fill="#1E293B" />
          </g>

          <!-- Two-Color Rubber Eraser (Left) -->
          <g transform="translate(200, 500) scale(0.85)">
            <polygon points="-35,10 0,-15 35,-15 0,10" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.5" />
            <polygon points="-35,10 0,10 0,30 -35,30" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5" />
            <polygon points="0,10 35,-15 35,5 0,30" fill="#DC2626" />
          </g>
        </g>
      `;

    // =========================================================================
    // 25. Cahier de correspondance
    // =========================================================================
    case 'correspondance':
      return `
        <!-- Correspondance: Postal Airmail Envelope, Wax Stamp, Friendly Mailbox & Date Stamp -->
        <g id="scene-correspondance" opacity="0.95">
          <!-- Postal Waves Backdrop -->
          <g opacity="0.3">
            <path d="M 120,420 Q 260,360 400,420 Q 540,480 680,420" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="12 6" />
          </g>

          <!-- Large Postal Envelope (Center) -->
          <g transform="translate(400, 500) scale(0.95)">
            <ellipse cx="0" cy="70" rx="160" ry="18" fill="#000000" opacity="0.14" />
            <!-- Envelope Shell -->
            <rect x="-140" y="-60" width="280" height="120" rx="12" fill="#FFFFFF" stroke="${primary}" stroke-width="3" />
            <!-- Triangular Flap Lines -->
            <line x1="-140" y1="-60" x2="0" y2="15" stroke="${primary}" stroke-width="2.5" />
            <line x1="140" y1="-60" x2="0" y2="15" stroke="${primary}" stroke-width="2.5" />
            <line x1="-140" y1="60" x2="-35" y2="-5" stroke="${secondary}" stroke-width="1.5" />
            <line x1="140" y1="60" x2="35" y2="-5" stroke="${secondary}" stroke-width="1.5" />
            <!-- Red Official School Wax Seal -->
            <circle cx="0" cy="15" r="22" fill="#DC2626" stroke="#991B1B" stroke-width="2" />
            <circle cx="0" cy="15" r="16" fill="#B91C1C" />
            <polygon points="0,5 5,13 14,13 7,19 10,27 0,22 -10,27 -7,19 -14,13 -5,13" fill="#FDE047" />
            <!-- Postage Stamp (Top-Right) -->
            <rect x="85" y="-50" width="42" height="50" rx="3" fill="#F0FDFA" stroke="#0D9488" stroke-width="2" stroke-dasharray="4 2" />
            <circle cx="106" cy="-25" r="10" fill="${secondary}" opacity="0.4" />
          </g>

          <!-- Friendly Curbside Mailbox (Left) -->
          <g transform="translate(200, 480) scale(0.85)">
            <ellipse cx="0" cy="65" rx="30" ry="8" fill="#000000" opacity="0.14" />
            <rect x="-18" y="20" width="36" height="45" fill="#64748B" />
            <!-- Mailbox Chamber -->
            <path d="M -30,20 L -30,-20 A 30 30 0 0 1 30,-20 L 30,20 Z" fill="${primary}" stroke="#1E293B" stroke-width="2.5" />
            <!-- Red Flag Up -->
            <line x1="30" y1="0" x2="45" y2="-30" stroke="#DC2626" stroke-width="4" />
            <rect x="42" y="-45" width="22" height="16" fill="#DC2626" />
          </g>
        </g>
      `;

    // =========================================================================
    // 26. Autre – Spécifier / Universal Scholarly Crest
    // =========================================================================
    case 'autre':
    default:
      return `
        <!-- Universal Premium School Crest: Grand Encyclopedia, Academic Torch of Wisdom, Laurel Garland -->
        <g id="scene-universal" opacity="0.95">
          <!-- Prestigious Radial Starburst Backdrop -->
          <g opacity="0.25">
            <circle cx="400" cy="500" r="190" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="10 8" />
            <circle cx="400" cy="500" r="230" fill="none" stroke="${accent}" stroke-width="1.5" />
          </g>

          <!-- Grand Open Encyclopedia (Center) -->
          <g transform="translate(400, 520)">
            <ellipse cx="0" cy="75" rx="180" ry="18" fill="#000000" opacity="0.14" />
            <path d="M -160,25 Q -80,50 0,55 Q 80,50 160,25 L 160,40 Q 80,65 0,70 Q -80,65 -160,40 Z" fill="${primary}" />
            <path d="M 0,45 C -50,40 -110,30 -150,10 L -150,-50 C -110,-30 -50,-20 0,-15 Z" fill="#FFFDF8" stroke="${primary}" stroke-width="2" />
            <path d="M 0,45 C 50,40 110,30 150,10 L 150,-50 C 110,-30 50,-20 0,-15 Z" fill="#FFFDF8" stroke="${primary}" stroke-width="2" />
            <!-- Bookmark Ribbon -->
            <path d="M 0,-15 Q 12,25 -2,55 L 6,55 Q 16,20 0,-15 Z" fill="${accent}" />
          </g>

          <!-- Academic Torch of Wisdom / Enlightenment (Center-Top) -->
          <g transform="translate(400, 400) scale(0.95)">
            <!-- Torch Handle -->
            <polygon points="-10,30 10,30 6,80 -6,80" fill="#92400E" stroke="#451A03" stroke-width="2" />
            <!-- Brass Bowl -->
            <polygon points="-25,30 25,30 15,10 -15,10" fill="${accent}" stroke="#B45309" stroke-width="2" />
            <!-- Radiant Flame -->
            <path d="M 0,-30 C -20,0 -15,10 0,10 C 15,10 20,0 0,-30 Z" fill="#EF4444" />
            <path d="M 0,-20 C -10,-5 -8,5 0,5 C 8,5 10,-5 0,-20 Z" fill="#FDE047" />
          </g>

          <!-- Laurel Branches of Academic Excellence -->
          <g transform="translate(400, 500)" opacity="0.6">
            <!-- Left Branch -->
            <path d="M -160,0 C -180,-40 -170,-90 -130,-120" fill="none" stroke="${primary}" stroke-width="3" />
            <ellipse cx="-170" cy="-60" rx="12" ry="6" fill="${accent}" transform="rotate(30 -170 -60)" />
            <ellipse cx="-155" cy="-95" rx="12" ry="6" fill="${accent}" transform="rotate(15 -155 -95)" />
            <ellipse cx="-130" cy="-120" rx="12" ry="6" fill="${accent}" transform="rotate(0 -130 -120)" />
            <!-- Right Branch -->
            <path d="M 160,0 C 180,-40 170,-90 130,-120" fill="none" stroke="${primary}" stroke-width="3" />
            <ellipse cx="170" cy="-60" rx="12" ry="6" fill="${accent}" transform="rotate(-30 170 -60)" />
            <ellipse cx="155" cy="-95" rx="12" ry="6" fill="${accent}" transform="rotate(-15 155 -95)" />
            <ellipse cx="130" cy="-120" rx="12" ry="6" fill="${accent}" transform="rotate(0 130 -120)" />
          </g>
        </g>
      `;
  }
}

/**
 * Generates an ultra-crisp, high-definition SVG background for any template of any subject.
 * Guaranteed:
 * - NO readable text of any kind
 * - titleZone reserved (clean canvas)
 * - infoZone reserved (clean canvas)
 * - Subject-specific colors and visual universe
 * - 5 Distinct Art Directions with unique aesthetic signatures
 */
export function generateCleanSubjectCoverSvg(
  subject: SubjectDefinition,
  template: CoverTemplate,
  width: number = 800,
  height: number = 1131
): string {
  const primary = template.palette[0] || '#2563EB';
  const secondary = template.palette[1] || '#0D9488';
  const bg = template.palette[2] || '#F8FAFC';
  const accent = template.palette[3] || '#F59E0B';
  const lightBg = template.palette[4] || '#FFFFFF';

  // Geometry
  const titleY = (template.titleZone.y / 100) * height;
  const titleH = (template.titleZone.height / 100) * height;
  const infoY = (template.infoZone.y / 100) * height;
  const infoH = (template.infoZone.height / 100) * height;

  const subjectMotifs = getSubjectDecorativeMotifs(subject, template.palette);
  const artDirection = template.artDirection || 'premium_school';

  // Art-direction specific decorative elements and frame borders
  let artDirectionSpecificSvg = '';

  switch (artDirection) {
    case 'cute_school':
      artDirectionSpecificSvg = `
        <!-- Cute School Kawaii Accents: soft floating clouds, candy stars & confetti -->
        <g opacity="0.85">
          <!-- Floating cute clouds -->
          <path d="M 60,180 Q 80,150 110,165 Q 140,150 160,180 Q 180,210 140,220 L 70,220 Q 40,210 60,180 Z" fill="#FFFFFF" opacity="0.65" />
          <path d="M ${width - 180},210 Q ${width - 160},180 ${width - 130},195 Q ${width - 100},180 ${width - 80},210 Q ${width - 60},240 ${width - 100},250 L ${width - 170},250 Q ${width - 200},240 ${width - 180},210 Z" fill="#FFFFFF" opacity="0.6" />
          <!-- Kawaii pastel stars -->
          <polygon points="120,290 126,305 142,308 130,320 133,336 120,328 107,336 110,320 98,308 114,305" fill="${accent}" opacity="0.8" />
          <polygon points="${width - 140},310 ${width - 134},325 ${width - 118},328 ${width - 130},340 ${width - 127},356 ${width - 140},348 ${width - 153},356 ${width - 150},340 ${width - 162},328 ${width - 146},325" fill="${secondary}" opacity="0.75" />
          <polygon points="100,620 105,632 118,634 108,644 110,657 100,650 90,657 92,644 82,634 95,632" fill="${primary}" opacity="0.6" />
          <polygon points="${width - 110},630 ${width - 105},642 ${width - 92},644 ${width - 102},654 ${width - 100},667 ${width - 110},660 ${width - 120},667 ${width - 118},654 ${width - 128},644 ${width - 115},642" fill="${accent}" opacity="0.75" />
          <!-- Sweet pastel confetti dots -->
          <circle cx="90" cy="240" r="5" fill="${secondary}" opacity="0.5" />
          <circle cx="150" cy="260" r="3.5" fill="${primary}" opacity="0.4" />
          <circle cx="${width - 100}" cy="270" r="4.5" fill="${accent}" opacity="0.5" />
          <circle cx="${width - 160}" cy="290" r="3" fill="${secondary}" opacity="0.4" />
        </g>
        <!-- Cute scalloped outer candy frame -->
        <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="32" fill="none" stroke="${secondary}" stroke-width="3.5" stroke-dasharray="14 10" opacity="0.65" />
        <rect x="34" y="34" width="${width - 68}" height="${height - 68}" rx="24" fill="none" stroke="${primary}" stroke-width="1.5" opacity="0.3" />
      `;
      break;

    case 'paper_craft':
      artDirectionSpecificSvg = `
        <!-- Paper Craft Layered Topography and Die-Cut Relief Silhouette Shadows -->
        <g opacity="0.8">
          <!-- Layer 1 Paper Cut Framing Curve (Top) -->
          <path d="M 0,0 L ${width},0 L ${width},180 C ${width * 0.75},150 ${width * 0.6},210 ${width * 0.4},160 C ${width * 0.25},120 100,190 0,140 Z" fill="${primary}" opacity="0.09" />
          <!-- Layer 2 Paper Cut Framing Curve (Left Edge) -->
          <path d="M 0,140 Q 90,320 50,520 Q 10,720 70,880 L 0,900 Z" fill="${secondary}" opacity="0.12" />
          <!-- Layer 3 Paper Cut Framing Curve (Right Edge) -->
          <path d="M ${width},180 Q ${width - 90},360 ${width - 50},560 Q ${width - 10},760 ${width - 70},900 L ${width},920 Z" fill="${accent}" opacity="0.1" />
          <!-- Realistic die-cut paper corner folds -->
          <polygon points="20,20 80,20 20,80" fill="${primary}" opacity="0.18" />
          <polygon points="${width - 20},20 ${width - 80},20 ${width - 20},80" fill="${primary}" opacity="0.18" />
          <polygon points="20,${height - 20} 80,${height - 20} 20,${height - 80}" fill="${secondary}" opacity="0.18" />
          <polygon points="${width - 20},${height - 20} ${width - 80},${height - 20} ${width - 20},${height - 80}" fill="${secondary}" opacity="0.18" />
        </g>
        <!-- Double paper edge relief border -->
        <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="16" fill="none" stroke="${primary}" stroke-width="2" opacity="0.4" />
        <rect x="32" y="32" width="${width - 64}" height="${height - 64}" rx="12" fill="none" stroke="${secondary}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.35" />
      `;
      break;

    case 'doodle_academy':
      artDirectionSpecificSvg = `
        <!-- Doodle Academy: Notebook Grid, hand-drawn scholastic doodles & washi tape -->
        <g opacity="0.8">
          <!-- Top Left Washi Tape -->
          <polygon points="35,15 95,30 85,55 25,40" fill="${accent}" opacity="0.45" />
          <!-- Top Right Washi Tape -->
          <polygon points="${width - 95},30 ${width - 35},15 ${width - 25},40 ${width - 85},55" fill="${secondary}" opacity="0.45" />
          <!-- Playful Hand-Drawn Notebook Doodles along borders -->
          <!-- Small paper clip at top-left -->
          <path d="M 45,110 L 45,75 A 12 12 0 0 1 69,75 L 69,120 A 18 18 0 0 1 33,120 L 33,85" fill="none" stroke="${primary}" stroke-width="3" stroke-linecap="round" opacity="0.6" />
          <!-- Hand-drawn pencil motif at right border -->
          <g transform="translate(${width - 55}, 460) rotate(45)" opacity="0.6">
            <rect x="-8" y="-40" width="16" height="70" rx="3" fill="${accent}" opacity="0.4" />
            <polygon points="-8,-40 0,-56 8,-40" fill="#334155" />
            <rect x="-8" y="24" width="16" height="10" fill="${primary}" opacity="0.5" />
          </g>
          <!-- Ruler graduation hatch marks along left margin -->
          <g transform="translate(38, 300)" opacity="0.45">
            <line x1="0" y1="0" x2="16" y2="0" stroke="${primary}" stroke-width="2" />
            <line x1="0" y1="15" x2="10" y2="15" stroke="${primary}" stroke-width="1.5" />
            <line x1="0" y1="30" x2="10" y2="30" stroke="${primary}" stroke-width="1.5" />
            <line x1="0" y1="45" x2="16" y2="45" stroke="${primary}" stroke-width="2" />
            <line x1="0" y1="60" x2="10" y2="60" stroke="${primary}" stroke-width="1.5" />
            <line x1="0" y1="75" x2="10" y2="75" stroke="${primary}" stroke-width="1.5" />
            <line x1="0" y1="90" x2="16" y2="90" stroke="${primary}" stroke-width="2" />
          </g>
          <!-- Star doodles -->
          <path d="M ${width - 50},240 L ${width - 45},252 L ${width - 32},254 L ${width - 42},263 L ${width - 39},276 L ${width - 50},270 L ${width - 61},276 L ${width - 58},263 L ${width - 68},254 L ${width - 55},252 Z" fill="none" stroke="${accent}" stroke-width="2" opacity="0.7" />
        </g>
        <!-- Hand-drawn scribble-style border -->
        <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="14" fill="none" stroke="${primary}" stroke-width="2.5" opacity="0.5" />
        <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="10" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.35" />
      `;
      break;

    case 'luxury_education':
      artDirectionSpecificSvg = `
        <!-- Luxury Education: Gold filigree, classical academic laurels & heraldic rosettes -->
        <g opacity="0.9">
          <!-- Classical Laurel Leaf Garlands Framing Central Zone -->
          <g transform="translate(65, 480)" opacity="0.5">
            <!-- Left Laurel branch -->
            <path d="M 0,-120 C 15,-60 15,60 0,120" fill="none" stroke="#D97706" stroke-width="2.5" />
            <ellipse cx="14" cy="-90" rx="9" ry="5" fill="#F59E0B" transform="rotate(30, 14, -90)" opacity="0.75" />
            <ellipse cx="16" cy="-45" rx="9" ry="5" fill="#F59E0B" transform="rotate(20, 16, -45)" opacity="0.75" />
            <ellipse cx="17" cy="0" rx="9" ry="5" fill="#F59E0B" transform="rotate(0, 17, 0)" opacity="0.75" />
            <ellipse cx="16" cy="45" rx="9" ry="5" fill="#F59E0B" transform="rotate(-20, 16, 45)" opacity="0.75" />
            <ellipse cx="14" cy="90" rx="9" ry="5" fill="#F59E0B" transform="rotate(-30, 14, 90)" opacity="0.75" />
          </g>
          <g transform="translate(${width - 65}, 480)" opacity="0.5">
            <!-- Right Laurel branch -->
            <path d="M 0,-120 C -15,-60 -15,60 0,120" fill="none" stroke="#D97706" stroke-width="2.5" />
            <ellipse cx="-14" cy="-90" rx="9" ry="5" fill="#F59E0B" transform="rotate(-30, -14, -90)" opacity="0.75" />
            <ellipse cx="-16" cy="-45" rx="9" ry="5" fill="#F59E0B" transform="rotate(-20, -16, -45)" opacity="0.75" />
            <ellipse cx="-17" cy="0" rx="9" ry="5" fill="#F59E0B" transform="rotate(0, -17, 0)" opacity="0.75" />
            <ellipse cx="-16" cy="45" rx="9" ry="5" fill="#F59E0B" transform="rotate(20, -16, 45)" opacity="0.75" />
            <ellipse cx="-14" cy="90" rx="9" ry="5" fill="#F59E0B" transform="rotate(30, -14, 90)" opacity="0.75" />
          </g>
          <!-- Ornate Classical Corner Rosettes -->
          <!-- Top Left -->
          <circle cx="50" cy="50" r="14" fill="none" stroke="#D97706" stroke-width="2" opacity="0.8" />
          <circle cx="50" cy="50" r="6" fill="#F59E0B" opacity="0.7" />
          <line x1="50" y1="30" x2="50" y2="70" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <line x1="30" y1="50" x2="70" y2="50" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <!-- Top Right -->
          <circle cx="${width - 50}" cy="50" r="14" fill="none" stroke="#D97706" stroke-width="2" opacity="0.8" />
          <circle cx="${width - 50}" cy="50" r="6" fill="#F59E0B" opacity="0.7" />
          <line x1="${width - 50}" y1="30" x2="${width - 50}" y2="70" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <line x1="${width - 70}" y1="50" x2="${width - 30}" y2="50" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <!-- Bottom Left -->
          <circle cx="50" cy="${height - 50}" r="14" fill="none" stroke="#D97706" stroke-width="2" opacity="0.8" />
          <circle cx="50" cy="${height - 50}" r="6" fill="#F59E0B" opacity="0.7" />
          <line x1="50" y1="${height - 70}" x2="50" y2="${height - 30}" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <line x1="30" y1="${height - 50}" x2="70" y2="${height - 50}" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <!-- Bottom Right -->
          <circle cx="${width - 50}" cy="${height - 50}" r="14" fill="none" stroke="#D97706" stroke-width="2" opacity="0.8" />
          <circle cx="${width - 50}" cy="${height - 50}" r="6" fill="#F59E0B" opacity="0.7" />
          <line x1="${width - 50}" y1="${height - 70}" x2="${width - 50}" y2="${height - 30}" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
          <line x1="${width - 70}" y1="${height - 50}" x2="${width - 30}" y2="${height - 50}" stroke="#D97706" stroke-width="1.5" opacity="0.8" />
        </g>
        <!-- Double Gold Pinstripe Editorial Framing -->
        <rect x="26" y="26" width="${width - 52}" height="${height - 52}" rx="10" fill="none" stroke="#D97706" stroke-width="3" opacity="0.7" />
        <rect x="34" y="34" width="${width - 68}" height="${height - 68}" rx="6" fill="none" stroke="#F59E0B" stroke-width="1.5" opacity="0.5" />
      `;
      break;

    case 'premium_school':
    default:
      artDirectionSpecificSvg = `
        <!-- Premium School 3D Pro: Volumetric studio spheres, glowing depth & beveled border -->
        <g opacity="0.85">
          <!-- Ambient 3D Depth Spheres in Background -->
          <circle cx="110" cy="240" r="48" fill="${primary}" opacity="0.12" />
          <circle cx="102" cy="232" r="38" fill="#FFFFFF" opacity="0.25" />
          <circle cx="${width - 110}" cy="260" r="54" fill="${secondary}" opacity="0.12" />
          <circle cx="${width - 118}" cy="252" r="44" fill="#FFFFFF" opacity="0.22" />
          <circle cx="100" cy="630" r="40" fill="${accent}" opacity="0.15" />
          <circle cx="${width - 100}" cy="650" r="45" fill="${primary}" opacity="0.12" />
          <!-- Depth Rings -->
          <circle cx="110" cy="240" r="65" fill="none" stroke="${primary}" stroke-width="2" stroke-dasharray="8 6" opacity="0.2" />
          <circle cx="${width - 110}" cy="260" r="75" fill="none" stroke="${secondary}" stroke-width="2" stroke-dasharray="10 6" opacity="0.2" />
        </g>
        <!-- Modern beveled outer border frame -->
        <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="24" fill="none" stroke="${primary}" stroke-width="3.5" opacity="0.45" />
        <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="18" fill="none" stroke="${secondary}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4" />
        <!-- Corner Cornerpiece Ornaments -->
        <path d="M 28 65 A 37 37 0 0 1 65 28" fill="none" stroke="${accent}" stroke-width="4" opacity="0.8" />
        <circle cx="45" cy="45" r="4" fill="${accent}" opacity="0.9" />
        <path d="M ${width - 65} 28 A 37 37 0 0 1 ${width - 28} 65" fill="none" stroke="${accent}" stroke-width="4" opacity="0.8" />
        <circle cx="${width - 45}" cy="45" r="4" fill="${accent}" opacity="0.9" />
        <path d="M 28 ${height - 65} A 37 37 0 0 0 65 ${height - 28}" fill="none" stroke="${accent}" stroke-width="4" opacity="0.8" />
        <circle cx="45" cy="${height - 45}" r="4" fill="${accent}" opacity="0.9" />
        <path d="M ${width - 65} ${height - 28} A 37 37 0 0 0 ${width - 28} ${height - 65}" fill="none" stroke="${accent}" stroke-width="4" opacity="0.8" />
        <circle cx="${width - 45}" cy="${height - 45}" r="4" fill="${accent}" opacity="0.9" />
      `;
      break;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${lightBg}" />
      <stop offset="40%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${lightBg}" />
    </linearGradient>

    <!-- Accent Top Banner Glow -->
    <radialGradient id="topGlow" cx="50%" cy="15%" r="60%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${primary}" stop-opacity="0" />
    </radialGradient>

    <!-- Pattern -->
    <pattern id="dotPattern" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="14" r="1.5" fill="${secondary}" opacity="0.12" />
    </pattern>
  </defs>

  <!-- Base Canvas -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Subtle Educational Dot Grid -->
  <rect width="${width}" height="${height}" fill="url(#dotPattern)" />

  <!-- Glows -->
  <rect width="${width}" height="${height}" fill="url(#topGlow)" />

  <!-- Art Direction Specific Borders and Visual Accents -->
  ${artDirectionSpecificSvg}

  <!-- Thematic Central Motifs (Respecting reserved title and info zones) -->
  ${subjectMotifs}

  <!-- Reserved Title Zone Soft Base (clean, non-cluttered) -->
  <rect x="50" y="${titleY - 8}" width="${width - 100}" height="${titleH + 16}" rx="18" fill="${lightBg}" opacity="0.45" />

  <!-- Reserved Info Zone Clean Base (leaves space for the unified identification panel) -->
  <rect x="50" y="${infoY - 6}" width="${width - 100}" height="${infoH + 12}" rx="18" fill="${lightBg}" opacity="0.4" />

  <!-- Discreet Brand Rocket Emblem (Clin d'oeil CreaRocket) -->
  <g transform="translate(${width - 65}, 46) scale(0.65)" opacity="0.75">
    <path d="M 0 -20 Q 15 -10 15 15 L -15 15 Q -15 -10 0 -20 Z" fill="${accent}" />
    <polygon points="-15,15 -25,25 -10,22" fill="${primary}" />
    <polygon points="15,15 25,25 10,22" fill="${primary}" />
    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
    <polygon points="-5,17 0,27 5,17" fill="#EF4444" />
  </g>
</svg>
`;

  return svgToDataUri(svg);
}
