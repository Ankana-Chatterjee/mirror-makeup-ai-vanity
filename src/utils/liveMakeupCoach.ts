/**
 * Live Makeup Action & Technique Coach
 *
 * Real-time dynamic evaluation of makeup application actions:
 * - Detects whether user is doing it correctly OR if something went wrong
 * - Evaluates blending symmetry, line sharpness, edge demarcation, dosage
 * - Provides live corrective visual cues and optional voice speech prompts
 */

export interface ActionCoachFeedback {
  step: number;
  status: 'correct' | 'warning' | 'needs-fix' | 'analyzing';
  headline: string;
  detail: string;
  fixAction: string;
  blendingScore: number;     // 0 - 100%
  symmetryScore: number;     // 0 - 100%
  highlightZone: 'eyes' | 'jawline' | 'undereye' | 'cheeks' | 'lips' | 'forehead' | 'none';
  targetPointOffset?: { x: number; y: number }; // Relative offset for mirror canvas pointer
}

export const STEP_COACH_RULES: Record<number, {
  name: string;
  targetZone: 'eyes' | 'jawline' | 'undereye' | 'cheeks' | 'lips' | 'forehead';
  correctScenarios: { headline: string; detail: string; fixAction: string }[];
  mistakeScenarios: { headline: string; detail: string; fixAction: string }[];
}> = {
  1: {
    name: 'Spot Concealing & Prep',
    targetZone: 'undereye',
    correctScenarios: [
      {
        headline: 'Doing it correctly: Micro-dot Pinpointing',
        detail: 'Product deposited strictly on pigmented melanin points without masking natural skin texture.',
        fixAction: 'Keep tapping with fingertip warmth to melt product into skin.',
      },
      {
        headline: 'Doing it correctly: Thin Feathered Edges',
        detail: 'Zero excess product pooling in tear trough or smile folds.',
        fixAction: 'Proceed to foundation stippling once lightly set.',
      },
    ],
    mistakeScenarios: [
      {
        headline: 'Something went wrong: Concealer Pooled in Crease',
        detail: 'Excess product detected along lower inner tear duct (1.8mm pool).',
        fixAction: 'Dab lightly with damp mini-sponge to lift excess before it creases!',
      },
      {
        headline: 'Something went wrong: Heavy Masking',
        detail: 'Concealer spread over too wide an area beyond the target dark marks.',
        fixAction: 'Tap outer perimeter with bare clean finger to sheer out edges.',
      },
    ],
  },
  2: {
    name: 'Foundation & Blending',
    targetZone: 'jawline',
    correctScenarios: [
      {
        headline: 'Doing it correctly: Seamless Neck Transition',
        detail: 'Color gradients smoothly with zero demarcation line between face and neck.',
        fixAction: 'Maintain current light stippling pressure across cheeks.',
      },
      {
        headline: 'Doing it correctly: Uniform Stipple Pattern',
        detail: 'Optimal 0.15ml density detected with radiant skin sheen.',
        fixAction: 'Buff forehead with leftover sponge pigment only.',
      },
    ],
    mistakeScenarios: [
      {
        headline: 'Something went wrong: Harsh Jawline Boundary',
        detail: 'Visible foundation cutoff line detected along right mandible (jawline).',
        fixAction: 'Buff downward 2cm past jawline onto neck using circular stippling motions!',
      },
      {
        headline: 'Something went wrong: Patchiness Near Hairline',
        detail: 'Unblended pigment boundary spotted 1cm from upper hairline.',
        fixAction: 'Feather sponge upward into root line to blend edge seamlessly.',
      },
    ],
  },
  3: {
    name: 'Winged Eyeliner & Crease',
    targetZone: 'eyes',
    correctScenarios: [
      {
        headline: 'Doing it correctly: Symmetrical 24° Wing Angle',
        detail: 'Both left and right wings cleanly align with the lower lash line extension.',
        fixAction: 'Trace sharp flick across hooded fold with eyes looking forward.',
      },
      {
        headline: 'Doing it correctly: Floating Crease Clearance',
        detail: 'Transition shadow placed 3.5mm above fold, visible with open eyes.',
        fixAction: 'Gently soften upper edge with clean blending brush.',
      },
    ],
    mistakeScenarios: [
      {
        headline: 'Something went wrong: Drooping Wing Angle',
        detail: 'Right wing angle is 6° lower than left wing, dragging eye downward.',
        fixAction: 'Clean bottom edge with angled brush & concealer; flick upward toward temple!',
      },
      {
        headline: 'Something went wrong: Eyeliner Caught in Hood Fold',
        detail: 'Liner drawn inside crease fold, causing smudging upon blinking.',
        fixAction: 'Step over fold with a batwing notch or apply while eyes look straight ahead.',
      },
    ],
  },
  4: {
    name: 'Cheekbone Sculpt & Blush',
    targetZone: 'cheeks',
    correctScenarios: [
      {
        headline: 'Doing it correctly: High-Apex Cheekbone Lift',
        detail: 'Blush centered on upper zygomatic bone with contour buffed upward.',
        fixAction: 'Blend into temples for sculpted radiant dimension.',
      },
      {
        headline: 'Doing it correctly: Balanced Bilateral Flush',
        detail: 'Cheek color saturation matched evenly between left and right sides.',
        fixAction: 'Lightly dust translucent setting powder over perimeter.',
      },
    ],
    mistakeScenarios: [
      {
        headline: 'Something went wrong: Contour Placed Too Low',
        detail: 'Shadow line extends 8mm below cheek hollow, pulling face down.',
        fixAction: 'Take damp sponge with leftover foundation and sweep underneath to lift contour line!',
      },
      {
        headline: 'Something went wrong: Uneven Blush Intensity',
        detail: 'Left cheek has +25% higher pigment density than right cheek.',
        fixAction: 'Buff left cheek with clean powder brush to balance saturation.',
      },
    ],
  },
  5: {
    name: 'Lip Liner & Precision Fill',
    targetZone: 'lips',
    correctScenarios: [
      {
        headline: 'Doing it correctly: Symmetrical Cupid\'s Bow',
        detail: 'Crisp twin peaks with centered philtrum alignment.',
        fixAction: 'Fill lip center with lipstick and gently press lips together.',
      },
      {
        headline: 'Doing it correctly: Clean Vermilion Border',
        detail: 'Zero feathering or bleeding outside natural lip contour.',
        fixAction: 'Optional: dab clear glaze in the center for 3D plumpness.',
      },
    ],
    mistakeScenarios: [
      {
        headline: 'Something went wrong: Asymmetrical Lower Lip',
        detail: 'Right lower corner overdrawn 2mm beyond vermilion border.',
        fixAction: 'Clean outer edge using flat concealer brush with a drop of foundation!',
      },
      {
        headline: 'Something went wrong: Smudged Lip Corner',
        detail: 'Pigment bleed detected at left oral commissure (mouth corner).',
        fixAction: 'Blot with tissue and sharpen edge with lip pencil.',
      },
    ],
  },
};

/**
 * Real-time Speech Voice Coach
 * Hands-free spoken instructions while user does makeup in front of the mirror.
 */
export function speakCoachPrompt(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Cancel any lingering speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
  }
}
