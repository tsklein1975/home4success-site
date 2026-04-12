export type SubjectType = 'hebrew' | 'english' | 'math';
export type GradeType = 1 | 2 | 3 | 4 | 5 | 6;
export type GameType = 'tracing' | 'memory' | 'multiple-choice' | 'ordering' | 'reading' | 'math' | 'math-numpad' | 'scramble' | 'canvas-tracing' | 'notebook-tracing' | 'sorting' | 'typing' | 'multi-select' | 'inline-select' | 'clock' | 'math-word-mc';

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: GameType;
  targetDataId: string; // The ID of the specific curriculum payload to load
  lang: 'he' | 'en';
  subject?: SubjectType;
}

export type Catalog = Record<SubjectType, Record<GradeType, GameDefinition[]>>;

export const interactiveCatalog: Catalog = {
  hebrew: {
    1: [
      { id: 'he_1_1', title: 'צְלִיל פּוֹתֵחַ', subtitle: 'בְּאֵיזוֹ אוֹת מַתְחִילָה הַמִּלָּה?', icon: '🔊', type: 'multiple-choice', targetDataId: 'he_grade1_beginning_sound', lang: 'he' },
      { id: 'he_1_2', title: 'מִשְׂחַק זִכָּרוֹן', subtitle: 'מִצְאוּ אֶת הַזּוּגוֹת (מַתְחִילִים / מִתְקַדְּמִים)', icon: '🧠', type: 'memory', targetDataId: 'he_grade1_memory', lang: 'he' },
      { id: 'he_1_3', title: 'הַתְאָמַת תְּמוּנָה', subtitle: 'אֵיזוֹ תְּמוּנָה מַתְחִילָה בָּאוֹת?', icon: '🧩', type: 'multiple-choice', targetDataId: 'he_grade1_match', lang: 'he' },
      { id: 'he_1_7', title: 'מַחְבֶּרֶת כְּתִיבָה', subtitle: 'מִתְרַגְּלִים כְּתִיבָה בַּמַּחְבֶּרֶת', icon: '📓', type: 'notebook-tracing', targetDataId: 'base_hebrew_letters', lang: 'he' },
      { id: 'he_1_5', title: 'סֵדֶר הָא"ב', subtitle: 'הַשְׁלִימוּ אֶת הָאוֹתִיּוֹת הַחֲסֵרוֹת', icon: '📏', type: 'sorting', targetDataId: 'he_grade1_ordering', lang: 'he' },
      { id: 'he_1_6', title: 'אוֹתִיּוֹת מְבֻלְבָּלוֹת', subtitle: 'סַדְּרוּ אֶת הָאוֹתִיּוֹת לַמִּלָּה', icon: '🔀', type: 'scramble', targetDataId: 'he_grade1_scramble', lang: 'he' },
      { id: 'he_1_8', title: 'אוֹת חֲסֵרָה', subtitle: 'הַשְׁלִימוּ אֶת הָאוֹת הַחֲסֵרָה', icon: '🔍', type: 'multiple-choice', targetDataId: 'he_grade1_spelling', lang: 'he' },
      { id: 'he_1_9', title: 'יוֹצֵא דּוֹפֶן', subtitle: 'מִצְאוּ אֶת הַפְּרִיט הַלֹּא שַׁיָּךְ', icon: '❌', type: 'multiple-choice', targetDataId: 'he_grade1_oddone', lang: 'he' },
      { id: 'he_1_10', title: 'בּוֹנֵה הַמִּשְׁפָּטִים', subtitle: 'סַדְּרוּ אֶת הַמִּלִּים לְמִשְׁפָּט', icon: '🏗️', type: 'ordering', targetDataId: 'he_grade1_sentence_build', lang: 'he' }
    ],
    2: [
      { id: 'he_2_2', title: 'הַשְׁלָמַת מִשְׁפָּטִים', subtitle: 'בַּחֲרוּ אֶת הַמִּלָּה הַחֲסֵרָה', icon: '📝', type: 'multiple-choice', targetDataId: 'he_grade2_sentence', lang: 'he' },
      { id: 'he_2_3', title: 'הֲבָנַת הַנִּקְרָא', subtitle: 'קִרְאוּ קֶטַע קָצָר וַעֲנוּ', icon: '📚', type: 'reading', targetDataId: 'he_grade3_reading', lang: 'he' },
      { id: 'he_2_5', title: 'סֵדֶר הָא"ב', subtitle: 'מְסַדְּרִים אֶת הַמִּלִּים', icon: '📏', type: 'ordering', targetDataId: 'he_grade2_abc_sort', lang: 'he' },
      { id: 'he_2_6', title: 'נְקוּדָה אוֹ סִימַן שְׁאֵלָה?', subtitle: 'בּוֹחֲרִים סִימָן פִּסּוּק', icon: '❓', type: 'inline-select', targetDataId: 'he_grade2_punctuation', lang: 'he' },
      { id: 'he_2_7', title: 'יָחִיד וְרַבִּים', subtitle: 'מַקְלִידִים אֶת הַתְּשׁוּבָה', icon: '⌨️', type: 'typing', targetDataId: 'he_grade2_plural', lang: 'he' },
      { id: 'he_2_8', title: 'זָכָר אוֹ נְקֵבָה', subtitle: 'מַהוּ הַמִּין הַנָּכוֹן?', icon: '⚧️', type: 'multiple-choice', targetDataId: 'he_grade2_gender', lang: 'he' },
      { id: 'he_2_9', title: 'מִלִּים מֵאוֹתוֹ שׁוֹרֶשׁ', subtitle: 'מְסַמְּנִים מִלִּים קְרוֹבוֹת', icon: '🌱', type: 'multi-select', targetDataId: 'he_grade2_root', lang: 'he' },
      { id: 'he_2_10', title: 'הֲפָכִים', subtitle: 'מִצְאוּ אֶת מְצוּמַד הַהֲפָכִים', icon: '↔️', type: 'multiple-choice', targetDataId: 'he_grade2_opposites_pairs', lang: 'he' }
    ],
    3: [
      { id: 'he_3_1', title: 'מִלָּה לַתְּמוּנָה', subtitle: 'קִרְאוּ וְהַתְאִימוּ', icon: '📖', type: 'multiple-choice', targetDataId: 'he_grade3_word_match', lang: 'he' }
    ],
    4: [
      { id: 'he_4_1', title: 'הבנת הנקרא מתקדמת', subtitle: 'קריאה וידע', icon: '🔍', type: 'reading', targetDataId: 'he_grade4_reading', lang: 'he' },
      { id: 'he_4_2', title: 'בונה המשפטים', subtitle: 'סדרו את המילים למשפט', icon: '🏗️', type: 'ordering', targetDataId: 'he_grade4_sentence_build', lang: 'he' },
      { id: 'he_4_3', title: 'הפכים ומילים נרדפות', subtitle: 'בחרו משמעות', icon: '↔️', type: 'multiple-choice', targetDataId: 'he_grade4_opposites', lang: 'he' }
    ],
    5: [
      { id: 'he_5_1', title: 'קריאה מעמיקה', subtitle: 'טקסטים ארוכים יותר', icon: '📜', type: 'reading', targetDataId: 'he_grade5_reading', lang: 'he' },
      { id: 'he_5_2', title: 'אתגר דקדוק', subtitle: 'גוף, זמנים ושייכות', icon: '🗣️', type: 'multiple-choice', targetDataId: 'he_grade5_grammar', lang: 'he' },
      { id: 'he_5_3', title: 'תיקון שגיאות', subtitle: 'תקנו את המשפט', icon: '🛠️', type: 'multiple-choice', targetDataId: 'he_grade5_repair', lang: 'he' }
    ],
    6: [
      { id: 'he_6_1', title: 'הבנת הנקרא ו׳', subtitle: 'משימות קריאה למתקדמים', icon: '🎓', type: 'reading', targetDataId: 'he_grade6_reading', lang: 'he' },
      { id: 'he_6_2', title: 'סידור פסקאות', subtitle: 'סדרו לפסקה הגיונית', icon: '📋', type: 'ordering', targetDataId: 'he_grade6_paragraph', lang: 'he' },
      { id: 'he_6_3', title: 'אתגר הלשון', subtitle: 'תחביר, אוצר מילים ופיסוק', icon: '🏆', type: 'multiple-choice', targetDataId: 'he_grade6_language', lang: 'he' }
    ]
  },
  english: {
    1: [
      { id: 'en_1_1', title: 'Letter Tracing', subtitle: 'Learn to write uppercase letters', icon: '✍️', type: 'tracing', targetDataId: 'basic_english_letters', lang: 'en' },
      { id: 'en_1_2', title: 'Memory Game', subtitle: 'Match letters to objects', icon: '🧠', type: 'memory', targetDataId: 'en_grade1_memory', lang: 'en' },
      { id: 'en_1_3', title: 'Picture Matcher', subtitle: 'Match letter to correct picture', icon: '🧩', type: 'multiple-choice', targetDataId: 'en_grade1_match', lang: 'en' }
    ],
    2: [
      { id: 'en_2_1', title: 'Advanced Memory', subtitle: 'Bigger memory challenge', icon: '⏱️', type: 'memory', targetDataId: 'en_grade2_memory', lang: 'en' },
      { id: 'en_2_2', title: 'Word Builder', subtitle: 'Drag letters to spell words', icon: '🔠', type: 'ordering', targetDataId: 'en_grade2_wordbuild', lang: 'en' },
      { id: 'en_2_3', title: 'A / An Choice', subtitle: 'Choose correctly', icon: '🍎', type: 'multiple-choice', targetDataId: 'en_grade2_articles', lang: 'en' }
    ],
    3: [
      { id: 'en_3_1', title: 'Vocabulary Match', subtitle: 'Match the word to image', icon: '🖼️', type: 'multiple-choice', targetDataId: 'en_grade3_vocab', lang: 'en' },
      { id: 'en_3_2', title: 'Scramble Builder', subtitle: 'Unscramble the letters', icon: '🔄', type: 'ordering', targetDataId: 'en_grade3_scramble', lang: 'en' },
      { id: 'en_3_3', title: 'Number Words', subtitle: 'Match numbers to words', icon: '1️⃣', type: 'multiple-choice', targetDataId: 'en_grade3_numbers', lang: 'en' }
    ],
    4: [
      { id: 'en_4_1', title: 'Question Words', subtitle: 'Who, what, where, when, why?', icon: '❓', type: 'multiple-choice', targetDataId: 'en_grade4_questions', lang: 'en' },
      { id: 'en_4_2', title: 'Grammar Challenge', subtitle: 'Present tense & pronouns', icon: '🗣️', type: 'multiple-choice', targetDataId: 'en_grade4_grammar', lang: 'en' },
      { id: 'en_4_3', title: 'Reading Basics', subtitle: 'Short stories and questions', icon: '📚', type: 'reading', targetDataId: 'en_grade4_reading', lang: 'en' }
    ],
    5: [
      { id: 'en_5_1', title: 'Vocabulary Master', subtitle: 'Stronger word challenges', icon: '🌟', type: 'multiple-choice', targetDataId: 'en_grade5_vocab', lang: 'en' },
      { id: 'en_5_2', title: 'Sentence Fill', subtitle: 'Fill in missing words', icon: '📝', type: 'multiple-choice', targetDataId: 'en_grade5_fill', lang: 'en' },
      { id: 'en_5_3', title: 'Reading Comprehension', subtitle: 'Read and understand texts', icon: '📖', type: 'reading', targetDataId: 'en_grade5_reading', lang: 'en' }
    ],
    6: [
      { id: 'en_6_1', title: 'Reading Advanced', subtitle: 'Analyze paragraphs', icon: '🎓', type: 'reading', targetDataId: 'en_grade6_reading', lang: 'en' },
      { id: 'en_6_2', title: 'Grammar & Usage', subtitle: 'Advanced vocabulary and tense', icon: '🔧', type: 'multiple-choice', targetDataId: 'en_grade6_grammar', lang: 'en' },
      { id: 'en_6_3', title: 'Vocab in Context', subtitle: 'Understand word meanings', icon: '💡', type: 'multiple-choice', targetDataId: 'en_grade6_context', lang: 'en' }
    ]
  },
  math: {
    1: [
      { id: 'm_1_1', title: 'סִדּוּר מִסְפָּרִים', subtitle: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה', icon: '🔢', type: 'sorting', targetDataId: 'math_1_sequence_20', lang: 'he', subject: 'math' },
      { id: 'm_1_2', title: 'מִסְפָּר עוֹקֵב', subtitle: 'מָה בָּא לִפְנֵי וּמָה בָּא אַחֲרֵי?', icon: '📏', type: 'math-numpad', targetDataId: 'math_1_consecutive', lang: 'he', subject: 'math' },
      { id: 'm_1_3', title: 'הַשְׁלָמָה לְ-10', subtitle: 'תַּרְגִּילֵי הַשְׁלָמָה לְסִכּוּם 10', icon: '➕', type: 'math-numpad', targetDataId: 'math_1_completing_10', lang: 'he', subject: 'math' },
      { id: 'm_1_4', title: 'חֶשְׁבּוֹן עַד 20', subtitle: 'חִבּוּר וְחִסּוּר בִּטְוַח הַ-20', icon: '🧮', type: 'math-numpad', targetDataId: 'math_1_add_sub_20', lang: 'he', subject: 'math' },
      { id: 'm_1_5', title: 'עֲשָׂרוֹת שְׁלֵמוֹת', subtitle: 'תַּרְגִּילֵי חִבּוּר וְחִסּוּר בַּעֲשָׂרוֹת', icon: '💯', type: 'math-numpad', targetDataId: 'math_1_add_sub_100_tens', lang: 'he', subject: 'math' },
      { id: 'm_1_6', title: 'צוּרוֹת הַנְדָּסִיּוֹת', subtitle: 'זַהוּ אֶת הַצּוּרָה הַמַּתְאִימָה', icon: '📐', type: 'multiple-choice', targetDataId: 'math_1_geometry', lang: 'he', subject: 'math' }
    ],
    2: [
      { id: 'm_2_1', title: 'חִבּוּר וְחִסּוּר עַד 100', subtitle: 'תַּרְגִּילִים דּוּ-סִפְרָתִיִּים', icon: '💯', type: 'math-numpad', targetDataId: 'math_2_addsub100', lang: 'he' },
      { id: 'm_2_2', title: 'יְסוֹדוֹת הַכֶּפֶל', subtitle: 'תַּרְגִּילֵי כֶּפֶל חַד סִפְרָתִיִּים', icon: '✖️', type: 'math-numpad', targetDataId: 'math_2_mult_intro', lang: 'he' },
      { id: 'm_2_4', title: 'קְרִיאַת שָׁעוֹן', subtitle: 'כַּוְּנוּ אֶת הַמְּחוֹגִים לַשָּׁעָה הַנְּכוֹנָה', icon: '⏰', type: 'clock', targetDataId: 'math_2_clock_reading', lang: 'he' },
      { id: 'm_2_3', title: 'בְּעָיוֹת מִילּוּלִיּוֹת בְּסִיסִיּוֹת', subtitle: 'קִרְאוּ וּפִתְרוּ אֶת הַבְּעָיָה', icon: '🤔', type: 'math-word-mc', targetDataId: 'math_2_word', lang: 'he' }
    ],
    3: [
      { id: 'm_3_1', title: 'לוח הכפל וחילוק', subtitle: 'תרגול עובדות היסוד', icon: '➗', type: 'math-numpad', targetDataId: 'math_3_multdiv', lang: 'he' },
      { id: 'm_3_2', title: 'סדר פעולות', subtitle: 'חשבון עם סוגריים', icon: '🧮', type: 'math-numpad', targetDataId: 'math_3_order', lang: 'he' },
      { id: 'm_3_3', title: 'שברים פשוטים', subtitle: 'חצאים, רבעים ושלישים', icon: '🍕', type: 'multiple-choice', targetDataId: 'math_3_fractions', lang: 'he' }
    ],
    4: [
      { id: 'm_4_1', title: 'אסטרטגיות חילוק', subtitle: 'תרגילי חילוק ארוך', icon: '📉', type: 'math-numpad', targetDataId: 'math_4_longdiv', lang: 'he' },
      { id: 'm_4_2', title: 'פעולות רב-שלביות', subtitle: 'שילובי כפל, חיבור וחיסור', icon: '🔄', type: 'math-numpad', targetDataId: 'math_4_multistep', lang: 'he' },
      { id: 'm_4_3', title: 'זמן ומדידה', subtitle: 'קריאת שעון ולוחות זמנים', icon: '⏰', type: 'multiple-choice', targetDataId: 'math_4_time', lang: 'he' }
    ],
    5: [
      { id: 'm_5_1', title: 'מבצעים שברים', subtitle: 'חיבור וחיסור שברים', icon: '🍰', type: 'multiple-choice', targetDataId: 'math_5_frac_ops', lang: 'he' },
      { id: 'm_5_2', title: 'עשרוניים ומקום הערך', subtitle: 'עשיריות ומאיות', icon: '🔢', type: 'multiple-choice', targetDataId: 'math_5_decimals', lang: 'he' },
      { id: 'm_5_3', title: 'בעיות מילוליות שלביות', subtitle: 'אתגרי חשיבה דו-שלביים', icon: '🧩', type: 'multiple-choice', targetDataId: 'math_5_multistep_word', lang: 'he' }
    ],
    6: [
      { id: 'm_6_1', title: 'אחוזים', subtitle: 'חישובי אחוז מכמות', icon: '📊', type: 'math-numpad', targetDataId: 'math_6_percentages', lang: 'he' },
      { id: 'm_6_2', title: 'יחס ושברים עשרוניים', subtitle: 'המרה ופירוש יחסים', icon: '⚖️', type: 'multiple-choice', targetDataId: 'math_6_ratios', lang: 'he' },
      { id: 'm_6_3', title: 'ביטויים אלגבריים', subtitle: 'פתרון נעלמים בסיסי', icon: '𝔁', type: 'math-numpad', targetDataId: 'math_6_algebra', lang: 'he' }
    ]
  }
};
