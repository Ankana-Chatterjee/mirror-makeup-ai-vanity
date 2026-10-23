import React from 'react';
import { FacialLandmarks, LookMoodId } from '../types/glowguide';
import { LOOK_EYESHADOW_PALETTES } from './EyeMasterclassVisualizer';

interface StepDiagramVisualizerProps {
  step: number;
  faceShape?: string;
  eyeShape?: string;
  isOverlayMode?: boolean;
  landmarks?: FacialLandmarks;
  selectedLook?: LookMoodId;
}

export const StepDiagramVisualizer: React.FC<StepDiagramVisualizerProps> = ({
  step,
  faceShape = 'oval',
  eyeShape = 'hooded',
  isOverlayMode = false,
  landmarks,
  selectedLook = 'clean',
}) => {
  // Color palette for anatomical makeup mapping
  const skin = '#dfa57e';
  const line = '#6c4b40';
  const blush = '#db6b7c';
  const peachCorrect = '#f2875a';
  const greenCorrect = '#55a76e';
  const baseFoundation = '#c99268';
  const concealerHighlight = '#ffe0b8';
  const setPowder = '#fff3db';
  const palette = LOOK_EYESHADOW_PALETTES[selectedLook] || LOOK_EYESHADOW_PALETTES.clean;

  // Dynamic landmark anchors in SVG coordinates (300 x 270)
  const lEyeX = landmarks ? (landmarks.leftEye.x / 100) * 300 : 109;
  const lEyeY = landmarks ? (landmarks.leftEye.y / 100) * 270 : 118;
  const rEyeX = landmarks ? (landmarks.rightEye.x / 100) * 300 : 191;
  const rEyeY = landmarks ? (landmarks.rightEye.y / 100) * 270 : 118;
  const nTipX = landmarks ? (landmarks.noseTip.x / 100) * 300 : 150;
  const nTipY = landmarks ? (landmarks.noseTip.y / 100) * 270 : 156;
  const nBridgeY = landmarks && landmarks.noseBridge ? (landmarks.noseBridge.y / 100) * 270 : 124;
  const lipX = landmarks ? (landmarks.lipsCenter.x / 100) * 300 : 150;
  const lipY = landmarks ? (landmarks.lipsCenter.y / 100) * 270 : 188;
  const lCheekX = landmarks ? (landmarks.leftCheek.x / 100) * 300 : 94;
  const lCheekY = landmarks ? (landmarks.leftCheek.y / 100) * 270 : 148;
  const rCheekX = landmarks ? (landmarks.rightCheek.x / 100) * 300 : 206;
  const rCheekY = landmarks ? (landmarks.rightCheek.y / 100) * 270 : 148;
  const fHeadX = landmarks ? (landmarks.forehead.x / 100) * 300 : 150;
  const fHeadY = landmarks ? (landmarks.forehead.y / 100) * 270 : 74;
  const chinX = landmarks ? (landmarks.chin.x / 100) * 300 : 150;
  const chinY = landmarks ? (landmarks.chin.y / 100) * 270 : 218;

  // Specific markers per step
  // Specific markers per step
  const renderStepMarkers = () => {
    switch (step) {
      case 0: // Skin prep & hydration
        return (
          <g id="step-prep-markers">
            {/* Forehead hydration zone */}
            <ellipse cx={fHeadX} cy={fHeadY} rx="42" ry="16" fill={concealerHighlight} opacity="0.65" />
            <path d={`M${fHeadX - 25} ${fHeadY} Q${fHeadX} ${fHeadY - 6} ${fHeadX + 25} ${fHeadY}`} stroke="#fff" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            {/* Cheek hydration cushions */}
            <ellipse cx={lCheekX} cy={lCheekY} rx="28" ry="18" fill={concealerHighlight} opacity="0.6" />
            <ellipse cx={rCheekX} cy={rCheekY} rx="28" ry="18" fill={concealerHighlight} opacity="0.6" />
            {/* Nose bridge glow */}
            <path d={`M${nTipX} ${nBridgeY} L${nTipX} ${nTipY}`} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            {/* Chin hydration */}
            <ellipse cx={chinX} cy={chinY} rx="22" ry="11" fill={concealerHighlight} opacity="0.6" />
            {/* Descriptive badges */}
            {!isOverlayMode && (
              <>
                <rect x="22" y="38" width="80" height="20" rx="5" fill="#ffffffd8" stroke="#eadde1" />
                <text x="62" y="52" fontSize="9" fontWeight="bold" fill="#7a4253" textAnchor="middle">Hydration Zones</text>
              </>
            )}
          </g>
        );

      case 1: // Primer placement
        return (
          <g id="step-primer-markers">
            {/* T-Zone smoothing zone */}
            <path d={`M${fHeadX - 32} ${fHeadY + 4} H${fHeadX + 32} V${fHeadY + 18} Q${fHeadX} ${fHeadY + 22} ${fHeadX - 32} ${fHeadY + 18} Z`} fill="#d9a7d3" opacity="0.65" />
            <path d={`M${nTipX - 8} ${nBridgeY} H${nTipX + 8} V${nTipY + 6} H${nTipX - 8} Z`} fill="#d9a7d3" opacity="0.65" />
            {/* Smile line grip points */}
            <path d={`M${nTipX - 26} ${nTipY + 6} Q${nTipX - 18} ${lipY - 10} ${nTipX - 20} ${lipY + 8}`} stroke="#9d5295" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 2" fill="none" />
            <path d={`M${nTipX + 26} ${nTipY + 6} Q${nTipX + 18} ${lipY - 10} ${nTipX + 20} ${lipY + 8}`} stroke="#9d5295" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 2" fill="none" />
            {/* Cheeks luminous perimeter */}
            <circle cx={lCheekX} cy={lCheekY - 8} r="14" fill="#f5d6f0" opacity="0.5" />
            <circle cx={rCheekX} cy={rCheekY - 8} r="14" fill="#f5d6f0" opacity="0.5" />
            {!isOverlayMode && (
              <text x={fHeadX} y={fHeadY + 13} fontSize="8" fontWeight="bold" fill="#582150" textAnchor="middle">PORE BLUR MESH</text>
            )}
          </g>
        );

      case 2: // Colour correction
        return (
          <g id="step-corrector-markers">
            {/* Under-eye tear-trough peach/orange correction */}
            <ellipse cx={lEyeX} cy={lEyeY + 10} rx="18" ry="8" fill={peachCorrect} opacity="0.85" />
            <ellipse cx={rEyeX} cy={rEyeY + 10} rx="18" ry="8" fill={peachCorrect} opacity="0.85" />
            {/* Green nasal fold redness correctors */}
            <ellipse cx={nTipX - 13} cy={nTipY + 2} rx="6" ry="10" fill={greenCorrect} opacity="0.9" />
            <ellipse cx={nTipX + 13} cy={nTipY + 2} rx="6" ry="10" fill={greenCorrect} opacity="0.9" />
            {/* Green chin blemish spot */}
            <circle cx={chinX} cy={chinY - 2} r="6" fill={greenCorrect} opacity="0.85" />
            {!isOverlayMode && (
              <>
                <rect x="18" y="32" width="105" height="42" rx="7" fill="#ffffffea" stroke="#eadde1" />
                <circle cx="28" cy="45" r="4" fill={peachCorrect} />
                <text x="36" y="48" fontSize="8" fontWeight="bold" fill="#7a341e">Peach: Tear Trough</text>
                <circle cx="28" cy="62" r="4" fill={greenCorrect} />
                <text x="36" y="65" fontSize="8" fontWeight="bold" fill="#2b593a">Green: Redness Folds</text>
              </>
            )}
          </g>
        );

      case 3: // Foundation & concealer
        return (
          <g id="step-base-markers">
            {/* Brightening concealer triangles */}
            <polygon points={`${lEyeX - 10},${lEyeY + 6} ${lEyeX + 10},${lEyeY + 6} ${lEyeX},${lEyeY + 22}`} fill={concealerHighlight} opacity="0.95" />
            <polygon points={`${rEyeX - 10},${rEyeY + 6} ${rEyeX + 10},${rEyeY + 6} ${rEyeX},${rEyeY + 22}`} fill={concealerHighlight} opacity="0.95" />
            {/* Outer corner lift flicks toward temples */}
            <path d={`M${lEyeX + 14} ${lEyeY + 2} L${lEyeX + 26} ${lEyeY - 6}`} stroke={concealerHighlight} strokeWidth="4" strokeLinecap="round" />
            <path d={`M${rEyeX - 14} ${rEyeY + 2} L${rEyeX - 26} ${rEyeY - 6}`} stroke={concealerHighlight} strokeWidth="4" strokeLinecap="round" />
            {/* Foundation dots */}
            <circle cx={fHeadX} cy={fHeadY} r="6" fill={baseFoundation} opacity="0.85" />
            <circle cx={lCheekX} cy={lCheekY} r="7" fill={baseFoundation} opacity="0.85" />
            <circle cx={rCheekX} cy={rCheekY} r="7" fill={baseFoundation} opacity="0.85" />
            <circle cx={chinX} cy={chinY} r="6" fill={baseFoundation} opacity="0.85" />
          </g>
        );

      case 4: // Features (Eyeshadow 5 Color Zones, Winged Liner Trajectory, Blush & Lips)
        return (
          <g id="step-features-markers">
            {/* ======================================================== */}
            {/* LEFT EYE COSMETIC EYESHADOW ZONES */}
            {/* ======================================================== */}
            {/* Zone 1: Base Wash */}
            <path
              d={`M${lEyeX + 12} ${lEyeY} Q${lEyeX} ${lEyeY - 14} ${lEyeX - 14} ${lEyeY} Z`}
              fill={palette.base.hex}
              opacity="0.85"
            />
            {/* Zone 2: Crease Socket Contour */}
            <path
              d={`M${lEyeX + 8} ${lEyeY - 5} Q${lEyeX} ${lEyeY - 16} ${lEyeX - 14} ${lEyeY - 8}`}
              stroke={palette.crease.hex}
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Zone 3: Outer 'V' Wedge */}
            <polygon
              points={`${lEyeX - 5},${lEyeY - 2} ${lEyeX - 18},${lEyeY - 8} ${lEyeX - 12},${lEyeY - 13}`}
              fill={palette.outerV.hex}
              opacity="0.9"
            />
            {/* Zone 4: Center Mobile Lid Shimmer Pop */}
            <ellipse
              cx={lEyeX}
              cy={lEyeY - 4}
              rx="5"
              ry="6"
              fill={palette.shimmer.hex}
              opacity="0.95"
            />
            <circle cx={lEyeX} cy={lEyeY - 4} r="1.5" fill="#ffffff" />
            {/* Zone 5: Inner Corner Tear Duct Glow */}
            <circle
              cx={lEyeX + 13}
              cy={lEyeY + 1}
              r="2.5"
              fill={palette.innerGlow.hex}
              stroke="#ffffff"
              strokeWidth="0.5"
            />

            {/* LEFT EYE LINER & 42° WING TRAJECTORY GUIDELINE */}
            <line
              x1={lEyeX - 14}
              y1={lEyeY + 1}
              x2={lEyeX - 30}
              y2={lEyeY - 13}
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <line
              x1={lEyeX - 26}
              y1={lEyeY - 12}
              x2={lEyeX - 22}
              y2={lEyeY - 7}
              stroke="#ef4444"
              strokeWidth="1.8"
            />
            <polygon
              points={`${lEyeX - 14},${lEyeY + 1} ${lEyeX - 25},${lEyeY - 8} ${lEyeX - 6},${lEyeY - 1}`}
              fill={palette.liner.hex}
            />
            <path
              d={`M${lEyeX + 10} ${lEyeY + 1} Q${lEyeX} ${lEyeY - 3} ${lEyeX - 14} ${lEyeY + 1}`}
              stroke={palette.liner.hex}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <rect x={lEyeX - 38} y={lEyeY - 21} width="36" height="8" rx="2" fill="#18181b" opacity="0.85" />
            <text x={lEyeX - 36} y={lEyeY - 15} fill="#fef08a" fontSize="5" fontFamily="monospace" fontWeight="bold">
              WING 4-6mm
            </text>

            {/* ======================================================== */}
            {/* RIGHT EYE COSMETIC EYESHADOW ZONES */}
            {/* ======================================================== */}
            <path
              d={`M${rEyeX - 12} ${rEyeY} Q${rEyeX} ${rEyeY - 14} ${rEyeX + 14} ${rEyeY} Z`}
              fill={palette.base.hex}
              opacity="0.85"
            />
            <path
              d={`M${rEyeX - 8} ${rEyeY - 5} Q${rEyeX} ${rEyeY - 16} ${rEyeX + 14} ${rEyeY - 8}`}
              stroke={palette.crease.hex}
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.95"
            />
            <polygon
              points={`${rEyeX + 5},${rEyeY - 2} ${rEyeX + 18},${rEyeY - 8} ${rEyeX + 12},${rEyeY - 13}`}
              fill={palette.outerV.hex}
              opacity="0.9"
            />
            <ellipse
              cx={rEyeX}
              cy={rEyeY - 4}
              rx="5"
              ry="6"
              fill={palette.shimmer.hex}
              opacity="0.95"
            />
            <circle cx={rEyeX} cy={rEyeY - 4} r="1.5" fill="#ffffff" />
            <circle
              cx={rEyeX - 13}
              cy={rEyeY + 1}
              r="2.5"
              fill={palette.innerGlow.hex}
              stroke="#ffffff"
              strokeWidth="0.5"
            />

            {/* RIGHT EYE LINER & 42° WING TRAJECTORY GUIDELINE */}
            <line
              x1={rEyeX + 14}
              y1={rEyeY + 1}
              x2={rEyeX + 30}
              y2={rEyeY - 13}
              stroke="#f59e0b"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <line
              x1={rEyeX + 26}
              y1={rEyeY - 12}
              x2={rEyeX + 22}
              y2={rEyeY - 7}
              stroke="#ef4444"
              strokeWidth="1.8"
            />
            <polygon
              points={`${rEyeX + 14},${rEyeY + 1} ${rEyeX + 25},${rEyeY - 8} ${rEyeX + 6},${rEyeY - 1}`}
              fill={palette.liner.hex}
            />
            <path
              d={`M${rEyeX - 10} ${rEyeY + 1} Q${rEyeX} ${rEyeY - 3} ${rEyeX + 14} ${rEyeY + 1}`}
              stroke={palette.liner.hex}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <rect x={rEyeX + 2} y={rEyeY - 21} width="36" height="8" rx="2" fill="#18181b" opacity="0.85" />
            <text x={rEyeX + 4} y={rEyeY - 15} fill="#fef08a" fontSize="5" fontFamily="monospace" fontWeight="bold">
              WING 4-6mm
            </text>

            {/* Lifted cheek blush along zygomatic arch */}
            <ellipse cx={lCheekX} cy={lCheekY} rx="22" ry="12" transform={`rotate(-18 ${lCheekX} ${lCheekY})`} fill={blush} opacity="0.65" />
            <ellipse cx={rCheekX} cy={rCheekY} rx="22" ry="12" transform={`rotate(18 ${rCheekX} ${rCheekY})`} fill={blush} opacity="0.65" />
            {/* Defined lip shape with gradient fill */}
            <path d={`M${lipX - 22} ${lipY} Q${lipX} ${lipY - 10} ${lipX + 22} ${lipY} Q${lipX} ${lipY + 16} ${lipX - 22} ${lipY} Z`} fill="#b84d65" stroke="#87293e" strokeWidth="1.5" />
            <ellipse cx={lipX} cy={lipY + 3} rx="10" ry="4" fill="#ea8098" opacity="0.9" />
          </g>
        );

      case 5: // Set & final check
        return (
          <g id="step-finish-markers">
            {/* Powder press target zones (T-zone, under eyes, smile lines) */}
            <circle cx={fHeadX} cy={fHeadY} r="14" fill={setPowder} stroke="#b08a54" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
            <ellipse cx={lEyeX} cy={lEyeY + 12} rx="14" ry="7" fill={setPowder} stroke="#b08a54" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
            <ellipse cx={rEyeX} cy={rEyeY + 12} rx="14" ry="7" fill={setPowder} stroke="#b08a54" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
            <circle cx={nTipX} cy={nTipY + 6} r="8" fill={setPowder} stroke="#b08a54" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
            {/* Central symmetry guide line (dotted) */}
            <line x1={nTipX} y1="24" x2={nTipX} y2="246" stroke="#c45b78" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center select-none">
      <svg
        viewBox="0 0 300 270"
        className="w-full h-auto max-h-[290px] drop-shadow-sm transition-all duration-300"
        role="img"
        aria-label={`Illustrated makeup placement for step ${step + 1}`}
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff6f3" />
            <stop offset="100%" stopColor="#f8e7ec" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5aa83" />
            <stop offset="100%" stopColor="#d39268" />
          </linearGradient>
        </defs>

        {/* If in standalone diagram mode, render background canvas */}
        {!isOverlayMode && (
          <rect x="0" y="0" width="300" height="270" rx="16" fill="url(#bgGrad)" />
        )}

        {/* Base Anatomical Face Structure (rendered only in standalone diagram mode!) */}
        {!isOverlayMode && (
          <g id="base-face-anatomy">
            {/* Neck */}
            <path d="M104 218 Q104 246 86 260 L214 260 Q196 246 196 218 Z" fill="#c38865" opacity="0.85" />
            {/* Face Outline */}
            <path
              d="M80 102 Q72 48 150 36 Q228 48 220 102 L212 166 Q200 216 150 230 Q100 216 88 166 Z"
              fill="url(#skinGrad)"
              stroke={line}
              strokeWidth="1.6"
            />
            {/* Ears */}
            <path d="M79 110 Q58 96 68 132 Q74 148 90 145" fill={skin} stroke={line} strokeWidth="1.5" />
            <path d="M221 110 Q242 96 232 132 Q226 148 210 145" fill={skin} stroke={line} strokeWidth="1.5" />
            {/* Eyebrows */}
            <path d="M92 102 Q110 90 128 102" stroke={line} strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M172 102 Q190 90 208 102" stroke={line} strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {/* Eyes & Irises */}
            <path d="M91 118 Q109 104 127 118 Q109 132 91 118" fill="#fffaf5" stroke={line} strokeWidth="1.4" />
            <path d="M173 118 Q191 104 209 118 Q191 132 173 118" fill="#fffaf5" stroke={line} strokeWidth="1.4" />
            <ellipse cx="109" cy="118" rx="6.5" ry="7.5" fill="#4d3129" />
            <ellipse cx="191" cy="118" rx="6.5" ry="7.5" fill="#4d3129" />
            <circle cx="107" cy="116" r="1.8" fill="#ffffff" />
            <circle cx="189" cy="116" r="1.8" fill="#ffffff" />
            {/* Nose */}
            <path d="M150 118 Q140 149 144 156 Q150 161 156 156" stroke={line} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Lips default line */}
            <path d="M129 186 Q150 176 171 186 Q150 203 129 186 Z" fill="#9f5660" stroke="#7a3740" strokeWidth="1.2" />
          </g>
        )}

        {/* Step Specific Action Markers */}
        {renderStepMarkers()}

        {/* Diagram Legend / Header */}
        {!isOverlayMode && (
          <g fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="700" fill="#644d58">
            <text x="16" y="24" letterSpacing="0.08em">PICTORIAL PLACEMENT MAP</text>
            <text x="284" y="24" textAnchor="end" letterSpacing="0.08em">STEP {step + 1} OF 6</text>
          </g>
        )}
      </svg>
    </div>
  );
};
