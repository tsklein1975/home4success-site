import { MultipleChoiceQuestion, OrderingQuestion, ReadingQuestion } from './englishCurriculum';

/**
 * UTILS
 */
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

const HEBREW_WORD_POOL = [
  { text: 'ארנב', wordNikud: 'אַרְנָב', icon: '🐰', letter: 'א', letterNikud: 'אַ' },
  { text: 'ברז', wordNikud: 'בֶּרֶז', icon: '🚰', letter: 'ב', letterNikud: 'בֶּ' },
  { text: 'גיטרה', wordNikud: 'גִּיטָרָה', icon: '🎸', letter: 'ג', letterNikud: 'גִּ' },
  { text: 'דף', wordNikud: 'דַּף', icon: '📄', letter: 'ד', letterNikud: 'דַּ' },
  { text: 'דג', wordNikud: 'דָּג', icon: '🐟', letter: 'ד', letterNikud: 'דָּ' },
  { text: 'הר', wordNikud: 'הַר', icon: '⛰️', letter: 'ה', letterNikud: 'הַ' },
  { text: 'וופל', wordNikud: 'וָפֶל', icon: '🧇', letter: 'ו', letterNikud: 'וָ' },
  { text: 'זית', wordNikud: 'זַיִת', icon: '🫒', letter: 'ז', letterNikud: 'זַ' },
  { text: 'חבל', wordNikud: 'חֶבֶל', icon: '🪢', letter: 'ח', letterNikud: 'חֶ' },
  { text: 'טלפון', wordNikud: 'טֶלֶפוֹן', icon: '☎️', letter: 'ט', letterNikud: 'טֶ' },
  { text: 'יד', wordNikud: 'יָד', icon: '✋', letter: 'י', letterNikud: 'יָ' },
  { text: 'יו-יו', wordNikud: 'יוֹ-יוֹ', icon: '🪀', letter: 'י', letterNikud: 'יוֹ' },
  { text: 'כדור', wordNikud: 'כַּדּוּר', icon: '⚽', letter: 'כ', letterNikud: 'כַּ' },
  { text: 'כריש', wordNikud: 'כָּרִישׁ', icon: '🦈', letter: 'כ', letterNikud: 'כָּ' },
  { text: 'למה', wordNikud: 'לָמָה', icon: '🦙', letter: 'ל', letterNikud: 'לָ' },
  { text: 'מכונית', wordNikud: 'מְכוֹנִית', icon: '🚗', letter: 'מ', letterNikud: 'מְ' },
  { text: 'מלח', wordNikud: 'מֶלַח', icon: '🧂', letter: 'מ', letterNikud: 'מֶ' },
  { text: 'נעליים', wordNikud: 'נַעֲלַיִם', icon: '👟', letter: 'נ', letterNikud: 'נַ' },
  { text: 'נחש', wordNikud: 'נָחָשׁ', icon: '🐍', letter: 'נ', letterNikud: 'נָ' },
  { text: 'ספסל', wordNikud: 'סַפְסָל', icon: '🛋️', letter: 'ס', letterNikud: 'סַ' },
  { text: 'עכבר', wordNikud: 'עַכְבָּר', icon: '🐭', letter: 'ע', letterNikud: 'עַ' },
  { text: 'עטלף', wordNikud: 'עֲטַלֵּף', icon: '🦇', letter: 'ע', letterNikud: 'עֲ' },
  { text: 'פיצה', wordNikud: 'פִּיצָה', icon: '🍕', letter: 'פ', letterNikud: 'פִּ' },
  { text: 'פטריה', wordNikud: 'פִּטְרִיָּה', icon: '🍄', letter: 'פ', letterNikud: 'פִּ' },
  { text: 'צב', wordNikud: 'צָב', icon: '🐢', letter: 'צ', letterNikud: 'צָ' },
  { text: 'קוף', wordNikud: 'קוֹף', icon: '🐒', letter: 'ק', letterNikud: 'קוֹ' },
  { text: 'רגל', wordNikud: 'רֶגֶל', icon: '🦶', letter: 'ר', letterNikud: 'רֶ' },
  { text: 'שיניים', wordNikud: 'שִׁנַּיִם', icon: '🦷', letter: 'ש', letterNikud: 'שִׁ' },
  { text: 'תנין', wordNikud: 'תַּנִּין', icon: '🐊', letter: 'ת', letterNikud: 'תַּ' },
  { text: 'תרנגול', wordNikud: 'תַּרְנְגוֹל', icon: '🐓', letter: 'ת', letterNikud: 'תַּ' },
];

/**
 * Special pool for Grade 1 "Missing Letter" with Nikud
 */
const SPELLING_POOL_G1 = [
  { word: 'בַּלּוֹן', missing: 'בַּ', display: '_לּוֹן', icon: '🎈' },
  { word: 'גִּיטָרָה', missing: 'גִּ', display: '_יטָרָה', icon: '🎸' },
  { word: 'דָּג', missing: 'דָּ', display: '_ג', icon: '🐟' },
  { word: 'הַר', missing: 'הַ', display: '_ר', icon: '⛰️' },
  { word: 'וָפֶל', missing: 'וָ', display: '_פֶל', icon: ' waffle' },
  { word: 'זַיִת', missing: 'זַ', display: '_יִת', icon: '🫒' },
  { word: 'חָתוּל', missing: 'חָ', display: '_תוּל', icon: '🐱' },
  { word: 'טֶלֶפוֹן', missing: 'טֶ', display: '_לֶפוֹן', icon: '☎️' },
  { word: 'יָד', missing: 'יָ', display: '_ד', icon: '✋' },
  { word: 'כַּדּוּר', missing: 'כַּ', display: '_דּוּר', icon: '⚽' },
  { word: 'לָמָה', missing: 'לָ', display: '_מָה', icon: '🦙' },
  { word: 'מְכוֹנִית', missing: 'מְ', display: '_כוֹנִית', icon: '🚗' },
  { word: 'נַעֲלַיִם', missing: 'נַ', display: '_עֲלַיִם', icon: '👟' },
  { word: 'סַפְסָל', missing: 'סַ', display: '_פְסָל', icon: '🛋️' },
  { word: 'עַכְבָּר', missing: 'עַ', display: '_כְבָּר', icon: '🐭' },
  { word: 'פִּיצָה', missing: 'פִּ', display: '_יצָה', icon: '🍕' },
  { word: 'צָב', missing: 'צָ', display: '_ב', icon: '🐢' },
  { word: 'קָפֶה', missing: 'קָ', display: '_פֶה', icon: '☕' },
  { word: 'רֶגֶל', missing: 'רֶ', display: '_גֶל', icon: '🦶' },
  { word: 'שִׁנַּיִם', missing: 'שִׁ', display: '_נַיִם', icon: '🦷' },
  { word: 'תַּפּוּחַ', missing: 'תַּ', display: '_פּוּחַ', icon: '🍎' },
];

export function getAllHebrewMultipleChoice(targetDataId: string): MultipleChoiceQuestion[] {
  switch (targetDataId) {
    case 'he_grade1_beginning_sound': {
      return HEBREW_WORD_POOL.map(correct => {
        const otherLettersData = HEBREW_WORD_POOL.filter(l => l.letterNikud && l.letterNikud !== correct.letterNikud);
        const uniqueDistractorPool = Array.from(new Map(otherLettersData.map(item => [item.letterNikud, item])).values());
        const distractors = pick(uniqueDistractorPool, 3);
        return {
          questionDisplay: correct.icon,
          audioText: correct.text,
          correctAnswer: { text: correct.letterNikud || correct.letter, audioText: correct.letterNikud || correct.letter },
          options: shuffle([
            { text: correct.letterNikud || correct.letter, audioText: correct.letterNikud || correct.letter },
            ...distractors.map(d => ({ text: d.letterNikud || d.letter, audioText: d.letterNikud || d.letter }))
          ]),
          type: 'icon-only',
        };
      });
    }

    case 'he_grade1_match': {
      return HEBREW_WORD_POOL.map(correct => {
        const distractors = pick(HEBREW_WORD_POOL.filter(w => w.letter !== correct.letter), 3);
        return {
          questionDisplay: correct.letterNikud || correct.letter,
          audioText: correct.letterNikud || correct.letter,
          correctAnswer: { text: correct.text, icon: correct.icon, audioText: correct.text },
          options: shuffle([
            { text: correct.text, icon: correct.icon, audioText: correct.text }, 
            ...distractors.map(d => ({ text: d.text, icon: d.icon, audioText: d.text }))
          ]),
          type: 'icon-only',
        };
      });
    }

    case 'he_grade1_spelling': {
      return SPELLING_POOL_G1.map(q => {
        const distractors = shuffle(['מְ', 'נַ', 'סַ', 'לָ', 'פִּ', 'צָ', 'בַּ', 'גִּ', 'דָּ']).filter(d => d !== q.missing).slice(0, 3);
        return {
          questionDisplay: q.display,
          // audioText: q.word, // REMOVED: User requested no sounds for this game
          correctAnswer: { text: q.missing },
          options: shuffle([{ text: q.missing }, ...distractors.map(d => ({ text: d }))]),
          type: 'text-only',
        };
      });
    }

    case 'he_grade2_sentence': {
      const qs = [
        { s: 'אֲנִי אוֹהֵב לֶאֱכֹל ___.', a: 'תַּפּוּחַ', d: ['כִּסֵּא', 'שֻׁלְחָן', 'עִפָּרוֹן'] },
        { s: 'הַכֶּלֶב שֶׁלִּי יָשֵׁן עַל ___.', a: 'מִטָּה', d: ['תַּפּוּחַ', 'שָׁמַיִם', 'כּוֹס'] },
        { s: '___ כּוֹתֵב בְּעֶזְרַת עִפָּרוֹן.', a: 'דָּנִי', d: ['כַּף', 'כַּדּוּר', 'בַּקְבּוּק'] },
        { s: 'אִמָּא בְּתוֹךְ ___ מְבַשֶּׁלֶת אֹכֶל.', a: 'מִטְבָּח', d: ['גַּן', 'חוֹף', 'מְכוֹנִית'] },
        { s: 'הַיְּלָדִים שִׂחֲקוּ בְּכַדּוּר בַּ___ אֶתְמוֹל.', a: 'חָצֵר', d: ['סֵפֶר', 'כֶּלֶב', 'שֻׁלְחָן'] },
        { s: 'הַצִּפּוֹר עוֹפֶפֶת בְּתוֹךְ הַ___.', a: 'שָׁמַיִם', d: ['בַּיִת', 'יָם', 'מְקָרֵר'] },
        { s: '___ שׁוֹתָה מַיִם מֵהַכּוֹס.', a: 'דָּנָה', d: ['תִּיק', 'צַלַּחַת', 'רִצְפָּה'] },
        { s: 'אֲנַחְנוּ רוֹאִים בָּעֵינַיִם וְ___ בָּאָזְנַיִם.', a: 'שׁוֹמְעִים', d: ['רָצִים', 'אוֹכְלִים', 'קוֹפְצִים'] },
        { s: 'בַּ___ הַשֶּׁמֶשׁ זוֹרַחַת.', a: 'בֹּקֶר', d: ['לַיְלָה', 'עֶרֶב', 'מָחָר'] },
        { s: 'הַיָּרֵחַ מוֹפִיעַ יַחַד עִם כּוֹכָבִים בַּ___.', a: 'לַיְלָה', d: ['שֶׁמֶשׁ', 'עָנָן', 'גֶּשֶׁם'] },
      ];
      return qs.map(q => ({
        questionDisplay: q.s,
        correctAnswer: { text: q.a },
        options: shuffle([{ text: q.a }, ...q.d.map(t => ({ text: t }))]),
        type: 'text-only',
      }));
    }

    case 'he_grade2_punctuation': {
      const qs = [
        { s: 'אֵיפֹה הַכַּדּוּר שֶׁלִּי', a: '?', d: ['.'] },
        { s: 'דָּנִי הָלַךְ לַבַּיִת', a: '.', d: ['?'] },
        { s: 'מִי אָכַל אֶת הַתַּפּוּחַ', a: '?', d: ['.'] },
        { s: 'הַשֶּׁמֶשׁ זוֹרַחַת הַיּוֹם', a: '.', d: ['?'] },
        { s: 'כַּמָּה זֶה עוֹלֶה', a: '?', d: ['.'] },
        { s: 'אֲנִי אוֹהֵב לְשַׂחֵק', a: '.', d: ['?'] },
        { s: 'אֵיךְ קוֹרְאִים לְךָ', a: '?', d: ['.'] },
        { s: 'הַחָתוּל יָשֵׁן שְׁנַת יְשָׁרִים', a: '.', d: ['?'] },
      ];
      return qs.map(q => ({
        questionDisplay: `הוֹסִיפוּ נְקוּדָה אוֹ סִימַן שְׁאֵלָה:\n${q.s} `,
        correctAnswer: { text: q.a },
        options: shuffle([{ text: q.a }, ...q.d.map(t => ({ text: t }))]),
        type: 'text-only',
      }));
    }

    case 'he_grade2_gender': {
      const qs = [
        { s: 'יֶלֶד', a: 'זָכָר', d: ['נְקֵבָה'] },
        { s: 'יַלְדָּה', a: 'נְקֵבָה', d: ['זָכָר'] },
        { s: 'מַחְבֶּרֶת', a: 'נְקֵבָה', d: ['זָכָר'] },
        { s: 'סֵפֶר', a: 'זָכָר', d: ['נְקֵבָה'] },
        { s: 'אוֹטוֹ', a: 'זָכָר', d: ['נְקֵבָה'] },
        { s: 'שֶׁמֶשׁ', a: 'נְקֵבָה', d: ['זָכָר'] }, // Shemesh is generally female
        { s: 'תַּפּוּחַ', a: 'זָכָר', d: ['נְקֵבָה'] },
        { s: 'צַלַּחַת', a: 'נְקֵבָה', d: ['זָכָר'] },
      ];
      return qs.map(q => ({
        questionDisplay: `הַאִם הַמִּלָּה "${q.s}" הִיא זָכָר אוֹ נְקֵבָה?`,
        correctAnswer: { text: q.a },
        options: shuffle([{ text: q.a }, ...q.d.map(t => ({ text: t }))]),
        type: 'text-only',
      }));
    }

    case 'he_grade2_opposites_pairs': {
      const qs = [
        { c: 'גָּדוֹל - קָטָן' },
        { c: 'אוֹר - חֹשֶׁךְ' },
        { c: 'קַר - חַם' },
        { c: 'טוֹב - רַע' },
        { c: 'מָהִיר - אִטִּי' },
        { c: 'יָשֵׁן - עֵר' },
        { c: 'צְחוֹק - בֶּכִי' },
      ];
      const distractorsPool = [
        'אָדֹם - צָהוֹב', 'שָׁמַיִם - יָם', 'עַיִן - אוֹזֶן', 'מַיִם - סוּס',
        'אִמָּא - אַבָּא', 'רִצְפָּה - תִּקְרָה', 'שֻׁלְחָן - כִּסֵּא', 'יָד - רֶגֶל',
        'יָרֵחַ - כּוֹכָב', 'שִׁיר - סִפּוּר', 'חָתוּל - כֶּלֶב', 'פֶּרַח - עֵץ',
        'יַלְדָּה - אִשָּׁה', 'תַּפּוּחַ - תַּפּוּז'
      ];
      return qs.map(q => {
        const distractors = [...distractorsPool].sort(() => Math.random() - 0.5).slice(0, 3);
        return {
          questionDisplay: 'אֵיזֶה זֶה צֶמֶד הֲפָכִים נָכוֹן?',
          correctAnswer: { text: q.c },
          options: shuffle([{ text: q.c }, ...distractors.map(t => ({ text: t }))]),
          type: 'text-only',
        };
      });
    }

    case 'he_grade1_oddone':
    case 'he_grade2_oddone': {
      const sets = [
        { items: ['חָתוּל', 'כֶּלֶב', 'סוּס', 'תַּפּוּחַ'], odd: 'תַּפּוּחַ' },
        { items: ['תַּפּוּחַ', 'לֶחֶם', 'גְּבִינָה', 'כִּסֵּא'], odd: 'כִּסֵּא' },
        { items: ['שֻׁלְחָן', 'כִּסֵּא', 'מִטָּה', 'נָחָשׁ'], odd: 'נָחָשׁ' },
        { items: ['יָם', 'נָהָר', 'אֲגַם', 'הַר'], odd: 'הַר' },
        { items: ['חָצִיל', 'גֶּזֶר', 'עַגְבָניָּה', 'בָּנָנָה'], odd: 'בָּנָנָה' },
        { items: ['צָהֹב', 'אָדֹם', 'יָרֹק', 'שָׂמֵחַ'], odd: 'שָׂמֵחַ' },
        { items: ['רֹאשׁ', 'יָד', 'רֶגֶל', 'חוּלְצָה'], odd: 'חוּלְצָה' },
        { items: ['מַזְלֵג', 'כַּף', 'סַכִּין', 'גֶּרֶב'], odd: 'גֶּרֶב' },
        { items: ['קַיִץ', 'חֹרֶף', 'סְתָיו', 'גֶּשֶׁם'], odd: 'גֶּשֶׁם' },
        { items: ['אוֹטוֹבּוּס', 'מָטוֹס', 'רַכֶּבֶת', 'סֵפֶר'], odd: 'סֵפֶר' },
      ];
      return sets.map(q => ({
        questionDisplay: 'מָה לֹא שַׁיָּךְ לַקְּבוּצָה?',
        correctAnswer: { text: q.odd },
        options: shuffle(q.items.map(i => ({ text: i }))),
        type: 'text-only',
      }));
    }

    case 'he_grade3_word_match':
    case 'he_grade2_word_match': {
       return HEBREW_WORD_POOL.map(correct => {
         const distractors = pick(HEBREW_WORD_POOL.filter(w => w.text !== correct.text), 3);
         return {
           questionDisplay: correct.wordNikud,
           correctAnswer: { text: correct.wordNikud, icon: correct.icon },
           options: shuffle([{ text: correct.wordNikud, icon: correct.icon }, ...distractors.map(d => ({ text: d.wordNikud, icon: d.icon }))]),
           type: 'icon-only',
         };
       });
    }

    case 'he_grade4_opposites': {
      const pool = [
        { w: 'גָדּוֹל', a: 'קָטָן', d: ['עֲנָק', 'יָפֶה', 'רָחָב'] },
        { w: 'חַם', a: 'קַר', d: ['לוֹהֵט', 'נָעִים', 'לַח'] },
        { w: 'מַהֵר', a: 'לְאַט', d: ['חָזָק', 'חַלָּשׁ', 'גָּבֹהַ'] },
        { w: 'שָׂמֵחַ', a: 'עָצוּב', d: ['כּוֹעֵס', 'יָשֵׁן', 'חוֹלֶה'] },
        { w: 'לַיְלָה', a: 'יוֹם', d: ['עֶרֶב', 'בּוֹקֶר', 'שַׁחַר'] },
        { w: 'פְּנִימָה', a: 'הַחוּצָה', d: ['לְמַעְלָה', 'לְמַטָּה', 'לַצַּד'] },
        { w: 'יָבֵשׁ', a: 'רָטוּב', d: ['נָקִי', 'מְלֻכְלָךְ', 'קַר'] },
        { w: 'חָדָשׁ', a: 'יָשָׁן', d: ['יָפֶה', 'גָּדוֹל', 'קְנִיָּה'] },
        { w: 'מֵעַל', a: 'מִתַּחַת', d: ['לְיַד', 'בְּתוֹךְ', 'מִחוּץ'] },
        { w: 'הַתְחָלָה', a: 'סוֹף', d: ['אֶמְצַע', 'קוֹדֵם', 'אַחֲרֵי'] },
      ];
      return pool.map(q => ({
        questionDisplay: `מָהוּ הַהֵפֶךְ שֶׁל "${q.w}"?`,
        correctAnswer: { text: q.a },
        options: shuffle([{ text: q.a }, ...q.d.map(t => ({ text: t }))]),
        type: 'text-only',
      }));
    }
    
    case 'he_grade5_grammar': {
      const qs = [
        { s: 'אֶתְמוֹל אֲנַחְנוּ ___ לַסֶּרֶט.', a: 'הָלַכְנוּ', d: ['הוֹלְכִים', 'נֵלֵךְ', 'לָלֶכֶת'] },
        { s: 'הַיְּלָדִים ___ בֶּחָצֵר כָּעֵת.', a: 'מְשַׂחֲקִים', d: ['שִׂחֲקוּ', 'יְשַׂחֲקוּ', 'מִשְׂחָק'] },
        { s: 'מָחָר הִיא ___ שִׁיר חָדָשׁ.', a: 'תָּשִׁיר', d: ['שָׁרָה', 'שָׁרִים', 'שִׁיר'] },
        { s: 'הַכֶּלֶב ___ מַהֵר מְאֹד.', a: 'רָץ', d: ['רָצָה', 'רָצִים', 'לָרוּץ'] },
        { s: 'אֲנַחְנוּ ___ סְפָרִים כָּל יוֹם.', a: 'קוֹרְאִים', d: ['קָרָאנוּ', 'נִקְרָא', 'קוֹרֵא'] },
        { s: 'הִיא ___ אֲרוּחַת עֶרֶב עַכְשָׁיו.', a: 'מְכִינָה', d: ['הֵכִינָה', 'תָּכִין', 'מְכִינִים'] },
        { s: 'הֵם ___ לַמִּטָּה מֻקְדָּם.', a: 'הָלְכוּ', d: ['הוֹלֵךְ', 'הוֹלְכוֹת', 'נֵלֵךְ'] },
        { s: 'הַחָתוּל ___ עַל הַגָּדֵר.', a: 'קָפַץ', d: ['קוֹפֶצֶת', 'קָפְצוּ', 'לִקְפֹּץ'] },
        { s: 'מָחָר ___ לְטִיּוּל שְׁנָתִי.', a: 'נֵצֵא', d: ['יָצָאנוּ', 'יוֹצְאִים', 'לָצֵאת'] },
        { s: 'דָּנִי וְיוֹסִי ___ בְּכַדּוּרֶגֶל.', a: 'מְשַׂחֲקִים', d: ['שִׂחֲקוּ', 'יְשַׂחֲקוּ', 'מִשְׂחָק'] },
      ];
      return qs.map(q => ({
        questionDisplay: q.s,
        correctAnswer: { text: q.a },
        options: shuffle([{ text: q.a }, ...q.d.map(t => ({ text: t }))]),
        type: 'text-only',
      }));
    }

    default: return [getHebrewMultipleChoice(targetDataId)];
  }
}

export function getHebrewMultipleChoice(targetDataId: string): MultipleChoiceQuestion {
  const all = getAllHebrewMultipleChoice(targetDataId);
  return all[Math.floor(Math.random() * all.length)];
}

export function getAllHebrewOrdering(targetDataId: string): (OrderingQuestion | (OrderingQuestion & { blankedIndices: number[] }))[] {
  switch (targetDataId) {
    case 'he_grade4_sentence_build': {
      const sentences = [
        'הַיֶּלֶד הָלַךְ לְבֵית הַסֵּפֶר',
        'אֲנַחְנוּ אוֹהֲבִים לְשַׂחֵק בְּכַדּוּר',
        'אֲנִי אוֹכֵל תַּפּוּחַ יָרֹק וְגָדוֹל',
        'הַכֶּלֶב יָשַׁן עַל מִיטָּתוֹ',
        'הַמּוֹרָה כָּתְבָה עַל הַלוּחַ',
        'הַפֶּרַח צוֹמֵחַ בַּגִּינָּה הַיָּפָה',
        'אַבָּא קוֹרֵא סֵפֶר בַּסָּלוֹן',
        'הַחָתוּל קָפַץ עַל הַגָּדֵר',
        'יָצָאנוּ לְטִיּוּל בֶּהָרִים הַגְּבוֹהִים',
        'הַמַּיִם בַּיָּם כְּחוּלִּים וּנְעִימִים',
      ];
      return sentences.map(s => ({ instruction: 'סַדְּרוּ אֶת הַמִּילִים לְמִשְׁפָּט הֶגְיוֹנִי:', items: s.split(' ') }));
    }
    case 'he_grade1_sentence_build': {
      const sentences = [
        'הַיֶּלֶד הוֹלֵךְ לַגַּן',
        'הַכֶּלֶב רָץ בַּחָצֵר',
        'אִמָּא אוֹהֶבֶת אוֹתִי מְאוֹד',
        'אֲנִי אוֹכֵל תַּפּוּחַ אָדֹם',
        'הַשֶּׁמֶשׁ זוֹרַחַת בַּבּוֹקֶר',
        'יֵשׁ לִי כַּדּוּר כָּחֹל וְגָדוֹל',
        'אַבָּא קוֹנֶה לֶחֶם טָרִי',
        'הַחֲתוּלָה יְשֵׁנָה עַל הַסַּפָּה',
        'אֲנִי רוֹצֶה לְשַׂחֵק בַּחֲבֵרִים',
        'הַפֶּרַח יָפֶה וְצִבְעוֹנִי',
      ];
      return sentences.map(s => ({ 
        instruction: 'סַדְּרוּ אֶת הַמִּילִים לְמִשְׁפָּט הֶגְיוֹנִי:', 
        items: s.split(' ') 
      }));
    }
    case 'he_grade2_abc_sort': {
      const wordGroups = [
        ['אַרְיֵה', 'בַּיִת', 'גָּמָל', 'דֶּלֶת'],
        ['הַר', 'וֶרֶד', 'זְאֵב', 'חָתוּל'],
        ['מַיִם', 'נָחָשׁ', 'סוּס', 'עַיִן'],
        ['פַּרְפַּר', 'צָב', 'קוֹף', 'רַכֶּבֶת'],
        ['כֶּלֶב', 'לֶחֶם', 'מֶלֶךְ', 'נַעַל'],
        ['אוֹר', 'בָּלוֹן', 'חֲלוֹם', 'כַּדּוּר'],
        ['דָּג', 'זַיִת', 'טַבַּעַת', 'יָרֵחַ'],
        ['עֵץ', 'פֶּרַח', 'שִׂמְלָה', 'תַּפּוּחַ'],
        ['אָדֹם', 'כָּחֹל', 'שָׁחֹר', 'תְּכֵלֶת'],
        ['בֹּקֶר', 'לַיְלָה', 'צָהֳרַיִם', 'עֶרֶב']
      ];
      return wordGroups.map(group => ({ instruction: 'סַדְּרוּ אֶת הַמִּלִּים לְפִי הָא״ב:', items: group }));
    }
    case 'he_grade1_ordering': {
      const alphabetGroups = [
        ['א', 'ב', 'ג', 'ד'],
        ['ה', 'ו', 'ז', 'ח'],
        ['ט', 'י', 'כ', 'ל'],
        ['מ', 'נ', 'ס', 'ע'],
        ['פ', 'צ', 'ק', 'ר'],
        ['ש', 'ת', 'א', 'ב'],
        ['ג', 'ד', 'ה', 'ו'],
        ['ז', 'ח', 'ט', 'י'],
        ['כ', 'ל', 'מ', 'נ'],
        ['ס', 'ע', 'פ', 'צ'],
      ];
      return alphabetGroups.map(group => ({ 
        instruction: 'סַדְּרוּ אֶת הָאוֹתִיּוֹת לְפִי הָא״ב:', 
        items: group,
        blankedIndices: [1, 2] // Blank 2nd and 3rd letters for sorting
      }));
    }
    default: return [];
  }
}

export function getHebrewOrdering(targetDataId: string): OrderingQuestion {
  const all = getAllHebrewOrdering(targetDataId);
  return all[Math.floor(Math.random() * all.length)] || { instruction: 'סַדְּרוּ:', items: [] };
}

export function getAllHebrewReading(targetDataId: string): ReadingQuestion[] {
  switch (targetDataId) {
    case 'he_grade3_reading': {
      return [
        {
          passage: 'בְּיוֹם שַׁבָּת נָסַעְנוּ לַיָּם. הַשֶּׁמֶשׁ זָרְחָה וְהַמַּיִם הָיוּ קְרִירִים וּנְעִימִים. אַבָּא קָנָה לָנוּ אַרְטִיק לִימוֹן, וְאִמָּא בָּנְתָה אִתָּנוּ אַרְמוֹן חוֹל עֲנָק. שִׂחַקְנוּ שָׁם כָּל הַיּוֹם.',
          question: 'מָה קָנָה אַבָּא?',
          correctAnswer: 'אַרְטִיק לִימוֹן',
          options: shuffle(['אַרְטִיק שׁוֹקוֹ', 'אַרְטִיק לִימוֹן', 'גְּלִידָה', 'שְׁתִיָּה קָרָה']),
        },
        {
          passage: 'דָּנִי וְרוֹנִי מָצְאוּ גּוּר כְּלָבִים קָטָן בָּרְחוֹב. הֵם לָקְחוּ אוֹתוֹ הַבַּיְתָה וְנָתְנוּ לוֹ מַיִם וְאוֹכֶל חַם. הֵם קָרְאוּ לוֹ "לָאקִי" כִּי הוּא נִמְצָא בְּדִיּוּק בַּזְּמַן.',
          question: 'אֵיךְ קָרְאוּ הַיְּלָדִים לַגּוּר?',
          correctAnswer: 'לָאקִי',
          options: shuffle(['שׁוּקִי', 'לָאקִי', 'בּוֹנִי', 'כֶּלֶב']),
        },
      ];
    }
    default: return [];
  }
}

export function getHebrewReading(targetDataId: string): ReadingQuestion {
  const all = getAllHebrewReading(targetDataId);
  return all[Math.floor(Math.random() * all.length)] || { passage: '', question: '', correctAnswer: '', options: [] };
}

export function getAllHebrewTyping(targetDataId: string): import('./englishCurriculum').TypingQuestion[] {
  switch (targetDataId) {
    case 'he_grade2_plural': {
      const qs = [
        { s: 'יֶלֶד', p: 'יְלָדִים', hintS: 'כֶּלֶב', hintP: 'כְּלָבִים' },
        { s: 'יַלְדָּה', p: 'יְלָדוֹת', hintS: 'מַחְבֶּרֶת', hintP: 'מַחְבָּרוֹת' },
        { s: 'סֵפֶר', p: 'סְפָרִים', hintS: 'עֵץ', hintP: 'עֵצִים' },
        { s: 'מַחְבֶּרֶת', p: 'מַחְבָּרוֹת', hintS: 'יַלְדָּה', hintP: 'יְלָדוֹת' },
        { s: 'כֶּלֶב', p: 'כְּלָבִים', hintS: 'יֶלֶד', hintP: 'יְלָדִים' },
        { s: 'חָתוּל', p: 'חֲתוּלִים', hintS: 'פֶּרַח', hintP: 'פְּרָחִים' },
        { s: 'עֵץ', p: 'עֵצִים', hintS: 'סֵפֶר', hintP: 'סְפָרִים' },
        { s: 'פֶּרַח', p: 'פְּרָחִים', hintS: 'חָתוּל', hintP: 'חֲתוּלִים' },
        { s: 'כִּסֵּא', p: 'כִּסְאוֹת', hintS: 'שֻׁלְחָן', hintP: 'שֻׁלְחָנוֹת' },
        { s: 'שֻׁלְחָן', p: 'שֻׁלְחָנוֹת', hintS: 'כִּסֵּא', hintP: 'כִּסְאוֹת' },
      ];
      return qs.map(q => {
        const askPlural = Math.random() > 0.5;
        if (askPlural) {
          return { questionDisplay: `מָה הָרַבִּים שֶׁל: ${q.s}?`, correctAnswer: q.p, hintExample: `${q.hintS} ➔ ${q.hintP}` };
        } else {
          return { questionDisplay: `מָה הַיָּחִיד שֶׁל: ${q.p}?`, correctAnswer: q.s, hintExample: `${q.hintP} ➔ ${q.hintS}` };
        }
      });
    }
    default: return [];
  }
}

export function getAllHebrewMultiSelect(targetDataId: string): import('./englishCurriculum').MultiSelectQuestion[] {
  switch (targetDataId) {
    case 'he_grade2_root': {
      const roots = [
        { 
          display: 'שׁ-מ-ר', 
          correct: ['שׁוֹמֵר', 'מִשְׁמָר', 'שְׁמִירָה', 'שָׁמוּר'], 
          distractors: ['מְשׁוֹרֵר', 'נִשְׁבַּר', 'זָמַר', 'מַשְׁבֵּר'] 
        },
        { 
          display: 'כ-ת-ב', 
          correct: ['כּוֹתֵב', 'מִכְתָּב', 'כְּתִיבָה', 'כַּתָּבָה'], 
          distractors: ['רַכֶּבֶת', 'כּוֹכָב', 'מַכְתֵּשׁ', 'מַכָּה'] 
        },
        { 
          display: 'ס-פ-ר', 
          correct: ['סִפּוּר', 'סֵפֶר', 'מִסְפָּרָה', 'סוֹפֵר'], 
          distractors: ['סוֹפָה', 'מִסְפַּר', 'סֶרֶט', 'פַּרְפַּר'] 
        },
        { 
          display: 'שׁ-ח-ק', 
          correct: ['מִשְׂחָק', 'שַׂחְקָן', 'מְשַׂחֵק', 'שִׂחֵק'], 
          distractors: ['צְחוֹק', 'חָזָק', 'שֶׁקֶר', 'מָתוֹק'] 
        },
      ];
      
      return roots.map(r => {
        // We present 6 options: 3 correct, 3 wrong
        const correctOptions = [...r.correct].sort(() => Math.random() - 0.5).slice(0, 3);
        const distractorsOptions = [...r.distractors].sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [...correctOptions, ...distractorsOptions].sort(() => Math.random() - 0.5);
        return {
          questionDisplay: `מִצְאוּ וְסַמְּנוּ אֶת מִלּוֹת הַמִּשְׁפָּחָה. \n(שׁוֹרֶשׁ: ${r.display})`,
          options,
          correctAnswers: correctOptions
        };
      });
    }
    default: return [];
  }
}

