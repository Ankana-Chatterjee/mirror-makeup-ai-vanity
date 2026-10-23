import React, { useState } from 'react';
import { X, Search, Filter, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { INITIAL_GLOBAL_BRANDS, GlobalBrandProduct, BrandCategory, BrandRegion } from '../data/globalBrands';

interface ProductCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBrandFilter?: string;
}

export const ProductCatalogueModal: React.FC<ProductCatalogueModalProps> = ({
  isOpen,
  onClose,
  selectedBrandFilter = 'any',
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedBrandFilter !== 'any' ? selectedBrandFilter : '');
  const [selectedCategory, setSelectedCategory] = useState<BrandCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<BrandRegion | 'all'>('all');

  if (!isOpen) return null;

  const filteredProducts = INITIAL_GLOBAL_BRANDS.filter((prod) => {
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    if (selectedRegion !== 'all' && prod.region !== selectedRegion) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const match =
        prod.brandName.toLowerCase().includes(q) ||
        prod.productName.toLowerCase().includes(q) ||
        prod.shadeName.toLowerCase().includes(q) ||
        prod.shadeCode.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div 
        className="w-full max-w-4xl bg-white border border-[#eadde1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Verified Brand Product Catalogue"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eadde1] flex items-center justify-between bg-[#fffaf7]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c45b78]" />
              <h3 className="font-bold text-base text-[#29202a]">Verified Brand Product Catalogue</h3>
              <span className="text-xs bg-[#f8e7ec] text-[#c45b78] px-2 py-0.5 rounded-full font-bold">
                {filteredProducts.length} verified items
              </span>
            </div>
            <p className="text-xs text-[#766b77] mt-0.5">
              Curated shade formulations with known undertones, finishes, and verified daylight wear characteristics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#766b77] hover:bg-[#f8e7ec] hover:text-[#c45b78] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-[#fffdfc] border-b border-[#eadde1] space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#766b77] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand (MAC, Huda, Swiss Beauty, Mars, TIRTIR), shade name, or product..."
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#eadde1] rounded-xl text-xs text-[#29202a] placeholder-[#766b77] outline-none focus:border-[#c45b78]"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#766b77] hover:text-[#c45b78] px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category tabs */}
            <span className="text-[11px] font-bold text-[#766b77] uppercase tracking-wider">Category:</span>
            {(['all', 'foundation', 'concealer', 'color-corrector', 'lipstick', 'blush', 'powder'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#c45b78] text-white'
                    : 'bg-[#f7f0f2] text-[#665965] hover:bg-[#f3e1e6]'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-xl border border-[#eadde1] bg-[#fffdfc] hover:border-[#c45b78] transition flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c45b78] bg-[#f8e7ec] px-2 py-0.5 rounded-md">
                      {prod.brandName}
                    </span>
                    <h4 className="font-bold text-sm text-[#29202a] mt-1.5 leading-snug">
                      {prod.productName}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-[#766b77] bg-white border border-[#eadde1] px-2 py-1 rounded-lg shrink-0">
                    {prod.priceEstimate}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mt-3">
                  <div
                    className="w-5 h-5 rounded-full border border-black/15 shadow-inner shrink-0"
                    style={{ backgroundColor: prod.shadeHex }}
                    title={`Hex: ${prod.shadeHex}`}
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#29202a]">{prod.shadeCode}</span>
                    <span className="text-[#766b77] ml-1.5">({prod.shadeName})</span>
                  </div>
                </div>

                <p className="text-xs text-[#665965] mt-2.5 leading-relaxed">
                  {prod.keyBenefit}
                </p>
              </div>

              <div className="pt-2 border-t border-[#f4ebeb] text-[11px] text-[#766b77] space-y-1">
                <div className="flex items-center justify-between">
                  <span><strong>Finish:</strong> {prod.finish}</span>
                  <span className="text-[10px] bg-[#f7f0f2] px-2 py-0.5 rounded-md">{prod.region}</span>
                </div>
                <p className="text-[#8b3b55] bg-[#fff5f7] p-2 rounded-lg text-[11px]">
                  <strong>Match rationale:</strong> {prod.whyMatch}
                </p>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-2 text-center py-12 text-[#766b77] text-xs">
              No products found matching "{searchQuery}". Try searching for MAC, Huda Beauty, Swiss Beauty, or TIRTIR.
            </div>
          )}
        </div>

        {/* Daylight Testing Rationale Banner */}
        <div className="px-6 py-3 bg-[#fbf5f7] border-t border-[#eadde1] text-[11px] text-[#766b77] flex items-center justify-between">
          <span>💡 <strong>Daylight Testing Rule:</strong> Swatch 2–3 nearby shades vertically from jaw to neck; wait 10 min for oxidation before deciding.</span>
          <button
            onClick={onClose}
            className="bg-[#c45b78] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#a84664] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
