import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Sparkles, Layers, Droplets, Shield, 
  Eye, Wand2, CheckCircle2, AlertCircle, Info, Wind, ArrowRight, Play, Check
} from 'lucide-react';
import { FaceDiagnostics, MakeupLook, WeatherCondition } from '../types/makeup';
import { getCoreBrandMatches } from '../data/globalBrands';

export interface FaceCarouselStep {
  stepNumber: number;
  id: string;
  title: string;
  category: string;
  tagline: string;
  colorHex: string;
  toolNeeded: string;
  faceZone: string;
  instructions: string;
  muaExpertTip: string;
  antiMistakeWarning: string;
  colorCorrectionAreas?: {
    color: string;
    hex: string;
    area: string;
    purpose: string;
  }[];
}

interface StepByStepFaceCarouselProps {
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  currentWeather: WeatherCondition;
  activeStep: number;
  onSelectStep: (stepNumber: number) => void;
  onPreviewOnMirror: (stepNumber: number) => void;
}

export const StepByStepFaceCarousel: React.FC<StepByStepFaceCarouselProps> = ({
  diagnostics,
  currentLook,
  currentWeather,
  activeStep,
  onSelectStep,
  onPreviewOnMirror,
}) => {
  const brandData = getCoreBrandMatches(
    diagnostics.monkScale,
    diagnostics.skinUndertone,
    diagnostics.darkCircleHue
  );

  const isHumid = currentWeather === 'monsoon-humid' || currentWeather === 'hot-summer';
  const isColdDry = currentWeather === 'dry-winter' || currentWeather === 'cold-dry';

  const steps: FaceCarouselStep[] = [
    {
      stepNumber: 1,
      id: 'step-skin-prep',
      title: 'Skin Prep & Climate Barrier',
      category: 'Foundation Preparation',
      tagline: isHumid ? 'Lightweight Water Gel & Sebum Shield' : isColdDry ? 'Ceramide Moisture Seal & Hydration' : 'Balanced Hyaluronic Cushion',
      colorHex: '#38bdf8',
      toolNeeded: 'Clean fingertips with upward pressing motions',
      faceZone: 'Full Face with focus on dry orbital zone & oily T-zone',
      instructions: isHumid
        ? 'Apply oil-free niacinamide gel moisturizer. Press into cheekbones and let absorb for 60 seconds before makeup so oils do not break through.'
        : 'Layer hydrating ceramide serum and squalane cream over cheeks and forehead. Create a plumping barrier so powder does not cling to dry spots.',
      muaExpertTip: 'Expert MUAs emphasize that 80% of flawless makeup is the skincare prep. If the base is dry or greasy, no foundation will adhere smoothly.',
      antiMistakeWarning: 'Avoid heavy oils directly under the lower eyelid; it causes eyeliner and concealer to melt and smudge into fine lines.',
    },
    {
      stepNumber: 2,
      id: 'step-primer',
      title: 'Pore & Texture Primer',
      category: 'Surface Smoothing',
      tagline: 'Silicone Blur on T-Zone + Dewy Radiance on Cheeks',
      colorHex: '#818cf8',
      toolNeeded: 'Dense synthetic stippling brush or finger warmth',
      faceZone: 'Nose bridge, nostril wings, chin crease & center forehead',
      instructions: 'Press a pea-sized amount of pore-blurring primer into the enlarged pore zone around the nose wings. Smooth outward with rolling motions without dragging.',
      muaExpertTip: 'Do not rub primer like lotion; gently press and roll it into pores so it creates a micro-level silicone bridge.',
      antiMistakeWarning: 'Using too much primer causes pilling when liquid foundation is layered over top. A tiny dab is plenty!',
    },
    {
      stepNumber: 3,
      id: 'step-color-correct',
      title: 'Targeted Color Correction',
      category: 'Pigment Neutralization',
      tagline: 'Neutralize Dark Melanin & Blemish Redness Before Base',
      colorHex: '#f97316',
      toolNeeded: 'Small tapered flat concealer brush (e.g. Swiss Beauty / Mars micro-brush)',
      faceZone: 'Under-eye tear troughs, mouth corners & nostril redness',
      instructions: `Apply ${diagnostics.monkScale >= 6 ? 'Warm Terracotta/Orange' : 'Peach/Salmon'} corrector strictly inside the tear trough line. Place Mint Green on red acne blemishes. Tap with finger warmth to blend edges until translucent.`,
      muaExpertTip: 'Color correction is optical neutralization, not opacity. A whisper of peach cancels dark blue/brown melanin, allowing you to use 50% less concealer!',
      antiMistakeWarning: 'Never pull orange corrector onto the top of the cheekbones where there is no discoloration; it will turn your foundation muddy.',
      colorCorrectionAreas: brandData.colorCorrectionPlan.map((c) => ({
        color: c.correctorColor,
        hex: c.correctorHex,
        area: c.faceZone,
        purpose: c.instructions,
      })),
    },
    {
      stepNumber: 4,
      id: 'step-foundation',
      title: 'Foundation Stippling',
      category: 'Even Complexion Base',
      tagline: `Exact Match: ${brandData.brands[0].foundation.shadeName} (${brandData.brands[0].foundation.shadeCode})`,
      colorHex: brandData.brands[0].foundation.hex,
      toolNeeded: 'Damp teardrop beauty sponge or dense kabuki buffing brush',
      faceZone: 'Face center outward toward hairline and jawline feathering',
      instructions: `Dispense 1 pump (or 1 cushion tap of TIRTIR / MAC NC${diagnostics.monkScale * 5 + 15}). Place micro-stippling dots on cheeks, forehead center, and chin. Bounce the damp sponge outward, leaving hairline sheer.`,
      muaExpertTip: 'Always stipple in tapping/bouncing motions, never drag. Dragging lifts up your color corrector underneath and reveals dark circles.',
      antiMistakeWarning: 'Stop applying foundation 1 inch before the hairline and lower jaw; sheer it out smoothly into the neck to avoid harsh mask lines.',
    },
    {
      stepNumber: 5,
      id: 'step-concealer-lift',
      title: 'Concealer & Optical Facelift',
      category: 'Dimension & Brightening',
      tagline: 'The 4-Point Facelift Technique (Tear Trough, Outer Eye, Bridge, Chin)',
      colorHex: '#fbbf24',
      toolNeeded: 'Pointed micro-sponge or fingertip warmth',
      faceZone: 'Inner tear trough dot + outer corner temple lift line',
      instructions: `Place 1 dot of ${brandData.brands[1].brand} concealer (${brandData.brands[1].concealer.shadeCode}) on the inner tear trough. Place a second upward flick at the outer corner toward the temple. Tap into place without wiping.`,
      muaExpertTip: 'The outer upward flick creates an optical lifting illusion that instantly snatches hooded eyes and cheekbones upward.',
      antiMistakeWarning: 'Do not bake large triangles of concealer under the entire eye; it builds cakey folds when smiling.',
    },
    {
      stepNumber: 6,
      id: 'step-contour-blush',
      title: 'Contour & Blush Sculpting',
      category: 'Bone Structure Definition',
      tagline: `Custom Placed for ${diagnostics.faceShape.toUpperCase()} Face Architecture`,
      colorHex: '#f43f5e',
      toolNeeded: 'Angled contour brush & fluffy blush brush',
      faceZone: 'Hollow beneath zygomatic bone & high cheekbone apples',
      instructions: diagnostics.faceShape === 'round'
        ? 'Sculpt high-angle contour from tragus towards mouth corner to create vertical elongation. Drape blush high on cheekbones blending into temple.'
        : diagnostics.faceShape === 'square'
        ? 'Soften jawline corners with bronze buffing. Place blush on the center apples of the cheeks in circular soft strokes.'
        : 'Trace the natural curve under the cheekbones, blending upward toward the ear. Apply blush on the high orbital bone for a luminous lift.',
      muaExpertTip: 'Always blend contour upward, never downward into the lower jaw hollow, to keep the facial structure lifted.',
      antiMistakeWarning: 'Avoid muddy cool-gray contour on warm South Asian or olive skin tones; use neutral-warm amber tones instead.',
    },
    {
      stepNumber: 7,
      id: 'step-eye-stencil',
      title: 'Eye Architecture & Liner',
      category: 'Eye Definition',
      tagline: `${currentLook.eyeStyleName} for ${diagnostics.eyeShape.toUpperCase()} Eye Fold`,
      colorHex: '#a855f7',
      toolNeeded: 'Ultra-fine 0.1mm felt-tip liner & angled detail brush',
      faceZone: 'Upper lashline, outer wing angle & supratarsal fold',
      instructions: diagnostics.eyeShape === 'hooded'
        ? 'Keep eyes completely open and look straight into mirror. Draw the wing straight across the skin fold to create a "Batwing". When eyes close it forms a geometric diamond step that looks perfectly straight when open!'
        : diagnostics.eyeShape === 'monolid'
        ? 'Tightline the lash base with gel liner. Smoke out a soft chocolate/terracotta gradient 2-3mm above the lash line for a dreamy almond eye effect.'
        : 'Follow the upward continuation of the lower waterline toward the brow tail at a 35°-40° angle for the classic winged cat eye.',
      muaExpertTip: 'Rest your pinky finger on your cheekbone to stabilize your hand while drawing the wing tip. Never pull your eyelid skin sideways while drawing!',
      antiMistakeWarning: 'Pulling eyelid skin causes the line to crinkle and distort into an irregular zig-zag once the skin relaxes.',
    },
    {
      stepNumber: 8,
      id: 'step-lip-sculpt',
      title: 'Lip Contouring & Shading',
      category: 'Lip Architecture',
      tagline: `${currentLook.lipShadeName} (${currentLook.lipFinish.toUpperCase()})`,
      colorHex: currentLook.lipColorHex,
      toolNeeded: 'Wax lip pencil + lip brush or doe-foot wand',
      faceZone: 'Cupid\'s bow, lower vermillion border & inner mucosal center',
      instructions: currentLook.lipFinish === 'velvet-gradient'
        ? 'Dab pigment concentrated in the center of upper and lower lips. Press lips together, then use a clean finger or fluffy brush to softly blur edges outwards for the Korean popsicle effect.'
        : currentLook.id === 'mexican-glam'
        ? 'Overline slightly only at the center cupid\'s bow and center lower curve. Keep corners strictly inside natural borders. Fill center with warm nude.'
        : 'Trace natural lip contours smoothly. Fill with matching tint and top with high-refraction peptide glaze for the clean girl pout.',
      muaExpertTip: 'Slightly contouring the shadow beneath the lower lip center with a touch of bronzer makes lips appear naturally 30% plumper.',
      antiMistakeWarning: 'Overlining the outer corners of the mouth creates a downturned "joker" effect; only overline the central bow.',
    },
    {
      stepNumber: 9,
      id: 'step-setting-lock',
      title: 'Setting & Climate Longevity Lock',
      category: 'Wear-Time Optimization',
      tagline: isHumid ? 'Micro-Silica Baking on T-Zone + Matte Seal' : 'Hydrating Glycerin Mist & Minimal Mineral Veil',
      colorHex: '#10b981',
      toolNeeded: 'Triangle velvet powder puff & fine continuous mist spray',
      faceZone: 'Smile lines, nostril folds, forehead center & full perimeter mist',
      instructions: isHumid
        ? 'Press translucent setting powder onto smile lines, under eyes, and chin with a velvet puff. Let sit for 90 seconds, then dust off with a fluffy brush and lock with transfer-proof setting spray.'
        : 'Dust sheer translucent powder only on the center of the forehead and nose. Keep cheekbones bare and spritz with hydrating hyaluronic mist for all-day dew.',
      muaExpertTip: 'Hold your setting spray 10 inches away and mist in an "X" and "T" pattern so the droplets land as a micro-fog rather than water streaks.',
      antiMistakeWarning: 'Never bake powder under dehydrated eyes in winter; it will emphasize every fine line and dry patch.',
    },
    {
      stepNumber: 10,
      id: 'step-final-reveal',
      title: 'Final Masterpiece & Longevity Audit',
      category: 'Quality Assurance & Master Review',
      tagline: 'Flawless Symmetrical Completion Ready for Any Lighting',
      colorHex: '#ec4899',
      toolNeeded: 'Mirror angled inspection under 3200K / 5500K lighting',
      faceZone: 'Full Face Evaluation',
      instructions: 'Step back 2 feet from your mirror. Inspect symmetry between left and right eyeliner wings, cheekbone blush altitude, and seamless neck blending under Daylight (5500K) and Evening (3200K) light.',
      muaExpertTip: 'Take a test selfie with flash in a dim room. If any white flashback appears under the eyes, lightly tap with a damp sponge to remove excess silica powder.',
      antiMistakeWarning: 'Check the jawline in daylight to ensure zero perimeter line between face and neck.',
    },
  ];

  const currentStepData = steps.find((s) => s.stepNumber === activeStep) || steps[0];

  const handleNext = () => {
    if (activeStep < steps.length) {
      const nextStep = activeStep + 1;
      onSelectStep(nextStep);
      onPreviewOnMirror(nextStep);
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      const prevStep = activeStep - 1;
      onSelectStep(prevStep);
      onPreviewOnMirror(prevStep);
    }
  };

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header with Step Tracker */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300">
              AR Face Application Carousel · Live Guided Steps
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-100 flex items-center gap-2 mt-1">
            Step-by-Step Face Application
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
              Slide {activeStep} of {steps.length}
            </span>
          </h2>
        </div>

        {/* Action Controls: Prev / Next */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handlePrev}
            disabled={activeStep === 1}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              activeStep === 1
                ? 'opacity-40 cursor-not-allowed bg-stone-950 text-stone-500 border-stone-800'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <button
            onClick={() => onPreviewOnMirror(activeStep)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Project on Face Canvas</span>
          </button>

          <button
            onClick={handleNext}
            disabled={activeStep === steps.length}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              activeStep === steps.length
                ? 'opacity-40 cursor-not-allowed bg-stone-950 text-stone-500 border-stone-800'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40 shadow-sm'
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Navigation Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
        {steps.map((s) => {
          const isActive = s.stepNumber === activeStep;
          return (
            <button
              key={s.id}
              onClick={() => {
                onSelectStep(s.stepNumber);
                onPreviewOnMirror(s.stepNumber);
              }}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-stone-800 border-cyan-500 text-cyan-200 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-stone-950/80 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <span
                style={{ backgroundColor: s.colorHex }}
                className="w-2 h-2 rounded-full shrink-0 shadow-sm"
              />
              <span className="font-mono text-[10px] opacity-75">#{s.stepNumber}</span>
              <span className="truncate max-w-[110px]">{s.title.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Slide Card Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-stone-950/60 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-inner">
        {/* Left Column: Visual Guide & Brand Shade Integration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
              {currentStepData.category}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
              <span style={{ backgroundColor: currentStepData.colorHex }} className="w-2.5 h-2.5 rounded-full" />
              <span>Target Layer</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif text-amber-200">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-stone-400 font-mono">
              {currentStepData.tagline}
            </p>
          </div>

          {/* Facial Area & Tool Target */}
          <div className="space-y-2 pt-2">
            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800/80 space-y-1 text-xs">
              <div className="text-[10px] font-mono text-cyan-400 uppercase">Target Facial Zone</div>
              <div className="text-stone-200 font-medium">{currentStepData.faceZone}</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800/80 space-y-1 text-xs">
              <div className="text-[10px] font-mono text-amber-400 uppercase">Recommended Applicator Tool</div>
              <div className="text-stone-200 font-medium">{currentStepData.toolNeeded}</div>
            </div>
          </div>

          {/* Brand Product Recommendation Card for this Step */}
          {activeStep === 3 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-950/40 to-stone-900 border border-orange-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-orange-300 font-semibold font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXACT COLOR CORRECTOR BLUEPRINT</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-stone-300">
                  <span>Swiss Beauty Pro Wheel:</span>
                  <span className="font-mono text-orange-200">{brandData.brands[0].colorCorrector.shadeName}</span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Huda Beauty #FauxFilter:</span>
                  <span className="font-mono text-orange-200">{brandData.brands[1].colorCorrector.shadeName}</span>
                </div>
                <div className="flex items-center justify-between text-stone-300">
                  <span>Mars Cover Ranger:</span>
                  <span className="font-mono text-orange-200">{brandData.brands[3].colorCorrector.shadeName}</span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXACT FOUNDATION SHADES FOR YOUR SKIN TONE</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-mono">TIRTIR Cushion</div>
                  <div className="font-semibold text-amber-200">{brandData.brands[5].foundation.shadeCode}</div>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-mono">MAC Studio Fix</div>
                  <div className="font-semibold text-amber-200">{brandData.brands[2].foundation.shadeCode}</div>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-mono">Swiss Beauty</div>
                  <div className="font-semibold text-amber-200">{brandData.brands[0].foundation.shadeCode}</div>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-mono">Huda Beauty</div>
                  <div className="font-semibold text-amber-200">{brandData.brands[1].foundation.shadeCode}</div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-500/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXACT CONCEALER MATCHES</span>
              </div>
              <div className="text-[11px] text-stone-300 space-y-1">
                <div>• <strong>Swiss Beauty HD Liquid:</strong> {brandData.brands[0].concealer.shadeName} ({brandData.brands[0].concealer.shadeCode})</div>
                <div>• <strong>Huda Beauty #FauxFilter:</strong> {brandData.brands[1].concealer.shadeCode}</div>
                <div>• <strong>Mars Seal The Deal:</strong> {brandData.brands[3].concealer.shadeName}</div>
                <div>• <strong>Hilary Rhoda Camouflage:</strong> {brandData.brands[4].concealer.shadeCode}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Execution Guidance, Color Correction Breakdown, & MUA Secret */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Step Application Instructions */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 uppercase">
                <Play className="w-3.5 h-3.5 fill-cyan-300" />
                <span>Technique & Execution Instructions</span>
              </div>
              <p className="text-sm text-stone-200 leading-relaxed bg-stone-900/90 p-4 rounded-xl border border-stone-800">
                {currentStepData.instructions}
              </p>
            </div>

            {/* If Color Correction Step: Explicit Multi-Zone Grid */}
            {currentStepData.colorCorrectionAreas && currentStepData.colorCorrectionAreas.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-orange-300 uppercase flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Color Correction Area Breakdown</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentStepData.colorCorrectionAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: area.hex }}
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        />
                        <span className="font-semibold text-stone-200">{area.color}</span>
                      </div>
                      <div className="text-[11px] text-amber-200 font-mono">{area.area}</div>
                      <p className="text-[11px] text-stone-400 leading-snug">{area.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Master MUA Secret Tip */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 font-medium">Expert Masterclass Insight: </strong>
                <span>{currentStepData.muaExpertTip}</span>
              </div>
            </div>

            {/* Anti-Mistake Warning */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 font-medium">Common Mistake to Avoid: </strong>
                <span>{currentStepData.antiMistakeWarning}</span>
              </div>
            </div>
          </div>

          {/* Bottom Button to View in AR Mirror */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800/80">
            <span className="text-xs text-stone-400">
              Follow along on the reflection glass above with dynamic landmark trackers.
            </span>
            <button
              onClick={() => onPreviewOnMirror(activeStep)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Project Slide #{activeStep} on Mirror</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
