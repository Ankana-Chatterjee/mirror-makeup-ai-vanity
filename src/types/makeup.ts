export type EyeShape = 'hooded' | 'monolid' | 'almond' | 'deep-set' | 'downturned' | 'upturned' | 'round';
export type FaceShape = 'oval' | 'square' | 'round' | 'heart' | 'diamond';
export type DarkCircleType = 'purple-blue' | 'brown-melanin' | 'red-vascular';
export type SkinUndertone = 'Warm' | 'Cool' | 'Olive' | 'Neutral' | 'Warm Golden' | 'Rich Caramel';
export type LipFinish = 'matte' | 'gloss' | 'velvet-gradient';

export type MakeupLookId = 
  | 'clean-girl' 
  | 'natural-everyday'
  | 'k-beauty' 
  | 'mexican-glam' 
  | 'hollywood-glam' 
  | 'festive-shimmer' 
  | 'indian-festive' 
  | 'french-minimalist'
  | 'douyin-siren';

export type WeatherCondition = 'monsoon-humid' | 'hot-summer' | 'dry-winter' | 'moderate-spring' | 'cold-dry' | 'desert-arid';

export interface MakeupLook {
  id: MakeupLookId;
  name: string;
  tagline: string;
  description: string;
  eyeStyleName: string;
  eyeTechnique: string;
  blushTechnique: string;
  contourTechnique: string;
  lipShadeName: string;
  lipColorHex: string;
  lipFinish: LipFinish;
  lipDescription: string;
  cultureOrigin: 'Indian' | 'French' | 'Korean' | 'American/Latina' | 'Hollywood';
  muaInspiration: string;
}

export interface AcneSpotMarker {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  sizeMm: number;
  type: 'active-redness' | 'hyperpigmentation-pih' | 'texture-blemish';
  recommendedCorrector: 'Mint Green' | 'Peach' | 'Terracotta';
  amountDrops: number; // e.g. 0.01ml micro-dot
}

export interface AmountGuideMarker {
  zone: string;
  x: number;
  y: number;
  radius: number;
  amountLabel: string; // e.g. 'Micro-Dot (0.01ml)', 'Pea-Sized (0.15ml)'
  antiCakeTip: string;
}

export interface MakeupMistakeAudit {
  overallScore: number; // 0-100
  status: 'flawless' | 'minor-fixes-needed' | 'attention-required';
  eyelinerAudit: {
    status: 'clean' | 'asymmetric' | 'out-of-line' | 'hood-crossed';
    details: string;
    fixTip: string;
  };
  blendingAudit: {
    status: 'seamless' | 'spotty-cheeks' | 'jawline-line' | 'patchy-forehead';
    details: string;
    fixTip: string;
  };
  coverageAudit: {
    status: 'complete' | 'missed-nostrils' | 'missed-hairline' | 'inner-canthus-gap';
    details: string;
    fixTip: string;
  };
  cakeynessAudit: {
    status: 'featherlight' | 'smile-creasing' | 'under-eye-buildup';
    details: string;
    fixTip: string;
  };
}

export interface OutfitColorHarmony {
  name: string;
  image: string;
  dominantHex: string;
  secondaryHex: string;
  recommendedPalette: {
    eyeShade: string;
    blushShade: string;
    lipShade: string;
    lookRecommendation: MakeupLookId;
    styleRationale: string;
  };
}

export interface PigmentRatio {
  white: number;   // Titanium Dioxide %
  yellow: number;  // Iron Oxide Ochre %
  red: number;     // Crimson Red %
  blue: number;    // Ultramarine Blue %
  olive: number;   // Olive Chrome %
  base: number;    // Base medium %
  drops: {
    white: number;
    yellow: number;
    red: number;
    blue: number;
    olive: number;
    basePumps: number;
  };
  totalMl: number;
  resultHex: string;
}

export interface DispensaryBatch {
  foundation: PigmentRatio & {
    shadeName: string;
    coverage: 'Sheer' | 'Medium' | 'Full';
    weatherFormulaNote?: string;
  };
  corrector: PigmentRatio & {
    correctorType: 'Peach' | 'Salmon' | 'Terracotta' | 'Mint Green';
    targetIssue: string;
  };
  lipstick: PigmentRatio & {
    shadeName: string;
    finish: LipFinish;
  };
}

export interface FacialLandmarkAnchors {
  leftEye?: { x: number; y: number; r: number };
  rightEye?: { x: number; y: number; r: number };
  noseBridge?: { x: number; y: number };
  lips?: { 
    x?: number; 
    y?: number; 
    w?: number; 
    h?: number; 
    yNormalized?: number; 
    widthScale?: number;
    fullnessRatio?: number;
  };
  chin?: { x: number; y: number };
  leftCheek?: { x: number; y: number };
  rightCheek?: { x: number; y: number };
  leftJaw?: { x: number; y: number };
  rightJaw?: { x: number; y: number };
}

export type VanityStepId = 
  | 'prep-corrector' 
  | 'base-foundation' 
  | 'hooded-crease' 
  | 'batwing-liner' 
  | 'contour-blush' 
  | 'lip-contour'
  | 'post-audit';

export interface VanityStep {
  id: VanityStepId;
  order: number;
  name: string;
  shortLabel: string;
  targetArea: 'under-eyes' | 'face-base' | 'eyelids' | 'eyeliner' | 'cheeks' | 'lips';
  toolNeeded: string;
  paletteWell: 'Well A (Foundation)' | 'Well B (Corrector)' | 'Well C (Lipstick)' | 'Damp Sponge / Spatula' | 'AI Optical Camera';
  instructions: string[];
  proTip: string;
  isCompleted: boolean;
  isSkipped: boolean;
}

export interface FaceDiagnostics {
  eyeShape: EyeShape;
  eyeConfidence: number;
  eyeReason: string;
  supratarsalCreaseDepth: string;
  floatingCreaseOffsetMm: number;
  darkCircleHue: DarkCircleType;
  darkCircleSeverity: string;
  cielab: {
    l: number; // Lightness 0-100
    a: number; // Green - Red
    b: number; // Blue - Yellow
  };
  faceShape: FaceShape;
  skinToneName: string;
  skinUndertone: SkinUndertone;
  monkScale: number; // 1-10
  fitzpatrickScale: string; // I-VI
  benchmarkMatches: {
    mac: string;
    fenty: string;
    maybelline: string;
    loreal: string;
  };
  skinHex: string;
  darkCircleHex: string;
  naturalLipHex: string;
  acneSpots?: AcneSpotMarker[];
  perioralDarkness?: boolean; // Hyperpigmentation around mouth/chin common in Indian skin
  textureType?: 'Smooth' | 'Combination' | 'Textured/Acne-Prone' | 'Dry-Flaky';
  anchors?: FacialLandmarkAnchors;
}

export interface ModelPreset {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  diagnostics: FaceDiagnostics;
  recommendedLook: MakeupLookId;
  cultureFocus?: string;
}

export interface CartridgePod {
  id: string;
  name: string;
  label: string;
  chemicalName: string;
  colorHex: string;
  currentLevelPercent: number;
  capacityMl: number;
}

