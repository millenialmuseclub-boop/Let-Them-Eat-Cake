import type { NoodleDish } from '../../types/noodles/noodle';

export const dishes: NoodleDish[] = [
  {
    id: 'pho-bo',
    name: 'Phở Bò',
    localName: 'phở bò',
    alternateNames: ['Beef Phở'],
    noodleTypeId: 'banh-pho',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'hanoi' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'Phở is eaten at any hour in Vietnam, from breakfast street stalls to late-night bowls, and is widely regarded as a defining dish of Vietnamese cuisine both at home and abroad.',
    historicalContext:
      'Phở is generally understood to have emerged in northern Vietnam in the early 20th century, likely in or near Hanoi, drawing on French cattle-butchering practices layered onto Vietnamese rice-noodle and broth traditions. Its exact origin is debated and this account favors the widely supported version rather than a single settled claim.',
    flavorProfile: { brothiness: 5, boldness: 2, richness: 2, chewiness: 2, spice: 1 },
    flavorTags: ['aromatic', 'savory', 'herbal', 'fresh'],
    brothOrSauceRelationship:
      'A clear, long-simmered beef bone broth perfumed with charred ginger, onion, star anise, and cinnamon, served hot over the noodles and finished tableside with herbs, lime, and chile.',
    relatedDishIds: ['bun-cha'],
    relatedNoodleTypeIds: ['rice-vermicelli'],
    workshopLessonSlugs: ['broth-sauce-lab'],
    recipeId: 'pho-bo',
    sourceNote: 'General culinary-history consensus on phở\'s early-20th-century northern Vietnamese origins; no single primary source claimed.',
  },
  {
    id: 'bun-cha',
    name: 'Bún Chả',
    localName: 'bún chả',
    noodleTypeId: 'rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'hanoi' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'A Hanoi lunch-hour staple: grilled pork is brought to the table separately from the noodles and dipping sauce, and diners assemble each bite themselves.',
    historicalContext:
      'Rooted in northern Vietnamese home cooking, bún chả became closely associated with Hanoi street food through the 20th century and gained wider international attention in the 2010s.',
    flavorProfile: { brothiness: 2, boldness: 3, richness: 3, chewiness: 1, spice: 1 },
    flavorTags: ['savory', 'sweet', 'tangy', 'fresh', 'herbal'],
    brothOrSauceRelationship:
      'Room-temperature rice noodles are dipped, not sauced directly — into a bowl of warm nước chấm (fish sauce, sugar, lime, garlic, chile) along with grilled pork patties and slices, plus pickled vegetables.',
    relatedDishIds: ['pho-bo'],
    relatedNoodleTypeIds: ['banh-pho'],
    recipeId: 'bun-cha',
    sourceNote: 'Consistent with widely documented Hanoi bún chả preparation and serving conventions.',
  },
  {
    id: 'lanzhou-lamian',
    name: 'Lanzhou Lamian',
    localName: '兰州拉面',
    romanization: 'Lánzhōu lāmiàn',
    alternateNames: ['Lanzhou Beef Noodle Soup'],
    noodleTypeId: 'lamian',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'lanzhou' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['hand-pulled'],
    culturalContext:
      'A breakfast and all-day staple in Lanzhou, closely tied to the city\'s Hui Muslim community, and one of the most widely franchised regional Chinese noodle dishes nationally.',
    historicalContext:
      'The dish developed within Lanzhou\'s Hui Muslim beef-noodle tradition; a set of "five characteristics" (clear broth, white radish, red chile oil, green cilantro/garlic, yellow noodles) is commonly cited as its defining standard.',
    flavorProfile: { brothiness: 5, boldness: 3, richness: 2, chewiness: 4, spice: 2 },
    flavorTags: ['savory', 'aromatic', 'chili', 'herbal'],
    brothOrSauceRelationship:
      'A clear beef-bone broth seasoned simply, topped with chile oil, thinly sliced beef, radish, cilantro, and scallion; the broth is meant to stay clear despite its depth of flavor.',
    relatedDishIds: ['biang-biang-mian'],
    workshopLessonSlugs: ['hand-pulled-lab'],
    recipeId: 'lanzhou-lamian',
    sourceNote: 'Consistent with commonly cited Lanzhou Hui-community beef-noodle tradition and its "five characteristics" description.',
  },
  {
    id: 'biang-biang-mian',
    name: 'Biang Biang Mian',
    localName: '油泼扯面',
    romanization: 'yóupō chěmiàn',
    noodleTypeId: 'biang-biang',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'xian' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['hand-torn'],
    culturalContext:
      'A Shaanxi home-style and street-food staple, named for the slapping sound the dough makes against the work surface while being stretched.',
    historicalContext:
      'Part of a broader Shaanxi tradition of wide, hand-made wheat noodles; the dish\'s modern name is closely tied to its unusually complex character, sometimes cited as one of the most stroke-heavy characters in written Chinese.',
    flavorProfile: { brothiness: 0, boldness: 4, richness: 3, chewiness: 5, spice: 3 },
    flavorTags: ['garlicky', 'chili', 'savory', 'aromatic'],
    brothOrSauceRelationship:
      'Hot oil is poured directly over chile flakes, garlic, and scallion piled on the noodles, sizzling them into a fragrant dressing tossed through at the table rather than a simmered sauce.',
    relatedDishIds: ['lanzhou-lamian', 'dan-dan-mian'],
    workshopLessonSlugs: ['shape-lab'],
    recipeId: 'biang-biang-mian',
    sourceNote: 'Consistent with widely documented Shaanxi biang biang mian preparation and naming.',
  },
  {
    id: 'dan-dan-mian',
    name: 'Dan Dan Mian',
    localName: '担担面',
    romanization: 'dàndàn miàn',
    alternateNames: ['Dan Dan Noodles'],
    noodleTypeId: 'shuimian',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'sichuan' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['knife-cut', 'rolled-and-cut'],
    culturalContext:
      'Named for the shoulder pole (dan dan) street vendors once used to carry the dish\'s ingredients, sold from two baskets balanced on the pole.',
    historicalContext:
      'Originated as Chengdu street food carried by traveling vendors in the early 20th century; restaurant versions today are often milder and saucier than the traditional small, intensely seasoned street portion.',
    flavorProfile: { brothiness: 1, boldness: 4, richness: 3, chewiness: 3, spice: 4 },
    flavorTags: ['chili', 'nutty', 'savory', 'aromatic'],
    brothOrSauceRelationship:
      'A small amount of noodles is tossed with chile oil, Sichuan peppercorn, preserved vegetable, and often ground pork and sesame or peanut, meant to coat rather than swim in sauce.',
    relatedDishIds: ['biang-biang-mian'],
    relatedNoodleTypeIds: ['chuka-soba'],
    recipeId: 'dan-dan-mian',
    sourceNote: 'Consistent with widely documented Chengdu street-vendor origin of dan dan mian.',
  },
  {
    id: 'beef-chow-fun',
    name: 'Beef Chow Fun',
    localName: '干炒牛河',
    romanization: 'gān chǎo niú hé',
    noodleTypeId: 'shahe-fen',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'guangdong-hk' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A benchmark dish in Cantonese kitchens; how evenly a cook can char wide rice noodles without breaking or oiling them is considered a real test of wok skill.',
    historicalContext:
      'Developed within Guangdong wok cooking around the wide, steamed rice noodle known as ho fun, and carried into Hong Kong and overseas Cantonese restaurant cooking.',
    flavorProfile: { brothiness: 0, boldness: 3, richness: 3, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'smoky', 'aromatic'],
    brothOrSauceRelationship:
      'A thin dark and light soy sauce mixture is seared into the noodles over very high heat, meant to coat lightly and char at the edges rather than pool as a sauce.',
    relatedDishIds: ['pancit-bihon'],
    relatedNoodleTypeIds: ['banh-pho'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'beef-chow-fun',
    sourceNote: 'Consistent with standard Cantonese gon chow ngau ho preparation and wok-hei emphasis.',
  },
  {
    id: 'pancit-bihon',
    name: 'Pancit Bihon',
    localName: 'pansit bihon',
    noodleTypeId: 'rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'philippines', cityOrAreaId: 'manila' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'Pancit is served at Filipino birthdays and celebrations for its association with long life, and bihon is one of the most common everyday versions across the islands.',
    historicalContext:
      'The word pancit derives from Hokkien and reflects a long history of Chinese trading influence on Filipino noodle cooking, adapted over centuries with local vegetables, proteins, and calamansi.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 2, chewiness: 1, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'citrus'],
    brothOrSauceRelationship:
      'Thin rice vermicelli is stir-fried with a light soy-and-broth seasoning, absorbing most of the liquid rather than sitting in a sauce, and finished with a squeeze of calamansi.',
    relatedDishIds: ['beef-chow-fun', 'mohinga'],
    relatedNoodleTypeIds: ['banh-pho'],
    recipeId: 'pancit-bihon',
    sourceNote: 'Consistent with widely documented Hokkien-influenced Filipino pancit history and bihon preparation.',
  },
  {
    id: 'pad-thai',
    name: 'Pad Thai',
    localName: 'ผัดไทย',
    noodleTypeId: 'sen-lek',
    place: { regionId: 'southeast-asia', countryId: 'thailand', cityOrAreaId: 'bangkok' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'Sold widely from street carts and restaurants alike, pad thai is one of the most internationally recognized Thai dishes and is commonly finished at the table with sugar, chile, fish sauce, and lime.',
    historicalContext:
      'Pad thai was actively promoted as a national dish by the Thai government in the late 1930s and 1940s as part of a campaign to build national identity and reduce rice consumption during a period of economic hardship.',
    flavorProfile: { brothiness: 0, boldness: 3, richness: 2, chewiness: 2, spice: 1 },
    flavorTags: ['tangy', 'sweet', 'savory', 'nutty'],
    brothOrSauceRelationship:
      'Flat rice noodles are stir-fried with a tamarind-fish sauce-palm sugar mixture that reduces into a light glaze, finished with egg, bean sprouts, and crushed peanuts.',
    relatedDishIds: ['khao-soi'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'pad-thai',
    sourceNote: "Consistent with documented history of Thailand's mid-20th-century national pad thai promotion campaign.",
  },
  {
    id: 'khao-soi',
    name: 'Khao Soi',
    localName: 'ข้าวซอย',
    noodleTypeId: 'ba-mee',
    place: { regionId: 'southeast-asia', countryId: 'thailand', cityOrAreaId: 'chiang-mai' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A defining dish of northern Thai (Lanna) cooking, closely associated with Chiang Mai and the broader region\'s overland trade connections into Myanmar and Yunnan.',
    historicalContext:
      'Khao soi reflects a blend of Chinese Muslim (Yunnanese) curry-noodle traditions carried along historic overland trade routes into northern Thailand, adapted with Thai curry paste and coconut milk.',
    flavorProfile: { brothiness: 4, boldness: 4, richness: 4, chewiness: 2, spice: 3 },
    flavorTags: ['aromatic', 'savory', 'chili', 'tangy'],
    brothOrSauceRelationship:
      'A coconut-milk curry broth built on a red curry paste base, poured over boiled egg noodles and topped with a portion of the same noodle deep-fried crisp for contrast.',
    relatedDishIds: ['pad-thai', 'curry-laksa'],
    recipeId: 'khao-soi',
    sourceNote: 'Consistent with widely documented Yunnanese-influenced origin of northern Thai khao soi.',
  },
  {
    id: 'sanuki-udon',
    name: 'Sanuki Udon',
    localName: '讃岐うどん',
    noodleTypeId: 'udon',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'kagawa' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'Kagawa Prefecture (historically Sanuki Province) is popularly nicknamed "Udon Prefecture" for its density of udon shops and strong local identity around the noodle.',
    historicalContext:
      'Sanuki udon-making developed over centuries in a region well suited to wheat cultivation, salt production, and soy sauce brewing — the core inputs for a good udon and its dashi.',
    flavorProfile: { brothiness: 3, boldness: 1, richness: 1, chewiness: 4, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A light, clear dashi-based broth seasoned with soy sauce and mirin, meant to let the noodle\'s dense, springy texture stand out rather than dominate with a rich broth.',
    relatedDishIds: ['zaru-soba'],
    workshopLessonSlugs: ['dough-lab'],
    recipeId: 'sanuki-udon',
    sourceNote: "Consistent with Kagawa Prefecture's well-documented Sanuki udon tradition.",
  },
  {
    id: 'zaru-soba',
    name: 'Zaru Soba',
    localName: 'ざるそば',
    noodleTypeId: 'soba',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'nagano' },
    preparationStyle: 'chilled',
    primaryTechniqueIds: ['shaved'],
    culturalContext:
      'A summer staple across Japan, served on a bamboo mat (zaru) to let excess water drain, and eaten by dipping rather than pouring sauce over.',
    historicalContext:
      'Cold soba service developed as buckwheat noodle-making spread from mountainous growing regions like Nagano into Edo-period (17th–19th century) urban dining culture.',
    flavorProfile: { brothiness: 1, boldness: 1, richness: 1, chewiness: 3, spice: 0 },
    flavorTags: ['nutty', 'savory', 'fresh'],
    brothOrSauceRelationship:
      'Chilled noodles are dipped bite by bite into a small cup of tsuyu (dashi, soy sauce, mirin), often finished with grated wasabi and scallion, rather than sauced directly.',
    relatedDishIds: ['sanuki-udon', 'naengmyeon'],
    recipeId: 'zaru-soba',
    sourceNote: 'Consistent with widely documented Edo-period development of cold soba dining culture.',
  },
  {
    id: 'yakisoba',
    name: 'Yakisoba',
    localName: '焼きそば',
    noodleTypeId: 'chuka-soba',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'osaka' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A festival-stall and casual-dining staple in Japan, closely associated with summer matsuri food stands alongside takoyaki and okonomiyaki.',
    historicalContext:
      'Developed in the early-to-mid 20th century from Chinese-style stir-fried wheat noodles (chuka soba), adapted with a distinctly Japanese Worcestershire-style sauce.',
    flavorProfile: { brothiness: 0, boldness: 3, richness: 2, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'sweet', 'smoky'],
    brothOrSauceRelationship:
      'Noodles are stir-fried with cabbage, pork, and a tangy-sweet Worcestershire-style yakisoba sauce that reduces into a light coating, finished with pickled ginger and aonori.',
    relatedDishIds: ['beef-chow-fun'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'yakisoba',
    sourceNote: 'Consistent with documented early-to-mid 20th century Japanese adaptation of Chinese stir-fried noodles.',
  },
  {
    id: 'japchae',
    name: 'Japchae',
    localName: '잡채',
    noodleTypeId: 'dangmyeon',
    place: { regionId: 'east-asia', countryId: 'korea', cityOrAreaId: 'seoul' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'A staple of Korean celebration tables — birthdays, holidays, weddings — often served at room temperature as part of a larger spread rather than as a standalone bowl.',
    historicalContext:
      'Japchae originated as a royal-court dish in the Joseon period built from julienned vegetables; the now-signature sweet-potato starch noodle was a later addition, popularized more widely in the 20th century.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 2, chewiness: 4, spice: 0 },
    flavorTags: ['sesame', 'savory', 'sweet', 'aromatic'],
    brothOrSauceRelationship:
      'Noodles and separately sautéed vegetables and beef are tossed together with soy sauce, sugar, and sesame oil off the heat, so each component keeps its own distinct texture.',
    relatedDishIds: ['naengmyeon'],
    recipeId: 'japchae',
    sourceNote: 'Consistent with documented Joseon-era origin of japchae and later addition of dangmyeon noodles.',
  },
  {
    id: 'naengmyeon',
    name: 'Naengmyeon',
    localName: '냉면',
    noodleTypeId: 'naengmyeon-noodle',
    place: { regionId: 'east-asia', countryId: 'korea', cityOrAreaId: 'pyongyang-tradition' },
    preparationStyle: 'chilled',
    primaryTechniqueIds: ['knife-cut'],
    culturalContext:
      'Traditionally a summer dish in South Korea, though historically associated with winter in its northern origins, when cold rooms and outdoor-stored kimchi liquid were more available.',
    historicalContext:
      'Naengmyeon traces to the historic Pyongyang region (in present-day North Korea) and was carried south and adapted by refugees and migrants through the 20th century, especially after the Korean War.',
    flavorProfile: { brothiness: 4, boldness: 2, richness: 1, chewiness: 5, spice: 1 },
    flavorTags: ['tangy', 'savory', 'fresh'],
    brothOrSauceRelationship:
      'Served either in a tart, icy beef-and-radish-kimchi broth (mul naengmyeon) or tossed in a sweet-spicy chile paste (bibim naengmyeon), both built to contrast the noodle\'s elastic bite.',
    relatedDishIds: ['japchae', 'zaru-soba'],
    recipeId: 'naengmyeon',
    sourceNote: 'Consistent with documented Pyongyang-region origin of naengmyeon and its post-Korean-War spread south.',
  },
  {
    id: 'curry-laksa',
    name: 'Curry Laksa',
    localName: 'laksa lemak',
    noodleTypeId: 'laksa-noodle',
    place: { regionId: 'southeast-asia', countryId: 'malaysia', cityOrAreaId: 'penang' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'A signature Peranakan (Straits Chinese) dish reflecting the blended Malay and Chinese culinary traditions of the Malay Peninsula and Singapore.',
    historicalContext:
      'Curry laksa developed within Peranakan communities as Chinese immigrant cooking traditions met Malay spice pastes and coconut milk over several centuries of trade and settlement on the Malay Peninsula.',
    flavorProfile: { brothiness: 5, boldness: 4, richness: 4, chewiness: 2, spice: 3 },
    flavorTags: ['aromatic', 'chili', 'savory', 'sweet'],
    brothOrSauceRelationship:
      'A rich coconut-milk broth built on a spice paste of chile, shallot, galangal, and shrimp paste, poured over thick rice noodles with tofu puffs, shrimp, and cockles.',
    relatedDishIds: ['khao-soi'],
    recipeId: 'curry-laksa',
    sourceNote: 'Consistent with widely documented Peranakan origin of curry laksa on the Malay Peninsula.',
  },
  {
    id: 'mohinga',
    name: 'Mohinga',
    localName: 'မုန့်ဟင်းခါး',
    romanization: 'monhinga',
    noodleTypeId: 'rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'myanmar', cityOrAreaId: 'yangon' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      "Widely considered Myanmar's national dish, eaten as a common breakfast across the country from street vendors and markets.",
    historicalContext:
      'Mohinga developed as a river-fish-based rice-noodle soup taking advantage of Myanmar\'s river systems (particularly catfish), with a base of aromatics and banana stem or lemongrass that varies significantly by region.',
    flavorProfile: { brothiness: 5, boldness: 3, richness: 2, chewiness: 1, spice: 1 },
    flavorTags: ['aromatic', 'savory', 'herbal', 'fresh'],
    brothOrSauceRelationship:
      'A fragrant river-fish and rice-flour-thickened broth, seasoned with lemongrass, ginger, and turmeric, poured over rice vermicelli and topped with crispy fritters, boiled egg, and cilantro.',
    relatedDishIds: ['pancit-bihon', 'pho-bo'],
    relatedNoodleTypeIds: ['banh-pho'],
    recipeId: 'mohinga',
    sourceNote: "Consistent with mohinga's widely documented status as Myanmar's national dish and its river-fish broth tradition.",
  },
  /* ===== Phase 2: content saturation (35 new dishes) ===== */
  // --- China / Hong Kong ---
  {
    id: 'chow-mein',
    name: 'Chow Mein',
    localName: '炒麵',
    romanization: 'cháomiàn',
    noodleTypeId: 'cantonese-egg-noodle',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'guangdong-hk' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'One of the most internationally recognized Cantonese noodle dishes, served in versions ranging from soft-tossed to noodles pan-fried into a crisp cake.',
    historicalContext:
      'Chow mein developed within Cantonese wok cooking and spread widely through Chinese diaspora restaurants in the 19th and 20th centuries, which is part of why international versions vary so much from Guangdong originals.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 2, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'smoky'],
    brothOrSauceRelationship:
      'A light soy-based sauce is tossed through or poured over the noodles; in the crispy style, sauce is spooned over noodles fried into a crisp cake rather than tossed through evenly.',
    relatedDishIds: ['beef-chow-fun', 'wonton-noodles'],
    relatedNoodleTypeIds: ['ba-mee'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'chow-mein',
    sourceNote: 'Consistent with widely documented Cantonese chow mein tradition and its diaspora-driven variation.',
  },
  {
    id: 'zhajiangmian',
    name: 'Zhajiangmian',
    localName: '炸酱面',
    romanization: 'zhájiàngmiàn',
    noodleTypeId: 'shuimian',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'xian' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['knife-cut', 'rolled-and-cut'],
    culturalContext:
      'A northern Chinese staple, especially associated with Beijing, often eaten with the sauce and julienned vegetables mixed in tableside.',
    historicalContext:
      'Zhajiangmian is a northern Chinese dish built around fermented soybean paste (zhajiang); a related but distinct version, jjajangmyeon, developed among Chinese immigrant communities in Korea using a sweeter black-bean paste.',
    flavorProfile: { brothiness: 0, boldness: 3, richness: 3, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'fermented', 'aromatic'],
    brothOrSauceRelationship:
      'A thick, savory sauce of stir-fried ground pork and fermented soybean or sweet bean paste is spooned over noodles and mixed in with julienned cucumber just before eating.',
    relatedDishIds: ['dan-dan-mian'],
    recipeId: 'zhajiangmian',
    sourceNote: 'Consistent with widely documented northern Chinese zhajiangmian tradition, distinguished here from Korean jjajangmyeon.',
  },
  {
    id: 'hot-dry-noodles',
    name: 'Hot Dry Noodles',
    localName: '热干面',
    romanization: 'règānmiàn',
    noodleTypeId: 'shuimian',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'wuhan' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['knife-cut', 'rolled-and-cut'],
    culturalContext:
      "A defining breakfast dish of Wuhan, eaten quickly on the way to work or school and closely tied to the city's identity.",
    historicalContext:
      'Regan mian is generally understood to have developed in Wuhan in the early 20th century, when a street vendor is said to have accidentally discovered that oiling boiled noodles kept them from clumping while cooling for later dressing.',
    flavorProfile: { brothiness: 0, boldness: 3, richness: 2, chewiness: 3, spice: 1 },
    flavorTags: ['nutty', 'savory', 'aromatic'],
    brothOrSauceRelationship:
      'Noodles are tossed with sesame paste thinned with oil and chili oil, plus pickled vegetables and scallion — dry-tossed with no broth at all, eaten quickly while still warm.',
    relatedDishIds: ['dan-dan-mian'],
    recipeId: 'hot-dry-noodles',
    sourceNote: 'Consistent with the widely told origin account of Wuhan hot dry noodles.',
  },
  {
    id: 'crossing-the-bridge-noodles',
    name: 'Crossing-the-Bridge Noodles',
    localName: '过桥米线',
    romanization: 'guòqiáo mǐxiàn',
    noodleTypeId: 'rice-vermicelli',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'kunming' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      "A signature dish of Yunnan cuisine, known for its theatrical tableside assembly and the story behind its name.",
    historicalContext:
      'A popular legend, told with variations, describes a scholar\'s wife carrying broth across a bridge to keep it hot for his studies, discovering a layer of oil kept the broth steaming; the dish\'s actual origin is Yunnanese and the legend is treated here as folklore rather than settled history.',
    flavorProfile: { brothiness: 5, boldness: 2, richness: 2, chewiness: 1, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A very hot broth, sealed under a layer of oil to retain heat, is brought to the table and used to cook thin raw slices of meat and vegetables tableside before the rice noodles are added.',
    relatedDishIds: ['pho-bo'],
    recipeId: 'crossing-the-bridge-noodles',
    sourceNote: 'Consistent with widely told Yunnanese crossing-the-bridge noodle tradition; origin legend presented as folklore, not verified history.',
  },
  {
    id: 'scallion-oil-noodles',
    name: 'Scallion Oil Noodles',
    localName: '葱油拌面',
    romanization: 'cōngyóu bànmiàn',
    noodleTypeId: 'shuimian',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'shanghai' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['knife-cut', 'rolled-and-cut'],
    culturalContext:
      'A deceptively simple Shanghainese noodle dish, prized for how much flavor it draws from just scallion and soy sauce done well.',
    historicalContext:
      'Rooted in Shanghainese home cooking, where slowly frying scallion in oil until deeply caramelized, then combining it with a soy-based sauce, became a defining low-ingredient, high-technique regional dish.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 2, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'sweet'],
    brothOrSauceRelationship:
      'Scallion is fried low and slow in oil until deeply browned and fragrant, then combined with soy sauce and a little sugar and tossed through the noodles.',
    relatedDishIds: ['zhajiangmian'],
    recipeId: 'scallion-oil-noodles',
    sourceNote: 'Consistent with widely documented Shanghainese scallion oil noodle tradition.',
  },
  {
    id: 'wonton-noodles',
    name: 'Wonton Noodles',
    localName: '雲吞麵',
    romanization: 'wàntān miàn',
    noodleTypeId: 'cantonese-egg-noodle',
    place: { regionId: 'east-asia', countryId: 'china', cityOrAreaId: 'guangdong-hk' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A Hong Kong noodle-shop staple, often judged by the springiness of the noodle and the clarity of the shrimp-and-pork wonton filling as much as the broth.',
    historicalContext:
      'Wonton noodles developed within Cantonese noodle-shop culture in Guangzhou and Hong Kong, historically served in small, carefully portioned bowls rather than large ones.',
    flavorProfile: { brothiness: 4, boldness: 1, richness: 1, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A light, clean broth made from dried flounder and pork bones is poured over noodles and shrimp-and-pork wontons, kept deliberately clear rather than rich.',
    relatedDishIds: ['chow-mein', 'pancit-canton'],
    workshopLessonSlugs: ['broth-sauce-lab'],
    recipeId: 'wonton-noodles',
    sourceNote: 'Consistent with widely documented Hong Kong wonton noodle tradition.',
  },
  // --- Vietnam ---
  {
    id: 'pho-ga',
    name: 'Phở Gà',
    localName: 'phở gà',
    alternateNames: ['Chicken Phở'],
    noodleTypeId: 'banh-pho',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'hanoi' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A lighter counterpart to phở bò, often preferred for a milder, more delicate broth and eaten just as commonly at any hour.',
    historicalContext:
      'Phở gà developed alongside phở bò in northern Vietnam, sharing the same rice-noodle and aromatic-broth tradition while relying on chicken bones for a lighter, clearer stock.',
    flavorProfile: { brothiness: 5, boldness: 1, richness: 1, chewiness: 2, spice: 1 },
    flavorTags: ['aromatic', 'savory', 'herbal', 'fresh'],
    brothOrSauceRelationship:
      'A clear chicken broth, simmered gently with charred ginger and onion, poured hot over noodles and shredded or sliced chicken, finished tableside with herbs and lime.',
    relatedDishIds: ['pho-bo'],
    recipeId: 'pho-ga',
    sourceNote: 'Consistent with general culinary-history understanding of phở gà developing alongside phở bò in northern Vietnam.',
  },
  {
    id: 'bun-bo-hue',
    name: 'Bún Bò Huế',
    localName: 'bún bò Huế',
    noodleTypeId: 'thick-rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'hue' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      "Closely tied to Huế's imperial-era culinary reputation for bold, layered spicing relative to milder northern cooking.",
    historicalContext:
      'Bún bò Huế developed in and around the former imperial capital of Huế, generally understood as a central Vietnamese dish shaped by a regional preference for lemongrass, chile, and fermented shrimp paste.',
    flavorProfile: { brothiness: 5, boldness: 4, richness: 3, chewiness: 3, spice: 3 },
    flavorTags: ['aromatic', 'savory', 'chili', 'fermented'],
    brothOrSauceRelationship:
      'A bold beef-and-pork bone broth is built with lemongrass, chile oil, and fermented shrimp paste, giving it a much bolder, spicier character than phở\'s clear broth.',
    relatedDishIds: ['pho-bo', 'bun-thit-nuong'],
    recipeId: 'bun-bo-hue',
    sourceNote: 'Consistent with widely documented central Vietnamese bún bò Huế tradition.',
  },
  {
    id: 'bun-thit-nuong',
    name: 'Bún Thịt Nướng',
    localName: 'bún thịt nướng',
    noodleTypeId: 'rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'hanoi' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'A common lunch dish across Vietnam, valued for being light, herb-forward, and easy to customize with whatever vegetables are on hand.',
    historicalContext:
      'Bún thịt nướng belongs to the same family of room-temperature vermicelli-and-nước-chấm dishes as bún chả, built around grilled marinated pork rather than pork patties.',
    flavorProfile: { brothiness: 1, boldness: 2, richness: 2, chewiness: 1, spice: 1 },
    flavorTags: ['savory', 'sweet', 'tangy', 'fresh', 'herbal'],
    brothOrSauceRelationship:
      'Room-temperature rice vermicelli is topped with grilled marinated pork, fresh herbs, pickled vegetables, and crushed peanuts, then dressed with nước chấm poured over the top rather than dipped.',
    relatedDishIds: ['bun-cha', 'bun-bo-hue'],
    recipeId: 'bun-thit-nuong',
    sourceNote: 'Consistent with widely documented Vietnamese bún thịt nướng preparation.',
  },
  {
    id: 'cao-lau',
    name: 'Cao Lầu',
    localName: 'cao lầu',
    noodleTypeId: 'cao-lau-noodle',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'hoi-an' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A dish inseparable from Hội An\'s identity, traditionally said to be impossible to replicate authentically outside the town because of the local water.',
    historicalContext:
      'Cao lầu likely reflects historical Chinese and Japanese trading-post influence on Hội An, once a major Southeast Asian trading port, though its exact lineage is debated.',
    flavorProfile: { brothiness: 1, boldness: 3, richness: 3, chewiness: 4, spice: 0 },
    flavorTags: ['savory', 'smoky', 'aromatic'],
    brothOrSauceRelationship:
      'Thick, chewy noodles are tossed with a small amount of intensely flavored broth, sliced roast pork, fresh herbs, and crisp pork cracklings — closer to a dressed dish than a soup.',
    relatedDishIds: ['mi-quang'],
    recipeId: 'cao-lau',
    sourceNote: 'Consistent with widely told Hội An cao lầu tradition; exact historical lineage acknowledged as debated.',
  },
  {
    id: 'mi-quang',
    name: 'Mì Quảng',
    localName: 'mì Quảng',
    noodleTypeId: 'mi-quang-noodle',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'quang-nam' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      "Considered a defining dish of Quảng Nam province, commonly served at communal and celebratory meals.",
    historicalContext:
      'Mì Quảng developed as a central Vietnamese noodle tradition distinct from northern phở, built around a small amount of richly seasoned broth rather than a full soup, with turmeric-tinted noodles as its signature.',
    flavorProfile: { brothiness: 1, boldness: 3, richness: 3, chewiness: 2, spice: 1 },
    flavorTags: ['savory', 'aromatic', 'nutty'],
    brothOrSauceRelationship:
      'A small amount of turmeric-tinted, richly seasoned broth (often shrimp- and pork-based) is ladled over the noodles rather than filling the bowl, finished with roasted peanuts and a rice cracker.',
    relatedDishIds: ['cao-lau'],
    relatedNoodleTypeIds: ['banh-pho'],
    recipeId: 'mi-quang',
    sourceNote: 'Consistent with widely documented Quảng Nam mì Quảng tradition.',
  },
  {
    id: 'hu-tieu',
    name: 'Hủ Tiếu',
    localName: 'hủ tiếu Nam Vang',
    noodleTypeId: 'hu-tieu-noodle',
    place: { regionId: 'southeast-asia', countryId: 'vietnam', cityOrAreaId: 'mekong-delta' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'A defining dish of southern Vietnam, especially the Mekong Delta and Ho Chi Minh City, reflecting the region\'s Vietnamese, Chinese, and Khmer culinary overlap.',
    historicalContext:
      'Hủ tiếu (from a Teochew Chinese noodle tradition, adapted through Cambodian and southern Vietnamese cooking) reflects centuries of exchange among Vietnamese, Chinese, and Khmer communities in the Mekong Delta.',
    flavorProfile: { brothiness: 4, boldness: 2, richness: 2, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'sweet', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A clear pork-and-dried-shrimp broth is poured over noodles with pork, shrimp, and fresh herbs; a dry-tossed version with the broth served on the side is equally common.',
    relatedDishIds: ['pho-bo'],
    recipeId: 'hu-tieu',
    sourceNote: 'Consistent with widely documented Mekong Delta hủ tiếu tradition reflecting Vietnamese-Chinese-Khmer exchange.',
  },
  // --- Thailand ---
  {
    id: 'pad-see-ew',
    name: 'Pad See Ew',
    localName: 'ผัดซีอิ๊ว',
    noodleTypeId: 'sen-yai',
    place: { regionId: 'southeast-asia', countryId: 'thailand', cityOrAreaId: 'bangkok' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A common Thai lunch dish, generally milder and less internationally hyped than pad thai but a everyday staple across the country.',
    historicalContext:
      'Pad see ew reflects Thai-Chinese wok-cooking influence, using wide rice noodles and dark soy sauce in a style closely related to Chinese stir-fried flat-noodle dishes.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 2, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'sweet', 'smoky'],
    brothOrSauceRelationship:
      'Wide rice noodles are stir-fried at high heat with dark and light soy sauce, egg, and Chinese broccoli, aiming for a light char rather than a heavy sauce coating.',
    relatedDishIds: ['pad-thai', 'pad-kee-mao', 'beef-chow-fun'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'pad-see-ew',
    sourceNote: 'Consistent with widely documented Thai-Chinese pad see ew tradition.',
  },
  {
    id: 'pad-kee-mao',
    name: 'Pad Kee Mao',
    localName: 'ผัดขี้เมา',
    alternateNames: ['Drunken Noodles'],
    noodleTypeId: 'sen-yai',
    place: { regionId: 'southeast-asia', countryId: 'thailand', cityOrAreaId: 'bangkok' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'Popularly known outside Thailand as "drunken noodles," a nickname whose exact origin is debated but widely tied to its bold, hangover-curing spice level.',
    historicalContext:
      'Pad kee mao developed within the same central Thai wok-noodle tradition as pad see ew, distinguished by holy basil and a much higher chile load.',
    flavorProfile: { brothiness: 0, boldness: 4, richness: 2, chewiness: 2, spice: 4 },
    flavorTags: ['chili', 'herbal', 'savory', 'aromatic'],
    brothOrSauceRelationship:
      'Wide rice noodles are stir-fried with a large amount of fresh chile, garlic, and holy basil in a soy-and-fish-sauce mixture, seared hot and fast rather than simmered.',
    relatedDishIds: ['pad-see-ew'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'pad-kee-mao',
    sourceNote: "Consistent with widely told account of pad kee mao's Thai wok-noodle origins; the \"drunken\" nickname's exact origin is debated and not presented as settled.",
  },
  {
    id: 'boat-noodles',
    name: 'Boat Noodles',
    localName: 'ก๋วยเตี๋ยวเรือ',
    noodleTypeId: 'sen-lek',
    place: { regionId: 'southeast-asia', countryId: 'thailand', cityOrAreaId: 'bangkok' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'Named for the small boats that once sold it along Bangkok\'s canals, traditionally served in small bowls meant to be eaten several at a time.',
    historicalContext:
      'Boat noodles originated as a canal-vendor dish in and around Bangkok, historically thickened and darkened with the vendor\'s own blood-enriched broth recipe, a practice that varies today by vendor and region.',
    flavorProfile: { brothiness: 5, boldness: 4, richness: 3, chewiness: 2, spice: 2 },
    flavorTags: ['aromatic', 'savory', 'chili', 'fermented'],
    brothOrSauceRelationship:
      'A dark, intensely seasoned broth built on herbs, spices, and often pork or beef blood for body, served in small portions meant to be eaten in multiple rounds.',
    relatedDishIds: ['khao-soi'],
    recipeId: 'boat-noodles',
    sourceNote: "Consistent with widely told canal-vendor origin of Bangkok boat noodles.",
  },
  {
    id: 'rad-na',
    name: 'Rad Na',
    localName: 'ราดหน้า',
    noodleTypeId: 'sen-yai',
    place: { regionId: 'southeast-asia', countryId: 'thailand', cityOrAreaId: 'bangkok' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      "A comfort-food staple in Thailand, often ordered alongside pad see ew as a lighter, gravy-forward alternative.",
    historicalContext:
      'Rad na reflects the same Thai-Chinese wide-rice-noodle tradition as pad see ew, adapted with a starch-thickened gravy rather than a dry stir-fry finish.',
    flavorProfile: { brothiness: 2, boldness: 2, richness: 2, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'aromatic'],
    brothOrSauceRelationship:
      'Wide rice noodles, lightly seared, are topped with a starch-thickened gravy of Chinese broccoli, pork or seafood, and garlic, closer to a smothered dish than a stir-fry.',
    relatedDishIds: ['pad-see-ew'],
    recipeId: 'rad-na',
    sourceNote: 'Consistent with widely documented Thai-Chinese rad na tradition.',
  },
  // --- Philippines ---
  {
    id: 'pancit-canton',
    name: 'Pancit Canton',
    localName: 'pansit canton',
    noodleTypeId: 'cantonese-egg-noodle',
    place: { regionId: 'southeast-asia', countryId: 'philippines', cityOrAreaId: 'manila' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'Alongside pancit bihon, one of the most common pancit varieties at Filipino celebrations, named directly for its Cantonese noodle origin.',
    historicalContext:
      'Pancit canton uses a wheat-and-egg noodle brought by Cantonese immigrants, adapted with Filipino seasonings and vegetables over generations.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 2, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'citrus'],
    brothOrSauceRelationship:
      'Egg noodles are stir-fried with a soy-and-oyster-sauce mixture, pork or chicken, and vegetables, finished with a squeeze of calamansi.',
    relatedDishIds: ['pancit-bihon', 'chow-mein'],
    recipeId: 'pancit-canton',
    sourceNote: 'Consistent with widely documented Cantonese-derived pancit canton tradition.',
  },
  {
    id: 'pancit-palabok',
    name: 'Pancit Palabok',
    localName: 'pansit palabok',
    noodleTypeId: 'rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'philippines', cityOrAreaId: 'manila' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'Known for its vivid orange sauce and generous toppings, often served at celebrations as a more elaborate pancit than the everyday bihon.',
    historicalContext:
      'Palabok belongs to the broader pancit tradition shaped by Hokkien Chinese trading influence, distinguished by its shrimp-and-annatto sauce and layered toppings.',
    flavorProfile: { brothiness: 1, boldness: 3, richness: 3, chewiness: 1, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'citrus'],
    brothOrSauceRelationship:
      'Rice vermicelli is smothered in a thick, annatto-tinted shrimp sauce, then topped with crushed pork rind, smoked fish, boiled egg, and scallion.',
    relatedDishIds: ['pancit-bihon', 'pancit-malabon'],
    recipeId: 'pancit-palabok',
    sourceNote: 'Consistent with widely documented Filipino pancit palabok tradition.',
  },
  {
    id: 'pancit-malabon',
    name: 'Pancit Malabon',
    localName: 'pansit Malabon',
    noodleTypeId: 'thick-rice-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'philippines', cityOrAreaId: 'manila' },
    preparationStyle: 'dressed',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'Named for the coastal city of Malabon, known for a heavier reliance on seafood than most other pancit varieties.',
    historicalContext:
      'Pancit Malabon developed in the fishing city of Malabon, reflecting its seafood economy, and uses a thicker rice noodle than palabok\'s thin vermicelli to stand up to a heavier topping.',
    flavorProfile: { brothiness: 1, boldness: 3, richness: 3, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'Thick rice noodles are dressed in a similar annatto-shrimp sauce to palabok, then heavily topped with shrimp, squid, oysters, and crushed pork rind.',
    relatedDishIds: ['pancit-palabok'],
    recipeId: 'pancit-malabon',
    sourceNote: 'Consistent with widely documented Malabon pancit tradition and its seafood-forward toppings.',
  },
  {
    id: 'sotanghon',
    name: 'Sotanghon',
    localName: 'sotanghon',
    noodleTypeId: 'mung-bean-vermicelli',
    place: { regionId: 'southeast-asia', countryId: 'philippines', cityOrAreaId: 'manila' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'A common home-cooked comfort soup in the Philippines, often made for someone feeling unwell, similar to how chicken noodle soup functions elsewhere.',
    historicalContext:
      'Sotanghon uses mung bean vermicelli (glass noodles), reflecting Chinese trading influence on Filipino noodle cooking, adapted into a chicken-forward home soup.',
    flavorProfile: { brothiness: 5, boldness: 1, richness: 1, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A light chicken broth with sautéed garlic and onion is poured over glass noodles with shredded chicken and vegetables — a gentle, home-style soup.',
    relatedDishIds: ['pancit-bihon'],
    recipeId: 'sotanghon',
    sourceNote: 'Consistent with widely documented Filipino sotanghon soup tradition.',
  },
  {
    id: 'batchoy',
    name: 'Batchoy',
    localName: 'batsoy',
    noodleTypeId: 'miki-noodle',
    place: { regionId: 'southeast-asia', countryId: 'philippines', cityOrAreaId: 'iloilo' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'Closely identified with Iloilo City, often eaten as a hearty, rich breakfast or late-night dish.',
    historicalContext:
      'Batchoy is generally credited to Iloilo\'s Chinese-Filipino community, built around a pork-bone-and-offal broth distinct from other pancit-family dishes.',
    flavorProfile: { brothiness: 5, boldness: 3, richness: 4, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'smoky'],
    brothOrSauceRelationship:
      'A rich pork-bone broth, often built with pork offal and topped with crushed pork rind, chicharrón, and a raw egg cracked in to cook in the hot broth.',
    relatedDishIds: ['sotanghon'],
    recipeId: 'batchoy',
    sourceNote: "Consistent with widely credited Iloilo Chinese-Filipino origin of batchoy.",
  },
  // --- Korea ---
  {
    id: 'bibim-guksu',
    name: 'Bibim Guksu',
    localName: '비빔국수',
    noodleTypeId: 'somen',
    place: { regionId: 'east-asia', countryId: 'korea', cityOrAreaId: 'seoul' },
    preparationStyle: 'chilled',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A popular warm-weather dish in Korea, valued for being quick to make and sharply refreshing.',
    historicalContext:
      'Bibim guksu belongs to Korea\'s broader "bibim" (mixed) food tradition, applying the same hand-mixed, gochujang-forward approach used in bibimbap to a cold wheat noodle.',
    flavorProfile: { brothiness: 0, boldness: 4, richness: 1, chewiness: 2, spice: 3 },
    flavorTags: ['tangy', 'chili', 'sweet', 'fresh'],
    brothOrSauceRelationship:
      'Chilled thin wheat noodles are tossed with a gochujang-based sauce sharpened with vinegar and sugar, dressed rather than served in broth.',
    relatedDishIds: ['naengmyeon', 'kongguksu'],
    recipeId: 'bibim-guksu',
    sourceNote: "Consistent with widely documented Korean bibim guksu tradition, part of the broader Korean bibim food category.",
  },
  {
    id: 'janchi-guksu',
    name: 'Janchi Guksu',
    localName: '잔치국수',
    alternateNames: ['Banquet Noodles'],
    noodleTypeId: 'somen',
    place: { regionId: 'east-asia', countryId: 'korea', cityOrAreaId: 'seoul' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'Traditionally served at celebrations, especially weddings and birthdays, where the long noodle carries an association with a long, happy life.',
    historicalContext:
      'Janchi guksu\'s name literally means "banquet noodles," reflecting its long history as an affordable but meaningful celebratory dish in Korean home cooking.',
    flavorProfile: { brothiness: 4, boldness: 1, richness: 1, chewiness: 1, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A light anchovy-and-kelp broth is poured hot over thin wheat noodles, topped simply with egg strips, zucchini, and seaweed.',
    relatedDishIds: ['kalguksu'],
    relatedNoodleTypeIds: ['udon'],
    recipeId: 'janchi-guksu',
    sourceNote: 'Consistent with widely documented Korean janchi guksu tradition and its celebratory association.',
  },
  {
    id: 'kalguksu',
    name: 'Kalguksu',
    localName: '칼국수',
    noodleTypeId: 'kalguksu-noodle',
    place: { regionId: 'east-asia', countryId: 'korea', cityOrAreaId: 'seoul' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['knife-cut'],
    culturalContext:
      'A homey, comforting dish across Korea, closely tied to the image of hand-cut noodles made fresh in the kitchen right before cooking.',
    historicalContext:
      'Kalguksu ("knife noodles") reflects a long Korean home-cooking tradition of hand-rolling and knife-cutting fresh wheat dough directly into a simmering broth.',
    flavorProfile: { brothiness: 5, boldness: 2, richness: 2, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'fresh'],
    brothOrSauceRelationship:
      'A anchovy-and-kelp or chicken broth is simmered with hand-cut wheat noodles added directly, so the noodles release starch into the broth as they cook, lightly thickening it.',
    relatedDishIds: ['janchi-guksu'],
    workshopLessonSlugs: ['dough-lab'],
    recipeId: 'kalguksu',
    sourceNote: 'Consistent with widely documented Korean kalguksu tradition.',
  },
  {
    id: 'kongguksu',
    name: 'Kongguksu',
    localName: '콩국수',
    noodleTypeId: 'somen',
    place: { regionId: 'east-asia', countryId: 'korea', cityOrAreaId: 'seoul' },
    preparationStyle: 'chilled',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A distinctive Korean summer dish, known for its cold, savory soy-milk broth rather than a meat- or fish-based one.',
    historicalContext:
      'Kongguksu reflects a long Korean tradition of using ground soybean liquid as a savory, protein-rich broth base, historically valued as an accessible source of protein.',
    flavorProfile: { brothiness: 5, boldness: 1, richness: 3, chewiness: 1, spice: 0 },
    flavorTags: ['nutty', 'savory', 'fresh'],
    brothOrSauceRelationship:
      'Thin wheat noodles are chilled and served in a cold, creamy, unsweetened soy-milk broth, usually seasoned with just a little salt so the soybean flavor stays forward.',
    relatedDishIds: ['bibim-guksu'],
    recipeId: 'kongguksu',
    sourceNote: 'Consistent with widely documented Korean kongguksu tradition.',
  },
  // --- Japan (non-ramen) ---
  {
    id: 'kitsune-udon',
    name: 'Kitsune Udon',
    localName: 'きつねうどん',
    noodleTypeId: 'udon',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'osaka' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'Named for the fox (kitsune) of Japanese folklore, said to favor fried tofu, the dish\'s signature topping.',
    historicalContext:
      'Kitsune udon developed in the Kansai region, particularly associated with Osaka, where sweet-simmered fried tofu became a defining regional udon topping.',
    flavorProfile: { brothiness: 4, boldness: 1, richness: 2, chewiness: 4, spice: 0 },
    flavorTags: ['savory', 'sweet', 'aromatic'],
    brothOrSauceRelationship:
      'A light dashi-soy broth is poured over udon topped with a sheet of sweet-simmered fried tofu (aburaage), letting its sweetness offset the savory broth.',
    relatedDishIds: ['sanuki-udon', 'curry-udon'],
    recipeId: 'kitsune-udon',
    sourceNote: "Consistent with widely documented Kansai-region kitsune udon tradition.",
  },
  {
    id: 'curry-udon',
    name: 'Curry Udon',
    localName: 'カレーうどん',
    noodleTypeId: 'udon',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'osaka' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A comfort-food staple that emerged as Japanese curry became widely popular in the late 19th and 20th centuries.',
    historicalContext:
      'Curry udon developed after Japanese-style curry (itself adapted from British curry brought to Japan) was combined with an existing udon-and-dashi tradition, generally dated to the early 20th century.',
    flavorProfile: { brothiness: 4, boldness: 3, richness: 4, chewiness: 4, spice: 1 },
    flavorTags: ['aromatic', 'savory', 'sweet'],
    brothOrSauceRelationship:
      'A dashi broth thickened and flavored with Japanese curry roux is poured over udon, giving a broth that is thicker and richer than most other udon preparations.',
    relatedDishIds: ['kitsune-udon', 'khao-soi'],
    recipeId: 'curry-udon',
    sourceNote: 'Consistent with widely documented early-20th-century Japanese curry udon development.',
  },
  {
    id: 'kake-soba',
    name: 'Kake Soba',
    localName: 'かけそば',
    noodleTypeId: 'soba',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'nagano' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['shaved'],
    culturalContext:
      'The everyday hot counterpart to zaru soba, eaten year-round rather than as a summer-specific dish.',
    historicalContext:
      'Kake soba represents the simpler, older style of soba service — noodles in hot broth — that predates the cold zaru-style presentation that became popular later in the Edo period.',
    flavorProfile: { brothiness: 4, boldness: 1, richness: 1, chewiness: 2, spice: 0 },
    flavorTags: ['savory', 'aromatic', 'nutty'],
    brothOrSauceRelationship:
      'A hot dashi-soy broth is poured directly over the soba, typically topped simply with scallion, unlike zaru soba\'s dip-style tsuyu.',
    relatedDishIds: ['zaru-soba'],
    recipeId: 'kake-soba',
    sourceNote: 'Consistent with widely documented kake soba tradition as the older hot-service style of soba.',
  },
  {
    id: 'somen',
    name: 'Somen',
    localName: 'そうめん',
    noodleTypeId: 'somen',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'kagawa' },
    preparationStyle: 'chilled',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A summer staple across Japan, sometimes served in a flowing-water presentation (nagashi somen) at festivals and family gatherings.',
    historicalContext:
      'Somen-making traditions developed in wheat-growing regions across Japan, including Kagawa (also home to Sanuki udon), using hand-stretching with oil to achieve extremely thin strands.',
    flavorProfile: { brothiness: 1, boldness: 1, richness: 0, chewiness: 1, spice: 0 },
    flavorTags: ['savory', 'fresh', 'aromatic'],
    brothOrSauceRelationship:
      'Chilled noodles are dipped in a light tsuyu, similar to zaru soba but even lighter, since somen\'s delicate strands need a gentler dip.',
    relatedDishIds: ['zaru-soba', 'bibim-guksu'],
    recipeId: 'somen',
    sourceNote: 'Consistent with widely documented Japanese somen tradition and its regional wheat-noodle-making history.',
  },
  {
    id: 'hiyashi-chuka',
    name: 'Hiyashi Chuka',
    localName: '冷やし中華',
    noodleTypeId: 'chuka-soba',
    place: { regionId: 'east-asia', countryId: 'japan', cityOrAreaId: 'osaka' },
    preparationStyle: 'chilled',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A summer-only menu item at many Japanese restaurants, valued for its colorful, composed presentation of julienned toppings.',
    historicalContext:
      'Hiyashi chuka developed in the 20th century as a Japanese adaptation of Chinese noodle dishes, chilled and topped in a distinctly Japanese presentation style rather than following any single Chinese source dish directly.',
    flavorProfile: { brothiness: 0, boldness: 2, richness: 1, chewiness: 3, spice: 0 },
    flavorTags: ['tangy', 'savory', 'sweet', 'fresh'],
    brothOrSauceRelationship:
      'Chilled wheat noodles are arranged with julienned egg, ham, and cucumber, then finished with a tangy soy-vinegar dressing poured over the top.',
    relatedDishIds: ['yakisoba'],
    recipeId: 'hiyashi-chuka',
    sourceNote: 'Consistent with widely documented 20th-century Japanese development of hiyashi chuka.',
  },
  // --- Malaysia / Singapore / Indonesia ---
  {
    id: 'char-kway-teow',
    name: 'Char Kway Teow',
    localName: '炒粿條',
    romanization: 'chǎo guǒtiáo',
    noodleTypeId: 'shahe-fen',
    place: { regionId: 'southeast-asia', countryId: 'malaysia', cityOrAreaId: 'penang' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['stretched'],
    culturalContext:
      'A beloved hawker-stall dish across Malaysia and Singapore, often cooked in small batches over intense heat by a single dedicated wok cook.',
    historicalContext:
      'Char kway teow developed within Teochew and Hokkien Chinese hawker cooking on the Malay Peninsula, using the same flat rice noodle format as Cantonese ho fun under a different regional name and seasoning tradition.',
    flavorProfile: { brothiness: 0, boldness: 4, richness: 3, chewiness: 2, spice: 1 },
    flavorTags: ['smoky', 'savory', 'aromatic'],
    brothOrSauceRelationship:
      'Flat rice noodles are seared hard in pork fat with dark soy sauce, chile, egg, and often shrimp or Chinese sausage, prized for a strong wok hei char.',
    relatedDishIds: ['beef-chow-fun', 'hokkien-mee'],
    workshopLessonSlugs: ['stir-fry-technique'],
    recipeId: 'char-kway-teow',
    sourceNote: 'Consistent with widely documented Teochew/Hokkien-influenced char kway teow tradition on the Malay Peninsula.',
  },
  {
    id: 'hokkien-mee',
    name: 'Hokkien Mee',
    localName: '福建麵',
    romanization: 'Fújiàn miàn',
    noodleTypeId: 'yellow-egg-noodle',
    place: { regionId: 'southeast-asia', countryId: 'malaysia', cityOrAreaId: 'kuala-lumpur' },
    preparationStyle: 'dry-sauced',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A name that covers genuinely different dishes in different cities — Kuala Lumpur\'s dark, braised-noodle version and Singapore/Penang\'s prawn-broth version share a name but not a plate.',
    historicalContext:
      'Hokkien mee reflects Hokkien Chinese immigrant cooking on the Malay Peninsula and in Singapore, which diverged regionally enough that "Hokkien mee" today names at least two distinct dishes rather than one.',
    flavorProfile: { brothiness: 1, boldness: 4, richness: 4, chewiness: 3, spice: 0 },
    flavorTags: ['savory', 'smoky', 'aromatic'],
    brothOrSauceRelationship:
      'Thick yellow egg noodles are braised in a dark, rich soy-and-pork-fat sauce until deeply flavored, a style specifically associated with Kuala Lumpur (distinct from Penang/Singapore\'s prawn-broth version).',
    relatedDishIds: ['char-kway-teow', 'mee-goreng'],
    recipeId: 'hokkien-mee',
    sourceNote: 'Consistent with widely documented regional divergence of "Hokkien mee" between Kuala Lumpur and Penang/Singapore; this record describes the Kuala Lumpur braised-noodle style specifically.',
  },
  {
    id: 'mee-goreng',
    name: 'Mee Goreng',
    localName: 'mi goreng',
    noodleTypeId: 'yellow-egg-noodle',
    place: { regionId: 'southeast-asia', countryId: 'malaysia', cityOrAreaId: 'kuala-lumpur' },
    preparationStyle: 'stir-fried',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A hawker and home-kitchen staple across Malaysia, Singapore, and Indonesia, with meaningfully different regional versions rather than one fixed recipe.',
    historicalContext:
      'Mee goreng ("fried noodles") reflects Malay, Chinese, and Indian culinary influence on the Malay Peninsula; the Malaysian mamak-stall version in particular reflects Indian Muslim (mamak) cooking traditions.',
    flavorProfile: { brothiness: 0, boldness: 3, richness: 2, chewiness: 3, spice: 2 },
    flavorTags: ['savory', 'tangy', 'sweet', 'chili'],
    brothOrSauceRelationship:
      'Yellow egg noodles are stir-fried with a tomato-and-chile-based sauce, egg, and often tofu and potato, giving a tangier, sweeter profile than most other wok noodle dishes in the region.',
    relatedDishIds: ['hokkien-mee'],
    recipeId: 'mee-goreng',
    sourceNote: 'Consistent with widely documented Malay-Chinese-Indian (mamak) influence on Malaysian mee goreng.',
  },
  {
    id: 'assam-laksa',
    name: 'Assam Laksa',
    localName: 'laksa asam',
    noodleTypeId: 'laksa-noodle',
    place: { regionId: 'southeast-asia', countryId: 'malaysia', cityOrAreaId: 'penang' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['extruded'],
    culturalContext:
      'Penang\'s signature laksa style, a sour-fish broth genuinely distinct from curry laksa\'s coconut-milk base despite sharing the "laksa" name.',
    historicalContext:
      'Assam (tamarind) laksa developed within Penang\'s Peranakan and Malay culinary tradition, built on a tamarind-soured fish broth rather than curry laksa\'s coconut-curry base — the two are often confused by name alone.',
    flavorProfile: { brothiness: 5, boldness: 4, richness: 1, chewiness: 2, spice: 2 },
    flavorTags: ['tangy', 'aromatic', 'savory', 'fermented'],
    brothOrSauceRelationship:
      'A tamarind-soured fish broth, flavored with galangal, lemongrass, and torch ginger flower, is poured over thick rice noodles and finished with a spoonful of dark shrimp paste (hae ko).',
    relatedDishIds: ['curry-laksa'],
    recipeId: 'assam-laksa',
    sourceNote: "Consistent with widely documented Penang assam laksa tradition, explicitly distinguished here from curry laksa despite the shared name.",
  },
  {
    id: 'mee-rebus',
    name: 'Mee Rebus',
    localName: 'mee rebus',
    noodleTypeId: 'yellow-egg-noodle',
    place: { regionId: 'southeast-asia', countryId: 'malaysia', cityOrAreaId: 'kuala-lumpur' },
    preparationStyle: 'soup',
    primaryTechniqueIds: ['rolled-and-cut'],
    culturalContext:
      'A Malay hawker-stall favorite known for its thick, sweet-savory potato-based gravy rather than a clear broth.',
    historicalContext:
      'Mee rebus reflects Malay culinary tradition on the peninsula, built around a starch-thickened sweet potato and spice gravy distinct from the coconut- or curry-based broths of laksa.',
    flavorProfile: { brothiness: 3, boldness: 3, richness: 4, chewiness: 3, spice: 1 },
    flavorTags: ['sweet', 'savory', 'aromatic'],
    brothOrSauceRelationship:
      'Yellow egg noodles are covered in a thick, sweet-savory gravy made from mashed sweet potato and a spice paste, topped with boiled egg, fried shallot, and lime.',
    relatedDishIds: ['hokkien-mee'],
    recipeId: 'mee-rebus',
    sourceNote: 'Consistent with widely documented Malay mee rebus tradition.',
  },
];
