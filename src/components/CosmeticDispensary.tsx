import React, { useState } from 'react';
import { Droplet, Play, RotateCcw, Check, Sparkles, Sliders, Info, ShieldCheck } from 'lucide-react';
import { CartridgePod, DispensaryBatch } from '../types/makeup';

interface CosmeticDispensaryProps {
  batch: DispensaryBatch;
  cartridges: CartridgePod[];
  onBatchDispensed?: () => void;
}

export const CosmeticDispensary: React.FC<CosmeticDispensaryProps> = ({
  batch,
  cartridges,
  onBatchDispensed,
}) => {
  const [dispenseMode, setDispenseMode] = useState<'automated' | 'manual'>('automated');
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispenseProgress, setDispenseProgress] = useState(0); // 0-100%
  const [activeWellDispensing, setActiveWellDispensing] = useState<'foundation' | 'corrector' | 'lipstick' | 'done' | null>(null);
  const [mixedWells, setMixedWells] = useState<{ [key: string]: boolean }>({});
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Trigger automated micro-stepper dispense animation
  const handleStartAutomatedDispense = () => {
    if (isDispensing) return;
    setIsDispensing(true);
    setDispenseProgress(0);
    setActiveWellDispensing('foundation');
    setMixedWells({});

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setDispenseProgress(progress);

      if (progress < 35) {
        setActiveWellDispensing('foundation');
      } else if (progress < 70) {
        setActiveWellDispensing('corrector');
      } else if (progress < 98) {
        setActiveWellDispensing('lipstick');
      } else {
        clearInterval(interval);
        setIsDispensing(false);
        setActiveWellDispensing('done');
        setMixedWells({ foundation: true, corrector: true, lipstick: true });
        if (onBatchDispensed) onBatchDispensed();
      }
    }, 70);
  };

  const toggleWellMixed = (well: string) => {
    setMixedWells((prev) => ({ ...prev, [well]: !prev[well] }));
  };

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl">
      {/* Dispensary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            LOWER BASE · INTEGRATED PIGMENT DISPENSARY
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            Precision Cosmetic Laboratory
          </h2>
        </div>

        {/* Automated vs Manual Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-medium">
          <button
            onClick={() => setDispenseMode('automated')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dispenseMode === 'automated'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Automated Micro-Dispense
          </button>
          <button
            onClick={() => setDispenseMode('manual')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dispenseMode === 'manual'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Manual Drop Recipe
          </button>
        </div>
      </div>

      {/* Cartridge Status Chamber */}
      <div className="my-5">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2.5">
          <span className="font-medium text-stone-300">Inserted Pigment Cartridges (Airtight RFID Pods)</span>
          <span className="font-mono text-amber-300/80 text-[11px]">Kubelka-Munk Pigment Matrix</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {cartridges.map((cart) => (
            <div
              key={cart.id}
              className="bg-stone-950/80 border border-stone-800/90 rounded-xl p-2.5 flex flex-col justify-between hover:border-stone-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-200">
                  {cart.label}
                </span>
                <div
                  className="w-3.5 h-3.5 rounded-full border border-stone-700 shadow-sm"
                  style={{ backgroundColor: cart.colorHex }}
                />
              </div>

              <div className="my-2">
                <div className="text-xs font-medium text-stone-200 truncate">{cart.name}</div>
                <div className="text-[10px] text-stone-500 truncate">{cart.chemicalName.split(' ')[0]}</div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-stone-400 mb-1">
                  <span>Level</span>
                  <span className="font-mono">{cart.currentLevelPercent}%</span>
                </div>
                <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-400/80 rounded-full transition-all duration-500"
                    style={{ width: `${cart.currentLevelPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 3-Well Magnetic Palette Presentation */}
      <div className="bg-stone-950 border border-stone-800/80 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-semibold text-stone-100 flex items-center gap-2">
              <span>Magnetic Mixing Palette (3 Wells)</span>
              {activeWellDispensing === 'done' && (
                <span className="text-[11px] text-emerald-400 font-normal flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready to Blend
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Custom single-use batch formulated specifically for your skin tone, dark circle hue, and selected aesthetic.
            </p>
          </div>

          {/* Action Trigger Button */}
          {dispenseMode === 'automated' ? (
            <button
              onClick={handleStartAutomatedDispense}
              disabled={isDispensing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
                isDispensing
                  ? 'bg-amber-600/40 text-amber-200 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 hover:shadow-amber-500/20'
              }`}
            >
              {isDispensing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Dispensing ({dispenseProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Dispense Custom Batch</span>
                </>
              )}
            </button>
          ) : (
            <div className="text-xs text-amber-300 font-mono">
              Follow manual drop counts below
            </div>
          )}
        </div>

        {/* Automated Progress Bar if dispensing */}
        {isDispensing && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/30 border border-amber-600/30">
            <div className="flex justify-between text-xs text-amber-200 mb-1.5 font-mono">
              <span>
                Micro-Dropper Active: Well{' '}
                {activeWellDispensing === 'foundation'
                  ? 'A (Foundation)'
                  : activeWellDispensing === 'corrector'
                  ? 'B (Peach Corrector)'
                  : 'C (Lipstick)'}
              </span>
              <span>{dispenseProgress}% Complete</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-150 rounded-full"
                style={{ width: `${dispenseProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 3 Wells Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Well A: Custom Foundation */}
          <div
            className={`relative rounded-xl p-4 border transition-all ${
              activeWellDispensing === 'foundation'
                ? 'bg-stone-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-amber-300">
                WELL A
              </span>
              <span className="text-[11px] text-stone-400">{batch.foundation.coverage} Coverage</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-stone-700 shadow-inner flex items-center justify-center shrink-0"
                style={{ backgroundColor: batch.foundation.resultHex }}
              >
                {activeWellDispensing === 'foundation' && (
                  <Droplet className="w-5 h-5 text-stone-900 animate-bounce" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-100">{batch.foundation.shadeName}</div>
                <div className="text-xs text-stone-400">Vol: {batch.foundation.totalMl} mL</div>
              </div>
            </div>

            {/* Percentage Recipe Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-400">White TiO₂</span>
                <span className="font-mono">{batch.foundation.white}% ({batch.foundation.drops.white} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Yellow Ochre</span>
                <span className="font-mono">{batch.foundation.yellow}% ({batch.foundation.drops.yellow} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Crimson Red</span>
                <span className="font-mono">{batch.foundation.red}% ({batch.foundation.drops.red} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Olive Deep</span>
                <span className="font-mono">{batch.foundation.olive}% ({batch.foundation.drops.olive} drop)</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Base Carrier</span>
                <span className="font-mono">{batch.foundation.base}% ({batch.foundation.drops.basePumps} pumps)</span>
              </div>
            </div>

            <button
              onClick={() => toggleWellMixed('foundation')}
              className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                mixedWells.foundation
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {mixedWells.foundation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Blended with Spatula</span>
                </>
              ) : (
                <span>Click when blended</span>
              )}
            </button>
          </div>

          {/* Well B: Color-Correcting Concealer */}
          <div
            className={`relative rounded-xl p-4 border transition-all ${
              activeWellDispensing === 'corrector'
                ? 'bg-stone-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-orange-400">
                WELL B
              </span>
              <span className="text-[11px] text-stone-400">Under-Eye Corrector</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-stone-700 shadow-inner flex items-center justify-center shrink-0"
                style={{ backgroundColor: batch.corrector.resultHex }}
              >
                {activeWellDispensing === 'corrector' && (
                  <Droplet className="w-5 h-5 text-stone-900 animate-bounce" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-100">{batch.corrector.correctorType} Corrector</div>
                <div className="text-xs text-stone-400">Vol: {batch.corrector.totalMl} mL</div>
              </div>
            </div>

            {/* Percentage Recipe Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-400">White TiO₂</span>
                <span className="font-mono">{batch.corrector.white}% ({batch.corrector.drops.white} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Yellow Ochre</span>
                <span className="font-mono">{batch.corrector.yellow}% ({batch.corrector.drops.yellow} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Crimson Red</span>
                <span className="font-mono">{batch.corrector.red}% ({batch.corrector.drops.red} drops)</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Base Carrier</span>
                <span className="font-mono">{batch.corrector.base}% ({batch.corrector.drops.basePumps} pump)</span>
              </div>
              <div className="pt-1 text-[11px] text-orange-300/90 leading-tight">
                Neutralizes: {batch.corrector.targetIssue}
              </div>
            </div>

            <button
              onClick={() => toggleWellMixed('corrector')}
              className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                mixedWells.corrector
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {mixedWells.corrector ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Blended with Spatula</span>
                </>
              ) : (
                <span>Click when blended</span>
              )}
            </button>
          </div>

          {/* Well C: Custom Lipstick */}
          <div
            className={`relative rounded-xl p-4 border transition-all ${
              activeWellDispensing === 'lipstick'
                ? 'bg-stone-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-rose-400">
                WELL C
              </span>
              <span className="text-[11px] text-stone-400 capitalize">{batch.lipstick.finish} Lip</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-stone-700 shadow-inner flex items-center justify-center shrink-0"
                style={{ backgroundColor: batch.lipstick.resultHex }}
              >
                {activeWellDispensing === 'lipstick' && (
                  <Droplet className="w-5 h-5 text-stone-900 animate-bounce" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-100">{batch.lipstick.shadeName}</div>
                <div className="text-xs text-stone-400">Vol: {batch.lipstick.totalMl} mL</div>
              </div>
            </div>

            {/* Percentage Recipe Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-400">Crimson Red</span>
                <span className="font-mono">{batch.lipstick.red}% ({batch.lipstick.drops.red} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Yellow Ochre</span>
                <span className="font-mono">{batch.lipstick.yellow}% ({batch.lipstick.drops.yellow} drops)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">White / Olive</span>
                <span className="font-mono">{batch.lipstick.white + batch.lipstick.olive}% ({batch.lipstick.drops.white + batch.lipstick.drops.olive} drops)</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Wax/Balm Base</span>
                <span className="font-mono">{batch.lipstick.base}% ({batch.lipstick.drops.basePumps} pump)</span>
              </div>
              <div className="pt-1 text-[11px] text-rose-300/90 leading-tight">
                Texture: Formulated for {batch.lipstick.finish} application
              </div>
            </div>

            <button
              onClick={() => toggleWellMixed('lipstick')}
              className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                mixedWells.lipstick
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {mixedWells.lipstick ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Blended with Spatula</span>
                </>
              ) : (
                <span>Click when blended</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
