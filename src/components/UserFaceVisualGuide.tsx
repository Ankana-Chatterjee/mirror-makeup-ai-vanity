import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Eye, 
  Layers, 
  Droplets, 
  Shield, 
  ArrowRight, 
  Sliders, 
  Camera, 
  Upload, 
  Trash2, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertCircle,
  HelpCircle,
  Maximize2,
  RefreshCw,
  Columns,
  XCircle,
  Crosshair,
  Compass,
  Palette
} from 'lucide-react';
import { RoutineStep, FaceAnalysisData, LookMoodId } from '../types/glowguide';
import { FaceLandmarkTracker, LiveFaceFeatures, getDefaultFaceFeatures } from '../utils/faceLandmarkTracker';
import { StepDiagramVisualizer } from './StepDiagramVisualizer';
import { 
  EyeMasterclassVisualizer, 
  LinerStyle, 
  ShadowLayer, 
  LOOK_EYESHADOW_PALETTES, 
  LINER_GUIDES 
} from './EyeMasterclassVisualizer';

interface UserFaceVisualGuideProps {
  step: number; // 0 to 5
  activeStepObj: RoutineStep;
  photoUrl: string | null;
  isCameraActive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  cameraStream?: MediaStream | null;
  faceAnalysis?: FaceAnalysisData | null;
  isAnalyzing?: boolean;
  selectedLook?: LookMoodId;
  onCancelScan?: () => void;
  onUploadClick: () => void;
  onCameraToggle: () => void;
  onDeletePhoto?: () => void;
  onStepChange?: (stepIdx: number) => void;
}

type ViewMode = 'on-face' | 'split' | 'diagram';
type Step1ZoneFilter = 'all' | 'hydration' | 'barrier' | 'orbital' | 'lymphatic';

export const UserFaceVisualGuide: React.FC<UserFaceVisualGuideProps> = ({
  step,
  activeStepObj,
  photoUrl,
  isCameraActive,
  videoRef,
  cameraStream,
  faceAnalysis,
  isAnalyzing = false,
  selectedLook = 'clean',
  onCancelScan,
  onUploadClick,
  onCameraToggle,
  onDeletePhoto,
  onStepChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const internalGuideVideoRef = useRef<HTMLVideoElement | null>(null);
  const trackerRef = useRef<FaceLandmarkTracker>(new FaceLandmarkTracker());
  const liveFeaturesRef = useRef<LiveFaceFeatures | null>(null);

  // Sync cameraStream to internal guide video element seamlessly without page refresh
  useEffect(() => {
    const vid = internalGuideVideoRef.current;
    if (!vid) return;
    if (cameraStream && isCameraActive) {
      if (vid.srcObject !== cameraStream) {
        vid.srcObject = cameraStream;
      }
      vid.play().catch(() => {});
    } else if (!isCameraActive) {
      vid.srcObject = null;
    }
  }, [cameraStream, isCameraActive]);

  // Interaction State
  const [viewMode, setViewMode] = useState<ViewMode>(photoUrl || isCameraActive ? 'on-face' : 'on-face');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.85); // 0.2 to 1.0
  const [step1Filter, setStep1Filter] = useState<Step1ZoneFilter>('all');
  const [activeLinerStyle, setActiveLinerStyle] = useState<LinerStyle>('winged');
  const [activeShadowLayer, setActiveShadowLayer] = useState<ShadowLayer>('all');
  const [showEyeMasterclass, setShowEyeMasterclass] = useState<boolean>(true);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage 0 to 100
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [isHoveredZone, setIsHoveredZone] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState<number>(0);
  const [showZoneGuide, setShowZoneGuide] = useState<boolean>(true);
  const [showFeatureAnchors, setShowFeatureAnchors] = useState<boolean>(true);

  // Track static image when loaded
  const handleImageLoad = () => {
    if (imageRef.current && canvasRef.current) {
      if (faceAnalysis?.landmarks) {
        liveFeaturesRef.current = trackerRef.current.buildFeaturesFromLandmarks(
          faceAnalysis.landmarks,
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight,
          imageRef.current,
          false
        );
      } else {
        trackerRef.current
          .trackFeatures(imageRef.current, canvasRef.current.clientWidth, canvasRef.current.clientHeight)
          .then((feats) => {
            liveFeaturesRef.current = feats;
          });
      }
    }
  };

  // If photo or camera becomes active and user was on diagram, give priority to on-face
  useEffect(() => {
    if ((photoUrl || isCameraActive) && viewMode === 'diagram') {
      setViewMode('on-face');
    }
  }, [photoUrl, isCameraActive]);

  // Pulse animation for active hydration and barrier zones
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      setPulsePhase((Math.sin(elapsed * 2.5) + 1) / 2); // 0 to 1
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode === 'diagram') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      let liveFeatures = liveFeaturesRef.current;
      const activeVideoEl = internalGuideVideoRef.current || videoRef?.current;

      // 1. If we have calibrated landmarks from Gemini AI Vision analysis, prioritize them!
      if (faceAnalysis?.landmarks) {
        liveFeatures = trackerRef.current.buildFeaturesFromLandmarks(
          faceAnalysis.landmarks,
          width,
          height,
          photoUrl ? imageRef.current : activeVideoEl,
          isCameraActive
        );
      } else if (isCameraActive && activeVideoEl && activeVideoEl.readyState >= 2) {
        trackerRef.current.trackFeatures(activeVideoEl, width, height).then((feats) => {
          liveFeaturesRef.current = feats;
        });
      } else if (photoUrl && imageRef.current && !liveFeaturesRef.current?.isDetected) {
        trackerRef.current.trackFeatures(imageRef.current, width, height).then((feats) => {
          liveFeaturesRef.current = feats;
        });
      }

      // Determine face baseline coordinates
      const cx = width * 0.5;
      const cy = height * 0.48;
      const fw = liveFeatures?.faceBox?.width || width * 0.52;
      const fh = liveFeatures?.faceBox?.height || height * 0.68;

      // Extract calibrated landmark points: prioritize detected features
      const leftEye = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftEye.center.x, y: liveFeatures.leftEye.center.y, r: Math.max(16, liveFeatures.leftEye.width * 0.5) }
        : { x: cx - fw * 0.22, y: cy - fh * 0.12, r: fw * 0.11 };

      const rightEye = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightEye.center.x, y: liveFeatures.rightEye.center.y, r: Math.max(16, liveFeatures.rightEye.width * 0.5) }
        : { x: cx + fw * 0.22, y: cy - fh * 0.12, r: fw * 0.11 };

      const noseBridge = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.nose.bridge.x, y: liveFeatures.nose.bridge.y }
        : { x: cx, y: cy - fh * 0.04 };

      const noseTip = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.nose.tip.x, y: liveFeatures.nose.tip.y }
        : { x: cx, y: cy + fh * 0.04 };

      const leftCheek = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftCheek.x, y: liveFeatures.leftCheek.y }
        : { x: cx - fw * 0.30, y: cy + fh * 0.06 };

      const rightCheek = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightCheek.x, y: liveFeatures.rightCheek.y }
        : { x: cx + fw * 0.30, y: cy + fh * 0.06 };

      const lips = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.lips.center.x, y: liveFeatures.lips.center.y, w: liveFeatures.lips.width, h: liveFeatures.lips.height }
        : { x: cx, y: cy + fh * 0.23, w: fw * 0.28, h: fh * 0.09 };

      const chin = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.chin.x, y: liveFeatures.chin.y }
        : { x: cx, y: cy + fh * 0.38 };

      const forehead = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.forehead.x, y: liveFeatures.forehead.y }
        : { x: cx, y: cy - fh * 0.32 };

      const leftJaw = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.leftJaw.x, y: liveFeatures.leftJaw.y }
        : { x: cx - fw * 0.38, y: cy + fh * 0.26 };

      const rightJaw = liveFeatures && liveFeatures.isDetected
        ? { x: liveFeatures.rightJaw.x, y: liveFeatures.rightJaw.y }
        : { x: cx + fw * 0.38, y: cy + fh * 0.26 };

      // Apply Split Clipping if split view mode is active
      if (viewMode === 'split') {
        const splitX = (width * splitPosition) / 100;
        ctx.save();
        ctx.beginPath();
        ctx.rect(splitX, 0, width - splitX, height);
        ctx.clip();
      }

      ctx.save();
      ctx.globalAlpha = overlayOpacity;

      // ==========================================
      // STEP 1: HYDRATE & BARRIER PRIME OVERLAY
      // ==========================================
      if (step === 0) {
        renderStep1HydrateAndBarrier({
          ctx,
          width,
          height,
          forehead,
          noseBridge,
          noseTip,
          leftEye,
          rightEye,
          leftCheek,
          rightCheek,
          leftJaw,
          rightJaw,
          lips,
          chin,
          fw,
          fh,
          pulse: pulsePhase,
          filter: step1Filter,
        });
      } 
      // ==========================================
      // STEP 2: PRIMER (PORE BLUR & GRIP)
      // ==========================================
      else if (step === 1) {
        renderStep2Primer({
          ctx,
          forehead,
          noseBridge,
          noseTip,
          leftCheek,
          rightCheek,
          lips,
          chin,
          fw,
          fh,
          pulse: pulsePhase,
        });
      }
      // ==========================================
      // STEP 3: COLOR CORRECT
      // ==========================================
      else if (step === 2) {
        renderStep3ColorCorrect({
          ctx,
          leftEye,
          rightEye,
          noseTip,
          chin,
          faceAnalysis,
          pulse: pulsePhase,
        });
      }
      // ==========================================
      // STEP 4: FOUNDATION & CONCEALER
      // ==========================================
      else if (step === 3) {
        renderStep4BaseAndConcealer({
          ctx,
          forehead,
          leftEye,
          rightEye,
          leftCheek,
          rightCheek,
          chin,
          leftJaw,
          rightJaw,
          fw,
          fh,
          pulse: pulsePhase,
        });
      }
      // ==========================================
      // STEP 5: EYES, BROWS & CHEEKS SCULPT
      // ==========================================
      else if (step === 4) {
        renderStep5Features({
          ctx,
          leftEye,
          rightEye,
          leftCheek,
          rightCheek,
          lips,
          faceAnalysis,
          selectedLook,
          linerStyle: activeLinerStyle,
          shadowFilter: activeShadowLayer,
          pulse: pulsePhase,
        });
      }
      // ==========================================
      // STEP 6: SETTING & FINAL SYMMETRY CHECK
      // ==========================================
      else if (step === 5) {
        renderStep6SettingAndAudit({
          ctx,
          forehead,
          noseBridge,
          leftEye,
          rightEye,
          leftCheek,
          rightCheek,
          chin,
          width,
          height,
        });
      }

      ctx.restore();

      // Render aesthetic cosmetic anchor crosshairs & labels on detected features
      if (showFeatureAnchors && (photoUrl || isCameraActive) && liveFeatures?.isDetected) {
        ctx.save();
        const drawAnchor = (pt: { x: number; y: number }, color: string, label: string) => {
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 4;
          ctx.fillText(label, pt.x, pt.y - 12);
          ctx.shadowBlur = 0;
        };

        drawAnchor(leftEye, '#38bdf8', 'EYE L');
        drawAnchor(rightEye, '#38bdf8', 'EYE R');
        drawAnchor(noseTip, '#f59e0b', 'NOSE');
        drawAnchor(leftCheek, '#ec4899', 'CHEEK L');
        drawAnchor(rightCheek, '#ec4899', 'CHEEK R');
        drawAnchor(lips, '#fb7185', 'LIPS');
        ctx.restore();
      }

      // Split Divider line and drag handle
      if (viewMode === 'split') {
        ctx.restore(); // release clip

        const splitX = (width * splitPosition) / 100;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(splitX, 0);
        ctx.lineTo(splitX, height);
        ctx.stroke();

        // Central Handle pill
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(splitX - 16, height * 0.5 - 16, 32, 32, 16);
        ctx.fill();
        ctx.strokeStyle = '#c45b78';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#29202a';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◄ ►', splitX, height * 0.5);

        // Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.fillText('NATURAL SKIN', splitX - 50, 24);
        ctx.fillText('ZONE MAP', splitX + 46, 24);
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [
    step,
    viewMode,
    overlayOpacity,
    step1Filter,
    splitPosition,
    pulsePhase,
    isCameraActive,
    photoUrl,
    faceAnalysis,
    showFeatureAnchors,
  ]);

  // Split mouse drag handler
  const handleMouseDownSplit = () => {
    if (viewMode === 'split') setIsDraggingSplit(true);
  };

  const handleMouseMoveSplit = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || viewMode !== 'split' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(5, Math.min(95, pos)));
  };

  const handleMouseUpSplit = () => {
    setIsDraggingSplit(false);
  };

  const hasUserFace = Boolean(photoUrl || isCameraActive);

  return (
    <div className="w-full flex flex-col rounded-2xl bg-[#fffdfc] border border-[#eadde1] overflow-hidden shadow-xs">
      {/* Top Header & Mode Toolbar */}
      <div className="p-3.5 px-4 bg-white border-b border-[#f4ebeb] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c45b78] animate-pulse" />
            <b className="text-xs text-[#29202a]">
              Step {step + 1} Visual Guide — {activeStepObj.tagline}
            </b>
          </div>
          <p className="text-[11px] text-[#766b77] mt-0.5">
            Anatomical placement map & color-coded zones projected on face
          </p>
        </div>

        {/* View Mode Toggle Segmented Control */}
        <div className="flex items-center gap-1 bg-[#f9f2f4] p-1 rounded-xl border border-[#eedfe3]">
          <button
            onClick={() => setViewMode('on-face')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'on-face'
                ? 'bg-white text-[#c45b78] shadow-xs'
                : 'text-[#665965] hover:text-[#29202a]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>On Face</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-white text-[#c45b78] shadow-xs'
                : 'text-[#665965] hover:text-[#29202a]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            onClick={() => setViewMode('diagram')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'diagram'
                ? 'bg-white text-[#c45b78] shadow-xs'
                : 'text-[#665965] hover:text-[#29202a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Studio Diagram</span>
          </button>

          {(photoUrl || isCameraActive) && (
            <button
              onClick={() => setShowFeatureAnchors(!showFeatureAnchors)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                showFeatureAnchors
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-white text-[#665965] border-transparent hover:text-[#29202a]'
              }`}
              title="Show / hide detected facial landmark anchors (eyes, nose, cheeks, lips)"
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showFeatureAnchors ? 'Feature Anchors' : 'Feature Anchors'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Display Area */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[460px] bg-gradient-to-b from-[#2a1c24] to-[#1a1117] flex items-center justify-center overflow-hidden">
        {/* If in Studio Diagram Mode, render pure vector diagram */}
        {viewMode === 'diagram' ? (
          <div className="w-full h-full p-4 flex items-center justify-center bg-[#fff8fa]">
            <div className="w-full max-w-[340px]">
              <StepDiagramVisualizer
                step={step}
                faceShape={faceAnalysis?.faceShape || 'oval'}
                eyeShape={faceAnalysis?.eyeShape || 'hooded'}
                isOverlayMode={false}
                selectedLook={selectedLook}
              />
            </div>
          </div>
        ) : (
          /* "On Face" or "Split Slider" Mode */
          <div
            ref={containerRef}
            onMouseMove={handleMouseMoveSplit}
            onMouseUp={handleMouseUpSplit}
            onMouseLeave={handleMouseUpSplit}
            className="relative w-full h-full select-none overflow-hidden flex items-center justify-center"
          >
            {/* 1. Underlying Face Media: Uploaded Photo, Live Video, or Studio Editorial Fallback */}
            {isCameraActive ? (
              <video
                ref={internalGuideVideoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : photoUrl ? (
              <img
                ref={imageRef}
                src={photoUrl}
                onLoad={handleImageLoad}
                alt="User Uploaded Face"
                className="w-full h-full object-cover"
              />
            ) : (
              /* High-fidelity studio canvas face so user can test before uploading */
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2f1f28] via-[#22161e] to-[#180e14] text-white p-6">
                <div className="w-32 h-40 rounded-[50%_50%_46%_46%] border border-rose-300/30 bg-gradient-to-b from-rose-100/10 to-rose-900/20 backdrop-blur-xs flex flex-col items-center justify-center relative shadow-inner">
                  <div className="text-rose-200/60 text-xs font-mono mb-2">• &nbsp; •</div>
                  <div className="text-rose-300/50 text-sm font-serif">⌣</div>
                  <div className="absolute top-3 text-[9px] font-mono tracking-widest text-rose-300/60 uppercase">
                    STUDIO REFERENCE
                  </div>
                </div>

                <div className="text-center mt-3 max-w-xs z-20">
                  <span className="text-xs font-semibold text-rose-200 block">
                    Project zones on your face
                  </span>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Upload a selfie or open camera to see real-time anatomical placement right on your features.
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      onClick={onUploadClick}
                      className="bg-[#c45b78] hover:bg-[#a84664] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Photo</span>
                    </button>
                    <button
                      onClick={onCameraToggle}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Open Camera</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Real-Time AR Placement Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDownSplit}
              className={`absolute inset-0 w-full h-full ${viewMode === 'split' ? 'cursor-ew-resize' : 'pointer-events-none'} z-10`}
            />

            {/* 3. Subtle Luxury Lens Sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-stone-950/25 via-transparent to-amber-200/10 z-20 mix-blend-screen" />
          </div>
        )}

        {/* Floating Tracking Status Badge */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
          {isCameraActive ? (
            <div className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE CAMERA FACE DETECTED (60 FPS)</span>
            </div>
          ) : faceAnalysis?.landmarks ? (
            <div className="px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-emerald-500/60 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AI CALIBRATED: EYES · NOSE · CHEEKS · LIPS ANCHORED</span>
            </div>
          ) : photoUrl ? (
            <div className="px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-500/50 text-[10px] font-mono text-amber-200 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>PHOTO READY · RUN AI ANALYSIS TO CALIBRATE FEATURES</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-200 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>STUDIO PLACEMENT SIMULATION</span>
            </div>
          )}
        </div>

        {/* Quick Camera / Photo Switcher in Top Right */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          {isAnalyzing && onCancelScan && (
            <button
              onClick={onCancelScan}
              title="Cancel ongoing face scan"
              className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-[11px] font-bold border border-red-400 flex items-center gap-1 transition shadow-lg animate-pulse"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Scan</span>
            </button>
          )}

          <button
            onClick={() => !isAnalyzing && onUploadClick()}
            disabled={isAnalyzing}
            title={isAnalyzing ? 'Upload is disabled during scan' : 'Upload different photo'}
            className={`p-1.5 rounded-lg bg-stone-900/80 backdrop-blur-md hover:bg-stone-800 text-stone-200 border border-stone-700 transition ${
              isAnalyzing ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={isAnalyzing && onCancelScan ? onCancelScan : onCameraToggle}
            title={isAnalyzing ? 'Cancel scan' : isCameraActive ? 'Stop camera' : 'Start live camera'}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition ${
              isCameraActive
                ? 'bg-[#c45b78] text-white border-[#c45b78]'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border-stone-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          {photoUrl && onDeletePhoto && !isAnalyzing && (
            <button
              onClick={onDeletePhoto}
              title="Delete photo for privacy"
              className="p-1.5 rounded-lg bg-red-950/80 backdrop-blur-md hover:bg-red-900 text-red-200 border border-red-700/60 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls & Zone Color-Coding Legend */}
      <div className="p-4 bg-white space-y-3.5 border-t border-[#f4ebeb]">
        {/* Opacity Slider */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#29202a] font-semibold">
            <Sliders className="w-3.5 h-3.5 text-[#c45b78]" />
            <span>Map Intensity & Opacity:</span>
            <span className="font-mono text-[#c45b78] text-[11px] font-bold">
              {Math.round(overlayOpacity * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <span className="text-[10px] text-[#766b77]">Sheer</span>
            <input
              type="range"
              min="20"
              max="100"
              value={Math.round(overlayOpacity * 100)}
              onChange={(e) => setOverlayOpacity(Number(e.target.value) / 100)}
              className="w-full accent-[#c45b78] cursor-pointer h-1.5 bg-[#f0dee3] rounded-lg"
            />
            <span className="text-[10px] text-[#766b77]">Vivid</span>
          </div>
        </div>

        {/* Step 1 Specific: Interactive Zone Filter Chips */}
        {step === 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-[#766b77] uppercase tracking-wide">
                Step 1 Color-Coded Anatomical Zones:
              </span>
              <button
                onClick={() => setShowZoneGuide(!showZoneGuide)}
                className="text-[11px] text-[#c45b78] hover:underline font-bold"
              >
                {showZoneGuide ? 'Hide legend' : 'Show details'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setStep1Filter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                  step1Filter === 'all'
                    ? 'bg-[#29202a] text-white border-[#29202a]'
                    : 'bg-[#fdf9f9] text-[#665965] border-[#eadde1] hover:border-[#c45b78]'
                }`}
              >
                All Zones Combined
              </button>

              <button
                onClick={() => setStep1Filter('hydration')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                  step1Filter === 'hydration'
                    ? 'bg-sky-50 text-sky-800 border-sky-400 ring-1 ring-sky-300'
                    : 'bg-[#fdf9f9] text-[#665965] border-[#eadde1] hover:border-sky-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span>Hydration Cushions</span>
              </button>

              <button
                onClick={() => setStep1Filter('barrier')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                  step1Filter === 'barrier'
                    ? 'bg-rose-50 text-rose-800 border-rose-400 ring-1 ring-rose-300'
                    : 'bg-[#fdf9f9] text-[#665965] border-[#eadde1] hover:border-rose-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#fb7185]" />
                <span>Barrier Prime Mesh</span>
              </button>

              <button
                onClick={() => setStep1Filter('orbital')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                  step1Filter === 'orbital'
                    ? 'bg-purple-50 text-purple-800 border-purple-400 ring-1 ring-purple-300'
                    : 'bg-[#fdf9f9] text-[#665965] border-[#eadde1] hover:border-purple-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#c084fc]" />
                <span>Orbital Rim Boundary</span>
              </button>

              <button
                onClick={() => setStep1Filter('lymphatic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                  step1Filter === 'lymphatic'
                    ? 'bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-300'
                    : 'bg-[#fdf9f9] text-[#665965] border-[#eadde1] hover:border-amber-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                <span>Massage Vectors</span>
              </button>
            </div>

            {/* Zone Descriptions Grid */}
            {showZoneGuide && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] space-y-0.5">
                  <div className="font-bold text-sky-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                    <span>Sky Blue: Hyaluronic Hydration Cushions</span>
                  </div>
                  <p className="text-sky-800/80 text-[11px] leading-tight">
                    Forehead center, zygomatic cheekbones & chin. Press moisture with warm fingertips to plump skin cells.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-[11px] space-y-0.5">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#fb7185]" />
                    <span>Rose Coral: Barrier Prime & Sebum Shield</span>
                  </div>
                  <p className="text-rose-800/80 text-[11px] leading-tight">
                    T-Zone, nose dorsum, and smile lines. Micro-mesh locks excess sebum and prevents makeup separating.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] space-y-0.5">
                  <div className="font-bold text-purple-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c084fc]" />
                    <span>Lavender: Delicate Orbital Rim Buffer</span>
                  </div>
                  <p className="text-purple-800/80 text-[11px] leading-tight">
                    Keep rich moisturizers 4mm below lower lashes; stops concealer creasing and mascara melting.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] space-y-0.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                    <span>Gold Arrows: Lymphatic Drainage Glide</span>
                  </div>
                  <p className="text-amber-800/80 text-[11px] leading-tight">
                    Sweep upward from chin along jaw to ears, and cheekbones to temples to depuff the facial contour.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Steps 2-6: Step-Specific Action Guide */}
        {step > 0 && (
          <div className="p-2.5 rounded-xl bg-[#f9f2f4] border border-[#eedfe3] text-xs text-[#665965] leading-relaxed">
            <strong className="text-[#29202a]">Step {step + 1} Placement: </strong>
            {activeStepObj.caption}
          </div>
        )}

        {/* Step 5 Specific: Interactive Eyeshadow Color Architecture & Liner Masterclass */}
        {step === 4 && (
          <div className="space-y-3 pt-2 border-t border-[#f4ebeb]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#29202a] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#c45b78]" />
                <span>Eyeshadow Pigment Color Architecture:</span>
              </span>
              <button
                onClick={() => setShowEyeMasterclass(!showEyeMasterclass)}
                className="text-[10px] text-[#c45b78] hover:text-[#9e3a53] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                <span>{showEyeMasterclass ? 'Hide Masterclass' : 'Open Eye Masterclass & Rulers'}</span>
              </button>
            </div>

            {/* Eyeshadow Color Zone Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All 5 Zones', color: '#c45b78' },
                { id: 'base', label: '1. Base Wash', color: LOOK_EYESHADOW_PALETTES[selectedLook]?.base.hex || '#fff8ee' },
                { id: 'crease', label: '2. Crease Socket', color: LOOK_EYESHADOW_PALETTES[selectedLook]?.crease.hex || '#b58265' },
                { id: 'outerV', label: "3. Outer 'V'", color: LOOK_EYESHADOW_PALETTES[selectedLook]?.outerV.hex || '#5e3a2b' },
                { id: 'shimmer', label: '4. Mid-Lid Shimmer', color: LOOK_EYESHADOW_PALETTES[selectedLook]?.shimmer.hex || '#fae3b6' },
                { id: 'innerCorner', label: '5. Inner Duct Glow', color: LOOK_EYESHADOW_PALETTES[selectedLook]?.innerGlow.hex || '#ffffff' },
              ].map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveShadowLayer(zone.id as ShadowLayer)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                    activeShadowLayer === zone.id
                      ? 'bg-rose-50 text-rose-900 border-rose-400 ring-1 ring-rose-300'
                      : 'bg-[#fdf9f9] text-[#665965] border-[#eadde1] hover:border-rose-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span>{zone.label}</span>
                </button>
              ))}
            </div>

            {/* Liner Style Tabs: Winged, Cat-Eye, Batwing, Smudged */}
            <div className="pt-1.5">
              <span className="block text-[11px] font-bold text-[#29202a] mb-1.5">
                Eyeliner Wing Trajectory & "UPTO WHERE" Boundary:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'winged', name: 'Classic Winged', upto: 'Extend 4-6mm at 42° to brow tail' },
                  { id: 'cateye', name: 'Dramatic Cat-Eye', upto: 'Extend 6-8mm + Inner Beak Flick' },
                  { id: 'batwing', name: 'Hooded Batwing', upto: 'Crease bypass notch (4-5mm)' },
                  { id: 'smudged', name: 'Soft Smudged', upto: 'Feathered pencil blend (4mm)' },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setActiveLinerStyle(style.id as LinerStyle)}
                    className={`p-2 rounded-xl text-left border transition text-xs flex flex-col justify-between cursor-pointer ${
                      activeLinerStyle === style.id
                        ? 'bg-[#c45b78] text-white border-[#c45b78] shadow-xs'
                        : 'bg-white text-[#29202a] border-[#eadde1] hover:border-[#c45b78]/40'
                    }`}
                  >
                    <span className="font-bold">{style.name}</span>
                    <span className={`text-[10px] mt-0.5 leading-tight ${activeLinerStyle === style.id ? 'text-rose-100' : 'text-[#766b77]'}`}>
                      {style.upto}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Eye Masterclass Visualizer */}
            {showEyeMasterclass && (
              <div className="pt-2 animate-in fade-in duration-300">
                <EyeMasterclassVisualizer
                  selectedLook={selectedLook}
                  activeLinerStyle={activeLinerStyle}
                  onSelectLinerStyle={(s) => setActiveLinerStyle(s)}
                  eyeShape={faceAnalysis?.eyeShape || 'hooded'}
                  isOpen={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// RENDER HELPERS FOR EACH AR STEP
// ==========================================

function renderStep1HydrateAndBarrier(params: {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  forehead: { x: number; y: number };
  noseBridge: { x: number; y: number };
  noseTip: { x: number; y: number };
  leftEye: { x: number; y: number; r: number };
  rightEye: { x: number; y: number; r: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  leftJaw: { x: number; y: number };
  rightJaw: { x: number; y: number };
  lips: { x: number; y: number; w: number; h: number };
  chin: { x: number; y: number };
  fw: number;
  fh: number;
  pulse: number;
  filter: Step1ZoneFilter;
}) {
  const {
    ctx,
    forehead,
    noseBridge,
    noseTip,
    leftEye,
    rightEye,
    leftCheek,
    rightCheek,
    leftJaw,
    rightJaw,
    lips,
    chin,
    fw,
    fh,
    pulse,
    filter,
  } = params;

  // --- 1. HYALURONIC HYDRATION CUSHIONS (Sky Blue #38bdf8) ---
  if (filter === 'all' || filter === 'hydration') {
    const hydGradForehead = ctx.createRadialGradient(
      forehead.x,
      forehead.y,
      4,
      forehead.x,
      forehead.y,
      fw * 0.22 + pulse * 6
    );
    hydGradForehead.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
    hydGradForehead.addColorStop(0.65, 'rgba(56, 189, 248, 0.35)');
    hydGradForehead.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = hydGradForehead;
    ctx.beginPath();
    ctx.ellipse(forehead.x, forehead.y, fw * 0.22, fh * 0.10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left Cheek Hydration Cushion
    const hydGradCheekL = ctx.createRadialGradient(
      leftCheek.x,
      leftCheek.y,
      4,
      leftCheek.x,
      leftCheek.y,
      fw * 0.18 + pulse * 4
    );
    hydGradCheekL.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
    hydGradCheekL.addColorStop(0.65, 'rgba(56, 189, 248, 0.35)');
    hydGradCheekL.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = hydGradCheekL;
    ctx.beginPath();
    ctx.ellipse(leftCheek.x, leftCheek.y, fw * 0.18, fh * 0.12, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Right Cheek Hydration Cushion
    const hydGradCheekR = ctx.createRadialGradient(
      rightCheek.x,
      rightCheek.y,
      4,
      rightCheek.x,
      rightCheek.y,
      fw * 0.18 + pulse * 4
    );
    hydGradCheekR.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
    hydGradCheekR.addColorStop(0.65, 'rgba(56, 189, 248, 0.35)');
    hydGradCheekR.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = hydGradCheekR;
    ctx.beginPath();
    ctx.ellipse(rightCheek.x, rightCheek.y, fw * 0.18, fh * 0.12, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Chin Hydration Pad
    const hydGradChin = ctx.createRadialGradient(
      chin.x,
      chin.y,
      2,
      chin.x,
      chin.y,
      fw * 0.14 + pulse * 3
    );
    hydGradChin.addColorStop(0, 'rgba(56, 189, 248, 0.70)');
    hydGradChin.addColorStop(0.7, 'rgba(56, 189, 248, 0.30)');
    hydGradChin.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = hydGradChin;
    ctx.beginPath();
    ctx.ellipse(chin.x, chin.y, fw * 0.14, fh * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating badges for Hydration
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('💧 HYDRATION CUSHION', forehead.x, forehead.y - fh * 0.08);
  }

  // --- 2. BARRIER PRIME & SEBUM SHIELD (Rose Coral #fb7185) ---
  if (filter === 'all' || filter === 'barrier') {
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([2, 2]);

    // T-Zone bridge and glabella
    ctx.beginPath();
    ctx.moveTo(forehead.x - fw * 0.12, forehead.y + fh * 0.06);
    ctx.lineTo(forehead.x + fw * 0.12, forehead.y + fh * 0.06);
    ctx.lineTo(noseBridge.x + fw * 0.06, noseTip.y);
    ctx.lineTo(noseBridge.x - fw * 0.06, noseTip.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Nasolabial Smile Folds Grip Lines
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);

    ctx.beginPath();
    ctx.moveTo(noseTip.x - fw * 0.08, noseTip.y + 4);
    ctx.quadraticCurveTo(lips.x - lips.w * 0.55, lips.y, chin.x - fw * 0.12, chin.y - fh * 0.04);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(noseTip.x + fw * 0.08, noseTip.y + 4);
    ctx.quadraticCurveTo(lips.x + lips.w * 0.55, lips.y, chin.x + fw * 0.12, chin.y - fh * 0.04);
    ctx.stroke();

    ctx.fillStyle = '#ffe4e6';
    ctx.font = 'bold 8.5px JetBrains Mono, monospace';
    ctx.fillText('🛡️ SEBUM SHIELD', noseBridge.x, noseBridge.y);
  }

  // --- 3. DELICATE ORBITAL RIM BUFFER (Lavender #c084fc) ---
  if (filter === 'all' || filter === 'orbital') {
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 3]);

    // Left eye orbital rim ellipse
    ctx.beginPath();
    ctx.ellipse(leftEye.x, leftEye.y + 14, leftEye.r * 1.35, leftEye.r * 0.95, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Right eye orbital rim ellipse
    ctx.beginPath();
    ctx.ellipse(rightEye.x, rightEye.y + 14, rightEye.r * 1.35, rightEye.r * 0.95, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f3e8ff';
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.setLineDash([]);
    ctx.fillText('⚠ 4mm Eye Buffer', leftEye.x, leftEye.y + leftEye.r * 1.6);
    ctx.fillText('⚠ 4mm Eye Buffer', rightEye.x, rightEye.y + rightEye.r * 1.6);
  }

  // --- 4. LYMPHATIC DRAINAGE MASSAGE GLIDE VECTORS (Luminous Gold #eab308) ---
  if (filter === 'all' || filter === 'lymphatic') {
    ctx.strokeStyle = '#facc15';
    ctx.fillStyle = '#facc15';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([]);

    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number) => {
      const headlen = 7;
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    // Jawline upward sweep to ears
    drawArrow(chin.x - fw * 0.10, chin.y + 2, leftJaw.x - 8, leftJaw.y);
    drawArrow(chin.x + fw * 0.10, chin.y + 2, rightJaw.x + 8, rightJaw.y);

    // Cheekbone lift toward temples
    drawArrow(leftCheek.x - 4, leftCheek.y + 6, leftEye.x - leftEye.r * 1.2, leftEye.y - 12);
    drawArrow(rightCheek.x + 4, rightCheek.y + 6, rightEye.x + rightEye.r * 1.2, rightEye.y - 12);

    // Brow glide outward
    drawArrow(forehead.x - 12, forehead.y + fh * 0.04, leftEye.x - leftEye.r * 0.8, leftEye.y - 20);
    drawArrow(forehead.x + 12, forehead.y + fh * 0.04, rightEye.x + rightEye.r * 0.8, rightEye.y - 20);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✨ MASSAGE VECTORS (UP & OUT)', chin.x, chin.y + fh * 0.12);
  }
}

function renderStep2Primer(params: any) {
  const { ctx, forehead, noseBridge, noseTip, leftCheek, rightCheek, fw, fh } = params;

  // Smoothing Pore Blur Mesh on T-Zone
  ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 3]);

  ctx.beginPath();
  ctx.ellipse(noseBridge.x, (noseBridge.y + noseTip.y) / 2, fw * 0.12, fh * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Forehead pore grip
  ctx.beginPath();
  ctx.ellipse(forehead.x, forehead.y + 8, fw * 0.16, fh * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f3e8ff';
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PORE BLUR MATRIX', noseBridge.x, noseTip.y + 16);
}

function renderStep3ColorCorrect(params: any) {
  const { ctx, leftEye, rightEye, noseTip, chin, faceAnalysis } = params;

  const correctorColor =
    faceAnalysis?.skinTone?.monkScale && faceAnalysis.skinTone.monkScale >= 6
      ? 'rgba(234, 88, 12, 0.70)' // Warm orange for deep skin
      : 'rgba(251, 146, 60, 0.70)'; // Peach for light-medium skin

  // Under-eye tear-trough crescent
  ctx.fillStyle = correctorColor;
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 1.4;

  ctx.beginPath();
  ctx.ellipse(leftEye.x, leftEye.y + 18, leftEye.r * 1.1, leftEye.r * 0.5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(rightEye.x, rightEye.y + 18, rightEye.r * 1.1, rightEye.r * 0.5, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Green Redness Neutralizers on Nostril wings
  ctx.fillStyle = 'rgba(74, 222, 128, 0.65)';
  ctx.strokeStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(noseTip.x - 14, noseTip.y + 4, 6, 0, Math.PI * 2);
  ctx.arc(noseTip.x + 14, noseTip.y + 4, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffedd5';
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PEACH: TEAR TROUGH', leftEye.x, leftEye.y + 36);
  ctx.fillText('PEACH: TEAR TROUGH', rightEye.x, rightEye.y + 36);
}

function renderStep4BaseAndConcealer(params: any) {
  const { ctx, forehead, leftEye, rightEye, leftCheek, rightCheek, chin, leftJaw, rightJaw, fw, fh } = params;

  // Stippling foundation veil dots
  ctx.fillStyle = 'rgba(245, 158, 11, 0.55)';
  const dots = [
    { x: forehead.x, y: forehead.y },
    { x: leftCheek.x, y: leftCheek.y },
    { x: rightCheek.x, y: rightCheek.y },
    { x: chin.x, y: chin.y },
  ];

  dots.forEach((d) => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Concealer optical lift triangles
  ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;

  // Inner corner dot
  ctx.beginPath();
  ctx.arc(leftEye.x + leftEye.r * 0.4, leftEye.y + 14, 4, 0, Math.PI * 2);
  ctx.arc(rightEye.x - rightEye.r * 0.4, rightEye.y + 14, 4, 0, Math.PI * 2);
  ctx.fill();

  // Outer corner temple lift flick
  ctx.beginPath();
  ctx.moveTo(leftEye.x - leftEye.r * 0.7, leftEye.y + 6);
  ctx.lineTo(leftEye.x - leftEye.r * 1.3, leftEye.y - 8);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightEye.x + rightEye.r * 0.7, rightEye.y + 6);
  ctx.lineTo(rightEye.x + rightEye.r * 1.3, rightEye.y - 8);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('4-POINT LIFT FLICK', leftEye.x - leftEye.r * 1.1, leftEye.y - 14);
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderStep5Features(params: {
  ctx: CanvasRenderingContext2D;
  leftEye: { x: number; y: number; r: number };
  rightEye: { x: number; y: number; r: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  lips: { x: number; y: number; w: number; h: number };
  faceAnalysis?: FaceAnalysisData | null;
  selectedLook?: LookMoodId;
  linerStyle?: LinerStyle;
  shadowFilter?: ShadowLayer;
  pulse?: number;
}) {
  const {
    ctx,
    leftEye,
    rightEye,
    leftCheek,
    rightCheek,
    lips,
    selectedLook = 'clean',
    linerStyle = 'winged',
    shadowFilter = 'all',
  } = params;

  const palette = LOOK_EYESHADOW_PALETTES[selectedLook] || LOOK_EYESHADOW_PALETTES.clean;

  // Render both eyes symmetrically with realistic cosmetic color mapping
  const eyes = [
    { eye: leftEye, side: 'left' as const },
    { eye: rightEye, side: 'right' as const },
  ];

  eyes.forEach(({ eye, side }) => {
    const sign = side === 'left' ? -1 : 1; // outer corner is towards -x for left eye, +x for right eye
    const innerSign = -sign; // inner tear duct is towards nose bridge

    const ex = eye.x;
    const ey = eye.y;
    const er = eye.r;

    // -------------------------------------------------------------
    // ZONE 1: BASE WASH (Mobile lid up to orbital crease)
    // -------------------------------------------------------------
    if (shadowFilter === 'all' || shadowFilter === 'base') {
      ctx.save();
      const baseGrad = ctx.createRadialGradient(ex, ey - er * 0.4, 2, ex, ey - er * 0.4, er * 1.3);
      baseGrad.addColorStop(0, hexToRgba(palette.base.hex, 0.75));
      baseGrad.addColorStop(0.7, hexToRgba(palette.base.hex, 0.45));
      baseGrad.addColorStop(1, hexToRgba(palette.base.hex, 0));

      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      // Smooth mobile lid arch
      ctx.moveTo(ex + innerSign * er * 0.8, ey);
      ctx.quadraticCurveTo(ex, ey - er * 1.15, ex + sign * er * 0.85, ey);
      ctx.quadraticCurveTo(ex, ey + er * 0.1, ex + innerSign * er * 0.8, ey);
      ctx.closePath();
      ctx.fill();

      // Subtle dashed border
      ctx.strokeStyle = hexToRgba(palette.base.hex, 0.6);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // ZONE 2: CREASE TRANSITION CONTOUR (Socket sweep with blend arrows)
    // -------------------------------------------------------------
    if (shadowFilter === 'all' || shadowFilter === 'crease') {
      ctx.save();
      ctx.strokeStyle = hexToRgba(palette.crease.hex, 0.88);
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';

      // Crease socket arc above the lid
      ctx.beginPath();
      ctx.moveTo(ex + innerSign * er * 0.5, ey - er * 0.65);
      ctx.quadraticCurveTo(ex, ey - er * 1.35, ex + sign * er * 0.95, ey - er * 0.7);
      ctx.stroke();

      // Directional Windshield-Wiper Blending Indicator (⟵ BLEND ⟶)
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(ex - er * 0.45, ey - er * 1.55);
      ctx.lineTo(ex + er * 0.45, ey - er * 1.55);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⟵ BLEND ⟶', ex, ey - er * 1.65);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // ZONE 3: OUTER 'V' WEDGE (Outer corner depth & elongation)
    // -------------------------------------------------------------
    if (shadowFilter === 'all' || shadowFilter === 'outerV') {
      ctx.save();
      ctx.fillStyle = hexToRgba(palette.outerV.hex, 0.85);

      // Triangular wedge in the outer third angling up toward temple
      ctx.beginPath();
      ctx.moveTo(ex + sign * er * 0.35, ey - er * 0.25);
      ctx.lineTo(ex + sign * er * 1.25, ey - er * 0.65);
      ctx.lineTo(ex + sign * er * 0.75, ey - er * 1.05);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hexToRgba(palette.outerV.hex, 1);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#fef2f2';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = side === 'left' ? 'right' : 'left';
      ctx.fillText("OUTER 'V'", ex + sign * er * 1.35, ey - er * 0.75);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // ZONE 4: MID-LID SHIMMER POP / HALO (Iris center highlight)
    // -------------------------------------------------------------
    if (shadowFilter === 'all' || shadowFilter === 'shimmer') {
      ctx.save();
      const shimmerGrad = ctx.createRadialGradient(ex, ey - er * 0.35, 1, ex, ey - er * 0.35, er * 0.55);
      shimmerGrad.addColorStop(0, hexToRgba(palette.shimmer.hex, 0.95));
      shimmerGrad.addColorStop(0.6, hexToRgba(palette.shimmer.hex, 0.6));
      shimmerGrad.addColorStop(1, hexToRgba(palette.shimmer.hex, 0));

      ctx.fillStyle = shimmerGrad;
      ctx.beginPath();
      ctx.ellipse(ex, ey - er * 0.35, er * 0.42, er * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Diamond sparkle center
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ex - 4, ey - er * 0.35);
      ctx.lineTo(ex + 4, ey - er * 0.35);
      ctx.moveTo(ex, ey - er * 0.35 - 4);
      ctx.lineTo(ex, ey - er * 0.35 + 4);
      ctx.stroke();

      ctx.fillStyle = '#fffbeb';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✦ SHIMMER', ex, ey + er * 0.25);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // ZONE 5: INNER TEAR DUCT GLOW (Awakening highlight point)
    // -------------------------------------------------------------
    if (shadowFilter === 'all' || shadowFilter === 'innerCorner') {
      ctx.save();
      const innerX = ex + innerSign * er * 0.88;
      const innerY = ey + er * 0.05;

      const innerGrad = ctx.createRadialGradient(innerX, innerY, 1, innerX, innerY, 8);
      innerGrad.addColorStop(0, hexToRgba(palette.innerGlow.hex, 0.98));
      innerGrad.addColorStop(0.7, hexToRgba(palette.innerGlow.hex, 0.5));
      innerGrad.addColorStop(1, hexToRgba(palette.innerGlow.hex, 0));

      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(innerX, innerY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Sharp micro diamond
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(innerX, innerY - 3.5);
      ctx.lineTo(innerX + 3.5, innerY);
      ctx.lineTo(innerX, innerY + 3.5);
      ctx.lineTo(innerX - 3.5, innerY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // ZONE 6: EYELINER WITH EXACT "UPTO WHERE WINGED" GUIDELINE
    // -------------------------------------------------------------
    ctx.save();

    // 1. Lashline Tightline: Smooth root trace along lashes
    ctx.strokeStyle = palette.liner.hex;
    ctx.lineWidth = linerStyle === 'cateye' ? 2.8 : 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ex + innerSign * er * 0.7, ey + 1);
    ctx.quadraticCurveTo(ex, ey - er * 0.45, ex + sign * er * 0.75, ey + 1);
    ctx.stroke();

    // 2. Trajectory Angle: 42° angle from lower waterline towards brow tail
    const rad = (42 * Math.PI) / 180;
    const cosAngle = Math.cos(rad);
    const sinAngle = Math.sin(rad);

    const cornerX = ex + sign * er * 0.75;
    const cornerY = ey + 1;

    let wingLen = er * 0.75;
    let stopLabel = 'WING STOP 4-6mm';
    if (linerStyle === 'cateye') {
      wingLen = er * 1.1;
      stopLabel = 'CAT-EYE STOP 7-8mm';
    } else if (linerStyle === 'batwing') {
      wingLen = er * 0.72;
      stopLabel = 'BATWING STOP 5mm';
    } else if (linerStyle === 'smudged') {
      wingLen = er * 0.6;
      stopLabel = 'SMUDGED FADE 4mm';
    }

    const tipX = cornerX + sign * (cosAngle * wingLen);
    const tipY = cornerY - (sinAngle * wingLen);

    // Full 42° Dashed Trajectory Line pointing toward brow tail
    const fullProjLen = er * 1.5;
    const fullProjX = cornerX + sign * (cosAngle * fullProjLen);
    const fullProjY = cornerY - (sinAngle * fullProjLen);

    ctx.strokeStyle = '#f59e0b'; // Amber guide line
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cornerX, cornerY);
    ctx.lineTo(fullProjX, fullProjY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stop Marker Tick (perpendicular to trajectory)
    const perpX = -sinAngle * 5;
    const perpY = -sign * cosAngle * 5;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tipX - perpX, tipY - perpY);
    ctx.lineTo(tipX + perpX, tipY + perpY);
    ctx.stroke();

    // "UPTO WHERE" Badge
    ctx.fillStyle = 'rgba(24, 24, 27, 0.88)';
    const textW = ctx.measureText(stopLabel).width || 70;
    const badgeX = side === 'left' ? tipX - textW - 14 : tipX + 8;
    ctx.fillRect(badgeX, tipY - 8, textW + 10, 14);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(stopLabel, badgeX + 5, tipY + 2);

    // 3. Draw & Fill the Wing Polygon according to style
    ctx.fillStyle = palette.liner.hex;
    ctx.strokeStyle = palette.liner.hex;

    if (linerStyle === 'batwing') {
      // Hooded Batwing: Steps horizontally across the fold
      const foldX = cornerX + sign * (cosAngle * (wingLen * 0.5));
      const foldY = cornerY - (sinAngle * (wingLen * 0.5));

      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(foldX + sign * 2, foldY - 3);
      ctx.lineTo(cornerX - sign * er * 0.25, cornerY - 2);
      ctx.closePath();
      ctx.fill();
    } else if (linerStyle === 'smudged') {
      // Soft Smudged: Feathered diffused gradient stroke
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      ctx.strokeStyle = hexToRgba(palette.liner.hex, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY - 1);
      ctx.lineTo(tipX - sign * 2, tipY + 2);
      ctx.stroke();
    } else {
      // Classic Winged & Cat-Eye Triangle
      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(cornerX - sign * er * (linerStyle === 'cateye' ? 0.45 : 0.35), cornerY - (linerStyle === 'cateye' ? 3 : 2));
      ctx.closePath();
      ctx.fill();
    }

    // Cat-Eye Exclusive: Sharp Inner Tear-Duct Feline Beak Point!
    if (linerStyle === 'cateye') {
      const beakStartX = ex + innerSign * er * 0.75;
      const beakStartY = ey + 1;
      const beakTipX = beakStartX + innerSign * 5;
      const beakTipY = beakStartY + 3;

      ctx.beginPath();
      ctx.moveTo(beakStartX, beakStartY - 1);
      ctx.lineTo(beakTipX, beakTipY);
      ctx.lineTo(beakStartX, beakStartY + 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BEAK', beakTipX, beakTipY + 8);
    }

    ctx.restore();
  });

  // -------------------------------------------------------------
  // LIFTED CHEEK BLUSH DRAPE (Along Zygomatic Arch)
  // -------------------------------------------------------------
  const blushGradL = ctx.createRadialGradient(leftCheek.x, leftCheek.y, 4, leftCheek.x, leftCheek.y, 34);
  blushGradL.addColorStop(0, 'rgba(244, 63, 94, 0.6)');
  blushGradL.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = blushGradL;
  ctx.beginPath();
  ctx.arc(leftCheek.x, leftCheek.y, 34, 0, Math.PI * 2);
  ctx.fill();

  const blushGradR = ctx.createRadialGradient(rightCheek.x, rightCheek.y, 4, rightCheek.x, rightCheek.y, 34);
  blushGradR.addColorStop(0, 'rgba(244, 63, 94, 0.6)');
  blushGradR.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = blushGradR;
  ctx.beginPath();
  ctx.arc(rightCheek.x, rightCheek.y, 34, 0, Math.PI * 2);
  ctx.fill();

  // -------------------------------------------------------------
  // DEFINED LIP CONTOUR
  // -------------------------------------------------------------
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(lips.x, lips.y, lips.w * 0.5, lips.h * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  const lipGrad = ctx.createRadialGradient(lips.x, lips.y, 2, lips.x, lips.y, lips.w * 0.4);
  lipGrad.addColorStop(0, 'rgba(251, 113, 133, 0.5)');
  lipGrad.addColorStop(1, 'rgba(225, 29, 72, 0.15)');
  ctx.fillStyle = lipGrad;
  ctx.fill();
}

function renderStep6SettingAndAudit(params: any) {
  const { ctx, forehead, noseBridge, leftEye, rightEye, chin, width, height } = params;

  // Central Symmetry Axis
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(forehead.x, 16);
  ctx.lineTo(forehead.x, height - 16);
  ctx.stroke();

  // Translucent Powder Press Zones
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.strokeStyle = '#fbcfe8';
  ctx.setLineDash([2, 2]);

  [
    { x: forehead.x, y: forehead.y, r: 16 },
    { x: noseBridge.x, y: noseBridge.y + 12, r: 12 },
    { x: chin.x, y: chin.y, r: 14 },
    { x: leftEye.x, y: leftEye.y + 16, r: 12 },
    { x: rightEye.x, y: rightEye.y + 16, r: 12 },
  ].forEach((target) => {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = '#fdf2f8';
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.setLineDash([]);
  ctx.fillText('SYMMETRY AXIS CHECK', forehead.x, height - 24);
}
