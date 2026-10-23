import { LookMood, RoutineStep } from '../types/glowguide';

export const LOOK_MOODS: LookMood[] = [
  {
    id: 'clean',
    name: 'Clean girl',
    tagline: 'Fresh, dewy, minimal',
    finish: 'Fresh, skin-like glow',
    eyes: 'Soft brown tightline; brushed fluffy brows',
    cheeks: 'Cream blush, subtle glazed highlight',
    lips: 'Tinted lip oil or peptide balm',
    description: 'An effortless, breathable aesthetic prioritizing plump hydration, sheer veil base, and feathered brows.'
  },
  {
    id: 'everyday',
    name: 'Natural everyday',
    tagline: 'Soft definition',
    finish: 'Natural satin',
    eyes: 'Soft neutral shadow and defined mascara',
    cheeks: 'Muted rose blush close to natural flush',
    lips: 'Your-lips-but-better hydrating shade',
    description: 'Balanced, long-wearing polish suited for professional work, classes, and day-to-evening transitions.'
  },
  {
    id: 'korean',
    name: 'Korean natural',
    tagline: 'Blurred, airy, gradient',
    finish: 'Thin, softly blurred glass base',
    eyes: 'Subtle aegyo-sal contour; soft puppy eyeliner',
    cheeks: 'Diffused pastel blush high on cheek apples',
    lips: 'Gradient tint with blurred outer borders',
    description: 'K-beauty inspired watercolor complexion, illuminated under-eye contours, and juicy stained center lips.'
  },
  {
    id: 'glam',
    name: 'Soft glam',
    tagline: 'Polished, sculpted',
    finish: 'Luminous satin, buildable coverage',
    eyes: 'Seamless transition contour, balanced soft wing',
    cheeks: 'Chiseled cheekbone contour with lifted blush',
    lips: 'Defined nude or rose lip with matching pencil',
    description: 'Red-carpet ready dimension with blurred pores, strategic high-contrast sculpt, and camera-ready durability.'
  },
  {
    id: 'latina',
    name: 'Latina-inspired glam',
    tagline: 'Defined eyes and lips',
    finish: 'Warm, polished, sculpted velvet',
    eyes: 'Snatching cat-eye liner, softly smoked outer corner',
    cheeks: 'Warm bronzer with high-angle cheekbone drape',
    lips: 'Deep brown liner blended inward with glossy center',
    description: 'Warm golden drama featuring razor-sharp wings, baked highlight zones, and iconic 90s contoured ombré lips.'
  },
  {
    id: 'editorial',
    name: 'Creative / editorial',
    tagline: 'Colour and shape',
    finish: 'Intentional statement finish',
    eyes: 'Graphic floating liner or vibrant color placement',
    cheeks: 'Choose one bold focal point; draped wash',
    lips: 'Monochromatic coordination or contrasting pop',
    description: 'High-fashion runway expression playing with negative space, architectural pigment lines, and avant-garde texture.'
  }
];

export const ROUTINE_STEPS: RoutineStep[] = [
  {
    id: 0,
    title: 'Skin prep',
    short: 'Prep',
    label: 'PREP',
    tagline: 'Hydrate & Barrier Prime',
    defaultText: 'Start with clean, moisturized skin. Give skincare 2–3 minutes to settle before applying base products. For oily skin, use a light gel moisturizer; for dry skin, choose a richer hydrating layer.',
    caption: 'Apply skincare evenly across forehead, cheeks, and neck; allow it to fully settle before base layers.'
  },
  {
    id: 1,
    title: 'Primer',
    short: 'Primer',
    label: 'PRIMER',
    tagline: 'Pores & Grip Control',
    defaultText: 'Use a thin layer where it helps: smoothing primer around visible pores in the T-zone, gripping primer where makeup fades, or hydrating primer on dry areas. Avoid piling on excess product.',
    caption: 'Target primer only where useful: T-zone pores, smile lines, or dry perimeter.'
  },
  {
    id: 2,
    title: 'Colour correct',
    short: 'Corrector',
    label: 'CORRECTOR',
    tagline: 'Neutralize Shadows & Redness',
    defaultText: 'Use the smallest amount only where needed. Peach/salmon softens blue-purple under-eye shadows (deeper skin tones need warm orange); pistachio green neutralizes localized redness around nostrils and blemishes.',
    caption: 'Peach/orange cancels under-eye venous shadows; green neutralizes localized redness beside nostrils.'
  },
  {
    id: 3,
    title: 'Foundation & concealer',
    short: 'Base',
    label: 'BASE',
    tagline: 'Unified Veil & Eye Lift',
    defaultText: 'Match foundation to your jaw/neck in daylight; allow for oxidation. Buff in a sheer micro-layer. Apply concealer only where needed: inner tear trough and an upward flick at the outer corner for an instant lift.',
    caption: 'Thin base coverage blended down jawline; brightening concealer placed for an upward lifting angle.'
  },
  {
    id: 4,
    title: 'Eyes, brows & cheeks',
    short: 'Features',
    label: 'DETAIL',
    tagline: 'Architectural Sculpt',
    defaultText: 'Adapt placement to your eye shape. For hooded eyes, apply transition shadow slightly above the anatomical fold and draw eyeliner with eyes open. Blend blush upward along the zygomatic arch.',
    caption: 'Placement for defined eyes, lifted cheek draping, and balanced lip shape matching your chosen aesthetic.'
  },
  {
    id: 5,
    title: 'Set & final check',
    short: 'Finish',
    label: 'FINISH',
    tagline: 'Lock & Natural Daylight Check',
    defaultText: 'Set only areas that crease or get shiny with a velour puff. Check symmetry, hairline, nose corners, and under-eyes in natural daylight. Take a short step back, then inspect for patchiness or transfer.',
    caption: 'Press powder into crease zones and smile lines; check symmetry and hairline in natural window daylight.'
  }
];

export const PREFERRED_BRANDS = [
  'any',
  'Swiss Beauty',
  'MARS',
  'MAC Cosmetics',
  'Huda Beauty',
  'TIRTIR',
  'Maybelline',
  'L\'Oréal Paris',
  'e.l.f. Cosmetics',
  'Hilary Rhoda',
  'Rare Beauty',
  'Charlotte Tilbury'
];
