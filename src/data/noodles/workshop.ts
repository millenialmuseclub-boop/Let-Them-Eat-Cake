import type { Lab, TroubleshooterProblem } from '../../types/noodles/workshop';

export const labs: Lab[] = [
  {
    slug: 'noodle-anatomy',
    title: 'Noodle Anatomy',
    group: 'understand',
    summary: 'What actually makes one noodle different from another: base, form, and technique.',
    relatedDishIds: ['biang-biang-mian'],
    variables: [
      {
        id: 'base',
        label: 'Base',
        options: [
          { id: 'wheat', label: 'Wheat', description: 'Gluten-forward, elastic, holds a chew.', bars: [{ label: 'Chew', value: 4 }, { label: 'Stretch', value: 4 }, { label: 'Neutral flavor', value: 3 }] },
          { id: 'rice', label: 'Rice', description: 'Gluten-free, softer, more delicate structure.', bars: [{ label: 'Chew', value: 2 }, { label: 'Stretch', value: 1 }, { label: 'Neutral flavor', value: 4 }] },
          { id: 'buckwheat', label: 'Buckwheat', description: 'Low gluten, nutty, needs gentle handling.', bars: [{ label: 'Chew', value: 3 }, { label: 'Stretch', value: 1 }, { label: 'Neutral flavor', value: 2 }] },
          { id: 'starch', label: 'Starch (sweet potato, mung bean)', description: 'No gluten at all — glassy, springy, extruded.', bars: [{ label: 'Chew', value: 5 }, { label: 'Stretch', value: 2 }, { label: 'Neutral flavor', value: 5 }] },
        ],
      },
    ],
  },
  {
    slug: 'hydration-lab',
    title: 'Hydration Lab',
    group: 'foundations',
    summary: 'How much water a dough holds changes everything downstream — stretch, chew, and cook time.',
    relatedDishIds: ['wonton-noodles'],
    variables: [
      {
        id: 'hydration',
        label: 'Hydration Level',
        options: [
          { id: 'low', label: 'Low (~30%)', description: 'Firm, dense dough. Needs more kneading force.', bars: [{ label: 'Stretch ease', value: 1 }, { label: 'Final chew', value: 5 }, { label: 'Tear risk', value: 3 }] },
          { id: 'medium', label: 'Medium (~40%)', description: 'The standard range for most hand-pulled and cut noodles.', bars: [{ label: 'Stretch ease', value: 3 }, { label: 'Final chew', value: 4 }, { label: 'Tear risk', value: 2 }] },
          { id: 'high', label: 'High (~50%+)', description: 'Slack, extensible dough, easier to stretch but harder to shape cleanly.', bars: [{ label: 'Stretch ease', value: 5 }, { label: 'Final chew', value: 2 }, { label: 'Tear risk', value: 1 }] },
        ],
      },
    ],
  },
  {
    slug: 'dough-lab',
    title: 'Dough Lab',
    group: 'foundations',
    summary: 'Resting time and kneading intensity, and what each actually does to gluten development.',
    variables: [
      {
        id: 'rest-time',
        label: 'Rest Time',
        options: [
          { id: 'short', label: 'Under 30 min', description: 'Gluten is still tight — dough resists stretching and snaps back hard.', bars: [{ label: 'Extensibility', value: 1 }, { label: 'Snap-back', value: 5 }] },
          { id: 'medium', label: '1–2 hours', description: 'The standard window for most wheat noodle doughs.', bars: [{ label: 'Extensibility', value: 3 }, { label: 'Snap-back', value: 3 }] },
          { id: 'long', label: '4+ hours', description: 'Gluten relaxes fully — dough pulls and rolls with very little resistance.', bars: [{ label: 'Extensibility', value: 5 }, { label: 'Snap-back', value: 1 }] },
        ],
      },
    ],
    relatedNoodleTypeIds: ['lamian', 'biang-biang', 'udon'],
    relatedDishIds: ['sanuki-udon'],
  },
  {
    slug: 'rice-noodle-lab',
    title: 'Rice Noodle Lab',
    group: 'foundations',
    summary: 'Rice noodles behave completely differently from wheat — no gluten means no kneading, no resting, and much more careful handling.',
    relatedDishIds: ['pho-bo'],
    variables: [
      {
        id: 'form',
        label: 'Form',
        options: [
          { id: 'fresh-sheet', label: 'Fresh Steamed Sheet', description: 'Soft and tender right away — tears easily until it firms up slightly on cooling.', bars: [{ label: 'Fragility', value: 4 }, { label: 'Slipperiness', value: 5 }] },
          { id: 'dried-vermicelli', label: 'Dried Vermicelli', description: 'Needs a soak or brief boil to rehydrate before use — never dropped dry into a hot wok.', bars: [{ label: 'Fragility', value: 2 }, { label: 'Slipperiness', value: 3 }] },
        ],
      },
    ],
    relatedNoodleTypeIds: ['banh-pho', 'shahe-fen', 'rice-vermicelli'],
  },
  {
    slug: 'shape-lab',
    title: 'Shape Lab',
    group: 'form',
    summary: 'How the same dough becomes a strand, a ribbon, or a hand-torn belt.',
    relatedDishIds: ['kalguksu'],
    variables: [
      {
        id: 'shaping-method',
        label: 'Shaping Method',
        options: [
          { id: 'knife-cut', label: 'Knife-Cut', description: 'Rolled thin, then sliced into uniform strands.', bars: [{ label: 'Uniformity', value: 5 }, { label: 'Speed', value: 3 }] },
          { id: 'hand-torn', label: 'Hand-Torn', description: 'Slapped and ripped by hand into short, wide, irregular ribbons.', bars: [{ label: 'Uniformity', value: 1 }, { label: 'Speed', value: 4 }] },
          { id: 'extruded', label: 'Extruded', description: 'Batter or dough forced through a die into the cooking water.', bars: [{ label: 'Uniformity', value: 4 }, { label: 'Speed', value: 5 }] },
        ],
      },
    ],
  },
  {
    slug: 'hand-pulled-lab',
    title: 'Hand-Pulled Lab',
    group: 'form',
    summary: 'The stretch-and-fold sequence that turns a rested dough rope into thin strands.',
    variables: [
      {
        id: 'fold-count',
        label: 'Number of Stretch-Folds',
        options: [
          { id: 'few', label: '3–4 folds', description: 'Yields a thick, hearty strand.', bars: [{ label: 'Final thinness', value: 1 }, { label: 'Strand count from one rope', value: 1 }] },
          { id: 'standard', label: '6–7 folds', description: 'The common range for a standard lamian strand.', bars: [{ label: 'Final thinness', value: 3 }, { label: 'Strand count from one rope', value: 3 }] },
          { id: 'many', label: '9+ folds', description: 'Produces very fine, almost hair-thin strands — needs a strong, well-rested dough to survive it.', bars: [{ label: 'Final thinness', value: 5 }, { label: 'Strand count from one rope', value: 5 }] },
        ],
      },
    ],
    relatedNoodleTypeIds: ['lamian'],
    relatedDishIds: ['lanzhou-lamian'],
  },
  {
    slug: 'stir-fry-technique',
    title: 'Stir-Fry / Wok Technique',
    group: 'bowl',
    summary: 'High heat, short contact time, and not overcrowding the pan — the three variables that separate charred noodles from steamed ones.',
    relatedDishIds: ['pad-thai'],
    variables: [
      {
        id: 'heat-and-motion',
        label: 'Heat & Batch Size',
        options: [
          { id: 'high-small-batch', label: 'High heat, small batch', description: 'Noodles sear and pick up wok hei quickly.', bars: [{ label: 'Char', value: 5 }, { label: 'Sogginess risk', value: 1 }] },
          { id: 'high-large-batch', label: 'High heat, overcrowded pan', description: 'Noodles steam in their own released moisture instead of searing.', bars: [{ label: 'Char', value: 1 }, { label: 'Sogginess risk', value: 5 }] },
          { id: 'low-heat', label: 'Low heat, any batch size', description: 'Noodles warm through without ever developing char.', bars: [{ label: 'Char', value: 0 }, { label: 'Sogginess risk', value: 3 }] },
        ],
      },
    ],
  },
  {
    slug: 'broth-sauce-lab',
    title: 'Broth + Sauce Lab',
    group: 'bowl',
    summary: 'The difference between a clear broth, a rich coconut curry, and a dry-tossed sauce comes down to fat, reduction, and thickeners.',
    relatedDishIds: ['khao-soi'],
    variables: [
      {
        id: 'liquid-style',
        label: 'Liquid Style',
        options: [
          { id: 'clear-broth', label: 'Clear Broth', description: 'Gentle simmer, frequent skimming, minimal fat emulsification.', bars: [{ label: 'Richness', value: 2 }, { label: 'Clarity', value: 5 }] },
          { id: 'creamy-broth', label: 'Coconut / Emulsified Broth', description: 'Built on coconut milk or a hard boil that emulsifies fat into the liquid.', bars: [{ label: 'Richness', value: 5 }, { label: 'Clarity', value: 1 }] },
          { id: 'dry-sauce', label: 'Dry-Tossed Sauce', description: 'A small amount of concentrated sauce meant to coat, not pool.', bars: [{ label: 'Richness', value: 3 }, { label: 'Clarity', value: 0 }] },
        ],
      },
    ],
  },
];

export const troubleshooterProblems: TroubleshooterProblem[] = [
  {
    id: 'wont-stretch',
    problem: "Dough won't stretch",
    diagnosticQuestions: ['How long has the dough rested?', 'Does it snap back immediately when pulled?'],
    causes: [
      { cause: 'Under-rested dough', correction: 'Rest the dough longer, covered, before attempting to pull — gluten needs time to relax.', relatedComponentCategory: 'dough' },
      { cause: 'Hydration too low', correction: 'Add a small amount of water and re-knead; a drier dough resists stretching.', relatedComponentCategory: 'dough' },
    ],
    relatedLessonSlug: 'hydration-lab',
  },
  {
    id: 'noodles-snapping',
    problem: 'Noodles keep snapping',
    diagnosticQuestions: ['Is this during pulling/shaping, or during cooking?'],
    causes: [
      { cause: 'Dough too dry', correction: 'Increase hydration slightly and rest longer before shaping.' },
      { cause: 'Pulled too aggressively without enough rest between folds', correction: 'Let the dough rest 2–3 minutes between stretch-folds so gluten can relax again.' },
    ],
    relatedLessonSlug: 'hand-pulled-lab',
  },
  {
    id: 'dough-too-sticky',
    problem: 'Dough too sticky',
    diagnosticQuestions: ['Is it sticking to your hands, or to the work surface?'],
    causes: [
      { cause: 'Hydration too high for the technique', correction: 'Dust lightly with flour or reduce water slightly next batch — very high hydration suits extruded, not hand-shaped, noodles.' },
      { cause: 'Under-kneaded', correction: 'Continue kneading; gluten development reduces surface stickiness over time.' },
    ],
    relatedLessonSlug: 'hydration-lab',
  },
  {
    id: 'dough-too-dry',
    problem: 'Dough too dry / crumbly',
    diagnosticQuestions: ['Does the dough hold together when pressed?'],
    causes: [
      { cause: 'Not enough water for the flour', correction: 'Add water a teaspoon at a time, kneading fully between additions.' },
    ],
    relatedLessonSlug: 'hydration-lab',
  },
  {
    id: 'noodles-sticking',
    problem: 'Noodles sticking together after cooking',
    diagnosticQuestions: ['Were they tossed with oil or sauce right after draining?'],
    causes: [
      { cause: 'No oil/sauce added immediately after draining', correction: 'Toss cooked noodles with a small amount of oil or sauce within a minute of draining.' },
      { cause: 'Rice noodles cooled without separation', correction: 'Rice noodles need to be gently separated by hand while still warm and pliable.', relatedComponentCategory: 'rice-noodle' },
    ],
    relatedLessonSlug: 'rice-noodle-lab',
  },
  {
    id: 'noodles-too-soft',
    problem: 'Noodles too soft / mushy',
    diagnosticQuestions: ['Were they cooked past the recommended time?'],
    causes: [
      { cause: 'Overcooked', correction: 'Reduce cook time and test frequently near the end — buckwheat and rice noodles overcook especially fast.' },
    ],
  },
  {
    id: 'noodles-too-chewy',
    problem: 'Noodles too tough / chewy',
    diagnosticQuestions: ['Were they undercooked, or is the dough itself very low-hydration?'],
    causes: [
      { cause: 'Undercooked', correction: 'Extend cook time slightly and retest.' },
      { cause: 'Dough hydration too low for the intended texture', correction: 'Increase hydration slightly for a more tender final bite.' },
    ],
  },
  {
    id: 'noodles-breaking',
    problem: 'Fresh rice noodles breaking apart',
    diagnosticQuestions: ['Are you separating or tossing them while cold and stiff?'],
    causes: [
      { cause: 'Handled while too cold', correction: 'Warm fresh rice noodle sheets briefly before separating — cold sheets crack instead of unrolling.' },
    ],
    relatedLessonSlug: 'rice-noodle-lab',
  },
  {
    id: 'sauce-wont-cling',
    problem: "Sauce won't cling to the noodles",
    diagnosticQuestions: ['Is there excess water on the noodles from draining?'],
    causes: [
      { cause: 'Noodles too wet when sauced', correction: 'Drain thoroughly, or reserve noodle-cooking water and use a splash to help the sauce bind instead of dilute.' },
      { cause: 'Sauce too thin', correction: 'Reduce the sauce slightly over heat before tossing, so it coats rather than pools.' },
    ],
    relatedLessonSlug: 'broth-sauce-lab',
  },
  {
    id: 'soup-dilutes-flavor',
    problem: 'Soup broth tastes diluted',
    diagnosticQuestions: ['Was the broth simmered long enough, and reduced or just topped up with water throughout?'],
    causes: [
      { cause: 'Under-extracted or over-diluted broth', correction: 'Simmer longer, or reduce the finished broth briefly before serving to concentrate flavor.' },
      { cause: 'Under-seasoned', correction: 'Season in stages and taste as you go — broth needs noticeably more salt than most dishes to read as "seasoned" once diluted by noodles.' },
    ],
    relatedLessonSlug: 'broth-sauce-lab',
  },
  {
    id: 'stir-fried-soggy',
    problem: 'Stir-fried noodles turn soggy instead of charred',
    diagnosticQuestions: ['Was the pan hot enough before the noodles went in? Were they crowded?'],
    causes: [
      { cause: 'Pan not hot enough', correction: 'Preheat the wok until faintly smoking before adding oil and noodles.' },
      { cause: 'Overcrowded pan', correction: 'Cook in smaller batches so noodles contact the hot surface directly instead of steaming each other.' },
    ],
  },
  {
    id: 'noodles-clumping-in-wok',
    problem: 'Noodles clump together in the wok',
    diagnosticQuestions: ['Were the noodles separated before they went in? Were they added all at once cold from the fridge?'],
    causes: [
      { cause: 'Noodles not separated before cooking', correction: 'Gently loosen fresh noodles by hand (warming briefly if stiff) before they hit the pan — noodles that go in already stuck together stay stuck together.' },
      { cause: 'Too little oil for the batch size', correction: 'Add a touch more oil and toss immediately on contact rather than letting the noodles sit in a dry pan.' },
    ],
    relatedLessonSlug: 'stir-fry-technique',
  },
  {
    id: 'stir-fry-watery',
    problem: 'Stir-fry turns watery instead of glossy',
    diagnosticQuestions: ['Were vegetables added before or after searing the protein? Was the pan crowded?'],
    causes: [
      { cause: 'Vegetables released water into an already-crowded pan', correction: 'Sear protein and aromatics first in a hot, uncrowded pan, then add quick-cooking vegetables last so their released water flashes off instead of pooling.' },
      { cause: 'Sauce added too early and simmered instead of tossed', correction: 'Add sauce at the very end and toss hard for a short burst of high heat, not a simmer.' },
    ],
    relatedLessonSlug: 'stir-fry-technique',
  },
  {
    id: 'sauce-too-salty',
    problem: 'Sauce or broth tastes too salty',
    diagnosticQuestions: ['Did the recipe call for both soy sauce and fish sauce or shrimp paste? Was the sauce reduced further after salting?'],
    causes: [
      { cause: 'Over-reduced after seasoning', correction: 'Season fully-reduced sauces last, not before a further simmer — salt concentrates as liquid cooks off.' },
      { cause: 'Stacked salty ingredients without tasting between additions', correction: 'Add one salty ingredient (soy sauce, fish sauce, shrimp paste) at a time, tasting before the next.' },
    ],
    relatedLessonSlug: 'broth-sauce-lab',
  },
  {
    id: 'dish-feels-greasy',
    problem: 'Finished dish feels greasy rather than rich',
    diagnosticQuestions: ['Was excess oil drained or skimmed at any point? Was the pan too hot for the amount of oil used?'],
    causes: [
      { cause: 'Too much oil for the pan size', correction: 'Use just enough oil to coat the pan thinly for stir-fries — noodle dishes rely on heat and technique for flavor, not a deep oil pool.' },
      { cause: 'Broth fat never skimmed', correction: 'Skim rendered fat off the surface of a finished broth before serving, or use a fat separator.' },
    ],
  },
  {
    id: 'broth-overwhelms-noodles',
    problem: 'Broth overwhelms the noodles instead of complementing them',
    diagnosticQuestions: ['Is the broth very rich or spicy relative to a delicate noodle like rice vermicelli or somen?'],
    causes: [
      { cause: 'Mismatched richness between broth and noodle', correction: 'Pair delicate noodles (thin rice vermicelli, somen) with lighter broths, and reserve bold, rich broths (curry laksa, khao soi, boat noodles) for sturdier noodles that can stand up to them.' },
    ],
    relatedLessonSlug: 'broth-sauce-lab',
  },
];
