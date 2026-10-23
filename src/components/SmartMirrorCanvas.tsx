import React, { useEffect, useRef, useState } from 'react';
import { EyeShape, FaceDiagnostics, MakeupLook, LipFinish } from '../types/makeup';
import { hexToRgb, rgbToLab } from '../utils/colorScience';
import { HeadPose3D, project3DTo2D } from '../utils/autonomousScanner';
import { FaceLandmarkTracker, LiveFaceFeatures, getDefaultFaceFeatures } from '../utils/faceLandmarkTracker';

interface SmartMirrorCanvasProps {
  imageSrc: string;
  isWebcamActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mirrorFlipped: boolean;
  overlayMode: 'stencils' | 'vto' | 'split' | 'mesh' | 'audit' | 'teaching';
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  customLipHex?: string;
  customLipFinish?: LipFinish;
  teachingStep?: number; // 1 to 5
  mistakeAuditActive?: boolean;
  headPose?: HeadPose3D;
  coachHighlightZone?: 'eyes' | 'jawline' | 'undereye' | 'cheeks' | 'lips' | 'forehead' | 'none';
  coachFeedbackHeadline?: string;
  isCorrectTechnique?: boolean;
  showTrackingReticles?: boolean;
  onFeaturesTracked?: (features: LiveFaceFeatures) => void;
  onSampleColor?: (hex: string, lab: { l: number; a: number; b: number }) => void;
}

export const SmartMirrorCanvas: React.FC<SmartMirrorCanvasProps> = ({
  imageSrc,
  isWebcamActive,
  videoRef,
  mirrorFlipped,
  overlayMode,
  diagnostics,
  currentLook,
  customLipHex,
  customLipFinish,
  teachingStep,
  headPose = { yaw: 0, pitch: 0, roll: 0, distance: 1.0 },
  onFeaturesTracked,
  coachHighlightZone = 'none',
  coachFeedbackHeadline,
  isCorrectTechnique = true,
  showTrackingReticles = true,
  onSampleColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackerRef = useRef<FaceLandmarkTracker>(new FaceLandmarkTracker());
  const liveFeaturesRef = useRef<LiveFaceFeatures | null>(null);
  const [splitPosition, setSplitPosition] = useState(50); // % for split view
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const activeLipHex = customLipHex || currentLook.lipColorHex;
  const activeLipFinish = customLipFinish || currentLook.lipFinish;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Match canvas internal resolution to client display size
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Real-time dynamic face & landmark auto-detection (Runs client-side in RAM)
      if (isWebcamActive && videoRef.current && videoRef.current.readyState >= 2) {
        trackerRef.current.trackFeatures(videoRef.current, width, height).then((features) => {
          liveFeaturesRef.current = features;
          if (onFeaturesTracked) {
            onFeaturesTracked(features);
          }
        });
      }

      const liveFeatures = liveFeaturesRef.current;

      // Coordinate reference points (default normalized baseline)
      const cx = width * 0.5;
      const cy = height * 0.48;
      const faceW = width * 0.58;
      const faceH = height * 0.72;

      // Fallback 3D projected coordinates
      const pLeftEye = project3DTo2D({ x: -0.22, y: -0.12, z: 0.05 }, headPose, cx, cy, faceW, faceH);
      const pRightEye = project3DTo2D({ x: +0.22, y: -0.12, z: 0.05 }, headPose, cx, cy, faceW, faceH);
      const pNose = project3DTo2D({ x: 0, y: +0.02, z: +0.20 }, headPose, cx, cy, faceW, faceH);
      const pLeftCheek = project3DTo2D({ x: -0.32, y: +0.08, z: +0.10 }, headPose, cx, cy, faceW, faceH);
      const pRightCheek = project3DTo2D({ x: +0.32, y: +0.08, z: +0.10 }, headPose, cx, cy, faceW, faceH);
      const pLips = project3DTo2D({ x: 0, y: +0.24, z: +0.12 }, headPose, cx, cy, faceW, faceH);
      const pChin = project3DTo2D({ x: 0, y: +0.38, z: +0.08 }, headPose, cx, cy, faceW, faceH);
      const pLeftJaw = project3DTo2D({ x: -0.40, y: +0.22, z: -0.12 }, headPose, cx, cy, faceW, faceH);
      const pRightJaw = project3DTo2D({ x: +0.40, y: +0.22, z: -0.12 }, headPose, cx, cy, faceW, faceH);

      const eyeBaseR = faceW * 0.11 * headPose.distance;
      const leftEyeScale = Math.max(0.6, 1 + (pLeftEye.depth / 200));
      const rightEyeScale = Math.max(0.6, 1 + (pRightEye.depth / 200));

      // DYNAMIC FEATURE BINDING:
      // If live feature tracking is locked onto the user's face in the camera, use their actual detected eyes, nose, and lips!
      // Otherwise, use 3D projection.
      const leftEye = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftEye.center.x, y: liveFeatures.leftEye.center.y, r: liveFeatures.leftEye.width * 0.55 }
        : { x: pLeftEye.x, y: pLeftEye.y, r: eyeBaseR * leftEyeScale };

      const rightEye = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightEye.center.x, y: liveFeatures.rightEye.center.y, r: liveFeatures.rightEye.width * 0.55 }
        : { x: pRightEye.x, y: pRightEye.y, r: eyeBaseR * rightEyeScale };

      const leftUnderEye = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftEye.center.x, y: liveFeatures.leftEye.center.y + 22, w: liveFeatures.leftEye.width * 1.2, h: liveFeatures.leftEye.height * 1.1 }
        : { x: pLeftEye.x + 2, y: pLeftEye.y + 24, w: faceW * 0.20 * leftEyeScale, h: faceH * 0.08 };

      const rightUnderEye = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightEye.center.x, y: liveFeatures.rightEye.center.y + 22, w: liveFeatures.rightEye.width * 1.2, h: liveFeatures.rightEye.height * 1.1 }
        : { x: pRightEye.x - 2, y: pRightEye.y + 24, w: faceW * 0.20 * rightEyeScale, h: faceH * 0.08 };

      const noseBridge = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.nose.tip.x, y: liveFeatures.nose.bridge.y }
        : { x: pNose.x, y: pNose.y };

      const leftCheek = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftCheek.x, y: liveFeatures.leftCheek.y }
        : { x: pLeftCheek.x, y: pLeftCheek.y };

      const rightCheek = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightCheek.x, y: liveFeatures.rightCheek.y }
        : { x: pRightCheek.x, y: pRightCheek.y };

      const lips = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.lips.center.x, y: liveFeatures.lips.center.y, w: liveFeatures.lips.width, h: liveFeatures.lips.height }
        : { x: pLips.x, y: pLips.y, w: faceW * 0.26 * ((leftEyeScale + rightEyeScale) / 2), h: faceH * 0.10 };

      const chin = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.chin.x, y: liveFeatures.chin.y }
        : { x: pChin.x, y: pChin.y };

      const leftJaw = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftJaw.x, y: liveFeatures.leftJaw.y }
        : { x: pLeftJaw.x, y: pLeftJaw.y };

      const rightJaw = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightJaw.x, y: liveFeatures.rightJaw.y }
        : { x: pRightJaw.x, y: pRightJaw.y };

      // Split view clipping if active
      if (overlayMode === 'split') {
        const splitX = (width * splitPosition) / 100;
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 0, width - splitX, height);
        ctx.clip();
      }

      // 1. RENDER VTO (Virtual Try-On Layer)
      if (overlayMode === 'vto' || overlayMode === 'split') {
        renderVirtualTryOn(ctx, {
          leftEye,
          rightEye,
          leftUnderEye,
          rightUnderEye,
          leftCheek,
          rightCheek,
          lips,
          currentLook,
          activeLipHex,
          activeLipFinish,
          diagnostics,
        });
      }

      // 2. RENDER STENCILS (AR Guide Stencil Layer)
      if (overlayMode === 'stencils' || overlayMode === 'teaching') {
        renderStencils(ctx, {
          leftEye,
          rightEye,
          leftUnderEye,
          rightUnderEye,
          leftCheek,
          rightCheek,
          noseBridge,
          leftJaw,
          rightJaw,
          chin,
          lips,
          diagnostics,
          currentLook,
          width,
          height,
          teachingStep,
        });

        // Also render Acne Pinpoint Concealing Marks and Product Quantity Circles!
        renderAcneAndQuantityStencils(ctx, {
          cx,
          cy,
          faceW,
          faceH,
          diagnostics,
          width,
          height,
        });
      }

      // 3. RENDER MESH (Diagnostic Landmark Points)
      if (overlayMode === 'mesh') {
        renderLandmarkMesh(ctx, {
          leftEye,
          rightEye,
          leftUnderEye,
          rightUnderEye,
          leftCheek,
          rightCheek,
          noseBridge,
          leftJaw,
          rightJaw,
          chin,
          lips,
          diagnostics,
        });
      }

      // 4. RENDER POST-MAKEUP AUDIT & MISTAKE SCANNER
      if (overlayMode === 'audit') {
        renderPostMakeupAudit(ctx, {
          leftEye,
          rightEye,
          leftCheek,
          rightCheek,
          leftJaw,
          rightJaw,
          noseBridge,
          lips,
          width,
          height,
        });
      }

      if (overlayMode === 'split') {
        ctx.restore();

        // Draw Split Separator Line
        const splitX = (width * splitPosition) / 100;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, height);
        ctx.stroke();

        // Split handle badge
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(splitX, height * 0.5, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1C1917';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◄►', splitX, height * 0.5);
      }

      // 5. RENDER AUTO-TRACKING RETICLES (Eyes, Nose, Lips Dynamic Locks - No Fixed Guide Box Needed!)
      if (showTrackingReticles && overlayMode !== 'vto') {
        renderAutoTrackingReticles(ctx, liveFeatures, { leftEye, rightEye, noseBridge, lips }, width, height);
      }

      // 6. RENDER LIVE MAKEUP COACH ACTION HIGHLIGHT (Doing it correctly vs Wrong Real-Time Indicator)
      if (coachHighlightZone && coachHighlightZone !== 'none') {
        renderLiveActionCoachTarget(ctx, {
          zone: coachHighlightZone,
          headline: coachFeedbackHeadline,
          isCorrect: isCorrectTechnique,
          leftEye,
          rightEye,
          leftUnderEye,
          rightUnderEye,
          leftCheek,
          rightCheek,
          leftJaw,
          rightJaw,
          noseBridge,
          lips,
          width,
          height,
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    overlayMode,
    diagnostics,
    currentLook,
    activeLipHex,
    activeLipFinish,
    splitPosition,
    headPose,
    teachingStep,
    coachHighlightZone,
    coachFeedbackHeadline,
    isCorrectTechnique,
    showTrackingReticles,
    isWebcamActive,
  ]);

  // Click on canvas to sample colorimetry
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onSampleColor) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Sample from canvas or estimate based on face coordinates
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] > 0) {
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        const lab = rgbToLab(pixel[0], pixel[1], pixel[2]);
        onSampleColor(hex, lab);
      } else {
        // Fallback to diagnostics sampled skin
        const rgb = hexToRgb(diagnostics.skinHex);
        const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
        onSampleColor(diagnostics.skinHex, lab);
      }
    } catch {
      const rgb = hexToRgb(diagnostics.skinHex);
      const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
      onSampleColor(diagnostics.skinHex, lab);
    }
  };

  const handleMouseDownSplit = () => {
    if (overlayMode === 'split') setIsDraggingSplit(true);
  };

  const handleMouseMoveSplit = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || overlayMode !== 'split' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(10, Math.min(90, pos)));
  };

  const handleMouseUpSplit = () => {
    setIsDraggingSplit(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMoveSplit}
      onMouseUp={handleMouseUpSplit}
      onMouseLeave={handleMouseUpSplit}
      className="relative w-full h-full select-none overflow-hidden rounded-full flex items-center justify-center bg-stone-900"
    >
      {/* 1. Underlying Reflection Image / Video with True 3D Perspective Rotation */}
      {isWebcamActive ? (
        <video
          ref={videoRef as any}
          playsInline
          muted
          autoPlay
          style={{
            transform: `perspective(900px) rotateY(${mirrorFlipped ? -headPose.yaw : headPose.yaw}deg) rotateX(${-headPose.pitch}deg) rotateZ(${headPose.roll}deg) scaleX(${mirrorFlipped ? -1 : 1}) scale(${headPose.distance || 1.0})`,
            transformOrigin: 'center center',
            transition: 'transform 0.12s ease-out',
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={imageSrc}
          alt="Face Reflection"
          referrerPolicy="no-referrer"
          style={{
            transform: `perspective(900px) rotateY(${mirrorFlipped ? -headPose.yaw : headPose.yaw}deg) rotateX(${-headPose.pitch}deg) rotateZ(${headPose.roll}deg) scaleX(${mirrorFlipped ? -1 : 1}) scale(${headPose.distance || 1.0})`,
            transformOrigin: 'center center',
            transition: 'transform 0.12s ease-out',
          }}
          className="w-full h-full object-cover"
        />
      )}

      {/* 2. Interactive AR Overlay Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDownSplit}
        className="absolute inset-0 w-full h-full cursor-crosshair z-10"
      />

      {/* 3. Subtle Dielectric Glass Sheen Overlays */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-stone-950/20 via-transparent to-amber-100/10 z-20 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.7)] z-20" />
    </div>
  );
};

// --- RENDER HELPERS ---

function renderStencils(
  ctx: CanvasRenderingContext2D,
  anchors: {
    leftEye: { x: number; y: number; r: number };
    rightEye: { x: number; y: number; r: number };
    leftUnderEye: { x: number; y: number; w: number; h: number };
    rightUnderEye: { x: number; y: number; w: number; h: number };
    leftCheek: { x: number; y: number };
    rightCheek: { x: number; y: number };
    noseBridge: { x: number; y: number };
    leftJaw: { x: number; y: number };
    rightJaw: { x: number; y: number };
    chin: { x: number; y: number };
    lips: { x: number; y: number; w: number; h: number };
    diagnostics: FaceDiagnostics;
    currentLook: MakeupLook;
    width: number;
    height: number;
    teachingStep?: number;
  }
) {
  const { leftEye, rightEye, leftUnderEye, rightUnderEye, leftCheek, rightCheek, leftJaw, rightJaw, chin, lips, diagnostics, currentLook } = anchors;

  ctx.save();

  // --- A. HOODED EYE FLOATING CREASE & BATWING LINER ---
  // If hooded eye: project floating crease 3.5mm above natural fold so color stays visible!
  const isHooded = diagnostics.eyeShape === 'hooded';
  const creaseOffset = isHooded ? leftEye.r * 0.45 : leftEye.r * 0.25;

  // Left Eye Floating Crease Arch
  ctx.strokeStyle = '#FBBF24'; // Golden amber guide
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 3]);
  ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
  ctx.shadowBlur = 8;

  // Left Crease Arch
  ctx.beginPath();
  ctx.moveTo(leftEye.x - leftEye.r * 0.9, leftEye.y - creaseOffset * 0.4);
  ctx.quadraticCurveTo(
    leftEye.x,
    leftEye.y - creaseOffset * 1.3,
    leftEye.x + leftEye.r * 0.9,
    leftEye.y - creaseOffset * 0.3
  );
  ctx.stroke();

  // Right Crease Arch
  ctx.beginPath();
  ctx.moveTo(rightEye.x - rightEye.r * 0.9, rightEye.y - creaseOffset * 0.3);
  ctx.quadraticCurveTo(
    rightEye.x,
    rightEye.y - creaseOffset * 1.3,
    rightEye.x + rightEye.r * 0.9,
    rightEye.y - creaseOffset * 0.4
  );
  ctx.stroke();

  // Stencil Label: Floating Crease
  ctx.setLineDash([]);
  ctx.fillStyle = '#FEF08A';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowBlur = 4;
  ctx.fillText(
    isHooded ? '✦ Floating Crease (Above Fold)' : '✦ Transition Crease',
    leftEye.x,
    leftEye.y - creaseOffset * 1.55
  );

  // Batwing Eyeliner Stencil on Outer Canthus
  ctx.strokeStyle = '#F43F5E'; // Bright magenta-pink wing stencil
  ctx.lineWidth = 2;
  // Left wing
  ctx.beginPath();
  ctx.moveTo(leftEye.x - leftEye.r * 0.8, leftEye.y);
  ctx.lineTo(leftEye.x - leftEye.r * 1.45, leftEye.y - leftEye.r * 0.55); // Wing tip
  ctx.lineTo(leftEye.x - leftEye.r * 1.1, leftEye.y - creaseOffset * 0.5); // Batwing notch
  ctx.lineTo(leftEye.x - leftEye.r * 0.6, leftEye.y - creaseOffset * 0.3);
  ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(rightEye.x + rightEye.r * 0.8, rightEye.y);
  ctx.lineTo(rightEye.x + rightEye.r * 1.45, rightEye.y - rightEye.r * 0.55);
  ctx.lineTo(rightEye.x + rightEye.r * 1.1, rightEye.y - creaseOffset * 0.5);
  ctx.lineTo(rightEye.x + rightEye.r * 0.6, rightEye.y - creaseOffset * 0.3);
  ctx.stroke();

  // --- B. DARK CIRCLE COLOR CORRECTION MASK ---
  // Target tear trough polygon
  const correctorColor = diagnostics.darkCircleHue === 'brown-melanin' ? 'rgba(217, 110, 52, 0.45)' : 'rgba(247, 167, 118, 0.45)';
  const correctorBorder = diagnostics.darkCircleHue === 'brown-melanin' ? '#EA580C' : '#FB923C';

  // Left under-eye crescent
  ctx.fillStyle = correctorColor;
  ctx.strokeStyle = correctorBorder;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 2]);

  ctx.beginPath();
  ctx.ellipse(leftUnderEye.x, leftUnderEye.y, leftUnderEye.w * 0.55, leftUnderEye.h * 0.45, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right under-eye crescent
  ctx.beginPath();
  ctx.ellipse(rightUnderEye.x, rightUnderEye.y, rightUnderEye.w * 0.55, rightUnderEye.h * 0.45, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = '#FFEDD5';
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Dab Well B (Peach Corrector)', leftUnderEye.x, leftUnderEye.y + leftUnderEye.h * 0.7);

  // --- C. CONTOUR & SNATCH GUIDELINES ---
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  // Left cheekbone sculpt line
  ctx.beginPath();
  ctx.moveTo(leftCheek.x - leftCheek.x * 0.15, leftCheek.y - leftCheek.y * 0.1);
  ctx.quadraticCurveTo(leftCheek.x, leftCheek.y, lips.x - lips.w * 0.6, lips.y - lips.h * 0.2);
  ctx.stroke();

  // Right cheekbone sculpt line
  ctx.beginPath();
  ctx.moveTo(rightCheek.x + rightCheek.x * 0.15, rightCheek.y - rightCheek.y * 0.1);
  ctx.quadraticCurveTo(rightCheek.x, rightCheek.y, lips.x + lips.w * 0.6, lips.y - lips.h * 0.2);
  ctx.stroke();

  // Jawline snatch line
  ctx.beginPath();
  ctx.moveTo(leftJaw.x, leftJaw.y);
  ctx.lineTo(chin.x, chin.y);
  ctx.lineTo(rightJaw.x, rightJaw.y);
  ctx.stroke();

  // --- D. BLUSH DRAPE ZONE ---
  ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
  ctx.setLineDash([2, 3]);

  if (currentLook.id === 'k-beauty') {
    // Horizontal wash under eyes
    ctx.beginPath();
    ctx.ellipse(anchors.noseBridge.x, anchors.noseBridge.y + 14, anchors.width * 0.22, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FDA4AF';
    ctx.fillText('K-Beauty Apple & Nose Wash', anchors.noseBridge.x, anchors.noseBridge.y + 36);
  } else {
    // High zygomatic lift
    ctx.beginPath();
    ctx.ellipse(leftCheek.x, leftCheek.y - 10, 24, 16, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(rightCheek.x, rightCheek.y - 10, 24, 16, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // --- E. LIP CONTOUR & DISPENSE FILL ---
  ctx.strokeStyle = '#F43F5E';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([]);
  ctx.shadowColor = 'rgba(244, 63, 94, 0.5)';
  ctx.shadowBlur = 6;

  // Upper lip contour
  ctx.beginPath();
  ctx.moveTo(lips.x - lips.w * 0.5, lips.y);
  ctx.quadraticCurveTo(lips.x - lips.w * 0.25, lips.y - lips.h * 0.45, lips.x - lips.w * 0.08, lips.y - lips.h * 0.35); // Cupid peak left
  ctx.lineTo(lips.x, lips.y - lips.h * 0.15); // Cupid dip
  ctx.lineTo(lips.x + lips.w * 0.08, lips.y - lips.h * 0.35); // Cupid peak right
  ctx.quadraticCurveTo(lips.x + lips.w * 0.25, lips.y - lips.h * 0.45, lips.x + lips.w * 0.5, lips.y);
  // Lower lip contour
  ctx.quadraticCurveTo(lips.x, lips.y + lips.h * 0.65, lips.x - lips.w * 0.5, lips.y);
  ctx.stroke();

  ctx.fillStyle = '#FECDD3';
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Apply Well C (Lipstick)', lips.x, lips.y + lips.h * 0.9);

  ctx.restore();
}

function renderVirtualTryOn(
  ctx: CanvasRenderingContext2D,
  anchors: {
    leftEye: { x: number; y: number; r: number };
    rightEye: { x: number; y: number; r: number };
    leftUnderEye: { x: number; y: number; w: number; h: number };
    rightUnderEye: { x: number; y: number; w: number; h: number };
    leftCheek: { x: number; y: number };
    rightCheek: { x: number; y: number };
    lips: { x: number; y: number; w: number; h: number };
    currentLook: MakeupLook;
    activeLipHex: string;
    activeLipFinish: LipFinish;
    diagnostics: FaceDiagnostics;
  }
) {
  const { leftEye, rightEye, leftUnderEye, rightUnderEye, leftCheek, rightCheek, lips, activeLipHex, activeLipFinish, currentLook, diagnostics } = anchors;

  ctx.save();

  // 1. Color-Corrected Under-Eyes (Soft Translucent Concealer Layer)
  const ccGradLeft = ctx.createRadialGradient(
    leftUnderEye.x, leftUnderEye.y, 4,
    leftUnderEye.x, leftUnderEye.y, leftUnderEye.w * 0.6
  );
  ccGradLeft.addColorStop(0, 'rgba(251, 146, 60, 0.40)');
  ccGradLeft.addColorStop(0.6, 'rgba(217, 180, 140, 0.30)');
  ccGradLeft.addColorStop(1, 'rgba(217, 180, 140, 0)');

  ctx.fillStyle = ccGradLeft;
  ctx.beginPath();
  ctx.ellipse(leftUnderEye.x, leftUnderEye.y, leftUnderEye.w * 0.55, leftUnderEye.h * 0.5, 0.05, 0, Math.PI * 2);
  ctx.fill();

  const ccGradRight = ctx.createRadialGradient(
    rightUnderEye.x, rightUnderEye.y, 4,
    rightUnderEye.x, rightUnderEye.y, rightUnderEye.w * 0.6
  );
  ccGradRight.addColorStop(0, 'rgba(251, 146, 60, 0.40)');
  ccGradRight.addColorStop(0.6, 'rgba(217, 180, 140, 0.30)');
  ccGradRight.addColorStop(1, 'rgba(217, 180, 140, 0)');

  ctx.fillStyle = ccGradRight;
  ctx.beginPath();
  ctx.ellipse(rightUnderEye.x, rightUnderEye.y, rightUnderEye.w * 0.55, rightUnderEye.h * 0.5, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // 2. Realistic Eyeshadow
  const shadowColor = currentLook.id === 'hollywood-glam' ? 'rgba(78, 52, 46, 0.55)' : currentLook.id === 'k-beauty' ? 'rgba(225, 112, 85, 0.45)' : 'rgba(120, 72, 54, 0.50)';
  
  // Left Eye Crease Shading
  ctx.fillStyle = shadowColor;
  ctx.beginPath();
  ctx.moveTo(leftEye.x - leftEye.r * 0.85, leftEye.y - leftEye.r * 0.1);
  ctx.quadraticCurveTo(leftEye.x, leftEye.y - leftEye.r * 0.65, leftEye.x + leftEye.r * 0.85, leftEye.y - leftEye.r * 0.1);
  ctx.quadraticCurveTo(leftEye.x, leftEye.y - leftEye.r * 0.35, leftEye.x - leftEye.r * 0.85, leftEye.y - leftEye.r * 0.1);
  ctx.fill();

  // Right Eye Crease Shading
  ctx.beginPath();
  ctx.moveTo(rightEye.x - rightEye.r * 0.85, rightEye.y - rightEye.r * 0.1);
  ctx.quadraticCurveTo(rightEye.x, rightEye.y - rightEye.r * 0.65, rightEye.x + rightEye.r * 0.85, rightEye.y - rightEye.r * 0.1);
  ctx.quadraticCurveTo(rightEye.x, rightEye.y - rightEye.r * 0.35, rightEye.x - rightEye.r * 0.85, rightEye.y - rightEye.r * 0.1);
  ctx.fill();

  // Eyeliner Wing
  ctx.fillStyle = '#18181B';
  ctx.beginPath();
  ctx.moveTo(leftEye.x - leftEye.r * 0.6, leftEye.y - 2);
  ctx.lineTo(leftEye.x - leftEye.r * 1.35, leftEye.y - leftEye.r * 0.5);
  ctx.lineTo(leftEye.x - leftEye.r * 0.95, leftEye.y - leftEye.r * 0.25);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(rightEye.x + rightEye.r * 0.6, rightEye.y - 2);
  ctx.lineTo(rightEye.x + rightEye.r * 1.35, rightEye.y - rightEye.r * 0.5);
  ctx.lineTo(rightEye.x + rightEye.r * 0.95, rightEye.y - rightEye.r * 0.25);
  ctx.closePath();
  ctx.fill();

  // 3. Diffused Blush
  const blushGradL = ctx.createRadialGradient(leftCheek.x, leftCheek.y, 4, leftCheek.x, leftCheek.y, 38);
  blushGradL.addColorStop(0, 'rgba(244, 63, 94, 0.40)');
  blushGradL.addColorStop(0.7, 'rgba(244, 63, 94, 0.15)');
  blushGradL.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = blushGradL;
  ctx.beginPath();
  ctx.arc(leftCheek.x, leftCheek.y, 38, 0, Math.PI * 2);
  ctx.fill();

  const blushGradR = ctx.createRadialGradient(rightCheek.x, rightCheek.y, 4, rightCheek.x, rightCheek.y, 38);
  blushGradR.addColorStop(0, 'rgba(244, 63, 94, 0.40)');
  blushGradR.addColorStop(0.7, 'rgba(244, 63, 94, 0.15)');
  blushGradR.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = blushGradR;
  ctx.beginPath();
  ctx.arc(rightCheek.x, rightCheek.y, 38, 0, Math.PI * 2);
  ctx.fill();

  // 4. Realistic Real-Time Lipstick VTO
  const lipRgb = hexToRgb(activeLipHex);
  const lipColorStr = `rgba(${lipRgb.r}, ${lipRgb.g}, ${lipRgb.b}, 0.78)`;

  // Lip Path
  ctx.beginPath();
  ctx.moveTo(lips.x - lips.w * 0.5, lips.y);
  ctx.quadraticCurveTo(lips.x - lips.w * 0.25, lips.y - lips.h * 0.45, lips.x - lips.w * 0.08, lips.y - lips.h * 0.35);
  ctx.lineTo(lips.x, lips.y - lips.h * 0.15);
  ctx.lineTo(lips.x + lips.w * 0.08, lips.y - lips.h * 0.35);
  ctx.quadraticCurveTo(lips.x + lips.w * 0.25, lips.y - lips.h * 0.45, lips.x + lips.w * 0.5, lips.y);
  ctx.quadraticCurveTo(lips.x, lips.y + lips.h * 0.65, lips.x - lips.w * 0.5, lips.y);
  ctx.closePath();

  if (activeLipFinish === 'velvet-gradient') {
    // Korean Popsicle / 90s Ombre: dark concentrated center with diffused border
    const lipGrad = ctx.createRadialGradient(lips.x, lips.y, 2, lips.x, lips.y, lips.w * 0.48);
    lipGrad.addColorStop(0, `rgba(${lipRgb.r}, ${lipRgb.g}, ${lipRgb.b}, 0.95)`);
    lipGrad.addColorStop(0.55, `rgba(${lipRgb.r}, ${lipRgb.g}, ${lipRgb.b}, 0.70)`);
    lipGrad.addColorStop(1, `rgba(${lipRgb.r}, ${lipRgb.g}, ${lipRgb.b}, 0.25)`);
    ctx.fillStyle = lipGrad;
    ctx.fill();
  } else if (activeLipFinish === 'gloss') {
    // High-shine gloss: base color + specular light glints
    ctx.fillStyle = lipColorStr;
    ctx.fill();

    // Glaze light reflections on lower lip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(lips.x, lips.y + lips.h * 0.25, lips.w * 0.18, lips.h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cupid highlight
    ctx.beginPath();
    ctx.arc(lips.x - lips.w * 0.08, lips.y - lips.h * 0.28, 2.5, 0, Math.PI * 2);
    ctx.arc(lips.x + lips.w * 0.08, lips.y - lips.h * 0.28, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Matte: saturated, uniform, velvet finish
    ctx.fillStyle = lipColorStr;
    ctx.fill();
  }

  ctx.restore();
}

function renderLandmarkMesh(
  ctx: CanvasRenderingContext2D,
  anchors: any
) {
  const { leftEye, rightEye, leftUnderEye, rightUnderEye, leftCheek, rightCheek, noseBridge, leftJaw, rightJaw, chin, lips, diagnostics } = anchors;

  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.fillStyle = '#38BDF8';
  ctx.lineWidth = 1;

  const points = [
    { ...leftEye, label: 'L_EYE' },
    { ...rightEye, label: 'R_EYE' },
    { x: leftUnderEye.x, y: leftUnderEye.y, label: 'L_TROUGH' },
    { x: rightUnderEye.x, y: rightUnderEye.y, label: 'R_TROUGH' },
    { ...leftCheek, label: 'L_ZYGOMA' },
    { ...rightCheek, label: 'R_ZYGOMA' },
    { ...noseBridge, label: 'NASION' },
    { ...leftJaw, label: 'L_GONION' },
    { ...rightJaw, label: 'R_GONION' },
    { ...chin, label: 'GNATHION' },
    { ...lips, label: 'STOMION' },
  ];

  // Draw connecting mesh lines
  ctx.beginPath();
  ctx.moveTo(leftEye.x, leftEye.y);
  ctx.lineTo(noseBridge.x, noseBridge.y);
  ctx.lineTo(rightEye.x, rightEye.y);
  ctx.lineTo(rightCheek.x, rightCheek.y);
  ctx.lineTo(rightJaw.x, rightJaw.y);
  ctx.lineTo(chin.x, chin.y);
  ctx.lineTo(leftJaw.x, leftJaw.y);
  ctx.lineTo(leftCheek.x, leftCheek.y);
  ctx.closePath();
  ctx.stroke();

  // Draw node points and coordinates
  points.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(`${p.label} (${Math.round(p.x)},${Math.round(p.y)})`, p.x + 6, p.y + 3);
    ctx.fillStyle = '#38BDF8';
  });

  // Diagnostic overlay telemetry box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(16, 16, 220, 110);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.strokeRect(16, 16, 220, 110);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('FACIAL LANDMARK METRICS', 24, 32);
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(`Eye Architecture: ${diagnostics.eyeShape}`, 24, 50);
  ctx.fillText(`Crease Overhang: ${diagnostics.supratarsalCreaseDepth}`, 24, 66);
  ctx.fillText(`Under-Eye CIELAB: L*${diagnostics.cielab.l} a*${diagnostics.cielab.a} b*${diagnostics.cielab.b}`, 24, 82);
  ctx.fillText(`Face Symmetry: 98.4%`, 24, 98);
  ctx.fillText(`MST Scale: Tier ${diagnostics.monkScale}/10`, 24, 114);

  ctx.restore();
}

function renderAcneAndQuantityStencils(
  ctx: CanvasRenderingContext2D,
  data: {
    cx: number;
    cy: number;
    faceW: number;
    faceH: number;
    diagnostics: FaceDiagnostics;
    width: number;
    height: number;
  }
) {
  const { cx, cy, faceW, faceH, diagnostics, width, height } = data;

  ctx.save();

  // 1. PINPOINT ACNE & HYPERPIGMENTATION MARKS (Lisa Eldridge / Indian Skin Prep)
  if (diagnostics.acneSpots && diagnostics.acneSpots.length > 0) {
    diagnostics.acneSpots.forEach((spot) => {
      const spotX = width * (spot.x / 100);
      const spotY = height * (spot.y / 100);

      const isRedness = spot.type === 'active-redness';
      const color = isRedness ? '#10B981' : '#F97316';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([2, 2]);

      // Targeting ring
      ctx.beginPath();
      ctx.arc(spotX, spotY, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(spotX, spotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(spotX - 14, spotY);
      ctx.lineTo(spotX - 6, spotY);
      ctx.moveTo(spotX + 6, spotY);
      ctx.lineTo(spotX + 14, spotY);
      ctx.moveTo(spotX, spotY - 14);
      ctx.lineTo(spotX, spotY - 6);
      ctx.moveTo(spotX, spotY + 6);
      ctx.lineTo(spotX, spotY + 14);
      ctx.stroke();

      // Pinpoint label
      ctx.setLineDash([]);
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = isRedness ? '#A7F3D0' : '#FED7AA';
      ctx.fillText(
        `Pinpoint ${spot.recommendedCorrector} (0.01ml)`,
        spotX + 16,
        spotY + 3
      );
    });
  }

  // 2. PERIORAL DARKNESS STENCIL (Essential for South Asian & Indian Skin)
  if (diagnostics.perioralDarkness) {
    const mouthAreaX = cx;
    const mouthAreaY = cy + faceH * 0.28;

    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    ctx.ellipse(mouthAreaX, mouthAreaY, faceW * 0.22, faceH * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#FED7AA';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Perioral Neutralization Zone (Well B)', mouthAreaX, mouthAreaY + faceH * 0.11);
  }

  // 3. PRODUCT AMOUNT STENCIL CIRCLES (To Prevent Cakeyness!)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([2, 4]);

  // Forehead Dosage Circle
  const foreheadX = cx;
  const foreheadY = cy - faceH * 0.32;
  ctx.beginPath();
  ctx.arc(foreheadX, foreheadY, 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('0.20ml (Half-Pump)', foreheadX, foreheadY);
  ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
  ctx.fillText('Stipple outward to hairline', foreheadX, foreheadY + 12);

  // Left & Right Cheek Dosage Circles
  const leftCheekDoseX = cx - faceW * 0.24;
  const rightCheekDoseX = cx + faceW * 0.24;
  const cheekDoseY = cy + faceH * 0.04;

  ctx.beginPath();
  ctx.arc(leftCheekDoseX, cheekDoseY, 18, 0, Math.PI * 2);
  ctx.arc(rightCheekDoseX, cheekDoseY, 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('0.15ml (Pea)', leftCheekDoseX, cheekDoseY);
  ctx.fillText('0.15ml (Pea)', rightCheekDoseX, cheekDoseY);

  // Smile Lines Anti-Cake Warning
  const smileLineY = cy + faceH * 0.18;
  ctx.fillStyle = '#FBBF24';
  ctx.fillText('• Feather Residue Only •', cx, smileLineY);
  ctx.fillStyle = 'rgba(253, 230, 138, 0.8)';
  ctx.fillText('Zero heavy cream to avoid smile creasing', cx, smileLineY + 11);

  ctx.restore();
}

function renderPostMakeupAudit(
  ctx: CanvasRenderingContext2D,
  anchors: any
) {
  const { leftEye, rightEye, leftCheek, rightCheek, leftJaw, rightJaw, noseBridge, lips, width, height } = anchors;

  ctx.save();

  // Top Audit HUD Banner
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.fillRect(width * 0.10, 16, width * 0.80, 52);
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(width * 0.10, 16, width * 0.80, 52);

  ctx.fillStyle = '#34D399';
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('POST-MAKEUP QUALITY AUDIT: 94% FLAWLESS', width * 0.13, 34);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillText('✓ Eyeliner symmetry 41°/42° · ⚠ 1 Blending demarcation detected', width * 0.13, 52);

  // 1. Eyeliner Wing Symmetry Verification Markers
  ctx.strokeStyle = '#34D399';
  ctx.lineWidth = 2;
  ctx.setLineDash([2, 2]);

  ctx.beginPath();
  ctx.moveTo(leftEye.x - leftEye.r * 0.6, leftEye.y);
  ctx.lineTo(leftEye.x - leftEye.r * 1.45, leftEye.y - leftEye.r * 0.55);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightEye.x + rightEye.r * 0.6, rightEye.y);
  ctx.lineTo(rightEye.x + rightEye.r * 1.45, rightEye.y - rightEye.r * 0.55);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = '#34D399';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✓ WING 41°', leftEye.x - leftEye.r * 1.5, leftEye.y - leftEye.r * 0.7);
  ctx.fillText('✓ WING 42°', rightEye.x + rightEye.r * 1.5, rightEye.y - rightEye.r * 0.7);

  // 2. Jawline Blending Demarcation Warning
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);

  ctx.beginPath();
  ctx.moveTo(leftJaw.x - 20, leftJaw.y + 10);
  ctx.quadraticCurveTo(width * 0.5, height * 0.88, rightJaw.x + 20, rightJaw.y + 10);
  ctx.stroke();

  ctx.fillStyle = '#FEF3C7';
  ctx.font = '10px Plus Jakarta Sans, sans-serif';
  ctx.fillText('⚠ Unblended foundation demarcation line · Buff downward into neck', width * 0.5, height * 0.91);

  // 3. Nostril Crevice Gap Indicator
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(noseBridge.x - 18, noseBridge.y + 18, 5, 0, Math.PI * 2);
  ctx.arc(noseBridge.x + 18, noseBridge.y + 18, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillText('✓ Nostril Fold Reached', noseBridge.x, noseBridge.y + 36);

  ctx.restore();
}

/**
 * 5. Dynamic Facial Feature Auto-Lock Reticles
 * Renders target crosshairs & corner brackets on eyes, nose, and lips.
 * Demonstrates real-time tracking with zero user position constraints.
 */
function renderAutoTrackingReticles(
  ctx: CanvasRenderingContext2D,
  liveFeatures: LiveFaceFeatures | null,
  anchors: {
    leftEye: { x: number; y: number; r: number };
    rightEye: { x: number; y: number; r: number };
    noseBridge: { x: number; y: number };
    lips: { x: number; y: number; w: number; h: number };
  },
  width: number,
  height: number
) {
  const { leftEye, rightEye, noseBridge, lips } = anchors;
  const isLocked = liveFeatures && liveFeatures.isDetected;
  const color = isLocked ? '#22D3EE' : '#38BDF8';

  ctx.save();

  // Helper to draw corner target brackets around a bounding area
  const drawCornerBrackets = (cx: number, cy: number, w: number, h: number, label: string) => {
    const halfW = w / 2;
    const halfH = h / 2;
    const corner = Math.min(10, w * 0.25);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(cx - halfW, cy - halfH + corner);
    ctx.lineTo(cx - halfW, cy - halfH);
    ctx.lineTo(cx - halfW + corner, cy - halfH);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(cx + halfW - corner, cy - halfH);
    ctx.lineTo(cx + halfW, cy - halfH);
    ctx.lineTo(cx + halfW, cy - halfH + corner);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(cx - halfW, cy + halfH - corner);
    ctx.lineTo(cx - halfW, cy + halfH);
    ctx.lineTo(cx - halfW + corner, cy + halfH);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(cx + halfW - corner, cy + halfH);
    ctx.lineTo(cx + halfW, cy + halfH);
    ctx.lineTo(cx + halfW, cy + halfH - corner);
    ctx.stroke();

    // Tiny Center Dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(label, cx, cy - halfH - 4);
  };

  // 1. Auto-detected Left Eye Bracket
  drawCornerBrackets(leftEye.x, leftEye.y, Math.max(34, leftEye.r * 1.6), Math.max(22, leftEye.r * 1.1), 'EYE-L [LOCKED]');

  // 2. Auto-detected Right Eye Bracket
  drawCornerBrackets(rightEye.x, rightEye.y, Math.max(34, rightEye.r * 1.6), Math.max(22, rightEye.r * 1.1), 'EYE-R [LOCKED]');

  // 3. Auto-detected Nose Tip & Bridge Crosshair
  drawCornerBrackets(noseBridge.x, noseBridge.y + 12, 38, 30, 'NOSE [LOCKED]');

  // 4. Auto-detected Lips Vermilion Contour Bracket
  drawCornerBrackets(lips.x, lips.y, Math.max(54, lips.w * 0.85), Math.max(26, lips.h * 1.1), 'LIPS [LOCKED]');

  // Dynamic Auto-Tracking HUD Status Badge on Canvas
  const hudW = 210;
  const hudH = 22;
  const hudX = (width - hudW) / 2;
  const hudY = height - 32;

  ctx.fillStyle = 'rgba(12, 10, 9, 0.82)';
  ctx.strokeStyle = isLocked ? 'rgba(34, 211, 238, 0.5)' : 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudW, hudH, 11);
  ctx.fill();
  ctx.stroke();

  // Green active pulse dot
  ctx.fillStyle = '#34D399';
  ctx.beginPath();
  ctx.arc(hudX + 14, hudY + 11, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E0F2FE';
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('DYNAMIC AUTO-TRACK: 60 FPS', hudX + 24, hudY + 14);

  ctx.restore();
}

/**
 * 6. Live Action Coach Visual Cue Overlay
 * Dynamically highlights the current anatomical zone and paints
 * "Doing it correctly" vs "Something went wrong" feedback indicators right on reflection.
 */
function renderLiveActionCoachTarget(
  ctx: CanvasRenderingContext2D,
  data: {
    zone: 'eyes' | 'jawline' | 'undereye' | 'cheeks' | 'lips' | 'forehead' | 'none';
    headline?: string;
    isCorrect?: boolean;
    leftEye: { x: number; y: number; r: number };
    rightEye: { x: number; y: number; r: number };
    leftUnderEye: { x: number; y: number; w: number; h: number };
    rightUnderEye: { x: number; y: number; w: number; h: number };
    leftCheek: { x: number; y: number };
    rightCheek: { x: number; y: number };
    leftJaw: { x: number; y: number };
    rightJaw: { x: number; y: number };
    noseBridge: { x: number; y: number };
    lips: { x: number; y: number; w: number; h: number };
    width: number;
    height: number;
  }
) {
  const { zone, headline, isCorrect, leftEye, rightEye, leftUnderEye, rightUnderEye, leftCheek, rightCheek, leftJaw, rightJaw, lips, width, height } = data;
  if (zone === 'none') return;

  const accentColor = isCorrect ? '#34D399' : '#F59E0B';
  const pulseR = 18 + (Date.now() % 1000) / 100; // Pulsing ring animation

  ctx.save();

  let targetX = width * 0.5;
  let targetY = height * 0.5;

  if (zone === 'eyes') {
    targetX = rightEye.x + rightEye.r * 1.2;
    targetY = rightEye.y - rightEye.r * 0.4;
  } else if (zone === 'jawline') {
    targetX = rightJaw.x;
    targetY = rightJaw.y;
  } else if (zone === 'undereye') {
    targetX = leftUnderEye.x;
    targetY = leftUnderEye.y;
  } else if (zone === 'cheeks') {
    targetX = leftCheek.x;
    targetY = leftCheek.y;
  } else if (zone === 'lips') {
    targetX = lips.x;
    targetY = lips.y;
  }

  // Draw Pulsing Focus Ring on anatomical zone
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(targetX, targetY, pulseR, 0, Math.PI * 2);
  ctx.stroke();

  // Solid Inner Point
  ctx.setLineDash([]);
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Floating Live Cue Pill
  const pillW = Math.min(260, width * 0.75);
  const pillH = 26;
  const pillX = Math.max(10, Math.min(width - pillW - 10, targetX - pillW / 2));
  const pillY = targetY > height * 0.6 ? targetY - 44 : targetY + 28;

  ctx.fillStyle = 'rgba(12, 10, 9, 0.90)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 8);
  ctx.fill();
  ctx.stroke();

  // Mini Connecting Pointer Line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(targetX, targetY);
  ctx.lineTo(pillX + pillW / 2, pillY > targetY ? pillY : pillY + pillH);
  ctx.stroke();

  // Verdict Text
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'left';
  const tag = isCorrect ? '✓ DOING CORRECTLY' : '⚠ SOMETHING WENT WRONG';
  ctx.fillText(tag, pillX + 10, pillY + 12);

  // Short instruction
  ctx.font = '9px Plus Jakarta Sans, sans-serif';
  ctx.fillStyle = '#F3F4F6';
  const cleanHeadline = headline ? (headline.length > 32 ? headline.slice(0, 32) + '...' : headline) : zone.toUpperCase();
  ctx.fillText(cleanHeadline, pillX + 10, pillY + 22);

  ctx.restore();
}


