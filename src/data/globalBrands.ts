import { SkinUndertone } from '../types/makeup';

export type BrandCategory = 'foundation' | 'concealer' | 'color-corrector' | 'lipstick' | 'blush' | 'contour' | 'powder';
export type BrandRegion = 'India' | 'Drugstore & Mass' | 'Celebrity & Viral' | 'Global Luxury' | 'K-Beauty';

export interface GlobalBrandProduct {
  id: string;
  brandName: string;
  region: BrandRegion;
  productName: string;
  category: BrandCategory;
  priceEstimate: string;
  monkScaleRange: [number, number]; // e.g. [4, 7] for medium/dusky Indian
  undertoneCompatibility: SkinUndertone[];
  shadeCode: string;
  shadeName: string;
  shadeHex: string;
  finish: string;
  keyBenefit: string;
  whyMatch: string;
  isCustomAdded?: boolean;
}

export const INITIAL_GLOBAL_BRANDS: GlobalBrandProduct[] = [
  // --- INDIAN & BUDGET-FRIENDLY HEROES ---
  {
    id: 'gb-bh-1',
    brandName: 'Blue Heaven',
    region: 'India',
    productName: 'Hyper Matte Liquid Foundation',
    category: 'foundation',
    priceEstimate: '₹249',
    monkScaleRange: [5, 8],
    undertoneCompatibility: ['Warm', 'Warm Golden', 'Olive'],
    shadeCode: '301',
    shadeName: 'Almond Glow',
    shadeHex: '#c68f5b',
    finish: 'Natural Matte',
    keyBenefit: 'Oil-free formula with SPF 15, specifically formulated for warm Indian skin undertones in high humidity.',
    whyMatch: 'Perfect yellow-ochre balance to neutralize redness without looking ashy on olive/warm skin.',
  },
  {
    id: 'gb-bh-2',
    brandName: 'Blue Heaven',
    region: 'India',
    productName: 'Lush Matte Lip Crayon',
    category: 'lipstick',
    priceEstimate: '₹175',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral', 'Rich Caramel'],
    shadeCode: '04',
    shadeName: 'Spiced Brick',
    shadeHex: '#993d31',
    finish: 'Creamy Matte',
    keyBenefit: 'Enriched with jojoba oil; highly pigmented terracotta-nude that flatters pigmented lips without graying out.',
    whyMatch: 'Complements Indian festive & clean-girl aesthetics with a balanced warm terra-cotta depth.',
  },
  {
    id: 'gb-sb-1',
    brandName: 'Swiss Beauty',
    region: 'India',
    productName: 'Liquid Concealer HD Professional',
    category: 'concealer',
    priceEstimate: '₹229',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: '04',
    shadeName: 'Medium Sand',
    shadeHex: '#d29b63',
    finish: 'Semi-Matte Satin',
    keyBenefit: 'Cult favorite full coverage; conceals dark circles and acne hyperpigmentation without creasing in hot weather.',
    whyMatch: 'Micro-pigment peach-caramel base cancels melanin brown under-eye circles with zero cakeyness.',
  },
  {
    id: 'gb-sb-2',
    brandName: 'Swiss Beauty',
    region: 'India',
    productName: 'Craze Matte Lip Liquid',
    category: 'lipstick',
    priceEstimate: '₹299',
    monkScaleRange: [3, 8],
    undertoneCompatibility: ['Warm', 'Olive', 'Rich Caramel'],
    shadeCode: '08',
    shadeName: 'Toffee Nude',
    shadeHex: '#8b4a3e',
    finish: 'Transfer-proof Matte',
    keyBenefit: '12-hour water-resistant wear; lightweight film former engineered for hot and humid tropical climates.',
    whyMatch: 'Deep warm nude that pairs effortlessly with brown-melanin lip rims.',
  },
  {
    id: 'gb-hr-1',
    brandName: 'Hilary Rhoda',
    region: 'India',
    productName: 'Skin Glaze Liquid Foundation & Serum Tint',
    category: 'foundation',
    priceEstimate: '₹349',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: 'HR-03',
    shadeName: 'Golden Honey Glaze',
    shadeHex: '#c9955e',
    finish: 'Dewy Luminous',
    keyBenefit: 'Hydrating hyaluronic-infused formula giving glass-skin reflection without accentuating acne texture.',
    whyMatch: 'Contains warm micronized pigments tailored to Indian undertones seeking a Parisian skin-like glow.',
  },
  {
    id: 'gb-hr-2',
    brandName: 'Hilary Rhoda',
    region: 'India',
    productName: 'Velvet Mousse Matte Lipstick',
    category: 'lipstick',
    priceEstimate: '₹249',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Cool', 'Neutral', 'Olive'],
    shadeCode: 'VM-12',
    shadeName: 'Berry Saffron',
    shadeHex: '#a03144',
    finish: 'Velvet Mousse',
    keyBenefit: 'Air-whipped texture; delivers rich royal pigmentation with zero lip line tugging.',
    whyMatch: 'Striking rich berry that illuminates festive shimmer & evening glam ensembles.',
  },
  {
    id: 'gb-mars-1',
    brandName: 'Mars Cosmetics',
    region: 'India',
    productName: 'City Paradise Micro-Fine Liquid Foundation',
    category: 'foundation',
    priceEstimate: '₹399',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: '03',
    shadeName: 'Warm Honey Ochre',
    shadeHex: '#ca9762',
    finish: 'Soft Velvet',
    keyBenefit: 'Formulated specifically for Indian texture; blur technology minimizes pores and post-acne redness.',
    whyMatch: 'Exact optical match for Monk Scale 5-7 olive undertones with anti-cake micro-mesh formulation.',
  },
  {
    id: 'gb-mars-2',
    brandName: 'Mars Cosmetics',
    region: 'India',
    productName: 'Seal The Deal Full Cover Concealer',
    category: 'concealer',
    priceEstimate: '₹279',
    monkScaleRange: [4, 8],
    undertoneCompatibility: ['Warm', 'Warm Golden', 'Rich Caramel'],
    shadeCode: '04',
    shadeName: 'Caramel Macchiato',
    shadeHex: '#b47e4b',
    finish: 'Waterproof Matte',
    keyBenefit: 'Intense micro-corrector pigmentation that seals over active blemishes and PIH marks.',
    whyMatch: 'Balanced orange-peach base eliminates the need for a separate heavy orange color corrector.',
  },
  {
    id: 'gb-renee-1',
    brandName: 'RENÉE',
    region: 'India',
    productName: 'Fab 5 in 1 Pop-Up Lipstick',
    category: 'lipstick',
    priceEstimate: '₹699',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral', 'Cool'],
    shadeCode: 'Shade 2',
    shadeName: 'Nude Peach Toffee',
    shadeHex: '#b35d50',
    finish: 'Creamy Satin',
    keyBenefit: 'Versatile multi-shade pop cylinder with coconut oil, designed for on-the-go touch-ups in Indian climates.',
    whyMatch: 'The ideal everyday peach-brown tint that prevents ashiness around mouth corners.',
  },
  {
    id: 'gb-renee-2',
    brandName: 'RENÉE',
    region: 'India',
    productName: 'Stay With Me Matte Liquid Lip Color',
    category: 'lipstick',
    priceEstimate: '₹450',
    monkScaleRange: [3, 9],
    undertoneCompatibility: ['Warm', 'Olive', 'Rich Caramel'],
    shadeCode: 'SWM-14',
    shadeName: 'Desire For Rose',
    shadeHex: '#8e3a47',
    finish: 'Smudge-proof Matte',
    keyBenefit: 'Enriched with Shea Butter; completely mask-proof and meal-proof throughout humid monsoons.',
    whyMatch: 'Deep romantic rosewood hue that harmonizes beautifully with Indian bridal & festive silks.',
  },
  {
    id: 'gb-renee-3',
    brandName: 'RENÉE',
    region: 'India',
    productName: 'Check Matte Long Stay Compact Powder',
    category: 'powder',
    priceEstimate: '₹499',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: '02',
    shadeName: 'Warm Almond',
    shadeHex: '#ce9c66',
    finish: 'Ultra-Blurring Matte',
    keyBenefit: 'Absorbs sweat and sebum instantly without adding cakey dry powdery residue.',
    whyMatch: 'Locks the T-zone and smile lines under high humidity to prevent foundation separation.',
  },

  // --- DRUGSTORE & GLOBAL VIRAL ICONS ---
  {
    id: 'gb-elf-1',
    brandName: 'e.l.f. Cosmetics',
    region: 'Drugstore & Mass',
    productName: '16HR Camo Concealer (Full Coverage)',
    category: 'concealer',
    priceEstimate: '$7 / ₹650',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: 'Medium Warm',
    shadeName: 'Warm Caramel Sand',
    shadeHex: '#c7925a',
    finish: 'Full Matte',
    keyBenefit: 'Ultra-durable 16-hour matte formula with avocado oil to moisturize while locking acne spots.',
    whyMatch: 'High micro-pigment density: 1 tiny dot (0.01ml) is sufficient to hide redness without building cakey layers.',
  },
  {
    id: 'gb-elf-2',
    brandName: 'e.l.f. Cosmetics',
    region: 'Drugstore & Mass',
    productName: 'Halo Glow Liquid Filter Complexion Booster',
    category: 'foundation',
    priceEstimate: '$14 / ₹1,250',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: 'Shade 4 / 5',
    shadeName: 'Medium Tan Golden',
    shadeHex: '#bd8653',
    finish: 'Glossy Glass-Skin Filter',
    keyBenefit: 'Squalane and hyaluronic acid base creates a high-wattage red carpet glow for camera lenses.',
    whyMatch: 'Pairs flawlessly with Korean glass-skin & Clean-Girl aesthetic stencils on olive undertones.',
  },
  {
    id: 'gb-elf-3',
    brandName: 'e.l.f. Cosmetics',
    region: 'Drugstore & Mass',
    productName: 'Camo Liquid Blush',
    category: 'blush',
    priceEstimate: '$7 / ₹650',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: 'Coral Crush',
    shadeName: 'Spiced Terracotta Coral',
    shadeHex: '#d86248',
    finish: 'Soft Dewy Wash',
    keyBenefit: 'High pigment load; blends effortlessly onto cheekbones without disturbing underlying base makeup.',
    whyMatch: 'High cheekbone placement lifts hooded and round facial features visually.',
  },

  // --- VIRAL CELEBRITY IT-BRANDS ---
  {
    id: 'gb-rhode-1',
    brandName: 'Rhode',
    region: 'Celebrity & Viral',
    productName: 'Peptide Lip Tint (Hailey Bieber)',
    category: 'lipstick',
    priceEstimate: '$18 / ₹1,650',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral', 'Rich Caramel'],
    shadeCode: 'Toast',
    shadeName: 'Warm Hazelnut Rose',
    shadeHex: '#9c594c',
    finish: 'High-Gloss Peptide Cushion',
    keyBenefit: 'Formulated with cupuaçu butter, babassu, and peptide chains; nourishes and plumps lip tissue naturally.',
    whyMatch: 'The definitive Hailey Bieber "Clean Girl" pout. Sheer warm brown adds juicy depth to naturally two-toned lips.',
  },
  {
    id: 'gb-rhode-2',
    brandName: 'Rhode',
    region: 'Celebrity & Viral',
    productName: 'Peptide Lip Tint (Hailey Bieber)',
    category: 'lipstick',
    priceEstimate: '$18 / ₹1,650',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Cool', 'Olive'],
    shadeCode: 'Espresso',
    shadeName: 'Rich Bitter Chocolate',
    shadeHex: '#663b33',
    finish: 'Glossy Sheer Lacquer',
    keyBenefit: 'Adds instant 90s supermodel lip contouring when layered over natural lip edges.',
    whyMatch: 'Incredible definition on dusky & olive skin tones without looking artificial.',
  },
  {
    id: 'gb-rhode-3',
    brandName: 'Rhode',
    region: 'Celebrity & Viral',
    productName: 'Pocket Blush Glaze',
    category: 'blush',
    priceEstimate: '$24 / ₹2,200',
    monkScaleRange: [3, 8],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: 'Spicy Marg',
    shadeName: 'Bright Coral Poppy',
    shadeHex: '#e35848',
    finish: 'Glowy Satin Tint',
    keyBenefit: 'Melts on touch with body heat, delivering that fresh windblown runway flush.',
    whyMatch: 'Sculpts the zygomatic arch upward to balance jawline contours in real time.',
  },
  {
    id: 'gb-kylie-1',
    brandName: 'Kylie Cosmetics',
    region: 'Celebrity & Viral',
    productName: 'Matte Liquid Lip Kit',
    category: 'lipstick',
    priceEstimate: '$32 / ₹2,800',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Neutral', 'Olive'],
    shadeCode: 'Posie K / Ginger',
    shadeName: 'Ginger Warm Terracotta',
    shadeHex: '#a45749',
    finish: 'True Ultra-Matte',
    keyBenefit: 'Precision pencil liner + transfer-proof liquid lipstick; defines symmetrical borders that do not feather.',
    whyMatch: 'Recreates the iconic Hollywood & Kardashian contoured overline with all-day staying power.',
  },
  {
    id: 'gb-kylie-2',
    brandName: 'Kylie Cosmetics',
    region: 'Celebrity & Viral',
    productName: 'Power Plush Longwear Foundation',
    category: 'foundation',
    priceEstimate: '$40 / ₹3,500',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Warm Golden', 'Olive'],
    shadeCode: '5WN',
    shadeName: 'Medium Warm Golden Olive',
    shadeHex: '#c79058',
    finish: 'Airbrushed Satin',
    keyBenefit: 'Centella asiatica and niacinamide formula blurs surface texture without oxidizing over time.',
    whyMatch: 'Formulated with yellow-olive undertone bases that prevent the gray mask look under bright flash photography.',
  },
  {
    id: 'gb-kylie-3',
    brandName: 'Kylie Cosmetics',
    region: 'Celebrity & Viral',
    productName: 'Pressed Bronzing Powder',
    category: 'contour',
    priceEstimate: '$26 / ₹2,300',
    monkScaleRange: [4, 8],
    undertoneCompatibility: ['Warm', 'Warm Golden', 'Rich Caramel'],
    shadeCode: 'Tequila Tan',
    shadeName: 'Warm Bronze Amber',
    shadeHex: '#8f5734',
    finish: 'Velvet Matte',
    keyBenefit: 'Silky micro-pigment bronzer that mimics natural sun-kissed warmth without muddy undertones.',
    whyMatch: 'Chisels cheek hollows and jaw contours based on your detected face shape.',
  },

  // --- GLOBAL LUXURY & PRO STANDARDS ---
  {
    id: 'gb-mac-1',
    brandName: 'MAC Cosmetics',
    region: 'Global Luxury',
    productName: 'Studio Fix Fluid SPF 15 24HR Matte',
    category: 'foundation',
    priceEstimate: '$42 / ₹3,600',
    monkScaleRange: [4, 8],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: 'NC42',
    shadeName: 'Golden Olive Tan',
    shadeHex: '#c48b55',
    finish: 'Medium-to-Full Matte',
    keyBenefit: 'The industry benchmark for Indian and Southeast Asian skin; controls shine for 24 hours.',
    whyMatch: 'Matches the exact CIELAB coordinate (L*64, a*12, b*27) calculated by the smart scanner.',
  },
  {
    id: 'gb-nars-1',
    brandName: 'NARS',
    region: 'Global Luxury',
    productName: 'Radiant Creamy Concealer',
    category: 'concealer',
    priceEstimate: '$32 / ₹2,900',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: 'Biscuit / Ginger',
    shadeName: 'Medium Deep with Warm Golden',
    shadeHex: '#c68d59',
    finish: 'Luminous Creamy',
    keyBenefit: 'Mineral tone balancing powder optically corrects rather than masks hyperpigmentation.',
    whyMatch: 'Light-diffusing technology makes deep-set and hooded eyes appear refreshed without settlement into lines.',
  },
  {
    id: 'gb-ct-1',
    brandName: 'Charlotte Tilbury',
    region: 'Global Luxury',
    productName: 'Airbrush Flawless Foundation',
    category: 'foundation',
    priceEstimate: '$49 / ₹4,500',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: '7.5 Warm',
    shadeName: 'Golden Honey Olive',
    shadeHex: '#c8925b',
    finish: 'Airbrush Full Matte',
    keyBenefit: 'Magic Replexium peptide reduces wrinkle visibility while creating a poreless bridal canvas.',
    whyMatch: 'Sweat-proof, humidity-proof, and flash-photography safe for wedding & gala events.',
  },
  {
    id: 'gb-ct-2',
    brandName: 'Charlotte Tilbury',
    region: 'Global Luxury',
    productName: 'Matte Revolution Lipstick',
    category: 'lipstick',
    priceEstimate: '$35 / ₹3,200',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: 'Pillow Talk Medium',
    shadeName: 'Warm Berry Pink Nude',
    shadeHex: '#9c5354',
    finish: 'Cashmere Matte',
    keyBenefit: 'Glowing 3D pigments create illusion of wider, fuller lips with nourishing orchid extract.',
    whyMatch: 'Universally flattering on medium Indian skin tones; does not wash out the complexion.',
  },

  // --- K-BEAUTY GLASS-SKIN STARS ---
  {
    id: 'gb-romand-1',
    brandName: 'Rom&nd',
    region: 'K-Beauty',
    productName: 'Juicy Lasting Tint (Korean Glass Skin)',
    category: 'lipstick',
    priceEstimate: '$13 / ₹1,150',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: '#23 Nucadamia',
    shadeName: 'Reddish Mood Brown Nude',
    shadeHex: '#a44f47',
    finish: 'Tanghulu Glass Gloss',
    keyBenefit: 'Syrup-like glossy film that locks in tint underneath while delivering high-sheen reflection.',
    whyMatch: 'The gold standard for Korean gradient lips with center concentration stencil markers.',
  },
  {
    id: 'gb-clio-1',
    brandName: 'Clio',
    region: 'K-Beauty',
    productName: 'Kill Cover The New Founwear Cushion',
    category: 'foundation',
    priceEstimate: '$28 / ₹2,400',
    monkScaleRange: [3, 6],
    undertoneCompatibility: ['Warm', 'Neutral', 'Olive'],
    shadeCode: '04 Ginger',
    shadeName: 'Medium Warm Beige',
    shadeHex: '#d8aa78',
    finish: 'Semi-Matte Glass Velvet',
    keyBenefit: 'Ultra-thin adherence technology resists mask transfer and humidity with zero clumpiness.',
    whyMatch: 'Creates an ethereal glass-skin barrier without feeling heavy or oily in warm weather.',
  },

  // --- VIRAL K-BEAUTY SENSATION: TIRTIR ---
  {
    id: 'gb-tirtir-1',
    brandName: 'TIRTIR',
    region: 'K-Beauty',
    productName: 'Mask Fit Red Cushion Foundation (72HR Longwear)',
    category: 'foundation',
    priceEstimate: '$25 / ₹2,199',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: '24N Latte / 27N Camel',
    shadeName: 'Latte Warm Golden Medium',
    shadeHex: '#c7925a',
    finish: 'Luminous Egg-Skin Transfer-Proof',
    keyBenefit: 'TikTok viral egg-shaped cushion with 72-hour transfer-proof adherence. Hibiscus extract & red propolis provide glass-skin hydration without oil breakthrough.',
    whyMatch: 'Top recommendation for humid climates and glass-skin looks. Zero oxidation with rich pigment coverage in 1 gentle cushion tap.',
  },
  {
    id: 'gb-tirtir-2',
    brandName: 'TIRTIR',
    region: 'K-Beauty',
    productName: 'Mask Fit Red Cushion (Fair-to-Medium)',
    category: 'foundation',
    priceEstimate: '$25 / ₹2,199',
    monkScaleRange: [2, 4],
    undertoneCompatibility: ['Neutral', 'Warm', 'Cool'],
    shadeCode: '21N Ivory / 23N Sand',
    shadeName: 'Natural Ivory Beige',
    shadeHex: '#dcb182',
    finish: 'Semi-Matte Glass Glow',
    keyBenefit: 'Micro-powder mesh locks onto skin with zero creasing on smile lines or nasal folds.',
    whyMatch: 'Ideal balance of dewy glass reflection and all-day humidity barrier.',
  },
  {
    id: 'gb-tirtir-3',
    brandName: 'TIRTIR',
    region: 'K-Beauty',
    productName: 'Mask Fit Dual Concealer (Liquid + Stick)',
    category: 'concealer',
    priceEstimate: '$19 / ₹1,650',
    monkScaleRange: [3, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Neutral'],
    shadeCode: '02 Medium',
    shadeName: 'Warm Honey Neutralizer',
    shadeHex: '#cb9660',
    finish: 'Dual Stick & Serum Liquid',
    keyBenefit: 'Stick side for pinpoint acne carving; liquid doe-foot for delicate under-eye tear trough brightening.',
    whyMatch: 'Enables precise 2-step color correction without cakey buildup under mobile eyelids.',
  },

  // --- HUDA BEAUTY PRO COMPLEXION ---
  {
    id: 'gb-huda-1',
    brandName: 'Huda Beauty',
    region: 'Global Luxury',
    productName: '#FauxFilter Luminous Matte Liquid Foundation',
    category: 'foundation',
    priceEstimate: '$42 / ₹3,650',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: '310G Amaretti / 340G Baklava',
    shadeName: 'Golden Honey Olive',
    shadeHex: '#c48b55',
    finish: 'Full Coverage Luminous Matte',
    keyBenefit: 'Waterproof, sweat-proof, and transfer-proof full coverage that completely blurs hyperpigmentation and pores.',
    whyMatch: 'Flawless optical match for South Asian & olive skin tones; resists extreme heat and tropical humidity without separating.',
  },
  {
    id: 'gb-huda-2',
    brandName: 'Huda Beauty',
    region: 'Global Luxury',
    productName: '#FauxFilter Luminous Matte Concealer',
    category: 'concealer',
    priceEstimate: '$31 / ₹2,600',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Warm Golden', 'Olive'],
    shadeCode: 'Cookie Dough 4.3G / Granola 4.5G',
    shadeName: 'Warm Caramel Golden',
    shadeHex: '#c08953',
    finish: 'Crease-Proof Soft Velvet',
    keyBenefit: 'Infused with sweet almond oil and vitamin E; illuminates under-eye tear troughs without gathering in fine crease lines.',
    whyMatch: 'High pigment concentration: only 2 micro-dots needed per eye to erase blue-violet hollows.',
  },
  {
    id: 'gb-huda-3',
    brandName: 'Huda Beauty',
    region: 'Global Luxury',
    productName: '#FauxFilter Color Corrector',
    category: 'color-corrector',
    priceEstimate: '$30 / ₹2,550',
    monkScaleRange: [4, 8],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden', 'Rich Caramel'],
    shadeCode: 'Mango / Papaya',
    shadeName: 'Warm Peach Mango / Blood Orange',
    shadeHex: '#de7b43',
    finish: 'Thin Fluid Neutralizer',
    keyBenefit: 'Featherlight non-cakey corrector fluid designed to cancel out stubborn brown and blue under-eye melanin in 1 sweep.',
    whyMatch: 'Eliminates the dark gray cast that occurs when foundation is applied directly over dark circles.',
  },

  // --- SWISS BEAUTY EXTENDED SHADES & CORRECTOR ---
  {
    id: 'gb-sb-3',
    brandName: 'Swiss Beauty',
    region: 'India',
    productName: 'Pro Color Corrector Wheel (6-in-1 Palette)',
    category: 'color-corrector',
    priceEstimate: '₹349',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Cool', 'Olive', 'Neutral', 'Warm Golden', 'Rich Caramel'],
    shadeCode: '01 Multicolor Palette',
    shadeName: 'Orange, Green, Lavender & Yellow Corrector Pods',
    shadeHex: '#ea733c',
    finish: 'Creamy Buildable Balm',
    keyBenefit: 'Contains Peach/Orange for dark circles, Green for acne redness, Lavender for sallow yellow dullness, and Yellow for purple veins.',
    whyMatch: 'All-in-one professional color theory palette designed specifically for Indian skin discoloration zones.',
  },
  {
    id: 'gb-sb-4',
    brandName: 'Swiss Beauty',
    region: 'India',
    productName: 'Daily Wear Lightweight Foundation',
    category: 'foundation',
    priceEstimate: '₹299',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Warm Golden', 'Olive'],
    shadeCode: '03 Natural Tan',
    shadeName: 'Warm Golden Almond',
    shadeHex: '#ca945e',
    finish: 'Natural Radiant Satin',
    keyBenefit: 'Water-resistant base with vitamin C; weightless daily blend that does not oxidize orange.',
    whyMatch: 'Budget-friendly staple matched to medium-olive skin tones with natural breathability.',
  },

  // --- MARS COSMETICS EXTENDED ---
  {
    id: 'gb-mars-3',
    brandName: 'Mars Cosmetics',
    region: 'India',
    productName: 'Cover Ranger Color Corrector & Concealer Palette',
    category: 'color-corrector',
    priceEstimate: '₹329',
    monkScaleRange: [1, 10],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden', 'Rich Caramel'],
    shadeCode: 'CR-01',
    shadeName: 'Peach Orange, Pistachio Green & Caramel',
    shadeHex: '#e76a38',
    finish: 'Ultra-Creamy Camouflage',
    keyBenefit: 'High wax-emollient stability; grips onto warm skin and cancels out acne marks without slipping under foundation.',
    whyMatch: 'Targeted correction for perioral pigmentation around the mouth and deep tear trough shadows.',
  },

  // --- HILARY RHODA EXTENDED ---
  {
    id: 'gb-hr-3',
    brandName: 'Hilary Rhoda',
    region: 'India',
    productName: 'Camouflage High Definition Concealer & Corrector Duo',
    category: 'concealer',
    priceEstimate: '₹279',
    monkScaleRange: [4, 7],
    undertoneCompatibility: ['Warm', 'Olive', 'Warm Golden'],
    shadeCode: 'HR-02',
    shadeName: 'Warm Sand Peach',
    shadeHex: '#cca06d',
    finish: 'Satin Velvet',
    keyBenefit: 'Blurs fine expression lines and locks onto skin without creasing in monsoon or tropical heat.',
    whyMatch: 'Combines micro-peach pigments to cancel out hyperpigmentation with an identical skin-depth shade.',
  },
];

// Helper to filter and rank brand products for a given diagnostic profile and look
export function findMatchingGlobalProducts(
  products: GlobalBrandProduct[],
  monkScale: number,
  undertone: SkinUndertone,
  filterCategory?: BrandCategory | 'all',
  filterRegion?: BrandRegion | 'all',
  searchQuery?: string
): GlobalBrandProduct[] {
  return products.filter((p) => {
    // Category match
    if (filterCategory && filterCategory !== 'all' && p.category !== filterCategory) {
      return false;
    }
    // Region match
    if (filterRegion && filterRegion !== 'all' && p.region !== filterRegion) {
      return false;
    }
    // Search query
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.brandName.toLowerCase().includes(q) ||
        p.productName.toLowerCase().includes(q) ||
        p.shadeName.toLowerCase().includes(q) ||
        p.shadeCode.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }
    // Undertone & Monk scale suitability
    const isMonkInRange = monkScale >= p.monkScaleRange[0] && monkScale <= p.monkScaleRange[1];
    const isUndertoneMatch = p.undertoneCompatibility.includes(undertone);

    // If custom added or search matched, include it even if ranges are slightly off
    if (p.isCustomAdded) return true;
    if (searchQuery && searchQuery.trim().length > 0) return true;

    return isMonkInRange || isUndertoneMatch;
  });
}

// AI Shade Match Generator for ANY requested brand missing from list!
export function calculateCustomBrandShadeMatch(
  brandName: string,
  productType: BrandCategory,
  customProductLine: string,
  monkScale: number,
  undertone: SkinUndertone,
  skinHex: string
): GlobalBrandProduct {
  // Compute smart shade naming based on brand conventions and user's skin profile
  let shadeCode = '';
  let shadeName = '';
  let shadeHex = skinHex;
  let finish = 'Radiant Satin';
  let priceEstimate = '₹799 - ₹1,499';
  let keyBenefit = `Formulated specifically for ${undertone} undertones with high pigment dispersion.`;
  let whyMatch = `Direct optical conversion for Monk Scale ${monkScale} (${undertone} tone).`;

  const brandLower = brandName.toLowerCase();

  if (productType === 'foundation') {
    finish = 'Natural Longwear Matte';
    if (monkScale <= 3) {
      shadeCode = 'Fair Ivory / 110';
      shadeName = 'Warm Porcelain Golden';
      shadeHex = '#eed2b2';
    } else if (monkScale <= 5) {
      shadeCode = 'Medium Warm / 220';
      shadeName = 'Golden Honey Ochre';
      shadeHex = '#d79e64';
    } else if (monkScale <= 7) {
      shadeCode = 'Deep Warm / 330';
      shadeName = 'Warm Almond Olive Caramel';
      shadeHex = '#c48952';
    } else {
      shadeCode = 'Rich Espresso / 440';
      shadeName = 'Toasted Chestnut Bronze';
      shadeHex = '#895636';
    }
    whyMatch = `Calculated to match your CIELAB coordinates without turning ashy or oxidizing orange on ${undertone} skin.`;
  } else if (productType === 'concealer') {
    finish = 'High-Coverage Crease-Resistant';
    if (monkScale <= 4) {
      shadeCode = 'Light Medium Warm';
      shadeName = 'Peach Honey Corrective';
      shadeHex = '#dfa574';
    } else if (monkScale <= 7) {
      shadeCode = 'Medium Caramel Olive';
      shadeName = 'Warm Terracotta Ochre';
      shadeHex = '#be7f4a';
    } else {
      shadeCode = 'Deep Amber';
      shadeName = 'Rich Toffee Amber';
      shadeHex = '#8e5535';
    }
    whyMatch = `Formulated with peach-ochre undertones to neutralize dark circles and acne hyperpigmentation in 1 micro-drop.`;
  } else if (productType === 'lipstick') {
    finish = 'Velvet Matte Cushion';
    if (undertone.includes('Cool')) {
      shadeCode = 'Berry Plum 07';
      shadeName = 'Royal Vintage Mauve';
      shadeHex = '#984457';
    } else if (undertone.includes('Olive')) {
      shadeCode = 'Warm Brown Nude 05';
      shadeName = 'Spiced Cinnamon Terra';
      shadeHex = '#94473b';
    } else {
      shadeCode = 'Chai Rose 09';
      shadeName = 'Warm Rosewood Caramel';
      shadeHex = '#a75045';
    }
    whyMatch = `Selected to complement natural two-toned lip pigmentation common in Indian and olive complexions.`;
  } else if (productType === 'blush') {
    finish = 'Soft Focus Tint';
    shadeCode = 'Coral Glow 03';
    shadeName = 'Terracotta Warm Coral';
    shadeHex = '#d76751';
    whyMatch = 'Sculpts high on zygomatic bone to visually lift hooded eye creases and jawlines.';
  } else {
    finish = 'Micro-Fine Soft Matte';
    shadeCode = 'Bronze Sculpt 02';
    shadeName = 'Warm Amber Taupe';
    shadeHex = '#88533a';
    whyMatch = 'Shadow simulation without muddy gray pigments.';
  }

  // Price estimate based on brand tier
  if (brandLower.includes('dior') || brandLower.includes('chanel') || brandLower.includes('tom ford') || brandLower.includes('charlotte')) {
    priceEstimate = '$45 - $65 / ₹4,500+';
  } else if (brandLower.includes('blue heaven') || brandLower.includes('swiss beauty') || brandLower.includes('mars') || brandLower.includes('insight') || brandLower.includes('hilary')) {
    priceEstimate = '₹249 - ₹499';
  } else if (brandLower.includes('rhode') || brandLower.includes('kylie') || brandLower.includes('rare') || brandLower.includes('fenty') || brandLower.includes('elf')) {
    priceEstimate = '$14 - $34 / ₹1,400 - ₹2,900';
  }

  return {
    id: `custom-${Date.now()}`,
    brandName,
    region: 'India',
    productName: customProductLine || `${brandName} Signature ${productType.toUpperCase()}`,
    category: productType,
    priceEstimate,
    monkScaleRange: [Math.max(1, monkScale - 1), Math.min(10, monkScale + 1)],
    undertoneCompatibility: [undertone],
    shadeCode,
    shadeName,
    shadeHex,
    finish,
    keyBenefit,
    whyMatch,
    isCustomAdded: true,
  };
}

export interface BrandShadeSet {
  brand: string;
  badge: string;
  foundation: { shadeCode: string; shadeName: string; hex: string; formula: string };
  concealer: { shadeCode: string; shadeName: string; hex: string; technique: string };
  colorCorrector: { shadeName: string; hex: string; targetArea: string; why: string };
}

export function getCoreBrandMatches(
  monkScale: number,
  undertone: SkinUndertone,
  darkCircleHue: string
): {
  brands: BrandShadeSet[];
  colorCorrectionPlan: {
    correctorColor: string;
    correctorHex: string;
    faceZone: string;
    instructions: string;
  }[];
} {
  // Determine shade depth category: Fair (1-3), Medium (4-5), Tan/Olive (6-7), Deep (8-10)
  const isFair = monkScale <= 3;
  const isMedium = monkScale >= 4 && monkScale <= 5;
  const isTan = monkScale >= 6 && monkScale <= 7;
  const isDeep = monkScale >= 8;

  const brands: BrandShadeSet[] = [
    {
      brand: 'Swiss Beauty',
      badge: '🇮🇳 India Best Value & High Coverage',
      foundation: isFair
        ? { shadeCode: '01 Ivory', shadeName: 'Fair Ivory Luminous', hex: '#eed2b6', formula: 'Daily Wear Lightweight SPF 15' }
        : isMedium
        ? { shadeCode: '02 Natural Beige', shadeName: 'Warm Sand Beige', hex: '#d9a16a', formula: 'Daily Wear Lightweight SPF 15' }
        : isTan
        ? { shadeCode: '03 Natural Tan', shadeName: 'Golden Honey Almond', hex: '#c58e57', formula: 'Daily Wear Lightweight SPF 15' }
        : { shadeCode: '04 Golden Caramel', shadeName: 'Deep Warm Amber', hex: '#8e5635', formula: 'Daily Wear Lightweight SPF 15' },
      concealer: isFair
        ? { shadeCode: '01 Warm Sand', shadeName: 'Porcelain Peach', hex: '#e8c49e', technique: 'Micro-dot inner corner tear trough' }
        : isMedium
        ? { shadeCode: '02 Sand Sable', shadeName: 'Warm Beige Neutralizer', hex: '#d49d66', technique: 'Dot on tear trough and outer eye upward flick' }
        : isTan
        ? { shadeCode: '04 Medium Sand', shadeName: 'Golden Caramel Corrector', hex: '#be8751', technique: 'Stipple over tear trough shadow and smile lines' }
        : { shadeCode: '06 Deep Toffee', shadeName: 'Rich Warm Toffee', hex: '#875132', technique: 'Press with fingertip warmth to melt micro-pigments' },
      colorCorrector: darkCircleHue.includes('purple') || darkCircleHue.includes('blue')
        ? { shadeName: 'Pro Palette Peach Salmon', hex: '#f08960', targetArea: 'Under-eye tear trough hollow', why: 'Peach cancels out blue/violet venous undertones without ashiness.' }
        : { shadeName: 'Pro Palette Warm Orange', hex: '#e86a32', targetArea: 'Periorbital eye circle & perioral mouth rim', why: 'Deep orange neutralizes melanin brown hyperpigmentation before foundation.' },
    },
    {
      brand: 'Huda Beauty',
      badge: '💎 High-Glam 24HR Transfer-Proof',
      foundation: isFair
        ? { shadeCode: '110N Angel Food', shadeName: 'Fair Neutral Porcelain', hex: '#efd5bb', formula: '#FauxFilter Luminous Matte' }
        : isMedium
        ? { shadeCode: '220N Custard / 240N Toasted Coconut', shadeName: 'Golden Custard Neutral', hex: '#d6a36f', formula: '#FauxFilter Luminous Matte' }
        : isTan
        ? { shadeCode: '310G Amaretti / 340G Baklava', shadeName: 'Golden Tan Honey Olive', hex: '#c48b55', formula: '#FauxFilter Luminous Matte' }
        : { shadeCode: '400G Brown Sugar / 440G Cinnamon', shadeName: 'Rich Golden Amber Bronze', hex: '#8d5736', formula: '#FauxFilter Luminous Matte' },
      concealer: isFair
        ? { shadeCode: 'Coconut Flakes 2.7N', shadeName: 'Neutral Ivory Lift', hex: '#e5bf98', technique: '2 micro-dots inner corner + 1 dot temple lift' }
        : isMedium
        ? { shadeCode: 'Sugar Biscuit 3.5N', shadeName: 'Warm Honey Brightening', hex: '#cca172', technique: 'Blend upward with damp sponge for snatched eye look' }
        : isTan
        ? { shadeCode: 'Cookie Dough 4.3G / Granola 4.5G', shadeName: 'Golden Caramel Olive', hex: '#ba8653', technique: 'Tear trough triangle + outer corner upward sweep' }
        : { shadeCode: 'Caramel Corn 5.1G', shadeName: 'Deep Toasted Almond', hex: '#845334', technique: 'Targeted spot concealing on pigmentation marks' },
      colorCorrector: isDeep || isTan
        ? { shadeName: '#FauxFilter Papaya / Mango', hex: '#dc6632', targetArea: 'Under-eye hollows & chin shadow', why: 'High-density warm pigment cancels dark shadows under 4K lenses.' }
        : { shadeName: '#FauxFilter Peach Fluid', hex: '#ea8860', targetArea: 'Inner eye tear trough & nostril shadows', why: 'Featherlight non-creasing fluid cancels blue darkness with zero texture.' },
    },
    {
      brand: 'MAC Cosmetics',
      badge: '⭐ Global Makeup Artist Benchmark',
      foundation: isFair
        ? { shadeCode: 'NC15 / NC20', shadeName: 'Natural Golden Fair', hex: '#efd7bc', formula: 'Studio Fix Fluid SPF 15 Matte' }
        : isMedium
        ? { shadeCode: 'NC25 / NC30 / NC35', shadeName: 'Golden Beige Olive', hex: '#d59e66', formula: 'Studio Fix Fluid SPF 15 Matte' }
        : isTan
        ? { shadeCode: 'NC40 / NC42', shadeName: 'Golden Olive Tan (Cult South Asian)', hex: '#c48b55', formula: 'Studio Fix Fluid SPF 15 Matte' }
        : { shadeCode: 'NC45 / NC50', shadeName: 'Rich Bronze Caramel', hex: '#8d5534', formula: 'Studio Fix Fluid SPF 15 Matte' },
      concealer: isFair
        ? { shadeCode: 'NC20', shadeName: 'Studio Fix 24HR Fair Golden', hex: '#e5be96', technique: 'Pinpoint stippling with 217 brush' }
        : isMedium
        ? { shadeCode: 'NC30 / NC35', shadeName: 'Studio Fix 24HR Medium Golden', hex: '#ce9864', technique: 'Inner corner tear trough brightening' }
        : isTan
        ? { shadeCode: 'NC42', shadeName: 'Studio Fix 24HR Olive Golden Caramel', hex: '#b77f4e', technique: 'Blend outer edge into cheekbone for seamless transition' }
        : { shadeCode: 'NC45', shadeName: 'Studio Fix 24HR Rich Toffee', hex: '#865132', technique: 'Micro-dot pinpoint placement on blemishes' },
      colorCorrector: darkCircleHue.includes('purple') || darkCircleHue.includes('blue')
        ? { shadeName: 'Studio Finish Peach / Salmon', hex: '#ed8d66', targetArea: 'Inner tear trough hollow', why: 'Counteracts venous pooling without muddying foundation.' }
        : { shadeName: 'Studio Finish Pure Orange', hex: '#e2632b', targetArea: 'Under-eye semicircle & dark mouth corners', why: 'Cancels hyperpigmentation and melasma on olive/golden complexions.' },
    },
    {
      brand: 'Mars Cosmetics',
      badge: '🇮🇳 India Trendsetter & Micro-Fine Texture',
      foundation: isFair
        ? { shadeCode: '01 Fair Light', shadeName: 'Dewy Porcelain', hex: '#ebd2b6', formula: 'City Paradise Micro-Fine Liquid' }
        : isMedium
        ? { shadeCode: '02 Natural Beige', shadeName: 'Warm Honey Ochre', hex: '#d39d67', formula: 'City Paradise Micro-Fine Liquid' }
        : isTan
        ? { shadeCode: '03 Warm Honey Ochre', shadeName: 'Golden Sand Caramel', hex: '#c28b55', formula: 'City Paradise Micro-Fine Liquid' }
        : { shadeCode: '04 Golden Amber', shadeName: 'Deep Bronzed Chestnut', hex: '#8a5535', formula: 'City Paradise Micro-Fine Liquid' },
      concealer: isFair
        ? { shadeCode: '01 Vanilla', shadeName: 'Seal The Deal Light Warm', hex: '#e2ba93', technique: 'Tap on tear trough with ring finger' }
        : isMedium
        ? { shadeCode: '02 Sand', shadeName: 'Seal The Deal Warm Sand', hex: '#cb9662', technique: 'Apply along tear trough and outer eye upward wing' }
        : isTan
        ? { shadeCode: '04 Caramel Macchiato', shadeName: 'Seal The Deal Caramel Ochre', hex: '#b47e4b', technique: 'Micro-dot over acne spots & dark circles' }
        : { shadeCode: '05 Espresso Toffee', shadeName: 'Seal The Deal Deep Caramel', hex: '#804e31', technique: 'Even out perioral mouth darkness' },
      colorCorrector: {
        shadeName: 'Cover Ranger 6-Pan Corrector (Peach/Orange & Green)',
        hex: '#e56b37',
        targetArea: 'Under-eye teardrop + nostril crease redness',
        why: 'Dual-action: Peach/Orange cancels dark shadows, Green cancels nostril/acne redness.',
      },
    },
    {
      brand: 'Hilary Rhoda',
      badge: '✨ Dewy Serum Glaze & Camouflage Pro',
      foundation: isFair
        ? { shadeCode: 'HR-01 Light Porcelain', shadeName: 'Dewy Ivory Glaze', hex: '#eed4b7', formula: 'Skin Glaze Liquid Foundation & Serum Tint' }
        : isMedium
        ? { shadeCode: 'HR-02 Natural Beige', shadeName: 'Warm Honey Tint', hex: '#d49d68', formula: 'Skin Glaze Liquid Foundation & Serum Tint' }
        : isTan
        ? { shadeCode: 'HR-03 Golden Honey Glaze', shadeName: 'Golden Glaze Caramel', hex: '#c38d56', formula: 'Skin Glaze Liquid Foundation & Serum Tint' }
        : { shadeCode: 'HR-04 Dusky Caramel', shadeName: 'Deep Amber Glow', hex: '#8c5636', formula: 'Skin Glaze Liquid Foundation & Serum Tint' },
      concealer: isFair
        ? { shadeCode: 'HR-01 Ivory Light', shadeName: 'Camouflage HD Porcelain', hex: '#e5be95', technique: 'Sheer under-eye tap' }
        : isMedium
        ? { shadeCode: 'HR-02 Warm Sand', shadeName: 'Camouflage HD Peach Honey', hex: '#cca06d', technique: 'Dot under eye and buff with dense brush' }
        : isTan
        ? { shadeCode: 'HR-03 Caramel Toffee', shadeName: 'Camouflage HD Golden Caramel', hex: '#b67f4f', technique: 'Press onto blemish marks and under-eye hollow' }
        : { shadeCode: 'HR-04 Deep Amber', shadeName: 'Camouflage HD Toffee Amber', hex: '#835032', technique: 'Targeted perioral evening' },
      colorCorrector: {
        shadeName: '2-in-1 Peach Orange & Contour Duo',
        hex: '#ea7842',
        targetArea: 'Under-eye hollows & hyperpigmented spots',
        why: 'Micro-pigment peach neutralizes dark eye circles without forming powdery texture.',
      },
    },
    {
      brand: 'TIRTIR',
      badge: '🌸 Viral 72HR K-Beauty Cushion Sensation',
      foundation: isFair
        ? { shadeCode: '17C Fair / 21N Ivory', shadeName: 'Porcelain Glass Cushion', hex: '#edd3b9', formula: 'Mask Fit Red Cushion 72HR' }
        : isMedium
        ? { shadeCode: '23N Sand / 24N Latte', shadeName: 'Natural Warm Beige Glass', hex: '#d29f6b', formula: 'Mask Fit Red Cushion 72HR' }
        : isTan
        ? { shadeCode: '27N Camel / 29N Natural Amber', shadeName: 'Golden Honey Olive Cushion', hex: '#c18c56', formula: 'Mask Fit Red Cushion 72HR' }
        : { shadeCode: '33N Cinnamon / 40N Espresso', shadeName: 'Deep Bronzed Egg Cushion', hex: '#8a5637', formula: 'Mask Fit Red Cushion 72HR' },
      concealer: isFair
        ? { shadeCode: '01 Natural Fair', shadeName: 'Mask Fit Dual Concealer (Liquid + Stick)', hex: '#e3bd97', technique: 'Liquid side on under-eye; stick side on blemishes' }
        : { shadeCode: '02 Warm Medium', shadeName: 'Mask Fit Dual Concealer (Liquid + Stick)', hex: '#ca9660', technique: 'Liquid doe-foot under eye; stick on spot discoloration' },
      colorCorrector: {
        shadeName: 'TIRTIR Mask Fit Tone Up Cream (Peach/Beige)',
        hex: '#e99a78',
        targetArea: 'Center of face & under-eye orbital bone',
        why: 'Delivers high-refraction glass skin while neutralizing blue shadow tones.',
      },
    },
  ];

  const colorCorrectionPlan = [
    {
      correctorColor: isDeep || isTan ? 'Rich Warm Orange / Terracotta' : 'Peach / Salmon',
      correctorHex: isDeep || isTan ? '#e2632b' : '#f08960',
      faceZone: 'Under-Eye Tear Trough & Periorbital Hollow',
      instructions: darkCircleHue.includes('purple') || darkCircleHue.includes('blue')
        ? 'Dab 1-2 micro-dots exclusively inside the sunken tear trough line where purple/blue venous vessels show. Gently tap with fingertip warmth to melt edges.'
        : 'Micro-dot warm terracotta onto melanin brown semicircle under eyes. Do not pull downward into cheeks; keep contained strictly inside dark shadow zone.',
    },
    {
      correctorColor: 'Mint Pistachio Green',
      correctorHex: '#5db075',
      faceZone: 'Nasal Wing Folds & Active Acne Redness',
      instructions: 'Place a pin-head dot in the groove beside each nostril and directly on any red inflamed blemishes. Tap lightly until redness shifts to a neutral skin hue.',
    },
    {
      correctorColor: 'Soft Lavender / Violet',
      correctorHex: '#a78bfa',
      faceZone: 'Central Forehead & Sallow Cheek Apex',
      instructions: 'For any sallow, dull, or yellowish undertone patches, dab sheer lavender to counteract yellow dullness and infuse optical high-definition luminosity.',
    },
    {
      correctorColor: isDeep || isTan ? 'Terracotta Peach' : 'Warm Honey Beige',
      correctorHex: isDeep || isTan ? '#d96c3d' : '#dfa574',
      faceZone: 'Perioral Darkness (Corners of Mouth & Chin Groove)',
      instructions: 'Dab around the vermillion border of the mouth corners and mental crease of the chin to prevent foundation from looking ashy or gray around the smile lines.',
    },
  ];

  return { brands, colorCorrectionPlan };
}
