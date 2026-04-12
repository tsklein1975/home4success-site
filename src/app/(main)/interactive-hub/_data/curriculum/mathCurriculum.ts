import { MathQuestionData } from './mathGenerators';

export interface SortingQuestion {
  instruction: string;
  items: string[];
  blankedIndices: number[];
}

export interface MathMCQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  icon?: string;
}

export interface ClockQuestion {
  targetTime: string; // "HH:MM"
  instruction: string;
}

export interface MathWordMCQuestion {
  passage: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

export function getAllMathG1Sorting(targetDataId: string): SortingQuestion[] {
  switch (targetDataId) {
    case 'math_1_sequence_20': {
      return [
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['1', '2', '3', '4', '5'], blankedIndices: [1, 3] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['6', '7', '8', '9', '10'], blankedIndices: [0, 2, 4] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['11', '12', '13', '14', '15'], blankedIndices: [1, 2] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['16', '17', '18', '19', '20'], blankedIndices: [0, 1, 4] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['3', '4', '5', '6', '7'], blankedIndices: [2, 4] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['9', '10', '11', '12', '13'], blankedIndices: [0, 3] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['13', '14', '15', '16', '17'], blankedIndices: [1, 4] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['5', '6', '7', '8', '9'], blankedIndices: [0, 1, 2] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['2', '3', '4', '5', '6'], blankedIndices: [1, 3] },
        { instruction: 'סַדְּרוּ אֶת הַמִּסְפָּרִים בְּסֵדֶר עוֹלֶה:', items: ['15', '16', '17', '18', '19'], blankedIndices: [2, 3] },
      ];
    }
    default: return [];
  }
}

export function getAllMathG1MC(targetDataId: string): MathMCQuestion[] {
  if (targetDataId === 'math_1_geometry') {
    return [
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['עִגּוּל', 'רִבּוּעַ', 'מְשֻׁלָּשׁ', 'מַלְבֵּן'], correctAnswer: 'עִגּוּל', icon: 'circle' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['רִבּוּעַ', 'מַלְבֵּן', 'מְעֻיָּן', 'עִגּוּל'], correctAnswer: 'רִבּוּעַ', icon: 'square' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['מְשֻׁלָּשׁ', 'רִבּוּעַ', 'עִגּוּל', 'מְשֻׁשֶּׁה'], correctAnswer: 'מְשֻׁלָּשׁ', icon: 'triangle' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['מַלְבֵּן', 'עִגּוּל', 'רִבּוּעַ', 'מְשֻׁלָּשׁ'], correctAnswer: 'מַלְבֵּן', icon: 'rectangle' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['מְעֻיָּן', 'רִבּוּעַ', 'עִגּוּל', 'מְחֻמָּשׁ'], correctAnswer: 'מְעֻיָּן', icon: 'diamond' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['טְרַפֵּז', 'מַלְבֵּן', 'רִבּוּעַ', 'עִגּוּל'], correctAnswer: 'טְרַפֵּז', icon: 'trapezoid' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['מְחֻמָּשׁ', 'מְשֻׁשֶּׁה', 'רִבּוּעַ', 'מְשֻׁלָּשׁ'], correctAnswer: 'מְחֻמָּשׁ', icon: 'pentagon' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['מְשֻׁשֶּׁה', 'מְחֻמָּשׁ', 'רִבּוּעַ', 'עִגּוּל'], correctAnswer: 'מְשֻׁשֶּׁה', icon: 'hexagon' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['רִבּוּעַ', 'מְעֻיָּן', 'טְרַפֵּז', 'מְשֻׁלָּשׁ'], correctAnswer: 'רִבּוּעַ', icon: 'square' },
      { question: 'אֵיזוֹ צוּרָה זוֹ?', options: ['עִגּוּל', 'מַלְבֵּן', 'רִבּוּעַ', 'מְשֻׁלָּשׁ'], correctAnswer: 'עִגּוּל', icon: 'circle' },
    ];
  }
  return [];
}

export function getAllMathG2Clock(): ClockQuestion[] {
  return [
    { targetTime: '03:00', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 03:00' },
    { targetTime: '06:30', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 06:30' },
    { targetTime: '12:00', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 12:00' },
    { targetTime: '09:15', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 09:15' },
    { targetTime: '10:45', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 10:45' },
    { targetTime: '01:20', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 01:20' },
    { targetTime: '04:50', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 04:50' },
    { targetTime: '07:05', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 07:05' },
    { targetTime: '11:10', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 11:10' },
    { targetTime: '08:25', instruction: 'כַּוְּנוּ אֶת הַשָּׁעוֹן לַשָּׁעָה: 08:25' },
  ];
}

export function getAllMathG1Numpad(targetDataId: string): MathQuestionData[] {
  switch (targetDataId) {
    case 'math_1_consecutive': {
      return [
        { equation: '9', correctAnswer: 9, correctAnswers: [8, 10], type: 'consecutive' },
        { equation: '15', correctAnswer: 15, correctAnswers: [14, 16], type: 'consecutive' },
        { equation: '2', correctAnswer: 2, correctAnswers: [1, 3], type: 'consecutive' },
        { equation: '12', correctAnswer: 12, correctAnswers: [11, 13], type: 'consecutive' },
        { equation: '20', correctAnswer: 20, correctAnswers: [19, 21], type: 'consecutive' },
        { equation: '5', correctAnswer: 5, correctAnswers: [4, 6], type: 'consecutive' },
        { equation: '18', correctAnswer: 18, correctAnswers: [17, 19], type: 'consecutive' },
        { equation: '7', correctAnswer: 7, correctAnswers: [6, 8], type: 'consecutive' },
        { equation: '13', correctAnswer: 13, correctAnswers: [12, 14], type: 'consecutive' },
        { equation: '3', correctAnswer: 3, correctAnswers: [2, 4], type: 'consecutive' },
      ];
    }
    case 'math_1_completing_10': {
      return [
        { equation: '7 + __ = 10', correctAnswer: 3 },
        { equation: '5 + __ = 10', correctAnswer: 5 },
        { equation: '2 + __ = 10', correctAnswer: 8 },
        { equation: '9 + __ = 10', correctAnswer: 1 },
        { equation: '6 + __ = 10', correctAnswer: 4 },
        { equation: '4 + __ = 10', correctAnswer: 6 },
        { equation: '1 + __ = 10', correctAnswer: 9 },
        { equation: '8 + __ = 10', correctAnswer: 2 },
        { equation: '3 + __ = 10', correctAnswer: 7 },
        { equation: '10 + __ = 10', correctAnswer: 0 },
      ];
    }
    case 'math_1_add_sub_20': {
      return [
        { equation: '5 + 7 = ?', correctAnswer: 12 },
        { equation: '12 + 4 = ?', correctAnswer: 16 },
        { equation: '15 - 6 = ?', correctAnswer: 9 },
        { equation: '9 + 8 = ?', correctAnswer: 17 },
        { equation: '20 - 5 = ?', correctAnswer: 15 },
        { equation: '11 + 3 = ?', correctAnswer: 14 },
        { equation: '18 - 9 = ?', correctAnswer: 9 },
        { equation: '7 + 6 = ?', correctAnswer: 13 },
        { equation: '14 - 8 = ?', correctAnswer: 6 },
        { equation: '13 + 5 = ?', correctAnswer: 18 },
      ];
    }
    case 'math_1_add_sub_100_tens': {
      return [
        { equation: '20 + 30 = ?', correctAnswer: 50 },
        { equation: '70 - 40 = ?', correctAnswer: 30 },
        { equation: '50 + 50 = ?', correctAnswer: 100 },
        { equation: '90 - 20 = ?', correctAnswer: 70 },
        { equation: '10 + 60 = ?', correctAnswer: 70 },
        { equation: '80 - 50 = ?', correctAnswer: 30 },
        { equation: '40 + 40 = ?', correctAnswer: 80 },
        { equation: '60 - 10 = ?', correctAnswer: 50 },
        { equation: '30 + 60 = ?', correctAnswer: 90 },
        { equation: '100 - 30 = ?', correctAnswer: 70 },
      ];
    }
    case 'math_2_mult_intro': {
      return [
        { equation: '2 × 3 = ?', correctAnswer: 6 },
        { equation: '5 × 4 = ?', correctAnswer: 20 },
        { equation: '6 × 0 = ?', correctAnswer: 0 },
        { equation: '1 × 5 = ?', correctAnswer: 5 },
        { equation: '4 × 4 = ?', correctAnswer: 16 },
        { equation: '3 × 6 = ?', correctAnswer: 18 },
        { equation: '0 × 2 = ?', correctAnswer: 0 },
        { equation: '5 × 5 = ?', correctAnswer: 25 },
        { equation: '6 × 1 = ?', correctAnswer: 6 },
        { equation: '4 × 2 = ?', correctAnswer: 8 },
      ];
    }
    case 'math_2_word': {
      return [
        { equation: 'לְרוֹנִי יֵשׁ 45 מַמְתַּקִּים. הִיא נָתְנָה 12 לַחֲבֶרְתָּהּ. כַּמָּה מַמְתַּקִּים נֳשְׁאֲרוּ לָהּ?', correctAnswer: 33 },
        { equation: 'בַּחֲנִיָּה חָנוּ 28 מְכוֹנִיּוֹת. נִכְנְסוּ עוֹד 15 מְכוֹנִיּוֹת. כַּמָּה מְכוֹנִיּוֹת יֵשׁ עַכְשָׁו בַּחֲנִיָּה?', correctAnswer: 43 },
        { equation: 'בְּסַל אֶחָד יֵשׁ 20 תַּפּוּחִים וּבַסַּל הַשֵּׁנִי 30 תַּפּוּחִים. כַּמָּה תַּפּוּחִים יֵשׁ בִּשְׁנֵי הַסַּלִּים?', correctAnswer: 50 },
        { equation: 'לְאִמָּא הָיוּ 60 שְׁקָלִים. הִיא קָנְתָה לֶחֶם בְּ-10 שְׁקָלִים. כַּמָּה כֶּסֶף נִשְׁאַר לָהּ?', correctAnswer: 50 },
        { equation: 'בְּמִגְרַשׁ הַמִּשְׂחָקִים הָיוּ 35 יְלָדִים. 7 יְלָדִים הָלְכוּ הַבַּיְתָה. כַּמָּה יְלָדִים נֳִשְׁאֲרוּ?', correctAnswer: 28 },
        { equation: 'בְּעוּגָה יֵשׁ 12 פְּרוּסוֹת. דָּנִי אָכַל 2 פְּרוּסוֹת וְשִׁירָה אָכְלָה פְּרוּסָה אַחַת. כַּמָּה פְּרוּסוֹת נִשְׁאֲרוּ?', correctAnswer: 9 },
        { equation: 'בַּקְּלָסֵר יֵשׁ 50 דַּפִּים. הִשְׁתַּמַּשְׁתִּי בְּ-25 דַּפִּים. כַּמָּה דַּפִּים נֳִשְׁאֲרוּ?', correctAnswer: 25 },
        { equation: 'בַּחַוָּה יֵשׁ 22 כְּבָשִׂים וְ-18 עִזִּים. כַּמָּה חַיוֹת יֵשׁ בְּסַךְ הַכֹּל?', correctAnswer: 40 },
        { equation: 'לְגַלִּית יֵשׁ 15 בֻּבּוֹת. הִיא קִבְּלָה עוֹד 15 לַיּוֹמּוּלֶדֶת. כַּמָּה בֻּבּוֹת יֵשׁ לָהּ עַכְשָׁו?', correctAnswer: 30 },
        { equation: 'בַּכִּתָּה יֵשׁ 25 תַּלְמִידִים. 5 תַּלְמִידִים יָצְאוּ לַחָצֵר. כַּמָּה תַּלְמִידִים נֳִשְׁאֲרוּ בַּכִּתָּה?', correctAnswer: 20 },
      ];
    }
    default: return [];
  }
}

export function getAllMathG2WordMC(): MathWordMCQuestion[] {
  return [
    {
      passage: 'לְרוֹנִי יֵשׁ 45 מַמְתַּקִּים. הִיא נָתְנָה 12 לַחֲבֶרְתָּהּ.',
      question: 'כַּמָּה מַמְתַּקִּים נֳשְׁאֲרוּ לָהּ?',
      correctAnswer: '33',
      options: ['33', '57', '35', '43']
    },
    {
      passage: 'בַּחֲנִיָּה חָנוּ 28 מְכוֹנִיּוֹת. נִכְנְסוּ עוֹד 15 מְכוֹנִיּוֹת.',
      question: 'כַּמָּה מְכוֹנִיּוֹת יֵשׁ עַכְשָׁו בַּחֲנִיָּה?',
      correctAnswer: '43',
      options: ['43', '33', '45', '38']
    },
    {
      passage: 'בְּסַל אֶחָד יֵשׁ 20 תַּפּוּחִים וּבַסַּל הַשֵּׁנִי 30 תַּפּוּחִים.',
      question: 'כַּמָּה תַּפּוּחִים יֵשׁ בִּשְׁנֵי הַסַּלִּים?',
      correctAnswer: '50',
      options: ['50', '40', '60', '10']
    },
    {
      passage: 'לְאִמָּא הָיוּ 60 שְׁקָלִים. הִיא קָנְתָה לֶחֶם בְּ-10 שְׁקָלִים.',
      question: 'כַּמָּה כֶּסֶף נִשְׁאַר לָהּ?',
      correctAnswer: '50',
      options: ['50', '70', '40', '60']
    },
    {
      passage: 'בְּמִגְרַשׁ הַמִּשְׂחָקִים הָיוּ 35 יְלָדִים. 7 יְלָדִים הָלְכוּ הַבַּיְתָה.',
      question: 'כַּמָּה יְלָדִים נֳִשְׁאֲרוּ?',
      correctAnswer: '28',
      options: ['28', '42', '32', '25']
    },
    {
      passage: 'בְּעוּגָה יֵשׁ 12 פְּרוּסוֹת. דָּנִי אָכַל 2 פְּרוּסוֹת וְשִׁירָה אָכְלָה פְּרוּסָה אַחַת.',
      question: 'כַּמָּה פְּרוּסוֹת נִשְׁאֲרוּ?',
      correctAnswer: '9',
      options: ['9', '10', '11', '8']
    },
    {
      passage: 'בַּקְּלָסֵר יֵשׁ 50 דַּפִּים. הִשְׁתַּמַּשְׁתִּי בְּ-25 דַּפִּים.',
      question: 'כַּמָּה דַּפִּים נֳִשְׁאֲרוּ?',
      correctAnswer: '25',
      options: ['25', '35', '15', '75']
    },
    {
      passage: 'בַּחַוָּה יֵשׁ 22 כְּבָשִׂים וְ-18 עִזִּים.',
      question: 'כַּמָּה חַיוֹת יֵשׁ בְּסַךְ הַכֹּל?',
      correctAnswer: '40',
      options: ['40', '30', '50', '44']
    },
    {
      passage: 'לְגַלִּית יֵשׁ 15 בֻּבּוֹת. הִיא קִבְּלָה עוֹד 15 לַיּוֹמּוּלֶדֶת.',
      question: 'כַּמָּה בֻּבּוֹת יֵשׁ לָהּ עַכְשָׁו?',
      correctAnswer: '30',
      options: ['30', '15', '25', '45']
    },
    {
      passage: 'בַּכִּתָּה יֵשׁ 25 תַּלְמִידִים. 5 תַּלְמִידִים יָצְאוּ לַחָצֵר.',
      question: 'כַּמָּה תַּלְמִידִים נֳִשְׁאֲרוּ בַּכִּתָּה?',
      correctAnswer: '20',
      options: ['20', '30', '15', '24']
    }
  ];
}

