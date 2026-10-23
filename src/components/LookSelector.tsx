import React from 'react';
import { Sparkles, Check, Heart, Palette } from 'lucide-react';
import { MakeupLook, MakeupLookId, LipFinish } from '../types/makeup';

interface LookSelectorProps {
  looks: MakeupLook[];
  selectedLookId: MakeupLookId;
  onSelectLook: (look: MakeupLook) => void;
  activeLipHex: string;
  onSelectLipHex: (hex: string) => void;
  activeLipFinish: LipFinish;
  onSelectLipFinish: (finish: LipFinish) => void;
}

const LIP_SWATCH_PRESETS = [
  { name: 'Spiced Cocoa', hex: '#994836' },
  { name: 'Popsicle Rose', hex: '#C53050' },
  { name: 'Glazed Rosewood', hex: '#B26257' },
  { name: 'Velvet Crimson', hex: '#A81C28' },
  { name: 'Warm Terracotta', hex: '#B8683D' },
  { name: 'Deep Plum Wine', hex: '#6D2B3D' },
  { name: 'Soft Peach Nude', hex: '#C97D6B' },
];

export const LookSelector: React.FC<LookSelectorProps> = ({
  looks,
  selectedLookId,
  onSelectLook,
  activeLipHex,
  onSelectLipHex,
  activeLipFinish,
  onSelectLipFinish,
}) => {
  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
            STYLE TRANSFORMATION ENGINE
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            Select Makeup Aesthetic
          </h2>
        </div>
        <div className="text-xs text-stone-400">
          Adapts AR stencils & lipstick formulation in real time
        </div>
      </div>

      {/* Look Cards Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {looks.map((look) => {
          const isSelected = look.id === selectedLookId;
          return (
            <button
              key={look.id}
              onClick={() => onSelectLook(look)}
              className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-950 border-amber-400/90 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-stone-950/60 border-stone-800/90 hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-900 text-stone-400'
                  }`}>
                    {look.id === 'mexican-glam' ? 'LATINA' : look.id === 'k-beauty' ? 'K-BEAUTY' : look.id.toUpperCase()}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>

                <div className="text-xs font-semibold text-stone-100">{look.name}</div>
                <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-2 leading-tight">
                  {look.tagline}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-stone-700 shadow-sm"
                    style={{ backgroundColor: look.lipColorHex }}
                  />
                  <span className="text-[10px] text-stone-300 truncate max-w-[85px]">
                    {look.lipShadeName}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 capitalize">
                  {look.lipFinish.replace('-gradient', '')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time Lipstick Try-On (VTO) Fine-Tuning Bar */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-rose-400" />
            <span>AI Real-Time Lipstick Shade Try-On (VTO)</span>
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            Test any pigment finish in the reflection before dispensing into Well C
          </div>
        </div>

        {/* Finish Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Finish:</span>
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => onSelectLipFinish('matte')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeLipFinish === 'matte'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Matte
            </button>
            <button
              onClick={() => onSelectLipFinish('gloss')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeLipFinish === 'gloss'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Glaze Gloss
            </button>
            <button
              onClick={() => onSelectLipFinish('velvet-gradient')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeLipFinish === 'velvet-gradient'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Popsicle Gradient
            </button>
          </div>
        </div>

        {/* Shade Swatches */}
        <div className="flex items-center gap-1.5">
          {LIP_SWATCH_PRESETS.map((swatch) => (
            <button
              key={swatch.name}
              onClick={() => onSelectLipHex(swatch.hex)}
              title={swatch.name}
              className={`relative w-6 h-6 rounded-full border transition-all ${
                activeLipHex.toLowerCase() === swatch.hex.toLowerCase()
                  ? 'ring-2 ring-white scale-110 border-white'
                  : 'border-stone-700 hover:scale-105'
              }`}
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
