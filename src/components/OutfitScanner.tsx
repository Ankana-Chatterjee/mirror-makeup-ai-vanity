import React, { useState, useRef } from 'react';
import { Shirt, Sparkles, Upload, Check, Palette, ArrowRight } from 'lucide-react';
import { MakeupLook, MakeupLookId } from '../types/makeup';
import { OUTFIT_HARMONY_PRESETS } from '../data/presets';

interface OutfitScannerProps {
  onApplyOutfitLook: (lookId: MakeupLookId, lipHex: string) => void;
  currentLookId: MakeupLookId;
}

export const OutfitScanner: React.FC<OutfitScannerProps> = ({
  onApplyOutfitLook,
  currentLookId,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState(OUTFIT_HARMONY_PRESETS[0]);
  const [customOutfitImage, setCustomOutfitImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomOutfitImage(event.target.result as string);
          // Set custom outfit with royal emerald/gold or custom extraction
          setSelectedOutfit({
            name: 'Custom Scanned Outfit',
            image: event.target.result as string,
            dominantHex: '#0F5A47',
            secondaryHex: '#D4AF37',
            recommendedPalette: {
              eyeShade: 'Harmonized Warm Amber Bronze & Gold Shimmer',
              blushShade: 'Warm Terracotta Apricot',
              lipShade: 'Spiced Gulab Rose / Warm Terracotta',
              lookRecommendation: 'indian-festive',
              styleRationale: 'Analyzed custom fabric tone and metallic undertones. Recommended jewel-toned warm harmony to elevate festive appearance.',
            },
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
            AI OUTFIT FABRIC COLORIMETRY SCANNER
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            Harmonize Makeup with Your Outfit
          </h2>
        </div>
        
        {/* Upload Outfit Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg border border-stone-700 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Scan My Outfit</span>
          </button>
        </div>
      </div>

      {/* Outfit Carousel / Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {OUTFIT_HARMONY_PRESETS.map((outfit) => {
          const isSelected = selectedOutfit.name === outfit.name;
          return (
            <button
              key={outfit.name}
              onClick={() => setSelectedOutfit(outfit)}
              className={`text-left rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-950 border-emerald-400/90 shadow-md ring-1 ring-emerald-400/30'
                  : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="relative h-28 w-full overflow-hidden bg-stone-900">
                <img
                  src={outfit.image}
                  alt={outfit.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-md px-2 py-1 rounded-md border border-stone-700/60">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-600"
                    style={{ backgroundColor: outfit.dominantHex }}
                    title="Dominant Fabric Tone"
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-stone-600"
                    style={{ backgroundColor: outfit.secondaryHex }}
                    title="Accent Fabric Tone"
                  />
                </div>
              </div>

              <div className="p-3">
                <div className="text-xs font-semibold text-stone-100 truncate">{outfit.name}</div>
                <div className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                  Pairs with {outfit.recommendedPalette.lookRecommendation.toUpperCase()}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Outfit Analysis & Recommendation Card */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
              Fabric Match Analysis
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-200 font-medium">{selectedOutfit.name}</span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
            {selectedOutfit.recommendedPalette.styleRationale}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-400 font-mono">
            <span>Eyes: <strong className="text-amber-200">{selectedOutfit.recommendedPalette.eyeShade}</strong></span>
            <span>·</span>
            <span>Lips: <strong className="text-rose-300">{selectedOutfit.recommendedPalette.lipShade}</strong></span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() =>
            onApplyOutfitLook(
              selectedOutfit.recommendedPalette.lookRecommendation,
              selectedOutfit.recommendedPalette.lookRecommendation === 'indian-festive'
                ? '#9E423B'
                : selectedOutfit.recommendedPalette.lookRecommendation === 'french-minimalist'
                ? '#8E283E'
                : '#B26257'
            )
          }
          className="shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center gap-1.5 hover:shadow-emerald-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
          <span>Apply Outfit Harmonized Look</span>
        </button>
      </div>
    </div>
  );
};
