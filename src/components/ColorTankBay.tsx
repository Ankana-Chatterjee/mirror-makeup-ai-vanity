import React from 'react';
import { Droplets, Plus, AlertCircle, Check, RotateCcw, ShieldCheck, Activity } from 'lucide-react';
import { ColorTank } from '../types/device';

interface ColorTankBayProps {
  tanks: ColorTank[];
  onFillTank: (tankId: string, amountMl: number) => void;
  onRefillAllTanks: () => void;
  isDispensing: boolean;
  activeTankPumping: string | null;
}

export const ColorTankBay: React.FC<ColorTankBayProps> = ({
  tanks,
  onFillTank,
  onRefillAllTanks,
  isDispensing,
  activeTankPumping,
}) => {
  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>ELECTRONIC DEVICE COLOR RESERVOIR CHAMBER</span>
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            Refillable Pigment & Vehicle Tanks
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefillAllTanks}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>Top-Up All Tanks to 100%</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-400 leading-relaxed">
        This electronic machine mixes your exact custom foundation, color-correcting concealer, and lipstick by drawing micro-droplets directly from these liquid color tanks. Fill colors below or top up when levels run low.
      </p>

      {/* Tanks Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
        {tanks.map((tank) => {
          const fillPercent = Math.min(100, Math.round((tank.currentVolumeMl / tank.maxCapacityMl) * 100));
          const isLow = tank.currentVolumeMl <= tank.lowThresholdMl;
          const isPumping = isDispensing && activeTankPumping === tank.id;

          return (
            <div
              key={tank.id}
              className={`relative bg-stone-950 rounded-xl p-3 border transition-all flex flex-col justify-between ${
                isPumping
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : isLow
                  ? 'border-rose-500/80 bg-rose-950/10'
                  : 'border-stone-800 hover:border-stone-700'
              }`}
            >
              {/* Top Label & Micro-Pumping Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-200">
                  {tank.label}
                </span>

                {isPumping ? (
                  <span className="flex items-center gap-1 text-[10px] text-amber-300 font-mono animate-pulse">
                    <Activity className="w-3 h-3 text-amber-400 animate-spin" />
                    PUMPING
                  </span>
                ) : isLow ? (
                  <span className="text-[10px] text-rose-400 font-mono flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> LOW
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-500 font-mono">READY</span>
                )}
              </div>

              {/* Physical Transparent Cylinder Tank with Liquid Level */}
              <div className="relative w-full h-36 bg-stone-900/90 rounded-lg overflow-hidden border border-stone-800/80 my-1 flex flex-col justify-end p-1 shadow-inner">
                {/* Measurement Hash Marks on Glass */}
                <div className="absolute inset-y-2 left-1.5 w-2 flex flex-col justify-between text-[8px] font-mono text-stone-600 pointer-events-none select-none z-20">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                {/* Animated Liquid Reservoir */}
                <div
                  className="w-full rounded-md transition-all duration-500 relative overflow-hidden shadow-md"
                  style={{
                    height: `${fillPercent}%`,
                    backgroundColor: tank.colorHex,
                    opacity: tank.id.includes('base') ? 0.75 : 0.95,
                  }}
                >
                  {/* Fluid Surface Wave Ripple */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 backdrop-blur-sm" />
                  {isPumping && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </div>

                {/* Glass Specular Glint */}
                <div className="absolute inset-y-0 right-1 w-1.5 bg-gradient-to-r from-transparent to-white/10 pointer-events-none rounded-r-md" />
              </div>

              {/* Tank Details & Volume Readout */}
              <div className="mt-2 space-y-0.5">
                <div className="text-xs font-semibold text-stone-100 truncate">{tank.name}</div>
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>{tank.currentVolumeMl} ml</span>
                  <span className={isLow ? 'text-rose-400 font-bold' : 'text-stone-500'}>
                    {fillPercent}%
                  </span>
                </div>
              </div>

              {/* Interactive Fill Tank Button */}
              <button
                onClick={() => onFillTank(tank.id, 25)}
                className={`mt-2.5 w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border ${
                  isLow
                    ? 'bg-rose-500 hover:bg-rose-400 text-stone-950 border-rose-400 shadow-sm'
                    : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-800 hover:border-amber-400/50'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Fill Tank (+25ml)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Fluidic Stepper Pump Specifications Bar */}
      <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Closed-Loop Micro-Peristaltic Delivery System · Sub-0.01ml Droplet Metering</span>
        </div>
        <div className="flex items-center gap-4 text-stone-500">
          <span>Tanks Sealed: Airtight N₂ Barrier</span>
          <span>Viscosity Calibrated: 1200 cP</span>
        </div>
      </div>
    </div>
  );
};
