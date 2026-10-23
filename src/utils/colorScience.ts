import { DarkCircleType, DispensaryBatch, MakeupLook, PigmentRatio, SkinUndertone } from '../types/makeup';

// RGB to CIELAB conversion
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

// Convert RGB to CIELAB (D65 standard illuminant, standard 2-degree observer)
export function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  // Normalize RGB to sRGB linear
  let sR = r / 255;
  let sG = g / 255;
  let sB = b / 255;

  sR = sR > 0.04045 ? Math.pow((sR + 0.055) / 1.055, 2.4) : sR / 12.92;
  sG = sG > 0.04045 ? Math.pow((sG + 0.055) / 1.055, 2.4) : sG / 12.92;
  sB = sB > 0.04045 ? Math.pow((sB + 0.055) / 1.055, 2.4) : sB / 12.92;

  // Convert to XYZ
  let x = (sR * 0.4124 + sG * 0.3576 + sB * 0.1805) / 0.95047;
  let y = (sR * 0.2126 + sG * 0.7152 + sB * 0.0722) / 1.00000;
  let z = (sR * 0.0193 + sG * 0.1192 + sB * 0.9505) / 1.08883;

  const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116);

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    l: Math.round(116 * fy - 16),
    a: Math.round(500 * (fx - fy)),
    b: Math.round(200 * (fy - fz)),
  };
}

// Kubelka-Munk Subtractive Pigment Blender:
// White (Titanium Dioxide - scattering S), Yellow (absorbs blue),
// Red (absorbs cyan/green), Blue (absorbs red/yellow), Olive (absorbs high reds and neutralizes).
export function formulateFoundation(skinHex: string, undertone: SkinUndertone): PigmentRatio {
  const rgb = hexToRgb(skinHex);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);

  // Lightness (L) controls White %
  // L ranges from ~25 (deep) to ~85 (very fair)
  const normalizedL = Math.max(20, Math.min(90, lab.l));
  
  // Base medium provides viscosity, hydration, and carrier suspension
  const basePercent = 65;
  const remaining = 100 - basePercent; // 35% active pigments

  // Higher L -> more White
  const whiteRatio = (normalizedL - 20) / 70; // 0.0 to 1.0
  const whitePercent = Math.round(remaining * (0.35 + whiteRatio * 0.45)); // ~14% to 28%
  
  const pigmentBudget = remaining - whitePercent;

  let yellowPercent = 0;
  let redPercent = 0;
  let bluePercent = 0;
  let olivePercent = 0;

  if (undertone === 'Warm') {
    yellowPercent = Math.round(pigmentBudget * 0.60);
    redPercent = Math.round(pigmentBudget * 0.28);
    bluePercent = Math.round(pigmentBudget * 0.04);
    olivePercent = Math.max(1, pigmentBudget - yellowPercent - redPercent - bluePercent);
  } else if (undertone === 'Olive') {
    yellowPercent = Math.round(pigmentBudget * 0.42);
    redPercent = Math.round(pigmentBudget * 0.20);
    bluePercent = Math.round(pigmentBudget * 0.08);
    olivePercent = Math.max(1, pigmentBudget - yellowPercent - redPercent - bluePercent);
  } else if (undertone === 'Cool') {
    yellowPercent = Math.round(pigmentBudget * 0.35);
    redPercent = Math.round(pigmentBudget * 0.45);
    bluePercent = Math.round(pigmentBudget * 0.15);
    olivePercent = Math.max(1, pigmentBudget - yellowPercent - redPercent - bluePercent);
  } else {
    // Neutral
    yellowPercent = Math.round(pigmentBudget * 0.48);
    redPercent = Math.round(pigmentBudget * 0.32);
    bluePercent = Math.round(pigmentBudget * 0.08);
    olivePercent = Math.max(1, pigmentBudget - yellowPercent - redPercent - bluePercent);
  }

  // Calculate drop counts for 1 single-day portion (~0.8 mL)
  // 1 micro-drop = 0.02 mL
  const drops = {
    white: Math.max(1, Math.round(whitePercent / 4)),
    yellow: Math.max(1, Math.round(yellowPercent / 3)),
    red: Math.max(1, Math.round(redPercent / 3)),
    blue: Math.max(0, Math.round(bluePercent / 3)),
    olive: Math.max(0, Math.round(olivePercent / 3)),
    basePumps: 2,
  };

  return {
    white: whitePercent,
    yellow: yellowPercent,
    red: redPercent,
    blue: bluePercent,
    olive: olivePercent,
    base: basePercent,
    drops,
    totalMl: 0.8,
    resultHex: skinHex,
  };
}

// Formulate Under-Eye Color-Correcting Concealer
export function formulateCorrector(darkCircleType: DarkCircleType, skinL: number): {
  ratio: PigmentRatio;
  correctorType: 'Peach' | 'Salmon' | 'Terracotta' | 'Mint Green';
  targetIssue: string;
} {
  let correctorType: 'Peach' | 'Salmon' | 'Terracotta' | 'Mint Green' = 'Peach';
  let targetIssue = 'Purple-blue under-eye vascular shadow';
  let resultHex = '#F7A776';

  let white = 18;
  let yellow = 12;
  let red = 8;
  let blue = 0;
  let olive = 0;
  const base = 62;

  if (darkCircleType === 'purple-blue') {
    if (skinL > 65) {
      correctorType = 'Salmon';
      targetIssue = 'Cool blue tear-trough hollow on fair to light skin';
      resultHex = '#FFAC90';
      white = 22;
      yellow = 8;
      red = 8;
    } else {
      correctorType = 'Peach';
      targetIssue = 'Violet-blue shadows on medium skin';
      resultHex = '#F49B6A';
      white = 16;
      yellow = 14;
      red = 8;
    }
  } else if (darkCircleType === 'brown-melanin') {
    correctorType = 'Terracotta';
    targetIssue = 'Deep melanin hyperpigmentation and brown shadows';
    resultHex = '#D96E34';
    white = 10;
    yellow = 14;
    red = 13;
    olive = 1;
  } else if (darkCircleType === 'red-vascular') {
    correctorType = 'Mint Green';
    targetIssue = 'Redness, micro-capillary inflammation or blemishes';
    resultHex = '#98C9A3';
    white = 20;
    yellow = 8;
    red = 0;
    blue = 6;
    olive = 4;
  }

  const drops = {
    white: Math.max(1, Math.round(white / 4)),
    yellow: Math.max(1, Math.round(yellow / 3)),
    red: Math.max(0, Math.round(red / 3)),
    blue: Math.max(0, Math.round(blue / 3)),
    olive: Math.max(0, Math.round(olive / 3)),
    basePumps: 1,
  };

  return {
    ratio: {
      white,
      yellow,
      red,
      blue,
      olive,
      base,
      drops,
      totalMl: 0.4,
      resultHex,
    },
    correctorType,
    targetIssue,
  };
}

// Formulate Custom Lipstick based on Look Preset & Skin Undertone
export function formulateLipstick(look: MakeupLook, undertone: SkinUndertone): PigmentRatio {
  let white = 4;
  let yellow = 10;
  let red = 30;
  let blue = 2;
  let olive = 0;
  const base = 54; // Balm/wax base medium

  if (look.id === 'clean-girl') {
    // Sheer strawberry-nude gloss
    white = 6;
    yellow = 8;
    red = 18;
    blue = 1;
    olive = 0;
  } else if (look.id === 'k-beauty') {
    // Popsicle cherry gradient
    white = 2;
    yellow = 6;
    red = 36;
    blue = 3;
    olive = 0;
  } else if (look.id === 'mexican-glam') {
    // Deep warm spiced cocoa / 90s contour ombre
    white = 3;
    yellow = 14;
    red = 24;
    blue = 2;
    olive = 4; // Olive adds depth and rich chocolate undertone
  } else if (look.id === 'hollywood-glam') {
    // True blue-red classic velvet crimson
    white = 2;
    yellow = 4;
    red = 38;
    blue = 3;
    olive = 0;
  } else {
    // Festive shimmer warm golden peach
    white = 5;
    yellow = 16;
    red = 20;
    blue = 1;
    olive = 1;
  }

  // Undertone adjustments:
  if (undertone === 'Warm') {
    yellow += 2;
    blue = Math.max(0, blue - 1);
  } else if (undertone === 'Cool') {
    blue += 2;
    yellow = Math.max(0, yellow - 2);
  }

  const drops = {
    white: Math.max(0, Math.round(white / 3)),
    yellow: Math.max(1, Math.round(yellow / 3)),
    red: Math.max(1, Math.round(red / 4)),
    blue: Math.max(0, Math.round(blue / 2)),
    olive: Math.max(0, Math.round(olive / 2)),
    basePumps: 1,
  };

  return {
    white,
    yellow,
    red,
    blue,
    olive,
    base,
    drops,
    totalMl: 0.5,
    resultHex: look.lipColorHex,
  };
}

// Generate the complete 3-well dispensary batch
export function generateDispensaryBatch(
  skinHex: string,
  undertone: SkinUndertone,
  darkCircleType: DarkCircleType,
  look: MakeupLook
): DispensaryBatch {
  const foundationRatio = formulateFoundation(skinHex, undertone);
  const rgb = hexToRgb(skinHex);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const correctorResult = formulateCorrector(darkCircleType, lab.l);
  const lipstickRatio = formulateLipstick(look, undertone);

  return {
    foundation: {
      ...foundationRatio,
      shadeName: `Custom Match ${lab.l > 60 ? 'Light' : lab.l > 40 ? 'Medium' : 'Deep'} ${undertone}`,
      coverage: look.id === 'clean-girl' ? 'Sheer' : look.id === 'mexican-glam' ? 'Full' : 'Medium',
    },
    corrector: {
      ...correctorResult.ratio,
      correctorType: correctorResult.correctorType,
      targetIssue: correctorResult.targetIssue,
    },
    lipstick: {
      ...lipstickRatio,
      shadeName: look.lipShadeName,
      finish: look.lipFinish,
    },
  };
}
