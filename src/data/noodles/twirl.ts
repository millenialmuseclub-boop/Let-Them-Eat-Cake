import type { TwirlStory, VocabularyTerm } from '../../types/noodles/twirl';

export const twirlStories: TwirlStory[] = [
  {
    slug: 'why-noodles-get-slurped',
    title: 'Why Some Noodles Are Meant to Be Slurped',
    dek: 'The sound isn\'t an accident — in several noodle cultures, it\'s doing real work.',
    body: [
      'In parts of Japan and China, drawing noodles in with an audible slurp is not a lapse in table manners — it\'s part of how the dish is meant to be experienced. Slurping pulls air across the noodle and broth together, carrying aroma up into the nose at the same moment the noodle hits the tongue, which changes how the dish actually tastes, not just how it sounds.',
      'It also serves a practical purpose with hot broth: drawing noodles in quickly with air cools them slightly on the way in, letting a diner eat a bowl that just came off a rolling boil without waiting for it to cool in the bowl first.',
      'None of this means every noodle dish everywhere calls for the same approach — dry-tossed noodles like dan dan mian or japchae don\'t carry the same aromatic payoff from a hot broth, and etiquette around eating sound varies significantly by country and setting. The point isn\'t a universal rule; it\'s that in the traditions where slurping is expected, it\'s solving a real sensory problem, not just noise.',
    ],
    relatedDishIds: ['sanuki-udon', 'zaru-soba', 'lanzhou-lamian'],
  },
  {
    slug: 'why-alkaline-noodles-behave-differently',
    title: 'Why Alkaline Water Changes a Noodle',
    dek: 'A small pH shift in the dough explains a noodle\'s color, snap, and how it holds up in broth.',
    body: [
      'Adding a small amount of alkaline mineral water (often called kansui or peng hui) to a wheat noodle dough shifts its pH slightly upward. That shift firms up gluten structure in a specific way, producing a springier, more elastic bite than a plain water dough — and it\'s part of why hand-pulled lamian can stretch as far as it does without tearing.',
      'The same alkalinity also affects color and flavor: it pushes the dough toward a pale yellow and gives a faint, distinctive mineral note that a plain wheat noodle doesn\'t have.',
      'Not every springy wheat noodle uses this trick — Sanuki udon gets its dense chew mostly from a firm, low-hydration dough and long kneading, no alkaline water involved. Springiness has more than one cause, and it\'s worth knowing which one is at work in a given noodle.',
    ],
    relatedNoodleTypeIds: ['lamian'],
    // Lanzhou lamian is the exact hand-pulled, kansui-treated noodle named in the body text —
    // a genuinely accurate lead image for this story, not a generic stand-in.
    relatedDishIds: ['lanzhou-lamian'],
  },
  {
    slug: 'why-soba-is-served-cold',
    title: 'Why Soba Is Often Served Cold',
    dek: 'A texture-first choice, not a temperature accident.',
    body: [
      'Buckwheat has very little gluten, which is what gives soba its distinctive, slightly grainy bite — but it also makes the noodle more fragile than a wheat noodle and quicker to go soft once cooked. Serving it cold, rinsed clean of surface starch, locks in a firmer texture right at the point it would otherwise start to soften in a hot broth.',
      'Cold service also puts the noodle itself, rather than a broth, at the center of the dish: with zaru soba, the tsuyu is a dip, not a bath, so the noodle\'s own texture and mild buckwheat flavor stay the focus of each bite.',
      'Soba is also served hot, in dishes with broth poured directly over it — cold service is a strong tradition, especially in warmer months, not the only correct way to eat it.',
    ],
    relatedDishIds: ['zaru-soba'],
    relatedNoodleTypeIds: ['soba'],
  },
  {
    slug: 'rice-vs-wheat-noodles',
    title: 'How Rice Noodles Differ From Wheat Noodles in the Kitchen',
    dek: 'No gluten means no kneading, no resting, and a completely different failure mode.',
    body: [
      'Wheat noodle dough is built around gluten — kneading develops it, resting relaxes it, and both steps are what make a wheat dough stretchable and chewy. Rice has no gluten at all, so none of that logic applies: a rice noodle\'s structure comes from starch that\'s been gelatinized by heat, either steamed as a batter into a sheet or extruded through a die directly into hot water.',
      'That difference shows up immediately in how each noodle is cooked and handled. Wheat dough can be kneaded hard and rested for hours without harm. Rice noodle sheets tear if handled roughly while cold, and dried rice vermicelli needs a soak or brief boil to rehydrate — dropping it dry into a hot wok, the way a cook might treat a par-cooked wheat noodle, just breaks it apart.',
      'This is also why a rice noodle dish and a wheat noodle dish built around the exact same sauce or broth can still feel completely different to eat: the noodle\'s own textural contribution — springy and elastic versus soft and slippery — is doing as much work as the seasoning.',
    ],
    relatedNoodleTypeIds: ['banh-pho', 'lamian'],
    // Phở bò is a photographed banh-pho (rice) dish and lamian is the wheat counterpart used
    // elsewhere in the piece — an accurate rice-vs-wheat pairing, with the rice noodle leading
    // since it's the side of the contrast the story spends the most time explaining.
    relatedDishIds: ['pho-bo', 'lanzhou-lamian'],
  },
  {
    slug: 'why-wok-hei-matters',
    title: 'What "Wok Hei" Actually Means',
    dek: 'The smoky char that separates a good stir-fried noodle from a merely warmed one.',
    body: [
      'Wok hei — literally "wok breath" or "wok energy" in Cantonese — describes the faintly smoky, slightly charred aroma a dish picks up from very high heat contact with a well-seasoned wok, usually over live flame. It\'s a real, describable flavor compound profile from rapid Maillard and light charring reactions at very high heat, not just a subjective idea.',
      'For noodle dishes like beef chow fun or yakisoba, wok hei is often the actual difference between a dish tasting "restaurant" and tasting merely stir-fried at home: it depends on a pan hot enough to sear on contact, noodles that aren\'t overcrowded, and short, decisive tossing rather than constant stirring.',
      'Home stoves rarely reach the same output as a professional wok burner, so a completely identical result isn\'t always realistic — but working in smaller batches at the highest heat available gets meaningfully closer than a large batch on medium heat ever will.',
    ],
    relatedDishIds: ['beef-chow-fun', 'yakisoba'],
  },
  {
    slug: 'noodles-and-longevity',
    title: 'Noodles, Length, and Celebration',
    dek: 'Why some noodle traditions treat an unbroken strand as meaningful.',
    body: [
      'Across several East and Southeast Asian noodle traditions, a long, unbroken noodle strand carries an association with long life, and cutting or breaking the noodle before eating is sometimes avoided at birthdays and New Year meals for that reason. Lamian\'s continuous hand-pulled strand and Filipino pancit\'s presence at birthday tables both draw on versions of this idea, arrived at through different cultural histories rather than one shared origin.',
      'It\'s worth holding this loosely rather than as a single unified belief: the specific customs, how strictly they\'re observed, and what "long noodle" symbolism is attached to vary meaningfully by country, region, and even individual family, and not every noodle dish carries this association at all.',
    ],
    relatedDishIds: ['lanzhou-lamian', 'pancit-bihon'],
  },
];

export const vocabulary: VocabularyTerm[] = [
  { term: 'Wok Hei', localScript: '鑊氣', pronunciation: 'wok hei', definition: 'The smoky, charred aroma a dish picks up from very high heat contact with a hot wok.' },
  { term: 'Kansui', localScript: '梘水', pronunciation: 'gaan-sui', definition: 'Alkaline mineral water added to some wheat noodle doughs for a springier texture and pale yellow color.' },
  { term: 'Tsuyu', localScript: 'つゆ', pronunciation: 'tsu-yu', definition: 'A dashi-based dipping or pouring sauce used with soba and udon.' },
  { term: 'Nước Chấm', pronunciation: 'nuhk chuhm', definition: 'A Vietnamese dipping sauce built on fish sauce, sugar, lime, and chile.' },
  { term: 'Sen', localScript: 'เส้น', pronunciation: 'sen', definition: 'The general Thai word for noodle, followed by a width descriptor (lek, yai, mee).' },
  { term: 'Dangmyeon', localScript: '당면', pronunciation: 'dang-myeon', definition: 'Korean sweet-potato starch noodles, glassy and chewy, central to japchae.' },
];
