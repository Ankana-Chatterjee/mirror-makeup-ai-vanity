import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Search, Plus, Filter, Check, ExternalLink, 
  HelpCircle, Globe2, Tag, ShieldCheck, Heart, ArrowUpRight
} from 'lucide-react';
import { FaceDiagnostics, MakeupLook, SkinUndertone } from '../types/makeup';
import { 
  GlobalBrandProduct, 
  BrandCategory, 
  BrandRegion, 
  INITIAL_GLOBAL_BRANDS, 
  findMatchingGlobalProducts, 
  calculateCustomBrandShadeMatch,
  getCoreBrandMatches
} from '../data/globalBrands';

interface GlobalBrandMatcherProps {
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  onTryShadeOnMirror?: (hex: string) => void;
}

export const GlobalBrandMatcher: React.FC<GlobalBrandMatcherProps> = ({
  diagnostics,
  currentLook,
  onTryShadeOnMirror,
}) => {
  const [productsList, setProductsList] = useState<GlobalBrandProduct[]>(INITIAL_GLOBAL_BRANDS);
  const [selectedCategory, setSelectedCategory] = useState<BrandCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<BrandRegion | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Brand Modal / Drawer State
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');
  const [customProductLine, setCustomProductLine] = useState('');
  const [customCategory, setCustomCategory] = useState<BrandCategory>('foundation');
  const [isCalculatingCustom, setIsCalculatingCustom] = useState(false);
  const [customMatchResult, setCustomMatchResult] = useState<GlobalBrandProduct | null>(null);

  // Filtered and matched items
  const coreMatches = useMemo(() => {
    return getCoreBrandMatches(
      diagnostics.monkScale,
      diagnostics.skinUndertone,
      diagnostics.darkCircleHue
    );
  }, [diagnostics.monkScale, diagnostics.skinUndertone, diagnostics.darkCircleHue]);

  const matchedProducts = useMemo(() => {
    return findMatchingGlobalProducts(
      productsList,
      diagnostics.monkScale,
      diagnostics.skinUndertone,
      selectedCategory,
      selectedRegion,
      searchQuery
    );
  }, [productsList, diagnostics.monkScale, diagnostics.skinUndertone, selectedCategory, selectedRegion, searchQuery]);

  // Handle adding custom brand and asking AI for shade match
  const handleCalculateCustomBrandMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrandName.trim()) return;

    setIsCalculatingCustom(true);
    setTimeout(() => {
      const generated = calculateCustomBrandShadeMatch(
        customBrandName.trim(),
        customCategory,
        customProductLine.trim(),
        diagnostics.monkScale,
        diagnostics.skinUndertone,
        diagnostics.skinHex
      );

      setCustomMatchResult(generated);
      setProductsList((prev) => [generated, ...prev]);
      setIsCalculatingCustom(false);
    }, 700);
  };

  const handleCopyShade = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const categories: { id: BrandCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'foundation', label: 'Foundation' },
    { id: 'concealer', label: 'Concealer' },
    { id: 'lipstick', label: 'Lipstick' },
    { id: 'blush', label: 'Blush' },
    { id: 'contour', label: 'Contour & Powder' },
  ];

  const regions: { id: BrandRegion | 'all'; label: string }[] = [
    { id: 'all', label: 'All Brands Worldwide' },
    { id: 'India', label: '🇮🇳 Indian Favorites' },
    { id: 'Drugstore & Mass', label: '🌟 Viral Drugstore' },
    { id: 'Celebrity & Viral', label: '✨ Celebrity & It-Brands' },
    { id: 'Global Luxury', label: '💎 Global Luxury & Pro' },
    { id: 'K-Beauty', label: '🌸 K-Beauty Glass Skin' },
  ];

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
      {/* Top Banner / Software Mode Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase tracking-wider border border-amber-500/30">
              SOFTWARE MODE · PHONES & PCS
            </span>
            <span className="text-stone-400 text-xs">· Zero Physical Tanks Needed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-stone-100 mt-1">
            Global Worldwide Shade Matcher
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Your face and undertone are scanned in real-time. Instead of dispensing raw pigments, 
            the AI cross-references your exact CIELAB skin spectrum across verified worldwide formulas—from affordable 
            Indian staples (<strong className="text-stone-300">Blue Heaven, Swiss Beauty, Mars, Hilary Rhoda, RENÉE</strong>) 
            to viral drugstore (<strong className="text-stone-300">e.l.f.</strong>), celebrity icons (<strong className="text-stone-300">Rhode, Kylie Cosmetics</strong>), 
            and global luxury (<strong className="text-stone-300">MAC, NARS, Charlotte Tilbury</strong>).
          </p>
        </div>

        {/* User Detected Profile Pill & Add Brand CTA */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <div 
              className="w-5 h-5 rounded-full border border-stone-700 shadow-inner shrink-0" 
              style={{ backgroundColor: diagnostics.skinHex }} 
            />
            <div className="text-left text-xs">
              <div className="text-stone-400 text-[10px] font-mono">YOUR MATCH TARGET</div>
              <div className="font-medium text-stone-200">
                Monk {diagnostics.monkScale} · {diagnostics.skinUndertone}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAddBrandOpen(true);
              setCustomMatchResult(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Add Brand & Match Shade</span>
          </button>
        </div>
      </div>

      {/* CORE BRAND SHADE & COLOR CORRECTION MATRIX (Swiss Beauty, Huda Beauty, MAC, Mars, Hilary Rhoda, TIRTIR) */}
      <div className="my-6 p-5 rounded-2xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-serif text-stone-100">
              Core Brand Shade Matrix & Color Correctors
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-300">
            Exact Matches for Monk Scale {diagnostics.monkScale} ({diagnostics.skinUndertone})
          </span>
        </div>

        {/* 6 Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {coreMatches.brands.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-amber-500/40 transition-all space-y-3 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-100 text-sm tracking-wide">
                    {item.brand}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                    {item.badge.split(' ')[0]} Verified
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                  {item.badge}
                </div>

                {/* Foundation Shade */}
                <div className="mt-3 p-2.5 rounded-lg bg-stone-900/80 border border-stone-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase">Foundation Match</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{ backgroundColor: item.foundation.hex }}
                        className="w-3 h-3 rounded-full border border-stone-700 shadow-sm"
                      />
                      <span className="font-mono text-[10px] text-stone-300 font-semibold">{item.foundation.shadeCode}</span>
                    </div>
                  </div>
                  <div className="text-stone-200 text-[11px] font-medium">{item.foundation.shadeName}</div>
                  <div className="text-[10px] text-stone-400 truncate">{item.foundation.formula}</div>
                </div>

                {/* Concealer Shade */}
                <div className="mt-2 p-2.5 rounded-lg bg-stone-900/80 border border-stone-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Concealer Match</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{ backgroundColor: item.concealer.hex }}
                        className="w-3 h-3 rounded-full border border-stone-700 shadow-sm"
                      />
                      <span className="font-mono text-[10px] text-stone-300 font-semibold">{item.concealer.shadeCode}</span>
                    </div>
                  </div>
                  <div className="text-stone-200 text-[11px] font-medium">{item.concealer.shadeName}</div>
                  <div className="text-[10px] text-stone-400">{item.concealer.technique}</div>
                </div>

                {/* Color Corrector Recommendation */}
                <div className="mt-2 p-2.5 rounded-lg bg-orange-950/20 border border-orange-500/20 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-orange-400 uppercase">Color Corrector</span>
                    <span
                      style={{ backgroundColor: item.colorCorrector.hex }}
                      className="w-3 h-3 rounded-full border border-stone-700 shadow-sm"
                    />
                  </div>
                  <div className="text-stone-200 text-[11px] font-medium">{item.colorCorrector.shadeName}</div>
                  <div className="text-[10px] text-stone-400">{item.colorCorrector.why}</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-800/80">
                <button
                  onClick={() => handleCopyShade(`core-${idx}`, `${item.brand} Foundation: ${item.foundation.shadeCode} | Concealer: ${item.concealer.shadeCode}`)}
                  className="flex-1 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-[11px] font-mono border border-stone-800 transition-colors"
                >
                  {copiedId === `core-${idx}` ? 'Copied!' : 'Copy Shades'}
                </button>
                {onTryShadeOnMirror && (
                  <button
                    onClick={() => onTryShadeOnMirror(item.foundation.hex)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-medium border border-amber-500/30 transition-colors"
                  >
                    Try on Mirror
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="py-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand (e.g. Blue Heaven, Mars, Rhode, Kylie, Swiss Beauty, elf)..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region / Brand Tier Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === reg.id
                    ? 'bg-stone-100 text-stone-950 shadow-sm'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-stone-600 text-xs ml-auto hidden md:inline">
            Showing {matchedProducts.length} verified shade matches
          </span>
        </div>
      </div>

      {/* Matched Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {matchedProducts.map((prod) => (
          <div
            key={prod.id}
            className="group relative bg-stone-950/70 hover:bg-stone-950 border border-stone-800 hover:border-amber-500/40 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between"
          >
            {/* Header: Brand, Region & Category */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold tracking-wide text-amber-400 group-hover:text-amber-300">
                  {prod.brandName}
                </span>
                <div className="flex items-center gap-1.5">
                  {prod.isCustomAdded && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      AI GENERATED
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 capitalize">
                    {prod.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {prod.priceEstimate}
                  </span>
                </div>
              </div>

              {/* Product Name */}
              <h3 className="text-sm font-semibold text-stone-100 group-hover:text-amber-100 line-clamp-1">
                {prod.productName}
              </h3>

              {/* Exact Matched Shade Highlight Card */}
              <div className="my-3 p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full border border-stone-700 shadow-md shrink-0 ring-2 ring-stone-800"
                    style={{ backgroundColor: prod.shadeHex }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                      RECOMMENDED SHADE
                    </div>
                    <div className="text-xs font-bold text-stone-100 truncate">
                      {prod.shadeCode} {prod.shadeName && `· ${prod.shadeName}`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyShade(prod.id, `${prod.brandName} ${prod.productName} - Shade ${prod.shadeCode}`)}
                  title="Copy shade to clipboard"
                  className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-mono transition-colors shrink-0"
                >
                  {copiedId === prod.id ? (
                    <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>

              {/* Why This Matches Scan */}
              <div className="text-xs text-stone-400 space-y-1 mb-3">
                <p className="line-clamp-2 text-stone-300 text-[11px] leading-relaxed">
                  <span className="text-amber-400/90 font-medium">Why it matches: </span>
                  {prod.whyMatch}
                </p>
                <div className="text-[10px] text-stone-500 flex items-center gap-2">
                  <span>Finish: <strong className="text-stone-400">{prod.finish}</strong></span>
                  <span>·</span>
                  <span>Undertones: <strong className="text-stone-400">{prod.undertoneCompatibility.join(', ')}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions: Try on Live Mirror / Preview */}
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] text-stone-500 font-mono truncate">
                {prod.keyBenefit}
              </span>

              {onTryShadeOnMirror && (prod.category === 'lipstick' || prod.category === 'foundation' || prod.category === 'blush') && (
                <button
                  onClick={() => onTryShadeOnMirror(prod.shadeHex)}
                  className="px-2.5 py-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Try on Mirror</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {matchedProducts.length === 0 && (
        <div className="p-8 text-center bg-stone-950/40 rounded-xl border border-dashed border-stone-800 my-4">
          <Globe2 className="w-8 h-8 text-stone-600 mx-auto mb-2" />
          <h4 className="text-sm font-medium text-stone-300">No matching products found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, or click "+ Add Brand & Match Shade" to let AI calculate the exact shade in any brand!
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedRegion('all');
              setSearchQuery('');
            }}
            className="mt-3 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* MODAL: ADD CUSTOM BRAND & ASK AI FOR SHADE MATCH */}
      {isAddBrandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-display font-medium text-stone-100">
                  Ask AI Shade Match For Any Brand
                </h3>
              </div>
              <button
                onClick={() => setIsAddBrandOpen(false)}
                className="text-stone-400 hover:text-stone-200 text-sm font-mono p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400 my-3">
              Missing a favorite brand? Enter any brand from anywhere in the world (e.g. <em className="text-amber-200">Colorbar, Mamaearth, Chanel, Bobbi Brown, Too Faced, Kiro, Plum, Flower Knows</em>). 
              The AI will compute your exact matching shade code and undertone matrix based on your scanned skin!
            </p>

            <form onSubmit={handleCalculateCustomBrandMatch} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Brand Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Colorbar, Bobbi Brown, Mamaearth, Chanel"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Product Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as BrandCategory)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="foundation">Foundation</option>
                    <option value="concealer">Concealer</option>
                    <option value="lipstick">Lipstick</option>
                    <option value="blush">Blush</option>
                    <option value="contour">Contour & Bronzer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Specific Product Line (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24H Weightless Matte"
                    value={customProductLine}
                    onChange={(e) => setCustomProductLine(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Scanned Skin Context */}
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-stone-700"
                    style={{ backgroundColor: diagnostics.skinHex }}
                  />
                  <span className="text-stone-400">Target Tone:</span>
                  <span className="font-medium text-stone-200">
                    Monk {diagnostics.monkScale} · {diagnostics.skinUndertone}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">CIELAB Calibrated</span>
              </div>

              {/* Result Preview if Generated */}
              {customMatchResult && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      ✓ AI Matched Shade for {customMatchResult.brandName}:
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">{customMatchResult.finish}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-stone-700 shrink-0"
                      style={{ backgroundColor: customMatchResult.shadeHex }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-stone-100">
                        {customMatchResult.shadeCode} - {customMatchResult.shadeName}
                      </div>
                      <div className="text-[11px] text-stone-300">{customMatchResult.whyMatch}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddBrandOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors"
                >
                  {customMatchResult ? 'Done' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCalculatingCustom || !customBrandName.trim()}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isCalculatingCustom ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Calculating Match...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                      <span>{customMatchResult ? 'Re-calculate' : 'Ask AI Shade Match'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
