import type { Technique } from '../../types/noodles/noodle';

export const techniques: Technique[] = [
  {
    id: 'hand-pulled',
    name: 'Hand-Pulled',
    summary: 'Dough is stretched, folded, and repeatedly elongated by hand into strands.',
    longDescription:
      'A hydrated, well-rested wheat dough is repeatedly stretched and folded until it develops enough gluten strength to be pulled directly into long strands, often doubling with each fold. The technique depends on dough hydration and rest time as much as physical technique — see the Dough Lab and Hydration Lab in Workshop.',
    noodleTypeIds: ['lamian'],
  },
  {
    id: 'hand-torn',
    name: 'Hand-Torn / Slapped',
    summary: 'A wide dough sheet is slapped against a surface, then torn or ripped into wide noodles.',
    longDescription:
      'Rather than pulling to a thin strand, the dough is slapped against the work surface to both stretch and aerate it, then torn by hand (rather than cut) into short, wide, irregular ribbons — the source of the noodle\'s uneven, chewy bite.',
    noodleTypeIds: ['biang-biang'],
  },
  {
    id: 'knife-cut',
    name: 'Knife-Cut',
    summary: 'A rolled dough sheet or block is cut into strands with a blade.',
    longDescription:
      'A rested dough sheet is folded or rolled, then sliced into strands of a consistent width with a knife. This is the most common route to a uniform wheat noodle at home-kitchen scale.',
    noodleTypeIds: ['shuimian', 'naengmyeon-noodle'],
  },
  {
    id: 'rolled-and-cut',
    name: 'Rolled and Cut',
    summary: 'Dough is rolled thin with a pin or machine, then cut mechanically into uniform strands.',
    longDescription:
      'Dough is rolled to an even thickness (by hand with a pin, or by pasta-style rollers) and then cut into strands of consistent width, producing a more uniform noodle than hand techniques.',
    noodleTypeIds: ['udon', 'ba-mee'],
  },
  {
    id: 'extruded',
    name: 'Extruded',
    summary: 'A starch slurry or dough is forced through a die or press to form strands.',
    longDescription:
      'Rice or starch batter is pushed through small holes (traditionally a press over boiling water, today often machine-extruded) so it sets into strands as it cooks — the standard route to rice vermicelli and starch noodles, which cannot be pulled or kneaded like a gluten dough.',
    noodleTypeIds: ['rice-vermicelli', 'dangmyeon', 'laksa-noodle'],
  },
  {
    id: 'stretched',
    name: 'Steamed and Stretched',
    summary: 'A thin batter is steamed into a sheet, then rolled and cut, common to fresh rice noodles.',
    longDescription:
      'A wet rice batter is spread thin and steamed until set into a sheet, which is then rolled and cut into wide ribbons while still supple — the technique behind shahe fen / ho fun and bánh phở.',
    noodleTypeIds: ['banh-pho', 'shahe-fen'],
  },
  {
    id: 'shaved',
    name: 'Cold-Buckwheat Cut',
    summary: 'A firm buckwheat-forward dough is rolled thin and precisely knife-cut for a clean, cold bite.',
    longDescription:
      'Because buckwheat has little gluten, the dough is handled gently, rolled with care to prevent tearing, and cut into thin, even strands intended to be served cold, where a clean cut matters more than stretch.',
    noodleTypeIds: ['soba'],
  },
];
