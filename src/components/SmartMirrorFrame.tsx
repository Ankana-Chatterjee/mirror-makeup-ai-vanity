import React, { useState, useRef } from 'react';
import { Camera, FlipHorizontal, Layers, Sparkles, Video, Upload, Eye, Wand2, Download, X, Compass, RotateCcw, ScanLine, Scan, Trash2, ShieldCheck, Crosshair } from 'lucide-react';
import { FaceDiagnostics, MakeupLook, LipFinish, ModelPreset } from '../types/makeup';
import { SmartMirrorCanvas } from './SmartMirrorCanvas';
import { HeadPose3D } from '../utils/autonomousScanner';
import { PrivacySecurityShield } from './PrivacySecurityShield';

interface SmartMirrorFrameProps {
  imageSrc: string;
  isWebcamActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  customLipHex?: string;
  customLipFinish?: LipFinish;
  modelPresets: ModelPreset[];
  selectedModelId: string;
  overlayMode: 'stencils' | 'vto' | 'split' | 'mesh' | 'audit' | 'teaching';
  setOverlayMode: (mode: 'stencils' | 'vto' | 'split' | 'mesh' | 'audit' | 'teaching') => void;
  teachingStep?: number;
  hasCustomImage?: boolean;
  onDeleteCustomImage?: () => void;
  coachHighlightZone?: 'eyes' | 'jawline' | 'undereye' | 'cheeks' | 'lips' | 'forehead' | 'none';
  coachFeedbackHeadline?: string;
  isCorrectTechnique?: boolean;
  onSelectModel: (model: ModelPreset) => void;
  onToggleWebcam: () => void;
  onUploadImage: (file: File) => void;
  onSampleColor: (hex: string, lab: { l: number; a: number; b: number }) => void;
  onRunAutonomousScan?: () => void;
}

export const SmartMirrorFrame: React.FC<SmartMirrorFrameProps> = ({
  imageSrc,
  isWebcamActive,
  videoRef,
  diagnostics,
  currentLook,
  customLipHex,
  customLipFinish,
  modelPresets,
  selectedModelId,
  overlayMode,
  setOverlayMode,
  teachingStep,
  hasCustomImage,
  onDeleteCustomImage,
  coachHighlightZone = 'none',
  coachFeedbackHeadline,
  isCorrectTechnique = true,
  onSelectModel,
  onToggleWebcam,
  onUploadImage,
  onSampleColor,
  onRunAutonomousScan,
}) => {
  const [mirrorFlipped, setMirrorFlipped] = useState(true);
  const [colorTemp, setColorTemp] = useState<3200 | 4500 | 5500>(5500); // 5500K Daylight
  const [ringBrightness, setRingBrightness] = useState(90);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isLaserScanning, setIsLaserScanning] = useState(false);
  const [showTrackingReticles, setShowTrackingReticles] = useState(true);
  const [capturedSnapshots, setCapturedSnapshots] = useState<{ id: string; url: string; time: string; look: string }[]>([]);
  const [activeSnapshotModal, setActiveSnapshotModal] = useState<string | null>(null);

  // 3D Head Pose Angles for Mirror Realism
  const [headPose, setHeadPose] = useState<HeadPose3D>({
    yaw: 0,      // -45 to +45 deg (turn left / right)
    pitch: 0,    // -25 to +25 deg (tilt up / down)
    roll: 0,     // -15 to +15 deg
    distance: 1.0,
  });

  const [isDraggingAngle, setIsDraggingAngle] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete an individual captured snapshot and purge its in-memory buffer
  const handleDeleteSnapshot = (id: string) => {
    const snap = capturedSnapshots.find((s) => s.id === id);
    if (snap?.url && snap.url.startsWith('blob:')) {
      URL.revokeObjectURL(snap.url);
    }
    setCapturedSnapshots((prev) => prev.filter((s) => s.id !== id));
    if (snap && activeSnapshotModal === snap.url) {
      setActiveSnapshotModal(null);
    }
  };

  // Permanently purge all captured photos from browser RAM
  const handlePurgeAllSnapshots = () => {
    capturedSnapshots.forEach((snap) => {
      if (snap.url && snap.url.startsWith('blob:')) {
        URL.revokeObjectURL(snap.url);
      }
    });
    setCapturedSnapshots([]);
    setActiveSnapshotModal(null);
  };

  // Capture High-Res Snapshot from reflection
  const handleCaptureSnapshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 250);

    let snapshotUrl = imageSrc;
    if (isWebcamActive && videoRef.current) {
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = videoRef.current.videoWidth || 720;
        offCanvas.height = videoRef.current.videoHeight || 720;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          if (mirrorFlipped) {
            offCtx.translate(offCanvas.width, 0);
            offCtx.scale(-1, 1);
          }
          offCtx.drawImage(videoRef.current, 0, 0, offCanvas.width, offCanvas.height);
          snapshotUrl = offCanvas.toDataURL('image/jpeg', 0.95);
        }
      } catch (e) {
        console.warn('Snapshot capture canvas error:', e);
      }
    }

    const newSnapshot = {
      id: Date.now().toString(),
      url: snapshotUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      look: currentLook.name,
    };

    setCapturedSnapshots((prev) => [newSnapshot, ...prev]);
  };

  // Run Autonomous Scan (0 Questions Asked)
  const handleTriggerAutonomousScan = () => {
    setIsLaserScanning(true);
    setTimeout(() => {
      setIsLaserScanning(false);
      if (onRunAutonomousScan) {
        onRunAutonomousScan();
      }
    }, 1400);
  };

  // Handle Dragging over Mirror to change 3D Angle (Mouse & Mobile Touch)
  const handleMirrorMouseDown = (e: React.MouseEvent) => {
    setIsDraggingAngle(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMirrorMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingAngle) return;
    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;

    setHeadPose((prev) => ({
      ...prev,
      yaw: Math.max(-40, Math.min(40, prev.yaw + deltaX * 0.25)),
      pitch: Math.max(-25, Math.min(25, prev.pitch - deltaY * 0.25)),
    }));

    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMirrorMouseUp = () => {
    setIsDraggingAngle(false);
  };

  const handleMirrorTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setIsDraggingAngle(true);
      setDragStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMirrorTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingAngle || !e.touches || !e.touches[0]) return;
    const deltaX = e.touches[0].clientX - dragStartPos.x;
    const deltaY = e.touches[0].clientY - dragStartPos.y;

    setHeadPose((prev) => ({
      ...prev,
      yaw: Math.max(-40, Math.min(40, prev.yaw + deltaX * 0.3)),
      pitch: Math.max(-25, Math.min(25, prev.pitch - deltaY * 0.3)),
    }));

    setDragStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMirrorTouchEnd = () => {
    setIsDraggingAngle(false);
  };

  const resetAngle = () => {
    setHeadPose({ yaw: 0, pitch: 0, roll: 0, distance: 1.0 });
  };

  const getRingColorStyle = () => {
    if (colorTemp === 3200) {
      return {
        boxShadow: `0 0 ${ringBrightness * 0.45}px rgba(251, 191, 36, ${ringBrightness * 0.008}), inset 0 0 20px rgba(251, 191, 36, 0.4)`,
        borderColor: 'rgba(252, 211, 77, 0.95)',
      };
    }
    if (colorTemp === 4500) {
      return {
        boxShadow: `0 0 ${ringBrightness * 0.45}px rgba(254, 243, 199, ${ringBrightness * 0.008}), inset 0 0 20px rgba(254, 243, 199, 0.4)`,
        borderColor: 'rgba(254, 240, 138, 0.95)',
      };
    }
    return {
      boxShadow: `0 0 ${ringBrightness * 0.45}px rgba(255, 255, 255, ${ringBrightness * 0.008}), inset 0 0 20px rgba(255, 255, 255, 0.4)`,
      borderColor: 'rgba(255, 255, 255, 0.95)',
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto select-none space-y-2">
      {/* Dynamic Face Auto-Detection HUD & Local Privacy Security Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        {/* Dynamic Auto-Detect Locked Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">AUTO-TRACK: EYES [LOCK] • NOSE [LOCK] • LIPS [LOCK]</span>
        </div>

        {/* Local Security & Anti-Hacking Shield */}
        <PrivacySecurityShield
          onPurgeAllData={handlePurgeAllSnapshots}
          photoCount={capturedSnapshots.length + (hasCustomImage ? 1 : 0)}
        />
      </div>

      {/* Top Device Bar & Quick Controls */}
      <div className="w-full flex items-center justify-between pb-1 px-2 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-200 tracking-wide uppercase font-mono">Dielectric 3D Mirror</span>
          <span className="text-stone-600">·</span>
          {/* Reticle Toggle Button */}
          <button
            onClick={() => setShowTrackingReticles(!showTrackingReticles)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 border transition-colors ${
              showTrackingReticles
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
            title="Toggle dynamic tracking target brackets on eyes, nose, and lips"
          >
            <Crosshair className="w-3 h-3" />
            <span>Reticles: {showTrackingReticles ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Lighting Temperature Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg p-1">
          <button
            onClick={() => setColorTemp(3200)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              colorTemp === 3200 ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            3200K Evening
          </button>
          <button
            onClick={() => setColorTemp(4500)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              colorTemp === 4500 ? 'bg-amber-200/20 text-amber-100' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            4500K Studio
          </button>
          <button
            onClick={() => setColorTemp(5500)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              colorTemp === 5500 ? 'bg-white/20 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            5500K Daylight
          </button>
        </div>
      </div>

      {/* The Physical Circular Mirror Chassis with 3D Head Tracking (Mouse + Touch) */}
      <div
        onMouseDown={handleMirrorMouseDown}
        onMouseMove={handleMirrorMouseMove}
        onMouseUp={handleMirrorMouseUp}
        onMouseLeave={handleMirrorMouseUp}
        onTouchStart={handleMirrorTouchStart}
        onTouchMove={handleMirrorTouchMove}
        onTouchEnd={handleMirrorTouchEnd}
        className="relative p-3 rounded-full bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border border-stone-700/80 shadow-2xl cursor-grab active:cursor-grabbing touch-none"
      >
        {/* Shutter Camera Flash Animation Overlay */}
        {isFlashing && (
          <div className="absolute inset-0 rounded-full bg-white z-50 pointer-events-none transition-opacity duration-200 opacity-90" />
        )}

        {/* Autonomous Laser Scanner Animation Sweep */}
        {isLaserScanning && (
          <div className="absolute inset-x-8 top-8 bottom-8 rounded-full overflow-hidden z-40 pointer-events-none">
            <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse transition-all duration-1000 transform translate-y-72" />
          </div>
        )}

        {/* Illuminated High-CRI LED Ring */}
        <div
          style={getRingColorStyle()}
          className="relative w-[340px] sm:w-[420px] md:w-[460px] h-[340px] sm:h-[420px] md:h-[460px] rounded-full p-2 border-4 transition-all duration-300"
        >
          {/* Glass Bezel */}
          <div className="relative w-full h-full rounded-full overflow-hidden border border-stone-800/80 bg-stone-950 shadow-inner">
            
            {/* Embedded Live Mirror Canvas with Dynamic Auto-Tracking & Coaching */}
            <SmartMirrorCanvas
              imageSrc={imageSrc}
              isWebcamActive={isWebcamActive}
              videoRef={videoRef}
              mirrorFlipped={mirrorFlipped}
              overlayMode={overlayMode}
              diagnostics={diagnostics}
              currentLook={currentLook}
              customLipHex={customLipHex}
              customLipFinish={customLipFinish}
              teachingStep={teachingStep}
              headPose={headPose}
              coachHighlightZone={coachHighlightZone}
              coachFeedbackHeadline={coachFeedbackHeadline}
              isCorrectTechnique={isCorrectTechnique}
              showTrackingReticles={showTrackingReticles}
              onSampleColor={onSampleColor}
            />

            {/* Smart Mirror In-Glass Heads-Up Display (Subtle Glass UI) */}
            <div className="absolute top-5 left-0 right-0 px-6 flex justify-between items-start pointer-events-none z-30">
              <div className="bg-stone-950/75 backdrop-blur-md border border-stone-700/60 rounded-lg px-2.5 py-1 text-left">
                <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <span>AUTONOMOUS DETECT</span>
                </div>
                <div className="text-xs font-semibold text-amber-200 flex items-center gap-1">
                  <span>{diagnostics.eyeShape === 'hooded' ? 'Hooded Fold' : diagnostics.eyeShape}</span>
                  <span className="text-[10px] text-stone-300">({diagnostics.eyeConfidence}%)</span>
                </div>
              </div>

              <div className="bg-stone-950/75 backdrop-blur-md border border-stone-700/60 rounded-lg px-2.5 py-1 text-right">
                <div className="text-[10px] text-stone-400 font-mono">FACE ARCHITECTURE</div>
                <div className="text-xs font-medium text-orange-200 capitalize">
                  {diagnostics.faceShape} Symmetry
                </div>
              </div>
            </div>

            {/* Floating Notification on Glass for Angle & Stencil */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-950/85 backdrop-blur-md border border-stone-700/80 rounded-full px-3 py-1 pointer-events-none z-30 flex items-center gap-2 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-[11px] font-medium text-stone-200">
                {Math.abs(headPose.yaw) > 10
                  ? `${headPose.yaw < 0 ? 'Left' : 'Right'} 3/4 Profile View (${Math.round(headPose.yaw)}°)`
                  : headPose.pitch < -8
                  ? 'Eyelid Crease Inspection Angle (Down Tilt)'
                  : headPose.pitch > 8
                  ? 'Jawline Inspection Angle (Up Tilt)'
                  : 'Frontal Reflection · Drag mirror to rotate head'}
              </span>
            </div>
          </div>
        </div>

        {/* Integrated 4K Camera Sensor Pin at 12 o'clock with Snapshot Shutter */}
        <button
          onClick={handleCaptureSnapshot}
          title="Capture High-Res Picture"
          className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-900 border border-stone-600 flex items-center justify-center hover:bg-stone-800 transition-colors cursor-pointer group z-40 shadow-md"
        >
          <Camera className="w-3 h-3 text-amber-300 group-hover:scale-110 transition-transform" />
        </button>

        {/* Stand Neck Joint */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-stone-700 to-stone-900 border-x border-stone-600 rounded-b-md" />
      </div>

      {/* 3D MIRROR ANGLE SELECTOR BAR (Works with Different Angles Like a Real Mirror) */}
      <div className="w-full mt-7 bg-stone-900/90 border border-stone-800 rounded-xl p-3 flex flex-col gap-3 shadow-lg">
        
        {/* Angle Preset Quick Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-800/80">
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">3D Mirror Perspectives:</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setHeadPose({ yaw: 0, pitch: 0, roll: 0, distance: 1.0 })}
              className={`px-2.5 py-1 rounded transition-colors ${
                headPose.yaw === 0 && headPose.pitch === 0
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200'
              }`}
            >
              Frontal (0°)
            </button>

            <button
              onClick={() => setHeadPose({ yaw: -25, pitch: 0, roll: 0, distance: 1.0 })}
              className={`px-2.5 py-1 rounded transition-colors ${
                headPose.yaw === -25
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200'
              }`}
            >
              Left Profile (-25°)
            </button>

            <button
              onClick={() => setHeadPose({ yaw: 25, pitch: 0, roll: 0, distance: 1.0 })}
              className={`px-2.5 py-1 rounded transition-colors ${
                headPose.yaw === 25
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200'
              }`}
            >
              Right Profile (+25°)
            </button>

            <button
              onClick={() => setHeadPose({ yaw: 0, pitch: -16, roll: 0, distance: 1.05 })}
              className={`px-2.5 py-1 rounded transition-colors ${
                headPose.pitch === -16
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200'
              }`}
            >
              Lid Down-Tilt (-16°)
            </button>

            <button
              onClick={() => setHeadPose({ yaw: 0, pitch: 16, roll: 0, distance: 1.0 })}
              className={`px-2.5 py-1 rounded transition-colors ${
                headPose.pitch === 16
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200'
              }`}
            >
              Jaw Up-Tilt (+16°)
            </button>

            {(headPose.yaw !== 0 || headPose.pitch !== 0) && (
              <button
                onClick={resetAngle}
                title="Reset Angle"
                className="p-1 rounded bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Autonomous Scan Trigger (Zero Questions Asked) */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-cyan-200">Autonomous Facial Diagnostic Engine</div>
              <div className="text-[11px] text-stone-400">Zero questions asked · Computer vision classifies eye folds, face shape & skin tone automatically</div>
            </div>
          </div>

          <button
            onClick={handleTriggerAutonomousScan}
            disabled={isLaserScanning}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-stone-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow"
          >
            {isLaserScanning ? (
              <>
                <ScanLine className="w-3.5 h-3.5 animate-pulse" />
                <span>Scanning Geometry...</span>
              </>
            ) : (
              <>
                <Scan className="w-3.5 h-3.5" />
                <span>Re-Scan Features</span>
              </>
            )}
          </button>
        </div>

        {/* Mode Selector Tabs (Stencils, VTO, Split, Audit, Mesh) */}
        <div className="flex flex-wrap items-center justify-between gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800/80">
          <button
            onClick={() => setOverlayMode('stencils')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              overlayMode === 'stencils'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AR Stencils</span>
          </button>

          <button
            onClick={() => setOverlayMode('vto')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              overlayMode === 'vto'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Try-On</span>
          </button>

          <button
            onClick={() => setOverlayMode('split')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              overlayMode === 'split'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Before / After</span>
          </button>

          <button
            onClick={() => setOverlayMode('audit')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              overlayMode === 'audit'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Mistake Audit</span>
          </button>

          <button
            onClick={() => setOverlayMode('mesh')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
              overlayMode === 'mesh'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="font-mono text-[10px]">3D</span>
            <span>Landmarks</span>
          </button>
        </div>

        {/* Input Source & Model Preset Selection */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-stone-400 font-medium">Source:</span>
            
            {/* Webcam Toggle */}
            <button
              onClick={onToggleWebcam}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                isWebcamActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>{isWebcamActive ? 'Live Camera' : 'Use Camera'}</span>
            </button>

            {/* Custom Photo Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
            >
              <Upload className="w-3 h-3" />
              <span>Upload Face</span>
            </button>

            {/* Delete / Discard Uploaded Photo Button */}
            {hasCustomImage && onDeleteCustomImage && (
              <button
                onClick={onDeleteCustomImage}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60 transition-colors shadow-sm"
                title="Delete uploaded image and return to camera or preset"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Delete Photo</span>
              </button>
            )}

            {/* Shutter Capture Button */}
            <button
              onClick={handleCaptureSnapshot}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30 transition-colors shadow-sm"
            >
              <Camera className="w-3 h-3" />
              <span>Take Picture</span>
            </button>

            {/* Horizontal Mirror Flip */}
            <button
              onClick={() => setMirrorFlipped(!mirrorFlipped)}
              title="Toggle Mirror Flip"
              className={`p-1.5 rounded transition-colors ${
                mirrorFlipped ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Model Preset Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-stone-400">Presets:</span>
            {modelPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectModel(preset)}
                className={`px-2 py-0.5 text-xs rounded whitespace-nowrap transition-all ${
                  selectedModelId === preset.id && !isWebcamActive && !hasCustomImage
                    ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                }`}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Captured Pictures Gallery Strip with Instant Deletion */}
        {capturedSnapshots.length > 0 && (
          <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[10px] text-stone-400 uppercase font-mono shrink-0">
                Captured ({capturedSnapshots.length}):
              </span>
              {capturedSnapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="relative w-11 h-11 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-400 shrink-0 cursor-pointer shadow-sm group"
                >
                  <img
                    src={snap.url}
                    alt="Snapshot"
                    onClick={() => setActiveSnapshotModal(snap.url)}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Eye View */}
                  <div
                    onClick={() => setActiveSnapshotModal(snap.url)}
                    className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                  >
                    <Eye className="w-3 h-3 text-white" />
                  </div>
                  {/* Delete Button on Snapshot Thumbnail */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSnapshot(snap.id);
                    }}
                    className="absolute top-0.5 right-0.5 p-1 rounded bg-red-950/90 text-red-400 hover:text-red-200 border border-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                    title="Delete this picture permanently"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear All Photos Button */}
            <button
              onClick={handlePurgeAllSnapshots}
              className="flex items-center gap-1 text-[11px] font-mono text-red-400 hover:text-red-300 hover:underline shrink-0 px-2 py-1 rounded hover:bg-red-950/40 transition-colors"
              title="Delete all taken pictures from local memory"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Snapshot Preview Modal with Delete Option */}
      {activeSnapshotModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-200">Captured Vanity Snapshot</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Local RAM Only
                </span>
              </div>
              <button
                onClick={() => setActiveSnapshotModal(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-72 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
              <img src={activeSnapshotModal} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800">
              {/* Option to Delete The Taken Picture */}
              <button
                onClick={() => {
                  const snap = capturedSnapshots.find((s) => s.url === activeSnapshotModal);
                  if (snap) handleDeleteSnapshot(snap.id);
                  setActiveSnapshotModal(null);
                }}
                className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                title="Permanently remove photo from memory"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete Picture</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSnapshotModal(null)}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
                <a
                  href={activeSnapshotModal}
                  download="mirror-makeup-snapshot.jpg"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save to Device</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
