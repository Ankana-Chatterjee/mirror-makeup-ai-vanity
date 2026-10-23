import React from 'react';
import { Droplet, Laptop, Sparkles, MonitorSmartphone, Box, ShieldCheck } from 'lucide-react';

export type AppExperienceMode = 'hardware-device' | 'software-tool';

interface HeaderTopBarProps {
  appMode: AppExperienceMode;
  onSelectAppMode: (mode: AppExperienceMode) => void;
  onScrollToDispensary?: () => void;
  onScrollToMirror?: () => void;
  onScrollToAssistant?: () => void;
  onScrollToDiagnosis?: () => void;
  onScrollToFeatures?: () => void;
  onScrollToCarousel?: () => void;
  onScrollToAudit?: () => void;
  onScrollToTanks?: () => void;
  onScrollToBrands?: () => void;
  onScrollToWeather?: () => void;
  onScrollToOutfit?: () => void;
  onScrollToMasterclass?: () => void;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  appMode,
  onSelectAppMode,
  onScrollToDispensary,
  onScrollToMirror,
  onScrollToAssistant,
  onScrollToDiagnosis,
  onScrollToFeatures,
  onScrollToCarousel,
  onScrollToAudit,
  onScrollToTanks,
  onScrollToBrands,
  onScrollToWeather,
  onScrollToOutfit,
  onScrollToMasterclass,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand title & mode badge */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            className="text-lg sm:text-xl font-serif tracking-wide text-stone-100 whitespace-nowrap hover:text-amber-300 transition-colors"
          >
            Mirror Makeup
          </a>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-900 border border-stone-800 text-stone-400">
            {appMode === 'hardware-device' ? '3D Hardware Appliance' : 'Cloud AI Software'}
          </span>
        </div>

        {/* Central Mode Switcher: 3D Hardware Mirror vs Software Tool (Phones/PCs) */}
        <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-stone-800 shadow-inner">
          <button
            onClick={() => onSelectAppMode('hardware-device')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              appMode === 'hardware-device'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="3D Electronic Smart Vanity Mirror with Physical Color Mixing Tanks"
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap font-medium">3D Mirror Device</span>
          </button>

          <button
            onClick={() => onSelectAppMode('software-tool')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              appMode === 'software-tool'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Phone & PC AI Assistant (Webcam AR stencils, blending audit & worldwide brand shade matcher)"
          >
            <MonitorSmartphone className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap font-medium">Phone & PC Software</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-stone-400">
          <button
            onClick={onScrollToMirror}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            {appMode === 'hardware-device' ? 'Mirror Glass' : 'Live Camera'}
          </button>

          <button
            onClick={onScrollToAssistant}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            AI Assistant
          </button>

          <button
            onClick={onScrollToCarousel}
            className="hover:text-stone-100 transition-colors whitespace-nowrap text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>Face Carousel</span>
          </button>

          <button
            onClick={onScrollToFeatures}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            Feature Extract
          </button>

          <button
            onClick={onScrollToAudit}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            Mistake Auditor
          </button>

          <button
            onClick={onScrollToWeather}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            Weather & Longevity
          </button>

          {appMode === 'hardware-device' ? (
            <button
              onClick={onScrollToTanks}
              className="hover:text-stone-100 transition-colors whitespace-nowrap text-amber-400/90"
            >
              Color Tanks
            </button>
          ) : (
            <button
              onClick={onScrollToBrands}
              className="hover:text-stone-100 transition-colors whitespace-nowrap text-amber-400/90 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Worldwide Shades</span>
            </button>
          )}

          <button
            onClick={onScrollToOutfit}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            Outfit Scan
          </button>

          <button
            onClick={onScrollToMasterclass}
            className="hover:text-stone-100 transition-colors whitespace-nowrap"
          >
            Global MUAs
          </button>
        </nav>

        {/* Zone 3: Primary Action based on active mode */}
        <div className="flex items-center gap-2 shrink-0">
          {appMode === 'hardware-device' ? (
            <button
              onClick={onScrollToDispensary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Droplet className="w-3.5 h-3.5 fill-stone-950" />
              <span>Dispense Tank</span>
            </button>
          ) : (
            <button
              onClick={onScrollToBrands}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
              <span>Match Global Shades</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
