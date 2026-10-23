import React, { useState } from 'react';
import { Sparkles, Eye, Palette, CheckCircle, ArrowRight, Bot, BookOpen, Layers } from 'lucide-react';
import { FaceDiagnostics, MakeupLook } from '../types/makeup';

interface DiagnosticPanelProps {
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  onRequestGeminiConsult?: () => void;
  geminiLoading?: boolean;
  geminiAdvice?: any;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  diagnostics,
  currentLook,
  onRequestGeminiConsult,
  geminiLoading,
  geminiAdvice,
}) => {
  const [activeTab, setActiveTab] = useState<'eyes' | 'colorimetry' | 'texture' | 'face' | 'gemini'>('eyes');

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header with Title and Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            AI COMPUTER VISION & COLORIMETRY
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            Facial Diagnosis & Stencils
          </h2>
        </div>

        {/* Diagnostic Tabs */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('eyes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'eyes'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Eye Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('colorimetry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'colorimetry'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Dark Circles & Shade</span>
          </button>

          <button
            onClick={() => setActiveTab('texture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'texture'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Indian Skin & Acne Marks</span>
          </button>

          <button
            onClick={() => setActiveTab('face')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'face'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Face Sculpt</span>
          </button>

          <button
            onClick={() => setActiveTab('gemini')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'gemini'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Consultation</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EYE ARCHITECTURE (HOODED EYES FOCUS) */}
      {activeTab === 'eyes' && (
        <div className="space-y-4">
          {/* Eye Detection Badge & Details */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-amber-400">Classified Anatomy</span>
              <span className="text-xs font-mono text-stone-400">Confidence: {diagnostics.eyeConfidence}%</span>
            </div>
            <div className="text-lg font-semibold text-stone-100 flex items-center gap-2">
              <span className="capitalize">{diagnostics.eyeShape} Eyes</span>
              {diagnostics.eyeShape === 'hooded' && (
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Overhang Detected
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              {diagnostics.eyeReason}
            </p>
          </div>

          {/* Stencil Guidance for Hooded Eyes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-stone-950/60 border border-stone-800/90 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                <span>✦ The Floating Crease Rule</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Standard crease application will disappear when you look forward. Mirror Makeup projects a{' '}
                <strong className="text-amber-200">floating arch {diagnostics.floatingCreaseOffsetMm}mm above your natural fold</strong>{' '}
                onto your orbital bone. Blend your matte transition shadow here so your makeup stays visible with open eyes.
              </p>
            </div>

            <div className="bg-stone-950/60 border border-stone-800/90 rounded-xl p-3.5">
              <div className="text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
                <span>✦ Batwing Eyeliner Geometry</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Instead of a curved line that breaks across the hood, follow the magenta Batwing stencil: extend the wing upward from the lower waterline, then step inward horizontally across the crease before dropping to the lash line.
              </p>
            </div>
          </div>

          <div className="bg-stone-950/40 border border-stone-800/60 rounded-xl p-3 text-xs text-stone-400 flex items-center justify-between">
            <span>Crease Depth Metric: <strong className="text-stone-200">{diagnostics.supratarsalCreaseDepth}</strong></span>
            <span className="font-mono text-amber-400">Layer: {currentLook.eyeStyleName}</span>
          </div>
        </div>
      )}

      {/* TAB 2: COLORIMETRY & DARK CIRCLE NEUTRALIZATION */}
      {activeTab === 'colorimetry' && (
        <div className="space-y-4">
          {/* Under-Eye Colorimetry Box */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-orange-400">CIELAB Periorbital Analysis</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400 font-mono">
                  L*{diagnostics.cielab.l} · a*{diagnostics.cielab.a} · b*{diagnostics.cielab.b}
                </span>
                <div
                  className="w-4 h-4 rounded-full border border-stone-700"
                  style={{ backgroundColor: diagnostics.darkCircleHex }}
                  title="Sampled Dark Circle Hex"
                />
              </div>
            </div>

            <div className="text-base font-semibold text-stone-100 flex items-center gap-2">
              <span>Dark Circle Diagnosis:</span>
              <span className="text-amber-200 capitalize">{diagnostics.darkCircleHue.replace('-', ' ')}</span>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              Severity: {diagnostics.darkCircleSeverity}
            </p>

            {/* Color Correction prescription */}
            <div className="mt-3 p-3 bg-stone-900 border border-stone-800 rounded-lg flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-400/20 border border-orange-400/40 flex items-center justify-center shrink-0 text-orange-300 font-bold text-xs">
                {diagnostics.darkCircleHue === 'brown-melanin' ? 'OR' : 'PE'}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-stone-200">
                  Prescription: {diagnostics.darkCircleHue === 'brown-melanin' ? 'Warm Terracotta / Orange Corrector' : 'Peach / Salmon Corrector'} (Well B)
                </div>
                <div className="text-stone-400 mt-0.5 leading-relaxed">
                  {diagnostics.darkCircleHue === 'brown-melanin'
                    ? 'Deep melanin pigments absorb light in the blue spectrum. Orange/terracotta restores warmth and equalizes luminance before foundation.'
                    : 'Subsurface venous blood pooling creates violet-blue hues (270° on color wheel). The complementary peach/salmon pigment (45°) optically cancels the shadow.'}
                </div>
              </div>
            </div>
          </div>

          {/* Industry Shade Benchmark Matches */}
          <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-stone-400">Skin Shade & Benchmark Equivalents</span>
              <span className="text-xs text-amber-300 font-mono">MST Tier {diagnostics.monkScale}/10</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-7 h-7 rounded-full border border-stone-600 shadow-sm shrink-0"
                style={{ backgroundColor: diagnostics.skinHex }}
              />
              <div>
                <div className="text-sm font-semibold text-stone-100">{diagnostics.skinToneName}</div>
                <div className="text-xs text-stone-400">Undertone: {diagnostics.skinUndertone} · Fitzpatrick {diagnostics.fitzpatrickScale}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-800 text-xs">
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800/80">
                <div className="text-[10px] text-stone-500 uppercase font-mono">MAC Studio Fix</div>
                <div className="font-semibold text-stone-200 font-mono mt-0.5">{diagnostics.benchmarkMatches.mac}</div>
              </div>
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800/80">
                <div className="text-[10px] text-stone-500 uppercase font-mono">Fenty Pro Filt'r</div>
                <div className="font-semibold text-stone-200 font-mono mt-0.5">{diagnostics.benchmarkMatches.fenty}</div>
              </div>
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800/80">
                <div className="text-[10px] text-stone-500 uppercase font-mono">Maybelline Fit Me</div>
                <div className="font-semibold text-stone-200 font-mono mt-0.5">{diagnostics.benchmarkMatches.maybelline}</div>
              </div>
              <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800/80">
                <div className="text-[10px] text-stone-500 uppercase font-mono">L'Oréal True Match</div>
                <div className="font-semibold text-stone-200 font-mono mt-0.5">{diagnostics.benchmarkMatches.loreal}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INDIAN SKIN TEXTURE & ACNE MARKS CONCEALING */}
      {activeTab === 'texture' && (
        <div className="space-y-4">
          {/* South Asian / Indian Skin Texture Focus */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-emerald-400">South Asian & Indian Dermatological Architecture</span>
              <span className="text-xs font-mono text-stone-400">Texture: {diagnostics.textureType || 'Combination/Textured'}</span>
            </div>
            <div className="text-base font-semibold text-stone-100 flex items-center gap-2">
              <span>Warm Golden Undertone & Perioral Dark Circles</span>
              {diagnostics.perioralDarkness && (
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Perioral Zone Detected
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
              Indian skin rich in melanin frequently develops deeper pigmentation around the mouth, chin, and temples. Standard Western foundations turn ashy or grey here. Mirror Makeup’s dispensary formulates high-saturation Terracotta/Peach into Well B to neutralize the shadow before base application.
            </p>
          </div>

          {/* Acne Marks & Pinpoint Concealing Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <span>✦ The Lisa Eldridge Pinpoint Technique</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                To hide acne spots without cakeyness: dab a 0.01ml micro-dot of corrector strictly within the blemish boundary with a fine brush or spatula tip. Lightly feather the edge with a fingertip. Do not drag product across healthy skin!
              </p>
              <div className="text-[11px] text-stone-400 font-mono pt-1 border-t border-stone-800/80">
                Active Blemishes: {diagnostics.acneSpots?.length || 0} Targeted on Mirror Stencil
              </div>
            </div>

            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <span>✦ French Skincare-First Raw Radiance</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                French pharmacy beauty celebrates real skin texture rather than airbrushed spackle. By spot-concealing only redness and leaving cheeks sheer, your skin breathes naturally and looks freshly pampered, never masked.
              </p>
              <div className="text-[11px] text-stone-400 font-mono pt-1 border-t border-stone-800/80">
                Prevents Heavy Cakey Buildup in Humidity
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FACE SCULPT & CONTOUR */}
      {activeTab === 'face' && (
        <div className="space-y-3">
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-amber-400">Face Architecture</span>
              <span className="text-xs font-mono text-stone-400 capitalize">{diagnostics.faceShape} Symmetry</span>
            </div>
            <div className="text-base font-semibold text-stone-100 capitalize">
              {diagnostics.faceShape} Face Sculpting Plan
            </div>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              {diagnostics.faceShape === 'oval' && 'Balanced facial proportions. Focus contour directly along the lower edge of the zygomatic arch to enhance natural bone definition without narrowing.'}
              {diagnostics.faceShape === 'square' && 'Strong jawline with distinct gonial angles. Apply contour softly to the lower jaw corners and outer temples to create softer curves.'}
              {diagnostics.faceShape === 'round' && 'Curved perimeter with soft cheek fullness. Place contour at a sharp 45° angle from the tragus toward the lip corner, lifting cheekbones vertically.'}
              {diagnostics.faceShape === 'heart' && 'Wider forehead with tapered chin. Contour the temples and sides of forehead, and warm the tip of the chin with soft bronzer.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5">
              <div className="font-semibold text-stone-200 mb-1">Contour Placement Technique</div>
              <p className="text-stone-300 leading-relaxed">
                {currentLook.contourTechnique}
              </p>
            </div>
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3.5">
              <div className="font-semibold text-stone-200 mb-1">Blush Placement Technique</div>
              <p className="text-stone-300 leading-relaxed">
                {currentLook.blushTechnique}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GEMINI AI BEAUTY CONSULTATION */}
      {activeTab === 'gemini' && (
        <div className="space-y-3">
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase text-amber-400">Gemini MUA Consultation</span>
              </div>
              <button
                onClick={onRequestGeminiConsult}
                disabled={geminiLoading}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                {geminiLoading ? (
                  <span>Analyzing Face...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Diagnosis</span>
                  </>
                )}
              </button>
            </div>

            {geminiAdvice ? (
              <div className="space-y-3 text-xs">
                {geminiAdvice.eyeArchitectureAnalysis && (
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                    <div className="font-semibold text-amber-200 mb-1">Eye Stencil Strategy</div>
                    <p className="text-stone-300 leading-relaxed">{geminiAdvice.eyeArchitectureAnalysis}</p>
                  </div>
                )}

                {geminiAdvice.colorCorrectionPlan && (
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                    <div className="font-semibold text-orange-200 mb-1">Color Neutralization Strategy</div>
                    <p className="text-stone-300 leading-relaxed">{geminiAdvice.colorCorrectionPlan}</p>
                  </div>
                )}

                {geminiAdvice.lipstickUndertoneHarmony && (
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                    <div className="font-semibold text-rose-200 mb-1">Lipstick & Undertone Chemistry</div>
                    <p className="text-stone-300 leading-relaxed">{geminiAdvice.lipstickUndertoneHarmony}</p>
                  </div>
                )}

                {geminiAdvice.proMUAKeyTip && (
                  <div className="p-3 bg-amber-950/30 border border-amber-600/30 rounded-lg flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-amber-200">Pro MUA Tip</div>
                      <p className="text-amber-100/90 mt-0.5 leading-relaxed">{geminiAdvice.proMUAKeyTip}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-stone-400">
                Click <strong>Run AI Diagnosis</strong> to request real-time personalized cosmetic advice tailored to your facial architecture and chosen look.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
