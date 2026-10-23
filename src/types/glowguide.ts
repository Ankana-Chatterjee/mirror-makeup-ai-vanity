export type LookMoodId = 'clean' | 'everyday' | 'korean' | 'glam' | 'latina' | 'editorial';
export type ClimateType = 'humid' | 'dry' | 'mild';
export type BudgetTier = 'any' | 'low' | 'mid' | 'high';

export interface LookMood {
  id: LookMoodId;
  name: string;
  tagline: string;
  finish: string;
  eyes: string;
  cheeks: string;
  lips: string;
  description: string;
}

export interface UnderEyeAnalysis {
  discolorationType: string;
  recommendedCorrectorColor: string;
  placementRationale: string;
}

export interface RednessAnalysis {
  present: boolean;
  locations: string[];
  correctorColor: string;
}

export interface SkinToneAnalysis {
  monkScale: number;
  depth: string;
  undertone: string;
  confidence: 'High' | 'Moderate' | 'Exploratory';
  uncertaintyNote: string;
}

export interface FacialLandmarks {
  faceBox: { top: number; left: number; width: number; height: number }; // percentage 0-100 of image
  leftEye: { x: number; y: number; width?: number; height?: number };
  rightEye: { x: number; y: number; width?: number; height?: number };
  noseTip: { x: number; y: number };
  noseBridge?: { x: number; y: number };
  lipsCenter: { x: number; y: number; width?: number; height?: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  chin: { x: number; y: number };
  forehead: { x: number; y: number };
  leftJaw?: { x: number; y: number };
  rightJaw?: { x: number; y: number };
}

export interface FaceAnalysisData {
  isSuitable: boolean;
  unsuitableReason?: string;
  faceShape: string;
  eyeShape: string;
  eyeCreaseType: string;
  lipShape: string;
  underEye: UnderEyeAnalysis;
  redness: RednessAnalysis;
  skinTone: SkinToneAnalysis;
  foundationDirection: string;
  concealerDirection: string;
  correctorGuide: string;
  wearStrategy: string;
  landmarks?: FacialLandmarks;
  personalizedStepTips: {
    prep: string;
    primer: string;
    correct: string;
    base: string;
    features: string;
    set: string;
  };
}

export interface BrandShadeSet {
  brand: string;
  badge: string;
  foundation: { shadeCode: string; shadeName: string; hex: string; formula: string };
  concealer: { shadeCode: string; shadeName: string; hex: string; technique: string };
  colorCorrector: { shadeName: string; hex: string; targetArea: string; why: string };
}

export interface ColorCorrectionItem {
  correctorColor: string;
  correctorHex: string;
  faceZone: string;
  instructions: string;
}

export interface RoutineStep {
  id: number;
  title: string;
  short: string;
  label: string;
  tagline: string;
  defaultText: string;
  caption: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
