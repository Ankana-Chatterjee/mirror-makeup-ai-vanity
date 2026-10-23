import React, { useState } from 'react';
import { 
  Sparkles, Eye, Scan, Sliders, ShieldCheck, Trash2, CheckCircle2, 
  ArrowUpRight, Info, Layers, Crosshair, Compass, RefreshCw, Palette
} from 'lucide-react';
import { FaceDiagnostics, MakeupLook, EyeShape, FaceShape, SkinUndertone } from '../types/makeup';

interface FaceFeatureExtractorProps {
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  hasCustomUploadedPhoto: boolean;
  onDeleteCustomPhoto: () => void;
  isMeshActive: boolean;
  onToggleMesh: () => void;
  onReScanFace: () => void;
}

export const FaceFeatureExtractor: React.FC<FaceFeatureExtractorProps> = ({
  diagnostics,
  currentLook,
  hasCustomUploadedPhoto,
  onDeleteCustomPhoto,
  isMeshActive,
  onToggleMesh,
  onReScanFace,
}) => {
  const [selectedFeatureTab, setSelectedFeatureTab] = useState<'all' | 'eyes' | 'skin' | 'face' | 'nose' | 'lips' | 'undereye'>('all');

  // Eye shape descriptive analysis
  const getEyeShapeInsight = (shape: EyeShape) => {
    switch (shape) {
      case 'hooded':
        return {
          title: 'Hooded Eyelid Fold',
          details: 'Supratarsal dermatochalasis or deep brow-bone hood concealing the mobile lid when looking forward.',
          muaSolution: 'Batwing eyeliner technique + floating crease transition placed 3.5mm above anatomical crease.',
          angle: 'Horizontal Canthal Axis with Superior Fold Overhang',
        };
      case 'monolid':
        return {
          title: 'Smooth Monolid Epicanthic Fold',
          details: 'Absent or minimal supratarsal crease with smooth transition from brow bone to lashline.',
          muaSolution: 'Vertical ombre gradient blending + inner canthal tightline for elongated feline definition.',
          angle: 'Flat Superior Orbital Plane',
        };
      case 'almond':
        return {
          title: 'Symmetrical Almond Architecture',
          details: 'Visible mobile eyelid with pointed lateral canthus and balanced iris exposure.',
          muaSolution: 'Classic winged liner angled at 40° along lower waterline trajectory + halo shimmer.',
          angle: 'Naturally Elevated Outer Canthus (+3.5°)',
        };
      case 'round':
        return {
          title: 'Round & Open Eye Plane',
          details: 'High scleral visibility below the iris creating an open doll-like roundness.',
          muaSolution: 'Horizontal feline cat-eye wing + smoked lower outer lashline to elongate the eye shape.',
          angle: 'Concentric Orbital Curvature',
        };
      case 'deep-set':
        return {
          title: 'Deep-Set Orbital Socket',
          details: 'Prominent brow ridge casting natural shadow onto recessed mobile lid.',
          muaSolution: 'Light-reflective champagne or rose gold shimmer on center lid to draw socket forward.',
          angle: 'Posteriorly Recessed Eyeball Axis',
        };
      case 'downturned':
        return {
          title: 'Downturned Lateral Canthus',
          details: 'Outer corner dips slightly below the level of the inner tear duct.',
          muaSolution: 'Flick eyeliner upward 2mm before the actual corner (puppy-lift hybrid) to visually elevate eye.',
          angle: 'Negative Canthal Tilt (-2.5°)',
        };
      case 'upturned':
        return {
          title: 'Upturned Exotic Cat Axis',
          details: 'Natural upward sweep at the outer corner providing innate lifted geometry.',
          muaSolution: 'Clean sharp micro-liner hugging natural upward sweep without heavy lower shadow.',
          angle: 'Positive Canthal Tilt (+5.0°)',
        };
      default:
        return {
          title: 'Proportional Balanced Eye',
          details: 'Harmonious mobile eyelid and orbital ridge.',
          muaSolution: 'Versatile lid mapping suited for all styles.',
          angle: 'Standard Canthal Axis',
        };
    }
  };

  const eyeInfo = getEyeShapeInsight(diagnostics.eyeShape);

  // Face shape descriptive analysis
  const getFaceShapeInsight = (shape: FaceShape) => {
    switch (shape) {
      case 'oval':
        return {
          title: 'Oval Proportions',
          ratio: '1.5 : 1 length-to-width ratio',
          contourGuide: 'Follow natural zygomatic hollow and blend upward into hairline.',
        };
      case 'round':
        return {
          title: 'Curved Round Contour',
          ratio: '1 : 1 width-to-height balance',
          contourGuide: 'Sculpt steep 45° diagonal contour from ear tragus toward oral commissure.',
        };
      case 'square':
        return {
          title: 'Defined Gonial Angle Square',
          ratio: 'Even jaw-to-temple width',
          contourGuide: 'Buff soft warm bronzer over jaw corners and place blush high on cheek centers.',
        };
      case 'heart':
        return {
          title: 'Inverted Triangle / Heart',
          ratio: 'Wider forehead tapering to narrow chin',
          contourGuide: 'Contour lateral forehead temples and soften chin apex with horizontal bronzer.',
        };
      case 'diamond':
        return {
          title: 'Prominent High Zygomatic Diamond',
          ratio: 'Narrow forehead & chin with wide cheekbones',
          contourGuide: 'Place blush on outer cheek crests and highlight center forehead and chin.',
        };
      default:
        return {
          title: 'Balanced Facial Geometry',
          ratio: 'Symmetrical bone structure',
          contourGuide: 'Soft perimeter draping.',
        };
    }
  };

  const faceInfo = getFaceShapeInsight(diagnostics.faceShape);

  // Under-eye discoloration analysis
  const getUnderEyeInsight = (hue: string) => {
    if (hue.includes('purple') || hue.includes('blue')) {
      return {
        type: 'Vascular Bluish-Purple Hollow',
        mechanism: 'Thin periorbital dermal layer revealing superficial sub-dermal venous capillaries.',
        neutralizer: 'Peach / Salmon micro-pigment',
        action: 'Neutralizes blue wavelength via complementary optical mixing on the color wheel.',
      };
    } else if (hue.includes('brown') || hue.includes('melanin')) {
      return {
        type: 'Periorbital Melanin Hyperpigmentation',
        mechanism: 'Excess melanin synthesis common in South Asian, Mediterranean, and Latin complexions.',
        neutralizer: 'Warm Terracotta / Deep Orange',
        action: 'Cancels dark brown shadowing to prevent foundation from turning into an ashy gray mask.',
      };
    } else {
      return {
        type: 'Capillary Erythema & Redness',
        mechanism: 'Dilated surface micro-vessels or skin sensitivity.',
        neutralizer: 'Mint / Pistachio Green',
        action: 'Cancels hemoglobin red reflection directly.',
      };
    }
  };

  const underEyeInfo = getUnderEyeInsight(diagnostics.darkCircleHue);

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
              Facial Feature Extraction & Architectural Sketch Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-100 flex items-center gap-2 mt-1">
            Anatomical Facial Diagnostics
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
              Auto-Calculated
            </span>
          </h2>
        </div>

        {/* Feature Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Toggle Architectural Wireframe Mesh */}
          <button
            onClick={onToggleMesh}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isMeshActive
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-sm ring-1 ring-cyan-500/50'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architectural Sketch Overlay: {isMeshActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Re-Scan Face */}
          <button
            onClick={onReScanFace}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Re-Scan Face</span>
          </button>

          {/* Delete Custom Photo Button (Safety & Privacy Feature) */}
          {hasCustomUploadedPhoto && (
            <button
              onClick={onDeleteCustomPhoto}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 flex items-center gap-1.5 transition-colors"
              title="Delete uploaded photo permanently from device memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge & Delete Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-800">
        {[
          { id: 'all', label: 'All Features' },
          { id: 'eyes', label: 'Eye Shape & Fold' },
          { id: 'skin', label: 'Skin Color & Undertone' },
          { id: 'face', label: 'Face Shape & Bone' },
          { id: 'undereye', label: 'Under-Eye & Melanin' },
          { id: 'lips', label: 'Lip Architecture' },
          { id: 'nose', label: 'Nose Contour' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFeatureTab(tab.id as any)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              selectedFeatureTab === tab.id
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 6-Card Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CARD 1: EYE SHAPE EXTRACTION */}
        {(selectedFeatureTab === 'all' || selectedFeatureTab === 'eyes') && (
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3 shadow-md hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Eye Architecture</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                {diagnostics.eyeConfidence}% Confidence
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-semibold text-stone-100 flex items-center gap-2">
                <span className="capitalize">{diagnostics.eyeShape} Eyes</span>
                <span className="text-xs text-amber-400 font-normal">({eyeInfo.title})</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {eyeInfo.details}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-mono">Floating Crease Offset:</div>
              <div className="text-stone-200 font-semibold">{diagnostics.floatingCreaseOffsetMm} mm above anatomical fold</div>
              <div className="text-stone-400 font-mono pt-1">Canthal Geometry:</div>
              <div className="text-stone-300 text-[10px]">{eyeInfo.angle}</div>
            </div>

            <div className="text-xs text-cyan-200 bg-cyan-950/40 border border-cyan-500/20 p-2.5 rounded-lg">
              <strong className="text-cyan-300">MUA Solution: </strong>
              <span>{eyeInfo.muaSolution}</span>
            </div>
          </div>
        )}

        {/* CARD 2: SKIN COLOR & UNDERTONE */}
        {(selectedFeatureTab === 'all' || selectedFeatureTab === 'skin') && (
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3 shadow-md hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Skin Colorimetry</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: diagnostics.skinHex }}
                  className="w-4 h-4 rounded-full border border-stone-700 shadow-sm"
                />
                <span className="font-mono text-[11px] text-stone-300">{diagnostics.skinHex}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-base font-semibold text-stone-100">
                {diagnostics.skinToneName}
              </div>
              <div className="text-xs text-amber-300 font-mono">
                Undertone: {diagnostics.skinUndertone} · Monk Scale {diagnostics.monkScale}/10
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-mono">CIELAB Coordinates:</div>
              <div className="text-stone-200 font-mono">
                L* {diagnostics.cielab.l} · a* {diagnostics.cielab.a} · b* {diagnostics.cielab.b}
              </div>
              <div className="text-stone-400 font-mono pt-1">Fitzpatrick Classification:</div>
              <div className="text-stone-300">Type {diagnostics.fitzpatrickScale} (Sun-reactive melanin)</div>
            </div>

            <div className="text-xs text-amber-200 bg-amber-950/40 border border-amber-500/20 p-2.5 rounded-lg">
              <strong className="text-amber-300">Formulation Rule: </strong>
              <span>
                Balanced with warm ochre & olive chrome pigments to prevent ashy gray flashback under bright photography.
              </span>
            </div>
          </div>
        )}

        {/* CARD 3: FACE SHAPE & BONE SYMMETRY */}
        {(selectedFeatureTab === 'all' || selectedFeatureTab === 'face') && (
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3 shadow-md hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Face Shape & Symmetry</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                {faceInfo.ratio}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-semibold text-stone-100 capitalize">
                {diagnostics.faceShape} Bone Structure
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Zygomatic arch and mandibular angles balanced for optimal light reflection.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-mono">Symmetry Index:</div>
              <div className="text-stone-200 font-semibold">94.8% Bilateral Symmetry</div>
              <div className="text-stone-400 font-mono pt-1">Chisel Vector:</div>
              <div className="text-stone-300 text-[10px]">Tragus to Oral Commissure Line</div>
            </div>

            <div className="text-xs text-purple-200 bg-purple-950/40 border border-purple-500/20 p-2.5 rounded-lg">
              <strong className="text-purple-300">Sculpting Tip: </strong>
              <span>{faceInfo.contourGuide}</span>
            </div>
          </div>
        )}

        {/* CARD 4: UNDER-EYE CIRCLES & TEAR TROUGH */}
        {(selectedFeatureTab === 'all' || selectedFeatureTab === 'undereye') && (
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3 shadow-md hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" />
                <span>Under-Eye Colorimeter</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: diagnostics.darkCircleHex }}
                  className="w-4 h-4 rounded-full border border-stone-700 shadow-sm"
                />
                <span className="font-mono text-[11px] text-stone-300">{diagnostics.darkCircleHex}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-base font-semibold text-stone-100">
                {underEyeInfo.type}
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {underEyeInfo.mechanism}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-mono">Required Neutralizer:</div>
              <div className="text-orange-300 font-semibold">{underEyeInfo.neutralizer}</div>
              <div className="text-stone-400 font-mono pt-1">Perioral Darkness:</div>
              <div className="text-stone-300 text-[10px]">
                {diagnostics.perioralDarkness ? 'Detected around mouth corners (Terracotta needed)' : 'Even tone around lips'}
              </div>
            </div>

            <div className="text-xs text-orange-200 bg-orange-950/40 border border-orange-500/20 p-2.5 rounded-lg">
              <strong className="text-orange-300">Neutralization Action: </strong>
              <span>{underEyeInfo.action}</span>
            </div>
          </div>
        )}

        {/* CARD 5: NOSE ARCHITECTURE */}
        {(selectedFeatureTab === 'all' || selectedFeatureTab === 'nose') && (
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3 shadow-md hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Nose Architecture</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Extracted
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-semibold text-stone-100">
                Straight Dorsal Bridge with Soft Bulb Apex
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Nasal bridge line width: 14mm · Nostril wing width: 34mm. Symmetrical alar base.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-mono">Contour Recommendation:</div>
              <div className="text-stone-200">Parallel 2mm vertical shading along dorsal lateral walls</div>
              <div className="text-stone-400 font-mono pt-1">Tip Highlight Point:</div>
              <div className="text-stone-300 text-[10px]">Button exclamation-point dot on apex</div>
            </div>

            <div className="text-xs text-emerald-200 bg-emerald-950/40 border border-emerald-500/20 p-2.5 rounded-lg">
              <strong className="text-emerald-300">Longevity Note: </strong>
              <span>Use mattifying pore primer on the sides of the nose to prevent sunglasses indentation.</span>
            </div>
          </div>
        )}

        {/* CARD 6: LIP ARCHITECTURE & VERMILLION BORDER */}
        {(selectedFeatureTab === 'all' || selectedFeatureTab === 'lips') && (
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3 shadow-md hover:border-stone-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lip Architecture</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: diagnostics.naturalLipHex }}
                  className="w-4 h-4 rounded-full border border-stone-700 shadow-sm"
                />
                <span className="font-mono text-[11px] text-stone-300">{diagnostics.naturalLipHex}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-base font-semibold text-stone-100">
                Full Symmetrical Pout with Defined Cupid's Bow
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Natural warm rosewood pigment with two-toned upper lip melanin rim.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-mono">Upper to Lower Ratio:</div>
              <div className="text-stone-200 font-semibold">1 : 1.4 (Golden Volume Proportion)</div>
              <div className="text-stone-400 font-mono pt-1">Target Look Alignment:</div>
              <div className="text-stone-300 text-[10px]">{currentLook.lipShadeName} ({currentLook.lipFinish})</div>
            </div>

            <div className="text-xs text-rose-200 bg-rose-950/40 border border-rose-500/20 p-2.5 rounded-lg">
              <strong className="text-rose-300">Application Secret: </strong>
              <span>Contour central bow with wax pencil; keep mouth corners razor clean to prevent bleeding.</span>
            </div>
          </div>
        )}
      </div>

      {/* Anti-Hacking & Safe Deletion Privacy Assurance */}
      <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 text-xs text-stone-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="text-stone-300">
            <strong>100% Client-Side Privacy:</strong> All facial feature extraction runs in volatile browser memory. Zero images are ever transmitted to external servers.
          </span>
        </div>
        {hasCustomUploadedPhoto && (
          <button
            onClick={onDeleteCustomPhoto}
            className="text-rose-400 hover:text-rose-300 text-xs font-semibold underline underline-offset-4 cursor-pointer shrink-0"
          >
            Purge uploaded selfie now
          </button>
        )}
      </div>
    </div>
  );
};
