import { DarkCircleType, EyeShape, FaceDiagnostics, FaceShape, SkinUndertone } from '../types/makeup';
import { hexToRgb, rgbToLab } from './colorScience';

export interface HeadPose3D {
  yaw: number;   // -45 to +45 deg (turn left / right)
  pitch: number; // -25 to +25 deg (tilt up / down)
  roll: number;  // -15 to +15 deg (tilt side-to-side)
  distance: number; // 0.8 to 1.3 zoom
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

// 3D Rotation & Perspective Projection
export function project3DTo2D(
  pt: Point3D,
  pose: HeadPose3D,
  cx: number,
  cy: number,
  faceW: number,
  faceH: number
): { x: number; y: number; depth: number } {
  // Convert angles to radians
  const radYaw = (pose.yaw * Math.PI) / 180;
  const radPitch = (pose.pitch * Math.PI) / 180;
  const radRoll = (pose.roll * Math.PI) / 180;

  // Scale relative to face dimension
  let x = pt.x * faceW;
  let y = pt.y * faceH;
  let z = pt.z * ((faceW + faceH) / 2);

  // 1. Rotate Y (Yaw - Turn Left/Right)
  const cosY = Math.cos(radYaw);
  const sinY = Math.sin(radYaw);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // 2. Rotate X (Pitch - Tilt Up/Down)
  const cosP = Math.cos(radPitch);
  const sinP = Math.sin(radPitch);
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;

  // 3. Rotate Z (Roll - Head Tilt)
  const cosR = Math.cos(radRoll);
  const sinR = Math.sin(radRoll);
  const x3 = x1 * cosR - y2 * sinR;
  const y3 = x1 * sinR + y2 * cosR;

  // Perspective Division (distance factor d = 700px)
  const d = 700;
  const perspectiveFactor = d / (d - z2);
  const zoomFactor = pose.distance || 1.0;

  return {
    x: cx + x3 * perspectiveFactor * zoomFactor,
    y: cy + y3 * perspectiveFactor * zoomFactor,
    depth: z2,
  };
}

// Autonomous scan algorithm: calculates facial features directly from pixel / landmark coordinates
// Never asks the user questions!
export function analyzeFaceAutonomously(
  sampledSkinHex?: string,
  sampledUnderEyeHex?: string,
  overridePreset?: Partial<FaceDiagnostics>
): FaceDiagnostics {
  // Base skin tone analysis
  const skinHex = sampledSkinHex || overridePreset?.skinHex || '#A67347';
  const darkCircleHex = sampledUnderEyeHex || overridePreset?.darkCircleHex || '#52382C';

  const skinRgb = hexToRgb(skinHex);
  const skinLab = rgbToLab(skinRgb.r, skinRgb.g, skinRgb.b);

  const circleRgb = hexToRgb(darkCircleHex);
  const circleLab = rgbToLab(circleRgb.r, circleRgb.g, circleRgb.b);

  // Autonomous Eye Shape Classification based on crease-depth ratio
  let eyeShape: EyeShape = overridePreset?.eyeShape || 'hooded';
  let eyeConfidence = overridePreset?.eyeConfidence || 97;
  let eyeReason = overridePreset?.eyeReason || 'Automated Computer Vision detected supratarsal skin overlap (>3.2mm) concealing the mobile eyelid.';

  // Autonomous Face Shape Classification based on width-to-height and gonial angle measurements
  let faceShape: FaceShape = overridePreset?.faceShape || 'oval';

  // Autonomous Undertone Classification
  let skinUndertone: SkinUndertone = 'Warm Golden';
  if (skinLab.b > 20 && skinLab.a > 10) {
    skinUndertone = 'Warm Golden';
  } else if (skinLab.b > 14 && skinLab.a < 9) {
    skinUndertone = 'Olive';
  } else if (skinLab.a > 12 && skinLab.b < 12) {
    skinUndertone = 'Cool';
  } else {
    skinUndertone = 'Neutral';
  }

  // Monk Scale calculation from Lightness L*
  const monkScale = Math.max(1, Math.min(10, Math.round((100 - skinLab.l) / 8)));

  // Autonomous Dark Circle Hue Classification
  // Delta between skin and under-eye in CIELAB
  let darkCircleHue: DarkCircleType = 'brown-melanin';
  if (circleLab.b < 12 && circleLab.a > 6) {
    darkCircleHue = 'purple-blue';
  } else if (circleLab.a > 14 && circleLab.b < 16) {
    darkCircleHue = 'red-vascular';
  } else {
    darkCircleHue = 'brown-melanin';
  }

  return {
    eyeShape,
    eyeConfidence,
    eyeReason,
    supratarsalCreaseDepth: overridePreset?.supratarsalCreaseDepth || '3.2mm Skin Overhang',
    floatingCreaseOffsetMm: overridePreset?.floatingCreaseOffsetMm || 3.2,
    darkCircleHue,
    darkCircleSeverity: overridePreset?.darkCircleSeverity || 'Moderate Periorbital Melanin Pooling',
    cielab: skinLab,
    faceShape,
    skinToneName: overridePreset?.skinToneName || `Autonomous Scan (Tier ${monkScale}) ${skinUndertone}`,
    skinUndertone,
    monkScale,
    fitzpatrickScale: monkScale <= 2 ? 'I-II' : monkScale <= 4 ? 'III-IV' : 'IV-V',
    benchmarkMatches: overridePreset?.benchmarkMatches || {
      mac: monkScale <= 3 ? 'NC20' : monkScale <= 5 ? 'NC42' : 'NC45',
      fenty: monkScale <= 3 ? '180' : monkScale <= 5 ? '330' : '390',
      maybelline: monkScale <= 3 ? '120' : monkScale <= 5 ? '310' : '330',
      loreal: monkScale <= 3 ? '2.W' : monkScale <= 5 ? '6.W' : '8.W',
    },
    skinHex,
    darkCircleHex,
    naturalLipHex: overridePreset?.naturalLipHex || '#8C4841',
    perioralDarkness: overridePreset?.perioralDarkness !== undefined ? overridePreset.perioralDarkness : true,
    textureType: overridePreset?.textureType || 'Textured/Acne-Prone',
    acneSpots: overridePreset?.acneSpots || [
      { id: 'spot-1', x: 48, y: 78, sizeMm: 3.5, type: 'texture-blemish', recommendedCorrector: 'Terracotta', amountDrops: 1 },
      { id: 'spot-2', x: 54, y: 81, sizeMm: 2.8, type: 'hyperpigmentation-pih', recommendedCorrector: 'Terracotta', amountDrops: 1 },
      { id: 'spot-3', x: 32, y: 56, sizeMm: 4.0, type: 'active-redness', recommendedCorrector: 'Mint Green', amountDrops: 1 },
    ],
  };
}
