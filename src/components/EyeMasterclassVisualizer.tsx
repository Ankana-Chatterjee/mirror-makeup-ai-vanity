import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  HelpCircle, 
  ChevronRight, 
  Info, 
  Check, 
  Sliders, 
  Layers, 
  ArrowUpRight,
  Compass,
  Wand2,
  X
} from 'lucide-react';
import { LookMoodId } from '../types/glowguide';

export type LinerStyle = 'winged' | 'cateye' | 'batwing' | 'smudged';
export type ShadowLayer = 'all' | 'base' | 'crease' | 'outerV' | 'shimmer' | 'innerCorner';

interface EyeMasterclassVisualizerProps {
  selectedLook?: LookMoodId;
  activeLinerStyle?: LinerStyle;
  onSelectLinerStyle?: (style: LinerStyle) => void;
  eyeShape?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

// Look-Specific Eyeshadow Color Palettes
export const LOOK_EYESHADOW_PALETTES: Record<LookMoodId, {
  name: string;
  base: { name: string; hex: string; desc: string };
  crease: { name: string; hex: string; desc: string };
  outerV: { name: string; hex: string; desc: string };
  shimmer: { name: string; hex: string; desc: string };
  innerGlow: { name: string; hex: string; desc: string };
  liner: { name: string; hex: string; desc: string };
}> = {
  clean: {
    name: 'Clean Girl',
    base: { name: 'Bone Vanilla', hex: '#fff8ee', desc: 'Sheer satin base to even eyelid veins' },
    crease: { name: 'Soft Muted Taupe', hex: '#c5a898', desc: 'Whisper-light socket definition' },
    outerV: { name: 'Warm Mocha Kiss', hex: '#8a6857', desc: 'Soft shading in outer 1/4 only' },
    shimmer: { name: 'Glass Champagne', hex: '#fdf3d8', desc: 'Dewy sheen pressed onto center lid' },
    innerGlow: { name: 'Fine Silk Pearl', hex: '#ffffff', desc: 'Micro-dot inside inner tear duct' },
    liner: { name: 'Chocolate Tightline', hex: '#3d2b27', desc: 'Fine root-line tightline with subtle micro-flick' },
  },
  everyday: {
    name: 'Natural Everyday',
    base: { name: 'Warm Cream Peach', hex: '#fae8dc', desc: 'Soft warm wash over mobile lid' },
    crease: { name: 'Caramel Macchiato', hex: '#b58265', desc: 'Windshield wiper blend along socket' },
    outerV: { name: 'Deep Espresso Bean', hex: '#5e3a2b', desc: 'V-wedge stamp to elongate eye' },
    shimmer: { name: 'Amber Glow Dust', hex: '#fae3b6', desc: 'Soft metallic pop on mid-lid' },
    innerGlow: { name: 'Champagne Shimmer', hex: '#fff4db', desc: 'Brightening inner corner wake-up' },
    liner: { name: 'Satin Dark Brown', hex: '#2e1c15', desc: 'Classic 4mm wing pointing to brow tail' },
  },
  korean: {
    name: 'Korean Natural',
    base: { name: 'Soft Apricot Milk', hex: '#ffece0', desc: 'Airy blurred wash over entire lid' },
    crease: { name: 'Peach Coral Mousse', hex: '#e8a58c', desc: 'Diffused gradient fading upward' },
    outerV: { name: 'Cinnamon Rose Depth', hex: '#9e5a52', desc: 'Soft outer corner shading' },
    shimmer: { name: 'Aegyo-Sal Crystal', hex: '#fff7e6', desc: 'Under-eye pouch shimmer + lid center' },
    innerGlow: { name: 'Starlight Diamond', hex: '#ffffff', desc: 'Sparkle on inner tear duct' },
    liner: { name: 'Gentle Puppy Brown', hex: '#422822', desc: 'Soft downward-straight lashline flick' },
  },
  glam: {
    name: 'Soft Glam',
    base: { name: 'Warm Linen', hex: '#f9eee3', desc: 'Neutralizing base across lid to brow' },
    crease: { name: 'Warm Sienna Taupe', hex: '#b87352', desc: 'Sculpted deep socket crease line' },
    outerV: { name: 'Smoked Truffle Brown', hex: '#422218', desc: 'Intense outer V wedge contour' },
    shimmer: { name: 'Molten Gold Leaf', hex: '#f7d383', desc: 'High-pigment cut-crease halo shimmer' },
    innerGlow: { name: 'Luminous Moonstone', hex: '#fffbf0', desc: 'Pinpoint inner corner reflective light' },
    liner: { name: 'Intense Carbon Black', hex: '#111015', desc: 'Sleek 6mm elongated winged cat-eye' },
  },
  latina: {
    name: 'Latina-Inspired Glam',
    base: { name: 'Golden Sand', hex: '#f7e2c8', desc: 'Warm golden base across mobile lid' },
    crease: { name: 'Terracotta Rust', hex: '#c05634', desc: 'Bold warm blended crease arc' },
    outerV: { name: 'Charcoal Cocoa', hex: '#2c1815', desc: 'Deep smoked outer V blend' },
    shimmer: { name: 'Bronze Goddess Pearl', hex: '#e8b87d', desc: 'Drenched metallic bronze lid' },
    innerGlow: { name: 'Liquid 24K Gold', hex: '#fce395', desc: 'Inner duct + lower inner rim shimmer' },
    liner: { name: 'Midnight Feline Black', hex: '#0a090b', desc: 'Dramatic 7mm wing + sharp inner corner beak flick' },
  },
  editorial: {
    name: 'Creative / Editorial',
    base: { name: 'Frosted Lilac Bone', hex: '#f0e6f7', desc: 'Matte blank canvas across whole eye area' },
    crease: { name: 'Floating Mauve Line', hex: '#985aa6', desc: 'Floating negative-space crease arc' },
    outerV: { name: 'Deep Royal Plum', hex: '#43194f', desc: 'Graphic structural angle edge' },
    shimmer: { name: 'Duochrome Violet Pop', hex: '#d9a3f5', desc: 'Reflective chromatic center pop' },
    innerGlow: { name: 'Holographic Silver', hex: '#ffffff', desc: 'Graphic starburst inner corner point' },
    liner: { name: 'Graphic Pitch Jet', hex: '#000000', desc: 'Double winged or floating geometric liner' },
  },
};

// Eyeliner Technique Rules
export const LINER_GUIDES: Record<LinerStyle, {
  title: string;
  tagline: string;
  uptoWhere: string;
  step1: string;
  step2: string;
  step3: string;
  bestFor: string;
  angleTip: string;
}> = {
    winged: {
      title: 'Classic Winged Eyeliner',
      tagline: 'Timeless, lifted 4–6mm wing for all eye shapes',
      uptoWhere: 'Extend 4mm–6mm past outer fold, pointing toward the tail of your eyebrow (40°–45° angle). Stop before reaching brow tail.',
      step1: 'Tightline: Trace a micro-thin line into the base of lash roots from center outward.',
      step2: 'The Guideline Flick: Look straight into the mirror. Imagine an extension line continuing from your lower waterline upward toward the end of your eyebrow tail. Flick a thin line 4–5mm out.',
      step3: 'Connect & Fill: From the very tip of that flick, draw a straight line back down into the outer third of the upper lash line to make an open triangle. Fill it in with black/espresso.',
      bestFor: 'Almond, round, deep-set, and oval eyes looking for versatile daytime to evening lift.',
      angleTip: 'Keep your chin slightly lifted and look down into the mirror to keep the eyelid taut without pulling on skin.',
    },
    cateye: {
      title: 'Dramatic Cat-Eye (Feline Flick)',
      tagline: 'Exotic feline elongation with inner tear-duct point',
      uptoWhere: 'Extend 6mm–8mm upward at a sharper 50° angle, plus a 2mm pinpoint inner-corner beak flick.',
      step1: 'Full Lash Line: Draw from inner third to outer corner, thickening slightly over the outer pupil.',
      step2: 'Extended Wing: Flick 6–8mm past outer corner. Connect back into a bolder, slightly curved triangle.',
      step3: 'Inner Feline Beak: With an ultra-fine brush, extend a tiny 1.5–2mm triangular beak straight out from the inner tear duct, pointing gently down toward the nose bridge.',
      bestFor: 'Almond, upturned, and round eyes seeking sultry, snatched Mediterranean/Latina glamour.',
      angleTip: 'Never close your eye while drawing the wing; open eyes ensure the wing doesn’t droop or get hidden under the crease.',
    },
    batwing: {
      title: 'Hooded Eye Batwing Technique',
      tagline: 'The viral MUA secret so liner never disappears under hooded folds',
      uptoWhere: 'Extend wing straight across the outer hood fold with eyes open looking directly ahead, then connect back down.',
      step1: 'Look Straight Ahead: Keep eyes relaxed and open. Do not stretch lid! Draw your wing line straight across the hood fold toward the brow tail.',
      step2: 'The Batwing Notch: When you relax and look down, you will see a stepped "batwing" notch or diamond shape over the fold. Connect that notch back to your lashline.',
      step3: 'Fill the Wing: When your eyes are open, the notch disappears into a seamless, razor-sharp straight wing that never gets swallowed!',
      bestFor: 'Hooded eyes, deep-set eyes, and mature eyelids with outer crease overlap.',
      angleTip: 'Drawing eyeliner with eyes closed on hooded eyes causes the line to bend and hide once opened. Always sketch with eyes open!',
    },
    smudged: {
      title: 'Soft Smudged Cocoa Liner',
      tagline: 'Effortless Parisian smoky definition without harsh edges',
      uptoWhere: 'Extend 3mm–4mm softly past outer corner, feathered out with a pencil brush.',
      step1: 'Gel/Kohl Pencil: Trace a rich dark brown or espresso gel pencil along the outer half of the lashes.',
      step2: 'Flick While Wet: Before the gel sets (30 seconds), take a small angled pencil brush and flick the outer corner upward 4mm.',
      step3: 'Shadow Seal: Tap deep cocoa powder shadow over the pencil with a pressing motion to diffuse the edge and prevent creasing.',
      bestFor: 'Everyday natural, soft glam, mature skin, and beginners who find liquid liner tricky.',
      angleTip: 'Use a dark brown rather than harsh stark black for a more youthful, diffused illusion of fuller lashes.',
    },
  };

export const EyeMasterclassVisualizer: React.FC<EyeMasterclassVisualizerProps> = ({
  selectedLook = 'clean',
  activeLinerStyle = 'winged',
  onSelectLinerStyle,
  eyeShape = 'hooded',
  isOpen = false,
  onClose,
}) => {
  const [currentLiner, setCurrentLiner] = useState<LinerStyle>(activeLinerStyle);
  const [activeZone, setActiveZone] = useState<ShadowLayer>('all');
  const [highlightStep, setHighlightStep] = useState<number>(0);

  const handleLinerChange = (style: LinerStyle) => {
    setCurrentLiner(style);
    if (onSelectLinerStyle) {
      onSelectLinerStyle(style);
    }
  };

  const palette = LOOK_EYESHADOW_PALETTES[selectedLook] || LOOK_EYESHADOW_PALETTES.clean;
  const currentLinerData = LINER_GUIDES[currentLiner];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#eadde1] shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-[#fff5f7] via-[#fffdfc] to-[#f8f1f4] border-b border-[#f4ebeb] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#c45b78] text-white flex items-center justify-center shadow-xs">
            <Eye className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm text-[#29202a] tracking-tight flex items-center gap-2">
              <span>Eye Application & Liner Masterclass</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8e7ec] text-[#c45b78] font-bold">
                LOOK: {palette.name.toUpperCase()}
              </span>
            </h3>
            <p className="text-[11px] text-[#766b77] mt-0.5">
              Exact wing trajectory, stop points & 5-zone eyeshadow color architecture
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Masterclass Body */}
      <div className="p-4 md:p-5 space-y-5">
        
        {/* ======================================================== */}
        {/* 1. INTERACTIVE CLOSE-UP EYE DIAGRAM WITH COLOR ZONES */}
        {/* ======================================================== */}
        <div className="bg-[#1e131b] rounded-2xl p-4 text-white relative overflow-hidden shadow-inner border border-stone-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <b className="font-mono text-amber-200 text-[11px] tracking-wide">
                ANATOMICAL EYE PLACEMENT MAP (RIGHT EYE REFERENCE)
              </b>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              WING ANGLE: 42° POINTING TO BROW TAIL
            </span>
          </div>

          {/* SVG Visualizer for Zoomed-In Eye Application */}
          <div className="relative w-full aspect-[21/9] max-h-[220px] flex items-center justify-center">
            <svg
              viewBox="0 0 600 240"
              className="w-full h-full drop-shadow-md select-none"
              role="img"
              aria-label="Close-up anatomical eye diagram with eyeshadow zones and eyeliner wing guide"
            >
              <defs>
                {/* Eyeshadow Gradient Fills using Palette Hex Colors */}
                <radialGradient id="baseWashGrad" cx="45%" cy="55%" r="60%">
                  <stop offset="0%" stopColor={palette.base.hex} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={palette.base.hex} stopOpacity="0.25" />
                </radialGradient>

                <linearGradient id="creaseTransitionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={palette.crease.hex} stopOpacity="0.25" />
                  <stop offset="50%" stopColor={palette.crease.hex} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={palette.crease.hex} stopOpacity="0.95" />
                </linearGradient>

                <radialGradient id="outerVGrad" cx="80%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={palette.outerV.hex} stopOpacity="0.95" />
                  <stop offset="70%" stopColor={palette.outerV.hex} stopOpacity="0.65" />
                  <stop offset="100%" stopColor={palette.outerV.hex} stopOpacity="0.05" />
                </radialGradient>

                <radialGradient id="shimmerHaloGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={palette.shimmer.hex} stopOpacity="0.98" />
                  <stop offset="60%" stopColor={palette.shimmer.hex} stopOpacity="0.65" />
                  <stop offset="100%" stopColor={palette.shimmer.hex} stopOpacity="0" />
                </radialGradient>

                <radialGradient id="innerGlowGrad" cx="20%" cy="50%" r="40%">
                  <stop offset="0%" stopColor={palette.innerGlow.hex} stopOpacity="1" />
                  <stop offset="70%" stopColor={palette.innerGlow.hex} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={palette.innerGlow.hex} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Eyelid & Brow Structure */}
              <g id="eye-structure">
                {/* Eyebrow Arch */}
                <path
                  d="M140 45 Q260 22 420 40 Q490 62 530 85 Q480 62 420 48 Q260 35 140 45 Z"
                  fill="#452a20"
                  opacity="0.85"
                />
                {/* Brow Bone Highlight Area */}
                <path
                  d="M260 52 Q370 42 460 62 Q370 56 260 64 Z"
                  fill="#fffbe6"
                  opacity="0.55"
                />

                {/* Sclera & Iris */}
                <path
                  d="M170 145 Q310 85 450 145 Q310 205 170 145 Z"
                  fill="#faf5ef"
                  stroke="#6b4c3e"
                  strokeWidth="1.5"
                />
                {/* Iris */}
                <ellipse cx="310" cy="145" rx="36" ry="36" fill="#3b2319" />
                <ellipse cx="310" cy="145" rx="16" ry="16" fill="#150d09" />
                <circle cx="300" cy="136" r="5" fill="#ffffff" opacity="0.9" />
              </g>

              {/* EYESHADOW LAYER 1: BASE WASH (Mobile Lid) */}
              {(activeZone === 'all' || activeZone === 'base') && (
                <g id="zone-base-wash">
                  <path
                    d="M175 142 Q310 88 445 142 Q310 102 175 142 Z"
                    fill="url(#baseWashGrad)"
                  />
                  <path
                    d="M175 142 Q310 88 445 142"
                    stroke={palette.base.hex}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    fill="none"
                    opacity="0.7"
                  />
                </g>
              )}

              {/* EYESHADOW LAYER 2: TRANSITION CREASE (Orbital Socket Bone) */}
              {(activeZone === 'all' || activeZone === 'crease') && (
                <g id="zone-transition-crease">
                  <path
                    d="M190 120 Q310 68 440 115"
                    stroke="url(#creaseTransitionGrad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                  {/* Blending Direction Arrows (Windshield wiper) */}
                  <path
                    d="M240 85 Q310 70 380 85"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    fill="none"
                    opacity="0.8"
                  />
                  <polygon points="236,88 242,80 244,89" fill="#ffffff" />
                  <polygon points="384,88 378,80 376,89" fill="#ffffff" />
                </g>
              )}

              {/* EYESHADOW LAYER 3: OUTER 'V' / CORNER DEPTH */}
              {(activeZone === 'all' || activeZone === 'outerV') && (
                <g id="zone-outer-v">
                  <path
                    d="M380 120 Q445 110 455 145 L420 145 Q405 130 380 120 Z"
                    fill="url(#outerVGrad)"
                  />
                  {/* Outer 'V' Sculpt Angle Indicator */}
                  <path
                    d="M390 116 L448 142 L415 146"
                    stroke={palette.outerV.hex}
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
              )}

              {/* EYESHADOW LAYER 4: CENTER LID HALO SHIMMER POP */}
              {(activeZone === 'all' || activeZone === 'shimmer') && (
                <g id="zone-lid-shimmer">
                  <ellipse cx="310" cy="128" rx="28" ry="18" fill="url(#shimmerHaloGrad)" />
                  <circle cx="310" cy="128" r="3" fill="#ffffff" opacity="0.9" />
                </g>
              )}

              {/* EYESHADOW LAYER 5: INNER CORNER GLOW */}
              {(activeZone === 'all' || activeZone === 'innerCorner') && (
                <g id="zone-inner-glow">
                  <ellipse cx="170" cy="145" rx="14" ry="10" fill="url(#innerGlowGrad)" />
                  <circle cx="168" cy="145" r="3" fill="#ffffff" />
                </g>
              )}

              {/* ======================================================== */}
              {/* EYELINER & WING GUIDELINE (THE EXACT "UPTO WHERE") */}
              {/* ======================================================== */}
              <g id="eyeliner-guidelines">
                {/* 1. Trajectory Guideline Angle to Brow Tail (Dashed Gold Vector) */}
                <line
                  x1="450"
                  y1="145"
                  x2="525"
                  y2="88"
                  stroke="#facc15"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  opacity="0.9"
                />

                {/* 2. Stop Point Marker & Millimeter Guide */}
                <circle cx="496" cy="110" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="496" y1="110" x2="550" y2="110" stroke="#facc15" strokeWidth="1.2" />
                <text x="554" y="113" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  WING STOP (4–6mm)
                </text>

                {/* Trajectory Direction Angle Label */}
                <text x="440" y="75" fill="#facc15" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  42° TO BROW TAIL ↗
                </text>

                {/* 3. Base Lashline Tightline */}
                <path
                  d="M170 145 Q310 92 450 145"
                  stroke={palette.liner.hex}
                  strokeWidth={currentLiner === 'smudged' ? '4' : '3'}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* 4. Render Active Wing Shape */}
                {currentLiner === 'winged' && (
                  <path
                    d="M420 141 L496 110 L450 145 Z"
                    fill={palette.liner.hex}
                    stroke={palette.liner.hex}
                    strokeWidth="1"
                  />
                )}

                {currentLiner === 'cateye' && (
                  <>
                    {/* Bolder, longer wing */}
                    <path
                      d="M400 138 L510 100 L450 145 Z"
                      fill={palette.liner.hex}
                      stroke={palette.liner.hex}
                      strokeWidth="1"
                    />
                    {/* Feline Inner Corner Point */}
                    <path
                      d="M172 143 L152 149 L170 148 Z"
                      fill={palette.liner.hex}
                    />
                  </>
                )}

                {currentLiner === 'batwing' && (
                  <g id="batwing-hooded-shape">
                    {/* Step-notch batwing shape specifically engineered for hooded eyes */}
                    <path
                      d="M420 140 L488 116 L488 126 L450 145 Z"
                      fill={palette.liner.hex}
                    />
                    <path
                      d="M488 116 L498 108 L488 126 Z"
                      fill={palette.liner.hex}
                    />
                    {/* Hood fold overlap indicator line */}
                    <path
                      d="M360 115 Q435 110 488 122"
                      stroke="#fb7185"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      fill="none"
                    />
                    <text x="390" y="106" fill="#fca5a5" fontSize="8" fontFamily="monospace">
                      HOOD CREASE FOLD
                    </text>
                  </g>
                )}

                {currentLiner === 'smudged' && (
                  <path
                    d="M410 142 Q460 135 480 120"
                    stroke={palette.liner.hex}
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.85"
                    fill="none"
                  />
                )}
              </g>

              {/* Callout Pins & Labels */}
              <g id="callout-pins" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                {/* 1. Base Wash */}
                <circle cx="250" cy="130" r="3" fill="#ffffff" />
                <text x="250" y="160" fill="#ffffff" textAnchor="middle">1. BASE WASH</text>

                {/* 2. Crease */}
                <circle cx="310" cy="80" r="3" fill="#ffffff" />
                <text x="310" y="65" fill="#fde047" textAnchor="middle">2. TRANSITION CREASE</text>

                {/* 3. Outer V */}
                <circle cx="420" cy="132" r="3" fill="#ffffff" />
                <text x="420" y="175" fill="#fca5a5" textAnchor="middle">3. OUTER 'V'</text>

                {/* 4. Center Pop */}
                <circle cx="310" cy="128" r="2.5" fill="#fde047" />
                <text x="310" y="120" fill="#fef08a" textAnchor="middle">4. SHIMMER POP</text>

                {/* 5. Inner Corner */}
                <circle cx="168" cy="145" r="2.5" fill="#ffffff" />
                <text x="168" y="175" fill="#bae6fd" textAnchor="middle">5. INNER GLOW</text>
              </g>
            </svg>
          </div>

          {/* Quick Zone Legend Chips */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-3 border-t border-stone-800 text-[10px]">
            <span className="text-stone-400 font-mono">SELECT ZONE TO ISOLATE:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveZone('all')}
                className={`px-2 py-0.5 rounded-md font-mono transition ${
                  activeZone === 'all' ? 'bg-white text-stone-900 font-bold' : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                All Zones
              </button>
              <button
                onClick={() => setActiveZone('base')}
                className={`px-2 py-0.5 rounded-md font-mono transition flex items-center gap-1 ${
                  activeZone === 'base' ? 'bg-amber-100 text-amber-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.base.hex }} />
                <span>1. Base</span>
              </button>
              <button
                onClick={() => setActiveZone('crease')}
                className={`px-2 py-0.5 rounded-md font-mono transition flex items-center gap-1 ${
                  activeZone === 'crease' ? 'bg-amber-100 text-amber-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.crease.hex }} />
                <span>2. Crease</span>
              </button>
              <button
                onClick={() => setActiveZone('outerV')}
                className={`px-2 py-0.5 rounded-md font-mono transition flex items-center gap-1 ${
                  activeZone === 'outerV' ? 'bg-amber-100 text-amber-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.outerV.hex }} />
                <span>3. Outer V</span>
              </button>
              <button
                onClick={() => setActiveZone('shimmer')}
                className={`px-2 py-0.5 rounded-md font-mono transition flex items-center gap-1 ${
                  activeZone === 'shimmer' ? 'bg-amber-100 text-amber-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.shimmer.hex }} />
                <span>4. Shimmer Pop</span>
              </button>
              <button
                onClick={() => setActiveZone('innerCorner')}
                className={`px-2 py-0.5 rounded-md font-mono transition flex items-center gap-1 ${
                  activeZone === 'innerCorner' ? 'bg-amber-100 text-amber-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.innerGlow.hex }} />
                <span>5. Inner Glow</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. EYELINER WING STYLE PICKER & "UPTO WHERE" GUIDANCE */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-[#29202a] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#c45b78]" />
              <span>Choose Your Eyeliner Wing Style</span>
            </h4>
            <span className="text-[11px] text-[#766b77]">
              Detected Eye Shape: <b className="capitalize text-[#29202a]">{eyeShape}</b>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'winged', name: 'Classic Winged', tip: '4–5mm clean flick' },
              { id: 'cateye', name: 'Dramatic Cat-Eye', tip: '6–8mm + inner beak' },
              { id: 'batwing', name: 'Hooded Batwing', tip: 'Never folds under skin' },
              { id: 'smudged', name: 'Soft Smudged', tip: 'Smoky espresso kohl' },
            ].map((style) => {
              const isSelected = currentLiner === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => handleLinerChange(style.id as LinerStyle)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#c45b78] bg-[#fff5f7] shadow-xs ring-1 ring-[#c45b78]'
                      : 'border-[#eadde1] bg-white hover:border-[#d9bcc5]'
                  }`}
                >
                  <div>
                    <b className="block text-xs font-bold text-[#29202a]">{style.name}</b>
                    <span className="text-[10px] text-[#766b77] block mt-0.5">{style.tip}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-[#c45b78] font-extrabold mt-2 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* EXACT "UPTO WHERE" WING ANCHOR BREAKDOWN */}
          <div className="p-4 rounded-xl bg-[#fffaf8] border border-[#f5dde4] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#c45b78] flex items-center gap-1.5 text-xs">
                <ArrowUpRight className="w-4 h-4" />
                <span>Where Does the Wing Stop? (The Golden Rules)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#eadde1] text-[#766b77]">
                MUA Pro Standard
              </span>
            </div>

            <p className="text-xs text-[#29202a] font-semibold leading-relaxed">
              📍 <strong className="text-[#c45b78]">Wing Boundary:</strong> {currentLinerData.uptoWhere}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-white border border-[#eadde1] space-y-1">
                <span className="text-[10px] font-bold text-[#766b77] block uppercase">1. Start & Angle</span>
                <p className="text-[11px] text-[#4a3945] leading-tight">{currentLinerData.step1}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#eadde1] space-y-1">
                <span className="text-[10px] font-bold text-[#766b77] block uppercase">2. The Wing Flick</span>
                <p className="text-[11px] text-[#4a3945] leading-tight">{currentLinerData.step2}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#eadde1] space-y-1">
                <span className="text-[10px] font-bold text-[#766b77] block uppercase">3. Triangle & Fill</span>
                <p className="text-[11px] text-[#4a3945] leading-tight">{currentLinerData.step3}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Pro Eye-Opening Tip:</strong> {currentLinerData.angleTip}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. EXACT EYESHADOW COLOR PALETTE & BRUSH PROTOCOL */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-[#29202a] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c45b78]" />
              <span>5-Zone Eyeshadow Color Palette ({palette.name})</span>
            </h4>
            <span className="text-[11px] text-[#766b77]">Apply in numbered sequence</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {/* 1. Base Wash */}
            <div className="p-3 rounded-xl bg-white border border-[#eadde1] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#766b77] uppercase">Zone 1: Base Wash</span>
                <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: palette.base.hex }} />
              </div>
              <strong className="block text-xs text-[#29202a]">{palette.base.name}</strong>
              <p className="text-[11px] text-[#6b5d69] leading-tight">{palette.base.desc}</p>
              <span className="inline-block text-[10px] bg-[#f7f0f2] text-[#8b3b55] px-2 py-0.5 rounded-md font-medium">
                Tool: Large Fluffy Blending Brush
              </span>
            </div>

            {/* 2. Transition Crease */}
            <div className="p-3 rounded-xl bg-white border border-[#eadde1] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#766b77] uppercase">Zone 2: Crease Socket</span>
                <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: palette.crease.hex }} />
              </div>
              <strong className="block text-xs text-[#29202a]">{palette.crease.name}</strong>
              <p className="text-[11px] text-[#6b5d69] leading-tight">{palette.crease.desc}</p>
              <span className="inline-block text-[10px] bg-[#f7f0f2] text-[#8b3b55] px-2 py-0.5 rounded-md font-medium">
                Tool: Tapered Dome Crease Brush
              </span>
            </div>

            {/* 3. Outer V Depth */}
            <div className="p-3 rounded-xl bg-white border border-[#eadde1] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#766b77] uppercase">Zone 3: Outer 'V'</span>
                <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: palette.outerV.hex }} />
              </div>
              <strong className="block text-xs text-[#29202a]">{palette.outerV.name}</strong>
              <p className="text-[11px] text-[#6b5d69] leading-tight">{palette.outerV.desc}</p>
              <span className="inline-block text-[10px] bg-[#f7f0f2] text-[#8b3b55] px-2 py-0.5 rounded-md font-medium">
                Tool: Small Precision Pencil Brush
              </span>
            </div>

            {/* 4. Center Lid Shimmer */}
            <div className="p-3 rounded-xl bg-white border border-[#eadde1] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#766b77] uppercase">Zone 4: Mid-Lid Shimmer</span>
                <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: palette.shimmer.hex }} />
              </div>
              <strong className="block text-xs text-[#29202a]">{palette.shimmer.name}</strong>
              <p className="text-[11px] text-[#6b5d69] leading-tight">{palette.shimmer.desc}</p>
              <span className="inline-block text-[10px] bg-[#f7f0f2] text-[#8b3b55] px-2 py-0.5 rounded-md font-medium">
                Tool: Ring Fingertip / Flat Brush
              </span>
            </div>

            {/* 5. Inner Glow */}
            <div className="p-3 rounded-xl bg-white border border-[#eadde1] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#766b77] uppercase">Zone 5: Inner Tear Duct</span>
                <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: palette.innerGlow.hex }} />
              </div>
              <strong className="block text-xs text-[#29202a]">{palette.innerGlow.name}</strong>
              <p className="text-[11px] text-[#6b5d69] leading-tight">{palette.innerGlow.desc}</p>
              <span className="inline-block text-[10px] bg-[#f7f0f2] text-[#8b3b55] px-2 py-0.5 rounded-md font-medium">
                Tool: Micro Detail Bullet Brush
              </span>
            </div>

            {/* 6. Eyeliner Pigment */}
            <div className="p-3 rounded-xl bg-white border border-[#eadde1] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#766b77] uppercase">Zone 6: Wing & Lashline</span>
                <span className="w-4 h-4 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: palette.liner.hex }} />
              </div>
              <strong className="block text-xs text-[#29202a]">{palette.liner.name}</strong>
              <p className="text-[11px] text-[#6b5d69] leading-tight">{palette.liner.desc}</p>
              <span className="inline-block text-[10px] bg-[#f7f0f2] text-[#8b3b55] px-2 py-0.5 rounded-md font-medium">
                Tool: Waterproof Pen / Angled Brush
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
