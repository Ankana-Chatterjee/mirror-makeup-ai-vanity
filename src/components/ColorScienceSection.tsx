import React from 'react';
import { Cpu, ShieldCheck, Sparkles, Droplets, Sliders, Layers } from 'lucide-react';

export const ColorScienceSection: React.FC = () => {
  return (
    <section className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            SUBTRACTIVE PIGMENT CHEMISTRY & HARDWARE
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            The Physics of Mirror Makeup
          </h2>
        </div>
        <div className="text-xs text-stone-400">
          Bridging digital facial reflection with real-world cosmetic formulation
        </div>
      </div>

      {/* 2-Column Split: Hardware Design & Kubelka-Munk Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Appliance Architecture */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wide font-mono mb-2">
              <Cpu className="w-4 h-4" />
              <span>Standalone Appliance Hardware</span>
            </div>
            <h3 className="text-base font-semibold text-stone-100">
              Not a software filter — a complete vanity workstation
            </h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              Mirror Makeup integrates a 70/30 dielectric beam-splitter glass, flush 4K display, and perimeter 98+ CRI daylight LEDs. The lower base features micro-peristaltic fluidic plungers that dispense exact 0.02 mL micro-droplets into a magnetic three-well dish.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-900/80 border border-stone-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-stone-200">Two-Way Optical Dielectric Glass:</strong> Ultra-clear reflection while transmitting 1000-nit AR stencils directly onto your face reflection.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-900/80 border border-stone-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-stone-200">98+ CRI Calibrated Ring Light:</strong> Eliminates artificial color cast to guarantee camera skin readings match natural sunlight.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-stone-900/80 border border-stone-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-stone-200">Micro-Actuator Nozzle Head:</strong> Delivers high-viscosity liquid foundation and concentrated pigment drops with sub-millimeter precision.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>Latency: &lt;16ms local edge inference</span>
            <span>Zero cloud dependency</span>
          </div>
        </div>

        {/* Right: Kubelka-Munk Pigment Physics */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wide font-mono mb-2">
              <Droplets className="w-4 h-4" />
              <span>Kubelka-Munk Reflectance Formulation</span>
            </div>
            <h3 className="text-base font-semibold text-stone-100">
              Subtractive color synthesis from 5 universal pigments
            </h3>
            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              Screens combine light additively (Red + Green + Blue = White). Physical cosmetics absorb and scatter light subtractively. To calculate exact drop ratios, Mirror Makeup applies the Kubelka-Munk matrix:
            </p>

            <div className="my-3 p-3 bg-stone-900 border border-stone-800 rounded-lg text-center font-mono text-amber-300 text-sm">
              K / S = (1 - R∞)² / (2 · R∞)
            </div>

            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between py-1 border-b border-stone-800/60">
                <span>⚪ <strong>Titanium White (W):</strong> Lightness index (L*) & opacity</span>
                <span className="text-stone-400 font-mono">Scattering (S)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800/60">
                <span>🟡 <strong>Ochre Yellow (Y):</strong> Warmth, golden undertone (+b*)</span>
                <span className="text-stone-400 font-mono">Absorption (K)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800/60">
                <span>🔴 <strong>Crimson Red (R):</strong> Flush, vascular warmth, lip (+a*)</span>
                <span className="text-stone-400 font-mono">Absorption (K)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800/60">
                <span>🔵 <strong>Ultramarine Blue (B):</strong> Cooling agent, neutralizer</span>
                <span className="text-stone-400 font-mono">Absorption (K)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>🫒 <strong>Olive Deep (O):</strong> Desaturation & olive skintone</span>
                <span className="text-stone-400 font-mono">Equilibrium</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
            Formulation adjusts dynamically as your skin tans in summer or lightens in winter.
          </div>
        </div>
      </div>
    </section>
  );
};
