import React, { useState } from 'react';
import { 
  CloudRain, Sun, Snowflake, Wind, ShieldCheck, Thermometer, MapPin, 
  Sparkles, CheckCircle2, AlertCircle, Droplets, RefreshCw
} from 'lucide-react';
import { WeatherCondition } from '../types/makeup';

interface WeatherAdaptationProps {
  currentWeather: WeatherCondition;
  onSelectWeather: (weather: WeatherCondition) => void;
}

interface WeatherModeDetail {
  id: WeatherCondition;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  temp: string;
  humidityLevel: 'High Humidity' | 'Moderate' | 'Low / Dry' | 'Extreme Dry';
  formulaTweak: string;
  primerRule: string;
  settingRule: string;
  eyelinerSealRule: string;
  lipLongevityRule: string;
  longevityHours: string;
  proMUAQuote: string;
}

const WEATHER_MODES: WeatherModeDetail[] = [
  {
    id: 'monsoon-humid',
    name: 'Monsoon & Tropical Humid',
    icon: CloudRain,
    temp: '31°C · 88% Humidity',
    humidityLevel: 'High Humidity',
    formulaTweak: 'Sebum-Absorbing Micro-Silica Base (+12% Matte Vehicle)',
    primerRule: 'Apply water-resistant silicone primer only on nose, chin, and center forehead. Avoid emollient oils.',
    settingRule: 'Velvet puff micro-baking on T-zone for 90 seconds. Dust off and seal with alcohol-free transfer-proof film mist.',
    eyelinerSealRule: 'Gel kohl tightlined into lash root, set with matte black powder shadow to stop humidity bleeding.',
    lipLongevityRule: 'Transfer-proof matte liquid lipstick (e.g. Swiss Beauty Craze / Huda Liquid Matte) over wax liner.',
    longevityHours: '16-Hour Sweat & Humidity Shield',
    proMUAQuote: 'In high humidity, layer thin sheets of product. Two micro-thin coats last 3x longer than one thick heavy layer.',
  },
  {
    id: 'hot-summer',
    name: 'Peak Summer Heat & Sun',
    icon: Sun,
    temp: '38°C · High UV Index',
    humidityLevel: 'High Humidity',
    formulaTweak: 'Ultra-Lightweight Fluid Tint + Water-Resistant Polymer',
    primerRule: 'Oil-free mattifying primer with SPF 50 chemical UV barrier that does not leave a white cast.',
    settingRule: 'Spot powdering with translucent mineral veil strictly on smile lines and nostril wings.',
    eyelinerSealRule: 'Waterproof felt-tip calligraphy pen; avoid wax pencils that melt above 35°C.',
    lipLongevityRule: 'Water-stain tint blotted with tissue, followed by a second pressed layer for meal-proof tint.',
    longevityHours: '14-Hour Heat-Resistant Wear',
    proMUAQuote: 'Keep oil blotting papers in your bag. Never powder over sweat; always blot the perspiration first!',
  },
  {
    id: 'dry-winter',
    name: 'Cold & Dry Winter',
    icon: Snowflake,
    temp: '12°C · 22% Low Humidity',
    humidityLevel: 'Low / Dry',
    formulaTweak: 'Hyaluronic & Squalane Rich Emollient Base (+18% Moisture)',
    primerRule: 'Ceramide-infused hydrating serum primer to lock in hydration and prevent dry flaking.',
    settingRule: 'Zero dry baking powder! Use only a feather dusting on the nose apex, then mist with glycerin facial spray.',
    eyelinerSealRule: 'Creamy waterproof pencil liner that glides without tugging cold, sensitive eyelid tissue.',
    lipLongevityRule: 'Peptide and shea butter cushion glaze (e.g. Rhode peptide tint) to prevent chapping.',
    longevityHours: '16-Hour Anti-Flake Hydration',
    proMUAQuote: 'In cold dry weather, switch from powder blush to cream or liquid blush. It melts seamlessly into the skin.',
  },
  {
    id: 'cold-dry',
    name: 'Sub-Zero Freezing Air',
    icon: Snowflake,
    temp: '2°C · 15% Freezing Humidity',
    humidityLevel: 'Extreme Dry',
    formulaTweak: 'Omega Fatty Acid Barrier Balm + Dewy Glaze',
    primerRule: 'Rich nourishing balm primer on cheek crests to prevent windburn and redness.',
    settingRule: 'Skip setting powder completely. Set with rich dew mist to keep complexion supple.',
    eyelinerSealRule: 'Waterproof tubing mascara that withstands cold-induced watery eyes.',
    lipLongevityRule: 'Intense lanolin/ceramide lip recovery mask with rosewood tint.',
    longevityHours: '18-Hour Windburn Protection',
    proMUAQuote: 'Tubing mascara is mandatory for cold wind—it comes off only with warm water, never with cold wind tears.',
  },
  {
    id: 'desert-arid',
    name: 'Desert & Arid Heat',
    icon: Wind,
    temp: '41°C · 10% Bone-Dry Heat',
    humidityLevel: 'Extreme Dry',
    formulaTweak: 'Barrier-Shield Fluid + Hydrating Micro-Pigments',
    primerRule: 'Moisture-binding hyaluronic primer under an oil-control barrier.',
    settingRule: 'Light dusting with silica micro-spheres that absorb sweat without drawing moisture from skin cells.',
    eyelinerSealRule: 'Extreme long-wear liquid eyeliner that will not dry out and crack in arid winds.',
    lipLongevityRule: 'Moisturizing velvet tint with botanical oils.',
    longevityHours: '14-Hour Arid Defense',
    proMUAQuote: 'Carry a thermal spring water mist to refresh pigment hydration every 4 hours.',
  },
  {
    id: 'moderate-spring',
    name: 'Mild & Temperate Climate',
    icon: Wind,
    temp: '22°C · 50% Ideal Humidity',
    humidityLevel: 'Moderate',
    formulaTweak: 'Balanced Satin Mineral Suspension',
    primerRule: 'Illuminating radiance primer across cheekbones and bridge of nose.',
    settingRule: 'Soft-focus translucent veil across the T-zone with fluffy powder brush.',
    eyelinerSealRule: 'Classic liquid or gel liner; holds perfectly in balanced humidity.',
    lipLongevityRule: 'Velvet matte or satin lipstick with lip liner perimeter definition.',
    longevityHours: '12-Hour Flawless Wear',
    proMUAQuote: 'The golden climate zone: you can wear any finish—dewy glass skin, velvet matte, or high glam.',
  },
];

export const WeatherAdaptation: React.FC<WeatherAdaptationProps> = ({
  currentWeather,
  onSelectWeather,
}) => {
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedLocationName, setDetectedLocationName] = useState<string | null>(null);

  const activeMode = WEATHER_MODES.find((m) => m.id === currentWeather) || WEATHER_MODES[0];

  // Auto-detect location & weather using browser geolocation + Open-Meteo
  const handleAutoDetectWeather = async () => {
    setDetectingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`
            );
            const data = await res.json();
            const temp = data?.current?.temperature_2m ?? 28;
            const humidity = data?.current?.relative_humidity_2m ?? 75;

            setDetectedLocationName(`Lat ${latitude.toFixed(1)}°, Lon ${longitude.toFixed(1)}° (${Math.round(temp)}°C, ${Math.round(humidity)}% Humid)`);

            // Adapt weather condition algorithmically
            if (humidity > 70 && temp > 25) {
              onSelectWeather('monsoon-humid');
            } else if (temp > 32) {
              onSelectWeather('hot-summer');
            } else if (temp < 10) {
              onSelectWeather('cold-dry');
            } else if (temp < 18 && humidity < 40) {
              onSelectWeather('dry-winter');
            } else {
              onSelectWeather('moderate-spring');
            }
          } catch (e) {
            console.warn('Weather API fetch fallback:', e);
            onSelectWeather('monsoon-humid');
            setDetectedLocationName('Tropical / Humid Climate Active');
          } finally {
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.warn('Geolocation denied or unavailable:', error);
          // Graceful fallback without breaking user flow
          onSelectWeather('monsoon-humid');
          setDetectedLocationName('Default High Humidity Active (Mumbai / Southeast Asia profile)');
          setDetectingLocation(false);
        },
        { timeout: 7000 }
      );
    } catch (err) {
      console.warn('Detection error:', err);
      onSelectWeather('monsoon-humid');
      setDetectingLocation(false);
    }
  };

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300">
              Location Weather & Climate Longevity Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-100 mt-1">
            Weather-Adaptive Makeup Longevity Formulation
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl mt-1">
            Adapts primer, foundation base, setting powders, and eyeliner sealants so your makeup stays 100% transfer-proof whether in extreme tropical humidity or freezing dry winter cold.
          </p>
        </div>

        {/* Auto-detect button */}
        <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
          <button
            onClick={handleAutoDetectWeather}
            disabled={detectingLocation}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {detectingLocation ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{detectingLocation ? 'Analyzing Local Climate...' : 'Auto-Detect My Location Weather'}</span>
          </button>
          {detectedLocationName && (
            <span className="text-[10px] text-stone-400 font-mono">
              📍 {detectedLocationName}
            </span>
          )}
        </div>
      </div>

      {/* Climate Mode Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {WEATHER_MODES.map((mode) => {
          const isSelected = mode.id === currentWeather;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectWeather(mode.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-950 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400/40'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-stone-900 text-stone-500'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-mono opacity-80">{mode.temp.split('·')[0]}</span>
              </div>
              <div className="text-xs font-medium text-stone-200 truncate">{mode.name.split('&')[0]}</div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5 truncate">{mode.humidityLevel}</div>
            </button>
          );
        })}
      </div>

      {/* Active Weather Deep Formulation Advisory */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4 shadow-inner">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-300 font-semibold">
              Current Climate Profile: {activeMode.name}
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs font-mono text-amber-300">{activeMode.temp}</span>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            {activeMode.longevityHours}
          </span>
        </div>

        {/* 4-Pillar Longevity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Primer Pillar */}
          <div className="p-3 rounded-lg bg-stone-900 border border-stone-800/80 space-y-1">
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
              1. Base & Primer Longevity
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {activeMode.primerRule}
            </p>
          </div>

          {/* Setting & Powder Pillar */}
          <div className="p-3 rounded-lg bg-stone-900 border border-stone-800/80 space-y-1">
            <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
              2. Setting & Anti-Cake Powder
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {activeMode.settingRule}
            </p>
          </div>

          {/* Eyeliner & Waterline Pillar */}
          <div className="p-3 rounded-lg bg-stone-900 border border-stone-800/80 space-y-1">
            <div className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
              3. Waterproof Eyeliner Sealing
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {activeMode.eyelinerSealRule}
            </p>
          </div>

          {/* Lip Longevity Pillar */}
          <div className="p-3 rounded-lg bg-stone-900 border border-stone-800/80 space-y-1">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
              4. Transfer-Proof Lip Formula
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {activeMode.lipLongevityRule}
            </p>
          </div>
        </div>

        {/* Master MUA Formulation Quote */}
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 font-medium">Climate Masterclass Secret: </strong>
            <span>{activeMode.proMUAQuote}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
